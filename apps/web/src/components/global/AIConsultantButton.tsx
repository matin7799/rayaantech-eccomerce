/**
 * AIConsultantButton — Global AI consultation widget entry point.
 *
 * Re-exports the premium AiConsole component from the ai/ module.
 * This file is kept for backward compatibility with existing imports
 * in __root.tsx and other layout files.
 *
 * The new AiConsole features:
 * - Real-time streaming via tRPC (AvalAI RAG pipeline)
 * - Premium Liquid Glassmorphism design
 * - pgvector-matched product card rendering
 * - IP-based rate limiting with Persian 429 messages
 * - Framer Motion spring animations (stiffness: 300, damping: 25)
 * - Dual-mode: text streaming + voice visualization placeholder
 */
export { AiConsole as AIConsultantButton } from "../ai/ai-console";
