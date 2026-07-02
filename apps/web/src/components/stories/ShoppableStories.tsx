import { AnimatePresence } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { trpc } from "../../lib/trpc";
import { Skeleton } from "../ui/skeleton";
import { StoryThumb } from "./StoryThumb";
import { StoryViewer } from "./StoryViewer";
import type { StoryItem } from "./types";

const SKELETON_ITEMS = [
  "story-sk-1",
  "story-sk-2",
  "story-sk-3",
  "story-sk-4",
  "story-sk-5",
  "story-sk-6",
  "story-sk-7",
  "story-sk-8",
  "story-sk-9",
  "story-sk-10",
  "story-sk-11",
  "story-sk-12",
  "story-sk-13",
  "story-sk-14",
  "story-sk-15",
  "story-sk-16",
  "story-sk-17",
  "story-sk-18",
  "story-sk-19",
  "story-sk-20",
];

function StoriesSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[--glass-border] bg-surface/30 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent/30 animate-pulse" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-5 w-12 rounded-lg" />
      </div>
      <div className="flex gap-4 overflow-hidden py-1 ps-1">
        {SKELETON_ITEMS.map((key) => (
          <div key={key} className="flex shrink-0 flex-col items-center gap-2">
            <Skeleton className="h-[72px] w-[72px] rounded-full" />
            <Skeleton className="h-3.5 w-14 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ShoppableStories — Instagram-style storefront stories scroller.
 * Implements mouse drag-to-scroll on desktop, native finger touch scroll on mobile,
 * and zero layout shifts.
 */
export function ShoppableStories() {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const storiesQuery = trpc.stories.list.useQuery(undefined, { staleTime: 60000 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const drag = dragInfoRef.current;
    drag.isDragging = true;
    drag.hasMoved = false;
    drag.startX = e.pageX - containerRef.current.offsetLeft;
    drag.scrollLeft = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const drag = dragInfoRef.current;
    if (!drag.isDragging) return;
    if (!containerRef.current) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - drag.startX) * 1.5; // Drag speed multiplier

    if (Math.abs(walk) > 5) {
      drag.hasMoved = true;
    }

    containerRef.current.scrollLeft = drag.scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    dragInfoRef.current.isDragging = false;
  };

  const handleStoryClick = (idx: number) => {
    // Only open story if it was a click, not a drag-scroll action
    if (!dragInfoRef.current.hasMoved) {
      setActiveStoryIdx(idx);
    }
  };

  const handleNext = useCallback(() => {
    const data = storiesQuery.data?.stories || [];
    setActiveStoryIdx((prev) => {
      if (prev === null) return null;
      return prev + 1 < data.length ? prev + 1 : null; // Close at end
    });
  }, [storiesQuery.data]);

  const handlePrev = useCallback(() => {
    setActiveStoryIdx((prev) => {
      if (prev === null) return null;
      return prev - 1 >= 0 ? prev - 1 : 0; // Stay on first or do nothing
    });
  }, []);

  const handleClose = useCallback(() => {
    setActiveStoryIdx(null);
  }, []);

  if (storiesQuery.isLoading) return <StoriesSkeleton />;
  if (!storiesQuery.data?.stories.length) return null;

  const stories: StoryItem[] = storiesQuery.data.stories;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[--glass-border] bg-surface/30 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <h3 className="text-xs font-bold text-text-primary">داستان‌های خریدنی</h3>
        </div>
        <span className="text-[10px] font-semibold text-text-secondary bg-surface-secondary px-2.5 py-1 rounded-lg">
          شاپ‌بل
        </span>
      </div>

      {/* Horizontal container wrapped with Linear Gradient Edge Fading Mask */}
      <div className="w-full scroll-fade-x overflow-x-auto">
        <section
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex gap-4 scroll-fade-x overflow-x-auto py-1 ps-1 select-none scrollbar-none cursor-grab active:cursor-grabbing scroll-smooth touch-pan-x"
          style={{ scrollbarWidth: "none" }}
          aria-label="استوری‌های شاپ‌بل"
        >
          {stories.map((story, idx) => (
            <StoryThumb key={story.id} story={story} onClick={() => handleStoryClick(idx)} />
          ))}
        </section>
      </div>

      <AnimatePresence>
        {activeStoryIdx !== null && (
          <StoryViewer
            stories={stories}
            activeIndex={activeStoryIdx}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
