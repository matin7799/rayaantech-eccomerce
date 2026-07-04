import { AnimatePresence, motion } from "framer-motion";
import { DownloadIcon, SparklesIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../lib/trpc";
import { useSession } from "../../lib/useSession";
import { type BeforeInstallPromptEvent, usePwaStore } from "../../store/usePwaStore";
import { Button } from "../ui/button";

export interface PwaInstallPromptProps {
  /** Optional callback triggered after a verified successful installation */
  onInstallSuccess?: () => void;
}

/**
 * Checks if the 48-hour PWA suppress cookie is active.
 */
function getIsPwaDismissed(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((row) => row.trim().startsWith("pwa_dismissed=true"));
}

/**
 * Sets a cookie to suppress the installation prompt context for 48 hours.
 */
function suppressPwaPrompt(): void {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + 48 * 60 * 60 * 1000); // 48 hours
  document.cookie = `pwa_dismissed=true; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Elegant, glassmorphic floating PWA banner targeting Iranian customers.
 * Prompts the user to install the application in exchange for 50 loyalty coins.
 */
export function PwaInstallPrompt({ onInstallSuccess }: PwaInstallPromptProps) {
  const {
    deferredPrompt,
    isInstallable,
    hasBeenRewarded,
    setDeferredPrompt,
    setIsInstallable,
    markAsRewarded,
  } = usePwaStore();
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useSession();

  // Mutation to claim the PWA bonus
  const claimPwaBonusMutation = trpc.user.claimPwaBonus.useMutation({
    onSuccess: () => {
      markAsRewarded();
      if (typeof window !== "undefined") {
        localStorage.setItem("rayan_pwa_rewarded", "true");
      }
      // Trigger subtle haptic feedback if supported by client device
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      toast.success("تبریک! ۵۰ سکه هدیه نصب به کیف پول شما اضافه شد 🪙");
    },
    onError: (err) => {
      // If already claimed, sync local state
      if (err.shape?.code === -32009 || err.message.includes("قبلاً")) {
        markAsRewarded();
        if (typeof window !== "undefined") {
          localStorage.setItem("rayan_pwa_rewarded", "true");
        }
      }
    },
  });

  // Query user profile to check if they claimed the PWA bonus
  const profileQuery = trpc.profile.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Sync PWA claim status from profile query metadata
  useEffect(() => {
    if (profileQuery.data?.profile?.pwaBonusClaimed && !hasBeenRewarded) {
      markAsRewarded();
      if (typeof window !== "undefined") {
        localStorage.setItem("rayan_pwa_rewarded", "true");
      }
    }
  }, [profileQuery.data, hasBeenRewarded, markAsRewarded]);

  // Register the service worker — Chrome requires an active controlling service
  // worker before it will ever fire `beforeinstallprompt`.
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("[PWA] Service worker registration failed:", err);
    });
  }, []);

  // Intercept browser installation prompt events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsVisible(false);

      // Auto claim if authenticated
      if (isAuthenticated && !hasBeenRewarded && !claimPwaBonusMutation.isPending) {
        claimPwaBonusMutation.mutate();
      }

      if (onInstallSuccess) {
        onInstallSuccess();
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [
    isAuthenticated,
    hasBeenRewarded,
    setDeferredPrompt,
    setIsInstallable,
    claimPwaBonusMutation,
    onInstallSuccess,
  ]);

  // Fallback: If launched in PWA standalone display mode but not yet rewarded
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone && isAuthenticated && !hasBeenRewarded && !claimPwaBonusMutation.isPending) {
      claimPwaBonusMutation.mutate();
    }
  }, [isAuthenticated, hasBeenRewarded, claimPwaBonusMutation]);

  // Guard against hydration mismatch and check cookie on mount
  useEffect(() => {
    const isDismissed = getIsPwaDismissed();
    // Only show if installable, not already rewarded, and not dismissed by the cookie
    if (isInstallable && deferredPrompt && !hasBeenRewarded && !isDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, deferredPrompt, hasBeenRewarded]);

  const handleDismiss = () => {
    suppressPwaPrompt();
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      // Trigger native browser prompt
      await deferredPrompt.prompt();

      // Await user resolution
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstallable(false);
        setIsVisible(false);

        // Execute reward logic immediately
        if (isAuthenticated && !hasBeenRewarded && !claimPwaBonusMutation.isPending) {
          claimPwaBonusMutation.mutate();
        }

        if (onInstallSuccess) {
          onInstallSuccess();
        }
      }
    } catch (err) {
      console.error("[PWA Install] Installation prompt failed:", err);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-4 right-4 z-50 md:max-w-md md:left-auto md:right-6"
        >
          <div className="bg-surface/80 backdrop-blur-xl border border-border/50 shadow-2xl p-4 rounded-2xl flex flex-col gap-3 transition-all duration-500 relative overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Ambient gold glow highlight inside the liquid glass card */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-2.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <SparklesIcon className="h-5 w-5 animate-pulse" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[14px] font-semibold text-text-primary leading-snug">
                    رایانتک را به صفحه خانه اضافه کنید و ۵۰ سکه هدیه بگیرید! 🪙
                  </h4>
                  <p className="text-[11px] text-text-muted">
                    دسترسی سریع‌تر، کارکرد آفلاین و خرید آسان
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="text-text-muted hover:text-text-primary hover:bg-surface-secondary/40 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <motion.div className="w-full" whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleInstall}
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl py-2 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-accent/20 cursor-pointer h-9"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>نصب اپلیکیشن رایانتک</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
