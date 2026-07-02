import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { brands } from "./brands.js";
import { categories } from "./categories.js";
import { productGradeEnum } from "./enums.js";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 512 }).notNull(),
    slug: varchar("slug", { length: 512 }).notNull(),
    sku: varchar("sku", { length: 128 }),
    shortDescription: varchar("short_description", { length: 1024 }),
    description: text("description"),
    primaryCategoryId: uuid("primary_category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    brandId: uuid("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),
    grade: productGradeEnum("grade").notNull().default("stock"),
    basePrice: numeric("base_price", { precision: 12, scale: 0 }).notNull(),
    wholesalePrice: numeric("wholesale_price", { precision: 12, scale: 0 }),
    torobPrice: numeric("torob_price", { precision: 12, scale: 0 }),
    discountedPrice: numeric("discounted_price", { precision: 12, scale: 0 }),
    campaignPrice: numeric("campaign_price", { precision: 12, scale: 0 }),
    campaignStartAt: timestamp("campaign_start_at", { withTimezone: true }),
    campaignEndAt: timestamp("campaign_end_at", { withTimezone: true }),
    stock: integer("stock").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    uniqueIndex("products_sku_idx").on(table.sku),
    index("products_primary_category_idx").on(table.primaryCategoryId),
    index("products_brand_idx").on(table.brandId),
    index("products_grade_idx").on(table.grade),
    index("products_is_active_idx").on(table.isActive),
  ],
);
