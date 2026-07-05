import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Rotating Persian teaser lines that occasionally pop out of the collapsed
 * AI chat button to invite the visitor into a consultation.
 */
const TEASERS = [
  "سلام! 👋 دنبال لپ‌تاپ یا موبایل می‌گردی؟",
  "بودجه‌تو بگو، بهترین گزینه رو برات پیدا می‌کنم ✨",
  "نمی‌دونی کدوم رو بخری؟ ازم بپرس 🤔",
  "گیمینگ، اداری یا برنامه‌نویسی؟ کمکت می‌کنم!",
  "استوک و اوپن‌باکس با قیمت عالی 🔥",
  "مشاوره تخصصی سخت‌افزار، همین حالا و رایگان!",
  "یه سوال بپرس، سریع جواب می‌گیری ⚡",
];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

interface ChatTeaserProps {
  /** Open the chat console when the teaser is clicked. */
  onOpen: () => void;
}

/**
 * ChatTeaser — self-scheduling speech bubble anchored above the chat FAB.
 *
 * Shows a random teaser for a few seconds, hides, waits a random gap, then
 * shows another. The visitor can dismiss it (X) to silence teasers for the
 * rest of the session.
 */
export function ChatTeaser({ onOpen }: ChatTeaserProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const lastIndex = useRef(-1);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  }, []);

  const scheduleNext = useCallback((delayMs: number) => {
    const showTimer = window.setTimeout(() => {
      // Pick a teaser different from the previous one.
      let idx = Math.floor(Math.random() * TEASERS.length);
      if (idx === lastIndex.current) idx = (idx + 1) % TEASERS.length;
      lastIndex.current = idx;
      setMessage(TEASERS[idx]);

      // Auto-hide after a readable window, then schedule the next appearance.
      const hideTimer = window.setTimeout(
        () => {
          setMessage(null);
          scheduleNext(randomBetween(12000, 22000));
        },
        randomBetween(5000, 7000),
      );
      timers.current.push(hideTimer);
    }, delayMs);
    timers.current.push(showTimer);
  }, []);

  useEffect(() => {
    if (dismissed) {
      clearTimers();
      setMessage(null);
      return;
    }
    // First teaser lands a few seconds after mount.
    scheduleNext(randomBetween(4000, 8000));
    return clearTimers;
  }, [dismissed, scheduleNext, clearTimers]);

  const handleClick = useCallback(() => {
    setMessage(null);
    onOpen();
  }, [onOpen]);

  return (
    <AnimatePresence>
      {message && !dismissed && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="fixed bottom-40 inset-e-4 z-50 flex max-w-[220px] items-start gap-2 md:bottom-24"
          dir="rtl"
        >
          <button
            type="button"
            onClick={handleClick}
            className="group relative flex items-start gap-2 rounded-2xl rounded-br-sm border border-accent/20 bg-surface/95 px-3.5 py-2.5 text-right shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-transform hover:scale-[1.03]"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
              <Sparkles className="h-3 w-3 text-accent" />
            </span>
            <span className="text-[11px] leading-relaxed text-text-primary">{message}</span>
            {/* little tail pointing to the FAB */}
            <span className="absolute -bottom-1.5 inset-e-5 h-3 w-3 rotate-45 border-b border-e border-accent/20 bg-surface/95" />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="بستن پیام"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface/90 text-text-muted shadow-sm transition-colors hover:text-text-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
