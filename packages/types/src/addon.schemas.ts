import { z } from "zod";

/**
 * Schema representing a product addon returned from the API.
 */
export const ProductAddonSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  name: z.string(),
  priceAdjustment: z.number().int().min(0),
  isRequired: z.boolean(),
});

export type ProductAddon = z.infer<typeof ProductAddonSchema>;

/**
 * Schema for selected addons in a cart item (sent during checkout).
 */
export const CartItemAddonSelectionSchema = z.object({
  addonId: z.string().uuid(),
});

/**
 * Extended checkout item schema including addon selections.
 */
export const CheckoutItemWithAddonsSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  selectedAddonIds: z.array(z.string().uuid()).default([]),
});

export type CheckoutItemWithAddons = z.infer<typeof CheckoutItemWithAddonsSchema>;
