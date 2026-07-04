import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BugIcon,
  InfoIcon,
  ListIcon,
  RotateCwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/logs")({
  component: SystemLogsPage,
});

/**
 * /admin/logs — System Logs Explorer.
 *
 * All system events surface here with:
 * - Free-text search (message + context) — debounced via controlled submit
 * - Level filter buttons (همه / اطلاعات / هشدار / خطا / دیباگ)
 * - Context (source) filter dropdown
 * - Result count + clear-filters affordance
 *
 * Backed by trpc.admin.listSystemLogs / listLogContexts.
 */

type Level = "info" | "warn" | "error" | "debug";

const LEVEL_CONFIG: Record<
  Level,
  { label: string; icon: typeof InfoIcon; dotClass: string; textClass: string }
> = {
  info: { label: "اطلاعات", icon: InfoIcon, dotClass: "bg-accent", textClass: "text-accent" },
  warn: {
    label: "هشدار",
    icon: AlertTriangleIcon,
    dotClass: "bg-warning",
    textClass: "text-warning",
  },
  error: { label: "خطا", icon: AlertCircleIcon, dotClass: "bg-danger", textClass: "text-danger" },
  debug: { label: "دیباگ", icon: BugIcon, dotClass: "bg-text-muted", textClass: "text-text-muted" },
};

const LEVEL_FILTERS: Array<{ value: Level | "all"; label: string; icon: typeof ListIcon }> = [
  { value: "all", label: "همه", icon: ListIcon },
  { value: "info", label: "اطلاعات", icon: InfoIcon },
  { value: "warn", label: "هشدار", icon: AlertTriangleIcon },
  { value: "error", label: "خطا", icon: AlertCircleIcon },
  { value: "debug", label: "دیباگ", icon: BugIcon },
];

function SystemLogsPage() {
  const [level, setLevel] = useState<Level | "all">("all");
  const [context, setContext] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const contextsQuery = trpc.admin.listLogContexts.useQuery();
  const logsQuery = trpc.admin.listSystemLogs.useQuery({
    level: level === "all" ? undefined : level,
    context: context === "all" ? undefined : context,
    search: search.trim() || undefined,
    limit: 100,
    offset: 0,
  });

  const logs = logsQuery.data?.logs ?? [];
  const total = logsQuery.data?.total ?? 0;
  const contexts = contextsQuery.data?.contexts ?? [];

  const hasFilters = useMemo(
    () => level !== "all" || context !== "all" || search.trim().length > 0,
    [level, context, search],
  );

  const clearFilters = () => {
    setLevel("all");
    setContext("all");
    setSearch("");
    setSearchInput("");
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold leading-8 text-text-primary sm:text-[30px] sm:leading-9">
            لاگ‌های سیستم
          </h1>
          <p className="text-sm text-text-muted">
            جستجو و فیلتر تمام رویدادهای سیستمی به تفکیک سطح و منبع
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 self-start sm:self-auto"
          onClick={() => logsQuery.refetch()}
          disabled={logsQuery.isFetching}
        >
          <RotateCwIcon className={`h-3.5 w-3.5 ${logsQuery.isFetching ? "animate-spin" : ""}`} />
          بازخوانی
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 sm:p-4">
        {/* Search + context row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={submitSearch} className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="جستجو در پیام یا منبع لاگ..."
              className="h-10 w-full ps-9 pe-9"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                }}
                aria-label="پاک کردن جستجو"
                className="absolute top-1/2 end-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text-primary"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="sm:w-56">
            <Select value={context} onValueChange={(v) => v && setContext(v)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="همه منابع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه منابع</SelectItem>
                {contexts.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Level filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {LEVEL_FILTERS.map((f) => {
            const Icon = f.icon;
            const active = level === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setLevel(f.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ms-auto flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-danger"
            >
              <XIcon className="h-3.5 w-3.5" />
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {!logsQuery.isLoading && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>
            {total.toLocaleString("fa-IR")} رویداد یافت شد
            {logs.length < total ? ` (نمایش ${logs.length.toLocaleString("fa-IR")})` : ""}
          </span>
        </div>
      )}

      {/* Log entries */}
      {logsQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-text-muted">
          <SearchIcon className="h-6 w-6" />
          <span className="text-sm">لاگی با این فیلترها یافت نشد</span>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {logs.map((log) => {
            const config = LEVEL_CONFIG[log.level as Level] ?? LEVEL_CONFIG.info;
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-secondary/30 sm:px-5"
              >
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${config.dotClass}`} />
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-medium text-text-primary">{log.message}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
                    <code className="rounded bg-surface-secondary px-1.5 py-0.5">
                      {log.context}
                    </code>
                    <span className={`font-medium ${config.textClass}`}>{config.label}</span>
                    <span>{log.createdAt}</span>
                    {log.traceId && (
                      <code dir="ltr" className="max-w-32 truncate">
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
