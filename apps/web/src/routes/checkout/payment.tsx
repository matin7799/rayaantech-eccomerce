import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CheckSquareIcon,
  CreditCardIcon,
  LoaderIcon,
  MapPinIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckoutShell } from "../../components/checkout/CheckoutShell";
import { DigiPayCreditCardComponent } from "../../components/checkout/DigiPayCreditCardComponent";
import { GlassSection } from "../../components/checkout/GlassSection";
import { Button } from "../../components/ui/button";
import { formatTomansPersian } from "../../lib/persian-numerals";
import { useCartStore } from "../../lib/store";
import { trpc } from "../../lib/trpc";
import { useSession } from "../../lib/useSession";

const paymentSearchSchema = z.object({
  addressId: z.string(),
  shippingId: z.string(),
  notes: z.string().optional(),
});

export const Route = createFileRoute("/checkout/payment")({
  validateSearch: paymentSearchSchema,
  component: PaymentReviewPage,
});

function PaymentReviewPage() {
  const search = Route.useSearch();
  const items = useCartStore((s) => s.items);
  const getDisplayTotal = useCartStore((s) => s.getDisplayTotal);
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const addressesQuery = trpc.profile.getAddresses.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const addresses = addressesQuery.data?.addresses ?? [];

  const initiateDigipay = trpc.payment.initiateDigipayCredit.useMutation();

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

  const selectedAddress = addresses.find((a) => a.id === search.addressId);

  const handlePay = async () => {
    if (!selectedAddress) {
      toast.error("آدرس نامعتبر است. لطفاً آدرس تحویل را مجدداً انتخاب کنید.");
      return;
    }

    try {
      const fullAddress = `${selectedAddress.province}، ${selectedAddress.city}، ${selectedAddress.fullAddress} — کد پستی: ${selectedAddress.postalCode}`;

      const result = await initiateDigipay.mutateAsync({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        shippingAddress: fullAddress,
        notes: search.notes || undefined,
        mobile: selectedAddress.phone,
      });

      // Redirect user to DigiPay Credit gateway portal
      window.location.href = result.redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در برقراری ارتباط با دیجی‌پی";
      toast.error(msg);
    }
  };

  if (!hydrated || addressesQuery.isLoading) {
    return <CheckoutShell />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-8 sm:px-6 lg:px-10 max-w-6xl mx-auto"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => void navigate({ to: "/checkout" })}
        className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowRightIcon className="h-4 w-4" />
        بازگشت به اطلاعات سفارش
      </button>

      <h1 className="mb-8 text-xl font-bold text-text-primary">بررسی و تأیید پرداخت اعتباری</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column - items review and shipping details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping review */}
          <GlassSection title="آدرس و روش ارسال گیرنده" icon={<MapPinIcon className="h-4 w-4" />}>
            {selectedAddress ? (
              <div className="text-xs text-text-secondary space-y-2">
                <p className="font-bold text-text-primary">
                  گیرنده: {selectedAddress.receiverName}
                </p>
                <p>
                  آدرس: {selectedAddress.province}، {selectedAddress.city}،{" "}
                  {selectedAddress.fullAddress}
                </p>
                <p>کد پستی: {selectedAddress.postalCode}</p>
                <p>شماره تماس: {selectedAddress.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-danger">آدرس انتخاب شده یافت نشد.</p>
            )}
          </GlassSection>

          {/* Cart review */}
          <GlassSection title="اقلام سفارش شما" icon={<CheckSquareIcon className="h-4 w-4" />}>
            <div className="divide-y divide-[--glass-border]">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between py-3 text-xs gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-text-muted mt-1">تعداد: {item.quantity} عدد</p>
                  </div>
                  <span className="font-bold text-text-primary tabular-nums shrink-0">
                    {formatTomansPersian(item.effectivePrice * item.quantity)} تومان
                  </span>
                </div>
              ))}
            </div>
          </GlassSection>
        </div>

        {/* Right column - DigiPay Credit Card & Actions */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            طرح بازپرداخت دیجی‌پی
          </h2>

          <DigiPayCreditCardComponent
            totalAmount={getDisplayTotal()}
            mobile={selectedAddress?.phone ?? ""}
          />

          <Button
            onClick={handlePay}
            disabled={initiateDigipay.isPending || !selectedAddress}
            className="w-full rounded-2xl bg-accent py-4 text-sm font-bold text-white shadow-lg hover:bg-accent/90 disabled:opacity-50 transition-all duration-200"
          >
            {initiateDigipay.isPending ? (
              <LoaderIcon className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "پرداخت و ثبت نهایی اعتباری"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
