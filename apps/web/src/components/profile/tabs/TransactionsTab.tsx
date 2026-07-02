import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { trpc } from "../../../lib/trpc";

const PAYMENT_METHOD_MAP: Record<string, string> = {
  zarinpal: "زرین‌پال",
  digipay_credit: "اعتباری دیجی‌پی",
  cash_on_delivery: "پرداخت در محل",
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: "موفق", bg: "bg-success-light", text: "text-success" },
  pending: { label: "در انتظار", bg: "bg-warning-light", text: "text-warning" },
  failed: { label: "ناموفق", bg: "bg-danger-light", text: "text-danger" },
  refunded: { label: "بازگشت وجه", bg: "bg-surface-secondary", text: "text-text-muted" },
};

/**
 * TransactionsTab — تراکنش‌ها و اقساط
 *
 * Displays payment records with installment calculations.
 * Installment amounts are calculated server-side using Math.ceil to 100,000 Tomans.
 * Color-coded status badges using semantic tokens.
 */
export function TransactionsTab() {
  const txQuery = trpc.profile.getTransactions.useQuery();
  const transactions = txQuery.data?.transactions ?? [];

  if (txQuery.isLoading) {
    return <TransactionsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      <h2 className="text-base font-bold text-text-primary">تراکنش‌ها و اقساط</h2>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-sm font-medium text-text-muted">
          هنوز تراکنشی ثبت نشده است
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Transaction Row ─── */

interface TransactionData {
  id: string;
  orderId: string;
  method: string;
  status: string;
  amount: string;
  installmentAmount: string;
  paymentRefId: string | null;
  paidAt: string | null;
  createdAt: string;
}

function TransactionRow({ tx }: { tx: TransactionData }) {
  const statusConfig = PAYMENT_STATUS_MAP[tx.status] ?? PAYMENT_STATUS_MAP.pending!;
  const methodLabel = PAYMENT_METHOD_MAP[tx.method] ?? tx.method;
  const amount = Number(tx.amount);
  const installment = Number(tx.installmentAmount);

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border-light bg-surface-secondary/30 p-4 transition-colors duration-300">
      {/* Top: method + status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <span className="text-xs font-medium text-text-secondary">{methodLabel}</span>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusConfig.bg} ${statusConfig.text}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Middle: amounts */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium text-text-muted">مبلغ کل</span>
          <span className="text-sm font-bold text-text-primary tabular-nums">
            {amount.toLocaleString("fa-IR")} تومان
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-medium text-text-muted">قسط ماهانه (۳ ماهه)</span>
          <span className="text-sm font-semibold text-accent tabular-nums">
            {installment.toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </div>

      {/* Bottom: ref + order link */}
      <div className="flex items-center justify-between border-t border-border-light pt-2">
        <span className="text-[10px] font-medium text-text-muted" dir="ltr">
          {tx.paymentRefId ? `Ref: ${tx.paymentRefId}` : "—"}
        </span>
        <span className="text-[10px] font-medium text-text-muted" dir="ltr">
          سفارش #{tx.orderId.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-32 animate-pulse rounded-lg bg-surface-secondary" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-secondary" />
      ))}
    </div>
  );
}
