import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { StoryCta } from "./StoryCta";
import type { StoryData } from "./StoryItem";
import { StoryProgressBar } from "./StoryProgressBar";

const STORY_DURATION_MS = 15_000;
const DISMISS_THRESHOLD = 120;

interface StoryModalProps {
  story: StoryData | null;
  onClose: () => void;
  onNext: () => void;
  hasNext: boolean;
}

/**
 * StoryModal — Fullscreen immersive story viewer.
 *
 * Features:
 * - Framer Motion layoutId morphing from thumbnail
 * - 15-second auto-advance progress bar (top)
 * - Touch drag-down swipe dismiss (mobile)
 * - Top-left exit button
 * - Product CTA overlay with stock-aware rendering
 */
export function StoryModal({ story, onClose, onNext, hasNext }: StoryModalProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragControls = useDragControls();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleProgressComplete = useCallback(() => {
    if (hasNext) {
      onNext();
    } else {
      onClose();
    }
  }, [hasNext, onNext, onClose]);

  const handlePointerDown = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPaused(false);
  }, []);

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          key="story-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Draggable story card */}
          <motion.div
            ref={containerRef}
            layoutId={`story-${story.id}`}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDrag={(_, info) => setDragY(info.offset.y)}
            onDragEnd={(_, info) => {
              if (info.offset.y > DISMISS_THRESHOLD) {
                onClose();
              }
              setDragY(0);
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={(e) => e.stopPropagation()}
            style={{ opacity: 1 - Math.min(Math.abs(dragY) / 400, 0.5) }}
            className="relative h-[85vh] w-full max-w-[420px] overflow-hidden rounded-2xl bg-black shadow-2xl sm:h-[90vh]"
          >
            {/* Progress bar */}
            <StoryProgressBar
              duration={STORY_DURATION_MS}
              isPaused={isPaused}
              onComplete={handleProgressComplete}
              resetKey={story.id}
            />

            {/* Close button — top-left */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 start-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="بستن"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Story media (video or image) */}
            <div className="absolute inset-0">
              {story.mediaUrl.includes(".mp4") || story.mediaUrl.includes(".webm") ? (
                <video
                  src={story.mediaUrl}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={story.mediaUrl}
                  alt={story.title}
                  className="h-full w-full object-cover"
                />
              )}
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            </div>

            {/* Bottom CTA overlay */}
            <div className="absolute inset-x-0 bottom-0 z-40 p-5">
              <StoryCta story={story} />
            </div>

            {/* Swipe hint indicator */}
            <div className="absolute bottom-1 inset-x-0 flex justify-center">
              <div className="h-1 w-10 rounded-full bg-white/30" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
