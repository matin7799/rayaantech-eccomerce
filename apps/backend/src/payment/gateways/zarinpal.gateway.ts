import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import ZarinPal from "zarinpal-node-sdk";
import type {
  PaymentGatewayStrategy,
  PaymentInitiateInput,
  PaymentInitiateResult,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "../interfaces/gateway-strategy.interface";

/**
 * Zarinpal payment gateway strategy.
 *
 * Uses the official zarinpal-node-sdk for:
 * - payments.create() → initiate a payment request
 * - verifications.verify() → confirm payment after callback
 *
 * Environment variables consumed:
 * - ZARINPAL_MERCHANT_ID (required)
 * - ZARINPAL_SANDBOX (boolean, default false — set "true" for sandbox mode)
 * - ZARINPAL_ACCESS_TOKEN (required for refund operations)
 *
 * Sandbox Mode:
 * - SDK auto-routes to sandbox.zarinpal.com when sandbox=true
 * - Redirect URL: https://sandbox.zarinpal.com/pg/StartPay/:authority
 * - Request URL: https://sandbox.zarinpal.com/pg/rest/v4/payment/request.json
 * - Verify URL: https://sandbox.zarinpal.com/pg/rest/v4/payment/verify.json
 *
 * Security Invariants:
 * 1. Amount is validated server-side before gateway call (must be > 0, integer Rials)
 * 2. All gateway errors are caught, logged, and re-thrown with clean messages
 * 3. Raw gateway responses are never exposed to client viewport
 * 4. Verification requires amount match against stored order total (anti-tampering)
 */
@Injectable()
export class ZarinpalGateway implements PaymentGatewayStrategy {
  readonly name = "zarinpal" as const;
  private readonly logger = new Logger(ZarinpalGateway.name);
  private readonly client: ZarinPal;
  private readonly isSandbox: boolean;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    const merchantId = this.config.getOrThrow<string>("ZARINPAL_MERCHANT_ID");
    this.isSandbox = this.config.get<string>("ZARINPAL_SANDBOX") === "true";
    const accessToken = this.config.get<string>("ZARINPAL_ACCESS_TOKEN");

    this.client = new ZarinPal({
      merchantId,
      sandbox: this.isSandbox,
      ...(accessToken ? { accessToken } : {}),
    });

    this.logger.log(
      `ZarinpalGateway initialized — mode: ${this.isSandbox ? "SANDBOX" : "PRODUCTION"}`,
    );
  }

  /**
   * Initiate a Zarinpal payment request.
   *
   * Pre-validation:
   * - Amount must be a positive integer (Rials)
   * - CallbackUrl must be non-empty
   *
   * Returns the authority code and full redirect URL.
   */
  async initiate(input: PaymentInitiateInput): Promise<PaymentInitiateResult> {
    // Server-side amount pre-validation (Zero-Trust: never trust caller blindly)
    if (!Number.isInteger(input.amount) || input.amount <= 0) {
      this.logger.error(
        `[initiate] Invalid amount for order ${input.orderId}: ${input.amount} (must be positive integer Tomans)`,
      );
      throw new Error("مبلغ پرداخت نامعتبر است. لطفاً مجدداً تلاش کنید.");
    }

    if (!input.callbackUrl) {
      this.logger.error(`[initiate] Missing callbackUrl for order ${input.orderId}`);
      throw new Error("آدرس بازگشت پرداخت تنظیم نشده است.");
    }

    this.logger.log(
      `[initiate] Requesting payment: order=${input.orderId}, amount=${input.amount} Tomans, sandbox=${this.isSandbox}`,
    );

    let response: Record<string, unknown>;
    try {
      response = (await this.client.payments.create({
        amount: input.amount,
        callback_url: input.callbackUrl,
        description: input.description,
        currency: "IRT",
        ...(input.mobile ? { mobile: input.mobile } : {}),
        ...(input.email ? { email: input.email } : {}),
      } as Parameters<typeof this.client.payments.create>[0])) as Record<string, unknown>;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`[initiate] Zarinpal SDK threw for order ${input.orderId}: ${errorMsg}`);
      throw new Error("خطا در ارتباط با درگاه زرین‌پال. لطفاً دقایقی بعد مجدداً تلاش کنید.");
    }

    const data = response.data as { authority?: string } | undefined;
    const authority = data?.authority;

    if (!authority) {
      this.logger.error(
        `[initiate] No authority returned for order ${input.orderId}. Gateway response: ${JSON.stringify(response)}`,
      );
      throw new Error("درگاه زرین‌پال پاسخ معتبری ارسال نکرد. لطفاً مجدداً تلاش کنید.");
    }

    // Build redirect URL — sandbox uses sandbox.zarinpal.com
    const baseUrl = this.isSandbox ? "https://sandbox.zarinpal.com" : "https://www.zarinpal.com";
    const redirectUrl =
      (response as { redirectUrl?: string }).redirectUrl ?? `${baseUrl}/pg/StartPay/${authority}`;

    this.logger.log(
      `[initiate] Payment created: order=${input.orderId}, authority=${authority}, redirect=${redirectUrl}`,
    );

    return {
      authority,
      redirectUrl,
      rawResponse: response,
    };
  }

  /**
   * Verify a Zarinpal payment after user callback.
   *
   * Pre-validation:
   * - Authority must be non-empty string
   * - Amount must match the original order total (anti-tampering guard)
   *
   * Must be called with the same amount as the original request.
   */
  async verify(input: PaymentVerifyInput): Promise<PaymentVerifyResult> {
    // Pre-validation guards
    if (!input.authority || input.authority.trim().length === 0) {
      this.logger.warn("[verify] Empty authority received — rejecting");
      return { success: false, refId: "" };
    }

    if (!Number.isInteger(input.amount) || input.amount <= 0) {
      this.logger.error(
        `[verify] Invalid amount for verification: ${input.amount} (authority: ${input.authority})`,
      );
      return { success: false, refId: "" };
    }

    this.logger.log(
      `[verify] Verifying: authority=${input.authority}, amount=${input.amount} Tomans`,
    );

    let response: Record<string, unknown>;
    try {
      response = (await this.client.verifications.verify({
        authority: input.authority,
        amount: input.amount,
        currency: "IRT",
      } as Parameters<typeof this.client.verifications.verify>[0])) as Record<string, unknown>;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `[verify] Zarinpal SDK threw during verification: authority=${input.authority}, error=${errorMsg}`,
      );
      // Return failure rather than throwing — caller handles the failed state
      return { success: false, refId: "" };
    }

    const data = response.data as
      | {
          code?: number;
          ref_id?: number | string;
          card_pan?: string;
        }
      | undefined;

    const code = data?.code;
    const refId = data?.ref_id;

    // Codes 100 (first verification) and 101 (already verified) are both success
    if (code === 100 || code === 101) {
      this.logger.log(
        `[verify] Payment verified: authority=${input.authority}, ref_id=${refId}, code=${code}`,
      );
      return {
        success: true,
        refId: String(refId),
        cardPan: data?.card_pan,
        rawResponse: response,
      };
    }

    this.logger.warn(
      `[verify] Verification rejected: code=${code}, authority=${input.authority}. ` +
        `Full response: ${JSON.stringify(response)}`,
    );
    return {
      success: false,
      refId: "",
      rawResponse: response,
    };
  }
}
