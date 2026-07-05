import { AnimatePresence, motion } from "framer-motion";
import { Mic, Square, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { ChatBubble } from "./chat-bubble";
import { useVoiceChat, type VoiceChatStatus } from "./use-voice-chat";
import { VOICE_PULSE_ANIMATION, VOICE_PULSE_TRANSITION } from "./voice-components";

const STATUS_LABELS: Record<VoiceChatStatus, string> = {
  idle: "برای صحبت کردن، دکمه میکروفون را بزنید",
  connecting: "در حال اتصال...",
  recording: "در حال گوش دادن... (برای پایان دوباره بزنید)",
  transcribing: "در حال تبدیل گفتار به متن...",
  thinking: "در حال فکر کردن...",
  responding: "در حال پاسخ دادن...",
  error: "",
};

/**
 * VoiceChatPanel — live Persian voice consultation.
 *
 * Tap the mic to talk, tap again to send. The spoken query is transcribed
 * (Whisper, fa), answered by the grounded RAG pipeline, streamed as text,
 * and optionally read aloud with the browser's Persian voice.
 */
export function VoiceChatPanel() {
  const { status, messages, error, ttsEnabled, setTtsEnabled, toggleRecording, clearError } =
    useVoiceChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const isRecording = status === "recording";
  const isBusy = status === "transcribing" || status === "thinking" || status === "responding";

  // Follow the conversation as it streams
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-h-0">
      {/* Conversation transcript */}
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="max-w-[240px] text-xs text-text-muted">
              سوال خود را با صدای خودتان بپرسید — مشاور رایان‌تک به فارسی پاسخ می‌دهد.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <ChatBubble role={msg.role}>{msg.text}</ChatBubble>
            </div>
          ))}
        </div>
        <div ref={scrollRef} aria-hidden="true" />
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.button
            type="button"
            onClick={clearError}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mb-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-right text-[11px] text-danger"
          >
            {error} — برای تلاش مجدد ضربه بزنید
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mic control deck */}
      <div className="flex flex-col items-center gap-2 border-t border-border px-4 py-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          {(isRecording || isBusy) && (
            <>
              <motion.span
                className={cn(
                  "absolute inset-[-10px] rounded-full border-2",
                  isRecording ? "border-danger/25" : "border-accent/20",
                )}
                animate={VOICE_PULSE_ANIMATION}
                transition={{ ...VOICE_PULSE_TRANSITION, duration: 1.6 }}
              />
              <motion.span
                className={cn(
                  "absolute inset-[-4px] rounded-full border",
                  isRecording ? "border-danger/40" : "border-accent/30",
                )}
                animate={VOICE_PULSE_ANIMATION}
                transition={{ ...VOICE_PULSE_TRANSITION, duration: 1.2, delay: 0.3 }}
              />
            </>
          )}
          <motion.button
            type="button"
            onClick={toggleRecording}
            disabled={isBusy}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors",
              isRecording
                ? "bg-danger shadow-danger/40"
                : "bg-gradient-to-br from-accent to-accent/80 shadow-accent/30",
              isBusy && "opacity-60",
            )}
            aria-label={isRecording ? "پایان ضبط" : "شروع ضبط صدا"}
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-6 w-6" />}
          </motion.button>
        </div>

        <p className="text-[11px] text-text-muted">{STATUS_LABELS[status]}</p>

        {/* TTS toggle */}
        <button
          type="button"
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3 py-1 text-[10px] text-text-muted transition-colors hover:text-text-primary"
        >
          {ttsEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
          {ttsEnabled ? "خواندن پاسخ با صدا: فعال" : "خواندن پاسخ با صدا: غیرفعال"}
        </button>
      </div>
    </div>
  );
}
