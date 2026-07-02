import {
  type BeforeApplicationShutdown,
  Inject,
  Injectable,
  Logger,
  type OnApplicationShutdown,
} from "@nestjs/common";
import type Redis from "ioredis";
import { CatalogMutationConsumer } from "../kafka/consumers/catalog-mutation.consumer";
import { SmsNotificationConsumer } from "../kafka/consumers/sms-notification.consumer";
import { KafkaProducerService } from "../kafka/kafka-producer.service";
import { REDIS_CLIENT } from "../redis/redis.constants";

/**
 * GracefulShutdownService — Orchestrates clean resource disposal on SIGTERM.
 *
 * NestJS lifecycle hooks execute in order:
 * 1. beforeApplicationShutdown() — drain active connections
 * 2. onApplicationShutdown() — final cleanup confirmation
 *
 * Resources drained:
 * - Kafka consumers (stop subscription loops)
 * - Kafka producer (disconnect from broker)
 * - Redis client (quit cleanly)
 * - PostgreSQL pool closes automatically via Drizzle/pg driver disposal
 *
 * This ensures zero in-flight message loss and clean container termination
 * in Kubernetes/Docker environments with graceful stop periods.
 */
@Injectable()
export class GracefulShutdownService implements BeforeApplicationShutdown, OnApplicationShutdown {
  private readonly logger = new Logger(GracefulShutdownService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(KafkaProducerService)
    private readonly kafkaProducer: KafkaProducerService,
    @Inject(SmsNotificationConsumer)
    private readonly smsConsumer: SmsNotificationConsumer,
    @Inject(CatalogMutationConsumer)
    private readonly catalogConsumer: CatalogMutationConsumer,
  ) {}

  /**
   * Phase 1: Drain active connections before the app shuts down.
   * Stop Kafka consumers first to prevent new message processing.
   */
  async beforeApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Shutdown signal received: ${signal ?? "unknown"}`);

    // Stop Kafka consumers (drain in-flight messages)
    this.logger.log("Draining Kafka consumers...");
    await Promise.allSettled([this.smsConsumer.stop(), this.catalogConsumer.stop()]);

    // Disconnect Kafka producer
    this.logger.log("Disconnecting Kafka producer...");
    await this.kafkaProducer.disconnect();
  }

  /**
   * Phase 2: Final cleanup — close Redis and confirm shutdown.
   * PostgreSQL pool is closed by NestJS module disposal automatically.
   */
  async onApplicationShutdown(signal?: string): Promise<void> {
    // Close Redis connection cleanly
    this.logger.log("Closing Redis connection...");
    try {
      await this.redis.quit();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Redis quit error (non-critical): ${msg}`);
    }

    this.logger.log(`Graceful shutdown complete (signal: ${signal ?? "unknown"})`);
  }
}
