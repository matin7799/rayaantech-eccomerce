import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const quickUpdateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(512),
  basePrice: z.number().int().min(1000),
  stock: z.number().int().min(0),
});

const fullUpdateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(512),
  slug: z.string().min(3).max(512),
  sku: z.string().min(3).max(128),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().int().min(1000),
  wholesalePrice: z.number().int().optional(),
  discountedPrice: z.number().int().optional(),
  torobPrice: z.number().int().nullable().optional(),
  stock: z.number().int().min(0),
  grade: z.enum(["open_box", "stock", "refurbished", "like_new", "used"]),
  isActive: z.boolean().default(true),
  primaryCategoryId: z.string().uuid().nullable().optional(),
  attributeValueIds: z.array(z.string().uuid()).optional(),
});

export function createAdminProductsRouter(db: NodePgDatabase) {
  return router({
    /** List all products with pricing tiers. */
    listProducts: adminProcedure.query(async () => {
      // 1. Fetch base products with category and description
      const result = await db.execute<
        {
          id: string;
          name: string;
          slug: string;
          sku: string | null;
          grade: string;
          base_price: string;
          wholesale_price: string | null;
          discounted_price: string | null;
          torob_price: string | null;
          stock: number;
          is_active: boolean;
          primary_category_id: string | null;
          thumbnail_url: string | null;
          description: string | null;
          short_description: string | null;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT p.id, p.name, p.slug, p.sku, p.grade, p.base_price, p.wholesale_price, p.discounted_price, p.torob_price, p.stock, p.is_active, p.primary_category_id, p.description, p.short_description,
            (SELECT m.url FROM product_media pm
             INNER JOIN media m ON m.id = pm.media_id
             WHERE pm.product_id = p.id
             ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1) AS thumbnail_url,
            p.created_at, p.updated_at
            FROM products p ORDER BY p.updated_at DESC`,
      );

      // 2. Fetch all variant attribute values for all products
      const attrsResult = await db.execute<
        { product_id: string; value_id: string } & Record<string, unknown>
      >(sql`
        SELECT pv.product_id, vav.value_id
        FROM variant_attribute_values vav
        INNER JOIN product_variants pv ON pv.id = vav.variant_id
      `);

      const productAttrsMap = new Map<string, string[]>();
      for (const attr of attrsResult.rows) {
        const existing = productAttrsMap.get(attr.product_id) ?? [];
        if (!existing.includes(attr.value_id)) {
          existing.push(attr.value_id);
        }
        productAttrsMap.set(attr.product_id, existing);
      }

      return {
        products: result.rows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          sku: r.sku,
          grade: r.grade,
          basePrice: Number(r.base_price),
          wholesalePrice: r.wholesale_price ? Number(r.wholesale_price) : null,
          discountedPrice: r.discounted_price ? Number(r.discounted_price) : null,
          torobPrice: r.torob_price ? Number(r.torob_price) : null,
          stock: r.stock,
          isActive: r.is_active,
          primaryCategoryId: r.primary_category_id,
          thumbnailUrl: r.thumbnail_url,
          description: r.description ?? "",
          shortDescription: r.short_description ?? "",
          attributeValueIds: productAttrsMap.get(r.id) ?? [],
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
        total: result.rows.length,
      };
    }),

    /**
     * Fetch a single product's full editable row by id.
     * Powers the inline edit dialog on the storefront PDP (staff-only), so we
     * don't have to pull the entire catalog just to edit one product.
     */
    getProductForEdit: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        const result = await db.execute<
          {
            id: string;
            name: string;
            slug: string;
            sku: string | null;
            grade: string;
            base_price: string;
            wholesale_price: string | null;
            discounted_price: string | null;
            torob_price: string | null;
            stock: number;
            is_active: boolean;
            primary_category_id: string | null;
            thumbnail_url: string | null;
            description: string | null;
            short_description: string | null;
            created_at: string;
            updated_at: string;
          } & Record<string, unknown>
        >(sql`
          SELECT p.id, p.name, p.slug, p.sku, p.grade, p.base_price, p.wholesale_price,
                 p.discounted_price, p.torob_price, p.stock, p.is_active, p.primary_category_id,
                 p.description, p.short_description,
                 (SELECT m.url FROM product_media pm
                  INNER JOIN media m ON m.id = pm.media_id
                  WHERE pm.product_id = p.id
                  ORDER BY pm.is_thumbnail DESC, pm.display_order ASC LIMIT 1) AS thumbnail_url,
                 p.created_at, p.updated_at
          FROM products p WHERE p.id = ${input.id} LIMIT 1
        `);

        const r = result.rows[0];
        if (!r) return { product: null };

        const attrsResult = await db.execute<{ value_id: string } & Record<string, unknown>>(sql`
          SELECT DISTINCT vav.value_id
          FROM variant_attribute_values vav
          INNER JOIN product_variants pv ON pv.id = vav.variant_id
          WHERE pv.product_id = ${input.id}
        `);

        return {
          product: {
            id: r.id,
            name: r.name,
            slug: r.slug,
            sku: r.sku,
            grade: r.grade,
            basePrice: Number(r.base_price),
            wholesalePrice: r.wholesale_price ? Number(r.wholesale_price) : null,
            discountedPrice: r.discounted_price ? Number(r.discounted_price) : null,
            torobPrice: r.torob_price ? Number(r.torob_price) : null,
            stock: r.stock,
            isActive: r.is_active,
            primaryCategoryId: r.primary_category_id,
            thumbnailUrl: r.thumbnail_url,
            description: r.description ?? "",
            shortDescription: r.short_description ?? "",
            attributeValueIds: attrsResult.rows.map((a) => a.value_id),
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          },
        };
      }),

    /** Quick update: name, price, stock only. */
    quickUpdateProduct: adminProcedure
      .input(quickUpdateProductSchema)
      .mutation(async ({ input }) => {
        await db.execute(sql`
          UPDATE products
          SET name = ${input.name}, base_price = ${input.basePrice}::numeric, stock = ${input.stock}, updated_at = NOW()
          WHERE id = ${input.id}
        `);
        return { success: true, id: input.id };
      }),

    /** Full update: all product properties. */
    fullUpdateProduct: adminProcedure.input(fullUpdateProductSchema).mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        // Step 1: Update main products table
        await tx.execute(sql`
          UPDATE products
          SET name = ${input.name},
              slug = ${input.slug},
              sku = ${input.sku},
              short_description = ${input.shortDescription ?? null},
              description = ${input.description ?? null},
              base_price = ${input.basePrice}::numeric,
              wholesale_price = ${input.wholesalePrice ?? null}::numeric,
              discounted_price = ${input.discountedPrice ?? null}::numeric,
              torob_price = ${input.torobPrice ?? null}::numeric,
              stock = ${input.stock},
              grade = ${input.grade},
              is_active = ${input.isActive},
              primary_category_id = ${input.primaryCategoryId ?? null},
              updated_at = NOW()
          WHERE id = ${input.id}
        `);

        // Step 2: Sync product attributes (EAV) on the primary variant
        if (input.attributeValueIds) {
          // Get the first variant
          const varRes = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
            SELECT id FROM product_variants WHERE product_id = ${input.id} LIMIT 1
          `);
          let variantId = varRes.rows[0]?.id;

          if (!variantId) {
            // Create variant if it doesn't exist
            const newVarRes = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
              INSERT INTO product_variants (product_id, sku, stock)
              VALUES (${input.id}, ${input.sku}, ${input.stock})
              RETURNING id
            `);
            variantId = newVarRes.rows[0]?.id;
          }

          if (variantId) {
            // Delete existing attributes mapping for this variant
            await tx.execute(sql`
              DELETE FROM variant_attribute_values WHERE variant_id = ${variantId}
            `);

            // Insert new attributes mapping
            for (const valId of input.attributeValueIds) {
              await tx.execute(sql`
                INSERT INTO variant_attribute_values (variant_id, value_id)
                VALUES (${variantId}, ${valId})
              `);
            }
          }
        }
      });

      return { success: true, id: input.id };
    }),

    /** List all categories (for override selector). */
    listCategories: adminProcedure.query(async () => {
      const result = await db.execute<
        { id: string; name: string; slug: string } & Record<string, unknown>
      >(sql`SELECT id, name, slug FROM categories ORDER BY name ASC`);
      return { categories: result.rows };
    }),

    /** Create a new attribute value for a key. */
    createAttributeValue: adminProcedure
      .input(
        z.object({
          keyId: z.string().uuid(),
          value: z.string().min(1).max(256),
        }),
      )
      .mutation(async ({ input }) => {
        const checkRes = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          SELECT id FROM attribute_values
          WHERE key_id = ${input.keyId} AND value = ${input.value}
          LIMIT 1
        `);
        let valueId = checkRes.rows[0]?.id;

        if (!valueId) {
          const insertRes = await db.execute<{ id: string } & Record<string, unknown>>(sql`
            INSERT INTO attribute_values (key_id, value)
            VALUES (${input.keyId}, ${input.value})
            RETURNING id
          `);
          valueId = insertRes.rows[0]?.id;
        }

        return { success: true, valueId };
      }),

    /** Delete an attribute key entirely from the database. */
    deleteAttributeKey: adminProcedure
      .input(z.object({ keyId: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await db.transaction(async (tx) => {
          await tx.execute(sql`
            DELETE FROM variant_attribute_values
            WHERE value_id IN (SELECT id FROM attribute_values WHERE key_id = ${input.keyId})
          `);
          await tx.execute(sql`
            DELETE FROM attribute_values WHERE key_id = ${input.keyId}
          `);
          await tx.execute(sql`
            DELETE FROM attribute_keys WHERE id = ${input.keyId}
          `);
        });
        return { success: true };
      }),
  });
}
