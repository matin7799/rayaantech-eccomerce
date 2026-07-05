import { createFileRoute, Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import MethodSelectStep from "../../components/auth/MethodSelectStep";
import OtpFailedStep from "../../components/auth/OtpFailedStep";
import OtpVerifyInput from "../../components/auth/OtpVerifyInput";
import PasswordStepForm from "../../components/auth/PasswordStepForm";
import PhoneStepForm from "../../components/auth/PhoneStepForm";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";
import { useGuestGuard } from "../../lib/useGuestGuard";
import { cn } from "../../lib/utils";

/** Search params schema — captures ?from= for redirect-back */
const searchSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  validateSearch: searchSchema,
});

type AuthStep = "phone" | "method" | "otp" | "password" | "otp-failed";

interface AccountState {
  exists: boolean;
  hasPassword: boolean;
}

const STEP_SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

/** Visual progress position of each step in the 3-dot indicator. */
const STEP_PROGRESS: Record<AuthStep, number> = {
  phone: 0,
  method: 1,
  otp: 2,
  password: 2,
  "otp-failed": 2,
};

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
  const [account, setAccount] = useState<AccountState>({ exists: false, hasPassword: false });
  const navigate = useNavigate();
  const router = useRouter();
  const { from } = useSearch({ from: "/auth/login" });
  const utils = trpc.useUtils();

  // Already logged in? Bounce back to origin (or home) instead of showing the form.
  const { markFlowStarted, isCheckingSession } = useGuestGuard(from);

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
  const handlePhoneSubmit = useCallback(
    async (phoneNumber: string) => {
      // From here on the user is mid-flow — suppress the guest guard so the
      // session created by verify/login doesn't race our own navigation.
      markFlowStarted();
      setPhone(phoneNumber);
      setStep("method");
    },
    [markFlowStarted],
  );

  /* Attempt to send the OTP; on failure branch to the fallback step. */
  const attemptSendOtp = useCallback(async () => {
    try {
      await sendOtpMutation.mutateAsync({ mobile: phone });
      setStep("otp");
    } catch {
      // SMS channel is down — figure out whether this is a new or existing account
      // so the fallback can offer register-without-OTP vs. password login.
      try {
        const state = await utils.auth.checkAccount.fetch({ mobile: phone });
        setAccount(state);
      } catch {
        setAccount({ exists: false, hasPassword: false });
      }
      setStep("otp-failed");
    }
  }, [phone, sendOtpMutation, utils]);

  /* Step 2 → Step 3a or 3b */
  const handleMethodSelect = useCallback(
    async (method: "otp" | "password") => {
      if (method === "otp") {
        await attemptSendOtp();
      } else {
        setStep("password");
      }
    },
    [attemptSendOtp],
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

  /* Fallback: send a brand-new user to register-without-OTP, preserving ?from= */
  const goToRegister = useCallback(() => {
    navigate({
      to: "/auth/register",
      search: { mobile: phone, ...(from ? { from } : {}) },
    });
  }, [navigate, phone, from]);

  /* Back handlers */
  const goToPhone = useCallback(() => setStep("phone"), []);
  const goToMethod = useCallback(() => setStep("method"), []);

  // While the session resolves, show a lightweight skeleton so an
  // already-authenticated user never flashes the login form before redirect.
  if (isCheckingSession) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="mx-auto h-6 w-40 rounded-lg" />
        <Skeleton className="mx-auto h-4 w-56 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 3-dot step progress indicator */}
      <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              STEP_PROGRESS[step] === i
                ? "w-6 bg-accent"
                : STEP_PROGRESS[step] > i
                  ? "w-1.5 bg-accent/50"
                  : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>

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

        {step === "otp-failed" && (
          <motion.div
            key="otp-failed-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
          >
            <OtpFailedStep
              phone={phone}
              account={account}
              onUsePassword={() => setStep("password")}
              onRegister={goToRegister}
              onRetry={attemptSendOtp}
              onBack={goToPhone}
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
