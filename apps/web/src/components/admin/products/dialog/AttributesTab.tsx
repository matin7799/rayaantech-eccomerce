import { CheckIcon, InfoIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { trpc } from "../../../../lib/trpc";
import type { ProductFormData } from "./schema";

export interface AttributesTabProps {
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export function AttributesTab({ watch, setValue }: AttributesTabProps) {
  const primaryCategoryId = watch("primaryCategoryId");
  const attributeValueIds = watch("attributeValueIds") || [];

  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});
  const [addingKeys, setAddingKeys] = useState<Record<string, boolean>>({});

  const utils = trpc.useUtils();

  // Fetch available filter facets (attributes list) for the active category
  const facetsQuery = trpc.products.facets.useQuery(
    { categoryId: primaryCategoryId || undefined },
    { enabled: !!primaryCategoryId },
  );

  const attributes = facetsQuery.data?.attributes || [];

  // Mutations
  const createValMutation = trpc.admin.createAttributeValue.useMutation();
  const deleteKeyMutation = trpc.admin.deleteAttributeKey.useMutation();

  const handleToggleValue = (keyId: string, valueId: string) => {
    const keyAttr = attributes.find((a) => a.keyId === keyId);
    if (!keyAttr) return;

    const allValueIdsForKey = keyAttr.values.map((v) => v.id);
    const filteredIds = attributeValueIds.filter((id) => !allValueIdsForKey.includes(id));

    const isAlreadySelected = attributeValueIds.includes(valueId);
    const nextIds = isAlreadySelected ? filteredIds : [...filteredIds, valueId];

    setValue("attributeValueIds", nextIds, { shouldDirty: true });
  };

  const handleClearKey = (keyId: string) => {
    const keyAttr = attributes.find((a) => a.keyId === keyId);
    if (!keyAttr) return;

    const allValueIdsForKey = keyAttr.values.map((v) => v.id);
    const nextIds = attributeValueIds.filter((id) => !allValueIdsForKey.includes(id));

    setValue("attributeValueIds", nextIds, { shouldDirty: true });
  };

  const handleNewValueChange = (keyId: string, value: string) => {
    setNewValueInputs((prev) => ({ ...prev, [keyId]: value }));
  };

  const handleAddNewValue = async (keyId: string) => {
    const valueText = newValueInputs[keyId]?.trim();
    if (!valueText) return;

    setAddingKeys((prev) => ({ ...prev, [keyId]: true }));
    try {
      const res = await createValMutation.mutateAsync({ keyId, value: valueText });
      if (res.success && res.valueId) {
        // Automatically select the new value in the form
        const keyAttr = attributes.find((a) => a.keyId === keyId);
        const allValueIdsForKey = keyAttr ? keyAttr.values.map((v) => v.id) : [];
        const filteredIds = attributeValueIds.filter((id) => !allValueIdsForKey.includes(id));
        setValue("attributeValueIds", [...filteredIds, res.valueId], { shouldDirty: true });

        // Clear input
        setNewValueInputs((prev) => ({ ...prev, [keyId]: "" }));
        toast.success("مقدار جدید افزوده و انتخاب شد");

        // Invalidate facets to reload options list
        facetsQuery.refetch();
      }
    } catch (err: any) {
      toast.error(`خطا در افزودن مقدار: ${err.message || "خطای سرور"}`);
    } finally {
      setAddingKeys((prev) => ({ ...prev, [keyId]: false }));
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (
      !confirm(
        "آیا از حذف کامل این ویژگی و تمام مقادیر آن از پایگاه داده اطمینان دارید؟ این عمل بر تمام محصولات متصل تاثیر می‌گذارد.",
      )
    ) {
      return;
    }

    try {
      await deleteKeyMutation.mutateAsync({ keyId });
      toast.success("ویژگی با موفقیت حذف شد");

      // Clear associated selections
      const keyAttr = attributes.find((a) => a.keyId === keyId);
      if (keyAttr) {
        const allValueIdsForKey = keyAttr.values.map((v) => v.id);
        const nextIds = attributeValueIds.filter((id) => !allValueIdsForKey.includes(id));
        setValue("attributeValueIds", nextIds, { shouldDirty: true });
      }

      facetsQuery.refetch();
    } catch (err: any) {
      toast.error(`خطا در حذف ویژگی: ${err.message || "خطای سرور"}`);
    }
  };

  if (!primaryCategoryId) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-2xl bg-surface/30 min-h-[200px]"
        dir="rtl"
      >
        <InfoIcon className="h-8 w-8 text-text-muted mb-2" />
        <span className="text-sm font-semibold text-text-primary">
          دسته‌بندی اصلی محصول انتخاب نشده است
        </span>
        <span className="text-xs text-text-muted mt-1">
          برای مقداردهی به ویژگی‌های فنی، ابتدا در بخش «انبار و طبقه‌بندی» یک دسته‌بندی انتخاب کنید.
        </span>
      </div>
    );
  }

  if (facetsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 bg-surface-secondary" />
            <div className="flex gap-2 mt-1">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-8 w-16 rounded-full bg-surface-secondary" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (attributes.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-2xl bg-surface/30 min-h-[200px]"
        dir="rtl"
      >
        <InfoIcon className="h-8 w-8 text-text-muted mb-2" />
        <span className="text-sm font-semibold text-text-primary">
          هیچ ویژگی فنی برای این دسته‌بندی ثبت نشده است
        </span>
        <span className="text-xs text-text-muted mt-1">
          این دسته‌بندی در حال حاضر فاقد مشخصات فنی EAV در پایگاه داده است.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-2" dir="rtl">
      <div className="rounded-xl border border-border bg-surface-secondary/20 p-4">
        <h4 className="text-xs font-bold text-accent mb-1">ویژگی‌های فنی محصول (EAV Specs)</h4>
        <p className="text-[11px] text-text-muted leading-relaxed">
          ویژگی‌های فنی مرتبط با دسته‌بندی را مشخص کنید. این مقادیر جهت فیلتر هوشمند در بخش فروشگاه و
          مقایسه در صفحات محصول استفاده می‌شوند.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {attributes.map((attr) => {
          const allValueIdsForKey = attr.values.map((v) => v.id);
          const hasSelectedValue = attributeValueIds.some((id) => allValueIdsForKey.includes(id));

          return (
            <div
              key={attr.keyId}
              className="flex flex-col gap-3 border-b border-border/20 pb-5 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-secondary">{attr.keyName}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteKey(attr.keyId)}
                    className="text-text-muted hover:text-danger p-1 rounded-md hover:bg-surface-secondary/55 transition-colors cursor-pointer"
                    title="حذف کامل این ویژگی از پایگاه داده"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>

                {hasSelectedValue && (
                  <button
                    type="button"
                    onClick={() => handleClearKey(attr.keyId)}
                    className="text-[10px] text-accent hover:underline cursor-pointer"
                  >
                    پاک کردن انتخاب
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {attr.values.map((val) => {
                  const isSelected = attributeValueIds.includes(val.id);
                  return (
                    <button
                      key={val.id}
                      type="button"
                      onClick={() => handleToggleValue(attr.keyId, val.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-accent/15 text-accent border border-accent/40"
                          : "bg-surface-secondary text-text-muted border border-transparent hover:text-text-secondary"
                      }`}
                    >
                      <span>{val.value}</span>
                      {isSelected && <CheckIcon className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>

              {/* Inline input to add a new value option */}
              <div className="flex items-center gap-2 mt-2 max-w-xs">
                <Input
                  type="text"
                  placeholder="افزودن مقدار جدید..."
                  value={newValueInputs[attr.keyId] || ""}
                  onChange={(e) => handleNewValueChange(attr.keyId, e.target.value)}
                  className="h-7 text-xs rounded-lg bg-surface border-border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewValue(attr.keyId);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={addingKeys[attr.keyId] || !newValueInputs[attr.keyId]?.trim()}
                  onClick={() => handleAddNewValue(attr.keyId)}
                  className="h-7 text-[10px] px-3 bg-accent hover:bg-accent/90 text-white rounded-lg cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {addingKeys[attr.keyId] ? "..." : "افزودن"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
