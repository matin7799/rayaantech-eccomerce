import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import {
  KeyIcon,
  MicIcon,
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

/**
 * /admin — Overview Ledger (Core KPIs)
 *
 * Renders high-level operational metrics across all subsystems:
 * Products, API Tokens, Torob integrations, and Voice AI sessions.
 * Uses recharts CSS variable references for chart colors.
 */

interface KpiCard {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: typeof PackageIcon;
}

const STAGGER_CHILDREN: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function AdminOverview() {
  // Real tRPC query
  const overviewQuery = trpc.admin.getOverviewStats.useQuery();
  const stats = overviewQuery.data;

  // Recent system events — real logs, most recent first
  const recentLogsQuery = trpc.admin.listSystemLogs.useQuery({ limit: 6, offset: 0 });
  const recentLogs = recentLogsQuery.data?.logs ?? [];

  const kpiData: KpiCard[] = [
    {
      id: "products",
      label: "محصولات فعال",
      value: stats?.activeProducts?.toLocaleString("fa-IR") ?? "—",
      change: "",
      changeType: "neutral" as const,
      icon: PackageIcon,
    },
    {
      id: "orders",
      label: "سفارش‌های امروز",
      value: stats?.ordersToday?.toLocaleString("fa-IR") ?? "—",
      change: "",
      changeType: "neutral" as const,
      icon: ShoppingCartIcon,
    },
    {
      id: "api-tokens",
      label: "توکن‌های فعال",
      value: stats?.activeTokens?.toLocaleString("fa-IR") ?? "—",
      change: "",
      changeType: "neutral" as const,
      icon: KeyIcon,
    },
    {
      id: "voice-sessions",
      label: "جلسات صوتی فعال",
      value: stats?.activeVoiceSessions?.toLocaleString("fa-IR") ?? "—",
      change: "",
      changeType: "neutral" as const,
      icon: MicIcon,
    },
  ];

  const subsystemCards = [
    {
      id: "revenue",
      label: "درآمد امروز",
      value: stats ? `${(stats.revenueToday / 1000000).toFixed(1)}M تومان` : "—",
      sublabel: "",
      icon: TrendingUpIcon,
    },
    {
      id: "users",
      label: "کاربران آنلاین",
      value: stats?.onlineUsers?.toLocaleString("fa-IR") ?? "—",
      sublabel: "بازدیدکنندگان فعال",
      icon: UsersIcon,
    },
  ];

  if (overviewQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">نمای کلی</h1>
        <p className="text-sm text-text-muted">وضعیت لحظه‌ای سامانه‌های عملیاتی رایان تک</p>
      </div>

      {/* Primary KPI Cards */}
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              variants={FADE_UP}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-glass backdrop-blur-sm transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    kpi.changeType === "positive"
                      ? "text-success"
                      : kpi.changeType === "negative"
                        ? "text-danger"
                        : "text-text-muted"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[30px] font-semibold leading-9 text-text-primary">
                  {kpi.value}
                </span>
                <span className="text-xs font-normal text-text-muted">{kpi.label}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Secondary Subsystem Cards */}
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {subsystemCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              variants={FADE_UP}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-text-muted" aria-hidden="true" />
                <span className="text-xs font-medium text-text-muted">{card.label}</span>
              </div>
              <span className="text-base font-semibold text-text-primary">{card.value}</span>
              <span className="text-[11px] text-text-muted">{card.sublabel}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent System Events — real logs */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">رویدادهای اخیر سیستم</h2>
          <Link
            to="/admin/logs"
            className="text-xs font-medium text-accent no-underline hover:underline"
          >
            مشاهده همه
          </Link>
        </div>
        {recentLogsQuery.isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : recentLogs.length === 0 ? (
          <p className="py-4 text-sm text-text-muted">رویدادی برای نمایش وجود ندارد</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    log.level === "error"
                      ? "bg-danger"
                      : log.level === "warn"
                        ? "bg-warning"
                        : log.level === "debug"
                          ? "bg-text-muted"
                          : "bg-accent"
                  }`}
                />
                <span className="flex-1 truncate text-sm text-text-secondary">{log.message}</span>
                <span className="hidden shrink-0 text-xs text-text-muted sm:inline">
                  {log.context}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
