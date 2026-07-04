import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ThemeMode = "light" | "dark";

const TOGGLE_SPRING = { type: "spring" as const, stiffness: 500, damping: 50 };

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(mode);
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
}

/**
 * Triggers a circular clip-path reveal animation from the toggle button position.
 * Uses the View Transitions API where supported, falls back to instant swap.
 */
function animateThemeTransition(mode: ThemeMode, buttonEl: HTMLElement | null) {
  // Fallback: no View Transitions API support
  if (!document.startViewTransition) {
    applyThemeMode(mode);
    return;
  }

  // Calculate the circle origin from the button center
  const rect = buttonEl?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : 0;

  // Max radius = distance from origin to furthest corner
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    applyThemeMode(mode);
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

const ICON_VARIANTS = {
  initial: { scale: 0.6, opacity: 0, rotate: -90 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.6, opacity: 0, rotate: 90 },
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("light");
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* Deferred mount — avoids hydration mismatch */
  useEffect(() => {
    const storedMode = getStoredMode();
    setMode(storedMode);
    setMounted(true);
  }, []);

  const toggleMode = useCallback(() => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    window.localStorage.setItem("theme", nextMode);
    animateThemeTransition(nextMode, buttonRef.current);
  }, [mode]);

  const label = mode === "light" ? "تغییر به حالت تاریک" : "تغییر به حالت روشن";

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={mounted ? toggleMode : undefined}
      whileTap={mounted ? { scale: 0.9 } : undefined}
      whileHover={{ rotate: 15 }}
      aria-label={mounted ? label : "تغییر تم"}
      title={mounted ? label : "تغییر تم"}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border-light bg-surface text-text-secondary shadow-sm transition-all duration-300 ease-in-out hover:border-accent hover:text-accent hover:shadow-md"
    >
      {/* SSR skeleton — dimensionally correct empty slot */}
      {!mounted && <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true" />}

      {/* Client-side hydrated icon with spring entry animation.
          No mode="wait": the incoming icon cross-fades in while the outgoing
          one exits, so the button is never left empty mid-transition. */}
      <AnimatePresence initial={false}>
        {mounted && (
          <motion.span
            key={mode}
            variants={ICON_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TOGGLE_SPRING}
            className="absolute flex items-center justify-center"
          >
            {mode === "light" && <Sun className="h-4 w-4" aria-hidden="true" />}
            {mode === "dark" && <Moon className="h-4 w-4" aria-hidden="true" />}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
