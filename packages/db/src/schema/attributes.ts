import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.js";

/**
 * Attribute Keys — Standardized specification labels with stable slugs.
 *
 * Each key has:
 * - name: Persian display label (e.g. "پردازنده")
 * - slug: Machine-stable identifier (e.g. "cpu") — used for frontend matching
 * - displayOrder: Global default sort priority (lower = higher priority)
 *
 * INVARIANT: slug is unique and immutable. Frontend uses slugs for category-aware
 * filtering (QuickView, specs table priority sorting). Persian names may change
 * for display but slugs remain stable across migrations.
 */
export const attributeKeys = pgTable(
  "attribute_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Persian display name (e.g. "پردازنده", "حافظه رم") */
    name: varchar("name", { length: 255 }).notNull(),
    /** Machine-stable slug (e.g. "cpu", "ram", "storage", "gpu") */
    slug: varchar("slug", { length: 128 }),
    /** Global default display priority (0 = highest) */
    displayOrder: integer("display_order").default(100).notNull(),
  },
  (table) => [
    uniqueIndex("attribute_keys_name_idx").on(table.name),
    uniqueIndex("attribute_keys_slug_idx").on(table.slug),
  ],
);

/**
 * Attribute Values — Actual specification data for a given key.
 *
 * Examples: key="پردازنده" → value="Intel Core i5-11300H"
 */
export const attributeValues = pgTable(
  "attribute_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    keyId: uuid("key_id")
      .notNull()
      .references(() => attributeKeys.id, { onDelete: "cascade" }),
    value: varchar("value", { length: 512 }).notNull(),
  },
  (table) => [uniqueIndex("attribute_values_key_value_idx").on(table.keyId, table.value)],
);

/**
 * Category Attribute Keys — Defines which attributes are expected/relevant
 * for products in a given category.
 *
 * This is the source of truth for:
 * - QuickView spec filtering (show only priority attributes for the category)
 * - PDP AttributeTable priority sorting
 * - Admin product form validation (required vs optional attributes)
 *
 * INVARIANTS:
 * - is_required: if true, products in this category MUST have this attribute
 * - is_quickview: if true, this attribute appears in the QuickView modal
 * - display_order: sort priority within the category (0 = first)
 */
export const categoryAttributeKeys = pgTable(
  "category_attribute_keys",
  {
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    attributeKeyId: uuid("attribute_key_id")
      .notNull()
      .references(() => attributeKeys.id, { onDelete: "cascade" }),
    /** Whether this attribute is required for products in this category */
    isRequired: boolean("is_required").default(false).notNull(),
    /** Whether this attribute should appear in QuickView (top 4-5 specs) */
    isQuickview: boolean("is_quickview").default(false).notNull(),
    /** Display order within this category (0 = highest priority) */
    displayOrder: integer("display_order").default(0).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.categoryId, table.attributeKeyId] }),
    index("category_attribute_keys_category_idx").on(table.categoryId),
    index("category_attribute_keys_quickview_idx").on(table.categoryId, table.isQuickview),
  ],
);
