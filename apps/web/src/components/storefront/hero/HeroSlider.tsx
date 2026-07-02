import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, CreditCard, Gamepad2, Laptop, Smartphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Slide Data ─── */

interface HeroSlide {
  id: string;
  gradient: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  badge: string;
}

const SLIDES: readonly HeroSlide[] = [
  {
    id: "laptops",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    icon: Laptop,
    title: "لپ‌تاپ‌های اوپن‌باکس شرکتی",
    subtitle: "گارانتی اصالت · بهترین قیمت بازار",
    cta: "مشاهده لپ‌تاپ‌ها",
    href: "/products?category=laptops",
    badge: "پرفروش‌ترین",
  },
  {
    id: "installments",
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
    icon: CreditCard,
    title: "شرایط اقساط ویژه",
    subtitle: "بدون ضامن · کمترین کارمزد",
    cta: "اطلاعات بیشتر",
    href: "/installments",
    badge: "ویژه",
  },
  {
    id: "mobile",
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
    icon: Smartphone,
    title: "جدیدترین گوشی‌های موبایل",
    subtitle: "واردات مستقیم · تضمین قیمت",
    cta: "مشاهده موبایل‌ها",
    href: "/products?category=mobile",
    badge: "جدید",
  },
  {
    id: "console",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    icon: Gamepad2,
    title: "کنسول‌های بازی نسل جدید",
    subtitle: "PS5 · Xbox Series · Nintendo Switch",
    cta: "مشاهده کنسول‌ها",
    href: "/products?category=console",
    badge: "موجود",
  },
];

const SLIDE_SPRING = { type: "spring" as const, stiffness: 400, damping: 32 };
const AUTO_PLAY_INTERVAL = 5000;

/**
 * HeroSlider — Compact, outstanding carousel with card-style slides.
 * Shorter height, side-peek design showing next/prev slide edges.
 */
export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isPaused = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Auto-play */
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex((prev) => (prev + 1) % SLIDES.length);
      }
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [mounted]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="اسلایدر تصاویر"
      className="relative overflow-hidden rounded-2xl border border-border-light bg-surface transition-colors duration-300 ease-in-out"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      {/* Slides Container */}
      <div className="relative h-[200px] sm:h-[240px] lg:h-[280px]">
        <AnimatePresence mode="wait">
          {SLIDES.map((slide, idx) => {
            if (idx !== activeIndex) return null;
            const Icon = slide.icon;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={SLIDE_SPRING}
                className="absolute inset-0 flex items-center"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-linear-to-l ${slide.gradient}`} />

                {/* Content */}
                <div className="relative z-10 flex w-full items-center justify-between px-8 sm:px-12 lg:px-16">
                  {/* Text side */}
                  <div className="flex max-w-md flex-col gap-3">
                    {/* Badge */}
                    <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
                      {slide.badge}
                    </span>
                    <h2 className="text-xl font-bold text-text-primary sm:text-2xl lg:text-3xl">
                      {slide.title}
                    </h2>
                    <p className="text-sm font-medium text-text-secondary">{slide.subtitle}</p>
                    <Link
                      to={slide.href}
                      className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                    >
                      {slide.cta}
                      <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </div>

                  {/* Icon side — large decorative icon */}
                  <div className="hidden sm:flex">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, ...SLIDE_SPRING }}
                      className="flex h-28 w-28 items-center justify-center rounded-3xl bg-accent/10 lg:h-36 lg:w-36"
                    >
                      <Icon className="h-14 w-14 text-accent lg:h-16 lg:w-16" aria-hidden="true" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom bar — arrows + dots */}
      <div className="flex items-center justify-between border-t border-border-light px-4 py-2.5">
        {/* Arrows */}
        <div className="flex items-center gap-1.5">
          <motion.button
            type="button"
            onClick={mounted ? goPrev : undefined}
            whileTap={mounted ? { scale: 0.96 } : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent ${!mounted ? "pointer-events-none opacity-0" : ""}`}
            aria-label="اسلاید قبلی"
            aria-hidden={!mounted}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={mounted ? goNext : undefined}
            whileTap={mounted ? { scale: 0.96 } : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent ${!mounted ? "pointer-events-none opacity-0" : ""}`}
            aria-label="اسلاید بعدی"
            aria-hidden={!mounted}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={slide.id}
                type="button"
                onClick={() => goTo(idx)}
                animate={{
                  width: isActive ? 20 : 6,
                  opacity: isActive ? 1 : 0.4,
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  isActive ? "bg-accent" : "bg-text-muted"
                }`}
                aria-label={`اسلاید ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Counter */}
        <span className="text-xs font-medium text-text-muted">
          {activeIndex + 1} / {SLIDES.length}
        </span>
      </div>
    </section>
  );
}
