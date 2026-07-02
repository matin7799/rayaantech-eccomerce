import { trpc } from "../../../lib/trpc";

/**
 * Category node shape from the tRPC tree query.
 */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: CategoryNode[];
}

/**
 * 24 hours in milliseconds — cache categories aggressively.
 */
const STALE_TIME_24H = 24 * 60 * 60 * 1000;

/**
 * Hook to fetch the category tree via tRPC with 24h stale time.
 * Returns the root-level categories with nested children for MegaMenu.
 */
export function useMegaMenuData() {
  const { data, isLoading, error } = trpc.categories.tree.useQuery(undefined, {
    staleTime: STALE_TIME_24H,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    categories: (data?.tree ?? []) as CategoryNode[],
    isLoading,
    error,
  };
}
