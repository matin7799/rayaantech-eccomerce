import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.js";

/**
 * Global installment rules define the platform-wide terms available to customers.
 *
 * Example row:
 *   term_months=3, fee_percentage="8.00", default_downpayment_percent="40.00",
 *   guarantor_threshold=500000000, hard_ceiling=1000000000
 *
 * Business invariants:
 * - guarantor_threshold: if total facility exceeds this, guarantor check required
 * - hard_ceiling: if total facility exceeds this, installment is rejected outright
 * - All monetary thresholds are integer Rials (numeric 12,0)
 */
export const installmentRules = pgTable(
  "installment_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Human-readable label (e.g. "3-month standard") */
    name: varchar("name", { length: 255 }).notNull(),
    /** Number of monthly installment payments */
    termMonths: integer("term_months").notNull(),
    /** Fee percentage applied to the facility amount (e.g. "8.00" = 8%) */
    feePercentage: numeric("fee_percentage", {
      precision: 5,
      scale: 2,
    }).notNull(),
    /** Default downpayment percentage (e.g. "40.00" = 40%) */
    defaultDownpaymentPercent: numeric("default_downpayment_percent", {
      precision: 5,
      scale: 2,
    }).notNull(),
    /** Facility sum threshold requiring guarantor check (integer Rials) */
    guarantorThreshold: numeric("guarantor_threshold", {
      precision: 12,
      scale: 0,
    }).notNull(),
    /** Absolute facility ceiling — exceeding this rejects installment (integer Rials) */
    hardCeiling: numeric("hard_ceiling", {
      precision: 12,
      scale: 0,
    }).notNull(),
    /** Whether this rule is currently active */
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("installment_rules_term_idx").on(table.termMonths),
    index("installment_rules_active_idx").on(table.isActive),
  ],
);

/**
 * Category-level installment overrides.
 *
 * When a product's category matches an override row, the override's
 * downpayment percent and/or fee percentage REPLACES the global rule values
 * for that specific line item in the basket calculation.
 *
 * This allows high-value categories (e.g. laptops) to require higher
 * downpayments or carry different fee structures than the platform default.
 */
export const categoryInstallmentOverrides = pgTable(
  "category_installment_overrides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** The category this override applies to */
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    /** The global rule this override modifies */
    ruleId: uuid("rule_id")
      .notNull()
      .references(() => installmentRules.id, { onDelete: "cascade" }),
    /** Override downpayment percentage (e.g. "50.00" = 50%) — null means use global */
    downpaymentPercentOverride: numeric("downpayment_percent_override", {
      precision: 5,
      scale: 2,
    }),
    /** Override fee percentage — null means use global */
    feePercentageOverride: numeric("fee_percentage_override", {
      precision: 5,
      scale: 2,
    }),
    /** Minimum downpayment amount in integer Rials — null means no floor */
    minDownpaymentAmount: numeric("min_downpayment_amount", {
      precision: 12,
      scale: 0,
    }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cat_installment_category_idx").on(table.categoryId),
    index("cat_installment_rule_idx").on(table.ruleId),
    index("cat_installment_active_idx").on(table.isActive),
  ],
);
