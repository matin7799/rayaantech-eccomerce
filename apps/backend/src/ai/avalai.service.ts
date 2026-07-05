import { Agent } from "node:https";
import { Inject, Injectable, Logger, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AiMatchedProduct, AiStreamChunk } from "@rayan-tech/types";
import { type AiConfig, DEFAULT_AI_CONFIG } from "@rayan-tech/types";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import OpenAI from "openai";
import { TOPIC_AI_TELEMETRY } from "../ai-consultation/constants/telemetry.constants";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { KafkaProducerService } from "../kafka/kafka-producer.service";
import { normalizePersianText } from "../voice-ai/utils/normalize-persian";
import { AVALAI_BASE_URL, AVALAI_EMBEDDING_MODEL, AVALAI_MAX_TOKENS } from "./avalai.constants";
import { AvalAiIntentParser } from "./avalai-intent.parser";
import { AvalAiProductRepository } from "./avalai-product.repository";
import type { ProductVectorRow } from "./interfaces/product-vector.interface";
import { ModelSelectionService } from "./model-selection.service";
import { QueryRewriterService } from "./query-rewriter.service";
import { RejectionDetectorService } from "./rejection-detector.service";

/**
 * AvalAI Consultation Service — Hybrid Discovery & Dual-Query RAG engine.
 */
@Injectable()
export class AvalAiService {
  private readonly logger = new Logger(AvalAiService.name);
  private readonly client: OpenAI;

  /** Short-lived cache for admin-editable AI config (app_settings.ai_config). */
  private aiConfigCache: { value: AiConfig; expiresAt: number } | null = null;
  private static readonly AI_CONFIG_TTL_MS = 30_000;

  constructor(
    @Inject(AvalAiProductRepository)
    private readonly productRepository: AvalAiProductRepository,
    @Inject(AvalAiIntentParser)
    private readonly intentParser: AvalAiIntentParser,
    @Inject(ModelSelectionService)
    private readonly modelSelector: ModelSelectionService,
    @Inject(QueryRewriterService)
    private readonly queryRewriter: QueryRewriterService,
    @Inject(RejectionDetectorService)
    private readonly rejectionDetector: RejectionDetectorService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Optional()
    @Inject(KafkaProducerService)
    private readonly kafkaProducer?: KafkaProducerService,
  ) {
    const apiKey = this.configService.getOrThrow<string>("AVALAI_API_KEY");
    const baseURL = this.configService.get<string>("AVALAI_BASE_URL", AVALAI_BASE_URL);

    this.client = new OpenAI({
      apiKey,
      baseURL,
      httpAgent: new Agent({ keepAlive: true }),
    } as any);
  }

  /**
   * Load admin-editable AI config from app_settings, merged over defaults.
   *
   * Cached for a few seconds to avoid a DB round-trip per request. Tolerant of a
   * missing table/row — always resolves to a valid config via DEFAULT_AI_CONFIG.
   */
  private async loadAiConfig(): Promise<AiConfig> {
    const now = Date.now();
    if (this.aiConfigCache && this.aiConfigCache.expiresAt > now) {
      return this.aiConfigCache.value;
    }
    let value: AiConfig = { ...DEFAULT_AI_CONFIG };
    try {
      const result = await this.db.execute<{ value: Record<string, unknown> }>(
        sql`SELECT value FROM app_settings WHERE key = 'ai_config' LIMIT 1`,
      );
      if (result.rows[0]?.value) {
        value = { ...DEFAULT_AI_CONFIG, ...result.rows[0].value };
      }
    } catch (err) {
      this.logger.warn(`Failed to load AI config, using defaults: ${(err as Error).message}`);
    }
    this.aiConfigCache = { value, expiresAt: now + AvalAiService.AI_CONFIG_TTL_MS };
    return value;
  }

  /**
   * Execute the full Hybrid Dual-Query RAG streaming pipeline.
   */
  async *streamConsultation(
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    productSlug?: string,
    sessionId?: string | null,
    userId?: string | null,
    signal?: AbortSignal,
    activeProductContextSlug?: string,
  ): AsyncGenerator<AiStreamChunk> {
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    if (!lastUserMessage) {
      yield { type: "error", error: "پیام کاربر یافت نشد." };
      return;
    }

    const normalizedQuery = normalizePersianText(lastUserMessage.content);

    // 0. Load admin-editable AI config (models, sampling, persona overrides)
    const aiConfig = await this.loadAiConfig();

    // 1. Fetch Live Session Memory
    let llmMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = messages;
    if (sessionId) {
      try {
        const result = await this.db.execute<{ sender: "user" | "assistant"; content: string }>(sql`
          SELECT sender, content
          FROM ai_chat_messages
          WHERE session_id = ${sessionId}
          ORDER BY created_at DESC
          LIMIT 10
        `);
        if (result.rows.length > 0) {
          llmMessages = [
            ...result.rows
              .reverse()
              .map((r) => ({ role: r.sender as "user" | "assistant", content: r.content })),
            { role: "user", content: lastUserMessage.content },
          ];
        }
      } catch (err) {
        this.logger.warn(`Failed to fetch live session memory: ${(err as Error).message}`);
      }
    }

    // 2. Query Expansion (Pre-query semantic expansion)
    const expandedQuery = await this.queryRewriter.expand(this.client, normalizedQuery, signal);

    // Stage 1.5: Intent Parsing + Model Selection
    const intent = await this.intentParser.parseUserIntent(this.client, normalizedQuery);
    this.logger.log(`Parsed Intent: ${JSON.stringify(intent)}`);

    // Select model tier BEFORE any RAG work — O(1) regex gate
    const modelSelection = this.modelSelector.select(normalizedQuery, intent.needsDbQuery);

    let embedding: number[] | null = null;
    let matchedProducts: ProductVectorRow[] = [];
    let pivotDirective = "";

    // Lazy embedding helper to avoid generating vector embeddings twice
    const getEmbedding = async () => {
      if (!embedding) {
        embedding = await this.getEmbeddingSafely(expandedQuery, signal);
      }
      return embedding;
    };

    // Step 1.5: Rejection / Conversational Pivot Detection
    // Only active when a product context is already pinned. If the user rejects
    // the current product, we bypass the hard-pin and run a fresh exclusion search.
    const activeProduct = activeProductContextSlug
      ? await this.productRepository.getProductBySlug(activeProductContextSlug)
      : null;

    const rejectionResult = activeProduct
      ? this.rejectionDetector.detect(normalizedQuery)
      : { isRejection: false, category: null as null };

    if (rejectionResult.isRejection && activeProduct && activeProductContextSlug) {
      this.logger.log(
        `[Pivot] Rejection detected (category=${rejectionResult.category}) for "${activeProductContextSlug}". Expanding search to alternatives.`,
      );

      // Fetch fresh alternatives excluding the rejected product
      const pivotEmbedding = await getEmbedding();
      if (pivotEmbedding) {
        matchedProducts = await this.productRepository.searchProductsExcluding(
          pivotEmbedding,
          activeProductContextSlug,
          3,
        );
      }

      // Fallback: text search if embedding failed
      if (matchedProducts.length === 0) {
        matchedProducts = await this.productRepository.searchProductsByText(expandedQuery, {
          budgetLimit: intent.budgetLimit,
          limit: 6,
        });
        matchedProducts = matchedProducts.filter((p) => p.slug !== activeProductContextSlug);
      }

      // Build empathetic pivot directive for the LLM
      pivotDirective = this.rejectionDetector.buildPivotDirective(
        activeProduct.name,
        rejectionResult.category,
      );
    } else if (activeProduct) {
      // Normal pinned-product flow: anchor to the active product context
      matchedProducts = [activeProduct];
      this.logger.log(
        `Active product context slug provided: ${activeProductContextSlug}. Hydrating context and bypassing broad unstructured search.`,
      );
    } else {
      // Standard broad discovery flow
      const anchoredProduct = productSlug
        ? await this.productRepository.getProductBySlug(productSlug)
        : null;

      if (anchoredProduct) {
        matchedProducts = [anchoredProduct];
      }

      if (intent.needsDbQuery) {
        if (intent.budgetLimit !== null) {
          this.logger.log(
            `Executing price boundary window search for budget: ${intent.budgetLimit}`,
          );
          matchedProducts = this.mergeProductMatches(
            matchedProducts,
            await this.productRepository.searchProductsByPriceWindow(intent.budgetLimit),
          );
        }

        if (matchedProducts.length < 3) {
          const queryEmbedding = await getEmbedding();
          if (queryEmbedding) {
            const vectorMatches = await this.getMatchedProductsSafely(queryEmbedding, productSlug);
            if (vectorMatches) {
              matchedProducts = this.mergeProductMatches(matchedProducts, vectorMatches);
            }
          }
        }

        if (matchedProducts.length < 3) {
          const textMatches = await this.productRepository.searchProductsByText(expandedQuery, {
            budgetLimit: intent.budgetLimit,
            limit: 6,
          });
          matchedProducts = this.mergeProductMatches(matchedProducts, textMatches);
        }
      } else {
        this.logger.log(`Bypassing broad inventory search for non-shopping query.`);
      }
    }

    if (signal?.aborted) return;

    // 3. Query B (User Profile Deep Legacy)
    let pastHistoryMatches: string[] = [];
    if (userId) {
      try {
        const queryEmbedding = await getEmbedding();
        const vectorLiteral = queryEmbedding ? `[${queryEmbedding.join(",")}]` : null;
        if (vectorLiteral) {
          const historyResult = await this.db.execute<{ content: string }>(sql`
            SELECT m.content
            FROM ai_chat_messages m
            JOIN ai_chat_sessions s ON m.session_id = s.id
            WHERE s.user_id = ${userId}
              AND m.sender = 'user'
              AND m.embedding IS NOT NULL
            ORDER BY m.embedding <=> ${vectorLiteral}::vector ASC
            LIMIT 3
          `);
          pastHistoryMatches = historyResult.rows.map((row) => row.content);
        }
      } catch (err) {
        this.logger.warn(`Failed to fetch deep legacy history: ${(err as Error).message}`);
      }
    }

    // 4. Fetch Active Variants & Build Context Block
    const productIds = matchedProducts.map((p) => p.id);
    let variants = await this.productRepository.fetchActiveVariants(productIds);

    if (variants.length === 0 && matchedProducts.length > 0) {
      variants = matchedProducts.map((p) => ({
        variantId: p.id,
        productId: p.id,
        productName: p.name,
        slug: p.slug,
        stock: p.stock,
        grade: p.grade,
        price: Number(p.discounted_price ?? p.base_price),
      }));
    }

    const liveInventoryContext =
      variants.length > 0
        ? JSON.stringify(
            variants.map((v) => {
              return {
                name: v.productName,
                variantUuid: v.variantId,
                slug: v.slug || "",
                stock: `${v.stock} pcs`,
                grade: v.grade,
                priceToman: `${v.price.toLocaleString("fa-IR")} تومان`,
              };
            }),
            null,
            2,
          )
        : "No direct product matches found for this specific query.";

    const stringifiedPastHistoryMatches =
      pastHistoryMatches.length > 0
        ? pastHistoryMatches.map((m, idx) => `[${idx + 1}] ${m}`).join("\n")
        : "No legacy profile context yet.";

    let focusDirective = "";
    // In pivot mode, the PIVOT_DIRECTIVE takes precedence — skip the IMMEDIATE FOCUS block
    // so the LLM doesn't anchor back to the product the user just rejected.
    if (!rejectionResult.isRejection && activeProductContextSlug && activeProduct) {
      focusDirective = `
[IMMEDIATE FOCUS]
The customer is currently looking directly at the product page for slug: ${activeProductContextSlug}.
Acknowledge this product switch smoothly in Persian (e.g., "در حال بررسی مشخصات فنی سرفیس پرو ۵ با شما هستیم...").
Prioritize answering questions regarding this model's technical specs and ecosystem compatibility while maintaining long-term memory of their legacy choices.
`;
    }

    // 5. System Prompt Overhaul (RayanWise + Structured Output Guardrails)
    const systemPrompt = `Your context is heavily sandboxed. You are "رایانوایز" (RayanWise), the highly creative, professional, and deeply caring senior shopping advisor for Rayan Tech (لوکس پلتفرم). You must ONLY answer queries using products explicitly present inside the provided [LIVE_INVENTORY_CONTEXT]. If a user asks for a device, layout, or specification that is missing from the active warehouse context, you are STRICTLY FORBIDDEN from generating or simulating it. Instead, execute Discovery Mode: gracefully inform them it is out of stock and offer the closest available product from the active list.

${pivotDirective || focusDirective}

If you recommend or present a product from the inventory context, you MUST append a trigger tag in the format \`[product_card: variantUuid | slug | Product Name]\` at the end of your response so the system can render it for the user.

[THREE-SLOT RECOMMENDATION ENGINE]
- You MUST initially recommend exactly 3 option slots (Option A, Option B, Option C) from the active injected database rows.
- If the user requests updates, adjustments, or rejects an option, dynamically mutate the slots by removing the rejected option and backfilling it with another option from the context.
- Lock down to a single optimal recommendation only when the user expresses complete satisfaction.

[PSYCHOLOGICAL HEALTH TRUST & WARRANTY POLICY]
If the customer expresses worry, fear, anxiety, or hesitation regarding stock, open-box, graded, or second-hand quality, or before mentioning transferring to a human agent, you MUST communicate this exact promise word-for-word:
"دوست من، برای اطمینان خاطر کامل شما، مجموعه رایانتک تمامی دستگاهها را قبل از رسیدن به مرحله فروش، به صورت صفر تا صد و تخصصی تست و چک سختافزاری کرده است. با توجه به این اطمینان خاطر، ما یک هفته ضمانت سلامت و کارایی بیقیدوشرط روی کالا ارائه میدهیم؛ یعنی در صورتی که مشکلی وجود داشته باشد یا دستگاه نیاز شما را رفع نکند، بدون کوچکترین افت قیمت مرجوع خواهیم کرد. همچنین، این کالا دارای یک ماه ضمانت کتبی سختافزاری رایانتک است و شما این امکان را دارید که مدت زمان گارانتی را در صفحه محصول به ۶ ماه یا ۱۲ ماه افزایش دهید. یا در صورت تمایل، با مشاوران ارشد فنی ما تماس بگیرید."

[OUTPUT FORMAT RULES — MANDATORY]
It is STRICTLY FORBIDDEN to output long, unformatted raw text blocks. Every response MUST comply with the structured markdown layout below so the frontend can parse it into premium Liquid Glassmorphism UI components.
- Use ## for product names and main section headings.
- Use ### for sub-sections (e.g., مشخصات فنی، ضمانت، گزینه‌ها).
- Use bullet lists (- ) for spec items. Each spec must be on its own line.
- Format pricing fields with Persian numerals and commas: e.g., ۶۴٬۰۰۰٬۰۰۰ تومان.
- Use proper RTL punctuation. Do NOT use English brackets () inside Persian text blocks; use «» for emphasis.
- Separate logical sections with a horizontal rule (---).
- Do NOT use inline HTML tags.
- Do NOT output raw JSON or code blocks in user-facing responses.
- When recommending or suggesting a product, you MUST embed an interactive card using the following exact tag: [product_card: variantUuid | slug | Product Name] (e.g., [product_card: 123e4567-e89b-12d3-a456-426614174000 | surface-pro-5 | سرفیس پرو ۵]).

[CRITICAL USER HISTORICAL PROFILE]
The customer has historically expressed these preferences in past conversations:
${stringifiedPastHistoryMatches}

[LIVE_INVENTORY_CONTEXT]
${liveInventoryContext}

[GUARDRAILS]
- You must speak in highly polite, empathetic, and warm Persian.
- Never reveal internal margins or competitor data.
- If product catalog context is empty, gently engage in a discovery conversation. Ask for their use case, preferred brands, or budget to guide them. Do NOT fabricate models missing from the inventory.${
      aiConfig.extraInstructions?.trim()
        ? `\n\n[ADMIN POLICY OVERRIDES]\n${aiConfig.extraInstructions.trim()}`
        : ""
    }`;

    const productRefs = this.productRepository.mapToProductRefs(matchedProducts);

    // 6. Anxiety Check & System Directive Injection (Strict Boilerplate Ban vs Dynamic Activation)
    const anxietyKeywords = [
      "ترس",
      "نگرانی",
      "خرابی",
      "اعتماد",
      "استوک",
      "خراب",
      "دست دوم",
      "ضمانت",
      "سالم بودن",
      "کیفیت",
      "کارکرده",
      "گارانتی",
    ];
    const hasAnxiety = anxietyKeywords.some((keyword) => normalizedQuery.includes(keyword));
    if (hasAnxiety) {
      llmMessages = [
        ...llmMessages,
        {
          role: "system",
          content:
            "IMPORTANT: The user has expressed anxiety or concern about quality, stock, or warranty. You MUST immediately inject the exact warranty trust promise copy into your response.",
        },
      ];
    } else {
      llmMessages = [
        ...llmMessages,
        {
          role: "system",
          content:
            "IMPORTANT: The user has NOT expressed concern or anxiety. You are STRICTLY PROHIBITED from emitting the trust promise text or warranty boilerplate paragraphs in this turn.",
        },
      ];
    }

    // 7. Stream LLM response using the tier-selected model
    let fullContent = "";
    const stream = this.streamCompletions(
      systemPrompt,
      llmMessages,
      productRefs,
      modelSelection.model,
      modelSelection.temperature,
      signal,
      aiConfig.maxTokens,
    );

    for await (const chunk of stream) {
      if (chunk.type === "delta" && chunk.content) {
        fullContent += chunk.content;
      } else if (chunk.type === "done") {
        fullContent = chunk.fullContent ?? "";
      }
      yield chunk;
    }

    if (signal?.aborted) return;

    // 8. Trigger Parser Loop — handles both tag formats emitted by the AI
    const triggerRegex =
      /\[product_card:\s*([a-f0-9-]{36})(?:\s*\|\s*([^|\]]*)\s*\|\s*([^\]]+?))?\]/gi;
    const shortTagRegex = /\[Product:\s*([^\]|]+)\|([^\]]+?)\]/gi;

    let match: RegExpExecArray | null;
    const extraProductIds = new Set<string>();
    const extraProductSlugs = new Set<string>();

    // Parse full [product_card: uuid | slug | name] format
    while (true) {
      match = triggerRegex.exec(fullContent);
      if (match === null) break;
      extraProductIds.add(match[1]);
    }

    // Parse shorthand [Product: slug|name] format
    while (true) {
      match = shortTagRegex.exec(fullContent);
      if (match === null) break;
      extraProductSlugs.add(match[1].trim());
    }

    if (extraProductIds.size > 0) {
      try {
        const resolvedRefs = await this.productRepository.resolveTriggerProductRefs(
          Array.from(extraProductIds),
        );
        for (const ref of resolvedRefs) {
          if (!productRefs.some((p) => p.id === ref.id)) {
            productRefs.push(ref);
          }
        }
      } catch (err) {
        this.logger.warn(
          `Failed to parse custom product_cards triggers: ${(err as Error).message}`,
        );
      }
    }

    if (extraProductSlugs.size > 0) {
      try {
        const resolvedBySlug = await this.productRepository.resolveProductRefsBySlugs(
          Array.from(extraProductSlugs),
        );
        for (const ref of resolvedBySlug) {
          if (!productRefs.some((p) => p.id === ref.id)) {
            productRefs.push(ref);
          }
        }
      } catch (err) {
        this.logger.warn(
          `Failed to resolve shorthand [Product: slug] triggers: ${(err as Error).message}`,
        );
      }
    }

    // Retain the tag for inline luxury-markdown component rendering!
    const cleanContent = fullContent;

    // 9. Atomic Storage
    let resolvedSessionId = sessionId;
    try {
      if (!resolvedSessionId) {
        const result = await this.db.execute<{ id: string }>(sql`
          INSERT INTO ai_chat_sessions (user_id)
          VALUES (${userId ?? null})
          RETURNING id
        `);
        resolvedSessionId = result.rows[0].id;
      } else {
        await this.db.execute(sql`
          UPDATE ai_chat_sessions SET updated_at = NOW() WHERE id = ${resolvedSessionId}
        `);
      }

      if (resolvedSessionId) {
        const vectorLiteral = embedding ? `[${embedding.join(",")}]` : null;
        await this.db.execute(sql`
          INSERT INTO ai_chat_messages (session_id, sender, message_type, content, embedding)
          VALUES (${resolvedSessionId}, 'user', 'text', ${lastUserMessage.content}, ${vectorLiteral ? sql`${vectorLiteral}::vector` : null})
        `);

        await this.db.execute(sql`
          INSERT INTO ai_chat_messages (session_id, sender, message_type, content)
          VALUES (${resolvedSessionId}, 'assistant', 'text', ${cleanContent})
        `);
      }
    } catch (err) {
      this.logger.warn(`Failed to persist chat atomic storage: ${(err as Error).message}`);
    }

    // 10. Kafka Telemetry Dispatch
    let totalTurnCount = 1;
    if (resolvedSessionId) {
      try {
        const countResult = await this.db.execute<{ count: number }>(sql`
          SELECT COUNT(*)::int as count FROM ai_chat_messages WHERE session_id = ${resolvedSessionId}
        `);
        totalTurnCount = countResult.rows[0]?.count ?? 1;
      } catch (_err) {
        // non-critical
      }
    }

    this.dispatchTelemetry(
      lastUserMessage.content,
      totalTurnCount,
      resolvedSessionId ?? "anonymous",
    );

    yield {
      type: "done",
      fullContent: cleanContent,
      matchedProducts: productRefs,
      sessionId: resolvedSessionId ?? undefined,
    };
  }

  private mergeProductMatches(
    primary: ProductVectorRow[],
    secondary: ProductVectorRow[],
  ): ProductVectorRow[] {
    const seen = new Set<string>();
    const merged: ProductVectorRow[] = [];

    for (const product of [...primary, ...secondary]) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      merged.push(product);
    }

    return merged.slice(0, 6);
  }
  private async getEmbeddingSafely(text: string, signal?: AbortSignal): Promise<number[] | null> {
    try {
      const response = await this.client.embeddings.create(
        { model: AVALAI_EMBEDDING_MODEL, input: text },
        { signal: signal ?? undefined },
      );
      return response.data[0].embedding;
    } catch (err) {
      if (signal?.aborted) return null;
      this.logger.error(`Embedding generation failed: ${(err as Error).message}`);
      return null;
    }
  }

  private async getMatchedProductsSafely(
    embedding: number[],
    productSlug?: string,
  ): Promise<ProductVectorRow[] | null> {
    try {
      return await this.productRepository.searchProductsByVector(embedding, productSlug);
    } catch (err) {
      this.logger.error(`pgvector search failed: ${(err as Error).message}`);
      return null;
    }
  }

  private async *streamCompletions(
    systemPrompt: string,
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
    productRefs: AiMatchedProduct[],
    model: string,
    temperature: number,
    signal?: AbortSignal,
    maxTokens: number = AVALAI_MAX_TOKENS,
  ): AsyncGenerator<AiStreamChunk> {
    let fullContent = "";
    try {
      const stream = await this.client.chat.completions.create(
        {
          model,
          stream: true,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
        },
        { signal: signal ?? undefined },
      );

      for await (const chunk of stream) {
        if (signal?.aborted) return;
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          yield { type: "delta", content: delta };
        }
      }
      yield { type: "done", fullContent, matchedProducts: productRefs };
    } catch (err) {
      if (signal?.aborted) return;
      this.logger.error(`AvalAI streaming error: ${(err as Error).message}`);
      if (fullContent.length > 0) {
        yield { type: "done", fullContent, matchedProducts: productRefs };
      } else {
        yield { type: "error", error: "خطا در ارتباط با سرویس هوش مصنوعی. لطفاً دوباره تلاش کنید." };
      }
    }
  }

  private dispatchTelemetry(
    lastUserMessage: string,
    totalTurnCount: number,
    sessionId: string,
  ): void {
    if (!this.kafkaProducer) return;
    const payload = {
      sessionId,
      lastUserMessage: lastUserMessage.slice(0, 500),
      totalTurnCount,
    };
    void this.kafkaProducer
      .send(TOPIC_AI_TELEMETRY, payload.sessionId, payload)
      .catch((err: Error) => {
        this.logger.warn(`Telemetry dispatch failed: ${err.message}`);
      });
  }
}
