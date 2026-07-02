/**
 * Injection token for the Drizzle ORM database client.
 * Provides a NodePgDatabase instance for type-safe SQL queries.
 */
export const DRIZZLE_CLIENT = Symbol("DRIZZLE_CLIENT");
