/**
 * sync-categories.ts — Recursive category tree ingestion.
 *
 * Fetches the category tree from localhost:3002 and recursively
 * upserts each node with correct parentId relationships.
 *
 * Usage: DATABASE_URL=... npx tsx packages/db/src/seed/sync-categories.ts
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const LEGACY_BASE = "http://localhost:3002/api/v1";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LegacyCategoryNode {
  id?: string;
  name: string;
  slug?: string;
  children?: LegacyCategoryNode[];
  parentId?: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 250);
}

// ─── Recursive Sync ──────────────────────────────────────────────────────────

/**
 * Recursively traverse the category tree and upsert each node.
 * Processes depth-first: parent is inserted before its children.
 *
 * @param db - Drizzle instance
 * @param tree - Array of category nodes at this level
 * @param parentId - UUID of the parent category (null for root)
 * @returns Total number of categories upserted
 */
async function syncCategories(
  db: ReturnType<typeof drizzle>,
  tree: LegacyCategoryNode[],
  parentId: string | null,
): Promise<number> {
  let count = 0;

  for (const node of tree) {
    const catSlug = node.slug ?? slugify(node.name);
    const catId = node.id ?? undefined;

    // Upsert with ON CONFLICT (slug) DO UPDATE
    if (catId) {
      await db.execute(sql`
        INSERT INTO categories (id, name, slug, parent_id)
        VALUES (${catId}, ${node.name}, ${catSlug}, ${parentId})
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          parent_id = EXCLUDED.parent_id
      `);
    } else {
      await db.execute(sql`
        INSERT INTO categories (name, slug, parent_id)
        VALUES (${node.name}, ${catSlug}, ${parentId})
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          parent_id = EXCLUDED.parent_id
      `);
    }
    count++;

    // Get the ID of the just-upserted row for children's parentId
    const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
      SELECT id FROM categories WHERE slug = ${catSlug} LIMIT 1
    `);
    const insertedId = result.rows[0]?.id ?? null;

    // Recurse into children
    if (node.children && node.children.length > 0 && insertedId) {
      count += await syncCategories(db, node.children, insertedId);
    }
  }

  return count;
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

  try {
    console.log(`Fetching categories from ${LEGACY_BASE}/categories ...`);
    const res = await fetch(`${LEGACY_BASE}/categories`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = (await res.json()) as {
      data?: { data?: LegacyCategoryNode[] } | LegacyCategoryNode[];
      categories?: LegacyCategoryNode[];
    };

    // API wraps as { success, data: { message, data: [...] } }
    let tree: LegacyCategoryNode[];
    if (Array.isArray(json.data)) {
      tree = json.data;
    } else if (json.data && Array.isArray((json.data as { data?: unknown }).data)) {
      tree = (json.data as { data: LegacyCategoryNode[] }).data;
    } else {
      tree = json.categories ?? [];
    }
    console.log(`Received ${tree.length} root categories`);

    const total = await syncCategories(db, tree, null);
    console.log(`\n✓ Synced ${total} categories (recursive tree)`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Category sync failed:", err);
  process.exit(1);
});
