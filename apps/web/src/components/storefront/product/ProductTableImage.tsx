import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";

interface ProductTableImageProps {
  /** Product media URL (server serves a single 1200px WebP). Null = fallback. */
  src: string | null;
  /** Alt text for accessibility. */
  alt: string;
  className?: string;
}

/**
 * ProductTableImage — Zero-CLS thumbnail cell for the hierarchical product
 * table.
 *
 * CLS Shield:
 * - Fixed `w-12 h-12` box reserves layout height BEFORE the asset loads, so
 *   rows never shift.
 * - `loading="lazy"` defers offscreen fetches.
 * - A framer-motion shimmer placeholder overlays the box until the native
 *   `onLoad` fires, then unmounts smoothly (opacity fade).
 *
 * The backend emits a single 1200px WebP (no 400px variant on the server);
 * the browser downscales into the fixed box. No backend changes required.
 */
export function ProductTableImage({ src, alt, className }: ProductTableImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden",
        "rounded-xl border border-[--glass-border] bg-surface/50 backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      {src ? (
        <>
          {/* Elegant shimmer gradient */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-surface-secondary/40 to-surface-secondary/80" />
          )}
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            whileHover={{ scale: 1.08 }}
            transition={{
              opacity: { duration: 0.25 },
              scale: { type: "spring", stiffness: 300, damping: 20 },
            }}
            onLoad={() => setLoaded(true)}
            className="h-full w-full object-cover select-none"
          />
        </>
      ) : (
        <ShoppingBag
          className="h-5 w-5 text-text-muted/30 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
