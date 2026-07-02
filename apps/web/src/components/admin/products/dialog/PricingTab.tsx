import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../../ui/field";
import { Input } from "../../../ui/input";
import type { ProductFormData } from "./schema";

export interface PricingTabProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
}

export function PricingTab({ register, errors, watch }: PricingTabProps) {
  const basePrice = watch("basePrice");
  const wholesalePrice = watch("wholesalePrice");
  const torobPrice = watch("torobPrice");

  // Helper to format currency preview in Persian
  const formatCurrencyText = (value?: number | null) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "";
    return `${value.toLocaleString("fa-IR")} تومان`;
  };

  return (
    <div className="flex flex-col gap-6 p-2" dir="rtl">
      <div className="rounded-xl border border-border bg-surface-secondary/20 p-4">
        <h4 className="text-xs font-bold text-accent mb-1">هاب ایزوله‌سازی و قیمت‌گذاری پویا</h4>
        <p className="text-[11px] text-text-muted leading-relaxed">
          قیمت‌های درج شده در این بخش مستقیماً در خروجی محاسبات سبد خرید، پنل همکاران و خزنده ترب
          اعمال می‌شوند. تمام مبالغ را به **تومان** وارد کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* General Price */}
        <Field data-invalid={!!errors.basePrice}>
          <FieldLabel>قیمت عمومی (تومان)</FieldLabel>
          <div className="relative flex items-center w-full">
            <Input
              type="number"
              {...register("basePrice", { valueAsNumber: true })}
              placeholder="مثال: ۱۵۰۰۰۰۰"
              className="pl-12"
              dir="ltr"
            />
            <span className="absolute left-3 text-xs text-text-muted pointer-events-none">
              تومان
            </span>
          </div>
          {basePrice > 0 && (
            <FieldDescription>پیش‌نمایش: {formatCurrencyText(basePrice)}</FieldDescription>
          )}
          <FieldError>{errors.basePrice?.message}</FieldError>
        </Field>

        {/* Wholesale Price */}
        <Field data-invalid={!!errors.wholesalePrice}>
          <FieldLabel>قیمت همکار / عمده‌فروشی (تومان)</FieldLabel>
          <div className="relative flex items-center w-full">
            <Input
              type="number"
              {...register("wholesalePrice", { valueAsNumber: true })}
              placeholder="اختیاری - مثال: ۱۳۵۰۰۰۰"
              className="pl-12"
              dir="ltr"
            />
            <span className="absolute left-3 text-xs text-text-muted pointer-events-none">
              تومان
            </span>
          </div>
          {wholesalePrice ? (
            <FieldDescription>پیش‌نمایش: {formatCurrencyText(wholesalePrice)}</FieldDescription>
          ) : (
            <FieldDescription>
              عدم مقداردهی به معنای استفاده از قیمت عمومی در پنل همکار است.
            </FieldDescription>
          )}
          <FieldError>{errors.wholesalePrice?.message}</FieldError>
        </Field>

        {/* Torob Price */}
        <Field data-invalid={!!errors.torobPrice}>
          <FieldLabel>قیمت ویژه ترب (تومان)</FieldLabel>
          <div className="relative flex items-center w-full">
            <Input
              type="number"
              {...register("torobPrice", { valueAsNumber: true })}
              placeholder="اختیاری - مثال: ۱۴۰۰۰۰"
              className="pl-12"
              dir="ltr"
            />
            <span className="absolute left-3 text-xs text-text-muted pointer-events-none">
              تومان
            </span>
          </div>
          {torobPrice ? (
            <FieldDescription>پیش‌نمایش: {formatCurrencyText(torobPrice)}</FieldDescription>
          ) : (
            <FieldDescription>
              قیمت پایه جهت مقایسه در خزنده‌های موتورهای جستجو نظیر ترب.
            </FieldDescription>
          )}
          <FieldError>{errors.torobPrice?.message}</FieldError>
        </Field>
      </div>
    </div>
  );
}
