/**
 * sync-products.ts — Product catalog migration from legacy API.
 *
 * Fetches paginated products from localhost:3002, normalizes pricing
 * to integer Tomans, maps categories via junction table, upserts brands.
 *
 * Usage: DATABASE_URL=... npx tsx packages/db/src/seed/sync-products.ts
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { normalizeGrade, normalizePriceTomans } from "./normalize";

const LEGACY_BASE = "http://localhost:3002/api/v1";

// ─── Types (matching actual API response) ────────────────────────────────────

interface ApiResponse {
  success: boolean;
  data: {
    data: LegacyProduct[];
    meta?: { total?: number; page?: number; totalPages?: number };
  };
}

interface LegacyProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  stockQuantity?: number;
  isActive?: boolean;
  brand?: { id: string; name: string; slug: string } | null;
  categories?: Array<{ id: string; name: string; slug: string }>;
  pricing?: {
    basePrice?: number | string;
    salePrice?: number | string;
    isOnSale?: boolean;
  };
  createdAt?: string;
}

// ─── Brand Upsert ────────────────────────────────────────────────────────────

async function upsertBrand(
  db: ReturnType<typeof drizzle>,
  brand: { id: string; name: string; slug: string },
): Promise<string> {
  await db.execute(sql`
    INSERT INTO brands (id, name, slug)
    VALUES (${brand.id}, ${brand.name}, ${brand.slug})
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  `);
  return brand.id;
}

// ─── Category Junction ───────────────────────────────────────────────────────

async function linkCategories(
  db: ReturnType<typeof drizzle>,
  productId: string,
  primaryCatId: string,
  categories: Array<{ id: string }>,
): Promise<void> {
  for (const cat of categories) {
    if (cat.id === primaryCatId) continue; // primary is in products table
    await db.execute(sql`
      INSERT INTO product_secondary_categories (product_id, category_id)
      VALUES (${productId}, ${cat.id})
      ON CONFLICT (product_id, category_id) DO NOTHING
    `);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);
  console.log("✓ Connected to PostgreSQL");

  let page = 1;
  let totalSynced = 0;
  let totalSkipped = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`\nFetching page ${page}...`);
      const res = await fetch(`${LEGACY_BASE}/catalog/products?page=${page}&limit=50`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as ApiResponse;
      const products = json.data?.data ?? [];

      if (products.length === 0) {
        hasMore = false;
        break;
      }

      for (const prod of products) {
        // Normalize pricing (integer Tomans)
        const basePrice = normalizePriceTomans(prod.pricing?.basePrice);
        const salePrice = normalizePriceTomans(prod.pricing?.salePrice);
        const stock = Math.max(0, prod.stockQuantity ?? 0);
        const grade = normalizeGrade(undefined); // API doesn't expose grade — default 'stock'

        // Primary category = first category in array
        const primaryCatId = prod.categories?.[0]?.id ?? null;
        if (!primaryCatId) {
          console.warn(`  ⚠ Skip "${prod.name.slice(0, 40)}" — no category`);
          totalSkipped++;
          continue;
        }

        // Upsert brand if present
        let brandId: string | null = null;
        if (prod.brand) {
          brandId = await upsertBrand(db, prod.brand);
        }

        // Compute discounted price (only if sale < base)
        const discounted = salePrice > 0 && salePrice < basePrice ? salePrice : 0;

        // Upsert product
        await db.execute(sql`
          INSERT INTO products (
            id, name, slug, description, primary_category_id, brand_id,
            grade, base_price, discounted_price, stock, is_active
          ) VALUES (
            ${prod.id}, ${prod.name}, ${prod.slug}, ${prod.description ?? ""},
            ${primaryCatId}, ${brandId},
            ${grade}, ${String(basePrice)},
            ${discounted > 0 ? String(discounted) : null},
            ${stock}, ${prod.isActive ?? true}
          )
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            base_price = EXCLUDED.base_price,
            discounted_price = EXCLUDED.discounted_price,
            stock = EXCLUDED.stock,
            is_active = EXCLUDED.is_active,
            brand_id = EXCLUDED.brand_id,
            updated_at = NOW()
        `);

        // Link all categories via junction table
        if (prod.categories && prod.categories.length > 1) {
          await linkCategories(db, prod.id, primaryCatId, prod.categories);
        }

        totalSynced++;
      }

      // Check if there's more pages
      const meta = json.data?.meta;
      if (meta?.totalPages && page >= meta.totalPages) {
        hasMore = false;
      } else if (products.length < 50) {
        hasMore = false;
      } else {
        page++;
      }
    }

    console.log(`\n═══════════════════════════════════════`);
    console.log(`✓ Products synced: ${totalSynced}`);
    console.log(`✗ Skipped: ${totalSkipped}`);
    console.log(`  Pages fetched: ${page}`);
    console.log(`═══════════════════════════════════════`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Product sync failed:", err);
  process.exit(1);
});
