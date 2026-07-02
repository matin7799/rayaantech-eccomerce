import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { coerceDisplayTier, resolveProductPrice } from "../../../pricing/pricing.service";
import type { ProductPriceRow, ResolvedPrice } from "../../../pricing/pricing.types";
import { protectedProcedure, router } from "../../trpc.init";

/**
 * Shape returned by the wishlist list query.
 * Matches the ProductCardData interface on the frontend.
 */
interface WishlistProductRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  base_price: string;
  discounted_price: string | null;
  torob_price: string | null;
  grade: string;
  stock: number;
  category_id: string;
  brand_id: string | null;
  thumbnail_url: string | null;
  in_stock: boolean;
  wishlisted_at: string;
}

/**
 * Profile Wishlist sub-router.
 *
 * Manages user wishlist items stored in the `user_wishlist_items` table.
 * Provides a paginated list query and a toggle mutation.
 */
export function createProfileWishlistRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get paginated wishlist items for the authenticated user.
     * Joins with the products table to return full card data.
     */
    getWishlist: protectedProcedure
      .input(
        z
          .object({
            limit: z.number().min(1).max(50).default(20),
            offset: z.number().min(0).default(0),
          })
          .optional(),
      )
      .query(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;
        const limit = input?.limit ?? 20;
        const offset = input?.offset ?? 0;

        try {
          const result = await db.execute<WishlistProductRow>(sql`
            SELECT
              p.id,
              p.name,
              p.slug,
              p.base_price,
              p.discounted_price,
              p.torob_price,
              p.grade,
              p.stock,
              p.primary_category_id AS category_id,
              p.brand_id,
              (SELECT m.url FROM product_media pm INNER JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1) AS thumbnail_url,
              (p.stock > 0) AS in_stock,
              w.created_at AS wishlisted_at
            FROM user_wishlist_items w
            INNER JOIN products p ON p.id = w.product_id
            WHERE w.user_id = ${userId}
            ORDER BY w.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `);

          // Total count for pagination metadata
          const countResult = await db.execute<{ total: string } & Record<string, unknown>>(sql`
            SELECT COUNT(*)::text AS total
            FROM user_wishlist_items
            WHERE user_id = ${userId}
          `);

          const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

          return {
            items: result.rows.map((row) => {
              const priceRow: ProductPriceRow = {
                base_price: row.base_price,
                discounted_price: row.discounted_price,
                torob_price: row.torob_price,
                wholesale_price: null,
                campaign_price: null,
                campaign_start_at: null,
                campaign_end_at: null,
              };
              const resolved: ResolvedPrice = resolveProductPrice(priceRow, ctx.buyer);
              return {
                id: row.id,
                name: row.name,
                slug: row.slug,
                grade: row.grade,
                stock: row.stock,
                categoryId: row.category_id,
                brandId: row.brand_id,
                thumbnailUrl: row.thumbnail_url,
                inStock: row.in_stock,
                effectivePrice: resolved.effectivePrice,
                displayBaseline: resolved.displayBaseline,
                discountPercent: resolved.discountPercent,
                pricingTier: coerceDisplayTier(resolved.pricingTier, ctx.buyer),
                wishlistedAt: row.wishlisted_at,
              };
            }),
            total,
            hasMore: offset + limit < total,
          };
        } catch (err: unknown) {
          const pgError = err as { code?: string; message?: string };
          if (pgError.code === "42P01") {
            // Table doesn't exist yet — return empty list gracefully
            console.warn("[getWishlist] user_wishlist_items table not found — run migration 0003");
            return { items: [], total: 0, hasMore: false };
          }
          throw err;
        }
      }),

    /**
     * Toggle a product in the user's wishlist.
     * If the product is already wishlisted, it removes it.
     * If not, it adds it.
     * Returns the new state (wishlisted: true/false).
     */
    toggleWishlist: protectedProcedure
      .input(z.object({ productId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;
        const { productId } = input;

        try {
          // Check if already wishlisted
          const existing = await db.execute<{ id: string } & Record<string, unknown>>(sql`
            SELECT id FROM user_wishlist_items
            WHERE user_id = ${userId} AND product_id = ${productId}
            LIMIT 1
          `);

          if (existing.rows.length > 0) {
            // Remove from wishlist
            await db.execute(sql`
              DELETE FROM user_wishlist_items
              WHERE user_id = ${userId} AND product_id = ${productId}
            `);
            return { wishlisted: false, productId };
          }

          // Add to wishlist
          await db.execute(sql`
            INSERT INTO user_wishlist_items (user_id, product_id, created_at)
            VALUES (${userId}, ${productId}, NOW())
            ON CONFLICT (user_id, product_id) DO NOTHING
          `);

          return { wishlisted: true, productId };
        } catch (err: unknown) {
          const pgError = err as { code?: string; message?: string };
          if (pgError.code === "42P01") {
            console.warn(
              "[toggleWishlist] user_wishlist_items table not found — run migration 0003",
            );
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "جدول علاقه‌مندی‌ها هنوز ایجاد نشده. لطفاً migration را اجرا کنید.",
            });
          }
          throw err;
        }
      }),
  });
}

export type ProfileWishlistRouter = ReturnType<typeof createProfileWishlistRouter>;
