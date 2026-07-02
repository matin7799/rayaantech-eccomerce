/**
 * Abstract interface for decoupled, fire-and-forget
 * token activity tracking.
 *
 * Implementations may use:
 * - NestJS EventEmitter (current default)
 * - Apache Kafka producer (future)
 * - SQS / RabbitMQ / any async transport
 *
 * The contract guarantees that the HTTP response lifecycle
 * is never blocked by this operation.
 */
export abstract class TokenActivityPublisher {
  /**
   * Publish a "token was used" event so that `last_used_at`
   * gets updated asynchronously in the database.
   *
   * @param tokenId - UUID primary key of the api_tokens row
   */
  abstract publishLastUsed(tokenId: string): Promise<void>;
}
