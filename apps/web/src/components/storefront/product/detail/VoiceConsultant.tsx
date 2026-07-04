import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";

interface ProductContext {
  productName: string;
  basePrice: string;
  grade: string;
  slug: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const SPRING = { type: "spring" as const, stiffness: 350, damping: 28 };

/**
 * VoiceConsultant — Floating AI consultation console for PDP.
 *
 * Connects to the existing /voice-ai WebSocket gateway.
 * Injects current product context as RAG grounding on first message.
 * Uses Liquid Glassmorphism design tokens.
 */
export function VoiceConsultant({ context }: { context: ProductContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextSent = useRef(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const baseUrl =
      typeof window !== "undefined" ? ((window as { __API_URL__?: string }).__API_URL__ ?? "") : "";
    const wsUrl = baseUrl.replace(/^http/, "ws") + "/voice-ai";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnectionError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) {
          setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
          setIsLoading(false);
        }
      } catch {
        // Non-JSON message, ignore
      }
    };

    ws.onerror = () => {
      setConnectionError("اتصال به سرور مشاور برقرار نشد");
      setIsLoading(false);
    };

    ws.onclose = () => {
      socketRef.current = null;
    };

    socketRef.current = ws;
  }, []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setConnectionError("اتصال قطع شده. لطفاً دوباره تلاش کنید.");
      return;
    }

    // Inject product context on first message
    const contextPrefix = !contextSent.current
      ? `[محصول: ${context.productName} | قیمت: ${context.basePrice} تومان | وضعیت: ${context.grade}]\n\n`
      : "";
    contextSent.current = true;

    const payload = JSON.stringify({
      type: "text",
      text: contextPrefix + text,
    });

    socketRef.current.send(payload);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);
  }, [input, context]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    connectSocket();
  }, [connectSocket]);

  const handleClose = useCallback(() => {
    setOpen(false);
    socketRef.current?.close();
    socketRef.current = null;
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <motion.button
          type="button"
          onClick={handleOpen}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105"
        >
          {/* Pulsing ring */}
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
          <MessageCircle className="relative h-6 w-6" />
        </motion.button>
      )}

      {/* Console Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={SPRING}
            className="fixed bottom-6 end-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-[--glass-border] bg-[--glass-backdrop] shadow-[--shadow-glass] backdrop-blur-xl"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[--glass-border] px-4 py-3">
              <span className="text-sm font-semibold text-text-primary">مشاور هوشمند محصول</span>
              <button
                type="button"
                onClick={handleClose}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin">
              {messages.length === 0 && (
                <p className="text-center text-xs text-text-muted">
                  سوالی درباره {context.productName} دارید؟
                </p>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "mb-2 max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                    msg.role === "user"
                      ? "ms-auto bg-accent text-white"
                      : "bg-surface-secondary text-text-primary",
                  )}
                >
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="mb-2 flex items-center gap-2 text-xs text-text-muted">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  در حال فکر کردن...
                </div>
              )}
              {connectionError && (
                <div className="mb-2 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
                  {connectionError}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[--glass-border] px-3 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="سوال خود را بنویسید..."
                  className="flex-1 rounded-lg bg-surface-secondary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="rounded-lg bg-accent p-2 text-white transition-opacity disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
