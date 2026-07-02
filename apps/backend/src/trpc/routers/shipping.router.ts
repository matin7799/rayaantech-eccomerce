import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { publicProcedure, router } from "../trpc.init";

/**
 * Row shape from shipping_methods query.
 */
interface ShippingMethodRow extends Record<string, unknown> {
  id: string;
  name_fa: string;
  code: string;
  base_cost: string;
  estimated_days: string | null;
  is_cargo_collect: boolean;
  sort_order: number;
}

/**
 * Shipping tRPC router — public read-only access to active methods.
 *
 * Used by the checkout ShippingSelector component to display
 * available delivery channels with live pricing.
 */
export function createShippingRouter(db: NodePgDatabase) {
  return router({
    /**
     * List all active shipping methods ordered by sort_order.
     * Returns only methods with is_active = true.
     */
    listActiveMethods: publicProcedure.query(async () => {
      const result = await db.execute<ShippingMethodRow>(sql`
        SELECT id, name_fa, code, base_cost, estimated_days, is_cargo_collect, sort_order
        FROM shipping_methods
        WHERE is_active = true
        ORDER BY sort_order ASC
      `);

      return result.rows.map((row) => ({
        id: row.id,
        nameFa: row.name_fa,
        code: row.code,
        baseCost: parseInt(row.base_cost, 10),
        estimatedDays: row.estimated_days,
        isCargoCollect: row.is_cargo_collect ?? false,
      }));
    }),
  });
}

export type ShippingRouter = ReturnType<typeof createShippingRouter>;
