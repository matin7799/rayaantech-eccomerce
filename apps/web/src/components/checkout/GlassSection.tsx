import type * as React from "react";

interface GlassSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function GlassSection({ title, icon, children }: GlassSectionProps) {
  return (
    <div className="rounded-2xl border border-[--glass-border] bg-surface-glass p-5 backdrop-blur-md shadow-glass">
      <div className="mb-4 flex items-center gap-2">
        {icon && <span className="text-accent">{icon}</span>}
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}
