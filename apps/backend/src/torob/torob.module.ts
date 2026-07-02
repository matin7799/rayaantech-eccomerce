import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { TorobController } from "./torob.controller";
import { TorobTrackerMiddleware } from "./torob-tracker.middleware";

/**
 * Torob aggregator module.
 *
 * Provides:
 * - TorobController: Cursor-based product feed at /api/v1/torob/products
 * - TorobTrackerMiddleware: Referral session tracking (utm_source=torob, 1200s TTL)
 *
 * The middleware is applied globally to all routes to capture Torob referrals
 * regardless of which endpoint the user lands on.
 *
 * Dependencies (from global modules):
 * - DatabaseModule (provides DRIZZLE_CLIENT for product queries)
 * - RedisModule (provides REDIS_CLIENT for session TTL tracking)
 */
@Module({
  controllers: [TorobController],
  providers: [TorobTrackerMiddleware],
})
export class TorobModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply Torob tracker to all routes — it self-activates only on utm_source=torob
    consumer.apply(TorobTrackerMiddleware).forRoutes("*");
  }
}
