import { sql } from "drizzle-orm";
import { boolean, index, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products.js";
import { users } from "./users.js";

/**
 * Shoppable stories with rigid 24-hour expiration filter.
 * INVARIANT: expires_at defaults to created_at + interval '24 hours'
 */
export const shoppableStories = pgTable(
  "shoppable_stories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    mediaUrl: varchar("media_url", { length: 2048 }).notNull(),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '24 hours'`),
  },
  (table) => [
    index("shoppable_stories_product_idx").on(table.productId),
    index("shoppable_stories_expires_at_idx").on(table.expiresAt),
    index("shoppable_stories_is_active_idx").on(table.isActive),
  ],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 512 }).notNull(),
    slug: varchar("slug", { length: 512 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    coverImageUrl: varchar("cover_image_url", { length: 2048 }),
    seoMetadata: json("seo_metadata").$type<{
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    }>(),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("blog_posts_author_idx").on(table.authorId),
    index("blog_posts_published_idx").on(table.isPublished),
  ],
);
