import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { products } from "./products.js";

/**
 * Campaigns table — time-bound promotional discounts linked to products.
 *
 * When a campaign is active (now between startAt and endAt),
 * the campaignPrice overrides the base price for display + checkout.
 * The products.campaignPrice column stores the current snapshot,
 * this table provides the source of truth for campaign metadata.
 */
export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    discountPercent: integer("discount_percent"),
    fixedPrice: numeric("fixed_price", { precision: 12, scale: 0 }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("campaigns_product_id_idx").on(table.productId),
    index("campaigns_active_range_idx").on(table.isActive, table.startAt, table.endAt),
  ],
);
