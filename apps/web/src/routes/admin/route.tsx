import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { useSession } from "../../lib/useSession";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

/**
 * /admin — Enterprise Admin Dashboard Layout.
 *
 * Structural isolation from the public storefront:
 * - No Header/Footer from __root (overridden at this layout level)
 * - Sticky left-hand sidebar navigation (h-screen)
 * - Flexible content grid constrained to 1440px max-width
 * - Inherits providers (tRPC, QueryClient, theme) from __root.tsx
 */
function AdminLayout() {
  const { isAuthenticated, isLoading, session } = useSession();
  const navigate = useNavigate();

  if (!(isLoading || isAuthenticated)) {
    navigate({ to: "/auth/login", search: { from: "/admin" } });
    return null;
  }

  if (isLoading) {
    return <AdminLayoutSkeleton />;
  }

  // Route Jail check: Non-admin users attempting to access /admin/*
  if (session && session.role !== "admin" && session.role !== "operator") {
    window.location.replace("/partner/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — sticky, full height */}
      <AdminSidebar />

      {/* Main content workspace */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1440px] p-8 gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminLayoutSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 flex-col gap-4 border-e border-border bg-surface p-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-secondary" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-xl bg-surface-secondary" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}
