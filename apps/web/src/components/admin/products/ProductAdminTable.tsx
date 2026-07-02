import { ImageIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

export type ProductGrade = "open_box" | "stock" | "refurbished" | "like_new" | "used";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  grade: string;
  basePrice: number;
  wholesalePrice: number | null;
  discountedPrice: number | null;
  torobPrice: number | null;
  stock: number;
  isActive: boolean;
  primaryCategoryId?: string | null;
  thumbnailUrl?: string | null;
  description?: string;
  shortDescription?: string;
  attributeValueIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductAdminTableProps {
  products: ProductRow[];
  categories: { id: string; name: string; slug: string }[];
  onEdit: (product: ProductRow) => void;
  onDelete?: (productId: string) => void;
}

const GRADE_CONFIG: Record<ProductGrade, { label: string; className: string }> = {
  open_box: { label: "اوپن‌باکس", className: "bg-warning/15 text-warning" },
  stock: { label: "استوک", className: "bg-accent/15 text-accent" },
  refurbished: { label: "ریفربیش", className: "bg-surface-secondary text-text-secondary" },
  like_new: { label: "در حد نو", className: "bg-success/15 text-success" },
  used: { label: "کارکرده", className: "bg-surface-secondary text-text-muted" },
};

export function ProductAdminTable({
  products,
  categories,
  onEdit,
  onDelete,
}: ProductAdminTableProps) {
  // Helper to find category name by ID
  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return "—";
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "—";
  };

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-border/50 bg-surface/80 backdrop-blur-md"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse text-right">
          <TableHeader className="bg-surface-secondary/40 border-b border-border/50">
            <TableRow>
              <TableHead className="py-4 pr-6 text-right font-medium text-text-muted text-xs">
                تصویر
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                عنوان و اسلاگ
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                گرید
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                دسته‌بندی اصلی
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                قیمت عمومی
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                قیمت همکار
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                قیمت ترب
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                موجودی انبار
              </TableHead>
              <TableHead className="py-4 px-4 text-right font-medium text-text-muted text-xs">
                وضعیت
              </TableHead>
              <TableHead className="py-4 pl-6 text-left font-medium text-text-muted text-xs" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center text-text-muted">
                  هیچ محصولی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const gradeConf = GRADE_CONFIG[product.grade as ProductGrade] || {
                  label: product.grade,
                  className: "bg-surface-secondary text-text-muted",
                };

                return (
                  <TableRow
                    key={product.id}
                    className="border-b border-border/30 hover:bg-surface-secondary/20 transition-colors"
                  >
                    {/* Thumbnail */}
                    <TableCell className="py-3 pr-6">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center aspect-square">
                        {product.thumbnailUrl ? (
                          <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-text-muted" />
                        )}
                      </div>
                    </TableCell>

                    {/* Name & Slug */}
                    <TableCell className="py-3 px-4 max-w-[200px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-text-primary text-sm line-clamp-1">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-text-muted line-clamp-1" dir="ltr">
                          {product.slug || product.sku || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Grade */}
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex rounded-lg px-2 py-0.5 text-[11px] font-medium ${gradeConf.className}`}
                      >
                        {gradeConf.label}
                      </span>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3 px-4 text-sm text-text-secondary">
                      {getCategoryName(product.primaryCategoryId)}
                    </TableCell>

                    {/* General Price */}
                    <TableCell className="py-3 px-4 text-sm font-semibold text-text-primary">
                      {product.basePrice.toLocaleString("fa-IR")}
                    </TableCell>

                    {/* Partner Price */}
                    <TableCell className="py-3 px-4 text-sm text-accent">
                      {product.wholesalePrice
                        ? product.wholesalePrice.toLocaleString("fa-IR")
                        : "—"}
                    </TableCell>

                    {/* Torob Price */}
                    <TableCell className="py-3 px-4 text-sm text-text-muted">
                      {product.torobPrice ? product.torobPrice.toLocaleString("fa-IR") : "—"}
                    </TableCell>

                    {/* Stock Indicator */}
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          product.stock === 0
                            ? "bg-danger/10 text-danger"
                            : product.stock < 5
                              ? "bg-warning/10 text-warning"
                              : "bg-success/10 text-success"
                        }`}
                      >
                        {product.stock === 0
                          ? "ناموجود"
                          : `${product.stock.toLocaleString("fa-IR")} عدد`}
                      </span>
                    </TableCell>

                    {/* Status Active Badge */}
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          product.isActive
                            ? "bg-success/15 text-success"
                            : "bg-surface-secondary text-text-muted"
                        }`}
                      >
                        {product.isActive ? "✓" : "—"}
                      </span>
                    </TableCell>

                    {/* Action Dropdown */}
                    <TableCell className="py-3 pl-6 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-lg cursor-pointer hover:bg-surface-secondary/40 flex items-center justify-center transition-colors">
                          <MoreVerticalIcon className="h-4 w-4 text-text-muted" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 text-right">
                          <DropdownMenuItem
                            onClick={() => onEdit(product)}
                            className="flex items-center justify-end gap-2 cursor-pointer text-xs"
                          >
                            <span>ویرایش محصول</span>
                            <PencilIcon className="h-3.5 w-3.5 text-text-muted" />
                          </DropdownMenuItem>
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(product.id)}
                              className="flex items-center justify-end gap-2 cursor-pointer text-danger focus:text-danger text-xs"
                            >
                              <span>حذف محصول</span>
                              <TrashIcon className="h-3.5 w-3.5" />
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
