import { createFileRoute, Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import MethodSelectStep from "../../components/auth/MethodSelectStep";
import OtpVerifyInput from "../../components/auth/OtpVerifyInput";
import PasswordStepForm from "../../components/auth/PasswordStepForm";
import PhoneStepForm from "../../components/auth/PhoneStepForm";
import { trpc } from "../../lib/trpc";

/** Search params schema — captures ?from= for redirect-back */
const searchSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  validateSearch: searchSchema,
});

type AuthStep = "phone" | "method" | "otp" | "password";

const STEP_SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

/**
 * /auth/login — B2C consumer login page.
 * Multi-step OTP/Password authentication wired to tRPC backend.
 *
 * Supports:
 * - ?from= param for redirect-back-to-origin after successful auth
 * - isNewUser detection → routes to /auth/complete-profile onboarding
 * - Dual auth: OTP or password-based login
 */
function LoginPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const router = useRouter();
  const { from } = useSearch({ from: "/auth/login" });
  const utils = trpc.useUtils();

  const sendOtpMutation = trpc.auth.sendOtp.useMutation();
  const verifyOtpMutation = trpc.auth.verifyOtp.useMutation();
  const loginWithPasswordMutation = trpc.auth.loginWithPassword.useMutation();

  /** Navigate to origin or fallback route */
  const navigateToOrigin = useCallback(() => {
    navigate({ to: (from || "/") as string });
  }, [from, navigate]);

  /** Handle successful authentication — check isNewUser for onboarding gate */
  const handleAuthSuccess = useCallback(
    async (isNewUser: boolean) => {
      // CRITICAL: Force-fetch the updated auth state to ensure the session cookie
      // is recognized immediately. fetchQuery bypasses staleTime and guarantees
      // the response is available before we navigate.
      await utils.auth.me.fetch(undefined, { staleTime: 0 });

      // Invalidate all queries to ensure downstream components get fresh data
      await utils.invalidate();

      // Force TanStack Router to re-evaluate route guards with fresh auth state
      await router.invalidate();

      if (isNewUser) {
        // Route to onboarding gate, preserving the ?from= param
        navigate({
          to: "/auth/complete-profile",
          search: from ? { from } : undefined,
        });
      } else {
        toast.success("ورود موفق");
        navigateToOrigin();
      }
    },
    [navigate, from, navigateToOrigin, utils, router],
  );

  /* Step 1 → Step 2: Show method selection */
  const handlePhoneSubmit = useCallback(async (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep("method");
  }, []);

  /* Step 2 → Step 3a or 3b */
  const handleMethodSelect = useCallback(
    async (method: "otp" | "password") => {
      if (method === "otp") {
        try {
          await sendOtpMutation.mutateAsync({ mobile: phone });
          setStep("otp");
        } catch {
          toast.error("خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.");
        }
      } else {
        setStep("password");
      }
    },
    [phone, sendOtpMutation],
  );

  /* OTP verify → check isNewUser → route accordingly */
  const handleOtpVerify = useCallback(
    async (code: string) => {
      const result = await verifyOtpMutation.mutateAsync({
        mobile: phone,
        code,
      });
      if (result.success) {
        await handleAuthSuccess(result.isNewUser);
      }
    },
    [phone, verifyOtpMutation, handleAuthSuccess],
  );

  /* Resend OTP */
  const handleResendOtp = useCallback(async () => {
    try {
      await sendOtpMutation.mutateAsync({ mobile: phone });
      toast.success("کد تأیید مجدداً ارسال شد");
    } catch {
      toast.error("خطا در ارسال مجدد کد");
    }
  }, [phone, sendOtpMutation]);

  /* Password verify → success */
  const handlePasswordSubmit = useCallback(
    async (password: string) => {
      try {
        const result = await loginWithPasswordMutation.mutateAsync({
          mobile: phone,
          password,
        });
        if (result.success) {
          await handleAuthSuccess(result.isNewUser);
        }
      } catch {
        throw new Error("شماره موبایل یا رمز عبور نادرست است");
      }
    },
    [phone, loginWithPasswordMutation, handleAuthSuccess],
  );

  /* Back handlers */
  const goToPhone = useCallback(() => setStep("phone"), []);
  const goToMethod = useCallback(() => setStep("method"), []);

  return (
    <div className="flex flex-col gap-5">
      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
          >
            <PhoneStepForm onSubmit={handlePhoneSubmit} />
          </motion.div>
        )}

        {step === "method" && (
          <motion.div
            key="method-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
          >
            <MethodSelectStep phone={phone} onSelect={handleMethodSelect} onBack={goToPhone} />
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
          >
            <OtpVerifyInput
              phone={phone}
              onVerify={handleOtpVerify}
              onResend={handleResendOtp}
              onBack={goToMethod}
            />
          </motion.div>
        )}

        {step === "password" && (
          <motion.div
            key="password-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
          >
            <PasswordStepForm phone={phone} onSubmit={handlePasswordSubmit} onBack={goToMethod} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* B2B Partner Registration Link */}
      <div className="text-center">
        <Link
          to="/auth/partner-register"
          className="text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
        >
          ثبت‌نام همکاران (فروشندگان)
        </Link>
      </div>
    </div>
  );
}
