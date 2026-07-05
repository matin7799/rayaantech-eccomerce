import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Response } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { TorobJwtGuard } from "./torob-jwt.guard";

/**
 * Raw order row from the tracking query.
 */
interface TorobOrderRow extends Record<string, unknown> {
  id: string;
  status: string;
  total_amount: string;
  shipping_amount: string | null;
  phone_number: string | null;
  torob_clid: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
  payment_method: string | null;
}

interface TorobOrderProduct {
  product_url: string;
  product_price: number;
  quantity: number;
}

interface TorobOrderRecord {
  purchase_timestamp: string;
  last_updated_timestamp: string;
  torob_clid: string;
  status: "completed" | "cancelled";
  psp: string | null;
  order_value: number | null;
  shipping_amount: number | null;
  phone_number: string | null;
  products: TorobOrderProduct[];
}

interface TorobTrackingResponse {
  success: true;
  data: TorobOrderRecord[];
}

/** Order statuses that Torob should treat as cancelled (no attribution payout). */
const CANCELLED_STATUSES = new Set(["cancelled", "returned"]);

/** Maximum records per request, per spec. */
const MAX_LIMIT = 1000;

/**
 * Torob Order Tracking controller.
 *
 * Implements `GET /torob/v1/orders` per docs/torob/order_tracking_api.md.
 * Exposes only orders that originated from Torob (i.e. have a `torob_clid`).
 * Authenticated by TorobJwtGuard.
 *
 * @Public() only bypasses the global ApiTokenGuard (Torob does not send an
 * Authorization bearer token); TorobJwtGuard still authenticates via X-Torob-Token.
 */
@Public()
@Controller("torob/v1")
@UseGuards(TorobJwtGuard)
export class TorobOrdersController {
  private readonly frontendUrl: string;

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl = (this.configService.get<string>("FRONTEND_URL") ?? "").replace(/\/$/, "");
  }

  /**
   * Return orders attributed to Torob, filtered by purchase timestamp.
   * Records are sorted ascending by purchase_timestamp (per spec §3.4).
   */
  @Get("orders")
  async getOrders(
    @Query("purchase_timestamp_gt") timestampGt: string,
    @Query("limit") limit: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TorobTrackingResponse> {
    res.setHeader("Content-Type", "application/json");

    const parsedLimit = this.parseLimit(limit);
    const since = this.parseTimestamp(timestampGt);

    // Only attributed orders. Join payments (LATERAL) to pull the PSP method
    // for the most recent completed payment, if any.
    const result = await this.db.execute<TorobOrderRow>(sql`
      SELECT
        o.id, o.status, o.total_amount, o.shipping_amount, o.phone_number,
        o.torob_clid, o.created_at, o.updated_at, o.items,
        pm.method AS payment_method
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT method FROM payments
        WHERE order_id = o.id AND status = 'completed'
        ORDER BY paid_at DESC NULLS LAST LIMIT 1
      ) pm ON true
      WHERE o.torob_clid IS NOT NULL
        AND o.created_at > ${since}
      ORDER BY o.created_at ASC
      LIMIT ${parsedLimit}
    `);

    const slugById = await this.loadProductSlugs(result.rows);
    const data: TorobOrderRecord[] = result.rows.map((row) => this.mapOrder(row, slugById));

    return { success: true, data };
  }

  /**
   * Batch-resolve product ids → slugs so product_url points at the real PDP
   * (/products/<slug>). Items whose product no longer exists fall back to the id.
   */
  private async loadProductSlugs(rows: TorobOrderRow[]): Promise<Map<string, string>> {
    const ids = [...new Set(rows.flatMap((r) => (r.items ?? []).map((i) => i.productId)))];
    const map = new Map<string, string>();
    if (ids.length === 0) return map;

    const result = await this.db.execute<{ id: string; slug: string } & Record<string, unknown>>(
      sql`SELECT id, slug FROM products WHERE id IN ${ids}`,
    );
    for (const row of result.rows) {
      map.set(row.id, row.slug);
    }
    return map;
  }

  private mapOrder(row: TorobOrderRow, slugById: Map<string, string>): TorobOrderRecord {
    const products: TorobOrderProduct[] = (row.items ?? []).map((item) => ({
      product_url: `${this.frontendUrl}/products/${slugById.get(item.productId) ?? item.productId}`,
      product_price: Math.trunc(Number(item.unitPrice)),
      quantity: item.quantity,
    }));

    return {
      purchase_timestamp: new Date(row.created_at).toISOString(),
      last_updated_timestamp: new Date(row.updated_at).toISOString(),
      torob_clid: row.torob_clid,
      status: CANCELLED_STATUSES.has(row.status) ? "cancelled" : "completed",
      psp: row.payment_method ?? null,
      // Amounts are stored in Toman — the unit Torob expects — so no conversion.
      order_value: Math.trunc(Number(row.total_amount)),
      shipping_amount: row.shipping_amount ? Math.trunc(Number(row.shipping_amount)) : null,
      phone_number: row.phone_number ?? null,
      products,
    };
  }

  private parseLimit(raw: string | undefined): number {
    const n = Number(raw);
    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestException("limit must be a positive integer");
    }
    return Math.min(n, MAX_LIMIT);
  }

  private parseTimestamp(raw: string | undefined): Date {
    if (!raw) {
      throw new BadRequestException("purchase_timestamp_gt is required");
    }
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException("purchase_timestamp_gt must be ISO 8601 UTC");
    }
    return d;
  }
}
