import { sql } from "drizzle-orm";
import { index, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { reservationStatusEnum } from "./enums.js";
import { productVariants } from "./product-variants.js";
import { products } from "./products.js";
import { users } from "./users.js";

/**
 * Product reservation locks with a strict 20-minute TTL window.
 * INVARIANT: expires_at = reserved_at + interval '20 minutes'
 */
export const productReservations = pgTable(
  "product_reservations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id").references(() => productVariants.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    status: reservationStatusEnum("status").notNull().default("pending"),
    reservedAt: timestamp("reserved_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '20 minutes'`),
  },
  (table) => [
    index("product_reservations_user_idx").on(table.userId),
    index("product_reservations_product_idx").on(table.productId),
    index("product_reservations_status_idx").on(table.status),
    index("product_reservations_expires_at_idx").on(table.expiresAt),
    index("product_reservations_status_expires_idx").on(table.status, table.expiresAt),
  ],
);
