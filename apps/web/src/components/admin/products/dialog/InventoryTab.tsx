import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { Switch } from "#/components/ui/switch";
import type { ProductFormData } from "./schema";

export interface InventoryTabProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  categories: { id: string; name: string; slug: string }[];
}

export function InventoryTab({ register, errors, watch, setValue, categories }: InventoryTabProps) {
  const primaryCategoryId = watch("primaryCategoryId");
  const isActive = watch("isActive");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCategoryName =
    categories.find((c) => c.id === primaryCategoryId)?.name || "انتخاب دسته‌بندی...";

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 p-2" dir="rtl">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Stock Level */}
        <Field data-invalid={!!errors.stock}>
          <FieldLabel>موجودی انبار (تعداد)</FieldLabel>
          <Input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="مثال: ۱۰"
            dir="ltr"
          />
          <FieldError>{errors.stock?.message}</FieldError>
        </Field>

        {/* Grade */}
        <Field data-invalid={!!errors.grade}>
          <FieldLabel>گرید کیفیت محصول</FieldLabel>
          <select
            {...register("grade")}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-hidden transition-colors disabled:opacity-50 dark:bg-input/30 h-8"
          >
            <option value="stock">استوک (Stock)</option>
            <option value="open_box">اوپن باکس (Open Box)</option>
            <option value="refurbished">ریفربیش (Refurbished)</option>
            <option value="like_new">در حد نو (Like New)</option>
            <option value="used">کارکرده (Used)</option>
          </select>
          <FieldError>{errors.grade?.message}</FieldError>
        </Field>

        {/* Category Combobox */}
        <Field data-invalid={!!errors.primaryCategoryId}>
          <FieldLabel>دسته‌بندی اصلی</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-between rounded-lg px-2.5 h-8 text-right font-normal text-sm bg-transparent border-input hover:bg-surface-secondary/20 cursor-pointer"
                >
                  <span className="truncate">{selectedCategoryName}</span>
                  <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-text-muted" />
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent className="w-[300px] p-2 bg-surface border border-border rounded-xl shadow-md z-50">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی دسته‌بندی..."
                className="w-full mb-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs focus:border-accent focus:outline-hidden"
                dir="rtl"
              />
              <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                {filteredCategories.length === 0 ? (
                  <span className="text-xs text-text-muted p-2 text-center block">
                    دسته‌بندی یافت نشد
                  </span>
                ) : (
                  filteredCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setValue("primaryCategoryId", c.id, { shouldDirty: true });
                        setOpen(false);
                      }}
                      className="flex items-center justify-between w-full text-right px-3 py-2 text-xs rounded-lg hover:bg-surface-secondary/40 text-text-primary transition-colors cursor-pointer"
                    >
                      <span>{c.name}</span>
                      {primaryCategoryId === c.id && <CheckIcon className="h-3 w-3 text-accent" />}
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          <FieldError>{errors.primaryCategoryId?.message}</FieldError>
        </Field>

        {/* Active Status Switch */}
        <Field>
          <FieldLabel>وضعیت محصول در سایت</FieldLabel>
          <div className="flex items-center gap-3 h-8">
            <Switch
              dir="rtl"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked, { shouldDirty: true })}
            />
            <span className="text-xs text-text-primary">
              {isActive ? "محصول فعال و قابل خرید است" : "محصول غیرفعال و مخفی است"}
            </span>
          </div>
        </Field>
      </div>
    </div>
  );
}
