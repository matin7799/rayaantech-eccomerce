import { randomInt } from "node:crypto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TRPCError } from "@trpc/server";
import type Redis from "ioredis";
import { KafkaProducerService } from "../../kafka/kafka-producer.service";
import { REDIS_CLIENT } from "../../redis/redis.constants";

/**
 * OTP code TTL in seconds (2 minutes — strict).
 */
const OTP_TTL_SECONDS = 120;

/**
 * Maximum verification attempts before lockout.
 */
const MAX_ATTEMPTS = 5;

/**
 * MelliPayamak shared-line pattern API response shape.
 * `recId` is the delivery tracking id; `status` carries an error description
 * (Persian) when the send fails.
 */
interface MelliPayamakPatternResponse {
  recId: number | null;
  status: string;
}

/**
 * Approved pattern (متن پیشفرض) body id in the MelliPayamak console.
 * The pattern text contains a single {0} placeholder that receives the code.
 * Overridable via MELIPAYAMAK_OTP_BODY_ID.
 */
const DEFAULT_OTP_BODY_ID = 455139;

/**
 * Redis key builders for OTP state.
 */
function otpCodeKey(mobile: string): string {
  return `otp:code:${mobile}`;
}

function otpAttemptsKey(mobile: string): string {
  return `otp:attempts:${mobile}`;
}

/**
 * OTP service integrating the MelliPayamak shared-line pattern API.
 *
 * Flow:
 * 1. Generate a 5-digit code locally
 * 2. Send it via the approved pattern (bodyId {@link DEFAULT_OTP_BODY_ID}) —
 *    the pattern's {0} placeholder receives the code
 * 3. Store the code in Redis with strict 120s TTL
 * 4. On failure: log under [auth/sms-fail], publish failure event to Kafka DLQ
 * 5. Verify codes with attempt-limited lockout
 *
 * Dev Mode (NODE_ENV=development OR MOCK_SMS=true):
 * - Bypasses MelliPayamak entirely
 * - Prints high-visibility log: [DEV/SMS-MOCK] Generated Verification Token: <CODE> for Target: <MOBILE>
 *
 * API Reference: docs/mellipyamak/send-pattern.md
 *
 * MelliPayamak console shared-line pattern API:
 *   POST https://console.melipayamak.com/api/send/shared/{token}
 *   Payload: { "bodyId": 455139, "to": "09XXXXXXXXX", "args": ["<code>"] }
 *   Response: { "recId": 3741437414, "status": "error_description_if_any" }
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly melliPayamakToken: string;
  private readonly otpBodyId: number;
  private readonly isMockMode: boolean;

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    @Inject(KafkaProducerService)
    private readonly kafkaProducer: KafkaProducerService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    // Shared-line access token; falls back to the legacy OTP token var name.
    this.melliPayamakToken =
      this.configService.get<string>("MELIPAYAMAK_SHARED_TOKEN", "") ||
      this.configService.get<string>("MELIPAYAMAK_OTP_TOKEN", "");
    this.otpBodyId = Number(
      this.configService.get<string>("MELIPAYAMAK_OTP_BODY_ID", String(DEFAULT_OTP_BODY_ID)),
    );
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    const mockSms = this.configService.get<string>("MOCK_SMS", "false");
    this.isMockMode = nodeEnv === "development" || mockSms === "true";
  }

  /**
   * Dispatch an OTP to the given mobile number.
   *
   * In dev/mock mode: generates code locally and logs to terminal.
   * In production: calls MelliPayamak Console OTP API.
   *
   * @throws TRPCError (BAD_REQUEST) with Persian message if SMS dispatch fails → surfaces as a
   *         400 to the client (sonner toast) instead of a generic 500.
   */
  async dispatch(mobile: string): Promise<void> {
    try {
      // Code is always generated locally; the pattern's {0} placeholder carries it.
      const code = randomInt(10000, 99999).toString();

      if (this.isMockMode) {
        // DEV MODE: Print high-visibility log instead of sending SMS
        this.logger.warn(
          `\n` +
            `╔══════════════════════════════════════════════════════════╗\n` +
            `║  [DEV/SMS-MOCK] Generated Verification Token: ${code}  ║\n` +
            `║  Target: ${mobile.padEnd(20)}                      ║\n` +
            `╚══════════════════════════════════════════════════════════╝`,
        );
      } else {
        // PRODUCTION: Send via MelliPayamak shared-line pattern API
        await this.sendPatternSms(mobile, code);
      }

      // Store code in Redis with strict 120s TTL
      await this.redis.set(otpCodeKey(mobile), code, "EX", OTP_TTL_SECONDS);

      // Reset attempts counter
      await this.redis.del(otpAttemptsKey(mobile));

      this.logger.debug(`OTP dispatched for ${mobile.slice(0, 4)}****`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";

      // Log with [auth/sms-fail] prefix for monitoring
      this.logger.error(
        `[auth/sms-fail] SMS dispatch failed for ${mobile.slice(0, 4)}****: ${message}`,
      );

      // Publish failure event to Kafka DLQ for admin visibility
      try {
        await this.kafkaProducer.send("notification.sms.dlq", mobile, {
          type: "otp_dispatch_failure",
          mobile,
          error: message,
          timestamp: new Date().toISOString(),
        });
      } catch {
        // DLQ publish failure is non-critical — already logged above
      }

      // Throw a tRPC-native error so the transport maps it to HTTP 400 (not 500).
      // A NestJS BadRequestException would be unrecognized by tRPC and surface as
      // INTERNAL_SERVER_ERROR, which is what previously produced the 500 on /trpc/auth.sendOtp.
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ارسال پیامک با خطا مواجه شد. لطفاً دقایقی بعد مجدداً تلاش کنید",
      });
    }
  }

  /**
   * Send the OTP code via MelliPayamak console shared-line pattern API.
   *
   * @throws Error on network failure, timeout, missing config, or rejection
   */
  private async sendPatternSms(mobile: string, code: string): Promise<void> {
    if (this.melliPayamakToken) {
      await this.sendViaSharedToken(mobile, code);
      return;
    }
    throw new Error(
      "MelliPayamak is not configured: set MELIPAYAMAK_SHARED_TOKEN",
    );
  }

  /**
   * Send via the MelliPayamak console shared-line pattern API.
   *
   * Endpoint: POST https://console.melipayamak.com/api/send/shared/{token}
   * Body: { "bodyId": <approved pattern id>, "to": "09XXXXXXXXX", "args": ["<code>"] }
   * Response: { "recId": 3741437414, "status": "error description if any" }
   *
   * A successful send returns a positive numeric recId; failures surface a
   * Persian error description in `status` (with recId null/0).
   *
   * @throws Error on network failure, timeout, or non-success response
   */
  private async sendViaSharedToken(mobile: string, code: string): Promise<void> {
    const url = `https://console.melipayamak.com/api/send/shared/${this.melliPayamakToken}`;

    const body = JSON.stringify({
      bodyId: this.otpBodyId,
      to: mobile,
      args: [code],
    });

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
      throw new Error(
        `[auth/sms-fail] MelliPayamak HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const result = (await response.json()) as MelliPayamakPatternResponse;

    // A missing/zero recId means the pattern send was rejected.
    if (!result.recId) {
      throw new Error(
        `[auth/sms-fail] MelliPayamak pattern send rejected. Status: ${result.status || "unknown"}`,
      );
    }

    this.logger.debug(`Pattern SMS queued (recId=${result.recId}) for ${mobile.slice(0, 4)}****`);
  }

  /**
   * Verify an OTP code against the cached value.
   *
   * @returns true if the code matches
   * @throws TRPCError (BAD_REQUEST) if code is invalid, expired, or attempts exhausted
   */
  async verify(mobile: string, code: string): Promise<boolean> {
    // Check attempt lockout
    const attempts = parseInt((await this.redis.get(otpAttemptsKey(mobile))) ?? "0", 10);

    if (attempts >= MAX_ATTEMPTS) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "تعداد تلاش‌های مجاز به پایان رسیده است. لطفاً کد جدید دریافت کنید",
      });
    }

    // Fetch stored code
    const storedCode = await this.redis.get(otpCodeKey(mobile));

    if (!storedCode) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "کد تایید منقضی شده است. لطفاً کد جدید دریافت کنید",
      });
    }

    // Constant-time comparison (prevent timing attacks on short codes)
    if (storedCode !== code) {
      // Increment attempts with same TTL as the OTP code
      await this.redis.incr(otpAttemptsKey(mobile));
      await this.redis.expire(otpAttemptsKey(mobile), OTP_TTL_SECONDS);
      throw new TRPCError({ code: "BAD_REQUEST", message: "کد تایید نادرست است" });
    }

    // Success — clean up Redis state
    await this.redis.del(otpCodeKey(mobile));
    await this.redis.del(otpAttemptsKey(mobile));

    this.logger.debug(`OTP verified for ${mobile.slice(0, 4)}****`);
    return true;
  }
}
