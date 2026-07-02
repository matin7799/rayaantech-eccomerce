import { createHash } from "node:crypto";
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Request } from "express";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { SCOPES_METADATA_KEY, TOKEN_PREFIX } from "../constants";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { TokenActivityPublisher } from "../interfaces/token-activity-publisher.interface";
import type { CachedTokenRecord } from "../interfaces/token-record.interface";
import { TokenCacheService } from "../services/token-cache.service";

/**
 * Raw query result row shape from the api_tokens table.
 * Index signature required by Drizzle's execute<T> generic constraint.
 */
interface ApiTokenRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  name: string;
  scopes: string[];
  expires_at: string | null;
}

/**
 * NestJS Guard that implements cryptographic API token authentication
 * with a dual-layer cache strategy (Redis → PostgreSQL).
 *
 * Authentication flow:
 * 1. Extract Bearer token from Authorization header
 * 2. Validate rt_tok_ prefix
 * 3. SHA-256 hash the raw token
 * 4. Check Redis cache for the hashed key
 * 5. On miss, query Drizzle ORM (api_tokens table)
 * 6. Verify token is not expired
 * 7. Cache valid token in Redis
 * 8. Verify route-level scope requirements
 * 9. Fire async last_used_at update
 */
@Injectable()
export class ApiTokenGuard implements CanActivate {
  private readonly logger = new Logger(ApiTokenGuard.name);

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(TokenCacheService)
    private readonly tokenCacheService: TokenCacheService,
    @Inject(TokenActivityPublisher)
    private readonly activityPublisher: TokenActivityPublisher,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check for @Public() decorator — skip authentication entirely
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Step 1: Extract and validate the raw bearer token
    const rawToken = this.extractBearerToken(request);

    // Step 2: Compute SHA-256 hash of the raw token
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    // Step 3: Dual-layer lookup (Redis cache → PostgreSQL)
    const tokenRecord = await this.resolveTokenRecord(tokenHash);

    // Step 4: Verify expiration (defense-in-depth, cache TTL handles most cases)
    this.assertNotExpired(tokenRecord);

    // Step 5: Verify scope requirements against route metadata
    this.assertScopesSatisfied(context, tokenRecord);

    // Step 6: Attach token metadata to request for downstream consumers
    (request as Request & { tokenRecord: CachedTokenRecord }).tokenRecord = tokenRecord;

    // Step 7: Fire async last_used_at update (non-blocking)
    void this.activityPublisher.publishLastUsed(tokenRecord.id);

    return true;
  }

  /**
   * Extract the Bearer token from the Authorization header.
   * Validates presence and rt_tok_ prefix.
   */
  private extractBearerToken(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    // Expect format: "Bearer rt_tok_..."
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedException("Malformed Authorization header");
    }

    const token = parts[1];

    if (!token.startsWith(TOKEN_PREFIX)) {
      throw new UnauthorizedException(`Invalid token format: expected ${TOKEN_PREFIX} prefix`);
    }

    return token;
  }

  /**
   * Dual-layer token resolution:
   * 1. Check Redis cache (fast path)
   * 2. On miss, query PostgreSQL via Drizzle raw SQL (slow path)
   * 3. Cache valid record in Redis for subsequent requests
   */
  private async resolveTokenRecord(tokenHash: string): Promise<CachedTokenRecord> {
    // Fast path: Redis cache hit
    const cached = await this.tokenCacheService.getFromCache(tokenHash);
    if (cached) {
      this.logger.debug("Token resolved from Redis cache");
      return cached;
    }

    // Slow path: PostgreSQL query via Drizzle raw SQL
    // Using raw SQL to avoid type incompatibility across workspace packages
    this.logger.debug("Cache miss — querying PostgreSQL");

    const result = await this.db.execute<ApiTokenRow>(sql`
      SELECT id, user_id, name, scopes, expires_at
      FROM api_tokens
      WHERE token_hash = ${tokenHash}
        AND (expires_at IS NULL OR expires_at > NOW())
      LIMIT 1
    `);

    const row = result.rows[0];

    if (!row) {
      throw new UnauthorizedException("Invalid or expired API token");
    }

    // Build the cache record with runtime type validation
    const record: CachedTokenRecord = {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      scopes: this.sanitizeScopes(row.scopes),
      expiresAt: row.expires_at ?? null,
    };

    // Write to Redis cache (non-blocking, best-effort)
    void this.tokenCacheService.setInCache(tokenHash, record);

    return record;
  }

  /**
   * Defense-in-depth expiration check on the resolved record.
   * Handles edge case where cache TTL hasn't expired but token has.
   */
  private assertNotExpired(record: CachedTokenRecord): void {
    if (!record.expiresAt) {
      // Token never expires
      return;
    }

    const expiresMs = new Date(record.expiresAt).getTime();
    if (Date.now() >= expiresMs) {
      throw new UnauthorizedException("API token has expired");
    }
  }

  /**
   * Verify that the token's granted scopes satisfy all scopes
   * declared by the @Scopes() decorator on the route handler.
   *
   * If no @Scopes() decorator is present, scope check is skipped
   * (only token validity is required).
   */
  private assertScopesSatisfied(context: ExecutionContext, record: CachedTokenRecord): void {
    const requiredScopes = this.reflector.getAllAndOverride<string[] | undefined>(
      SCOPES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No scopes declared — any valid token is sufficient
    if (!requiredScopes || requiredScopes.length === 0) {
      return;
    }

    const grantedScopes = new Set(this.sanitizeScopes(record.scopes));
    const missingScopes = requiredScopes.filter((scope) => !grantedScopes.has(scope));

    if (missingScopes.length > 0) {
      // Intentionally vague error — never expose which scopes are missing
      // or any database/schema information in production responses
      throw new ForbiddenException("Insufficient permissions to access this resource");
    }
  }

  /**
   * Runtime type guard that ensures scopes is always a clean string[].
   *
   * Defends against:
   * - Prototype pollution via malformed JSON in Redis cache
   * - Non-array values from corrupted DB rows
   * - Non-string elements injected into the array
   *
   * Returns an empty array if input is not a valid string array,
   * which will cause scope checks to fail-closed (deny access).
   */
  private sanitizeScopes(raw: unknown): string[] {
    // Handle raw JSON string from PostgreSQL json column
    let parsed: unknown = raw;
    if (typeof raw === "string") {
      try {
        parsed = JSON.parse(raw);
      } catch {
        this.logger.warn("Failed to parse scopes JSON string — treating as empty");
        return [];
      }
    }

    // Must be an array
    if (!Array.isArray(parsed)) {
      this.logger.warn("Scopes is not an array — treating as empty");
      return [];
    }

    // Filter to only valid string entries, rejecting prototype keys
    // and non-string values
    return parsed.filter(
      (item): item is string =>
        typeof item === "string" && item.length > 0 && !item.startsWith("__"),
    );
  }
}
