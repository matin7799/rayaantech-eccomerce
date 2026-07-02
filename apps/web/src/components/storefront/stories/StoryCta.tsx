import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatRialsPersian } from "../../../lib/persian-numerals";
import { cn } from "../../../lib/utils";
import type { StoryData } from "./StoryItem";

interface StoryCtaProps {
  story: StoryData;
}

/**
 * StoryCta — Product call-to-action overlay inside the story modal.
 *
 * When the linked product is in stock:
 * - Shows product name, price, and "افزودن به سبد" button
 *
 * When stock = 0:
 * - Applies a liquid-blur mask over the CTA
 * - Displays "اتمام موجودی" (Out of Stock) notice
 * - Purchase button becomes disabled with reduced opacity
 */
export function StoryCta({ story }: StoryCtaProps) {
  const { product } = story;

  if (!product) return null;

  const isOutOfStock = !product.inStock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-xl"
    >
      {/* Out-of-stock blur overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-md bg-black/30">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-white/90">اتمام موجودی</span>
            <span className="text-[10px] text-white/60">این محصول فعلاً ناموجود است</span>
          </div>
        </div>
      )}

      {/* CTA card content */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm",
          isOutOfStock && "opacity-50",
        )}
      >
        {/* Product info */}
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-xs font-semibold text-white line-clamp-1">{product.name}</span>
          <span className="text-sm font-bold text-accent">
            {formatRialsPersian(parseInt(product.price, 10))} تومان
          </span>
        </div>

        {/* Add to cart / view button */}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold no-underline transition-all duration-200",
            isOutOfStock
              ? "pointer-events-none bg-white/10 text-white/40"
              : "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20",
          )}
          aria-disabled={isOutOfStock}
        >
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
          {isOutOfStock ? "ناموجود" : "مشاهده"}
        </Link>
      </div>
    </motion.div>
  );
}
