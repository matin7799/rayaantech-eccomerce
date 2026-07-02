import { motion } from "framer-motion";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { LuxuryMarkdown } from "../ui/luxury-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const contentText =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
            .trim()
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed transition-all",
        role === "user"
          ? "bg-accent/15 border border-accent/20 text-foreground rounded-tr-none shadow-sm backdrop-blur-md"
          : "bg-slate-800/80 text-white border border-slate-900 rounded-tl-none shadow-lg backdrop-blur-lg",
      )}
    >
      {role === "assistant" && contentText ? (
        <LuxuryMarkdown className="text-white" content={contentText} />
      ) : (
        children
      )}
    </motion.div>
  );
}
