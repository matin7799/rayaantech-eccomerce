import { LoaderIcon, ShieldCheckIcon, Sparkles } from "lucide-react";
import { formatTomansPersian } from "../../lib/persian-numerals";
import { Button } from "../ui/button";

interface CheckoutSummaryProps {
  items: Array<{
    variantId: string;
    name: string;
    quantity: number;
    effectivePrice: number;
    installmentBasePrice?: number;
  }>;
  paymentMethod: string;
  displayTotal: number;
  handleSubmit: () => void;
  isSubmitting: boolean;
  hasSelectedAddress: boolean;
  hasSelectedShipping: boolean;
}

export function CheckoutSummary({
  items,
  paymentMethod,
  displayTotal,
  handleSubmit,
  isSubmitting,
  hasSelectedAddress,
  hasSelectedShipping,
}: CheckoutSummaryProps) {
  // Calculate pricing metrics
  const totalBaseline = items.reduce(
    (sum, item) => sum + (item.installmentBasePrice || item.effectivePrice) * item.quantity,
    0,
  );
  const savings = totalBaseline - displayTotal;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start w-full">
      <div className="rounded-2xl border border-[--glass-border] bg-surface-glass/80 p-6 backdrop-blur-xl shadow-glass relative overflow-hidden">
        {/* Decorative subtle gradient background glow */}
        <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

        <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-1.5 pb-3 border-b border-[--glass-border]">
          <span className="w-1.5 h-3.5 rounded bg-accent" />
          خلاصه سفارش
        </h2>

        {/* Items List */}
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {items.map((item) => {
            const hasDiscount =
              item.installmentBasePrice && item.installmentBasePrice > item.effectivePrice;
            return (
              <div key={item.variantId} className="flex justify-between items-start text-xs gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-text-primary font-medium line-clamp-1">{item.name}</span>
                  <span className="text-[10px] text-text-muted mt-0.5">
                    تعداد: {item.quantity} عدد
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-text-primary font-semibold tabular-nums">
                    {formatTomansPersian(item.effectivePrice * item.quantity)}
                  </span>
                  {hasDiscount && item.installmentBasePrice && (
                    <span className="text-[9px] text-text-muted line-through tabular-nums">
                      {formatTomansPersian(item.installmentBasePrice * item.quantity)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-4 h-px bg-[--glass-border]" />

        {/* Pricing Summary Block */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">جمع کل اقلام</span>
            <span className="text-text-primary font-medium tabular-nums">
              {formatTomansPersian(totalBaseline)} تومان
            </span>
          </div>

          {savings > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-success font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                سود شما از خرید
              </span>
              <span className="text-success font-bold tabular-nums">
                {formatTomansPersian(savings)} - تومان
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">هزینه ارسال</span>
            <span className="text-text-muted text-[10px]">محاسبه در مرحله بعد</span>
          </div>

          <div className="pt-3 border-t border-[--glass-border] flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary">مبلغ قابل پرداخت</span>
            <div className="flex flex-col items-end">
              <span className="text-base font-black text-accent tabular-nums">
                {formatTomansPersian(displayTotal)} تومان
              </span>
              {savings > 0 && (
                <span className="text-[9px] text-success-text bg-success-light px-1.5 py-0.5 rounded-sm font-medium mt-1">
                  سود اعمال شده
                </span>
              )}
            </div>
          </div>
        </div>

        {paymentMethod === "rayantech_installment" && (
          <div className="mt-5 rounded-xl border border-accent/15 bg-accent/5 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-accent">روش اقساطی فعال</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              پرداخت در قالب پیش‌پرداخت + اقساط ماهانه است. جزئیات دقیق و زمان‌بندی بازپرداخت را در
              بخش کنفیگوراتور زیر مشخص کنید.
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-text-muted">
          <ShieldCheckIcon className="h-3.5 w-3.5 text-success" />
          <span>ضمانت اصالت و پرداخت امن سرور</span>
        </div>

        {paymentMethod !== "rayantech_installment" && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !hasSelectedAddress || !hasSelectedShipping}
            className="mt-5 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 disabled:opacity-50 transition-all duration-200"
          >
            {isSubmitting ? (
              <LoaderIcon className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "پرداخت و ثبت نهایی سفارش"
            )}
          </Button>
        )}
      </div>
    </aside>
  );
}
