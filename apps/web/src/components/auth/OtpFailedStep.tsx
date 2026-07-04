import { motion } from "framer-motion";
import { AlertTriangle, KeyRound, RotateCw, UserPlus } from "lucide-react";

interface AccountState {
  exists: boolean;
  hasPassword: boolean;
}

interface OtpFailedStepProps {
  phone: string;
  account: AccountState;
  onUsePassword: () => void;
  onRegister: () => void;
  onRetry: () => void;
  onBack: () => void;
}

/**
 * OtpFailedStep — shown when the OTP SMS fails to send.
 *
 * Branches on the account state so the user is never dead-ended:
 * - Existing account with a password → offer password login.
 * - Brand-new number → offer register-without-OTP.
 * - Existing account without a password → OTP is their only method; offer retry.
 */
export default function OtpFailedStep({
  phone,
  account,
  onUsePassword,
  onRegister,
  onRetry,
  onBack,
}: OtpFailedStepProps) {
  const isNewUser = !account.exists;
  const canUsePassword = account.exists && account.hasPassword;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
        </span>
        <h1 className="text-lg font-bold text-text-primary">ارسال کد تأیید ممکن نشد</h1>
        <p className="text-sm font-medium text-text-secondary">
          {isNewUser
            ? "می‌توانید بدون کد تأیید ثبت‌نام کنید."
            : canUsePassword
              ? "حساب شما موجود است، با رمز عبور وارد شوید."
              : "لطفاً دقایقی بعد دوباره تلاش کنید."}
        </p>
      </div>

      {/* Primary action */}
      <div className="flex flex-col gap-3">
        {isNewUser && (
          <motion.button
            type="button"
            onClick={onRegister}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-secondary/50 px-5 py-4 text-start transition-all duration-300 ease-in-out hover:border-accent hover:shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <UserPlus className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-text-primary">ثبت‌نام بدون کد تأیید</span>
              <span className="text-xs font-medium text-text-muted">
                ساخت حساب کاربری با رمز عبور
              </span>
            </div>
          </motion.button>
        )}

        {canUsePassword && (
          <motion.button
            type="button"
            onClick={onUsePassword}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-secondary/50 px-5 py-4 text-start transition-all duration-300 ease-in-out hover:border-accent hover:shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <KeyRound className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-text-primary">ورود با رمز عبور</span>
              <span className="text-xs font-medium text-text-muted">
                وارد کردن رمز عبور حساب کاربری
              </span>
            </div>
          </motion.button>
        )}

        {/* Retry is always available */}
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          تلاش مجدد برای ارسال کد
        </button>
      </div>

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="text-center text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
      >
        شماره{" "}
        <span dir="ltr" className="font-semibold">
          {phone}
        </span>{" "}
        — تغییر شماره موبایل
      </button>
    </div>
  );
}
