import { motion } from "framer-motion";

/**
 * ManifestoHero - Section 1
 *
 * Immersive brand manifesto hero component using local Yekan Bakh typography,
 * liquid glassmorphism background, and zero layout shift design.
 */
export function ManifestoHero() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-6 sm:p-12 md:p-16">
      {/* Background dynamic mesh/gradient base to build visual depth (prevents layout shift) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-accent-light/10 to-transparent -z-20" />

      {/* Dynamic ambient blur blobs */}
      <div className="absolute -start-10 -top-10 w-48 h-48 sm:w-72 sm:h-72 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute -end-10 -bottom-10 w-48 h-48 sm:w-72 sm:h-72 bg-accent-light/30 rounded-full blur-3xl -z-10" />

      {/* Hero Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-4xl bg-[--glass-backdrop] backdrop-blur-md border border-[--glass-border] rounded-2xl p-8 sm:p-12 md:p-16 text-center shadow-lg transition-colors duration-300 ease-in-out"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-accent mb-4 px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
        >
          رایان تک • مرجع تخصصی سخت‌افزار
        </motion.span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight sm:leading-none mb-6">
          آینده سخت‌افزار، <span className="text-accent">اصالت پایدار</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed mb-8">
          ما در رایان تک بر این باوریم که دسترسی به سخت‌افزار کلاس سازمانی و لپ‌تاپ‌های اوپن‌باکس
          باکیفیت نباید یک گزینه تجملاتی باشد. تعهد ما به شفافیت، اصالت قطعات و گارانتی بی‌قیدوشرط،
          پلی است میان نیازهای پردازشی شما و بهترین تجهیزات روز دنیا.
        </p>

        {/* Visual proof badges inside hero */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-[--glass-border]">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-accent">+۵ سال</span>
            <span className="text-xs text-text-muted mt-1">سابقه در بازار سخت‌افزار</span>
          </div>
          <div className="flex flex-col items-center border-s border-[--glass-border]">
            <span className="text-xl sm:text-2xl font-bold text-accent">+۱۰,۰۰۰</span>
            <span className="text-xs text-text-muted mt-1">مشتری راضی و فعال</span>
          </div>
          <div className="hidden md:flex flex-col items-center border-s border-[--glass-border]">
            <span className="text-xl sm:text-2xl font-bold text-accent">۱۰۰٪</span>
            <span className="text-xs text-text-muted mt-1">تضمین سلامت فنی قطعات</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
