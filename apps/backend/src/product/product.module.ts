import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

/**
 * Product catalog module.
 *
 * Provides:
 * - ProductController: REST endpoints at /api/v1/products
 * - ProductService: Atomic transactional CRUD operations
 *
 * Dependencies (from global modules):
 * - DatabaseModule (provides DRIZZLE_CLIENT)
 *
 * All write operations use database transactions to guarantee
 * atomic multi-table insertions (products + variants + attributes).
 */
@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
