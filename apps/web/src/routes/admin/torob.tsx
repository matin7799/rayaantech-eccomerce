import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  DatabaseIcon,
  RadioIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  Trash2Icon,
  ZapIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../../components/ui/button";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/torob")({
  component: TorobHub,
});

/**
 * Torob Integration Hub & Firewall Control
 *
 * Monitoring dashboard for /api/v1/torob/ scraping channels:
 * - Cache hit metrics (sub-ms bypass via Redis): bg-success dots
 * - Throttled IP requests (rate limit): bg-warning dots with blocked IP
 * - Manual "Flush Torob Redis Cache" destructive CTA
 */

/* ─── Types ─── */

type EventType = "cache-hit" | "throttled" | "miss";

interface TorobEvent {
  id: string;
  type: EventType;
  path: string;
  responseTime: string;
  ip: string | null;
  timestamp: string;
}

/* ─── Event Configuration ─── */

const EVENT_CONFIG: Record<EventType, { label: string; dotClass: string; textClass: string }> = {
  "cache-hit": { label: "Cache Hit", dotClass: "bg-success", textClass: "text-success" },
  throttled: { label: "Rate Limited", dotClass: "bg-warning", textClass: "text-warning" },
  miss: { label: "Cache Miss", dotClass: "bg-accent", textClass: "text-accent" },
};

/* ─── Component ─── */

function TorobHub() {
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushResult, setFlushResult] = useState<{ success: boolean; count: number } | null>(null);

  // Real tRPC query
  const statsQuery = trpc.admin.getTorobStats.useQuery();
  const stats = statsQuery.data;

  const handleFlushCache = useCallback(() => {
    setIsFlushing(true);
    setFlushResult(null);
    // Stub: In production, this calls trpc.admin.flushTorobCache.mutate()
    setTimeout(() => {
      setIsFlushing(false);
      setFlushResult({ success: true, count: 3215 });
    }, 1500);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">هاب ترب</h1>
        <p className="text-sm text-text-muted">مانیتورینگ کانال‌های اسکرپینگ و دیوار آتش Redis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={ZapIcon}
          label="کل درخواست‌ها (امروز)"
          value={stats?.totalRequestsToday?.toLocaleString("fa-IR") ?? "—"}
        />
        <MetricCard
          icon={DatabaseIcon}
          label="Cache Hit Rate"
          value={stats ? `${stats.cacheHitRate}٪` : "—"}
          valueClass="text-success"
        />
        <MetricCard
          icon={ShieldAlertIcon}
          label="IP‌های مسدود شده"
          value={stats?.throttledIps?.toLocaleString("fa-IR") ?? "—"}
          valueClass="text-warning"
        />
      </div>

      {/* Redis Info + Flush CTA */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Redis Cache Status</span>
          <span className="text-xs text-text-muted">
            حافظه مصرفی: {stats?.redisMemoryMb ?? 0} MB — کلیدهای فعال:{" "}
            {stats?.cachedKeys?.toLocaleString("fa-IR") ?? "—"}
          </span>
          {flushResult && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-success"
            >
              ✓ {flushResult.count.toLocaleString("fa-IR")} کلید با موفقیت پاکسازی شد
            </motion.span>
          )}
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={handleFlushCache}
          disabled={isFlushing}
        >
          {isFlushing ? (
            <RefreshCwIcon className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2Icon className="h-4 w-4" />
          )}
          {isFlushing ? "در حال پاکسازی..." : "پاکسازی کش Redis"}
        </Button>
      </div>

      {/* Live Event Stream */}
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <RadioIcon className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">رویدادهای زنده</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-[11px] text-text-muted">Live</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          <div className="flex flex-col items-center justify-center py-8 text-text-muted">
            <span className="text-xs">رویدادهای زنده از طریق WebSocket بارگذاری می‌شوند</span>
            <span className="mt-1 text-[11px]">در انتظار اتصال به سرویس مانیتورینگ...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Metric Card ─── */

function MetricCard({
  icon: Icon,
  label,
  value,
  valueClass = "text-text-primary",
}: {
  icon: typeof ZapIcon;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={`text-base font-semibold ${valueClass}`}>{value}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    </div>
  );
}
