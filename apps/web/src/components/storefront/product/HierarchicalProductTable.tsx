"use client";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { Package, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildCategoryResolver,
  type CatalogSort,
  type CategoryTreeNode,
  groupProductsHierarchically,
} from "../../../lib/group-products-hierarchical";
import { trpc } from "../../../lib/trpc";
import { MainCategoryBlock } from "./MainCategoryBlock";
import type { ProductCardData } from "./shared";

interface HierarchicalProductTableProps {
  categoryId?: string;
  brandId?: string;
  grade?: string;
  minPrice?: number;
  maxPrice?: number;
  attributeValueIds?: string[];
  showOutOfStock?: boolean;
  sortBy?: string;
  onQuickView?: (slug: string) => void;
}

/** Auto-pagination ceiling — caps the client-side tree at ~288 products. */
const PAGE_LIMIT = 48;
const MAX_PAGES = 6;

/**
 * HierarchicalProductTable — Semantic, responsive structured catalog:
 *   Main Category ➔ Sub-Category ➔ Brand Group ➔ Responsive Product Rows.
 *
 * Main categories follow the immutable `ROOT_CATEGORY_SEQUENCE` (slug-keyed);
 * the active sort reorders ONLY leaf products. Empty branches are
 * pruned by construction. Open-state is keyed by main id so filter changes
 * re-group in place without collapsing the tree.
 */
export function HierarchicalProductTable({
  categoryId,
  brandId,
  grade,
  minPrice,
  maxPrice,
  attributeValueIds,
  showOutOfStock = false,
  sortBy = "latest",
  onQuickView,
}: HierarchicalProductTableProps) {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<ProductCardData[]>([]);
  const lastFilterKeyRef = useRef("");
  const [openMains, setOpenMains] = useState<Set<string>>(() => new Set());
  const initializedRef = useRef(false);

  const search = useSearch({ strict: false }) as Record<string, any>;
  const searchQuery = search.q || "";
  const navigate = useNavigate();

  const { data: categoryData } = trpc.categories.tree.useQuery(undefined, {
    staleTime: 24 * 60 * 60_000,
  });
  const { data: facetsData } = trpc.products.facets.useQuery(
    { categoryId },
    { staleTime: 5 * 60_000 },
  );

  const filterKey = `${categoryId}-${brandId}-${grade}-${minPrice}-${maxPrice}-${attributeValueIds?.join(",")}-${showOutOfStock}-${sortBy}`;

  useEffect(() => {
    if (lastFilterKeyRef.current && lastFilterKeyRef.current !== filterKey) {
      setPage(1);
      setAccumulated([]);
    }
    lastFilterKeyRef.current = filterKey;
  }, [filterKey]);

  const { data, isLoading, isFetching } = trpc.products.list.useQuery(
    {
      page,
      limit: PAGE_LIMIT,
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

  // Accumulate items as pages arrive, then auto-advance until loaded (or cap).
  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => {
      if (page === 1) return data.items as ProductCardData[];
      const existing = new Set(prev.map((p) => p.id));
      return [...prev, ...(data.items as ProductCardData[]).filter((i) => !existing.has(i.id))];
    });
    if (data.hasMore && page < MAX_PAGES) setPage((p) => p + 1);
  }, [data, page]);

  const categoryResolver = useMemo(
    () => buildCategoryResolver((categoryData?.tree ?? []) as CategoryTreeNode[]),
    [categoryData],
  );
  const brandNameMap = useMemo(
    () => new Map((facetsData?.brands ?? []).map((b) => [b.id, b.name])),
    [facetsData],
  );

  const handleSearchChange = (value: string) => {
    void navigate({
      search: (prev: any) => ({
        ...prev,
        q: value || undefined,
      }),
    });
  };

  // Client-side search filtering by name and SKU
  const filteredAccumulated = useMemo(() => {
    if (!searchQuery) return accumulated;
    const q = searchQuery.toLowerCase().trim();
    return accumulated.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const skuMatch = p.sku?.toLowerCase().includes(q);
      const slugMatch = p.slug?.toLowerCase().includes(q);
      return nameMatch || skuMatch || slugMatch;
    });
  }, [accumulated, searchQuery]);

  const grouped = useMemo(
    () =>
      groupProductsHierarchically({
        products: filteredAccumulated,
        categoryResolver,
        brandNameMap,
        sortBy: sortBy as CatalogSort,
      }),
    [filteredAccumulated, categoryResolver, brandNameMap, sortBy],
  );

  // Open all main categories on first non-empty render; never reset after.
  useEffect(() => {
    if (!initializedRef.current && grouped.length > 0) {
      setOpenMains(new Set(grouped.map((g) => g.id)));
      initializedRef.current = true;
    }
  }, [grouped]);

  const toggleMain = (id: string) =>
    setOpenMains((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const done = !(isFetching || data?.hasMore);

  return (
    <div className="flex flex-col gap-4">
      {/* High-end glassmorphic Search Input bar */}
      <div className="relative w-full max-w-md bg-surface-secondary/40 backdrop-blur-md border border-[--glass-border] rounded-xl flex items-center px-3.5 py-2 shadow-xs focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent/50 transition-all duration-300">
        <Search className="h-4 w-4 text-text-muted shrink-0 ml-2" />
        <input
          type="text"
          placeholder="جستجو در نام یا کد کالا (SKU)..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-xs text-text-primary placeholder:text-text-muted/60 text-right font-medium"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="p-1 rounded-full hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors focus:outline-none"
            aria-label="پاک کردن جستجو"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isLoading && accumulated.length === 0 ? (
        <div className="flex min-h-[400px] flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-secondary/40" />
          ))}
        </div>
      ) : done && filteredAccumulated.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
            <Package className="h-8 w-8 text-text-muted" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-text-secondary">محصولی با این مشخصات یافت نشد</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-medium text-text-muted">
            {filteredAccumulated.length} محصول در {grouped.length.toLocaleString("fa-IR")} دسته اصلی
            {isFetching && " — در حال بارگذاری..."}
          </p>
          <div className="flex flex-col gap-4">
            {grouped.map((main) => (
              <MainCategoryBlock
                key={main.id}
                main={main}
                open={openMains.has(main.id)}
                onToggle={() => toggleMain(main.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
