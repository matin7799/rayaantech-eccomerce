import { create } from "zustand";

/**
 * Interface representing the standard browser beforeinstallprompt event parameters.
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Zustand state store schema for tracking PWA transient states.
 */
export interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  hasBeenRewarded: boolean;
  setDeferredPrompt: (event: BeforeInstallPromptEvent | null) => void;
  setIsInstallable: (bool: boolean) => void;
  markAsRewarded: () => void;
}

/**
 * Type-safe Zustand store holding the transient PWA installation and reward state.
 * Uses named exports to align with enterprise monorepo rules.
 */
export const usePwaStore = create<PwaState>((set) => ({
  deferredPrompt: null,
  isInstallable: false,
  hasBeenRewarded:
    typeof window !== "undefined" ? localStorage.getItem("rayan_pwa_rewarded") === "true" : false,
  setDeferredPrompt: (event) => set({ deferredPrompt: event }),
  setIsInstallable: (bool) => set({ isInstallable: bool }),
  markAsRewarded: () => set({ hasBeenRewarded: true }),
}));
