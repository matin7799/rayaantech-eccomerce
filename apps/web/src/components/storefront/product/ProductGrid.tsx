import { motion } from "framer-motion";
import { Loader2, Package } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "../../../lib/trpc";
import { useSession } from "../../../lib/useSession";
import { cn } from "../../../lib/utils";
import { ProductCard, type ProductCardData } from "./ProductCard";

interface ProductGridProps {
  categoryId?: string;
  brandId?: string;
  grade?: string;
  minPrice?: number;
  maxPrice?: number;
  attributeValueIds?: string[];
  showOutOfStock?: boolean;
  sortBy?: string;
  initialPage?: number;
  onQuickView?: (slug: string) => void;
}

const ITEMS_PER_PAGE = 20;

/**
 * ProductCardSkeleton — Matches exact dimensions of a loaded ProductCard.
 *
 * Uses identical aspect ratio (3/4), border-radius (rounded-2xl),
 * and structure to prevent cumulative layout shift (CLS) on load.
 */
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[--glass-border] bg-surface/70">
      {/* Image area — matches aspect-square from ProductCard */}
      <div className="aspect-square animate-pulse bg-surface-secondary" />
      {/* Content area — matches p-3 + gap structure */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-secondary" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-secondary" />
        <div className="mt-2 flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-surface-secondary" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}

/**
 * ProductGrid — Zero-jank responsive product listing with "Load More" pagination.
 *
 * Prices are server-resolved via the resolved pricing contract.
 * No client-side price calculus — the grid simply renders what the backend emits.
 */
export function ProductGrid({
  categoryId,
  brandId,
  grade,
  minPrice,
  maxPrice,
  attributeValueIds,
  showOutOfStock = false,
  sortBy = "latest",
  initialPage = 1,
  onQuickView,
}: ProductGridProps) {
  const [page, setPage] = useState(initialPage);
  const [accumulatedItems, setAccumulatedItems] = useState<ProductCardData[]>([]);
  const lastFilterKeyRef = useRef("");

  const { isAuthenticated } = useSession();

  // Fetch user wishlist if authenticated
  const wishlistQuery = trpc.profile.getWishlist.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const wishlistIds = new Set(wishlistQuery.data?.items?.map((item) => item.id) ?? []);

  const filterKey = `${categoryId}-${brandId}-${grade}-${minPrice}-${maxPrice}-${attributeValueIds?.join(",")}-${showOutOfStock}-${sortBy}`;

  // Reset accumulated items when filters change
  useEffect(() => {
    if (lastFilterKeyRef.current && lastFilterKeyRef.current !== filterKey) {
      setPage(1);
      setAccumulatedItems([]);
    }
    lastFilterKeyRef.current = filterKey;
  }, [filterKey]);

  const { data, isLoading, isFetching } = trpc.products.list.useQuery(
    {
      page,
      limit: ITEMS_PER_PAGE,
      categoryId,
      brandId,
      grade,
      minPrice,
      maxPrice,
      attributeValueIds,
      showOutOfStock,
      sortBy: sortBy as "latest" | "price_asc" | "price_desc",
    },
    { staleTime: 30_000 },
  );

  // Accumulate items when new data arrives
  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setAccumulatedItems(data.items);
    } else {
      setAccumulatedItems((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = data.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  const hasMore = data?.hasMore ?? false;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [hasMore, isFetching]);

  // Loading state — skeletons with exact card dimensions
  if (isLoading && accumulatedItems.length === 0) {
    return (
      <div className="grid min-h-[900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list of skeletons
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!(isLoading || isFetching) && accumulatedItems.length === 0 && data?.items.length === 0) {
    return (
      <div className="flex min-h-[900px] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
          <Package className="h-8 w-8 text-text-muted" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-text-secondary">محصولی با این فیلترها یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-text-muted">
          {accumulatedItems.length} محصول نمایش داده شده
        </p>
      </div>

      {/* Grid container — fixed min-height, only opacity transitions */}
      <div
        className={cn(
          "grid min-h-[900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          isFetching &&
            accumulatedItems.length > 0 &&
            "opacity-40 pointer-events-none transition-opacity duration-200",
          !isFetching && "transition-opacity duration-200",
        )}
      >
        {accumulatedItems.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.35, ease: "easeOut" }}
          >
            <ProductCard
              product={product}
              onQuickView={onQuickView}
              isWishlisted={wishlistIds.has(product.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-border-light bg-surface px-6 py-2.5 text-sm font-medium text-text-secondary shadow-sm hover:border-accent hover:text-accent hover:shadow-md disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                در حال بارگذاری...
              </>
            ) : (
              "مشاهده بیشتر"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
