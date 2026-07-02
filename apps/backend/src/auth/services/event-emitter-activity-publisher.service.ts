import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TOKEN_USED_EVENT } from "../constants";
import { TokenActivityPublisher } from "../interfaces/token-activity-publisher.interface";

/**
 * Default implementation of TokenActivityPublisher using
 * NestJS EventEmitter2 for decoupled, non-blocking activity tracking.
 *
 * The emitted event is handled by TokenActivityListener which
 * performs the async database write via setImmediate to ensure
 * the HTTP response is never blocked.
 */
@Injectable()
export class EventEmitterActivityPublisher extends TokenActivityPublisher {
  private readonly logger = new Logger(EventEmitterActivityPublisher.name);

  constructor(@Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2) {
    super();
  }

  /**
   * Emit a fire-and-forget event to update last_used_at.
   * This method resolves immediately — the DB write happens
   * asynchronously on the next macrotask via the event listener.
   */
  async publishLastUsed(tokenId: string): Promise<void> {
    this.logger.debug(`Emitting ${TOKEN_USED_EVENT} for token ${tokenId}`);
    this.eventEmitter.emit(TOKEN_USED_EVENT, { tokenId });
  }
}
