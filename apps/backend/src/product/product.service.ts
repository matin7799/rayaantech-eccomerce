import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import type {
  CreateProductDto,
  CreateProductVariantDto,
  ProductRow,
  UpdateProductDto,
  VariantRow,
} from "./interfaces/product-dto.interface";

/**
 * Product catalog service implementing atomic multi-table operations.
 *
 * All mutations that touch multiple tables (products + variants +
 * variant_attribute_values + secondary_categories) are wrapped in
 * Drizzle's `db.transaction()` to guarantee zero orphan rows on failure.
 *
 * On any relational insertion failure (e.g., duplicate SKU, invalid FK),
 * the entire transaction is rolled back atomically.
 */
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Create a product with all relational data in a single atomic transaction.
   *
   * Insertion order:
   * 1. Insert base `products` row
   * 2. Insert `product_secondary_categories` junction rows
   * 3. Insert `product_variants` (SKUs) rows
   * 4. Insert `variant_attribute_values` junction rows for each variant
   *
   * If ANY step fails, the entire transaction rolls back — no orphans.
   */
  async createProduct(dto: CreateProductDto): Promise<{ id: string }> {
    return this.db.transaction(async (tx) => {
      // Step 1: Insert the base product row
      const productResult = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
        INSERT INTO products (
          name, slug, description, primary_category_id, brand_id, grade,
          base_price, wholesale_price, torob_price, discounted_price,
          campaign_price, campaign_start_at, campaign_end_at, stock, is_active
        )
        VALUES (
          ${dto.name},
          ${dto.slug},
          ${dto.description ?? null},
          ${dto.primaryCategoryId},
          ${dto.brandId ?? null},
          ${dto.grade ?? "stock"},
          ${dto.basePrice},
          ${dto.wholesalePrice ?? null},
          ${dto.torobPrice ?? null},
          ${dto.discountedPrice ?? null},
          ${dto.campaignPrice ?? null},
          ${dto.campaignStartAt ? new Date(dto.campaignStartAt).toISOString() : null},
          ${dto.campaignEndAt ? new Date(dto.campaignEndAt).toISOString() : null},
          ${dto.stock ?? 0},
          ${dto.isActive ?? true}
        )
        RETURNING id
      `);

      const productId = productResult.rows[0]?.id;
      if (!productId) {
        throw new BadRequestException("Failed to create product");
      }

      this.logger.debug(`Created product ${productId}`);

      // Step 2: Insert secondary category bindings (if any)
      if (dto.secondaryCategoryIds && dto.secondaryCategoryIds.length > 0) {
        for (const categoryId of dto.secondaryCategoryIds) {
          await tx.execute(sql`
            INSERT INTO product_secondary_categories (product_id, category_id)
            VALUES (${productId}, ${categoryId})
          `);
        }
        this.logger.debug(`Linked ${dto.secondaryCategoryIds.length} secondary categories`);
      }

      // Step 3 & 4: Insert variants and their attribute bindings
      if (dto.variants && dto.variants.length > 0) {
        await this.insertVariants(tx, productId, dto.variants);
      }

      return { id: productId };
    });
  }

  /**
   * Get a product by ID with its variants.
   */
  async getProductById(id: string): Promise<{ product: ProductRow; variants: VariantRow[] }> {
    const productResult = await this.db.execute<ProductRow>(sql`
      SELECT id, name, slug, description, primary_category_id, brand_id, grade,
             base_price, wholesale_price, torob_price, discounted_price,
             campaign_price, campaign_start_at, campaign_end_at, stock, is_active,
             created_at, updated_at
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `);

    const product = productResult.rows[0];
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const variantsResult = await this.db.execute<VariantRow>(sql`
      SELECT id, product_id, sku, stock, price_modifier, created_at, updated_at
      FROM product_variants
      WHERE product_id = ${id}
      ORDER BY created_at ASC
    `);

    return { product, variants: variantsResult.rows };
  }

  /**
   * List products with pagination.
   */
  async listProducts(params: {
    page: number;
    limit: number;
    isActive?: boolean;
    categoryId?: string;
  }): Promise<{ products: ProductRow[]; total: number }> {
    const offset = (params.page - 1) * params.limit;

    // Build dynamic conditions
    let whereClause = sql`WHERE 1=1`;
    if (params.isActive !== undefined) {
      whereClause = sql`${whereClause} AND is_active = ${params.isActive}`;
    }
    if (params.categoryId) {
      whereClause = sql`${whereClause} AND primary_category_id = ${params.categoryId}`;
    }

    const countResult = await this.db.execute<{ count: string } & Record<string, unknown>>(sql`
      SELECT COUNT(*)::text as count FROM products ${whereClause}
    `);

    const total = parseInt(countResult.rows[0]?.count ?? "0", 10);

    const productsResult = await this.db.execute<ProductRow>(sql`
      SELECT id, name, slug, description, primary_category_id, brand_id, grade,
             base_price, wholesale_price, torob_price, discounted_price,
             campaign_price, campaign_start_at, campaign_end_at, stock, is_active,
             created_at, updated_at
      FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${params.limit}
      OFFSET ${offset}
    `);

    return { products: productsResult.rows, total };
  }

  /**
   * Update a product by ID (non-relational fields only).
   */
  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductRow> {
    const result = await this.db.execute<ProductRow>(sql`
      UPDATE products
      SET
        name = COALESCE(${dto.name ?? null}, name),
        slug = COALESCE(${dto.slug ?? null}, slug),
        description = COALESCE(${dto.description ?? null}, description),
        primary_category_id = COALESCE(${dto.primaryCategoryId ?? null}, primary_category_id),
        brand_id = COALESCE(${dto.brandId ?? null}, brand_id),
        grade = COALESCE(${dto.grade ?? null}, grade),
        base_price = COALESCE(${dto.basePrice ?? null}, base_price),
        wholesale_price = COALESCE(${dto.wholesalePrice ?? null}, wholesale_price),
        torob_price = COALESCE(${dto.torobPrice ?? null}, torob_price),
        discounted_price = COALESCE(${dto.discountedPrice ?? null}, discounted_price),
        campaign_price = COALESCE(${dto.campaignPrice ?? null}, campaign_price),
        campaign_start_at = COALESCE(${dto.campaignStartAt ?? null}, campaign_start_at),
        campaign_end_at = COALESCE(${dto.campaignEndAt ?? null}, campaign_end_at),
        stock = COALESCE(${dto.stock ?? null}, stock),
        is_active = COALESCE(${dto.isActive ?? null}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, slug, description, primary_category_id, brand_id, grade,
                base_price, wholesale_price, torob_price, discounted_price,
                campaign_price, campaign_start_at, campaign_end_at, stock, is_active,
                created_at, updated_at
    `);

    const product = result.rows[0];
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  /**
   * Soft-delete a product (set is_active = false).
   */
  async deactivateProduct(id: string): Promise<void> {
    const result = await this.db.execute<{ id: string } & Record<string, unknown>>(sql`
      UPDATE products SET is_active = false, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `);

    if (!result.rows[0]) {
      throw new NotFoundException("Product not found");
    }
  }

  /**
   * Insert variants and their attribute value bindings within a transaction.
   * Each variant gets its SKU row + junction table entries atomically.
   */
  private async insertVariants(
    tx: Parameters<Parameters<NodePgDatabase["transaction"]>[0]>[0],
    productId: string,
    variants: CreateProductVariantDto[],
  ): Promise<void> {
    for (const variant of variants) {
      // Insert the variant (SKU) row
      const variantResult = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
        INSERT INTO product_variants (product_id, sku, stock, price_modifier)
        VALUES (
          ${productId},
          ${variant.sku},
          ${variant.stock},
          ${variant.priceModifier ?? "0"}
        )
        RETURNING id
      `);

      const variantId = variantResult.rows[0]?.id;
      if (!variantId) {
        throw new BadRequestException(`Failed to create variant with SKU "${variant.sku}"`);
      }

      // Insert attribute value bindings for this variant
      if (variant.attributes && variant.attributes.length > 0) {
        for (const attr of variant.attributes) {
          await tx.execute(sql`
            INSERT INTO variant_attribute_values (variant_id, value_id)
            VALUES (${variantId}, ${attr.valueId})
          `);
        }
      }

      this.logger.debug(
        `Created variant ${variantId} (SKU: ${variant.sku}) with ${variant.attributes.length} attributes`,
      );
    }
  }
}
