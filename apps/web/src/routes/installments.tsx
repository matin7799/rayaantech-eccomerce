import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangleIcon,
  ClockIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PriceInput } from "../components/ui/PriceInput";
import { Skeleton } from "../components/ui/skeleton";
import { Slider } from "../components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { formatTomansPersian, toPersianDigits } from "../lib/persian-numerals";
import { trpc } from "../lib/trpc";

export const Route = createFileRoute("/installments")({
  component: InstallmentsLandingPage,
});

/** Slider/rounding step: 100,000 Toman */
const STEP = 100_000;
const ROUND_UNIT = 100_000;

function InstallmentsLandingPage() {
  return (
    <div className="mx-auto max-w-page-max px-4 py-10 sm:px-6 lg:px-8">
      {/* ─── Hero Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">خرید اقساطی رایان تک</h1>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base max-w-2xl mx-auto">
          سخت‌افزار مورد نظرتان را همین حالا تهیه کنید و هزینه آن را در اقساط ماهانه پرداخت کنید. دو
          مسیر اعتباری در اختیار شماست: اقساط اختصاصی رایان تک و اعتبار دیجی‌پی.
        </p>
      </motion.div>

      {/* ─── Provider Tabs: Calculator ─── */}
      <Tabs defaultValue="rayantech" className="flex flex-col gap-8">
        <TabsList className="mx-auto w-fit rounded-xl bg-surface-secondary p-1">
          <TabsTrigger
            value="rayantech"
            className="rounded-lg px-5 py-2 text-sm font-semibold data-[state=active]:bg-surface data-[state=active]:shadow-sm gap-2"
          >
            <CreditCardIcon className="h-4 w-4" />
            اقساطی رایان تک
          </TabsTrigger>
          <TabsTrigger
            value="digipay"
            className="rounded-lg px-5 py-2 text-sm font-semibold data-[state=active]:bg-surface data-[state=active]:shadow-sm gap-2"
          >
            <ZapIcon className="h-4 w-4" />
            اعتبار دیجی‌پی
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rayantech">
          <RayantechCalculator />
        </TabsContent>

        <TabsContent value="digipay">
          <DigipayInfo />
        </TabsContent>
      </Tabs>

      {/* ─── Comparative Provider Grid ─── */}
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Rayan Tech Card — with neon conic glow */}
        <div className="relative overflow-hidden rounded-2xl p-px">
          <span
            className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite]"
            style={{
              background:
                "conic-gradient(from 0deg, var(--color-accent), transparent 50%, var(--color-success))",
            }}
          />
          <div className="relative rounded-[15px] bg-surface p-6 backdrop-blur-md h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <CreditCardIcon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">اقساطی رایان تک</h3>
            </div>
            <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                <span>بدون نیاز به ثبت‌نام در پلتفرم خارجی</span>
              </li>
              <li className="flex items-start gap-2">
                <ClockIcon className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                <span>تقویم اختصاصی: تاریخ شروع بازپرداخت را خودتان انتخاب کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                <span>اقساط ۳ تا ۱۲ ماهه با نرخ شفاف</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                <span>سقف‌گذاری هوشمند و اعلام فوری نیاز به ضامن</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Digipay Card */}
        <div className="rounded-2xl border border-[--glass-border] bg-surface p-6 h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary">
              <ZapIcon className="h-5 w-5 text-text-muted" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">اعتبار دیجی‌پی</h3>
          </div>
          <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-text-muted mt-0.5" />
              <span>خرید اعتباری از طریق کیف پول دیجی‌پی</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-text-muted mt-0.5" />
              <span>احراز هویت بانکی و امضای دیجیتال</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-text-muted mt-0.5" />
              <span>سقف اعتباری بر اساس اعتبارسنجی دیجی‌پی</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-text-muted mt-0.5" />
              <span>بازپرداخت از طریق اپلیکیشن دیجی‌پی</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   RAYAN TECH CALCULATOR
   ═══════════════════════════════════════════════════════════════════════════════ */

function RayantechCalculator() {
  const configQuery = trpc.installments.getConfig.useQuery();
  const config = configQuery.data;

  const [amount, setAmount] = useState(50_000_000);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [durationDays, setDurationDays] = useState(30);
  const [rawDownPayment, setRawDownPayment] = useState(0);

  // Auto-select first rule
  const activeRule = useMemo(() => {
    if (!config?.rules?.length) return null;
    return config.rules.find((r) => r.id === selectedRuleId) ?? config.rules[0];
  }, [config, selectedRuleId]);

  // Min downpayment (default % applied to entered amount)
  const minDownPayment = useMemo(() => {
    if (!activeRule) return 0;
    const raw = Math.ceil(amount * (activeRule.defaultDownPaymentPercent / 100));
    return Math.ceil(raw / STEP) * STEP;
  }, [activeRule, amount]);

  const downPayment = useMemo(() => {
    return Math.max(rawDownPayment, minDownPayment);
  }, [rawDownPayment, minDownPayment]);

  const financedAmount = useMemo(() => {
    return Math.max(amount - downPayment, 0);
  }, [amount, downPayment]);

  // Monthly payment: grossMonthly = financed × (1 + rate × D/30) / months
  const monthlyPayment = useMemo(() => {
    if (!activeRule || financedAmount <= 0) return 0;
    const rate = activeRule.feePercentage / 100;
    const dayRatio = durationDays / 30;
    const gross = (financedAmount * (1 + rate * dayRatio)) / activeRule.termMonths;
    return Math.ceil(gross / ROUND_UNIT) * ROUND_UNIT;
  }, [activeRule, financedAmount, durationDays]);

  // Guarantor check
  const requiresGuarantor = useMemo(() => {
    if (!activeRule) return false;
    return financedAmount > activeRule.guarantorThreshold;
  }, [activeRule, financedAmount]);

  // Sync slider min
  useMemo(() => {
    if (minDownPayment > rawDownPayment) setRawDownPayment(minDownPayment);
  }, [minDownPayment]);

  if (configQuery.isLoading || !config || !activeRule) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[--glass-border] bg-surface-glass p-6 backdrop-blur-md shadow-glass space-y-6">
      {/* Amount Input */}
      <PriceInput
        value={amount}
        onChange={setAmount}
        label="مبلغ خرید"
        suffix="تومان"
        placeholder="۵۰,۰۰۰,۰۰۰"
        className="max-w-full"
      />

      {/* Tenure Tabs */}
      <div>
        <label className="mb-2 block text-xs font-medium text-text-secondary">مدت اقساط</label>
        <Tabs value={selectedRuleId ?? config.rules[0].id} onValueChange={setSelectedRuleId}>
          <TabsList
            className="grid w-full rounded-xl bg-surface-secondary p-1"
            style={{ gridTemplateColumns: `repeat(${config.rules.length}, 1fr)` }}
          >
            {config.rules.map((rule) => (
              <TabsTrigger
                key={rule.id}
                value={rule.id}
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-surface data-[state=active]:shadow-sm"
              >
                {toPersianDigits(String(rule.termMonths))} ماهه
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-text-muted">
          <span>•</span>
          <span>سقف بدون ضامن: {formatTomansPersian(activeRule.guarantorThreshold)} ت</span>
        </div>
      </div>

      {/* Down-Payment Slider */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">پیش‌پرداخت</span>
          <span className="text-sm font-bold text-text-primary tabular-nums">
            {formatTomansPersian(downPayment)} تومان
          </span>
        </div>
        <Slider
          value={[downPayment]}
          onValueChange={(val) => setRawDownPayment(Array.isArray(val) ? val[0] : val)}
          min={minDownPayment}
          max={amount}
          step={STEP}
          className="w-full"
        />
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-text-muted">
          <span>{formatTomansPersian(minDownPayment)}</span>
          <span>{formatTomansPersian(amount)}</span>
        </div>
      </div>

      {/* Day-Rate Selector */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">فاصله تا اولین قسط</span>
        <div className="flex items-center gap-2">
          {[25, 30, 35, 40, 45].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDurationDays(d)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                durationDays === d
                  ? "bg-accent/15 text-accent"
                  : "bg-surface-secondary text-text-muted hover:text-text-secondary"
              }`}
            >
              {toPersianDigits(String(d))} روز
            </button>
          ))}
        </div>
      </div>

      {/* Guarantor Warning */}
      {requiresGuarantor && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
          <AlertTriangleIcon className="h-5 w-5 shrink-0 text-warning mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-warning">
              توجه: نیاز به چک ضمانت شخص ثالث است
            </span>
            <span className="text-[11px] text-text-muted">
              مبلغ تسهیلات ({formatTomansPersian(financedAmount)} ت) از سقف{" "}
              {formatTomansPersian(activeRule.guarantorThreshold)} ت بیشتر است.
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="rounded-xl border border-[--glass-border] bg-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">پیش‌پرداخت</span>
          <span className="text-sm font-bold text-text-primary tabular-nums">
            {formatTomansPersian(downPayment)} تومان
          </span>
        </div>
        <div className="h-px bg-[--glass-border]" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">
            مبلغ هر قسط ({toPersianDigits(String(activeRule.termMonths))} ماهه)
          </span>
          <span className="text-sm font-bold text-accent tabular-nums">
            {formatTomansPersian(monthlyPayment)} تومان
          </span>
        </div>
        <div className="h-px bg-[--glass-border]" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">کل بازپرداخت</span>
          <span className="text-xs font-semibold text-text-secondary tabular-nums">
            {formatTomansPersian(downPayment + monthlyPayment * activeRule.termMonths)} تومان
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIGIPAY INFO SECTION
   ═══════════════════════════════════════════════════════════════════════════════ */

function DigipayInfo() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[--glass-border] bg-surface-glass p-6 backdrop-blur-md shadow-glass space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary">
          <ZapIcon className="h-5 w-5 text-text-muted" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">اعتبار خرید دیجی‌پی</h3>
          <p className="text-[11px] text-text-muted">خرید اعتباری بدون نیاز به پیش‌پرداخت</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoBlock label="سقف اعتبار" value="تا ۲۰۰ میلیون تومان" />
        <InfoBlock label="بازپرداخت" value="۲ تا ۱۲ ماهه" />
        <InfoBlock label="نرخ سود" value="بر اساس اعتبارسنجی بانکی" />
        <InfoBlock label="احراز هویت" value="امضای دیجیتال + تأیید بانک" />
      </div>

      <div className="rounded-xl border border-border bg-surface-secondary/30 p-4">
        <h4 className="text-xs font-semibold text-text-primary mb-2">مراحل استفاده</h4>
        <ol className="space-y-2 text-[11px] text-text-secondary list-decimal list-inside">
          <li>ثبت‌نام و احراز هویت در اپلیکیشن دیجی‌پی</li>
          <li>تأیید اعتبار و دریافت سقف خرید اعتباری</li>
          <li>انتخاب "اعتبار دیجی‌پی" در صفحه پرداخت رایان تک</li>
          <li>تأیید خرید با امضای دیجیتال</li>
          <li>بازپرداخت اقساط از طریق اپلیکیشن دیجی‌پی</li>
        </ol>
      </div>

      <p className="text-[10px] text-text-muted text-center">
        شرایط و سقف اعتباری بر اساس اعتبارسنجی دیجی‌پی تعیین می‌شود و ممکن است برای هر کاربر متفاوت
        باشد.
      </p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <span className="text-[10px] text-text-muted">{label}</span>
      <p className="text-xs font-medium text-text-primary mt-0.5">{value}</p>
    </div>
  );
}
