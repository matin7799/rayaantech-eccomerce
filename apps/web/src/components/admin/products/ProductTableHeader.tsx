import {
  AlertTriangleIcon,
  CheckCircleIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

export interface ProductTableHeaderProps {
  totalCount: number;
  activeCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddProduct: () => void;
}

export function ProductTableHeader({
  totalCount,
  activeCount,
  lowStockCount,
  outOfStockCount,
  searchTerm,
  onSearchChange,
  onAddProduct,
}: ProductTableHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, onSearchChange]);

  // Keep local search in sync with prop changes
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6 w-full" dir="rtl">
      {/* View Title & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">مدیریت محصولات</h1>
          <p className="text-sm text-text-muted">
            ماتریس قیمت‌گذاری خرده/همکار/ترب، کنترل موجودی انبار و طبقه‌بندی
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 cursor-pointer bg-accent hover:bg-accent/90 text-white"
          onClick={onAddProduct}
        >
          <PlusIcon className="h-4 w-4" />
          افزودن محصول جدید
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary">
            <PackageIcon className="h-5 w-5 text-text-secondary" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-text-primary">
              {totalCount.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-text-muted">کل محصولات</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10">
            <CheckCircleIcon className="h-5 w-5 text-success" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-success">
              {activeCount.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-text-muted">محصولات فعال</span>
          </div>
        </div>

        {/* Low Stock */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10">
            <AlertTriangleIcon className="h-5 w-5 text-warning" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-warning">
              {lowStockCount.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-text-muted">موجودی رو به اتمام (کمتر از ۵)</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10">
            <XCircleIcon className="h-5 w-5 text-danger" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-danger">
              {outOfStockCount.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-text-muted">ناموجود در انبار</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative w-full max-w-md">
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <SearchIcon className="h-4 w-4 text-text-muted" />
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="جستجوی محصول با نام یا SKU..."
          className="w-full rounded-xl border border-border bg-surface pr-10 pl-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-hidden transition-colors shadow-xs"
          dir="rtl"
        />
      </div>
    </div>
  );
}
