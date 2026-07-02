import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import OpenAI, { toFile } from "openai";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { normalizePersianText } from "./utils/normalize-persian";
import {
  CHAT_MODEL,
  EMBEDDING_MODEL,
  GROUNDED_SYSTEM_PROMPT,
  MAX_VECTOR_RESULTS,
  NO_MATCH_FALLBACK_FA,
} from "./voice-ai.constants";

/**
 * Product row shape from pgvector similarity search.
 */
interface ProductVectorRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: string;
  discounted_price: string | null;
  grade: string;
  stock: number;
  similarity: number;
}

/**
 * Simplified product record for client responses and marketing extraction.
 */
export interface ProductContext {
  id: string;
  name: string;
  price: string;
}

/**
 * Voice AI RAG (Retrieval-Augmented Generation) service.
 *
 * Supports dual modality:
 * - Text inputs: direct string queries
 * - Audio inputs: base64-encoded audio → Whisper STT → text
 *
 * Pipeline:
 * 1. Receive user query (text or transcribed audio)
 * 2. Apply Persian NLP normalization (ک/ی, diacritics, whitespace)
 * 3. Generate 1536-dimensional embedding via OpenAI text-embedding-3-small
 * 4. Execute pgvector cosine similarity search against products.embedding
 * 5. Build grounded context from top-5 matching products
 * 6. Stream LLM response using the grounded system prompt
 *
 * INVARIANTS:
 * - ALL text is normalized before embedding (Persian char safety)
 * - AI NEVER fabricates product data not in the vector search results
 * - Zero-match queries return the fixed Persian fallback string
 * - All OpenAI calls respect the AbortSignal for clean disconnection
 * - No business margins, wholesale prices, or internal data leak
 */
@Injectable()
export class VoiceAiService {
  private readonly logger = new Logger(VoiceAiService.name);
  private readonly openai: OpenAI;

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("openai.apiKey"),
      fetch: this.configService.get<any>("openai.fetch"),
      fetchOptions: {
        dispatcher: this.configService.get<any>("openai.dispatcher"),
      },
    });
  }

  /**
   * Maximum allowed base64 string length for audio uploads.
   * 15MB base64 ≈ 11.25MB decoded audio buffer.
   * Formula: 15 * 1024 * 1024 * (4/3) ≈ 20,971,520 base64 characters
   * We use the raw 15MB limit on the base64 string itself for simplicity.
   */
  private readonly MAX_AUDIO_BASE64_LENGTH = 15 * 1024 * 1024;

  /**
   * Transcribe an audio buffer using OpenAI Whisper STT.
   *
   * MEMORY INVARIANT:
   * - Validates base64 payload size BEFORE buffer allocation (15MB cap)
   * - Nulls buffer references immediately after API response resolves
   * - Prevents unbounded memory spikes from malicious oversized payloads
   *
   * @param base64Audio - Base64-encoded audio data (webm, mp3, wav, etc.)
   * @param signal - AbortSignal for cancellation on disconnect
   * @returns Transcribed text string
   * @throws BadRequestException if payload exceeds 15MB limit
   */
  async transcribeAudio(base64Audio: string, signal: AbortSignal | null): Promise<string> {
    // GUARD: Validate base64 payload size BEFORE allocating buffer memory
    // This prevents a malicious client from triggering unbounded heap growth
    if (base64Audio.length > this.MAX_AUDIO_BASE64_LENGTH) {
      throw new BadRequestException("Audio payload exceeds maximum allowed size (15MB)");
    }

    // Allocate the decoded buffer only after size validation passes
    let audioBuffer: Buffer | null = Buffer.from(base64Audio, "base64");

    // Secondary check: verify decoded buffer is not empty (corrupted base64)
    if (audioBuffer.length === 0) {
      audioBuffer = null;
      throw new BadRequestException("Invalid or empty audio data received");
    }

    try {
      // Create a File-like object for the OpenAI SDK
      const file = await toFile(audioBuffer, "audio.webm", { type: "audio/webm" });

      const response = await this.openai.audio.transcriptions.create(
        {
          model: "whisper-1",
          file,
          language: "fa", // Optimize for Persian transcription
        },
        { signal: signal ?? undefined },
      );

      this.logger.debug(`Whisper STT result: "${response.text.slice(0, 80)}..."`);
      return response.text;
    } finally {
      // CRITICAL: Proactively release buffer reference immediately after use
      // Allows GC to reclaim memory without waiting for function scope exit
      audioBuffer = null;
    }
  }

  /**
   * Execute the full RAG pipeline: normalize → embed → search → ground → stream.
   *
   * @param query - User's text query (already transcribed if audio)
   * @param sessionId - Conversation session identifier
   * @param signal - AbortSignal for cancellation on disconnect
   * @param onChunk - Callback fired for each streaming text chunk
   * @param onComplete - Callback fired when the full response is assembled
   */
  async processQuery(
    query: string,
    sessionId: string,
    signal: AbortSignal | null,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string, products: ProductContext[]) => void,
  ): Promise<void> {
    // CRITICAL: Apply Persian normalization before ANY embedding computation
    const normalizedQuery = normalizePersianText(query);

    // Step 1: Generate embedding for the normalized query
    const embedding = await this.generateEmbedding(normalizedQuery, signal);

    if (signal?.aborted) return;

    // Step 2: Search products using pgvector cosine similarity
    const matchedProducts = await this.searchProductsByVector(embedding);

    if (signal?.aborted) return;

    // Step 3: Handle zero-match case with fixed fallback
    if (matchedProducts.length === 0) {
      this.logger.debug(`No vector matches for query: "${normalizedQuery.slice(0, 50)}..."`);
      onChunk(NO_MATCH_FALLBACK_FA);
      onComplete(NO_MATCH_FALLBACK_FA, []);
      return;
    }

    // Step 4: Build grounded context string from matched products
    const contextString = this.buildProductContext(matchedProducts);
    const productSummaries: ProductContext[] = matchedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.base_price,
    }));

    // Step 5: Stream grounded LLM response
    const fullResponse = await this.streamGroundedResponse(
      normalizedQuery,
      contextString,
      signal,
      onChunk,
    );

    if (signal?.aborted) return;

    onComplete(fullResponse, productSummaries);
  }

  /**
   * Generate a 1536-dimensional embedding vector using OpenAI.
   * Input text is already normalized at this point.
   */
  private async generateEmbedding(text: string, signal: AbortSignal | null): Promise<number[]> {
    const response = await this.openai.embeddings.create(
      {
        model: EMBEDDING_MODEL,
        input: text,
      },
      { signal: signal ?? undefined },
    );

    return response.data[0].embedding;
  }

  /**
   * Execute pgvector cosine similarity search against the products table.
   *
   * Uses the <=> operator for cosine distance.
   * Returns the top MAX_VECTOR_RESULTS (5) most similar active products.
   */
  private async searchProductsByVector(embedding: number[]): Promise<ProductVectorRow[]> {
    const vectorLiteral = `[${embedding.join(",")}]`;

    const result = await this.db.execute<ProductVectorRow>(sql`
      SELECT
        id, name, slug, description, base_price, discounted_price, grade, stock,
        1 - (embedding <=> ${vectorLiteral}::vector) as similarity
      FROM products
      WHERE embedding IS NOT NULL
        AND is_active = true
      ORDER BY embedding <=> ${vectorLiteral}::vector ASC
      LIMIT ${MAX_VECTOR_RESULTS}
    `);

    return result.rows;
  }

  /**
   * Build a structured product context string for the system prompt.
   */
  private buildProductContext(products: ProductVectorRow[]): string {
    return products
      .map((p, i) => {
        const price = p.discounted_price ?? p.base_price;
        return [
          `[${i + 1}] ${p.name}`,
          `   قیمت: ${price} تومان`,
          `   وضعیت: ${p.grade}`,
          `   موجودی: ${p.stock > 0 ? "موجود" : "ناموجود"}`,
          p.description ? `   توضیحات: ${p.description.slice(0, 200)}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");
  }

  /**
   * Stream a grounded LLM response using the matched product context.
   */
  private async streamGroundedResponse(
    userQuery: string,
    productContext: string,
    signal: AbortSignal | null,
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const systemPrompt = GROUNDED_SYSTEM_PROMPT.replace("{{CONTEXT}}", productContext);

    const stream = await this.openai.chat.completions.create(
      {
        model: CHAT_MODEL,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      },
      { signal: signal ?? undefined },
    );

    let fullResponse = "";

    for await (const chunk of stream) {
      if (signal?.aborted) break;

      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        onChunk(content);
      }
    }

    return fullResponse;
  }
}
