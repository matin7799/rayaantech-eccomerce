/**
 * TorobBanner — sticky top-of-viewport Liquid Glass countdown banner.
 *
 * Renders when an active Torob session is detected (remainingTTL > 0).
 * Displays the remaining time in Persian digits with a gentle pulse
 * animation on each second change.
 *
 * Design tokens (from ui-registry.md):
 * - Banner: `bg-surface/60 backdrop-blur-md border-b border-[--glass-border]`
 * - Active price: `text-accent`
 * - Muted text: `text-text-muted`
 *
 * Hydration safe:
 * - `useTorobCountdown` returns `isActive: false` during SSR (store is 0).
 * - The banner is empty during SSR → no layout shift.
 * - The `AnimatePresence` + framer-motion handles mount/unmount transitions.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Timer, X } from "lucide-react";
import { useTorobCountdown } from "../../lib/hooks/use-torob-countdown";
import { useTorobCountdownStore } from "../../lib/store/torob-countdown.store";

export function TorobBanner() {
  const { formatted, isActive } = useTorobCountdown();
  const remainingSeconds = useTorobCountdownStore((s) => s.remainingSeconds);
  const stop = useTorobCountdownStore((s) => s.stop);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="torob-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="sticky top-0 z-50 overflow-hidden bg-surface/60 backdrop-blur-md border-b border-[--glass-border]"
        >
          <div className="mx-auto flex h-9 max-w-page-max items-center justify-center gap-3 px-4">
            <Timer className="h-3.5 w-3.5 shrink-0 text-accent" />
            <p className="text-xs font-medium text-text-secondary">قیمت ویژه ترب فعال است —</p>
            <motion.span
              key={remainingSeconds}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-lg bg-accent/10 px-2.5 py-0.5 text-sm font-bold tabular-nums text-accent"
            >
              {formatted}
            </motion.span>
            <p className="text-xs text-text-muted">مانده</p>

            {/* Dismiss — stops the countdown locally (Redis session still runs) */}
            <button
              type="button"
              onClick={stop}
              className="absolute inset-e-3 flex h-5 w-5 items-center justify-center rounded-md text-text-muted/50 hover:text-text-muted transition-colors"
              aria-label="بستن بنر"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
