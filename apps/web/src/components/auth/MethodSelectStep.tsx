import { motion } from "framer-motion";
import { KeyRound, MessageSquare } from "lucide-react";

type AuthMethod = "otp" | "password";

interface MethodSelectStepProps {
  phone: string;
  onSelect: (method: AuthMethod) => void;
  onBack: () => void;
}

/**
 * MethodSelectStep — Step 2: Choose between OTP or Password login.
 */
export default function MethodSelectStep({ phone, onSelect, onBack }: MethodSelectStepProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold text-text-primary">روش ورود را انتخاب کنید</h1>
        <p className="text-sm font-medium text-text-secondary">
          شماره{" "}
          <span className="font-semibold text-text-primary" dir="ltr">
            {phone}
          </span>
        </p>
      </div>

      {/* Method Options */}
      <div className="flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={() => onSelect("otp")}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-4 rounded-xl border border-border bg-surface-secondary/50 px-5 py-4 text-start transition-all duration-300 ease-in-out hover:border-accent hover:shadow-sm"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <MessageSquare className="h-5 w-5 text-accent" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-text-primary">ورود با کد تأیید</span>
            <span className="text-xs font-medium text-text-muted">
              ارسال کد ۵ رقمی به شماره موبایل
            </span>
          </div>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => onSelect("password")}
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
      </div>

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="text-center text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
      >
        تغییر شماره موبایل
      </button>
    </div>
  );
}
