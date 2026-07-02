import { SetMetadata } from "@nestjs/common";
import { AI_RATE_LIMIT_FEATURE_KEY } from "../rate-limit.constants";

/**
 * Route-level decorator that marks a controller method as an AI endpoint
 * subject to per-customer rate limiting.
 *
 * @param feature - The AI feature category (e.g. "ai:text", "ai:voice", "ai:all")
 *
 * @example
 * ```ts
 * @AiRateLimit("ai:voice")
 * @Post("/ai/voice/transcribe")
 * transcribe() { ... }
 *
 * @AiRateLimit("ai:text")
 * @Post("/ai/chat/completions")
 * chat() { ... }
 * ```
 *
 * If this decorator is not applied, the AiRateLimitGuard will skip
 * rate limiting for that route entirely.
 */
export const AiRateLimit = (feature: string) => SetMetadata(AI_RATE_LIMIT_FEATURE_KEY, feature);
