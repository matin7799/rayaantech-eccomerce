import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DRIZZLE_CLIENT } from "./database.constants";

/**
 * Global database module providing a Drizzle ORM client backed by
 * a node-postgres connection pool.
 *
 * Configuration is sourced from environment variables:
 * - DATABASE_URL: Full PostgreSQL connection string
 *
 * The pool is configured with sensible defaults for a production
 * NestJS application with connection recycling.
 */
@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_CLIENT,
      useFactory: (configService: ConfigService): NodePgDatabase => {
        const connectionString = configService.getOrThrow<string>("DATABASE_URL");

        const pool = new Pool({
          connectionString,
          // Production-grade pool settings
          max: 20,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 5_000,
        });

        return drizzle(pool);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE_CLIENT],
})
export class DatabaseModule {}
