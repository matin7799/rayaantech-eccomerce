import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { TOKEN_USED_EVENT } from "../constants";

/**
 * Payload shape for the token.used event.
 */
interface TokenUsedPayload {
  tokenId: string;
}

/**
 * Event listener that asynchronously updates the `last_used_at`
 * timestamp in the database when a token is used.
 *
 * Executes via setImmediate to yield back to the event loop
 * before performing the DB write, ensuring zero blocking on
 * the HTTP request/response lifecycle.
 */
@Injectable()
export class TokenActivityListener {
  private readonly logger = new Logger(TokenActivityListener.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  @OnEvent(TOKEN_USED_EVENT, { async: true })
  handleTokenUsed(payload: TokenUsedPayload): void {
    // Wrap in setImmediate to fully decouple from the current call stack
    setImmediate(() => {
      this.updateLastUsedAt(payload.tokenId).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        this.logger.error(`Failed to update last_used_at for token ${payload.tokenId}: ${message}`);
      });
    });
  }

  /**
   * Perform the actual database update using raw SQL to avoid
   * type incompatibility across workspace drizzle-orm copies.
   */
  private async updateLastUsedAt(tokenId: string): Promise<void> {
    await this.db.execute(sql`
      UPDATE api_tokens
      SET last_used_at = NOW()
      WHERE id = ${tokenId}
    `);

    this.logger.debug(`Updated last_used_at for token ${tokenId}`);
  }
}
