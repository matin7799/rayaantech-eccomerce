import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ManifestoHero } from "../components/about/manifesto-hero";
import { QualityPipeline } from "../components/about/quality-pipeline";
import { TeamLedger } from "../components/about/team-ledger";
import { TrustBadges } from "../components/about/trust-badges";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

/**
 * AboutPage - Orchestrator route for /about
 *
 * Combines ManifestoHero, QualityPipeline, TrustBadges, and TeamLedger.
 * Follows strict maximum width of 1440px, centered layout, RTL, and spacing budgets.
 */
function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <main className="mx-auto max-w-page-max p-8 flex flex-col gap-12 sm:gap-16">
        {/* Section 1: Brand Manifesto Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ManifestoHero />
        </motion.div>

        {/* Section 2: Interactive Quality Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <QualityPipeline />
        </motion.div>

        {/* Section 3: Trust Badges (Server-Connected) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <TrustBadges />
        </motion.div>

        {/* Section 4: Team Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <TeamLedger />
        </motion.div>
      </main>
    </div>
  );
}
