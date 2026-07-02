import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import type { OrderRow } from "./OrdersColumns";

export function InstallmentCollapsible({ order }: { order: OrderRow }) {
  if (!order) return null;

  // Installment data from order or database
  const details = order.installmentDetails;
  const termMonths = details ? details.tenureMonths : 3;
  const totalAmount = details ? details.totalAmount : (order.totalAmount ?? 0);
  const monthlyAmount = details
    ? details.monthlyAmount
    : Math.round((totalAmount * 0.6) / termMonths);
  const downpayment = details ? details.downPaymentAmount : Math.round(totalAmount * 0.4);
  const remaining = details
    ? details.monthlyAmount * details.tenureMonths
    : monthlyAmount * termMonths;

  return (
    <Collapsible defaultOpen={false} className="rounded-xl border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-start transition-colors hover:bg-surface-secondary/30">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-text-primary">
            سفارش #{order.id} — {order.customerName ?? "نامشخص"}
          </span>
          <span className="text-xs font-normal text-text-muted">
            {termMonths} قسط ماهانه • پیش‌پرداخت {downpayment.toLocaleString("fa-IR")} ت
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">0/{termMonths}</span>
          <ChevronDownIcon className="h-4 w-4 text-text-muted transition-transform duration-200 in-data-open:rotate-180" />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-t border-border px-4 py-3">
          {/* Summary — font-weight 600 */}
          <div className="mb-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-normal text-text-muted">مبلغ کل</span>
              <span className="text-sm font-semibold text-text-primary">
                {totalAmount.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-normal text-text-muted">پیش‌پرداخت</span>
              <span className="text-sm font-medium text-text-secondary">
                {downpayment.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-normal text-text-muted">هر قسط</span>
              <span className="text-sm font-medium text-text-secondary">
                {monthlyAmount.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-normal text-text-muted">باقیمانده</span>
              <span className="text-sm font-semibold text-text-primary">
                {remaining.toLocaleString("fa-IR")}
              </span>
            </div>
          </div>

          {/* Installment rows */}
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-4 gap-2 border-b border-border bg-surface-secondary/30 px-4 py-2">
              {["قسط", "مبلغ (تومان)", "سررسید", "وضعیت"].map((h) => (
                <span key={h} className="text-[12px] font-medium uppercase text-text-secondary">
                  {h}
                </span>
              ))}
            </div>
            {Array.from({ length: termMonths }).map((_, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 items-center gap-2 border-b border-border bg-surface px-4 py-2.5 last:border-b-0"
              >
                <span className="text-xs font-medium text-text-primary">
                  قسط {(idx + 1).toLocaleString("fa-IR")}
                </span>
                <span className="text-xs font-medium text-text-primary">
                  {monthlyAmount.toLocaleString("fa-IR")}
                </span>
                <span className="flex items-center gap-1 text-xs font-normal text-text-muted">
                  <CalendarIcon className="h-3 w-3" />
                  ۱۴۰۳/۰{idx + 4}/۱۵
                </span>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-text-muted" />
                  <span className="text-[11px] font-normal text-text-muted">آینده</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
