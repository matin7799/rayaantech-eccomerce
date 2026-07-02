import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { OrderController } from "./order.controller";
import { CheckoutService } from "./services/checkout.service";
import { ReservationCleanupService } from "./services/reservation-cleanup.service";

/**
 * Order management module.
 *
 * Provides:
 * - OrderController: POST /api/v1/orders/checkout
 * - CheckoutService: Atomic cart freeze + reservation + stock decrement
 * - ReservationCleanupService: Cron job sweeping expired reservations every 60s
 *
 * Dependencies (from global modules):
 * - DatabaseModule (provides DRIZZLE_CLIENT)
 * - ScheduleModule (provides @Cron decorator support)
 */
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [OrderController],
  providers: [CheckoutService, ReservationCleanupService],
  exports: [CheckoutService],
})
export class OrderModule {}
