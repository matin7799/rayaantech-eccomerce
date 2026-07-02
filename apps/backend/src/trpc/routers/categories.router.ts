import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { publicProcedure, router } from "../trpc.init";

/**
 * Category row shape from the hierarchical query.
 */
interface CategoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

/**
 * Category tree node returned to clients.
 */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: CategoryNode[];
}

/**
 * Build a nested tree from flat category rows.
 */
function buildTree(rows: CategoryRow[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  // First pass: create all nodes
  for (const row of rows) {
    map.set(row.id, {
      id: row.id,
      name: row.name,
      slug: row.slug,
      parentId: row.parent_id,
      children: [],
    });
  }

  // Second pass: wire parent-child relationships
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Categories tRPC router.
 * Returns a full nested category tree — cache-friendly for 24h staleTime on client.
 */
export function createCategoriesRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get the full category tree (all active categories).
     * Client should cache with staleTime: 24h for instant mega-menu rendering.
     */
    tree: publicProcedure.query(async () => {
      const result = await db.execute<CategoryRow>(sql`
        SELECT id, name, slug, parent_id
        FROM categories
        ORDER BY parent_id NULLS FIRST, name ASC
      `);

      return { tree: buildTree(result.rows) };
    }),
  });
}

export type CategoriesRouter = ReturnType<typeof createCategoriesRouter>;
