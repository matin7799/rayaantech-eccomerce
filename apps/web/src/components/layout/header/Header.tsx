import { DesktopHeader } from "./DesktopHeader";
import MobileBottomNav from "./MobileBottomNav";
import MobileTopBar from "./MobileTopBar";

/**
 * Header — Thin viewport-aware orchestrator.
 * Renders DesktopHeader (≥1024px) OR MobileTopBar + MobileBottomNav (<1024px).
 * Viewport switching is handled via CSS (hidden/block) for instant SSR rendering.
 */
export default function Header() {
  return (
    <>
      {/* Desktop: full navigation header */}
      <DesktopHeader />

      {/* Mobile: compact top bar + sticky bottom nav */}
      <MobileTopBar />
      <MobileBottomNav />
    </>
  );
}
