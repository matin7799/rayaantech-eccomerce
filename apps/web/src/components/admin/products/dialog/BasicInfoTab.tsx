import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../../ui/field";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import type { ProductFormData } from "./schema";

export interface BasicInfoTabProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  onNameChange?: (name: string) => void;
}

export function BasicInfoTab({ register, errors, onNameChange }: BasicInfoTabProps) {
  return (
    <div className="flex flex-col gap-5 p-2" dir="rtl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <Field data-invalid={!!errors.name}>
          <FieldLabel>نام محصول</FieldLabel>
          <Input
            {...register("name")}
            onChange={(e) => {
              register("name").onChange(e);
              if (onNameChange) {
                onNameChange(e.target.value);
              }
            }}
            placeholder="مثال: گوشی موبایل آیفون ۱۳ پرو"
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        {/* SKU */}
        <Field data-invalid={!!errors.sku}>
          <FieldLabel>شناسه محصول (SKU)</FieldLabel>
          <Input {...register("sku")} placeholder="مثال: IP13P-256-SL" dir="ltr" />
          <FieldError>{errors.sku?.message}</FieldError>
        </Field>
      </div>

      {/* Slug */}
      <Field data-invalid={!!errors.slug}>
        <FieldLabel>اسلاگ (Slug - آدرس وب)</FieldLabel>
        <Input {...register("slug")} placeholder="مثال: iphone-13-pro-max" dir="ltr" />
        <FieldDescription>
          اسلاگ آدرس منحصر به فرد این محصول در وبسایت است که به صورت خودکار از نام تولید می‌شود.
        </FieldDescription>
        <FieldError>{errors.slug?.message}</FieldError>
      </Field>

      {/* Short Description */}
      <Field data-invalid={!!errors.shortDescription}>
        <FieldLabel>توضیح کوتاه</FieldLabel>
        <Input
          {...register("shortDescription")}
          placeholder="یک خط توضیح بسیار کوتاه و خلاصه جهت نمایش در کارت محصول..."
        />
        <FieldError>{errors.shortDescription?.message}</FieldError>
      </Field>

      {/* Description */}
      <Field data-invalid={!!errors.description}>
        <FieldLabel>توضیحات کامل محصول</FieldLabel>
        <Textarea
          {...register("description")}
          placeholder="توضیحات کامل فنی، نقد و بررسی و نکات کلیدی محصول..."
          rows={5}
          className="min-h-[120px]"
        />
        <FieldError>{errors.description?.message}</FieldError>
      </Field>
    </div>
  );
}
