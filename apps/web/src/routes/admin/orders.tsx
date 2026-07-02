import { createFileRoute, type ErrorComponentProps } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangleIcon,
  BanknoteIcon,
  ChevronDownIcon,
  CreditCardIcon,
  ReceiptIcon,
  ShoppingCartIcon,
  XCircleIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../components/admin/DataTable";
import { InstallmentCollapsible } from "../../components/admin/InstallmentCollapsible";
import { OrderDetailsModal } from "../../components/admin/OrderDetailsModal";
import { columns, type OrderRow, type OrderStatus } from "../../components/admin/OrdersColumns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

/* ─── Route Declaration ─── */
export const Route = createFileRoute("/admin/orders")({
  component: OrdersLedger,
  errorComponent: AdminOrdersErrorComponent,
});

/* ─── Main Component ─── */
function OrdersLedger() {
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationOrderId, setCancellationOrderId] = useState<string | null>(null);

  // Expanded states
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    targetStatus: OrderStatus;
    currentStatus: OrderStatus;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  // Real tRPC queries & mutations
  const ordersQuery = trpc.admin.listOrders.useQuery();
  const orders = (ordersQuery.data?.orders ?? []) as OrderRow[];

  const cancelMutation = trpc.admin.processOrderCancellation.useMutation({
    onSuccess: () => {
      toast.success("سفارش لغو شد و اعلان Kafka ارسال گردید");
      setShowCancellationModal(false);
      setCancellationOrderId(null);
      ordersQuery.refetch();
    },
    onError: () => {
      toast.error("خطا در لغو سفارش");
    },
  });

  const updateStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("وضعیت سفارش با موفقیت به‌روزرسانی شد");
      setPendingStatusUpdate(null);
      ordersQuery.refetch();
    },
    onError: (err) => {
      toast.error(`خطا در تغییر وضعیت: ${err.message}`);
      setPendingStatusUpdate(null);
    },
  });

  const handleConfirmCancellation = useCallback(() => {
    if (cancellationOrderId) {
      cancelMutation.mutate({ orderId: cancellationOrderId, reason: "لغو توسط مدیر" });
    }
  }, [cancellationOrderId, cancelMutation]);

  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const installmentOrders = orders.filter((o) => o.hasInstallment);

  const filteredOrders =
    statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const tableMeta = {
    onViewDetails: (order: OrderRow) => {
      setSelectedOrder(order);
    },
    onStatusChange: (orderId: string, targetStatus: OrderStatus, currentStatus: OrderStatus) => {
      setPendingStatusUpdate({ orderId, targetStatus, currentStatus });
    },
  };

  if (ordersQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">سفارش‌ها و مالی</h1>
        <p className="text-sm text-text-muted">مدیریت سفارش‌ها، اقساط و لغو سفارش</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingCartIcon}
          label="سفارش‌های فعال"
          value={orders
            .filter((o) => !["cancelled", "returned"].includes(o.status))
            .length.toLocaleString("fa-IR")}
        />
        <StatCard
          icon={BanknoteIcon}
          label="مجموع درآمد"
          value={orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString("fa-IR")}
        />
        <StatCard
          icon={CreditCardIcon}
          label="دارای اقساط"
          value={installmentOrders.length.toLocaleString("fa-IR")}
        />
        <StatCard
          icon={XCircleIcon}
          label="لغو شده"
          value={cancelledOrders.length.toLocaleString("fa-IR")}
        />
      </div>

      {/* Collapsible Installment Plans */}
      {installmentOrders.length > 0 && (
        <Collapsible
          defaultOpen={false}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">
                قراردادهای اقساطی ({installmentOrders.length.toLocaleString("fa-IR")})
              </h2>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-text-muted transition-transform duration-200 in-data-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 flex flex-col gap-3">
              {installmentOrders.map((order) => (
                <InstallmentCollapsible key={order.id} order={order} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Cancellation Center */}
      {cancelledOrders.length > 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <XCircleIcon className="h-5 w-5 text-destructive" />
            <h2 className="text-sm font-semibold text-text-primary">مرکز لغو سفارش</h2>
          </div>
          {cancelledOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-text-primary">
                  سفارش #{order.id.slice(0, 8)} — {order.customerName}
                </span>
                <span className="text-xs text-text-muted">
                  مبلغ: {order.totalAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              {order.paymentStatus === "refunded" && (
                <div className="rounded-lg border border-success/30 bg-success/10 px-2.5 py-1">
                  <span className="text-[11px] font-medium text-success">بازپرداخت انجام شد</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
        <span className="text-xs font-medium text-text-muted">فیلتر بر اساس وضعیت سفارش:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              statusFilter === "all"
                ? "bg-accent/10 text-accent font-semibold"
                : "bg-surface-secondary text-text-muted hover:text-text-secondary"
            }`}
          >
            همه ({orders.length.toLocaleString("fa-IR")})
          </button>
          {(
            [
              "pending",
              "confirmed",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
              "returned",
            ] as OrderStatus[]
          ).map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            const labels: Record<OrderStatus, string> = {
              pending: "در انتظار پرداخت",
              confirmed: "تأیید شده",
              processing: "در حال پردازش",
              shipped: "ارسال شده",
              delivered: "تحویل شده",
              cancelled: "لغو شده",
              returned: "مرجوعی",
            };
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  statusFilter === status
                    ? "bg-accent/10 text-accent font-semibold"
                    : "bg-surface-secondary text-text-muted hover:text-text-secondary"
                }`}
              >
                {labels[status]} ({count.toLocaleString("fa-IR")})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders DataTable */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchKey="customerName"
        searchPlaceholder="جستجوی مشتری..."
        meta={tableMeta}
      />

      {/* Details Modal */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {/* Status Confirmation Alert Dialog */}
      <AlertDialog
        open={!!pendingStatusUpdate}
        onOpenChange={(open) => {
          if (!open) setPendingStatusUpdate(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader className="rtl text-right">
            <AlertDialogTitle className="w-full text-right font-heading text-text-primary">
              تغییر وضعیت نهایی سفارش
            </AlertDialogTitle>
            <AlertDialogDescription className="w-full text-right text-text-secondary mt-2 leading-relaxed">
              آیا از تغییر وضعیت سفارش به{" "}
              <strong>
                {pendingStatusUpdate?.targetStatus === "pending"
                  ? "در انتظار پرداخت"
                  : pendingStatusUpdate?.targetStatus === "confirmed"
                    ? "تأیید شده"
                    : pendingStatusUpdate?.targetStatus === "processing"
                      ? "در حال پردازش"
                      : pendingStatusUpdate?.targetStatus === "shipped"
                        ? "ارسال شده"
                        : pendingStatusUpdate?.targetStatus === "delivered"
                          ? "تحویل شده"
                          : pendingStatusUpdate?.targetStatus === "cancelled"
                            ? "لغو شده"
                            : "مرجوعی"}
              </strong>{" "}
              اطمینان دارید؟ این عمل تأثیرات مالی و انبارداری ثبت خواهد کرد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="rtl justify-start gap-2">
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setPendingStatusUpdate(null)}
            >
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-accent hover:bg-accent/90 text-white"
              onClick={() => {
                if (pendingStatusUpdate) {
                  updateStatusMutation.mutate({
                    orderId: pendingStatusUpdate.orderId,
                    status: pendingStatusUpdate.targetStatus,
                  });
                }
              }}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "در حال به‌روزرسانی..." : "تأیید"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancellationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setShowCancellationModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-warning" />
                <h2 className="text-base font-semibold text-text-primary">تأیید لغو سفارش</h2>
              </div>
              <div className="mb-4 rounded-xl border border-warning/30 bg-warning/10 p-4">
                <p className="text-sm text-text-secondary">
                  سفارش <strong>#{cancellationOrderId}</strong> لغو خواهد شد. بازپرداخت و اعلان
                  Kafka ارسال می‌گردد.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmCancellation}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "در حال پردازش..." : "تأیید و لغو"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancellationModal(false)}
                  disabled={cancelMutation.isPending}
                >
                  انصراف
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingCartIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary">
        <Icon className="h-5 w-5 text-text-muted" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-text-primary">{value}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    </div>
  );
}

/* ─── Localized Error Boundary Component ─── */
function AdminOrdersErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text-primary">خطا در بارگذاری لیست سفارش‌ها</h2>
        <p className="text-sm text-text-muted">
          مشکلی در برقراری ارتباط با پایگاه داده یا سیستم Kafka پیش آمده است.
        </p>
      </div>
      {error && (
        <pre
          className="max-w-md overflow-auto rounded-lg bg-surface px-3 py-2 text-left text-xs text-destructive"
          dir="ltr"
        >
          {error.message || String(error)}
        </pre>
      )}
      <Button variant="outline" size="sm" onClick={() => reset()}>
        تلاش مجدد
      </Button>
    </div>
  );
}
