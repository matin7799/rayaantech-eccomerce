import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface AuthSubmitButtonProps {
  isLoading: boolean;
  label: string;
  disabled?: boolean;
}

/**
 * AuthSubmitButton — Premium animated CTA with liquid morph loader.
 *
 * When isLoading:
 * - Button smoothly morphs from full-width to a compact circular track
 * - Displays an infinite liquid morphing orb spinner (glassmorphic)
 *
 * When idle:
 * - Full-width label + arrow icon with tap scale feedback
 */
export function AuthSubmitButton({ isLoading, label, disabled = false }: AuthSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading || disabled}
      layout
      transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
      whileTap={isLoading ? undefined : { scale: 0.97 }}
      className={`relative mx-auto flex items-center justify-center overflow-hidden rounded-xl bg-accent text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-300 ease-in-out disabled:pointer-events-none ${
        isLoading ? "h-12 w-12 rounded-full" : "h-12 w-full hover:shadow-xl hover:shadow-accent/30"
      }`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-full w-full items-center justify-center"
          >
            {/* Outer pulsing ring (glassmorphic glow) */}
            <motion.span
              className="absolute h-10 w-10 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Inner liquid morphing orb */}
            <motion.span
              className="h-5 w-5 rounded-full bg-white/90"
              animate={{
                borderRadius: ["50%", "40% 60% 60% 40%", "60% 40% 40% 60%", "50%"],
                scale: [1, 1.1, 0.9, 1],
                rotate: [0, 90, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {label}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
