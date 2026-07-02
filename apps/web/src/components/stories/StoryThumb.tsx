import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { StoryItem } from "./types";

interface StoryThumbProps {
  story: StoryItem;
  onClick: () => void;
}

/**
 * StoryThumb — Instagram-style circular story thumbnail.
 * Highlights with a premium gradient ring. Shows a success dot if linked product is in stock.
 */
export function StoryThumb({ story, onClick }: StoryThumbProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex shrink-0 flex-col items-center gap-1.5 focus:outline-none"
      aria-label={`مشاهده استوری ${story.title}`}
    >
      <div className="relative h-[72px] w-[72px] rounded-full bg-linear-to-br from-accent via-accent/70 to-accent/40 p-[3px] shadow-sm hover:shadow-md transition-shadow">
        <div className="h-full w-full overflow-hidden rounded-full border-2 border-surface bg-surface-secondary">
          {story.mediaUrl ? (
            <img
              src={story.mediaUrl}
              alt={story.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play className="h-5 w-5 text-accent" />
            </div>
          )}
        </div>
        {story.product?.inStock && (
          <span className="absolute bottom-0 inset-e-0 h-4 w-4 rounded-full border-2 border-surface bg-success shadow-xs" />
        )}
      </div>
      <span className="max-w-[72px] truncate text-[10px] font-medium text-text-primary">
        {story.title}
      </span>
    </motion.button>
  );
}
