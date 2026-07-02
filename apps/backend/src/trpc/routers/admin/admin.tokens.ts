import { createHash, randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const createApiTokenSchema = z.object({
  name: z.string().min(1).max(255),
  scopes: z.array(z.string()).min(1),
  ttlDays: z.number().int().min(1).max(365).optional().default(90),
});

const flushTorobCacheSchema = z.object({
  confirm: z.literal(true),
});

export function createAdminTokensRouter(db: NodePgDatabase) {
  return router({
    /**
     * List all API tokens.
     */
    listApiTokens: adminProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          name: string;
          scopes: string[];
          created_at: string;
          expires_at: string | null;
          last_used_at: string | null;
        } & Record<string, unknown>
      >(
        sql`SELECT id, name, scopes, created_at, expires_at, last_used_at
            FROM api_tokens ORDER BY created_at DESC`,
      );
      return {
        tokens: result.rows.map((r) => ({
          id: r.id,
          name: r.name,
          scopes: r.scopes,
          status:
            r.expires_at && new Date(r.expires_at) < new Date()
              ? ("expired" as const)
              : ("active" as const),
          createdAt: r.created_at,
          expiresAt: r.expires_at,
          lastUsedAt: r.last_used_at,
        })),
      };
    }),

    /**
     * Generate a new cryptographic API token.
     * Returns the raw token exactly once — it is never stored in plaintext.
     */
    createApiToken: adminProcedure.input(createApiTokenSchema).mutation(async ({ input, ctx }) => {
      const rawToken = `rt_tok_${randomBytes(32).toString("hex")}`;
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + input.ttlDays * 86400000).toISOString();
      const userId = ctx.session!.userId;
      const scopes = JSON.stringify(input.scopes);

      await db.execute(sql`
          INSERT INTO api_tokens (user_id, name, token_hash, scopes, expires_at)
          VALUES (${userId}, ${input.name}, ${tokenHash}, ${scopes}::jsonb, ${expiresAt}::timestamptz)
        `);

      return {
        token: rawToken,
        name: input.name,
        scopes: input.scopes,
        expiresAt,
      };
    }),

    /**
     * Flush the Torob Redis cache.
     * Destructive operation — requires explicit confirmation.
     */
    flushTorobCache: adminProcedure.input(flushTorobCacheSchema).mutation(async () => {
      // Stub: Redis operation — not a DB query
      return {
        success: true,
        flushedKeysCount: 0,
      };
    }),

    /**
     * Get Torob integration stats.
     */
    getTorobStats: adminProcedure.query(async () => {
      // Stub: Redis operation — not a DB query
      return {
        totalRequestsToday: 0,
        cacheHitRate: 0,
        throttledIps: 0,
        avgResponseTimeMs: 0,
        redisMemoryMb: 0,
        cachedKeys: 0,
      };
    }),
  });
}
