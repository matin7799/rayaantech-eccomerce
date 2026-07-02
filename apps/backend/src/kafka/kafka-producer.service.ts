import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Kafka, Producer } from "kafkajs";
import { KAFKA_CLIENT } from "./kafka.constants";

/**
 * Kafka producer service for non-blocking event dispatch.
 *
 * Used by any module to publish messages to Kafka topics
 * without blocking the HTTP/WebSocket response lifecycle.
 *
 * Handles connection lifecycle and provides a simple send() interface.
 */
@Injectable()
export class KafkaProducerService {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer: Producer;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
  ) {
    this.producer = this.kafka.producer();
  }

  /**
   * Connect the producer to the Kafka cluster.
   * Called during module initialization.
   */
  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log("Kafka producer connected");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Kafka producer connection failed: ${message}`);
    }
  }

  /**
   * Disconnect the producer gracefully.
   * Called during module destruction.
   */
  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.log("Kafka producer disconnected");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Kafka producer disconnect error: ${message}`);
    }
  }

  /**
   * Publish a message to a Kafka topic.
   *
   * @param topic - Target topic name
   * @param key - Partition key (for ordering guarantees)
   * @param payload - JSON-serializable message payload
   */
  async send(topic: string, key: string, payload: Record<string, unknown>): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key,
            value: JSON.stringify(payload),
            timestamp: Date.now().toString(),
          },
        ],
      });

      this.logger.debug(`Published to ${topic}: key=${key}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Failed to publish to ${topic}: ${message}`);
    }
  }
}
