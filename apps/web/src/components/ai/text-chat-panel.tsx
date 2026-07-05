import type { AiMatchedProduct } from "@rayan-tech/types";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { SEED_PROMPTS } from "../../lib/store/ai-consultant.store";
import { Message, MessageAvatar, MessageContent, MessageGroup } from "../ui/message";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "../ui/message-scroller";
import { ChatBubble } from "./chat-bubble";
import { ProductCard } from "./product-card";
import { StreamingDots } from "./voice-components";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  matchedProducts?: AiMatchedProduct[];
  isStreaming?: boolean;
}

interface TextChatPanelProps {
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  isStreaming: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholderText: string;
  onSendDirect?: (text: string) => void;
}

export function TextChatPanel({
  messages,
  input,
  setInput,
  isStreaming,
  onSubmit,
  placeholderText,
  onSendDirect,
}: TextChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sampledSeeds, setSampledSeeds] = useState<string[]>([]);

  // Sample exactly 4 random seed prompts on component mount
  useEffect(() => {
    const shuffled = [...SEED_PROMPTS].sort(() => 0.5 - Math.random());
    setSampledSeeds(shuffled.slice(0, 4));
  }, []);

  // Smooth scroll to bottom on new message additions or streaming changes
  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const truncateText = (str: string, wordLimit = 5): string => {
    const words = str.split(/\s+/);
    if (words.length <= wordLimit) return str;
    return `${words.slice(0, wordLimit).join(" ")}...`;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-h-0">
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 min-h-0">
          <MessageScrollerViewport className="px-4 py-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <Sparkles className="relative h-6 w-6 text-accent" />
                </div>
                <p className="text-center text-xs text-text-muted max-w-[240px]">
                  {placeholderText}
                </p>
                <p className="text-center text-[10px] text-text-muted/60">
                  مشاور تخصصی سخت‌افزار رایان‌تک
                </p>
              </div>
            )}

            <MessageScrollerContent>
              <MessageGroup>
                {messages.map((msg) => (
                  <MessageScrollerItem key={msg.id} scrollAnchor={true}>
                    <Message align={msg.role === "user" ? "end" : "start"} className="my-1">
                      <MessageAvatar className="bg-slate-700 border border-slate-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        {msg.role === "user" ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-accent" />
                        )}
                      </MessageAvatar>
                      <MessageContent>
                        <ChatBubble role={msg.role} animate={msg.id.startsWith("assistant-")}>
                          {msg.content ? msg.content : msg.isStreaming ? <StreamingDots /> : null}
                        </ChatBubble>
                        {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1.5 ps-1">
                            {msg.matchedProducts.map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        )}
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageGroup>
              <div ref={scrollRef} aria-hidden="true" />
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Seed Prompts Horizontal Carousel Wrapper ABOVE input box */}
      {messages.length === 0 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3 px-4 w-full bg-surface/40 backdrop-blur-md border-t border-border-light">
          {sampledSeeds.map((seed) => (
            <motion.button
              key={seed}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSendDirect?.(seed)}
              className="shrink-0 rounded-full border border-border bg-surface-secondary px-3.5 py-1.5 text-xs text-text-primary transition-all duration-200 hover:border-accent/30"
            >
              {truncateText(seed)}
            </motion.button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="border-t border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="سوال خود را بنویسید..."
            disabled={isStreaming}
            className="flex-1 rounded-xl border border-border bg-surface-secondary px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
            dir="rtl"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isStreaming}
            whileTap={{ scale: 0.92 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-sm transition-all duration-200 disabled:opacity-40 hover:shadow-[0_0_12px_var(--color-accent)]"
            aria-label="ارسال"
          >
            <Send className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
