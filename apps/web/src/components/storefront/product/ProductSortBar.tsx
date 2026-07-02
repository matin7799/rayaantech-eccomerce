import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
  Clock,
  LayoutGrid,
  SlidersHorizontal,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback } from "react";
import { cn } from "../../../lib/utils";

/**
 * Sort option definition.
 */
interface SortOption {
  value: "latest" | "price_asc" | "price_desc";
  label: string;
  icon: React.ElementType;
}

const SORT_OPTIONS: readonly SortOption[] = [
  { value: "latest", label: "جدیدترین", icon: Clock },
  { value: "price_asc", label: "ارزان‌ترین", icon: TrendingDown },
  { value: "price_desc", label: "گران‌ترین", icon: TrendingUp },
];

type CatalogLayout = "grid" | "table_hierarchical";

interface LayoutOption {
  value: CatalogLayout;
  label: string;
  icon: React.ElementType;
}

const LAYOUT_OPTIONS: readonly LayoutOption[] = [
  { value: "grid", label: "شبکه‌ای", icon: LayoutGrid },
  { value: "table_hierarchical", label: "جدولی", icon: Table2 },
];

interface ProductSortBarProps {
  /** Currently active sort value */
  currentSort: string;
  /** Currently active catalog layout */
  currentLayout?: CatalogLayout;
  /** Total product count for display */
  totalCount?: number;
  /** Callback to open mobile filter drawer */
  onFilterToggle?: () => void;
}

/**
 * ProductSortBar — Premium sorting control with cache cleanse on change.
 *
 * Features:
 * - shadcn/ui-style segmented button group for sort selection
 * - On sort change: resets TanStack Query cache pool + scrolls to top
 * - No layout shift (fixed height container)
 * - Accessible with aria-current for active state
 *
 * Cache Cleanse Invariant:
 * When sorting changes, the existing paginated data is stale (wrong order).
 * We invalidate all products queries so fresh data loads in correct order,
 * then smooth-scroll to top for a clean visual reset.
 */
export function ProductSortBar({
  currentSort,
  currentLayout = "grid",
  totalCount,
  onFilterToggle,
}: ProductSortBarProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSortChange = useCallback(
    (sortValue: "latest" | "price_asc" | "price_desc") => {
      if (sortValue === currentSort) return;

      // Cache Cleanse: invalidate all product list queries
      // This forces TanStack Query to refetch with the new sort order
      queryClient.removeQueries({ queryKey: [["products", "list"]] });

      // Navigate with new sort param (resets page to 1)
      navigate({
        to: "/products",
        search: (prev) => ({ ...prev, sort: sortValue, page: 1 }),
      });

      // Smooth scroll to top — no jarring layout jump
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentSort, navigate, queryClient],
  );

  const handleLayoutChange = useCallback(
    (layoutValue: CatalogLayout) => {
      if (layoutValue === currentLayout) return;

      // Layout is rendering-only: the products.list query inputs are identical
      // across layouts, so the existing cache stays valid. No cleanse needed —
      // the switch is instant and all filters/sort are preserved via `...prev`.
      navigate({
        to: "/products",
        search: (prev) => ({ ...prev, layout: layoutValue }),
      });
    },
    [currentLayout, navigate],
  );

  return (
    <div className="flex items-center justify-between rounded-xl border border-[--glass-border] bg-[--glass-backdrop] px-4 py-2.5 shadow-[--shadow-glass] backdrop-blur-md">
      {/* Sort controls */}
      <div className="flex items-center gap-1.5">
        <ArrowDownUp className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
        <span className="text-xs font-medium text-text-muted ms-1 hidden sm:inline">مرتب‌سازی:</span>

        <div className="flex items-center gap-1 rounded-lg border border-[--glass-border] bg-surface-secondary/50 p-0.5">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = currentSort === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-surface text-accent shadow-sm"
                    : "text-text-muted hover:text-text-secondary",
                )}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {totalCount !== undefined && (
        <span className="text-[11px] font-medium text-text-muted hidden sm:inline">
          {totalCount.toLocaleString("fa-IR")} محصول
        </span>
      )}

      {/* Layout toggle — grid vs hierarchical */}
      <div className="flex items-center gap-1 rounded-lg border border-[--glass-border] bg-surface-secondary/50 p-0.5">
        {LAYOUT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentLayout === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleLayoutChange(option.value)}
              whileTap={{ scale: 0.95 }}
              aria-pressed={isActive}
              aria-label={`نمایش ${option.label}`}
              title={option.label}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-surface text-accent shadow-sm"
                  : "text-text-muted hover:text-text-secondary",
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden md:inline">{option.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile filter trigger — visible only below lg */}
      {onFilterToggle && (
        <button
          type="button"
          onClick={onFilterToggle}
          className="flex items-center gap-1.5 rounded-lg border border-[--glass-border] bg-surface-secondary/50 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent lg:hidden"
        >
          <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
          فیلترها
        </button>
      )}
    </div>
  );
}
