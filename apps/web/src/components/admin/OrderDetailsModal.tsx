import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import type { OrderRow } from "./OrdersColumns";

interface OrderDetailsModalProps {
  order: OrderRow | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-glass max-h-[90vh] overflow-y-auto flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-text-primary">
                  جزئیات سفارش #{order.id.slice(0, 8)}
                </h2>
                <p className="text-xs text-text-muted">
                  ثبت شده در {new Date(order.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-surface-secondary px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>

            {/* Aligned Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column A: Logistics Gate */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-secondary/20 p-4">
                <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">
                  اطلاعات مشتری و ارسال (لجستیک)
                </h3>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">مشتری:</span>
                    <span className="font-medium text-text-primary">{order.customerName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-muted">استان / شهر:</span>
                    <span className="font-medium text-text-primary">
                      {order.shippingAddress?.state ?? "نامشخص"}،{" "}
                      {order.shippingAddress?.city ?? "نامشخص"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-text-muted shrink-0">آدرس دقیق:</span>
                    <span className="font-medium text-text-primary text-end">
                      {order.shippingAddress?.fullAddress ?? "نامشخص"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">کد پستی:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-text-primary select-all">
                        {order.shippingAddress?.postalCode ?? "نامشخص"}
                      </span>
                      {order.shippingAddress?.postalCode && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(order.shippingAddress?.postalCode ?? "");
                            toast.success("کد پستی کپی شد");
                          }}
                          className="text-[10px] text-accent hover:underline cursor-pointer bg-transparent border-0 p-0 font-medium"
                        >
                          کپی
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-muted">گیرنده:</span>
                    <span className="font-medium text-text-primary">
                      {order.shippingAddress?.receiverName ?? "نامشخص"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-muted">موبایل گیرنده:</span>
                    <span className="font-medium text-text-primary" dir="ltr">
                      {order.shippingAddress?.mobile ?? "نامشخص"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Column B: Acquisitions Matrix */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-secondary/20 p-4">
                <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">
                  اقلام خریداری شده (آکوزیشن)
                </h3>

                <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px]">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-center border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
                      >
                        {/* Image Thumbnail Placeholder */}
                        <div className="h-12 w-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-muted/40 shrink-0 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productTitle}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ShoppingCartIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {item.productTitle}
                          </span>
                          {item.variantSku && (
                            <span className="text-[10px] text-text-muted">
                              SKU: {item.variantSku}
                            </span>
                          )}
                          <span className="text-[10px] text-text-muted">
                            {item.quantity} عدد × {item.unitPrice.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-text-primary shrink-0">
                          {item.totalPrice.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted text-center py-4">
                      کالایی در این سفارش ثبت نشده است.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Installment Plan Details (If applicable) */}
            {order.hasInstallment && (
              <div
                className="flex flex-col gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4"
                dir="rtl"
              >
                <h3 className="text-sm font-semibold text-accent border-b border-accent/10 pb-2">
                  اطلاعات قرارداد اقساطی
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted">مبلغ کل سفارش:</span>
                    <span className="font-semibold text-text-primary">
                      {order.installmentDetails
                        ? order.installmentDetails.totalAmount.toLocaleString("fa-IR")
                        : (order.totalAmount ?? 0).toLocaleString("fa-IR")}{" "}
                      تومان
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted">مبلغ پیش‌پرداخت:</span>
                    <span className="font-semibold text-text-primary">
                      {order.installmentDetails
                        ? order.installmentDetails.downPaymentAmount.toLocaleString("fa-IR")
                        : Math.round((order.totalAmount ?? 0) * 0.4).toLocaleString("fa-IR")}{" "}
                      تومان
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted">مدت قرارداد (اقساط):</span>
                    <span className="font-semibold text-text-primary">
                      {order.installmentDetails
                        ? `${order.installmentDetails.tenureMonths.toLocaleString("fa-IR")} قسط ماهانه`
                        : "۳ قسط ماهانه"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted">مبلغ هر قسط:</span>
                    <span className="font-semibold text-accent">
                      {order.installmentDetails
                        ? order.installmentDetails.monthlyAmount.toLocaleString("fa-IR")
                        : Math.round(((order.totalAmount ?? 0) * 0.6) / 3).toLocaleString(
                            "fa-IR",
                          )}{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Section */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-secondary/20 p-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">
                سوابق تراکنش‌ها
              </h3>
              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-secondary/30">
                      <th className="px-3 py-2 text-start font-medium text-text-secondary">
                        شناسه تراکنش
                      </th>
                      <th className="px-3 py-2 text-start font-medium text-text-secondary">
                        روش پرداخت
                      </th>
                      <th className="px-3 py-2 text-start font-medium text-text-secondary">مبلغ</th>
                      <th className="px-3 py-2 text-start font-medium text-text-secondary">
                        کد پیگیری مرجع
                      </th>
                      <th className="px-3 py-2 text-start font-medium text-text-secondary">
                        وضعیت
                      </th>
                      <th className="px-3 py-2 text-start font-medium text-text-secondary">
                        تاریخ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payments && order.payments.length > 0 ? (
                      order.payments.map((p, idx) => (
                        <tr key={idx} className="border-b border-border bg-surface last:border-b-0">
                          <td className="px-3 py-2 text-text-primary font-mono">
                            {p.id.slice(0, 8)}
                          </td>
                          <td className="px-3 py-2 text-text-secondary">
                            {p.method === "zarinpal"
                              ? "زرین‌پال"
                              : p.method === "digipay_credit"
                                ? "دیجی‌پی"
                                : "اقساط ویژه"}
                          </td>
                          <td className="px-3 py-2 text-text-primary font-semibold">
                            {p.amount.toLocaleString("fa-IR")} تومان
                          </td>
                          <td className="px-3 py-2 text-text-muted font-mono">
                            {p.paymentRefId ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                p.status === "completed"
                                  ? "bg-success/15 text-success"
                                  : p.status === "failed"
                                    ? "bg-destructive/15 text-destructive"
                                    : "bg-warning/15 text-warning"
                              }`}
                            >
                              {p.status === "completed"
                                ? "موفق"
                                : p.status === "failed"
                                  ? "ناموفق"
                                  : "در انتظار"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-text-muted">
                            {new Date(p.createdAt).toLocaleDateString("fa-IR")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-center text-text-muted">
                          تراکنشی یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
