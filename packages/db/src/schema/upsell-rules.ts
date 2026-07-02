import { index, numeric, pgTable, uuid } from "drizzle-orm/pg-core";
import { upsellRuleTypeEnum } from "./enums.js";
import { products } from "./products.js";

export const upsellRules = pgTable(
  "upsell_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceProductId: uuid("source_product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    targetProductId: uuid("target_product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    ruleType: upsellRuleTypeEnum("rule_type").notNull(),
    discountIncentiveModifier: numeric("discount_incentive_modifier", {
      precision: 12,
      scale: 2,
    })
      .default("0")
      .notNull(),
  },
  (table) => [
    index("upsell_rules_source_idx").on(table.sourceProductId),
    index("upsell_rules_target_idx").on(table.targetProductId),
    index("upsell_rules_type_idx").on(table.ruleType),
  ],
);
