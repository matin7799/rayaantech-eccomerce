/**
 * Redis key prefix for rate limit counters.
 * Full key format: rate:ai:{userId}:{feature}
 */
export const RATE_LIMIT_KEY_PREFIX = "rate:ai:";

/**
 * Redis key prefix for cached rate limit settings.
 * Full key format: rate:config:{userId}:{feature} or rate:config:global:{feature}
 */
export const RATE_CONFIG_KEY_PREFIX = "rate:config:";

/**
 * TTL for cached rate limit configuration in Redis (seconds).
 * Admin changes take effect within this window.
 */
export const RATE_CONFIG_CACHE_TTL = 60;

/**
 * Default rate limit: 20 requests per hour.
 * Used when no rule exists in the database.
 */
export const DEFAULT_MAX_REQUESTS = 20;

/**
 * Default time window: 1 hour in seconds.
 */
export const DEFAULT_WINDOW_SECONDS = 3600;

/**
 * Metadata key for the @AiRateLimit() decorator.
 */
export const AI_RATE_LIMIT_FEATURE_KEY = "rate-limit:feature";
