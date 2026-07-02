import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  ActivityIcon,
  ClockIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../components/admin/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/users")({
  component: UsersLedger,
});

/**
 * User Management — Real Data Binding
 *
 * - trpc.admin.listUsers.useQuery() for user data
 * - trpc.admin.getUserActivityLogs.useQuery() for Sheet timeline
 * - Inline Select role mutator → admin.updateUserRole mutation
 * - Partner Gateway filters pending wholesale requests
 */

/* ─── Types ─── */

type UserRole = "retail" | "wholesale" | "admin" | "operator";
type WholesaleStatus = "none" | "pending" | "approved" | "rejected";

interface UserRow {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  role: UserRole;
  wholesaleStatus: WholesaleStatus;
  rayanCoins: number;
  isVerified: boolean;
  createdAt: string;
}

/* ─── Config ─── */

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "retail", label: "مشتری" },
  { value: "wholesale", label: "همکار فروش" },
  { value: "admin", label: "مدیر" },
  { value: "operator", label: "سوپرادمین" },
];

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  retail: { label: "مشتری", className: "bg-surface-secondary text-text-muted" },
  wholesale: { label: "همکار فروش", className: "bg-accent/15 text-accent" },
  admin: { label: "مدیر", className: "bg-warning/15 text-warning" },
  operator: { label: "سوپرادمین", className: "bg-success/15 text-success" },
};

const WHOLESALE_STATUS_CONFIG: Record<WholesaleStatus, { label: string; dotClass: string }> = {
  none: { label: "—", dotClass: "bg-text-muted" },
  pending: { label: "در انتظار", dotClass: "bg-warning" },
  approved: { label: "تأیید شده", dotClass: "bg-success" },
  rejected: { label: "رد شده", dotClass: "bg-destructive" },
};

/* ─── Inline Role Select ─── */

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  const updateRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => toast.success("نقش کاربر بروزرسانی شد"),
    onError: () => toast.error("خطا در تغییر نقش"),
  });

  const handleChange = useCallback(
    (newRole: string | null) => {
      if (!newRole) return;
      updateRole.mutate({
        userId,
        role: newRole as UserRole,
        wholesaleStatus: newRole === "wholesale" ? "approved" : "none",
      });
    },
    [userId, updateRole],
  );

  return (
    <Select defaultValue={currentRole} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="h-7 w-28 text-[11px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ─── Column Definitions ─── */

function createUserColumns(onViewActivity: (user: UserRow) => void): ColumnDef<UserRow, unknown>[] {
  return [
    {
      accessorKey: "fullName",
      header: "نام",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-text-primary">{row.original.fullName}</span>
          <span className="text-[11px] text-text-muted" dir="ltr">
            {row.original.mobile}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "ایمیل",
      cell: ({ row }) => (
        <span className="text-xs text-text-muted" dir="ltr">
          {row.original.email ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "نقش",
      cell: ({ row }) => <RoleSelect userId={row.original.id} currentRole={row.original.role} />,
    },
    {
      accessorKey: "wholesaleStatus",
      header: "وضعیت همکاری",
      cell: ({ row }) => {
        const config = WHOLESALE_STATUS_CONFIG[row.original.wholesaleStatus];
        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
            <span className="text-xs text-text-secondary">{config.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "rayanCoins",
      header: "سکه",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-text-primary">
          {row.original.rayanCoins.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      accessorKey: "isVerified",
      header: "تأیید",
      cell: ({ row }) => (
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${row.original.isVerified ? "bg-success/15 text-success" : "bg-surface-secondary text-text-muted"}`}
        >
          {row.original.isVerified ? "✓" : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onViewActivity(row.original)}
          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-accent"
          aria-label="مشاهده فعالیت"
        >
          <ActivityIcon className="h-4 w-4" />
        </button>
      ),
    },
  ];
}
function UsersLedger() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Real tRPC query — no mock data
  const usersQuery = trpc.admin.listUsers.useQuery();
  const users = (usersQuery.data?.users ?? []) as UserRow[];
  const pendingPartners = users.filter((u) => u.wholesaleStatus === "pending");

  // Activity logs query — enabled only when sheet is open
  const activityQuery = trpc.admin.getUserActivityLogs.useQuery(
    { userId: selectedUserId ?? "", limit: 20 },
    { enabled: sheetOpen && !!selectedUserId },
  );
  const activityLogs = activityQuery.data?.logs ?? [];

  const handleViewActivity = useCallback((user: UserRow) => {
    setSelectedUserId(user.id);
    setSelectedUserName(user.fullName);
    setSheetOpen(true);
  }, []);

  const columns = createUserColumns(handleViewActivity);

  const approvePartner = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("درخواست همکاری تأیید شد");
      usersQuery.refetch();
    },
    onError: () => toast.error("خطا در تأیید درخواست"),
  });

  const rejectPartner = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.error("درخواست همکاری رد شد");
      usersQuery.refetch();
    },
    onError: () => toast.error("خطا در رد درخواست"),
  });

  // Loading state
  if (usersQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">مدیریت کاربران</h1>
        <p className="text-sm text-text-muted">لجر کاربران، تغییر نقش آنی و ردیابی فعالیت</p>
      </div>

      {/* Partner Request Gateway */}
      {pendingPartners.length > 0 && (
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <UserCheckIcon className="h-5 w-5 text-warning" />
            <h2 className="text-sm font-semibold text-text-primary">
              درخواست‌های همکاری B2B ({pendingPartners.length.toLocaleString("fa-IR")})
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {pendingPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-text-primary">{partner.fullName}</span>
                  <span className="text-[11px] text-text-muted" dir="ltr">
                    {partner.mobile} — {partner.email ?? "بدون ایمیل"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      approvePartner.mutate({
                        userId: partner.id,
                        role: "wholesale",
                        wholesaleStatus: "approved",
                      })
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/25"
                  >
                    <ShieldCheckIcon className="h-3.5 w-3.5" />
                    تأیید
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      rejectPartner.mutate({
                        userId: partner.id,
                        role: "retail",
                        wholesaleStatus: "rejected",
                      })
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                  >
                    <ShieldXIcon className="h-3.5 w-3.5" />
                    رد
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={users}
        searchKey="fullName"
        searchPlaceholder="جستجوی نام کاربر..."
      />

      {/* Activity Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>فعالیت‌های {selectedUserName}</SheetTitle>
            <SheetDescription>جریان زمانی از لجر system_logs</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 pb-4">
            {/* User Summary */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-secondary/30 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <UsersIcon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-text-primary">{selectedUserName}</span>
                <span className="text-[11px] text-text-muted">شناسه: {selectedUserId}</span>
              </div>
            </div>

            {/* Activity Timeline */}
            {activityQuery.isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : activityLogs.length === 0 ? (
              <p className="text-center text-xs text-text-muted py-8">فعالیتی ثبت نشده</p>
            ) : (
              <div className="flex flex-col gap-0">
                {activityLogs.map((log, idx) => (
                  <div key={log.id} className="relative flex gap-3 pb-4 last:pb-0">
                    {idx < activityLogs.length - 1 && (
                      <div className="absolute inset-s-[7px] top-5 h-full w-px bg-border" />
                    )}
                    <span
                      className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-surface ${
                        log.level === "error"
                          ? "bg-danger"
                          : log.level === "warn"
                            ? "bg-warning"
                            : "bg-accent"
                      }`}
                    />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-xs font-medium text-text-primary">{log.message}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] text-text-muted">{log.context}</code>
                        <span className="text-[10px] text-text-muted">•</span>
                        <span className="flex items-center gap-1 text-[10px] text-text-muted">
                          <ClockIcon className="h-2.5 w-2.5" />
                          {log.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ─── Main Component ─── */
