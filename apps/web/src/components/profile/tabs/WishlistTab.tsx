import { AnimatePresence, motion } from "framer-motion";
import { Heart, HeartOff, PackageOpen } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { trpc } from "../../../lib/trpc";
import type { ProductCardData } from "../../storefront/product/ProductCard";
import { ProductCard } from "../../storefront/product/ProductCard";

const CARD_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

/**
 * WishlistTab — علاقه‌مندی‌ها
 *
 * Premium glassmorphic grid displaying wishlisted products.
 * Reuses ProductCard in "glass" variant with a remove-from-wishlist overlay action.
 * Includes an elegant pulse skeleton for loading state.
 */
export function WishlistTab() {
  const utils = trpc.useUtils();

  const wishlistQuery = trpc.profile.getWishlist.useQuery(
    { limit: 20, offset: 0 },
    { staleTime: 30_000 },
  );

  const toggleMutation = trpc.profile.toggleWishlist.useMutation({
    onMutate: async ({ productId }) => {
      // Optimistic removal from the cached list
      await utils.profile.getWishlist.cancel();
      const prev = utils.profile.getWishlist.getData({ limit: 20, offset: 0 });

      utils.profile.getWishlist.setData({ limit: 20, offset: 0 }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.id !== productId),
          total: old.total - 1,
        };
      });

      return { prev };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.prev) {
        utils.profile.getWishlist.setData({ limit: 20, offset: 0 }, context.prev);
      }
      toast.error("خطا در حذف از علاقه‌مندی‌ها");
    },
    onSettled: () => {
      void utils.profile.getWishlist.invalidate();
    },
  });

  const handleRemove = useCallback(
    (productId: string) => {
      toggleMutation.mutate({ productId });
    },
    [toggleMutation],
  );

  // Loading state
  if (wishlistQuery.isLoading) {
    return <WishlistSkeleton />;
  }

  const items = wishlistQuery.data?.items ?? [];

  // Empty state
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
          <PackageOpen className="h-8 w-8 text-text-muted" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-text-primary">لیست علاقه‌مندی‌ها خالی است</p>
          <p className="text-xs text-text-muted">
            محصولات مورد علاقه خود را با کلیک روی آیکون قلب ذخیره کنید
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">علاقه‌مندی‌ها</span>
        </div>
        <span className="rounded-lg bg-surface-secondary px-2 py-0.5 text-xs font-medium text-text-muted">
          {wishlistQuery.data?.total ?? 0} محصول
        </span>
      </div>

      {/* Glassmorphic product grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={CARD_SPRING}
              className="relative"
            >
              <ProductCard product={item as ProductCardData} variant="glass" />

              {/* Remove from wishlist overlay button */}
              <motion.button
                type="button"
                onClick={() => handleRemove(item.id)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                disabled={toggleMutation.isPending}
                className="absolute top-2 inset-e-2 z-20 flex h-7 w-7 items-center justify-center rounded-lg border border-[--glass-border] bg-[--glass-backdrop] text-danger backdrop-blur-md transition-colors hover:bg-danger/10"
                aria-label="حذف از علاقه‌مندی‌ها"
              >
                <HeartOff className="h-3.5 w-3.5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ─── */

/**
 * WishlistSkeleton — Infinite soft pulse overlay grid.
 * Prevents layout shift during data loading.
 */
function WishlistSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded-md bg-surface-secondary" />
        <div className="h-5 w-16 animate-pulse rounded-lg bg-surface-secondary" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-[--glass-border] bg-surface/70 backdrop-blur-md"
          >
            {/* Image placeholder */}
            <div className="aspect-4/3 animate-pulse bg-surface-secondary" />
            {/* Content placeholder */}
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-full animate-pulse rounded bg-surface-secondary" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-surface-secondary" />
              <div className="mt-2 flex items-center justify-between">
                <div className="h-4 w-16 animate-pulse rounded bg-surface-secondary" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-surface-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
