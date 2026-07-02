import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "../ui/combobox";

// biome-ignore lint/performance/noBarrelFile: re-exporting types for convenience
// biome-ignore lint/performance/noReExportAll: re-exporting types for convenience
export * from "./OrdersTypes";

import {
  ORDER_STATUS_CONFIG,
  type OrderRow,
  type OrderStatus,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_CONFIG,
} from "./OrdersTypes";

/* ─── SSR Rehydration Shielding Wrapper ─── */
function SafeCell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="inline-block h-4 w-12 animate-pulse rounded bg-surface-secondary" />;
  }

  return <>{children}</>;
}

/* ─── Columns Definition with Null-Safe Sealing ─── */
export const columns: ColumnDef<OrderRow, unknown>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => {
      const original = row?.original;
      if (!original?.id) return null;
      return (
        <code className="text-xs font-medium text-text-primary" dir="ltr">
          #{original.id.slice(0, 8)}
        </code>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "مشتری",
    cell: ({ row }) => {
      const original = row?.original;
      if (!original) return null;
      return (
        <span className="text-sm font-medium text-text-primary">{original.customerName ?? ""}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const original = row?.original;
      if (!original) return null;
      const config = original.status ? ORDER_STATUS_CONFIG[original.status] : undefined;
      return (
        <SafeCell>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${config?.dotClass ?? "bg-text-muted"}`} />
            <span className="text-xs text-text-secondary">{config?.label ?? "نامشخص"}</span>
          </div>
        </SafeCell>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "مبلغ (تومان)",
    cell: ({ row }) => {
      const original = row?.original;
      if (original?.totalAmount === undefined) return null;
      return (
        <span className="text-sm font-medium text-text-primary">
          {original.totalAmount.toLocaleString("fa-IR")}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "پرداخت",
    cell: ({ row }) => {
      const original = row?.original;
      if (!original) return null;
      const config = original.paymentStatus
        ? PAYMENT_STATUS_CONFIG[original.paymentStatus]
        : undefined;
      return (
        <SafeCell>
          <span
            className={`inline-flex rounded-lg border px-2.5 py-1 text-[11px] font-medium ${config?.className ?? "bg-surface-secondary text-text-muted border-border"}`}
          >
            {config?.label ?? "نامشخص"}
          </span>
        </SafeCell>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "روش",
    cell: ({ row }) => {
      const original = row?.original;
      if (!original) return null;
      const method = original.paymentMethod;
      return (
        <span className="text-xs text-text-muted">
          {method ? (PAYMENT_METHOD_LABELS[method] ?? "نامشخص") : "نامشخص"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ثبت",
    cell: ({ row }) => {
      const original = row?.original;
      if (!original?.createdAt) return null;
      const dateStr = new Date(original.createdAt).toLocaleDateString("fa-IR");
      return <span className="text-xs text-text-muted">{dateStr}</span>;
    },
  },
  {
    id: "actions",
    header: "عملیات",
    cell: ({ row, table }) => {
      const original = row?.original;
      if (!original) return null;
      const meta = table?.options?.meta as
        | {
            onViewDetails?: (order: OrderRow) => void;
            onStatusChange?: (id: string, newStatus: OrderStatus, oldStatus: OrderStatus) => void;
          }
        | undefined;

      return (
        // biome-ignore lint/a11y/noStaticElementInteractions: wrapper only stops event propagation to parent row
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              meta?.onViewDetails?.(original);
            }}
            className="rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
          >
            مشاهده جزئیات
          </button>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: wrapper only stops event propagation to parent row */}
          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <Combobox
              value={original.status}
              onValueChange={(nextVal) => {
                const targetStatus = nextVal as OrderStatus;
                if (targetStatus && targetStatus !== original.status) {
                  meta?.onStatusChange?.(original.id, targetStatus, original.status);
                }
              }}
            >
              <ComboboxTrigger
                className="h-8 w-32 rounded-lg border border-border bg-surface px-2.5 py-0.5 text-xs text-text-primary focus:border-accent outline-none flex items-center justify-between cursor-pointer select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <ComboboxValue />
              </ComboboxTrigger>
              <ComboboxContent
                align="start"
                className="w-32 bg-surface border border-border rounded-lg shadow-glass overflow-hidden z-50 transition-colors duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
              >
                <ComboboxList className="p-1 max-h-60 overflow-y-auto no-scrollbar" dir="rtl">
                  <ComboboxItem
                    value="pending"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    در انتظار پرداخت
                  </ComboboxItem>
                  <ComboboxItem
                    value="confirmed"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    تأیید شده
                  </ComboboxItem>
                  <ComboboxItem
                    value="processing"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    در حال پردازش
                  </ComboboxItem>
                  <ComboboxItem
                    value="shipped"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    ارسال شده
                  </ComboboxItem>
                  <ComboboxItem
                    value="delivered"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    تحویل شده
                  </ComboboxItem>
                  <ComboboxItem
                    value="cancelled"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    لغو شده
                  </ComboboxItem>
                  <ComboboxItem
                    value="returned"
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary rounded-md cursor-pointer select-none"
                  >
                    مرجوعی
                  </ComboboxItem>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>
      );
    },
  },
];
