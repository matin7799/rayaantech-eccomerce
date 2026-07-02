import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.constants";
import {
  AI_INIT_RATE_KEY_PREFIX,
  AI_INIT_WINDOW_SECONDS,
  AI_MAX_INITS_PER_HOUR,
  AI_MAX_MESSAGES_PER_SESSION,
  AI_MSG_RATE_KEY_PREFIX,
  AI_MSG_WINDOW_SECONDS,
  AI_SESSION_KEY_PREFIX,
  AI_SESSION_TIMEOUT_SECONDS,
  RATE_LIMIT_INIT_FA,
  RATE_LIMIT_MSG_FA,
  SESSION_TIMEOUT_FA,
} from "../avalai.constants";

/**
 * Lua script: Fixed-window rate limiter with TTL initialization.
 *
 * Atomically increments a counter key and sets TTL on first hit.
 * Returns current count or -1 if limit exceeded.
 *
 * KEYS[1] = rate limit key
 * ARGV[1] = window TTL in seconds
 * ARGV[2] = maximum allowed count
 */
const FIXED_WINDOW_LUA = `
  local key = KEYS[1]
  local window = tonumber(ARGV[1])
  local limit = tonumber(ARGV[2])

  local current = redis.call('INCR', key)

  if current == 1 then
    redis.call('EXPIRE', key, window)
  end

  if current > limit then
    return -1
  end

  return current
`;

/**
 * Lua script: Session timeout checker.
 *
 * Creates a session key with fixed TTL on first call.
 * Returns remaining TTL or -1 if session has expired/doesn't exist.
 *
 * KEYS[1] = session key
 * ARGV[1] = session TTL in seconds
 */
const SESSION_CHECK_LUA = `
  local key = KEYS[1]
  local ttl_seconds = tonumber(ARGV[1])

  local exists = redis.call('EXISTS', key)

  if exists == 0 then
    redis.call('SET', key, '1')
    redis.call('EXPIRE', key, ttl_seconds)
    return ttl_seconds
  end

  local remaining = redis.call('TTL', key)
  if remaining <= 0 then
    return -1
  end

  return remaining
`;

/**
 * AI Consultation Firewall Guard — IP-Based Distributed Rate Limiter.
 *
 * Implements a rigid fixed-window rate limiting interceptor tied directly
 * to the client's validated IP signature using ioredis.
 *
 * Three-tier protection:
 *
 * 1. INITIALIZATION LIMIT: Max 5 new connections/hour per IP
 *    Key pattern: rate:ai:init:{ip}
 *    Window: 3600 seconds (1 hour)
 *
 * 2. MESSAGE LIMIT: Max 50 interaction responses per session per IP
 *    Key pattern: rate:ai:msg:{ip}
 *    Window: 300 seconds (matches session timeout)
 *
 * 3. SESSION TIMEOUT: Forced 300-second (5-minute) lifecycle cap
 *    Key pattern: rate:ai:session:{ip}
 *    On expiry: All further requests blocked until key naturally expires
 *
 * On violation: Instantaneous localized Persian 429 response.
 *
 * FAIL-OPEN: On Redis errors, requests are allowed through (logging the error)
 * to prevent Redis outages from blocking the entire AI feature.
 */
@Injectable()
export class AiFirewallGuard implements CanActivate {
  private readonly logger = new Logger(AiFirewallGuard.name);

  /** Max new AI sessions a single IP can open per hour. */
  private readonly maxInitsPerHour: number;
  /** Sliding window for the init counter in seconds (default: 1 hour). */
  private readonly initWindowSeconds: number;
  /** Max messages a single IP can send within one session window. */
  private readonly maxMessagesPerSession: number;
  /** Message counter TTL in seconds (should match session timeout). */
  private readonly msgWindowSeconds: number;
  /** Hard session lifetime cap in seconds before the IP must reinitialize. */
  private readonly sessionTimeoutSeconds: number;

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.maxInitsPerHour = this.configService.get<number>(
      "AI_MAX_INITS_PER_HOUR",
      AI_MAX_INITS_PER_HOUR,
    );
    this.initWindowSeconds = this.configService.get<number>(
      "AI_INIT_WINDOW_SECONDS",
      AI_INIT_WINDOW_SECONDS,
    );
    this.maxMessagesPerSession = this.configService.get<number>(
      "AI_MAX_MESSAGES_PER_SESSION",
      AI_MAX_MESSAGES_PER_SESSION,
    );
    this.msgWindowSeconds = this.configService.get<number>(
      "AI_MSG_WINDOW_SECONDS",
      AI_MSG_WINDOW_SECONDS,
    );
    this.sessionTimeoutSeconds = this.configService.get<number>(
      "AI_SESSION_TIMEOUT_SECONDS",
      AI_SESSION_TIMEOUT_SECONDS,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.extractClientIp(request);

    try {
      // Check 1: Session timeout — is the 5-minute session still alive?
      await this.enforceSessionTimeout(ip);

      // Check 2: Message rate — under 50 messages per session?
      await this.enforceMessageLimit(ip);

      return true;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`AI Firewall Redis error for IP ${ip}: ${message}`);
      // Fail open on Redis failures
      return true;
    }
  }

  /**
   * Track and enforce initialization rate (called separately by the router
   * on first message of a new conversation).
   *
   * Max 5 initializations per hour per IP.
   */
  async enforceInitializationLimit(ip: string): Promise<void> {
    const key = `${AI_INIT_RATE_KEY_PREFIX}${ip}`;

    const result = (await this.redis.eval(
      FIXED_WINDOW_LUA,
      1,
      key,
      this.initWindowSeconds.toString(),
      this.maxInitsPerHour.toString(),
    )) as number;

    if (result === -1) {
      this.logger.warn(`AI init rate limit exceeded for IP: ${ip}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "AI initialization rate limit exceeded",
          messageFa: RATE_LIMIT_INIT_FA,
          retryAfterSeconds: this.initWindowSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Enforce the 300-second session lifecycle timeout.
   * Public so tRPC procedures can invoke it directly (they bypass canActivate).
   * If the session key has expired, block further interactions.
   */
  async enforceSessionTimeout(ip: string): Promise<void> {
    const key = `${AI_SESSION_KEY_PREFIX}${ip}`;

    const remaining = (await this.redis.eval(
      SESSION_CHECK_LUA,
      1,
      key,
      this.sessionTimeoutSeconds.toString(),
    )) as number;

    if (remaining === -1) {
      this.logger.log(`AI session timeout for IP: ${ip}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "AI session timeout exceeded",
          messageFa: SESSION_TIMEOUT_FA,
          retryAfterSeconds: this.sessionTimeoutSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Enforce per-session message limit (50 messages per 300-second window).
   * Public so tRPC procedures can invoke it directly (they bypass canActivate).
   */
  async enforceMessageLimit(ip: string): Promise<void> {
    const key = `${AI_MSG_RATE_KEY_PREFIX}${ip}`;

    const result = (await this.redis.eval(
      FIXED_WINDOW_LUA,
      1,
      key,
      this.msgWindowSeconds.toString(),
      this.maxMessagesPerSession.toString(),
    )) as number;

    if (result === -1) {
      this.logger.warn(`AI message rate limit exceeded for IP: ${ip}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "AI message rate limit exceeded",
          messageFa: RATE_LIMIT_MSG_FA,
          retryAfterSeconds: this.msgWindowSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Extract the real client IP from the HTTP request.
   * Respects X-Forwarded-For and X-Real-IP headers from reverse proxies.
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
