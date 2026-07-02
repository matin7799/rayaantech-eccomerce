import { Inject, Injectable } from "@nestjs/common";
import type { AiMatchedProduct } from "@rayan-tech/types";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { MAX_SEMANTIC_RESULTS } from "./avalai.constants";
import type { ProductVectorRow } from "./interfaces/product-vector.interface";

@Injectable()
export class AvalAiProductRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Fetch a live product by slug for product-detail-page grounding.
   */
  async getProductBySlug(slug: string): Promise<ProductVectorRow | null> {
    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        id, name, slug, description, base_price, discounted_price, grade, stock,
        1.0 as similarity
      FROM products
      WHERE slug = ${slug}
        AND is_active = true
        AND stock > 0
      LIMIT 1
    `);

    return result.rows[0] ?? null;
  }

  /**
   * Execute pgvector cosine similarity search against active, stocked products.
   */
  async searchProductsByVector(
    embedding: number[],
    productSlug?: string,
  ): Promise<ProductVectorRow[]> {
    const vectorLiteral = `[${embedding.join(",")}]`;

    if (productSlug) {
      const result = await this.db.execute<ProductVectorRow>(sql`
        (
          SELECT
            id, name, slug, description, base_price, discounted_price, grade, stock,
            1 - (embedding <=> ${vectorLiteral}::vector) as similarity
          FROM products
          WHERE embedding IS NOT NULL
            AND is_active = true
            AND stock > 0
            AND slug = ${productSlug}
          LIMIT 1
        )
        UNION ALL
        (
          SELECT
            id, name, slug, description, base_price, discounted_price, grade, stock,
            1 - (embedding <=> ${vectorLiteral}::vector) as similarity
          FROM products
          WHERE embedding IS NOT NULL
            AND is_active = true
            AND stock > 0
            AND slug != ${productSlug}
            AND (embedding <=> ${vectorLiteral}::vector) < 0.4
          ORDER BY embedding <=> ${vectorLiteral}::vector ASC
          LIMIT ${MAX_SEMANTIC_RESULTS - 1}
        )
      `);

      return result.rows;
    }

    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        id, name, slug, description, base_price, discounted_price, grade, stock,
        1 - (embedding <=> ${vectorLiteral}::vector) as similarity
      FROM products
      WHERE embedding IS NOT NULL
        AND is_active = true
        AND stock > 0
        AND (embedding <=> ${vectorLiteral}::vector) < 0.4
      ORDER BY embedding <=> ${vectorLiteral}::vector ASC
      LIMIT ${MAX_SEMANTIC_RESULTS}
    `);

    return result.rows;
  }

  /**
   * Pivot-mode vector search — excludes a specific slug (the rejected product)
   * and uses a relaxed similarity threshold (0.6) to guarantee fresh alternatives
   * even in sparse catalogs where the standard 0.4 threshold would return nothing.
   *
   * @param embedding     Query embedding for semantic matching.
   * @param excludeSlug   Slug of the product the user rejected.
   * @param limit         Maximum results to return (default 3).
   */
  async searchProductsExcluding(
    embedding: number[],
    excludeSlug: string,
    limit = 3,
  ): Promise<ProductVectorRow[]> {
    const vectorLiteral = `[${embedding.join(",")}]`;

    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        id, name, slug, description, base_price, discounted_price, grade, stock,
        1 - (embedding <=> ${vectorLiteral}::vector) as similarity
      FROM products
      WHERE embedding IS NOT NULL
        AND is_active = true
        AND stock > 0
        AND slug != ${excludeSlug}
        AND (embedding <=> ${vectorLiteral}::vector) < 0.6
      ORDER BY embedding <=> ${vectorLiteral}::vector ASC
      LIMIT ${limit}
    `);

    // Graceful fallback: if vector search returns nothing, load featured products
    // excluding the rejected slug so the pivot never returns an empty context.
    if (result.rows.length === 0) {
      return this.getFeaturedProductsExcluding(excludeSlug, limit);
    }

    return result.rows;
  }

  /**
   * Fallback for pivot mode — returns featured/recent products excluding a slug.
   */
  private async getFeaturedProductsExcluding(
    excludeSlug: string,
    limit: number,
  ): Promise<ProductVectorRow[]> {
    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        id, name, slug, description, base_price, discounted_price, grade, stock,
        0.0 as similarity
      FROM products
      WHERE is_active = true
        AND stock > 0
        AND slug != ${excludeSlug}
      ORDER BY updated_at DESC
      LIMIT ${limit}
    `);

    return result.rows;
  }

  /**
   * Execute an iterative boundary price search to fetch at least 20 active stocked items.
   */
  async searchProductsByPriceWindow(targetPrice: number): Promise<ProductVectorRow[]> {
    let windowRange = 10_000_000;
    let matchedRows: ProductVectorRow[] = [];
    const maxIterations = 10;

    for (let i = 0; i < maxIterations; i++) {
      const minPrice = targetPrice - windowRange;
      const maxPrice = targetPrice + windowRange;

      const result = await this.db.execute<ProductVectorRow>(sql`
        SELECT
          id, name, slug, description, base_price, discounted_price, grade, stock,
          0.0 as similarity
        FROM products
        WHERE is_active = true
          AND stock > 0
          AND base_price::numeric >= ${minPrice}
          AND base_price::numeric <= ${maxPrice}
        ORDER BY base_price::numeric ASC
      `);

      matchedRows = result.rows;
      if (matchedRows.length >= 20) {
        break;
      }
      windowRange += 5_000_000;
    }

    return matchedRows;
  }

  /**
   * Fallback catalog search for products without embeddings or weak vector matches.
   */
  async searchProductsByText(
    query: string,
    options: { budgetLimit?: number | null; limit?: number } = {},
  ): Promise<ProductVectorRow[]> {
    const terms = tokenizeCatalogQuery(query);
    const limit = options.limit ?? MAX_SEMANTIC_RESULTS;

    if (terms.length === 0 && !options.budgetLimit) {
      return this.getFeaturedProducts();
    }

    const textPredicates = terms.map((term) => {
      const pattern = `%${term}%`;
      return sql`(
        p.name ILIKE ${pattern}
        OR COALESCE(p.short_description, '') ILIKE ${pattern}
        OR COALESCE(p.description, '') ILIKE ${pattern}
        OR COALESCE(b.name, '') ILIKE ${pattern}
        OR COALESCE(c.name, '') ILIKE ${pattern}
      )`;
    });

    const budgetLimit = options.budgetLimit ?? null;
    const textWhere =
      textPredicates.length > 0 ? sql`AND (${sql.join(textPredicates, sql` OR `)})` : sql``;
    const budgetWhere = budgetLimit
      ? sql`AND COALESCE(p.discounted_price, p.base_price)::numeric <= ${budgetLimit}`
      : sql``;

    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.base_price,
        p.discounted_price,
        p.grade,
        p.stock,
        0.0 as similarity
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.primary_category_id
      WHERE p.is_active = true
        AND p.stock > 0
        ${textWhere}
        ${budgetWhere}
      ORDER BY
        CASE WHEN p.discounted_price IS NOT NULL THEN 0 ELSE 1 END,
        p.updated_at DESC
      LIMIT ${limit}
    `);

    if (result.rows.length > 0) {
      return result.rows;
    }

    if (budgetLimit) {
      return this.searchProductsByPriceWindow(budgetLimit);
    }

    return this.getFeaturedProducts();
  }

  /**
   * Fetch active product variants for matched products.
   */
  async fetchActiveVariants(productIds: string[]): Promise<
    Array<{
      variantId: string;
      productId: string;
      productName: string;
      slug: string;
      stock: number;
      grade: string;
      price: number;
    }>
  > {
    if (productIds.length === 0) return [];

    const result = await this.db.execute<{
      variant_id: string;
      product_id: string;
      product_name: string;
      slug: string;
      stock: number;
      grade: string;
      base_price: string;
      price_modifier: string | null;
    }>(sql`
      SELECT
        pv.id as variant_id,
        p.id as product_id,
        p.name as product_name,
        p.slug,
        pv.stock,
        p.grade,
        p.base_price,
        pv.price_modifier
      FROM product_variants pv
      INNER JOIN products p ON pv.product_id = p.id
      WHERE p.id IN (${sql.join(
        productIds.map((id) => sql`${id}`),
        sql.raw(", "),
      )})
        AND p.is_active = true
        AND pv.stock > 0
    `);

    return result.rows.map((row) => {
      const base = Number(row.base_price);
      const mod = Number(row.price_modifier || "0");
      return {
        variantId: row.variant_id,
        productId: row.product_id,
        productName: row.product_name,
        slug: row.slug,
        stock: row.stock,
        grade: row.grade,
        price: base + mod,
      };
    });
  }

  /**
   * Resolve variant and product UUIDs from triggers to AiMatchedProduct refs.
   */
  async resolveTriggerProductRefs(variantUuids: string[]): Promise<AiMatchedProduct[]> {
    if (variantUuids.length === 0) return [];

    const extraResult = await this.db.execute<{
      id: string;
      name: string;
      slug: string;
      base_price: string;
      grade: string;
      stock: number;
    }>(sql`
      SELECT p.id, p.name, p.slug, p.base_price, p.grade, pv.stock
      FROM product_variants pv
      INNER JOIN products p ON pv.product_id = p.id
      WHERE pv.id IN (${sql.join(
        variantUuids.map((id) => sql`${id}`),
        sql.raw(", "),
      )})
         OR p.id IN (${sql.join(
           variantUuids.map((id) => sql`${id}`),
           sql.raw(", "),
         )})
    `);

    return extraResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      basePrice: row.base_price,
      grade: row.grade,
      stock: row.stock,
    }));
  }

  /**
   * Resolve product metadata references by slug list.
   * Used by the [Product: slug|name] shorthand tag trigger parser.
   */
  async resolveProductRefsBySlugs(slugs: string[]): Promise<AiMatchedProduct[]> {
    if (slugs.length === 0) return [];

    const result = await this.db.execute<{
      id: string;
      name: string;
      slug: string;
      base_price: string;
      grade: string;
      stock: number;
    }>(sql`
      SELECT id, name, slug, base_price, grade, stock
      FROM products
      WHERE slug IN (${sql.join(
        slugs.map((s) => sql`${s}`),
        sql.raw(", "),
      )})
        AND is_active = true
        AND stock > 0
    `);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      basePrice: row.base_price,
      grade: row.grade,
      stock: row.stock,
    }));
  }

  /**
   * Fetch featured/recent active products when pgvector returns empty.
   */
  async getFeaturedProducts(): Promise<ProductVectorRow[]> {
    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        id, name, slug, description, base_price, discounted_price, grade, stock,
        0.0 as similarity
      FROM products
      WHERE is_active = true AND stock > 0
      ORDER BY updated_at DESC
      LIMIT ${MAX_SEMANTIC_RESULTS}
    `);

    return result.rows;
  }

  /**
   * Map internal repository rows to client product metadata structures.
   */
  mapToProductRefs(products: ProductVectorRow[]): AiMatchedProduct[] {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.discounted_price ?? p.base_price,
      grade: p.grade,
      stock: p.stock,
    }));
  }

  /**
   * Build structured Persian product context string.
   */
  buildProductContext(products: ProductVectorRow[]): string {
    return products
      .map((p, i) => {
        const price = p.discounted_price ?? p.base_price;
        const stockStatus = p.stock > 0 ? `موجود (${p.stock} عدد)` : "ناموجود";
        return [
          `[${i + 1}] ${p.name}`,
          `   قیمت: ${Number(price).toLocaleString("fa-IR")} تومان`,
          `   وضعیت: ${p.grade}`,
          `   موجودی: ${stockStatus}`,
          `   لینک: /${p.slug}`,
          p.description ? `   توضیحات: ${p.description.slice(0, 250)}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");
  }
}

function tokenizeCatalogQuery(query: string): string[] {
  const normalized = query
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!normalized) return [];

  const ignored = new Set([
    "برای",
    "دارید",
    "دارین",
    "میخوام",
    "میخواستم",
    "چی",
    "چیه",
    "تا",
    "تومان",
    "تومن",
    "میلیون",
    "لطفا",
    "معرفی",
    "کنید",
  ]);

  return Array.from(
    new Set(
      normalized
        .split(" ")
        .map((term) => term.trim())
        .filter((term) => term.length >= 2 && !ignored.has(term) && !/^\d+$/.test(term)),
    ),
  ).slice(0, 8);
}
