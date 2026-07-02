import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { MARKETING_AI_INTENT_EVENT } from "../voice-ai.constants";

/**
 * Payload shape for the marketing.ai_intent event.
 */
interface MarketingIntentPayload {
  sessionId: string;
  guestSessionId: string | null;
  userId: string | null;
  disconnectedAt: string;
  matchedProductIds?: string[];
  intentTags?: string[];
}

/**
 * Non-blocking marketing event listener.
 *
 * Subscribes to the `marketing.ai_intent` event topic emitted by the
 * VoiceAiGateway when a session completes or disconnects.
 *
 * Responsibilities:
 * 1. Extract customer interest metrics from the session payload
 * 2. Log structured marketing data to the `system_logs` table
 * 3. Execute via setImmediate to fully decouple from the WebSocket lifecycle
 *
 * This data feeds future:
 * - Promotional campaign targeting
 * - Abandoned cart recovery flows
 * - Customer interest segmentation
 * - AI conversation quality metrics
 *
 * INVARIANT: This listener NEVER blocks the active WebSocket response port.
 * All database writes happen asynchronously after the event loop yields.
 */
@Injectable()
export class MarketingIntentListener {
  private readonly logger = new Logger(MarketingIntentListener.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Handle the marketing.ai_intent event.
   *
   * Fires asynchronously via setImmediate to ensure zero blocking
   * on the WebSocket disconnect handler that emitted it.
   */
  @OnEvent(MARKETING_AI_INTENT_EVENT, { async: true })
  handleMarketingIntent(payload: MarketingIntentPayload): void {
    setImmediate(() => {
      this.logMarketingIntent(payload).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        this.logger.error(`Failed to log marketing intent: ${message}`);
      });
    });
  }

  /**
   * Persist the marketing intent data to system_logs for analytics pipelines.
   *
   * Extracts and structures:
   * - Session identification (guest vs authenticated)
   * - Product interest signals
   * - Intent classification tags
   * - Session duration context
   */
  private async logMarketingIntent(payload: MarketingIntentPayload): Promise<void> {
    const logMessage = this.buildLogMessage(payload);
    const logMetadata = JSON.stringify({
      sessionId: payload.sessionId,
      guestSessionId: payload.guestSessionId,
      userId: payload.userId,
      disconnectedAt: payload.disconnectedAt,
      matchedProductIds: payload.matchedProductIds ?? [],
      intentTags: payload.intentTags ?? [],
      source: "voice-ai-gateway",
    });

    await this.db.execute(sql`
      INSERT INTO system_logs (level, context, message, metadata, created_at)
      VALUES (
        'info',
        'marketing.ai_intent',
        ${logMessage},
        ${logMetadata}::json,
        NOW()
      )
    `);

    this.logger.debug(`Logged marketing intent for session ${payload.sessionId}`);
  }

  /**
   * Build a human-readable log message summarizing the AI session intent.
   */
  private buildLogMessage(payload: MarketingIntentPayload): string {
    const userType = payload.userId ? `user:${payload.userId}` : `guest:${payload.guestSessionId}`;
    const interests = payload.intentTags?.length
      ? ` | interests: ${payload.intentTags.join(", ")}`
      : "";
    const products = payload.matchedProductIds?.length
      ? ` | products: ${payload.matchedProductIds.length} viewed`
      : "";

    return `[AI Intent] ${userType}${interests}${products}`;
  }
}
