/**
 * Pricing engine public surface.
 */

export {
  coerceDisplayTier,
  computeDiscountPercent,
  guestBuyerContext,
  resolvePricingContext,
  resolveProductPrice,
  resolveRetailBaseline,
} from "./pricing.service";
export type {
  BuyerContext,
  PricingContextEnvelope,
  PricingTier,
  ProductPriceRow,
  ResolvedPrice,
} from "./pricing.types";
export type { AddonPriceRow, VariantPricingRow } from "./pricing.utils";
export {
  applyPercentageMarkdown,
  ceilTo100k,
  computeEffectivePrice,
  computePriceWithAddons,
  parseRials,
  sumAddonAdjustments,
  toRialString,
} from "./pricing.utils";
