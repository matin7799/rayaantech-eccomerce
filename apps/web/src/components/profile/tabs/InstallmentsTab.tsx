import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  PackageIcon,
} from "lucide-react";
import { useState } from "react";
import { formatTomansPersian } from "../../../lib/persian-numerals";
import { trpc } from "../../../lib/trpc";
import { InstallmentInstructionCard } from "../../payment/InstallmentInstructionCard";
import { Skeleton } from "../../ui/skeleton";

/* ─── Status mapping ─── */

const INSTALLMENT_STATUS_MAP: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof ClockIcon }
> = {
  awaiting_cheques: {
    label: "در انتظار چک",
    bg: "bg-warning-light",
    text: "text-warning",
    icon: ClockIcon,
  },
  cheques_submitted: {
    label: "چک‌ها ثبت شده",
    bg: "bg-accent-light",
    text: "text-accent",
    icon: CalendarClockIcon,
  },
  cheques_received: {
    label: "چک‌ها دریافت شده",
    bg: "bg-accent-light",
    text: "text-accent",
    icon: CheckCircleIcon,
  },
  cheques_verified: {
    label: "تأیید شده",
    bg: "bg-success-light",
    text: "text-success",
    icon: CheckCircleIcon,
  },
  product_shipped: {
    label: "ارسال شده",
    bg: "bg-success-light",
    text: "text-success",
    icon: PackageIcon,
  },
  completed: {
    label: "تکمیل شده",
    bg: "bg-success-light",
    text: "text-success",
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: "لغو شده",
    bg: "bg-danger-light",
    text: "text-danger",
    icon: ClockIcon,
  },
};

/**
 * InstallmentsTab — اقساط من
 *
 * Displays user's installment orders with:
 * - Status lifecycle badge
 * - Financial breakdown (down payment, monthly, tenure)
 * - Expandable detail showing InstallmentInstructionCard with per-order metadata
 * - Cheque submission status
 *
 * Data source: trpc.profile.getInstallments
 */
export function InstallmentsTab() {
  const installmentsQuery = trpc.profile.getInstallments.useQuery();
  const installments = installmentsQuery.data?.installments ?? [];

  if (installmentsQuery.isLoading) {
    return <InstallmentsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      <h2 className="text-base font-bold text-text-primary">اقساط من</h2>

      {installments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {installments.map((item) => (
            <InstallmentRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Installment Row ─── */

interface InstallmentData {
  id: string;
  orderId: string;
  installmentStatus: string;
  tenureMonths: number;
  downPaymentAmount: string;
  monthlyAmount: string;
  totalAmount: string;
  durationDays: number;
  receiverName: string;
  receiverNationalId: string;
  branchName: string;
  branchAddress: string;
  branchPostalCode: string;
  branchHours: string;
  supportPhone: string;
  createdAt: string;
}

function InstallmentRow({ item }: { item: InstallmentData }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig =
    INSTALLMENT_STATUS_MAP[item.installmentStatus] ?? INSTALLMENT_STATUS_MAP.awaiting_cheques;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="rounded-xl border border-border-light bg-surface overflow-hidden transition-shadow hover:shadow-sm">
      {/* Summary Row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-start"
      >
        {/* Status icon */}
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${statusConfig.bg}`}
        >
          <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
        </span>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-primary truncate">
              سفارش #{item.orderId.slice(0, 8)}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span>{item.tenureMonths} ماهه</span>
            <span className="text-border">|</span>
            <span>ماهانه {formatTomansPersian(parseInt(item.monthlyAmount, 10))}</span>
          </div>
        </div>

        {/* Total + Expand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-text-primary tabular-nums">
            {formatTomansPersian(parseInt(item.totalAmount, 10))}
          </span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDownIcon className="h-4 w-4 text-text-muted" />
          </motion.span>
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-light px-4 pb-4 pt-3 space-y-4">
              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <FinanceCell
                  label="مبلغ کل"
                  value={formatTomansPersian(parseInt(item.totalAmount, 10))}
                />
                <FinanceCell
                  label="پیش‌پرداخت"
                  value={formatTomansPersian(parseInt(item.downPaymentAmount, 10))}
                />
                <FinanceCell
                  label="قسط ماهانه"
                  value={formatTomansPersian(parseInt(item.monthlyAmount, 10))}
                />
                <FinanceCell label="مدت" value={`${item.tenureMonths} ماه`} />
              </div>

              {/* Instruction Card with per-order metadata */}
              <InstallmentInstructionCard
                metadata={{
                  receiverName: item.receiverName,
                  receiverNationalId: item.receiverNationalId,
                  branchName: item.branchName,
                  branchAddress: item.branchAddress,
                  branchPostalCode: item.branchPostalCode,
                  branchHours: item.branchHours,
                  supportPhone: item.supportPhone,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ─── */

function FinanceCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-light bg-surface-secondary/50 p-2.5">
      <span className="block text-[10px] text-text-muted">{label}</span>
      <span className="block text-xs font-semibold text-text-primary mt-0.5 tabular-nums">
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary">
        <CalendarClockIcon className="h-6 w-6 text-text-muted" />
      </span>
      <p className="text-sm font-medium text-text-muted">هنوز خرید اقساطی نداشته‌اید</p>
      <p className="text-xs text-text-muted max-w-xs text-center leading-relaxed">
        پس از تکمیل یک سفارش اقساطی از صفحه تسویه‌حساب، جزئیات اقساط و راهنمای ارسال چک‌ها در اینجا
        نمایش داده خواهد شد.
      </p>
    </div>
  );
}

function InstallmentsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-24" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}
