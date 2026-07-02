import { motion } from "framer-motion";
import { Coins, Gift, Smartphone, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../../lib/trpc";

/**
 * LoyaltyTab — امتیازها و رایان کوین
 *
 * Interactive Rayan Coins balance widget with:
 * - Animated glass meter showing coin balance
 * - PWA installation bonus claim (+50 coins, one-time)
 * - Intercepts native beforeinstallprompt event
 */
export function LoyaltyTab() {
  const profileQuery = trpc.profile.getProfile.useQuery();
  const claimBonusMutation = trpc.profile.claimPwaBonus.useMutation();
  const utils = trpc.useUtils();

  const profile = profileQuery.data?.profile;
  const rayanCoins = profile?.rayanCoins ?? 0;
  const pwaBonusClaimed = profile?.pwaBonusClaimed ?? false;

  // PWA install prompt state
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  // Intercept beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPwaInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPwa = useCallback(async () => {
    if (!installPrompt) return;

    // Trigger the native install prompt
    const promptEvent = installPrompt as unknown as {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    };
    await promptEvent.prompt();
    const result = await promptEvent.userChoice;

    if (result.outcome === "accepted") {
      setIsPwaInstalled(true);
      setInstallPrompt(null);

      // Claim the bonus on backend
      if (!pwaBonusClaimed) {
        try {
          await claimBonusMutation.mutateAsync();
          toast.success("+۵۰ رایان کوین به حساب شما اضافه شد!");
          void utils.profile.getProfile.invalidate();
        } catch {
          // Already claimed or error — silently handle
        }
      }
    }
  }, [installPrompt, pwaBonusClaimed, claimBonusMutation, utils]);

  if (profileQuery.isLoading) {
    return <LoyaltySkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-base font-bold text-text-primary">امتیازها و رایان کوین</h2>

      {/* Coin Balance Widget */}
      <div className="relative overflow-hidden rounded-2xl border border-[--glass-border] bg-[--glass-backdrop] p-6 backdrop-blur-md">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-8 end-0 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />

        <div className="relative flex items-center gap-5">
          {/* Animated coin icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10"
          >
            <Coins className="h-8 w-8 text-amber-500" />
          </motion.div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-text-muted">موجودی رایان کوین</span>
            <span className="text-3xl font-bold text-text-primary tabular-nums">
              {rayanCoins.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>

        {/* Glass meter bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((rayanCoins / 1000) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-l from-amber-400 to-amber-500"
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-text-muted">
          <span>۰</span>
          <span>۱,۰۰۰ سکه</span>
        </div>
      </div>

      {/* Earn Points Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-text-primary">کسب امتیاز</h3>

        {/* PWA Install Bonus */}
        <div className="flex items-center justify-between rounded-xl border border-border-light bg-surface-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
              <Smartphone className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-text-primary">نصب اپلیکیشن</span>
              <span className="text-[10px] font-medium text-text-muted">+۵۰ رایان کوین</span>
            </div>
          </div>

          {pwaBonusClaimed || isPwaInstalled ? (
            <span className="rounded-lg bg-success-light px-2.5 py-1 text-[10px] font-semibold text-success">
              دریافت شده ✓
            </span>
          ) : installPrompt ? (
            <button
              type="button"
              onClick={handleInstallPwa}
              className="rounded-lg bg-accent px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-accent/90"
            >
              نصب و دریافت
            </button>
          ) : (
            <span className="text-[10px] font-medium text-text-muted">در دسترس نیست</span>
          )}
        </div>

        {/* Order completion bonus info */}
        <div className="flex items-center justify-between rounded-xl border border-border-light bg-surface-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
              <Gift className="h-4 w-4 text-amber-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-text-primary">تکمیل سفارش</span>
              <span className="text-[10px] font-medium text-text-muted">
                +۱۰ کوین به ازای هر سفارش
              </span>
            </div>
          </div>
          <Star className="h-4 w-4 text-amber-400" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

function LoyaltySkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-6 w-36 animate-pulse rounded-lg bg-surface-secondary" />
      <div className="h-40 animate-pulse rounded-2xl bg-surface-secondary" />
      <div className="flex flex-col gap-3">
        <div className="h-5 w-24 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-16 animate-pulse rounded-xl bg-surface-secondary" />
        <div className="h-16 animate-pulse rounded-xl bg-surface-secondary" />
      </div>
    </div>
  );
}
