// @ts-nocheck — standalone seed script run via tsx, not part of library typechecks

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { brands } from "./schema/brands.js";
import { categories } from "./schema/categories.js";
import { products } from "./schema/products.js";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rayaantech";

/**
 * Seed script — populates categories, brands, and products for development.
 * Safe to re-run: uses ON CONFLICT DO NOTHING via unique slugs.
 */
async function seed() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  console.log("🌱 Seeding database...");

  // ─── Categories ────────────────────────────────────────────────────────────
  const categoryData = [
    { name: "لپ‌تاپ", slug: "laptop", parentId: null },
    { name: "گوشی موبایل", slug: "mobile", parentId: null },
    { name: "تبلت", slug: "tablet", parentId: null },
    { name: "لوازم جانبی", slug: "accessories", parentId: null },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing({ target: categories.slug })
    .returning({ id: categories.id, slug: categories.slug });

  console.log(`  ✓ Categories: ${insertedCategories.length} upserted`);

  // Fetch all root categories (may already exist from prior runs)
  const rootCats = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const rootMap = new Map(rootCats.map((c) => [c.slug, c.id]));

  // Sub-categories
  const laptopId = rootMap.get("laptop");
  const mobileId = rootMap.get("mobile");

  if (laptopId) {
    const subCats = [
      { name: "لپ‌تاپ گیمینگ", slug: "gaming-laptop", parentId: laptopId },
      { name: "لپ‌تاپ تبدیل‌شونده", slug: "convertible-laptop", parentId: laptopId },
      { name: "اولترابوک", slug: "ultrabook", parentId: laptopId },
    ];
    await db.insert(categories).values(subCats).onConflictDoNothing({ target: categories.slug });
    console.log("  ✓ Laptop sub-categories seeded");
  }

  if (mobileId) {
    const subCats = [
      { name: "گوشی اپل", slug: "apple-phone", parentId: mobileId },
      { name: "گوشی سامسونگ", slug: "samsung-phone", parentId: mobileId },
      { name: "گوشی شیائومی", slug: "xiaomi-phone", parentId: mobileId },
    ];
    await db.insert(categories).values(subCats).onConflictDoNothing({ target: categories.slug });
    console.log("  ✓ Mobile sub-categories seeded");
  }

  // Refetch all categories for product references
  const allCats = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const catMap = new Map(allCats.map((c) => [c.slug, c.id]));

  // ─── Brands ────────────────────────────────────────────────────────────────
  const brandData = [
    { name: "Apple", slug: "apple" },
    { name: "Samsung", slug: "samsung" },
    { name: "Lenovo", slug: "lenovo" },
    { name: "ASUS", slug: "asus" },
    { name: "HP", slug: "hp" },
    { name: "Xiaomi", slug: "xiaomi" },
    { name: "Dell", slug: "dell" },
    { name: "MSI", slug: "msi" },
  ];

  const insertedBrands = await db
    .insert(brands)
    .values(brandData)
    .onConflictDoNothing({ target: brands.slug })
    .returning({ id: brands.id, slug: brands.slug });

  console.log(`  ✓ Brands: ${insertedBrands.length} inserted`);

  const allBrands = await db.select({ id: brands.id, slug: brands.slug }).from(brands);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b.id]));

  // ─── Products ──────────────────────────────────────────────────────────────
  const productData = [
    {
      name: "لپ‌تاپ ASUS ROG Strix G16 استوک",
      slug: "asus-rog-strix-g16-stock",
      primaryCategoryId: catMap.get("gaming-laptop")!,
      brandId: brandMap.get("asus")!,
      grade: "stock" as const,
      basePrice: "48500000",
      stock: 5,
    },
    {
      name: "لپ‌تاپ لنوو Legion 5 Pro ریفربیشد",
      slug: "lenovo-legion-5-pro-refurb",
      primaryCategoryId: catMap.get("gaming-laptop")!,
      brandId: brandMap.get("lenovo")!,
      grade: "refurbished" as const,
      basePrice: "42000000",
      stock: 3,
    },
    {
      name: "مک‌بوک ایر M2 اوپن‌باکس",
      slug: "macbook-air-m2-open-box",
      primaryCategoryId: catMap.get("ultrabook")!,
      brandId: brandMap.get("apple")!,
      grade: "open_box" as const,
      basePrice: "55000000",
      stock: 2,
    },
    {
      name: "لپ‌تاپ HP Spectre x360 در حد نو",
      slug: "hp-spectre-x360-like-new",
      primaryCategoryId: catMap.get("convertible-laptop")!,
      brandId: brandMap.get("hp")!,
      grade: "like_new" as const,
      basePrice: "38000000",
      stock: 4,
    },
    {
      name: "لپ‌تاپ Dell XPS 15 استوک شرکتی",
      slug: "dell-xps-15-stock",
      primaryCategoryId: catMap.get("ultrabook")!,
      brandId: brandMap.get("dell")!,
      grade: "stock" as const,
      basePrice: "52000000",
      stock: 1,
    },
    {
      name: "لپ‌تاپ MSI Katana GF66 کارکرده",
      slug: "msi-katana-gf66-used",
      primaryCategoryId: catMap.get("gaming-laptop")!,
      brandId: brandMap.get("msi")!,
      grade: "used" as const,
      basePrice: "32000000",
      stock: 0,
    },
    {
      name: "آیفون ۱۵ پرو مکس استوک",
      slug: "iphone-15-pro-max-stock",
      primaryCategoryId: catMap.get("apple-phone")!,
      brandId: brandMap.get("apple")!,
      grade: "stock" as const,
      basePrice: "72000000",
      torobPrice: "69500000",
      stock: 8,
    },
    {
      name: "سامسونگ Galaxy S24 Ultra اوپن‌باکس",
      slug: "samsung-s24-ultra-open-box",
      primaryCategoryId: catMap.get("samsung-phone")!,
      brandId: brandMap.get("samsung")!,
      grade: "open_box" as const,
      basePrice: "58000000",
      stock: 6,
    },
    {
      name: "شیائومی ۱۴ اولترا ریفربیشد",
      slug: "xiaomi-14-ultra-refurb",
      primaryCategoryId: catMap.get("xiaomi-phone")!,
      brandId: brandMap.get("xiaomi")!,
      grade: "refurbished" as const,
      basePrice: "35000000",
      stock: 10,
    },
    {
      name: "آیفون ۱۴ در حد نو",
      slug: "iphone-14-like-new",
      primaryCategoryId: catMap.get("apple-phone")!,
      brandId: brandMap.get("apple")!,
      grade: "like_new" as const,
      basePrice: "45000000",
      discountedPrice: "42500000",
      stock: 3,
    },
    {
      name: "سامسونگ Galaxy Z Fold5 استوک",
      slug: "samsung-z-fold5-stock",
      primaryCategoryId: catMap.get("samsung-phone")!,
      brandId: brandMap.get("samsung")!,
      grade: "stock" as const,
      basePrice: "62000000",
      stock: 2,
    },
    {
      name: "لپ‌تاپ ASUS ZenBook 14 اوپن‌باکس",
      slug: "asus-zenbook-14-open-box",
      primaryCategoryId: catMap.get("ultrabook")!,
      brandId: brandMap.get("asus")!,
      grade: "open_box" as const,
      basePrice: "36000000",
      stock: 7,
    },
    {
      name: "لپ‌تاپ Lenovo ThinkPad X1 Carbon استوک",
      slug: "lenovo-thinkpad-x1-stock",
      primaryCategoryId: catMap.get("ultrabook")!,
      brandId: brandMap.get("lenovo")!,
      grade: "stock" as const,
      basePrice: "41000000",
      stock: 4,
    },
    {
      name: "آیپد پرو M4 اوپن‌باکس",
      slug: "ipad-pro-m4-open-box",
      primaryCategoryId: catMap.get("tablet")!,
      brandId: brandMap.get("apple")!,
      grade: "open_box" as const,
      basePrice: "49000000",
      stock: 3,
    },
    {
      name: "سامسونگ Galaxy Tab S9 ریفربیشد",
      slug: "samsung-tab-s9-refurb",
      primaryCategoryId: catMap.get("tablet")!,
      brandId: brandMap.get("samsung")!,
      grade: "refurbished" as const,
      basePrice: "28000000",
      stock: 5,
    },
    {
      name: "شیائومی Pad 6 کارکرده",
      slug: "xiaomi-pad-6-used",
      primaryCategoryId: catMap.get("tablet")!,
      brandId: brandMap.get("xiaomi")!,
      grade: "used" as const,
      basePrice: "15000000",
      stock: 0,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .onConflictDoNothing({ target: products.slug })
    .returning({ id: products.id });

  console.log(`  ✓ Products: ${insertedProducts.length} inserted`);

  // ─── Done ──────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete!");
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
