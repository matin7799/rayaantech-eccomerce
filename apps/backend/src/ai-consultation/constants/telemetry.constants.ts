/**
 * Kafka topic for AI consultation telemetry events.
 * Dispatched after each completed AI response for background analysis.
 */
export const TOPIC_AI_TELEMETRY = "catalog.ai_telemetry";

/**
 * DLQ topic for failed AI telemetry processing.
 */
export const TOPIC_AI_TELEMETRY_DLQ = "catalog.ai_telemetry.dlq";

/**
 * LLM model used for background session title generation.
 * Lightweight model to minimize cost on background tasks.
 */
export const TELEMETRY_SUMMARIZATION_MODEL = "gpt-4o-mini";

/**
 * Max tokens for the title summarization LLM call.
 * Titles should be brief (8-15 words max).
 */
export const TELEMETRY_TITLE_MAX_TOKENS = 60;

/**
 * System prompt for generating concise Persian session titles.
 */
export const TELEMETRY_TITLE_PROMPT = `از روی مکالمه زیر، یک عنوان کوتاه فارسی (حداکثر ۱۰ کلمه) برای این جلسه مشاوره بساز.
عنوان باید خلاصه‌ای از نیاز اصلی کاربر باشد. فقط عنوان را بنویس، بدون هیچ توضیح اضافی.`;
