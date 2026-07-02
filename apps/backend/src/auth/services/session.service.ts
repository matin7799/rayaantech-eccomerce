import { createHash, randomBytes } from "node:crypto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Request, Response } from "express";
import type Redis from "ioredis";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { REDIS_CLIENT } from "../../redis/redis.constants";

/**
 * Session TTL: 7 days in seconds.
 */
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Cookie name for user session token.
 */
const SESSION_COOKIE_NAME = "rt_session";

/**
 * Redis key builder for session data.
 */
function sessionKey(tokenHash: string): string {
  return `session:${tokenHash}`;
}

/**
 * User session data stored in Redis.
 */
interface SessionData {
  userId: string;
  mobile: string;
  role: string;
  wholesaleStatus: string;
  createdAt: string;
}

/**
 * Extended session result returned from createSession — includes isNewUser flag
 * for the onboarding gate to determine routing behavior.
 */
export interface SessionCreateResult extends SessionData {
  isNewUser: boolean;
}

/**
 * Row shape from users table lookup.
 */
interface UserRow extends Record<string, unknown> {
  id: string;
  mobile: string;
  role: string;
  full_name: string;
  wholesale_status: string;
}

/**
 * Session management service for web user authentication.
 *
 * Uses signed httpOnly secure cookies backed by Redis session store.
 * Token is hashed (SHA-256) before Redis lookup to prevent session fixation.
 */
@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly isProduction: boolean;

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.isProduction = this.configService.get("NODE_ENV") === "production";
  }

  /**
   * Create a new session after successful OTP/password verification.
   * Sets an httpOnly cookie on the response.
   * Returns session data + isNewUser flag for onboarding gate.
   */
  async createSession(mobile: string, res: Response): Promise<SessionCreateResult> {
    // Lookup or create the user
    const { user, isNewUser } = await this.findOrCreateUser(mobile);

    // Generate a cryptographically random session token
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    // Store session data in Redis
    const sessionData: SessionData = {
      userId: user.id,
      mobile: user.mobile,
      role: user.role,
      wholesaleStatus: user.wholesale_status,
      createdAt: new Date().toISOString(),
    };

    await this.redis.set(
      sessionKey(tokenHash),
      JSON.stringify(sessionData),
      "EX",
      SESSION_TTL_SECONDS,
    );

    // Set httpOnly cookie
    res.cookie(SESSION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: "lax",
      maxAge: SESSION_TTL_SECONDS * 1000,
      path: "/",
    });

    this.logger.debug(`Session created for user ${user.id} (isNewUser: ${isNewUser})`);
    return { ...sessionData, isNewUser };
  }

  /**
   * Resolve a session from the request cookie.
   * Returns null if no valid session exists.
   */
  async resolveSession(req: Request): Promise<SessionData | null> {
    const rawToken = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
    if (!rawToken) return null;

    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const data = await this.redis.get(sessionKey(tokenHash));
    if (!data) return null;

    return JSON.parse(data) as SessionData;
  }

  /**
   * Destroy the current session (logout).
   */
  async destroySession(req: Request, res: Response): Promise<void> {
    const rawToken = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
    if (rawToken) {
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");
      await this.redis.del(sessionKey(tokenHash));
    }
    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  }

  /**
   * Find user by mobile or create a new retail user.
   * Returns the user row and a flag indicating whether it was just created.
   */
  private async findOrCreateUser(mobile: string): Promise<{ user: UserRow; isNewUser: boolean }> {
    const existing = await this.db.execute<UserRow>(sql`
      SELECT id, mobile, role, full_name, wholesale_status
      FROM users WHERE mobile = ${mobile} LIMIT 1
    `);

    if (existing.rows[0]) {
      // Existing user — check if profile is incomplete (empty full_name = never onboarded)
      const isIncomplete = !existing.rows[0].full_name;
      return { user: existing.rows[0], isNewUser: isIncomplete };
    }

    const created = await this.db.execute<UserRow>(sql`
      INSERT INTO users (full_name, mobile, role, is_verified, wholesale_status)
      VALUES ('', ${mobile}, 'retail', true, 'none')
      RETURNING id, mobile, role, full_name, wholesale_status
    `);

    return { user: created.rows[0]!, isNewUser: true };
  }

  /**
   * Create or upgrade a user to wholesale partner with pending approval status.
   * Used during B2B partner registration flow.
   */
  async createPartnerUser(params: {
    mobile: string;
    fullName: string;
    workplaceName: string;
    experience: string;
    documentUrl?: string;
  }): Promise<UserRow> {
    const { mobile, fullName, workplaceName, experience, documentUrl } = params;

    // Check if user already exists
    const existing = await this.db.execute<UserRow>(sql`
      SELECT id, mobile, role, full_name, wholesale_status
      FROM users WHERE mobile = ${mobile} LIMIT 1
    `);

    if (existing.rows[0]) {
      // Upgrade existing user to wholesale pending
      const updated = await this.db.execute<UserRow>(sql`
        UPDATE users
        SET role = 'wholesale',
            wholesale_status = 'pending',
            full_name = ${fullName},
            updated_at = NOW()
        WHERE mobile = ${mobile}
        RETURNING id, mobile, role, full_name, wholesale_status
      `);

      // Store partner metadata (workplace, experience, document) separately
      await this.storePartnerMeta(updated.rows[0]!.id, workplaceName, experience, documentUrl);
      return updated.rows[0]!;
    }

    // Create new wholesale user with pending status
    const created = await this.db.execute<UserRow>(sql`
      INSERT INTO users (full_name, mobile, role, is_verified, wholesale_status)
      VALUES (${fullName}, ${mobile}, 'wholesale', true, 'pending')
      RETURNING id, mobile, role, full_name, wholesale_status
    `);

    await this.storePartnerMeta(created.rows[0]!.id, workplaceName, experience, documentUrl);
    return created.rows[0]!;
  }

  /**
   * Store partner application metadata in Redis for admin review.
   * Key: partner_meta:{userId}
   */
  private async storePartnerMeta(
    userId: string,
    workplaceName: string,
    experience: string,
    documentUrl?: string,
  ): Promise<void> {
    const meta = JSON.stringify({
      workplaceName,
      experience,
      documentUrl: documentUrl ?? null,
      submittedAt: new Date().toISOString(),
    });

    // Store for 90 days (admin review window)
    await this.redis.set(`partner_meta:${userId}`, meta, "EX", 90 * 24 * 60 * 60);
  }
}
