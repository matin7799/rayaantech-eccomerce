/**
 * useTorobCountdown — hydration-safe countdown hook for TanStack Start SSR.
 *
 * Hydrates the Zustand countdown store from the `pricing.context` tRPC query
 * and starts a 1-second tick interval post-mount (useEffect).
 *
 * On TTL expiry (remainingSeconds hits 0), automatically invalidates all
 * `products.*` and `pricing.*` query cache entries so prices revert to
 * baseline retail server-side.
 *
 * SSR safety:
 * - The tRPC query runs on both server and client.
 * - The `useEffect` interval only starts on the client (post-mount).
 * - The store's `remainingSeconds` is 0 by default → no countdown rendered
 *   during SSR hydration → no layout jank.
 */
import { useEffect, useRef } from "react";
import { useTorobCountdownStore } from "../store/torob-countdown.store";
import { trpc } from "../trpc";

/**
 * Format remaining seconds into mm:ss with Persian digits.
 */
export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const toPersian = (n: number) =>
    String(n)
      .padStart(2, "0")
      .split("")
      .map((d) => persianDigits[Number.parseInt(d, 10)] ?? d)
      .join("");
  return `${toPersian(m)}:${toPersian(s)}`;
}
export function TorobCountdownSync() {
  const utils = trpc.useUtils();
  const expiryHandled = useRef(false);

  // Fetch pricing context for drift correction (60s refetch)
  const pricingQuery = trpc.pricing.context.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const { hydrate, tick, justExpired, markExpired } = useTorobCountdownStore();
  const remainingSeconds = useTorobCountdownStore((s) => s.remainingSeconds);

  // Hydrate store from server response
  useEffect(() => {
    const ttl = pricingQuery.data?.remainingTorobTtl ?? 0;
    if (ttl > 0) {
      hydrate(ttl);
      expiryHandled.current = false;
    } else if (pricingQuery.data) {
      markExpired();
    }
  }, [pricingQuery.data, hydrate, markExpired]);

  // 1-second tick interval (runs exactly once globally)
  const isTimerActive = remainingSeconds > 0;
  useEffect(() => {
    if (!isTimerActive) return;

    const id = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(id);
  }, [tick, isTimerActive]);

  // Handle expiry — invalidate product queries to revert prices
  useEffect(() => {
    if (justExpired && !expiryHandled.current) {
      expiryHandled.current = true;
      void utils.products.list.invalidate();
      void utils.products.bySlug.invalidate();
      void utils.pricing.context.invalidate();
      markExpired();
    }
  }, [justExpired, utils, markExpired]);

  return null;
}

/**
 * useTorobCountdown — call in any component that needs Torob countdown state.
 *
 * Returns the formatted countdown string and whether the session is active.
 * Reads directly from the global Zustand store to avoid running duplicate intervals.
 */
export function useTorobCountdown(): {
  /** Formatted "mm:ss" countdown string (Persian digits). Empty when inactive. */
  formatted: string;
  /** Whether a Torob countdown is actively ticking. */
  isActive: boolean;
  /** Raw remaining seconds (for custom formatting). */
  remainingSeconds: number;
} {
  const remainingSeconds = useTorobCountdownStore((s) => s.remainingSeconds);
  const isActive = remainingSeconds > 0;

  return {
    formatted: isActive ? formatCountdown(remainingSeconds) : "",
    isActive,
    remainingSeconds,
  };
}
