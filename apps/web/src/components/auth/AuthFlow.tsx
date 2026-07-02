import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import AuthCardContainer from "./AuthCardContainer";
import MethodSelectStep from "./MethodSelectStep";
import OtpStepForm from "./OtpStepForm";
import PasswordStepForm from "./PasswordStepForm";
import PhoneStepForm from "./PhoneStepForm";

type AuthStep = "phone" | "method" | "otp" | "password";

const STEP_SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

/** Placeholder: simulate sending OTP */
async function sendOtp(_phone: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

/** Placeholder: simulate verifying OTP */
async function verifyOtp(_phone: string, _code: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

/** Placeholder: simulate password login */
async function loginWithPassword(_phone: string, _password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

/**
 * AuthFlow — Multi-step OTP/Password authentication state machine.
 *
 * Flow:
 * 1. Phone entry
 * 2. Method selection (OTP or Password)
 * 3a. OTP verification (5-digit code)
 * 3b. Password entry
 */
export default function AuthFlow() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  /* Step 1 → Step 2 */
  const handlePhoneSubmit = useCallback(async (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep("method");
  }, []);

  /* Step 2 → Step 3a or 3b */
  const handleMethodSelect = useCallback(
    async (method: "otp" | "password") => {
      if (method === "otp") {
        await sendOtp(phone);
        setStep("otp");
      } else {
        setStep("password");
      }
    },
    [phone],
  );

  /* OTP verify → success */
  const handleOtpVerify = useCallback(
    async (code: string) => {
      await verifyOtp(phone, code);
      navigate({ to: "/" });
    },
    [phone, navigate],
  );

  /* Password verify → success */
  const handlePasswordSubmit = useCallback(
    async (password: string) => {
      await loginWithPassword(phone, password);
      navigate({ to: "/" });
    },
    [phone, navigate],
  );

  /* Back handlers */
  const goToPhone = useCallback(() => setStep("phone"), []);
  const goToMethod = useCallback(() => setStep("method"), []);

  return (
    <AuthCardContainer>
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
            <OtpStepForm phone={phone} onVerify={handleOtpVerify} onBack={goToMethod} />
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
    </AuthCardContainer>
  );
}
