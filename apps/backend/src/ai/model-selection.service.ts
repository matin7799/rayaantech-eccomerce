import { Injectable, Logger } from "@nestjs/common";
import {
  AVALAI_CHAT_MODEL_LITE,
  AVALAI_CHAT_MODEL_PRO,
  AVALAI_TEMP_DEEP_ADVISORY,
  AVALAI_TEMP_DEEP_SPECS,
  AVALAI_TEMP_LITE,
} from "./avalai.constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export type IntentTier = "SIMPLE_TRANSIENT" | "DEEP_CONSULTATION";

export interface ModelSelection {
  tier: IntentTier;
  model: string;
  temperature: number;
}

// ─── Pattern Banks ────────────────────────────────────────────────────────────

/**
 * Patterns that classify a query as SIMPLE_TRANSIENT.
 * Evaluated in order; first match wins. All patterns are case-insensitive.
 */
const SIMPLE_PATTERNS: RegExp[] = [
  // Persian & English greetings / farewells
  /^(سلام|درود|خداحافظ|بای|bye|hello|hi|hey)\b/i,
  // Pleasantries and social affirmations
  /\b(حالت|چطوری|خوبی|ممنون|مرسی|خوبم|ممنونم|عالی|ok|اوکی)\b/i,
  // Small-talk about the assistant itself
  /\b(اسمت|کی هستی|چی هستی|معرفی کن)\b/i,
  // Chat title generation system marker (injected by title-gen pipelines)
  /\[GENERATE_TITLE\]/i,
  // Order status single-lookup pattern
  /وضعیت\s+(سفارش|کالا)\s+\d+/i,
];

/**
 * Patterns that strongly classify a query as DEEP_CONSULTATION.
 * These take priority over the length heuristic but yield to SIMPLE_PATTERNS.
 */
const DEEP_PATTERNS: RegExp[] = [
  // Product/hardware discovery
  /\b(لپ.?تاپ|موبایل|گوشی|مانیتور|کامپیوتر|پی.?سی|تبلت|هدفون|هارد|رم|ssd|gpu|cpu|کارت گرافیک)\b/i,
  // Comparative or spec inquiry
  /\b(مقایسه|تفاوت|بهتره|فرق|specs|مشخصات|خصوصیات|بررسی)\b/i,
  // Budget expressions
  /\b(بودجه|تا\s+\d|میلیون|تومن|تومان|ارزون|گرون|قیمت)\b/i,
  // Use-case driven queries
  /\b(رندر|گیمینگ|برنامه.?نویس|توسعه|دانشجو|دفتری|ویدیو|فتوشاپ|autocad)\b/i,
  // Advisory / recommendation requests
  /\b(پیشنهاد|توصیه|معرفی کن|بگو|چی بخرم|بهترین|مناسب.?ترین)\b/i,
];

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * ModelSelectionService — Zero-overhead intent tier classifier.
 *
 * Runs a pure string/regex gate to route each query to the correct
 * LLM tier before any network call is made. Decision is O(1).
 *
 * Tier mapping:
 *  SIMPLE_TRANSIENT  → gpt-4o-mini  (temp 0.5) — greetings, small-talk, title gen
 *  DEEP_CONSULTATION → gpt-4o       (temp 0.3 specs | 0.6 advisory)
 */
@Injectable()
export class ModelSelectionService {
  private readonly logger = new Logger(ModelSelectionService.name);

  /**
   * Classify the normalised user query and return the model/temperature
   * to be used for the completion call.
   *
   * @param query   Normalised (Persian numerals → ASCII) user message
   * @param hasProductIntent Whether the intent parser flagged needsDbQuery=true
   */
  select(query: string, hasProductIntent: boolean): ModelSelection {
    const tier = this.classify(query, hasProductIntent);
    const { model, temperature } = this.resolveModelParams(tier, query);

    this.logger.log(
      `[ModelSelection] Tier=${tier} Model=${model} Temp=${temperature} Query="${query.slice(0, 60)}"`,
    );

    return { tier, model, temperature };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private classify(query: string, hasProductIntent: boolean): IntentTier {
    // 1. Hard-coded SIMPLE gate — evaluated first
    for (const pattern of SIMPLE_PATTERNS) {
      if (pattern.test(query)) return "SIMPLE_TRANSIENT";
    }

    // 2. Short message heuristic (< 20 chars with no deep signal)
    const isShort = query.trim().length < 20;
    if (isShort && !hasProductIntent) return "SIMPLE_TRANSIENT";

    // 3. Explicit DEEP signals
    for (const pattern of DEEP_PATTERNS) {
      if (pattern.test(query)) return "DEEP_CONSULTATION";
    }

    // 4. Intent parser already determined a product DB query is needed
    if (hasProductIntent) return "DEEP_CONSULTATION";

    // 5. Default — route to lightweight model for unknown short queries
    return "SIMPLE_TRANSIENT";
  }

  /**
   * Resolve model and temperature from tier.
   * For DEEP_CONSULTATION, advisory mode (no specific product requested)
   * gets temperature 0.6 for warmer, more empathetic tone.
   */
  private resolveModelParams(
    tier: IntentTier,
    query: string,
  ): { model: string; temperature: number } {
    if (tier === "SIMPLE_TRANSIENT") {
      return { model: AVALAI_CHAT_MODEL_LITE, temperature: AVALAI_TEMP_LITE };
    }

    // Advisory mode: open-ended "what should I buy" queries with no specific model/category
    const isAdvisoryMode = !DEEP_PATTERNS.slice(0, 2).some((p) => p.test(query));
    const temperature = isAdvisoryMode ? AVALAI_TEMP_DEEP_ADVISORY : AVALAI_TEMP_DEEP_SPECS;

    return { model: AVALAI_CHAT_MODEL_PRO, temperature };
  }
}
