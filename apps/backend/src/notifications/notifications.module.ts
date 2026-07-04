import { Module } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsService } from "./notifications.service";
import { NotificationsPaymentListener } from "./notifications-payment.listener";

/**
 * In-app admin/operator notifications.
 *
 * - NotificationsService: DB write path + read helpers (notifications table)
 * - NotificationsGateway: socket.io push (/admin-notifications namespace)
 * - NotificationsPaymentListener: persists + pushes on `payment.confirmed`
 *
 * Dependencies (from global modules): DatabaseModule (DRIZZLE_CLIENT),
 * EventEmitterModule (payment.confirmed).
 */
@Module({
  providers: [NotificationsService, NotificationsGateway, NotificationsPaymentListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
