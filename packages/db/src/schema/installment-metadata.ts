import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orders } from "./orders.js";
import { users } from "./users.js";

/**
 * Installment metadata captures the finalized terms and branch logistics
 * for an approved installment purchase. Created once an order enters the
 * installment flow and carries the operational details needed for cheque
 * issuance, branch pickup, and customer communication.
 */
export const installmentMetadata = pgTable(
  "installment_metadata",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** The order this installment plan is bound to (unique — one plan per order) */
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    /** The customer responsible for the installment plan */
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    /** Current processing status of the installment */
    installmentStatus: varchar("installment_status", { length: 50 })
      .notNull()
      .default("awaiting_cheques"),

    /** Number of monthly payment periods (must be > 0) */
    tenureMonths: integer("tenure_months").notNull(),

    /** Initial down-payment amount in Rials (must be > 0) */
    downPaymentAmount: numeric("down_payment_amount", { precision: 12, scale: 0 }).notNull(),

    /** Fixed monthly installment amount in Rials (must be > 0) */
    monthlyAmount: numeric("monthly_amount", { precision: 12, scale: 0 }).notNull(),

    /** Total financed amount including fees in Rials (must be > 0) */
    totalAmount: numeric("total_amount", { precision: 12, scale: 0 }).notNull(),

    /** Duration in days per installment period (25–45 range) */
    durationDays: integer("duration_days").notNull().default(30),

    // ─── Branch & Receiver Defaults ──────────────────────────────────────────

    /** Cheque receiver's legal name */
    receiverName: varchar("receiver_name", { length: 255 }).notNull().default("علیرضا حاتمی"),

    /** Cheque receiver's national ID (کد ملی) */
    receiverNationalId: varchar("receiver_national_id", { length: 255 })
      .notNull()
      .default("4420825766"),

    /** Branch name for cheque submission */
    branchName: varchar("branch_name", { length: 255 }).notNull().default("رایانتِک - شعبه جوان"),

    /** Branch physical address */
    branchAddress: text("branch_address")
      .notNull()
      .default("بلوار جوان، از میدان عالم به سمت میدان دانشآموز، بعد از پل عابر پیاده"),

    /** Branch postal code */
    branchPostalCode: varchar("branch_postal_code", { length: 255 })
      .notNull()
      .default("8915743336"),

    /** Branch operating hours */
    branchHours: varchar("branch_hours", { length: 100 })
      .notNull()
      .default("09:30–13:30 و 17:30–22:00"),

    /** Customer support phone number */
    supportPhone: varchar("support_phone", { length: 20 }).notNull().default("09131512790"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("installment_metadata_order_id_key").on(table.orderId),
    index("idx_installment_metadata_order_id").on(table.orderId),
    index("idx_installment_metadata_user_id").on(table.userId),
    check(
      "installment_metadata_installment_status_check",
      sql`${table.installmentStatus} = ANY(ARRAY['awaiting_cheques','cheques_submitted','cheques_received','cheques_verified','product_shipped','completed','cancelled']::varchar[])`,
    ),
    check("installment_metadata_tenure_months_check", sql`${table.tenureMonths} > 0`),
    check("installment_metadata_down_payment_amount_check", sql`${table.downPaymentAmount} > 0`),
    check("installment_metadata_monthly_amount_check", sql`${table.monthlyAmount} > 0`),
    check("installment_metadata_total_amount_check", sql`${table.totalAmount} > 0`),
    check(
      "installment_metadata_duration_days_check",
      sql`${table.durationDays} >= 25 AND ${table.durationDays} <= 45`,
    ),
  ],
);
