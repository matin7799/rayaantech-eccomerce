import * as React from "react";

export function CheckoutShell() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="mb-8 text-xl font-bold text-text-primary">تکمیل سفارش</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 rounded-2xl bg-surface-secondary animate-pulse" />
          <div className="h-32 rounded-2xl bg-surface-secondary animate-pulse" />
        </div>
        <div className="h-64 rounded-2xl bg-surface-secondary animate-pulse" />
      </div>
    </div>
  );
}
