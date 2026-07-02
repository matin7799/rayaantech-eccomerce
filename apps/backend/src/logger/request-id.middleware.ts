import { randomUUID } from "node:crypto";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

/**
 * Header name for the distributed correlation identifier.
 */
const REQUEST_ID_HEADER = "x-request-id";

/**
 * RequestIdMiddleware — Injects a unique correlation ID into every request.
 *
 * Behavior:
 * 1. If the incoming request already carries an X-Request-Id header
 *    (e.g. from a load balancer or gateway), it is preserved.
 * 2. Otherwise, a new UUIDv4 is generated and attached.
 * 3. The ID is set on the response header so downstream services
 *    and clients can correlate logs with their request.
 * 4. Pino's genReqId (in logger.module.ts) reads this same header,
 *    ensuring all log entries for a request share the correlation ID.
 *
 * Applied globally via AppModule.configure() or NestMiddleware registration.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Preserve existing ID or generate a new one
    const requestId = (req.headers[REQUEST_ID_HEADER] as string | undefined) ?? randomUUID();

    // Attach to request headers (for pino-http genReqId to pick up)
    req.headers[REQUEST_ID_HEADER] = requestId;

    // Echo back on response for client-side correlation
    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }
}
