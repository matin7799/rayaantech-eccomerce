import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Request, Response } from "express";
import type { SessionService } from "../auth/services/session.service";
import type { BuyerContext } from "../pricing/pricing.types";

/**
 * Wholesale group lookup row (only fetched when session is an approved partner).
 */
interface WholesaleGroupRow extends Record<string, unknown> {
  group_id: string;
  markdown_percentage: string;
}

/**
 * tRPC context shape available to all procedures.
 *
 * `buyer` is the resolved pricing context: Torob session + wholesale group.
 * Built once per request from the middleware-attached `req.torobSession` and
 * the authenticated user session.
 */
export interface TrpcContext {
  req: Request;
  res: Response;
  session: {
    userId: string;
    mobile: string;
    role: string;
  } | null;
  /** Resolved buyer context for the pricing engine. Never null. */
  buyer: BuyerContext;
}

/**
 * Read the Torob session attached by TorobTrackerMiddleware.
 *
 * The middleware annotates `req` with a `torobSession` field regardless of
 * whether the cookie is signed; the field is the source of truth here.
 */
function readTorobFromRequest(req: Request): BuyerContext["torob"] {
  const attached = (req as Request & { torobSession?: TorobSessionLike }).torobSession;
  if (!(attached && attached.isActive) || attached.ttlSeconds <= 0) return null;
  return {
    active: true,
    ttlSeconds: attached.ttlSeconds,
    sessionId: attached.sessionId,
  };
}

/** Minimal shape of the middleware-attached torob session. */
interface TorobSessionLike {
  sessionId: string;
  isActive: boolean;
  ttlSeconds: number;
  useTorbPrice: boolean;
}

/**
 * Resolve the wholesale buyer context for an approved partner.
 *
 * Done lazily (single indexed query) only when the session reports an
 * approved wholesale role — a small fraction of traffic. Anonymous/retail
 * visitors skip the lookup entirely.
 *
 * Stale Redis sessions created before this field existed will simply return
 * null wholesale → retail pricing, which is safe.
 */
async function resolveWholesaleContext(
  db: NodePgDatabase,
  session: { userId: string; role: string } | null,
): Promise<BuyerContext["wholesale"]> {
  if (!session || session.role !== "wholesale") return null;

  const result = await db.execute<WholesaleGroupRow>(sql`
    SELECT u.wholesale_group_id AS group_id,
           wg.markdown_percentage
    FROM users u
    LEFT JOIN wholesale_groups wg ON wg.id = u.wholesale_group_id
    WHERE u.id = ${session.userId}
      AND u.role = 'wholesale'
      AND u.wholesale_status = 'approved'
    LIMIT 1
  `);

  const row = result.rows[0];
  if (!(row?.group_id && row.markdown_percentage)) return null;
  return {
    groupId: row.group_id,
    markdownPercent: row.markdown_percentage,
    status: "approved",
  };
}

/**
 * Create tRPC context factory.
 *
 * Resolves the user session from the httpOnly cookie via SessionService,
 * the Torob referral from the middleware-attached request field, and the
 * wholesale group via a lazy DB lookup for approved partners.
 */
export function createContextFactory(sessionService: SessionService, db: NodePgDatabase) {
  return async (opts: { req: Request; res: Response }): Promise<TrpcContext> => {
    const sessionData = await sessionService.resolveSession(opts.req);
    const session = sessionData
      ? { userId: sessionData.userId, mobile: sessionData.mobile, role: sessionData.role }
      : null;

    const torob = readTorobFromRequest(opts.req);
    const wholesale = await resolveWholesaleContext(db, session);

    return {
      req: opts.req,
      res: opts.res,
      session,
      buyer: { torob, wholesale },
    };
  };
}
