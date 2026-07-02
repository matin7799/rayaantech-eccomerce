import { index, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { systemLogLevelEnum } from "./enums.js";

export const systemLogs = pgTable(
  "system_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    level: systemLogLevelEnum("level").notNull().default("info"),
    context: varchar("context", { length: 255 }).notNull(),
    message: text("message").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    traceId: varchar("trace_id", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("system_logs_level_idx").on(table.level),
    index("system_logs_context_idx").on(table.context),
    index("system_logs_created_at_idx").on(table.createdAt),
    index("system_logs_trace_id_idx").on(table.traceId),
  ],
);
