import { Injectable, Logger } from "@nestjs/common";
import type OpenAI from "openai";
import {
  AVALAI_CHAT_MODEL_LITE,
  QUERY_REWRITER_CACHE_MAX,
  QUERY_REWRITER_CACHE_TTL_MS,
  QUERY_REWRITER_TEMP,
} from "./avalai.constants";

// ─── LRU Cache Entry ─────────────────────────────────────────────────────────

interface CacheEntry {
  expanded: string;
  expiresAt: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * QueryRewriterService — Pre-embedding semantic expansion layer.
 *
 * Transforms loose, colloquial user queries into rich hardware token strings
 * before sending them to the pgvector embedding generator. This dramatically
 * improves cosine similarity recall against granular database identifiers
 * (e.g., "surface pro 5", "MacBook Air M2 13-inch").
 *
 * Architecture:
 *  - Uses the SIMPLE_TRANSIENT model (gpt-4o-mini, temp 0.3) — cheap & fast.
 *  - Results are LRU-cached in memory (max 200 entries, 5-min TTL).
 *  - Falls back to the original normalised query on any error or timeout.
 *
 * Example:
 *  Input:  "لپ تاپ سرفیس پرو چی داری"
 *  Output: "Surface Pro, Microsoft Surface, لپتاپ مایکروسافت سرفیس, surface pro 5, Surface Pro 7"
 */
@Injectable()
export class QueryRewriterService {
  private readonly logger = new Logger(QueryRewriterService.name);

  /**
   * In-memory LRU map. Key = normalised query, Value = cache entry.
   * Insertion order is preserved; oldest entries are evicted when MAX is hit.
   */
  private readonly cache = new Map<string, CacheEntry>();

  /**
   * Expand a normalised user query into a multi-lingual hardware token string.
   * Returns the cached expansion if available and not yet expired.
   *
   * @param client   The shared OpenAI client from AvalAiService.
   * @param query    The normalised (Persian numerals → ASCII) user message.
   * @param signal   Optional AbortSignal — if aborted, returns original query.
   */
  async expand(client: OpenAI, query: string, signal?: AbortSignal): Promise<string> {
    const cached = this.getFromCache(query);
    if (cached) {
      this.logger.debug(`[QueryRewriter] Cache HIT for "${query.slice(0, 40)}"`);
      return cached;
    }

    try {
      const expanded = await this.callRewriter(client, query, signal);
      this.setInCache(query, expanded);
      this.logger.log(
        `[QueryRewriter] Expanded: "${query.slice(0, 40)}" → "${expanded.slice(0, 80)}"`,
      );
      return expanded;
    } catch (err) {
      if (signal?.aborted) return query;
      this.logger.warn(
        `[QueryRewriter] Expansion failed, falling back to original: ${(err as Error).message}`,
      );
      return query;
    }
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private async callRewriter(client: OpenAI, query: string, signal?: AbortSignal): Promise<string> {
    const response = await client.chat.completions.create(
      {
        model: AVALAI_CHAT_MODEL_LITE,
        temperature: QUERY_REWRITER_TEMP,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are a hardware product search query expander for a Persian e-commerce store.
Given a Persian user query about a hardware product, output ONLY a comma-separated list of search tokens.

[SYNONYM & FEATURE MAPPING MATRIX — Apply these mappings first]
If the query contains any of these Persian descriptors, you MUST include the corresponding English hardware tokens:
- لمسی / صفحه لمسی / touch      → Touchscreen, Touch Display, 2-in-1, Convertible, Surface Pro, لمسی
- گیمینگ / بازی / gaming          → Gaming, NVIDIA, RTX, GTX, Dedicated Graphics, GPU, گرافیک مجزا
- دانشجویی / دانشجو / student      → Student, Office, Lightweight, Thin, Core i5, اقتصادی, قیمت مناسب
- اقتصادی / ارزون / ارزان           → Budget, open-box, استوک, گرید B, قیمت مناسب, affordable
- سبک / باریک / ultrathin          → Ultrabook, Thin and Light, lightweight, slim, باریک
- رندر / تدوین / طراحی             → Rendering, Video Editing, Adobe, Core i7, i9, RAM 32GB
- برنامه‌نویسی / کدنویسی / develop  → Development, Programming, MacBook, ThinkPad, Core i7
- قوی / پرفورمنس / high-end        → High Performance, Core i9, RTX, 32GB RAM, SSD NVMe
- مک / اپل / apple                 → MacBook, Apple M1, Apple M2, Mac, MacBook Pro, MacBook Air
- سرفیس / surface                  → Microsoft Surface, Surface Pro, Surface Laptop, 2-in-1, Touch

[GENERAL EXPANSION RULES]
- Include the product's canonical English model name(s) (e.g., "Surface Pro 7", "MacBook Air M2")
- Include Persian transliterations (e.g., "سرفیس پرو", "مک‌بوک ایر")
- Include common variant identifiers (e.g., "surface pro 5", "surface pro 6")
- Include related brand/series terms in both languages

Output ONLY the comma-separated token list. No explanation, no JSON, no extra text.
If the query is a greeting or general non-product question, output the original query unchanged.
Maximum 12 tokens in the list.`,
          },
          { role: "user", content: query },
        ],
      },
      { signal: signal ?? undefined },
    );

    const result = response.choices[0]?.message?.content?.trim();
    if (!result || result.length < 3) return query;
    return result;
  }

  private getFromCache(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Refresh LRU position by re-inserting
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.expanded;
  }

  private setInCache(key: string, expanded: string): void {
    // Evict oldest entry when at capacity
    if (this.cache.size >= QUERY_REWRITER_CACHE_MAX) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, {
      expanded,
      expiresAt: Date.now() + QUERY_REWRITER_CACHE_TTL_MS,
    });
  }
}
