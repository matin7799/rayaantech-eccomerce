import type { ReactNode } from "react";
import { useScrollState } from "../../../lib/useScrollState";
import { cn } from "../../../lib/utils";

interface HeaderShellProps {
  children: ReactNode;
}

/**
 * HeaderShell — Sticky glassmorphic navigation wrapper (mobile viewport).
 *
 * CSS Sticky rules:
 * - `sticky top-0 z-50 w-full` on the outermost element
 * - NO parent wrapper with overflow:hidden (breaks sticky)
 * - Inner content constrained to max-w-[1440px] mx-auto px-8
 *
 * Scroll states:
 * - Default (top): transparent bg, backdrop-blur-md
 * - Scrolled (>10px): glass bg + shadow + blur-xl + border
 * - Compact (>80px): reduced h-14 height
 */
export function HeaderShell({ children }: HeaderShellProps) {
  const { isScrolled, isCompact } = useScrollState(10, 80);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-border-light bg-surface-glass shadow-glass backdrop-blur-xl"
          : "border-transparent bg-surface/60 backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1440px] items-center gap-4 px-8 transition-all duration-300",
          isCompact ? "h-14 py-1.5" : "h-16 py-2",
        )}
      >
        {children}
      </div>
    </header>
  );
}
