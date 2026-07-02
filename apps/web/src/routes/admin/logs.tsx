import { createFileRoute } from "@tanstack/react-router";
import { AlertCircleIcon, AlertTriangleIcon, BugIcon, InfoIcon, ListIcon } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/logs")({
  component: SystemLogsPage,
});

/**
 * System Logs — Smart Categorized Tabs
 *
 * Real data from trpc.admin.listSystemLogs.useQuery()
 * Tabs: All | Info | Warn | Error | Debug
 */

const LEVEL_CONFIG = {
  info: { label: "اطلاعات", icon: InfoIcon, dotClass: "bg-accent", textClass: "text-accent" },
  warn: {
    label: "هشدار",
    icon: AlertTriangleIcon,
    dotClass: "bg-warning",
    textClass: "text-warning",
  },
  error: { label: "خطا", icon: AlertCircleIcon, dotClass: "bg-danger", textClass: "text-danger" },
  debug: { label: "دیباگ", icon: BugIcon, dotClass: "bg-text-muted", textClass: "text-text-muted" },
} as const;

function SystemLogsPage() {
  const [activeLevel, setActiveLevel] = useState<string | undefined>(undefined);

  const logsQuery = trpc.admin.listSystemLogs.useQuery({
    level: activeLevel as "info" | "warn" | "error" | "debug" | undefined,
    limit: 100,
    offset: 0,
  });

  const logs = logsQuery.data?.logs ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">لاگ‌های سیستم</h1>
        <p className="text-sm text-text-muted">مشاهده و فیلتر رویدادهای سیستمی به تفکیک سطح</p>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setActiveLevel(v === "all" ? undefined : v)}>
        <TabsList className="w-fit">
          <TabsTrigger value="all" className="gap-1.5 text-xs">
            <ListIcon className="h-3.5 w-3.5" />
            همه
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-1.5 text-xs">
            <InfoIcon className="h-3.5 w-3.5" />
            اطلاعات
          </TabsTrigger>
          <TabsTrigger value="warn" className="gap-1.5 text-xs">
            <AlertTriangleIcon className="h-3.5 w-3.5" />
            هشدار
          </TabsTrigger>
          <TabsTrigger value="error" className="gap-1.5 text-xs">
            <AlertCircleIcon className="h-3.5 w-3.5" />
            خطا
          </TabsTrigger>
          <TabsTrigger value="debug" className="gap-1.5 text-xs">
            <BugIcon className="h-3.5 w-3.5" />
            دیباگ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4" />
        <TabsContent value="info" className="mt-4" />
        <TabsContent value="warn" className="mt-4" />
        <TabsContent value="error" className="mt-4" />
        <TabsContent value="debug" className="mt-4" />
      </Tabs>

      {/* Log entries */}
      {logsQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-text-muted">
          <span className="text-sm">لاگی با این فیلتر یافت نشد</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface divide-y divide-border">
          {logs.map((log) => {
            const config =
              LEVEL_CONFIG[log.level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.info;
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-surface-secondary/30 transition-colors"
              >
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${config.dotClass}`} />
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <span className="text-sm font-medium text-text-primary">{log.message}</span>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    <code className="rounded bg-surface-secondary px-1.5 py-0.5">
                      {log.context}
                    </code>
                    <span className={`font-medium ${config.textClass}`}>{config.label}</span>
                    <span>{log.createdAt}</span>
                    {log.traceId && (
                      <code dir="ltr" className="truncate max-w-32">
                        {log.traceId}
                      </code>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
