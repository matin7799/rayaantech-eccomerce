import { trpc } from "./trpc";

/**
 * Session state shape exposed to the UI.
 */
export interface SessionState {
  /** Whether the session query has resolved (no layout jank during loading) */
  isLoading: boolean;
  /** Whether the user has an active authenticated session */
  isAuthenticated: boolean;
  /** Session data if authenticated, null otherwise */
  session: {
    userId: string;
    mobile: string;
    role: string;
  } | null;
}

/**
 * useSession — Global session state hook backed by trpc.auth.me.
 *
 * staleTime is intentionally short (10s) to ensure invalidation triggers
 * immediate refetches after login/logout mutations. The query itself is
 * lightweight (single Redis lookup) so frequent fetches are acceptable.
 *
 * gcTime (30min) keeps the data in cache to prevent layout jank on
 * component remounts, while staleTime controls when refetches happen.
 */
export function useSession(): SessionState {
  const { data, isLoading } = trpc.auth.me.useQuery(undefined, {
    staleTime: 10_000, // 10 seconds — allows invalidation to trigger refetch promptly
    gcTime: 30 * 60 * 1000, // 30 minutes — prevents GC during navigation
    retry: false,
    refetchOnWindowFocus: true, // Catch session expiry when user returns to tab
    refetchOnMount: "always", // Always check on mount to catch post-login state
  });

  return {
    isLoading,
    isAuthenticated: !!data?.session,
    session: data?.session ?? null,
  };
}
