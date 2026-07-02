import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

/**
 * Story row shape from the active stories query.
 */
interface StoryRow extends Record<string, unknown> {
  id: string;
  title: string;
  media_url: string;
  product_id: string | null;
  created_at: string;
}

/**
 * Product stock row for story-linked inventory check.
 */
interface ProductStockRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  base_price: string;
  stock: number;
  primary_category_id: string;
}

/**
 * Stories tRPC router.
 * Serves active shoppable stories (non-expired, max 50) with linked product data.
 */
export function createStoriesRouter(db: NodePgDatabase) {
  return router({
    /**
     * List active stories (not expired, ordered by newest first).
     * Returns up to 50 stories with their linked product's stock status.
     */
    list: publicProcedure.query(async () => {
      const result = await db.execute<StoryRow>(sql`
        SELECT id, title, media_url, product_id, created_at
        FROM shoppable_stories
        WHERE is_active = true AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 50
      `);

      // Collect product IDs for batch stock lookup
      const productIds = result.rows
        .map((r) => r.product_id)
        .filter((id): id is string => id !== null);

      const uniqueProductIds = [...new Set(productIds)];
      const productMap = new Map<string, ProductStockRow>();

      if (uniqueProductIds.length > 0) {
        const productsResult = await db.execute<ProductStockRow>(sql`
          SELECT id, name, slug, base_price, stock, primary_category_id
          FROM products
          WHERE id IN (${sql.join(
            uniqueProductIds.map((id) => sql`${id}`),
            sql.raw(", "),
          )})
            AND is_active = true
        `);
        for (const row of productsResult.rows) {
          productMap.set(row.id, row);
        }
      }

      const stories = result.rows.map((row) => {
        const product = row.product_id ? (productMap.get(row.product_id) ?? null) : null;
        return {
          id: row.id,
          title: row.title,
          mediaUrl: row.media_url,
          productId: row.product_id,
          product: product
            ? {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.base_price,
                stock: product.stock,
                inStock: product.stock > 0,
                categoryId: product.primary_category_id,
              }
            : null,
        };
      });

      return { stories };
    }),

    /**
     * Get a single story by ID with full product stock details.
     */
    byId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
      const result = await db.execute<StoryRow>(sql`
          SELECT id, title, media_url, product_id, created_at
          FROM shoppable_stories
          WHERE id = ${input.id} AND is_active = true AND expires_at > NOW()
          LIMIT 1
        `);

      const row = result.rows[0];
      if (!row) return { story: null };

      let product: ProductStockRow | null = null;
      if (row.product_id) {
        const pResult = await db.execute<ProductStockRow>(sql`
            SELECT id, name, slug, base_price, stock, primary_category_id
            FROM products WHERE id = ${row.product_id} AND is_active = true
            LIMIT 1
          `);
        product = pResult.rows[0] ?? null;
      }

      return {
        story: {
          id: row.id,
          title: row.title,
          mediaUrl: row.media_url,
          productId: row.product_id,
          product: product
            ? {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.base_price,
                stock: product.stock,
                inStock: product.stock > 0,
                categoryId: product.primary_category_id,
              }
            : null,
        },
      };
    }),
  });
}

export type StoriesRouter = ReturnType<typeof createStoriesRouter>;
