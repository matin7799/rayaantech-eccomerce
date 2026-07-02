import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { mergeRouters } from "../trpc.init";
import { createAdminContentRouter } from "./admin/admin.content";
import { createAdminInstallmentsRouter } from "./admin/admin.installments";
import { createAdminOrdersRouter } from "./admin/admin.orders";
import { createAdminProductsRouter } from "./admin/admin.products";
import { createAdminStatsRouter } from "./admin/admin.stats";
import { createAdminStorageRouter } from "./admin/admin.storage";
import { createAdminTokensRouter } from "./admin/admin.tokens";
import { createAdminUsersRouter } from "./admin/admin.users";
import { createAdminVoiceRouter } from "./admin/admin.voice";

/**
 * Merges all sub-routers for admin operations.
 * This keeps each domain module clean and strictly under 300 lines.
 */
export function createAdminRouter(db: NodePgDatabase) {
  return mergeRouters(
    createAdminTokensRouter(db),
    createAdminStatsRouter(db),
    createAdminVoiceRouter(db),
    createAdminUsersRouter(db),
    createAdminOrdersRouter(db),
    createAdminContentRouter(db),
    createAdminProductsRouter(db),
    createAdminInstallmentsRouter(db),
    createAdminStorageRouter(db),
  );
}
