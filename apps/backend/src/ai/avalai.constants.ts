/**
 * AvalAI Consultation Service — Constants & Configuration.
 *
 * All AI consultation parameters, rate limit thresholds,
 * Redis key patterns, and system prompt definitions.
 */

// ─── AvalAI Provider Configuration ──────────────────────────────────────────

/**
 * AvalAI base URL for all API interactions.
 * Uses the primary domain for optimal latency.
 */
export const AVALAI_BASE_URL = "https://api.avalai.ir/v1";

/**
 * Lightweight model for SIMPLE_TRANSIENT intent tier.
 * Handles greetings, small-talk, title generation, and single-order lookups.
 * Optimised for cost and latency — 10-20× cheaper than the pro model.
 */
export const AVALAI_CHAT_MODEL_LITE = "gpt-4o-mini";

/**
 * Flagship model for DEEP_CONSULTATION intent tier.
 * Handles product comparison, vector-based RAG, specs analysis, and advisory.
 */
export const AVALAI_CHAT_MODEL_PRO = "gpt-4o";

/**
 * @deprecated Use AVALAI_CHAT_MODEL_LITE or AVALAI_CHAT_MODEL_PRO instead.
 * Kept for backward compatibility with AvalAiIntentParser which uses the
 * mini model at temperature 0 for JSON-structured intent extraction.
 */
export const AVALAI_CHAT_MODEL = AVALAI_CHAT_MODEL_LITE;

/**
 * OpenAI-compatible embedding model for semantic vector generation.
 * Produces 1536-dimensional float vectors matching products.embedding column.
 */
export const AVALAI_EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * Embedding vector dimensions (must match products.embedding column in DB).
 */
export const AVALAI_EMBEDDING_DIMENSIONS = 1536;

// ─── Generation Hyperparameters ──────────────────────────────────────────────

// ─── Query Rewriter Cache Configuration ──────────────────────────────────────

/**
 * Maximum number of in-memory LRU cache entries for the Query Rewriter.
 * Each entry is a normalised query → expanded token string mapping.
 */
export const QUERY_REWRITER_CACHE_MAX = 200;

/**
 * Cache TTL for query rewriter results (5 minutes in milliseconds).
 * After expiry, the next call re-expands the query via LLM.
 */
export const QUERY_REWRITER_CACHE_TTL_MS = 300_000;

/**
 * Temperature for query rewriter LLM calls.
 * Low value ensures deterministic, reproducible token expansions.
 */
export const QUERY_REWRITER_TEMP = 0.3;

/**
 * Temperature for SIMPLE_TRANSIENT tier — conversational but not overly creative.
 */
export const AVALAI_TEMP_LITE = 0.5;

/**
 * Temperature for DEEP_CONSULTATION specs/matching responses.
 * Low value ensures deterministic, catalog-faithful product recommendations.
 */
export const AVALAI_TEMP_DEEP_SPECS = 0.3;

/**
 * Temperature for DEEP_CONSULTATION open advisory mode (no specific product requested).
 * Slightly higher to allow empathetic, personalised tone.
 */
export const AVALAI_TEMP_DEEP_ADVISORY = 0.6;

/**
 * @deprecated Use AVALAI_TEMP_DEEP_SPECS or AVALAI_TEMP_DEEP_ADVISORY instead.
 */
export const AVALAI_TEMPERATURE = AVALAI_TEMP_DEEP_SPECS;

/**
 * Maximum tokens for generated responses.
 * Prevents runaway generation while allowing detailed product descriptions.
 */
export const AVALAI_MAX_TOKENS = 800;

// ─── RAG Pipeline Configuration ──────────────────────────────────────────────

/**
 * Maximum number of product results from pgvector cosine similarity search.
 * Top-3 provides focused context without overwhelming the system prompt.
 */
export const MAX_SEMANTIC_RESULTS = 3;

// ─── Firewall Rate Limiting Thresholds ───────────────────────────────────────

/**
 * Redis key prefix for AI initialization rate limiting.
 * Full key format: rate:ai:init:{ip_address}
 */
export const AI_INIT_RATE_KEY_PREFIX = "rate:ai:init:";

/**
 * Redis key prefix for AI interaction message rate limiting.
 * Full key format: rate:ai:msg:{ip_address}
 */
export const AI_MSG_RATE_KEY_PREFIX = "rate:ai:msg:";

/**
 * Redis key prefix for AI session timeout tracking.
 * Full key format: rate:ai:session:{ip_address}
 */
export const AI_SESSION_KEY_PREFIX = "rate:ai:session:";

/**
 * Maximum initialization/connections per hour per IP.
 * Prevents connection exhaustion attacks.
 */
export const AI_MAX_INITS_PER_HOUR = 5;

/**
 * Initialization rate window in seconds (1 hour).
 */
export const AI_INIT_WINDOW_SECONDS = 3600;

/**
 * Maximum interaction responses per ongoing session per IP.
 * Generous enough for real consultations, tight enough to block abuse.
 */
export const AI_MAX_MESSAGES_PER_SESSION = 50;

/**
 * Session message counter TTL in seconds (matches session timeout).
 */
export const AI_MSG_WINDOW_SECONDS = 300;

/**
 * Forced server-side session timeout in seconds (5 minutes).
 * Prevents pipeline compute drain from hanging connections.
 */
export const AI_SESSION_TIMEOUT_SECONDS = 300;

// ─── Localized Response Messages ─────────────────────────────────────────────

/**
 * Persian 429 rate limit exceeded message — initialization limit.
 */
export const RATE_LIMIT_INIT_FA =
  "تعداد درخواست‌های اتصال شما به حد مجاز ساعتی رسیده است. لطفاً بعداً تلاش کنید.";

/**
 * Persian 429 rate limit exceeded message — message limit.
 */
export const RATE_LIMIT_MSG_FA =
  "تعداد پیام‌های شما در این جلسه به حد مجاز رسیده است. لطفاً جلسه جدیدی شروع کنید.";

/**
 * Persian 429 rate limit exceeded message — session timeout.
 */
export const SESSION_TIMEOUT_FA =
  "مدت زمان جلسه مشاوره به پایان رسیده است. لطفاً جلسه جدیدی شروع کنید.";

/**
 * Default fallback when no matching products are found in pgvector search.
 */
export const NO_MATCH_FALLBACK_FA =
  "متأسفانه کالای منطبقی با مشخصات درخواستی شما در انبار رایان‌تک یافت نشد. لطفاً سوال خود را دقیق‌تر مطرح کنید.";

// ─── System Prompt (Persian) — Empathetic Hardware Advisor ───────────────────

/**
 * Grounded system prompt in Persian — Premium Empathetic Persona.
 *
 * This persona is a deeply compassionate, creative, and customer-centric
 * hardware advisor who understands financial hesitation, suggests alternatives,
 * and treats every customer with immense care.
 *
 * The {{CONTEXT}} placeholder is dynamically replaced with
 * matched product data from pgvector semantic search results.
 */
export const AVALAI_SYSTEM_PROMPT = `شما «مشاور ارشد سخت‌افزار رایان‌تک» هستید — یک متخصص باتجربه، تیزهوش، صمیمی و دلسوز که عاشق کمک به مشتریان برای پیدا کردن بهترین انتخاب ممکن است.

───── شخصیت شما ─────
• صمیمی و گرم هستید، مثل یک دوست متخصص که واقعاً به نیاز مشتری اهمیت می‌دهد.
• باهوش و دقیق هستید: قبل از پیشنهاد، نیاز واقعی مشتری (کاربری، بودجه، اولویت‌ها) را می‌فهمید.
• درک می‌کنید که خرید سخت‌افزار تصمیم مالی مهمی است و با حساسیت‌های بودجه‌ای مشتری همدلی دارید.
• وقتی محصول مورد نظر موجود نیست، با مهربانی جایگزین‌های مناسب از موجودی انبار پیشنهاد می‌دهید.
• از اصطلاحات فنی به زبان ساده و قابل فهم استفاده می‌کنید و «چرایی» انتخاب را توضیح می‌دهید.
• اگر مشتری به خرید اقساطی علاقه‌مند باشد، با احترام به شرایط اقساطی رایان‌تک اشاره می‌کنید.

───── روش تفکر و مشاوره (مهم) ─────
• اگر کاربری یا بودجه مشتری مشخص نیست، ابتدا یک یا دو سوال کوتاه و هدفمند بپرسید (مثلاً «بیشتر برای گیمینگ می‌خواید یا کار اداری؟» یا «بودجه‌تون حدوداً چقدره؟»).
• وقتی نیاز مشخص شد، بین گزینه‌های موجود در کاتالوگ مقایسه کنید و «بهترین انتخاب» را با دلیل معرفی کنید؛ در صورت لزوم یک گزینهٔ ارزان‌تر و یک گزینهٔ قوی‌تر هم پیشنهاد دهید.
• همیشه پاسخ را به نیاز دقیق مشتری گره بزنید؛ ویژگی‌ها را به فایده تبدیل کنید (مثلاً «رم ۱۶ گیگ یعنی چند برنامه همزمان بدون کندی»).
• اگر مشتری بین دو محصول مردد است، تفاوت‌های کلیدی و پیشنهاد نهایی خود را شفاف بگویید.

───── قوانین الزامی ─────
۱. فقط به زبان فارسی پاسخ دهید.
۲. فقط و فقط از محصولات موجود در بخش «کاتالوگ» پایین استفاده کنید.
۳. اگر محصول مورد نظر در کاتالوگ نیست، با مهربانی بگویید موجود نیست و جایگزین پیشنهاد دهید.
۴. هرگز مشخصات فنی یا قیمت جعلی تولید نکنید؛ فقط به داده‌های کاتالوگ استناد کنید.
۵. هرگز درباره حاشیه سود، قیمت تمام‌شده یا استراتژی داخلی صحبت نکنید.
۶. هرگز محصولات رقبا را نام نبرید یا مقایسه نکنید.
۷. هرگز تعهد مالی یا حقوقی الزام‌آور ندهید.
۸. قیمت‌ها را به تومان و با جداکنندهٔ هزارگان نمایش دهید.
۹. پاسخ‌ها مختصر و ساختارمند باشند (حداکثر ۳-۴ پاراگراف یا چند بولت کوتاه) — مفید و حرفه‌ای، بدون پرحرفی.
۱۰. اگر محصول «اوپن‌باکس» یا «استوک» دارید، مزایای آن (قیمت بهتر، کیفیت تضمینی) را با لحن مثبت توضیح دهید.
۱۱. هنگام معرفی محصول، یکی از دو فرمت تگ زیر را استفاده کنید تا دکمه تخصصی برای مشتری نمایش داده شود:
    - فرمت کامل (ترجیحی، با UUID انبار): [product_card: uuid | slug | نام محصول فارسی]
    - فرمت کوتاه (جایگزین، بدون UUID): [Product: slug|نام محصول فارسی]
۱۲. در پایان پاسخ‌های مشاوره‌ای، در صورت مناسب بودن، یک قدم بعدی کوتاه پیشنهاد دهید (مثلاً «اگه بخواید می‌تونم گزینهٔ اقساطیش رو هم بگم»).

───── کاتالوگ محصولات موجود ─────
{{CONTEXT}}`;
