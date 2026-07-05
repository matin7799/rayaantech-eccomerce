import {
  index,
  json,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orderStatusEnum, paymentMethodEnum, paymentStatusEnum } from "./enums.js";
import { users } from "./users.js";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: orderStatusEnum("status").notNull().default("pending"),
    totalAmount: numeric("total_amount", { precision: 12, scale: 0 }).notNull(),
    discountAmount: numeric("discount_amount", {
      precision: 12,
      scale: 0,
    }).default("0"),
    shippingAddress: text("shipping_address"),
    notes: text("notes"),
    items: json("items")
      .$type<
        Array<{
          productId: string;
          variantId?: string;
          quantity: number;
          unitPrice: string;
          totalPrice: string;
        }>
      >()
      .notNull(),
    torobClid: varchar("torob_clid", { length: 64 }),
    shippingAmount: numeric("shipping_amount", { precision: 12, scale: 0 }),
    phoneNumber: varchar("phone_number", { length: 20 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.createdAt),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    method: paymentMethodEnum("method").notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
    paymentRefId: varchar("payment_ref_id", { length: 255 }),
    gatewayResponse: json("gateway_response"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("payments_ref_id_idx").on(table.paymentRefId),
    index("payments_order_id_idx").on(table.orderId),
    index("payments_status_idx").on(table.status),
  ],
);

export interface CartSnapshotData {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
  totalAmount: string;
  discountAmount?: string;
}

export const cartSnapshots = pgTable(
  "cart_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    snapshotData: json("snapshot_data").$type<CartSnapshotData>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cart_snapshots_user_id_idx").on(table.userId),
    index("cart_snapshots_order_id_idx").on(table.orderId),
  ],
);
