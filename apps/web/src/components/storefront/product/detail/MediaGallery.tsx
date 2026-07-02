import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type GalleryImage, useProductStore } from "../../../../lib/store";
import { cn } from "../../../../lib/utils";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };

/**
 * MediaGallery — Luxury product image gallery with immersive glassmorphic frames.
 *
 * Features:
 * - Explicit aspect-ratio containers to eliminate CLS/layout jank
 * - Glassmorphic thumbnail frames with micro-zoom scale on activation
 * - 60fps fade-in transitions via framer-motion AnimatePresence
 * - Fullscreen lightbox with drag gestures and keyboard navigation
 * - Dynamic border highlight using --glass-border token
 */
export function MediaGallery() {
  const { gallery, activeImageIndex, setActiveImage } = useProductStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = gallery[activeImageIndex] ?? null;

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = (activeImageIndex + dir + gallery.length) % gallery.length;
      setActiveImage(next);
    },
    [activeImageIndex, gallery.length, setActiveImage],
  );

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-[--glass-border] bg-surface-secondary/40">
        <span className="text-sm text-text-muted">تصویری موجود نیست</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image — fixed aspect-ratio container prevents height collapse during transitions */}
      <motion.div
        layoutId="gallery-main"
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-4/3 cursor-zoom-in overflow-hidden rounded-2xl border border-[--glass-border] bg-surface-secondary/40 backdrop-blur-sm"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage?.id}
            src={activeImage?.webpUrl ?? activeImage?.url}
            alt="محصول"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-contain p-4"
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>

      {/* Thumbnail Strip — glassmorphic frames with micro-zoom */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {gallery.map((img, idx) => {
            const isActive = idx === activeImageIndex;
            return (
              <motion.button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(idx)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                  "bg-surface-secondary/40 backdrop-blur-sm",
                  isActive
                    ? "border-accent shadow-md shadow-accent/10"
                    : "border-[--glass-border] opacity-70 hover:opacity-100 hover:border-accent/40",
                )}
              >
                <img
                  src={img.webpUrl ?? img.url}
                  alt=""
                  className="aspect-square h-16 w-16 object-contain p-1"
                  draggable={false}
                />
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <LightboxOverlay
            gallery={gallery}
            activeIndex={activeImageIndex}
            onClose={() => setLightboxOpen(false)}
            onNavigate={navigate}
            onSetIndex={setActiveImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lightbox Overlay ────────────────────────────────────────────────────────

interface LightboxProps {
  gallery: GalleryImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  onSetIndex: (idx: number) => void;
}

function LightboxOverlay({ gallery, activeIndex, onClose, onNavigate, onSetIndex }: LightboxProps) {
  const img = gallery[activeIndex];
  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-focus for keyboard navigation
  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onNavigate(1);
        if (e.key === "ArrowRight") onNavigate(-1);
      }}
      tabIndex={0}
      role="dialog"
      aria-label="گالری تصاویر"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 inset-e-6 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation arrows */}
      {gallery.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            className="absolute inset-s-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            className="absolute inset-e-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Main Image with drag */}
      <motion.div
        layoutId="gallery-main"
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-[90vw]"
      >
        <motion.img
          key={img?.id}
          src={img?.webpUrl ?? img?.url}
          alt="محصول"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 80) {
              onNavigate(info.offset.x > 0 ? -1 : 1);
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="max-h-[85vh] rounded-2xl object-contain"
          draggable={false}
        />
      </motion.div>

      {/* Dot indicators */}
      {gallery.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {gallery.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetIndex(idx);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                idx === activeIndex ? "w-6 bg-white" : "w-2 bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
