import { motion } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";
import { useCallback, useState } from "react";
import { z } from "zod";

const phoneSchema = z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست");

interface PhoneStepFormProps {
  onSubmit: (phone: string) => Promise<void>;
}

/**
 * PhoneStepForm — Step 1: Iranian mobile number entry with Zod validation.
 */
export default function PhoneStepForm({ onSubmit }: PhoneStepFormProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
      setPhone(value);
      if (error) setError("");
    },
    [error],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = phoneSchema.safeParse(phone);
      if (!result.success) {
        setError(result.error.errors[0]?.message ?? "شماره نامعتبر");
        return;
      }
      setIsLoading(true);
      try {
        await onSubmit(phone);
      } catch {
        setError("خطا در ارسال کد. لطفاً دوباره تلاش کنید.");
      } finally {
        setIsLoading(false);
      }
    },
    [phone, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-text-primary">ورود / ثبت‌نام</h1>
        <p className="text-sm font-medium text-text-secondary">شماره موبایل خود را وارد کنید</p>
      </div>

      {/* Phone Input */}
      <div className="flex flex-col gap-2">
        <div
          className={`flex items-center gap-3 rounded-xl border bg-surface-secondary px-4 py-3 transition-colors duration-300 ease-in-out ${
            error ? "border-danger" : "border-border focus-within:border-accent"
          }`}
        >
          <Phone className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={handleChange}
            placeholder="09123456789"
            className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
            dir="ltr"
            autoComplete="tel"
            aria-label="شماره موبایل"
            aria-invalid={!!error}
          />
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

      {/* Submit CTA */}
      <motion.button
        type="submit"
        disabled={isLoading || phone.length < 11}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            ارسال کد تأیید
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </>
        )}
      </motion.button>
    </form>
  );
}
