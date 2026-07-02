import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Post,
  Req,
} from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Request } from "express";
import type Redis from "ioredis";
import { Scopes } from "../auth/decorators/scopes.decorator";
import type { CachedTokenRecord } from "../auth/interfaces/token-record.interface";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { REDIS_CLIENT } from "../redis/redis.constants";
import { GUEST_RATE_KEY_PREFIX } from "./voice-ai.constants";

/**
 * Request body for the session merge endpoint.
 */
interface MergeSessionDto {
  /** The guest_session_id to re-parent to the authenticated user */
  guestSessionId: string;
}

/**
 * Row shape for the merge verification query.
 */
interface SessionRow extends Record<string, unknown> {
  id: string;
  user_id: string | null;
  guest_session_id: string | null;
}

/**
 * Voice AI Session Management Controller.
 *
 * Handles guest-to-user session migration (re-parenting) when a visitor
 * authenticates or registers after using the AI as a guest.
 *
 * Base path: /api/v1/voice-ai/session
 */
@Controller("api/v1/voice-ai/session")
export class VoiceAiSessionController {
  private readonly logger = new Logger(VoiceAiSessionController.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Merge a guest chat session into the authenticated user's account.
   *
   * INVARIANT: Wrapped in an isolated database transaction block.
   * 1. Verifies the guest_session_id exists and is currently unassigned (user_id IS NULL)
   * 2. Atomically sets user_id to the authenticated user's ID
   * 3. Deletes the corresponding guest rate limit key from Redis
   *
   * This preserves the full conversational history and allows the AI
   * assistant to instantly inherit context from the guest session.
   *
   * Required scope: orders:write (any authenticated user can merge their own session)
   */
  @Post("merge")
  @Scopes("orders:write")
  @HttpCode(HttpStatus.OK)
  async mergeSession(
    @Body() body: MergeSessionDto,
    @Req() request: Request,
  ): Promise<{ data: { merged: boolean; sessionCount: number } }> {
    // Validate input
    if (!body.guestSessionId || body.guestSessionId.trim().length === 0) {
      throw new BadRequestException("guestSessionId is required");
    }

    // Extract the authenticated user ID from the token record
    const tokenRecord = (request as Request & { tokenRecord: CachedTokenRecord }).tokenRecord;
    const userId = tokenRecord.userId;
    const guestSessionId = body.guestSessionId.trim();

    // Execute the merge inside a database transaction with row-level locking
    const result = await this.db.transaction(async (tx) => {
      // Step 1: Acquire exclusive row-level lock on matching sessions
      // FOR UPDATE prevents concurrent transactions from reading these rows
      // until this transaction commits — eliminates the race condition where
      // two users could both see user_id IS NULL simultaneously
      const sessionsResult = await tx.execute<SessionRow>(sql`
        SELECT id, user_id, guest_session_id
        FROM ai_chat_sessions
        WHERE guest_session_id = ${guestSessionId}
          AND user_id IS NULL
        FOR UPDATE
      `);

      const sessions = sessionsResult.rows;

      if (sessions.length === 0) {
        throw new NotFoundException("No unassigned guest sessions found with the provided ID");
      }

      // Step 2: Atomically re-parent all locked sessions to the authenticated user
      const updateResult = await tx.execute<{ id: string } & Record<string, unknown>>(sql`
        UPDATE ai_chat_sessions
        SET user_id = ${userId},
            updated_at = NOW()
        WHERE guest_session_id = ${guestSessionId}
          AND user_id IS NULL
        RETURNING id
      `);

      // Step 3: Verify the UPDATE actually affected rows (defense-in-depth)
      // This guards against the edge case where rows were modified between
      // the SELECT FOR UPDATE and the UPDATE (should not happen with FOR UPDATE,
      // but guarantees correctness regardless of isolation level)
      if (updateResult.rows.length === 0) {
        throw new NotFoundException("Sessions were claimed by another request during processing");
      }

      return { sessionCount: updateResult.rows.length };
    });

    // Step 3: Delete the guest rate limit counter from Redis
    // This allows the now-authenticated user to use the full 10/min tier
    const guestRateKey = `${GUEST_RATE_KEY_PREFIX}${guestSessionId}`;
    try {
      await this.redis.del(guestRateKey);
      this.logger.debug(`Deleted guest rate key: ${guestRateKey}`);
    } catch (err: unknown) {
      // Non-critical — log but don't fail the merge
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to delete guest rate key: ${message}`);
    }

    this.logger.log(
      `Merged ${result.sessionCount} guest session(s) (${guestSessionId}) → user ${userId}`,
    );

    return {
      data: {
        merged: true,
        sessionCount: result.sessionCount,
      },
    };
  }
}
