/**
 * Injection token for the ioredis client instance.
 * Used across modules that require direct Redis access.
 */
export const REDIS_CLIENT = Symbol("REDIS_CLIENT");
