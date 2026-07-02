import type { InstallmentEvaluationResult } from "@rayan-tech/types";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Calculator, CreditCard } from "lucide-react";
import { useCallback, useState } from "react";
import { formatRialsPersian } from "../../lib/persian-numerals";
import { trpc } from "../../lib/trpc";
import { cn } from "../../lib/utils";
import { PriceInput } from "../ui/PriceInput";
import { InstallmentSummaryCard } from "./InstallmentSummaryCard";

/**
 * Props for InstallmentCalculatorPanel.
 */
interface InstallmentCalculatorPanelProps {
  /** Cart items for evaluation */
  items: Array<{
    productId: string;
    categoryId: string;
    basePrice: string;
    quantity: number;
    name: string;
  }>;
  /** Available term options */
  termOptions?: number[];
}

const PANEL_SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

/**
 * InstallmentCalculatorPanel — Interactive installment evaluation UI.
 *
 * Features:
 * - Term selection (3/6/12 months)
 * - Per-item custom downpayment override via PriceInput
 * - Live tRPC mutation to evaluate installment pricing
 * - Glassmorphism result cards with alarm states
 * - Neon-red border when downpayment < minimum constraint
 * - Guarantor/ceiling warning banners
 */
export function InstallmentCalculatorPanel({
  items,
  termOptions = [3, 6, 12],
}: InstallmentCalculatorPanelProps) {
  const [selectedTerm, setSelectedTerm] = useState(termOptions[0] ?? 3);
  const [downpayments, setDownpayments] = useState<Record<string, number>>({});
  const [result, setResult] = useState<InstallmentEvaluationResult | null>(null);

  const evaluateMutation = trpc.installments.evaluate.useMutation({
    onSuccess: (data) => setResult(data),
  });

  const handleEvaluate = useCallback(() => {
    evaluateMutation.mutate({
      termMonths: selectedTerm,
      items: items.map((item) => ({
        productId: item.productId,
        categoryId: item.categoryId,
        basePrice: item.basePrice,
        quantity: item.quantity,
        customDownpayment: downpayments[item.productId]
          ? String(downpayments[item.productId])
          : undefined,
      })),
    });
  }, [evaluateMutation, selectedTerm, items, downpayments]);

  const handleDownpaymentChange = useCallback((productId: string, value: number) => {
    setDownpayments((prev) => ({ ...prev, [productId]: value }));
  }, []);

  const hasAlarm = result?.exceedsHardCeiling === true;
  const hasWarning = result?.requiresGuarantorCheck === true;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300",
        hasAlarm
          ? "border-danger/50 bg-danger/2 shadow-[0_0_32px_rgba(239,68,68,0.15)]"
          : "border-border-light bg-surface-glass shadow-glass",
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <CreditCard className="h-4 w-4 text-accent" aria-hidden="true" />
        </span>
        <h3 className="text-sm font-semibold text-text-primary">محاسبه‌گر اقساط</h3>
      </div>

      {/* Term Selector */}
      <div className="mb-4 flex items-center gap-2">
        {termOptions.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => setSelectedTerm(term)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
              selectedTerm === term
                ? "bg-accent text-white shadow-sm"
                : "border border-border-light bg-surface text-text-secondary hover:border-accent/50",
            )}
          >
            {term} ماهه
          </button>
        ))}
      </div>

      {/* Per-item downpayment inputs */}
      <div className="mb-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-text-secondary truncate">{item.name}</span>
            <PriceInput
              value={downpayments[item.productId] ?? 0}
              onChange={(v) => handleDownpaymentChange(item.productId, v)}
              placeholder="پیش‌پرداخت دلخواه"
              suffix="تومان"
              error={
                result?.items.find((r) => r.productId === item.productId)?.downpayment !==
                  undefined &&
                (downpayments[item.productId] ?? 0) > 0 &&
                (downpayments[item.productId] ?? 0) <
                  (result?.items.find((r) => r.productId === item.productId)?.downpayment ?? 0)
                  ? "پیش‌پرداخت کمتر از حداقل مجاز است"
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* Evaluate button */}
      <button
        type="button"
        onClick={handleEvaluate}
        disabled={evaluateMutation.isPending}
        className={cn(
          "mb-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200",
          "bg-accent text-white hover:bg-accent/90 disabled:opacity-50",
        )}
      >
        <Calculator className="h-4 w-4" aria-hidden="true" />
        {evaluateMutation.isPending ? "در حال محاسبه..." : "محاسبه اقساط"}
      </button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={PANEL_SPRING}
            className="flex flex-col gap-3"
          >
            {/* Warning banners */}
            {hasAlarm && (
              <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
                <p className="text-xs font-medium text-danger">
                  مبلغ تسهیلات از سقف مجاز ({formatRialsPersian(result.hardCeiling)} تومان) بیشتر
                  است. لطفاً پیش‌پرداخت را افزایش دهید.
                </p>
              </div>
            )}
            {hasWarning && !hasAlarm && (
              <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                <p className="text-xs font-medium text-warning-light">
                  مبلغ تسهیلات بالاتر از {formatRialsPersian(result.guarantorThreshold)} تومان است —
                  نیاز به ضامن دارد.
                </p>
              </div>
            )}

            {/* Summary cards grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <InstallmentSummaryCard
                label="پیش‌پرداخت کل"
                value={result.totalDownpayment}
                highlight
              />
              <InstallmentSummaryCard
                label="مبلغ تسهیلات"
                value={result.totalFacility}
                alarm={hasAlarm}
              />
              <InstallmentSummaryCard label="قسط ماهیانه" value={result.totalMonthly} highlight />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
