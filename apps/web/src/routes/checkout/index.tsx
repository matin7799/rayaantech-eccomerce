import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarClockIcon, CreditCardIcon, MapPinIcon, PlusIcon, TruckIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AddressDialog } from "#/components/checkout/AddressDialog";
import { AddressCard } from "../../components/checkout/AddressCard";
import { CheckoutShell } from "../../components/checkout/CheckoutShell";
import { CheckoutSummary } from "../../components/checkout/CheckoutSummary";
import { GlassSection } from "../../components/checkout/GlassSection";
import { InstallmentConfigurator } from "../../components/checkout/InstallmentConfigurator";
import {
  NeonPaymentMethodCard,
  PaymentMethodCard,
} from "../../components/checkout/PaymentMethodCard";
import { ShippingSelector } from "../../components/checkout/ShippingSelector";
import { useCartStore } from "../../lib/store";
import { trpc } from "../../lib/trpc";
import { useSession } from "../../lib/useSession";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
});

/**
 * /checkout — Premium glassmorphism checkout viewport.
 */
function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getDisplayTotal = useCartStore((s) => s.getDisplayTotal);
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "zarinpal" | "digipay_credit" | "rayantech_installment"
  >("zarinpal");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const addressesQuery = trpc.profile.getAddresses.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const addresses = addressesQuery.data?.addresses ?? [];

  const createOrder = trpc.order.create.useMutation();
  const utils = trpc.useUtils();

  const handleAddressSaved = useCallback(() => {
    void utils.profile.getAddresses.invalidate();
    setAddressDialogOpen(false);
  }, [utils]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  // Auth guard
  useEffect(() => {
    if (!(sessionLoading || isAuthenticated)) {
      void navigate({ to: "/auth/login", search: { from: "/checkout" } });
    }
  }, [sessionLoading, isAuthenticated, navigate]);

  // Empty cart guard
  useEffect(() => {
    if (hydrated && items.length === 0) {
      void navigate({ to: "/cart" });
    }
  }, [hydrated, items.length, navigate]);

  if (!(sessionLoading || isAuthenticated)) {
    return null;
  }

  if (hydrated && items.length === 0) {
    return null;
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleSubmit = async () => {
    if (paymentMethod === "rayantech_installment") {
      // Handled by InstallmentConfigurator's own action button
      return;
    }

    if (!selectedAddress) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    if (!selectedShippingId) {
      toast.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }

    if (paymentMethod === "digipay_credit") {
      void navigate({
        to: "/checkout/payment",
        search: {
          addressId: selectedAddress.id,
          shippingId: selectedShippingId,
          notes: notes || undefined,
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fullAddress = `${selectedAddress.province}، ${selectedAddress.city}، ${selectedAddress.fullAddress} — کد پستی: ${selectedAddress.postalCode}`;

      const result = await createOrder.mutateAsync({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: fullAddress,
        notes: notes || undefined,
        mobile: selectedAddress.phone,
      });

      window.location.href = result.redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در ثبت سفارش";
      if (msg.includes("not found") || msg.includes("inactive")) {
        toast.error("یکی از محصولات سبد خرید دیگر موجود نیست. لطفاً سبد را به‌روزرسانی کنید.", {
          duration: 6000,
        });
      } else {
        toast.error(msg);
      }
      setIsSubmitting(false);
    }
  };

  if (!hydrated) {
    return <CheckoutShell />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-8 sm:px-6 lg:px-10"
    >
      <h1 className="mb-8 text-xl font-bold text-text-primary">تکمیل سفارش</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column — Address + Payment */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Address Section */}
          <GlassSection title="آدرس تحویل" icon={<MapPinIcon className="h-4 w-4" />}>
            {addressesQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-surface-secondary animate-pulse" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">هنوز آدرسی ثبت نشده</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    selected={addr.id === selectedAddressId}
                    onSelect={() => setSelectedAddressId(addr.id)}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setAddressDialogOpen(true)}
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              افزودن آدرس جدید
            </button>
          </GlassSection>

          {/* Shipping Method */}
          <GlassSection title="روش ارسال" icon={<TruckIcon className="h-4 w-4" />}>
            <ShippingSelector selectedId={selectedShippingId} onSelect={setSelectedShippingId} />
          </GlassSection>

          {/* Payment Method */}
          <GlassSection title="روش پرداخت" icon={<CreditCardIcon className="h-4 w-4" />}>
            <div className="flex flex-col gap-4">
              {/* Premium Installment — full-width hero placement */}
              <NeonPaymentMethodCard
                label="اقساطی رایان تک"
                description="شرایط ویژه اقساط با کمترین بهره — بدون ضامن"
                selected={paymentMethod === "rayantech_installment"}
                onSelect={() => setPaymentMethod("rayantech_installment")}
              />

              {/* Standard methods */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PaymentMethodCard
                  label="زرین‌پال"
                  description="پرداخت آنلاین با کارت بانکی"
                  selected={paymentMethod === "zarinpal"}
                  onSelect={() => setPaymentMethod("zarinpal")}
                  logo="/icons/dybug_payment_zarinpal.svg"
                />
                <PaymentMethodCard
                  label="اعتبار دیجی‌پی"
                  description="خرید اعتباری دیجی‌پی"
                  selected={paymentMethod === "digipay_credit"}
                  onSelect={() => setPaymentMethod("digipay_credit")}
                  logo="/icons/Digipay-Logo.svg"
                />
              </div>
            </div>
          </GlassSection>

          {/* Rayan Tech Installment Configurator */}
          {paymentMethod === "rayantech_installment" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassSection
                title="شرایط اقساطی رایان تک"
                icon={<CalendarClockIcon className="h-4 w-4" />}
              >
                <InstallmentConfigurator
                  shippingAddress={
                    selectedAddress
                      ? `${selectedAddress.province}، ${selectedAddress.city}، ${selectedAddress.fullAddress}`
                      : undefined
                  }
                  mobile={selectedAddress?.phone}
                  notes={notes || undefined}
                  hasAddress={Boolean(selectedAddress)}
                  hasShipping={Boolean(selectedShippingId)}
                />
              </GlassSection>
            </motion.div>
          )}

          {/* Notes */}
          <GlassSection title="یادداشت">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="توضیحات اختیاری برای سفارش..."
              className="w-full resize-none rounded-xl border border-[--glass-border] bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </GlassSection>
        </div>

        {/* Right Column — Summary */}
        <CheckoutSummary
          items={items}
          paymentMethod={paymentMethod}
          displayTotal={getDisplayTotal()}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          hasSelectedAddress={Boolean(selectedAddress)}
          hasSelectedShipping={Boolean(selectedShippingId)}
        />
      </div>

      {/* Address Dialog */}
      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSaved={handleAddressSaved}
      />
    </motion.div>
  );
}
