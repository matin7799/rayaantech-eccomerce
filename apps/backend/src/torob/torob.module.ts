import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { TorobController } from "./torob.controller";
import { TorobActionsController } from "./torob-actions.controller";
import { TorobClidMiddleware } from "./torob-clid.middleware";
import { TorobJwtGuard } from "./torob-jwt.guard";
import { TorobOrdersController } from "./torob-orders.controller";
import { TorobTrackerMiddleware } from "./torob-tracker.middleware";
import { TorobV3Controller } from "./torob-v3.controller";

/**
 * Torob aggregator module.
 *
 * Provides TWO layers of Torob integration:
 *
 * 1. Official Torob API (docs/torob/):
 *    - TorobV3Controller     → POST /torob_api/v3/products  (Product API v3)
 *                              also aliased at POST /api/v1/torob/products
 *                              (the URL registered in the Torob panel)
 *    - TorobOrdersController → GET  /torob/v1/orders        (Order Tracking)
 *    - TorobActionsController→ GET  /torob/v1/actions       (Action Tracking)
 *    All three are guarded by TorobJwtGuard (EdDSA JWT via X-Torob-Token).
 *
 * 2. Internal Torob tooling (pre-existing):
 *    - TorobController          → GET /api/v1/torob/products (cursor feed for frontend)
 *    - TorobTrackerMiddleware   → utm_source=torob Redis session (pricing tier)
 *    - TorobClidMiddleware      → captures ?torob_clid= for order attribution
 *
 * Dependencies (from global modules):
 * - DatabaseModule (DRIZZLE_CLIENT)
 * - RedisModule (REDIS_CLIENT)
 * - ConfigModule (ConfigService — global)
 */
@Module({
  controllers: [TorobController, TorobV3Controller, TorobOrdersController, TorobActionsController],
  providers: [TorobTrackerMiddleware, TorobClidMiddleware, TorobJwtGuard],
})
export class TorobModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // - TorobClidMiddleware:    captures torob_clid (order attribution, 7-day cookie)
    // - TorobTrackerMiddleware: activates the Torob pricing session for landings
    //   carrying utm_source=torob and/or torob_clid (either alone suffices)
    consumer.apply(TorobClidMiddleware, TorobTrackerMiddleware).forRoutes("*");
  }
}
