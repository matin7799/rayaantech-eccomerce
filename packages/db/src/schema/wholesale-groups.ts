import { numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const wholesaleGroups = pgTable("wholesale_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  markdownPercentage: numeric("markdown_percentage", {
    precision: 5,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
