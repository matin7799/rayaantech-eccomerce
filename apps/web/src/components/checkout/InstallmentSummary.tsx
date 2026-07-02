import { formatTomansPersian, toPersianDigits } from "../../lib/persian-numerals";

interface InstallmentSummaryProps {
  downPayment: number;
  monthlyPayment: number;
  termMonths: number;
}

/**
 * InstallmentSummary — Minimalist finance ledger.
 * Shows: Down-Payment, Monthly Installment, Total Repayment.
 * All values in Toman with Persian digits.
 */
export function InstallmentSummary({
  downPayment,
  monthlyPayment,
  termMonths,
}: InstallmentSummaryProps) {
  const totalRepayment = downPayment + monthlyPayment * termMonths;

  return (
    <div className="rounded-xl border border-[--glass-border] bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">پیش‌پرداخت</span>
        <span className="text-sm font-bold text-text-primary tabular-nums">
          {formatTomansPersian(downPayment)} تومان
        </span>
      </div>
      <div className="h-px bg-[--glass-border]" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">
          مبلغ هر قسط ({toPersianDigits(String(termMonths))} ماهه)
        </span>
        <span className="text-sm font-bold text-accent tabular-nums">
          {formatTomansPersian(monthlyPayment)} تومان
        </span>
      </div>
      <div className="h-px bg-[--glass-border]" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">کل بازپرداخت</span>
        <span className="text-xs font-semibold text-text-secondary tabular-nums">
          {formatTomansPersian(totalRepayment)} تومان
        </span>
      </div>
    </div>
  );
}
