import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { categories } from "./categories.js";
import { products } from "./products.js";

export const productSecondaryCategories = pgTable(
  "product_secondary_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.productId, table.categoryId] })],
);
