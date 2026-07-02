import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MinusIcon, PlusIcon, ShoppingCartIcon, Sparkles, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { formatRialsPersian } from "../lib/persian-numerals";
import { type CartItem, useCartStore } from "../lib/store";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

/**
 * /cart — Premium minimalist cart viewport.
 *
 * Apple-inspired glassmorphism with fine dividers, Yekan Bakh typography,
 * mobile-first single column → desktop asymmetrical 2/1 grid.
 * SSR hydration guard prevents TanStack Start empty pre-render mismatch.
 */
function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getDisplayTotal = useCartStore((s) => s.getDisplayTotal);
  const getInstallmentTotal = useCartStore((s) => s.getInstallmentTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const totalBaseline = getInstallmentTotal();
  const displayTotal = getDisplayTotal();
  const savings = totalBaseline - displayTotal;

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <CartShell />;
  }

  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-lg font-bold text-text-primary sm:mb-8 sm:text-xl"
      >
        سبد خرید
      </motion.h1>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Items Column — 2/3 */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[--glass-border] bg-surface-glass p-1 backdrop-blur-md shadow-glass">
              <AnimatePresence mode="popLayout">
                {items.map((item, idx) => (
                  <motion.div
                    key={item.variantId}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.92, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CartItemRow
                      item={item}
                      onRemove={() => removeItem(item.variantId)}
                      onQuantityChange={(q) => updateQuantity(item.variantId, q)}
                    />
                    {idx < items.length - 1 && <div className="mx-4 h-px bg-[--glass-border]" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary Column — 1/3 */}
          <motion.aside layout className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[--glass-border] bg-surface-glass/85 p-5 backdrop-blur-md shadow-glass sm:p-6 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

              <h2 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-1.5 pb-3 border-b border-[--glass-border]">
                <span className="w-1.5 h-3.5 rounded bg-accent" />
                خلاصه سفارش
              </h2>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">تعداد اقلام</span>
                  <span className="text-text-primary font-medium tabular-nums">
                    {getItemCount()} عدد
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">جمع کل اقلام</span>
                  <span className="text-text-primary font-medium tabular-nums">
                    {formatRialsPersian(totalBaseline)} تومان
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-success font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      سود شما از خرید
                    </span>
                    <span className="text-success font-bold tabular-nums">
                      {formatRialsPersian(savings)} - تومان
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-[--glass-border] flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">جمع سبد خرید</span>
                  <div className="flex flex-col items-end">
                    <span className="text-base font-black text-accent tabular-nums">
                      {formatRialsPersian(displayTotal)} تومان
                    </span>
                    {savings > 0 && (
                      <span className="text-[9px] text-success-text bg-success-light/30 px-1.5 py-0.5 rounded-sm font-medium mt-1">
                        تخفیف اعمال شده
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[10px] text-text-muted leading-relaxed">
                مبلغ نهایی سفارش پس از مشخص شدن روش ارسال و آدرس در مرحله پرداخت نهایی و تسویه
                می‌شود.
              </p>

              <Link to="/checkout" className="block mt-6">
                <Button className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-all duration-200">
                  تکمیل سفارش و پرداخت
                </Button>
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
}

/* ─── Cart Item Row ─── */

function CartItemRow({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (q: number) => void;
}) {
  const price = item.effectivePrice;

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4">
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to="/products/$slug"
          params={{ slug: item.slug }}
          className="text-sm font-medium text-text-primary hover:text-accent transition-colors line-clamp-2 no-underline"
        >
          {item.name}
        </Link>
        <p className="mt-1 text-[11px] text-text-muted">{item.sku}</p>
      </div>

      {/* Actions Row — wraps on mobile, inline on desktop */}
      <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-0.5 rounded-xl border border-[--glass-border] bg-surface px-1 py-0.5">
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-surface-secondary transition-colors"
            aria-label="کاهش"
          >
            <MinusIcon className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-semibold text-text-primary">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-surface-secondary transition-colors"
            aria-label="افزایش"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Price */}
        <span className="text-sm font-semibold text-text-primary tabular-nums whitespace-nowrap">
          {formatRialsPersian(price * item.quantity)}
        </span>

        {/* Remove */}
        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
          aria-label="حذف"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-5 py-24"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-secondary">
        <ShoppingCartIcon className="h-9 w-9 text-text-muted" />
      </div>
      <h2 className="text-base font-semibold text-text-primary">سبد خرید خالی است</h2>
      <p className="text-sm text-text-muted max-w-xs text-center">
        محصولات مورد نظر خود را از فروشگاه انتخاب کنید
      </p>
      <Link to="/products">
        <Button variant="outline" className="rounded-xl">
          مشاهده محصولات
        </Button>
      </Link>
    </motion.div>
  );
}

/* ─── SSR Shell ─── */

function CartShell() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <h1 className="mb-6 text-lg font-bold text-text-primary sm:mb-8 sm:text-xl">سبد خرید</h1>
      <div className="flex items-center justify-center py-24">
        <div className="h-20 w-20 rounded-3xl bg-surface-secondary animate-pulse" />
      </div>
    </div>
  );
}
