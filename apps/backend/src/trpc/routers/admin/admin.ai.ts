import { type AiConfig, aiConfigUpdateSchema, DEFAULT_AI_CONFIG } from "@rayan-tech/types";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const AI_CONFIG_KEY = "ai_config";

/**
 * Read the persisted AI config, merged over code-level defaults.
 *
 * Tolerant by design: if the `app_settings` table does not exist yet (migration
 * not applied) or the row is missing, we transparently return defaults so the
 * admin UI and consultation pipeline keep working.
 */
async function readAiConfig(db: NodePgDatabase): Promise<AiConfig> {
  try {
    const result = await db.execute<{ value: Record<string, unknown> }>(
      sql`SELECT value FROM app_settings WHERE key = ${AI_CONFIG_KEY} LIMIT 1`,
    );
    const stored = result.rows[0]?.value ?? {};
    return { ...DEFAULT_AI_CONFIG, ...stored };
  } catch {
    return { ...DEFAULT_AI_CONFIG };
  }
}

/**
 * Admin AI configuration router — persists AvalAI assistant settings so admins
 * can steer the consultant (models, sampling, quotas, persona) without a deploy.
 */
export function createAdminAiRouter(db: NodePgDatabase) {
  return router({
    /** Fetch the effective AI config (persisted overrides merged over defaults). */
    getAiConfig: adminProcedure.query(async () => {
      return readAiConfig(db);
    }),

    /**
     * Patch the AI config. Accepts a partial payload, merges it over the current
     * effective config, and upserts a single JSON row keyed by `ai_config`.
     */
    updateAiConfig: adminProcedure.input(aiConfigUpdateSchema).mutation(async ({ input }) => {
      const current = await readAiConfig(db);
      const next: AiConfig = { ...current, ...input };
      const serialized = JSON.stringify(next);

      await db.execute(sql`
        INSERT INTO app_settings (key, value, updated_at)
        VALUES (${AI_CONFIG_KEY}, ${serialized}::json, NOW())
        ON CONFLICT (key)
        DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `);

      return { success: true, config: next };
    }),
  });
}
