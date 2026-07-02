/**
 * Pricing Engine — Shared Types.
 *
 * The pricing resolution layer emits a single, server-authoritative
 * `ResolvedPrice` per product. The client never selects between raw
 * price columns — it only displays the values resolved here.
 *
 * All money is integer Rials (numeric(12,0) in Postgres, parsed to JS number).
 */

/**
 * Buyer classification that drives which price source wins.
 *
 * Priority (highest first):
 *  1. `torob`     — active Torob referral session (1200s TTL) overrides all
 *  2. `wholesale`  — logged-in approved partner with a wholesale group markdown
 *  3. `regular`    — anonymous or retail visitor; retail effective price applies
 *
 * A Torob session wins over a wholesale login for the duration of its TTL
 * because the referral promo is the inbound-conversion lever. After TTL
 * expiry the tier falls back to wholesale-if-logged-in, else regular.
 */
export type PricingTier = "regular" | "torob" | "wholesale";

/**
 * Buyer context resolved from the request — passed into `PricingService`.
 * Built once per tRPC context from the Torob session cookie + the user session.
 */
export interface BuyerContext {
  /** Active Torob referral (Redis key present and TTL > 0). Null when no session. */
  torob: { active: boolean; ttlSeconds: number; sessionId: string } | null;
  /** Wholesale context. Null when not an approved partner. */
  wholesale: { groupId: string; markdownPercent: string; status: "approved" } | null;
}

/**
 * Product price fields read from the database (snake_case, Rial strings).
 * Re-exported shape compatible with the order module's `VariantPricingRow`.
 */
export interface ProductPriceRow {
  base_price: string;
  discounted_price: string | null;
  torob_price: string | null;
  wholesale_price: string | null;
  campaign_price: string | null;
  campaign_start_at: string | null;
  campaign_end_at: string | null;
  /** Per-variant additive Rial modifier (defaults to "0"). */
  price_modifier?: string | null;
}

/**
 * Server-authoritative resolved price emitted to the storefront.
 *
 * INVARIANT: The client may DISPLAY `displayBaseline` struck-through next to
 * `effectivePrice`, but it must never recompute a discount or pick a tier.
 */
export interface ResolvedPrice {
  /** The price the buyer pays, in integer Rials (already includes variant modifier). */
  effectivePrice: number;
  /** Retail baseline (regular effective price) for struck-through rendering. Null when equal. */
  displayBaseline: number | null;
  /** Whole-percent discount from baseline to effective (basis-point math, server-computed). */
  discountPercent: number | null;
  /** Which tier won resolution — drives which badge the client renders. */
  pricingTier: PricingTier;
}

/**
 * Per-request pricing envelope attached at the top level of catalog/PDP
 * responses so the countdown banner can render without a separate fetch
 * per product. The dedicated `pricing.context` procedure mirrors this shape.
 */
export interface PricingContextEnvelope {
  /** Remaining Torob session TTL in seconds. 0 when no active session. */
  remainingTorobTtl: number;
  /** Current buyer tier (after Torob/expiry fallthrough). */
  tier: PricingTier;
}
