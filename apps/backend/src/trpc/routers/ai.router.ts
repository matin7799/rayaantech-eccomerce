import { HttpException } from "@nestjs/common";
import type { AiStreamChunk } from "@rayan-tech/types";
import { TRPCError, tracked } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import type { AvalAiService } from "../../ai/avalai.service";
import type { AiFirewallGuard } from "../../ai/guards/ai-firewall.guard";
import { protectedProcedure, publicProcedure, router } from "../trpc.init";

// Support contact shown in rate-limit error messages.
const SUPPORT_PHONE = "09131512790";

/**
 * Maps a NestJS HttpException thrown by AiFirewallGuard into a TRPCError.
 *
 * tRPC has no knowledge of NestJS HttpException — if one escapes a procedure,
 * tRPC wraps it as INTERNAL_SERVER_ERROR (500). This utility intercepts
 * rate-limit (429) responses and re-throws them as proper TRPCError so the
 * client receives a structured 429 with reset time and support contact.
 *
 * All other error types are re-thrown unchanged.
 */
function mapFirewallError(err: unknown): never {
  if (err instanceof HttpException) {
    const body = err.getResponse() as Record<string, unknown>;
    const retryAfter = Number(body["retryAfterSeconds"] ?? 0);
    const minutesLeft = Math.ceil(retryAfter / 60);
    const messageFa = String(body["messageFa"] ?? "محدودیت نرخ درخواست.");

    const detail =
      retryAfter > 0
        ? ` لطفاً ${minutesLeft} دقیقه دیگر تلاش کنید. پشتیبانی: ${SUPPORT_PHONE}`
        : ` پشتیبانی: ${SUPPORT_PHONE}`;

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `${messageFa}${detail}`,
    });
  }

  throw err;
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "پیام نمی‌تواند خالی باشد"),
});

const streamConsultationInput = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
  productSlug: z.string().max(512).optional(),
  sessionId: z.string().uuid().optional(),
});

const consultInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string() })).min(1),
  productContext: z
    .object({
      productName: z.string(),
      sku: z.string().nullable(),
      basePrice: z.string(),
      grade: z.string(),
      slug: z.string(),
      stock: z.number(),
    })
    .optional(),
  sessionId: z.string().uuid().optional(),
  activeProductContextSlug: z.string().max(512).optional(),
});

// ─── Row Interfaces ──────────────────────────────────────────────────────────

interface SessionRow extends Record<string, unknown> {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageRow extends Record<string, unknown> {
  id: string;
  sender: "user" | "assistant";
  message_type: string;
  content: string;
  created_at: string;
}

// ─── Router Factory ──────────────────────────────────────────────────────────

/**
 * AI Consultation tRPC Router.
 *
 * Procedures:
 * - streamConsultation: SSE streaming subscription
 * - consult: Legacy HTTP mutation (backward compat)
 * - getHistoricalSessions: Fetch user's chat history list
 * - getSessionMessageChain: Fetch full message thread for a session
 */
export function createAIRouter(
  avalAiService: AvalAiService,
  aiFirewallGuard: AiFirewallGuard,
  db: NodePgDatabase,
) {
  return router({
    /**
     * Streaming AI consultation via SSE.
     *
     * Three-tier firewall is enforced on every request:
     * 1. Session timeout — blocks dead sessions.
     * 2. Message rate — max 50 messages per 5-min window.
     * 3. Init limit — max 5 new sessions per hour (first message only).
     */
    streamConsultation: publicProcedure
      .input(streamConsultationInput)
      .subscription(async function* ({ input, ctx, signal }) {
        const ip = extractClientIp(ctx.req);

        // Tiers 1 & 2: enforced on every message.
        // Catch converts NestJS HttpException → TRPCError (otherwise tRPC returns 500).
        try {
          await aiFirewallGuard.enforceSessionTimeout(ip);
          await aiFirewallGuard.enforceMessageLimit(ip);

          // Tier 3: only on the first message of a new conversation.
          if (input.messages.length === 1) {
            await aiFirewallGuard.enforceInitializationLimit(ip);
          }
        } catch (err) {
          mapFirewallError(err);
        }

        const generator = avalAiService.streamConsultation(
          input.messages.map((m) => ({ role: m.role, content: m.content })),
          input.productSlug,
          input.sessionId ?? null,
          ctx.session?.userId ?? null,
          signal ?? undefined,
        );

        for await (const chunk of generator) {
          if (signal?.aborted) return;
          yield tracked(generateChunkId(), chunk);
        }
      }),

    /**
     * Legacy non-streaming mutation with auto-session creation and persistence.
     *
     * Three-tier firewall is enforced on every request:
     * 1. Session timeout — blocks dead sessions.
     * 2. Message rate — max 50 messages per 5-min window.
     * 3. Init limit — max 5 new sessions per hour (first message only).
     */
    consult: publicProcedure.input(consultInput).mutation(async ({ input, ctx, signal }) => {
      const ip = extractClientIp(ctx.req);

      // Tiers 1 & 2: enforced on every message.
      // Catch converts NestJS HttpException → TRPCError (otherwise tRPC returns 500).
      try {
        await aiFirewallGuard.enforceSessionTimeout(ip);
        await aiFirewallGuard.enforceMessageLimit(ip);

        // Tier 3: only on the first message of a new conversation.
        if (input.messages.length === 1) {
          await aiFirewallGuard.enforceInitializationLimit(ip);
        }
      } catch (err) {
        mapFirewallError(err);
      }

      const messages = input.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
      }));

      let fullText = "";
      let matchedProducts: AiStreamChunk["matchedProducts"] = [];
      let sessionId = input.sessionId ?? null;
      const userId = ctx.session?.userId ?? null;

      const generator = avalAiService.streamConsultation(
        messages,
        input.productContext?.slug,
        sessionId,
        userId,
        signal,
        input.activeProductContextSlug,
      );

      for await (const chunk of generator) {
        if (chunk.type === "delta" && chunk.content) {
          fullText += chunk.content;
        } else if (chunk.type === "done") {
          fullText = chunk.fullContent ?? fullText;
          matchedProducts = chunk.matchedProducts;
          if (chunk.sessionId) {
            sessionId = chunk.sessionId;
          }
        } else if (chunk.type === "error") {
          return {
            text: chunk.error ?? "خطایی رخ داد.",
            messageCount: input.messages.length,
            sessionId,
          };
        }
      }

      return {
        text: fullText || "متأسفانه پاسخی دریافت نشد.",
        messageCount: input.messages.length,
        matchedProducts,
        sessionId,
      };
    }),

    /**
     * Fetch all historical chat sessions for the authenticated user.
     * Ordered by updatedAt descending (most recent first).
     */
    getHistoricalSessions: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session?.userId;

      const result = await db.execute<SessionRow>(sql`
        SELECT id, title, created_at, updated_at
        FROM ai_chat_sessions
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
        LIMIT 50
      `);

      return {
        sessions: result.rows.map((row) => ({
          id: row.id,
          title: row.title ?? "گفتگوی بدون عنوان",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })),
      };
    }),

    /**
     * Fetch the full chronological message chain for a specific session.
     * Sandboxed to the authenticated user's sessions only.
     */
    getSessionMessageChain: protectedProcedure
      .input(z.object({ sessionId: z.string().uuid() }))
      .query(async ({ input, ctx }) => {
        const userId = ctx.session?.userId;

        // Verify ownership
        const sessionCheck = await db.execute<{ id: string }>(sql`
          SELECT id FROM ai_chat_sessions
          WHERE id = ${input.sessionId} AND user_id = ${userId}
          LIMIT 1
        `);

        if (sessionCheck.rows.length === 0) {
          return { messages: [] };
        }

        const result = await db.execute<MessageRow>(sql`
          SELECT id, sender, message_type, content, created_at
          FROM ai_chat_messages
          WHERE session_id = ${input.sessionId}
          ORDER BY created_at ASC
          LIMIT 200
        `);

        return {
          messages: result.rows.map((row) => ({
            id: row.id,
            role: row.sender,
            messageType: row.message_type,
            content: row.content,
            createdAt: row.created_at,
          })),
        };
      }),
  });
}

export type AIRouter = ReturnType<typeof createAIRouter>;

// ─── Utilities ───────────────────────────────────────────────────────────────

function extractClientIp(req: {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  socket: { remoteAddress?: string };
}): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const clientIp = forwarded.split(",")[0].trim();
    if (clientIp) return clientIp;
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp) return realIp;
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

let chunkCounter = 0;
function generateChunkId(): string {
  return `chunk_${Date.now()}_${++chunkCounter}`;
}
