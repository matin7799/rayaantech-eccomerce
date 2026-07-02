import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTorobCountdown } from "../../../lib/hooks/use-torob-countdown";
import { useCartStore } from "../../../lib/store";
import { trpc } from "../../../lib/trpc";
import { useSession } from "../../../lib/useSession";
import { cn } from "../../../lib/utils";
import {
  ActionButton,
  CARD_SPRING,
  GRADE_LABELS,
  PriceDisplay,
  type ProductCardData,
} from "./shared";

export type { ProductCardData };

export type ProductCardVariant = "glass" | "extended";

interface ProductCardProps {
  product: ProductCardData;
  variant?: ProductCardVariant;
  onQuickView?: (slug: string) => void;
  isWishlisted?: boolean;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: pre-existing complexity in ProductCard
export function ProductCard({
  product,
  variant = "glass",
  onQuickView,
  isWishlisted,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useSession();
  const [wishlisted, setWishlisted] = useState(isWishlisted ?? false);
  const utils = trpc.useUtils();
  const {
    formatted: torobFormatted,
    isActive: isTorobActive,
    remainingSeconds,
  } = useTorobCountdown();

  useEffect(() => {
    if (isWishlisted !== undefined) {
      setWishlisted(isWishlisted);
    }
  }, [isWishlisted]);

  const toggleWishlistMutation = trpc.profile.toggleWishlist.useMutation({
    onSuccess: (data) => {
      setWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
      void utils.profile.getWishlist.invalidate();
    },
    onError: () => {
      toast.error("خطا در به‌روزرسانی علاقه‌مندی‌ها");
    },
  });

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید");
        return;
      }
      toggleWishlistMutation.mutate({ productId: product.id });
    },
    [isAuthenticated, toggleWishlistMutation, product.id],
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      variantId: product.id,
      productId: product.id,
      categoryId: product.categoryId,
      name: product.name,
      slug: product.slug,
      sku: product.slug,
      effectivePrice: product.effectivePrice,
      installmentBasePrice: product.displayBaseline ?? product.effectivePrice,
      pricingTier: product.pricingTier,
      stock: product.stock,
      selectedAddons: [],
    });
  };

  const isExtended = variant === "extended";

  return (
    <motion.div
      whileHover={
        product.inStock ? { y: -8, transition: { duration: 0.3, ease: "easeOut" } } : undefined
      }
      whileTap={product.inStock ? { scale: 0.98 } : undefined}
      transition={CARD_SPRING}
      className={cn(
        "group/card relative flex flex-col overflow-hidden rounded-2xl border border-[--glass-border] transition-all duration-300",
        product.inStock
          ? "shadow-md hover:shadow-2xl hover:shadow-accent/10"
          : "opacity-60 grayscale",
        "bg-surface-glass/85 backdrop-blur-xl w-full h-full",
      )}
    >
      {/* Sweeping light shine reflection */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {/* Grade badge */}
      <span className="absolute top-3 inset-s-3 z-10 rounded-lg bg-surface/80 border border-[--glass-border] px-2 py-0.5 text-[10px] font-semibold text-text-primary backdrop-blur-sm">
        {GRADE_LABELS[product.grade] ?? product.grade}
      </span>

      {/* Discount badge */}
      {product.discountPercent && product.discountPercent > 0 && (
        <span className="absolute top-3 inset-s-20 z-10 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(239,68,68,0.2)]">
          {product.discountPercent}٪ تخفیف
        </span>
      )}

      {/* Top-right actions — float in on hover */}
      <div className="absolute z-10 flex flex-col gap-1.5 top-3 inset-e-3 opacity-0 group-hover/card:opacity-100 translate-y-[-10px] group-hover/card:translate-y-0 transition-all duration-300">
        <ActionButton
          icon={<Eye className="h-3.5 w-3.5" />}
          label="مشاهده سریع"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.(product.slug);
          }}
        />
        <ActionButton
          icon={
            <motion.div
              key={wishlisted ? "active" : "inactive"}
              initial={{ scale: 0.8 }}
              animate={{ scale: wishlisted ? 1.1 : 1.0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center justify-center"
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  wishlisted
                    ? "fill-red-500 stroke-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : "stroke-[--glass-border] fill-none",
                )}
              />
            </motion.div>
          }
          label="علاقه‌مندی"
          active={wishlisted}
          onClick={handleToggleWishlist}
        />
      </div>

      {/* OOS overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/60 backdrop-blur-[2px]">
          <span className="rounded-lg bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 border border-red-500/20">
            ناموجود
          </span>
        </div>
      )}

      {/* Image wrapped in aspect-square container */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="flex aspect-square items-center justify-center bg-surface-secondary/30 p-2 no-underline transition-colors group-hover/card:bg-surface-secondary/20 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover/card:scale-108"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <ShoppingBag className="text-text-muted/30 h-12 w-12" aria-hidden="true" />
        )}
      </Link>

      {/* Content */}
      <div className={cn("flex flex-1 flex-col gap-2.5 p-4", isExtended && "gap-3")}>
        {/* Title */}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="font-bold text-text-primary no-underline transition-colors hover:text-accent text-xs line-clamp-2 sm:text-sm leading-relaxed"
        >
          {product.name}
        </Link>

        {/* SKU Label */}
        {product.sku && (
          <span className="font-mono text-[9px] text-text-muted select-all leading-none">
            کد کالا: {product.sku}
          </span>
        )}

        {/* Extended extra attribute space */}
        {isExtended && (
          <p className="text-[10px] leading-relaxed text-text-muted line-clamp-2">
            {GRADE_LABELS[product.grade] ?? product.grade} — کد: {product.sku || product.slug}
          </p>
        )}

        {/* Torob Countdown inside Card Metadata Block */}
        {product.pricingTier === "torob" && isTorobActive && (
          <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent w-fit shadow-[0_0_10px_rgba(5,150,105,0.15)] mt-0.5 transition-all">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span>ویژه ترب:</span>
            <motion.span
              key={remainingSeconds}
              initial={{ opacity: 0.4, filter: "opacity(0.4)" }}
              animate={{ opacity: 1, filter: "opacity(1)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-bold tabular-nums"
            >
              {torobFormatted}
            </motion.span>
          </div>
        )}

        {/* Bottom row: Price + Cart */}
        <div className="mt-auto pt-2 border-t border-[--glass-border]/40 flex items-center justify-between gap-2">
          <PriceDisplay
            effectivePrice={product.effectivePrice}
            displayBaseline={product.displayBaseline}
            discountPercent={product.discountPercent}
            pricingTier={product.pricingTier}
            compact={false}
          />
          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            whileTap={{ scale: 0.85 }}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl transition-all h-9 w-9 border",
              product.inStock
                ? "bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                : "cursor-not-allowed bg-surface-secondary text-text-muted border-transparent",
            )}
            aria-label="افزودن به سبد"
          >
            <ShoppingBag className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
