import { useCallback, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../lib/trpc";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface AddressEntry {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  isDefault: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

/**
 * AddressDialog — Centered modal for adding a new delivery address.
 *
 * Reuses the same tRPC `profile.updateAddresses` mutation pattern
 * from the profile AddressesTab. No layout shift or scroll leakage.
 */
export function AddressDialog({ open, onOpenChange, onSaved }: Props) {
  const addressesQuery = trpc.profile.getAddresses.useQuery();
  const updateMutation = trpc.profile.updateAddresses.useMutation();
  const addresses = addressesQuery.data?.addresses ?? [];

  const [form, setForm] = useState<AddressEntry>({
    id: crypto.randomUUID(),
    title: "",
    recipientName: "",
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    fullAddress: "",
    isDefault: addresses.length === 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = useCallback((key: keyof AddressEntry, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "عنوان الزامی";
    if (form.recipientName.trim().length < 3) errs.recipientName = "نام گیرنده الزامی";
    if (!/^09\d{9}$/.test(form.phone)) errs.phone = "شماره نامعتبر";
    if (!form.province.trim()) errs.province = "الزامی";
    if (!form.city.trim()) errs.city = "الزامی";
    if (!/^\d{10}$/.test(form.postalCode)) errs.postalCode = "۱۰ رقم";
    if (form.fullAddress.trim().length < 10) errs.fullAddress = "آدرس کامل‌تر";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      const existing = form.isDefault
        ? addresses.map((a) => ({ ...a, isDefault: false }))
        : [...addresses];

      try {
        await updateMutation.mutateAsync({ addresses: [...existing, form] });
        toast.success("آدرس ذخیره شد");
        onSaved();
      } catch {
        toast.error("خطا در ذخیره آدرس");
      }
    },
    [form, addresses, updateMutation, validate, onSaved],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[--glass-border] bg-surface-glass backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>آدرس جدید</DialogTitle>
          <DialogDescription>اطلاعات آدرس تحویل را وارد کنید</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <Field
            label="عنوان"
            value={form.title}
            onChange={(v) => update("title", v)}
            error={errors.title}
            placeholder="خانه، محل کار..."
          />
          <Field
            label="نام گیرنده"
            value={form.recipientName}
            onChange={(v) => update("recipientName", v)}
            error={errors.recipientName}
          />
          <Field
            label="موبایل"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
            dir="ltr"
            placeholder="09..."
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="استان"
              value={form.province}
              onChange={(v) => update("province", v)}
              error={errors.province}
            />
            <Field
              label="شهر"
              value={form.city}
              onChange={(v) => update("city", v)}
              error={errors.city}
            />
          </div>

          <Field
            label="کد پستی"
            value={form.postalCode}
            onChange={(v) => update("postalCode", v)}
            error={errors.postalCode}
            dir="ltr"
          />
          <Field
            label="آدرس کامل"
            value={form.fullAddress}
            onChange={(v) => update("fullAddress", v)}
            error={errors.fullAddress}
            multiline
          />

          <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => update("isDefault", e.target.checked)}
              className="h-4 w-4 rounded border-[--glass-border] accent-accent"
            />
            آدرس پیش‌فرض
          </label>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="mt-2 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
          >
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره آدرس"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Field ─── */

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  dir,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  dir?: string;
  multiline?: boolean;
}) {
  const cls = `w-full rounded-xl border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors ${
    error ? "border-danger" : "border-[--glass-border] focus:border-accent"
  }`;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-medium text-text-muted">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`${cls} resize-none`}
          dir={dir}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
          dir={dir}
        />
      )}
      {error && <span className="text-[10px] text-danger">{error}</span>}
    </div>
  );
}
