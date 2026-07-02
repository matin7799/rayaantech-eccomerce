import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({ component: AuthLayout });

/**
 * Auth Layout — Shared container for /auth/* routes.
 * Full-viewport centered layout with layered glassmorphism backdrop.
 * RTL-safe, responsive, and visually premium.
 */
function AuthLayout() {
  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-10">
      {/* Ambient gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, var(--color-accent)/0.08, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 70%, var(--color-accent)/0.05, transparent 60%)",
        }}
      />

      {/* Glassmorphism floating layers (decorative) */}
      <div className="pointer-events-none absolute -top-20 start-1/4 -z-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 end-1/4 -z-10 h-56 w-56 rounded-full bg-accent/8 blur-2xl" />

      {/* Main content card */}
      <div className="flex w-full max-w-[440px] flex-col items-center gap-6">
        {/* Brand Logo */}
        <img
          src="/images/logo-icon.svg"
          alt="رایان تک"
          className="h-12 w-12"
          style={{ aspectRatio: "1 / 1" }}
        />

        {/* Glass Card */}
        <div className="w-full rounded-3xl border border-white/20 bg-surface/80 p-6 shadow-2xl shadow-black/10 ring-1 ring-white/10 backdrop-blur-xl transition-colors duration-300 ease-in-out dark:border-white/10 dark:bg-surface/60 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
