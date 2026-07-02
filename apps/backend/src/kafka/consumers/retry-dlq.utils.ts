import type { Logger } from "@nestjs/common";
import type { KafkaProducerService } from "../kafka-producer.service";

/**
 * Configuration for the retry + DLQ pattern.
 */
export interface RetryDlqConfig {
  /** Maximum retry attempts before DLQ offload */
  maxRetries: number;
  /** Base delay in ms for exponential backoff (delay = base * 2^attempt) */
  baseDelayMs: number;
  /** DLQ topic name to offload failed messages */
  dlqTopic: string;
  /** Optional n8n webhook URL for admin alerts */
  alertWebhookUrl?: string;
  /** Logger instance for structured output */
  logger: Logger;
  /** Kafka producer for DLQ writes */
  producer: KafkaProducerService;
}

/**
 * Sleep utility for exponential backoff delays.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a message handler with exponential backoff retry and DLQ offload.
 *
 * Retry policy:
 * - Attempt 1: immediate
 * - Attempt 2: baseDelay * 2^1 (e.g. 1000ms)
 * - Attempt 3: baseDelay * 2^2 (e.g. 2000ms)
 *
 * If all retries fail:
 * 1. Offload the raw payload to the DLQ topic
 * 2. Fire an async alert webhook (non-blocking)
 *
 * @param handler - The message processing function to retry
 * @param payload - Raw message string for DLQ archival
 * @param messageKey - Kafka message key for DLQ partitioning
 * @param config - Retry and DLQ configuration
 */
export async function executeWithRetryDlq(
  handler: () => Promise<void>,
  payload: string,
  messageKey: string,
  config: RetryDlqConfig,
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      await handler();
      return; // Success — exit immediately
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      config.logger.warn(`Attempt ${attempt}/${config.maxRetries} failed: ${lastError.message}`);

      // Exponential backoff before next retry (skip on final attempt)
      if (attempt < config.maxRetries) {
        const delay = config.baseDelayMs * 2 ** attempt;
        await sleep(delay);
      }
    }
  }

  // All retries exhausted — offload to DLQ
  config.logger.error(
    `All ${config.maxRetries} retries exhausted. Offloading to DLQ: ${config.dlqTopic}`,
  );

  await offloadToDlq(payload, messageKey, lastError, config);
}

/**
 * Offload a failed message to the Dead-Letter Queue topic.
 * Wraps the original payload with error metadata for debugging.
 */
async function offloadToDlq(
  originalPayload: string,
  messageKey: string,
  error: Error | null,
  config: RetryDlqConfig,
): Promise<void> {
  const dlqPayload = {
    originalPayload,
    error: error?.message ?? "Unknown error",
    stack: error?.stack?.slice(0, 500) ?? null,
    failedAt: new Date().toISOString(),
    retriesExhausted: config.maxRetries,
  };

  try {
    await config.producer.send(config.dlqTopic, messageKey, dlqPayload);
    config.logger.log(`Message offloaded to ${config.dlqTopic}`);
  } catch (dlqErr: unknown) {
    const msg = dlqErr instanceof Error ? dlqErr.message : "Unknown DLQ error";
    config.logger.error(`CRITICAL: DLQ offload failed: ${msg}`);
  }

  // Fire async admin alert via n8n webhook (non-blocking)
  if (config.alertWebhookUrl) {
    void fireAlertWebhook(config.alertWebhookUrl, config.dlqTopic, error, config.logger);
  }
}

/**
 * Fire an async alert to the n8n webhook endpoint.
 * Non-blocking — errors are logged but never thrown.
 */
async function fireAlertWebhook(
  webhookUrl: string,
  dlqTopic: string,
  error: Error | null,
  logger: Logger,
): Promise<void> {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "kafka_dlq_offload",
        topic: dlqTopic,
        error: error?.message ?? "Unknown",
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown webhook error";
    logger.warn(`Admin alert webhook failed: ${msg}`);
  }
}
