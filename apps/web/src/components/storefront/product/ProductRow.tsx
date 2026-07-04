"use client";

import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../../lib/store";
import { cn } from "../../../lib/utils";
import { ProductTableImage } from "./ProductTableImage";
import {
  AdminPriceMatrix,
  DesktopPriceRow,
  GRADE_LABELS,
  MobilePriceStack,
  type ProductCardData,
} from "./shared";

interface ProductRowProps {
  product: ProductCardData;
  delay: number;
  onQuickView?: (slug: string) => void;
}

export function ProductRow({ product, delay, onQuickView }: ProductRowProps) {
  const addItem = useCartStore((s) => s.addItem);
  const gradeLabel = GRADE_LABELS[product.grade] || product.grade;

  const handleAddToCart = (e: React.MouseEvent) => {
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
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className={cn(
        "group relative flex w-full flex-col border-b border-[--glass-border] last:border-0",
        !product.inStock && "opacity-60",
      )}
    >
      {/* ─── DESKTOP VIEW ─── */}
      <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto_auto] items-center gap-6 px-4 py-3.5 text-right transition-colors duration-150 hover:bg-white/[0.02]">
        {/* Product Thumbnail (Clickable for Quick View) */}
        <button
          type="button"
          onClick={() => onQuickView?.(product.slug)}
          className="relative cursor-pointer select-none text-right outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xl"
        >
          <ProductTableImage src={product.thumbnailUrl} alt={product.name} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 rounded-xl group-hover:opacity-100">
            <Eye className="h-4 w-4 text-white" />
          </div>
        </button>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <button
            type="button"
            onClick={() => onQuickView?.(product.slug)}
            className="text-sm font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors line-clamp-1 text-right focus-visible:outline-none"
          >
            {product.name}
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
              {gradeLabel}
            </span>
            {product.sku && (
              <span className="font-mono text-[10px] text-text-muted">کد: {product.sku}</span>
            )}
            {!product.inStock && (
              <span className="rounded-lg bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
                ناموجود
              </span>
            )}
          </div>
        </div>

        {/* Prices Row — server-resolved */}
        <DesktopPriceRow
          effectivePrice={product.effectivePrice}
          displayBaseline={product.displayBaseline}
          discountPercent={product.discountPercent}
          pricingTier={product.pricingTier}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick View Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => onQuickView?.(product.slug)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[--glass-border] bg-surface/30 text-text-secondary transition-all hover:bg-white/[0.04] hover:text-text-primary shadow-sm"
            aria-label="مشاهده سریع"
          >
            <Eye className="h-4 w-4" />
          </motion.button>

          {/* Add to Cart */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
              product.inStock
                ? "bg-accent text-[--color-on-accent] hover:bg-accent/90 shadow-sm shadow-accent/20"
                : "cursor-not-allowed bg-surface-secondary text-text-muted",
            )}
            aria-label="افزودن به سبد"
          >
            <ShoppingBag className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* ─── MOBILE/TABLET VIEW ─── */}
      <div className="flex lg:hidden items-start gap-4 p-4 text-right">
        {/* Right side: Thumbnail */}
        <button
          type="button"
          onClick={() => onQuickView?.(product.slug)}
          className="relative shrink-0 cursor-pointer text-right outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xl"
        >
          <ProductTableImage src={product.thumbnailUrl} alt={product.name} />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
              <span className="text-[8px] font-bold text-white px-1">ناموجود</span>
            </div>
          )}
        </button>

        {/* Left side: Content area */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div>
            <button
              type="button"
              onClick={() => onQuickView?.(product.slug)}
              className="text-xs font-semibold text-text-primary line-clamp-2 leading-relaxed cursor-pointer text-right focus-visible:outline-none"
            >
              {product.name}
            </button>
            <span className="inline-block mt-1.5 rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold text-accent">
              {gradeLabel}
            </span>
            {product.sku && (
              <span className="inline-block mr-2 font-mono text-[9px] text-text-muted">
                کد: {product.sku}
              </span>
            )}
          </div>

          {/* Prices Vertical Stack — server-resolved */}
          <MobilePriceStack
            effectivePrice={product.effectivePrice}
            displayBaseline={product.displayBaseline}
            discountPercent={product.discountPercent}
            pricingTier={product.pricingTier}
          />

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => onQuickView?.(product.slug)}
              className="flex items-center justify-center gap-1 flex-1 py-1.5 text-[10px] font-semibold rounded-lg border border-[--glass-border] bg-surface/30 text-text-secondary hover:text-text-primary"
            >
              <Eye className="h-3 w-3" /> مشاهده سریع
            </button>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className={cn(
                "flex items-center justify-center gap-1 flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all",
                product.inStock
                  ? "bg-accent text-[--color-on-accent] hover:bg-accent/90"
                  : "cursor-not-allowed bg-surface-secondary text-text-muted",
              )}
            >
              <ShoppingBag className="h-3 w-3" /> خرید
            </button>
          </div>
        </div>
      </div>

      {/* ─── ADMIN-ONLY: all raw price tiers (present only for staff) ─── */}
      {product.adminPrices && <AdminPriceMatrix prices={product.adminPrices} />}
    </motion.div>
  );
}
