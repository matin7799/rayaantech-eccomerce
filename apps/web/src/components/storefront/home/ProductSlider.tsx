import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { cn } from "../../../lib/utils";
import { ProductCard, ProductCardCompact, type ProductCardData } from "../product";

interface ProductSliderProps {
  title: string;
  products: ProductCardData[];
  variant?: "A" | "B" | "C"; // A: Premium Reveal, B: Compact Grid, C: Immersive Spotlight
  headerActions?: React.ReactNode;
  onQuickView?: (slug: string) => void;
}

export function ProductSlider({
  title,
  products,
  variant = "A",
  headerActions,
  onQuickView,
}: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: "rtl",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (products.length === 0) return null;

  // Variant Styling configurations
  const isVariantA = variant === "A";
  const isVariantB = variant === "B";
  const isVariantC = variant === "C";

  return (
    <section className="flex flex-col gap-6 relative" dir="rtl">
      {/* Drifting background glow blobs to power the Liquid Glass refractions */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-20 h-56 w-56 rounded-full bg-accent/8 blur-[100px] animate-[pulse_6s_ease-infinite] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 -z-20 h-48 w-48 rounded-full bg-purple-500/8 blur-[90px] animate-[pulse_8s_ease-infinite] pointer-events-none" />

      {/* Header Slot */}
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2",
          isVariantA &&
            "relative rounded-2xl border border-[--glass-border] bg-[--glass-backdrop]/80 backdrop-blur-md px-6 py-4 shadow-lg before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-[linear-gradient(270deg,var(--color-accent),#8b5cf6,#ec4899,var(--color-accent))] before:bg-size-[400%_400%] before:opacity-15 before:animate-[header-glow_8s_ease_infinite]",
        )}
      >
        <div className="flex flex-wrap items-center gap-4">
          <h2
            className={cn(
              "text-base font-semibold text-text-primary",
              isVariantC && "text-lg font-bold tracking-tight text-accent",
            )}
          >
            {title}
          </h2>
          {headerActions}
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <motion.button
            type="button"
            onClick={scrollNext}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-accent/40 hover:text-accent shadow-sm"
            aria-label="بعدی"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </motion.button>
          <motion.button
            type="button"
            onClick={scrollPrev}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-accent/40 hover:text-accent shadow-sm"
            aria-label="قبلی"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </motion.button>
        </div>
      </div>

      {/* Carousel Wrapper with Linear Gradient Edge Fading Mask */}
      <div
        ref={emblaRef}
        className="overflow-hidden px-1 py-2 scroll-fade-x overflow-x-auto scrollbar-none"
      >
        <div className="flex gap-4">
          {products.map((product) => {
            if (isVariantB) {
              return (
                <div key={product.id} className="shrink-0" style={{ width: "300px" }}>
                  <ProductCardCompact
                    product={product}
                    isWishlisted={product.isWishlisted}
                    onQuickView={onQuickView}
                  />
                </div>
              );
            }

            if (isVariantC) {
              return (
                <div
                  key={product.id}
                  className="shrink-0 group/spotlight relative p-[1px] rounded-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ width: "235px" }}
                >
                  {/* Subtle frosted glass backpanel */}
                  <div className="absolute inset-0 -z-15 rounded-2xl bg-white/[0.01] backdrop-blur-md opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-300" />

                  {/* Neon spotlight backdrop */}
                  <div className="absolute inset-0 -z-20 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,transparent_65%)] opacity-0 blur-xl transition-all duration-500 group-hover/spotlight:opacity-100 group-hover/spotlight:scale-110" />

                  {/* Gradient border ring revealed on hover */}
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-transparent p-[1.5px] transition-all duration-500 group-hover/spotlight:from-accent/50 group-hover/spotlight:via-purple-500/20 group-hover/spotlight:to-accent/50" />

                  <ProductCard
                    product={product}
                    isWishlisted={product.isWishlisted}
                    onQuickView={onQuickView}
                  />
                </div>
              );
            }

            // Default / Variant A (Premium Reveal)
            return (
              <div key={product.id} className="shrink-0" style={{ width: "220px" }}>
                <ProductCard
                  product={product}
                  isWishlisted={product.isWishlisted}
                  onQuickView={onQuickView}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
