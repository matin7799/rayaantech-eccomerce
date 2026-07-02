import type { AiMatchedProduct } from "@rayan-tech/types";
import { AnimatePresence, motion } from "framer-motion";
import { History, MessageCircle, Mic, Sparkles, X } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAIConsultantStore } from "../../lib/store";
import { trpc } from "../../lib/trpc";
import { cn } from "../../lib/utils";
import { TextChatPanel } from "./text-chat-panel";
import { VoicePulseRing, VoiceVisualization } from "./voice-components";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  matchedProducts?: AiMatchedProduct[];
  isStreaming?: boolean;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AiConsole() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");

  const msgIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const productContext = useAIConsultantStore((s) => s.productContext);
  const activeProductContextSlug = useAIConsultantStore((s) => s.activeProductContextSlug);
  const open = useAIConsultantStore((s) => s.isOpen);
  const setOpen = useAIConsultantStore((s) => s.setIsOpen);

  const activeSessionId = useAIConsultantStore((s) => s.activeSessionId);
  const activeSessionTitle = useAIConsultantStore((s) => s.activeSessionTitle);
  const activeSessionMessages = useAIConsultantStore((s) => s.activeSessionMessages);
  const clearSession = useAIConsultantStore((s) => s.clearSession);

  const consultMutation = trpc.ai.consult.useMutation();

  // Rehydrate state from Zustand store (smooth sync / Hydration loop)
  useEffect(() => {
    if (activeSessionMessages) {
      setMessages(
        activeSessionMessages.map((m, i) => ({
          id: `history-${i}`,
          role: m.role,
          content: m.content,
          timestamp: Date.now() - (activeSessionMessages.length - i) * 1000,
        })),
      );
    } else {
      setMessages([]);
    }
    if (activeSessionId) {
      sessionIdRef.current = activeSessionId;
      setActiveTab("text");
    }
  }, [activeSessionId, activeSessionMessages]);

  const executeConsultation = useCallback(
    async (
      apiMessages: Array<{ role: "user" | "assistant"; text: string }>,
      assistantId: string,
    ) => {
      try {
        const result = await consultMutation.mutateAsync({
          messages: apiMessages,
          productContext: productContext
            ? {
                productName: productContext.productName,
                sku: productContext.sku,
                basePrice: productContext.basePrice,
                grade: productContext.grade,
                slug: productContext.slug,
                stock: productContext.stock,
              }
            : undefined,
          sessionId: sessionIdRef.current ?? undefined,
          activeProductContextSlug: activeProductContextSlug ?? undefined,
        });

        if (result.sessionId) {
          sessionIdRef.current = result.sessionId;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: result.text,
                  isStreaming: false,
                  matchedProducts:
                    "matchedProducts" in result
                      ? (result.matchedProducts as AiMatchedProduct[] | undefined)
                      : undefined,
                }
              : m,
          ),
        );
      } catch (err) {
        // TRPCClientError surfaces the message directly on err.message.
        // Fallback to legacy HttpException body shape, then a generic Persian message.
        const trpcMessage = (err as { message?: string })?.message;
        const legacyMessage = (err as { data?: { messageFa?: string } })?.data?.messageFa;
        const errorMessage =
          trpcMessage && trpcMessage !== "Internal server error"
            ? trpcMessage
            : (legacyMessage ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorMessage, isStreaming: false } : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [productContext, activeProductContextSlug, consultMutation],
  );

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isStreaming) return;

      const userMsg: ChatMessage = {
        id: `user-${++msgIdRef.current}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      if (!overrideText) {
        setInput("");
      }
      setIsStreaming(true);

      const assistantId = `assistant-${++msgIdRef.current}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      const apiMessages = updatedMessages.map((m) => ({ role: m.role, text: m.content }));
      await executeConsultation(apiMessages, assistantId);
    },
    [input, messages, isStreaming, executeConsultation],
  );

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => {
    setOpen(false);
    abortRef.current?.abort();
  }, [setOpen]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void sendMessage();
    },
    [sendMessage],
  );

  const handleSendDirect = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage],
  );

  const handleNewChat = useCallback(() => {
    sessionIdRef.current = null;
    setMessages([]);
    clearSession();
  }, [clearSession]);

  const handleOpenHistory = useCallback(() => {
    window.location.href = "/profile?tab=chat-history-ledger";
  }, []);

  const placeholderText = productContext
    ? `سوالی درباره ${productContext.productName} دارید؟`
    : "چطور می‌تونم کمکتون کنم؟";

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          onClick={handleOpen}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 inset-e-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg md:bottom-6"
          aria-label="مشاور هوشمند رایان‌تک"
        >
          <VoicePulseRing />
          <Sparkles className="relative h-5 w-5" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 inset-e-5 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-[--glass-border] bg-surface/95 shadow-[--shadow-glass] backdrop-blur-xl md:bottom-6"
            dir="rtl"
            role="dialog"
            aria-label="مشاور هوش مصنوعی"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                  <Sparkles className="relative h-4 w-4 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary">
                    {activeSessionTitle || "رایانوایز (مشاور سخت‌افزار)"}
                  </span>
                  {productContext && (
                    <span className="text-[10px] text-text-muted line-clamp-1 max-w-[140px]">
                      {productContext.productName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenHistory}
                  className="rounded-lg p-1.5 bg-surface-secondary border border-border text-text-muted transition-colors hover:text-text-primary"
                  aria-label="تاریخچه"
                  title="تاریخچه گفتگوها"
                >
                  <History className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewChat}
                  className="rounded-lg p-1.5 bg-surface-secondary border border-border text-text-muted transition-colors hover:text-text-primary"
                  aria-label="گفتگوی جدید"
                  title="شروع گفتگوی جدید"
                >
                  <MessageCircle className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="rounded-lg p-1.5 bg-surface-secondary border border-border text-text-muted transition-colors hover:text-text-primary"
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-border px-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={cn(
                  "flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-[11px] font-medium transition-colors",
                  activeTab === "text"
                    ? "bg-surface-secondary/60 text-accent border-b-2 border-accent"
                    : "text-text-muted hover:text-text-primary",
                )}
              >
                <MessageCircle className="h-3 w-3" />
                مشاوره متنی
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("voice")}
                className={cn(
                  "flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-[11px] font-medium transition-colors",
                  activeTab === "voice"
                    ? "bg-surface-secondary/60 text-accent border-b-2 border-accent"
                    : "text-text-muted hover:text-text-primary",
                )}
              >
                <Mic className="h-3 w-3" />
                مکالمه صوتی
              </button>
            </div>

            {/* Text Chat */}
            {activeTab === "text" && (
              <TextChatPanel
                messages={messages}
                input={input}
                setInput={setInput}
                isStreaming={isStreaming}
                onSubmit={handleSubmit}
                placeholderText={placeholderText}
                onSendDirect={handleSendDirect}
              />
            )}

            {activeTab === "voice" && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <VoiceVisualization active={false} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
