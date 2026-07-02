/**
 * groupProductsHierarchical — Client-side tree builder for the catalog.
 *
 * Transforms a flat filtered product array into a nested:
 *   Main Category (root ancestor) ➔ Sub-Category (product's own category)
 *     ➔ Brand ➔ Product[]
 *
 * Pure & deterministic — no React, no I/O. Safe to memoize.
 *
 * Invariants:
 * - Empty branches are omitted by construction: nodes are only created for
 *   buckets that receive at least one product.
 * - Main categories are ordered by an immutable business sequence keyed on
 *   `slug` (NOT `name` — Persian name variants like لپ تاپ vs لپ‌تاپ vs لپتاپ
 *   and آل vs ال break name-based matching). Unknown roots sort last, stable.
 * - The active sort reorders ONLY the leaf products[] inside each brand;
 *   Main / Sub / Brand node ordering is never touched (jailed leaf sort).
 * - Products with `brandId === null` land in a synthetic «سایر» leaf.
 */

import type { ProductCardData } from "../components/storefront/product/shared";

/** Active catalog sort, mirroring the backend `products.list` enum. */
export type CatalogSort = "latest" | "price_asc" | "price_desc";

/**
 * Immutable business order of root main categories, keyed on `slug`.
 * Stable ASCII — immune to Persian name/separator/alef variants. Unknown
 * roots (not in this list) sort to the end while preserving their relative
 * order.
 */
export const ROOT_CATEGORY_SEQUENCE = [
  "laptop",
  "mobile",
  "gaming-console",
  "all-in-one",
  "printer",
  "pc-case",
  "monitor",
] as const;

/** Rank of a slug in the immutable sequence; unknown roots rank last. */
function sequenceRank(slug: string): number {
  const idx = ROOT_CATEGORY_SEQUENCE.indexOf(slug as (typeof ROOT_CATEGORY_SEQUENCE)[number]);
  return idx === -1 ? ROOT_CATEGORY_SEQUENCE.length : idx;
}

/** Minimal category tree node we consume from `categories.tree`. */
export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: CategoryTreeNode[];
}

/** Brand name lookup: brandId (UUID) → display name. */
export type BrandNameMap = Map<string, string>;

/** Leaf: a brand bucket holding its products. */
export interface BrandNode {
  id: string;
  name: string;
  slug: string;
  products: ProductCardData[];
}

/** Sub-Category layer: product's own category, grouped by brand. */
export interface SubCategoryNode {
  id: string;
  name: string;
  slug: string;
  /** True when this category IS the root (single-tier collapse). */
  isRoot: boolean;
  brands: BrandNode[];
}

/** Root of the tree: a main category containing sub-categories. */
export interface MainCategoryNode {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategoryNode[];
}

/** Synthetic brand used for products with `brandId === null`. */
const UNBRANDED_ID = "__unbranded__";
const UNBRANDED_NAME = "سایر";

interface ResolvedCategory {
  id: string;
  name: string;
  slug: string;
  rootAncestorId: string;
  rootAncestorName: string;
  rootAncestorSlug: string;
  isRoot: boolean;
}

/**
 * Build a resolver mapping every category id (in the flat tree) to its node
 * plus its root ancestor. Runs once per category-tree load (24h cache).
 */
export function buildCategoryResolver(tree: CategoryTreeNode[]): Map<string, ResolvedCategory> {
  const flat = new Map<string, { parentId: string | null; node: CategoryTreeNode }>();
  const resolved = new Map<string, ResolvedCategory>();

  // Flatten the tree, keeping a pointer to each node.
  const walk = (nodes: CategoryTreeNode[]) => {
    for (const n of nodes) {
      flat.set(n.id, { parentId: n.parentId, node: n });
      if (n.children.length > 0) walk(n.children);
    }
  };
  walk(tree);

  // Resolve root ancestor for each node by walking up via parentId.
  for (const [, { node }] of flat) {
    let cursor = node;
    // Guard against malformed cycles with a visited set.
    const seen = new Set<string>();
    while (cursor.parentId && flat.has(cursor.parentId) && !seen.has(cursor.id)) {
      seen.add(cursor.id);
      const parent = flat.get(cursor.parentId)?.node;
      if (!parent) break; // dangling parentId — treat cursor as root
      cursor = parent;
    }
    resolved.set(node.id, {
      id: node.id,
      name: node.name,
      slug: node.slug,
      rootAncestorId: cursor.id,
      rootAncestorName: cursor.name,
      rootAncestorSlug: cursor.slug,
      isRoot: node.id === cursor.id,
    });
  }

  return resolved;
}

/**
 * Effective numeric price for leaf sort comparisons.
 *
 * Reads the server-resolved `effectivePrice` directly — the client never
 * re-derives a tier (zero-trust invariant). Falls back to Infinity so any
 * product missing a resolved price sinks to the bottom of its leaf rather
 * than producing a NaN that silently no-ops the comparator.
 */
function effectivePrice(p: ProductCardData): number {
  return Number.isFinite(p.effectivePrice) ? p.effectivePrice : Number.POSITIVE_INFINITY;
}

/**
 * Jailed leaf-node comparator. Reorders ONLY the products[] array inside a
 * brand leaf. Node ordering (Main / Sub / Brand) is never affected. The
 * comparator is stable for `latest` (preserves incoming server order).
 */
export function sortLeafProducts(
  products: ProductCardData[],
  sortBy: CatalogSort = "latest",
): ProductCardData[] {
  if (sortBy === "latest") return products; // stable — trust server order
  const sorted = [...products];
  // Out-of-stock ALWAYS sinks below in-stock within each leaf.
  sorted.sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    const pa = effectivePrice(a);
    const pb = effectivePrice(b);
    return sortBy === "price_asc" ? pa - pb : pb - pa;
  });
  return sorted;
}

/**
 * Group an already-filtered product array into the Main ➔ Sub ➔ Brand tree.
 * Empty branches are never produced. Main categories are ordered by the
 * immutable `ROOT_CATEGORY_SEQUENCE`; leaf products are jail-sorted by
 * `sortBy`. Default `latest` trusts server insertion order (stable).
 */
export function groupProductsHierarchically({
  products,
  categoryResolver,
  brandNameMap,
  sortBy = "latest",
}: {
  products: ProductCardData[];
  categoryResolver: Map<string, ResolvedCategory>;
  brandNameMap: BrandNameMap;
  sortBy?: CatalogSort;
}): MainCategoryNode[] {
  // Buckets — Map preserves insertion order, so server sort is inherited.
  const mains = new Map<string, MainCategoryNode>();

  // Lazily create a brand bucket inside a sub-category.
  const getBrandBucket = (sub: SubCategoryNode, brandId: string, brandName: string): BrandNode => {
    let bucket = sub.brands.find((b) => b.id === brandId);
    if (!bucket) {
      bucket = { id: brandId, name: brandName, slug: brandId, products: [] };
      sub.brands.push(bucket);
    }
    return bucket;
  };

  const getSubBucket = (main: MainCategoryNode, subCat: ResolvedCategory): SubCategoryNode => {
    let sub = main.subCategories.find((s) => s.id === subCat.id);
    if (!sub) {
      sub = {
        id: subCat.id,
        name: subCat.name,
        slug: subCat.slug,
        isRoot: subCat.isRoot,
        brands: [],
      };
      main.subCategories.push(sub);
    }
    return sub;
  };

  const getMainBucket = (resolved: ResolvedCategory): MainCategoryNode => {
    let main = mains.get(resolved.rootAncestorId);
    if (!main) {
      main = {
        id: resolved.rootAncestorId,
        name: resolved.rootAncestorName,
        slug: resolved.rootAncestorSlug,
        subCategories: [],
      };
      mains.set(resolved.rootAncestorId, main);
    }
    return main;
  };

  for (const product of products) {
    const resolved = categoryResolver.get(product.categoryId);

    // Unknown category → fall back to an «uncategorized» main, single tier.
    const safeResolved: ResolvedCategory = resolved ?? {
      id: product.categoryId,
      name: "سایر دسته‌ها",
      slug: product.categoryId,
      rootAncestorId: "__uncategorized__",
      rootAncestorName: "سایر دسته‌ها",
      rootAncestorSlug: "__uncategorized__",
      isRoot: true,
    };

    const main = getMainBucket(safeResolved);
    const sub = getSubBucket(main, safeResolved);

    const brandId = product.brandId ?? UNBRANDED_ID;
    const brandName = product.brandId
      ? (brandNameMap.get(product.brandId) ?? "برند نامشخص")
      : UNBRANDED_NAME;

    getBrandBucket(sub, brandId, brandName).products.push(product);
  }

  // Jailed leaf sort — reorder ONLY the products[] inside each brand bucket.
  // Main / Sub / Brand node ordering is untouched. Stable for `latest`.
  for (const main of mains.values()) {
    for (const sub of main.subCategories) {
      for (const brand of sub.brands) {
        brand.products = sortLeafProducts(brand.products, sortBy);
      }
    }
  }

  // Immutable main-category sequence (slug-keyed). Stable for unknown roots.
  return Array.from(mains.values()).sort((a, b) => sequenceRank(a.slug) - sequenceRank(b.slug));
}
