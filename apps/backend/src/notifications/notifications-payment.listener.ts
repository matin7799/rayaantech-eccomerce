import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { PaymentConfirmedEvent } from "../payment/listeners/payment-sms.listener";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsService } from "./notifications.service";

/**
 * Persists an in-app notification and pushes it live on every confirmed payment.
 *
 * This is the reliable admin-alert channel that replaces the flaky MeliPayamak
 * SMS (see payment-sms.listener.ts). Runs async so it never blocks payment.
 */
@Injectable()
export class NotificationsPaymentListener {
  private readonly logger = new Logger(NotificationsPaymentListener.name);

  constructor(
    @Inject(NotificationsService)
    private readonly notifications: NotificationsService,
    @Inject(NotificationsGateway)
    private readonly gateway: NotificationsGateway,
  ) {}

  @OnEvent("payment.confirmed", { async: true })
  async handlePaymentConfirmed(event: PaymentConfirmedEvent): Promise<void> {
    try {
      const amountLabel = event.amount.toLocaleString("fa-IR");
      const shortId = event.orderId.slice(0, 8);

      const notification = await this.notifications.create({
        type: "payment_confirmed",
        title: "پرداخت جدید",
        body: `سفارش ${shortId} — مبلغ ${amountLabel} تومان با موفقیت پرداخت شد.`,
        orderId: event.orderId,
        amount: event.amount,
        metadata: { method: event.method, refId: event.refId },
      });

      this.gateway.broadcast(notification);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "unknown";
      this.logger.error(`Failed to record payment notification for ${event.orderId}: ${msg}`);
    }
  }
}
