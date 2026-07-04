import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PartnerNavbar } from "../components/partner/PartnerNavbar";
import { useSession } from "../lib/useSession";

export const Route = createFileRoute("/_partner")({
  component: PartnerLayout,
});

/**
 * Roles permitted inside the B2B Partner Portal.
 *
 * `wholesale` — verified partners (primary audience).
 * `admin` / `operator` — staff, so they can inspect the partner experience and data.
 */
const PARTNER_ALLOWED_ROLES = new Set(["wholesale", "admin", "operator"]);

/**
 * Pathless parent layout route for the B2B Partner Portal.
 *
 * Session guard: Redirects unauthenticated users or non-permitted roles to /auth/login.
 * Route Jail: wholesale partners plus admin/operator staff — any other role is refused.
 */
function PartnerLayout() {
  const { isAuthenticated, isLoading, session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    // No session → send to login
    if (!(isAuthenticated && session)) {
      navigate({ to: "/auth/login", search: { from: "/partner/dashboard" } });
      return;
    }

    // Session present but wrong role → deny access (hard redirect)
    if (!PARTNER_ALLOWED_ROLES.has(session.role)) {
      navigate({ to: "/auth/login", search: { from: "/partner/dashboard" } });
    }
  }, [isLoading, isAuthenticated, session, navigate]);

  if (isLoading) {
    return <PartnerLayoutSkeleton />;
  }

  if (!(isAuthenticated && session && PARTNER_ALLOWED_ROLES.has(session.role))) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PartnerNavbar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-page-max p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function PartnerLayoutSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-14 border-b border-border bg-surface/60 backdrop-blur-md" />
      <div className="mx-auto max-w-page-max w-full p-8 flex flex-col gap-6">
        <div className="h-32 animate-pulse rounded-2xl bg-surface-secondary" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 animate-pulse rounded-2xl bg-surface-secondary" />
          <div className="h-48 animate-pulse rounded-2xl bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}
