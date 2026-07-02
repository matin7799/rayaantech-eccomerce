import {
  Global,
  Inject,
  Logger,
  Module,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kafka, logLevel } from "kafkajs";
import { TOPIC_AI_TELEMETRY } from "../ai-consultation/constants/telemetry.constants";
import { AiTelemetryConsumer } from "../ai-consultation/consumers/ai-telemetry.consumer";
import { CatalogMutationConsumer } from "./consumers/catalog-mutation.consumer";
import { SmsNotificationConsumer } from "./consumers/sms-notification.consumer";
import { KAFKA_CLIENT, TOPIC_CATALOG_MUTATION, TOPIC_NOTIFICATION_SMS } from "./kafka.constants";
import { KafkaProducerService } from "./kafka-producer.service";

/**
 * Distributed Kafka event processing module.
 *
 * Provides:
 * - KafkaProducerService: Non-blocking event dispatch for any module
 * - SmsNotificationConsumer: Drains notification.sms topic (OTP delivery)
 * - CatalogMutationConsumer: Drains catalog.mutation topic (embedding regeneration)
 *
 * Configuration (environment variables):
 * - KAFKA_BROKERS: Comma-separated broker addresses (default: "localhost:9092")
 * - KAFKA_CLIENT_ID: Client identifier (default: "rayan-tech-backend")
 * - KAFKA_GROUP_ID: Consumer group (default: "rayan-tech-workers")
 *
 * Boot invariant: Kafka connection is fire-and-forget. The HTTP server
 * NEVER waits for Kafka. If the broker is unreachable the app runs in
 * degraded mode (no async events) and retries silently in background.
 */
@Global()
@Module({
  providers: [
    {
      provide: KAFKA_CLIENT,
      useFactory: (configService: ConfigService): Kafka => {
        const brokers = configService
          .get<string>("KAFKA_BROKERS", "localhost:9092")
          .split(",")
          .map((b) => b.trim());
        const clientId = configService.get<string>("KAFKA_CLIENT_ID", "rayan-tech-backend");

        return new Kafka({
          clientId,
          brokers,
          connectionTimeout: 5_000,
          requestTimeout: 10_000,
          retry: {
            initialRetryTime: 500,
            retries: 3,
          },
          logLevel: logLevel.WARN,
        });
      },
      inject: [ConfigService],
    },
    KafkaProducerService,
    SmsNotificationConsumer,
    CatalogMutationConsumer,
    AiTelemetryConsumer,
  ],
  exports: [
    KafkaProducerService,
    SmsNotificationConsumer,
    CatalogMutationConsumer,
    AiTelemetryConsumer,
    KAFKA_CLIENT,
  ],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaModule.name);

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
    private readonly producer: KafkaProducerService,
    private readonly smsConsumer: SmsNotificationConsumer,
    private readonly catalogConsumer: CatalogMutationConsumer,
    private readonly aiTelemetryConsumer: AiTelemetryConsumer,
  ) {}

  async onModuleInit(): Promise<void> {
    // Fire-and-forget: Kafka connection must NOT block HTTP server startup.
    // If Kafka is unavailable, the app runs in degraded mode (no async events).
    void this.initializeKafka();
  }

  /**
   * Provision required topics, then start producer and consumers.
   * Runs entirely in background — errors are caught and logged as warnings.
   */
  private async initializeKafka(): Promise<void> {
    try {
      await this.ensureTopics();
      await this.producer.connect();
      await this.smsConsumer.start();
      await this.catalogConsumer.start();
      await this.aiTelemetryConsumer.start();
      this.logger.log("Kafka subsystem ready (producer + consumers)");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Kafka unavailable — degraded mode (non-fatal): ${msg}`);
    }
  }

  /**
   * Ensure all required topics exist before consumers attempt to subscribe.
   * Uses createTopics with validateOnly=false — idempotent if topics already exist.
   */
  private async ensureTopics(): Promise<void> {
    const admin = this.kafka.admin();
    try {
      await admin.connect();
      await admin.createTopics({
        waitForLeaders: true,
        topics: [
          { topic: TOPIC_NOTIFICATION_SMS, numPartitions: 1, replicationFactor: 1 },
          { topic: TOPIC_CATALOG_MUTATION, numPartitions: 1, replicationFactor: 1 },
          { topic: TOPIC_AI_TELEMETRY, numPartitions: 1, replicationFactor: 1 },
        ],
      });
      this.logger.log("Kafka topics provisioned");
    } finally {
      await admin.disconnect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.aiTelemetryConsumer.stop();
    await this.smsConsumer.stop();
    await this.catalogConsumer.stop();
    await this.producer.disconnect();
  }
}
