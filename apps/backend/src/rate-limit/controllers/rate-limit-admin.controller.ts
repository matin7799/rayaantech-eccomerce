import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Scopes } from "../../auth/decorators/scopes.decorator";
import {
  type CreateRateLimitDto,
  RateLimitAdminService,
  type RateLimitRule,
  type UpdateRateLimitDto,
} from "../services/rate-limit-admin.service";

/**
 * Admin REST controller for managing AI rate limit rules.
 *
 * All endpoints require admin-level token scopes.
 * Changes take effect immediately (cache is invalidated on mutation).
 *
 * Endpoints:
 * - GET    /admin/rate-limits         → List all rules
 * - GET    /admin/rate-limits/:id     → Get a single rule
 * - POST   /admin/rate-limits         → Create a new rule
 * - PATCH  /admin/rate-limits/:id     → Update a rule
 * - DELETE /admin/rate-limits/:id     → Delete a rule
 */
@Controller("admin/rate-limits")
@Scopes("admin:rate-limits")
export class RateLimitAdminController {
  constructor(
    @Inject(RateLimitAdminService) private readonly adminService: RateLimitAdminService,
  ) {}

  /**
   * List all rate limit rules. Optionally filter by feature.
   *
   * @query feature - Optional filter (e.g. "ai:text", "ai:voice")
   */
  @Get()
  async listRules(@Query("feature") feature?: string): Promise<{ data: RateLimitRule[] }> {
    const rules = await this.adminService.listRules(feature);
    return { data: rules };
  }

  /**
   * Get a single rate limit rule by ID.
   */
  @Get(":id")
  async getRuleById(@Param("id") id: string): Promise<{ data: RateLimitRule }> {
    const rule = await this.adminService.getRuleById(id);
    return { data: rule };
  }

  /**
   * Create a new rate limit rule.
   *
   * Body:
   * - userId (optional): Target user UUID. Omit for global default.
   * - feature (required): Feature category string (e.g. "ai:text")
   * - maxRequests (required): Max requests allowed in the window
   * - windowSeconds (required): Window duration in seconds
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRule(@Body() body: CreateRateLimitDto): Promise<{ data: RateLimitRule }> {
    const rule = await this.adminService.createRule(body);
    return { data: rule };
  }

  /**
   * Update an existing rate limit rule.
   *
   * Body (all optional):
   * - maxRequests: New request limit
   * - windowSeconds: New window duration
   * - isActive: Enable/disable the rule
   */
  @Patch(":id")
  async updateRule(
    @Param("id") id: string,
    @Body() body: UpdateRateLimitDto,
  ): Promise<{ data: RateLimitRule }> {
    const rule = await this.adminService.updateRule(id, body);
    return { data: rule };
  }

  /**
   * Delete a rate limit rule.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRule(@Param("id") id: string): Promise<void> {
    await this.adminService.deleteRule(id);
  }
}
