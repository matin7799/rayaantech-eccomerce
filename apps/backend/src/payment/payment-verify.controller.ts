import { Body, Controller, HttpCode, HttpStatus, Inject, Logger, Post } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Public } from "../auth/decorators/public.decorator";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { PaymentService } from "./payment.service";
import { PaymentGatewayService } from "./payment-gateway.service";

/**
 * DTO shape for the gateway verification endpoint.
 * The frontend calls this after receiving callback parameters.
 */
interface VerifyRequestDto {
  orderId: string;
  authority: string;
  method: "zarinpal" | "digipay_credit";
  amount: number;
}

/**
 * Payment verification REST controller.
 *
 * Base path: /api/v1/payments/verify
 *
 * This endpoint is called by the frontend callback page to verify
 * a payment with the gateway, then record + confirm the order.
 *
 * Flow:
 * 1. Frontend receives callback params (authority/trackingCode)
 * 2. Frontend POSTs to this endpoint
 * 3. We verify with the gateway strategy
 * 4. On success, record via PaymentService (idempotent)
 * 5. Emit 'payment.confirmed' event for SMS/Kafka listeners
 */
@Controller("api/v1/payments")
export class PaymentVerifyController {
  private readonly logger = new Logger(PaymentVerifyController.name);

  constructor(
    @Inject(PaymentGatewayService)
    private readonly gatewayService: PaymentGatewayService,
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  @Public()
  @Post("verify")
  @HttpCode(HttpStatus.OK)
  async verify(@Body() body: VerifyRequestDto) {
    // Step 0: Resolve the real payment amount from the order
    // For installments, use the down-payment from installment_metadata
    // For normal payments, use the order total
    let verifyAmount = body.amount;

    if (!verifyAmount || verifyAmount <= 0) {
      // Look up the order total (stored in Tomans)
      const orderResult = await this.db.execute<
        { total_amount: string } & Record<string, unknown>
      >(sql`
        SELECT total_amount FROM orders WHERE id = ${body.orderId} LIMIT 1
      `);
      const orderTotal = parseInt(orderResult.rows[0]?.total_amount ?? "0", 10);

      // Check if this is an installment order (use down_payment_amount instead)
      const installmentResult = await this.db.execute<
        { down_payment_amount: string } & Record<string, unknown>
      >(sql`
        SELECT down_payment_amount FROM installment_metadata WHERE order_id = ${body.orderId} LIMIT 1
      `);

      if (installmentResult.rows[0]) {
        verifyAmount = parseInt(installmentResult.rows[0].down_payment_amount, 10);
      } else {
        verifyAmount = orderTotal;
      }

      this.logger.log(`[verify] Resolved amount for order ${body.orderId}: ${verifyAmount} Tomans`);
    }

    // Step 1: Verify with gateway
    const verification = await this.gatewayService.verify(body.method, {
      authority: body.authority,
      amount: verifyAmount,
    });

    if (!verification.success) {
      return {
        success: false,
        message: "تأیید پرداخت ناموفق بود",
        refId: null,
      };
    }

    // Step 2: Record payment (idempotent via payment_ref_id)
    try {
      await this.paymentService.processCallback({
        orderId: body.orderId,
        method: body.method,
        amount: String(verifyAmount),
        paymentRefId: verification.refId,
        gatewayResponse: verification.rawResponse,
      });
    } catch (err: unknown) {
      // If it's a duplicate (409), the payment was already recorded — still success
      if (err && typeof err === "object" && "status" in err && err.status === 409) {
        this.logger.log(`Duplicate verify for order ${body.orderId} — already confirmed`);
      } else {
        throw err;
      }
    }

    // Step 3: Emit event for SMS notification + Kafka audit
    this.eventEmitter.emit("payment.confirmed", {
      orderId: body.orderId,
      amount: verifyAmount,
      method: body.method,
      refId: verification.refId,
    });

    this.logger.log(`Payment verified: order=${body.orderId}, ref=${verification.refId}`);

    return {
      success: true,
      refId: verification.refId,
      cardPan: verification.cardPan ?? null,
    };
  }
}
