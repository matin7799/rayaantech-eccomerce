import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Scopes } from "../auth/decorators/scopes.decorator";
import type {
  CreateProductDto,
  ProductRow,
  UpdateProductDto,
  VariantRow,
} from "./interfaces/product-dto.interface";
import { ProductService } from "./product.service";

/**
 * Product catalog REST controller.
 *
 * Base path: /api/v1/products
 *
 * All endpoints require valid API token authentication (global ApiTokenGuard).
 * Write operations require specific scopes via @Scopes() decorator.
 *
 * Error responses are sanitized by the global AllExceptionsFilter —
 * no database internals are ever exposed to clients.
 */
@Controller("api/v1/products")
export class ProductController {
  constructor(@Inject(ProductService) private readonly productService: ProductService) {}

  /**
   * Create a product with optional nested variants and attribute bindings.
   *
   * Executes atomically — if any variant SKU is duplicate or any FK is invalid,
   * the entire operation rolls back with zero orphan rows.
   *
   * Required scope: products:write
   */
  @Post()
  @Scopes("products:write")
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: CreateProductDto): Promise<{ data: { id: string } }> {
    const result = await this.productService.createProduct(body);
    return { data: result };
  }

  /**
   * Get a single product by ID with its variants.
   *
   * Required scope: products:read
   */
  @Get(":id")
  @Scopes("products:read")
  async getProduct(
    @Param("id") id: string,
  ): Promise<{ data: { product: ProductRow; variants: VariantRow[] } }> {
    const result = await this.productService.getProductById(id);
    return { data: result };
  }

  /**
   * List products with pagination and optional filters.
   *
   * Query params:
   * - page (default: 1)
   * - limit (default: 20, max: 100)
   * - isActive (optional boolean filter)
   * - categoryId (optional UUID filter)
   *
   * Required scope: products:read
   */
  @Get()
  @Scopes("products:read")
  async listProducts(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("isActive") isActive?: string,
    @Query("categoryId") categoryId?: string,
  ): Promise<{
    data: ProductRow[];
    meta: { total: number; page: number; limit: number };
  }> {
    const parsedPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit ?? "20", 10) || 20));
    const parsedIsActive = isActive === "true" ? true : isActive === "false" ? false : undefined;

    const result = await this.productService.listProducts({
      page: parsedPage,
      limit: parsedLimit,
      isActive: parsedIsActive,
      categoryId: categoryId || undefined,
    });

    return {
      data: result.products,
      meta: { total: result.total, page: parsedPage, limit: parsedLimit },
    };
  }

  /**
   * Update a product's base fields.
   *
   * Required scope: products:write
   */
  @Patch(":id")
  @Scopes("products:write")
  async updateProduct(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
  ): Promise<{ data: ProductRow }> {
    const product = await this.productService.updateProduct(id, body);
    return { data: product };
  }

  /**
   * Soft-delete (deactivate) a product.
   *
   * Required scope: products:write
   */
  @Delete(":id")
  @Scopes("products:write")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param("id") id: string): Promise<void> {
    await this.productService.deactivateProduct(id);
  }
}
