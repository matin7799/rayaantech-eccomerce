# Basic Model Rate Limits

This page shows the rate limits for all models available in Tier 0 (Basic).

## All Tier Rate Limits

- [Basic](en/rate-limits-tier0.md)
- [Tier 1](en/rate-limits-tier1.md)
- [Tier 2](en/rate-limits-tier2.md)
- [Tier 3](en/rate-limits-tier3.md)
- [Tier 4](en/rate-limits-tier4.md)
- [Tier 5](en/rate-limits-tier5.md)

## Tier Overview

The **Basic tier** is where every new AvalAI account starts. The moment you sign up with an email address you can call the API, and we drop a **25,000 IRT activation credit** into your account so you can start experimenting right away — no top-up required. It's the perfect place to kick the tires, learn the API, prototype small projects, or build sample apps. Limits are kept conservative on this tier so the platform stays fast and fair for everyone exploring it. When you're ready for more headroom, just verify a phone number on your account to instantly upgrade to Tier 1 — still with no top-up required.

### Qualification & Usage limits

| Tier | Qualification | Usage limits |
|-------|---------------|-------------|
| 0 | Registered with an email address (25,000 IRT activation credit included) | Up to account balance |

## Model Rate Limits

| Model | Requests Per Minute (RPM) | Tokens Per Minute (TPM) | Provider | Owner |
|-------|---------------------------|-------------------------|----------|-------|
| anthropic.claude-haiku-4-5-20251001-v1:0 | 1.0 | 40000.0 | bedrock | anthropic |
| cf.deepseek-r1-distill-qwen-32b | 1.0 | 40000.0 | cloudflare | deepseek |
| cf.embeddinggemma-300m | 3.0 | 40000.0 | cloudflare | google |
| cf.gemma-3-12b-it | 1.0 | 40000.0 | cloudflare | google |
| cf.gemma-4-26b-a4b-it | 3.0 | 5000.0 | cloudflare | google |
| cf.gemma-sea-lion-v4-27b-it | 1.0 | 40000.0 | cloudflare | meta |
| cf.glm-5.2 | 3.0 | 5000.0 | cloudflare | google |
| cf.gpt-oss-120b | 1.0 | 40000.0 | cloudflare | openai |
| cf.gpt-oss-20b | 1.0 | 40000.0 | cloudflare | openai |
| cf.granite-4.0-h-micro | 3.0 | 40000.0 | cloudflare | ibm |
| cf.kimi-k2.7-code | 3.0 | 5000.0 | cloudflare | google |
| cf.llama-3.1-8b-instruct-fast | 1.0 | 40000.0 | cloudflare | meta |
| cf.llama-3.2-1b-instruct | 1.0 | 40000.0 | cloudflare | meta |
| cf.llama-3.2-3b-instruct | 1.0 | 40000.0 | cloudflare | meta |
| cf.llama-3.3-70b-instruct-fp8-fast | 1.0 | 40000.0 | cloudflare | meta |
| cf.llama-4-scout-17b-16e-instruct | 1.0 | 40000.0 | cloudflare | meta |
| cf.llama-guard-3-8b | 1.0 | 40000.0 | cloudflare | meta |
| cf.mistral-small-3.1-24b-instruct | 1.0 | 40000.0 | cloudflare | mistral ai |
| cf.nemotron-3-120b-a12b | 1.0 | 40000.0 | cloudflare | openai |
| cf.plamo-embedding-1b | 3.0 | 40000.0 | cloudflare | pfn |
| cf.qwen2.5-coder-32b-instruct | 1.0 | 40000.0 | cloudflare | alibaba |
| cf.qwen3-30b-a3b-fp8 | 3.0 | 40000.0 | cloudflare | alibaba |
| cf.qwq-32b | 1.0 | 40000.0 | cloudflare | alibaba |
| claude-haiku-4-5 | 1.0 | 10000.0 | anthropic | anthropic |
| cohere-rerank-v4.0-fast | 3.0 | N/A | azure | cohere |
| cohere-rerank-v4.0-pro | 3.0 | N/A | azure | cohere |
| cohere.command-r-v1:0 | 3.0 | 40000.0 | bedrock | cohere |
| cohere.embed-multilingual-v3 | 3.0 | 40000.0 | bedrock | cohere |
| cohere.embed-v4:0 | 3.0 | 40000.0 | bedrock | cohere |
| cohere.rerank-v3-5:0 | 3.0 | N/A | bedrock | cohere |
| dataforseo-search | 3.0 | N/A | dataforseo | dataforseo |
| deepseek-chat | 3.0 | 40000.0 | deepseek | deepseek |
| deepseek-coder | 3.0 | 40000.0 | deepseek | deepseek |
| deepseek-reasoner | 3.0 | 40000.0 | deepseek | deepseek |
| deepseek-v3-0324 | 3.0 | 40000.0 | azure | deepseek |
| deepseek-v3.1 | 1.0 | 40000.0 | azure | deepseek |
| deepseek-v3.2 | 3.0 | 40000.0 | azure | deepseek |
| deepseek-v3.2-speciale | 3.0 | 40000.0 | azure | deepseek |
| deepseek-v4-flash | 1.0 | 40000.0 | deepseek | deepseek |
| deepseek-v4-pro | 1.0 | 40000.0 | deepseek | deepseek |
| eleven_flash_v2 | 3.0 | N/A | elevenlabs | elevenlabs |
| eleven_flash_v2_5 | 3.0 | N/A | elevenlabs | elevenlabs |
| eleven_multilingual_v2 | 3.0 | N/A | elevenlabs | elevenlabs |
| eleven_turbo_v2 | 3.0 | N/A | elevenlabs | elevenlabs |
| eleven_turbo_v2_5 | 3.0 | N/A | elevenlabs | elevenlabs |
| eleven_v3 | 3.0 | N/A | elevenlabs | elevenlabs |
| embed-v-4-0 | 3.0 | N/A | azure | cohere |
| exa_ai-search | 3.0 | N/A | exa_ai | exa_ai |
| firecrawl-search | 3.0 | N/A | firecrawl | firecrawl |
| gemini-2.5-flash | 3.0 | 40000.0 | gemini | google |
| gemini-2.5-flash-lite | 3.0 | 40000.0 | gemini | google |
| gemini-2.5-flash-lite-preview-09-2025 | 3.0 | 40000.0 | gemini | google |
| gemini-2.5-flash-preview-09-2025 | 3.0 | 40000.0 | gemini | google |
| gemini-2.5-flash-preview-tts | 1.0 | 40000.0 | gemini | google |
| gemini-2.5-flash-tts | 1.0 | 40000.0 | vertex_ai | google |
| gemini-3-flash-preview | 3.0 | 40000.0 | gemini | google |
| gemini-3.1-flash-lite | 3.0 | 40000.0 | gemini | google |
| gemini-3.1-flash-lite-preview | 3.0 | 40000.0 | gemini | google |
| gemini-3.5-flash | 1.0 | 40000.0 | gemini | google |
| gemini-embedding-001 | 3.0 | 40000.0 | gemini | google |
| gemini-embedding-2 | 3.0 | 40000.0 | gemini | google |
| gemini-flash-latest | 3.0 | 40000.0 | gemini | google |
| gemini-flash-lite-latest | 3.0 | 40000.0 | gemini | google |
| gemini-robotics-er-1.5-preview | 1.0 | 40000.0 | gemini | google |
| gemma-3-12b-it | 1.0 | 5000.0 | gemini | google |
| gemma-3-1b-it | 1.0 | 5000.0 | gemini | google |
| gemma-3-27b-it | 1.0 | 5000.0 | gemini | google |
| gemma-3-4b-it | 1.0 | 5000.0 | gemini | google |
| gemma-3n-e2b-it | 1.0 | 5000.0 | gemini | google |
| gemma-3n-e4b-it | 1.0 | 5000.0 | gemini | google |
| gemma-4-26b-a4b-it | 3.0 | 5000.0 | gemini | google |
| gemma-4-31b-it | 1.0 | 5000.0 | gemini | google |
| glm-4.6 | 3.0 | 40000.0 | zai | zai |
| glm-4.7 | 3.0 | 40000.0 | zai | zai |
| glm-4.7-flash | 3.0 | 40000.0 | zai | zai |
| glm-4.7-flashx | 3.0 | 40000.0 | zai | zai |
| glm-5 | 3.0 | 40000.0 | zai | zai |
| glm-5-turbo | 3.0 | 40000.0 | zai | zai |
| glm-5.1 | 3.0 | 40000.0 | zai | zai |
| glm-5.2 | 3.0 | 40000.0 | zai | zai |
| glm-5v-turbo | 3.0 | 40000.0 | zai | zai |
| google_pse-search | 1.0 | N/A | google_pse | google |
| gpt-4.1 | 3.0 | 40000.0 | openai | openai |
| gpt-4.1-2025-04-14 | 3.0 | 40000.0 | openai | openai |
| gpt-4.1-mini | 3.0 | 40000.0 | openai | openai |
| gpt-4.1-mini-2025-04-14 | 3.0 | 40000.0 | openai | openai |
| gpt-4.1-nano | 3.0 | 40000.0 | openai | openai |
| gpt-4.1-nano-2025-04-14 | 3.0 | 40000.0 | openai | openai |
| gpt-4o | 3.0 | 40000.0 | openai | openai |
| gpt-4o-mini | 3.0 | 40000.0 | openai | openai |
| gpt-4o-mini-2024-07-18 | 3.0 | 40000.0 | openai | openai |
| gpt-4o-mini-transcribe | 3.0 | 40000.0 | openai | openai |
| gpt-4o-transcribe | 3.0 | 40000.0 | openai | openai |
| gpt-4o-transcribe-diarize | 3.0 | 40000.0 | openai | openai |
| gpt-5-mini | 1.0 | 40000.0 | openai | openai |
| gpt-5-mini-2025-08-07 | 1.0 | 40000.0 | openai | openai |
| gpt-5-nano | 1.0 | 40000.0 | openai | openai |
| gpt-5-nano-2025-08-07 | 1.0 | 40000.0 | openai | openai |
| gpt-5.1 | 1.0 | 10000.0 | openai | openai |
| gpt-5.1-codex | 1.0 | 10000.0 | openai | openai |
| gpt-5.1-codex-max | 1.0 | 10000.0 | openai | openai |
| gpt-5.1-codex-mini | 3.0 | 10000.0 | openai | openai |
| gpt-5.2 | 1.0 | 10000.0 | openai | openai |
| gpt-5.2-2025-12-11 | 1.0 | 10000.0 | openai | openai |
| gpt-5.2-chat | 1.0 | 10000.0 | openai | openai |
| gpt-5.2-codex | 1.0 | 10000.0 | openai | openai |
| gpt-5.3-chat | 1.0 | 10000.0 | openai | openai |
| gpt-5.3-codex | 1.0 | 10000.0 | openai | openai |
| gpt-5.4 | 1.0 | 10000.0 | openai | openai |
| gpt-5.4-mini | 3.0 | 10000.0 | openai | openai |
| gpt-5.4-nano | 3.0 | 10000.0 | openai | openai |
| gpt-5.5 | 1.0 | 10000.0 | openai | openai |
| gpt-audio-mini | 1.0 | 10000.0 | openai | openai |
| gpt-audio-mini-2025-10-06 | 1.0 | 10000.0 | openai | openai |
| gpt-oss-120b | 1.0 | 40000.0 | azure | openai |
| grok-3 | 3.0 | 40000.0 | xai | xai |
| grok-3-beta | 3.0 | 40000.0 | xai | xai |
| grok-3-fast-latest | 3.0 | 40000.0 | xai | xai |
| grok-3-latest | 3.0 | 40000.0 | xai | xai |
| grok-3-mini | 3.0 | 40000.0 | xai | xai |
| grok-3-mini-beta | 3.0 | 40000.0 | xai | xai |
| grok-3-mini-fast | 3.0 | 40000.0 | xai | xai |
| grok-3-mini-fast-latest | 3.0 | 40000.0 | xai | xai |
| grok-3-mini-latest | 3.0 | 40000.0 | xai | xai |
| grok-4-1-fast-non-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4-1-fast-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4-fast-non-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4-fast-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4.20-beta-0309-non-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4.20-beta-0309-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4.20-non-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4.20-reasoning | 1.0 | 40000.0 | xai | xai |
| grok-4.3 | 1.0 | 40000.0 | xai | xai |
| grok-code-fast-1 | 3.0 | 40000.0 | xai | xai |
| groq.gpt-oss-120b | 1.0 | 10000.0 | groq | openai |
| groq.gpt-oss-20b | 1.0 | 10000.0 | groq | openai |
| groq.gpt-oss-safeguard-20b | 1.0 | 10000.0 | groq | openai |
| groq.kimi-k2-instruct-0905 | 1.0 | 10000.0 | groq | moonshot |
| groq.llama-4-maverick-17b-128e-instruct | 1.0 | 10000.0 | groq | meta |
| groq.llama-4-scout-17b-16e-instruct | 1.0 | 10000.0 | groq | meta |
| groq.llama-guard-4-12b | 1.0 | 10000.0 | groq | meta |
| groq.llama-prompt-guard-2-22m | 3.0 | 40000.0 | groq | meta |
| groq.llama-prompt-guard-2-86m | 3.0 | 40000.0 | groq | meta |
| groq.playai-tts | 1.0 | 5000.0 | groq | play ai |
| groq.playai-tts-arabic | 1.0 | 5000.0 | groq | play ai |
| groq.qwen3-32b | 1.0 | 10000.0 | groq | alibaba |
| groq.whisper-large-v3 | 1.0 | 10000.0 | groq | openai |
| groq.whisper-large-v3-turbo | 1.0 | 10000.0 | groq | openai |
| imagen-3.0-fast-generate-001 | 1.0 | N/A | vertex_ai | google |
| imagen-3.0-generate-001 | 1.0 | N/A | vertex_ai | google |
| imagen-3.0-generate-002 | 1.0 | N/A | vertex_ai | google |
| kimi-k2-0711-preview | 3.0 | 40000.0 | moonshot | moonshot |
| kimi-k2-thinking | 1.0 | 40000.0 | moonshot | moonshot |
| kimi-k2.5 | 3.0 | 40000.0 | moonshot | moonshot |
| kimi-k2.6 | 3.0 | 40000.0 | moonshot | moonshot |
| kimi-k2.7-code | 3.0 | 40000.0 | moonshot | moonshot |
| kimi-k2.7-code-highspeed | 3.0 | 40000.0 | moonshot | moonshot |
| kimi-latest | 3.0 | 40000.0 | moonshot | moonshot |
| llama-4-scout-17b-16e-instruct | 3.0 | 40000.0 | together_ai | meta |
| meta.llama3-1-8b-instruct-v1:0 | 3.0 | 40000.0 | bedrock | meta |
| minimax-m2 | 3.0 | 40000.0 | minimax | minimax |
| minimax-m2.1 | 1.0 | 40000.0 | minimax | minimax |
| minimax-m2.1-lightning | 1.0 | 40000.0 | minimax | minimax |
| minimax-m2.5 | 1.0 | 40000.0 | minimax | minimax |
| minimax-m2.5-lightning | 1.0 | 40000.0 | minimax | minimax |
| minimax-m2.7 | 1.0 | 40000.0 | minimax | minimax |
| minimax-m2.7-highspeed | 1.0 | 40000.0 | minimax | minimax |
| minimax-m3 | 1.0 | 40000.0 | minimax | minimax |
| mistral-large-3 | 1.0 | 10000.0 | azure | mistral ai |
| mistral-ocr-2503 | 1.0 | N/A | azure | mistral ai |
| mistral-ocr-2505 | 1.0 | N/A | azure | mistral ai |
| mistral-ocr-2512 | 1.0 | N/A | azure | mistral ai |
| mistral-ocr-latest | 1.0 | N/A | azure | mistral ai |
| mistral-small-2503 | 3.0 | 40000.0 | vertex_ai | google |
| moonshot-v1-128k | 3.0 | 40000.0 | moonshot | moonshot |
| moonshot-v1-128k-vision-preview | 3.0 | 40000.0 | moonshot | moonshot |
| moonshot-v1-32k | 3.0 | 40000.0 | moonshot | moonshot |
| moonshot-v1-32k-vision-preview | 3.0 | 40000.0 | moonshot | moonshot |
| moonshot-v1-8k | 3.0 | 40000.0 | moonshot | moonshot |
| moonshot-v1-8k-vision-preview | 3.0 | 40000.0 | moonshot | moonshot |
| moonshot-v1-auto | 3.0 | 40000.0 | moonshot | moonshot |
| nemotron-3-ultra | 3.0 | 40000.0 | fireworks_ai | nvidia |
| nvidia_nim.bge-m3 | 3.0 | 10000.0 | nvidia_nim | baai |
| nvidia_nim.gpt-oss-120b | 3.0 | 10000.0 | nvidia_nim | openai |
| nvidia_nim.gpt-oss-20b | 3.0 | 10000.0 | nvidia_nim | openai |
| nvidia_nim.llama-3.3-nemotron-super-49b-v1.5 | 3.0 | 10000.0 | nvidia_nim | nvidia |
| nvidia_nim.nemotron-nano-12b-v2-vl | 3.0 | 10000.0 | nvidia_nim | nvidia |
| nvidia_nim.nemotron-parse | 3.0 | 10000.0 | nvidia_nim | nvidia |
| nvidia_nim.nv-embed-v1 | 3.0 | 10000.0 | nvidia_nim | nvidia |
| nvidia_nim.nv-embedqa-e5-v5 | 3.0 | 10000.0 | nvidia_nim | nvidia |
| omni-moderation-2024-09-26 | 3.0 | 10000.0 | openai | openai |
| omni-moderation-latest | 3.0 | 10000.0 | openai | openai |
| openai.gpt-oss-120b-1:0 | 1.0 | 40000.0 | bedrock | openai |
| openai.gpt-oss-20b-1:0 | 1.0 | 40000.0 | bedrock | openai |
| parallel_ai-search | 3.0 | N/A | parallel_ai | parallel_ai |
| parallel_ai-search-pro | 3.0 | N/A | parallel_ai | parallel_ai |
| perplexity-search | 3.0 | N/A | perplexity | perplexity |
| qwen-flash | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-flash-2025-07-28 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-image | 1.0 | N/A | dashscope | alibaba |
| qwen-image-edit | 1.0 | N/A | dashscope | alibaba |
| qwen-mt-flash | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-mt-lite | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-mt-plus | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-mt-turbo | 3.0 | 40000.0 | dashscope | alibaba |
| qwen-plus | 3.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-2025-04-28 | 3.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-2025-07-14 | 3.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-2025-07-28 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-2025-09-11 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-2025-12-01 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-character | 1.0 | 40000.0 | dashscope | alibaba |
| qwen-plus-latest | 3.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-14b-instruct | 3.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-14b-instruct-1m | 3.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-32b-instruct | 3.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-72b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-7b-instruct | 3.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-7b-instruct-1m | 3.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-vl-32b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-vl-3b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-vl-72b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen2.5-vl-7b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-0.6b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-1.7b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-14b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-235b-a22b | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-235b-a22b-instruct-2507 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-235b-a22b-thinking-2507 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-30b-a3b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-30b-a3b-instruct-2507 | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-30b-a3b-thinking-2507 | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-32b | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-4b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-8b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-480b-a35b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-flash | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-flash-2025-07-28 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-next | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-plus | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-plus-2025-07-22 | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-coder-plus-2025-09-23 | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-max | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-max-2025-09-23 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-max-2026-01-23 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-max-preview | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-next-80b-a3b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-next-80b-a3b-thinking | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-rerank | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3-vl-32b-instruct | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-vl-flash | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-vl-flash-2025-10-15 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-vl-flash-2026-01-22 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-vl-plus | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3-vl-plus-2025-12-19 | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.5-122b-a10b | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.5-27b | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.5-35b-a3b | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.5-397b-a17b | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.5-flash | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.5-plus | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.6-27b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3.6-35b-a3b | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3.6-flash | 3.0 | 40000.0 | dashscope | alibaba |
| qwen3.6-max-preview | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.6-plus | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.7-max | 1.0 | 40000.0 | dashscope | alibaba |
| qwen3.7-plus | 1.0 | 40000.0 | dashscope | alibaba |
| qwq-32b | 1.0 | 40000.0 | together_ai | alibaba |
| qwq-plus | 3.0 | 40000.0 | dashscope | alibaba |
| qwq-plus-2025-03-05 | 3.0 | 40000.0 | dashscope | alibaba |
| runwayml.eleven_multilingual_v2 | 1.0 | 10000.0 | runwayml | runwayml |
| scribe_v1 | 3.0 | N/A | elevenlabs | elevenlabs |
| scribe_v2 | 3.0 | N/A | elevenlabs | elevenlabs |
| semantic-ranker-default-004 | 3.0 | N/A | vertex_ai | google |
| semantic-ranker-fast-004 | 3.0 | N/A | vertex_ai | google |
| serper-search | 3.0 | N/A | serper | serper |
| sonar | 3.0 | 40000.0 | perplexity | perplexity |
| sonar-deep-research | 3.0 | 40000.0 | perplexity | perplexity |
| sonar-pro | 3.0 | 40000.0 | perplexity | perplexity |
| sonar-reasoning | 3.0 | 40000.0 | perplexity | perplexity |
| sonar-reasoning-pro | 3.0 | 40000.0 | perplexity | perplexity |
| tavily-search | 3.0 | N/A | tavily | tavily |
| tavily-search-advanced | 3.0 | N/A | tavily | tavily |
| text-embedding-3-large | 3.0 | 40000.0 | openai | openai |
| text-embedding-3-small | 3.0 | 40000.0 | openai | openai |
| text-embedding-ada-002 | 3.0 | 40000.0 | openai | openai |
| text-embedding-v3 | 3.0 | 40000.0 | dashscope | alibaba |
| text-embedding-v4 | 3.0 | 40000.0 | dashscope | alibaba |
| tongyi-embedding-vision-flash | 3.0 | 40000.0 | dashscope | alibaba |
| tongyi-embedding-vision-plus | 3.0 | 40000.0 | dashscope | alibaba |
| tts-1 | 3.0 | 200.0 | openai | openai |
| whisper-1 | 3.0 | None | openai | openai |

## Model Availability

Tier 0 (Basic) provides access to 293 models.

## All Tier Rate Limits

- [Tier 0 ](en/rate-limits-tier0.md)
- [Tier 1 ](en/rate-limits-tier1.md)
- [Tier 2 ](en/rate-limits-tier2.md)
- [Tier 3 ](en/rate-limits-tier3.md)
- [Tier 4 ](en/rate-limits-tier4.md)
- [Tier 5 ](en/rate-limits-tier5.md)

## Related Resources

- [Rate Limit Management](en/guides/rate-limits.md)
- [Model Details](en/models/model-details.md)
- [Pricing](en/pricing.md)