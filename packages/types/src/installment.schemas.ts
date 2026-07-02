import { z } from "zod";

/**
 * Integer Rial price string validator.
 */
const rialString = z.string().regex(/^\d+$/, "مبلغ باید عدد صحیح تومان باشد");

/**
 * Single item in the installment calculation request.
 */
const installmentCartItemSchema = z.object({
  /** Product ID for category override lookup */
  productId: z.string().uuid(),
  /** Category ID to check for override rules */
  categoryId: z.string().uuid(),
  /** Product base price in integer Rials */
  basePrice: rialString,
  /** Quantity of this item */
  quantity: z.number().int().min(1),
  /** Optional custom downpayment override by user (integer Rials) */
  customDownpayment: rialString.optional(),
});

/**
 * Full installment calculation request schema.
 * Validates the hybrid shopping cart configuration for compound installment evaluation.
 */
export const InstallmentCalculationSchema = z.object({
  /** Cart items to evaluate */
  items: z.array(installmentCartItemSchema).min(1, "سبد خرید خالی است"),
  /** Requested term in months (must match an active global rule) */
  termMonths: z.number().int().min(1).max(36),
});

export type InstallmentCalculationInput = z.infer<typeof InstallmentCalculationSchema>;

/**
 * Per-item result from the installment engine.
 */
export interface InstallmentLineResult {
  productId: string;
  basePrice: number;
  downpayment: number;
  facilityAmount: number;
  monthlyInstallment: number;
  termMonths: number;
  feePercentage: string;
  isOverridden: boolean;
}

/**
 * Full basket installment evaluation result.
 */
export interface InstallmentEvaluationResult {
  items: InstallmentLineResult[];
  totalDownpayment: number;
  totalFacility: number;
  totalMonthly: number;
  termMonths: number;
  requiresGuarantorCheck: boolean;
  exceedsHardCeiling: boolean;
  guarantorThreshold: number;
  hardCeiling: number;
}
