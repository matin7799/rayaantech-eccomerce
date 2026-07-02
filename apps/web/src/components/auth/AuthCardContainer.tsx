import type { ReactNode } from "react";

interface AuthCardContainerProps {
  children: ReactNode;
}

/**
 * AuthCardContainer — Premium centered auth card wrapper.
 * Full-viewport centered layout with floating card, brand logo, and elevation.
 */
export default function AuthCardContainer({ children }: AuthCardContainerProps) {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-6">
        {/* Brand Logo */}
        <img
          src="/images/logo-icon.svg"
          alt="رایان تک"
          className="h-12 w-12"
          style={{ aspectRatio: "1 / 1" }}
        />

        {/* Auth Card */}
        <div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/10 transition-colors duration-300 ease-in-out sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
