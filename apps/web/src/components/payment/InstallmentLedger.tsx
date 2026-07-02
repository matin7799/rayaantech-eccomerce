import { motion } from "framer-motion";
import {
  CalendarClockIcon,
  FileTextIcon,
  HashIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldAlertIcon,
  UserIcon,
} from "lucide-react";
import { formatTomansPersian, toPersianDigits } from "../../lib/persian-numerals";
import { trpc } from "../../lib/trpc";
import { Skeleton } from "../ui/skeleton";

interface Props {
  orderId: string;
}

/**
 * Convert Gregorian date to Jalali (Solar Hijri).
 * Pure algorithm — no external dependency.
 */
function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

/**
 * Format an ISO date string to Persian Solar Hijri (Jalali).
 * Output example: "۱۴۰۵/۰۴/۰۸"
 */
function toJalaliString(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const formatted = `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
    return toPersianDigits(formatted);
  } catch {
    return "—";
  }
}

/**
 * InstallmentLedger — Luxury glassmorphic installment schedule disclosure.
 *
 * Fetches the full installment schedule from the server (order.getInstallmentSchedule)
 * and renders:
 * 1. Financial summary strip (total, down-payment, financed, monthly)
 * 2. Check schedule table with Jalali dates
 * 3. Guarantee check disclosure (if required)
 * 4. Recipient/branch details card
 *
 * ALL data is server-derived. No client-side computation of financial values.
 */
export function InstallmentLedger({ orderId }: Props) {
  const scheduleQuery = trpc.order.getInstallmentSchedule.useQuery(
    { orderId },
    { enabled: Boolean(orderId) },
  );

  if (scheduleQuery.isLoading) {
    return <LedgerSkeleton />;
  }

  if (scheduleQuery.error || !scheduleQuery.data) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger-light/50 p-5 text-center">
        <p className="text-xs font-medium text-danger">
          [order/installment-callback] خطا در بارگذاری جزئیات اقساط
        </p>
        <p className="mt-1 text-[10px] text-text-muted">
          {scheduleQuery.error?.message ?? "داده‌ای دریافت نشد"}
        </p>
      </div>
    );
  }

  const data = scheduleQuery.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {/* Financial Summary Strip */}
      <div className="rounded-2xl border border-[--glass-border] bg-surface-glass p-5 backdrop-blur-xl shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <CalendarClockIcon className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">خلاصه مالی اقساط</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FinanceCell
            label="مبلغ کل سفارش"
            value={formatTomansPersian(data.totalAmount)}
            unit="تومان"
          />
          <FinanceCell
            label="پیش‌پرداخت"
            value={formatTomansPersian(data.downPayment)}
            unit="تومان"
            highlight
          />
          <FinanceCell
            label="مبلغ تسهیلات"
            value={formatTomansPersian(data.financedAmount)}
            unit="تومان"
          />
          <FinanceCell
            label="قسط ماهانه"
            value={formatTomansPersian(data.monthlyAmount)}
            unit="تومان"
            highlight
          />
        </div>

        <div className="mt-3 flex items-center gap-4 text-[10px] text-text-muted">
          <span>مدت: {toPersianDigits(String(data.tenureMonths))} ماه</span>
          <span className="text-border">|</span>
          <span>شروع بازپرداخت: {toPersianDigits(String(data.durationDays))} روز آینده</span>
        </div>
      </div>

      {/* Check Schedule Table */}
      <div className="rounded-2xl border border-[--glass-border] bg-surface-glass p-5 backdrop-blur-xl shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <FileTextIcon className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">جدول چک‌های اقساطی</h3>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_1fr] gap-3 border-b border-border-light pb-2 mb-2">
          <span className="text-[10px] font-medium text-text-muted w-8 text-center">ردیف</span>
          <span className="text-[10px] font-medium text-text-muted">مبلغ چک</span>
          <span className="text-[10px] font-medium text-text-muted">تاریخ سررسید</span>
        </div>

        {/* Check Rows */}
        <div className="space-y-1.5">
          {data.checks.map((check) => (
            <div
              key={check.index}
              className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center rounded-lg px-1 py-2 hover:bg-surface-secondary/50 transition-colors"
            >
              <span className="w-8 text-center">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-surface-secondary text-[10px] font-semibold text-text-secondary">
                  {toPersianDigits(String(check.index))}
                </span>
              </span>
              <span className="text-xs font-semibold text-text-primary tabular-nums">
                {formatTomansPersian(check.amount)}{" "}
                <span className="text-[10px] font-normal text-text-muted">تومان</span>
              </span>
              <span className="text-xs font-medium text-text-secondary tabular-nums" dir="ltr">
                {toJalaliString(check.dateISO)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee Check Disclosure */}
      {data.requiresGuaranteeCheck && data.guaranteeCheck && (
        <div className="rounded-2xl border border-warning/30 bg-warning-light/30 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-warning">چک ضمانت (الزامی)</h3>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InfoCell
                label="مبلغ چک ضمانت"
                value={`${formatTomansPersian(data.guaranteeCheck.amount)} تومان`}
              />
              <InfoCell
                label="تاریخ چک ضمانت"
                value={toJalaliString(data.guaranteeCheck.dateISO)}
              />
            </div>

            <div className="rounded-lg border border-warning/20 bg-surface/50 p-3">
              <p className="text-[11px] leading-relaxed text-text-secondary">
                چک ضمانت باید صادرشده توسط <strong className="text-text-primary">شخص ثالث</strong>{" "}
                (غیر از خریدار) باشد. مبلغ و تاریخ آن دقیقاً مطابق اطلاعات فوق و به نام گیرنده ذکرشده
                در بخش زیر تنظیم شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recipient Details */}
      <div className="rounded-2xl border border-[--glass-border] bg-surface-glass p-5 backdrop-blur-xl shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">اطلاعات گیرنده چک</h3>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <InfoCell
              icon={<UserIcon className="h-3.5 w-3.5" />}
              label="نام گیرنده"
              value={data.recipient.name}
            />
            <InfoCell
              icon={<HashIcon className="h-3.5 w-3.5" />}
              label="کد ملی"
              value={data.recipient.nationalId}
              dir="ltr"
            />
          </div>

          <InfoCell
            icon={<MapPinIcon className="h-3.5 w-3.5" />}
            label={data.recipient.branchName}
            value={data.recipient.branchAddress}
          />

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <InfoCell label="کد پستی شعبه" value={data.recipient.branchPostalCode} dir="ltr" />
            <InfoCell label="ساعت کاری" value={data.recipient.branchHours} dir="ltr" />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-surface-action p-3">
            <PhoneIcon className="h-4 w-4 text-accent" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted">پشتیبانی اختصاصی اقساط</span>
              <span dir="ltr" className="text-sm font-semibold text-accent tabular-nums">
                {data.recipient.supportPhone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Sub-components ─── */

function FinanceCell({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${highlight ? "border-accent/20 bg-surface-action" : "border-border-light bg-surface-secondary/50"}`}
    >
      <span className="block text-[10px] text-text-muted">{label}</span>
      <span
        className={`block text-xs mt-0.5 tabular-nums ${highlight ? "font-bold text-accent" : "font-semibold text-text-primary"}`}
      >
        {value} {unit && <span className="text-[10px] font-normal text-text-muted">{unit}</span>}
      </span>
    </div>
  );
}

function InfoCell({
  icon,
  label,
  value,
  dir,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border-light bg-surface p-2.5">
      {icon && <span className="mt-0.5 text-accent">{icon}</span>}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-text-muted">{label}</span>
        <span dir={dir} className="text-xs font-medium text-text-primary leading-relaxed">
          {value}
        </span>
      </div>
    </div>
  );
}

function LedgerSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}
