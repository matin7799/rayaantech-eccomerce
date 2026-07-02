import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";

/**
 * DB row shape for blog_posts records.
 */
interface BlogPostRow extends Record<string, unknown> {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  cover_image_url: string | null;
  seo_metadata: Record<string, unknown> | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Public-facing blog post representation.
 */
export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  authorId: string;
  coverImageUrl: string | null;
  seoMetadata: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  } | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a blog post.
 */
export interface CreateBlogPostDto {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: string;
  coverImageUrl?: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  isPublished?: boolean;
}

/**
 * DTO for updating a blog post (all fields optional).
 */
export interface UpdateBlogPostDto {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  } | null;
  isPublished?: boolean;
}

/**
 * Blog management service.
 *
 * Supports:
 * - Public read access (published posts only, no auth required)
 * - Protected write operations (create, update, publish — requires content:write scope)
 * - SEO metadata management (JSON column for meta title, description, keywords)
 * - Slug-based public lookups for friendly URLs
 */
@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * List published posts (public, no auth required).
   * Only returns is_published = true posts, ordered by publish date.
   */
  async listPublishedPosts(params: {
    page: number;
    limit: number;
  }): Promise<{ posts: BlogPostRecord[]; total: number }> {
    const offset = (params.page - 1) * params.limit;

    const countResult = await this.db.execute<{ count: string } & Record<string, unknown>>(sql`
      SELECT COUNT(*)::text as count
      FROM blog_posts
      WHERE is_published = true
    `);

    const total = parseInt(countResult.rows[0]?.count ?? "0", 10);

    const result = await this.db.execute<BlogPostRow>(sql`
      SELECT id, title, slug, content, excerpt, author_id, cover_image_url,
             seo_metadata, is_published, published_at, created_at, updated_at
      FROM blog_posts
      WHERE is_published = true
      ORDER BY published_at DESC NULLS LAST
      LIMIT ${params.limit}
      OFFSET ${offset}
    `);

    return { posts: result.rows.map((r) => this.mapRowToRecord(r)), total };
  }

  /**
   * Get a published post by slug (public, no auth required).
   */
  async getPublishedPostBySlug(slug: string): Promise<BlogPostRecord> {
    const result = await this.db.execute<BlogPostRow>(sql`
      SELECT id, title, slug, content, excerpt, author_id, cover_image_url,
             seo_metadata, is_published, published_at, created_at, updated_at
      FROM blog_posts
      WHERE slug = ${slug} AND is_published = true
      LIMIT 1
    `);

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException("Blog post not found");
    }

    return this.mapRowToRecord(row);
  }

  /**
   * Create a new blog post (protected).
   */
  async createPost(dto: CreateBlogPostDto): Promise<BlogPostRecord> {
    const isPublished = dto.isPublished ?? false;
    const publishedAt = isPublished ? new Date().toISOString() : null;
    const seoJson = dto.seoMetadata ? JSON.stringify(dto.seoMetadata) : null;

    const result = await this.db.execute<BlogPostRow>(sql`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, author_id, cover_image_url,
        seo_metadata, is_published, published_at
      )
      VALUES (
        ${dto.title},
        ${dto.slug},
        ${dto.content},
        ${dto.excerpt ?? null},
        ${dto.authorId},
        ${dto.coverImageUrl ?? null},
        ${seoJson}::json,
        ${isPublished},
        ${publishedAt}
      )
      RETURNING id, title, slug, content, excerpt, author_id, cover_image_url,
                seo_metadata, is_published, published_at, created_at, updated_at
    `);

    const row = result.rows[0];
    if (!row) {
      throw new BadRequestException("Failed to create blog post");
    }

    this.logger.debug(`Created blog post: ${row.id} (slug: ${dto.slug})`);
    return this.mapRowToRecord(row);
  }

  /**
   * Update a blog post (protected).
   */
  async updatePost(id: string, dto: UpdateBlogPostDto): Promise<BlogPostRecord> {
    // Handle publish state transition
    let publishedAtClause = sql`published_at`;
    if (dto.isPublished === true) {
      publishedAtClause = sql`COALESCE(published_at, NOW())`;
    } else if (dto.isPublished === false) {
      publishedAtClause = sql`NULL`;
    }

    const seoJson =
      dto.seoMetadata !== undefined
        ? dto.seoMetadata
          ? JSON.stringify(dto.seoMetadata)
          : null
        : null;

    const result = await this.db.execute<BlogPostRow>(sql`
      UPDATE blog_posts
      SET
        title = COALESCE(${dto.title ?? null}, title),
        slug = COALESCE(${dto.slug ?? null}, slug),
        content = COALESCE(${dto.content ?? null}, content),
        excerpt = COALESCE(${dto.excerpt ?? null}, excerpt),
        cover_image_url = COALESCE(${dto.coverImageUrl ?? null}, cover_image_url),
        seo_metadata = COALESCE(${seoJson}::json, seo_metadata),
        is_published = COALESCE(${dto.isPublished ?? null}, is_published),
        published_at = ${publishedAtClause},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, slug, content, excerpt, author_id, cover_image_url,
                seo_metadata, is_published, published_at, created_at, updated_at
    `);

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException("Blog post not found");
    }

    return this.mapRowToRecord(row);
  }

  /**
   * Get a post by ID (admin view, any publish state).
   */
  async getPostById(id: string): Promise<BlogPostRecord> {
    const result = await this.db.execute<BlogPostRow>(sql`
      SELECT id, title, slug, content, excerpt, author_id, cover_image_url,
             seo_metadata, is_published, published_at, created_at, updated_at
      FROM blog_posts
      WHERE id = ${id}
      LIMIT 1
    `);

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException("Blog post not found");
    }

    return this.mapRowToRecord(row);
  }

  private mapRowToRecord(row: BlogPostRow): BlogPostRecord {
    let seoMetadata: BlogPostRecord["seoMetadata"] = null;
    if (row.seo_metadata && typeof row.seo_metadata === "object") {
      const raw = row.seo_metadata as Record<string, unknown>;
      seoMetadata = {
        metaTitle: typeof raw.metaTitle === "string" ? raw.metaTitle : undefined,
        metaDescription: typeof raw.metaDescription === "string" ? raw.metaDescription : undefined,
        keywords: Array.isArray(raw.keywords)
          ? raw.keywords.filter((k): k is string => typeof k === "string")
          : undefined,
      };
    }

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      authorId: row.author_id,
      coverImageUrl: row.cover_image_url,
      seoMetadata,
      isPublished: row.is_published,
      publishedAt: row.published_at,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}
