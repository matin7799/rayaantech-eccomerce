import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  ReceiptIcon,
  ShieldAlertIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/installments")({
  component: InstallmentConfigPage,
});

/**
 * Installment Config Manager
 *
 * Manages installment_rules table:
 * - List all rules (term_months, fee, downpayment, thresholds)
 * - Create new rules
 * - Edit existing rules
 * - Toggle active/inactive
 */

const ruleSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر"),
  termMonths: z.number().int().min(1, "حداقل ۱ ماه").max(60),
  feePercentage: z.string().min(1, "کارمزد الزامی"),
  defaultDownpaymentPercent: z.string().min(1, "پیش‌پرداخت الزامی"),
  guarantorThreshold: z.string().min(1, "آستانه ضامن الزامی"),
  hardCeiling: z.string().min(1, "سقف مطلق الزامی"),
  isActive: z.boolean(),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface InstallmentRule {
  id: string;
  name: string;
  termMonths: number;
  feePercentage: string;
  defaultDownpaymentPercent: string;
  guarantorThreshold: string;
  hardCeiling: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function InstallmentConfigPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<InstallmentRule | null>(null);

  const rulesQuery = trpc.admin.listInstallmentRules.useQuery();
  const rules = (rulesQuery.data?.rules ?? []) as InstallmentRule[];

  if (rulesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">تنظیمات اقساط</h1>
          <p className="text-sm text-text-muted">
            مدیریت قوانین اقساط، کارمزد، پیش‌پرداخت و سقف تسهیلات
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
          }}
        >
          <PlusIcon className="h-4 w-4" />
          قانون جدید
        </Button>
      </div>

      {/* Rules List */}
      <div className="flex flex-col gap-3">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onEdit={() => {
              setEditingRule(rule);
              setShowForm(true);
            }}
          />
        ))}
        {rules.length === 0 && (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <span className="text-sm">قانون اقساطی تعریف نشده</span>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <RuleFormModal
            rule={editingRule}
            onClose={() => setShowForm(false)}
            onSuccess={() => rulesQuery.refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-normal text-text-muted">{label}</span>
      <span className="text-xs font-medium text-text-primary">{value}</span>
    </div>
  );
}

function RuleFormModal({
  rule,
  onClose,
  onSuccess,
}: {
  rule: InstallmentRule | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!rule;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: rule
      ? {
          name: rule.name,
          termMonths: rule.termMonths,
          feePercentage: rule.feePercentage,
          defaultDownpaymentPercent: rule.defaultDownpaymentPercent,
          guarantorThreshold: rule.guarantorThreshold,
          hardCeiling: rule.hardCeiling,
          isActive: rule.isActive,
        }
      : {
          name: "",
          termMonths: 3,
          feePercentage: "8.00",
          defaultDownpaymentPercent: "40.00",
          guarantorThreshold: "500000000",
          hardCeiling: "1000000000",
          isActive: true,
        },
  });

  const createMutation = trpc.admin.createInstallmentRule.useMutation({
    onSuccess: () => {
      toast.success("قانون اقساط ایجاد شد");
      onSuccess();
      onClose();
    },
    onError: () => toast.error("خطا در ایجاد قانون"),
  });

  const updateMutation = trpc.admin.updateInstallmentRule.useMutation({
    onSuccess: () => {
      toast.success("قانون اقساط بروزرسانی شد");
      onSuccess();
      onClose();
    },
    onError: () => toast.error("خطا در بروزرسانی"),
  });

  const onSubmit = useCallback(
    (data: RuleFormData) => {
      if (isEdit && rule) {
        updateMutation.mutate({ id: rule.id, ...data });
      } else {
        createMutation.mutate(data);
      }
    },
    [isEdit, rule, createMutation, updateMutation],
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
            {isEdit ? "ویرایش قانون اقساط" : "قانون جدید"}
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
            <label className="text-xs font-medium text-text-secondary">نام قانون</label>
            <input
              {...register("name")}
              className="form-input"
              placeholder="مثلاً: ۳ ماهه استاندارد"
            />
            {errors.name && <span className="text-[11px] text-danger">{errors.name.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">تعداد اقساط (ماه)</label>
              <input
                type="number"
                {...register("termMonths", { valueAsNumber: true })}
                className="form-input"
                dir="ltr"
              />
              {errors.termMonths && (
                <span className="text-[11px] text-danger">{errors.termMonths.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">کارمزد (٪)</label>
              <input
                {...register("feePercentage")}
                className="form-input"
                dir="ltr"
                placeholder="8.00"
              />
              {errors.feePercentage && (
                <span className="text-[11px] text-danger">{errors.feePercentage.message}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">پیش‌پرداخت پیش‌فرض (٪)</label>
            <input
              {...register("defaultDownpaymentPercent")}
              className="form-input"
              dir="ltr"
              placeholder="40.00"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">آستانه ضامن (تومان)</label>
              <input
                {...register("guarantorThreshold")}
                className="form-input"
                dir="ltr"
                placeholder="500000000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">سقف مطلق (تومان)</label>
              <input
                {...register("hardCeiling")}
                className="form-input"
                dir="ltr"
                placeholder="1000000000"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            قانون فعال باشد
          </label>
          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "ذخیره..." : isEdit ? "بروزرسانی" : "ایجاد قانون"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Rule Card with Overrides (Exceptions) ─── */

function RuleCard({ rule, onEdit }: { rule: InstallmentRule; onEdit: () => void }) {
  const [showOverrideForm, setShowOverrideForm] = useState(false);

  const overridesQuery = trpc.admin.listInstallmentOverrides.useQuery({ ruleId: rule.id });
  const overrides = overridesQuery.data?.overrides ?? [];

  const deleteMutation = trpc.admin.deleteInstallmentOverride.useMutation({
    onSuccess: () => {
      toast.success("استثنا حذف شد");
      overridesQuery.refetch();
    },
    onError: () => toast.error("خطا در حذف استثنا"),
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      {/* Rule header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <ReceiptIcon className="h-5 w-5 text-accent" />
          <div>
            <span className="text-sm font-semibold text-text-primary">{rule.name}</span>
            <span
              className={`ms-2 inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${rule.isActive ? "bg-success/15 text-success" : "bg-surface-secondary text-text-muted"}`}
            >
              {rule.isActive ? "فعال" : "غیرفعال"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-accent"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Rule stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-4">
        <InfoCell label="تعداد اقساط" value={`${rule.termMonths} ماهه`} />
        <InfoCell label="کارمزد" value={`${rule.feePercentage}٪`} />
        <InfoCell label="پیش‌پرداخت پیش‌فرض" value={`${rule.defaultDownpaymentPercent}٪`} />
        <InfoCell
          label="آستانه ضامن"
          value={`${Number(rule.guarantorThreshold).toLocaleString("fa-IR")} ﷼`}
        />
        <InfoCell
          label="سقف مطلق"
          value={`${Number(rule.hardCeiling).toLocaleString("fa-IR")} ﷼`}
        />
      </div>

      {/* Overrides (Exceptions) — Collapsible */}
      <Collapsible defaultOpen={false} className="rounded-xl border border-border">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2.5 text-start transition-colors hover:bg-surface-secondary/30">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-warning" />
            <span className="text-xs font-medium text-text-primary">
              استثناهای دسته‌بندی ({overrides.length.toLocaleString("fa-IR")})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-6 gap-1 text-[10px] px-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowOverrideForm(true);
              }}
            >
              <PlusIcon className="h-3 w-3" />
              استثنا جدید
            </Button>
            <ChevronDownIcon className="h-4 w-4 text-text-muted transition-transform duration-200 [[data-open]_&]:rotate-180" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border px-4 py-3">
            {overrides.length === 0 ? (
              <p className="text-center text-xs text-text-muted py-4">
                استثنایی تعریف نشده — قوانین پیش‌فرض برای همه دسته‌بندی‌ها اعمال می‌شود
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {overrides.map((ov) => (
                  <div
                    key={ov.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-secondary/20 px-3 py-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-text-primary">
                        {ov.categoryName}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-text-muted">
                        {ov.downpaymentPercentOverride && (
                          <span>پیش‌پرداخت: {ov.downpaymentPercentOverride}٪</span>
                        )}
                        {ov.feePercentageOverride && (
                          <span>کارمزد: {ov.feePercentageOverride}٪</span>
                        )}
                        {ov.minDownpaymentAmount && (
                          <span>
                            حداقل: {Number(ov.minDownpaymentAmount).toLocaleString("fa-IR")} ﷼
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate({ id: ov.id })}
                      className="rounded-lg p-1 text-text-muted hover:text-destructive"
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Override Form Modal */}
      <AnimatePresence>
        {showOverrideForm && (
          <OverrideFormModal
            ruleId={rule.id}
            onClose={() => setShowOverrideForm(false)}
            onSuccess={() => overridesQuery.refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Override Form Modal ─── */

function OverrideFormModal({
  ruleId,
  onClose,
  onSuccess,
}: {
  ruleId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [categoryId, setCategoryId] = useState("");
  const [downpayment, setDownpayment] = useState("");
  const [fee, setFee] = useState("");
  const [minAmount, setMinAmount] = useState("");

  const categoriesQuery = trpc.admin.listCategories.useQuery();
  const categories = categoriesQuery.data?.categories ?? [];

  const createMutation = trpc.admin.createInstallmentOverride.useMutation({
    onSuccess: () => {
      toast.success("استثنا ایجاد شد");
      onSuccess();
      onClose();
    },
    onError: () => toast.error("خطا در ایجاد استثنا"),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!categoryId) {
        toast.error("دسته‌بندی را انتخاب کنید");
        return;
      }
      createMutation.mutate({
        ruleId,
        categoryId,
        downpaymentPercentOverride: downpayment || undefined,
        feePercentageOverride: fee || undefined,
        minDownpaymentAmount: minAmount || undefined,
        isActive: true,
      });
    },
    [ruleId, categoryId, downpayment, fee, minAmount, createMutation],
  );

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
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">استثنای دسته‌بندی جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">دسته‌بندی</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-input"
            >
              <option value="">انتخاب کنید...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Override پیش‌پرداخت (٪) — خالی = پیش‌فرض
            </label>
            <input
              value={downpayment}
              onChange={(e) => setDownpayment(e.target.value)}
              className="form-input"
              dir="ltr"
              placeholder="50.00"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Override کارمزد (٪) — خالی = پیش‌فرض
            </label>
            <input
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="form-input"
              dir="ltr"
              placeholder="12.00"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              حداقل مبلغ پیش‌پرداخت (تومان) — خالی = بدون کف
            </label>
            <input
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="form-input"
              dir="ltr"
              placeholder="20000000"
            />
          </div>

          <Button type="submit" disabled={createMutation.isPending} className="mt-2">
            {createMutation.isPending ? "ذخیره..." : "ایجاد استثنا"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
