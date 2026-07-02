import { motion, useAnimation, type Variants } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const OTP_LENGTH = 5;
const RESEND_INTERVAL = 120; // seconds — matches server TTL

/**
 * Shake animation keyframes for failure feedback.
 * Physical micro-shaking motion via Framer Motion.
 */
const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

/**
 * Border glow states for OTP input feedback.
 */
type FeedbackState = "idle" | "success" | "error";

interface OtpVerifyInputProps {
  phone: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

/**
 * OtpVerifyInput — Tactile 5-digit OTP verification component.
 *
 * Features:
 * - Success: emerald glow pulse ring on borders
 * - Failure: crimson flash + physical shake animation
 * - 120-second countdown (hydration-safe, client-only)
 * - RTL-safe: digit container is explicitly LTR, focus direction unaffected
 * - Auto-submit on last digit
 * - Paste support
 */
export default function OtpVerifyInput({ phone, onVerify, onResend, onBack }: OtpVerifyInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_INTERVAL);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shakeControls = useAnimation();

  /* Hydration-safe countdown — only runs on client */
  useEffect(() => {
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = RESEND_INTERVAL - elapsed;
      if (remaining <= 0) {
        setCanResend(true);
        setCountdown(0);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCountdown(remaining);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* Format countdown as mm:ss */
  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  /* Get border classes based on feedback state */
  const getBorderClasses = useCallback((): string => {
    switch (feedback) {
      case "success":
        return "border-emerald-500 ring-2 ring-emerald-500/30";
      case "error":
        return "border-destructive ring-2 ring-destructive/30";
      default:
        return "border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20";
    }
  }, [feedback]);

  /* Handle digit input — RTL-safe: container is LTR, focus flows left-to-right */
  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const char = value.replace(/[^0-9]/g, "").slice(-1);
      const newDigits = [...digits];
      newDigits[index] = char;
      setDigits(newDigits);
      if (error) setError("");
      if (feedback !== "idle") setFeedback("idle");

      // Auto-advance to next input (LTR direction within container)
      if (char && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit if all filled
      if (char && index === OTP_LENGTH - 1) {
        const code = newDigits.join("");
        if (code.length === OTP_LENGTH) {
          handleVerify(code);
        }
      }
    },
    [digits, error, feedback],
  );

  /* Handle backspace navigation */
  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  /* Handle paste — fill all digits at once */
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      const newDigits = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i] ?? "";
      }
      setDigits(newDigits);
      const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();

      if (pasted.length === OTP_LENGTH) {
        handleVerify(pasted);
      }
    }
  }, []);

  /* Verify code with micro-feedback */
  const handleVerify = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setFeedback("idle");
      try {
        await onVerify(code);
        // Success — emerald glow
        setFeedback("success");
      } catch {
        // Failure — crimson flash + shake
        setFeedback("error");
        setError("کد وارد شده نادرست است");
        void shakeControls.start("shake");

        // Reset digits after shake completes
        setTimeout(() => {
          setDigits(Array(OTP_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }, 600);
      } finally {
        setIsLoading(false);
      }
    },
    [onVerify, shakeControls],
  );

  /* Resend handler */
  const handleResend = useCallback(async () => {
    setCanResend(false);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setFeedback("idle");
    inputRefs.current[0]?.focus();

    try {
      await onResend();
    } catch {
      // Silently handled — toast shown by parent
    }

    // Restart countdown from fresh timestamp
    const startTime = Date.now();
    setCountdown(RESEND_INTERVAL);
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = RESEND_INTERVAL - elapsed;
      if (remaining <= 0) {
        setCanResend(true);
        setCountdown(0);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  }, [onResend]);

  /* Manual submit */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const code = digits.join("");
      if (code.length !== OTP_LENGTH) {
        setError("لطفاً کد ۵ رقمی را کامل وارد کنید");
        return;
      }
      handleVerify(code);
    },
    [digits, handleVerify],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-text-primary">کد تأیید را وارد کنید</h1>
        <p className="text-sm font-medium text-text-secondary">
          کد ۵ رقمی ارسال شده به{" "}
          <span className="font-semibold text-text-primary" dir="ltr">
            {phone}
          </span>
        </p>
      </div>

      {/* OTP Digit Inputs with Micro-Animations */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          variants={shakeVariants}
          animate={shakeControls}
          initial="idle"
          className="flex items-center gap-2"
          dir="ltr"
          onPaste={handlePaste}
        >
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={isLoading}
              className={`h-12 w-11 rounded-xl border bg-surface-secondary text-center text-lg font-bold text-text-primary outline-none transition-all duration-300 ${getBorderClasses()} disabled:opacity-50`}
              aria-label={`رقم ${idx + 1}`}
            />
          ))}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-destructive"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        {/* Success message */}
        {feedback === "success" && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-medium text-emerald-600"
          >
            تأیید شد
          </motion.p>
        )}
      </div>

      {/* Timer + Resend */}
      <div className="flex items-center justify-center gap-3">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            ارسال مجدد کد
          </button>
        ) : (
          <span className="text-sm font-medium text-text-muted tabular-nums">
            ارسال مجدد تا{" "}
            <span dir="ltr" className="inline-block min-w-[3ch]">
              {formatTime(countdown)}
            </span>
          </span>
        )}
      </div>

      {/* Submit CTA */}
      <motion.button
        type="submit"
        disabled={isLoading || digits.join("").length < OTP_LENGTH}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            تأیید و ورود
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </>
        )}
      </motion.button>

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="text-center text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
      >
        انتخاب روش دیگر
      </button>
    </form>
  );
}
