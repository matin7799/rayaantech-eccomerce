"use client";

import * as React from "react";
import { z } from "zod";
// کامپوننت‌های پایه ثبت شده در رجیستری کامپوننت‌های پروژه شما
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { stripNonDigits, toPersianDigits } from "../../lib/persian-numerals";

/**
 * زاد اسکیمای اعتبارسنجی قیمت (پذیرش اعداد صحیح مثبت)
 */
const priceSchema = z.number().int().min(0);

/**
 * فرمت‌دهی محلی به همراه جداکننده سه رقمی فارسی
 */
function formatPrice(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("fa-IR", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(value);
}

interface PriceInputProps {
  /** مقدار عددی به تومان یا ریال */
  value: number;
  /** کال‌بک خروجی با عدد معتبر سنجیده شده */
  onChange: (value: number) => void;
  /** متن لیبل بالای اینپوت */
  label?: string;
  /** واحد پولی یکپارچه شده با پسوند ورودی */
  suffix?: string;
  /** متن جایگزین پیش‌فرض */
  placeholder?: string;
  /** متن خطای ارسالی از فرم لایه کنترل */
  error?: string;
  /** توضیحات تکمیلی زیر فیلد */
  description?: string;
  /** وضعیت غیرفعال بودن فیلد */
  disabled?: boolean;
  /** کلاس کمکی استایل‌دهی والد */
  className?: string;
}

export function PriceInput({
  value,
  onChange,
  label,
  suffix = "تومان",
  placeholder = "مبلغ",
  error,
  description,
  disabled = false,
  className,
}: PriceInputProps) {
  const id = React.useId();
  const [displayValue, setDisplayValue] = React.useState(() => formatPrice(value));

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digitsOnly = stripNonDigits(raw);

      if (digitsOnly === "") {
        setDisplayValue("");
        onChange(0);
        return;
      }

      const parsed = parseInt(digitsOnly, 10) || 0;
      const result = priceSchema.safeParse(parsed);

      if (!result.success) return;

      const validated = result.data;
      setDisplayValue(formatPrice(validated));
      onChange(validated);
    },
    [onChange],
  );

  // همگام‌سازی کامپوننت در صورت تغییر اکسترنال استیت والد
  const prevValueRef = React.useRef(value);
  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      const synced = formatPrice(value);
      if (synced !== displayValue) {
        setDisplayValue(synced);
      }
    }
  }, [value, displayValue]);

  const hasError = !!error;

  return (
    <FieldGroup className={cn("w-full max-w-sm", className)} dir="rtl">
      <Field>
        {label && (
          <FieldLabel htmlFor={id} className="text-[11px] font-medium text-text-secondary">
            {label}
          </FieldLabel>
        )}

        <InputGroup
          className={cn(
            "h-10 border bg-surface-secondary transition-all duration-200 border-[--glass-border] rounded-lg",
            "focus-within:ring-1 focus-within:ring-accent focus-within:border-accent",
            hasError && "border-danger ring-1 ring-danger/30",
            disabled && "pointer-events-none opacity-50",
          )}
          dir="rtl"
        >
          {/* بخش ورود عدد: تنظیم متد جهت‌دهی چپ به راست (ltr) برای حفظ موقعیت صحیح مکان‌نما (Cursor) هنگام تایپ رقم */}
          <InputGroupInput
            id={id}
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={displayValue}
            onChange={handleChange}
            placeholder={toPersianDigits(placeholder)}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className="text-start font-medium text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none"
          />

          {/* پسوند یکپارچه نمایش واحد پولی اتمیک کامپوننت */}
          {suffix && (
            <InputGroupAddon
              align="inline-end"
              className="border-s border-[--glass-border] bg-surface-secondary/50 px-3 shrink-0"
            >
              <InputGroupText className="text-[11px] font-medium text-text-muted">
                {suffix}
              </InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* بخش نمایش متون کمکی و پیام‌های خطا به صورت ارگانیک */}
        {hasError ? (
          <p id={`${id}-error`} className="text-[10px] font-medium text-danger mt-1" role="alert">
            {error}
          </p>
        ) : (
          description && <FieldDescription>{description}</FieldDescription>
        )}
      </Field>
    </FieldGroup>
  );
}
