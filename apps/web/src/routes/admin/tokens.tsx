import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, CopyIcon, KeyIcon, PlusIcon, ShieldIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { DataTable } from "../../components/admin/DataTable";
import { Button } from "../../components/ui/button";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/tokens")({
  component: TokensMatrix,
});

/**
 * API Token Matrix & Workshop
 *
 * Administrative dashboard for cryptographic API access token management.
 * - Token table with status dots (Active: bg-success, Revoked: bg-destructive)
 * - "Generate New API Token" button triggers modal
 * - Scope checkboxes: products:write, orders:read, stories:publish, etc.
 * - Type-safe tRPC mutation admin.createApiToken (will wire once backend ready)
 */

/* ─── Types ─── */

type TokenStatus = "active" | "revoked" | "expired";

interface TokenRow {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string | null;
  scopes: string[];
  status: TokenStatus;
  lastUsedAt: string | null;
}

/* ─── Status Configuration ─── */

const STATUS_CONFIG: Record<TokenStatus, { label: string; dotClass: string }> = {
  active: { label: "فعال", dotClass: "bg-success" },
  revoked: { label: "لغو شده", dotClass: "bg-destructive" },
  expired: { label: "منقضی", dotClass: "bg-destructive" },
};

/* ─── Available Scopes ─── */

const AVAILABLE_SCOPES = [
  { key: "products:read", label: "خواندن محصولات" },
  { key: "products:write", label: "نوشتن محصولات" },
  { key: "orders:read", label: "خواندن سفارش‌ها" },
  { key: "orders:write", label: "نوشتن سفارش‌ها" },
  { key: "stories:publish", label: "انتشار استوری" },
  { key: "users:read", label: "خواندن کاربران" },
  { key: "analytics:read", label: "خواندن آمار" },
  { key: "torob:manage", label: "مدیریت ترب" },
] as const;

/* ─── Column Definitions ─── */

const columns: ColumnDef<TokenRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "نام توکن",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <KeyIcon className="h-4 w-4 shrink-0 text-text-muted" />
        <span className="font-medium text-text-primary">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status];
      return (
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
          <span className="text-sm text-text-secondary">{config.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "scopes",
    header: "دسترسی‌ها",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.scopes.slice(0, 3).map((scope) => (
          <span
            key={scope}
            className="inline-flex rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-text-muted"
          >
            {scope}
          </span>
        ))}
        {row.original.scopes.length > 3 && (
          <span className="inline-flex rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-text-muted">
            +{row.original.scopes.length - 3}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ایجاد",
    cell: ({ row }) => <span className="text-xs text-text-muted">{row.original.createdAt}</span>,
  },
  {
    accessorKey: "expiresAt",
    header: "انقضا (TTL)",
    cell: ({ row }) => (
      <span className="text-xs text-text-muted">{row.original.expiresAt ?? "بدون انقضا"}</span>
    ),
  },
  {
    accessorKey: "lastUsedAt",
    header: "آخرین استفاده",
    cell: ({ row }) => (
      <span className="text-xs text-text-muted">{row.original.lastUsedAt ?? "—"}</span>
    ),
  },
];

/* ─── Component ─── */

function TokensMatrix() {
  const [showModal, setShowModal] = useState(false);

  // Real tRPC query
  const tokensQuery = trpc.admin.listApiTokens.useQuery();
  const tokens = (tokensQuery.data?.tokens ?? []) as TokenRow[];
  const activeCount = tokens.filter((t) => t.status === "active").length;
  const inactiveCount = tokens.filter((t) => t.status !== "active").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">کلیدهای API</h1>
          <p className="text-sm text-text-muted">مدیریت توکن‌های دسترسی رمزنگاری شده</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowModal(true)}>
          <PlusIcon className="h-4 w-4" />
          ایجاد توکن جدید
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="توکن‌های فعال"
          value={activeCount.toLocaleString("fa-IR")}
          dotClass="bg-success"
        />
        <StatCard
          label="لغو/منقضی شده"
          value={inactiveCount.toLocaleString("fa-IR")}
          dotClass="bg-destructive"
        />
        <StatCard
          label="مجموع توکن‌ها"
          value={tokens.length.toLocaleString("fa-IR")}
          dotClass="bg-accent"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={tokens}
        searchKey="name"
        searchPlaceholder="جستجوی توکن..."
      />

      {/* Generate Token Modal */}
      <AnimatePresence>
        {showModal && <GenerateTokenModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Stat Card ─── */

function StatCard({ label, value, dotClass }: { label: string; value: string; dotClass: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <span className={`h-3 w-3 shrink-0 rounded-full ${dotClass}`} />
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-text-primary">{value}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    </div>
  );
}

/* ─── Generate Token Modal ─── */

function GenerateTokenModal({ onClose }: { onClose: () => void }) {
  const [tokenName, setTokenName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [ttlDays, setTtlDays] = useState("90");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleScope = useCallback((scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  }, []);

  const handleGenerate = useCallback(() => {
    // Stub: In production, this calls trpc.admin.createApiToken.mutate()
    const fakeToken = `rt_tok_${crypto.randomUUID().replace(/-/g, "").slice(0, 32)}`;
    setGeneratedToken(fakeToken);
  }, []);

  const handleCopy = useCallback(() => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedToken]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">ایجاد توکن API جدید</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {generatedToken ? (
          /* Token Generated State */
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">
              توکن شما با موفقیت ایجاد شد. این کلید فقط یک بار نمایش داده می‌شود:
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-secondary p-3">
              <code
                className="flex-1 overflow-hidden text-ellipsis text-xs text-text-primary"
                dir="ltr"
              >
                {generatedToken}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:text-accent"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-success" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button onClick={onClose} className="mt-2">
              بستن
            </Button>
          </div>
        ) : (
          /* Token Configuration Form */
          <div className="flex flex-col gap-5">
            {/* Token Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">نام توکن</label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="مثلاً: سرویس ترب"
                className="h-10 rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
              />
            </div>

            {/* TTL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">مدت اعتبار (روز)</label>
              <input
                type="number"
                value={ttlDays}
                onChange={(e) => setTtlDays(e.target.value)}
                min="1"
                max="365"
                className="h-10 w-32 rounded-xl border border-border bg-surface px-4 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                dir="ltr"
              />
            </div>

            {/* Scope Checkboxes */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-secondary">دسترسی‌ها (Scopes)</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_SCOPES.map((scope) => {
                  const isChecked = selectedScopes.includes(scope.key);
                  return (
                    <label
                      key={scope.key}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors duration-200 ${
                        isChecked
                          ? "border-accent/40 bg-surface-action text-accent"
                          : "border-border bg-surface text-text-secondary hover:border-border-light"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleScope(scope.key)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${isChecked ? "border-accent bg-accent text-white" : "border-border bg-surface"}`}
                      >
                        {isChecked && <CheckIcon className="h-3 w-3" />}
                      </span>
                      <span>{scope.label}</span>
                      <code className="ms-auto text-[10px] text-text-muted" dir="ltr">
                        {scope.key}
                      </code>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleGenerate}
              disabled={!tokenName.trim() || selectedScopes.length === 0}
              className="mt-2 gap-2"
            >
              <KeyIcon className="h-4 w-4" />
              ایجاد توکن
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
