import { createFileRoute, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Mail, SkipForward, User } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthSubmitButton } from "../../components/auth/AuthSubmitButton";
import { trpc } from "../../lib/trpc";

/** Search params schema for redirect-back support */
const searchSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute("/auth/complete-profile")({
  component: CompleteProfilePage,
  validateSearch: searchSchema,
});

/**
 * /auth/complete-profile — New-user onboarding gate (skippable).
 *
 * Shown after first OTP login for users with no profile data.
 * Captures: Full Name, Email (optional), Password (optional for dual-auth).
 * Skip button safely bypasses and finalizes session with defaults.
 */
function CompleteProfilePage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { from } = useSearch({ from: "/auth/complete-profile" });
  const utils = trpc.useUtils();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const completeProfileMutation = trpc.auth.completeProfile.useMutation();

  /** Navigate to the origin route or fallback to home */
  const navigateToOrigin = useCallback(async () => {
    // Force-fetch fresh session state to ensure profile data is current
    await utils.auth.me.fetch(undefined, { staleTime: 0 });
    await utils.invalidate();
    await router.invalidate();
    navigate({ to: (from || "/") as string });
  }, [from, navigate, utils, router]);

  /** Validate form fields */
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (fullName.trim().length < 3) errs.fullName = "نام و نام خانوادگی الزامی است (حداقل ۳ حرف)";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "ایمیل نامعتبر است";
    if (password && password.length < 8) errs.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fullName, email, password]);

  /** Submit profile */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await completeProfileMutation.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
          password: password || undefined,
        });
        toast.success("اطلاعات پروفایل ذخیره شد");
        await navigateToOrigin();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطا در ذخیره اطلاعات";
        toast.error(message);
      }
    },
    [fullName, email, password, validate, completeProfileMutation, navigateToOrigin],
  );

  /** Skip onboarding — go directly to destination */
  const handleSkip = useCallback(async () => {
    await navigateToOrigin();
  }, [navigateToOrigin]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-text-primary">تکمیل اطلاعات</h1>
        <p className="text-sm font-medium text-text-secondary leading-relaxed">
          برای تجربه بهتر، اطلاعات خود را تکمیل کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <FieldInput
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          label="نام و نام خانوادگی"
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
          placeholder="نام کامل خود را وارد کنید"
          required
        />

        {/* Email */}
        <FieldInput
          icon={<Mail className="h-4 w-4" aria-hidden="true" />}
          label="ایمیل"
          value={email}
          onChange={setEmail}
          error={errors.email}
          placeholder="email@example.com"
          dir="ltr"
        />

        {/* Password */}
        <FieldInput
          icon={<Lock className="h-4 w-4" aria-hidden="true" />}
          label="رمز عبور"
          value={password}
          onChange={setPassword}
          error={errors.password}
          placeholder="حداقل ۸ کاراکتر (اختیاری)"
          type="password"
        />

        <p className="text-[11px] font-medium text-text-muted leading-relaxed">
          با تنظیم رمز عبور، امکان ورود با رمز علاوه بر کد تأیید فعال می‌شود.
        </p>

        {/* Submit */}
        <AuthSubmitButton isLoading={completeProfileMutation.isPending} label="ذخیره و ادامه" />
      </form>

      {/* Skip button */}
      <button
        type="button"
        onClick={handleSkip}
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:text-accent"
      >
        <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
        رد کردن / بعداً تکمیل می‌کنم
      </button>
    </div>
  );
}

/* ─── Reusable Field Input ─── */

interface FieldInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  dir?: string;
}

function FieldInput({
  icon,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  type = "text",
  dir,
}: FieldInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-surface-secondary px-4 py-3 transition-colors duration-300 ${
          error ? "border-danger" : "border-border focus-within:border-accent"
        }`}
      >
        <span className="shrink-0 text-text-muted">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          dir={dir}
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
  );
}
