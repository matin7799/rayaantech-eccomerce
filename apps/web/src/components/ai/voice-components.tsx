import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export const VOICE_PULSE_ANIMATION = { scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] };
export const VOICE_PULSE_TRANSITION = { duration: 2, repeat: Infinity, ease: "easeInOut" as const };

export function VoicePulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.span
        className="absolute inset-[-6px] rounded-full border-2 border-accent/20"
        animate={VOICE_PULSE_ANIMATION}
        transition={{ ...VOICE_PULSE_TRANSITION, delay: 0 }}
      />
      <motion.span
        className="absolute inset-[-3px] rounded-full border border-accent/30"
        animate={VOICE_PULSE_ANIMATION}
        transition={{ ...VOICE_PULSE_TRANSITION, delay: 0.4 }}
      />
    </div>
  );
}

export function VoiceVisualization({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
        <motion.span
          className="absolute inset-[-12px] rounded-full border-2 border-accent/15"
          animate={active ? VOICE_PULSE_ANIMATION : { scale: 1, opacity: 0.2 }}
          transition={{ ...VOICE_PULSE_TRANSITION, duration: 2.5 }}
        />
        <motion.span
          className="absolute inset-[-6px] rounded-full border border-accent/25"
          animate={active ? VOICE_PULSE_ANIMATION : { scale: 1, opacity: 0.2 }}
          transition={{ ...VOICE_PULSE_TRANSITION, duration: 2, delay: 0.3 }}
        />
        <Mic className="relative h-8 w-8 text-accent" />
      </div>
      <p className="text-xs text-text-muted">
        {active ? "در حال پردازش صدا..." : "برای شروع مکالمه صوتی، ضربه بزنید"}
      </p>
      <p className="text-xs bg-amber-500 p-2 rounded-2xl text-white-100">به زودی فعال میگردد...</p>
    </div>
  );
}

export function StreamingDots() {
  return (
    <div className="flex items-center gap-2 px-1">
      <motion.div
        className="flex gap-1"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
      </motion.div>
      <span className="text-[10px] text-text-muted">در حال فکر کردن...</span>
    </div>
  );
}
