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
  /** Optional shipping cost in Toman (server may override/refuse client-supplied values) */
  shippingAmount?: number;
  /** Optional contact phone number for this order */
  phoneNumber?: string;
}

/**
 * Server-resolved Torob attribution context threaded from the request into
 * checkout. `torobClid` comes from the `rt_torob_clid` cookie set by
 * TorobClidMiddleware when the user landed via a Torob referral link.
 */
export interface CheckoutTorobContext {
  /** Torob click id captured at landing, if the user came from Torob. */
  torobClid?: string;
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
