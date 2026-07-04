import { Inject, Injectable, Logger, type NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NextFunction, Request, Response } from "express";
import { TOROB_ATTRIBUTION_WINDOW_SECONDS } from "./torob.constants";

/**
 * Signed cookie name carrying the captured `torob_clid` click identifier.
 *
 * Signed with COOKIE_SECRET (registered on cookie-parser in main.ts) so a client
 * cannot forge attribution. Read via `req.signedCookies`.
 */
const TOROB_CLID_COOKIE_NAME = "rt_torob_clid";

/**
 * Augmented Express request carrying the resolved Torob click id (if any).
 */
export interface TorobClidRequest extends Request {
  /** Torob click id captured from the landing `?torob_clid=` param or signed cookie. */
  torobClid?: string;
}

/**
 * Torob Click-id Capture Middleware.
 *
 * Per docs/torob/order_tracking_api.md §2:
 *   1. Torob redirects users with `?torob_clid=<id>` appended to the product URL.
 *   2. The partner must capture and persist this click id, then save it on the
 *      order at checkout so Torob can attribute the sale.
 *
 * This middleware:
 *   - Captures `?torob_clid=...` on any landing request and stores it in a
 *     signed cookie valid for the 7-day attribution window.
 *   - On subsequent requests (no query param), rehydrates the click id from the
 *     signed cookie and attaches it to `req.torobClid` for checkout to consume.
 *
 * Runs alongside TorobTrackerMiddleware (utm_source session/pricing); they are
 * independent concerns.
 */
@Injectable()
export class TorobClidMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TorobClidMiddleware.name);
  private readonly isProduction: boolean;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.isProduction = this.configService.get<string>("NODE_ENV") === "production";
  }

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const clidFromQuery =
        typeof req.query.torob_clid === "string" ? req.query.torob_clid : undefined;

      // New Torob referral click — capture and persist in a signed cookie.
      if (clidFromQuery && clidFromQuery.length > 0) {
        this.persistClid(res, clidFromQuery);
        (req as TorobClidRequest).torobClid = clidFromQuery;
        this.logger.debug(`Torob clid captured: ${clidFromQuery}`);
        next();
        return;
      }

      // No new click — rehydrate from signed cookie if present (subsequent navigation).
      const existing = this.readSignedClid(req);
      if (existing) {
        (req as TorobClidRequest).torobClid = existing;
      }
    } catch (err: unknown) {
      // Never block the request pipeline on attribution capture.
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Torob clid middleware error: ${message}`);
    }
    next();
  }

  private persistClid(res: Response, clid: string): void {
    res.cookie(TOROB_CLID_COOKIE_NAME, clid, {
      maxAge: TOROB_ATTRIBUTION_WINDOW_SECONDS * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: this.isProduction,
      signed: true,
    });
  }

  private readSignedClid(req: Request): string | undefined {
    const signed = req.signedCookies?.[TOROB_CLID_COOKIE_NAME];
    if (typeof signed === "string" && signed.length > 0) return signed;
    // Dev fallback for unsigned sessions created before signing was enabled.
    const unsigned = req.cookies?.[TOROB_CLID_COOKIE_NAME];
    return typeof unsigned === "string" && unsigned.length > 0 ? unsigned : undefined;
  }
}
