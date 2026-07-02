import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["retail", "wholesale", "admin", "operator"]);

export const wholesaleStatusEnum = pgEnum("wholesale_status", [
  "none",
  "pending",
  "approved",
  "rejected",
]);

export const productGradeEnum = pgEnum("product_grade", [
  "open_box",
  "stock",
  "refurbished",
  "like_new",
  "used",
]);

export const storageProviderEnum = pgEnum("storage_provider", ["s3", "local"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "zarinpal",
  "digipay_credit",
  "cash_on_delivery",
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "completed",
  "expired",
]);

export const upsellRuleTypeEnum = pgEnum("upsell_rule_type", [
  "upsell",
  "cross_sell",
  "frequently_bought_together",
]);

export const systemLogLevelEnum = pgEnum("system_log_level", ["info", "warn", "error", "debug"]);

export const priceModifierTypeEnum = pgEnum("price_modifier_type", ["percentage", "fixed"]);
