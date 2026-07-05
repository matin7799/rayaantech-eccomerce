import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import type Redis from "ioredis";
import type { Socket } from "socket.io";
import { REDIS_CLIENT } from "../../redis/redis.constants";
import {
  GUEST_LIMIT_EXHAUSTED_PAYLOAD,
  GUEST_MAX_MESSAGES_TOTAL,
  GUEST_RATE_KEY_PREFIX,
  GUEST_RATE_TTL_SECONDS,
  RATE_LIMIT_MESSAGE_FA,
  VOICE_MAX_REQUESTS_PER_MINUTE,
  VOICE_RATE_KEY_PREFIX,
  VOICE_WINDOW_SECONDS,
} from "../voice-ai.constants";

/**
 * Lua script implementing an atomic sliding-window rate limiter
 * for AUTHENTICATED users (10 requests per 60 seconds).
 *
 * Algorithm (sorted set sliding window):
 * 1. Remove all entries older than the window boundary (ZREMRANGEBYSCORE)
 * 2. Count remaining entries in the set (ZCARD)
 * 3. If under limit, add current timestamp (ZADD) and set TTL (EXPIRE)
 * 4. Return current count
 */
const SLIDING_WINDOW_LUA = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])

  -- Remove entries outside the sliding window
  redis.call('ZREMRANGEBYSCORE', key, 0, now - window * 1000)

  -- Count current entries within the window
  local count = redis.call('ZCARD', key)

  -- If under limit, record this request
  if count < limit then
    redis.call('ZADD', key, now, now .. '-' .. math.random(100000))
    redis.call('EXPIRE', key, window)
    return count + 1
  end

  -- Over limit — return -1 to signal rejection
  return -1
`;

/**
 * Lua script implementing a hard-cap lifetime counter for GUEST sessions.
 * 3 messages TOTAL across entire session lifetime (30-day TTL for cleanup).
 *
 * Algorithm:
 * 1. INCR the counter key
 * 2. If this is the first increment (value = 1), set TTL
 * 3. If counter exceeds limit, return -1
 * 4. Otherwise return current count
 */
const GUEST_HARD_CAP_LUA = `
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local ttl = tonumber(ARGV[2])

  local current = redis.call('INCR', key)

  -- Set TTL on first message (key creation)
  if current == 1 then
    redis.call('EXPIRE', key, ttl)
  end

  -- Check if over the hard cap
  if current > limit then
    return -1
  end

  return current
`;

/**
 * Voice AI Firewall Guard — Tiered Distributed Rate Limiter.
 *
 * Implements two distinct rate limiting tiers:
 *
 * AUTHENTICATED USERS (has valid rt_tok_ token):
 * - Key: rate:voice:{ip_address}
 * - Limit: 10 requests per 60 seconds (sliding window)
 * - Algorithm: Sorted-set sliding window (Lua atomic)
 *
 * GUEST/UNAUTHENTICATED SESSIONS:
 * - Key: rate:voice:guest:{guest_session_id}
 * - Limit: 3 messages TOTAL (lifetime cap)
 * - TTL: 30 days (cleanup only)
 * - On exhaustion: Emits marketing trigger (REQUIRE_AUTHENTICATION)
 *
 * When a guest hits their 3-message cap, the pipeline is dropped and
 * a structured marketing payload is emitted to prompt registration.
 */
@Injectable()
export class VoiceAiFirewallGuard implements CanActivate {
  private readonly logger = new Logger(VoiceAiFirewallGuard.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const isAuthenticated = this.isAuthenticatedClient(client);

    if (isAuthenticated) {
      return this.enforceAuthenticatedLimit(client);
    }

    return this.enforceGuestLimit(client);
  }

  /**
   * Enforce sliding-window rate limit for authenticated users.
   * 10 requests per 60 seconds per IP.
   */
  private async enforceAuthenticatedLimit(client: Socket): Promise<boolean> {
    const ip = this.extractClientIp(client);
    const key = `${VOICE_RATE_KEY_PREFIX}${ip}`;

    try {
      const result = (await this.redis.eval(
        SLIDING_WINDOW_LUA,
        1,
        key,
        Date.now().toString(),
        VOICE_WINDOW_SECONDS.toString(),
        VOICE_MAX_REQUESTS_PER_MINUTE.toString(),
      )) as number;

      if (result === -1) {
        this.logger.warn(`Authenticated rate limit exceeded for IP ${ip}`);

        client.emit("error", {
          statusCode: 429,
          message: "Voice AI rate limit exceeded",
          messageFa: RATE_LIMIT_MESSAGE_FA,
          retryAfterSeconds: VOICE_WINDOW_SECONDS,
        });

        throw new WsException({
          statusCode: 429,
          message: "Rate limit exceeded",
          messageFa: RATE_LIMIT_MESSAGE_FA,
        });
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof WsException) throw err;

      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Voice AI firewall Redis error (auth): ${message}`);
      return true; // Fail open on Redis failure
    }
  }

  /**
   * Enforce hard-cap lifetime limit for guest sessions.
   * 3 messages TOTAL across the entire guest session.
   *
   * On exhaustion: emits a marketing trigger payload prompting
   * the user to authenticate for continued access.
   */
  private async enforceGuestLimit(client: Socket): Promise<boolean> {
    const guestSessionId = this.extractGuestSessionId(client);
    const key = `${GUEST_RATE_KEY_PREFIX}${guestSessionId}`;

    try {
      const result = (await this.redis.eval(
        GUEST_HARD_CAP_LUA,
        1,
        key,
        GUEST_MAX_MESSAGES_TOTAL.toString(),
        GUEST_RATE_TTL_SECONDS.toString(),
      )) as number;

      if (result === -1) {
        this.logger.log(
          `Guest session ${guestSessionId} exhausted message quota (${GUEST_MAX_MESSAGES_TOTAL})`,
        );

        // Emit the marketing trigger payload to prompt registration
        client.emit("limit_exhausted", GUEST_LIMIT_EXHAUSTED_PAYLOAD);

        throw new WsException({
          statusCode: 429,
          ...GUEST_LIMIT_EXHAUSTED_PAYLOAD,
        });
      }

      this.logger.debug(`Guest ${guestSessionId}: message ${result}/${GUEST_MAX_MESSAGES_TOTAL}`);

      return true;
    } catch (err: unknown) {
      if (err instanceof WsException) throw err;

      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Voice AI firewall Redis error (guest): ${message}`);
      return true; // Fail open on Redis failure
    }
  }

  /**
   * Determine if the WebSocket client is authenticated.
   * Either an rt_tok_ API token in the handshake query, or a valid rt_session
   * cookie resolved by the gateway on connect (client.data.isAuthenticated).
   */
  private isAuthenticatedClient(client: Socket): boolean {
    if (client.data?.isAuthenticated === true) return true;
    const token = client.handshake.query.token as string | undefined;
    return !!token && token.startsWith("rt_tok_");
  }

  /**
   * Extract the guest session ID from the WebSocket handshake.
   * Falls back to socket ID if no guest_session_id is provided.
   */
  private extractGuestSessionId(client: Socket): string {
    const guestId = client.handshake.query.guest_session_id as string | undefined;
    return guestId || client.id;
  }

  /**
   * Extract the real client IP from the WebSocket handshake.
   */
  private extractClientIp(client: Socket): string {
    const handshake = client.handshake;

    const forwarded = handshake.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const firstIp = forwarded.split(",")[0].trim();
      if (firstIp) return firstIp;
    }

    const realIp = handshake.headers["x-real-ip"];
    if (typeof realIp === "string" && realIp) return realIp;

    return handshake.address || "unknown";
  }
}
