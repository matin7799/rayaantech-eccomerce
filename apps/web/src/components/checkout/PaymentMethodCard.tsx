import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PaymentMethodCardProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  logo?: string;
}

export function PaymentMethodCard({
  label,
  description,
  selected,
  onSelect,
  logo,
}: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between gap-4 rounded-xl border p-3.5 text-start transition-all duration-200 ${
        selected
          ? "border-accent bg-surface-action"
          : "border-[--glass-border] bg-surface hover:border-accent/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected ? "border-accent" : "border-text-muted/40"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
        </span>
        <div className="min-w-0">
          <span className="text-xs font-semibold text-text-primary block truncate">{label}</span>
          <p className="text-[10px] text-text-muted mt-0.5 truncate">{description}</p>
        </div>
      </div>

      {logo && (
        <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-secondary/50 border border-border-light/20 p-1.5 backdrop-blur-xs">
          <img
            src={logo}
            alt={label}
            className="max-h-full max-w-full object-contain filter-dark-mode"
          />
        </div>
      )}
    </button>
  );
}

export function NeonPaymentMethodCard({
  label,
  description,
  selected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <div className="relative w-full">
      {/* Premium Badge */}
      <div className="absolute -top-3 right-4 z-10">
        <span className="flex items-center gap-1 rounded-full bg-linear-to-r from-accent to-success px-2.5 py-0.5 text-[9px] font-semibold text-white shadow-md border border-white/10">
          <Sparkles className="h-2.5 w-2.5" />
          <span>پیشنهاد ویژه کم‌بهره</span>
        </span>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={`relative flex w-full flex-col justify-between rounded-2xl p-5 text-start transition-all duration-300 backdrop-blur-md overflow-hidden ${
          selected
            ? "border-2 border-accent bg-surface-action/45 shadow-[0_8px_32px_rgba(99,102,241,0.12)]"
            : "border border-[--glass-border] bg-surface-glass hover:border-accent/40 hover:bg-surface-action/10"
        }`}
      >
        {/* Subtle background glow when selected */}
        {selected && (
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-accent/15 blur-2xl pointer-events-none" />
        )}

        <div className="flex items-start gap-4">
          <span
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
              selected ? "border-accent bg-accent/10" : "border-text-muted/40"
            }`}
          >
            {selected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="h-2.5 w-2.5 rounded-full bg-accent"
              />
            )}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">{label}</span>
              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[8px] font-medium text-accent">
                رایان تک اقساط
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Clean accent bar */}
        <div className="mt-4 flex items-center gap-2 w-full">
          <div
            className={`h-[1px] flex-1 rounded-full transition-colors duration-300 ${
              selected
                ? "bg-linear-to-l from-accent via-success to-transparent opacity-50"
                : "bg-border-light"
            }`}
          />
          <span
            className={`text-[9px] font-bold transition-colors duration-300 ${
              selected ? "text-accent" : "text-text-muted"
            }`}
          >
            بدون ضامن — فوری
          </span>
        </div>
      </button>
    </div>
  );
}
