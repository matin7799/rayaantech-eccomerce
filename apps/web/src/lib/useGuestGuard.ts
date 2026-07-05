import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useSession } from "./useSession";

/**
 * useGuestGuard — redirects already-authenticated visitors away from
 * guest-only pages (/auth/login, /auth/register, …).
 *
 * The redirect only fires when the user *arrives* on the page while logged in.
 * Once the auth flow itself starts (phone submitted, register clicked), call
 * `markFlowStarted()` to suppress the guard — otherwise the session created
 * mid-flow would race the flow's own success navigation (e.g. the
 * isNewUser → /auth/complete-profile branch).
 *
 * @param redirectTo Target when a session already exists (default "/", pass ?from=)
 */
export function useGuestGuard(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();
  const flowStartedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !flowStartedRef.current) {
      void navigate({ to: (redirectTo || "/") as string, replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, redirectTo]);

  return {
    /** Call when the user actively begins authenticating on this page. */
    markFlowStarted: () => {
      flowStartedRef.current = true;
    },
    /** True while the session is still resolving (render a skeleton, not the form). */
    isCheckingSession: isLoading,
    isAuthenticated,
  };
}
