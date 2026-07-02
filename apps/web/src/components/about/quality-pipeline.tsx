import { AnimatePresence, motion } from "framer-motion";
import {
  BatteryChargingIcon,
  ChevronLeftIcon,
  ClipboardListIcon,
  CpuIcon,
  MonitorIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UnplugIcon,
} from "lucide-react";
import { useState } from "react";

interface AuditStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

const AUDIT_STEPS: AuditStep[] = [
  {
    id: 1,
    title: "دریافت و ثبت اصالت اولیه",
    subtitle: "تطبیق فیزیکی و شماره سریال قطعات",
    description:
      "هر دستگاه هنگام ورود به انبار رایان تک، تحت بررسی اصالت هولوگرام، مطابقت شماره سریال‌های سخت‌افزاری و بررسی سلامت فیزیکی بدنه قرار می‌گیرد تا از صحت و پیشینه اورجینال آن اطمینان حاصل شود.",
    icon: <ClipboardListIcon className="h-6 w-6" />,
    details: [
      "تطبیق شماره سریال قطعات داخلی با بایوس",
      "تایید عدم وجود آثار ضربه فیزیکی شدید",
      "دسته‌بندی اولیه بر اساس کانفیگ کارخانه",
    ],
  },
  {
    id: 2,
    title: "تست استرس و توان پردازشی",
    subtitle: "تست سخت‌افزاری عمیق در لودهای سنگین",
    description:
      "پردازنده و کارت گرافیک دستگاه تحت آزمون‌های استرس طولانی‌مدت (مثل FurMark و Cinebench) قرار می‌گیرند تا پایداری حرارتی و فرکانس کاری ایمن آن‌ها تحت فشار شدید تضمین گردد.",
    icon: <CpuIcon className="h-6 w-6" />,
    details: [
      "تست ۲۴ ساعته پایداری ولتاژ مادربرد",
      "پایش دمای هسته‌ها و عملکرد سیستم خنک‌کننده",
      "بررسی کارت گرافیک در فریم‌ریت‌های بالا",
    ],
  },
  {
    id: 3,
    title: "ممیزی سلامت باتری و مدار شارژ",
    subtitle: "تضمین راندمان و ظرفیت واقعی باتری",
    description:
      "ظرفیت باقی‌مانده باتری، چرخه‌های شارژ (Cycle Count) و پایداری آداپتور اصلی تحلیل می‌شوند. باتری‌هایی که ظرفیت مفید آن‌ها کمتر از ۸۵٪ باشد، طبق استانداردهای رایان تک تعویض خواهند شد.",
    icon: <BatteryChargingIcon className="h-6 w-6" />,
    details: [
      "محاسبه ظرفیت واقعی باتری (Health Rate > 85%)",
      "تست دشارژ پیوسته تحت بار پردازشی متوسط",
      "تست پایداری و عدم نوسان ولتاژ آداپتور شارژ",
    ],
  },
  {
    id: 4,
    title: "نقشه‌برداری و تست درگاه‌ها",
    subtitle: "کنترل فیزیکی و سیگنالینگ اتصالات",
    description:
      "تک‌تک درگاه‌های ورودی و خروجی فیزیکی و ماژول‌های ارتباطی بی‌سیم از منظر سرعت انتقال داده و برقراری اتصال پایدار با ابزارهای تست اندازه‌گیری و سنجیده می‌شوند.",
    icon: <UnplugIcon className="h-6 w-6" />,
    details: [
      "تست سرعت انتقال پورت‌های USB و Type-C",
      "بررسی خروجی‌های تصویر HDMI و DisplayPort",
      "بررسی کارت شبکه، بلوتوث و ماژول Wi-Fi",
    ],
  },
  {
    id: 5,
    title: "بازبینی میکروسکوپی صفحه‌نمایش",
    subtitle: "ردیابی هاله‌های نوری و پیکسل سوخته",
    description:
      "صفحه‌نمایش لپ‌تاپ در طیف‌های نوری مختلف و پس‌زمینه‌های تک‌رنگ بررسی می‌شود تا هرگونه پیکسل سوخته، نشت نور در حاشیه‌ها (Backlight Bleed) یا افت کیفیت رنگ ردیابی و اصلاح شود.",
    icon: <MonitorIcon className="h-6 w-6" />,
    details: [
      "جستجوی پیکسل‌های سوخته و نیمه‌سوخته",
      "اندازه‌گیری روشنایی (Nits) و کنتراست پنل",
      "تست سنسورهای تنظیم نور خودکار",
    ],
  },
  {
    id: 6,
    title: "سرویس حرارتی و پولیش ظاهری",
    subtitle: "گردگیری کامل و تعویض خمیر سیلیکون",
    description:
      "سیستم خنک‌کننده دستگاه باز شده، فن‌ها شستشو و گریس‌کاری می‌شوند. خمیر سیلیکون فابریک با خمیرهای رده‌بالا (مانند Noctua یا Thermal Grizzly) جایگزین شده و خط‌وخش‌های جزئی بدنه پولیش می‌شوند.",
    icon: <SparklesIcon className="h-6 w-6" />,
    details: [
      "پاک‌سازی کامل هیت‌سینک و فن‌ها از گرد و غبار",
      "تعویض خمیر حرارتی پردازنده و پدهای حرارتی حافظه",
      "پولیش نانو و شستشوی آنتی‌باکتریال قطعات بدنه",
    ],
  },
  {
    id: 7,
    title: "شناسنامه فنی و پلمپ نهایی",
    subtitle: "درج هولوگرام گارانتی و بسته‌بندی ضدضربه",
    description:
      "پس از موفقیت در تمام مراحل پیشین، گزارش تست‌های فنی (QC Pass) صادر شده، هولوگرام امنیتی گارانتی رایان تک روی بدنه نصب شده و دستگاه در پکیج ضد ضربه اختصاصی پلمپ می‌گردد.",
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    details: [
      "صدور شناسنامه سلامت فنی با تایید ناظر کیفی",
      "نصب هولوگرام امنیتی و ثبت کد فعال‌سازی گارانتی",
      "بسته‌بندی چندلایه فوم پلی‌اتیلن و پارت‌نامبر یونیک",
    ],
  },
];

export function QualityPipeline() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStep = AUDIT_STEPS.find((s) => s.id === activeStep) || AUDIT_STEPS[0];

  return (
    <section className="w-full py-12 px-1">
      <div className="text-center mb-10">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-accent uppercase mb-2 block">
          پایپ‌لاین ارزیابی و تضمین کیفیت
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
          هفت مرحله ممیزی و تست سخت‌افزار
        </h2>
        <p className="mt-3 text-sm text-text-secondary max-w-2xl mx-auto">
          ما تمام تجهیزات اوپن‌باکس و استوک را پیش از تحویل به مشتریان، در آزمایشگاه تخصصی رایان تک
          تحت این ۷ مرحله ممیزی دقیق سخت‌افزاری و نرم‌افزاری قرار می‌دهیم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Left Column: Navigation Stepper (5 columns on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
          {AUDIT_STEPS.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-4 p-4 rounded-xl border text-start transition-all duration-300 ${
                  isActive
                    ? "bg-surface border-accent shadow-md z-10"
                    : "bg-surface-secondary/40 border-border hover:bg-surface hover:border-accent/40"
                }`}
              >
                {/* Visual Glow Layer on Active Card (Mesh Glow) */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none -z-10" />
                )}

                {/* Step Circle Indicator */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "bg-surface border border-border text-text-secondary"
                  }`}
                >
                  {step.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${isActive ? "text-accent" : "text-text-muted"}`}
                    >
                      مرحله {step.id} از ۷
                    </span>
                    {isActive && (
                      <ChevronLeftIcon className="h-4 w-4 text-accent animate-pulse me-1" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary truncate mt-1">
                    {step.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Display spotlight details (7 columns on desktop) */}
        <div className="lg:col-span-7 flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[--glass-backdrop] backdrop-blur-md border border-[--glass-border] shadow-lg relative overflow-hidden"
            >
              {/* Decorative Mesh Glow Spot */}
              <div className="absolute -end-16 -top-16 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none -z-10" />
              <div className="absolute -start-16 -bottom-16 w-32 h-32 bg-accent-light/20 rounded-full blur-2xl pointer-events-none -z-10" />

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent border border-accent/20">
                    {currentStep.icon}
                  </div>
                  <div>
                    <span className="text-xs text-text-muted font-medium">ممیزی فنی انبار</span>
                    <h3 className="text-lg font-bold text-text-primary">{currentStep.title}</h3>
                  </div>
                </div>

                <p className="text-sm leading-7 text-text-secondary mb-6">
                  {currentStep.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-text-primary border-b border-[--glass-border] pb-2">
                    چک‌لیست بررسی فنی در این مرحله:
                  </h4>
                  <ul className="space-y-2">
                    {currentStep.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-xs text-text-secondary"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[--glass-border] flex items-center justify-between text-xs text-text-muted">
                <span>تضمین سلامت فنی رایان تک</span>
                <span className="font-semibold text-accent">گذرنامه کیفی صادر شد</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
