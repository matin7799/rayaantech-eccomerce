import {
  boolean,
  index,
  numeric,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Centralized shipping methods registry.
 *
 * Each row represents a distinct delivery channel available to customers.
 * Admin-managed via the panel; checkout reads active methods only.
 *
 * Business rules:
 * - `base_cost` is in integer Tomans (not Rials)
 * - `code` is a unique machine-readable token for frontend matching
 * - Only rows with `is_active = true` appear in checkout selectors
 */
export const shippingMethods = pgTable(
  "shipping_methods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Persian display name */
    nameFa: varchar("name_fa", { length: 255 }).notNull(),
    /** Machine-readable code token (e.g. 'free_post', 'express_delivery') */
    code: varchar("code", { length: 64 }).notNull().unique(),
    /** Base shipping cost in integer Tomans */
    baseCost: numeric("base_cost", { precision: 12, scale: 0 }).notNull().default("0"),
    /** Estimated delivery time description (e.g. "۳ تا ۵ روز کاری") */
    estimatedDays: varchar("estimated_days", { length: 100 }),
    /** Whether this method is currently available */
    isActive: boolean("is_active").default(true).notNull(),
    /** Whether this method supports cash-on-delivery / cargo collect (پس‌کرایه) */
    isCargoCollect: boolean("is_cargo_collect").default(false).notNull(),
    /** Display sort order */
    sortOrder: serial("sort_order"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("shipping_methods_active_idx").on(table.isActive),
    index("shipping_methods_sort_idx").on(table.sortOrder),
  ],
);
