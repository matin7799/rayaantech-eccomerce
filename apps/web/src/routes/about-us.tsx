import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AwardIcon, BuildingIcon, TruckIcon, UsersIcon } from "lucide-react";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";

export const Route = createFileRoute("/about-us")({
  component: AboutUsPage,
});

/**
 * /about-us — Brand core page.
 *
 * Presents company identity, mission, and values.
 * Mobile-first, RTL-aware, glassmorphism design tokens.
 */
function AboutUsPage() {
  return (
    <ScrollArea className="h-[calc(100dvh-5rem)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">درباره رایان تک</h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
            رایان تک از سال ۱۳۹۸ با هدف ارائه سخت‌افزار اوپن‌باکس و استوک شرکتی با بالاترین کیفیت و
            مناسب‌ترین قیمت فعالیت خود را آغاز کرده است. ما متعهدیم به مشتریان خود محصولاتی با
            گارانتی معتبر و خدمات پس از فروش حرفه‌ای ارائه دهیم.
          </p>
        </section>

        {/* Values Grid */}
        <section className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ValueCard
              icon={<AwardIcon className="h-6 w-6" />}
              title="کیفیت تضمین‌شده"
              description="تمامی محصولات قبل از ارسال توسط تیم فنی بررسی و تأیید می‌شوند"
            />
            <ValueCard
              icon={<TruckIcon className="h-6 w-6" />}
              title="ارسال سریع"
              description="ارسال به سراسر ایران با بسته‌بندی ایمن و مطمئن"
            />
            <ValueCard
              icon={<UsersIcon className="h-6 w-6" />}
              title="پشتیبانی حرفه‌ای"
              description="تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست"
            />
            <ValueCard
              icon={<BuildingIcon className="h-6 w-6" />}
              title="سابقه طولانی"
              description="بیش از ۵ سال تجربه در زمینه فروش تجهیزات سخت‌افزاری"
            />
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto mt-12 max-w-3xl">
          <Card className="border-border bg-surface-glass p-6 backdrop-blur-md shadow-glass">
            <h2 className="text-lg font-semibold text-text-primary mb-3">داستان ما</h2>
            <p className="text-sm leading-7 text-text-secondary">
              رایان تک با نگاهی نو به بازار سخت‌افزار ایران وارد شد. ما معتقدیم هر کاربری حق دارد با
              بودجه معقول به محصولات باکیفیت دسترسی داشته باشد. محصولات استوک شرکتی و اوپن‌باکس ما
              مستقیماً از شرکت‌های معتبر بین‌المللی تأمین می‌شود و همگی دارای گارانتی رایان تک هستند.
            </p>
          </Card>
        </section>
      </motion.div>
    </ScrollArea>
  );
}

/* ─── Value Card ─── */

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex items-start gap-4 border-border bg-surface p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
