import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["retail", "wholesale", "admin", "operator", "wholesale"]),
  wholesaleStatus: z.enum(["none", "pending", "approved", "rejected"]),
});

const getUserActivityLogsSchema = z.object({
  userId: z.string().uuid(),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export function createAdminUsersRouter(db: NodePgDatabase) {
  return router({
    /**
     * List all users with role and wholesale status.
     */
    listUsers: adminProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          full_name: string;
          mobile: string;
          email: string | null;
          role: string;
          wholesale_status: string;
          rayan_coins: number;
          is_verified: boolean;
          created_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, full_name, mobile, email, role, wholesale_status, rayan_coins, is_verified, created_at
            FROM users ORDER BY created_at DESC`,
      );
      return {
        users: result.rows.map((r) => ({
          id: r.id,
          fullName: r.full_name,
          mobile: r.mobile,
          email: r.email,
          role: r.role,
          wholesaleStatus: r.wholesale_status,
          rayanCoins: r.rayan_coins,
          isVerified: r.is_verified,
          createdAt: r.created_at,
        })),
        total: result.rows.length,
      };
    }),

    /**
     * Update user role and wholesale status.
     */
    updateUserRole: adminProcedure.input(updateUserRoleSchema).mutation(async ({ input }) => {
      await db.execute(sql`
          UPDATE users
          SET role = ${input.role}, wholesale_status = ${input.wholesaleStatus}, updated_at = NOW()
          WHERE id = ${input.userId}
        `);
      return {
        success: true,
        userId: input.userId,
        role: input.role,
        wholesaleStatus: input.wholesaleStatus,
      };
    }),

    /**
     * Get user activity logs from system_logs filtered by metadata->>'userId'.
     */
    getUserActivityLogs: adminProcedure
      .input(getUserActivityLogsSchema)
      .query(async ({ input }) => {
        const result = await db.execute<
          {
            id: string;
            level: string;
            context: string;
            message: string;
            created_at: string;
          } & Record<string, unknown>
        >(
          sql`SELECT id, level, context, message, created_at
              FROM system_logs
              WHERE metadata->>'userId' = ${input.userId}
              ORDER BY created_at DESC
              LIMIT ${input.limit}`,
        );
        return {
          logs: result.rows.map((r) => ({
            id: r.id,
            level: r.level,
            context: r.context,
            message: r.message,
            createdAt: r.created_at,
          })),
          userId: input.userId,
        };
      }),
  });
}
