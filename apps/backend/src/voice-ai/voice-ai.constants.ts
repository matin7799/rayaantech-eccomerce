/**
 * Redis key prefix for authenticated Voice AI IP rate limiting.
 * Full key format: rate:voice:{ip_address}
 */
export const VOICE_RATE_KEY_PREFIX = "rate:voice:";

/**
 * Redis key prefix for guest session lifetime counters.
 * Full key format: rate:voice:guest:{guest_session_id}
 */
export const GUEST_RATE_KEY_PREFIX = "rate:voice:guest:";

/**
 * Maximum requests per sliding window for authenticated users.
 * Hard ceiling: 10 requests per minute per IP.
 */
export const VOICE_MAX_REQUESTS_PER_MINUTE = 10;

/**
 * Sliding window duration in seconds for authenticated users (1 minute).
 */
export const VOICE_WINDOW_SECONDS = 60;

/**
 * Maximum TOTAL messages for guest/unauthenticated sessions.
 * Hard lifetime cap: 3 messages across entire session.
 */
export const GUEST_MAX_MESSAGES_TOTAL = 3;

/**
 * TTL for guest session counter keys in Redis (30 days in seconds).
 * This is for cleanup only — the cap is enforced by the counter value.
 */
export const GUEST_RATE_TTL_SECONDS = 30 * 24 * 60 * 60; // 2,592,000 seconds

/**
 * OpenAI embedding model for semantic vector generation.
 * Produces 1536-dimensional float vectors.
 */
export const EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * Embedding vector dimensions (must match products.embedding column).
 */
export const EMBEDDING_DIMENSIONS = 1536;

/**
 * Maximum number of product context results returned from pgvector search.
 */
export const MAX_VECTOR_RESULTS = 5;

/**
 * OpenAI chat completion model for grounded responses.
 */
export const CHAT_MODEL = "gpt-4o-mini";

/**
 * Default fallback message when no matching products are found.
 */
export const NO_MATCH_FALLBACK_FA =
  "متأسفانه کالای منطبقی با مشخصات درخواستی شما در انبار رایان تک یافت نشد.";

/**
 * Rate limit exceeded Persian message for authenticated users.
 */
export const RATE_LIMIT_MESSAGE_FA =
  "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً یک دقیقه صبر کنید.";

/**
 * Structured marketing trigger payload emitted when a guest session
 * exhausts its 3-message lifetime budget.
 *
 * This payload prompts the frontend to show a registration/login modal.
 */
export const GUEST_LIMIT_EXHAUSTED_PAYLOAD = {
  status: "LIMIT_EXHAUSTED" as const,
  action: "REQUIRE_AUTHENTICATION" as const,
  message:
    "برای ادامه مشاوره تخصصی صوتی و متنی، لطفاً وارد حساب خود شوید تا تاریخچه گفتگو نیز ذخیره شود.",
};

/**
 * Event topic for marketing intent dispatches.
 */
export const MARKETING_AI_INTENT_EVENT = "marketing.ai_intent";

/**
 * System prompt enforcing strict factual grounding.
 */
export const GROUNDED_SYSTEM_PROMPT = `You are the spoken-voice Persian shopping assistant for Rayan Tech (رایان تک), an electronics e-commerce store. Your answers are read ALOUD to the customer by a text-to-speech engine.

STRICT RULES:
1. You MUST ONLY reference products provided in the context below. Never invent product names, specifications, prices, or grades.
2. If the context contains no products («هیچ محصول منطبقی یافت نشد»), do NOT invent any. Greet the customer warmly, ask ONE short clarifying question about their budget or use-case (e.g. «برای چه کاری می‌خواید و بودجه‌تون حدوداً چقدره؟»), and invite them to describe what they need.
3. Always respond in Persian (Farsi) with a warm, friendly conversational tone — like a knowledgeable salesperson talking to a customer in the store.
4. VOICE FORMAT: plain sentences only. NO markdown, NO bullet points, NO numbered lists, NO tables, NO emojis, NO special symbols — they would be read out loud awkwardly.
5. Keep answers SHORT: 2-4 spoken sentences. Mention at most 2 products per answer.
6. Say prices in words-friendly Toman format (e.g. «چهل و هشت میلیون و پانصد هزار تومان» یا «۴۸ میلیون و ۵۰۰ هزار تومان»).
7. Never reveal internal business margins, wholesale prices, or cost structures.
8. Never make binding financial promises or guarantees about pricing.
9. Be honest about product availability; when something is unavailable, kindly suggest an in-stock alternative from the context.

AVAILABLE PRODUCT CONTEXT:
{{CONTEXT}}`;
