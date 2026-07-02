import { motion } from "framer-motion";
import { Banknote, CreditCard, Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";

/**
 * Format a number as Persian Toman using Intl.NumberFormat.
 * Displays with "تومان" suffix and fa-IR digit grouping.
 */
function formatTomanPersian(value: number): string {
  const formatter = new Intl.NumberFormat("fa-IR", {
    style: "decimal",
    maximumFractionDigits: 0,
  });
  return `${formatter.format(value)} تومان`;
}

/**
 * Round UP to the nearest 100,000 Toman.
 * INVARIANT: All installment display values use this rounding.
 * Example: 7,616,667 → 7,700,000
 */
function roundUp100k(value: number): number {
  return Math.ceil(value / 100000) * 100000;
}

/**
 * Rayan Tech installment option from the server-side estimate.
 */
interface RayanTechOption {
  ruleId: string;
  name: string;
  termMonths: number;
  downpayment: number;
  facility: number;
  fee: number;
  monthlyInstallment: number;
  feePercent: number;
  downpaymentPercent: number;
  requiresGuarantor: boolean;
  isOverridden: boolean;
}

interface InstallmentComparisonDialogProps {
  /** Effective product price in integer Toman */
  effectivePrice: number;
  /** Server-side Rayan Tech installment options */
  rayanTechOptions: RayanTechOption[];
  /** Whether installment data is still loading */
  isLoading?: boolean;
  /** Callback to add item to cart from within the dialog */
  onAddToCart?: () => void;
  /** Whether the add-to-cart mutation is pending */
  isAddingToCart?: boolean;
  /** Whether the product is in stock */
  inStock?: boolean;
}

/**
 * DigiPay static installment calculations (client-side).
 *
 * Option 1: 4 ماهه بدون کارمزد (price / 4)
 * Option 2: 12 ماهه با کارمزد ۲۳٪ (price * 1.23 / 12)
 *
 * All values rounded UP to nearest 100,000 Toman.
 */
function computeDigipayOptions(price: number) {
  const fourMonthRaw = Math.ceil(price / 4);
  const fourMonth = roundUp100k(fourMonthRaw);
  const fourMonthTotal = fourMonth * 4;

  const twelveMonthTotalRaw = Math.ceil(price * 1.23);
  const twelveMonthRaw = Math.ceil(twelveMonthTotalRaw / 12);
  const twelveMonth = roundUp100k(twelveMonthRaw);
  const twelveMonthTotal = twelveMonth * 12;

  return {
    fourMonth: {
      monthly: fourMonth,
      total: fourMonthTotal,
      termMonths: 4,
      label: "۴ ماهه بدون کارمزد",
    },
    twelveMonth: {
      monthly: twelveMonth,
      total: twelveMonthTotal,
      termMonths: 12,
      label: "۱۲ ماهه با کارمزد ۲۳٪",
    },
  };
}

/**
 * InstallmentComparisonDialog — Premium glassmorphic modal showing
 * a side-by-side comparison of Rayan Tech internal installments
 * vs. DigiPay gateway BNPL options.
 *
 * Features:
 * - Large, bold product price header (text-2xl font-bold)
 * - "Add to Cart with Installment Plan" footer CTA
 * - 100k rounding on all displayed values
 * - Final cost = downpayment + (monthly × months)
 */
export function InstallmentComparisonDialog({
  effectivePrice,
  rayanTechOptions,
  isLoading = false,
  onAddToCart,
  isAddingToCart = false,
  inStock = true,
}: InstallmentComparisonDialogProps) {
  const [open, setOpen] = useState(false);
  const digipay = computeDigipayOptions(effectivePrice);

  const handleAddToCartFromDialog = () => {
    onAddToCart?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl",
          "border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md",
          "px-4 py-3 text-xs font-semibold text-accent",
          "transition-all duration-200 hover:border-accent/50 hover:shadow-sm",
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        مشاهده شرایط خرید اقساطی
      </DialogTrigger>

      <DialogContent
        className={cn(
          "sm:max-w-lg",
          "border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-xl",
          "shadow-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            <CreditCard className="h-4.5 w-4.5 text-accent" />
            شرایط خرید اقساطی
          </DialogTitle>
          {/* Large, bold product price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">
              {formatTomanPersian(effectivePrice)}
            </span>
          </div>
        </DialogHeader>

        <Tabs defaultValue="rayantech" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="rayantech" className="flex-1">
              <Banknote className="ml-1.5 h-3.5 w-3.5" />
              اقساط رایان‌تک
            </TabsTrigger>
            <TabsTrigger value="digipay" className="flex-1">
              <CreditCard className="ml-1.5 h-3.5 w-3.5" />
              دیجی‌پی
            </TabsTrigger>
          </TabsList>

          {/* ─── Rayan Tech Plans ──────────────────────────────────── */}
          <TabsContent value="rayantech" className="mt-3 min-h-[200px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            ) : rayanTechOptions.length === 0 ? (
              <p className="py-6 text-center text-xs text-text-muted">
                شرایط اقساطی برای این محصول فعال نیست.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {rayanTechOptions.map((opt) => {
                  const roundedDownpayment = roundUp100k(opt.downpayment);
                  const roundedMonthly = roundUp100k(opt.monthlyInstallment);
                  const finalCost = roundedDownpayment + roundedMonthly * opt.termMonths;

                  return (
                    <div
                      key={opt.ruleId}
                      className={cn(
                        "flex flex-col gap-1.5 rounded-lg border p-3",
                        "border-[--glass-border] bg-surface/50",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-primary">{opt.name}</span>
                        {opt.requiresGuarantor && (
                          <span className="rounded bg-warning-light px-1.5 py-0.5 text-[9px] font-medium text-warning">
                            نیاز به ضامن
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-text-muted">پیش‌پرداخت:</span>
                          <span className="font-medium text-text-primary">
                            {formatTomanPersian(roundedDownpayment)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">مبلغ هر قسط:</span>
                          <span className="font-medium text-text-primary">
                            {formatTomanPersian(roundedMonthly)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">تعداد اقساط:</span>
                          <span className="font-medium text-text-primary">
                            {new Intl.NumberFormat("fa-IR").format(opt.termMonths)} ماه
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">مبلغ نهایی:</span>
                          <span className="font-medium text-accent">
                            {formatTomanPersian(finalCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ─── DigiPay Plans ─────────────────────────────────────── */}
          <TabsContent value="digipay" className="mt-3 min-h-[200px]">
            <div className="flex flex-col gap-2.5">
              {/* 4-month plan */}
              <div
                className={cn(
                  "flex flex-col gap-1.5 rounded-lg border p-3",
                  "border-[--glass-border] bg-surface/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    {digipay.fourMonth.label}
                  </span>
                  <span className="rounded bg-success-light px-1.5 py-0.5 text-[9px] font-medium text-success">
                    بدون کارمزد
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-text-muted">مبلغ هر قسط:</span>
                    <span className="font-medium text-text-primary">
                      {formatTomanPersian(digipay.fourMonth.monthly)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">تعداد اقساط:</span>
                    <span className="font-medium text-text-primary">۴ ماه</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">مبلغ نهایی:</span>
                    <span className="font-medium text-accent">
                      {formatTomanPersian(digipay.fourMonth.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 12-month plan */}
              <div
                className={cn(
                  "flex flex-col gap-1.5 rounded-lg border p-3",
                  "border-[--glass-border] bg-surface/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    {digipay.twelveMonth.label}
                  </span>
                  <span className="rounded bg-accent-light px-1.5 py-0.5 text-[9px] font-medium text-accent">
                    اعتبار دیجی‌پی
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-text-muted">مبلغ هر قسط:</span>
                    <span className="font-medium text-text-primary">
                      {formatTomanPersian(digipay.twelveMonth.monthly)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">تعداد اقساط:</span>
                    <span className="font-medium text-text-primary">۱۲ ماه</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">مبلغ نهایی:</span>
                    <span className="font-medium text-accent">
                      {formatTomanPersian(digipay.twelveMonth.total)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-1 text-[10px] leading-relaxed text-text-muted">
                خرید اقساطی دیجی‌پی بر اساس اعتبارسنجی کاربر انجام می‌شود. شرایط نهایی در مرحله پرداخت
                مشخص خواهد شد.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* ─── Footer CTA: Add to Cart with Installment Plan ─── */}
        {onAddToCart && (
          <DialogFooter className="mt-3">
            <motion.button
              type="button"
              onClick={handleAddToCartFromDialog}
              disabled={!inStock || isAddingToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300",
                inStock
                  ? "bg-accent text-white shadow-md hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent)]"
                  : "cursor-not-allowed bg-surface-secondary text-text-muted",
              )}
            >
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              {inStock ? "افزودن به سبد و خرید اقساطی" : "ناموجود"}
            </motion.button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
