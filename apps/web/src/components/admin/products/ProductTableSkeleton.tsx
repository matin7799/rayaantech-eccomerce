import { Skeleton } from "../../ui/skeleton";

export interface ProductTableSkeletonProps {
  rowCount?: number;
}

export function ProductTableSkeleton({ rowCount = 6 }: ProductTableSkeletonProps) {
  return (
    <div className="flex flex-col gap-6 w-full" dir="rtl">
      {/* Title & Button Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48 bg-surface-secondary" />
          <Skeleton className="h-4 w-72 bg-surface-secondary" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg bg-surface-secondary" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 p-4"
          >
            <Skeleton className="h-10 w-10 rounded-xl bg-surface-secondary" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-16 bg-surface-secondary" />
              <Skeleton className="h-3.5 w-24 bg-surface-secondary" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Pills Skeleton */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-4 w-4 bg-surface-secondary" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full bg-surface-secondary" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-surface/50 p-4">
        <div className="flex justify-between border-b border-border/50 pb-3">
          <Skeleton className="h-6 w-32 bg-surface-secondary" />
          <Skeleton className="h-6 w-24 bg-surface-secondary" />
          <Skeleton className="h-6 w-24 bg-surface-secondary" />
          <Skeleton className="h-6 w-24 bg-surface-secondary" />
          <Skeleton className="h-6 w-16 bg-surface-secondary" />
        </div>
        <div className="flex flex-col gap-3 mt-2">
          {Array.from({ length: rowCount }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <div className="flex items-center gap-3 w-1/3">
                <Skeleton className="h-10 w-10 rounded-lg bg-surface-secondary" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28 bg-surface-secondary" />
                  <Skeleton className="h-3 w-20 bg-surface-secondary" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 bg-surface-secondary" />
              <Skeleton className="h-4 w-20 bg-surface-secondary" />
              <Skeleton className="h-4 w-20 bg-surface-secondary" />
              <Skeleton className="h-4 w-12 bg-surface-secondary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
