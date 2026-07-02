import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { ProductFiltersSidebar } from "./ProductFiltersSidebar";

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryFilter?: string;
  brandFilter?: string;
  selectedGrade?: string;
  minPrice?: number;
  maxPrice?: number;
  showOutOfStock?: boolean;
}

/**
 * MobileFilterDrawer — Bottom-sheet filter panel for mobile viewports.
 *
 * Controlled open state from parent (triggered by SortBar button).
 * Auto-closes when filters change (user selected a filter).
 * Contains full ProductFiltersSidebar with 1:1 parity.
 */
export function MobileFilterDrawer({
  open,
  onOpenChange,
  categoryFilter,
  brandFilter,
  selectedGrade,
  minPrice,
  maxPrice,
  showOutOfStock,
}: MobileFilterDrawerProps) {
  // Auto-close drawer when filters change (user selected a filter)
  const filterKey = `${categoryFilter}-${brandFilter}-${selectedGrade}-${minPrice}-${maxPrice}-${showOutOfStock}`;
  useEffect(() => {
    if (open) onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close only when filters change
  }, [filterKey]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[--glass-border] bg-white/40 dark:bg-black/40 px-6 pb-8 pt-2 backdrop-blur-xl"
      >
        {/* Drag handle indicator */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />

        <SheetHeader className="px-0">
          <SheetTitle className="text-sm font-semibold text-text-primary">فیلتر محصولات</SheetTitle>
        </SheetHeader>

        {/* Full filter sidebar */}
        <div className="mt-2">
          <ProductFiltersSidebar
            categoryFilter={categoryFilter}
            brandFilter={brandFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
