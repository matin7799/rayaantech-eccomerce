import { useEffect, useState } from "react";

/**
 * Scroll state thresholds and resulting flags.
 */
interface ScrollState {
  /** Whether user has scrolled past the initial threshold (e.g. 10px) */
  isScrolled: boolean;
  /** Whether user has scrolled significantly (e.g. 80px — for compact mode) */
  isCompact: boolean;
  /** Raw scroll Y position */
  scrollY: number;
}

/**
 * Hook that tracks window scroll position and returns state flags
 * for triggering header style variations (glassmorphism, padding, blur).
 *
 * @param scrolledThreshold - pixels after which isScrolled becomes true (default: 10)
 * @param compactThreshold - pixels after which isCompact becomes true (default: 80)
 */
export function useScrollState(scrolledThreshold = 10, compactThreshold = 80): ScrollState {
  const [state, setState] = useState<ScrollState>({
    isScrolled: false,
    isCompact: false,
    scrollY: 0,
  });

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setState({
            isScrolled: y > scrolledThreshold,
            isCompact: y > compactThreshold,
            scrollY: y,
          });
          ticking = false;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Set initial state
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolledThreshold, compactThreshold]);

  return state;
}
