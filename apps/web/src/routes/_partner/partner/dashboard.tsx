import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { trpc } from "../../../lib/trpc";
import { useSession } from "../../../lib/useSession";

export const Route = createFileRoute("/_partner/partner/dashboard")({
  component: PartnerDashboard,
});

const SYSTEM_SPRING = { type: "spring", stiffness: 300, damping: 30 };

function PartnerDashboard() {
  const { session } = useSession();

  const productsQuery = trpc.partner.getProducts.useQuery({ page: 1, limit: 1 });
  const purchasesQuery = trpc.partner.getPurchases.useQuery({ limit: 1 });

  const productsCount = productsQuery.data?.total ?? 0;
  const purchasesCount = purchasesQuery.data?.total ?? 0;

  return (
    <div className="w-full flex flex-col gap-6" dir="rtl">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border border-border bg-surface/60 backdrop-blur-md relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheckIcon className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-wider">پنل اختصاصی همکاران B2B</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl mt-1 font-semibold">
              خوش آمدید، {session?.fullName || "همکار گرامی"}
            </CardTitle>
            <CardDescription className="text-text-secondary text-sm">
              به پورتال مدیریت و دسترسی به کاتالوگ قیمت‌های ویژه همکار خوش آمدید.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 text-xs text-text-muted flex flex-col gap-1 sm:flex-row sm:gap-6 border-t border-border/50 mt-4">
            <div className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              <span>شماره همراه: {session?.mobile}</span>
            </div>
            <div>نقش سیستم: همکار رسمی فروش (Wholesale Partner)</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Products Matrix Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="border border-border bg-surface/60 backdrop-blur-md flex flex-col h-full justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-accent" />
                  کاتالوگ محصولات
                </CardTitle>
                <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
                  قیمت همکار
                </Badge>
              </div>
              <CardDescription className="mt-2 text-sm text-text-secondary">
                دسترسی به تمام کالاهای انبار با تخفیف‌های ویژه همکار و قیمت‌گذاری عمده.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="text-3xl font-bold tracking-tight text-text-primary mb-4">
                {productsQuery.isLoading ? "..." : productsCount.toLocaleString("fa-IR")}{" "}
                <span className="text-sm font-normal text-text-secondary">کالا</span>
              </div>
              <motion.div whileTap={{ scale: 0.95 }} transition={SYSTEM_SPRING}>
                <Link
                  to="/partner/products"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  مشاهده کاتالوگ محصولات
                  <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Purchases Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="border border-border bg-surface/60 backdrop-blur-md flex flex-col h-full justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-accent" />
                  سفارشات و خریدها
                </CardTitle>
                <Badge variant="outline" className="border-success/30 text-success bg-success/5">
                  تاریخچه رسمی
                </Badge>
              </div>
              <CardDescription className="mt-2 text-sm text-text-secondary">
                پیگیری خریدهای عمده، فاکتورهای رسمی B2B و وضعیت‌های آماده‌سازی و ارسال بار.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="text-3xl font-bold tracking-tight text-text-primary mb-4">
                {purchasesQuery.isLoading ? "..." : purchasesCount.toLocaleString("fa-IR")}{" "}
                <span className="text-sm font-normal text-text-secondary">سفارش</span>
              </div>
              <motion.div whileTap={{ scale: 0.95 }} transition={SYSTEM_SPRING}>
                <Link
                  to="/partner/purchases"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  مشاهده تاریخچه خریدها
                  <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
