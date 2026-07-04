import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, PlusIcon, TrashIcon, TruckIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/shipping")({
  component: ShippingMethodsPage,
});

/**
 * Shipping Methods Manager
 *
 * Manages the shipping_methods table:
 * - List all methods (active + inactive)
 * - Create / edit methods (name, code, base cost, ETA, flags)
 * - Toggle active / cargo-collect
 * - Delete methods
 */

const methodSchema = z.object({
  nameFa: z.string().min(2, "نام حداقل ۲ کاراکتر"),
  code: z
    .string()
    .min(2, "کد حداقل ۲ کاراکتر")
    .regex(/^[a-z0-9_]+$/, "فقط حروف کوچک انگلیسی، عدد و زیرخط"),
  baseCost: z.number({ invalid_type_error: "هزینه الزامی" }).int().min(0, "هزینه نامعتبر"),
  estimatedDays: z.string().max(100).optional(),
  isActive: z.boolean(),
  isCargoCollect: z.boolean(),
});

type MethodFormData = z.infer<typeof methodSchema>;

interface ShippingMethod {
  id: string;
  nameFa: string;
  code: string;
  baseCost: number;
  estimatedDays: string | null;
  isActive: boolean;
  isCargoCollect: boolean;
  sortOrder: number;
  createdAt: string;
}

function ShippingMethodsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ShippingMethod | null>(null);

  const methodsQuery = trpc.admin.listShippingMethods.useQuery();
  const methods = (methodsQuery.data?.methods ?? []) as ShippingMethod[];

  const deleteMutation = trpc.admin.deleteShippingMethod.useMutation({
    onSuccess: () => {
      toast.success("روش ارسال حذف شد");
      methodsQuery.refetch();
    },
    onError: () => toast.error("خطا در حذف روش ارسال"),
  });

  if (methodsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">روش‌های ارسال</h1>
          <p className="text-sm text-text-muted">
            مدیریت روش‌های ارسال، هزینه پایه، زمان تحویل و وضعیت پس‌کرایه
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <PlusIcon className="h-4 w-4" />
          روش جدید
        </Button>
      </div>

      {/* Methods list */}
      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <TruckIcon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">{method.nameFa}</span>
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${
                      method.isActive
                        ? "bg-success/15 text-success"
                        : "bg-surface-secondary text-text-muted"
                    }`}
                  >
                    {method.isActive ? "فعال" : "غیرفعال"}
                  </span>
                  {method.isCargoCollect && (
                    <span className="inline-flex rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-medium text-warning">
                      پس‌کرایه
                    </span>
                  )}
                </div>
                <span className="font-mono text-[11px] text-text-muted" dir="ltr">
                  {method.code}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-0.5 text-end">
                <span className="text-[11px] text-text-muted">هزینه پایه</span>
                <span className="text-sm font-medium text-text-primary">
                  {method.baseCost.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-end">
                <span className="text-[11px] text-text-muted">زمان تحویل</span>
                <span className="text-sm font-medium text-text-primary">
                  {method.estimatedDays || "—"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(method);
                    setShowForm(true);
                  }}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-accent"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`حذف روش ارسال «${method.nameFa}»؟`)) {
                      deleteMutation.mutate({ id: method.id });
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {methods.length === 0 && (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <span className="text-sm">روش ارسالی تعریف نشده</span>
          </div>
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <MethodFormModal
            method={editing}
            onClose={() => setShowForm(false)}
            onSuccess={() => methodsQuery.refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MethodFormModal({
  method,
  onClose,
  onSuccess,
}: {
  method: ShippingMethod | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!method;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MethodFormData>({
    resolver: zodResolver(methodSchema),
    defaultValues: method
      ? {
          nameFa: method.nameFa,
          code: method.code,
          baseCost: method.baseCost,
          estimatedDays: method.estimatedDays ?? "",
          isActive: method.isActive,
          isCargoCollect: method.isCargoCollect,
        }
      : {
          nameFa: "",
          code: "",
          baseCost: 0,
          estimatedDays: "",
          isActive: true,
          isCargoCollect: false,
        },
  });

  const createMutation = trpc.admin.createShippingMethod.useMutation({
    onSuccess: () => {
      toast.success("روش ارسال ایجاد شد");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message || "خطا در ایجاد روش ارسال"),
  });

  const updateMutation = trpc.admin.updateShippingMethod.useMutation({
    onSuccess: () => {
      toast.success("روش ارسال بروزرسانی شد");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message || "خطا در بروزرسانی"),
  });

  const onSubmit = useCallback(
    (data: MethodFormData) => {
      const payload = {
        ...data,
        estimatedDays: data.estimatedDays?.trim() ? data.estimatedDays.trim() : undefined,
      };
      if (isEdit && method) {
        updateMutation.mutate({ id: method.id, ...payload });
      } else {
        createMutation.mutate(payload);
      }
    },
    [isEdit, method, createMutation, updateMutation],
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

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
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            {isEdit ? "ویرایش روش ارسال" : "روش ارسال جدید"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">نام نمایشی</label>
            <input {...register("nameFa")} className="form-input" placeholder="مثلاً: پست پیشتاز" />
            {errors.nameFa && (
              <span className="text-[11px] text-danger">{errors.nameFa.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">کد (انگلیسی)</label>
              <input
                {...register("code")}
                className="form-input"
                dir="ltr"
                placeholder="express_post"
              />
              {errors.code && (
                <span className="text-[11px] text-danger">{errors.code.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">هزینه پایه (تومان)</label>
              <input
                type="number"
                {...register("baseCost", { valueAsNumber: true })}
                className="form-input"
                dir="ltr"
                placeholder="50000"
              />
              {errors.baseCost && (
                <span className="text-[11px] text-danger">{errors.baseCost.message}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              زمان تحویل تخمینی (اختیاری)
            </label>
            <input
              {...register("estimatedDays")}
              className="form-input"
              placeholder="۳ تا ۵ روز کاری"
            />
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              روش فعال باشد (در تسویه‌حساب نمایش داده شود)
            </label>
            <label className="flex items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                {...register("isCargoCollect")}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              پس‌کرایه (هزینه ارسال هنگام تحویل پرداخت می‌شود)
            </label>
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "ذخیره..." : isEdit ? "بروزرسانی" : "ایجاد روش"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
