/**
 * Torob Countdown Store — Zustand visual-only clock.
 *
 * Tracks the remaining Torob session TTL locally. Hydrated from the
 * `pricing.context` tRPC response; ticks down via `useEffect` interval
 * in `useTorobCountdown`. On expiry (≤ 0), signals that product queries
 * should be invalidated to revert prices to baseline retail.
 *
 * INVARIANT: This store is display-only. The authoritative TTL lives in
 * Redis and is resolved server-side. The local clock may drift ±2s —
 * `pricing.context` re-fetches every 60s for drift correction.
 */
import { create } from "zustand";

interface TorobCountdownState {
  /** Remaining seconds. 0 = no active Torob session. */
  remainingSeconds: number;
  /** Whether the store has been hydrated from a server response at least once. */
  hydrated: boolean;
  /** Whether the countdown just expired (for one-shot invalidation trigger). */
  justExpired: boolean;

  /** Hydrate from a server-provided TTL. */
  hydrate: (ttl: number) => void;
  /** Decrement by one second (called by the interval hook). */
  tick: () => void;
  /** Mark that the session has expired and prices should revert. */
  markExpired: () => void;
  /** Stop the countdown (e.g. when navigating away). */
  stop: () => void;
}

export const useTorobCountdownStore = create<TorobCountdownState>()((set) => ({
  remainingSeconds: 0,
  hydrated: false,
  justExpired: false,

  hydrate: (ttl: number) => {
    if (ttl > 0) {
      set({ remainingSeconds: ttl, hydrated: true, justExpired: false });
    } else {
      set({ remainingSeconds: 0, hydrated: true, justExpired: false });
    }
  },

  tick: () => {
    set((prev) => {
      if (prev.remainingSeconds <= 0) return prev;
      const next = prev.remainingSeconds - 1;
      return {
        remainingSeconds: next,
        // Signal expiry on the tick that hits zero
        justExpired: next === 0 && prev.remainingSeconds > 0,
      };
    });
  },

  markExpired: () => {
    set({ remainingSeconds: 0, justExpired: false });
  },

  stop: () => {
    set({ remainingSeconds: 0, hydrated: false, justExpired: false });
  },
}));
