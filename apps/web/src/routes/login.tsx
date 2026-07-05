import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /login — legacy alias. The real login flow lives at /auth/login
 * (this route previously rendered a mocked AuthFlow that never hit the API).
 */
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/auth/login" });
  },
});
