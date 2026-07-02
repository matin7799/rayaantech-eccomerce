import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CalendarClock, Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "../../../lib/store";
import { useSession } from "../../../lib/useSession";

/* ─── Tab Types ─── */

interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** If true, this tab requires auth gating */
  authGated?: boolean;
}

const NAV_TABS: readonly NavTab[] = [
  { id: "products", label: "محصولات", href: "/products", icon: ShoppingBag },
  { id: "installments", label: "اقساط", href: "/installments", icon: CalendarClock },
  { id: "home", label: "خانه", href: "/", icon: Home },
  { id: "cart", label: "سبد", href: "/cart", icon: ShoppingCart },
  { id: "profile", label: "پروفایل", href: "/profile", icon: User, authGated: true },
];

const TAP_SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const POP_SPRING = { type: "spring" as const, stiffness: 500, damping: 28 };

/**
 * MobileBottomNav — Premium bottom tab bar (< 1024px).
 *
 * Features:
 * - Active tab pops up with a bouncy spring and elevated green pill
 * - Sliding layoutId pill for smooth transitions between tabs
 * - Elastic whileTap micro-scaling with haptic vibration feedback
 * - Cart badge with spring entry animation
 * - Auth gating for profile tab
 * - Safe-area padding for devices with home indicators
 */
export default function MobileBottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();

  // Direct selector on items array — Zustand re-renders when items reference changes
  const totalItems = useCartStore((s) => s.items.reduce((acc, item) => acc + item.quantity, 0));

  // SSR hydration guard — only show badge after client mount
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const badgeCount = hydrated ? totalItems : 0;

  function isActive(href: string): boolean {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  }

  /** Trigger subtle haptic vibration on supported devices */
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  /** Handle auth-gated tab click — intercept and redirect if not authenticated */
  const handleAuthGatedClick = useCallback(
    (e: React.MouseEvent, tab: NavTab) => {
      if (!tab.authGated) return;

      e.preventDefault();
      e.stopPropagation();

      if (isLoading) return;

      if (isAuthenticated) {
        navigate({ to: tab.href as string });
      } else {
        navigate({ to: "/auth/login", search: { from: currentPath } });
      }
    },
    [isAuthenticated, isLoading, navigate, currentPath],
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-colors duration-300 ease-in-out lg:hidden"
      aria-label="ناوبری اصلی موبایل"
    >
      <div className="flex h-[72px] items-end justify-around px-3 pb-2">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.id}
              to={tab.authGated ? (isAuthenticated ? tab.href : "/auth/login") : tab.href}
              className="flex flex-1 no-underline"
              onClick={(e: React.MouseEvent) => {
                triggerHaptic();
                if (tab.authGated) handleAuthGatedClick(e, tab);
              }}
            >
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={TAP_SPRING}
                className="flex w-full flex-col items-center gap-1"
              >
                {/* Icon container with pop-out animation */}
                <AnimatePresence mode="wait">
                  {active ? (
                    <motion.div
                      key={`${tab.id}-active`}
                      layoutId="activeMobileTab"
                      initial={{ scale: 0.7, y: 4, opacity: 0 }}
                      animate={{ scale: 1, y: -14, opacity: 1 }}
                      exit={{ scale: 0.7, y: 4, opacity: 0 }}
                      transition={POP_SPRING}
                      className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/30"
                    >
                      <Icon className="h-5.5 w-5.5 text-white" aria-hidden="true" />
                      {/* Cart badge on active state */}
                      {tab.id === "cart" && badgeCount > 0 && (
                        <motion.span
                          key={badgeCount}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-accent"
                        >
                          {badgeCount}
                        </motion.span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${tab.id}-inactive`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="relative flex h-10 w-10 items-center justify-center"
                    >
                      {/* Show loading spinner for auth-gated tabs while session resolves */}
                      {tab.authGated && isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-muted/30 border-t-text-muted" />
                      ) : (
                        <Icon
                          className="h-5 w-5 text-text-muted transition-colors duration-300"
                          aria-hidden="true"
                        />
                      )}
                      {/* Cart badge on inactive state */}
                      {tab.id === "cart" && badgeCount > 0 && (
                        <motion.span
                          key={badgeCount}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
                        >
                          {badgeCount}
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Label */}
                <motion.span
                  animate={{
                    color: active ? "var(--color-accent)" : "var(--color-text-muted)",
                    fontWeight: active ? 600 : 500,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px]"
                >
                  {tab.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
