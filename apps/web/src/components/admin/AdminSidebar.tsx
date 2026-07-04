import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  CreditCardIcon,
  HardDriveIcon,
  KeyIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  MenuIcon,
  NewspaperIcon,
  PackageIcon,
  RadioIcon,
  ScrollTextIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../layout/header";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { NotificationBell } from "./NotificationBell";

/**
 * Admin navigation — a single source of truth shared by the sticky desktop
 * sidebar (≥ lg) and the mobile slide-out drawer (< lg).
 *
 * Structural constraints:
 * - Grouped, sectioned navigation with distinct iconography
 * - Active state: tinted pill (shared layoutId) + accent text, no underlines
 * - Fully keyboard/RTL aware
 */

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "main",
    label: "اصلی",
    items: [{ id: "overview", label: "نمای کلی", href: "/admin", icon: LayoutDashboardIcon }],
  },
  {
    id: "commerce",
    label: "فروش و عملیات",
    items: [
      { id: "orders", label: "سفارش‌ها و مالی", href: "/admin/orders", icon: ShoppingCartIcon },
      { id: "products", label: "محصولات و انبار", href: "/admin/products", icon: PackageIcon },
      { id: "users", label: "کاربران", href: "/admin/users", icon: UsersIcon },
      { id: "installments", label: "اقساط", href: "/admin/installments", icon: CreditCardIcon },
      { id: "shipping", label: "روش‌های ارسال", href: "/admin/shipping", icon: TruckIcon },
    ],
  },
  {
    id: "content",
    label: "محتوا و رسانه",
    items: [
      { id: "content", label: "محتوا و رسانه", href: "/admin/content", icon: NewspaperIcon },
      { id: "storage", label: "فضای ذخیره‌سازی", href: "/admin/storage", icon: HardDriveIcon },
    ],
  },
  {
    id: "integrations",
    label: "یکپارچه‌سازی و سیستم",
    items: [
      { id: "ai", label: "دستیار هوش مصنوعی", href: "/admin/ai", icon: SparklesIcon },
      { id: "torob", label: "هاب ترب", href: "/admin/torob", icon: RadioIcon },
      { id: "tokens", label: "کلیدهای API", href: "/admin/tokens", icon: KeyIcon },
      { id: "logs", label: "لاگ‌های سیستم", href: "/admin/logs", icon: ScrollTextIcon },
    ],
  },
];

function useActiveHref() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (href: string) =>
    href === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(href);
}

/* ─── Shared brand + nav list ─── */

function BrandHeader({ actions = true }: { actions?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
        <LayoutDashboardIcon className="h-5 w-5 text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">پنل مدیریت</span>
        <span className="text-[11px] text-text-muted">رایان تک</span>
      </div>
      {actions && (
        <div className="ms-auto flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useActiveHref();

  return (
    <nav
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4"
      aria-label="ناوبری مدیریت"
    >
      {NAV_SECTIONS.map((section) => (
        <div key={section.id} className="flex flex-col gap-1">
          <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {section.label}
          </span>
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={onNavigate}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors duration-200 ${
                  active ? "text-accent" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="absolute inset-0 rounded-xl bg-surface-action"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function BackToStore({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-border px-3 py-4">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted no-underline transition-colors duration-200 hover:text-text-primary"
      >
        <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        <span>بازگشت به فروشگاه</span>
      </Link>
    </div>
  );
}

/* ─── Desktop sidebar (≥ lg) ─── */

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-border bg-surface-glass backdrop-blur-xl lg:flex">
      <BrandHeader />
      <NavList />
      <BackToStore />
    </aside>
  );
}

/* ─── Mobile top bar + drawer (< lg) ─── */

export function AdminMobileBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-surface-glass px-4 py-3 backdrop-blur-xl lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button
              type="button"
              aria-label="باز کردن منوی مدیریت"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:text-text-primary"
            />
          }
        >
          <MenuIcon className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72 max-w-[85vw] gap-0 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">منوی مدیریت</SheetTitle>
          <BrandHeader actions={false} />
          <NavList onNavigate={close} />
          <BackToStore onNavigate={close} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <LayoutDashboardIcon className="h-4.5 w-4.5 text-accent" />
        </div>
        <span className="text-sm font-semibold text-text-primary">پنل مدیریت</span>
      </div>

      <div className="ms-auto flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}
