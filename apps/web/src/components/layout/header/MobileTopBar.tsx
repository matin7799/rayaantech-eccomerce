import { Link } from "@tanstack/react-router";
import PredictiveSearchBar from "./PredictiveSearchBar";
import ThemeToggle from "./ThemeToggle";

/**
 * MobileTopBar — Compact mobile header (< 1024px).
 * Contains: Brand logo, predictive search (compact), theme toggle.
 * No navigation links — those live in MobileBottomNav.
 */
export default function MobileTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface transition-colors duration-300 ease-in-out lg:hidden">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 no-underline" aria-label="صفحه اصلی رایان تک">
          <img
            src="/images/logo-icon.svg"
            alt="رایان تک"
            className="h-7 w-7"
            style={{ aspectRatio: "1 / 1" }}
          />
        </Link>

        {/* Predictive Search — compact mode */}
        <div className="flex-1">
          <PredictiveSearchBar compact />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
