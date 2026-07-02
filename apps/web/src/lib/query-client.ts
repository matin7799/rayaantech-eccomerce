import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient factory for the app.
 * Configured with sensible defaults for an e-commerce storefront.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale after 30 seconds — keeps product data fresh
        staleTime: 30_000,
        // Retry failed requests once
        retry: 1,
        // Don't refetch when window regains focus (prevents UI flicker)
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
