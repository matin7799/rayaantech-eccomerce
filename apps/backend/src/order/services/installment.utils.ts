import type { InstallmentEvaluationResult, InstallmentLineResult } from "@rayan-tech/types";

/**
 * Installment pricing arithmetic — pure integer Rial math.
 *
 * INVARIANTS:
 * - All monetary values are integer Rials (no fractional digits)
 * - Final downpayments and monthly installments are rounded UP to nearest 100,000
 * - Zero floating-point operations on currency
 */

// ─── Ceiling Round Helper ────────────────────────────────────────────────────

/**
 * Round UP to the nearest 100,000 Rial unit.
 * e.g. 4,350,001 → 4,400,000 | 4,400,000 → 4,400,000 (exact stays)
 */
export function ceilTo100k(rials: number): number {
  return Math.ceil(rials / 100_000) * 100_000;
}

// ─── Percentage Application (Basis Points) ───────────────────────────────────

/**
 * Apply a percentage to an integer Rial amount using basis-point math.
 * @param rials - Base amount in integer Rials
 * @param percent - Percentage string from DB (e.g. "40.00" = 40%)
 * @returns Integer Rial result (truncated)
 */
export function applyPercent(rials: number, percent: string): number {
  const parts = percent.split(".");
  const whole = parseInt(parts[0], 10) || 0;
  const frac = parseInt((parts[1] ?? "00").slice(0, 2).padEnd(2, "0"), 10);
  const basisPoints = whole * 100 + frac;
  return Math.trunc((rials * basisPoints) / 10_000);
}

// ─── Per-Item Installment Calculation ────────────────────────────────────────

/**
 * Parameters for computing a single line item's installment breakdown.
 */
export interface ItemInstallmentParams {
  productId: string;
  basePrice: number;
  quantity: number;
  termMonths: number;
  feePercentage: string;
  downpaymentPercent: string;
  minDownpaymentAmount: number | null;
  customDownpayment: number | null;
  isOverridden: boolean;
}

/**
 * Compute installment breakdown for a single cart line item.
 *
 * Formula:
 *   downpayment = max(percent-based, min floor, custom) → ceil to 100k
 *   facility = (basePrice * quantity) - downpayment
 *   totalOwed = facility * (1 + fee%)
 *   monthly = ceil(totalOwed / termMonths) → ceil to 100k
 */
export function computeItemInstallment(params: ItemInstallmentParams): InstallmentLineResult {
  const totalItemPrice = params.basePrice * params.quantity;

  // Calculate default downpayment from percentage
  let downpayment = applyPercent(totalItemPrice, params.downpaymentPercent);

  // Apply minimum floor if set (category override)
  if (params.minDownpaymentAmount !== null && downpayment < params.minDownpaymentAmount) {
    downpayment = params.minDownpaymentAmount;
  }

  // Apply custom user override (must be >= calculated minimum)
  if (params.customDownpayment !== null && params.customDownpayment >= downpayment) {
    downpayment = params.customDownpayment;
  }

  // INVARIANT: Round UP downpayment to nearest 100,000
  downpayment = ceilTo100k(downpayment);

  // Facility = total item price minus downpayment
  const facilityAmount = Math.max(0, totalItemPrice - downpayment);

  // Total owed = facility * (1 + fee%)
  const feeAmount = applyPercent(facilityAmount, params.feePercentage);
  const totalOwed = facilityAmount + feeAmount;

  // Monthly installment = ceil(totalOwed / term) → round to 100k
  const rawMonthly = Math.ceil(totalOwed / params.termMonths);
  const monthlyInstallment = ceilTo100k(rawMonthly);

  return {
    productId: params.productId,
    basePrice: params.basePrice,
    downpayment,
    facilityAmount,
    monthlyInstallment,
    termMonths: params.termMonths,
    feePercentage: params.feePercentage,
    isOverridden: params.isOverridden,
  };
}

// ─── Basket Evaluation ───────────────────────────────────────────────────────

/**
 * Parameters for full basket installment evaluation.
 */
export interface BasketEvalParams {
  items: ItemInstallmentParams[];
  guarantorThreshold: number;
  hardCeiling: number;
  termMonths: number;
}

/**
 * Evaluate the entire cart for installment eligibility.
 *
 * - Computes each item independently (respecting category overrides)
 * - Aggregates total facility across all items
 * - Flags guarantor requirement if total > threshold
 * - Flags hard ceiling breach if total > ceiling
 */
export function evaluateBasketInstallment(params: BasketEvalParams): InstallmentEvaluationResult {
  const items: InstallmentLineResult[] = [];
  let totalDownpayment = 0;
  let totalFacility = 0;
  let totalMonthly = 0;

  for (const itemParams of params.items) {
    const result = computeItemInstallment(itemParams);
    items.push(result);
    totalDownpayment += result.downpayment;
    totalFacility += result.facilityAmount;
    totalMonthly += result.monthlyInstallment;
  }

  return {
    items,
    totalDownpayment,
    totalFacility,
    totalMonthly,
    termMonths: params.termMonths,
    requiresGuarantorCheck: totalFacility > params.guarantorThreshold,
    exceedsHardCeiling: totalFacility > params.hardCeiling,
    guarantorThreshold: params.guarantorThreshold,
    hardCeiling: params.hardCeiling,
  };
}
