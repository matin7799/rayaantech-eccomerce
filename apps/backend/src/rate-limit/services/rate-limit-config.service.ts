import { Inject, Injectable, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type Redis from "ioredis";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { REDIS_CLIENT } from "../../redis/redis.constants";
import type { RateLimitConfig } from "../interfaces/rate-limit-config.interface";
import {
  DEFAULT_MAX_REQUESTS,
  DEFAULT_WINDOW_SECONDS,
  RATE_CONFIG_CACHE_TTL,
  RATE_CONFIG_KEY_PREFIX,
} from "../rate-limit.constants";

/**
 * DB row shape for the rate_limits query.
 */
interface RateLimitRow extends Record<string, unknown> {
  max_requests: number;
  window_seconds: number;
}

/**
 * Service that resolves rate limit configuration for a given user + feature.
 *
 * Resolution order:
 * 1. Redis cache (fast path, 60s TTL)
 * 2. Per-user rule from DB (user_id = X AND feature = Y AND is_active = true)
 * 3. Global default rule from DB (user_id IS NULL AND feature = Y AND is_active = true)
 * 4. Hardcoded fallback: 20 requests per hour
 *
 * Admins update rules via the admin panel → changes propagate within 60s
 * via cache expiration.
 */
@Injectable()
export class RateLimitConfigService {
  private readonly logger = new Logger(RateLimitConfigService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Get the rate limit config for a specific user and feature.
   * Checks cache first, falls back to DB, applies global defaults.
   */
  async getConfig(userId: string, feature: string): Promise<RateLimitConfig> {
    // Try user-specific cached config
    const userCacheKey = `${RATE_CONFIG_KEY_PREFIX}${userId}:${feature}`;
    const cachedConfig = await this.getFromCache(userCacheKey);
    if (cachedConfig) {
      return cachedConfig;
    }

    // Try user-specific rule from DB
    const userRule = await this.queryUserRule(userId, feature);
    if (userRule) {
      void this.setInCache(userCacheKey, userRule);
      return userRule;
    }

    // Try global default cached config
    const globalCacheKey = `${RATE_CONFIG_KEY_PREFIX}global:${feature}`;
    const cachedGlobal = await this.getFromCache(globalCacheKey);
    if (cachedGlobal) {
      // Also cache under the user key to avoid repeated global lookups
      void this.setInCache(userCacheKey, cachedGlobal);
      return cachedGlobal;
    }

    // Try global default rule from DB
    const globalRule = await this.queryGlobalRule(feature);
    if (globalRule) {
      void this.setInCache(globalCacheKey, globalRule);
      void this.setInCache(userCacheKey, globalRule);
      return globalRule;
    }

    // Hardcoded fallback — ensures rate limiting always applies
    const fallback: RateLimitConfig = {
      maxRequests: DEFAULT_MAX_REQUESTS,
      windowSeconds: DEFAULT_WINDOW_SECONDS,
    };

    void this.setInCache(userCacheKey, fallback);
    return fallback;
  }

  /**
   * Invalidate all cached rate limit configs for a user.
   * Called when admin updates a rule.
   */
  async invalidateUserConfig(userId: string, feature: string): Promise<void> {
    try {
      const userCacheKey = `${RATE_CONFIG_KEY_PREFIX}${userId}:${feature}`;
      await this.redis.del(userCacheKey);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to invalidate user rate config: ${message}`);
    }
  }

  /**
   * Invalidate the global default config cache for a feature.
   * Called when admin updates the global rule.
   */
  async invalidateGlobalConfig(feature: string): Promise<void> {
    try {
      const globalCacheKey = `${RATE_CONFIG_KEY_PREFIX}global:${feature}`;
      await this.redis.del(globalCacheKey);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to invalidate global rate config: ${message}`);
    }
  }

  private async getFromCache(key: string): Promise<RateLimitConfig | null> {
    try {
      const raw = await this.redis.get(key);
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed) &&
        typeof (parsed as Record<string, unknown>).maxRequests === "number" &&
        typeof (parsed as Record<string, unknown>).windowSeconds === "number"
      ) {
        return parsed as RateLimitConfig;
      }

      return null;
    } catch {
      return null;
    }
  }

  private async setInCache(key: string, config: RateLimitConfig): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(config), "EX", RATE_CONFIG_CACHE_TTL);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to cache rate config: ${message}`);
    }
  }

  private async queryUserRule(userId: string, feature: string): Promise<RateLimitConfig | null> {
    try {
      const result = await this.db.execute<RateLimitRow>(sql`
        SELECT max_requests, window_seconds
        FROM rate_limits
        WHERE user_id = ${userId}
          AND feature = ${feature}
          AND is_active = true
        LIMIT 1
      `);

      const row = result.rows[0];
      if (!row) return null;

      return {
        maxRequests: row.max_requests,
        windowSeconds: row.window_seconds,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Failed to query user rate limit rule: ${message}`);
      return null;
    }
  }

  private async queryGlobalRule(feature: string): Promise<RateLimitConfig | null> {
    try {
      const result = await this.db.execute<RateLimitRow>(sql`
        SELECT max_requests, window_seconds
        FROM rate_limits
        WHERE user_id IS NULL
          AND feature = ${feature}
          AND is_active = true
        LIMIT 1
      `);

      const row = result.rows[0];
      if (!row) return null;

      return {
        maxRequests: row.max_requests,
        windowSeconds: row.window_seconds,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Failed to query global rate limit rule: ${message}`);
      return null;
    }
  }
}
