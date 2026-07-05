import { motion } from "framer-motion";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { LuxuryMarkdown } from "../ui/luxury-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  /** When true, assistant text is revealed with a typewriter effect (fresh replies only). */
  animate?: boolean;
}

/**
 * Progressive character reveal so a completed assistant reply "types" itself out
 * instantly instead of appearing as a wall of text. Runs once per fresh reply;
 * rehydrated history renders in full immediately (animate=false).
 */
function useTypewriter(text: string, enabled: boolean): string {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }
    if (!text) {
      setCount(0);
      return;
    }
    let current = 0;
    const total = text.length;
    // Reveal ~3 chars per tick, capped so long answers still finish in ~1.2s.
    const step = Math.max(2, Math.ceil(total / 220));
    const interval = window.setInterval(() => {
      current = Math.min(total, current + step);
      setCount(current);
      if (current >= total && frame.current !== null) {
        window.clearInterval(frame.current);
      }
    }, 16);
    frame.current = interval;
    return () => window.clearInterval(interval);
  }, [text, enabled]);

  return text.slice(0, count);
}

export function ChatBubble({ role, children, animate = false }: ChatBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const contentText =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
            .trim()
        : "";

  const isAnimatedAssistant = role === "assistant" && animate && !!contentText;
  const revealed = useTypewriter(contentText, isAnimatedAssistant);

  // Keep the newest text in view as it types.
  useEffect(() => {
    if (isAnimatedAssistant) {
      bubbleRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [revealed, isAnimatedAssistant]);

  return (
    <motion.div
      ref={bubbleRef}
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed transition-all",
        role === "user"
          ? "bg-gradient-to-br from-accent/25 to-accent/10 border border-accent/25 text-foreground rounded-tr-none shadow-sm backdrop-blur-md"
          : "bg-slate-800/85 text-white border border-white/5 rounded-tl-none shadow-lg backdrop-blur-lg",
      )}
    >
      {role === "assistant" && contentText ? (
        <LuxuryMarkdown
          className="text-white"
          content={isAnimatedAssistant ? revealed : contentText}
        />
      ) : (
        children
      )}
    </motion.div>
  );
}
