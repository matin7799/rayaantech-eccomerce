import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeroSection } from "../components/storefront/hero";
import { HomeBanner } from "../components/storefront/home/HomeBanner";
import { ProductSlider } from "../components/storefront/home/ProductSlider";
import type { ProductCardData } from "../components/storefront/product";
import { QuickView } from "../components/storefront/product/QuickView";
import { ShoppableStories } from "../components/stories/ShoppableStories";
import { Skeleton } from "../components/ui/skeleton";
import { trpc } from "../lib/trpc";
import { useSession } from "../lib/useSession";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

const LAPTOP_SUB_CATEGORIES = [
  { name: "همه لپ‌تاپ‌ها", slug: "laptop" },
  { name: "گیمینگ", slug: "gaming-laptop" },
  { name: "تبلت شو", slug: "convertible-laptop" },
  { name: "اولترابوک", slug: "ultrabook" },
  { name: "لپتاپ  ", slug: "workstation-laptop" },
];

function LaptopFilterChips({
  activeCat,
  onChange,
}: {
  activeCat: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="flex gap-2 pb-1 scrollbar-none scroll-fade-x overflow-x-auto" dir="rtl">
      {LAPTOP_SUB_CATEGORIES.map((chip) => {
        const isActive = activeCat === chip.slug;
        return (
          <button
            key={chip.slug}
            type="button"
            onClick={() => onChange(chip.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer border",
              isActive
                ? "bg-accent border-accent text-[--color-on-accent] shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                : "bg-surface border-border text-text-secondary hover:border-accent/40 hover:text-accent",
            )}
          >
            {chip.name}
          </button>
        );
      })}
    </div>
  );
}

function SliderSection({
  title,
  query,
  variant,
  headerActions,
  wishlistIds,
  onQuickView,
}: {
  title: string;
  query: {
    isLoading: boolean;
    data?: {
      items: ProductCardData[];
    };
  };
  variant: "A" | "B" | "C";
  headerActions?: React.ReactNode;
  wishlistIds: Set<string>;
  onQuickView?: (slug: string) => void;
}) {
  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-4 px-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list of skeletons
            <Skeleton key={i} className="h-70 w-55 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const products = (query.data?.items ?? []).map((product) => ({
    ...product,
    isWishlisted: wishlistIds.has(product.id),
  }));

  return (
    <ProductSlider
      title={title}
      products={products}
      variant={variant}
      headerActions={headerActions}
      onQuickView={onQuickView}
    />
  );
}

function HomePage() {
  const [activeLaptopCat, setActiveLaptopCat] = useState("laptop");
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const { isAuthenticated } = useSession();

  // Fetch user wishlist if authenticated
  const wishlistQuery = trpc.profile.getWishlist.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const wishlistIds = new Set(wishlistQuery.data?.items?.map((item) => item.id) ?? []);

  // Fetch Category datasets using tRPC queries
  const laptopQuery = trpc.products.list.useQuery(
    { categoryId: activeLaptopCat, limit: 12 },
    { staleTime: 60_000 },
  );

  const mobileQuery = trpc.products.list.useQuery(
    { categoryId: "mobile", limit: 12 },
    { staleTime: 60_000 },
  );

  const consoleQuery = trpc.products.list.useQuery(
    { categoryId: "gaming-console", limit: 12 },
    { staleTime: 60_000 },
  );

  const aioQuery = trpc.products.list.useQuery(
    { categoryId: "all-in-one", limit: 12 },
    { staleTime: 60_000 },
  );

  const printerQuery = trpc.products.list.useQuery(
    { categoryId: "printer", limit: 12 },
    { staleTime: 60_000 },
  );

  const caseQuery = trpc.products.list.useQuery(
    { categoryId: "pc-case", limit: 12 },
    { staleTime: 60_000 },
  );

  const monitorQuery = trpc.products.list.useQuery(
    { categoryId: "monitor", limit: 12 },
    { staleTime: 60_000 },
  );

  return (
    <div className="mx-auto w-full max-w-page-max p-8 flex flex-col gap-6 pb-16" dir="rtl">
      {/* 0. Hero Section */}
      <HeroSection />

      {/* 0. Shoppable Stories */}
      <ShoppableStories />

      {/* 1. Category Block: Laptop (Variant A) with Sub-menu Filter Chips */}
      <SliderSection
        title="لپ‌تاپ"
        query={laptopQuery}
        variant="A"
        headerActions={
          <LaptopFilterChips activeCat={activeLaptopCat} onChange={setActiveLaptopCat} />
        }
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 2. Banner Node: home_after_laptop */}
      <HomeBanner placementKey="home_after_laptop" aspectRatio="21/9" />

      {/* 3. Category Block: Mobile (Variant B) */}
      <SliderSection
        title="گوشی موبایل"
        query={mobileQuery}
        variant="B"
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 4. Banner Node: home_after_mobile */}
      <HomeBanner placementKey="home_after_mobile" aspectRatio="16/5" />

      {/* 5. Category Block: Gaming Console (Variant C) */}
      <SliderSection
        title="کنسول بازی"
        query={consoleQuery}
        variant="C"
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 6. Banner Node: home_after_console */}
      <HomeBanner placementKey="home_after_console" aspectRatio="21/9" />

      {/* 7. Category Block: All-in-One AIO (Variant A) */}
      <SliderSection
        title="آل این وان (AIO)"
        query={aioQuery}
        variant="A"
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 8. Banner Node: home_after_aio */}
      <HomeBanner placementKey="home_after_aio" aspectRatio="16/5" />

      {/* 9. Category Block: Printer (Variant B) */}
      <SliderSection
        title="پرینتر"
        query={printerQuery}
        variant="B"
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 10. Banner Node: home_after_printer */}
      <HomeBanner placementKey="home_after_printer" aspectRatio="21/9" />

      {/* 11. Category Block: PC Case (Variant B) */}
      <SliderSection
        title="کیس کامپیوتر"
        query={caseQuery}
        variant="B"
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 12. Banner Node: home_after_case */}
      <HomeBanner placementKey="home_after_case" aspectRatio="16/5" />

      {/* 13. Category Block: Monitor (Variant C) */}
      <SliderSection
        title="مانیتور"
        query={monitorQuery}
        variant="C"
        wishlistIds={wishlistIds}
        onQuickView={setQuickViewSlug}
      />

      {/* 14. Banner Node: home_after_monitor */}
      <HomeBanner placementKey="home_after_monitor" aspectRatio="21/9" />

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
