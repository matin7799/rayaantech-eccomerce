import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { PaymentConfirmedEvent } from "./payment-sms.listener";

/**
 * Kafka audit trail listener for payment confirmations.
 *
 * Dispatches a record to the 'notification.sms' Kafka topic
 * after the in-process SMS event fires. This provides an
 * administrative retry-ledger if the SMS provider suffers
 * an external carrier outage.
 *
 * Uses the KafkaJS producer already provisioned by KafkaModule.
 */
@Injectable()
export class PaymentKafkaListener {
  private readonly logger = new Logger(PaymentKafkaListener.name);

  /**
   * Dynamically resolve the Kafka producer to avoid hard DI coupling.
   * KafkaModule registers a global KAFKA_PRODUCER token.
   */
  private producer: unknown = null;

  @OnEvent("payment.confirmed", { async: true })
  async handlePaymentConfirmed(event: PaymentConfirmedEvent): Promise<void> {
    try {
      const producer = await this.getProducer();
      if (!producer) return;

      await (producer as { send: (r: unknown) => Promise<unknown> }).send({
        topic: "notification.sms",
        messages: [
          {
            key: event.orderId,
            value: JSON.stringify({
              type: "payment_confirmed",
              orderId: event.orderId,
              amount: event.amount,
              method: event.method,
              refId: event.refId,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });

      this.logger.log(`Kafka audit dispatched for order ${event.orderId}`);
    } catch (err: unknown) {
      // Never block payment flow — log and continue
      const msg = err instanceof Error ? err.message : "unknown";
      this.logger.error(`Kafka dispatch failed: ${msg}`);
    }
  }

  private async getProducer() {
    if (this.producer) return this.producer;

    try {
      const { Kafka } = await import("kafkajs");
      const kafka = new Kafka({
        clientId: "payment-audit",
        brokers: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(","),
      });
      const p = kafka.producer();
      await p.connect();
      this.producer = p;
      return this.producer;
    } catch {
      this.logger.warn("Kafka producer unavailable — audit skipped");
      return null;
    }
  }
}
