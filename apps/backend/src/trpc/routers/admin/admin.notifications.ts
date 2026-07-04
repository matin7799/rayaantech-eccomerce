import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

/**
 * Raw row shape from the notifications table.
 */
interface NotificationRow extends Record<string, unknown> {
  id: string;
  type: string;
  title: string;
  body: string;
  order_id: string | null;
  amount: string | null;
  is_read: boolean;
  created_at: string;
}

function mapRow(row: NotificationRow) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    orderId: row.order_id,
    amount: row.amount === null ? null : parseInt(row.amount, 10),
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

/**
 * Admin/operator in-app notifications router (read + mark-read).
 *
 * The write path lives in NotificationsService (event-driven). Delivery to the
 * panel is polled (list/unreadCount) with an instant socket.io push layered on
 * top (see /admin-notifications gateway).
 */
export function createAdminNotificationsRouter(db: NodePgDatabase) {
  return router({
    /** Recent notifications, newest first. */
    listNotifications: adminProcedure
      .input(z.object({ limit: z.number().int().min(1).max(100).default(30) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 30;
        const result = await db.execute<NotificationRow>(sql`
          SELECT id, type, title, body, order_id, amount, is_read, created_at
          FROM notifications
          ORDER BY created_at DESC
          LIMIT ${limit}
        `);
        return { notifications: result.rows.map(mapRow) };
      }),

    /** Count of unread notifications (drives the bell badge). */
    unreadNotificationCount: adminProcedure.query(async () => {
      const result = await db.execute<{ count: string }>(sql`
        SELECT COUNT(*)::text AS count FROM notifications WHERE is_read = false
      `);
      return { count: parseInt(result.rows[0]?.count ?? "0", 10) };
    }),

    /** Mark a single notification read. */
    markNotificationRead: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await db.execute(sql`UPDATE notifications SET is_read = true WHERE id = ${input.id}`);
        return { success: true };
      }),

    /** Mark every notification read. */
    markAllNotificationsRead: adminProcedure.mutation(async () => {
      await db.execute(sql`UPDATE notifications SET is_read = true WHERE is_read = false`);
      return { success: true };
    }),
  });
}
