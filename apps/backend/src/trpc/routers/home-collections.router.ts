import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { publicProcedure, router } from "../trpc.init";

interface SliderProductRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  base_price: string;
  discounted_price: string | null;
  grade: string;
  stock: number;
  thumbnail_url: string | null;
}

/**
 * Home Collections tRPC router — serves filtered product arrays
 * for homepage carousel sliders.
 */
export function createHomeCollectionsRouter(db: NodePgDatabase) {
  return router({
    /**
     * Returns 3 product slider collections for homepage rendering:
     * - hotDeals: products with active discounts
     * - openBox: open_box / like_new grade products
     * - premium: highest-price in-stock components
     */
    getSliderCollections: publicProcedure.query(async () => {
      // Hot Deals — products with discounted_price set
      const hotDealsResult = await db.execute<SliderProductRow>(sql`
        SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.discounted_price,
               p.grade, p.stock, (
                 SELECT m.url FROM product_media pm
                 INNER JOIN media m ON m.id = pm.media_id
                 WHERE pm.product_id = p.id
                 ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1
               ) as thumbnail_url
        FROM products p
        WHERE p.is_active = true
          AND p.discounted_price IS NOT NULL
          AND p.stock > 0
        ORDER BY p.updated_at DESC
        LIMIT 12
      `);

      // Open-Box Laptops — open_box, like_new grades
      const openBoxResult = await db.execute<SliderProductRow>(sql`
        SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.discounted_price,
               p.grade, p.stock, (
                 SELECT m.url FROM product_media pm
                 INNER JOIN media m ON m.id = pm.media_id
                 WHERE pm.product_id = p.id
                 ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1
               ) as thumbnail_url
        FROM products p
        WHERE p.is_active = true
          AND p.grade IN ('open_box', 'like_new')
          AND p.stock > 0
        ORDER BY p.updated_at DESC
        LIMIT 12
      `);

      // Premium Components — highest-priced in-stock items
      const premiumResult = await db.execute<SliderProductRow>(sql`
        SELECT p.id, p.name, p.slug, p.short_description, p.base_price, p.discounted_price,
               p.grade, p.stock, (
                 SELECT m.url FROM product_media pm
                 INNER JOIN media m ON m.id = pm.media_id
                 WHERE pm.product_id = p.id
                 ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1
               ) as thumbnail_url
        FROM products p
        WHERE p.is_active = true
          AND p.stock > 0
        ORDER BY p.base_price::numeric DESC
        LIMIT 12
      `);

      const mapRow = (row: SliderProductRow) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        shortDescription: row.short_description,
        basePrice: row.base_price,
        discountedPrice: row.discounted_price,
        grade: row.grade,
        stock: row.stock,
        thumbnailUrl: row.thumbnail_url,
      });

      return {
        hotDeals: hotDealsResult.rows.map(mapRow),
        openBox: openBoxResult.rows.map(mapRow),
        premium: premiumResult.rows.map(mapRow),
      };
    }),
  });
}

export type HomeCollectionsRouter = ReturnType<typeof createHomeCollectionsRouter>;
