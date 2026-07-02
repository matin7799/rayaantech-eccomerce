import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../ui/skeleton";

interface HomeBannerProps {
  placementKey: string;
  aspectRatio?: "21/9" | "16/5";
}

/**
 * HomeBanner — DB-driven banner placement component.
 * Fetches banners by placementKey and renders as responsive image blocks.
 * Wrapped in anti-layout-shift aspect-ratio container with glass styling.
 */
export function HomeBanner({ placementKey, aspectRatio = "21/9" }: HomeBannerProps) {
  const bannersQuery = trpc.banners.getByPlacement.useQuery(
    { placementKey },
    { staleTime: 120_000 },
  );

  const aspectClass = aspectRatio === "16/5" ? "aspect-[16/5]" : "aspect-[21/9]";

  if (bannersQuery.isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md w-full">
        <Skeleton className={cn("w-full", aspectClass)} />
      </div>
    );
  }

  const banners = bannersQuery.data?.banners ?? [];
  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.linkUrl ?? "#"}
          className="group overflow-hidden rounded-2xl border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md transition-all hover:shadow-md"
        >
          <div className={cn("w-full overflow-hidden", aspectClass)}>
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </a>
      ))}
    </div>
  );
}
