// @ts-nocheck — standalone seed script run via tsx, not part of library typechecks

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { shoppableStories } from "./schema/content.js";
import { products } from "./schema/products.js";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rayaantech";

async function main() {
  console.log("🌱 Seeding Shoppable Stories...");
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  // Clear existing stories to prevent duplication
  await db.execute(sql`DELETE FROM shoppable_stories`);
  console.log("  ✓ Cleared existing stories");

  // Fetch target products for linkage
  const targetSlugs = [
    "macbook-air-m2-open-box",
    "asus-rog-strix-g16-stock",
    "iphone-15-pro-max-stock",
    "samsung-s24-ultra-open-box",
    "lenovo-ideapad-gaming-3-15ihu6-i5-11300h-16gb-256ssd-512hdd-gtx1650-used",
    "asus-vivobook-x1504v-core-i3-1315u-12gb-512gb-ssd-15-6-fhd-used",
    "iphone-13-pro-max-256gb-cha-gold-registered",
  ];

  const dbProducts = await db
    .select({ id: products.id, slug: products.slug, name: products.name })
    .from(products)
    .where(
      sql`slug IN (${sql.join(
        targetSlugs.map((s) => sql`${s}`),
        sql.raw(", "),
      )})`,
    );

  const productMap = new Map(dbProducts.map((p) => [p.slug, p.id]));
  console.log(`  ✓ Found ${dbProducts.length} matching products in database`);

  const storiesToInsert = [];

  // Define potential story mappings
  const storyDefinitions = [
    {
      slug: "macbook-air-m2-open-box",
      title: "مک‌بوک ایر M2 اوپن‌باکس",
      mediaUrl:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
    },
    {
      slug: "asus-rog-strix-g16-stock",
      title: "ایسوس ROG Strix گیمینگ",
      mediaUrl:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop",
    },
    {
      slug: "iphone-15-pro-max-stock",
      title: "آیفون ۱۵ پرو مکس استوک",
      mediaUrl:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop",
    },
    {
      slug: "samsung-s24-ultra-open-box",
      title: "سامسونگ S24 اولترا",
      mediaUrl:
        "https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=800&auto=format&fit=crop",
    },
    {
      slug: "lenovo-ideapad-gaming-3-15ihu6-i5-11300h-16gb-256ssd-512hdd-gtx1650-used",
      title: "لپ‌تاپ گیمینگ لنوو ۳",
      mediaUrl:
        "https://ranew.s3.ir-thr-at1.arvanstorage.ir/Laptop/Lenovo/LENOVO-IDEAPAD-GAMING-3-15IHU6/1.jpg",
    },
    {
      slug: "asus-vivobook-x1504v-core-i3-1315u-12gb-512gb-ssd-15-6-fhd-used",
      title: "ایسوس ویووبوک جذاب",
      mediaUrl:
        "https://ranew.s3.ir-thr-at1.arvanstorage.ir/Laptop/Asus/ASUS-VIVOBOOK-X1504V/1.png",
    },
    {
      slug: "iphone-13-pro-max-256gb-cha-gold-registered",
      title: "آیفون ۱۳ پرو مکس طلایی",
      mediaUrl:
        "https://ranew.s3.ir-thr-at1.arvanstorage.ir/Mobile/Apple/APPLE-IPHONE-13-PRO-MAX-GOLD/1.png",
    },
  ];

  for (const def of storyDefinitions) {
    const productId = productMap.get(def.slug);
    if (productId) {
      storiesToInsert.push({
        title: def.title,
        mediaUrl: def.mediaUrl,
        productId: productId,
        isActive: true,
      });
    }
  }

  if (storiesToInsert.length === 0) {
    console.log(
      "⚠️ No matching products found to seed stories. Seeding standalone stories instead...",
    );
    // Fallback if no matching products exist
    storiesToInsert.push(
      {
        title: "مک‌بوک ایر مدرن",
        mediaUrl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
        productId: null,
        isActive: true,
      },
      {
        title: "لپ‌تاپ گیمینگ قدرتمند",
        mediaUrl:
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop",
        productId: null,
        isActive: true,
      },
    );
  }

  await db.insert(shoppableStories).values(storiesToInsert);
  console.log(`  ✓ Seeded ${storiesToInsert.length} shoppable stories successfully!`);

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Stories seeding failed:", err);
  process.exit(1);
});
