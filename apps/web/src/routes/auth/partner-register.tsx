import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Award, Briefcase, CheckCircle2, Phone, Upload, User } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import OtpVerifyInput from "../../components/auth/OtpVerifyInput";
import { trpc } from "../../lib/trpc";
import { useGuestGuard } from "../../lib/useGuestGuard";

export const Route = createFileRoute("/auth/partner-register")({
  component: PartnerRegisterPage,
});

/** Registration steps */
type RegStep = "phone" | "otp" | "details" | "success";

const STEP_SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

const phoneSchema = z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست");

/**
 * /auth/partner-register — B2B wholesale companion registration.
 *
 * Progressive multi-step form:
 * 1. Phone number entry
 * 2. OTP verification
 * 3. Business details (name, workplace, experience, document upload)
 * 4. Success / pending approval confirmation
 */
function PartnerRegisterPage() {
  const [step, setStep] = useState<RegStep>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [workplaceName, setWorkplaceName] = useState("");
  const [experience, setExperience] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const navigate = useNavigate();
  const router = useRouter();
  const utils = trpc.useUtils();

  // Already logged in? Bounce home instead of showing partner registration.
  const { markFlowStarted } = useGuestGuard();

  const sendOtpMutation = trpc.auth.sendOtp.useMutation();
  const registerPartnerMutation = trpc.auth.registerPartner.useMutation();

  /* ─── Step 1: Phone ─── */
  const [phoneError, setPhoneError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handlePhoneSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = phoneSchema.safeParse(phone);
      if (!result.success) {
        setPhoneError(result.error.errors[0]?.message ?? "شماره نامعتبر");
        return;
      }
      setPhoneLoading(true);
      // Mid-flow from here — suppress the guest guard (OTP verify opens a session).
      markFlowStarted();
      try {
        await sendOtpMutation.mutateAsync({ mobile: phone });
        setStep("otp");
      } catch {
        toast.error("خطا در ارسال کد تأیید");
      } finally {
        setPhoneLoading(false);
      }
    },
    [phone, sendOtpMutation, markFlowStarted],
  );

  /* ─── Step 2: OTP ─── */
  const handleOtpVerify = useCallback(async (code: string) => {
    // Store code for final submission, advance to details
    setOtpCode(code);
    setStep("details");
  }, []);

  const handleResendOtp = useCallback(async () => {
    try {
      await sendOtpMutation.mutateAsync({ mobile: phone });
      toast.success("کد تأیید مجدداً ارسال شد");
    } catch {
      toast.error("خطا در ارسال مجدد کد");
    }
  }, [phone, sendOtpMutation]);

  /* ─── Step 3: Details ─── */
  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  const validateDetails = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (fullName.trim().length < 3) errors.fullName = "نام و نام خانوادگی الزامی است";
    if (workplaceName.trim().length < 2) errors.workplaceName = "نام محل کار الزامی است";
    if (experience.trim().length < 1) errors.experience = "سابقه کاری الزامی است";
    setDetailsErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fullName, workplaceName, experience]);

  const handleDetailsSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateDetails()) return;

      setDetailsLoading(true);
      try {
        await registerPartnerMutation.mutateAsync({
          mobile: phone,
          code: otpCode,
          fullName: fullName.trim(),
          workplaceName: workplaceName.trim(),
          experience: experience.trim(),
          documentUrl: documentUrl.trim() || undefined,
        });
        // Force-fetch fresh session state after registration sets the cookie
        await utils.auth.me.fetch(undefined, { staleTime: 0 });
        await utils.invalidate();
        await router.invalidate();
        setStep("success");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطا در ثبت‌نام";
        toast.error(message);
      } finally {
        setDetailsLoading(false);
      }
    },
    [
      phone,
      otpCode,
      fullName,
      workplaceName,
      experience,
      documentUrl,
      validateDetails,
      registerPartnerMutation,
    ],
  );

  /* ─── Step indicator ─── */
  const stepIndex = step === "phone" ? 0 : step === "otp" ? 1 : step === "details" ? 2 : 3;

  return (
    <div className="flex flex-col gap-5">
      {/* Step Progress Indicator */}
      {step !== "success" && (
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= stepIndex ? "w-8 bg-accent" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ─── Step 1: Phone ─── */}
        {step === "phone" && (
          <motion.form
            key="partner-phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
            onSubmit={handlePhoneSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-lg font-bold text-text-primary">ثبت‌نام همکاران</h1>
              <p className="text-sm font-medium text-text-secondary">
                شماره موبایل خود را برای ثبت‌نام وارد کنید
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div
                className={`flex items-center gap-3 rounded-xl border bg-surface-secondary px-4 py-3 transition-colors duration-300 ${
                  phoneError ? "border-danger" : "border-border focus-within:border-accent"
                }`}
              >
                <Phone className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11));
                    if (phoneError) setPhoneError("");
                  }}
                  placeholder="09123456789"
                  className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
                  dir="ltr"
                  autoComplete="tel"
                  aria-label="شماره موبایل"
                />
              </div>
              {phoneError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-danger"
                  role="alert"
                >
                  {phoneError}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={phoneLoading || phone.length < 11}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {phoneLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  ارسال کد تأیید
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </>
              )}
            </motion.button>

            <div className="text-center">
              <Link
                to="/auth/login"
                className="text-xs font-medium text-text-muted transition-colors hover:text-accent"
              >
                ورود به حساب کاربری
              </Link>
            </div>
          </motion.form>
        )}

        {/* ─── Step 2: OTP ─── */}
        {step === "otp" && (
          <motion.div
            key="partner-otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
          >
            <OtpVerifyInput
              phone={phone}
              onVerify={handleOtpVerify}
              onResend={handleResendOtp}
              onBack={() => setStep("phone")}
            />
          </motion.div>
        )}

        {/* ─── Step 3: Business Details ─── */}
        {step === "details" && (
          <motion.form
            key="partner-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={STEP_SPRING}
            onSubmit={handleDetailsSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-lg font-bold text-text-primary">اطلاعات کسب‌وکار</h1>
              <p className="text-sm font-medium text-text-secondary">
                اطلاعات زیر جهت بررسی و تأیید توسط مدیریت ثبت می‌شود
              </p>
            </div>

            {/* Full Name */}
            <FieldInput
              icon={<User className="h-4 w-4" aria-hidden="true" />}
              label="نام و نام خانوادگی"
              value={fullName}
              onChange={setFullName}
              error={detailsErrors.fullName}
              placeholder="نام کامل"
            />

            {/* Workplace Name */}
            <FieldInput
              icon={<Briefcase className="h-4 w-4" aria-hidden="true" />}
              label="نام محل کار"
              value={workplaceName}
              onChange={setWorkplaceName}
              error={detailsErrors.workplaceName}
              placeholder="نام فروشگاه یا شرکت"
            />

            {/* Experience */}
            <FieldInput
              icon={<Award className="h-4 w-4" aria-hidden="true" />}
              label="سابقه کاری"
              value={experience}
              onChange={setExperience}
              error={detailsErrors.experience}
              placeholder="مثلاً: ۵ سال فعالیت در حوزه موبایل"
            />

            {/* Document Upload URL (placeholder for file upload integration) */}
            <FieldInput
              icon={<Upload className="h-4 w-4" aria-hidden="true" />}
              label="آدرس مدرک کسب‌وکار (اختیاری)"
              value={documentUrl}
              onChange={setDocumentUrl}
              error={detailsErrors.documentUrl}
              placeholder="لینک تصویر جواز کسب"
              required={false}
            />

            <motion.button
              type="submit"
              disabled={detailsLoading}
              whileTap={{ scale: 0.98 }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {detailsLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  ثبت درخواست همکاری
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => setStep("otp")}
              className="text-center text-xs font-medium text-text-muted transition-colors hover:text-accent"
            >
              بازگشت
            </button>
          </motion.form>
        )}

        {/* ─── Step 4: Success / Pending ─── */}
        {step === "success" && (
          <motion.div
            key="partner-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-5 py-4 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold text-text-primary">درخواست شما ثبت شد</h1>
              <p className="text-sm font-medium text-text-secondary leading-relaxed">
                درخواست همکاری شما با موفقیت ثبت شد و پس از بررسی توسط تیم مدیریت، حساب شما فعال
                خواهد شد.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="mt-2 rounded-xl bg-accent/10 px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              بازگشت به صفحه اصلی
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
}

function FieldInput({
  icon,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = true,
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
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
          aria-label={label}
          aria-required={required}
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
  );
}
