import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

/**
 * Public blog tRPC router.
 *
 * Provides read-only access to published blog posts for the storefront.
 * Admin CRUD operations remain in the admin router.
 */
export function createBlogRouter(db: NodePgDatabase) {
  return router({
    /** List all published blog posts (public). */
    list: publicProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          cover_image_url: string | null;
          published_at: string | null;
          author_name: string;
        } & Record<string, unknown>
      >(sql`
        SELECT bp.id, bp.title, bp.slug, bp.excerpt,
               bp.cover_image_url, bp.published_at,
               u.full_name AS author_name
        FROM blog_posts bp
        INNER JOIN users u ON u.id = bp.author_id
        WHERE bp.is_published = true
        ORDER BY bp.published_at DESC NULLS LAST
        LIMIT 50
      `);

      return result.rows.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        coverImageUrl: r.cover_image_url,
        publishedAt: r.published_at,
        authorName: r.author_name,
      }));
    }),

    /** Get a single published blog post by slug (public). */
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => {
        const result = await db.execute<
          {
            id: string;
            title: string;
            slug: string;
            content: string;
            excerpt: string | null;
            cover_image_url: string | null;
            published_at: string | null;
            author_name: string;
          } & Record<string, unknown>
        >(sql`
          SELECT bp.id, bp.title, bp.slug, bp.content, bp.excerpt,
                 bp.cover_image_url, bp.published_at,
                 u.full_name AS author_name
          FROM blog_posts bp
          INNER JOIN users u ON u.id = bp.author_id
          WHERE bp.slug = ${input.slug} AND bp.is_published = true
          LIMIT 1
        `);

        const post = result.rows[0];
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "مطلب یافت نشد" });
        }

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImageUrl: post.cover_image_url,
          publishedAt: post.published_at,
          authorName: post.author_name,
        };
      }),
  });
}

export type BlogRouter = ReturnType<typeof createBlogRouter>;
