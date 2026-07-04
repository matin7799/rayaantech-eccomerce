import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy route — AI diagnostics were merged into the unified /admin/ai
 * control center (پایش زنده tab). Kept as a redirect for existing bookmarks.
 */
export const Route = createFileRoute("/admin/ai-diagnostics")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/ai" });
  },
});
