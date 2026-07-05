import { BadRequestException, ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import type {
  CheckoutItemDto,
  CheckoutRequestDto,
  CheckoutResult,
  CheckoutTorobContext,
  ResolvedLineItem,
} from "../interfaces/checkout-dto.interface";
import { computeEffectivePrice, toRialString, type VariantPricingRow } from "./pricing.utils";

/**
 * Checkout service implementing the anti-tampering cart freeze pipeline
 * with integer Rial financial arithmetic (decimal(12,0) — no fractional digits).
 *
 * Core invariants:
 * 1. Client sends ONLY { variantId, quantity }[] — never prices
 * 2. All pricing resolved server-side using integer Rial math
 * 3. Atomic transaction: order + cart_snapshot + reservations + stock decrement
 * 4. Reservations expire exactly 20 minutes from creation
 * 5. If any variant has insufficient stock, entire transaction rolls back
 * 6. ZERO floating-point operations on financial values
 */
@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Execute the full checkout pipeline atomically.
   *
   * @param userId   Authenticated user placing the order.
   * @param dto      Client-submitted checkout payload (items + optional fields).
   * @param torob    Server-resolved Torob attribution context (click id from cookie).
   */
  async executeCheckout(
    userId: string,
    dto: CheckoutRequestDto,
    torob: CheckoutTorobContext = {},
  ): Promise<CheckoutResult> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException("Checkout requires at least one item");
    }

    const variantIds = dto.items.map((i) => i.variantId);
    if (new Set(variantIds).size !== variantIds.length) {
      throw new BadRequestException("Duplicate variant IDs are not allowed");
    }

    for (const item of dto.items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new BadRequestException(`Invalid quantity for variant ${item.variantId}`);
      }
    }

    return this.db.transaction(async (tx) => {
      const resolvedItems = await this.resolveServerSidePricing(tx, dto.items, userId);

      // NOTE: Stock is NOT decremented here. It is decremented only after
      // payment is confirmed (in PaymentService.processCallback).
      // resolveServerSidePricing still validates stock >= requested quantity.

      // Sum totals — pure integer addition, zero drift
      const totalAmountRials = resolvedItems.reduce((sum, item) => sum + item.totalPriceRials, 0);
      const discountAmountRials = 0;

      const totalAmount = toRialString(totalAmountRials);
      const discountAmount = toRialString(discountAmountRials);

      // Create order row
      // Optional attribution columns (torob_clid, shipping_amount, phone_number)
      // are NULL when not provided. shipping_amount is stored in Rials (numeric 12,0).
      const shippingAmountRials =
        typeof dto.shippingAmount === "number" && dto.shippingAmount > 0
          ? toRialString(dto.shippingAmount * 10)
          : null;
      const torobClid = torob.torobClid ?? null;
      const phoneNumber = dto.phoneNumber ?? null;

      const orderResult = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
        INSERT INTO orders (
          user_id, status, total_amount, discount_amount,
          shipping_address, notes, items,
          torob_clid, shipping_amount, phone_number
        )
        VALUES (
          ${userId}, 'pending', ${totalAmount}, ${discountAmount},
          ${dto.shippingAddress ?? null}, ${dto.notes ?? null},
          ${JSON.stringify(
            resolvedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          )}::json,
          ${torobClid}, ${shippingAmountRials}, ${phoneNumber}
        )
        RETURNING id
      `);

      const orderId = orderResult.rows[0]?.id;
      if (!orderId) {
        throw new BadRequestException("Failed to create order");
      }

      // Freeze cart snapshot
      const snapshotData = JSON.stringify({
        items: resolvedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        totalAmount,
        discountAmount,
      });

      const snapshotResult = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
        INSERT INTO cart_snapshots (user_id, order_id, snapshot_data)
        VALUES (${userId}, ${orderId}, ${snapshotData}::json)
        RETURNING id
      `);

      const snapshotId = snapshotResult.rows[0]?.id;
      if (!snapshotId) {
        throw new BadRequestException("Failed to create cart snapshot");
      }

      // Create reservations with 20-minute TTL
      const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();
      for (const resolved of resolvedItems) {
        await tx.execute(sql`
          INSERT INTO product_reservations (
            product_id, product_variant_id, user_id, quantity, status, expires_at
          )
          VALUES (
            ${resolved.productId}, ${resolved.variantId}, ${userId},
            ${resolved.quantity}, 'pending', ${expiresAt}::timestamptz
          )
        `);
      }

      this.logger.log(
        `Checkout complete: order ${orderId}, ${dto.items.length} items, ` +
          `total ${totalAmount} Rials, reservations expire at ${expiresAt}`,
      );

      return {
        orderId,
        snapshotId,
        totalAmount,
        discountAmount,
        items: resolvedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        reservationExpiresAt: expiresAt,
      };
    });
  }

  /**
   * Resolve pricing server-side using integer Rial arithmetic.
   *
   * Wholesale resolution uses proper FK join:
   * users.wholesale_group_id → wholesale_groups.id → markdown_percentage
   */
  private async resolveServerSidePricing(
    tx: Parameters<Parameters<NodePgDatabase["transaction"]>[0]>[0],
    items: CheckoutItemDto[],
    userId: string,
  ): Promise<Array<ResolvedLineItem & { totalPriceRials: number }>> {
    const resolved: Array<ResolvedLineItem & { totalPriceRials: number }> = [];

    // Proper relational JOIN: users.wholesale_group_id → wholesale_groups.id
    const wholesaleResult = await tx.execute<
      { markdown_percentage: string } & Record<string, unknown>
    >(sql`
      SELECT wg.markdown_percentage
      FROM users u
      INNER JOIN wholesale_groups wg ON wg.id = u.wholesale_group_id
      WHERE u.id = ${userId}
      LIMIT 1
    `);

    const wholesaleMarkdown = wholesaleResult.rows[0]?.markdown_percentage ?? null;

    for (const item of items) {
      // First attempt: lookup by variant ID directly
      let result = await tx.execute<VariantPricingRow>(sql`
        SELECT
          pv.id as variant_id, pv.product_id, pv.sku,
          pv.stock as variant_stock, pv.price_modifier,
          p.base_price, p.discounted_price, p.campaign_price,
          p.campaign_start_at, p.campaign_end_at, p.wholesale_price
        FROM product_variants pv
        INNER JOIN products p ON p.id = pv.product_id
        WHERE pv.id = ${item.variantId} AND p.is_active = true
        LIMIT 1
      `);

      // Fallback: the client may have sent a product ID instead of a variant ID.
      // Resolve to the product's first available variant.
      if (result.rows.length === 0) {
        result = await tx.execute<VariantPricingRow>(sql`
          SELECT
            pv.id as variant_id, pv.product_id, pv.sku,
            pv.stock as variant_stock, pv.price_modifier,
            p.base_price, p.discounted_price, p.campaign_price,
            p.campaign_start_at, p.campaign_end_at, p.wholesale_price
          FROM product_variants pv
          INNER JOIN products p ON p.id = pv.product_id
          WHERE pv.product_id = ${item.variantId} AND p.is_active = true
          ORDER BY pv.stock DESC
          LIMIT 1
        `);
      }

      // Last resort: an active product with no variant rows at all (variants are
      // only created when the admin defines attributes). Lazily create its
      // default variant — same pattern as admin fullUpdateProduct — then retry.
      if (result.rows.length === 0) {
        const created = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO product_variants (product_id, sku, stock, price_modifier)
          SELECT
            p.id,
            CASE
              WHEN p.sku IS NOT NULL
                AND NOT EXISTS (SELECT 1 FROM product_variants x WHERE x.sku = p.sku)
              THEN p.sku
              ELSE 'PV-' || p.id::text
            END,
            p.stock,
            '0'
          FROM products p
          WHERE p.id = ${item.variantId}
            AND p.is_active = true
            AND NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id)
          RETURNING id
        `);

        if (created.rows.length > 0) {
          this.logger.log(
            `Auto-created default variant ${created.rows[0].id} for variant-less product ${item.variantId}`,
          );
          result = await tx.execute<VariantPricingRow>(sql`
            SELECT
              pv.id as variant_id, pv.product_id, pv.sku,
              pv.stock as variant_stock, pv.price_modifier,
              p.base_price, p.discounted_price, p.campaign_price,
              p.campaign_start_at, p.campaign_end_at, p.wholesale_price
            FROM product_variants pv
            INNER JOIN products p ON p.id = pv.product_id
            WHERE pv.id = ${created.rows[0].id}
            LIMIT 1
          `);
        }
      }

      const row = result.rows[0];
      if (!row) {
        this.logger.warn(`Checkout rejected: variant ${item.variantId} not found or product inactive`);
        throw new BadRequestException("یکی از محصولات سبد خرید موجود نیست یا غیرفعال شده است. لطفاً سبد خرید خود را به‌روزرسانی کنید.");
      }

      if (row.variant_stock < item.quantity) {
        throw new ConflictException(`Insufficient stock for variant ${row.sku}`);
      }

      const unitPriceRials = computeEffectivePrice(row, wholesaleMarkdown);
      const totalPriceRials = unitPriceRials * item.quantity;

      resolved.push({
        productId: row.product_id,
        variantId: row.variant_id,
        sku: row.sku,
        quantity: item.quantity,
        unitPrice: toRialString(unitPriceRials),
        totalPrice: toRialString(totalPriceRials),
        totalPriceRials,
      });
    }

    return resolved;
  }

  /**
   * Atomically decrement stock — single UPDATE per variant with WHERE stock >= N.
   */
  private async decrementStockAtomically(
    tx: Parameters<Parameters<NodePgDatabase["transaction"]>[0]>[0],
    items: CheckoutItemDto[],
  ): Promise<void> {
    for (const item of items) {
      const result = await tx.execute<{ stock: number } & Record<string, unknown>>(sql`
        UPDATE product_variants
        SET stock = stock - ${item.quantity}, updated_at = NOW()
        WHERE id = ${item.variantId} AND stock >= ${item.quantity}
        RETURNING stock
      `);

      if (result.rows.length === 0) {
        throw new ConflictException(
          `Insufficient stock for variant ${item.variantId} — concurrent reservation conflict`,
        );
      }
    }
  }
}
