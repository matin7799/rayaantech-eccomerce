// @ts-nocheck — standalone seed script run via tsx, not part of library typechecks
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Product Seeding Script — Truncate & Import from data.json
 *
 * Strategy:
 * 1. Truncate products (cascades to variants, media, addons, reservations, campaigns, secondary categories)
 * 2. Upsert brands from data.json (ON CONFLICT slug DO NOTHING)
 * 3. Upsert categories from data.json (ON CONFLICT slug DO NOTHING)
 * 4. Insert products with proper field mapping
 * 5. Insert product media (media + product_media junction)
 * 6. Insert product secondary categories
 * 7. Insert EAV attributes (attribute_keys + attribute_values + product_variants + variant_attribute_values)
 *
 * Run: pnpm --filter @rayan-tech/db db:seed:products
 */

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rayaantech";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DataProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  brand: { id: string; name: string; slug: string };
  categories: Array<{ id: string; name: string; slug: string }>;
  pricing: {
    basePrice: number;
    finalPrice: number;
    salePrice: string;
    isOnSale: boolean;
    discounts: unknown[];
    savings: number;
    savingsPercent: number;
  };
  media: {
    thumbnail: MediaItem | null;
    gallery: MediaItem[];
  };
  attributes: Array<{ key: string; value: string }>;
  options: unknown[];
  variants: unknown[];
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: string;
  url: string;
  type: string;
  alt: string;
  caption: string;
  order: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inferGrade(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("اوپن‌باکس") || lower.includes("open box") || lower.includes("اوپن باکس"))
    return "open_box";
  if (lower.includes("ریفربیشد") || lower.includes("refurbished")) return "refurbished";
  if (lower.includes("در حد نو") || lower.includes("like new")) return "like_new";
  if (lower.includes("کارکرده") || lower.includes("used")) return "used";
  // Default to stock for "دست دوم" and others
  return "stock";
}

function inferMimeType(url: string): string {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function importProducts() {
  const dataPath = path.resolve(__dirname, "../../../data.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const { data } = JSON.parse(raw) as { data: DataProduct[] };

  console.log(`📦 Found ${data.length} products in data.json`);

  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  // ─── Step 1: Truncate products cascade ───────────────────────────────────
  console.log("\n🗑️  Truncating products (cascade)...");
  await db.execute(sql`TRUNCATE TABLE products CASCADE`);
  // Also truncate media since we'll re-insert
  await db.execute(sql`TRUNCATE TABLE media CASCADE`);
  console.log("  ✓ Products and media truncated");

  // ─── Step 2: Upsert brands ───────────────────────────────────────────────
  console.log("\n🏷️  Upserting brands...");
  const brandSet = new Map<string, { id: string; name: string; slug: string }>();
  for (const p of data) {
    if (p.brand && !brandSet.has(p.brand.slug)) {
      brandSet.set(p.brand.slug, p.brand);
    }
  }

  for (const brand of brandSet.values()) {
    await db.execute(sql`
      INSERT INTO brands (id, name, slug)
      VALUES (${brand.id}, ${brand.name}, ${brand.slug})
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    `);
  }
  console.log(`  ✓ ${brandSet.size} brands upserted`);

  // ─── Step 3: Upsert categories ───────────────────────────────────────────
  console.log("\n📂 Upserting categories...");
  const categorySet = new Map<string, { id: string; name: string; slug: string }>();
  for (const p of data) {
    for (const cat of p.categories) {
      if (!categorySet.has(cat.slug)) {
        categorySet.set(cat.slug, cat);
      }
    }
  }

  for (const cat of categorySet.values()) {
    await db.execute(sql`
      INSERT INTO categories (id, name, slug)
      VALUES (${cat.id}, ${cat.name}, ${cat.slug})
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    `);
  }
  console.log(`  ✓ ${categorySet.size} categories upserted`);

  // ─── Step 4: Insert products ─────────────────────────────────────────────
  console.log("\n📝 Inserting products...");
  let productCount = 0;

  for (const p of data) {
    const grade = inferGrade(p.name);
    const primaryCategoryId = p.categories[0]?.id ?? null;
    const basePrice = String(p.pricing.basePrice);

    // اگر salePrice وجود داشت و خالی نبود از آن استفاده کند، در غیر این صورت قیمت پایه را قرار دهد
    const discountedPrice =
      p.pricing.salePrice && String(p.pricing.salePrice).trim() !== ""
        ? String(p.pricing.salePrice)
        : basePrice;

    await db.execute(sql`
      INSERT INTO products (
        id, name, slug, sku, short_description, description,
        primary_category_id, brand_id, grade, base_price,
        wholesale_price, torob_price, stock, is_active, created_at, updated_at
      ) VALUES (
        ${p.id}, ${p.name}, ${p.slug}, ${p.sku}, ${p.shortDescription},
        ${p.description}, ${primaryCategoryId}, ${p.brand?.id ?? null},
        ${grade}::product_grade, ${basePrice}, ${discountedPrice}, ${discountedPrice},
        ${p.stockQuantity}, ${p.isActive},
        ${p.createdAt}::timestamptz, ${p.updatedAt}::timestamptz
      )
    `);
    productCount++;
  }
  console.log(`  ✓ ${productCount} products inserted`);

  // ─── Step 5: Insert media + product_media ────────────────────────────────
  console.log("\n🖼️  Inserting media...");
  let mediaCount = 0;

  for (const p of data) {
    const galleryItems = p.media?.gallery ?? [];
    if (galleryItems.length === 0) continue;

    for (const item of galleryItems) {
      const mimeType = inferMimeType(item.url);
      const isThumbnail = item.order === 0;

      // Insert media record
      await db.execute(sql`
        INSERT INTO media (id, url, mime_type, file_size, storage_provider)
        VALUES (${item.id}, ${item.url}, ${mimeType}, ${0}, 's3'::storage_provider)
        ON CONFLICT (id) DO NOTHING
      `);

      // Insert product_media junction
      await db.execute(sql`
        INSERT INTO product_media (product_id, media_id, display_order, is_thumbnail)
        VALUES (${p.id}, ${item.id}, ${item.order}, ${isThumbnail})
        ON CONFLICT (product_id, media_id) DO NOTHING
      `);

      mediaCount++;
    }
  }
  console.log(`  ✓ ${mediaCount} media items inserted`);

  // ─── Step 6: Insert secondary categories ─────────────────────────────────
  console.log("\n🔗 Inserting secondary categories...");
  let secCatCount = 0;

  for (const p of data) {
    // Skip the first category (used as primary), insert rest as secondary
    const secondaryCategories = p.categories.slice(1);
    for (const cat of secondaryCategories) {
      await db.execute(sql`
        INSERT INTO product_secondary_categories (product_id, category_id)
        VALUES (${p.id}, ${cat.id})
        ON CONFLICT (product_id, category_id) DO NOTHING
      `);
      secCatCount++;
    }
  }
  console.log(`  ✓ ${secCatCount} secondary category links inserted`);

  // ─── Step 7: Insert EAV attributes ───────────────────────────────────────
  console.log("\n📋 Inserting product attributes (EAV)...");
  let attrCount = 0;

  // ─── Predefined attribute key slugs ────────────────────────────────────────
  // Map Persian attribute names → stable machine slugs
  const ATTR_SLUG_MAP: Record<string, { slug: string; order: number }> = {
    برند: { slug: "brand", order: 0 },
    مدل: { slug: "model", order: 1 },
    "وضعیت دستگاه": { slug: "condition", order: 2 },
    "نوع کاربری": { slug: "use-case", order: 3 },
    پردازنده: { slug: "cpu", order: 10 },
    "نسل پردازنده": { slug: "cpu-gen", order: 11 },
    "تعداد هسته": { slug: "cpu-cores", order: 12 },
    "تعداد رشته": { slug: "cpu-threads", order: 13 },
    "فرکانس پردازنده": { slug: "cpu-freq", order: 14 },
    "حافظه رم": { slug: "ram", order: 20 },
    "حافظه داخلی": { slug: "storage", order: 21 },
    "نوع حافظه": { slug: "storage-type", order: 22 },
    "کارت گرافیک": { slug: "gpu", order: 30 },
    "حافظه گرافیکی": { slug: "gpu-vram", order: 31 },
    "گرافیک مجتمع": { slug: "igpu", order: 32 },
    "اندازه صفحه نمایش": { slug: "display-size", order: 40 },
    رزولوشن: { slug: "resolution", order: 41 },
    "نرخ تازه‌سازی": { slug: "refresh-rate", order: 42 },
    "نوع پنل": { slug: "panel-type", order: 43 },
    پورت‌ها: { slug: "ports", order: 50 },
    "اتصالات بی‌سیم": { slug: "wireless", order: 51 },
    کیبورد: { slug: "keyboard", order: 60 },
    وبکم: { slug: "webcam", order: 61 },
    "وضعیت بسته‌بندی": { slug: "packaging", order: 70 },
    رنگ: { slug: "color", order: 71 },
    "وزن تقریبی": { slug: "weight", order: 72 },
  };

  // Collect unique attribute keys with slugs
  const attrKeyMap = new Map<string, string>(); // name -> id

  for (const p of data) {
    for (const attr of p.attributes) {
      if (!attrKeyMap.has(attr.key)) {
        const slugInfo = ATTR_SLUG_MAP[attr.key];
        const slug = slugInfo?.slug ?? null;
        const displayOrder = slugInfo?.order ?? 100;

        const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO attribute_keys (name, slug, display_order)
          VALUES (${attr.key}, ${slug}, ${displayOrder})
          ON CONFLICT (name) DO UPDATE SET
            slug = COALESCE(EXCLUDED.slug, attribute_keys.slug),
            display_order = EXCLUDED.display_order
          RETURNING id
        `);
        attrKeyMap.set(attr.key, result.rows[0].id);
      }
    }
  }
  console.log(`  ✓ ${attrKeyMap.size} attribute keys upserted (with slugs)`);

  // ─── Step 7b: Seed category_attribute_keys (QuickView bindings) ────────────
  console.log("\n🔗 Seeding category → attribute key bindings...");

  // Define which attributes are QuickView-priority for each category slug
  const CATEGORY_QUICKVIEW_ATTRS: Record<string, string[]> = {
    "gaming-laptop": ["cpu", "ram", "storage", "gpu", "display-size"],
    laptop: ["cpu", "ram", "storage", "gpu", "display-size"],
    "budget-laptop": ["cpu", "ram", "storage", "gpu", "display-size"],
    ultrabook: ["cpu", "ram", "storage", "display-size", "weight"],
    "convertible-laptop": ["cpu", "ram", "storage", "display-size", "weight"],
  };

  // Build a slug→id map for attribute keys
  const attrSlugToId = new Map<string, string>();
  for (const [name, id] of attrKeyMap.entries()) {
    const slugInfo = ATTR_SLUG_MAP[name];
    if (slugInfo?.slug) {
      attrSlugToId.set(slugInfo.slug, id);
    }
  }

  // Fetch all categories to build slug→id
  const allCatsResult = await db.execute<{ id: string; slug: string } & Record<string, unknown>>(
    sql`SELECT id, slug FROM categories`,
  );
  const catSlugToId = new Map(allCatsResult.rows.map((r) => [r.slug, r.id]));

  let bindingCount = 0;
  for (const [catSlug, attrSlugs] of Object.entries(CATEGORY_QUICKVIEW_ATTRS)) {
    const catId = catSlugToId.get(catSlug);
    if (!catId) continue;

    for (let i = 0; i < attrSlugs.length; i++) {
      const attrKeyId = attrSlugToId.get(attrSlugs[i]);
      if (!attrKeyId) continue;

      await db.execute(sql`
        INSERT INTO category_attribute_keys (category_id, attribute_key_id, is_required, is_quickview, display_order)
        VALUES (${catId}, ${attrKeyId}, ${true}, ${true}, ${i})
        ON CONFLICT (category_id, attribute_key_id) DO UPDATE SET
          is_quickview = true,
          display_order = EXCLUDED.display_order
      `);
      bindingCount++;
    }
  }
  console.log(`  ✓ ${bindingCount} category↔attribute bindings seeded`);

  // Insert attribute values and create a "virtual variant" per product for EAV storage
  const attrValueMap = new Map<string, string>(); // "keyId:value" -> valueId

  for (const p of data) {
    if (p.attributes.length === 0) continue;

    // Create a default variant for this product to attach attributes
    // (only if product has no real variants)
    const variantResult = await db.execute<{ id: string } & Record<string, unknown>>(sql`
      INSERT INTO product_variants (product_id, sku, stock, price_modifier)
      VALUES (${p.id}, ${p.sku + "-default"}, ${p.stockQuantity}, '0')
      ON CONFLICT (sku) DO UPDATE SET stock = EXCLUDED.stock
      RETURNING id
    `);
    const variantId = variantResult.rows[0].id;

    for (const attr of p.attributes) {
      const keyId = attrKeyMap.get(attr.key)!;
      const cacheKey = `${keyId}:${attr.value}`;

      let valueId = attrValueMap.get(cacheKey);
      if (!valueId) {
        const valResult = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO attribute_values (key_id, value)
          VALUES (${keyId}, ${attr.value})
          ON CONFLICT (key_id, value) DO UPDATE SET value = EXCLUDED.value
          RETURNING id
        `);
        valueId = valResult.rows[0].id;
        attrValueMap.set(cacheKey, valueId);
      }

      // Link variant to attribute value
      await db.execute(sql`
        INSERT INTO variant_attribute_values (variant_id, value_id)
        VALUES (${variantId}, ${valueId})
        ON CONFLICT (variant_id, value_id) DO NOTHING
      `);
      attrCount++;
    }
  }
  console.log(`  ✓ ${attrCount} attribute values linked`);

  // ─── Done ──────────────────────────────────────────────────────────────────
  console.log("\n✅ Import complete!");
  console.log(`   Products: ${productCount}`);
  console.log(`   Media: ${mediaCount}`);
  console.log(`   Brands: ${brandSet.size}`);
  console.log(`   Categories: ${categorySet.size}`);
  console.log(`   Secondary links: ${secCatCount}`);
  console.log(`   Attribute values: ${attrCount}`);

  await pool.end();
  process.exit(0);
}

importProducts().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
