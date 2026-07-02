import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

// ─── Persian/Arabic Numeral Normalization ────────────────────────────────────

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Normalize a search query for locale-agnostic matching.
 *
 * Steps:
 * 1. Convert Persian digits (۰-۹) to ASCII (0-9)
 * 2. Convert Arabic digits (٠-٩) to ASCII (0-9)
 * 3. Collapse excessive whitespace into single spaces
 * 4. Trim leading/trailing whitespace
 *
 * INVARIANT: Searching "۳۱۱۲" produces identical results to "3112".
 */
function normalizeSearchQuery(input: string): string {
  let result = "";
  for (const char of input) {
    const persianIdx = PERSIAN_DIGITS.indexOf(char);
    if (persianIdx !== -1) {
      result += persianIdx.toString();
      continue;
    }
    const arabicIdx = ARABIC_DIGITS.indexOf(char);
    if (arabicIdx !== -1) {
      result += arabicIdx.toString();
      continue;
    }
    result += char;
  }
  return result.replace(/\s+/g, " ").trim();
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchResultRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  base_price: string;
  grade: string;
  stock: number;
}

// ─── Router ──────────────────────────────────────────────────────────────────

/**
 * Search tRPC router — real-time product search with ILIKE matching.
 *
 * Searches across: products.name, products.sku, products.short_description.
 * Normalizes Persian/Arabic digits to ASCII before query compilation.
 * Returns lightweight product previews for autocomplete dropdown.
 */
export function createSearchRouter(db: NodePgDatabase) {
  return router({
    /**
     * Search products by name, SKU, or short description.
     * Numeral-normalized ILIKE with prefix priority sorting.
     * Limited to 7 results for autocomplete performance.
     */
    query: publicProcedure
      .input(z.object({ q: z.string().min(2).max(100) }))
      .query(async ({ input }) => {
        // Normalize: convert Persian/Arabic digits → ASCII, collapse whitespace
        const normalized = normalizeSearchQuery(input.q);

        // Escape ILIKE wildcard characters to prevent unintended pattern matching
        const escaped = normalized.replace(/[%_\\]/g, "\\$&");
        const term = `%${escaped}%`;
        const prefixTerm = `${escaped}%`;

        const result = await db.execute<SearchResultRow>(sql`
          SELECT id, name, slug, sku, base_price, grade, stock
          FROM products
          WHERE is_active = true
            AND (
              name ILIKE ${term}
              OR sku ILIKE ${term}
              OR short_description ILIKE ${term}
            )
          ORDER BY
            CASE WHEN sku ILIKE ${prefixTerm} THEN 0
                 WHEN name ILIKE ${prefixTerm} THEN 1
                 ELSE 2
            END,
            stock DESC,
            created_at DESC
          LIMIT 7
        `);

        return {
          results: result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            sku: row.sku,
            basePrice: row.base_price,
            grade: row.grade,
            inStock: row.stock > 0,
          })),
        };
      }),
  });
}

export type SearchRouter = ReturnType<typeof createSearchRouter>;
