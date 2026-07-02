import { boolean, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Admin-configurable rate limit settings for AI endpoints.
 *
 * Each row defines a rate limiting rule that can be:
 * - Global (userId = null): applies to all customers as the default
 * - Per-customer (userId set): overrides the global default for a specific user
 *
 * Admins can create, update, or disable rules via the admin panel.
 * The AI rate limiter guard reads these from Redis (cached) or falls back to DB.
 */
export const rateLimits = pgTable("rate_limits", {
  id: uuid("id").primaryKey().defaultRandom(),

  /** Target user ID — null means this is the global default rule */
  userId: uuid("user_id"),

  /**
   * The feature/endpoint category this limit applies to.
   * Examples: "ai:text", "ai:voice", "ai:all"
   */
  feature: varchar("feature", { length: 100 }).notNull(),

  /** Maximum number of requests allowed in the time window */
  maxRequests: integer("max_requests").notNull().default(20),

  /** Time window duration in seconds (default: 3600 = 1 hour) */
  windowSeconds: integer("window_seconds").notNull().default(3600),

  /** Whether this rule is currently active */
  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
