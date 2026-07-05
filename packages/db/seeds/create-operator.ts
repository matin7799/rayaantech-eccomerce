// @ts-nocheck — standalone script run via tsx, not part of library typechecks
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

/**
 * Create (or promote) an operator account directly in the database.
 *
 * Password hashing must match apps/backend/src/trpc/routers/profile/profile.crypto.ts
 * exactly (scrypt, "salt:hash" hex format) so the account can log in normally via
 * the app's loginWithPassword mutation.
 *
 * Run: OPERATOR_MOBILE=09xxxxxxxxx OPERATOR_PASSWORD=... OPERATOR_NAME="..." \
 *      pnpm --filter @rayan-tech/db db:create-operator
 */

const scrypt = promisify(scryptCb);

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rayaantech";

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function createOperator() {
  const mobile = process.env.OPERATOR_MOBILE;
  const password = process.env.OPERATOR_PASSWORD;
  const fullName = process.env.OPERATOR_NAME ?? "Operator";

  if (!(mobile && /^09\d{9}$/.test(mobile))) {
    throw new Error("OPERATOR_MOBILE is required and must match 09xxxxxxxxx");
  }
  if (!password || password.length < 8) {
    throw new Error("OPERATOR_PASSWORD is required and must be at least 8 characters");
  }

  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  const passwordHash = await hashPassword(password);

  const result = await db.execute<{ id: string; role: string }>(sql`
    INSERT INTO users (full_name, mobile, password_hash, is_verified, role)
    VALUES (${fullName}, ${mobile}, ${passwordHash}, true, 'operator')
    ON CONFLICT (mobile) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          role = 'operator',
          is_verified = true,
          full_name = EXCLUDED.full_name
    RETURNING id, role
  `);

  const row = result.rows[0];
  console.log(`✅ Operator ready: ${mobile} (id: ${row.id}, role: ${row.role})`);

  await pool.end();
  process.exit(0);
}

createOperator().catch((err) => {
  console.error("❌ Failed to create operator:", err);
  process.exit(1);
});
