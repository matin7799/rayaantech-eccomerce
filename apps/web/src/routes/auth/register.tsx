import { createFileRoute, Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Phone, User } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthSubmitButton } from "../../components/auth/AuthSubmitButton";
import { trpc } from "../../lib/trpc";

/** Search params: prefilled mobile (from the OTP-failed fallback) + redirect-back */
const searchSchema = z.object({
  mobile: z.string().optional(),
  from: z.string().optional(),
});

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  validateSearch: searchSchema,
});

const iranianMobileRegex = /^09\d{9}$/;

/**
 * /auth/register — Retail registration WITHOUT OTP.
 *
 * Fallback path reached from the login flow when the OTP SMS channel is down.
 * Creates a retail account with mobile + full name + password, opens a session,
 * then routes to the origin. Phone uniqueness is enforced server-side.
 */
function RegisterPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { mobile: prefillMobile, from } = useSearch({ from: "/auth/register" });
  const utils = trpc.useUtils();

  const [mobile, setMobile] = useState(prefillMobile ?? "");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = trpc.auth.registerRetail.useMutation();

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!iranianMobileRegex.test(mobile)) errs.mobile = "شماره موبایل نامعتبر است";
    if (fullName.trim().length < 3) errs.fullName = "نام و نام خانوادگی الزامی است (حداقل ۳ حرف)";
    if (password.length < 8) errs.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [mobile, fullName, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await registerMutation.mutateAsync({
          mobile,
          fullName: fullName.trim(),
          password,
        });
        // Force-fetch fresh session so route guards see the new cookie immediately.
        await utils.auth.me.fetch(undefined, { staleTime: 0 });
        await utils.invalidate();
        await router.invalidate();
        toast.success("ثبت‌نام با موفقیت انجام شد");
        navigate({ to: (from || "/") as string });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطا در ثبت‌نام";
        toast.error(message);
      }
    },
    [mobile, fullName, password, validate, registerMutation, utils, router, navigate, from],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-text-primary">ثبت‌نام</h1>
        <p className="text-sm font-medium text-text-secondary leading-relaxed">
          ساخت حساب کاربری با رمز عبور، بدون نیاز به کد تأیید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldInput
          icon={<Phone className="h-4 w-4" aria-hidden="true" />}
          label="شماره موبایل"
          value={mobile}
          onChange={setMobile}
          error={errors.mobile}
          placeholder="09XXXXXXXXX"
          dir="ltr"
          required
        />

        <FieldInput
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          label="نام و نام خانوادگی"
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
          placeholder="نام کامل خود را وارد کنید"
          required
        />

        <FieldInput
          icon={<Lock className="h-4 w-4" aria-hidden="true" />}
          label="رمز عبور"
          value={password}
          onChange={setPassword}
          error={errors.password}
          placeholder="حداقل ۸ کاراکتر"
          type="password"
          required
        />

        <AuthSubmitButton isLoading={registerMutation.isPending} label="ثبت‌نام و ورود" />
      </form>

      {/* Back to login */}
      <div className="text-center">
        <Link
          to="/auth/login"
          search={from ? { from } : undefined}
          className="text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
        >
          حساب دارید؟ ورود
        </Link>
      </div>
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
