import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Response } from "express";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { TorobJwtGuard } from "./torob-jwt.guard";

interface TorobActionRow extends Record<string, unknown> {
  torob_clid: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TorobActionRecord {
  timestamp: string;
  last_updated_timestamp: string;
  torob_clid: string;
  status: "completed" | "cancelled";
  action_type: string;
}

interface TorobActionsResponse {
  success: true;
  data: TorobActionRecord[];
}

/** Order statuses that map to a cancelled action. */
const CANCELLED_STATUSES = new Set(["cancelled", "returned"]);

/** Maximum records per request, per spec. */
const MAX_LIMIT = 1000;

/**
 * Action type label for purchase actions derived from orders.
 * The spec leaves action_type open to the partner; for an e-commerce shop the
 * meaningful action is a completed purchase.
 */
const ACTION_TYPE_PURCHASE = "purchase";

/**
 * Torob Action Tracking controller.
 *
 * Implements `GET /torob/v1/actions` per docs/torob/action_tracking_api.md.
 * Exposes purchase actions (orders attributed to Torob via `torob_clid`).
 * Authenticated by TorobJwtGuard.
 *
 * Records are sorted ascending by timestamp (per spec §3.4).
 */
@Controller("torob/v1")
@UseGuards(TorobJwtGuard)
export class TorobActionsController {
  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  @Get("actions")
  async getActions(
    @Query("timestamp_gt") timestampGt: string,
    @Query("limit") limit: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TorobActionsResponse> {
    res.setHeader("Content-Type", "application/json");

    const parsedLimit = this.parseLimit(limit);
    const since = this.parseTimestamp(timestampGt, "timestamp_gt");

    const result = await this.db.execute<TorobActionRow>(sql`
      SELECT torob_clid, status, created_at, updated_at
      FROM orders
      WHERE torob_clid IS NOT NULL
        AND created_at > ${since}
      ORDER BY created_at ASC
      LIMIT ${parsedLimit}
    `);

    const data: TorobActionRecord[] = result.rows.map((row) => ({
      timestamp: new Date(row.created_at).toISOString(),
      last_updated_timestamp: new Date(row.updated_at).toISOString(),
      torob_clid: row.torob_clid,
      status: CANCELLED_STATUSES.has(row.status) ? "cancelled" : "completed",
      action_type: ACTION_TYPE_PURCHASE,
    }));

    return { success: true, data };
  }

  private parseLimit(raw: string | undefined): number {
    const n = Number(raw);
    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestException("limit must be a positive integer");
    }
    return Math.min(n, MAX_LIMIT);
  }

  private parseTimestamp(raw: string | undefined, field: string): Date {
    if (!raw) {
      throw new BadRequestException(`${field} is required`);
    }
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException(`${field} must be ISO 8601 UTC`);
    }
    return d;
  }
}
