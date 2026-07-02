import { randomUUID } from "node:crypto";
import { Inject, Injectable, Logger, type NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NextFunction, Request, Response } from "express";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../redis/redis.constants";

/**
 * Redis key prefix for Torob referral session tracking.
 * Full key format: torob:session:{session_id}
 */
const TOROB_SESSION_KEY_PREFIX = "torob:session:";

/**
 * Exact TTL for Torob referral sessions in seconds (1200s = 20 minutes).
 */
const TOROB_SESSION_TTL_SECONDS = 1200;

/**
 * Signed cookie name carrying the Torob session id.
 *
 * Signed with COOKIE_SECRET (registered in cookie-parser via main.ts) so the
 * client cannot forge a Torob session by hand-writing a cookie value. Signed
 * cookies are read via `req.signedCookies` (not `req.cookies`).
 */
const TOROB_COOKIE_NAME = "rt_torob_session";

/**
 * Torob Referral Tracker Middleware.
 *
 * Captures incoming requests with `utm_source=torob` query parameter
 * and initializes a Redis session tracking slot with a strict 1200-second TTL.
 *
 * When a valid Torob session key exists for a browsing user:
 * - The `torob_price` field should be used for product display
 * - Frontend can render a countdown timer based on the TTL
 *
 * The middleware attaches session metadata to the request for downstream
 * controllers to access via `req.torobSession`.
 *
 * Applied globally to all routes — only activates when utm_source=torob is present.
 */
@Injectable()
export class TorobTrackerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TorobTrackerMiddleware.name);
  private readonly isProduction: boolean;

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.isProduction = this.configService.get("NODE_ENV") === "production";
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const utmSource = req.query.utm_source as string | undefined;

      // Only activate for Torob referral traffic
      if (utmSource !== "torob") {
        // Check if an existing Torob session cookie is present (signed)
        const existingSessionId = this.readSignedTorobCookie(req);
        if (existingSessionId) {
          await this.attachExistingSession(req, existingSessionId);
        }
        next();
        return;
      }

      // Generate a new Torob referral session
      const sessionId = randomUUID();
      const key = `${TOROB_SESSION_KEY_PREFIX}${sessionId}`;

      // Store session in Redis with exact 1200s TTL
      const sessionData = JSON.stringify({
        sessionId,
        referrer: "torob",
        createdAt: new Date().toISOString(),
        ip: req.ip ?? req.socket.remoteAddress ?? "unknown",
      });

      await this.redis.set(key, sessionData, "EX", TOROB_SESSION_TTL_SECONDS);

      // Attach Torob session metadata to request
      (req as Request & { torobSession: TorobSessionData }).torobSession = {
        sessionId,
        isActive: true,
        ttlSeconds: TOROB_SESSION_TTL_SECONDS,
        useTorbPrice: true,
      };

      // Set signed session cookie for subsequent requests (expires with TTL).
      // `signed: true` requires COOKIE_SECRET to be registered on cookie-parser.
      res.cookie(TOROB_COOKIE_NAME, sessionId, {
        maxAge: TOROB_SESSION_TTL_SECONDS * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: this.isProduction,
        signed: true,
      });

      this.logger.debug(`Torob referral session created: ${sessionId}`);
      next();
    } catch (err: unknown) {
      // Middleware failures should never block the request pipeline
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Torob tracker middleware error: ${message}`);
      next();
    }
  }

  /**
   * Read the signed Torob session id from the request.
   *
   * Falls back to the unsigned `req.cookies` value when no COOKIE_SECRET is
   * registered (dev convenience) — signed cookies appear as `false` in
   * `req.signedCookies` when verification fails or no secret is set.
   */
  private readSignedTorobCookie(req: Request): string | undefined {
    const signed = req.signedCookies?.[TOROB_COOKIE_NAME];
    if (typeof signed === "string" && signed.length > 0) return signed;
    // Fallback for unsigned dev sessions created before signing was enabled.
    const unsigned = req.cookies?.[TOROB_COOKIE_NAME];
    return typeof unsigned === "string" && unsigned.length > 0 ? unsigned : undefined;
  }

  /**
   * Check if an existing Torob session is still valid in Redis.
   * If valid, attach the session data and remaining TTL to the request.
   */
  private async attachExistingSession(req: Request, sessionId: string): Promise<void> {
    const key = `${TOROB_SESSION_KEY_PREFIX}${sessionId}`;
    const ttl = await this.redis.ttl(key);

    if (ttl > 0) {
      (req as Request & { torobSession: TorobSessionData }).torobSession = {
        sessionId,
        isActive: true,
        ttlSeconds: ttl,
        useTorbPrice: true,
      };
    }
  }
}

/**
 * Torob session data attached to the request object.
 */
export interface TorobSessionData {
  sessionId: string;
  isActive: boolean;
  ttlSeconds: number;
  useTorbPrice: boolean;
}
