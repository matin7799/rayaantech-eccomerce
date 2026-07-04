import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy route — the AI config screen was merged into the unified
 * /admin/ai control center. Kept as a redirect for existing bookmarks.
 */
export const Route = createFileRoute("/admin/ai-config")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/ai" });
  },
});
