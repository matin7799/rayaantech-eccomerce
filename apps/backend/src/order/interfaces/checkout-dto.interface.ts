/**
 * A single checkout item — client sends ONLY variant ID + quantity.
 * All pricing is resolved exclusively server-side.
 */
export interface CheckoutItemDto {
  /** UUID of the product variant (SKU) to purchase */
  variantId: string;
  /** Quantity to purchase (must be >= 1) */
  quantity: number;
}

/**
 * Checkout request payload — the ONLY accepted input from the client.
 * No prices, discounts, or totals are accepted from the client.
 */
export interface CheckoutRequestDto {
  /** Array of items to checkout */
  items: CheckoutItemDto[];
  /** Optional shipping address */
  shippingAddress?: string;
  /** Optional order notes */
  notes?: string;
}

/**
 * Resolved line item after server-side pricing computation.
 */
export interface ResolvedLineItem {
  productId: string;
  variantId: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

/**
 * Full checkout result returned to the client.
 */
export interface CheckoutResult {
  orderId: string;
  snapshotId: string;
  totalAmount: string;
  discountAmount: string;
  items: ResolvedLineItem[];
  reservationExpiresAt: string;
}
