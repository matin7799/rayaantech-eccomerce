import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";

/**
 * Event payload emitted on successful payment verification.
 */
export interface PaymentConfirmedEvent {
  orderId: string;
  amount: number;
  method: string;
  refId: string;
}

/**
 * SMS notification listener for payment confirmation events.
 *
 * On 'payment.confirmed':
 * 1. Fetches admin phone numbers from config
 * 2. Sends SMS via MeliPayamak pattern template API
 * 3. Logs success/failure without blocking the payment flow
 *
 * Uses MeliPayamak REST "pattern send" endpoint which bypasses
 * carrier text firewalls via pre-approved template IDs.
 */
@Injectable()
export class PaymentSmsListener {
  private readonly logger = new Logger(PaymentSmsListener.name);
  private readonly otpToken: string;
  private readonly adminPhones: string[];

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.otpToken = this.config.get<string>("MELIPAYAMAK_OTP_TOKEN") ?? "";
    // Admin phones from env (comma-separated)
    const phones = this.config.get<string>("ADMIN_ALERT_PHONES") ?? "";
    this.adminPhones = phones
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
  }

  @OnEvent("payment.confirmed", { async: true })
  async handlePaymentConfirmed(event: PaymentConfirmedEvent): Promise<void> {
    if (!this.otpToken || this.adminPhones.length === 0) {
      this.logger.warn("SMS config missing — skipping notification");
      return;
    }

    const amountToman = Math.floor(event.amount / 10).toLocaleString("fa-IR");

    for (const phone of this.adminPhones) {
      try {
        await this.sendPatternSms(phone, {
          orderId: event.orderId.slice(0, 8),
          amount: amountToman,
          refId: event.refId,
        });
        this.logger.log(`SMS sent to ${phone} for order ${event.orderId}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "unknown";
        this.logger.error(`SMS failed for ${phone}: ${msg}`);
      }
    }
  }

  /**
   * Send a pattern-based SMS via MeliPayamak REST API.
   * Template must be pre-registered in MeliPayamak panel.
   */
  private async sendPatternSms(to: string, params: Record<string, string>): Promise<void> {
    const url =
      "https://console.melipayamak.com/api/send/shared/d9e06a76-4ee7-44c1-81ac-55a421a7e0c4";

    const body = {
      bodyId: 0, // Template pattern ID — configure in MeliPayamak panel
      to,
      args: [params.orderId, params.amount, params.refId],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.otpToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`MeliPayamak HTTP ${res.status}`);
    }
  }
}
