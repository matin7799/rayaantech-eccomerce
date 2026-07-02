import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useScrollState } from "../../../lib/useScrollState";
import { useSession } from "../../../lib/useSession";
import { cn } from "../../../lib/utils";
import { CartDropdown } from "./CartDropdown";
import { MegaMenu } from "./MegaMenu";
import PredictiveSearchBar from "./PredictiveSearchBar";
import ThemeToggle from "./ThemeToggle";

/* ─── Navigation Links ─── */

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "صفحه اصلی", href: "/" },
  { label: "محصولات", href: "/products" },
  { label: "اقساط", href: "/installments" },
  { label: "مجله", href: "/blog" },
  { label: "درباره ما", href: "/about" },
];

/**
 * DesktopHeader — Full desktop navigation (≥ 1024px).
 *
 * CRITICAL: The `sticky top-0` MUST be on the outermost element
 * that participates in the document flow. A wrapper div with
 * `hidden lg:block` breaks sticky because its height === content height,
 * giving sticky zero scroll distance.
 *
 * Solution: Merge `hidden lg:block` and `sticky top-0 z-50` onto the
 * same `<header>` element. This makes it both responsive-visible AND sticky.
 */
export function DesktopHeader() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isScrolled, isCompact } = useScrollState(10, 80);
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleCatalogEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  }, []);

  const handleCatalogLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  }, []);

  const closeMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "hidden lg:block sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-border-light bg-surface-glass shadow-glass backdrop-blur-xl"
          : "border-transparent bg-surface/60 backdrop-blur-md",
      )}
    >
      {/* Inner content — constrained to 1440px with 32px horizontal padding */}
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1440px] items-center gap-4 px-8 transition-all duration-300",
          isCompact ? "h-14" : "h-16",
        )}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 no-underline"
          aria-label="صفحه اصلی رایان تک"
        >
          <img
            src="/images/logo-light.svg"
            alt="رایان تک"
            className="hidden h-8 w-auto dark:block"
            style={{ aspectRatio: "auto" }}
          />
          <img
            src="/images/logo-dark.svg"
            alt="رایان تک"
            className="block h-8 w-auto dark:hidden"
            style={{ aspectRatio: "auto" }}
          />
        </Link>

        {/* Navigation Box */}
        <nav
          className="flex shrink-0 items-center gap-0.5 rounded-xl border border-border-light bg-surface-secondary/50 px-1.5 py-1 shadow-md transition-colors duration-300 ease-in-out"
          aria-label="ناوبری اصلی"
        >
          {/* Catalog Trigger */}
          <div onMouseEnter={handleCatalogEnter} onMouseLeave={handleCatalogLeave}>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 ease-in-out hover:bg-surface-action hover:text-accent"
              aria-expanded={isMegaMenuOpen}
              aria-haspopup="true"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              <span>دسته‌بندی</span>
            </button>
          </div>

          {/* Route Links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary no-underline transition-colors duration-300 ease-in-out hover:bg-surface-action hover:text-accent"
              activeProps={{
                className:
                  "rounded-lg px-3 py-1.5 text-sm font-medium text-accent bg-surface-action no-underline",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Predictive Search Bar */}
        <div className="min-w-0 flex-1">
          <PredictiveSearchBar />
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-2.5">
          <CartDropdown />
          <ThemeToggle />
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isLoading) return;
              if (isAuthenticated) {
                navigate({ to: "/profile" as string });
              } else {
                navigate({ to: "/auth/login", search: { from: currentPath } });
              }
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border-light bg-surface text-text-secondary shadow-sm transition-all duration-300 ease-in-out hover:border-accent hover:text-accent hover:shadow-md"
            aria-label="حساب کاربری"
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-text-muted/30 border-t-text-muted" />
            ) : (
              <User className="h-4 w-4" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </div>

      {/* MegaMenu — overlay below header, constrained to 1440px */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <div
            onMouseEnter={handleCatalogEnter}
            onMouseLeave={handleCatalogLeave}
            className="absolute inset-x-0 top-full z-40 mx-auto flex w-full max-w-[1440px] justify-center px-8 pt-2"
          >
            <MegaMenu onClose={closeMegaMenu} />
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
