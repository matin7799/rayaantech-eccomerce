// @ts-nocheck — standalone seed script run via tsx, not part of library typechecks
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "../src/schema/users.js";

/**
 * Seed users + their saved addresses from the repo-root CSV exports.
 *
 *   users.csv     — tab-delimited, no header:
 *                   id, mobile, email, password_hash, first_name, last_name,
 *                   status, role, created_at, updated_at
 *   addresses.csv — comma-delimited, quoted, WITH header (may contain embedded
 *                   newlines inside the address field):
 *                   id, user_id, full_name, phone, province, city, address,
 *                   postal_code, is_default, created_at, updated_at
 *
 * Addresses are folded into the users.addresses JSONB column (there is no
 * separate addresses table in the schema). Safe to re-run: ON CONFLICT (id)
 * refreshes the row.
 *
 * Run: pnpm --filter @rayan-tech/db db:seed:users
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/rayaantech";

/**
 * RFC-4180-ish CSV parser: supports quoted fields, escaped quotes (""),
 * embedded newlines, and a configurable delimiter. Returns rows of strings.
 */
function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  // Strip BOM if present
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else if (ch === "\r") {
      // ignore — handled by the following \n
    } else {
      field += ch;
    }
  }
  // Flush trailing field/row (files without a terminal newline)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** CSV "role" values → user_role enum. */
function mapRole(raw: string): "retail" | "wholesale" | "admin" | "operator" {
  switch (raw.trim().toLowerCase()) {
    case "admin":
      return "admin";
    case "operator":
      return "operator";
    case "partner":
    case "wholesale":
      return "wholesale";
    default:
      return "retail";
  }
}

function clean(v: string | undefined): string {
  return (v ?? "").trim();
}

async function main() {
  console.log("🌱 Seeding users + addresses from CSV...");

  const usersCsv = readFileSync(resolve(REPO_ROOT, "users.csv"), "utf8");
  const addressesCsv = readFileSync(resolve(REPO_ROOT, "addresses.csv"), "utf8");

  // ─── Group addresses by user_id → JSONB array ──────────────────────────────
  const addrRows = parseDelimited(addressesCsv, ",");
  const addrHeader = addrRows.shift(); // drop header row
  const addressesByUser = new Map<string, unknown[]>();

  for (const cols of addrRows) {
    const [id, userId, fullName, phone, province, city, address, postalCode, isDefault] = cols;
    const uid = clean(userId);
    if (!uid) continue;
    const list = addressesByUser.get(uid) ?? [];
    const cityName = clean(city);
    list.push({
      id: clean(id) || crypto.randomUUID(),
      title: cityName || "آدرس",
      recipientName: clean(fullName),
      phone: clean(phone),
      province: clean(province),
      city: cityName,
      postalCode: clean(postalCode).toUpperCase() === "NULL" ? "" : clean(postalCode),
      fullAddress: clean(address),
      isDefault: clean(isDefault).toLowerCase() === "true",
    });
    addressesByUser.set(uid, list);
  }
  console.log(
    `  ✓ Parsed ${addrRows.length} addresses (header cols: ${addrHeader?.length ?? 0}) for ${addressesByUser.size} users`,
  );

  // ─── Build user rows ───────────────────────────────────────────────────────
  const userRows = parseDelimited(usersCsv, "\t");
  const values = userRows.map((cols) => {
    const [id, mobile, email, passwordHash, firstName, lastName, status, role, createdAt, updatedAt] =
      cols;
    const uid = clean(id);
    const fullName = [clean(firstName), clean(lastName)].filter(Boolean).join(" ") || "کاربر";
    return {
      id: uid,
      fullName,
      email: clean(email) || null,
      mobile: clean(mobile),
      passwordHash: clean(passwordHash) || null,
      isVerified: clean(status).toLowerCase() === "active",
      role: mapRole(clean(role)),
      addresses: addressesByUser.get(uid) ?? null,
      createdAt: clean(createdAt) ? new Date(clean(createdAt)) : new Date(),
      updatedAt: clean(updatedAt) ? new Date(clean(updatedAt)) : new Date(),
    };
  });

  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

let inserted = 0;
for (const v of values) {
  if (!v.mobile) continue;

  await db
    .insert(users)
    .values(v)
    .onConflictDoUpdate({
      target: users.mobile,
      set: {
        fullName: v.fullName,
        email: v.email,
        passwordHash: v.passwordHash,
        isVerified: v.isVerified,
        role: v.role,
        addresses: v.addresses,
        updatedAt: v.updatedAt,
      },
    });

  inserted++;
}

  console.log(`  ✓ Users upserted: ${inserted}`);
  console.log("\n✅ User seed complete!");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ User seed failed:", err);
  process.exit(1);
});
