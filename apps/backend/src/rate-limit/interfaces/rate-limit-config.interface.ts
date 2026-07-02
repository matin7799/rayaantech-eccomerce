/**
 * Resolved rate limit configuration for a specific user + feature combination.
 */
export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

/**
 * Result of checking a rate limit counter.
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Current number of requests made in the window */
  currentCount: number;
  /** Maximum allowed requests */
  limit: number;
  /** Seconds remaining until the window resets */
  resetInSeconds: number;
}
