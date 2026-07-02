"use client";

import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Loader2, Package, ShoppingBag, Sliders, X } from "lucide-react";

// استفاده رسمی و اجباری از پکیج اسکرول‌آریای اختصاصی پروژه شما
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRialsPersian } from "../../../lib/persian-numerals";
import { useCartStore } from "../../../lib/store";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";

interface QuickViewProps {
  slug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GRADE_LABELS: Record<string, string> = {
  open_box: "اوپن‌باکس",
  stock: "استوک شرکتی",
  refurbished: "ریفربیشد",
  like_new: "در حد نو",
  used: "کارکرده",
};

const PANEL_SPRING = { type: "spring" as const, stiffness: 320, damping: 26 };

/**
 * Filter product attributes for QuickView display using the backend-provided
 * quickviewSlugs array from category_attribute_keys bindings.
 *
 * Strategy:
 * 1. If quickviewSlugs is provided and non-empty, filter attributes
 *    where attr.slug is in the quickviewSlugs list (preserves order from DB)
 * 2. If no quickviewSlugs or no matches, fallback to first 4 attributes
 *
 * This is purely client-side filtering — no extra API calls needed.
 */
function filterQuickViewSpecs(
  attributes: Array<{ key: string; slug: string | null; values: string[] }>,
  quickviewSlugs: string[],
): Array<{ key: string; slug: string | null; values: string[] }> {
  if (quickviewSlugs.length > 0) {
    const matched = quickviewSlugs
      .map((slug) => attributes.find((attr) => attr.slug === slug))
      .filter(Boolean) as Array<{ key: string; slug: string | null; values: string[] }>;

    if (matched.length >= 3) {
      return matched.slice(0, 5);
    }

    // Supplement with remaining if too few matches
    const slugSet = new Set(quickviewSlugs);
    const remaining = attributes.filter((a) => !(a.slug && slugSet.has(a.slug)));
    return [...matched, ...remaining].slice(0, 5);
  }

  // Fallback: first 4 attributes (generic categories without bindings)
  return attributes.slice(0, 4);
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: pre-existing complexity in QuickView
export function QuickView({ slug, open, onOpenChange }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = trpc.products.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: open && !!slug, staleTime: 30_000 },
  );

  const product = data?.product;
  const hasStock = product ? product.stock > 0 : false;

  const handleAddToCart = () => {
    if (!(product && hasStock)) return;
    addItem({
      variantId: product.variants[0]?.id ?? product.id,
      productId: product.id,
      categoryId: product.categoryId,
      name: product.name,
      slug: product.slug,
      sku: product.variants[0]?.sku ?? product.slug,
      effectivePrice: product.effectivePrice,
      installmentBasePrice: product.installmentBasePrice,
      pricingTier: product.pricingTier,
      stock: product.stock,
      selectedAddons: [],
    });
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm dark:bg-black/70"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          {/* Modal Overlay Center Wrapper */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={PANEL_SPRING}
              className="relative w-full max-w-[1100px] h-[85vh] max-h-[85vh] rounded-2xl border border-[--glass-border] bg-surface shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 left-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/80 text-text-muted transition-colors hover:text-text-primary border border-[--glass-border] backdrop-blur-md"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-1 items-center justify-center bg-surface">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-accent" />
                    <span className="text-xs text-text-muted font-medium">
                      در حال بارگذاری اطلاعات محصول...
                    </span>
                  </div>
                </div>
              )}

              {/* Ready Layout Context */}
              {!isLoading && product && (
                <div className="flex flex-col md:grid md:grid-cols-5 w-full h-full min-h-0 flex-1">
                  {/* بخش راست: تصویر کالا (در دسکتاپ ثابت، در موبایل هماهنگ با فلکس) */}
                  <div className="flex items-center justify-center bg-surface-secondary/40 p-6 md:col-span-3 md:p-10 border-b md:border-b-0 md:border-l border-[--glass-border] shrink-0 md:h-full">
                    {product.gallery.length > 0 ? (
                      <img
                        src={product.gallery[0].webpUrl ?? product.gallery[0].url}
                        alt={product.name}
                        className="max-h-[220px] md:max-h-[460px] w-full object-contain drop-shadow-sm select-none"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-6">
                        <Package className="h-14 w-14 text-text-muted/20" aria-hidden="true" />
                        <span className="text-[11px] text-text-muted font-medium">
                          تصویری یافت نشد
                        </span>
                      </div>
                    )}
                  </div>

                  {/* بخش چپ: محتوای متنی غوطه‌ور در تک‌کانتینر ScrollArea از پکیج شادسی‌ان */}
                  <div className="flex flex-col md:col-span-2 bg-surface min-h-0 flex-1 md:h-full">
                    <ScrollArea className="h-full w-full" dir="rtl">
                      <div className="flex flex-col gap-5 p-5 md:p-6 pb-24 md:pb-6">
                        <div className="flex flex-col gap-4">
                          {/* هدر جزئیات */}
                          <div className="flex flex-col gap-2">
                            <span className="w-fit rounded-md bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                              {GRADE_LABELS[product.grade] ?? product.grade}
                            </span>
                            <h2 className="text-base font-bold text-text-primary leading-relaxed md:text-lg">
                              {product.name}
                            </h2>
                            {product.sku && (
                              <span className="font-mono text-xs text-text-muted select-all">
                                کد کالا (SKU): {product.sku}
                              </span>
                            )}
                          </div>

                          {/* توضیحات کاتالوگ */}
                          {product.short_description && (
                            <p className="text-xs leading-relaxed text-text-secondary whitespace-pre-line">
                              {product.short_description}
                            </p>
                          )}

                          {/* خلاصه مشخصات اختصاصی بر اساس دسته‌بندی */}
                          {product.attributes.length > 0 && (
                            <div className="flex flex-col gap-2.5 mt-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-primary">
                                <Sliders className="h-3.5 w-3.5 text-accent" />
                                <span>خلاصه مشخصات فنی</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {filterQuickViewSpecs(
                                  product.attributes,
                                  product.quickviewSlugs ?? [],
                                ).map((attr) => (
                                  <div
                                    key={attr.key}
                                    className="rounded-lg border border-[--glass-border] bg-surface-secondary/50 px-3 py-2 flex items-baseline justify-between gap-2"
                                  >
                                    <span className="shrink-0 text-[10px] text-text-secondary font-medium">
                                      {attr.key}
                                    </span>
                                    <p className="text-[11px] font-semibold text-text-primary truncate text-start">
                                      {attr.values.slice(0, 2).join(" | ")}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* جعبه مالی چسبنده نهایی پلتفرم */}
                        <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-[--glass-border]">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col items-start gap-1">
                              {product.displayBaseline !== null &&
                                product.displayBaseline > product.effectivePrice && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-text-muted line-through">
                                      {formatRialsPersian(product.displayBaseline)}
                                    </span>
                                    {product.discountPercent && (
                                      <span className="rounded bg-[--color-discount-surface] px-1 py-0.5 text-[8px] font-bold text-[--color-discount-text]">
                                        {product.discountPercent}٪-
                                      </span>
                                    )}
                                  </div>
                                )}
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-text-primary md:text-2xl">
                                  {formatRialsPersian(product.effectivePrice)}
                                </span>
                                <span className="text-xs text-text-muted font-medium">تومان</span>
                              </div>
                            </div>

                            {!hasStock && (
                              <span className="rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger">
                                ناموجود
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2 w-full mt-1">
                            <motion.button
                              type="button"
                              onClick={handleAddToCart}
                              disabled={!hasStock}
                              whileHover={hasStock ? { scale: 1.01 } : {}}
                              whileTap={hasStock ? { scale: 0.99 } : {}}
                              className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all duration-300",
                                hasStock
                                  ? "bg-accent text-white shadow-md hover:bg-accent/90"
                                  : "cursor-not-allowed bg-surface-secondary text-text-muted border border-[--glass-border]",
                              )}
                            >
                              <ShoppingBag className="h-4 w-4" />
                              {hasStock ? "افزودن به سبد خرید" : "ناموجود"}
                            </motion.button>

                            <Link
                              to="/products/$slug"
                              params={{ slug: product.slug }}
                              onClick={() => onOpenChange(false)}
                              className="flex items-center justify-center gap-1.5 rounded-xl border border-[--glass-border] bg-surface-secondary/40 px-4 py-3 text-xs font-bold text-text-secondary no-underline transition-colors hover:bg-surface-secondary hover:text-accent"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>جزئیات</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {/* Not Found */}
              {!(isLoading || product) && (
                <div className="flex flex-1 items-center justify-center bg-surface">
                  <p className="text-xs font-medium text-text-muted">محصول مورد نظر یافت نشد.</p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
