"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { MainCategoryNode } from "../../../lib/group-products-hierarchical";
import { cn } from "../../../lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { ProductRow } from "./ProductRow";

interface MainCategoryBlockProps {
  main: MainCategoryNode;
  open: boolean;
  onToggle: () => void;
  onQuickView?: (slug: string) => void;
}

export function MainCategoryBlock({ main, open, onToggle, onQuickView }: MainCategoryBlockProps) {
  const productCount = main.subCategories.reduce(
    (sum, s) => sum + s.brands.reduce((b, br) => b + br.products.length, 0),
    0,
  );

  return (
    <Collapsible
      open={open}
      onOpenChange={onToggle}
      className="overflow-hidden rounded-2xl border border-[--glass-border] bg-surface/30 backdrop-blur-xl shadow-[--shadow-glass] transition-all duration-300"
    >
      <CollapsibleTrigger className="flex w-full select-none items-center gap-2.5 px-5 py-4 text-right hover:bg-white/3 active:bg-white/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-300 rtl:rotate-180",
            open && "-rotate-90 rtl:-rotate-90",
          )}
          aria-hidden="true"
        />
        <span className="text-sm font-bold text-text-primary tracking-tight">{main.name}</span>
        <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-[10px] font-semibold text-text-muted transition-colors group-hover:bg-accent/10 group-hover:text-accent">
          {productCount.toLocaleString("fa-IR")}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="flex flex-col gap-5 px-3 pb-5 pt-1.5">
        {main.subCategories.map((sub) => (
          <motion.div
            key={sub.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <h4 className="text-[11px] font-bold tracking-wider text-text-secondary border-r-2 border-accent/40 pr-2">
              {sub.name}
            </h4>

            {sub.brands.map((brand) => (
              <motion.div key={brand.id} layout className="flex flex-col gap-2">
                {/* Brand label separator */}
                <div className="flex items-center gap-3 py-1">
                  <span className="h-px flex-1 bg-[--glass-border]" />
                  <span className="text-[10px] font-bold text-text-muted/80 tracking-wide uppercase">
                    {brand.name}
                  </span>
                  <span className="h-px flex-1 bg-[--glass-border]" />
                </div>

                {/* Responsive Products container (no table overflow-x needed) */}
                <div className="flex flex-col rounded-xl overflow-hidden bg-surface/10 border border-[--glass-border]/40">
                  {brand.products.map((p, i) => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      delay={Math.min(i * 0.03, 0.3)}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
