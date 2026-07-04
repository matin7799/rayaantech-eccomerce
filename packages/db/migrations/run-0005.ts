/**
 * Run migration 0005 — create app_settings (and ensure notifications exists).
 *
 * Idempotent: safe to run repeatedly. Both statements use IF NOT EXISTS.
 *
 * Usage (loads DATABASE_URL from an env file without printing it):
 *   node --env-file=packages/db/.env --import tsx packages/db/migrations/run-0005.ts
 */
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Re-run with: node --env-file=packages/db/.env --import tsx packages/db/migrations/run-0005.ts",
  );
  process.exit(1);
}

async function main() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });

  console.log("Running migration 0005: app_settings + notifications...");

  // app_settings — runtime-editable settings store (backs AI config)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key        VARCHAR(128) PRIMARY KEY,
      value      JSON NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // notifications — in-app admin/operator feed (migration 0004; ensure present)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type        VARCHAR(64) NOT NULL,
      title       TEXT NOT NULL,
      body        TEXT NOT NULL,
      order_id    UUID,
      amount      BIGINT,
      metadata    JSON,
      is_read     BOOLEAN NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications (is_read);`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications (created_at);`,
  );

  console.log("Migration 0005 complete: app_settings + notifications are ready.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
