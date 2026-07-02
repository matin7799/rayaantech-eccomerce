import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import {
  coerceDisplayTier,
  guestBuyerContext,
  resolveProductPrice,
} from "../../pricing/pricing.service";
import type { ProductPriceRow, ResolvedPrice } from "../../pricing/pricing.types";
import { publicProcedure, router } from "../trpc.init";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** * Product listing row shape from the catalog query.
 */
export interface CatalogProductRow extends Record<string, unknown>, ProductPriceRow {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  base_price: string;
  discounted_price: string | null;
  torob_price: string | null;
  wholesale_price: string | null;
  campaign_price: string | null;
  campaign_start_at: string | null;
  campaign_end_at: string | null;
  grade: string;
  stock: number;
  is_active: boolean;
  primary_category_id: string;
  brand_id: string | null;
  thumbnail_url: string | null;
}
/**
 * Attribute facet row for EAV filter options.
 */ interface AttributeFacetRow extends Record<string, unknown> {
  key_id: string;
  key_name: string;
  value_id: string;
  value: string;
}

/**
 * Catalog list item — server-resolved pricing contract emitted to the client.
 *
 * INVARIANT (Zero Client-Side Calculus): The client never computes a discount
 * or selects between price tiers. `effectivePrice`, `displayBaseline`,
 * `discountPercent`, and `pricingTier` are all resolved server-side.
 */
export interface CatalogListItem {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  grade: string;
  stock: number;
  categoryId: string;
  brandId: string | null;
  thumbnailUrl: string | null;
  inStock: boolean;
  /** The price the buyer pays (integer Rials, server-resolved). */
  effectivePrice: number;
  /** Retail baseline for struck-through rendering (null when equal). */
  displayBaseline: number | null;
  /** Whole-percent discount from baseline (server-computed). */
  discountPercent: number | null;
  /** Which tier won — drives which badge the client renders. */
  pricingTier: "regular" | "torob" | "wholesale";
}
/**
 * Products tRPC router — paginated catalog with faceted filtering.
 */
export function createProductsRouter(db: NodePgDatabase) {
  return router({
    /**
     * Paginated product listing with dynamic filters.
     */
    list: publicProcedure
      .input(
        z.object({
          page: z.number().int().min(1).default(1),
          limit: z.number().int().min(1).max(48).default(20),
          categoryId: z.string().min(1).optional(),
          brandId: z.string().min(1).optional(),
          grade: z.string().optional(),
          minPrice: z.number().int().min(0).optional(),
          maxPrice: z.number().int().min(0).optional(),
          attributeValueIds: z.array(z.string().uuid()).optional(),
          showOutOfStock: z.boolean().default(false),
          sortBy: z.enum(["latest", "price_asc", "price_desc"]).default("latest"),
        }),
      )
      .query(async ({ input, ctx }) => {
        const { page, limit, showOutOfStock, sortBy } = input;
        const buyer = ctx.buyer ?? guestBuyerContext();
        const offset = (page - 1) * limit;

        // ─── Resolve multi-select categoryId (comma-separated slugs or UUIDs) ───
        const resolvedCategoryIds: string[] = [];
        if (input.categoryId) {
          const categoryInputs = input.categoryId.split(",").filter(Boolean);
          for (const cat of categoryInputs) {
            if (UUID_RE.test(cat)) {
              resolvedCategoryIds.push(cat);
            } else {
              const r = await db.execute<{ id: string } & Record<string, unknown>>(
                sql`SELECT id FROM categories WHERE slug = ${cat} LIMIT 1`,
              );
              if (r.rows[0]?.id) resolvedCategoryIds.push(r.rows[0].id);
            }
          }
        }

        // ─── Resolve multi-select brandId (comma-separated slugs or UUIDs) ───
        const resolvedBrandIds: string[] = [];
        if (input.brandId) {
          const brandInputs = input.brandId.split(",").filter(Boolean);
          for (const brand of brandInputs) {
            if (UUID_RE.test(brand)) {
              resolvedBrandIds.push(brand);
            } else {
              const r = await db.execute<{ id: string } & Record<string, unknown>>(
                sql`SELECT id FROM brands WHERE slug = ${brand} LIMIT 1`,
              );
              if (r.rows[0]?.id) resolvedBrandIds.push(r.rows[0].id);
            }
          }
        }

        // Build WHERE conditions dynamically
        const conditions: string[] = ["p.is_active = true"];

        // Category filter: OR across selected categories (match primary OR secondary)
        if (resolvedCategoryIds.length > 0) {
          const catIds = resolvedCategoryIds.map((id) => `'${id}'`).join(",");
          conditions.push(
            `(p.primary_category_id IN (${catIds}) OR EXISTS (SELECT 1 FROM product_secondary_categories psc WHERE psc.product_id = p.id AND psc.category_id IN (${catIds})))`,
          );
        }

        // Brand filter: OR across selected brands
        if (resolvedBrandIds.length > 0) {
          const brandIds = resolvedBrandIds.map((id) => `'${id}'`).join(",");
          conditions.push(`p.brand_id IN (${brandIds})`);
        }
        if (input.grade) {
          conditions.push(`p.grade = '${input.grade}'`);
        }
        if (input.minPrice !== undefined) {
          conditions.push(`p.base_price >= ${input.minPrice}`);
        }
        if (input.maxPrice !== undefined) {
          conditions.push(`p.base_price <= ${input.maxPrice}`);
        }
        // EAV attribute filter
        const hasAttrFilter = input.attributeValueIds && input.attributeValueIds.length > 0;
        if (hasAttrFilter) {
          // GROUP BY + HAVING ensures product has ALL requested attrs
          conditions.push("1=1");
        }

        const whereClause = conditions.join(" AND ");

        // ORDER BY: Stock Isolation Guard — out-of-stock ALWAYS at bottom
        // Then apply user-selected sort within each stock group
        const stockGuard = "CASE WHEN p.stock = 0 THEN 1 ELSE 0 END ASC";
        let sortClause: string;

        switch (sortBy) {
          case "price_asc":
            sortClause = `${stockGuard}, p.base_price ASC`;
            break;
          case "price_desc":
            sortClause = `${stockGuard}, p.base_price DESC`;
            break;
          case "latest":
          default:
            sortClause = `${stockGuard}, p.created_at DESC`;
            break;
        }

        const orderBy = showOutOfStock ? sortClause.replace(`${stockGuard}, `, "") : sortClause;

        // Simpler approach: use subquery for EAV filter
        let finalQuery: string;
        let finalCountQuery: string;

        if (hasAttrFilter) {
          const ids = input.attributeValueIds!.map((id) => `'${id}'`).join(",");
          const attrCount = input.attributeValueIds!.length;
          const baseWhere = conditions.filter((c) => c !== "1=1").join(" AND ");

          finalCountQuery = `
            SELECT COUNT(*)::text as total FROM (
              SELECT p.id FROM products p
              INNER JOIN product_variants pv ON pv.product_id = p.id
              INNER JOIN variant_attribute_values vav ON vav.variant_id = pv.id
                AND vav.value_id IN (${ids})
              WHERE ${baseWhere}
              GROUP BY p.id
              HAVING COUNT(DISTINCT vav.value_id) = ${attrCount}
            ) sub
          `;

          finalQuery = `
            SELECT p.id, p.name, p.slug, p.sku, p.base_price, p.discounted_price,
                   p.torob_price, p.wholesale_price,
                   p.campaign_price, p.campaign_start_at, p.campaign_end_at,
                   p.grade, p.stock, p.is_active,
                   p.primary_category_id, p.brand_id,
                   (SELECT m.url FROM product_media pm
                    INNER JOIN media m ON m.id = pm.media_id
                    WHERE pm.product_id = p.id
                    ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1) AS thumbnail_url
            FROM products p
            WHERE ${baseWhere}
              AND p.id IN (
                SELECT pv.product_id FROM product_variants pv
                INNER JOIN variant_attribute_values vav ON vav.variant_id = pv.id
                  AND vav.value_id IN (${ids})
                GROUP BY pv.product_id
                HAVING COUNT(DISTINCT vav.value_id) = ${attrCount}
              )
            ORDER BY ${orderBy}
            LIMIT ${limit} OFFSET ${offset}
          `;
        } else {
          finalCountQuery = `
            SELECT COUNT(*)::text as total FROM products p WHERE ${whereClause}
          `;
          finalQuery = `
            SELECT p.id, p.name, p.slug, p.sku, p.base_price, p.discounted_price,
                   p.torob_price, p.wholesale_price,
                   p.campaign_price, p.campaign_start_at, p.campaign_end_at,
                   p.grade, p.stock, p.is_active,
                   p.primary_category_id, p.brand_id,
                   (SELECT m.url FROM product_media pm
                    INNER JOIN media m ON m.id = pm.media_id
                    WHERE pm.product_id = p.id
                    ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1) AS thumbnail_url
            FROM products p
            WHERE ${whereClause}
            ORDER BY ${orderBy}
            LIMIT ${limit} OFFSET ${offset}
          `;
        }

        const [productsResult, countResult] = await Promise.all([
          db.execute<CatalogProductRow>(sql.raw(finalQuery)),
          db.execute<{ total: string } & Record<string, unknown>>(sql.raw(finalCountQuery)),
        ]);

        const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

        if (process.env.NODE_ENV === "development") {
          console.log("[products.list] SQL:", finalQuery.replace(/\s+/g, " ").trim());
          console.log("[products.list] Total:", total, "| Page:", page);
        }

        const items = productsResult.rows.map((row): CatalogListItem => {
          const resolved: ResolvedPrice = resolveProductPrice(row, buyer);
          return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            sku: row.sku,
            grade: row.grade,
            stock: row.stock,
            categoryId: row.primary_category_id,
            brandId: row.brand_id,
            thumbnailUrl: row.thumbnail_url,
            inStock: row.stock > 0,
            effectivePrice: resolved.effectivePrice,
            displayBaseline: resolved.displayBaseline,
            discountPercent: resolved.discountPercent,
            pricingTier: coerceDisplayTier(resolved.pricingTier, buyer),
          };
        });

        return {
          items,
          total,
          page,
          limit,
          hasMore: offset + items.length < total,
          pricing: {
            remainingTorobTtl: buyer.torob?.ttlSeconds ?? 0,
            tier: buyer.torob?.active
              ? "torob"
              : buyer.wholesale?.status === "approved"
                ? "wholesale"
                : "regular",
          },
        };
      }),

    /**
     * Get available filter facets for the catalog sidebar.
     * Returns brands, grades, and EAV attribute key/value pairs
     * scoped to the given category (if provided).
     */
    facets: publicProcedure
      .input(z.object({ categoryId: z.string().min(1).optional() }))
      .query(async ({ input }) => {
        // Resolve categoryId: accept UUID or slug
        let resolvedCategoryId: string | undefined;
        if (input.categoryId) {
          if (UUID_RE.test(input.categoryId)) {
            resolvedCategoryId = input.categoryId;
          } else {
            const r = await db.execute<{ id: string } & Record<string, unknown>>(
              sql`SELECT id FROM categories WHERE slug = ${input.categoryId} LIMIT 1`,
            );
            resolvedCategoryId = r.rows[0]?.id;
          }
        }

        // Brands available in category
        const brandCondition = resolvedCategoryId
          ? sql`WHERE p.primary_category_id = ${resolvedCategoryId} AND p.is_active = true`
          : sql`WHERE p.is_active = true`;

        const brandsResult = await db.execute<
          { id: string; name: string; slug: string } & Record<string, unknown>
        >(sql`
          SELECT DISTINCT b.id, b.name, b.slug
          FROM brands b
          INNER JOIN products p ON p.brand_id = b.id
          ${brandCondition}
          ORDER BY b.name ASC
        `);

        // EAV attributes available for products in category
        const attrCondition = resolvedCategoryId
          ? sql`AND p.primary_category_id = ${resolvedCategoryId}`
          : sql``;

        const attrsResult = await db.execute<AttributeFacetRow>(sql`
          SELECT DISTINCT ak.id as key_id, ak.name as key_name,
                 av.id as value_id, av.value
          FROM attribute_keys ak
          INNER JOIN attribute_values av ON av.key_id = ak.id
          INNER JOIN variant_attribute_values vav ON vav.value_id = av.id
          INNER JOIN product_variants pv ON pv.id = vav.variant_id
          INNER JOIN products p ON p.id = pv.product_id
          WHERE p.is_active = true ${attrCondition}
          ORDER BY ak.name ASC, av.value ASC
        `);

        // Group attributes by key
        const attributeGroups = new Map<
          string,
          { keyId: string; keyName: string; values: { id: string; value: string }[] }
        >();

        for (const row of attrsResult.rows) {
          if (!attributeGroups.has(row.key_id)) {
            attributeGroups.set(row.key_id, {
              keyId: row.key_id,
              keyName: row.key_name,
              values: [],
            });
          }
          attributeGroups.get(row.key_id)!.values.push({
            id: row.value_id,
            value: row.value,
          });
        }

        return {
          brands: brandsResult.rows.map((b) => ({ id: b.id, name: b.name, slug: b.slug })),
          grades: ["open_box", "stock", "refurbished", "like_new", "used"],
          attributes: Array.from(attributeGroups.values()),
        };
      }),

    /**
     * Get transparent pricing parameters mapping import/VAT/inspection metrics.
     */
    getPricingMatrix: publicProcedure.query(async () => {
      return {
        baseImportFeePercentage: 12,
        refurbishmentInspectionsCostTomans: 450000,
        averageMarginPercentage: 8,
        vatRatePercentage: 9,
        torobComparisonAveragePercent: -12,
        priceFormula:
          "قیمت نهایی = هزینه واردات + هزینه بهسازی + ۸٪ سود + ۹٪ مالیات بر ارزش افزوده",
        lastExchangeRateUpdate: new Date().toISOString(),
      };
    }),
  });
}

export type ProductsRouter = ReturnType<typeof createProductsRouter>;
