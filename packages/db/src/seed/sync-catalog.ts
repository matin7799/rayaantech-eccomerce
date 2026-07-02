/**
 * sync-catalog.ts — Idempotent catalog ingestion using Drizzle ORM.
 *
 * Fetches categories (tree) and products from local legacy API,
 * normalizes to integer Tomans, maps EAV attributes, and upserts
 * into Postgres via Drizzle's onConflictDoUpdate.
 *
 * Usage: DATABASE_URL=... npx tsx packages/db/src/seed/sync-catalog.ts
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { isOnSale, normalizeGrade, normalizePriceTomans, slugify } from "./normalize";

const LEGACY_BASE = "http://localhost:3002/api/v1";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LegacyCategory {
  id: string;
  name: string;
  slug?: string;
  children?: LegacyCategory[];
  parentId?: string | null;
}

interface LegacyAttribute {
  key: string;
  value: string;
}

interface LegacyProduct {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  grade?: string;
  basePrice?: string | number;
  salePrice?: string | number;
  wholesalePrice?: string | number;
  stock?: number;
  isActive?: boolean;
  attributes?: LegacyAttribute[];
}

// ─── Recursive Category Processing ──────────────────────────────────────────

/**
 * Recursively walk the category tree and upsert each node with correct parentId.
 * Processes depth-first to ensure parents exist before children.
 */
async function processCategories(
  db: ReturnType<typeof drizzle>,
  categories: LegacyCategory[],
  parentId: string | null,
): Promise<number> {
  let count = 0;

  for (const cat of categories) {
    const catSlug = cat.slug ?? slugify(cat.name);

    await db.execute(sql`
      INSERT INTO categories (id, name, slug, parent_id)
      VALUES (${cat.id}, ${cat.name}, ${catSlug}, ${parentId})
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        parent_id = EXCLUDED.parent_id
    `);
    count++;

    // Recurse into children
    if (cat.children && cat.children.length > 0) {
      count += await processCategories(db, cat.children, cat.id);
    }
  }

  return count;
}

// ─── EAV Attribute Mapping ───────────────────────────────────────────────────

/**
 * Upsert attribute key/value pairs and link them to a product variant.
 * Creates attribute_keys and attribute_values rows if they don't exist.
 */
async function mapProductAttributes(
  db: ReturnType<typeof drizzle>,
  productId: string,
  attributes: LegacyAttribute[],
): Promise<void> {
  for (const attr of attributes) {
    if (!(attr.key && attr.value)) continue;

    // Upsert attribute key
    const keyResult = await db.execute<{ id: string } & Record<string, unknown>>(sql`
      INSERT INTO attribute_keys (name)
      VALUES (${attr.key})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
    const keyId = keyResult.rows[0]?.id;
    if (!keyId) continue;

    // Upsert attribute value
    const valueResult = await db.execute<{ id: string } & Record<string, unknown>>(sql`
      INSERT INTO attribute_values (key_id, value)
      VALUES (${keyId}, ${attr.value})
      ON CONFLICT (key_id, value) DO UPDATE SET value = EXCLUDED.value
      RETURNING id
    `);
    const valueId = valueResult.rows[0]?.id;
    if (!valueId) continue;

    // Link to default variant (create if missing)
    const variantResult = await db.execute<{ id: string } & Record<string, unknown>>(sql`
      INSERT INTO product_variants (product_id, sku, stock, price_modifier)
      VALUES (${productId}, ${`${productId}-default`}, 0, '0')
      ON CONFLICT (sku) DO UPDATE SET product_id = EXCLUDED.product_id
      RETURNING id
    `);
    const variantId = variantResult.rows[0]?.id;
    if (!variantId) continue;

    // Link attribute value to variant
    await db.execute(sql`
      INSERT INTO variant_attribute_values (variant_id, value_id)
      VALUES (${variantId}, ${valueId})
      ON CONFLICT (variant_id, value_id) DO NOTHING
    `);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL required");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);
  console.log("Connected to PostgreSQL via Drizzle");

  try {
    // ── Categories ─────────────────────────────────────────────────────
    console.log("Fetching categories...");
    const catRes = await fetch(`${LEGACY_BASE}/categories`);
    const catJson = (await catRes.json()) as { data?: LegacyCategory[] };
    const categories = catJson.data ?? [];

    const catCount = await processCategories(db, categories, null);
    console.log(`Upserted ${catCount} categories (recursive tree)`);

    // ── Products ───────────────────────────────────────────────────────
    console.log("Fetching products...");
    const prodRes = await fetch(`${LEGACY_BASE}/catalog/products`);
    const prodJson = (await prodRes.json()) as { data?: LegacyProduct[] };
    const products = prodJson.data ?? [];
    console.log(`Received ${products.length} products`);

    let upserted = 0;
    for (const prod of products) {
      const name = prod.name;
      const prodSlug = prod.slug ?? slugify(name);
      const basePrice = normalizePriceTomans(prod.basePrice);
      const salePrice = normalizePriceTomans(prod.salePrice);
      const wholesalePrice = normalizePriceTomans(prod.wholesalePrice);
      const grade = normalizeGrade(prod.grade);
      const stock = Math.max(0, prod.stock ?? 0);
      const onSale = isOnSale(basePrice, salePrice);

      if (!prod.categoryId) {
        console.warn(`Skipping "${name}" — no categoryId`);
        continue;
      }

      // Upsert product with integer Toman prices
      const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
        INSERT INTO products (
          name, slug, description, primary_category_id, brand_id,
          grade, base_price, discounted_price, wholesale_price,
          stock, is_active
        ) VALUES (
          ${name}, ${prodSlug}, ${prod.description ?? ""},
          ${prod.categoryId}, ${prod.brandId ?? null},
          ${grade}, ${String(basePrice)},
          ${onSale ? String(salePrice) : null},
          ${wholesalePrice > 0 ? String(wholesalePrice) : null},
          ${stock}, ${prod.isActive ?? true}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          base_price = EXCLUDED.base_price,
          discounted_price = EXCLUDED.discounted_price,
          wholesale_price = EXCLUDED.wholesale_price,
          stock = EXCLUDED.stock,
          is_active = EXCLUDED.is_active,
          updated_at = NOW()
        RETURNING id
      `);

      const productId = result.rows[0]?.id;
      if (productId && prod.attributes && prod.attributes.length > 0) {
        await mapProductAttributes(db, productId, prod.attributes);
      }

      upserted++;
    }

    console.log(`Upserted ${upserted} products with EAV attributes`);
    console.log("Catalog sync complete.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
