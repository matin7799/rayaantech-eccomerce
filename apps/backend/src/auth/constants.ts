/**
 * Metadata key used by the @Scopes() decorator to attach
 * required scopes to route handler metadata.
 */
export const SCOPES_METADATA_KEY = "auth:scopes";

/**
 * Redis key prefix for cached token records.
 * Full key format: auth:token:hash:{sha256_hex}
 */
export const TOKEN_CACHE_PREFIX = "auth:token:hash:";

/**
 * Maximum cache TTL in seconds (5 minutes).
 * Actual TTL is Math.min(MAX_CACHE_TTL, seconds_until_token_expires).
 */
export const MAX_CACHE_TTL_SECONDS = 300;

/**
 * Expected token prefix for enterprise API tokens.
 */
export const TOKEN_PREFIX = "rt_tok_";

/**
 * Event name for the async last_used_at update.
 */
export const TOKEN_USED_EVENT = "token.used";
