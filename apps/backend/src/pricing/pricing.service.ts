/**
 * Pricing Engine — Server-Authoritative Resolution Service.
 *
 * Single source of truth for the "true" price a buyer pays. Replaces the
 * raw-column passthrough that previously let the client pick between
 * basePrice / discountedPrice / torobPrice / wholesalePrice.
 *
 * Resolution priority (highest wins):
 *   1. Torob referral price — only when ctx.torob.active AND a per-product
 *      `torob_price` column is set. Overrides wholesale and campaigns.
 *   2. Campaign price — only within its [start_at, end_at] date window.
 *   3. Permanent discounted price.
 *   4. Explicit wholesale price — only when ctx.wholesale is an approved partner.
 *   5. Base price minus wholesale markdown % — approved partners only.
 *   6. Base price (retail default).
 *
 * All arithmetic is integer-Rial basis-point math. No floating point on currency.
 */

import type {
  BuyerContext,
  PricingContextEnvelope,
  PricingTier,
  ProductPriceRow,
  ResolvedPrice,
} from "./pricing.types";
import { applyPercentageMarkdown, parseRials } from "./pricing.utils";

/**
 * Parse a possibly-null Rial string into a number, returning null when absent.
 */
function parseNullableRials(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  return parseRials(value);
}

/**
 * Compute the whole-percent discount from baseline to effective, rounded down.
 * Returns null when baseline is missing, non-positive, or no discount applies.
 *
 * Uses integer basis-point math: pct = trunc((baseline - effective) * 100 / baseline).
 */
export function computeDiscountPercent(baseline: number | null, effective: number): number | null {
  if (baseline === null || baseline <= 0 || effective >= baseline) return null;
  return Math.trunc(((baseline - effective) * 100) / baseline);
}

/**
 * Resolve whether a campaign price is active at the given instant.
 */
function isCampaignActive(row: ProductPriceRow, now: number): boolean {
  if (!(row.campaign_price && row.campaign_start_at && row.campaign_end_at)) {
    return false;
  }
  const start = new Date(row.campaign_start_at).getTime();
  const end = new Date(row.campaign_end_at).getTime();
  return now >= start && now <= end;
}

/**
 * Resolve the regular retail effective price — campaign, then discounted, then base.
 *
 * This is the baseline used for struck-through rendering when a partner/torob
 * discount applies. It NEVER consults wholesale or torob columns.
 */
export function resolveRetailBaseline(row: ProductPriceRow): number {
  const modifier = parseRials(row.price_modifier ?? "0");
  const now = Date.now();

  if (isCampaignActive(row, now)) {
    return parseRials(row.campaign_price!) + modifier;
  }
  if (row.discounted_price) {
    return parseRials(row.discounted_price) + modifier;
  }
  return parseRials(row.base_price) + modifier;
}

/**
 * Core resolver. Given a product price row + buyer context, emit the
 * server-authoritative `ResolvedPrice`. Pure function — safe to call per row.
 */
export function resolveProductPrice(row: ProductPriceRow, ctx: BuyerContext): ResolvedPrice {
  const modifier = parseRials(row.price_modifier ?? "0");
  const basePrice = parseRials(row.base_price);
  const now = Date.now();

  // ─── Priority 1: Torob referral (active session + explicit torob_price) ───
  if (ctx.torob?.active) {
    const torobPrice = parseNullableRials(row.torob_price);
    if (torobPrice !== null) {
      const effective = torobPrice + modifier;
      const baseline = resolveRetailBaseline(row);
      return {
        effectivePrice: effective,
        displayBaseline: effective < baseline ? baseline : null,
        discountPercent: computeDiscountPercent(baseline, effective),
        pricingTier: "torob",
      };
    }
    // No explicit torob_price → fall through to normal resolution.
    // The tier stays torob only if a torob price was actually applied.
  }

  // ─── Priority 2: Campaign price (time-bounded) ───
  if (isCampaignActive(row, now)) {
    const effective = parseRials(row.campaign_price!) + modifier;
    return {
      effectivePrice: effective,
      displayBaseline: effective < basePrice ? basePrice : null,
      discountPercent: computeDiscountPercent(basePrice, effective),
      pricingTier: ctx.wholesale?.status === "approved" ? "wholesale" : "regular",
    };
  }

  // ─── Priority 3: Permanent discounted price ───
  if (row.discounted_price) {
    const effective = parseRials(row.discounted_price) + modifier;
    return {
      effectivePrice: effective,
      displayBaseline: effective < basePrice ? basePrice : null,
      discountPercent: computeDiscountPercent(basePrice, effective),
      pricingTier: ctx.wholesale?.status === "approved" ? "wholesale" : "regular",
    };
  }

  // ─── Priority 4/5: Wholesale partner ───
  if (ctx.wholesale?.status === "approved") {
    const explicitWholesale = parseNullableRials(row.wholesale_price);
    if (explicitWholesale !== null) {
      const effective = explicitWholesale + modifier;
      return {
        effectivePrice: effective,
        displayBaseline: effective < basePrice ? basePrice : null,
        discountPercent: computeDiscountPercent(basePrice, effective),
        pricingTier: "wholesale",
      };
    }
    // No explicit wholesale_price → apply group markdown % to base.
    const effective = applyPercentageMarkdown(basePrice, ctx.wholesale.markdownPercent) + modifier;
    return {
      effectivePrice: effective,
      displayBaseline: effective < basePrice ? basePrice : null,
      discountPercent: computeDiscountPercent(basePrice, effective),
      pricingTier: "wholesale",
    };
  }

  // ─── Priority 6: Retail base ───
  return {
    effectivePrice: basePrice + modifier,
    displayBaseline: null,
    discountPercent: null,
    pricingTier: "regular",
  };
}

/**
 * Resolve the per-request pricing envelope (TTL + tier) from buyer context.
 *
 * Tier fallthrough after Torob expiry:
 *  - torob active          → "torob"
 *  - else approved partner → "wholesale"
 *  - else                  → "regular"
 *
 * NOTE: The envelope tier is the *session* tier. A product whose `torob_price`
 * is null will display its retail/wholesale price even while the envelope
 * reports "torob" — the per-product resolver handles that nuance.
 */
export function resolvePricingContext(ctx: BuyerContext): PricingContextEnvelope {
  if (ctx.torob?.active && ctx.torob.ttlSeconds > 0) {
    return { remainingTorobTtl: ctx.torob.ttlSeconds, tier: "torob" };
  }
  if (ctx.wholesale?.status === "approved") {
    return { remainingTorobTtl: 0, tier: "wholesale" };
  }
  return { remainingTorobTtl: 0, tier: "regular" };
}

/**
 * Resolve the display tier label for catalog responses where the row may
 * not have a torob_price even though the session is torob-active.
 */
export function coerceDisplayTier(tier: PricingTier, ctx: BuyerContext): PricingTier {
  if (tier !== "torob" && ctx.torob?.active && ctx.torob.ttlSeconds > 0) {
    // A torob session is active but this product had no torob_price.
    // Still surface the session context for banner/badge logic, but the
    // product's own tier reflects its actual price source.
    return ctx.wholesale?.status === "approved" ? "wholesale" : "regular";
  }
  return tier;
}

/**
 * Build an empty "guest" buyer context — used when session resolution
 * yields nothing (no cookie, no Torob session).
 */
export function guestBuyerContext(): BuyerContext {
  return { torob: null, wholesale: null };
}
