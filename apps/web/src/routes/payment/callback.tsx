import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, ClipboardCopyIcon, LoaderIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { InstallmentInstructionCard } from "../../components/payment/InstallmentInstructionCard";
import { InstallmentLedger } from "../../components/payment/InstallmentLedger";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useCartStore } from "../../lib/store";

/** Backend API base URL */
const API_BASE =
  typeof window !== "undefined"
    ? ((window as { __API_URL__?: string }).__API_URL__ ?? "")
    : (process.env.API_URL ?? "http://localhost:3003");

/**
 * Search parameter schema for /payment/callback.
 * Zarinpal sends: Authority, Status
 * DigiPay sends: trackingCode, providerId, result
 */
const CallbackSearchSchema = z.object({
  type: z.enum(["normal", "installment"]).catch("normal"),
  orderId: z.string().optional(),
  Authority: z.string().optional(),
  Status: z.string().optional(),
  trackingCode: z.string().optional(),
  providerId: z.string().optional(),
  result: z.string().optional(),
});

export const Route = createFileRoute("/payment/callback")({
  validateSearch: CallbackSearchSchema,
  component: PaymentCallbackPage,
});

type VerifyState = "loading" | "success" | "error";

/**
 * /payment/callback — Unified payment result page.
 *
 * Handles both normal (Zarinpal) and installment (DigiPay) callbacks.
 * For normal: verifies payment server-side, shows success/error.
 * For installment: shows success + cheque submission form.
 */
function PaymentCallbackPage() {
  const search = Route.useSearch();

  if (search.type === "installment") {
    return <InstallmentCallback search={search} />;
  }

  return <NormalCallback search={search} />;
}

/* ─── Normal Payment Callback ─── */

function NormalCallback({ search }: { search: z.infer<typeof CallbackSearchSchema> }) {
  const [state, setState] = useState<VerifyState>("loading");
  const [refId, setRefId] = useState<string | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyPayment() {
    const authority = search.Authority;
    const status = search.Status;

    if (!authority || status !== "OK") {
      setState("error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId: search.orderId ?? "",
          authority,
          method: "zarinpal",
          amount: 0, // Server looks up real amount from order
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRefId(data.refId);
        setState("success");
        clearCart();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {state === "loading" && <LoadingState key="loading" />}
        {state === "success" && (
          <SuccessCard key="success" refId={refId} orderId={search.orderId} />
        )}
        {state === "error" && <ErrorCard key="error" />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Installment Callback ─── */

function InstallmentCallback({ search }: { search: z.infer<typeof CallbackSearchSchema> }) {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    verifyInstallment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyInstallment() {
    // Determine which gateway sent the callback
    // Zarinpal: Authority + Status params (used for installment advance down-payment)
    // DigiPay: trackingCode + result params
    const isZarinpal = Boolean(search.Authority);
    const isDigipay = Boolean(search.trackingCode);

    if (isZarinpal) {
      if (search.Status !== "OK" || !search.Authority) {
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/v1/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderId: search.orderId ?? "",
            authority: search.Authority,
            method: "zarinpal",
            amount: 0, // Server looks up real amount from order
          }),
        });
        const data = await res.json();
        setVerified(data.success);
        if (data.success) clearCart();
      } catch {
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    } else if (isDigipay) {
      if (search.result !== "SUCCESS" || !search.trackingCode) {
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/v1/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderId: search.orderId ?? "",
            authority: search.trackingCode,
            method: "digipay_credit",
            amount: 0,
          }),
        });
        const data = await res.json();
        setVerified(data.success);
        if (data.success) clearCart();
      } catch {
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    } else {
      // No recognized gateway params — show error
      setVerifying(false);
    }
  }

  if (verifying) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <LoadingState />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <ErrorCard />
      </div>
    );
  }

  const refId = search.Authority ?? search.trackingCode ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Success confirmation */}
      <SuccessCard refId={refId} orderId={search.orderId} />

      {/* Dynamic Installment Schedule Ledger — server-derived data */}
      {search.orderId && (
        <div className="mt-6">
          <InstallmentLedger orderId={search.orderId} />
        </div>
      )}

      {/* Static Instruction Guide — fallback if ledger fails to load */}
      <div className="mt-6">
        <InstallmentInstructionCard />
      </div>
    </motion.div>
  );
}

/* ─── Shared UI Components ─── */

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-4"
    >
      <LoaderIcon className="h-10 w-10 animate-spin text-accent" />
      <p className="text-sm text-text-secondary">در حال بررسی وضعیت پرداخت...</p>
    </motion.div>
  );
}

function SuccessCard({ refId, orderId }: { refId: string | null; orderId?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-border bg-surface-glass p-6 backdrop-blur-md shadow-glass text-center">
        <CheckCircleIcon className="mx-auto h-14 w-14 text-success" />
        <h2 className="mt-4 text-lg font-semibold text-text-primary">پرداخت موفق</h2>
        <p className="mt-2 text-sm text-text-secondary">سفارش شما با موفقیت ثبت و پرداخت شد</p>

        {refId && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-success-light px-3 py-2">
            <span className="text-xs text-text-secondary">کد پیگیری:</span>
            <span className="text-sm font-mono font-semibold text-text-primary">{refId}</span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(refId)}
              className="text-text-muted hover:text-text-primary"
              aria-label="کپی کد پیگیری"
            >
              <ClipboardCopyIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {orderId && (
          <p className="mt-2 text-xs text-text-muted">شماره سفارش: {orderId.slice(0, 8)}</p>
        )}

        <Link to="/profile" className="mt-5 block">
          <Button variant="outline" className="w-full">
            مشاهده سفارش‌ها
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}

function ErrorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-border bg-surface-glass p-6 backdrop-blur-md shadow-glass text-center">
        <XCircleIcon className="mx-auto h-14 w-14 text-danger" />
        <h2 className="mt-4 text-lg font-semibold text-text-primary">پرداخت ناموفق</h2>
        <p className="mt-2 text-sm text-text-secondary">
          متأسفانه پرداخت شما تأیید نشد. لطفاً دوباره تلاش کنید.
        </p>
        <Link to="/cart" className="mt-5 block">
          <Button variant="outline" className="w-full">
            بازگشت به سبد خرید
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
