/**
 * Integer Rial Financial Arithmetic Utilities.
 *
 * INVARIANT: All price columns in the database use numeric(12, 0) — integer Rials.
 * PostgreSQL returns these as string representations of whole numbers
 * (e.g. "89900000"). All arithmetic operates directly on integers.
 * No floating-point operations on currency, ever.
 *
 * This is the canonical home for money math. The order module re-exports
 * these via `order/services/pricing.utils.ts` for backward compatibility.
 */

/**
 * DB row shape for variant + product pricing lookup.
 * All price fields are integer Rial strings from PostgreSQL NUMERIC(12,0).
 */
export interface VariantPricingRow extends Record<string, unknown> {
  variant_id: string;
  product_id: string;
  sku: string;
  variant_stock: number;
  price_modifier: string;
  base_price: string;
  discounted_price: string | null;
  campaign_price: string | null;
  campaign_start_at: string | null;
  campaign_end_at: string | null;
  wholesale_price: string | null;
}

/**
 * Parse an integer Rial string from PostgreSQL to a JavaScript number.
 * Since scale is 0, there are no fractional digits — direct parseInt is safe.
 *
 * @param value - Integer Rial string from DB (e.g. "89900000")
 * @returns Integer value in Rials
 */
export function parseRials(value: string): number {
  return parseInt(value, 10) || 0;
}

/**
 * Convert an integer Rial amount back to a string for DB storage or API response.
 *
 * @param rials - Integer Rial amount
 * @returns String representation (e.g. "89900000")
 */
export function toRialString(rials: number): string {
  return String(rials);
}

/**
 * Apply a percentage markdown to a Rial integer.
 * Uses integer math with basis points to avoid any floating-point drift.
 *
 * @param rials - Base price in integer Rials
 * @param markdownPercent - Percentage as a decimal string from DB (e.g. "5.00" for 5%)
 * @returns Discounted price in integer Rials (rounded down via truncation)
 */
export function applyPercentageMarkdown(rials: number, markdownPercent: string): number {
  // Parse "5.50" → 550 basis points (multiply by 100 to avoid float)
  const parts = markdownPercent.split(".");
  const whole = parseInt(parts[0], 10) || 0;
  const frac = parseInt((parts[1] ?? "00").slice(0, 2).padEnd(2, "0"), 10);
  const basisPoints = whole * 100 + frac;

  // discount = rials × basisPoints / 10000
  const discount = Math.trunc((rials * basisPoints) / 10000);
  return rials - discount;
}

/**
 * Compute the effective unit price in integer Rials using priority logic.
 *
 * Priority:
 * 1. Active campaign price (within date window) + price modifier
 * 2. Discounted price (permanent) + price modifier
 * 3. Wholesale price (if user qualifies and explicit price exists) + price modifier
 * 4. Base price with wholesale % markdown + price modifier
 * 5. Base price + price modifier (default)
 *
 * @param row - Variant pricing data from DB
 * @param wholesaleMarkdownPercent - Wholesale group markdown (e.g. "5.00") or null
 */
export function computeEffectivePrice(
  row: VariantPricingRow,
  wholesaleMarkdownPercent: string | null,
): number {
  const basePrice = parseRials(row.base_price);
  const priceModifier = parseRials(row.price_modifier ?? "0");
  const now = Date.now();

  // Priority 1: Campaign price (time-bounded)
  if (row.campaign_price && row.campaign_start_at && row.campaign_end_at) {
    const start = new Date(row.campaign_start_at).getTime();
    const end = new Date(row.campaign_end_at).getTime();
    if (now >= start && now <= end) {
      return parseRials(row.campaign_price) + priceModifier;
    }
  }

  // Priority 2: Discounted price (permanent markdown)
  if (row.discounted_price) {
    return parseRials(row.discounted_price) + priceModifier;
  }

  // Priority 3: Explicit wholesale price (user qualifies + price exists)
  if (wholesaleMarkdownPercent && row.wholesale_price) {
    return parseRials(row.wholesale_price) + priceModifier;
  }

  // Priority 4: Apply wholesale percentage markdown to base price
  if (wholesaleMarkdownPercent) {
    const discounted = applyPercentageMarkdown(basePrice, wholesaleMarkdownPercent);
    return discounted + priceModifier;
  }

  // Default: Base price + modifier
  return basePrice + priceModifier;
}

// ─── Addon Pricing ───────────────────────────────────────────────────────────

/**
 * Addon pricing data from DB lookup.
 */
export interface AddonPriceRow {
  id: string;
  priceAdjustment: string;
  isRequired: boolean;
}

/**
 * Ceiling round helper: Round UP to nearest 100,000 Toman.
 * e.g. 4,350,001 → 4,400,000 | 4,400,000 → 4,400,000 (exact stays)
 */
export function ceilTo100k(tomans: number): number {
  return Math.ceil(tomans / 100_000) * 100_000;
}

/**
 * Compute the total addon price adjustment for a set of selected addons.
 * All math is integer Tomans — no floating point.
 *
 * @param addons - Array of addon price rows from DB
 * @returns Sum of all price_adjustment values (integer Tomans)
 */
export function sumAddonAdjustments(addons: AddonPriceRow[]): number {
  let total = 0;
  for (const addon of addons) {
    total += parseInt(addon.priceAdjustment, 10) || 0;
  }
  return total;
}

/**
 * Compute the final line item price including addons, ceiled to 100k.
 *
 * Formula:
 *   finalPrice = ceil100k(effectiveBasePrice + sumOfAddonAdjustments)
 *
 * @param effectiveBasePrice - Base product price after priority logic (integer Tomans)
 * @param selectedAddons - Addon rows the user selected (from DB validation)
 * @returns Final price ceiled to nearest 100,000 Tomans
 */
export function computePriceWithAddons(
  effectiveBasePrice: number,
  selectedAddons: AddonPriceRow[],
): number {
  const addonTotal = sumAddonAdjustments(selectedAddons);
  const rawTotal = effectiveBasePrice + addonTotal;
  return ceilTo100k(rawTotal);
}
