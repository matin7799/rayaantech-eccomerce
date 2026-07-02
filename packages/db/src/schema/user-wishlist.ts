import { index, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { products } from "./products.js";
import { users } from "./users.js";

/**
 * User wishlist items — tracks which products a user has favourited.
 *
 * Business invariants:
 * 1. Each (user_id, product_id) pair is unique (enforced by DB constraint)
 * 2. Cascade delete: removing a user or product removes related wishlist entries
 * 3. Products may appear in multiple users' wishlists
 */
export const userWishlistItems = pgTable(
  "user_wishlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("user_wishlist_items_user_product_unique").on(table.userId, table.productId),
    index("user_wishlist_items_user_idx").on(table.userId),
    index("user_wishlist_items_product_idx").on(table.productId),
  ],
);
