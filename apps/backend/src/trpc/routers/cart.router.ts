import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

/**
 * Cart tRPC router — server-side stock validation for add-to-cart operations.
 *
 * Security invariant: Stock availability is ALWAYS verified server-side
 * before any cart mutation is accepted. This prevents overselling via
 * race conditions or client-side spoofing.
 */
export function createCartRouter(db: NodePgDatabase) {
  return router({
    /**
     * Bulk validate catalog inventory for all items in the client-side cart.
     *
     * Called silently before transitioning to /checkout to intercept
     * any expired local client state (price drift, out-of-stock, inactive).
     *
     * Returns per-item availability + current server-side pricing.
     */
    validateCatalogInventory: publicProcedure
      .input(
        z.object({
          items: z
            .array(
              z.object({
                productId: z.string().uuid(),
                variantId: z.string().uuid(),
                quantity: z.number().int().min(1).max(10),
              }),
            )
            .min(1)
            .max(30),
        }),
      )
      .mutation(async ({ input }) => {
        const results: Array<{
          variantId: string;
          available: boolean;
          currentStock: number;
          currentPrice: number;
          reason?: string;
        }> = [];

        for (const item of input.items) {
          const result = await db.execute<
            {
              variant_stock: number;
              base_price: string;
              discounted_price: string | null;
              is_active: boolean;
            } & Record<string, unknown>
          >(
            sql`
              SELECT pv.stock AS variant_stock, p.base_price, p.discounted_price, p.is_active
              FROM product_variants pv
              INNER JOIN products p ON p.id = pv.product_id
              WHERE pv.id = ${item.variantId} AND pv.product_id = ${item.productId}
              LIMIT 1
            `,
          );

          const row = result.rows[0];
          if (!row) {
            results.push({
              variantId: item.variantId,
              available: false,
              currentStock: 0,
              currentPrice: 0,
              reason: "محصول یافت نشد",
            });
            continue;
          }

          if (!row.is_active) {
            results.push({
              variantId: item.variantId,
              available: false,
              currentStock: 0,
              currentPrice: 0,
              reason: "محصول غیرفعال شده است",
            });
            continue;
          }

          const stock = row.variant_stock;
          const price = parseInt(row.discounted_price ?? row.base_price, 10);

          results.push({
            variantId: item.variantId,
            available: stock >= item.quantity,
            currentStock: stock,
            currentPrice: price,
            reason: stock < item.quantity ? "موجودی ناکافی" : undefined,
          });
        }

        const allValid = results.every((r) => r.available);
        return { valid: allValid, items: results };
      }),

    /**
     * Add item to cart with atomic stock validation.
     *
     * Steps:
     * 1. Fetch current stock from products table (or variant if variantId provided)
     * 2. Compare requested quantity against available stock
     * 3. Throw StockLimitExceeded if insufficient
     * 4. Return confirmed availability (actual decrement happens at checkout)
     *
     * Note: We validate but don't decrement here — true stock reservation
     * happens at order placement via product_reservations table.
     */
    addToCart: publicProcedure
      .input(
        z.object({
          productId: z.string().uuid(),
          variantId: z.string().uuid().optional(),
          quantity: z.number().int().min(1).max(10),
        }),
      )
      .mutation(async ({ input }) => {
        const { productId, variantId, quantity } = input;

        // Fetch current stock level
        let availableStock: number;

        if (variantId) {
          // Check variant-level stock
          const result = await db.execute<{ stock: number } & Record<string, unknown>>(
            sql`SELECT stock FROM product_variants WHERE id = ${variantId} AND product_id = ${productId} LIMIT 1`,
          );
          const row = result.rows[0];
          if (!row) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "محصول مورد نظر یافت نشد",
            });
          }
          availableStock = row.stock;
        } else {
          // Check product-level stock
          const result = await db.execute<
            { stock: number; is_active: boolean } & Record<string, unknown>
          >(sql`SELECT stock, is_active FROM products WHERE id = ${productId} LIMIT 1`);
          const row = result.rows[0];
          if (!(row && row.is_active)) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "محصول مورد نظر یافت نشد یا غیرفعال است",
            });
          }
          availableStock = row.stock;
        }

        // Stock guard — reject if insufficient
        if (availableStock < quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "تعداد درخواستی بیشتر از موجودی انبار است",
            cause: {
              type: "StockLimitExceeded",
              available: availableStock,
              requested: quantity,
            },
          });
        }

        return {
          success: true,
          productId,
          variantId: variantId ?? null,
          quantity,
          availableStock,
        };
      }),
  });
}

export type CartRouter = ReturnType<typeof createCartRouter>;
