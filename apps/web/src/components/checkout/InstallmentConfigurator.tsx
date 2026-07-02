import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatTomansPersian } from "../../lib/persian-numerals";
import { useCartStore } from "../../lib/store";
import { trpc } from "../../lib/trpc";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { InstallmentCalendar } from "./InstallmentCalendar";
import { INSTALLMENT_STEP, InstallmentSlider } from "./InstallmentSlider";
import { InstallmentSummary } from "./InstallmentSummary";
import { InstallmentTabs } from "./InstallmentTabs";

/** Ceiling rounding unit: 100,000 Toman */
const ROUND_UNIT = 100_000;

interface Props {
  onRedirect?: (url: string) => void;
  shippingAddress?: string;
  mobile?: string;
  notes?: string;
  hasAddress?: boolean;
  hasShipping?: boolean;
}

/**
 * InstallmentConfigurator — شرایط اقساطی رایان تک
 *
 * Orchestrator composing: Tabs + Slider + Calendar + Summary.
 * ALL config from trpc.installments.getConfig (DB-bound).
 * Pure Toman calculus. 100K Toman ceiling rounding on monthly payment.
 */
export function InstallmentConfigurator({
  onRedirect,
  shippingAddress,
  mobile,
  notes,
  hasAddress,
  hasShipping,
}: Props) {
  const items = useCartStore((s) => s.items);
  const getInstallmentTotal = useCartStore((s) => s.getInstallmentTotal);
  const cartTotal = getInstallmentTotal();

  // ─── Live Config from DB ───
  const configQuery = trpc.installments.getConfig.useQuery();
  const config = configQuery.data;

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [durationDays, setDurationDays] = useState(30);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rawDownPayment, setRawDownPayment] = useState(0);

  // Auto-select first rule
  useEffect(() => {
    if (config?.rules?.length && !selectedRuleId) {
      setSelectedRuleId(config.rules[0].id);
    }
  }, [config, selectedRuleId]);

  // Active rule
  const activeRule = useMemo(() => {
    if (!config?.rules) return null;
    return config.rules.find((r) => r.id === selectedRuleId) ?? config.rules[0] ?? null;
  }, [config, selectedRuleId]);

  // ─── Dynamic Min Down-Payment (per-item, then sum) ───
  // Each item's min downpay = itemPrice × its own downpay% (exception or default)
  // Total min = sum of all items' individual min downpayments
  const minDownPayment = useMemo(() => {
    if (!(config && activeRule)) return 0;
    const defaultPercent = activeRule.defaultDownPaymentPercent;

    let totalMinDown = 0;

    for (const item of items) {
      const itemPrice = item.installmentBasePrice * item.quantity;

      // Resolve this item's downpayment percent (exception or default)
      const ex = config.exceptions.find(
        (e) => e.categoryId === item.categoryId && (e.ruleId === activeRule.id || !e.ruleId),
      );

      const itemDownPercent =
        ex?.downPaymentPercent != null ? ex.downPaymentPercent : defaultPercent;

      const itemMinDown = Math.ceil(itemPrice * (itemDownPercent / 100));

      // Also check absolute floor for this item's category
      const itemFloor = ex?.minDownPaymentAmount != null ? ex.minDownPaymentAmount : 0;

      totalMinDown += Math.max(itemMinDown, itemFloor);
    }

    // Snap UP to step increment
    return Math.ceil(totalMinDown / INSTALLMENT_STEP) * INSTALLMENT_STEP;
  }, [config, activeRule, items]);

  // Sync slider to min
  useEffect(() => {
    if (minDownPayment > 0 && rawDownPayment < minDownPayment) {
      setRawDownPayment(minDownPayment);
    }
  }, [minDownPayment, rawDownPayment]);

  // Enforce loan ceiling
  const downPayment = useMemo(() => {
    if (!activeRule) return rawDownPayment;
    const financed = cartTotal - rawDownPayment;
    if (financed > activeRule.hardCeiling) {
      const forced = cartTotal - activeRule.hardCeiling;
      return Math.max(Math.ceil(forced / INSTALLMENT_STEP) * INSTALLMENT_STEP, minDownPayment);
    }
    return Math.max(rawDownPayment, minDownPayment);
  }, [cartTotal, rawDownPayment, minDownPayment, activeRule]);

  useEffect(() => {
    if (activeRule && downPayment > rawDownPayment && rawDownPayment >= minDownPayment) {
      setRawDownPayment(downPayment);
      toast.info("تنظیم خودکار پیش‌پرداخت", {
        description: `سقف تسهیلات ${formatTomansPersian(activeRule.hardCeiling)} تومان`,
      });
    }
  }, [downPayment, rawDownPayment, minDownPayment, activeRule]);

  // ─── TOMAN CALCULUS: Per-item rate resolution with 100K ceiling ───
  // When cart has mixed items (some with exception fee, some normal),
  // calculate each item's financed portion separately with its own rate,
  // then sum all monthly contributions.
  const financedAmount = useMemo(() => {
    return cartTotal - downPayment;
  }, [cartTotal, downPayment]);

  const monthlyPayment = useMemo(() => {
    if (!(activeRule && config) || financedAmount <= 0) return 0;
    const termMonths = activeRule.termMonths;
    const dayRatio = durationDays / 30;
    const defaultRate = activeRule.feePercentage / 100;

    // Calculate each item's share of financed amount and apply its own rate
    let totalGrossMonthly = 0;

    for (const item of items) {
      const itemTotal = item.installmentBasePrice * item.quantity;
      // Item's proportion of the total cart
      const itemShare = cartTotal > 0 ? itemTotal / cartTotal : 0;
      // Item's share of the financed amount
      const itemFinanced = financedAmount * itemShare;

      // Resolve this item's fee rate (exception or default)
      const ex = config.exceptions.find(
        (e) => e.categoryId === item.categoryId && (e.ruleId === activeRule.id || !e.ruleId),
      );
      const itemRate =
        ex?.feePercentageOverride != null ? ex.feePercentageOverride / 100 : defaultRate;

      // This item's monthly contribution: itemFinanced × (1 + rate × D/30) / months
      const itemGrossMonthly = (itemFinanced * (1 + itemRate * dayRatio)) / termMonths;
      totalGrossMonthly += itemGrossMonthly;
    }

    // FORCED ceiling to nearest 100,000 Toman
    return Math.ceil(totalGrossMonthly / ROUND_UNIT) * ROUND_UNIT;
  }, [financedAmount, activeRule, config, items, cartTotal, durationDays]);

  // ─── Guarantor Threshold Guard ───
  const requiresGuarantor = useMemo(() => {
    if (!activeRule) return false;
    return financedAmount > activeRule.guarantorThreshold;
  }, [financedAmount, activeRule]);

  // ─── Submit ───
  const initiateAdvance = trpc.order.initiateInstallmentAdvance.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!activeRule) return;

    if (!hasAddress) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    if (!hasShipping) {
      toast.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await initiateAdvance.mutateAsync({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        downPayment,
        monthlyPayment: monthlyPayment,
        tenureMonths: String(activeRule.termMonths),
        durationDays,
        shippingAddress,
        mobile,
        notes,
      });
      // Don't clear cart — only clear after payment verification on callback page
      if (onRedirect) onRedirect(result.redirectUrl);
      else window.location.href = result.redirectUrl;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ثبت سفارش اقساطی");
      setIsSubmitting(false);
    }
  };

  // Loading
  if (configQuery.isLoading || !config || !activeRule) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstallmentTabs
        rules={config.rules}
        selectedRuleId={selectedRuleId ?? config.rules[0].id}
        onSelect={setSelectedRuleId}
      />

      <InstallmentSlider
        value={downPayment}
        onChange={setRawDownPayment}
        min={minDownPayment}
        max={cartTotal}
      />

      <InstallmentCalendar
        durationDays={durationDays}
        onDurationChange={setDurationDays}
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
      />

      <InstallmentSummary
        downPayment={downPayment}
        monthlyPayment={monthlyPayment}
        termMonths={activeRule.termMonths}
      />

      {/* Guarantor Threshold Warning */}
      {requiresGuarantor && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 backdrop-blur-sm">
          <AlertTriangleIcon className="h-5 w-5 shrink-0 text-warning mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-warning">
              توجه: نیاز به چک ضمانت شخص ثالث است
            </span>
            <span className="text-[11px] text-text-muted">
              مبلغ تسهیلات ({formatTomansPersian(financedAmount)} تومان) از سقف بدون ضمانت (
              {formatTomansPersian(activeRule.guarantorThreshold)} تومان) بیشتر است. پیش‌پرداخت را
              افزایش دهید یا چک ضامن را آماده کنید.
            </span>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || monthlyPayment <= 0}
        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          "تایید و پرداخت پیش‌پرداخت"
        )}
      </Button>
    </div>
  );
}
