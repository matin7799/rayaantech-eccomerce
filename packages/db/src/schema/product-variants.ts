import {
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { attributeValues } from "./attributes.js";
import { products } from "./products.js";

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 128 }).notNull(),
    stock: integer("stock").default(0).notNull(),
    priceModifier: numeric("price_modifier", {
      precision: 12,
      scale: 0,
    }).default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("product_variants_sku_idx").on(table.sku),
    index("product_variants_product_id_idx").on(table.productId),
  ],
);

export const variantAttributeValues = pgTable(
  "variant_attribute_values",
  {
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    valueId: uuid("value_id")
      .notNull()
      .references(() => attributeValues.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.variantId, table.valueId] })],
);
