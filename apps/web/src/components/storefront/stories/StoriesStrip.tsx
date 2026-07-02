import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { trpc } from "../../../lib/trpc";
import { type StoryData, StoryItem } from "./StoryItem";
import { StoryModal } from "./StoryModal";

/**
 * StoriesStrip — Horizontal scrollable strip of shoppable stories.
 * Fetches active stories via tRPC and opens fullscreen modal on tap.
 */
export function StoriesStrip() {
  const { data, isLoading } = trpc.stories.list.useQuery(undefined, {
    staleTime: 60_000,
  });

  const [activeStory, setActiveStory] = useState<StoryData | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stories = (data?.stories ?? []) as StoryData[];

  const handleSelect = (story: StoryData) => {
    const idx = stories.findIndex((s) => s.id === story.id);
    setActiveIndex(idx >= 0 ? idx : 0);
    setActiveStory(story);
  };

  const handleNext = () => {
    if (activeIndex < stories.length - 1) {
      const next = stories[activeIndex + 1];
      setActiveIndex(activeIndex + 1);
      setActiveStory(next);
    } else {
      setActiveStory(null);
    }
  };

  const handleClose = () => setActiveStory(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 px-[--spacing-container-padding] py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-surface-secondary sm:h-[72px] sm:w-[72px]"
          />
        ))}
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <>
      <section className="relative mx-auto max-w-[1440px] px-[--spacing-container-padding] py-4">
        {/* Scroll arrows */}
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute start-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-light bg-surface p-1.5 text-text-muted shadow-sm transition-colors hover:border-accent hover:text-accent hidden sm:flex"
          aria-label="قبلی"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          className="absolute end-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border-light bg-surface p-1.5 text-text-muted shadow-sm transition-colors hover:border-accent hover:text-accent hidden sm:flex"
          aria-label="بعدی"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scrollable strip */}
        <motion.div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {stories.map((story) => (
            <StoryItem key={story.id} story={story} onSelect={handleSelect} />
          ))}
        </motion.div>
      </section>

      {/* Fullscreen modal */}
      <StoryModal
        story={activeStory}
        onClose={handleClose}
        onNext={handleNext}
        hasNext={activeIndex < stories.length - 1}
      />
    </>
  );
}
