import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Consumer, Kafka } from "kafkajs";
import { KAFKA_CLIENT } from "../kafka.constants";
import { KafkaProducerService } from "../kafka-producer.service";
import { executeWithRetryDlq, type RetryDlqConfig } from "./retry-dlq.utils";

/**
 * Kafka message payload shape for OTP SMS events.
 */
interface SmsOtpPayload {
  type: "otp";
  mobile: string;
  code: string;
  template: string;
}

/**
 * MelliPayamak Console OTP API response shape.
 */
interface MelliPayamakOtpResponse {
  code: string;
  status: string;
}

/**
 * SMS Notification Kafka Consumer with retry + DLQ resilience.
 *
 * Subscribes to `notification.sms` topic. On each message:
 * 1. Attempts delivery via MelliPayamak Console OTP API
 * 2. On failure: retries 3 times with exponential backoff (1s, 2s, 4s)
 * 3. After exhausting retries: offloads to `notification.sms.dlq`
 * 4. Fires async n8n webhook alert for admin visibility
 *
 * Note: Primary OTP dispatch is now handled synchronously in OtpService.
 * This consumer acts as a secondary delivery channel and failure handler.
 */
@Injectable()
export class SmsNotificationConsumer {
  private readonly logger = new Logger(SmsNotificationConsumer.name);
  private readonly consumer: Consumer;
  private readonly melliPayamakToken: string;
  private readonly retryConfig: RetryDlqConfig;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafka: Kafka,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(KafkaProducerService)
    private readonly kafkaProducer: KafkaProducerService,
  ) {
    const groupId = this.configService.get<string>("KAFKA_GROUP_ID", "rayan-tech-workers");
    this.consumer = this.kafka.consumer({ groupId });
    this.melliPayamakToken = this.configService.get<string>("MELIPAYAMAK_OTP_TOKEN", "");

    this.retryConfig = {
      maxRetries: 3,
      baseDelayMs: 1000,
      dlqTopic: "notification.sms.dlq",
      alertWebhookUrl: this.configService.get<string>("N8N_ALERT_WEBHOOK_URL", ""),
      logger: this.logger,
      producer: this.kafkaProducer,
    };
  }

  async start(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: "notification.sms", fromBeginning: false });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const rawValue = message.value?.toString() ?? "";
          const messageKey = message.key?.toString() ?? "unknown";

          await executeWithRetryDlq(
            () => this.processMessage(rawValue),
            rawValue,
            messageKey,
            this.retryConfig,
          );
        },
      });

      this.logger.log("SMS notification consumer started (with DLQ resilience)");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`[auth/sms-fail] SMS consumer start failed: ${msg}`);
    }
  }

  async stop(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.logger.log("SMS notification consumer stopped");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`SMS consumer stop error: ${msg}`);
    }
  }

  /**
   * Process a single SMS message — sends via MelliPayamak Console OTP API.
   * Throws on failure to trigger retry logic.
   */
  private async processMessage(rawValue: string): Promise<void> {
    if (!rawValue) return;

    const payload: SmsOtpPayload = JSON.parse(rawValue);
    if (payload.type !== "otp") return;

    await this.sendViaMelliPayamak(payload.mobile);
  }

  /**
   * Send OTP via MelliPayamak Console OTP API.
   *
   * Endpoint: POST https://console.melipayamak.com/api/send/otp/{token}
   * Payload: { "to": "mobile_number" }
   * Response: { "code": "generated_code", "status": "error_if_any" }
   *
   * Throws on network failure, timeout, or non-success response to trigger retry.
   */
  private async sendViaMelliPayamak(mobile: string): Promise<void> {
    const url = `https://console.melipayamak.com/api/send/otp/${this.melliPayamakToken}`;

    const body = JSON.stringify({ to: mobile });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body).toString(),
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`MelliPayamak HTTP ${response.status}: ${response.statusText}`);
      }

      const result = (await response.json()) as MelliPayamakOtpResponse;

      if (!result.code) {
        throw new Error(`MelliPayamak returned empty code. Status: ${result.status || "unknown"}`);
      }

      this.logger.debug(`OTP sent to ${mobile.slice(0, 4)}**** via MelliPayamak Console API`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(
        `[auth/sms-fail] MelliPayamak dispatch failed for ${mobile.slice(0, 4)}****: ${message}`,
      );
      throw err;
    }
  }
}
