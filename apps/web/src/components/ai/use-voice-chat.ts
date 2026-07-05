import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

/** Local storage key for the persistent guest session id. */
const GUEST_ID_KEY = "rt_voice_guest_id";

export type VoiceChatStatus =
  | "idle" // not connected / nothing happening
  | "connecting" // socket handshake in flight
  | "recording" // mic capture active
  | "transcribing" // audio sent, awaiting Whisper transcript
  | "thinking" // transcript received, awaiting first response chunk
  | "responding" // streaming response chunks
  | "error";

export interface VoiceChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

/** Resolve or mint the persistent guest session id (survives reloads). */
function getGuestSessionId(): string {
  try {
    const existing = localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, fresh);
    return fresh;
  } catch {
    return crypto.randomUUID();
  }
}

/** Speak Persian text via the browser TTS engine when a fa voice exists. */
function speakPersian(text: string): void {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fa-IR";
    const faVoice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("fa"));
    if (faVoice) utterance.voice = faVoice;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // TTS is best-effort — many browsers lack a Persian voice.
  }
}

/**
 * useVoiceChat — Persian voice consultation over the /voice-ai socket.io gateway.
 *
 * Flow: hold-to-talk mic capture (MediaRecorder, webm/opus) → base64 →
 * `message { type: "audio" }` → server Whisper STT (language: fa) emits
 * `transcript` → RAG pipeline streams `response:chunk` → `response:end`.
 * Optionally reads the final answer aloud with the browser's fa-IR voice.
 */
export function useVoiceChat() {
  const [status, setStatus] = useState<VoiceChatStatus>("idle");
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamingTextRef = useRef("");
  const msgIdRef = useRef(0);
  const ttsRef = useRef(ttsEnabled);
  ttsRef.current = ttsEnabled;

  /** Lazily open (and memoize) the socket connection. */
  const ensureSocket = useCallback((): Socket => {
    if (socketRef.current?.connected) return socketRef.current;
    socketRef.current?.disconnect();

    const baseUrl =
      typeof window !== "undefined" ? ((window as { __API_URL__?: string }).__API_URL__ ?? "") : "";

    const socket = io(`${baseUrl}/voice-ai`, {
      transports: ["websocket", "polling"],
      // Send the rt_session cookie so logged-in users get the authenticated
      // rate tier (10/min) instead of the 3-message guest cap.
      withCredentials: true,
      query: { guest_session_id: getGuestSessionId() },
    });

    socket.on("transcript", ({ text }: { text: string }) => {
      setMessages((prev) => [...prev, { id: `u-${++msgIdRef.current}`, role: "user", text }]);
      setStatus("thinking");
    });

    socket.on("response:chunk", ({ chunk }: { chunk: string }) => {
      streamingTextRef.current += chunk;
      const streamed = streamingTextRef.current;
      setStatus("responding");
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.id.startsWith("stream-")) {
          return [...prev.slice(0, -1), { ...last, text: streamed }];
        }
        return [...prev, { id: `stream-${++msgIdRef.current}`, role: "assistant", text: streamed }];
      });
    });

    socket.on("response", ({ text }: { text: string }) => {
      streamingTextRef.current = "";
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const final = { id: `a-${++msgIdRef.current}`, role: "assistant" as const, text };
        return last?.id.startsWith("stream-") ? [...prev.slice(0, -1), final] : [...prev, final];
      });
      setStatus("idle");
      if (ttsRef.current) speakPersian(text);
    });

    socket.on("error", (payload: { messageFa?: string }) => {
      setError(payload.messageFa ?? "خطایی رخ داد. دوباره تلاش کنید.");
      setStatus("error");
    });

    socket.on("limit_exhausted", (payload: { message?: string }) => {
      setError(payload.message ?? "برای ادامه مشاوره صوتی لطفاً وارد حساب خود شوید.");
      setStatus("error");
    });

    socket.on("connect_error", () => {
      setError("اتصال به سرور مشاور صوتی برقرار نشد");
      setStatus("error");
    });

    socketRef.current = socket;
    return socket;
  }, []);

  /** Start capturing microphone audio. */
  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        // Release the mic immediately
        for (const track of stream.getTracks()) track.stop();

        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        if (blob.size < 1_000) {
          // Too short to contain speech — ignore.
          setStatus("idle");
          return;
        }

        setStatus("transcribing");
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
          ensureSocket().emit("message", { type: "audio", buffer: base64 });
        };
        reader.readAsDataURL(blob);
      };

      // Warm the socket while the user is speaking.
      ensureSocket();
      recorder.start();
      recorderRef.current = recorder;
      setStatus("recording");
    } catch {
      setError("دسترسی به میکروفون امکان‌پذیر نیست. لطفاً مجوز میکروفون را فعال کنید.");
      setStatus("error");
    }
  }, [ensureSocket]);

  /** Stop capture and ship the audio for transcription. */
  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      recorderRef.current = null;
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (status === "recording") {
      stopRecording();
    } else if (status === "idle" || status === "error") {
      void startRecording();
    }
  }, [status, startRecording, stopRecording]);

  const clearError = useCallback(() => {
    setError(null);
    setStatus("idle");
  }, []);

  // Teardown on unmount: stop mic, kill socket, silence TTS.
  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // no TTS support
      }
    };
  }, []);

  return {
    status,
    messages,
    error,
    ttsEnabled,
    setTtsEnabled,
    toggleRecording,
    clearError,
  };
}
