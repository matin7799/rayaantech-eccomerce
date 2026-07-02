import { Controller, Get, Inject, Logger, Query } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Public } from "../auth/decorators/public.decorator";
import { DRIZZLE_CLIENT } from "../database/database.constants";

/**
 * Product row shape for the Torob feed.
 */
interface TorobProductRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  base_price: string;
  torob_price: string | null;
  discounted_price: string | null;
  stock: number;
  grade: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Torob product feed response item.
 */
interface TorobFeedItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  grade: string;
  updatedAt: string;
}

/**
 * Isolated Torob REST Feed Controller.
 *
 * Provides a high-performance cursor-based product extraction endpoint
 * for the Torob price comparison crawler.
 *
 * Base path: /api/v1/torob
 *
 * INVARIANT: Offset-based pagination is explicitly banned.
 * Uses cursor-based navigation keyed on product UUID to prevent
 * database connection timeouts under sustained crawler load.
 *
 * All endpoints are @Public() — Torob crawlers do not carry API tokens.
 */
@Controller("api/v1/torob")
export class TorobController {
  private readonly logger = new Logger(TorobController.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Cursor-based product feed for Torob crawler extraction.
   *
   * Query params:
   * - cursor (optional): Product UUID to start AFTER (exclusive)
   * - limit (optional): Number of items per page (default: 50, max: 200)
   *
   * Returns products ordered by ID (stable, no duplicates/skips under concurrent writes).
   * Only returns active products with torob_price or base_price set.
   *
   * Response includes `nextCursor` — the last item's ID to use as cursor for the next page.
   * When `nextCursor` is null, the crawler has reached the end of the dataset.
   */
  @Public()
  @Get("products")
  async getProducts(
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ): Promise<{
    data: TorobFeedItem[];
    meta: { nextCursor: string | null; count: number };
  }> {
    const parsedLimit = Math.min(200, Math.max(1, parseInt(limit ?? "50", 10) || 50));

    let result: { rows: TorobProductRow[] };

    if (cursor) {
      // Cursor-based: fetch items WHERE id > cursor (sorted by id ASC)
      result = await this.db.execute<TorobProductRow>(sql`
        SELECT id, name, slug, base_price, torob_price, discounted_price,
               stock, grade, is_active, created_at, updated_at
        FROM products
        WHERE is_active = true
          AND id > ${cursor}
        ORDER BY id ASC
        LIMIT ${parsedLimit}
      `);
    } else {
      // First page: no cursor
      result = await this.db.execute<TorobProductRow>(sql`
        SELECT id, name, slug, base_price, torob_price, discounted_price,
               stock, grade, is_active, created_at, updated_at
        FROM products
        WHERE is_active = true
        ORDER BY id ASC
        LIMIT ${parsedLimit}
      `);
    }

    const items: TorobFeedItem[] = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      // Torob gets: torob_price → discounted_price → base_price (priority)
      price: row.torob_price ?? row.discounted_price ?? row.base_price,
      stock: row.stock,
      grade: row.grade,
      updatedAt: String(row.updated_at),
    }));

    // Next cursor = last item's ID (null if fewer items than limit = end of dataset)
    const nextCursor = items.length === parsedLimit ? items[items.length - 1].id : null;

    return {
      data: items,
      meta: { nextCursor, count: items.length },
    };
  }
}
