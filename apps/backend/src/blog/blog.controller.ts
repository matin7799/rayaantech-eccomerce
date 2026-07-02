import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { Scopes } from "../auth/decorators/scopes.decorator";
import {
  type BlogPostRecord,
  BlogService,
  type CreateBlogPostDto,
  type UpdateBlogPostDto,
} from "./blog.service";

/**
 * Blog management REST controller.
 *
 * Base path: /api/v1/blog
 *
 * Public endpoints (no auth):
 * - GET /posts — List published blog posts
 * - GET /posts/:slug — Get a published post by slug
 *
 * Protected endpoints (require content:write scope):
 * - POST /posts — Create a new post
 * - PATCH /posts/:id — Update a post
 * - GET /admin/posts/:id — Get any post by ID (including unpublished)
 */
@Controller("api/v1/blog")
export class BlogController {
  constructor(@Inject(BlogService) private readonly blogService: BlogService) {}

  // ─── Public Endpoints ────────────────────────────────────────────────────────

  /**
   * List published blog posts (public, paginated).
   *
   * Query params:
   * - page (default: 1)
   * - limit (default: 10, max: 50)
   */
  @Public()
  @Get("posts")
  async listPublishedPosts(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<{
    data: BlogPostRecord[];
    meta: { total: number; page: number; limit: number };
  }> {
    const parsedPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit ?? "10", 10) || 10));

    const result = await this.blogService.listPublishedPosts({
      page: parsedPage,
      limit: parsedLimit,
    });

    return {
      data: result.posts,
      meta: { total: result.total, page: parsedPage, limit: parsedLimit },
    };
  }

  /**
   * Get a published blog post by slug (public).
   */
  @Public()
  @Get("posts/:slug")
  async getPublishedPost(@Param("slug") slug: string): Promise<{ data: BlogPostRecord }> {
    const post = await this.blogService.getPublishedPostBySlug(slug);
    return { data: post };
  }

  // ─── Protected Endpoints ─────────────────────────────────────────────────────

  /**
   * Get any post by ID (admin, includes unpublished drafts).
   *
   * Required scope: content:write
   */
  @Get("admin/posts/:id")
  @Scopes("content:write")
  async getPostById(@Param("id") id: string): Promise<{ data: BlogPostRecord }> {
    const post = await this.blogService.getPostById(id);
    return { data: post };
  }

  /**
   * Create a new blog post.
   *
   * Required scope: content:write
   *
   * Body:
   * - title (required): Post title
   * - slug (required): URL-safe slug (must be unique)
   * - content (required): Full post content (Markdown/HTML)
   * - excerpt (optional): Short preview text
   * - authorId (required): UUID of the author
   * - coverImageUrl (optional): Cover image URL
   * - seoMetadata (optional): SEO fields { metaTitle, metaDescription, keywords }
   * - isPublished (optional): Publish immediately (default: false)
   */
  @Post("posts")
  @Scopes("content:write")
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: CreateBlogPostDto): Promise<{ data: BlogPostRecord }> {
    const post = await this.blogService.createPost(body);
    return { data: post };
  }

  /**
   * Update a blog post.
   *
   * Required scope: content:write
   *
   * All body fields are optional. Setting isPublished=true will automatically
   * set published_at if it was previously null.
   */
  @Patch("posts/:id")
  @Scopes("content:write")
  async updatePost(
    @Param("id") id: string,
    @Body() body: UpdateBlogPostDto,
  ): Promise<{ data: BlogPostRecord }> {
    const post = await this.blogService.updatePost(id, body);
    return { data: post };
  }
}
