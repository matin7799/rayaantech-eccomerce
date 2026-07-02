import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";

type OrderFilter = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const FILTER_OPTIONS: { value: OrderFilter; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; icon: typeof Package }
> = {
  pending: {
    label: "در انتظار پرداخت",
    color: "text-warning",
    bgColor: "bg-warning/10",
    icon: Clock,
  },
  confirmed: {
    label: "تأیید شده",
    color: "text-accent",
    bgColor: "bg-accent/10",
    icon: CheckCircle2,
  },
  processing: {
    label: "در حال پردازش",
    color: "text-accent",
    bgColor: "bg-accent/10",
    icon: Package,
  },
  shipped: { label: "ارسال شده", color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Truck },
  delivered: {
    label: "تحویل شده",
    color: "text-success",
    bgColor: "bg-success/10",
    icon: CheckCircle2,
  },
  cancelled: { label: "لغو شده", color: "text-danger", bgColor: "bg-danger/10", icon: XCircle },
  returned: {
    label: "مرجوع شده",
    color: "text-text-muted",
    bgColor: "bg-surface-secondary",
    icon: XCircle,
  },
};

/** Timeline step positions for order tracking */
const TIMELINE_STEPS = ["pending", "processing", "shipped", "delivered"] as const;

/**
 * OrdersTab — سفارش‌ها
 *
 * Interactive list with status filtering, timeline bars,
 * and collapsible item details per order.
 */
export function OrdersTab() {
  const [filter, setFilter] = useState<OrderFilter>("all");

  const ordersQuery = trpc.profile.getOrders.useQuery(
    { status: filter, limit: 20, offset: 0 },
    { placeholderData: (prev) => prev },
  );
  const statsQuery = trpc.profile.getOrderStats.useQuery();

  const orders = ordersQuery.data?.orders ?? [];
  const stats = statsQuery.data;

  if (ordersQuery.isLoading && !ordersQuery.data) {
    return <OrdersSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Header with stats summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-text-primary">سفارش‌ها</h2>
        {stats && (
          <div className="flex items-center gap-3 text-[11px] font-medium text-text-muted">
            <span>{stats.pending.toLocaleString("fa-IR")} در انتظار</span>
            <span className="text-border">|</span>
            <span>{stats.processing.toLocaleString("fa-IR")} پردازش</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              filter === opt.value
                ? "bg-accent/10 text-accent"
                : "bg-surface-secondary text-text-muted hover:text-text-secondary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <AnimatePresence mode="wait">
        {orders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
              <Package className="h-7 w-7 text-text-muted" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-text-muted">سفارشی یافت نشد</p>
          </motion.div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Order Card with Collapsible Items ─── */

interface OrderItemData {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface OrderData {
  id: string;
  status: string;
  totalAmount: string;
  discountAmount?: string | null;
  shippingAddress?: string | null;
  itemCount: number;
  items?: OrderItemData[] | null;
  createdAt: string;
  updatedAt?: string;
}

function OrderCard({ order }: { order: OrderData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending!;
  const Icon = config.icon;
  const currentStepIdx = TIMELINE_STEPS.indexOf(order.status as (typeof TIMELINE_STEPS)[number]);
  const items = order.items ?? [];
  const hasItems = items.length > 0;

  // Format date in Persian
  const formattedDate = new Date(order.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-surface-secondary/30 transition-colors duration-300">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => hasItems && setIsExpanded((v) => !v)}
        className={cn(
          "flex w-full flex-col gap-3 p-4 text-start transition-colors",
          hasItems && "cursor-pointer hover:bg-surface-secondary/50",
        )}
        aria-expanded={isExpanded}
        disabled={!hasItems}
      >
        {/* Top row: Status + Order ID + Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn("flex h-7 w-7 items-center justify-center rounded-lg", config.bgColor)}
            >
              <Icon className={cn("h-3.5 w-3.5", config.color)} aria-hidden="true" />
            </div>
            <span className={cn("text-xs font-semibold", config.color)}>{config.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-text-muted">{formattedDate}</span>
            <span className="text-[10px] font-medium text-text-muted" dir="ltr">
              #{order.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Timeline bar */}
        {currentStepIdx >= 0 && (
          <div className="flex items-center gap-1">
            {TIMELINE_STEPS.map((step, idx) => (
              <div
                key={step}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-500",
                  idx <= currentStepIdx ? "bg-accent" : "bg-border",
                )}
              />
            ))}
          </div>
        )}

        {/* Bottom row: Price + Item count + Expand chevron */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {Number(order.totalAmount).toLocaleString("fa-IR")} تومان
            </span>
            {order.discountAmount && Number(order.discountAmount) > 0 && (
              <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                {Number(order.discountAmount).toLocaleString("fa-IR")}- تخفیف
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-text-muted">{order.itemCount} کالا</span>
            {hasItems && (
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 text-text-muted" />
              </motion.div>
            )}
          </div>
        </div>
      </button>

      {/* Collapsible Items Section */}
      <AnimatePresence initial={false}>
        {isExpanded && hasItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-light px-4 py-3">
              {/* Items list */}
              <div className="flex flex-col gap-2.5">
                {items.map((item, idx) => (
                  <OrderItemRow key={`${item.productId}-${idx}`} item={item} />
                ))}
              </div>

              {/* Shipping address if available */}
              {order.shippingAddress && (
                <div className="mt-3 rounded-lg bg-surface-secondary/50 p-2.5">
                  <span className="text-[10px] font-medium text-text-muted">آدرس ارسال:</span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">
                    {order.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Order Item Row ─── */

function OrderItemRow({ item }: { item: OrderItemData }) {
  const unitPrice = Number(item.unitPrice);
  const totalPrice = Number(item.totalPrice);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-secondary/40 p-2.5">
      {/* Icon placeholder */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
        <ShoppingBag className="h-4 w-4 text-text-muted/50" aria-hidden="true" />
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-[11px] font-medium text-text-primary" dir="ltr">
          {item.productId.slice(0, 8)}...
        </span>
        <span className="text-[10px] text-text-muted">
          {item.quantity} عدد × {unitPrice.toLocaleString("fa-IR")} تومان
        </span>
      </div>

      {/* Total price */}
      <span className="shrink-0 text-xs font-bold text-text-primary tabular-nums">
        {totalPrice.toLocaleString("fa-IR")}
      </span>
    </div>
  );
}

/* ─── Skeleton ─── */

function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-20 animate-pulse rounded-lg bg-surface-secondary" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-16 animate-pulse rounded-lg bg-surface-secondary" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-secondary" />
      ))}
    </div>
  );
}
