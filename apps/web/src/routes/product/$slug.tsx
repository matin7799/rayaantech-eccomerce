import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy /product/<slug> compatibility route.
 *
 * Torob (and any older external links) point at /product/<slug>?torob_clid=...
 * while the storefront PDP lives at /products/<slug>. Without this route those
 * links land on the 404 page and the Torob click-id is lost.
 *
 * The redirect is thrown in beforeLoad so it happens server-side on first load,
 * and `search: true` carries the FULL query string (torob_clid, utm_*) over to
 * the canonical URL — the referral signal must survive the hop.
 */
export const Route = createFileRoute("/product/$slug")({
  validateSearch: (search: Record<string, unknown>) => search,
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/products/$slug",
      params: { slug: params.slug },
      search: true,
      replace: true,
    });
  },
});
