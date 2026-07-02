import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BrainCircuitIcon,
  ChevronLeftIcon,
  HardDriveIcon,
  KeyIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  PackageIcon,
  RadioIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react";
import { ThemeToggle } from "../layout/header";

/**
 * Admin Sidebar — Enterprise navigation for private /admin routes.
 *
 * Structural constraints:
 * - h-screen sticky top-0 (viewport-locked, no scroll-away)
 * - bg-surface with border-e border-border
 * - Glassmorphism applied to sidebar container shell only
 * - Navigation links: text-text-secondary default, text-accent active
 * - No underlines, no block backgrounds for active state — color shift only
 */

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboardIcon;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "نمای کلی",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    id: "users",
    label: "کاربران",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    id: "orders",
    label: "سفارش‌ها و مالی",
    href: "/admin/orders",
    icon: ShoppingCartIcon,
  },
  {
    id: "products",
    label: "محصولات و انبار",
    href: "/admin/products",
    icon: PackageIcon,
  },
  {
    id: "content",
    label: "محتوا و رسانه",
    href: "/admin/content",
    icon: NewspaperIcon,
  },
  {
    id: "tokens",
    label: "کلیدهای API",
    href: "/admin/tokens",
    icon: KeyIcon,
  },
  {
    id: "storage",
    label: "فضای ذخیره‌سازی",
    href: "/admin/storage",
    icon: HardDriveIcon,
  },
  {
    id: "torob",
    label: "هاب ترب",
    href: "/admin/torob",
    icon: RadioIcon,
  },
  {
    id: "logs",
    label: "لاگ‌های سیستم",
    href: "/admin/logs",
    icon: RadioIcon,
  },
  {
    id: "installments",
    label: "تنظیمات اقساط",
    href: "/admin/installments",
    icon: BrainCircuitIcon,
  },
  {
    id: "ai-diagnostics",
    label: "تشخیص AI",
    href: "/admin/ai-diagnostics",
    icon: BrainCircuitIcon,
  },
  {
    id: "ai-config",
    label: "پیکربندی AI",
    href: "/admin/ai-config",
    icon: SlidersHorizontalIcon,
  },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-border bg-surface-glass backdrop-blur-xl lg:flex">
      {/* Brand header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
          <LayoutDashboardIcon className="h-5 w-5 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">پنل مدیریت</span>
          <span className="text-[11px] text-text-muted">رایان تک</span>
        </div>
        <div className="ms-10">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="ناوبری مدیریت">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              to={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors duration-200 ${
                isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isActive && (
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
      </nav>

      {/* Footer — back to storefront */}
      <div className="border-t border-border px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted no-underline transition-colors duration-200 hover:text-text-primary"
        >
          <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          <span>بازگشت به فروشگاه</span>
        </Link>
      </div>
    </aside>
  );
}
