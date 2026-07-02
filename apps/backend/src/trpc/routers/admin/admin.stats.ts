import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const listSystemLogsSchema = z.object({
  level: z.enum(["info", "warn", "error", "debug"]).optional(),
  limit: z.number().int().min(1).max(200).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

export function createAdminStatsRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get overview KPI metrics for the admin dashboard.
     */
    getOverviewStats: adminProcedure.query(async () => {
      const productsResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM products WHERE is_active = true`,
      );
      const ordersResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM orders WHERE created_at >= CURRENT_DATE`,
      );
      const tokensResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM api_tokens WHERE (expires_at IS NULL OR expires_at > NOW())`,
      );
      const revenueResult = await db.execute<{ total: string | null } & Record<string, unknown>>(
        sql`SELECT COALESCE(SUM(total_amount::bigint), 0)::text AS total FROM orders WHERE created_at >= CURRENT_DATE AND status != 'cancelled'`,
      );

      return {
        activeProducts: Number(productsResult.rows[0]?.count ?? 0),
        ordersToday: Number(ordersResult.rows[0]?.count ?? 0),
        activeTokens: Number(tokensResult.rows[0]?.count ?? 0),
        activeVoiceSessions: 0,
        revenueToday: Number(revenueResult.rows[0]?.total ?? 0),
        onlineUsers: 0,
      };
    }),

    /**
     * List system logs with optional level filter and pagination.
     */
    listSystemLogs: adminProcedure.input(listSystemLogsSchema).query(async ({ input }) => {
      const result = await db.execute<
        {
          id: string;
          level: string;
          context: string;
          message: string;
          metadata: Record<string, unknown> | null;
          trace_id: string | null;
          created_at: string;
        } & Record<string, unknown>
      >(
        input.level
          ? sql`SELECT id, level, context, message, metadata, trace_id, created_at
                  FROM system_logs
                  WHERE level = ${input.level}
                  ORDER BY created_at DESC
                  LIMIT ${input.limit} OFFSET ${input.offset}`
          : sql`SELECT id, level, context, message, metadata, trace_id, created_at
                  FROM system_logs
                  ORDER BY created_at DESC
                  LIMIT ${input.limit} OFFSET ${input.offset}`,
      );
      return {
        logs: result.rows.map((r) => ({
          id: r.id,
          level: r.level,
          context: r.context,
          message: r.message,
          metadata: r.metadata,
          traceId: r.trace_id,
          createdAt: r.created_at,
        })),
      };
    }),

    /**
     * Get AvalAI cost metrics and credit balance.
     */
    getAiCostMetrics: adminProcedure.query(async () => {
      // Stub: queries external AvalAI API — not a DB operation
      return {
        creditRemainingIrt: 0,
        totalCostToday: 0,
        totalTranscriptionMinutes: 0,
        modelsUsed: 0,
        recentTransactions: [] as Array<{
          id: string;
          model: string;
          provider: string;
          inputTokens: number;
          outputTokens: number;
          costIrt: number;
          timestamp: string;
        }>,
      };
    }),
  });
}
