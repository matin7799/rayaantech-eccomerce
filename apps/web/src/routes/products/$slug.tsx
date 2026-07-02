import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarCheck,
  CreditCard,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AttributeTable } from "../../components/storefront/product/detail/AttributeTable";
import { InstallmentComparisonDialog } from "../../components/storefront/product/detail/InstallmentComparisonDialog";
import { MediaGallery } from "../../components/storefront/product/detail/MediaGallery";
import { ProductAddonSelector } from "../../components/storefront/product/ProductAddonSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useTorobCountdown } from "../../lib/hooks/use-torob-countdown";
import { formatRialsPersian } from "../../lib/persian-numerals";
import { useAIConsultantStore, useCartStore, useProductStore } from "../../lib/store";
import { trpc } from "../../lib/trpc";
import { cn } from "../../lib/utils";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailPage,
});

const GRADE_LABELS: Record<string, string> = {
  open_box: "اوپن‌باکس",
  stock: "استوک شرکتی",
  refurbished: "ریفربیشد",
  like_new: "در حد نو",
  used: "کارکرده",
};

type ProductType =
  | "laptop"
  | "mobile"
  | "console"
  | "printer"
  | "case"
  | "monitor"
  | "all-in-one"
  | "generic";

/**
 * تشخیص هوشمند نوع محصول بر اساس اسلاگ یا شناسه کاتالوگ جهت دسته‌بندی مشخصات فنی
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: pre-existing complexity
function detectProductType(slug?: string, categoryId?: string): ProductType {
  const target = `${slug || ""} ${categoryId || ""}`.toLowerCase();
  if (!target.trim()) return "generic";
  if (target.includes("laptop") || target.includes("ultrabook") || target.includes("notebook"))
    return "laptop";
  if (target.includes("mobile") || target.includes("phone") || target.includes("tablet"))
    return "mobile";
  if (
    target.includes("console") ||
    target.includes("ps5") ||
    target.includes("xbox") ||
    target.includes("gaming")
  )
    return "console";
  if (target.includes("printer") || target.includes("پرینتر")) return "printer";
  if (target.includes("case") || target.includes("کیس")) return "case";
  if (target.includes("monitor") || target.includes("مانیتور")) return "monitor";
  if (target.includes("all-in-one") || target.includes("aio") || target.includes("آل این وان"))
    return "all-in-one";
  return "generic";
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: pre-existing complexity
function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = trpc.products.bySlug.useQuery({ slug }, { staleTime: 60_000 });
  const {
    formatted: torobFormatted,
    isActive: isTorobActive,
    remainingSeconds,
  } = useTorobCountdown();

  const { initialize, reset, selectedVariantId, selectVariant, variants } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const setProductContext = useAIConsultantStore((s) => s.setProductContext);
  const clearProductContext = useAIConsultantStore((s) => s.clearProductContext);
  const [cartError, setCartError] = useState<string | null>(null);

  const addToCartMutation = trpc.cart.addToCart.useMutation({
    onError: (err) => {
      setCartError(err.message);
      setTimeout(() => setCartError(null), 4000);
    },
  });

  const product = data?.product;

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  // Server-resolved prices — NO client-side calculus (zero-trust invariant)
  const effectivePrice = selectedVariant?.effectivePrice ?? product?.effectivePrice ?? 0;
  const displayBaseline = product?.displayBaseline ?? null;
  const discountPercent = product?.discountPercent ?? null;
  const pricingTier = product?.pricingTier ?? "regular";

  // Installment price is ALWAYS the retail baseline (never torob/wholesale)
  const installmentPrice = product?.installmentBasePrice ?? effectivePrice;

  const { data: installmentData } = trpc.installments.estimate.useQuery(
    { price: installmentPrice, categoryId: product?.categoryId ?? "" },
    { staleTime: 120_000, enabled: !!product && installmentPrice > 0 },
  );

  const lowestMonthly = installmentData?.options?.[0]?.monthlyInstallment;
  const installmentOptions = installmentData?.options ?? [];

  // بررسی هوشمند نوع کالا جهت تحویل به جدول مشخصات فنی
  const computedProductType = useMemo(() => {
    return detectProductType(product?.slug, product?.categoryId);
  }, [product?.slug, product?.categoryId]);

  const hasStock = product ? product.stock > 0 : false;

  useEffect(() => {
    if (product) {
      initialize(product.gallery, product.variants);
      setProductContext({
        productName: product.name,
        sku: product.slug,
        basePrice: String(product.installmentBasePrice ?? product.effectivePrice),
        grade: product.grade,
        slug: product.slug,
        stock: product.stock,
        attributes: product.attributes,
      });
    }
    return () => {
      reset();
      clearProductContext();
    };
  }, [product, initialize, reset, setProductContext, clearProductContext]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-page-max items-center justify-center px-8 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-page-max flex-col items-center justify-center gap-4 px-8 py-20">
        <p className="text-lg font-semibold text-text-primary">محصول یافت نشد</p>
        <p className="text-sm text-text-muted">این محصول حذف شده یا غیرفعال است.</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setCartError(null);
    const result = await addToCartMutation.mutateAsync({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity: 1,
    });

    if (result.success) {
      addItem({
        variantId: selectedVariant?.id ?? product.id,
        productId: product.id,
        categoryId: product.categoryId,
        name: product.name,
        slug: product.slug,
        sku: selectedVariant?.sku ?? product.slug,
        effectivePrice,
        installmentBasePrice: product.installmentBasePrice,
        pricingTier,
        stock: product.stock,
        selectedAddons: [],
      });
    }
  };

  const skuValue =
    selectedVariant?.sku || product.variants?.[0]?.sku || product.sku || product.slug;

  return (
    <div className="mx-auto max-w-page-max px-8 py-8" dir="rtl">
      {/* Top section: Gallery + Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <MediaGallery />
        </div>

        <div className="flex flex-col gap-5">
          {/* Title + Grade */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-fit rounded-lg bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                {GRADE_LABELS[product.grade] ?? product.grade}
              </span>
              {skuValue && (
                <span className="font-mono text-xs text-text-muted select-all">
                  کد کالا (SKU): {skuValue}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">{product.name}</h1>
            {product.description && (
              <p className="text-sm leading-relaxed text-text-secondary line-clamp-3">
                {product.description}
              </p>
            )}
          </div>

          {/* Price + Installment */}
          <div className="flex flex-col gap-2 rounded-xl border border-[--glass-border] bg-[--glass-backdrop] p-4 backdrop-blur-md">
            {pricingTier === "torob" && isTorobActive && (
              <div className="flex items-center justify-between rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-xs font-semibold text-accent mb-2 shadow-[0_0_15px_rgba(5,150,105,0.15)] animate-pulse">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-accent" />
                  <span>قیمت ویژه ترب فعال است</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-text-muted text-[10px] ml-1">مانده:</span>
                  <motion.span
                    key={remainingSeconds}
                    initial={{ opacity: 0.4, filter: "opacity(0.4)" }}
                    animate={{ opacity: 1, filter: "opacity(1)" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="font-bold tabular-nums text-sm text-accent"
                  >
                    {torobFormatted}
                  </motion.span>
                </div>
              </div>
            )}
            {displayBaseline !== null && displayBaseline > effectivePrice && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted line-through">
                  {formatRialsPersian(displayBaseline)}
                </span>
                {discountPercent && (
                  <span className="rounded bg-[--color-discount-surface] px-1 py-0.5 text-[8px] font-bold text-[--color-discount-text]">
                    {discountPercent}٪-
                  </span>
                )}
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-text-primary">
                {formatRialsPersian(effectivePrice)}
              </span>
              <span className="text-sm text-text-muted">تومان</span>
            </div>
            {lowestMonthly && (
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <CreditCard className="h-3.5 w-3.5 text-accent" />
                <span>اقساط ماهانه از {formatRialsPersian(lowestMonthly)} تومان</span>
              </div>
            )}
            {installmentOptions.length > 1 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {installmentOptions.map((opt) => (
                  <span
                    key={opt.ruleId}
                    className="rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] text-text-muted"
                  >
                    {opt.termMonths} ماهه: {formatRialsPersian(opt.monthlyInstallment)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variant Selector */}
          {variants.length > 1 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-text-primary">انتخاب مدل</span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => selectVariant(v.id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
                      v.id === selectedVariantId
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-[--glass-border] bg-[--glass-backdrop] text-text-secondary hover:border-accent/50",
                    )}
                  >
                    {v.attributes.map((a) => a.value).join(" / ") || v.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addon Selector — ABOVE Add to Cart */}
          <ProductAddonSelector
            productId={product.id}
            variantId={selectedVariant?.id ?? product.id}
            effectivePrice={effectivePrice}
          />

          {/* Installment Comparison Dialog — ABOVE Add to Cart */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <InstallmentComparisonDialog
              effectivePrice={installmentPrice}
              rayanTechOptions={installmentOptions}
              isLoading={!installmentData && installmentPrice > 0}
              onAddToCart={handleAddToCart}
              isAddingToCart={addToCartMutation.isPending}
              inStock={hasStock}
            />
          </motion.div>

          {/* Add to Cart — Primary CTA */}
          <div className="flex flex-col gap-2">
            {cartError && (
              <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {cartError}
              </div>
            )}
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={!hasStock || addToCartMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300",
                hasStock
                  ? "bg-accent text-white shadow-md hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent)]"
                  : "cursor-not-allowed bg-surface-secondary text-text-muted",
              )}
            >
              {addToCartMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              {hasStock ? "افزودن به سبد خرید" : "ناموجود"}
            </motion.button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-[--glass-border] bg-surface-secondary/50 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-primary">
                  گارانتی: ضمانت رایان تک یکماه
                </span>
                <span className="text-[11px] text-text-secondary">خرید اقساطی آسان</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-primary">
                  آخرین آپدیت:{" "}
                  {new Intl.DateTimeFormat("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date())}
                </span>
                <span className="text-[11px] text-text-secondary">با خیال راحت خرید کنید</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div className="mt-10">
        <Tabs defaultValue="specs">
          <TabsList>
            <TabsTrigger value="specs">مشخصات فنی</TabsTrigger>
            <TabsTrigger value="description">توضیحات</TabsTrigger>
            <TabsTrigger value="reviews">نظرات کاربران</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="min-h-[300px] pt-4">
            {product.attributes.length > 0 ? (
              <AttributeTable attributes={product.attributes} productType={computedProductType} />
            ) : (
              <p className="text-sm text-text-muted">مشخصات فنی ثبت نشده است.</p>
            )}
          </TabsContent>

          <TabsContent value="description" className="min-h-[300px] pt-4">
            {product.description ? (
              <div className="prose prose-sm max-w-none text-text-secondary">
                <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">توضیحاتی ثبت نشده است.</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="min-h-[300px] pt-4">
            <p className="text-sm text-text-muted">بخش نظرات به زودی فعال خواهد شد.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
