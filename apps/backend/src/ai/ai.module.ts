import { Module } from "@nestjs/common";
import { AvalAiService } from "./avalai.service";
import { AvalAiIntentParser } from "./avalai-intent.parser";
import { AvalAiProductRepository } from "./avalai-product.repository";
import { AiFirewallGuard } from "./guards/ai-firewall.guard";
import { ModelSelectionService } from "./model-selection.service";
import { QueryRewriterService } from "./query-rewriter.service";
import { RejectionDetectorService } from "./rejection-detector.service";

/**
 * AI Consultation Module — AvalAI-powered RAG pipeline with dual-model routing.
 *
 * Provides:
 * - AvalAiService: Full RAG streaming pipeline (embed → pgvector → grounded LLM)
 * - ModelSelectionService: O(1) intent tier classifier (SIMPLE_TRANSIENT | DEEP_CONSULTATION)
 * - RejectionDetectorService: O(1) regex pivot signal detector for conversational context-unlock
 * - AiFirewallGuard: IP-based distributed rate limiter (init/msg/session tiers)
 *
 * Dependencies (from global modules):
 * - RedisModule (provides REDIS_CLIENT for rate limiting)
 * - DatabaseModule (provides DRIZZLE_CLIENT for pgvector search)
 * - ConfigModule (provides AVALAI_API_KEY, AVALAI_BASE_URL)
 *
 * Usage:
 * - Injected into tRPC AI router for streaming consultation
 * - AiFirewallGuard used as a route guard on the tRPC handler
 */
@Module({
  providers: [
    AvalAiService,
    AiFirewallGuard,
    AvalAiProductRepository,
    AvalAiIntentParser,
    ModelSelectionService,
    QueryRewriterService,
    RejectionDetectorService,
  ],
  exports: [
    AvalAiService,
    AiFirewallGuard,
    ModelSelectionService,
    QueryRewriterService,
    RejectionDetectorService,
  ],
})
export class AiModule {}
