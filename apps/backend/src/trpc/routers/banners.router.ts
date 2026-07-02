import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

interface BannerRow extends Record<string, unknown> {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  placement_key: string;
  display_order: number;
}

/**
 * Banners tRPC router — serves dynamic placement-based banner assets.
 */
export function createBannersRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get active banners by placement key.
     * Filters by active status + optional date range (startsAt/endsAt).
     */
    getByPlacement: publicProcedure
      .input(z.object({ placementKey: z.string().max(128) }))
      .query(async ({ input }) => {
        const result = await db.execute<BannerRow>(sql`
          SELECT id, title, image_url, link_url, placement_key, display_order
          FROM banners
          WHERE placement_key = ${input.placementKey}
            AND is_active = true
            AND (starts_at IS NULL OR starts_at <= NOW())
            AND (ends_at IS NULL OR ends_at > NOW())
          ORDER BY display_order ASC
          LIMIT 10
        `);

        return {
          banners: result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            imageUrl: row.image_url,
            linkUrl: row.link_url,
            placementKey: row.placement_key,
          })),
        };
      }),
  });
}

export type BannersRouter = ReturnType<typeof createBannersRouter>;
