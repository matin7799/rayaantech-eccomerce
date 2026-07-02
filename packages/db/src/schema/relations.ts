import { relations } from "drizzle-orm";
import { apiTokens } from "./api-tokens.js";
import { attributeKeys, attributeValues } from "./attributes.js";
import { brands } from "./brands.js";
import { categories } from "./categories.js";
import { blogPosts, shoppableStories } from "./content.js";
import { categoryInstallmentOverrides, installmentRules } from "./installments.js";
import { media, productMedia } from "./media.js";
import { cartSnapshots, orders, payments } from "./orders.js";
import { productAddons } from "./product-addons.js";
import { productReservations } from "./product-reservations.js";
import { productSecondaryCategories } from "./product-secondary-categories.js";
import { productVariants, variantAttributeValues } from "./product-variants.js";
import { products } from "./products.js";
import { upsellRules } from "./upsell-rules.js";
import { users } from "./users.js";
import { wholesaleGroups } from "./wholesale-groups.js";

// ─── User Relations ──────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  wholesaleGroup: one(wholesaleGroups, {
    fields: [users.wholesaleGroupId],
    references: [wholesaleGroups.id],
  }),
  apiTokens: many(apiTokens),
  orders: many(orders),
  cartSnapshots: many(cartSnapshots),
  productReservations: many(productReservations),
  blogPosts: many(blogPosts),
}));

// ─── API Token Relations ─────────────────────────────────────────────────────

export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
  user: one(users, {
    fields: [apiTokens.userId],
    references: [users.id],
  }),
}));

// ─── Category Relations ──────────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  children: many(categories, { relationName: "categoryParent" }),
  products: many(products),
  productSecondaryCategories: many(productSecondaryCategories),
}));

// ─── Brand Relations ─────────────────────────────────────────────────────────

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

// ─── Product Relations ───────────────────────────────────────────────────────

export const productsRelations = relations(products, ({ one, many }) => ({
  primaryCategory: one(categories, {
    fields: [products.primaryCategoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  secondaryCategories: many(productSecondaryCategories),
  variants: many(productVariants),
  productMedia: many(productMedia),
  shoppableStories: many(shoppableStories),
  reservations: many(productReservations),
  addons: many(productAddons),
  upsellSourceRules: many(upsellRules, { relationName: "upsellSource" }),
  upsellTargetRules: many(upsellRules, { relationName: "upsellTarget" }),
}));

// ─── Product Secondary Categories Relations ──────────────────────────────────

export const productSecondaryCategoriesRelations = relations(
  productSecondaryCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productSecondaryCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productSecondaryCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

// ─── Attribute Relations ─────────────────────────────────────────────────────

export const attributeKeysRelations = relations(attributeKeys, ({ many }) => ({
  values: many(attributeValues),
}));

export const attributeValuesRelations = relations(attributeValues, ({ one, many }) => ({
  key: one(attributeKeys, {
    fields: [attributeValues.keyId],
    references: [attributeKeys.id],
  }),
  variantAttributeValues: many(variantAttributeValues),
}));

// ─── Product Variant Relations ───────────────────────────────────────────────

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  attributeValues: many(variantAttributeValues),
  reservations: many(productReservations),
}));

export const variantAttributeValuesRelations = relations(variantAttributeValues, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantAttributeValues.variantId],
    references: [productVariants.id],
  }),
  attributeValue: one(attributeValues, {
    fields: [variantAttributeValues.valueId],
    references: [attributeValues.id],
  }),
}));

// ─── Media Relations ─────────────────────────────────────────────────────────

export const mediaRelations = relations(media, ({ many }) => ({
  productMedia: many(productMedia),
}));

export const productMediaRelations = relations(productMedia, ({ one }) => ({
  product: one(products, {
    fields: [productMedia.productId],
    references: [products.id],
  }),
  media: one(media, {
    fields: [productMedia.mediaId],
    references: [media.id],
  }),
}));

// ─── Order Relations ─────────────────────────────────────────────────────────

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  payments: many(payments),
  cartSnapshot: one(cartSnapshots),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const cartSnapshotsRelations = relations(cartSnapshots, ({ one }) => ({
  user: one(users, {
    fields: [cartSnapshots.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [cartSnapshots.orderId],
    references: [orders.id],
  }),
}));

// ─── Product Reservation Relations ───────────────────────────────────────────

export const productReservationsRelations = relations(productReservations, ({ one }) => ({
  product: one(products, {
    fields: [productReservations.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productReservations.productVariantId],
    references: [productVariants.id],
  }),
  user: one(users, {
    fields: [productReservations.userId],
    references: [users.id],
  }),
}));

// ─── Upsell Rule Relations ───────────────────────────────────────────────────

export const upsellRulesRelations = relations(upsellRules, ({ one }) => ({
  sourceProduct: one(products, {
    fields: [upsellRules.sourceProductId],
    references: [products.id],
    relationName: "upsellSource",
  }),
  targetProduct: one(products, {
    fields: [upsellRules.targetProductId],
    references: [products.id],
    relationName: "upsellTarget",
  }),
}));

// ─── Content Relations ───────────────────────────────────────────────────────

export const shoppableStoriesRelations = relations(shoppableStories, ({ one }) => ({
  product: one(products, {
    fields: [shoppableStories.productId],
    references: [products.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// ─── Wholesale Groups ────────────────────────────────────────────────────────

export const wholesaleGroupsRelations = relations(wholesaleGroups, ({ many }) => ({
  users: many(users),
}));

// ─── Installment Relations ───────────────────────────────────────────────────

export const installmentRulesRelations = relations(installmentRules, ({ many }) => ({
  categoryOverrides: many(categoryInstallmentOverrides),
}));

export const categoryInstallmentOverridesRelations = relations(
  categoryInstallmentOverrides,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoryInstallmentOverrides.categoryId],
      references: [categories.id],
    }),
    rule: one(installmentRules, {
      fields: [categoryInstallmentOverrides.ruleId],
      references: [installmentRules.id],
    }),
  }),
);

// ─── Product Addon Relations ─────────────────────────────────────────────────

export const productAddonsRelations = relations(productAddons, ({ one }) => ({
  product: one(products, {
    fields: [productAddons.productId],
    references: [products.id],
  }),
}));
