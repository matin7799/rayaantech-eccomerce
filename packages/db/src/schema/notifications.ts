import {
  bigint,
  boolean,
  index,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * In-app admin/operator notifications.
 *
 * A shared feed read by any admin/operator (v1 uses a single global `isRead`;
 * per-user read state is a future improvement). Rows are written by the
 * NotificationsService — e.g. on `payment.confirmed` — and delivered to the
 * admin panel via tRPC polling plus a live socket.io push (/admin-notifications).
 */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Machine token, e.g. "payment_confirmed" — lets the UI pick an icon/route. */
    type: varchar("type", { length: 64 }).notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    /** Related order (nullable — not every notification is order-scoped). */
    orderId: uuid("order_id"),
    /** Amount in Rials for payment notifications (nullable). */
    amount: bigint("amount", { mode: "number" }),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_is_read_idx").on(table.isRead),
    index("notifications_created_at_idx").on(table.createdAt),
  ],
);
