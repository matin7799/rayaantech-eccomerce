import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request, Response } from "express";
import type Redis from "ioredis";
import type { CachedTokenRecord } from "../../auth/interfaces/token-record.interface";
import { REDIS_CLIENT } from "../../redis/redis.constants";
import type { RateLimitResult } from "../interfaces/rate-limit-config.interface";
import { AI_RATE_LIMIT_FEATURE_KEY, RATE_LIMIT_KEY_PREFIX } from "../rate-limit.constants";
import { RateLimitConfigService } from "../services/rate-limit-config.service";

/**
 * Per-customer AI rate limiting guard.
 *
 * This guard is applied to routes decorated with @AiRateLimit("ai:text")
 * or @AiRateLimit("ai:voice"). Routes without the decorator are not rate-limited.
 *
 * Key pattern: rate:ai:{userId}:{feature}
 *
 * Rate limit configuration is dynamic — admins can change limits per-user
 * or globally via the admin panel. Changes propagate within 60 seconds.
 *
 * The guard runs AFTER ApiTokenGuard (which attaches the tokenRecord to request),
 * so we have access to the authenticated userId.
 *
 * Response headers (standard rate limit headers):
 * - X-RateLimit-Limit: max requests allowed
 * - X-RateLimit-Remaining: requests left in the window
 * - X-RateLimit-Reset: seconds until window resets
 */
@Injectable()
export class AiRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(AiRateLimitGuard.name);

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(RateLimitConfigService)
    private readonly configService: RateLimitConfigService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route has @AiRateLimit() decorator — skip if not
    const feature = this.reflector.getAllAndOverride<string | undefined>(
      AI_RATE_LIMIT_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!feature) {
      // No rate limiting on this route
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Extract userId from the token record (set by ApiTokenGuard)
    const tokenRecord = (request as Request & { tokenRecord?: CachedTokenRecord }).tokenRecord;
    if (!tokenRecord) {
      // If no token record exists, the request is unauthenticated.
      // Rate limiting by IP as fallback for public AI endpoints.
      const ip = this.extractClientIp(request);
      return this.enforceLimit(`anon:${ip}`, feature, response);
    }

    return this.enforceLimit(tokenRecord.userId, feature, response);
  }

  /**
   * Core rate limiting logic using Redis atomic increment with Lua.
   */
  private async enforceLimit(
    identifier: string,
    feature: string,
    response: Response,
  ): Promise<boolean> {
    // Resolve dynamic config (per-user or global)
    const config = await this.configService.getConfig(identifier, feature);
    const key = `${RATE_LIMIT_KEY_PREFIX}${identifier}:${feature}`;

    // Atomic check-and-increment via Lua script
    const result = await this.incrementCounter(key, config.windowSeconds);

    // Set standard rate limit headers
    const remaining = Math.max(0, config.maxRequests - result.currentCount);
    response.setHeader("X-RateLimit-Limit", config.maxRequests);
    response.setHeader("X-RateLimit-Remaining", remaining);
    response.setHeader("X-RateLimit-Reset", result.resetInSeconds);

    if (result.currentCount > config.maxRequests) {
      response.setHeader("Retry-After", result.resetInSeconds);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "AI usage rate limit exceeded. Please try again later.",
          retryAfter: result.resetInSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  /**
   * Atomic Redis counter increment using Lua script.
   * Creates the key with TTL on first hit, increments on subsequent hits.
   * Returns the current count and time-to-expire.
   */
  private async incrementCounter(key: string, windowSeconds: number): Promise<RateLimitResult> {
    try {
      const luaScript = `
        local current = redis.call('INCR', KEYS[1])
        if current == 1 then
          redis.call('EXPIRE', KEYS[1], ARGV[1])
        end
        local ttl = redis.call('TTL', KEYS[1])
        return {current, ttl}
      `;

      const result = (await this.redis.eval(luaScript, 1, key, windowSeconds.toString())) as [
        number,
        number,
      ];

      return {
        allowed: true,
        currentCount: result[0],
        limit: 0, // Will be set by the caller
        resetInSeconds: Math.max(result[1], 0),
      };
    } catch (err: unknown) {
      // Redis failure — fail open (allow the request) but log the error
      // This prevents Redis outage from blocking all AI features
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Rate limit Redis error: ${message}`);

      return {
        allowed: true,
        currentCount: 0,
        limit: 0,
        resetInSeconds: 0,
      };
    }
  }

  /**
   * Extract client IP for anonymous rate limiting fallback.
   */
  private extractClientIp(request: Request): string {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const clientIp = forwarded.split(",")[0].trim();
      if (clientIp) return clientIp;
    }

    const realIp = request.headers["x-real-ip"];
    if (typeof realIp === "string" && realIp) return realIp;

    return request.ip ?? request.socket.remoteAddress ?? "unknown";
  }
}
