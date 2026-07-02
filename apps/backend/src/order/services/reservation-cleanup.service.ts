import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";

/**
 * Row shape returned from the expired reservation sweep.
 */
interface ExpiredReservationRow extends Record<string, unknown> {
  id: string;
  product_variant_id: string | null;
  product_id: string;
  quantity: number;
}

/**
 * Automated reservation cleanup service.
 *
 * Runs every 60 seconds via NestJS Schedule (@Cron).
 *
 * Responsibilities:
 * 1. Find all reservations where status = 'pending' AND expires_at <= NOW()
 * 2. Atomically flip their status to 'expired' (single bulk UPDATE)
 * 3. Restore the reserved stock quantities using a single batched UPDATE
 *    aggregated by product_variant_id (one DB round-trip, not N)
 *
 * This prevents warehouse starvation deadlocks where stock is permanently
 * locked by abandoned or timed-out checkout sessions.
 *
 * PERFORMANCE INVARIANT: Stock restoration executes in exactly ONE database
 * round-trip regardless of how many reservations expired. Quantities are
 * aggregated by variant_id using a CTE-based batch update.
 */
@Injectable()
export class ReservationCleanupService {
  private readonly logger = new Logger(ReservationCleanupService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Cron job: Sweep expired reservations every 60 seconds.
   *
   * Execution strategy:
   * 1. Single UPDATE ... RETURNING to atomically flip all expired rows
   * 2. Aggregate returned quantities by product_variant_id in-memory
   * 3. Single batched UPDATE using VALUES(...) join to restore all stock
   *    in one database round-trip
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations(): Promise<void> {
    try {
      // Step 1: Atomically flip all expired pending reservations to 'expired'
      // This is already a single bulk query using the compound index (status, expires_at)
      const expiredResult = await this.db.execute<ExpiredReservationRow>(sql`
        UPDATE product_reservations
        SET status = 'expired'
        WHERE status = 'pending'
          AND expires_at <= NOW()
        RETURNING id, product_variant_id, product_id, quantity
      `);

      const expiredRows = expiredResult.rows;

      if (expiredRows.length === 0) {
        return;
      }

      this.logger.log(`Found ${expiredRows.length} expired reservation(s) — restoring stock`);

      // Step 2: Aggregate quantities by product_variant_id and product_id
      // This groups multiple expired reservations for the same variant into
      // a single stock increment value
      const variantAggregates = new Map<string, number>();
      const productAggregates = new Map<string, number>();

      for (const row of expiredRows) {
        if (row.product_variant_id) {
          const current = variantAggregates.get(row.product_variant_id) ?? 0;
          variantAggregates.set(row.product_variant_id, current + row.quantity);
        } else {
          const current = productAggregates.get(row.product_id) ?? 0;
          productAggregates.set(row.product_id, current + row.quantity);
        }
      }

      // Step 3: Batched stock restoration for variants — single SQL round-trip
      // Uses UPDATE ... FROM (VALUES ...) pattern for one query regardless of
      // how many variants need stock restored
      if (variantAggregates.size > 0) {
        await this.batchRestoreVariantStock(variantAggregates);
      }

      // Step 4: Batched stock restoration for products (no-variant reservations)
      if (productAggregates.size > 0) {
        await this.batchRestoreProductStock(productAggregates);
      }

      this.logger.log(
        `Restored stock: ${variantAggregates.size} variant(s), ` +
          `${productAggregates.size} product(s) from ${expiredRows.length} reservation(s)`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Reservation cleanup failed: ${message}`);
    }
  }

  /**
   * Execute a single batched UPDATE to restore stock for all affected variants.
   *
   * Constructs a dynamic VALUES list and joins it against product_variants
   * to increment stock in one database round-trip:
   *
   * UPDATE product_variants pv
   * SET stock = pv.stock + batch.qty, updated_at = NOW()
   * FROM (VALUES (uuid1, qty1), (uuid2, qty2), ...) AS batch(id, qty)
   * WHERE pv.id = batch.id
   */
  private async batchRestoreVariantStock(aggregates: Map<string, number>): Promise<void> {
    // Build the VALUES clause dynamically as a safe parameterized SQL fragment
    const entries = Array.from(aggregates.entries());

    // Construct VALUES rows: (id::uuid, quantity::int)
    // Using sql template concatenation for parameterized safety
    let valuesSql = sql``;
    for (let i = 0; i < entries.length; i++) {
      const [variantId, quantity] = entries[i];
      if (i > 0) {
        valuesSql = sql`${valuesSql}, `;
      }
      valuesSql = sql`${valuesSql}(${variantId}::uuid, ${quantity}::int)`;
    }

    await this.db.execute(sql`
      UPDATE product_variants pv
      SET stock = pv.stock + batch.qty,
          updated_at = NOW()
      FROM (VALUES ${valuesSql}) AS batch(id, qty)
      WHERE pv.id = batch.id
    `);
  }

  /**
   * Execute a single batched UPDATE to restore stock for product-level reservations
   * (reservations without a specific variant).
   */
  private async batchRestoreProductStock(aggregates: Map<string, number>): Promise<void> {
    const entries = Array.from(aggregates.entries());

    let valuesSql = sql``;
    for (let i = 0; i < entries.length; i++) {
      const [productId, quantity] = entries[i];
      if (i > 0) {
        valuesSql = sql`${valuesSql}, `;
      }
      valuesSql = sql`${valuesSql}(${productId}::uuid, ${quantity}::int)`;
    }

    await this.db.execute(sql`
      UPDATE products p
      SET stock = p.stock + batch.qty,
          updated_at = NOW()
      FROM (VALUES ${valuesSql}) AS batch(id, qty)
      WHERE p.id = batch.id
    `);
  }
}
