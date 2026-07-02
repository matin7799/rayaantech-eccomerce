import { z } from "zod";

// ─── Input Schemas ───────────────────────────────────────────────────────────

/**
 * Message shape for the AI consultation conversation history.
 */
export const aiChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "پیام نمی‌تواند خالی باشد"),
});

export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;

/**
 * Primary input schema for AI text consultation requests.
 *
 * Validates:
 * - messages: at least 1 message in history
 * - Each message content: non-empty string
 * - Optional productSlug for PDP-context grounding
 */
export const textQuerySchema = z.object({
  messages: z
    .array(aiChatMessageSchema)
    .min(1, "حداقل یک پیام الزامی است")
    .max(50, "حداکثر ۵۰ پیام در هر درخواست مجاز است"),
  productSlug: z
    .string()
    .max(512)
    .optional()
    .describe("Optional product slug for PDP-context grounding"),
});

export type TextQueryInput = z.infer<typeof textQuerySchema>;

// ─── Output / Streaming Types ────────────────────────────────────────────────

/**
 * Individual streaming chunk emitted during consultation.
 */
export interface AiStreamChunk {
  /** Discriminated union tag for chunk types */
  type: "delta" | "done" | "error";
  /** Text content delta (present when type = "delta") */
  content?: string;
  /** Full aggregated response (present when type = "done") */
  fullContent?: string;
  /** Matched product references (present when type = "done") */
  matchedProducts?: AiMatchedProduct[];
  /** Error message (present when type = "error") */
  error?: string;
  /** Resolved sessionId (present when type = "done") */
  sessionId?: string;
}

/**
 * Product reference matched via pgvector semantic search.
 * Returned in the final "done" chunk for UI product card rendering.
 */
export interface AiMatchedProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  grade: string;
  stock: number;
}

// ─── Rate Limit Error Shape ──────────────────────────────────────────────────

/**
 * Structured 429 response shape for AI firewall rate limiting.
 */
export interface AiRateLimitError {
  statusCode: 429;
  message: string;
  messageFa: string;
  retryAfterSeconds: number;
}
