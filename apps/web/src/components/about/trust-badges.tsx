import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercentIcon,
  ChevronDownIcon,
  HeartHandshakeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { formatTomansPersian } from "../../lib/persian-numerals";
import { trpc } from "../../lib/trpc";

export function TrustBadges() {
  const [showPricingDetails, setShowPricingDetails] = useState(false);

  // Fetch pricing matrix parameters from server-side tRPC query
  const {
    data: matrix,
    isLoading,
    refetch,
    isFetching,
  } = trpc.products.getPricingMatrix.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  return (
    <section className="w-full py-12 px-1">
      <div className="text-center mb-12">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-accent uppercase mb-2 block">
          اصول بنیادین رایان تک
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
          چرا خریداران حرفه‌ای به ما اعتماد می‌کنند؟
        </h2>
        <p className="mt-3 text-sm text-text-secondary max-w-2xl mx-auto">
          ما خرید سخت‌افزار گران‌قیمت را با تضمین همه‌جانبه اصالت و قیمت‌گذاری شفاف به یک تجربه مطمئن
          تبدیل می‌کنیم.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
        {/* Pillar 1: 100% Genuine Inventory Guarantee */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden h-full"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-light text-success mb-5">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-3">
            ضمانت ۱۰۰٪ اصالت قطعات انبار
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            ما اصالت تک‌تک قطعات داخلی لپ‌تاپ‌ها و سرورها را تضمین می‌کنیم. سخت‌افزار دریافتی شما فاقد
            هرگونه قطعه تقلبی یا تعویض‌شده غیراستاندارد است.
          </p>
          <span className="text-[10px] font-semibold text-success bg-success-light/50 px-2.5 py-1 rounded-full">
            ضمانت اصالت قطعات انبار
          </span>
        </motion.div>

        {/* Pillar 2: Zero-Risk Local Warranty Layer */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden h-full"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent mb-5">
            <HeartHandshakeIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-3">
            گارانتی معتبر و پشتیبانی تخصصی
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            کلیه محصولات استوک و اوپن‌باکس با کارت گارانتی معتبر رایان تک به همراه مهلت تست تعویض و
            پشتیبانی فنی توسط مهندسین سخت‌افزار ارائه می‌شوند.
          </p>
          <span className="text-[10px] font-semibold text-accent bg-accent-light px-2.5 py-1 rounded-full">
            پشتیبانی فنی تخصصی
          </span>
        </motion.div>

        {/* Pillar 3: Transparent Pricing Matrix */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`bg-surface border p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 h-full ${
            showPricingDetails ? "border-accent ring-1 ring-accent" : "border-border"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-light text-warning mb-5">
            <BadgePercentIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-3">شفافیت کامل قیمت‌گذاری</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            ما حاشیه سود و فاکتورهای تاثیرگذار بر قیمت نهایی را به صورت عمومی اعلام می‌کنیم. هیچ
            هزینه پنهانی در فاکتور نهایی شما اعمال نخواهد شد.
          </p>

          <button
            type="button"
            onClick={() => setShowPricingDetails(!showPricingDetails)}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            <span>مشاهده ماتریس قیمت‌گذاری</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-300 ${showPricingDetails ? "rotate-180" : ""}`}
            />
          </button>
        </motion.div>
      </div>

      {/* Collapsible server-connected pricing matrix details */}
      <div className="max-w-4xl mx-auto mt-6">
        <AnimatePresence>
          {showPricingDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-[--glass-backdrop] backdrop-blur-md border border-[--glass-border] shadow-md mt-2">
                <div className="flex items-center justify-between border-b border-[--glass-border] pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <h4 className="text-sm font-bold text-text-primary">
                      محاسبه‌گر شفاف قیمت‌گذاری رایان تک
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isLoading || isFetching}
                    className="p-1.5 text-text-muted hover:text-accent rounded-lg border border-[--glass-border] transition-colors"
                    title="به‌روزرسانی داده‌ها"
                  >
                    <RefreshCwIcon
                      className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-accent" : ""}`}
                    />
                  </button>
                </div>

                {isLoading ? (
                  <div className="space-y-3 py-4">
                    <div className="h-4 bg-surface-secondary rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-surface-secondary rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-surface-secondary rounded animate-pulse w-5/6" />
                  </div>
                ) : matrix ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-surface/50 border border-[--glass-border] p-3.5 rounded-xl">
                        <span className="text-[10px] text-text-muted block">
                          تعرفه و هزینه‌های گمرکی
                        </span>
                        <span className="text-sm font-bold text-text-primary block mt-1">
                          ٪{matrix.baseImportFeePercentage}
                        </span>
                      </div>
                      <div className="bg-surface/50 border border-[--glass-border] p-3.5 rounded-xl">
                        <span className="text-[10px] text-text-muted block">
                          میانگین هزینه بهسازی و گارانتی
                        </span>
                        <span className="text-sm font-bold text-text-primary block mt-1">
                          {formatTomansPersian(matrix.refurbishmentInspectionsCostTomans)}
                        </span>
                      </div>
                      <div className="bg-surface/50 border border-[--glass-border] p-3.5 rounded-xl">
                        <span className="text-[10px] text-text-muted block">
                          سود منصفانه رایان تک
                        </span>
                        <span className="text-sm font-bold text-text-primary block mt-1">
                          ٪{matrix.averageMarginPercentage}
                        </span>
                      </div>
                      <div className="bg-surface/50 border border-[--glass-border] p-3.5 rounded-xl">
                        <span className="text-[10px] text-text-muted block">
                          مالیات بر ارزش افزوده قانونی
                        </span>
                        <span className="text-sm font-bold text-text-primary block mt-1">
                          ٪{matrix.vatRatePercentage}
                        </span>
                      </div>
                    </div>

                    <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-accent block mb-1">
                          فرمول محاسباتی قیمت نهایی:
                        </span>
                        <span className="text-text-secondary leading-relaxed">
                          {matrix.priceFormula}
                        </span>
                      </div>
                      <div className="sm:text-end shrink-0">
                        <span className="text-text-muted block">درصد تفاوت نسبت به رقبا (ترب)</span>
                        <span className="font-bold text-success text-sm block mt-0.5">
                          {Math.abs(matrix.torobComparisonAveragePercent)}٪ مناسب‌تر
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-text-muted mt-4 text-start">
                      * داده‌ها مستقیما از سرورهای مرکزی به صورت لحظه‌ای کوئری گرفته شده‌اند. آخرین
                      به‌روزرسانی نرخ تبدیل مرجع:{" "}
                      {new Date(matrix.lastExchangeRateUpdate).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-danger text-center">
                    خطا در دریافت اطلاعات نرخ‌ها از سرور.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
