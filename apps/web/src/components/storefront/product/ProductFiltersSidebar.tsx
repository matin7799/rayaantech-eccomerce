import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, X } from "lucide-react";
import { useCallback } from "react";
import { isFilterActive, toggleFilterValue } from "../../../lib/filter-utils";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";
import { PriceInput } from "../../ui/PriceInput";
import { ScrollArea } from "../../ui/scroll-area";

interface ProductFiltersSidebarProps {
  categoryFilter?: string;
  brandFilter?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * ProductFiltersSidebar — Simplified sticky filter panel.
 *
 * Three clean sections only:
 * 1. Category Tree (دسته‌بندی‌های درختی)
 * 2. Brand Checkbox Matrix (برندها)
 * 3. Price Range Slider (محدوده قیمت)
 *
 * Clear Filters button positioned at the top header area.
 * All dynamic EAV attributes stripped.
 */
export function ProductFiltersSidebar({
  categoryFilter,
  brandFilter,
  minPrice,
  maxPrice,
}: ProductFiltersSidebarProps) {
  const navigate = useNavigate();

  const { data: facetsData, isLoading: facetsLoading } = trpc.products.facets.useQuery(
    { categoryId: categoryFilter },
    { staleTime: 5 * 60_000 },
  );

  const { data: categoryData } = trpc.categories.tree.useQuery(undefined, {
    staleTime: 24 * 60 * 60_000,
  });

  const updateFilter = useCallback(
    (updates: Record<string, string | number | boolean | undefined>) => {
      void navigate({
        to: "/products",
        search: (prev) => ({ ...prev, ...updates, page: 1 }),
      });
    },
    [navigate],
  );

  const toggleCategory = useCallback(
    (slug: string) => {
      updateFilter({ category: toggleFilterValue(categoryFilter, slug) });
    },
    [categoryFilter, updateFilter],
  );

  const toggleBrand = useCallback(
    (slug: string) => {
      updateFilter({ brand: toggleFilterValue(brandFilter, slug) });
    },
    [brandFilter, updateFilter],
  );

  const hasActiveFilters = !!(categoryFilter || brandFilter || minPrice || maxPrice);

  const clearAllFilters = useCallback(() => {
    void navigate({
      to: "/products",
      search: (prev) => ({ layout: prev.layout }),
    });
  }, [navigate]);

  if (facetsLoading) {
    return (
      <div className="sticky top-[calc(var(--header-height,5rem)+1rem)] z-30 flex max-h-[calc(100vh-7rem)] flex-col gap-4 overflow-y-auto pr-2 pb-8 scrollbar-thin">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader key
          <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-secondary" />
        ))}
      </div>
    );
  }

  const { brands = [] } = facetsData ?? {};
  const categories = categoryData?.tree ?? [];

  return (
    <div className="sticky top-[calc(var(--header-height,5rem)+1rem)] z-30 flex max-h-[calc(100vh-7rem)] flex-col gap-3 overflow-y-auto pr-2 pb-8 scrollbar-thin">
      {/* Clear Filters — Top header position */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-danger/30 bg-danger/5 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <X className="h-3 w-3" />
          پاک کردن فیلترها
        </button>
      )}

      {/* 1. Category Tree — دسته‌بندی‌های درختی */}
      {categories.length > 0 && (
        <FilterSection title="دسته‌بندی">
          <ScrollArea className="max-h-52 h-50">
            <div className="flex flex-col gap-0.5">
              {categories.map((cat) => (
                <CategoryNode
                  key={cat.id}
                  category={cat}
                  activeFilter={categoryFilter}
                  onToggle={toggleCategory}
                />
              ))}
            </div>
          </ScrollArea>
        </FilterSection>
      )}

      {/* 2. Brand Checkbox Matrix — برندها */}
      {brands.length > 0 && (
        <FilterSection title="برندها">
          <ScrollArea className="max-h-44 h-30">
            <div className="flex flex-col gap-1">
              {brands.map((brand) => (
                <label
                  key={brand.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all duration-200",
                    isFilterActive(brandFilter, brand.slug)
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isFilterActive(brandFilter, brand.slug)}
                    onChange={() => toggleBrand(brand.slug)}
                    className="h-3.5 w-3.5 rounded border-border accent-accent"
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          </ScrollArea>
        </FilterSection>
      )}

      {/* 3. Price Range — محدوده قیمت */}
      <FilterSection title="محدوده قیمت (تومان)">
        <div className="flex flex-col gap-2">
          <PriceInput
            value={minPrice ?? 0}
            onChange={(v) => updateFilter({ minPrice: v || undefined })}
            placeholder="از"
            suffix="تومان"
          />
          <PriceInput
            value={maxPrice ?? 0}
            onChange={(v) => updateFilter({ maxPrice: v || undefined })}
            placeholder="تا"
            suffix="تومان"
          />
        </div>
      </FilterSection>
    </div>
  );
}

// ─── Category Tree Node (multi-select) ───────────────────────────────────────

interface CategoryNodeData {
  id: string;
  name: string;
  slug: string;
  children: CategoryNodeData[];
}

interface CategoryNodeProps {
  category: CategoryNodeData;
  activeFilter?: string;
  onToggle: (slug: string) => void;
  depth?: number;
}

/** Check if any descendant in the tree is in the active filter. */
function hasDescendantActive(children: CategoryNodeData[], activeFilter?: string): boolean {
  for (const child of children) {
    if (isFilterActive(activeFilter, child.slug)) return true;
    if (child.children.length > 0 && hasDescendantActive(child.children, activeFilter)) return true;
  }
  return false;
}

function CategoryNode({ category, activeFilter, onToggle, depth = 0 }: CategoryNodeProps) {
  const isActive = isFilterActive(activeFilter, category.slug);
  const hasChildren = category.children.length > 0;

  const hasActiveDescendant = hasChildren && hasDescendantActive(category.children, activeFilter);
  const showChildren = hasChildren && (isActive || hasActiveDescendant);

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(category.slug)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all duration-200",
          isActive
            ? "bg-accent/10 text-accent"
            : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
        )}
        style={{ paddingInlineStart: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <ChevronLeft
            className={cn(
              "h-3 w-3 shrink-0 transition-transform rtl:rotate-180",
              showChildren && "-rotate-90 rtl:rotate-90",
            )}
          />
        )}
        <span className="truncate">{category.name}</span>
      </button>
      {showChildren && (
        <div className="flex flex-col gap-0.5">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              activeFilter={activeFilter}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared Sub-Components ───────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[--glass-border] bg-[--glass-backdrop] p-3 shadow-[--shadow-glass] backdrop-blur-md">
      <h4 className="text-xs font-semibold text-text-primary">{title}</h4>
      {children}
    </div>
  );
}
