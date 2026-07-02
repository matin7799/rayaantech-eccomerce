import type { AppRouter } from "@rayan-tech/backend/trpc";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

/**
 * Type-safe tRPC React hooks.
 * Infers all procedure types from the backend AppRouter.
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Backend API base URL.
 * In development: points to the NestJS backend on port 3003.
 * In production: use relative /trpc (reverse proxy handles routing).
 */
function getBaseUrl(): string {
  if (typeof window === "undefined") {
    // SSR — use absolute URL
    return process.env.API_URL ?? "http://localhost:3003";
  }
  // Browser — use env or default to backend port
  return (window as { __API_URL__?: string }).__API_URL__ ?? "http://localhost:3003";
}

/**
 * Extract cookies from the SSR request context for forwarding to the backend.
 * In browser environment, cookies are sent automatically via credentials: 'include'.
 * In SSR, we must manually forward them from the incoming page request.
 */
function getSSRHeaders(): Record<string, string> {
  if (typeof window !== "undefined") return {};

  // TanStack Start passes request context through AsyncLocalStorage or global
  // For SSR in this stack, cookies are handled by the browser's credential mode.
  // If SSR context is available, forward cookies here.
  try {
    // Access the SSR request headers if available via globalThis or context
    const cookieHeader = (globalThis as { __SSR_COOKIE__?: string }).__SSR_COOKIE__;
    if (cookieHeader) {
      return { cookie: cookieHeader };
    }
  } catch {
    // No SSR context available — safe to proceed without cookies
  }

  return {};
}

/**
 * Create the tRPC client instance configured for the backend.
 *
 * Critical cookie handling:
 * - Browser: credentials: 'include' sends httpOnly cookies automatically
 * - SSR: Forward incoming request cookies via headers for session resolution
 *
 * The credentials option is set BOTH at the link level and in the custom fetch
 * to ensure compatibility across all tRPC internals and fetch implementations.
 */
export function createTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
        // Forward SSR cookies for server-side session resolution
        headers: getSSRHeaders,
        fetch(url, options) {
          let targetUrl = typeof url === "string" ? url : url.toString();
          if (
            typeof window !== "undefined" &&
            window.location.search.includes("utm_source=torob")
          ) {
            const separator = targetUrl.includes("?") ? "&" : "?";
            targetUrl = `${targetUrl}${separator}utm_source=torob`;
          }
          return fetch(targetUrl, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });
}
