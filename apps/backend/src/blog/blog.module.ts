import { Module } from "@nestjs/common";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";

/**
 * Blog management module.
 *
 * Provides:
 * - BlogController: REST endpoints at /api/v1/blog
 * - BlogService: Blog post CRUD with public/protected access split
 *
 * Public read routes use @Public() to bypass ApiTokenGuard.
 * Write routes require content:write scope.
 *
 * Dependencies (from global modules):
 * - DatabaseModule (provides DRIZZLE_CLIENT)
 */
@Module({
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
