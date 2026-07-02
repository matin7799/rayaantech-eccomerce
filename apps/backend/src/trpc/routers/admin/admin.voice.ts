import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const updateVoiceThresholdSchema = z.object({
  dailyLimit: z.number().int().min(1).max(100),
  overrideEnabled: z.boolean(),
});

export function createAdminVoiceRouter(_db: NodePgDatabase) {
  return router({
    /**
     * Get Voice AI diagnostics and active session stats.
     */
    getVoiceAiStats: adminProcedure.query(async () => {
      // Stub: queries external WebSocket/Redis state
      return {
        activeSessions: 0,
        totalToday: 0,
        avgDurationMinutes: 0,
        peakConcurrent: 0,
        sessions: [] as Array<{
          id: string;
          ip: string;
          startedAt: string;
          questionsAsked: number;
          dailyQuota: number;
          dailyUsed: number;
          status: "active" | "idle";
        }>,
      };
    }),

    /**
     * Update Voice AI daily consultation threshold.
     */
    updateVoiceThreshold: adminProcedure
      .input(updateVoiceThresholdSchema)
      .mutation(async ({ input }) => {
        // Stub: writes to config store (Redis)
        return {
          success: true,
          dailyLimit: input.dailyLimit,
          overrideEnabled: input.overrideEnabled,
        };
      }),
  });
}
