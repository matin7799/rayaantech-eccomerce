import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { mergeRouters } from "../trpc.init";
import { createProfileAddressRouter } from "./profile/profile.address";
import { createProfileInfoRouter } from "./profile/profile.info";
import { createProfileOrdersRouter } from "./profile/profile.orders";
import { createProfileWishlistRouter } from "./profile/profile.wishlist";

/**
 * Merges all sub-routers for profile operations.
 * This keeps each domain module clean and strictly under 300 lines.
 */
export function createProfileRouter(db: NodePgDatabase) {
  return mergeRouters(
    createProfileInfoRouter(db),
    createProfileAddressRouter(db),
    createProfileOrdersRouter(db),
    createProfileWishlistRouter(db),
  );
}

export type ProfileRouter = ReturnType<typeof createProfileRouter>;
