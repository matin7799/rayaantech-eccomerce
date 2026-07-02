import { Module } from "@nestjs/common";
import { VoiceAiFirewallGuard } from "./guards/voice-ai-firewall.guard";
import { MarketingIntentListener } from "./listeners/marketing-intent.listener";
import { VoiceAiGateway } from "./voice-ai.gateway";
import { VoiceAiService } from "./voice-ai.service";
import { VoiceAiSessionController } from "./voice-ai-session.controller";

/**
 * Voice AI module providing real-time conversational AI capabilities
 * with dual modality, tiered rate limiting, and marketing intelligence.
 *
 * Components:
 * - VoiceAiGateway: WebSocket gateway (/voice-ai namespace), dual modality (text+audio)
 * - VoiceAiService: RAG pipeline (normalization → embedding → pgvector → grounded LLM)
 * - VoiceAiFirewallGuard: Tiered Redis rate limiter (auth: 10/min, guest: 3 total)
 * - VoiceAiSessionController: HTTP endpoints for session merge (guest→user re-parenting)
 * - MarketingIntentListener: Non-blocking event listener for marketing data offloading
 *
 * Dependencies (from global modules):
 * - RedisModule (provides REDIS_CLIENT for rate limiting + guest key management)
 * - DatabaseModule (provides DRIZZLE_CLIENT for session/message persistence + pgvector)
 * - ConfigModule (provides OPENAI_API_KEY)
 * - EventEmitterModule (provides EventEmitter2 for marketing events)
 *
 * WebSocket namespace: /voice-ai
 * HTTP endpoints: /api/v1/voice-ai/session/*
 */
@Module({
  controllers: [VoiceAiSessionController],
  providers: [VoiceAiGateway, VoiceAiService, VoiceAiFirewallGuard, MarketingIntentListener],
  exports: [VoiceAiService],
})
export class VoiceAiModule {}
