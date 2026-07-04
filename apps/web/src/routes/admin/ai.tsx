import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AiConfig,
  AVALAI_CHAT_MODELS,
  AVALAI_EMBEDDING_MODELS,
  aiConfigSchema,
} from "@rayan-tech/types";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ActivityIcon,
  BrainCircuitIcon,
  ClockIcon,
  DollarSignIcon,
  GaugeIcon,
  MessageSquareIcon,
  MicIcon,
  PowerIcon,
  RotateCcwIcon,
  SaveIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  WifiIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/ai")({
  component: AiControlCenter,
});

/**
 * /admin/ai — Unified AI Control Center.
 *
 * Merges the former ai-config and ai-diagnostics screens into a single,
 * tabbed workspace:
 * - تنظیمات: persistent AvalAI assistant configuration (models, sampling,
 *   quotas, persona overrides) via trpc.admin.getAiConfig / updateAiConfig
 * - پایش زنده: live voice session diagnostics
 * - هزینه و مصرف: AvalAI credit + cost tracking
 */

function AiControlCenter() {
  const utils = trpc.useUtils();
  const configQuery = trpc.admin.getAiConfig.useQuery();
  const updateMutation = trpc.admin.updateAiConfig.useMutation({
    onSuccess: () => {
      utils.admin.getAiConfig.invalidate();
      toast.success("تنظیمات هوش مصنوعی با موفقیت ذخیره شد");
    },
    onError: (err) => {
      toast.error("خطا در ذخیره تنظیمات", { description: err.message });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold leading-8 text-text-primary sm:text-[30px] sm:leading-9">
          دستیار هوش مصنوعی
        </h1>
        <p className="text-sm text-text-muted">
          پیکربندی، پایش زنده و ردیابی هزینه مشاور هوشمند رایان‌تک (AvalAI)
        </p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="flex w-full max-w-md flex-wrap">
          <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm">
            <SlidersHorizontalIcon className="h-3.5 w-3.5" />
            تنظیمات
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-1.5 text-xs sm:text-sm">
            <ActivityIcon className="h-3.5 w-3.5" />
            پایش زنده
          </TabsTrigger>
          <TabsTrigger value="cost" className="gap-1.5 text-xs sm:text-sm">
            <DollarSignIcon className="h-3.5 w-3.5" />
            هزینه و مصرف
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-5">
          {configQuery.isLoading || !configQuery.data ? (
            <SettingsSkeleton />
          ) : (
            <SettingsForm
              initial={configQuery.data}
              saving={updateMutation.isPending}
              onSave={(data) => updateMutation.mutate(data)}
            />
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="mt-5">
          <MonitoringPanel />
        </TabsContent>

        <TabsContent value="cost" className="mt-5">
          <CostPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─────────────────────────────── Settings ─────────────────────────────── */

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof BrainCircuitIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <Icon className="h-4.5 w-4.5 text-accent" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          {description && <p className="text-[11px] text-text-muted">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-text-secondary">{children}</label>;
}

function SettingsForm({
  initial,
  saving,
  onSave,
}: {
  initial: AiConfig;
  saving: boolean;
  onSave: (data: AiConfig) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AiConfig>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: initial,
  });

  // Re-sync when server data changes (e.g. after invalidate)
  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const enabled = watch("enabled");
  const overrideDailyLimit = watch("overrideDailyLimit");
  const temperature = watch("temperature");
  const liteModel = watch("liteModel");
  const proModel = watch("proModel");
  const embeddingModel = watch("embeddingModel");

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">
      {/* Status */}
      <SectionCard
        icon={PowerIcon}
        title="وضعیت سرویس"
        description="فعال یا غیرفعال‌سازی کامل مشاور هوش مصنوعی در فروشگاه"
      >
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-text-primary">
              مشاور هوش مصنوعی {enabled ? "فعال" : "غیرفعال"} است
            </span>
            <span className="text-[11px] text-text-muted">
              در صورت غیرفعال بودن، ویجت مشاوره برای کاربران نمایش داده نمی‌شود
            </span>
          </div>
          <Switch
          dir="rtl"
            checked={enabled}
            onCheckedChange={(v) => setValue("enabled", v, { shouldDirty: true })}
          />
        </div>
        <p className="mt-3 text-[11px] text-text-muted">
          Base URL:{" "}
          <code dir="ltr" className="text-text-secondary">
            https://api.avalai.ir/v1
          </code>
        </p>
      </SectionCard>

      {/* Models */}
      <SectionCard
        icon={BrainCircuitIcon}
        title="انتخاب مدل‌ها"
        description="مدل سبک برای گفتگوی ساده و مدل پیشرفته برای مشاوره تخصصی محصولات"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>مدل سبک (گفتگوی سریع)</FieldLabel>
            <Select
              value={liteModel}
              onValueChange={(v) => v && setValue("liteModel", v, { shouldDirty: true })}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVALAI_CHAT_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.liteModel && (
              <span className="text-[11px] text-danger">{errors.liteModel.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>مدل پیشرفته (مشاوره عمیق)</FieldLabel>
            <Select
              value={proModel}
              onValueChange={(v) => v && setValue("proModel", v, { shouldDirty: true })}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVALAI_CHAT_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.proModel && (
              <span className="text-[11px] text-danger">{errors.proModel.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <FieldLabel>مدل امبدینگ (جستجوی معنایی — خروجی ۱۵۳۶ بعدی)</FieldLabel>
            <Select
              value={embeddingModel}
              onValueChange={(v) => v && setValue("embeddingModel", v, { shouldDirty: true })}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVALAI_EMBEDDING_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Generation params */}
      <SectionCard
        icon={GaugeIcon}
        title="پارامترهای تولید پاسخ"
        description="کنترل خلاقیت و طول پاسخ‌های مدل"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel>دما (Temperature)</FieldLabel>
              <span
                className="rounded-md bg-surface-secondary px-2 py-0.5 font-mono text-xs text-text-primary"
                dir="ltr"
              >
                {Number(temperature ?? 0).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature ?? 0}
              onChange={(e) =>
                setValue("temperature", Number(e.target.value), { shouldDirty: true })
              }
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-secondary accent-accent"
              dir="ltr"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>دقیق (۰)</span>
              <span>خلاق (۲)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>حداکثر توکن خروجی</FieldLabel>
            <input
              type="number"
              {...register("maxTokens", { valueAsNumber: true })}
              className="form-input w-full"
              dir="ltr"
            />
            {errors.maxTokens && (
              <span className="text-[11px] text-danger">{errors.maxTokens.message}</span>
            )}
            <span className="text-[11px] text-text-muted">بین ۱۲۸ تا ۱۶۰۰۰ توکن</span>
          </div>
        </div>
      </SectionCard>

      {/* Quota */}
      <SectionCard
        icon={ShieldCheckIcon}
        title="محدودیت مصرف"
        description="کنترل تعداد پرسش‌های مجاز هر بازدیدکننده در روز"
      >
        <div className="flex flex-col gap-4" dir="rtl">
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-text-primary">حذف محدودیت روزانه</span>
              <span className="text-[11px] text-text-muted">
                با فعال بودن، هیچ سقف مصرفی برای کاربران اعمال نمی‌شود
              </span>
            </div>
            <Switch
            dir="rtl"
              checked={overrideDailyLimit}
              onCheckedChange={(v) => setValue("overrideDailyLimit", v, { shouldDirty: true })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>حداکثر پرسش روزانه هر کاربر</FieldLabel>
            <input
              type="number"
              {...register("dailyQuestionLimit", { valueAsNumber: true })}
              disabled={overrideDailyLimit}
              className="form-input w-40 disabled:opacity-50"
              dir="ltr"
            />
            {errors.dailyQuestionLimit && (
              <span className="text-[11px] text-danger">{errors.dailyQuestionLimit.message}</span>
            )}
          </div>

          {overrideDailyLimit && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs text-warning"
            >
              هشدار: با حذف محدودیت، مصرف اعتبار AvalAI ممکن است به‌سرعت افزایش یابد.
            </motion.div>
          )}
        </div>
      </SectionCard>

      {/* Persona / policy */}
      <SectionCard
        icon={MessageSquareIcon}
        title="دستورالعمل‌های اختصاصی (پرسونا)"
        description="این متن به انتهای پرامپت سیستم افزوده می‌شود و رفتار مشاور را کنترل می‌کند"
      >
        <div className="flex flex-col gap-1.5">
          <Textarea
            {...register("extraInstructions")}
            dir="rtl"
            rows={7}
            placeholder="مثال: همیشه پیشنهاد خرید اقساطی را در پاسخ‌ها یادآوری کن و لحن رسمی‌تری داشته باش."
            className="min-h-44 resize-y font-mono text-xs leading-relaxed"
          />
          {errors.extraInstructions && (
            <span className="text-[11px] text-danger">{errors.extraInstructions.message}</span>
          )}
          <p className="text-[11px] text-text-muted">
            تغییرات پس از ذخیره روی جلسات جدید اعمال می‌شوند (حداکثر ۳۰ ثانیه تأخیر کش).
          </p>
        </div>
      </SectionCard>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-surface-glass/95 px-4 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => reset(initial)}
          disabled={!isDirty || saving}
        >
          <RotateCcwIcon className="h-3.5 w-3.5" />
          بازنشانی
        </Button>
        <Button type="submit" size="sm" className="gap-1.5" disabled={saving}>
          <SaveIcon className="h-4 w-4" />
          {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
        </Button>
      </div>
    </form>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

/* ────────────────────────────── Monitoring ────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof MicIcon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          highlight ? "bg-accent/15" : "bg-surface-secondary"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${highlight ? "text-accent" : "text-text-muted"}`}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-text-primary">{value}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    </div>
  );
}

function MonitoringPanel() {
  const voiceStats = trpc.admin.getVoiceAiStats.useQuery();
  const sessions = voiceStats.data?.sessions ?? [];
  const stats = {
    activeSessions: voiceStats.data?.activeSessions ?? 0,
    totalToday: voiceStats.data?.totalToday ?? 0,
    avgDuration: voiceStats.data?.avgDurationMinutes
      ? `${voiceStats.data.avgDurationMinutes} دقیقه`
      : "—",
    peakConcurrent: voiceStats.data?.peakConcurrent ?? 0,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={WifiIcon}
          label="جلسات فعال"
          value={String(stats.activeSessions)}
          highlight
        />
        <StatCard icon={UsersIcon} label="مجموع امروز" value={String(stats.totalToday)} />
        <StatCard icon={ClockIcon} label="میانگین مدت" value={stats.avgDuration} />
        <StatCard icon={ActivityIcon} label="اوج همزمانی" value={String(stats.peakConcurrent)} />
      </div>

      {/* Live pulse */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-8">
        <span className="text-xs font-medium text-text-muted">وضعیت استریم صوتی</span>
        <div className="relative flex h-28 w-28 items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/20"
          >
            <MicIcon className="h-7 w-7 text-accent" />
          </motion.div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base font-semibold text-text-primary">
            {stats.activeSessions} جلسه فعال
          </span>
          <span className="text-[11px] text-text-muted">مانیتورینگ لحظه‌ای وب‌سوکت</span>
        </div>
      </div>

      {/* Sessions table (horizontal scroll on mobile) */}
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-text-primary">جلسات فعال مصرف منابع</h2>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-[11px] text-text-muted">Real-time</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-6 gap-2 border-b border-border px-5 py-2.5">
              {["شناسه", "IP", "شروع", "پرسش‌ها", "سهمیه", "وضعیت"].map((h) => (
                <span key={h} className="text-[11px] font-medium uppercase text-text-secondary">
                  {h}
                </span>
              ))}
            </div>
            {sessions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-text-muted">
                هیچ جلسه فعالی وجود ندارد
              </div>
            ) : (
              <div className="divide-y divide-border">
                {sessions.map((session) => {
                  const quotaPercent = (session.dailyUsed / session.dailyQuota) * 100;
                  return (
                    <div
                      key={session.id}
                      className="grid grid-cols-6 items-center gap-2 px-5 py-3 transition-colors hover:bg-surface-secondary/40"
                    >
                      <code className="truncate text-xs text-text-primary" dir="ltr">
                        {session.id}
                      </code>
                      <span className="text-xs text-text-secondary" dir="ltr">
                        {session.ip}
                      </span>
                      <span className="text-xs text-text-muted">{session.startedAt}</span>
                      <span className="text-xs font-medium text-text-primary">
                        {session.questionsAsked.toLocaleString("fa-IR")}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary">
                          <div
                            className={`h-full rounded-full ${
                              quotaPercent >= 100
                                ? "bg-danger"
                                : quotaPercent >= 70
                                  ? "bg-warning"
                                  : "bg-success"
                            }`}
                            style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-text-muted">
                          {session.dailyUsed}/{session.dailyQuota}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            session.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        />
                        <span className="text-[11px] text-text-muted">
                          {session.status === "active" ? "فعال" : "بیکار"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Cost ─────────────────────────────────── */

function CostPanel() {
  const costMetrics = trpc.admin.getAiCostMetrics.useQuery();
  const cost = {
    creditRemainingIrt: costMetrics.data?.creditRemainingIrt ?? 0,
    totalCostToday: costMetrics.data?.totalCostToday ?? 0,
    totalTranscriptionMinutes: costMetrics.data?.totalTranscriptionMinutes ?? 0,
    modelsUsed: costMetrics.data?.modelsUsed ?? 0,
    recentTransactions: costMetrics.data?.recentTransactions ?? [],
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={DollarSignIcon}
          label="اعتبار باقیمانده (﷼)"
          value={cost.creditRemainingIrt.toLocaleString("fa-IR")}
          highlight
        />
        <StatCard
          icon={GaugeIcon}
          label="هزینه امروز (﷼)"
          value={cost.totalCostToday.toLocaleString("fa-IR")}
        />
        <StatCard
          icon={ClockIcon}
          label="دقیقه رونوشت"
          value={cost.totalTranscriptionMinutes.toLocaleString("fa-IR")}
        />
        <StatCard icon={BrainCircuitIcon} label="مدل‌های مصرفی" value={String(cost.modelsUsed)} />
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-text-primary">تراکنش‌های اخیر AvalAI</h2>
          <code dir="ltr" className="text-[11px] text-text-muted">
            api.avalai.ir/user/v1
          </code>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-6 gap-2 border-b border-border bg-surface-secondary/30 px-5 py-2.5">
              {["مدل", "Provider", "Input", "Output", "هزینه (﷼)", "زمان"].map((h) => (
                <span key={h} className="text-[11px] font-medium uppercase text-text-secondary">
                  {h}
                </span>
              ))}
            </div>
            {cost.recentTransactions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-text-muted">
                تراکنشی برای نمایش وجود ندارد
              </div>
            ) : (
              <div className="divide-y divide-border">
                {cost.recentTransactions.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-6 items-center gap-2 px-5 py-2.5">
                    <code className="truncate text-xs text-text-primary" dir="ltr">
                      {entry.model}
                    </code>
                    <span className="text-xs text-text-muted">{entry.provider}</span>
                    <span className="text-xs text-text-muted" dir="ltr">
                      {entry.inputTokens.toLocaleString()}
                    </span>
                    <span className="text-xs text-text-muted" dir="ltr">
                      {entry.outputTokens.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-text-primary">
                      {entry.costIrt.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-xs text-text-muted">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
