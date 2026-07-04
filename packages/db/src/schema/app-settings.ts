import { json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Generic key-value settings store for runtime-configurable application state.
 *
 * Each row holds one namespaced configuration blob (e.g. "ai_config") as JSON,
 * letting admins mutate behaviour without a redeploy. Values are read with a
 * short-lived cache and always fall back to code-level defaults when absent.
 */
export const appSettings = pgTable("app_settings", {
  /** Stable namespace key, e.g. "ai_config" */
  key: varchar("key", { length: 128 }).primaryKey(),

  /** Arbitrary JSON payload for this setting namespace */
  value: json("value").$type<Record<string, unknown>>().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
