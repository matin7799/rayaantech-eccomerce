import { motion } from "framer-motion";
import { formatRialsPersian } from "../../lib/persian-numerals";
import { cn } from "../../lib/utils";

/**
 * Props for InstallmentSummaryCard.
 */
interface InstallmentSummaryCardProps {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
  alarm?: boolean;
}

/**
 * InstallmentSummaryCard — Glassmorphism stat card for installment results.
 *
 * Displays a labeled monetary value with optional highlight or alarm state.
 * Alarm state activates neon-red glassmorphic border + glow.
 */
export function InstallmentSummaryCard({
  label,
  value,
  suffix = "تومان",
  highlight = false,
  alarm = false,
}: InstallmentSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "flex flex-col gap-1 rounded-xl border px-4 py-3 backdrop-blur-md transition-all duration-300",
        alarm
          ? "border-danger/60 bg-danger/5 shadow-[0_0_20px_rgba(239,68,68,0.2),inset_0_1px_0_rgba(239,68,68,0.1)]"
          : highlight
            ? "border-accent/40 bg-accent/5 shadow-[0_0_16px_rgba(5,150,105,0.12)]"
            : "border-border-light bg-surface-glass shadow-glass",
      )}
    >
      <span className={cn("text-[11px] font-medium", alarm ? "text-danger" : "text-text-muted")}>
        {label}
      </span>
      <span
        className={cn(
          "text-base font-bold tabular-nums tracking-tight",
          alarm ? "text-danger" : highlight ? "text-accent" : "text-text-primary",
        )}
      >
        {formatRialsPersian(value)}
      </span>
      <span className={cn("text-[10px] font-medium", alarm ? "text-danger/70" : "text-text-muted")}>
        {suffix}
      </span>
    </motion.div>
  );
}
