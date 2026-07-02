import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const OTP_LENGTH = 5;
const RESEND_INTERVAL = 120; // seconds

interface OtpStepFormProps {
  phone: string;
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
}

/**
 * OtpStepForm — Step 2: 5-digit OTP verification with resend timer.
 * Custom digit inputs with auto-advance, RTL-safe, hydration-safe timer.
 */
export default function OtpStepForm({ phone, onVerify, onBack }: OtpStepFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_INTERVAL);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Start countdown on mount */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
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

  /* Handle digit input */
  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const char = value.replace(/[^0-9]/g, "").slice(-1);
      const newDigits = [...digits];
      newDigits[index] = char;
      setDigits(newDigits);
      if (error) setError("");

      // Auto-advance to next input
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
    [digits, error],
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

  /* Handle paste */
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

  /* Verify code */
  const handleVerify = useCallback(
    async (code: string) => {
      setIsLoading(true);
      try {
        await onVerify(code);
      } catch {
        setError("کد وارد شده نادرست است");
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    },
    [onVerify],
  );

  /* Resend */
  const handleResend = useCallback(() => {
    setCanResend(false);
    setCountdown(RESEND_INTERVAL);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    inputRefs.current[0]?.focus();

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

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

      {/* OTP Digit Inputs */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2" dir="ltr" onPaste={handlePaste}>
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
              className={`h-12 w-11 rounded-xl border bg-surface-secondary text-center text-lg font-bold text-text-primary outline-none transition-all duration-200 ${
                error
                  ? "border-danger"
                  : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
              }`}
              aria-label={`رقم ${idx + 1}`}
            />
          ))}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-danger"
            role="alert"
          >
            {error}
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
          <span className="text-sm font-medium text-text-muted">
            ارسال مجدد تا {formatTime(countdown)}
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

      {/* Back to phone step */}
      <button
        type="button"
        onClick={onBack}
        className="text-center text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
      >
        تغییر شماره موبایل
      </button>
    </form>
  );
}
