import { BadRequestException, ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";

/**
 * Row shape for payment existence check.
 */
interface PaymentExistsRow extends Record<string, unknown> {
  id: string;
  status: string;
}

/**
 * Row shape for payment insertion result.
 */
interface PaymentRow extends Record<string, unknown> {
  id: string;
  order_id: string;
  method: string;
  status: string;
  amount: string;
  payment_ref_id: string | null;
  paid_at: string | null;
  created_at: string;
}

/**
 * Incoming payment webhook payload from gateway (Zarinpal/Digipay).
 */
export interface PaymentCallbackDto {
  /** Order UUID that this payment corresponds to */
  orderId: string;
  /** Payment gateway method identifier */
  method: "zarinpal" | "digipay_credit" | "cash_on_delivery";
  /** Payment amount (integer Rial string, must match order total exactly) */
  amount: string;
  /** Gateway-issued unique payment reference ID (idempotency key) */
  paymentRefId: string;
  /** Raw gateway response object for audit logging */
  gatewayResponse?: Record<string, unknown>;
}

/**
 * Public-facing payment record.
 */
export interface PaymentRecord {
  id: string;
  orderId: string;
  method: string;
  status: string;
  amount: string;
  paymentRefId: string | null;
  paidAt: string | null;
  createdAt: string;
}

/**
 * Payment webhook processing service with strict idempotency enforcement.
 *
 * Core invariants:
 * 1. NEVER trust client-side redirect parameters for state mutations
 * 2. Only backend-to-backend gateway webhook receipts trigger payment confirmation
 * 3. The `payment_ref_id` unique index is the rigid idempotency key
 * 4. If payment_ref_id already exists with status='completed', reject instantly
 * 5. Order status mutates to 'confirmed' ONLY upon valid webhook processing
 * 6. All raw gateway payloads are logged server-side, never exposed to clients
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Process an incoming payment gateway webhook callback.
   *
   * Idempotency flow:
   * 1. Check if payment_ref_id already exists
   * 2. If exists with status=completed → reject as duplicate
   * 3. If new → validate order, record payment, transition order to 'confirmed'
   * 4. Update reservation statuses to 'completed'
   */
  async processCallback(dto: PaymentCallbackDto): Promise<PaymentRecord> {
    // Step 1: Idempotency check — reject if already completed
    await this.assertNotDuplicate(dto.paymentRefId);

    // Step 2: Validate the order exists and is in a payable state
    const orderResult = await this.db.execute<
      {
        id: string;
        status: string;
        total_amount: string;
        user_id: string;
      } & Record<string, unknown>
    >(sql`
      SELECT id, status, total_amount, user_id
      FROM orders
      WHERE id = ${dto.orderId}
      LIMIT 1
    `);

    const order = orderResult.rows[0];
    if (!order) {
      throw new BadRequestException("Order not found");
    }

    if (order.status !== "pending") {
      throw new ConflictException(`Order is not in a payable state (current: ${order.status})`);
    }

    // Step 3: Verify amount matches expected payment
    // For installment orders: compare against down_payment_amount
    // For normal orders: compare against order total (anti-tampering)
    const orderTotal = parseInt(order.total_amount, 10) || 0;
    const paymentAmount = parseInt(dto.amount, 10) || 0;

    // Check if this is an installment order
    const installmentCheck = await this.db.execute<
      { down_payment_amount: string } & Record<string, unknown>
    >(sql`
      SELECT down_payment_amount FROM installment_metadata
      WHERE order_id = ${dto.orderId} LIMIT 1
    `);

    const isInstallment = installmentCheck.rows.length > 0;
    const expectedAmount = isInstallment
      ? parseInt(installmentCheck.rows[0].down_payment_amount, 10) || 0
      : orderTotal;

    if (expectedAmount !== paymentAmount) {
      this.logger.warn(
        `Payment amount mismatch for order ${dto.orderId}: ` +
          `expected ${expectedAmount} (${isInstallment ? "down-payment" : "total"}), received ${paymentAmount}`,
      );
      throw new BadRequestException("Payment amount does not match expected amount");
    }

    // Step 4: Record the payment and transition order — atomic transaction
    return this.db.transaction(async (tx) => {
      // Insert payment record with unique payment_ref_id
      const paymentResult = await tx.execute<PaymentRow>(sql`
        INSERT INTO payments (order_id, method, status, amount, payment_ref_id, gateway_response, paid_at)
        VALUES (
          ${dto.orderId},
          ${dto.method},
          'completed',
          ${dto.amount},
          ${dto.paymentRefId},
          ${dto.gatewayResponse ? JSON.stringify(dto.gatewayResponse) : null}::json,
          NOW()
        )
        RETURNING id, order_id, method, status, amount, payment_ref_id, paid_at, created_at
      `);

      const payment = paymentResult.rows[0];
      if (!payment) {
        throw new BadRequestException("Failed to record payment");
      }

      // Transition order status to 'confirmed'
      await tx.execute(sql`
        UPDATE orders
        SET status = 'confirmed', updated_at = NOW()
        WHERE id = ${dto.orderId}
      `);

      // Decrement product variant stock atomically (only on payment success)
      // Also sync parent product stock (used by product listing sort/filter)
      const orderItemsResult = await tx.execute<
        { items: Array<{ variantId: string; productId: string; quantity: number }> } & Record<
          string,
          unknown
        >
      >(sql`
        SELECT items FROM orders WHERE id = ${dto.orderId} LIMIT 1
      `);
      const orderItems = orderItemsResult.rows[0]?.items ?? [];
      const affectedProductIds = new Set<string>();

      for (const item of orderItems) {
        if (item.variantId && item.quantity > 0) {
          await tx.execute(sql`
            UPDATE product_variants
            SET stock = stock - ${item.quantity}, updated_at = NOW()
            WHERE id = ${item.variantId} AND stock >= ${item.quantity}
          `);
          if (item.productId) {
            affectedProductIds.add(item.productId);
          }
        }
      }

      // Sync parent products.stock = SUM of all their variant stocks
      for (const productId of affectedProductIds) {
        await tx.execute(sql`
          UPDATE products
          SET stock = COALESCE((
            SELECT SUM(stock) FROM product_variants WHERE product_id = ${productId}
          ), 0),
          updated_at = NOW()
          WHERE id = ${productId}
        `);
      }

      // Mark all pending reservations for this order's user as 'completed'
      await tx.execute(sql`
        UPDATE product_reservations
        SET status = 'completed'
        WHERE user_id = ${order.user_id}
          AND status = 'pending'
      `);

      this.logger.log(
        `Payment ${payment.id} processed for order ${dto.orderId} ` +
          `(ref: ${dto.paymentRefId}, method: ${dto.method})`,
      );

      return this.mapRowToRecord(payment);
    });
  }

  /**
   * Check if a payment_ref_id has already been processed.
   * If it exists with status='completed', throw a ConflictException
   * to block double-processing loops.
   */
  private async assertNotDuplicate(paymentRefId: string): Promise<void> {
    const existing = await this.db.execute<PaymentExistsRow>(sql`
      SELECT id, status
      FROM payments
      WHERE payment_ref_id = ${paymentRefId}
      LIMIT 1
    `);

    const row = existing.rows[0];
    if (row) {
      if (row.status === "completed") {
        throw new ConflictException("This payment has already been processed (duplicate callback)");
      }
      // If exists but not completed (e.g. 'pending' or 'failed'), allow reprocessing
      this.logger.warn(
        `Payment ref ${paymentRefId} exists with status=${row.status} — allowing reprocessing`,
      );
    }
  }

  private mapRowToRecord(row: PaymentRow): PaymentRecord {
    return {
      id: row.id,
      orderId: row.order_id,
      method: row.method,
      status: row.status,
      amount: row.amount,
      paymentRefId: row.payment_ref_id,
      paidAt: row.paid_at,
      createdAt: String(row.created_at),
    };
  }
}
