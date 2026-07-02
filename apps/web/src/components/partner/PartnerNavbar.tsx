import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboardIcon, LogOutIcon, Menu, PackageIcon, ShoppingBagIcon } from "lucide-react";
import { trpc } from "../../lib/trpc";
import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export function PartnerNavbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      window.location.replace("/auth/login");
    },
  });

  const links = [
    {
      to: "/partner/dashboard",
      label: "داشبورد",
      icon: LayoutDashboardIcon,
    },
    {
      to: "/partner/products",
      label: "کاتالوگ محصولات",
      icon: PackageIcon,
    },
    {
      to: "/partner/purchases",
      label: "خریدها و فاکتورها",
      icon: ShoppingBagIcon,
    },
  ];

  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-40 h-16 w-full bg-[--glass-backdrop] backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ease-in-out"
    >
      {/* Brand & Left/Right navigation content */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline hover:opacity-90 transition-opacity"
        >
          <img
            src="/images/logo-dark.svg"
            alt="رایان تک"
            className="h-6 w-auto block dark:hidden"
          />
          <img
            src="/images/logo-light.svg"
            alt="رایان تک"
            className="h-6 w-auto hidden dark:block"
          />
          <span className="text-[10px] bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded-full">
            B2B همکار
          </span>
        </Link>

        {/* Navigation Links — Desktop only */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive = pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal text-text-secondary transition-colors duration-300 ease-in-out hover:text-accent no-underline",
                  isActive && "text-accent font-medium bg-accent/5",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Contextual actions & Mobile menu */}
      <div className="flex items-center gap-3">
        {/* Return to storefront button (highly visible contextual action) */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link
            to="/"
            className="text-xs font-semibold text-text-secondary hover:text-accent no-underline transition-colors duration-200 px-3 py-1.5 rounded-lg bg-surface-secondary/40 border border-border/50"
          >
            بازگشت به سایت
          </Link>
        </motion.div>

        {/* Desktop Logout Action */}
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          className="hidden sm:flex h-8 items-center gap-1 px-2.5 rounded-lg border border-border bg-surface text-xs text-text-secondary hover:text-danger hover:border-danger/30 transition-all duration-300"
        >
          <LogOutIcon className="h-3.5 w-3.5" />
          <span>خروج</span>
        </button>

        {/* Mobile slide-out side drawer */}
        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger
              className="p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="منوی ناوبری"
            >
              <Menu className="h-4.5 w-4.5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-surface border-l border-border w-64 p-6 flex flex-col gap-6"
              dir="rtl"
            >
              <SheetHeader className="text-right">
                <SheetTitle className="text-sm font-bold text-text-primary">
                  ناوبری همکار B2B
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 mt-4">
                {links.map((link) => {
                  const isActive = pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent no-underline",
                        isActive && "text-accent bg-accent/5 font-semibold",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto border-t border-border pt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => logoutMutation.mutate()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors border-0 bg-transparent text-right w-full"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>خروج</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
