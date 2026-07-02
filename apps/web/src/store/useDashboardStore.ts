import { create } from "zustand";

/**
 * Dashboard tab identifiers.
 */
export type DashboardTab =
  | "account"
  | "orders"
  | "transactions"
  | "installments"
  | "addresses"
  | "loyalty"
  | "wishlist"
  | "chat-history-ledger";

/**
 * Dashboard UI state — tracks active tab selection.
 * Lightweight Zustand store for client-side tab switching (no URL sub-routes).
 */
interface DashboardState {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "account",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
