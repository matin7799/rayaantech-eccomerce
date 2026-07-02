import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ContactAddresses } from "../components/contact/contact-addresses";
import { ContactChannels } from "../components/contact/contact-channels";
import { ContactTeam } from "../components/contact/contact-team";
import { ThemeToggle } from "../components/layout/header";

export const Route = createFileRoute("/social-info")({
  component: SocialInfoPage,
});

/**
 * SocialInfoPage - Orchestrator route for /social-info (Contact Us)
 *
 * Renders the brand channels, physical branch addresses, and separate
 * cards for each team member in a luxury and responsive layout.
 */
function SocialInfoPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <main className="mx-auto max-w-page-max p-8 flex flex-col gap-10">
        {/* Upper Action Bar with Theme Toggle */}
        <div className="w-full flex justify-between items-center pb-4 border-b border-border-light">
          <span className="text-xs font-semibold text-text-muted">موقعیت شما: ارتباط با ما</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">تغییر پوسته صفحه:</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-accent uppercase mb-2 block">
            پل‌های ارتباطی ما
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            ارتباط با مجموعه رایان تک
          </h1>
          <p className="mt-3 text-sm text-text-secondary max-w-2xl mx-auto">
            تیم کارشناسان و شعب فیزیکی رایان تک در تمامی مراحل خرید، مشاوره فنی و خدمات گارانتی
            پاسخگوی شما خواهند بود.
          </p>
        </motion.div>

        {/* Section 1: Social and Communication Channels */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <ContactChannels />
        </motion.div>

        {/* Section 2: Physical Branch Locations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ContactAddresses />
        </motion.div>

        {/* Section 3: Core Personnel & Team Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <ContactTeam />
        </motion.div>
      </main>
    </div>
  );
}
