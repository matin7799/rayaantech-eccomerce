import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { HierarchicalProductTable } from "../../../components/storefront/product/HierarchicalProductTable";
import { QuickView } from "../../../components/storefront/product/QuickView";
import { ScrollArea } from "../../../components/ui/scroll-area";

const partnerProductsSearchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/_partner/partner/products")({
  component: PartnerProductsPage,
  validateSearch: partnerProductsSearchSchema,
});

function PartnerProductsPage() {
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col gap-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">
          کاتالوگ محصولات همکار
        </h1>
        <p className="text-sm text-text-secondary">
          کاتالوگ کامل و اختصاصی محصولات به همراه قیمت‌گذاری همکار و موجودی انبار.
        </p>
      </div>

      {/* Catalog Container wrapped in ScrollArea for mobile overflow guarantee */}
      <div className="border border-border bg-surface/30 backdrop-blur-md rounded-2xl overflow-hidden p-6 shadow-xs">
        <ScrollArea className="h-[calc(100vh-16rem)] w-full">
          <HierarchicalProductTable onQuickView={setQuickViewSlug} />
        </ScrollArea>
      </div>

      {/* Interactive QuickView Overlay */}
      <QuickView slug={quickViewSlug} onClose={() => setQuickViewSlug(null)} />
    </div>
  );
}
