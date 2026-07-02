import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

/**
 * Story data shape from the tRPC stories.list query.
 */
export interface StoryData {
  id: string;
  title: string;
  mediaUrl: string;
  productId: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    stock: number;
    inStock: boolean;
  } | null;
}

interface StoryItemProps {
  story: StoryData;
  onSelect: (story: StoryData) => void;
}

/**
 * StoryItem — Individual story thumbnail in the horizontal strip.
 * Uses framer-motion layoutId for seamless morphing into fullscreen modal.
 */
export function StoryItem({ story, onSelect }: StoryItemProps) {
  return (
    <motion.button
      type="button"
      layoutId={`story-${story.id}`}
      onClick={() => onSelect(story)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative flex shrink-0 flex-col items-center gap-1.5",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-full",
      )}
    >
      {/* Ring border */}
      <div className="rounded-full bg-gradient-to-br from-accent via-accent/70 to-accent/40 p-[2.5px]">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-surface sm:h-[72px] sm:w-[72px]">
          <motion.img
            src={story.mediaUrl}
            alt={story.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </div>
      {/* Title */}
      <span className="max-w-[72px] truncate text-[10px] font-medium text-text-secondary sm:text-xs">
        {story.title}
      </span>
    </motion.button>
  );
}
