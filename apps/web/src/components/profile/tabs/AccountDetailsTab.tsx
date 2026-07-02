import { motion } from "framer-motion";
import { Edit3, KeyRound, Lock, Mail, Phone, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../../lib/trpc";
import { AuthSubmitButton } from "../../auth/AuthSubmitButton";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

/**
 * AccountDetailsTab — جزییات حساب
 *
 * Dual-mode: View (read-only display) ↔ Edit (form with validation).
 * Wired to profile.getProfile + profile.updateProfile tRPC procedures.
 * Mobile field is read-only (locked behind system OTP verification).
 */
export function AccountDetailsTab() {
  const profileQuery = trpc.profile.getProfile.useQuery();
  const updateMutation = trpc.profile.updateProfile.useMutation();
  const utils = trpc.useUtils();

  const profile = profileQuery.data?.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form state when profile data loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (fullName.trim().length < 3) errs.fullName = "نام و نام خانوادگی الزامی است (حداقل ۳ حرف)";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "ایمیل نامعتبر است";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fullName, email]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await updateMutation.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
        });
        toast.success("اطلاعات حساب به‌روزرسانی شد");
        setIsEditing(false);
        void utils.profile.getProfile.invalidate();
      } catch {
        toast.error("[profile/account] خطا در به‌روزرسانی اطلاعات");
      }
    },
    [fullName, email, validate, updateMutation, utils],
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFullName(profile?.fullName || "");
    setEmail(profile?.email || "");
    setErrors({});
  }, [profile]);

  // Skeleton
  if (profileQuery.isLoading) {
    return <AccountSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-text-primary">جزییات حساب</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
            ویرایش
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <FieldRow
            icon={<User className="h-4 w-4" />}
            label="نام و نام خانوادگی"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
            placeholder="نام کامل"
          />

          {/* Email */}
          <FieldRow
            icon={<Mail className="h-4 w-4" />}
            label="ایمیل"
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="email@example.com"
            dir="ltr"
          />

          {/* Mobile (locked) */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-secondary/50 px-4 py-3 opacity-60">
            <Phone className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
            <span className="flex-1 text-sm font-medium text-text-muted" dir="ltr">
              {profile?.mobile ?? "—"}
            </span>
            <span className="text-[10px] font-medium text-text-muted">غیرقابل تغییر</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <AuthSubmitButton isLoading={updateMutation.isPending} label="ذخیره تغییرات" />
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:text-text-secondary"
            >
              انصراف
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <ReadOnlyRow
            icon={<User className="h-4 w-4" />}
            label="نام"
            value={profile?.fullName || "تنظیم نشده"}
          />
          <ReadOnlyRow
            icon={<Mail className="h-4 w-4" />}
            label="ایمیل"
            value={profile?.email || "تنظیم نشده"}
            dir="ltr"
          />
          <ReadOnlyRow
            icon={<Phone className="h-4 w-4" />}
            label="موبایل"
            value={profile?.mobile || "—"}
            dir="ltr"
          />
        </div>
      )}

      {/* ─── Password Management Section ─── */}
      <Separator />
      <PasswordChangeForm />
    </motion.div>
  );
}

/* ─── Sub-Components ─── */

/** Password change form — تغییر رمز عبور */
function PasswordChangeForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updatePasswordMutation = trpc.profile.updatePassword.useMutation();

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!currentPassword) errs.currentPassword = "رمز فعلی الزامی است";
    if (newPassword.length < 8) errs.newPassword = "رمز جدید باید حداقل ۸ کاراکتر باشد";
    if (newPassword !== confirmPassword) errs.confirmPassword = "رمز جدید و تکرار آن یکسان نیستند";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await updatePasswordMutation.mutateAsync({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        toast.success("رمز عبور با موفقیت تغییر کرد");
        setIsOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطا در تغییر رمز عبور";
        toast.error(message);
      }
    },
    [currentPassword, newPassword, confirmPassword, validate, updatePasswordMutation],
  );

  if (!isOpen) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">تغییر رمز عبور</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Lock data-icon="inline-start" />
          تغییر رمز
        </Button>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground">تغییر رمز عبور</span>
      </div>

      <FieldRow
        icon={<Lock className="h-4 w-4" />}
        label="رمز عبور فعلی"
        value={currentPassword}
        onChange={setCurrentPassword}
        error={errors.currentPassword}
        placeholder="رمز فعلی"
        type="password"
      />

      <FieldRow
        icon={<Lock className="h-4 w-4" />}
        label="رمز عبور جدید"
        value={newPassword}
        onChange={setNewPassword}
        error={errors.newPassword}
        placeholder="حداقل ۸ کاراکتر"
        type="password"
      />

      <FieldRow
        icon={<Lock className="h-4 w-4" />}
        label="تکرار رمز جدید"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        placeholder="تکرار رمز جدید"
        type="password"
      />

      <div className="flex items-center gap-3">
        <AuthSubmitButton isLoading={updatePasswordMutation.isPending} label="تغییر رمز عبور" />
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setErrors({});
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          انصراف
        </button>
      </div>
    </motion.form>
  );
}

function FieldRow({
  icon,
  label,
  value,
  onChange,
  error,
  placeholder,
  dir,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  dir?: string;
  type?: string;
}) {
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

function ReadOnlyRow({
  icon,
  label,
  value,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dir?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-light bg-surface-secondary/30 px-4 py-3">
      <span className="shrink-0 text-text-muted">{icon}</span>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-[10px] font-medium text-text-muted">{label}</span>
        <span className="text-sm font-medium text-text-primary" dir={dir}>
          {value}
        </span>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-28 animate-pulse rounded-lg bg-surface-secondary" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-secondary" />
      ))}
    </div>
  );
}
