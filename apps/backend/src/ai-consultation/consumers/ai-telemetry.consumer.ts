import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Consumer, Kafka } from "kafkajs";
import OpenAI from "openai";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { executeWithRetryDlq, type RetryDlqConfig } from "../../kafka/consumers/retry-dlq.utils";
import { KAFKA_CLIENT } from "../../kafka/kafka.constants";
import { KafkaProducerService } from "../../kafka/kafka-producer.service";
import {
  TELEMETRY_SUMMARIZATION_MODEL,
  TELEMETRY_TITLE_MAX_TOKENS,
  TELEMETRY_TITLE_PROMPT,
  TOPIC_AI_TELEMETRY,
  TOPIC_AI_TELEMETRY_DLQ,
} from "../constants/telemetry.constants";

/**
 * Kafka payload shape dispatched by AvalAiService after streaming.
 */
interface AiTelemetryPayload {
  sessionId: string;
  lastUserMessage: string;
  totalTurnCount: number;
}

/**
 * AI Telemetry Kafka Consumer — Background Session Analysis.
 *
 * Processes fire-and-forget telemetry events dispatched after each
 * AI consultation response completes. Runs entirely in the background
 * without adding latency to the live user stream.
 *
 * Responsibilities:
 * 1. Generate a concise Persian session title via lightweight LLM call
 * 2. Update ai_chat_sessions.title in the database
 * 3. (Future) Extract intent/sentiment metadata for analytics
 *
 * Resilience: 3 retries with exponential backoff → DLQ offload.
 */
@Injectable()
export class AiTelemetryConsumer {
  private readonly logger = new Logger(AiTelemetryConsumer.name);
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
    this.consumer = this.kafka.consumer({
      groupId: `${groupId}-ai-telemetry`,
    });

    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("AVALAI_API_KEY", ""),
      baseURL: this.configService.get<string>("AVALAI_BASE_URL", "https://api.avalai.ir/v1"),
    });

    this.retryConfig = {
      maxRetries: 3,
      baseDelayMs: 1000,
      dlqTopic: TOPIC_AI_TELEMETRY_DLQ,
      alertWebhookUrl: this.configService.get<string>("N8N_ALERT_WEBHOOK_URL", ""),
      logger: this.logger,
      producer: this.kafkaProducer,
    };
  }

  async start(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: TOPIC_AI_TELEMETRY,
        fromBeginning: false,
      });

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

      this.logger.log("AI telemetry consumer started");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`AI telemetry consumer start failed: ${msg}`);
    }
  }

  async stop(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.logger.log("AI telemetry consumer stopped");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`AI telemetry consumer stop error: ${msg}`);
    }
  }

  private async processMessage(rawValue: string): Promise<void> {
    if (!rawValue) return;
    const payload: AiTelemetryPayload = JSON.parse(rawValue);

    if (!payload.sessionId || payload.sessionId === "anonymous") {
      // Skip telemetry for anonymous/unauthenticated sessions
      return;
    }

    // Check if session already has a title — only generate on first exchange
    const existing = await this.db.execute<{ title: string | null }>(sql`
      SELECT title FROM ai_chat_sessions WHERE id = ${payload.sessionId} LIMIT 1
    `);

    if (existing.rows[0]?.title) return; // Title already set

    // Fetch assistant response from database
    const assistantResult = await this.db.execute<{ content: string }>(sql`
      SELECT content FROM ai_chat_messages
      WHERE session_id = ${payload.sessionId} AND sender = 'assistant'
      ORDER BY created_at DESC
      LIMIT 1
    `);
    const assistantResponse = assistantResult.rows[0]?.content ?? "";

    // Generate a concise session title via lightweight LLM
    const title = await this.generateSessionTitle(payload.lastUserMessage, assistantResponse);

    if (!title) return;

    // Update the session title atomically
    await this.db.execute(sql`
      UPDATE ai_chat_sessions
      SET title = ${title}, updated_at = NOW()
      WHERE id = ${payload.sessionId} AND title IS NULL
    `);

    this.logger.debug(`Session ${payload.sessionId} titled: "${title.slice(0, 40)}"`);
  }

  /**
   * Generate a concise Persian session title from the first exchange.
   */
  private async generateSessionTitle(
    userMessage: string,
    assistantResponse: string,
  ): Promise<string | null> {
    try {
      const conversationSnippet = [
        `کاربر: ${userMessage.slice(0, 200)}`,
        `مشاور: ${assistantResponse.slice(0, 200)}`,
      ].join("\n");

      const response = await this.openai.chat.completions.create({
        model: TELEMETRY_SUMMARIZATION_MODEL,
        max_tokens: TELEMETRY_TITLE_MAX_TOKENS,
        temperature: 0.4,
        messages: [
          { role: "system", content: TELEMETRY_TITLE_PROMPT },
          { role: "user", content: conversationSnippet },
        ],
      });

      const title = response.choices[0]?.message?.content?.trim();
      return title && title.length > 0 ? title : null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Title generation failed: ${msg}`);
      return null;
    }
  }
}
