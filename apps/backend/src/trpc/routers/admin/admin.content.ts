import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const createBlogPostSchema = z.object({
  title: z.string().min(3).max(512),
  slug: z
    .string()
    .min(3)
    .max(512)
    .regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  isPublished: z.boolean().default(false),
});

const createStorySchema = z.object({
  title: z.string().min(2).max(255),
  mediaUrl: z.string().url(),
  productId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
});

const createBannerSchema = z.object({
  title: z.string().min(2).max(255),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export function createAdminContentRouter(db: NodePgDatabase) {
  return router({
    /** List all blog posts. */
    listBlogPosts: adminProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          is_published: boolean;
          cover_image_url: string | null;
          published_at: string | null;
          created_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, title, slug, excerpt, is_published, cover_image_url, published_at, created_at
            FROM blog_posts ORDER BY created_at DESC`,
      );
      return {
        posts: result.rows.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt,
          isPublished: r.is_published,
          coverImageUrl: r.cover_image_url,
          publishedAt: r.published_at,
          createdAt: r.created_at,
        })),
      };
    }),

    /** Create a new blog post. */
    createBlogPost: adminProcedure.input(createBlogPostSchema).mutation(async ({ input, ctx }) => {
      const authorId = ctx.session!.userId;
      const publishedAt = input.isPublished ? new Date().toISOString() : null;

      const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO blog_posts (title, slug, content, excerpt, author_id, cover_image_url, is_published, published_at)
          VALUES (${input.title}, ${input.slug}, ${input.content}, ${input.excerpt ?? null}, ${authorId}, ${input.coverImageUrl ?? null}, ${input.isPublished}, ${publishedAt}::timestamptz)
          RETURNING id
        `);
      return { success: true, id: result.rows[0]!.id, slug: input.slug };
    }),

    /** List shoppable stories. */
    listStories: adminProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          title: string;
          media_url: string;
          product_id: string | null;
          is_active: boolean;
          expires_at: string;
          created_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, title, media_url, product_id, is_active, expires_at, created_at
            FROM shoppable_stories ORDER BY created_at DESC`,
      );
      return {
        stories: result.rows.map((r) => ({
          id: r.id,
          title: r.title,
          mediaUrl: r.media_url,
          productId: r.product_id,
          isActive: r.is_active,
          expiresAt: r.expires_at,
          createdAt: r.created_at,
        })),
      };
    }),

    /** Create a new shoppable story. */
    createStory: adminProcedure.input(createStorySchema).mutation(async ({ input }) => {
      const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO shoppable_stories (title, media_url, product_id, is_active)
          VALUES (${input.title}, ${input.mediaUrl}, ${input.productId ?? null}, ${input.isActive})
          RETURNING id
        `);
      return { success: true, id: result.rows[0]!.id, title: input.title };
    }),

    /** List banners. */
    listBanners: adminProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          title: string;
          placement_key: string;
          image_url: string;
          link_url: string | null;
          display_order: number;
          is_active: boolean;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, title, placement_key, image_url, link_url, display_order, is_active, starts_at, ends_at, created_at
            FROM banners ORDER BY display_order ASC, created_at DESC`,
      );
      return {
        banners: result.rows.map((r) => ({
          id: r.id,
          title: r.title,
          placementKey: r.placement_key,
          imageUrl: r.image_url,
          linkUrl: r.link_url,
          displayOrder: r.display_order,
          isActive: r.is_active,
          startsAt: r.starts_at,
          endsAt: r.ends_at,
          createdAt: r.created_at,
        })),
      };
    }),

    /** Create a new banner. */
    createBanner: adminProcedure.input(createBannerSchema).mutation(async ({ input }) => {
      const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO banners (title, placement_key, image_url, link_url, display_order, is_active)
          VALUES (${input.title}, 'custom', ${input.imageUrl}, ${input.linkUrl ?? null}, ${input.displayOrder}, ${input.isActive})
          RETURNING id
        `);
      return { success: true, id: result.rows[0]!.id, title: input.title };
    }),
  });
}
