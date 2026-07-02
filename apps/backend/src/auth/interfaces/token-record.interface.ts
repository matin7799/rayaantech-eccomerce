/**
 * Represents a validated API token record, either freshly
 * fetched from PostgreSQL via Drizzle or deserialized from Redis cache.
 */
export interface CachedTokenRecord {
  /** Primary key UUID of the api_tokens row */
  id: string;
  /** Foreign key to the owning user */
  userId: string;
  /** Human-readable token name (e.g. "Production CI Key") */
  name: string;
  /** Granted permission scopes as a string array */
  scopes: string[];
  /** ISO-8601 timestamp when the token expires (null = never expires) */
  expiresAt: string | null;
}
