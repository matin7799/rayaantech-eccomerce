import { Body, Controller, HttpCode, HttpStatus, Inject, Logger, Post } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { type PaymentCallbackDto, type PaymentRecord, PaymentService } from "./payment.service";

/**
 * Payment webhook REST controller.
 *
 * Base path: /api/v1/payments
 *
 * This controller listens exclusively to backend-to-backend gateway traffic.
 * The callback endpoint is marked @Public() because gateway servers
 * do not carry our API tokens — they authenticate via payload signatures.
 *
 * INVARIANT: Client-side redirect parameters are NEVER used for state mutations.
 * Only validated webhook receipts from the payment gateway trigger order
 * status transitions.
 */
@Controller("api/v1/payments")
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(@Inject(PaymentService) private readonly paymentService: PaymentService) {}

  /**
   * Handle payment gateway webhook callback.
   *
   * This endpoint is public (no API token required) because it receives
   * server-to-server callbacks from Zarinpal/Digipay gateways.
   *
   * Idempotency is enforced via the unique payment_ref_id constraint.
   * Duplicate callbacks are rejected with 409 Conflict.
   *
   * Body:
   * - orderId (required): UUID of the order being paid
   * - method (required): Payment method enum
   * - amount (required): Payment amount (must match order total)
   * - paymentRefId (required): Gateway-issued unique reference ID
   * - gatewayResponse (optional): Raw gateway response for audit
   */
  @Public()
  @Post("callback")
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() body: PaymentCallbackDto): Promise<{ data: PaymentRecord }> {
    try {
      const result = await this.paymentService.processCallback(body);
      return { data: result };
    } catch (err: unknown) {
      // Log the full gateway payload for debugging (never expose to client)
      if (err instanceof Error) {
        this.logger.error(
          `Payment callback failed: ${err.message}`,
          JSON.stringify({
            orderId: body.orderId,
            paymentRefId: body.paymentRefId,
            method: body.method,
          }),
        );
      }
      // Re-throw — AllExceptionsFilter will sanitize the response
      throw err;
    }
  }
}
