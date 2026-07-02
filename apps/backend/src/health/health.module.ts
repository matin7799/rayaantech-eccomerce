import { Module } from "@nestjs/common";
import { GracefulShutdownService } from "./graceful-shutdown.service";
import { HealthController } from "./health.controller";

/**
 * Health module providing:
 * - Liveness and readiness probe endpoints
 * - Graceful shutdown lifecycle hooks (Kafka drain, Redis close)
 *
 * Dependencies (injected via global modules):
 * - DRIZZLE_CLIENT (DatabaseModule)
 * - REDIS_CLIENT (RedisModule)
 * - KAFKA_CLIENT (KafkaModule)
 * - KafkaProducerService, SmsNotificationConsumer, CatalogMutationConsumer (KafkaModule)
 */
@Module({
  controllers: [HealthController],
  providers: [GracefulShutdownService],
})
export class HealthModule {}
