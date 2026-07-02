import { Inject, Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.constants";
import { MAX_CACHE_TTL_SECONDS, TOKEN_CACHE_PREFIX } from "../constants";
import type { CachedTokenRecord } from "../interfaces/token-record.interface";

/**
 * Service responsible for the dual-layer token lookup:
 * Redis cache (fast path) → PostgreSQL via Drizzle (slow path).
 *
 * On cache miss, the validated record is written back to Redis
 * with a TTL of Math.min(300, seconds_until_token_expires).
 */
@Injectable()
export class TokenCacheService {
  private readonly logger = new Logger(TokenCacheService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Attempt to retrieve a cached token record from Redis.
   *
   * @param tokenHash - SHA-256 hex digest of the raw bearer token
   * @returns Parsed token record or null on cache miss / parse failure
   */
  async getFromCache(tokenHash: string): Promise<CachedTokenRecord | null> {
    try {
      const key = `${TOKEN_CACHE_PREFIX}${tokenHash}`;
      const raw = await this.redis.get(key);

      if (!raw) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);

      // Runtime validation — reject cache entries that don't match expected shape
      if (!this.isValidCachedRecord(parsed)) {
        this.logger.warn("Cached token record failed shape validation — evicting");
        void this.redis.del(key).catch(() => {});
        return null;
      }

      return parsed;
    } catch (err: unknown) {
      // Redis failure should never crash the auth pipeline —
      // fall through to DB lookup gracefully
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Redis cache read failed: ${message}`);
      return null;
    }
  }

  /**
   * Store a validated token record in Redis with a safe TTL.
   *
   * TTL calculation: min(300 seconds, seconds until token expires).
   * If the token has no expiry, the full 300s ceiling is used.
   *
   * @param tokenHash - SHA-256 hex digest (used as cache key suffix)
   * @param record - Validated token data to cache
   */
  async setInCache(tokenHash: string, record: CachedTokenRecord): Promise<void> {
    try {
      const key = `${TOKEN_CACHE_PREFIX}${tokenHash}`;
      const ttl = this.computeTtl(record.expiresAt);

      if (ttl <= 0) {
        // Token is already expired — do not cache
        return;
      }

      await this.redis.set(key, JSON.stringify(record), "EX", ttl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Redis cache write failed: ${message}`);
    }
  }

  /**
   * Invalidate a cached token (e.g., on revocation).
   *
   * @param tokenHash - SHA-256 hex digest of the revoked token
   */
  async invalidate(tokenHash: string): Promise<void> {
    try {
      const key = `${TOKEN_CACHE_PREFIX}${tokenHash}`;
      await this.redis.del(key);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Redis cache invalidation failed: ${message}`);
    }
  }

  /**
   * Compute a safe TTL in seconds, capped at MAX_CACHE_TTL_SECONDS.
   */
  private computeTtl(expiresAt: string | null): number {
    if (!expiresAt) {
      // No expiry on token — use maximum cache window
      return MAX_CACHE_TTL_SECONDS;
    }

    const expiresMs = new Date(expiresAt).getTime();
    const nowMs = Date.now();
    const secondsUntilExpiry = Math.floor((expiresMs - nowMs) / 1_000);

    return Math.min(MAX_CACHE_TTL_SECONDS, secondsUntilExpiry);
  }

  /**
   * Runtime shape validation for deserialized cache entries.
   * Rejects malformed/poisoned entries to prevent prototype pollution
   * or type confusion attacks downstream.
   */
  private isValidCachedRecord(value: unknown): value is CachedTokenRecord {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return false;
    }

    const obj = value as Record<string, unknown>;

    return (
      typeof obj.id === "string" &&
      typeof obj.userId === "string" &&
      typeof obj.name === "string" &&
      Array.isArray(obj.scopes) &&
      obj.scopes.every((s: unknown) => typeof s === "string") &&
      (obj.expiresAt === null || typeof obj.expiresAt === "string")
    );
  }
}
