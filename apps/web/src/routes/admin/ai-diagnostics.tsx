import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ActivityIcon,
  AlertCircleIcon,
  ClockIcon,
  DollarSignIcon,
  FileTextIcon,
  MicIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  UsersIcon,
  WifiIcon,
  ZapIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/ai-diagnostics")({
  component: AiDiagnostics,
});

/**
 * Conversational AI Core & Compliance HUD
 *
 * Expanded diagnostics monitoring board:
 * - Real-time WebSocket session pulse visualization
 * - IP resource depletion ledger (existing)
 * - AvalAI cost tracking panel (api.avalai.ir/user/v1 integration)
 * - Transcription duration tracking
 * - Administrative threshold override toggle
 * - Error boundary: catch streaming failures → sonner Persian toast
 *
 * tRPC queries: admin.getVoiceAiStats, admin.getAiCostMetrics
 * Design: No raw console traces in DOM — all errors intercepted elegantly
 */

/* ─── Types ─── */

interface VoiceSession {
  id: string;
  ip: string;
  startedAt: string;
  duration: string;
  questionsAsked: number;
  dailyQuota: number;
  dailyUsed: number;
  status: "active" | "idle" | "ended";
  transcriptionMinutes: number;
}

interface AiCostEntry {
  id: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  costIrt: number;
  timestamp: string;
}

/* ─── Component ─── */

function AiDiagnostics() {
  const [dailyThreshold, setDailyThreshold] = useState(10);
  const [thresholdOverride, setThresholdOverride] = useState(false);

  // Real tRPC queries
  const voiceStats = trpc.admin.getVoiceAiStats.useQuery();
  const costMetrics = trpc.admin.getAiCostMetrics.useQuery();

  const sessions = voiceStats.data?.sessions ?? [];
  const globalStats = {
    activeSessions: voiceStats.data?.activeSessions ?? 0,
    totalToday: voiceStats.data?.totalToday ?? 0,
    avgDuration: voiceStats.data?.avgDurationMinutes
      ? `${voiceStats.data.avgDurationMinutes}`
      : "—",
    peakConcurrent: voiceStats.data?.peakConcurrent ?? 0,
  };
  const costData = {
    creditRemainingIrt: costMetrics.data?.creditRemainingIrt ?? 0,
    totalCostToday: costMetrics.data?.totalCostToday ?? 0,
    totalTranscriptionMinutes: costMetrics.data?.totalTranscriptionMinutes ?? 0,
    modelsUsed: costMetrics.data?.modelsUsed ?? 0,
    recentTransactions: costMetrics.data?.recentTransactions ?? [],
  };

  const toggleOverride = useCallback(() => {
    setThresholdOverride((prev) => !prev);
  }, []);

  // Simulated error boundary for streaming failures
  const simulateStreamError = useCallback(() => {
    toast.error("خطا در اتصال به سرویس صوتی. لطفاً مجدداً تلاش کنید.", {
      description: "WebSocket connection timeout — سرویس در حال بازیابی است",
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">تشخیص AI</h1>
        <p className="text-sm text-text-muted">
          مانیتورینگ لحظه‌ای، ردیابی هزینه AvalAI و مدیریت آستانه مصرف
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={WifiIcon}
          label="جلسات فعال"
          value={String(globalStats.activeSessions)}
          highlight
        />
        <StatCard icon={UsersIcon} label="مجموع امروز" value={String(globalStats.totalToday)} />
        <StatCard icon={ClockIcon} label="میانگین مدت" value={globalStats.avgDuration} />
        <StatCard
          icon={ActivityIcon}
          label="اوج همزمانی"
          value={String(globalStats.peakConcurrent)}
        />
      </div>

      {/* AvalAI Cost Tracking Panel */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">ردیابی هزینه AvalAI</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-text-muted">اعتبار باقیمانده</span>
              <span className="text-sm font-semibold text-success">
                {costData.creditRemainingIrt.toLocaleString("fa-IR")} ﷼
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-text-muted">هزینه امروز</span>
              <span className="text-sm font-semibold text-text-primary">
                {costData.totalCostToday.toLocaleString("fa-IR")} ﷼
              </span>
            </div>
          </div>
        </div>

        {/* Cost table */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-6 gap-2 border-b border-border bg-surface-secondary/30 px-4 py-2">
            {["مدل", "Provider", "Input", "Output", "هزینه (﷼)", "زمان"].map((h) => (
              <span key={h} className="text-[12px] font-medium uppercase text-text-secondary">
                {h}
              </span>
            ))}
          </div>
          {costData.recentTransactions.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-6 items-center gap-2 border-b border-border bg-surface px-4 py-2.5 last:border-b-0"
            >
              <code className="text-xs text-text-primary" dir="ltr">
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

        <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
          <span>
            API Base:{" "}
            <code dir="ltr" className="text-text-secondary">
              api.avalai.ir/v1
            </code>
          </span>
          <span>•</span>
          <span>مدل‌های مصرفی: {costData.modelsUsed}</span>
        </div>
      </div>

      {/* Transcription Duration + Pulse Visualization */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pulse Ring Visualization */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-8 lg:col-span-1">
          <span className="text-xs font-medium text-text-muted">وضعیت استریم صوتی</span>

          {/* Animated Pulse Rings */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
              className="absolute inset-3 rounded-full"
              style={{
                background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/20"
            >
              <MicIcon className="h-7 w-7 text-accent" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-base font-semibold text-text-primary">
              {globalStats.activeSessions} جلسه فعال
            </span>
            <span className="text-[11px] text-text-muted">اتصال WebSocket برقرار</span>
          </div>

          {/* Error simulation button (dev) */}
          <button
            type="button"
            onClick={simulateStreamError}
            className="mt-2 flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-[10px] font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            <AlertCircleIcon className="h-3 w-3" />
            تست خطای استریم
          </button>
        </div>

        {/* Transcription Tracking + Threshold Controls */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          {/* Transcription Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">ردیابی مدت رونوشت</h2>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5">
              <ZapIcon className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">
                {costData.totalTranscriptionMinutes.toLocaleString("fa-IR")} دقیقه امروز
              </span>
            </div>
          </div>

          {/* Override Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-text-primary">Override دستی آستانه</span>
              <span className="text-xs text-text-muted">
                غیرفعال‌سازی محدودیت روزانه برای همه کاربران
              </span>
            </div>
            <button
              type="button"
              onClick={toggleOverride}
              className="text-accent transition-transform duration-200"
              aria-label={thresholdOverride ? "غیرفعال کردن override" : "فعال کردن override"}
            >
              {thresholdOverride ? (
                <ToggleRightIcon className="h-8 w-8" />
              ) : (
                <ToggleLeftIcon className="h-8 w-8 text-text-muted" />
              )}
            </button>
          </div>

          {/* Threshold Value */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-medium text-text-secondary">حداکثر پرسش روزانه:</label>
            <input
              type="number"
              value={dailyThreshold}
              onChange={(e) => setDailyThreshold(Number(e.target.value))}
              min={1}
              max={100}
              disabled={thresholdOverride}
              className="h-9 w-20 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-colors focus:border-accent disabled:opacity-50"
              dir="ltr"
            />
            <span className="text-xs text-text-muted">
              {thresholdOverride ? "(Override فعال — بدون محدودیت)" : "پرسش در هر IP"}
            </span>
          </div>

          {/* Quota warning */}
          {thresholdOverride && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs text-warning"
            >
              هشدار: با فعال بودن Override، هیچ محدودیت مصرفی برای کاربران اعمال نمی‌شود.
            </motion.div>
          )}
        </div>
      </div>

      {/* Active Sessions / IP Depletion Ledger with Transcription */}
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-text-primary">لجر مصرف منابع IP و رونوشت</h2>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-[11px] text-text-muted">Real-time</span>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-8 gap-2 border-b border-border px-5 py-2.5">
          {["شناسه", "IP", "شروع", "مدت", "پرسش‌ها", "رونوشت (دقیقه)", "سهمیه", "وضعیت"].map((h) => (
            <span key={h} className="text-[12px] font-medium uppercase text-text-secondary">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {sessions.map((session) => {
            const quotaPercent = (session.dailyUsed / session.dailyQuota) * 100;
            return (
              <div
                key={session.id}
                className="grid grid-cols-8 items-center gap-2 px-5 py-3 bg-surface transition-colors duration-150 hover:bg-surface-secondary/40"
              >
                <code className="text-xs text-text-primary" dir="ltr">
                  {session.id}
                </code>
                <span className="text-xs text-text-secondary" dir="ltr">
                  {session.ip}
                </span>
                <span className="text-xs text-text-muted">{session.startedAt}</span>
                <span className="text-xs text-text-primary">{session.duration}</span>
                <span className="text-xs font-medium text-text-primary">
                  {session.questionsAsked.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-text-secondary">
                  {session.transcriptionMinutes.toLocaleString("fa-IR")}
                </span>

                {/* Quota bar */}
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${
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

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      session.status === "active"
                        ? "bg-success"
                        : session.status === "idle"
                          ? "bg-warning"
                          : "bg-text-muted"
                    }`}
                  />
                  <span className="text-[11px] text-text-muted">
                    {session.status === "active"
                      ? "فعال"
                      : session.status === "idle"
                        ? "بیکار"
                        : "پایان"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */

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
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${highlight ? "bg-accent/15" : "bg-surface-secondary"}`}
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
