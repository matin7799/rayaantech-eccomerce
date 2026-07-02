import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

/**
 * Global Redis module that provides an ioredis client instance
 * to any module in the application without explicit imports.
 *
 * Configuration is sourced from environment variables:
 * - REDIS_HOST (default: 127.0.0.1)
 * - REDIS_PORT (default: 6379)
 * - REDIS_PASSWORD (optional)
 * - REDIS_DB (default: 0)
 */
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService): Redis => {
        const host = configService.get<string>("REDIS_HOST", "127.0.0.1");
        const port = configService.get<number>("REDIS_PORT", 6379);
        const password = configService.get<string>("REDIS_PASSWORD", "");
        const db = configService.get<number>("REDIS_DB", 0);

        const client = new Redis({
          host,
          port,
          password: password || undefined,
          db,
          // Reconnect with exponential backoff capped at 10 seconds
          retryStrategy(times: number): number {
            return Math.min(times * 200, 10_000);
          },
          // Disable offline command queuing to fail fast during outages
          enableOfflineQueue: false,
          // Connection timeout for initial handshake
          connectTimeout: 5_000,
          // Automatic reconnection on disconnect
          lazyConnect: false,
        });

        client.on("error", (err: Error) => {
          // Log but do not crash — the guard falls back to DB on Redis failure
          console.error("[RedisModule] Connection error:", err.message);
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
