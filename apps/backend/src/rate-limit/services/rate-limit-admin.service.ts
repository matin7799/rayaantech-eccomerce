import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { RateLimitConfigService } from "./rate-limit-config.service";

/**
 * DB row shape for rate_limits queries.
 */
interface RateLimitRuleRow extends Record<string, unknown> {
  id: string;
  user_id: string | null;
  feature: string;
  max_requests: number;
  window_seconds: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * DTO for creating a rate limit rule.
 */
export interface CreateRateLimitDto {
  userId?: string | null;
  feature: string;
  maxRequests: number;
  windowSeconds: number;
}

/**
 * DTO for updating a rate limit rule.
 */
export interface UpdateRateLimitDto {
  maxRequests?: number;
  windowSeconds?: number;
  isActive?: boolean;
}

/**
 * Public-facing rate limit rule representation.
 */
export interface RateLimitRule {
  id: string;
  userId: string | null;
  feature: string;
  maxRequests: number;
  windowSeconds: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin service for CRUD operations on rate limit rules.
 *
 * Used by the admin panel to:
 * - View all current rules (global + per-user)
 * - Create new rules for specific users or as global defaults
 * - Update existing rules (change limits, window, enable/disable)
 * - Delete rules
 *
 * After any mutation, the Redis config cache is invalidated
 * so changes propagate immediately instead of waiting for TTL.
 */
@Injectable()
export class RateLimitAdminService {
  private readonly logger = new Logger(RateLimitAdminService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(RateLimitConfigService)
    private readonly configService: RateLimitConfigService,
  ) {}

  /**
   * List all rate limit rules, optionally filtered by feature.
   */
  async listRules(feature?: string): Promise<RateLimitRule[]> {
    let result: { rows: RateLimitRuleRow[] };

    if (feature) {
      result = await this.db.execute<RateLimitRuleRow>(sql`
        SELECT id, user_id, feature, max_requests, window_seconds, is_active, created_at, updated_at
        FROM rate_limits
        WHERE feature = ${feature}
        ORDER BY user_id NULLS FIRST, created_at DESC
      `);
    } else {
      result = await this.db.execute<RateLimitRuleRow>(sql`
        SELECT id, user_id, feature, max_requests, window_seconds, is_active, created_at, updated_at
        FROM rate_limits
        ORDER BY feature, user_id NULLS FIRST, created_at DESC
      `);
    }

    return result.rows.map((row) => this.mapRowToRule(row));
  }

  /**
   * Get a single rate limit rule by ID.
   */
  async getRuleById(id: string): Promise<RateLimitRule> {
    const result = await this.db.execute<RateLimitRuleRow>(sql`
      SELECT id, user_id, feature, max_requests, window_seconds, is_active, created_at, updated_at
      FROM rate_limits
      WHERE id = ${id}
      LIMIT 1
    `);

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException(`Rate limit rule with ID "${id}" not found`);
    }

    return this.mapRowToRule(row);
  }

  /**
   * Create a new rate limit rule.
   *
   * @param dto.userId - Target user ID (null = global default)
   * @param dto.feature - Feature category (e.g. "ai:text", "ai:voice")
   * @param dto.maxRequests - Maximum requests in the window
   * @param dto.windowSeconds - Window duration in seconds
   */
  async createRule(dto: CreateRateLimitDto): Promise<RateLimitRule> {
    const userId = dto.userId ?? null;

    const result = await this.db.execute<RateLimitRuleRow>(sql`
      INSERT INTO rate_limits (user_id, feature, max_requests, window_seconds, is_active)
      VALUES (${userId}, ${dto.feature}, ${dto.maxRequests}, ${dto.windowSeconds}, true)
      RETURNING id, user_id, feature, max_requests, window_seconds, is_active, created_at, updated_at
    `);

    const row = result.rows[0];
    const rule = this.mapRowToRule(row);

    // Invalidate cache so new rule takes effect immediately
    await this.invalidateCache(userId, dto.feature);

    this.logger.log(
      `Created rate limit rule: ${rule.id} (${userId ? `user: ${userId}` : "global"}, ` +
        `${dto.feature}, ${dto.maxRequests} req/${dto.windowSeconds}s)`,
    );

    return rule;
  }

  /**
   * Update an existing rate limit rule.
   */
  async updateRule(id: string, dto: UpdateRateLimitDto): Promise<RateLimitRule> {
    // Fetch existing to get userId/feature for cache invalidation
    const existing = await this.getRuleById(id);

    // Build dynamic SET clause based on provided fields
    const setClauses: string[] = ["updated_at = NOW()"];
    const values: unknown[] = [];

    if (dto.maxRequests !== undefined) {
      values.push(dto.maxRequests);
      setClauses.push(`max_requests = ${dto.maxRequests}`);
    }
    if (dto.windowSeconds !== undefined) {
      values.push(dto.windowSeconds);
      setClauses.push(`window_seconds = ${dto.windowSeconds}`);
    }
    if (dto.isActive !== undefined) {
      values.push(dto.isActive);
      setClauses.push(`is_active = ${dto.isActive}`);
    }

    // Use raw SQL with individual parameters for safety
    const result = await this.db.execute<RateLimitRuleRow>(sql`
      UPDATE rate_limits
      SET
        max_requests = COALESCE(${dto.maxRequests ?? null}, max_requests),
        window_seconds = COALESCE(${dto.windowSeconds ?? null}, window_seconds),
        is_active = COALESCE(${dto.isActive ?? null}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, user_id, feature, max_requests, window_seconds, is_active, created_at, updated_at
    `);

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException(`Rate limit rule with ID "${id}" not found`);
    }

    const rule = this.mapRowToRule(row);

    // Invalidate cache
    await this.invalidateCache(existing.userId, existing.feature);

    this.logger.log(`Updated rate limit rule: ${rule.id}`);
    return rule;
  }

  /**
   * Delete a rate limit rule by ID.
   */
  async deleteRule(id: string): Promise<void> {
    // Fetch existing for cache invalidation
    const existing = await this.getRuleById(id);

    await this.db.execute(sql`
      DELETE FROM rate_limits WHERE id = ${id}
    `);

    // Invalidate cache
    await this.invalidateCache(existing.userId, existing.feature);

    this.logger.log(`Deleted rate limit rule: ${id}`);
  }

  /**
   * Invalidate relevant cache entries after a mutation.
   */
  private async invalidateCache(userId: string | null, feature: string): Promise<void> {
    if (userId) {
      await this.configService.invalidateUserConfig(userId, feature);
    } else {
      await this.configService.invalidateGlobalConfig(feature);
    }
  }

  /**
   * Map a database row to a public-facing rule object.
   */
  private mapRowToRule(row: RateLimitRuleRow): RateLimitRule {
    return {
      id: row.id,
      userId: row.user_id,
      feature: row.feature,
      maxRequests: row.max_requests,
      windowSeconds: row.window_seconds,
      isActive: row.is_active,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}
