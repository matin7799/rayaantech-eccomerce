import {
  boolean,
  date,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orders } from "./orders.js";
import { users } from "./users.js";

/**
 * Installment cheque records — physical check parameters submitted by users
 * after a successful DigiPay credit/installment payment.
 *
 * Business invariants:
 * 1. Each cheque row maps to a single physical check instrument
 * 2. Multiple cheques may exist per order (one per installment term)
 * 3. Once `is_locked = true`, the row becomes readonly (admin-triggered finalization)
 * 4. `drawee_national_id` must be exactly 10 digits (validated at application layer)
 * 5. All monetary values are integer Rials (numeric 12,0)
 */
export const installmentCheques = pgTable(
  "installment_cheques",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** Exact check amount in integer Rials */
    checkAmount: numeric("check_amount", { precision: 12, scale: 0 }).notNull(),
    /** Future maturation date of the physical check */
    maturationDate: date("maturation_date").notNull(),
    /** Drawee national ID (کد ملی) — exactly 10 digits */
    draweeNationalId: varchar("drawee_national_id", { length: 10 }).notNull(),
    /** Payee full name (نام دریافت‌کننده) */
    payeeFullName: varchar("payee_full_name", { length: 255 }).notNull(),
    /** Strict mailing address for shipping physically signed checks */
    mailingAddress: text("mailing_address").notNull(),
    /** Whether the record is locked (readonly after user finalization) */
    isLocked: boolean("is_locked").default(false).notNull(),
    /** Timestamp when the record was locked by the user */
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("installment_cheques_user_order_idx").on(table.userId, table.orderId),
    index("installment_cheques_order_idx").on(table.orderId),
    index("installment_cheques_is_locked_idx").on(table.isLocked),
  ],
);
