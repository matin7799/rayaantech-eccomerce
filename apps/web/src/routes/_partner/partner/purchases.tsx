import { createFileRoute } from "@tanstack/react-router";
import { CalendarIcon, CreditCardIcon, ShoppingBagIcon } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { formatTomansPersian } from "../../../lib/persian-numerals";
import { trpc } from "../../../lib/trpc";

export const Route = createFileRoute("/_partner/partner/purchases")({
  component: PartnerPurchasesPage,
});

const ORDER_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار پرداخت", className: "bg-warning-light text-warning" },
  confirmed: { label: "تایید شده", className: "bg-success-light text-success" },
  processing: { label: "در حال پردازش", className: "bg-accent-light text-accent" },
  shipped: { label: "ارسال شده", className: "bg-success-light text-success" },
  delivered: { label: "تحویل شده", className: "bg-success-light text-success" },
  cancelled: { label: "لغو شده", className: "bg-danger-light text-danger" },
  returned: { label: "مرجوع شده", className: "bg-danger-light text-danger" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  zarinpal: "زرین‌پال",
  digipay_credit: "اعتباری دیجی‌پیک",
  cash_on_delivery: "پرداخت در محل",
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "پرداخت نشده", className: "bg-warning-light text-warning" },
  completed: { label: "موفق", className: "bg-success-light text-success" },
  failed: { label: "ناموفق", className: "bg-danger-light text-danger" },
  refunded: { label: "مرجوع شده", className: "bg-danger-light text-danger" },
};

function PartnerPurchasesPage() {
  const { data, isLoading } = trpc.partner.getPurchases.useQuery({
    limit: 50,
  });

  return (
    <div className="w-full flex flex-col gap-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">
          تاریخچه خریدهای همکار
        </h1>
        <p className="text-sm text-text-secondary">
          مشاهده و پیگیری سفارشات عمده و فاکتورهای B2B صادر شده.
        </p>
      </div>

      {/* Orders Table Container */}
      <Card className="border border-border bg-surface/60 backdrop-blur-md">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">سفارشات ثبت شده</CardTitle>
              <CardDescription className="text-xs">
                سفارشات جاری و تکمیل شده به همراه شماره فاکتور و وضعیت پرداخت.
              </CardDescription>
            </div>
            {!isLoading && data && (
              <Badge variant="secondary" className="text-xs">
                {data.total.toLocaleString("fa-IR")} سفارش یافت شد
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <span className="text-sm text-text-secondary animate-pulse">
                در حال بارگذاری لیست خریدها...
              </span>
            </div>
          ) : !data || data.purchases.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBagIcon className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-secondary">سفارشی یافت نشد.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-text-muted text-[12px] font-medium bg-surface-secondary/40">
                    <th className="p-4 text-right">شماره سفارش / فاکتور</th>
                    <th className="p-4 text-right">تاریخ ثبت</th>
                    <th className="p-4 text-right">تعداد کالا</th>
                    <th className="p-4 text-right">وضعیت فاکتور</th>
                    <th className="p-4 text-right">وضعیت پرداخت</th>
                    <th className="p-4 text-right">مبلغ کل (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.purchases.map((purchase) => {
                    const statusConfig = ORDER_STATUS_CONFIG[purchase.status] || {
                      label: purchase.status,
                      className: "bg-surface-secondary text-text-secondary",
                    };
                    const payStatusConfig = purchase.paymentStatus
                      ? PAYMENT_STATUS_CONFIG[purchase.paymentStatus] || {
                          label: purchase.paymentStatus,
                          className: "bg-surface-secondary text-text-secondary",
                        }
                      : { label: "نامشخص", className: "bg-surface-secondary text-text-secondary" };

                    const parsedAmount = parseInt(purchase.totalAmount, 10);

                    return (
                      <tr
                        key={purchase.id}
                        className="border-b border-border bg-surface transition-colors duration-150 last:border-b-0 hover:bg-surface-secondary/20 text-sm"
                      >
                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className="font-semibold text-text-primary select-all text-xs"
                              dir="ltr"
                            >
                              {purchase.id}
                            </span>
                            {purchase.paymentRefId && (
                              <span className="text-[10px] text-text-muted flex items-center gap-1">
                                <CreditCardIcon className="h-3 w-3" />
                                کد ارجاع: {purchase.paymentRefId}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-xs text-text-secondary">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5 text-text-muted" />
                            <span>{new Date(purchase.createdAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                        </td>
                        <td className="p-4 text-text-secondary font-medium">
                          {(purchase.items?.length ?? 0).toLocaleString("fa-IR")} کالا
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-medium ${statusConfig.className}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-medium ${payStatusConfig.className}`}
                            >
                              {payStatusConfig.label}
                            </span>
                            {purchase.paymentMethod && (
                              <span className="text-[10px] text-text-muted">
                                (
                                {PAYMENT_METHOD_LABELS[purchase.paymentMethod] ||
                                  purchase.paymentMethod}
                                )
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-text-primary">
                          {formatTomansPersian(parsedAmount)} تومان
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
