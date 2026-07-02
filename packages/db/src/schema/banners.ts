import { boolean, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { media } from "./media.js";

/**
 * Banners with dynamic placement engine.
 *
 * `placement_key` identifies the target rendering slot on the storefront:
 *   - 'home_hero_slider' — Main hero carousel
 *   - 'home_dual_grid_left' / 'home_dual_grid_right' — Dual promo grid
 *   - 'pdp_sidebar' — Product detail page sidebar
 *   - 'category_header' — Category listing header
 *
 * `allowed_width` / `allowed_height` define expected pixel bounds for
 * the placement slot, enabling admin UI to enforce aspect ratio validation.
 *
 * `media_id` FK links to the central media ledger for relational integrity.
 * `image_url` remains for fast CDN edge rendering (denormalized for speed).
 */
export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  placementKey: varchar("placement_key", { length: 128 }).notNull(),
  imageUrl: varchar("image_url", { length: 2048 }).notNull(),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  linkUrl: varchar("link_url", { length: 2048 }),
  allowedWidth: integer("allowed_width").notNull().default(1440),
  allowedHeight: integer("allowed_height").notNull().default(400),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
