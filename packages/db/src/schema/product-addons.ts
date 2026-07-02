import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { priceModifierTypeEnum } from "./enums.js";
import { products } from "./products.js";

/**
 * Product Addons — Groups of configurable options attached to a product.
 *
 * Examples: "ضمانت" (Warranty), "لوازم جانبی" (Accessories)
 *
 * INVARIANTS:
 * - Each addon is a logical group (e.g., warranty tier selector)
 * - is_required: if true, the user MUST select one option from this group
 * - Options live in product_addon_options (one-to-many)
 */
export const productAddons = pgTable(
  "product_addons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** The product this addon belongs to */
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Human-readable addon group title (e.g. "ضمانت رایان تک") */
    name: varchar("name", { length: 512 }).notNull(),
    /** Optional description for the addon group */
    description: text("description"),
    /** Whether selecting an option from this group is mandatory */
    isRequired: boolean("is_required").default(false).notNull(),
    /** Whether this addon group is currently available */
    isActive: boolean("is_active").default(true).notNull(),
    /** Display order within the PDP */
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("product_addons_product_idx").on(table.productId),
    index("product_addons_active_idx").on(table.isActive),
  ],
);

/**
 * Product Addon Options — Individual selectable choices within an addon group.
 *
 * Examples within a "ضمانت" addon:
 * - "ضمانت ۱ ماهه رایان تک" (percentage: 0%)
 * - "ضمانت ۶ ماهه رایان تک" (percentage: 7%)
 * - "ضمانت ۱ ساله رایان تک" (percentage: 10%)
 *
 * INVARIANTS:
 * - price_modifier_type determines how price_modifier_value is applied:
 *   - 'percentage': value is a % of the product's effective price
 *   - 'fixed': value is an absolute Toman amount
 * - is_default: if true, this option is pre-selected on page load
 */
export const productAddonOptions = pgTable(
  "product_addon_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Parent addon group */
    addonId: uuid("addon_id")
      .notNull()
      .references(() => productAddons.id, { onDelete: "cascade" }),
    /** Display name for this option */
    name: varchar("name", { length: 512 }).notNull(),
    /** How the price modifier is calculated */
    priceModifierType: priceModifierTypeEnum("price_modifier_type").notNull().default("fixed"),
    /** The modifier value (percentage number or fixed Toman amount) */
    priceModifierValue: numeric("price_modifier_value", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    /** Whether this is the default/pre-selected option */
    isDefault: boolean("is_default").default(false).notNull(),
    /** Whether this option is currently available */
    isActive: boolean("is_active").default(true).notNull(),
    /** Display order within the addon group */
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("product_addon_options_addon_idx").on(table.addonId),
    index("product_addon_options_active_idx").on(table.isActive),
  ],
);

/**
 * Global Addon Defaults — Admin-configurable warranty/addon presets.
 *
 * When a product has NO custom addon groups in product_addons,
 * the system auto-generates a warranty selector from these global defaults.
 *
 * Admin can toggle visibility, edit percentage thresholds, or add new tiers
 * without touching individual product records.
 */
export const globalAddonDefaults = pgTable(
  "global_addon_defaults",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Option display name */
    name: varchar("name", { length: 512 }).notNull(),
    /** How the price modifier is calculated */
    priceModifierType: priceModifierTypeEnum("price_modifier_type_gad")
      .notNull()
      .default("percentage"),
    /** The modifier value */
    priceModifierValue: numeric("price_modifier_value", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    /** Whether this option is pre-selected by default */
    isDefault: boolean("is_default").default(false).notNull(),
    /** Whether this tier is mandatory (cannot be deselected) */
    isRequired: boolean("is_required").default(false).notNull(),
    /** Whether this tier is currently active/visible */
    isActive: boolean("is_active").default(true).notNull(),
    /** Display order */
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("global_addon_defaults_active_idx").on(table.isActive)],
);

/**
 * Cart Item Addons — Junction table tracking which addon options a user selected
 * for a specific item in their cart snapshot during checkout.
 */
export const cartItemAddons = pgTable(
  "cart_item_addons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** The order this selection belongs to */
    orderId: uuid("order_id").notNull(),
    /** The product in the order */
    productId: uuid("product_id").notNull(),
    /** The selected addon option */
    addonOptionId: uuid("addon_option_id").notNull(),
    /** Snapshot of the price at checkout time (for audit immutability) */
    priceAtCheckout: numeric("price_at_checkout", {
      precision: 12,
      scale: 0,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cart_item_addons_order_idx").on(table.orderId),
    index("cart_item_addons_product_idx").on(table.productId),
    index("cart_item_addons_option_idx").on(table.addonOptionId),
  ],
);
