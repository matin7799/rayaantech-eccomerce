import { motion } from "framer-motion";
import {
  AlertTriangleIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";

/**
 * Static installment instruction data.
 * Persisted in installment_metadata table for user reference.
 */
const INSTRUCTION_DATA = {
  receiverName: "علیرضا حاتمی",
  receiverNationalId: "4420825766",
  branchName: "رایان‌تِک - شعبه جوان",
  branchAddress: "بلوار جوان، از میدان عالم به سمت میدان دانش‌آموز، بعد از پل عابر پیاده",
  branchPostalCode: "8915743336",
  branchHours: "09:30–13:30 و 17:30–22:00",
  supportPhone: "09131512790",
} as const;

interface Props {
  /** Optional: override static data with per-order metadata from backend */
  metadata?: {
    receiverName?: string;
    receiverNationalId?: string;
    branchName?: string;
    branchAddress?: string;
    branchPostalCode?: string;
    branchHours?: string;
    supportPhone?: string;
  };
}

/**
 * InstallmentInstructionCard — Glassmorphic instruction panel.
 *
 * Displays the immutable cheque guidelines, payee info, branch address,
 * and legal clauses for the Rayan Tech installment flow.
 *
 * Used in:
 * - /payment/callback (after successful installment payment)
 * - /profile InstallmentsTab (persistent reference for cheque mailing)
 */
export function InstallmentInstructionCard({ metadata }: Props) {
  const data = { ...INSTRUCTION_DATA, ...metadata };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-[--glass-border] bg-surface-glass p-5 backdrop-blur-xl shadow-lg sm:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
          <FileTextIcon className="h-4 w-4 text-accent" />
        </span>
        <h3 className="text-base font-bold text-text-primary">
          راهنمای ادامه فرآیند خرید اقساطی رایان‌تک
        </h3>
      </div>

      <div className="space-y-5">
        {/* Cheque Requirements Section */}
        <InstructionSection title="شروط چک">
          <p className="text-xs leading-relaxed text-text-secondary">
            تعداد، مبلغ و تاریخ دقیق چک‌ها بر اساس محاسبه‌گر سبد خرید تعیین می‌شود. لطفاً اطلاعات را
            دقیقاً مطابق فرم ثبت کنید.
          </p>
          <div className="mt-3 rounded-xl border border-warning/20 bg-warning-light/50 p-3">
            <div className="flex gap-2">
              <AlertTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
              <p className="text-[11px] leading-relaxed text-text-secondary">
                در صورتی که نیاز به چک ضمانت است، مبلغ و تاریخ چک ضمانت باید دقیقاً مطابق ساختار
                اعلامی باشد و این چک حتماً باید صادرشده توسط شخص دیگری (ثالث) باشد.
              </p>
            </div>
          </div>
        </InstructionSection>

        {/* Payee Information */}
        <InstructionSection title="اطلاعات گیرنده چک">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow
              icon={<UserIcon className="h-3.5 w-3.5" />}
              label="نام گیرنده"
              value={data.receiverName}
            />
            <InfoRow
              icon={<FileTextIcon className="h-3.5 w-3.5" />}
              label="کد ملی گیرنده"
              value={data.receiverNationalId}
              dir="ltr"
            />
          </div>
        </InstructionSection>

        {/* Branch Address */}
        <InstructionSection title="آدرس پستی جهت ارسال فیزیکی چک‌ها">
          <div className="space-y-2.5">
            <InfoRow
              icon={<MapPinIcon className="h-3.5 w-3.5" />}
              label={data.branchName}
              value={data.branchAddress}
            />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InfoRow
                icon={<ClockIcon className="h-3.5 w-3.5" />}
                label="ساعت کاری"
                value={data.branchHours}
                dir="ltr"
              />
              <InfoRow
                icon={<MapPinIcon className="h-3.5 w-3.5" />}
                label="کد پستی"
                value={data.branchPostalCode}
                dir="ltr"
              />
            </div>
          </div>
        </InstructionSection>

        {/* Legal Delivery Clause */}
        <InstructionSection title="بند تعهد تحویل">
          <div className="rounded-xl border border-border-light bg-surface-secondary/50 p-3">
            <p className="text-[11px] leading-relaxed text-text-secondary">
              ارسال فیزیکی محصول خریداری شده، صرفاً پس از دریافت فیزیکی چک‌ها توسط کارشناسان رایان‌تک و
              تایید نهایی آن‌ها صورت می‌گیرد.
            </p>
          </div>
        </InstructionSection>

        {/* Support Contact */}
        <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-surface-action p-3">
          <PhoneIcon className="h-4 w-4 text-accent" />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted">پشتیبانی اختصاصی اقساط</span>
            <span dir="ltr" className="text-sm font-semibold text-accent tabular-nums">
              {data.supportPhone}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Sub-components ─── */

function InstructionSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold text-text-primary">{title}</h4>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border-light bg-surface p-2.5">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-text-muted">{label}</span>
        <span dir={dir} className="text-xs font-medium text-text-primary leading-relaxed">
          {value}
        </span>
      </div>
    </div>
  );
}
