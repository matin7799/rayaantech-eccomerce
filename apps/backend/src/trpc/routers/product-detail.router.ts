import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import {
  coerceDisplayTier,
  resolveProductPrice,
  resolveRetailBaseline,
} from "../../pricing/pricing.service";
import type { ProductPriceRow, ResolvedPrice } from "../../pricing/pricing.types";
import { publicProcedure, router } from "../trpc.init";
import type { CatalogProductRow } from "./products.router";

/**
 * Product detail tRPC router — deep-fetches a single product with all
 * related data for the PDP (variants, media gallery, EAV attributes).
 */
export function createProductDetailRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get a single product by slug — deep fetch with variants, media, and attributes.
     */
    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input, ctx }) => {
        // 1. Fetch base product
        const productResult = await db.execute<
          CatalogProductRow & { description: string | null }
        >(sql`
          SELECT id, name, slug, sku, base_price, discounted_price, torob_price,
                 wholesale_price,
                 campaign_price, campaign_start_at, campaign_end_at,
                 grade, stock, is_active, primary_category_id, brand_id, description, short_description
          FROM products WHERE slug = ${input.slug} AND is_active = true
          LIMIT 1
        `);

        const row = productResult.rows[0];
        if (!row) return { product: null };

        const productId = row.id;

        // 2. Fetch media gallery
        interface MediaRow extends Record<string, unknown> {
          id: string;
          url: string;
          webp_url: string | null;
          mime_type: string;
          display_order: number;
          is_thumbnail: boolean;
        }

        const mediaResult = await db.execute<MediaRow>(sql`
          SELECT m.id, m.url, m.webp_url, m.mime_type,
                 pm.display_order, pm.is_thumbnail
          FROM media m
          INNER JOIN product_media pm ON pm.media_id = m.id
          WHERE pm.product_id = ${productId}
          ORDER BY pm.display_order ASC
        `);

        // 3. Fetch variants
        interface VariantRow extends Record<string, unknown> {
          id: string;
          sku: string;
          stock: number;
          price_modifier: string | null;
        }

        const variantsResult = await db.execute<VariantRow>(sql`
          SELECT id, sku, stock, price_modifier
          FROM product_variants
          WHERE product_id = ${productId}
          ORDER BY created_at ASC
        `);

        // 4. Fetch EAV attributes for all variants (with slug + display_order)
        interface VariantAttrRow extends Record<string, unknown> {
          variant_id: string;
          key_name: string;
          key_slug: string | null;
          key_order: number;
          value: string;
        }

        const attrsResult = await db.execute<VariantAttrRow>(sql`
          SELECT vav.variant_id, ak.name AS key_name, ak.slug AS key_slug,
                 ak.display_order AS key_order, av.value
          FROM variant_attribute_values vav
          INNER JOIN attribute_values av ON av.id = vav.value_id
          INNER JOIN attribute_keys ak ON ak.id = av.key_id
          INNER JOIN product_variants pv ON pv.id = vav.variant_id
          WHERE pv.product_id = ${productId}
          ORDER BY ak.display_order ASC, ak.name ASC, av.value ASC
        `);

        // Build variant objects with their attributes + per-variant resolved prices
        const variantAttrMap = new Map<string, { key: string; value: string }[]>();
        for (const attr of attrsResult.rows) {
          const existing = variantAttrMap.get(attr.variant_id) ?? [];
          existing.push({ key: attr.key_name, value: attr.value });
          variantAttrMap.set(attr.variant_id, existing);
        }

        const buyer = ctx.buyer;

        const variants = variantsResult.rows.map((v) => {
          // Build a product row copy with this variant's price modifier
          const variantRow: ProductPriceRow = {
            base_price: row.base_price,
            discounted_price: row.discounted_price,
            torob_price: row.torob_price,
            wholesale_price: row.wholesale_price,
            campaign_price: row.campaign_price,
            campaign_start_at: row.campaign_start_at,
            campaign_end_at: row.campaign_end_at,
            price_modifier: v.price_modifier,
          };
          const resolved: ResolvedPrice = resolveProductPrice(variantRow, buyer);
          return {
            id: v.id,
            sku: v.sku,
            stock: v.stock,
            priceModifier: parseInt(v.price_modifier ?? "0", 10),
            effectivePrice: resolved.effectivePrice,
            pricingTier: coerceDisplayTier(resolved.pricingTier, buyer),
            attributes: variantAttrMap.get(v.id) ?? [],
          };
        });

        // 5. Build grouped attributes with slugs (union across all variants)
        const allAttrs = new Map<
          string,
          { slug: string | null; order: number; values: Set<string> }
        >();
        for (const attr of attrsResult.rows) {
          const existing = allAttrs.get(attr.key_name) ?? {
            slug: attr.key_slug,
            order: attr.key_order,
            values: new Set(),
          };
          existing.values.add(attr.value);
          allAttrs.set(attr.key_name, existing);
        }

        const groupedAttributes = Array.from(allAttrs.entries())
          .sort((a, b) => a[1].order - b[1].order)
          .map(([key, data]) => ({
            key,
            slug: data.slug,
            values: Array.from(data.values),
          }));

        // 6. Fetch QuickView attribute slugs for this product's category
        interface QuickViewAttrRow extends Record<string, unknown> {
          attribute_slug: string;
          display_order: number;
        }

        const quickviewResult = await db.execute<QuickViewAttrRow>(sql`
          SELECT ak.slug AS attribute_slug, cak.display_order
          FROM category_attribute_keys cak
          INNER JOIN attribute_keys ak ON ak.id = cak.attribute_key_id
          WHERE cak.category_id = ${row.primary_category_id}
            AND cak.is_quickview = true
            AND ak.slug IS NOT NULL
          ORDER BY cak.display_order ASC
        `);

        const quickviewSlugs = quickviewResult.rows.map((r) => r.attribute_slug);

        const gallery = mediaResult.rows.map((m) => ({
          id: m.id,
          url: m.url,
          webpUrl: m.webp_url,
          mimeType: m.mime_type,
          displayOrder: m.display_order,
          isThumbnail: m.is_thumbnail,
        }));

        // Resolve base product price (no variant modifier) for PDP display
        const baseResolved: ResolvedPrice = resolveProductPrice(row, buyer);
        const retailBaseline = resolveRetailBaseline(row);

        return {
          product: {
            id: row.id,
            name: row.name,
            slug: row.slug,
            sku: row.sku,
            description: row.description,
            short_description: row.short_description,
            grade: row.grade,
            stock: row.stock,
            categoryId: row.primary_category_id,
            brandId: row.brand_id,
            inStock: row.stock > 0,
            /** Server-resolved effective price for the base product (integer Rials). */
            effectivePrice: baseResolved.effectivePrice,
            /** Retail baseline for struck-through rendering. */
            displayBaseline: baseResolved.displayBaseline ?? retailBaseline,
            /** Server-computed discount percent. */
            discountPercent: baseResolved.discountPercent,
            /** Active pricing tier for this buyer. */
            pricingTier: coerceDisplayTier(baseResolved.pricingTier, buyer),
            /** Installment-safe base price (always retail, never torob/wholesale). */
            installmentBasePrice: retailBaseline,
            gallery,
            variants,
            attributes: groupedAttributes,
            quickviewSlugs,
          },
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
  });
}

export type ProductDetailRouter = ReturnType<typeof createProductDetailRouter>;
