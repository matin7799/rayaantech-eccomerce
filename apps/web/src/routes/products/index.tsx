import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { z } from "zod";
import { HierarchicalProductTable } from "../../components/storefront/product/HierarchicalProductTable";
import { MobileFilterDrawer } from "../../components/storefront/product/MobileFilterDrawer";
import { ProductFiltersSidebar } from "../../components/storefront/product/ProductFiltersSidebar";
import { ProductGrid } from "../../components/storefront/product/ProductGrid";
import { ProductSortBar } from "../../components/storefront/product/ProductSortBar";
import { QuickView } from "../../components/storefront/product/QuickView";
import { parseFilterString } from "../../lib/filter-utils";

/** Layout modes for the catalog viewport. */
export type CatalogLayout = "grid" | "table_hierarchical";

/**
 * Search params schema for the /products route.
 * Category and brand support comma-separated multi-select.
 * `layout` toggles between the flat grid and the nested table view.
 */
const productsSearchSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  grade: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  attrs: z.string().optional(),
  // NOTE: do NOT use z.coerce.boolean() here — it applies JS Boolean(), so the
  // string "false" (and "False") coerces to `true`, silently inverting the filter.
  // Parse the URL token explicitly: only truthy tokens enable out-of-stock.
  showOutOfStock: z
    .preprocess(
      (v) =>
        typeof v === "string" ? ["true", "1", "on", "yes"].includes(v.toLowerCase()) : Boolean(v),
      z.boolean(),
    )
    .optional()
    .default(false),
  sort: z.enum(["latest", "price_asc", "price_desc"]).optional().default("latest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  layout: z.enum(["grid", "table_hierarchical"]).catch("grid").optional().default("grid"),
});

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
  validateSearch: productsSearchSchema,
});

/**
 * ProductsPage — Full product listing with multi-select filters,
 * sorting, load-more grid, Quick View overlay, and mobile filter drawer.
 */
function ProductsPage() {
  const search = useSearch({ from: "/products/" });
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const attributeValueIds = parseFilterString(search.attrs);

  const handleFilterToggle = useCallback(() => {
    setFilterDrawerOpen(true);
  }, []);

  return (
    <div className="mx-auto flex max-w-page-max gap-6 px-8 py-6">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <ProductFiltersSidebar
          categoryFilter={search.category}
          brandFilter={search.brand}
          minPrice={search.minPrice}
          maxPrice={search.maxPrice}
        />
      </aside>

      {/* Main grid area */}
      <main className="flex min-w-0 flex-1 flex-col gap-4">
        <ProductSortBar
          currentSort={search.sort}
          currentLayout={search.layout}
          onFilterToggle={handleFilterToggle}
        />

        {search.layout === "table_hierarchical" ? (
          <HierarchicalProductTable
            categoryId={search.category}
            brandId={search.brand}
            grade={search.grade}
            minPrice={search.minPrice}
            maxPrice={search.maxPrice}
            attributeValueIds={attributeValueIds}
            showOutOfStock={search.showOutOfStock}
            sortBy={search.sort}
            onQuickView={setQuickViewSlug}
          />
        ) : (
          <ProductGrid
            categoryId={search.category}
            brandId={search.brand}
            grade={search.grade}
            minPrice={search.minPrice}
            maxPrice={search.maxPrice}
            attributeValueIds={attributeValueIds}
            showOutOfStock={search.showOutOfStock}
            sortBy={search.sort}
            initialPage={search.page}
            onQuickView={setQuickViewSlug}
          />
        )}
      </main>

      {/* Mobile filter drawer — controlled by SortBar button */}
      <MobileFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        categoryFilter={search.category}
        brandFilter={search.brand}
        selectedGrade={search.grade}
        minPrice={search.minPrice}
        maxPrice={search.maxPrice}
        showOutOfStock={search.showOutOfStock}
      />

      {/* Quick View Dialog */}
      <QuickView
        slug={quickViewSlug}
        open={!!quickViewSlug}
        onOpenChange={(open) => {
          if (!open) setQuickViewSlug(null);
        }}
      />
    </div>
  );
}
