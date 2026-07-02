import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CreditCard, Headphones, Lock, ShieldCheck } from "lucide-react";

/* ─── Badge Data ─── */

interface TrustBadge {
  id: string;
  icon: LucideIcon;
  heading: string;
  subtext: string;
}

const BADGES: readonly TrustBadge[] = [
  {
    id: "installments",
    icon: CreditCard,
    heading: "انواع شرایط اقساط ویژه",
    subtext: "خرید آسان",
  },
  {
    id: "authenticity",
    icon: ShieldCheck,
    heading: "ضمانت اصالت کالا",
    subtext: "تضمین کیفیت و اصل بودن",
  },
  {
    id: "support",
    icon: Headphones,
    heading: "پشتیبانی ۲۴/۷",
    subtext: "همیشه در کنار شما هستیم",
  },
  {
    id: "payment",
    icon: Lock,
    heading: "پرداخت امن",
    subtext: "تضمین امنیت تراکنش‌ها",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * TrustBadgeGrid — Compact horizontal trust badges.
 * Desktop: 4 inline cards. Mobile: 2x2 grid.
 */
export default function TrustBadgeGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.id}
            variants={cardVariants}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-xl border border-border-light bg-surface px-4 py-3 transition-shadow duration-300 ease-in-out hover:shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light">
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-semibold text-text-primary sm:text-sm">
                {badge.heading}
              </h3>
              <p className="text-[10px] font-medium text-text-muted sm:text-xs">{badge.subtext}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
