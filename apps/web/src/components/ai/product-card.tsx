import type { AiMatchedProduct } from "@rayan-tech/types";
import { Package } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProductCardProps {
  product: AiMatchedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockColor = product.stock > 0 ? "text-success" : "text-danger";
  return (
    <a
      href={`/products/${product.slug}`}
      className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-secondary px-3 py-2 transition-all hover:border-accent/30 hover:shadow-sm"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
        <Package className="h-3.5 w-3.5 text-accent" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <span className="truncate text-[11px] font-medium text-text-primary">{product.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">
            {Number(product.basePrice).toLocaleString("fa-IR")} تومان
          </span>
          <span className={cn("text-[10px] font-medium", stockColor)}>
            {product.stock > 0 ? "موجود" : "ناموجود"}
          </span>
        </div>
      </div>
    </a>
  );
}
