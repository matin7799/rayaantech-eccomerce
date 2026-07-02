import { createFileRoute, type ErrorComponentProps, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangleIcon, FilterIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import {
  ProductAdminTable,
  type ProductRow,
} from "../../components/admin/products/ProductAdminTable";
import { ProductEditDialog } from "../../components/admin/products/ProductEditDialog";
import { ProductTableHeader } from "../../components/admin/products/ProductTableHeader";
import { ProductTableSkeleton } from "../../components/admin/products/ProductTableSkeleton";
import { Button } from "../../components/ui/button";
import { trpc } from "../../lib/trpc";

// Define strict types and config
type ProductGrade = "open_box" | "stock" | "refurbished" | "like_new" | "used";

const GRADE_CONFIG: Record<ProductGrade, { label: string; className: string }> = {
  open_box: { label: "اوپن‌باکس", className: "bg-warning/15 text-warning" },
  stock: { label: "استوک", className: "bg-accent/15 text-accent" },
  refurbished: { label: "ریفربیش", className: "bg-surface-secondary text-text-secondary" },
  like_new: { label: "در حد نو", className: "bg-success/15 text-success" },
  used: { label: "کارکرده", className: "bg-surface-secondary text-text-muted" },
};

const ALL_GRADES: ProductGrade[] = ["open_box", "stock", "refurbished", "like_new", "used"];

// Define TanStack Router Search Schema for Deep-Linking
const productsSearchSchema = z.object({
  search: z.string().catch("").optional().default(""),
  grades: z.string().catch("").optional().default(""),
});

export const Route = createFileRoute("/admin/products")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  component: ProductsLedger,
  errorComponent: AdminProductsErrorComponent,
});

function ProductsLedger() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Dialog State
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Queries
  const productsQuery = trpc.admin.listProducts.useQuery();
  const categoriesQuery = trpc.admin.listCategories.useQuery();

  const allProducts = (productsQuery.data?.products ?? []) as ProductRow[];
  const categories = categoriesQuery.data?.categories ?? [];

  // Parse filters from URL Search Params
  const activeGrades = searchParams.grades
    ? (searchParams.grades.split(",").filter(Boolean) as ProductGrade[])
    : [];

  const handleSearchChange = (term: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: term }),
    });
  };

  const toggleGrade = (grade: ProductGrade) => {
    const nextGrades = activeGrades.includes(grade)
      ? activeGrades.filter((g) => g !== grade)
      : [...activeGrades, grade];

    navigate({
      search: (prev) => ({ ...prev, grades: nextGrades.join(",") }),
    });
  };

  const clearFilters = () => {
    navigate({
      search: (prev) => ({ ...prev, search: "", grades: "" }),
    });
  };

  // Compute stats on overall list
  const totalCount = allProducts.length;
  const activeCount = allProducts.filter((p) => p.isActive).length;
  const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

  // Filter products client-side
  const filteredProducts = allProducts.filter((product) => {
    // 1. Grade filter
    if (activeGrades.length > 0 && !activeGrades.includes(product.grade as ProductGrade)) {
      return false;
    }
    // 2. Search query filter
    if (searchParams.search) {
      const searchLower = searchParams.search.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const skuMatch = product.sku?.toLowerCase().includes(searchLower) ?? false;
      const slugMatch = product.slug.toLowerCase().includes(searchLower);
      return nameMatch || skuMatch || slugMatch;
    }
    return true;
  });

  const handleEdit = (product: ProductRow) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  if (productsQuery.isLoading || categoriesQuery.isLoading) {
    return <ProductTableSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 w-full" dir="rtl">
      {/* Table Header Section */}
      <ProductTableHeader
        totalCount={totalCount}
        activeCount={activeCount}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
        searchTerm={searchParams.search}
        onSearchChange={handleSearchChange}
        onAddProduct={handleAdd}
      />

      {/* Grade Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterIcon className="h-4 w-4 text-text-muted" aria-hidden="true" />
        {ALL_GRADES.map((grade) => {
          const config = GRADE_CONFIG[grade];
          const isActive = activeGrades.includes(grade);
          return (
            <motion.button
              key={grade}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleGrade(grade)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer ${
                isActive
                  ? config.className
                  : "bg-surface-secondary text-text-muted hover:text-text-secondary"
              }`}
            >
              {config.label}
              {isActive && <XIcon className="h-3 w-3" />}
            </motion.button>
          );
        })}
        {(activeGrades.length > 0 || searchParams.search) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-accent hover:underline cursor-pointer"
          >
            پاک کردن فیلترها
          </button>
        )}
      </div>

      {/* Product Admin Table */}
      <ProductAdminTable products={filteredProducts} categories={categories} onEdit={handleEdit} />

      {/* Product Edit / Add Dialog */}
      <ProductEditDialog
        product={selectedProduct}
        categories={categories}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => productsQuery.refetch()}
      />
    </div>
  );
}

// Intercept database/server errors gracefully
function AdminProductsErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
      dir="rtl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text-primary">
          خطا در بارگذاری اطلاعات محصولات
        </h2>
        <p className="text-sm text-text-muted">
          مشکلی در برقراری ارتباط با پایگاه داده یا سرور tRPC پیش آمده است.
        </p>
      </div>
      {error && (
        <pre
          className="max-w-md overflow-auto rounded-lg bg-surface px-3 py-2 text-left text-xs text-danger"
          dir="ltr"
        >
          {error.message || String(error)}
        </pre>
      )}
      <Button variant="outline" size="sm" onClick={() => reset()} className="cursor-pointer">
        تلاش مجدد
      </Button>
    </div>
  );
}
