import { Injectable } from "@nestjs/common";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RejectionResult {
  /** True when the user's message signals rejection, disinterest, or a desire for alternatives. */
  isRejection: boolean;
  /**
   * Which rejection category was matched — used for crafting a contextually
   * appropriate pivot response.
   */
  category: "price" | "preference" | "alternative" | null;
}

// ─── Rejection Signal Banks ───────────────────────────────────────────────────

/**
 * Price-objection signals — user finds the suggested product too expensive.
 * Pure O(1) substring/regex matching; no LLM call required.
 */
const PRICE_REJECTION_PATTERNS: RegExp[] = [
  /\bگرون\b/i,
  /\bگرانه\b/i,
  /\bگران(ه|ست)?\b/i,
  /قیمتش بالاست/i,
  /از بودجه.*(خارج|زیاد|بیشتر)/i,
  /صرفه نداره/i,
  /\bمقرون.?به.?صرفه\b/i,
  /ارزون.?تر/i,
  /ارزان.?تر/i,
  /پایین.?تر/i,
  /\bبودجه(م|ام)?\s+(نمی|نمیـ)/i,
];

/**
 * Preference / taste rejection — user simply doesn't like the recommendation.
 */
const PREFERENCE_REJECTION_PATTERNS: RegExp[] = [
  /\bخوشم نیامد\b/i,
  /\bخوشم نمیاد\b/i,
  /\bخوشم نمی.?آد\b/i,
  /\bدوست ندارم\b/i,
  /\bنمیخوام\b/i,
  /\bنمی.?خوام\b/i,
  /\bنه\b/i,
  /\bخیر\b/i,
  /\bبه دردم نمیخوره\b/i,
  /مناسبم نیست/i,
  /\bجالب نیست\b/i,
  /\bراضی نیستم\b/i,
];

/**
 * Alternative-seeking signals — user explicitly asks for different options.
 */
const ALTERNATIVE_PATTERNS: RegExp[] = [
  /یه\s*(چیز|مدل|گزینه)\s*دیگه/i,
  /چیز\s*دیگه/i,
  /\bدیگه\s*چی\b/i,
  /\bگزینه\s*دیگه\b/i,
  /\bمدل\s*دیگه\b/i,
  /\bجایگزین\b/i,
  /\bآلترناتیو\b/i,
  /\bبه\s*جاش\b/i,
  /\bبه\s*جای\b/i,
  /پیشنهاد\s*(دیگه|جدید)/i,
  /\bگزینه‌های\s*دیگه\b/i,
  /\bانتخاب\s*دیگه\b/i,
  /\bچند\s*تا\s*(دیگه|دیگر)\b/i,
];

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * RejectionDetectorService — Pure regex rejection signal classifier.
 *
 * Detects when a user's message expresses disinterest in the currently pinned
 * product context, triggering a conversational pivot to fresh alternatives.
 *
 * Zero LLM calls: all detection is O(1) regex matching on the normalised query.
 * Extracted as a standalone service to satisfy SRP and keep avalai.service.ts
 * well within the 300-line modularisation threshold.
 */
@Injectable()
export class RejectionDetectorService {
  /**
   * Analyse the user's last message for rejection/pivot signals.
   *
   * Only meaningful when an `activeProductContextSlug` is present — a rejection
   * without a prior pinned product is just a normal negative preference.
   *
   * @param query   The normalised (Persian digits → ASCII) user message.
   * @returns       Detection result with category for pivot phrase selection.
   */
  detect(query: string): RejectionResult {
    if (this.matchesAny(query, PRICE_REJECTION_PATTERNS)) {
      return { isRejection: true, category: "price" };
    }

    if (this.matchesAny(query, ALTERNATIVE_PATTERNS)) {
      return { isRejection: true, category: "alternative" };
    }

    if (this.matchesAny(query, PREFERENCE_REJECTION_PATTERNS)) {
      return { isRejection: true, category: "preference" };
    }

    return { isRejection: false, category: null };
  }

  /**
   * Build the empathetic pivot system directive injected into the LLM context.
   * Uses the category and rejected product name to personalise the intro phrase.
   *
   * @param rejectedProductName  Display name of the product being pivoted away from.
   * @param category             Rejection category from `detect()`.
   */
  buildPivotDirective(rejectedProductName: string, category: RejectionResult["category"]): string {
    const introByCategory: Record<NonNullable<RejectionResult["category"]>, string> = {
      price: `کاملاً متوجه شدم دوست من! اگر قیمت «${rejectedProductName}» با بودجه شما همخوانی نداره، اجازه بدید گزینه‌های جذاب‌تر و مقرون‌به‌صرفه‌تری از انبار رایانتک بهتون معرفی کنم که مشخصات مشابه با قیمت بهتر دارند...`,
      alternative: `کاملاً متوجه شدم دوست من! اگر «${rejectedProductName}» با سلیقه یا نیاز شما همخوانی نداره، اجازه بدید گزینه‌های جذاب دیگه‌ای رو از انبار رایانتک بهتون معرفی کنم که مشخصات متفاوتی دارند...`,
      preference: `کاملاً متوجه شدم دوست من! اگر «${rejectedProductName}» با سلیقه یا نیاز شما همخوانی نداره، اجازه بدید گزینه‌های جذاب دیگه‌ای رو از انبار رایانتک بهتون معرفی کنم که مشخصات متفاوتی دارند...`,
    };

    const intro = category
      ? introByCategory[category]
      : `کاملاً متوجه شدم دوست من! بگذارید گزینه‌های جذاب دیگه‌ای از انبار رایانتک بهتون معرفی کنم...`;

    return `[PIVOT_DIRECTIVE — MANDATORY]
The customer has REJECTED or expressed disinterest in the previously suggested product («${rejectedProductName}»).
You MUST begin your response with EXACTLY this Persian intro phrase (word-for-word, no paraphrasing):
"${intro}"

Then present the 3 new alternative products from [LIVE_INVENTORY_CONTEXT] below using the standard structured markdown format.
Do NOT mention «${rejectedProductName}» again unless the user explicitly asks to compare it.
STRICTLY use [product_card: ...] tags for each new product recommendation.`;
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private matchesAny(query: string, patterns: RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(query));
  }
}
