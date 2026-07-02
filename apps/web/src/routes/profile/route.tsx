import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClockIcon,
  CoinsIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MapPinIcon,
  MessageCircleIcon,
  PackageIcon,
  ReceiptIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { InstallmentsTab } from "#/components/profile/tabs/InstallmentsTab";
import { AccountDetailsTab } from "../../components/profile/tabs/AccountDetailsTab";
import { AddressesTab } from "../../components/profile/tabs/AddressesTab";
import { ChatHistoryTab } from "../../components/profile/tabs/ChatHistoryTab";
import { LoyaltyTab } from "../../components/profile/tabs/LoyaltyTab";
import { OrdersTab } from "../../components/profile/tabs/OrdersTab";
import { TransactionsTab } from "../../components/profile/tabs/TransactionsTab";
import { WishlistTab } from "../../components/profile/tabs/WishlistTab";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { trpc } from "../../lib/trpc";
import { useSession } from "../../lib/useSession";
import { type DashboardTab, useDashboardStore } from "../../store/useDashboardStore";

export const Route = createFileRoute("/profile")({
  component: ProfileDashboard,
});

/* ─── Tab Configuration ─── */

interface TabConfig {
  id: DashboardTab;
  label: string;
  shortLabel: string;
  icon: typeof UserIcon;
}

const TABS: readonly TabConfig[] = [
  { id: "account", label: "حساب کاربری", shortLabel: "حساب", icon: UserIcon },
  { id: "orders", label: "سفارش‌ها", shortLabel: "سفارش", icon: PackageIcon },
  { id: "transactions", label: "تراکنش‌ها", shortLabel: "مالی", icon: ReceiptIcon },
  { id: "installments", label: "اقساط من", shortLabel: "اقساط", icon: CalendarClockIcon },
  { id: "wishlist", label: "علاقه‌مندی‌ها", shortLabel: "علاقه‌مندی", icon: HeartIcon },
  { id: "addresses", label: "آدرس‌ها", shortLabel: "آدرس", icon: MapPinIcon },
  { id: "loyalty", label: "امتیازها", shortLabel: "کوین", icon: CoinsIcon },
  {
    id: "chat-history-ledger",
    label: "تاریخچه مشاوره",
    shortLabel: "مشاوره",
    icon: MessageCircleIcon,
  },
];

const ROLE_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> =
  {
    retail: { label: "مشتری", variant: "secondary" },
    wholesale: { label: "همکار فروش", variant: "default" },
    admin: { label: "مدیر", variant: "default" },
    operator: { label: "اپراتور", variant: "outline" },
  };

const ADMIN_ROLES = new Set(["admin", "operator", "wholesale"]);

/**
 * /profile — Responsive user dashboard.
 *
 * Mobile: Stacked layout, horizontal scrolling tab pills, full-width content
 * Tablet: Same as mobile with wider content area
 * Desktop: Sidebar nav (left) + scrollable content panel (right)
 */
function ProfileDashboard() {
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useDashboardStore();

  const profileQuery = trpc.profile.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const profile = profileQuery.data?.profile;

  // Redirect to login if session resolves as unauthenticated
  useEffect(() => {
    if (!(sessionLoading || isAuthenticated)) {
      navigate({ to: "/auth/login", search: { from: "/profile" } });
    }
  }, [sessionLoading, isAuthenticated, navigate]);

  // Sync active tab from URL query parameters (Hydration Loop)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "chat-history" || tab === "chat-history-ledger") {
      setActiveTab("chat-history-ledger");
    } else if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab as DashboardTab);
    }
  }, [setActiveTab]);

  if (sessionLoading || !isAuthenticated || profileQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  const showAdminLink = profile?.role && ADMIN_ROLES.has(profile.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-page-max px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
    >
      {/* ─── Profile Header ─── */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar + Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Avatar size="lg">
                  <AvatarFallback>
                    {profile?.fullName
                      ? profile.fullName.slice(0, 2)
                      : (profile?.mobile?.slice(-2) ?? "RT")}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base sm:text-lg">
                  {profile?.fullName || profile?.mobile || "کاربر"}
                </CardTitle>
                <CardDescription dir="ltr" className="text-start text-xs sm:text-sm">
                  {profile?.mobile}
                </CardDescription>
              </div>
            </div>

            {/* Actions — wraps on mobile */}
            <div className="flex flex-wrap items-center gap-2 sm:ms-auto">
              {profile?.role && (
                <Badge variant={ROLE_LABELS[profile.role]?.variant ?? "secondary"}>
                  {profile.role === "wholesale" && profile.wholesaleStatus === "pending"
                    ? "در انتظار تأیید"
                    : (ROLE_LABELS[profile.role]?.label ?? "کاربر")}
                </Badge>
              )}

              {showAdminLink && (
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate({ to: "/admin" as string })}
                  >
                    <LayoutDashboardIcon data-icon="inline-start" />
                    <span className="hidden sm:inline">داشبورد مدیریت</span>
                    <span className="sm:hidden">مدیریت</span>
                  </Button>
                </motion.div>
              )}

              <LogoutButton />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ─── Dashboard Body: Sidebar (desktop) / Tabs (mobile) ─── */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation — Desktop only */}
        <aside className="hidden lg:block lg:w-56 lg:shrink-0">
          <Card className="sticky top-20">
            <CardContent className="p-2">
              <nav className="flex flex-col gap-1" aria-label="منوی داشبورد">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/8 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="shrink-0" aria-hidden="true" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile/Tablet Tab Pills — scrollable horizontally */}
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="shrink-0" aria-hidden="true" />
                  {tab.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <Card className="min-w-0 flex-1">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeTab === "account" && <AccountDetailsTab />}
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "transactions" && <TransactionsTab />}
                {activeTab === "installments" && <InstallmentsTab />}
                {activeTab === "wishlist" && <WishlistTab />}
                {activeTab === "addresses" && <AddressesTab />}
                {activeTab === "loyalty" && <LoyaltyTab />}
                {activeTab === "chat-history-ledger" && <ChatHistoryTab />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */

function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation.mutateAsync();
      void utils.invalidate();
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate({ to: "/" });
    } catch {
      toast.error("[profile/logout] خطا در خروج از حساب");
      setIsLoggingOut(false);
    }
  }, [logoutMutation, utils, navigate]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {isLoggingOut ? (
        <span className="size-4 animate-spin rounded-full border-2 border-destructive/30 border-t-destructive" />
      ) : (
        <LogOutIcon data-icon="inline-start" />
      )}
      <span className="hidden sm:inline">خروج</span>
    </Button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-page-max px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar skeleton — desktop */}
        <aside className="hidden lg:block lg:w-56">
          <Card>
            <CardContent className="p-2">
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Tab pills skeleton — mobile */}
        <div className="flex gap-2 lg:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 shrink-0 rounded-full" />
          ))}
        </div>

        {/* Content skeleton */}
        <Card className="flex-1">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
