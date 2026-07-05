import { createHash } from "node:crypto";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type Redis from "ioredis";
import type { Server, Socket } from "socket.io";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { REDIS_CLIENT } from "../redis/redis.constants";
import { VoiceAiFirewallGuard } from "./guards/voice-ai-firewall.guard";
import { MARKETING_AI_INTENT_EVENT } from "./voice-ai.constants";
import { type ProductContext, VoiceAiService } from "./voice-ai.service";

/**
 * Incoming message payload from client (dual modality).
 *
 * Text mode: { type: "text", text: "query string" }
 * Audio mode: { type: "audio", buffer: "base64_encoded_audio" }
 */
interface VoiceAiMessage {
  /** Message modality: "text" for direct queries, "audio" for speech buffers */
  type: "text" | "audio";
  /** Text content (required for type="text") */
  text?: string;
  /** Base64-encoded audio buffer (required for type="audio") */
  buffer?: string;
  /** Optional conversation session ID for context continuity */
  sessionId?: string;
}

/**
 * Session metadata tracked per connected client.
 */
interface ClientSession {
  /** AbortController for cancelling in-flight OpenAI requests */
  controller: AbortController;
  /** Database session ID (ai_chat_sessions.id) */
  dbSessionId: string | null;
  /** Whether client is authenticated */
  isAuthenticated: boolean;
  /** Guest session ID (for unauthenticated clients) */
  guestSessionId: string | null;
  /** User ID (for authenticated clients) */
  userId: string | null;
}

/**
 * Enterprise-grade WebSocket gateway for real-time Voice AI conversations.
 *
 * Architecture:
 * - Persistent duplex connection via socket.io
 * - Dual modality: text messages + audio buffer transcription (Whisper STT)
 * - Handshake authentication (token validation) — guests allowed with limited budget
 * - Per-message rate limiting via VoiceAiFirewallGuard (tiered: 10/min auth, 3 total guest)
 * - Grounded RAG responses (pgvector → OpenAI)
 * - Message persistence to ai_chat_sessions + ai_messages tables
 * - Marketing event dispatch on session completion
 * - Aggressive resource disposal on disconnect
 *
 * Client connects to: ws://host:3000/voice-ai
 * Authenticated: ?token=rt_tok_...
 * Guest: ?guest_session_id=uuid (optional token omitted)
 *
 * Events:
 * - Client → Server: "message" { type, text?, buffer?, sessionId? }
 * - Server → Client: "response" { text, products?, sessionId }
 * - Server → Client: "response:chunk" { chunk, sessionId } (streaming)
 * - Server → Client: "response:end" { sessionId }
 * - Server → Client: "limit_exhausted" { status, action, message } (guest cap)
 * - Server → Client: "error" { statusCode, message, messageFa }
 */
@WebSocketGateway({
  namespace: "/voice-ai",
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
})
export class VoiceAiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(VoiceAiGateway.name);

  /**
   * Track active sessions for resource disposal and message persistence.
   */
  private readonly activeSessions = new Map<string, ClientSession>();

  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(VoiceAiService)
    private readonly voiceAiService: VoiceAiService,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Handle new WebSocket connection.
   *
   * Three auth paths, checked in order:
   * 1. rt_tok_ API token in the query string (server-to-server callers)
   * 2. rt_session httpOnly cookie (first-party web app — same mechanism as tRPC)
   * 3. Guest with guest_session_id (limited 3-message lifetime budget)
   */
  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.query.token as string | undefined;
    const guestSessionId = client.handshake.query.guest_session_id as string | undefined;
    const hasApiToken = !!token && token.startsWith("rt_tok_");

    // Resolve the web app's session cookie (same store the tRPC context uses)
    const cookieUserId = hasApiToken ? null : await this.resolveSessionCookie(client);
    const isAuthenticated = hasApiToken || !!cookieUserId;

    // If neither token, session cookie, nor guest_session_id → socket.id as guest
    const effectiveGuestId = isAuthenticated ? null : guestSessionId || client.id;

    // Create session tracking
    const session: ClientSession = {
      controller: new AbortController(),
      dbSessionId: null,
      isAuthenticated,
      guestSessionId: effectiveGuestId,
      userId: cookieUserId,
    };

    this.activeSessions.set(client.id, session);

    // Expose the auth result to the per-message firewall guard
    client.data.isAuthenticated = isAuthenticated;

    // Initialize the DB session asynchronously (non-blocking)
    void this.initializeDbSession(client.id, session);

    this.logger.debug(
      `Voice AI client connected: ${client.id} (${
        hasApiToken
          ? "api-token"
          : cookieUserId
            ? `user:${cookieUserId}`
            : `guest:${effectiveGuestId}`
      })`,
    );
  }

  /**
   * Resolve the rt_session cookie from the WebSocket handshake to a user id.
   * Mirrors SessionService.resolveSession (sha256 → Redis session:{hash}).
   */
  private async resolveSessionCookie(client: Socket): Promise<string | null> {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      if (!cookieHeader) return null;

      const match = cookieHeader.match(/(?:^|;\s*)rt_session=([^;]+)/);
      if (!match) return null;

      const rawToken = decodeURIComponent(match[1]);
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");
      const data = await this.redis.get(`session:${tokenHash}`);
      if (!data) return null;

      const parsed = JSON.parse(data) as { userId?: string };
      return parsed.userId ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Handle WebSocket disconnection.
   *
   * CRITICAL: Aggressive resource disposal + marketing event dispatch.
   */
  handleDisconnect(client: Socket): void {
    const session = this.activeSessions.get(client.id);

    if (session) {
      // Abort any pending OpenAI API calls
      session.controller.abort();

      // Dispatch marketing intent event (non-blocking)
      if (session.dbSessionId) {
        this.eventEmitter.emit(MARKETING_AI_INTENT_EVENT, {
          sessionId: session.dbSessionId,
          guestSessionId: session.guestSessionId,
          userId: session.userId,
          disconnectedAt: new Date().toISOString(),
        });
      }

      // Remove from active tracking
      this.activeSessions.delete(client.id);
    }

    this.logger.debug(`Voice AI client disconnected: ${client.id}`);
  }

  /**
   * Handle incoming text/audio messages (dual modality).
   *
   * Protected by VoiceAiFirewallGuard (tiered rate limiting).
   *
   * Flow:
   * 1. Guard checks rate limit (auth: sliding window, guest: hard cap)
   * 2. If audio: transcribe via Whisper STT
   * 3. Process text through RAG pipeline
   * 4. Persist messages to database
   * 5. Stream response chunks back to client
   */
  @UseGuards(VoiceAiFirewallGuard)
  @SubscribeMessage("message")
  async handleMessage(
    @MessageBody() data: VoiceAiMessage,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const session = this.activeSessions.get(client.id);
    const sessionId = data.sessionId ?? client.id;

    // Validate message payload
    if (data.type === "text" && (!data.text || data.text.trim().length === 0)) {
      client.emit("error", {
        statusCode: 400,
        message: "Empty text message",
        messageFa: "پیام خالی است",
      });
      return;
    }

    if (data.type === "audio" && (!data.buffer || data.buffer.length === 0)) {
      client.emit("error", {
        statusCode: 400,
        message: "Empty audio buffer",
        messageFa: "فایل صوتی خالی است",
      });
      return;
    }

    try {
      // Step 1: Resolve text from modality
      let queryText: string;
      let messageType: "text" | "audio_transcript";

      if (data.type === "audio") {
        // Transcribe audio via Whisper STT
        queryText = await this.voiceAiService.transcribeAudio(
          data.buffer!,
          session?.controller.signal ?? null,
        );
        messageType = "audio_transcript";

        if (session?.controller.signal.aborted) return;

        // Emit transcript back to client for display
        client.emit("transcript", { text: queryText, sessionId });
      } else {
        queryText = data.text!.trim();
        messageType = "text";
      }

      // Step 2: Persist user message to database
      if (session?.dbSessionId) {
        void this.persistMessage(session.dbSessionId, "user", messageType, queryText, null);
      }

      // Step 3: Execute the RAG pipeline with streaming
      await this.voiceAiService.processQuery(
        queryText,
        sessionId,
        session?.controller.signal ?? null,
        // Streaming callback: emit chunks to the client in real-time
        (chunk: string) => {
          if (!session?.controller.signal.aborted) {
            client.emit("response:chunk", { chunk, sessionId });
          }
        },
        // Completion callback: emit final response + persist assistant message
        (fullResponse: string, products: ProductContext[]) => {
          if (!session?.controller.signal.aborted) {
            client.emit("response", { text: fullResponse, products, sessionId });
            client.emit("response:end", { sessionId });

            // Persist assistant response to database
            if (session?.dbSessionId) {
              void this.persistMessage(session.dbSessionId, "assistant", "text", fullResponse, {
                matchedProductIds: products.map((p) => p.id),
                intentTags: this.extractIntentTags(queryText),
              });
            }
          }
        },
      );
    } catch (err: unknown) {
      if (session?.controller.signal.aborted) return;

      if (err instanceof WsException) throw err;

      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.error(`Voice AI processing error for ${client.id}: ${message}`);

      client.emit("error", {
        statusCode: 500,
        message: "An error occurred while processing your request",
        messageFa: "خطایی در پردازش درخواست شما رخ داده است",
      });
    }
  }

  /**
   * Initialize a database session for this WebSocket connection.
   */
  private async initializeDbSession(clientId: string, session: ClientSession): Promise<void> {
    try {
      const result = await this.db.execute<{ id: string } & Record<string, unknown>>(sql`
        INSERT INTO ai_chat_sessions (user_id, guest_session_id)
        VALUES (${session.userId}, ${session.guestSessionId})
        RETURNING id
      `);

      const row = result.rows[0];
      if (row) {
        session.dbSessionId = row.id;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to initialize DB session for ${clientId}: ${message}`);
    }
  }

  /**
   * Persist a message to the ai_messages table (non-blocking).
   */
  private async persistMessage(
    sessionId: string,
    sender: "user" | "assistant",
    messageType: "text" | "audio_transcript",
    payload: string,
    metadata: Record<string, unknown> | null,
  ): Promise<void> {
    try {
      await this.db.execute(sql`
        INSERT INTO ai_chat_messages (session_id, sender, message_type, content, metadata)
        VALUES (
          ${sessionId},
          ${sender},
          ${messageType},
          ${payload},
          ${metadata ? JSON.stringify(metadata) : null}::json
        )
      `);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to persist message for session ${sessionId}: ${message}`);
    }
  }

  /**
   * Extract basic intent tags from user queries for marketing pipelines.
   * Simple keyword-based extraction for product categories and attributes.
   */
  private extractIntentTags(query: string): string[] {
    const tags: string[] = [];
    const lowerQuery = query.toLowerCase();

    const intentPatterns: Array<[string, string]> = [
      ["آیفون", "iphone"],
      ["سامسونگ", "samsung"],
      ["شیائومی", "xiaomi"],
      ["لپ تاپ", "laptop"],
      ["تبلت", "tablet"],
      ["هدفون", "headphone"],
      ["ساعت هوشمند", "smartwatch"],
      ["کارکرده", "used"],
      ["نو", "new"],
      ["ارزان", "budget"],
      ["گران", "premium"],
    ];

    for (const [persian, english] of intentPatterns) {
      if (lowerQuery.includes(persian)) {
        tags.push(english);
      }
    }

    return tags;
  }
}
