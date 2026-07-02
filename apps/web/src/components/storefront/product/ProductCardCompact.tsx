import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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

interface ProductCardCompactProps {
  product: ProductCardData;
  onQuickView?: (slug: string) => void;
  isWishlisted?: boolean;
}

/**
 * ProductCardCompact — horizontal compact card used by the homepage slider.
 *
 * INVARIANT: Zero Client-Side Calculus. All prices are server-resolved via
 * `ProductCardData.effectivePrice` / `displayBaseline` / `discountPercent` /
 * `pricingTier`. The component only renders the shared `PriceDisplay`.
 */
export function ProductCardCompact({
  product,
  onQuickView,
  isWishlisted,
}: ProductCardCompactProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useSession();
  const [wishlisted, setWishlisted] = useState(isWishlisted ?? false);
  const utils = trpc.useUtils();

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

  return (
    <motion.div
      whileHover={
        product.inStock ? { y: -6, transition: { duration: 0.2, ease: "easeOut" } } : undefined
      }
      whileTap={product.inStock ? { scale: 0.98 } : undefined}
      transition={CARD_SPRING}
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-[--glass-border] transition-shadow duration-300",
        product.inStock ? "hover:shadow-lg" : "opacity-60 grayscale",
        "flex-row bg-surface/70 backdrop-blur-md w-full",
      )}
    >
      {/* Grade badge */}
      <span className="absolute top-1 inset-s-1 z-10 rounded bg-accent/10 px-1 py-0.5 text-[8px] font-semibold text-accent backdrop-blur-sm">
        {GRADE_LABELS[product.grade] ?? product.grade}
      </span>

      {/* OOS Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/60 backdrop-blur-[2px]">
          <span className="rounded-lg bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
            ناموجود
          </span>
        </div>
      )}

      {/* Image */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="flex items-center justify-center bg-surface-secondary no-underline transition-colors group-hover:bg-surface-secondary/80 h-32 w-32 shrink-0 rounded-s-2xl p-2 aspect-square"
      >
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <ShoppingBag className="text-text-muted/30 h-8 w-8" aria-hidden="true" />
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 justify-center p-2.5">
        {/* Title */}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="font-semibold text-text-primary no-underline transition-colors hover:text-accent text-[11px] line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Bottom container: Price and Actions stacked vertically */}
        <div className="mt-auto flex flex-col gap-2">
          <PriceDisplay
            effectivePrice={product.effectivePrice}
            displayBaseline={product.displayBaseline}
            discountPercent={product.discountPercent}
            pricingTier={product.pricingTier}
            compact
          />
          <div className="flex items-center gap-1.5">
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
                        ? "fill-[--color-wishlist-active] stroke-[--color-wishlist-active] shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                        : "stroke-[--glass-border] fill-none",
                    )}
                  />
                </motion.div>
              }
              label="علاقه‌مندی"
              active={wishlisted}
              onClick={handleToggleWishlist}
            />
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg transition-all h-7 w-7",
                product.inStock
                  ? "bg-accent text-[--color-on-accent] hover:bg-accent/90 shadow-sm"
                  : "cursor-not-allowed bg-surface-secondary text-text-muted",
              )}
              aria-label="افزودن به سبد"
            >
              <ShoppingBag className="h-3 w-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
