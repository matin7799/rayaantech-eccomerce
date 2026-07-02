/**
 * Legacy re-export shim.
 *
 * The canonical money-math utilities now live in `src/pricing/pricing.utils.ts`.
 * This file re-exports them so the order/checkout module keeps its existing
 * import path (`./pricing.utils`) without behavior change.
 *
 * New code should import directly from `../../pricing/pricing.utils`.
 */

export type { AddonPriceRow, VariantPricingRow } from "../../pricing/pricing.utils";
export {
  applyPercentageMarkdown,
  ceilTo100k,
  computeEffectivePrice,
  computePriceWithAddons,
  parseRials,
  sumAddonAdjustments,
  toRialString,
} from "../../pricing/pricing.utils";
