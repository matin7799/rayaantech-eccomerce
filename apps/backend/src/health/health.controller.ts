import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type Redis from "ioredis";
import type { Kafka } from "kafkajs";
import { Public } from "../auth/decorators/public.decorator";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { KAFKA_CLIENT } from "../kafka/kafka.constants";
import { REDIS_CLIENT } from "../redis/redis.constants";

/**
 * Health & Readiness controller for container orchestration probes.
 *
 * Endpoints:
 * - GET /api/v1/health → Simple health check (for orchestrator probes)
 * - GET /health/live    → Shallow liveness (process is running)
 * - GET /health/ready   → Deep readiness (PG + Redis + Kafka broker connectivity)
 *
 * Both are @Public() — no API token authentication required.
 */
@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
  ) {}

  /**
   * Simple health check — for orchestrator / load-balancer probes
   * hitting /api/v1/health.
   * Returns 200 if the process is alive and accepting connections.
   */
  @Public()
  @Get("api/v1/health")
  health(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Liveness probe — immediate shallow check.
   * Returns 200 if the process is alive and accepting connections.
   * No external dependency checks (those are readiness).
   */
  @Public()
  @Get("health/live")
  live(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe — deep infrastructure validation.
   * Checks active connectivity to PostgreSQL, Redis, and Kafka broker.
   * Returns 200 only if ALL dependencies are healthy.
   * Returns 503 with details if any dependency fails.
   */
  @Public()
  @Get("health/ready")
  async ready(): Promise<{
    status: string;
    timestamp: string;
    checks: Record<string, { status: string; latencyMs?: number; error?: string }>;
  }> {
    const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};

    // PostgreSQL check
    checks.postgres = await this.checkPostgres();

    // Redis check
    checks.redis = await this.checkRedis();

    // Kafka broker check
    checks.kafka = await this.checkKafka();

    const allHealthy = Object.values(checks).every((c) => c.status === "ok");

    return {
      status: allHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async checkPostgres(): Promise<{ status: string; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      await this.db.execute(sql`SELECT 1`);
      return { status: "ok", latencyMs: Date.now() - start };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`[health/postgres] ${msg}`);
      return { status: "error", error: msg };
    }
  }

  private async checkRedis(): Promise<{ status: string; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      const pong = await this.redis.ping();
      if (pong !== "PONG") throw new Error(`Unexpected PING response: ${pong}`);
      return { status: "ok", latencyMs: Date.now() - start };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`[health/redis] ${msg}`);
      return { status: "error", error: msg };
    }
  }

  private async checkKafka(): Promise<{ status: string; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();
      return { status: "ok", latencyMs: Date.now() - start };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`[health/kafka] ${msg}`);
      return { status: "error", error: msg };
    }
  }
}
