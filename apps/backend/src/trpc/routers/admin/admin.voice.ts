import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const updateVoiceThresholdSchema = z.object({
  dailyLimit: z.number().int().min(1).max(100),
  overrideEnabled: z.boolean(),
});

/** A session is considered "active" if it received a message this recently. */
const ACTIVE_WINDOW_MINUTES = 5;

/** Fallback daily quota when no ai_config row exists in app_settings. */
const DEFAULT_DAILY_QUOTA = 50;

export function createAdminVoiceRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get AI consultation diagnostics — real aggregates over
     * ai_chat_sessions / ai_chat_messages (text + voice share the tables).
     */
    getVoiceAiStats: adminProcedure.query(async () => {
      // Per-session aggregates for sessions created today (Tehran-agnostic: server day)
      const sessionsResult = await db.execute<
        {
          id: string;
          user_id: string | null;
          guest_session_id: string | null;
          created_at: string;
          last_message_at: string | null;
          first_message_at: string | null;
          user_messages: string;
        } & Record<string, unknown>
      >(sql`
        SELECT
          s.id,
          s.user_id,
          s.guest_session_id,
          s.created_at,
          MAX(m.created_at) AS last_message_at,
          MIN(m.created_at) AS first_message_at,
          COUNT(*) FILTER (WHERE m.sender = 'user')::text AS user_messages
        FROM ai_chat_sessions s
        LEFT JOIN ai_chat_messages m ON m.session_id = s.id
        WHERE s.created_at >= CURRENT_DATE
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT 50
      `);

      // Peak concurrency approximation: busiest hour today by distinct sessions
      const peakResult = await db.execute<{ peak: string } & Record<string, unknown>>(sql`
        SELECT COALESCE(MAX(cnt), 0)::text AS peak FROM (
          SELECT COUNT(DISTINCT m.session_id) AS cnt
          FROM ai_chat_messages m
          WHERE m.created_at >= CURRENT_DATE
          GROUP BY date_trunc('hour', m.created_at)
        ) hourly
      `);

      // Daily quota from the persisted admin AI config (app_settings.ai_config)
      const quotaResult = await db.execute<{ quota: string | null } & Record<string, unknown>>(sql`
        SELECT (value ->> 'dailyQuestionLimit') AS quota
        FROM app_settings WHERE key = 'ai_config' LIMIT 1
      `);
      const dailyQuota = Number(quotaResult.rows[0]?.quota ?? DEFAULT_DAILY_QUOTA);

      const now = Date.now();
      const activeCutoffMs = ACTIVE_WINDOW_MINUTES * 60 * 1000;

      const sessions = sessionsResult.rows.map((row) => {
        const lastMs = row.last_message_at ? new Date(row.last_message_at).getTime() : 0;
        const questionsAsked = Number(row.user_messages);
        return {
          id: row.id,
          // No client IP is persisted — surface the visitor identity instead.
          ip: row.user_id
            ? `کاربر ${row.user_id.slice(0, 8)}`
            : `مهمان ${(row.guest_session_id ?? "—").slice(0, 8)}`,
          startedAt: new Date(row.created_at).toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          questionsAsked,
          dailyQuota,
          dailyUsed: questionsAsked,
          status: (lastMs > 0 && now - lastMs < activeCutoffMs ? "active" : "idle") as
            | "active"
            | "idle",
        };
      });

      // Average conversation duration (first → last message) in minutes
      const durations = sessionsResult.rows
        .filter((r) => r.first_message_at && r.last_message_at)
        .map(
          (r) =>
            (new Date(r.last_message_at as string).getTime() -
              new Date(r.first_message_at as string).getTime()) /
            60_000,
        )
        .filter((mins) => mins > 0);
      const avgDurationMinutes =
        durations.length > 0
          ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
          : 0;

      return {
        activeSessions: sessions.filter((s) => s.status === "active").length,
        totalToday: sessionsResult.rows.length,
        avgDurationMinutes,
        peakConcurrent: Number(peakResult.rows[0]?.peak ?? 0),
        sessions,
      };
    }),

    /**
     * Update Voice AI daily consultation threshold — persists onto the
     * ai_config row in app_settings so the consultation pipeline picks it up.
     */
    updateVoiceThreshold: adminProcedure
      .input(updateVoiceThresholdSchema)
      .mutation(async ({ input }) => {
        const patch = JSON.stringify({
          dailyQuestionLimit: input.dailyLimit,
          overrideDailyLimit: input.overrideEnabled,
        });
        await db.execute(sql`
          INSERT INTO app_settings (key, value, updated_at)
          VALUES ('ai_config', ${patch}::json, NOW())
          ON CONFLICT (key)
          DO UPDATE SET
            value = (app_settings.value::jsonb || ${patch}::jsonb)::json,
            updated_at = NOW()
        `);

        return {
          success: true,
          dailyLimit: input.dailyLimit,
          overrideEnabled: input.overrideEnabled,
        };
      }),
  });
}
