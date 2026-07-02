import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StoryProgressBarProps {
  /** Duration in milliseconds */
  duration: number;
  /** Whether the timer is paused (e.g. during touch hold) */
  isPaused: boolean;
  /** Callback when progress completes */
  onComplete: () => void;
  /** Reset key — changing this restarts the progress */
  resetKey: string;
}

/**
 * StoryProgressBar — 15-second auto-advance timeline indicator.
 * Renders at the top of the fullscreen story modal.
 * Supports pause/resume for touch interactions.
 */
export function StoryProgressBar({
  duration,
  isPaused,
  onComplete,
  resetKey,
}: StoryProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const elapsedRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Reset on key change
    setProgress(0);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
  }, [resetKey]);

  useEffect(() => {
    if (isPaused) {
      // Store elapsed time when pausing
      cancelAnimationFrame(rafRef.current);
      return;
    }

    // Resume from where we left off
    startTimeRef.current = Date.now() - elapsedRef.current;

    function tick() {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);

      if (pct >= 1) {
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, duration, onComplete, resetKey]);

  return (
    <div className="absolute top-0 inset-x-0 z-50 px-3 pt-3">
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-white"
          style={{ width: `${progress * 100}%` }}
          transition={{ duration: 0 }}
        />
      </div>
    </div>
  );
}
