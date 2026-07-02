/**
 * Run migration 0003 — Create user_wishlist_items table.
 *
 * Usage: npx tsx packages/db/migrations/run-0003.ts
 */
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rayaantech";

async function main() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });

  console.log("Running migration 0003: user_wishlist_items...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_wishlist_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT user_wishlist_items_user_product_unique UNIQUE (user_id, product_id)
    );

    CREATE INDEX IF NOT EXISTS user_wishlist_items_user_idx ON user_wishlist_items (user_id);
    CREATE INDEX IF NOT EXISTS user_wishlist_items_product_idx ON user_wishlist_items (product_id);
  `);

  console.log("Migration 0003 complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
