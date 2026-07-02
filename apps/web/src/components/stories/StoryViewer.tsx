import { motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useCartStore } from "../../lib/store/cart.store";
import { Badge } from "../ui/badge";
import type { StoryItem } from "./types";

interface StoryViewerProps {
  stories: StoryItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

/**
 * StoryViewer — Full-screen liquid-glass Instagram-style stories viewer.
 * Splitted mathematically into tap boundaries: Left 25% (next), Right 25% (prev), Center 50% (play/pause).
 */
export function StoryViewer({ stories, activeIndex, onClose, onNext, onPrev }: StoryViewerProps) {
  const currentStory = stories[activeIndex];
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [mounted, setMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const durationRef = useRef<number>(10000); // Default 10s for images

  const addItem = useCartStore((s) => s.addItem);

  // Mount logic for SSR portal compatibility
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Detect media type from URL
  useEffect(() => {
    if (!currentStory?.mediaUrl) return;
    const isVid = /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(currentStory.mediaUrl);
    setIsVideo(isVid);
    setProgress(0);
    elapsedRef.current = 0;
    setIsPaused(false);
    durationRef.current = isVid ? 60000 : 10000; // Reset default durations
  }, [currentStory]);

  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current && isVideo) {
      const videoDurationMs = videoRef.current.duration * 1000;
      // Strict playtime limit of 60 seconds (60000ms)
      durationRef.current = Math.min(videoDurationMs, 60000);
      if (!isPaused) {
        videoRef.current.play().catch(() => setIsPaused(true));
      }
    }
  }, [isVideo, isPaused]);

  // Frame progress loop
  const animateProgress = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current + elapsedRef.current;
      const d = durationRef.current;
      const currentProgress = Math.min((elapsed / d) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= d) {
        onNext();
      } else {
        requestRef.current = requestAnimationFrame(animateProgress);
      }
    },
    [onNext],
  );

  const pausePlayback = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (startTimeRef.current) {
      elapsedRef.current += performance.now() - startTimeRef.current;
      startTimeRef.current = 0;
    }
  }, []);

  const playPlayback = useCallback(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.play().catch(() => setIsPaused(true));
    }
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animateProgress);
  }, [isVideo, animateProgress]);

  // Handle Play/Pause timer state
  useEffect(() => {
    if (isPaused) {
      pausePlayback();
    } else {
      playPlayback();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPaused, playPlayback, pausePlayback]);

  // Split view click actions
  const handleViewportTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;

    if (pct < 0.25) {
      // Left 25%: Next segment (RTL flow)
      setProgress(0);
      elapsedRef.current = 0;
      startTimeRef.current = 0;
      onNext();
    } else if (pct > 0.75) {
      // Right 25%: Previous segment (RTL flow)
      setProgress(0);
      elapsedRef.current = 0;
      startTimeRef.current = 0;
      onPrev();
    } else {
      // Center 50%: Pause/Play toggle
      setIsPaused((p) => !p);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setIsPaused((p) => !p);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setProgress(0);
      elapsedRef.current = 0;
      startTimeRef.current = 0;
      onNext();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setProgress(0);
      elapsedRef.current = 0;
      startTimeRef.current = 0;
      onPrev();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentStory?.product) return;

    const priceNum = parseInt(currentStory.product.price, 10);
    addItem({
      variantId: currentStory.product.id,
      productId: currentStory.product.id,
      categoryId: currentStory.product.categoryId,
      name: currentStory.product.name,
      slug: currentStory.product.slug,
      sku: currentStory.product.slug,
      effectivePrice: priceNum,
      installmentBasePrice: priceNum,
      pricingTier: "regular",
      stock: currentStory.product.stock,
      selectedAddons: [],
    });
    toast.success("محصول با موفقیت به سبد خرید اضافه شد");
  };

  if (!currentStory) return null;
  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative flex h-[85vh] w-full max-w-[420px] flex-col overflow-hidden rounded-3xl border border-[--glass-border] bg-surface-glass shadow-glass select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bars indicator */}
        <div className="absolute top-4 inset-x-0 z-20 flex gap-1.5 px-4">
          {stories.map((story, idx) => {
            let fillWidth = "0%";
            if (idx < activeIndex) fillWidth = "100%";
            if (idx === activeIndex) fillWidth = `${progress}%`;

            return (
              <div
                key={story.id}
                className="h-[3px] flex-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75 ease-out"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* Media Window Container */}
        {/* biome-ignore lint/a11y/useSemanticElements: Needs to nest close button and product link */}
        <div
          className="relative flex-1 bg-black cursor-pointer overflow-hidden focus:outline-none"
          onClick={handleViewportTap}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`${currentStory.title} - پخش ویدئو استوری`}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              className="h-full w-full object-cover"
              playsInline
              onLoadedMetadata={handleVideoMetadata}
              onEnded={onNext}
            >
              <track kind="captions" />
            </video>
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt={currentStory.title}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-8 inset-e-4 z-20 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70 focus:outline-none"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Pause overlay cue */}
          {isPaused && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="rounded-xl bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xs">
                متوقف شد
              </span>
            </div>
          )}

          {/* Slide Title */}
          <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-5 pb-6 pt-16">
            <h3 className="text-sm font-semibold text-white">{currentStory.title}</h3>
          </div>
        </div>

        {/* Mapped Shoppable Product Card */}
        {currentStory.product && (
          <div className="border-t border-[--glass-border] bg-surface/75 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4" dir="rtl">
              <a
                href={`/products/${currentStory.product.slug}`}
                className="flex flex-1 flex-col overflow-hidden hover:opacity-80 transition-opacity no-underline"
              >
                <span className="truncate text-xs font-bold text-text-primary">
                  {currentStory.product.name}
                </span>
                <span className="text-[11px] font-semibold text-accent mt-0.5" dir="ltr">
                  {Number(currentStory.product.price).toLocaleString("fa-IR")} تومان
                </span>
              </a>

              <div className="flex items-center gap-2">
                {currentStory.product.inStock ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent/90 hover:shadow-md focus:outline-none active:scale-95"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>خرید سریع</span>
                  </button>
                ) : (
                  <Badge
                    variant="destructive"
                    className="h-6 rounded-lg px-2.5 text-[10px] font-semibold"
                  >
                    ناموجود
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
