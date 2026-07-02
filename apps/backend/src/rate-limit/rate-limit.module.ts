import { Module } from "@nestjs/common";
import { RateLimitAdminController } from "./controllers/rate-limit-admin.controller";
import { AiRateLimitGuard } from "./guards/ai-rate-limit.guard";
import { RateLimitAdminService } from "./services/rate-limit-admin.service";
import { RateLimitConfigService } from "./services/rate-limit-config.service";

/**
 * Rate limiting module for AI endpoints.
 *
 * Provides:
 * - AiRateLimitGuard: Per-customer rate limiting with Redis counters
 * - RateLimitConfigService: Dynamic config resolution (DB + Redis cache)
 * - RateLimitAdminService: CRUD operations for admin panel
 * - RateLimitAdminController: REST endpoints for admin management
 *
 * Dependencies (from global modules):
 * - RedisModule (provides REDIS_CLIENT)
 * - DatabaseModule (provides DRIZZLE_CLIENT)
 */
@Module({
  controllers: [RateLimitAdminController],
  providers: [AiRateLimitGuard, RateLimitConfigService, RateLimitAdminService],
  exports: [AiRateLimitGuard, RateLimitConfigService],
})
export class RateLimitModule {}
