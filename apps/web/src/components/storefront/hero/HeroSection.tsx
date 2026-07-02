import HeroSlider from "./HeroSlider";
import TrustBadgeGrid from "./TrustBadgeGrid";

/**
 * HeroSection — Main homepage hero block.
 * Stacks the carousel slider and trust badge grid vertically
 * within the page max-width constraint.
 */
export default function HeroSection() {
  return (
    <section className="mx-auto flex w-full max-w-page-max flex-col gap-6 py-6">
      <HeroSlider />
      <TrustBadgeGrid />
    </section>
  );
}
