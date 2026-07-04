import { Inject, Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";

/**
 * Payload for creating a notification row.
 */
export interface CreateNotificationInput {
  type: string;
  title: string;
  body: string;
  orderId?: string | null;
  amount?: number | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * A notification row as returned to the admin panel.
 */
export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  body: string;
  orderId: string | null;
  amount: number | null;
  isRead: boolean;
  createdAt: string;
}

interface RawNotificationRow extends Record<string, unknown> {
  id: string;
  type: string;
  title: string;
  body: string;
  order_id: string | null;
  amount: string | null;
  is_read: boolean;
  created_at: string;
}

function mapRow(row: RawNotificationRow): NotificationRow {
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
 * Persistence for in-app admin/operator notifications.
 *
 * The tRPC admin router reads these directly via SQL; this service is the write
 * path (used by event listeners) and returns the created row so the gateway can
 * push it live.
 */
@Injectable()
export class NotificationsService {
  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /** Insert a notification and return the created row. */
  async create(input: CreateNotificationInput): Promise<NotificationRow> {
    const result = await this.db.execute<RawNotificationRow>(sql`
      INSERT INTO notifications (type, title, body, order_id, amount, metadata)
      VALUES (
        ${input.type},
        ${input.title},
        ${input.body},
        ${input.orderId ?? null},
        ${input.amount ?? null},
        ${input.metadata ? JSON.stringify(input.metadata) : null}::json
      )
      RETURNING id, type, title, body, order_id, amount, is_read, created_at
    `);
    return mapRow(result.rows[0]!);
  }

  /** Most recent notifications (newest first). */
  async list(limit = 30): Promise<NotificationRow[]> {
    const result = await this.db.execute<RawNotificationRow>(sql`
      SELECT id, type, title, body, order_id, amount, is_read, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);
    return result.rows.map(mapRow);
  }

  /** Count of unread notifications. */
  async unreadCount(): Promise<number> {
    const result = await this.db.execute<{ count: string }>(sql`
      SELECT COUNT(*)::text AS count FROM notifications WHERE is_read = false
    `);
    return parseInt(result.rows[0]?.count ?? "0", 10);
  }

  /** Mark a single notification read. */
  async markRead(id: string): Promise<void> {
    await this.db.execute(sql`UPDATE notifications SET is_read = true WHERE id = ${id}`);
  }

  /** Mark every notification read. */
  async markAllRead(): Promise<void> {
    await this.db.execute(sql`UPDATE notifications SET is_read = true WHERE is_read = false`);
  }
}
