-- Migration: Add title column to ai_chat_sessions
-- Purpose: Store dynamic LLM-generated session titles from Kafka telemetry consumer

ALTER TABLE "ai_chat_sessions" ADD COLUMN "title" text;
