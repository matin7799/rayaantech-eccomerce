import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useCallback, useState } from "react";

interface PasswordStepFormProps {
  phone: string;
  onSubmit: (password: string) => Promise<void>;
  onBack: () => void;
}

/**
 * PasswordStepForm — Password entry step with show/hide toggle.
 */
export default function PasswordStepForm({ phone, onSubmit, onBack }: PasswordStepFormProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (password.length < 6) {
        setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
        return;
      }
      setIsLoading(true);
      try {
        await onSubmit(password);
      } catch {
        setError("رمز عبور نادرست است");
      } finally {
        setIsLoading(false);
      }
    },
    [password, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-text-primary">رمز عبور را وارد کنید</h1>
        <p className="text-sm font-medium text-text-secondary">
          شماره{" "}
          <span className="font-semibold text-text-primary" dir="ltr">
            {phone}
          </span>
        </p>
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-2">
        <div
          className={`flex items-center gap-3 rounded-xl border bg-surface-secondary px-4 py-3 transition-colors duration-300 ease-in-out ${
            error ? "border-danger" : "border-border focus-within:border-accent"
          }`}
        >
          <Lock className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="رمز عبور"
            className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
            autoComplete="current-password"
            aria-label="رمز عبور"
            aria-invalid={!!error}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-text-muted transition-colors hover:text-text-secondary"
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
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

      {/* Forgot Password */}
      <button
        type="button"
        className="self-start text-xs font-medium text-accent transition-colors hover:text-accent/80"
      >
        فراموشی رمز عبور
      </button>

      {/* Submit CTA */}
      <motion.button
        type="submit"
        disabled={isLoading || password.length < 6}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            ورود به حساب
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
