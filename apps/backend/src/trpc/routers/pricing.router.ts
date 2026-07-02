import { resolvePricingContext } from "../../pricing/pricing.service";
import { publicProcedure, router } from "../trpc.init";

/**
 * Pricing context tRPC router.
 *
 * Provides a lightweight endpoint the frontend polls to sync the Torob
 * countdown banner and detect tier changes without re-fetching the
 * entire catalog.
 *
 * `refetchInterval: 60_000` on the client gives drift-corrected TTL
 * while the local Zustand clock handles the per-second visual tick.
 */
export function createPricingRouter() {
  return router({
    context: publicProcedure.query(({ ctx }) => {
      return resolvePricingContext(ctx.buyer);
    }),
  });
}

export type PricingRouter = ReturnType<typeof createPricingRouter>;
