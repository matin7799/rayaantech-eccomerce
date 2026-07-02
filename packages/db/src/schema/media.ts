import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { storageProviderEnum } from "./enums.js";
import { products } from "./products.js";

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url", { length: 2048 }).notNull(),
  webpUrl: varchar("webp_url", { length: 2048 }),
  mimeType: varchar("mime_type", { length: 128 }).notNull(),
  fileSize: integer("file_size").notNull(),
  storageProvider: storageProviderEnum("storage_provider").notNull().default("s3"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productMedia = pgTable(
  "product_media",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    displayOrder: integer("display_order").default(0).notNull(),
    isThumbnail: boolean("is_thumbnail").default(false).notNull(),
  },
  (table) => [primaryKey({ columns: [table.productId, table.mediaId] })],
);
