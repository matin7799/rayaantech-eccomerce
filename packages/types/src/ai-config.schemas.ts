import { z } from "zod";

/**
 * Admin-editable AvalAI assistant configuration.
 *
 * Persisted in the `app_settings` table under the `ai_config` key and consumed
 * by the consultation pipeline at request time (with code-level fallbacks).
 * Kept intentionally provider-agnostic so any OpenAI-compatible model exposed
 * through AvalAI can be selected.
 */
export const aiConfigSchema = z.object({
  /** Whether the AI consultant is enabled site-wide */
  enabled: z.boolean(),

  /** Lightweight model for greetings / small-talk / intent parsing */
  liteModel: z.string().min(1, "انتخاب مدل سبک الزامی است").max(128),

  /** Flagship model for deep product consultation */
  proModel: z.string().min(1, "انتخاب مدل پیشرفته الزامی است").max(128),

  /** Embedding model for semantic search (must output 1536-dim vectors) */
  embeddingModel: z.string().min(1).max(128),

  /** Sampling temperature (0 = deterministic, 2 = very creative) */
  temperature: z.number().min(0).max(2),

  /** Maximum output tokens per response */
  maxTokens: z.number().int().min(128).max(16000),

  /** Max consultation questions per visitor per day (0 = unlimited) */
  dailyQuestionLimit: z.number().int().min(0).max(1000),

  /** When true, bypasses the daily question limit for everyone */
  overrideDailyLimit: z.boolean(),

  /**
   * Optional persona / policy instructions appended to the base system prompt.
   * Lets admins steer tone and rules without touching code.
   */
  extraInstructions: z.string().max(8000),
});

export type AiConfig = z.infer<typeof aiConfigSchema>;

/**
 * Partial update payload — every field optional so the admin form can PATCH.
 */
export const aiConfigUpdateSchema = aiConfigSchema.partial();
export type AiConfigUpdate = z.infer<typeof aiConfigUpdateSchema>;

/**
 * Code-level defaults. Mirrors the constants in the backend AvalAI service and
 * is used as the fallback whenever no persisted config row exists yet.
 */
export const DEFAULT_AI_CONFIG: AiConfig = {
  enabled: true,
  liteModel: "gpt-4o-mini",
  proModel: "gpt-4o",
  embeddingModel: "text-embedding-3-small",
  temperature: 0.5,
  maxTokens: 800,
  dailyQuestionLimit: 50,
  overrideDailyLimit: false,
  extraInstructions: "",
};

/**
 * Curated list of AvalAI-exposed chat models for the admin selector UI.
 */
export const AVALAI_CHAT_MODELS = [
  { value: "gpt-4o", label: "GPT-4o (چندوجهی)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (سریع)" },
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
  { value: "gpt-5.5", label: "GPT-5.5" },
  { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5 (سریع)" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "deepseek-chat", label: "DeepSeek Chat" },
] as const;

/**
 * Embedding models that produce 1536-dimensional vectors (schema-compatible).
 */
export const AVALAI_EMBEDDING_MODELS = [
  { value: "text-embedding-3-small", label: "text-embedding-3-small (1536)" },
  { value: "text-embedding-3-large", label: "text-embedding-3-large (1536, دقیق‌تر)" },
] as const;
