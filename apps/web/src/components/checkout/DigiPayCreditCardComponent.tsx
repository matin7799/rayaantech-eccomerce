import { motion } from "framer-motion";
import { ArrowLeftRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { formatTomansPersian } from "../../lib/persian-numerals";

interface DigiPayCreditCardProps {
  totalAmount: number;
  mobile: string;
}

export function DigiPayCreditCardComponent({ totalAmount, mobile }: DigiPayCreditCardProps) {
  // Compute hypothetical installments (for preview: e.g. 4-months, 0 downpayment, 4% fee)
  const termMonths = 4;
  const monthlyInterest = 0.04;
  const totalWithInterest = totalAmount * (1 + monthlyInterest);
  const monthlyInstallment = Math.ceil(totalWithInterest / termMonths);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[--glass-border] bg-surface-glass/90 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-success/5 blur-3xl" />

      {/* Credit Card Graphic Wrapper */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative mx-auto mb-6 h-48 w-full max-w-sm overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-2xl ring-1 ring-white/20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/80"
      >
        {/* Glow behind the card brand */}
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

        <div className="flex h-full flex-col justify-between">
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                خرید اعتباری
              </span>
              <h3 className="text-sm font-black tracking-tight text-white mt-0.5">
                دیجی‌پی / اعتبار
              </h3>
            </div>
            {/* Custom Brand Logo */}
            <div className="flex h-9 w-14 items-center justify-center rounded-lg bg-white/10 p-1 backdrop-blur-md">
              <img
                src="/icons/Digipay-Logo.svg"
                alt="DigiPay Logo"
                className="max-h-full max-w-full object-contain filter invert brightness-200"
              />
            </div>
          </div>

          {/* Card Body (Installment Details Preview) */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">مبلغ خرید تأمین‌شده</span>
            <div className="text-xl font-extrabold tracking-wide text-emerald-400 tabular-nums">
              {formatTomansPersian(totalAmount)}{" "}
              <span className="text-xs font-normal text-white">تومان</span>
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-end border-t border-white/10 pt-3">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 uppercase">تنور بازپرداخت</span>
              <span className="text-xs font-bold text-white mt-0.5 tabular-nums">۴ قسط ماهانه</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-slate-400 uppercase">قسط ماهانه</span>
              <span className="text-xs font-bold text-white mt-0.5 tabular-nums">
                {formatTomansPersian(monthlyInstallment)} تومان
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Credit Features Grid */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="flex items-start gap-2.5 rounded-xl bg-surface-secondary/40 p-3 border border-border-light/10">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent mt-0.5" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-text-primary">سریع و بدون ضامن</span>
            <p className="text-[10px] text-text-muted mt-0.5">تخصیص آنی با سفته الکترونیک</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-surface-secondary/40 p-3 border border-border-light/10">
          <ArrowLeftRight className="h-4 w-4 shrink-0 text-accent mt-0.5" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-text-primary">کمترین نرخ بهره</span>
            <p className="text-[10px] text-text-muted mt-0.5">محاسبه بر اساس رتبه‌سنجی بانکی</p>
          </div>
        </div>
      </div>

      {/* Phone prefill note */}
      <div className="rounded-xl border border-accent/15 bg-surface-action/20 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span className="text-xs font-bold text-text-primary">تطابق هویت الزامی است</span>
        </div>
        <p className="text-[10px] text-text-secondary leading-relaxed mt-1.5">
          شماره همراه خرید <strong>{mobile}</strong> می‌باشد. برای استفاده از اعتبار، کدملی باید با
          مالک این شماره همراه در سامانه شاهکار تطابق داشته باشد.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1 text-[9px] text-text-muted">
        <Sparkles className="h-3 w-3 text-accent" />
        <span>پشتیبانی کامل از اعتبار خرید ۴ مرحله‌ای و تک مرحله‌ای دیجی‌پی</span>
      </div>
    </div>
  );
}
