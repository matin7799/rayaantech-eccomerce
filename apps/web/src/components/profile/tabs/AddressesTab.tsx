import { motion } from "framer-motion";
import { Edit3, MapPin, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../../lib/trpc";
import { AuthSubmitButton } from "../../auth/AuthSubmitButton";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { Skeleton } from "../../ui/skeleton";

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

const EMPTY_ADDRESS: AddressEntry = {
  id: "",
  title: "",
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  postalCode: "",
  fullAddress: "",
  isDefault: false,
};

/**
 * AddressesTab — آدرس‌ها
 *
 * Flat table of saved shipping addresses (no zebra rows).
 * Add/Edit forms inside shadcn Dialog (proper portal overlay, centered viewport).
 * Data stored as JSONB on users table.
 */
export function AddressesTab() {
  const addressesQuery = trpc.profile.getAddresses.useQuery();
  const updateMutation = trpc.profile.updateAddresses.useMutation();
  const utils = trpc.useUtils();

  const addresses = addressesQuery.data?.addresses ?? [];
  const [editingAddress, setEditingAddress] = useState<AddressEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openNew = useCallback(() => {
    setEditingAddress({ ...EMPTY_ADDRESS, id: crypto.randomUUID() });
    setIsDialogOpen(true);
  }, []);

  const openEdit = useCallback((addr: AddressEntry) => {
    setEditingAddress({ ...addr });
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  }, []);

  const handleSave = useCallback(
    async (addr: AddressEntry) => {
      const existing = addresses.filter((a) => a.id !== addr.id);
      const updated = addr.isDefault
        ? [...existing.map((a) => ({ ...a, isDefault: false })), addr]
        : [...existing, addr];

      try {
        await updateMutation.mutateAsync({ addresses: updated });
        toast.success("آدرس ذخیره شد");
        closeDialog();
        void utils.profile.getAddresses.invalidate();
      } catch {
        toast.error("[profile/addresses] خطا در ذخیره آدرس");
      }
    },
    [addresses, updateMutation, utils, closeDialog],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const updated = addresses.filter((a) => a.id !== id);
      try {
        await updateMutation.mutateAsync({ addresses: updated });
        toast.success("آدرس حذف شد");
        void utils.profile.getAddresses.invalidate();
      } catch {
        toast.error("[profile/addresses] خطا در حذف آدرس");
      }
    },
    [addresses, updateMutation, utils],
  );

  if (addressesQuery.isLoading) {
    return <AddressesSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">آدرس‌ها</h2>
        <Button variant="outline" size="sm" onClick={openNew}>
          <Plus data-icon="inline-start" />
          آدرس جدید
        </Button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="py-8 text-center text-sm font-medium text-muted-foreground">
          هنوز آدرسی ثبت نشده است
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between rounded-xl border border-border p-4 transition-colors duration-200 hover:bg-muted/30"
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {addr.province}، {addr.city}
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {addr.fullAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEdit(addr)}
                  aria-label="ویرایش آدرس"
                >
                  <Edit3 />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(addr.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label="حذف آدرس"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Address Dialog (shadcn Dialog with proper portal overlay) ─── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress?.title ? "ویرایش آدرس" : "آدرس جدید"}</DialogTitle>
            <DialogDescription>اطلاعات آدرس گیرنده را وارد کنید</DialogDescription>
          </DialogHeader>

          {editingAddress && (
            <AddressForm
              address={editingAddress}
              onSave={handleSave}
              isSaving={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

/* ─── Address Form (inside Dialog) ─── */

function AddressForm({
  address,
  onSave,
  isSaving,
}: {
  address: AddressEntry;
  onSave: (addr: AddressEntry) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<AddressEntry>(address);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((key: keyof AddressEntry, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "عنوان الزامی است";
    if (form.recipientName.trim().length < 3) errs.recipientName = "نام گیرنده الزامی است";
    if (!/^09\d{9}$/.test(form.phone)) errs.phone = "شماره موبایل نامعتبر";
    if (!form.province.trim()) errs.province = "استان الزامی است";
    if (!form.city.trim()) errs.city = "شهر الزامی است";
    if (!/^\d{10}$/.test(form.postalCode)) errs.postalCode = "کد پستی ۱۰ رقمی";
    if (form.fullAddress.trim().length < 10) errs.fullAddress = "آدرس کامل‌تر وارد کنید";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      await onSave(form);
    },
    [form, validate, onSave],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <DialogField
        label="عنوان"
        value={form.title}
        onChange={(v) => updateField("title", v)}
        error={errors.title}
        placeholder="خانه، محل کار..."
      />
      <DialogField
        label="نام گیرنده"
        value={form.recipientName}
        onChange={(v) => updateField("recipientName", v)}
        error={errors.recipientName}
      />
      <DialogField
        label="موبایل"
        value={form.phone}
        onChange={(v) => updateField("phone", v)}
        error={errors.phone}
        dir="ltr"
        placeholder="09..."
      />

      <div className="grid grid-cols-2 gap-3">
        <DialogField
          label="استان"
          value={form.province}
          onChange={(v) => updateField("province", v)}
          error={errors.province}
        />
        <DialogField
          label="شهر"
          value={form.city}
          onChange={(v) => updateField("city", v)}
          error={errors.city}
        />
      </div>

      <DialogField
        label="کد پستی"
        value={form.postalCode}
        onChange={(v) => updateField("postalCode", v)}
        error={errors.postalCode}
        dir="ltr"
      />
      <DialogField
        label="آدرس کامل"
        value={form.fullAddress}
        onChange={(v) => updateField("fullAddress", v)}
        error={errors.fullAddress}
        multiline
      />

      {/* Default toggle */}
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => updateField("isDefault", e.target.checked)}
          className="size-4 rounded border-border accent-primary"
        />
        تنظیم به عنوان آدرس پیش‌فرض
      </label>

      <Separator className="my-1" />

      <AuthSubmitButton isLoading={isSaving} label="ذخیره آدرس" />
    </form>
  );
}

/* ─── Form Field ─── */

function DialogField({
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
  const baseClass = `w-full rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground transition-colors duration-200 ${
    error ? "border-destructive" : "border-border focus:border-ring"
  }`;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-medium text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`${baseClass} resize-none`}
          dir={dir}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
          dir={dir}
        />
      )}
      {error && <span className="text-[10px] font-medium text-destructive">{error}</span>}
    </div>
  );
}

function AddressesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}
