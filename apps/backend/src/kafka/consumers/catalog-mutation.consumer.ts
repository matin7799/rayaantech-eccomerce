import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Consumer, Kafka } from "kafkajs";
import OpenAI from "openai";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { normalizePersianText } from "../../voice-ai/utils/normalize-persian";
import { KAFKA_CLIENT, TOPIC_CATALOG_MUTATION } from "../kafka.constants";
import { KafkaProducerService } from "../kafka-producer.service";
import { executeWithRetryDlq, type RetryDlqConfig } from "./retry-dlq.utils";

interface CatalogMutationPayload {
  productId: string;
  action: "created" | "updated" | "deleted";
}

interface ProductEmbeddingRow extends Record<string, unknown> {
  id: string;
  name: string;
  description: string | null;
}

/**
 * Kafka consumer for catalog mutation events with retry + DLQ.
 *
 * On product create/update: regenerates pgvector embedding via OpenAI.
 * On product delete: nullifies embedding column.
 * Retry policy: 3 attempts with exponential backoff → DLQ offload.
 */
@Injectable()
export class CatalogMutationConsumer {
  private readonly logger = new Logger(CatalogMutationConsumer.name);
  private readonly consumer: Consumer;
  private readonly openai: OpenAI;
  private readonly retryConfig: RetryDlqConfig;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(KafkaProducerService)
    private readonly kafkaProducer: KafkaProducerService,
  ) {
    const groupId = this.configService.get<string>("KAFKA_GROUP_ID", "rayan-tech-workers");
    this.consumer = this.kafka.consumer({ groupId: `${groupId}-catalog` });
    // Embedding generation runs through AvalAI's OpenAI-compatible gateway —
    // reachable from Iranian servers directly, no outbound proxy required.
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("AVALAI_API_KEY", ""),
      baseURL: this.configService.get<string>("AVALAI_BASE_URL", "https://api.avalai.ir/v1"),
    });

    this.retryConfig = {
      maxRetries: 3,
      baseDelayMs: 1000,
      dlqTopic: "catalog.mutation.dlq",
      alertWebhookUrl: this.configService.get<string>("N8N_ALERT_WEBHOOK_URL", ""),
      logger: this.logger,
      producer: this.kafkaProducer,
    };
  }

  async start(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: TOPIC_CATALOG_MUTATION, fromBeginning: false });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const rawValue = message.value?.toString() ?? "";
          const messageKey = message.key?.toString() ?? "unknown";

          await executeWithRetryDlq(
            () => this.processMessage(rawValue),
            rawValue,
            messageKey,
            this.retryConfig,
          );
        },
      });

      this.logger.log("Catalog mutation consumer started (with DLQ resilience)");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Catalog consumer start failed: ${msg}`);
    }
  }

  async stop(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.logger.log("Catalog mutation consumer stopped");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Catalog consumer stop error: ${msg}`);
    }
  }

  private async processMessage(rawValue: string): Promise<void> {
    if (!rawValue) return;
    const payload: CatalogMutationPayload = JSON.parse(rawValue);

    if (!(payload.productId && payload.action)) {
      this.logger.warn("Catalog mutation missing required fields");
      return;
    }

    if (payload.action === "deleted") {
      await this.nullifyEmbedding(payload.productId);
    } else {
      await this.regenerateEmbedding(payload.productId);
    }
  }

  private async regenerateEmbedding(productId: string): Promise<void> {
    const result = await this.db.execute<ProductEmbeddingRow>(sql`
      SELECT id, name, description FROM products WHERE id = ${productId} LIMIT 1
    `);

    const product = result.rows[0];
    if (!product) {
      this.logger.warn(`Product ${productId} not found for embedding regen`);
      return;
    }

    const rawText = [product.name, product.description ?? ""].join(" ").trim();
    const normalizedText = normalizePersianText(rawText);
    if (normalizedText.length === 0) return;

    const embeddingResponse = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: normalizedText,
    });

    const vector = `[${embeddingResponse.data[0].embedding.join(",")}]`;
    await this.db.execute(sql`
      UPDATE products SET embedding = ${vector}::vector, updated_at = NOW()
      WHERE id = ${productId}
    `);

    this.logger.debug(`Embedding regenerated for product ${productId}`);
  }

  private async nullifyEmbedding(productId: string): Promise<void> {
    await this.db.execute(sql`
      UPDATE products SET embedding = NULL, updated_at = NOW() WHERE id = ${productId}
    `);
    this.logger.debug(`Embedding nullified for product ${productId}`);
  }
}
