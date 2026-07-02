# Deprecated Models

This page contains information about models that have been deprecated by their respective providers and are no longer available through AvalAI.

## Overview

When AI model providers deprecate models, they are no longer available for new requests. This page serves as a comprehensive reference for deprecated models and provides guidance on migration to supported alternatives.


## Important Note on Model Naming

> **Best Practice:** Always use stable model namespaces when they become available. When a preview model is first introduced (e.g., `gemini-2.5-flash-image-preview`), it may later be released as a stable version (e.g., `gemini-2.5-flash-image`). In such cases, it is strongly advised to migrate to the non-preview, stable version as soon as possible to ensure continued support and optimal performance.

## Upcoming Deprecations

### Groq PlayAI TTS Models (Deprecated: December 31, 2025)

Groq has deprecated the **PlayAI TTS** models. These models are no longer available:

- **groq.playai-tts** - PlayAI Text-to-Speech model
- **groq.playai-tts-arabic** - PlayAI Arabic Text-to-Speech model

**Important:** Requests using these models will fail. Please migrate immediately.

**Migration Path:** Please migrate to alternative TTS models available through AvalAI.

### Gemini 2.5 TTS Preview Models (Update Date: December 10, 2025)

Google has announced that the **Gemini Text-to-Speech (TTS) preview models** will be updated in place effective **December 10, 2025**.

**Models Affected:**
- **gemini-2.5-flash-preview-tts**
- **gemini-2.5-pro-preview-tts**

**What's Changing:** Starting on this date, these models will automatically receive significant improvements in expressivity, pacing, and overall audio quality. The new models maintain many characteristics of the previous version to ensure a seamless transition.

**Action Required:** No action is required. No code changes needed - your existing API calls will automatically begin using the updated model.

### Alibaba Qwen Legacy Snapshot Models (Deprecation Date: May 13–31, 2026)

The Bailian Large Model Service Platform (Alibaba DashScope) will be decommissioning several historical snapshot model families. The decommissioning process begins at **00:00:00 (UTC+8) on May 13, 2026** and will be fully completed by **May 31, 2026**.

During this window, API calls to these models may experience timeouts, failures, or no response. We strongly recommend completing migration before May 13, 2026 to avoid service disruption.

**Models Affected (all variants: base alias, `-latest`, and dated snapshots):**

- **qwen-max series** - `qwen-max`, `qwen-max-latest`, `qwen-max-2025-01-25`
- **qwen-turbo series** - `qwen-turbo`, `qwen-turbo-latest`, `qwen-turbo-2025-04-28`
- **qwen-vl-max series** - `qwen-vl-max`, `qwen-vl-max-latest`, `qwen-vl-max-2025-04-08`
- **qwen-vl-plus series** - `qwen-vl-plus`, `qwen-vl-plus-latest`, `qwen-vl-plus-2025-05-07`
- **qvq-max series** - `qvq-max`, `qvq-max-latest`, `qvq-max-2025-03-25`

**Migration Path:** Please migrate to the latest models in the Qwen3.6 series:
- **qwen3.6-plus** - Flagship 1M-context model with SOTA agentic coding and multimodal capabilities (replaces `qwen-max` series)
- **qwen3.6-flash** - Fast, cost-effective replacement for `qwen-turbo` series
- **qwen3.6-max-preview** - 1T+ parameter premium model for the most demanding tasks
- **qwen3-vl-plus** / **qwen3-vl-flash** - Modern vision-language replacements for `qwen-vl-max`, `qwen-vl-plus`, and `qvq-max` series

For details on the replacement models, see the [Alibaba Models page](en/providers/alibaba.md).

### DeepSeek Chat & Reasoner Models (Deprecation Date: July 24, 2026)

DeepSeek has announced that the legacy model aliases `deepseek-chat` and `deepseek-reasoner` will be fully retired on **July 24, 2026, 15:59 (UTC)**. For compatibility, these model names are now routed to the new DeepSeek V4 flagship family: `deepseek-chat` → `deepseek-v4-flash` (non-thinking mode) and `deepseek-reasoner` → `deepseek-v4-pro` (thinking mode).

**Models Affected:**
- **deepseek-chat** - Legacy alias, now routes to `deepseek-v4-flash` (pricing unchanged)
- **deepseek-reasoner** - Legacy alias, now routes to `deepseek-v4-pro` (pricing raised to match `deepseek-v4-pro`)

**Migration Path:** Please migrate to the explicit DeepSeek V4 models before July 24, 2026:
- **deepseek-v4-flash** - Recommended replacement for `deepseek-chat` (fast, economical flagship with 1M context, supports both thinking and non-thinking modes)
- **deepseek-v4-pro** - Recommended replacement for `deepseek-reasoner` (most capable flagship with open-source SOTA Agentic Coding, 1M context, thinking mode by default)

### Gemini 2.5 Flash Image Preview (Deprecation Date: January 15, 2026)

Google has announced that **Gemini 2.5 Flash Image Preview** (`gemini-2.5-flash-image-preview`) in the Gemini API will be discontinued on **January 15, 2026**.

**Migration Path:** Please migrate to the following generally available model for improved performance and capabilities:
- **gemini-2.5-flash-image** - Stable version of Gemini 2.5 Flash image generation

### Gemini 3 Pro Preview (`gemini-3-pro-preview`) (Deprecation Date: March 9, 2026)

Google has deprecated **Gemini 3 Pro Preview** (`gemini-3-pro-preview`) on Gemini API and Google AI Studio (AIS), effective **March 9, 2026**.

**Deprecated Model:**
- **gemini-3-pro-preview** - Gemini 3 Pro Preview model

**Key Changes and Timelines:**
- **March 6, 2026:** If you are using the `-latest` alias, it switched to Gemini 3.1 Pro Preview (`gemini-3.1-pro-preview`).
- **March 9, 2026:** Gemini 3 Pro Preview was discontinued in favor of Gemini 3.1 Pro Preview.

**Migration Path:** Please migrate to the following model to avoid service disruption:
- **gemini-3.1-pro-preview** - Latest Gemini Pro Preview model

### Gemini 2.5 Flash Lite Preview 09-2025 (Deprecation Date: March 31, 2026)

Google has announced that **Gemini 2.5 Flash Lite Preview 09-2025** will be discontinued on Gemini API and Google AI Studio (AIS) effective **March 31, 2026**. Please note that this deprecation only applies to AI Studio and the Gemini API; the model is not being discontinued on Vertex AI.

**Key Changes starting March 31, 2026:**
- Gemini 2.5 Flash Lite Preview 09-2025 will be discontinued in favor of Gemini 3.1 Flash Lite Preview.
- The `-latest` alias will automatically point to Gemini 3.1 Flash Lite Preview (`gemini-3.1-flash-lite-preview`).

**Migration Path:** Please migrate to the following model:
- **gemini-3.1-flash-lite-preview** - Latest Gemini Flash Lite Preview model

### Anthropic Claude 4 Models (Deprecation Date: June 15, 2026)

Anthropic has announced that the following Claude 4 models will be deprecated on **June 15, 2026**:

**Models Affected:**
- **anthropic.claude-sonnet-4-20250514-v1:0** - Claude Sonnet 4 (May 14, 2025 version)
- **anthropic.claude-opus-4-20250514-v1:0** - Claude Opus 4 (May 14, 2025 version)

**Migration Path:** Please migrate to the latest Claude models before June 15, 2026:
- **claude-sonnet-4-6** - Latest Claude Sonnet model
- **claude-opus-4-6** - Latest Claude Opus model

### Gemini 2.0 Flash & Flash Lite (Deprecation Date: June 1, 2026)

Google has announced that the following GA models will be discontinued on Gemini API and Google AI Studio (AIS) on **June 1, 2026**:

| Model | Endpoint ID | Required Action |
|-------|-------------|-----------------|
| Gemini 2.0 Flash | `gemini-2.0-flash`, `gemini-2.0-flash-001` | Migrate to a supported Gemini model (e.g., 2.5 Flash, 2.5 Flash Lite) |
| Gemini 2.0 Flash Lite | `gemini-2.0-flash-lite`, `gemini-2.0-flash-lite-001` | Migrate to a supported Gemini model (e.g., 2.5 Flash Lite) |

**Migration Path:** Please migrate to the following models:
- **gemini-2.5-flash** - Recommended replacement for Gemini 2.0 Flash
- **gemini-2.5-flash-lite** - Recommended replacement for Gemini 2.0 Flash Lite

### Imagen 4 Models (Discontinuation Date: August 17, 2026)

Google has announced that the following **Imagen 4** model endpoints will be discontinued on **August 17, 2026**:

- **imagen-4.0-generate-001** - Imagen 4 Standard
- **imagen-4.0-ultra-generate-001** - Imagen 4 Ultra
- **imagen-4.0-fast-generate-001** - Imagen 4 Fast

**Important:** After the discontinuation date, any API calls sent to these legacy endpoints will fail and return a `404 - Not Found` error. The newer Gemini image generation models provide higher capabilities and better performance at the same cost.

**Recommended Migration Paths:**

| Endpoint to be discontinued | Recommended migration path |
|-----------------------------|----------------------------|
| `imagen-4.0-generate-001` | `gemini-3.1-flash-image` |
| `imagen-4.0-ultra-generate-001` | `gemini-3.1-flash-image` |
| `imagen-4.0-fast-generate-001` | `gemini-3.1-flash-image` |

**Action Required:** To avoid service disruptions, you must update your code to reference the new model IDs before **August 17, 2026**:

1. Review your current implementation to identify any calls to the legacy endpoints listed above.
2. Update your API requests to point to the new Gemini 3.1 Flash Image model (`gemini-3.1-flash-image`).
3. Test your integration with the new model to ensure a seamless transition for your users.

### OpenAI GPT-5 & o3 Model Snapshots (Announced: June 11, 2026)

On **June 11, 2026**, OpenAI notified developers that older GPT-5 and o3 model snapshots will be deprecated and removed from the API on **December 11, 2026**.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| Dec 11, 2026 | `gpt-5-2025-08-07` | `gpt-5.5` |
| Dec 11, 2026 | `gpt-5-mini-2025-08-07` | `gpt-5.4-mini` |
| Dec 11, 2026 | `gpt-5-nano-2025-08-07` | `gpt-5.4-nano` |
| Dec 11, 2026 | `gpt-5-pro-2025-10-06` | `gpt-5.5-pro` |
| Dec 11, 2026 | `o3-2025-04-16` | `gpt-5.5` |
| Dec 11, 2026 | `o3-pro-2025-06-10` | `gpt-5.5-pro` |

### OpenAI GPT Image Models (Announced: June 2, 2026)

On **June 2, 2026**, OpenAI notified developers that older GPT Image models will be deprecated and removed from the API on **December 1, 2026**.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| Dec 1, 2026 | `gpt-image-1-mini` | `gpt-image-2` |
| Dec 1, 2026 | `gpt-image-1.5` | `gpt-image-2` |
| Dec 1, 2026 | `chatgpt-image-latest` | `gpt-image-2` |

For implementation examples, see [Generate Images with GPT Image](en/examples/generate_images_with_gpt_image.md).

### OpenAI GPT-5.2 & GPT-5.3 Chat Snapshots (Announced: May 8, 2026)

On **May 8, 2026**, OpenAI notified developers that the `gpt-5.2-chat-latest` and `gpt-5.3-chat-latest` model snapshots will be deprecated and removed from the API on **August 10, 2026**.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| Aug 10, 2026 | `gpt-5.2-chat-latest` | `gpt-5.5` |
| Aug 10, 2026 | `gpt-5.3-chat-latest` | `gpt-5.5` |

### OpenAI Legacy GPT Model Snapshots (Announced: April 22, 2026)

On **April 22, 2026**, OpenAI announced the deprecation of a set of older models to improve reliability. Access to these models will be shut down on the dates below.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| 2026-07-23 | `computer-use-preview-2025-03-11`, `computer-use-preview` | `gpt-5.4-mini` |
| 2026-07-23 | `gpt-4o-mini-search-preview-2025-03-11` | `gpt-5.4-mini` |
| 2026-07-23 | `gpt-4o-mini-tts-2025-03-20` | `gpt-4o-mini-tts-2025-12-15` |
| 2026-07-23 | `gpt-4o-search-preview-2025-03-11` | `gpt-5.4-mini` |
| 2026-07-23 | `gpt-5-chat-latest` | `gpt-5.5` |
| 2026-07-23 | `gpt-5-codex` | `gpt-5.5` |
| 2026-07-23 | `gpt-5.1-chat-latest` | `gpt-5.5` |
| 2026-07-23 | `gpt-5.1-codex` | `gpt-5.5` |
| 2026-07-23 | `gpt-5.1-codex-max` | `gpt-5.5` |
| 2026-07-23 | `gpt-5.1-codex-mini` | `gpt-5.4-mini` |
| 2026-07-23 | `gpt-audio-mini-2025-10-06` | `gpt-audio-1.5` |
| 2026-07-23 | `gpt-realtime-mini-2025-10-06` | `gpt-realtime-mini` |
| 2026-07-23 | `o3-deep-research-2025-06-26`, `o3-deep-research` | `gpt-5.5-pro` |
| 2026-07-23 | `o4-mini-deep-research-2025-06-26`, `o4-mini-deep-research` | `gpt-5.5-pro` |
| 2026-07-23 | `gpt-5.2-codex` | `gpt-5.5` |
| 2026-10-23 | `gpt-3.5-turbo-0125`, `gpt-3.5-turbo` | `gpt-5.4-mini` |
| 2026-10-23 | `gpt-4-0613`, `gpt-4` | `gpt-5.5` |
| 2026-10-23 | `gpt-4-1106-preview` | `gpt-5.5` |
| 2026-10-23 | `gpt-4-turbo`, `gpt-4-turbo-2024-04-09` | `gpt-5.5` |
| 2026-10-23 | `gpt-4.1-nano`, `gpt-4.1-nano-2025-04-14` | `gpt-5.4-nano` |
| 2026-10-23 | `gpt-4o-2024-05-13` | `gpt-5.5` |
| 2026-10-23 | `gpt-image-1` | `gpt-image-2` |
| 2026-10-23 | `o1-2024-12-17`, `o1` | `gpt-5.5` |
| 2026-10-23 | `o1-pro-2025-03-19`, `o1-pro` | `gpt-5.5-pro` |
| 2026-10-23 | `o3-mini-2025-01-31`, `o3-mini` | `gpt-5.5` |
| 2026-10-23 | `o4-mini-2025-04-16`, `o4-mini` | `gpt-5.4-mini` |

### OpenAI Sora 2 Video Models & Videos API (Announced: March 24, 2026)

On **March 24, 2026**, OpenAI notified developers that the Videos API and Sora 2 video generation model aliases and snapshots will be deprecated and removed from the API on **September 24, 2026**.

| Shutdown date | Deprecated model / system | Recommended replacement |
|---------------|---------------------------|-------------------------|
| 2026-09-24 | Videos API | — |
| 2026-09-24 | `sora-2` | — |
| 2026-09-24 | `sora-2-pro` | — |
| 2026-09-24 | `sora-2-2025-10-06` | — |
| 2026-09-24 | `sora-2-2025-12-08` | — |
| 2026-09-24 | `sora-2-pro-2025-10-06` | — |

### OpenAI DALL·E Model Snapshots (Announced: November 14, 2025)

On **November 14, 2025**, OpenAI notified developers that DALL·E model snapshots will be deprecated and removed from the API on **May 12, 2026**.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| 2026-05-12 | `dall-e-2` | `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` |
| 2026-05-12 | `dall-e-3` | `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` |

### OpenAI Legacy GPT Model Snapshots (Announced: September 26, 2025)

On **September 26, 2025**, OpenAI announced the deprecation of a set of older models with declining usage. Access to these models will be shut down on the dates below.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| 2026-03-26 | `gpt-4-0314` | `gpt-5` or `gpt-4.1` |
| 2026-03-26 | `gpt-4-1106-preview` | `gpt-5` or `gpt-4.1` |
| 2026-03-26 | `gpt-4-0125-preview` (incl. `gpt-4-turbo-preview`) | `gpt-5` or `gpt-4.1` |
| 2026-09-28 | `gpt-3.5-turbo-instruct` | `gpt-5.4-mini` or `gpt-5-mini` |
| 2026-09-28 | `babbage-002` | `gpt-5.4-mini` or `gpt-5-mini` |
| 2026-09-28 | `davinci-002` | `gpt-5.4-mini` or `gpt-5-mini` |
| 2026-09-28 | `gpt-3.5-turbo-1106` | `gpt-5.4-mini` or `gpt-5-mini` |

### OpenAI GPT-4o Realtime & Audio Preview Models (Announced: September 15, 2025)

In **September 2025**, OpenAI notified developers that the `gpt-4o-realtime-preview` and related audio preview models will be deprecated and removed from the API on **May 7, 2026**.

| Shutdown date | Deprecated model | Recommended replacement |
|---------------|------------------|-------------------------|
| 2026-05-07 | `gpt-4o-realtime-preview` | `gpt-realtime-1.5` |
| 2026-05-07 | `gpt-4o-realtime-preview-2025-06-03` | `gpt-realtime-1.5` |
| 2026-05-07 | `gpt-4o-realtime-preview-2024-12-17` | `gpt-realtime-1.5` |
| 2026-05-07 | `gpt-4o-mini-realtime-preview` | `gpt-realtime-mini` |
| 2026-05-07 | `gpt-4o-audio-preview` | `gpt-audio-1.5` |
| 2026-05-07 | `gpt-4o-mini-audio-preview` | `gpt-audio-mini` |

## Currently Deprecated Models

### Google Programmable Search Engine (google_pse-search) (Deprecated: April 2026)

Google has deprecated the **Programmable Search Engine (PSE)** integration, previously available as `google_pse-search`. This service has been discontinued by Google in favor of their AI-powered search capabilities built into Gemini models.

**Deprecated Feature:**
- **google_pse-search** - Google Programmable Search Engine integration

**Migration Path:** Please migrate to Gemini AI-based search tools, which offer superior capabilities:
- **Gemini models with `google_search` tool** - Built-in AI-powered search in Gemini 3 Flash, Gemini 3.1 Pro, and Gemini 2.5 Pro models
- **Native search models** - Use OpenAI's `gpt-4o-search-preview` or `gpt-4o-mini-search-preview`

For detailed implementation examples, see our [Web Search Capabilities Guide](en/examples/web_search_capabilities.md).

### Mistral Codestral Models (Deprecated: 2026-06-03)

The following Mistral Codestral model has been deprecated:

- **codestral-2501** - Legacy Codestral code generation model (January 2025 snapshot)

**Migration Path:** Use the latest supported Mistral coding models:
- **codestral-latest** - Latest Codestral model for code generation and completion

### Cloudflare Workers AI Models (Deprecated: 2026-06-03)

The following Cloudflare Workers AI models have been deprecated and are no longer available:

- **cf.qwen3-embedding-0.6b** - Qwen3 0.6B embedding model
- **cf.meta-llama-3-8b-instruct** - Meta Llama 3 8B Instruct model
- **cf.llama-3.1-8b-instruct-awq** - Llama 3.1 8B Instruct (AWQ quantized)
- **cf.llama-3.1-8b-instruct-fp8** - Llama 3.1 8B Instruct (FP8 quantized)
- **cf.llama-3.1-8b-instruct** - Llama 3.1 8B Instruct model
- **cf.llama-3-8b-instruct-awq** - Llama 3 8B Instruct (AWQ quantized)
- **cf.llama-3-8b-instruct** - Llama 3 8B Instruct model
- **cf.gemma-7b-it-lora** - Gemma 7B Instruct (LoRA)
- **cf.gemma-2b-it-lora** - Gemma 2B Instruct (LoRA)
- **cf.gemma-7b-it** - Gemma 7B Instruct model
- **cf.llama-3.1-70b-instruct** - Llama 3.1 70B Instruct model

**Migration Path:** Use currently supported models for chat, embeddings, and code generation available through AvalAI.

### Google Gemini Preview & Experimental Models (Deprecated: 2025-11-18)

Google has deprecated the following preview and experimental Gemini models. Users should migrate to currently supported Gemini models, including [`gemini-3.1-pro-preview`](en/providers/google.md) for advanced reasoning tasks.

**Deprecated Models:**

- **gemini-2.0-flash-exp**
- **gemini-2.0-flash-lite-preview**
- **gemini-2.0-flash-lite-preview-02-05**
- **gemini-2.0-flash-thinking-exp**
- **gemini-2.0-flash-thinking-exp-01-21**
- **gemini-2.0-flash-thinking-exp-1219**
- **gemini-2.5-flash-lite-preview-06-17**
- **gemini-2.5-flash-preview-05-20**
- **gemini-2.5-pro-preview-06-05**
- **gemini-2.5-pro-preview-03-25**
- **gemini-2.5-pro-preview-05-06**
- **gemini-3-pro-preview**

**Migration Path:** Use currently supported models:
- **gemini-3.1-pro-preview** - Latest Gemini Pro Preview model for advanced reasoning tasks
- **gemini-2.5-pro** - Stable Gemini Pro model
- **gemini-2.5-flash** - Stable Gemini Flash model
- **gemini-2.5-flash-preview-09-2025** - Gemini Flash preview (September 2025)
- **gemini-2.5-flash-lite** - Gemini Flash Lite model
- **gemini-2.5-flash-lite-preview-09-2025** - Gemini Flash Lite preview (September 2025)

For more information, see our [announcement](en/news/2025-11-18-new-models-gemini-3-pro-kimi-k2-thinking.md).

### Google Gemini Image & Embedding Models (Deprecated: 2025-10-28)

The following Google Gemini image and embedding models have been deprecated:

#### Image Generation Models
- **gemini-2.5-flash-image-preview** - Preview version of Gemini 2.5 Flash image generation model

**Migration Path:** Use currently supported models:
- **gemini-2.5-flash-image** - Stable version of Gemini 2.5 Flash image generation

#### Embedding Models
- **embedding-001** - Legacy embedding model
- **embedding-gecko-001** - Legacy Gecko embedding model
- **gemini-embedding-exp-03-07** - March 7 experimental embedding model
- **gemini-embedding-exp** - Experimental embedding model

**Migration Path:** Use currently supported embedding models:
- **text-embedding-004** - Latest text embedding model
- **text-multilingual-embedding-002** - Multilingual embedding model

### BytePlus Seedream Models (Deprecated: 2026-05-06)

The following BytePlus Seedream image generation models have been deprecated:

- **seedream-4-0-250828** - Legacy Seedream 4.0 image generation and editing model
- **seedream-4-5-251128** - Legacy Seedream 4.5 image generation and editing model

**Migration Path:** Use the latest supported Seedream model:
- **seedream-5-0-260128** - Latest Seedream 5.0 image generation and editing model with Chain of Thought reasoning, improved prompt optimization, MJ-style aesthetics, and enhanced high-resolution generation

For implementation examples, see [Generate Images with Seedream](en/examples/generate_images_with_seedream_4.md).

### OpenAI Models (Deprecated: 2025-10-28)

The following OpenAI models have been deprecated:

#### Image Generation Models
- **dall-e-3** - Legacy DALL·E 3 image generation model

**Migration Path:** Use the latest OpenAI image model:
- **gpt-image-2** - Latest OpenAI image generation and editing model with improved prompt adherence, visual fidelity, multilingual text rendering, and support for both `v1/images/generations` and `v1/images/edits`

For implementation examples, see [Generate Images with GPT Image](en/examples/generate_images_with_gpt_image.md).

#### GPT-3.5 Models
- **gpt-3.5-turbo** - Legacy GPT-3.5 Turbo model

**Migration Path:** Use currently supported models:
- **gpt-5-nano** - More efficient and capable replacement
- **gpt-5-mini** - Enhanced performance model

#### GPT-4 Legacy Models
- **gpt-4** - Original GPT-4 model
- **gpt-4-0125-preview** - January 25, 2024 preview version
- **gpt-4-1106-preview** - November 6, 2023 preview version
- **gpt-4-turbo** - Legacy GPT-4 Turbo model
- **gpt-4-turbo-2024-04-09** - April 9, 2024 specific version

**Migration Path:** Use currently supported models:
- **gpt-4.1** - Latest GPT-4 series model
- **gpt-5-chat** - Next generation model
- **gpt-5-pro** - Professional tier model

#### Reasoning Models
- **o1-preview** - Preview version of O1 reasoning model
- **gpt-4.5-preview** - Preview version of GPT-4.5

**Migration Path:** Use currently supported models:
- **o3** - Stable version of O1 reasoning model
- **o4-mini** - Efficient reasoning model
- **gpt-5-chat** - Latest Chat model

### Anthropic Claude Models (Deprecated: 2025-10-28)

The following Anthropic Claude models have been deprecated:

- **anthropic.claude-3-opus-20240229-v1:0** - Claude 3 Opus (February 29, 2024 version)
- **anthropic.claude-3-haiku-20240307-v1:0** - Claude 3 Haiku (March 7, 2024 version)
- **anthropic.claude-3-sonnet-20240229-v1:0** - Claude 3 Sonnet (February 29, 2024 version)
- **anthropic.claude-3-5-haiku-20241022-v1:0** - Claude 3.5 Haiku (October 22, 2024 version)
- **anthropic.claude-3-5-sonnet-20240620-v1:0** - Claude 3.5 Sonnet (June 20, 2024 version)
- **anthropic.claude-3-7-sonnet-20250219-v1:0** - Claude 3.7 Sonnet (February 19, 2025 version)

**Migration Path:** Use currently supported models:
- **claude-opus-4-6** - Latest Claude Opus model
- **claude-sonnet-4-6** - Latest Claude Sonnet model
- **claude-haiku-4-5** - Efficient alternative

### Stability AI Models (Deprecated: 2025-10-28)

The following Stability AI models have been deprecated:

- **stability.sd3-large-v1:0** - Stable Diffusion 3 Large v1.0

**Migration Path:** Use currently supported models:
- **stability.sd3-5-large-v1:0** - Latest Stable Diffusion 3.5 model
- **stability.stable-image-ultra-v1:1** - Alternative image generation model

### Google Gemini Models (Deprecated: 2025-09-27)

The following Google Gemini models have been officially deprecated by Google's Gemini API:

#### Core Gemini Models
- **gemini-pro** - Legacy general-purpose model
- **gemini-1.5-pro** - Previous generation pro model  
- **gemini-1.5-pro-002** - Specific version variant
- **gemini-1.5-pro-001** - Specific version variant
- **gemini-1.5-pro-latest** - Latest pointer (deprecated)

#### Experimental Variants
- **gemini-1.5-pro-exp-0801** - August 2024 experimental version
- **gemini-1.5-pro-exp-0827** - August 27, 2024 experimental version
- **gemini-2.0-flash-exp** - Flash 2.0 experimental model
- **gemini-exp-1114** - November 14 experimental model
- **gemini-exp-1206** - December 6 experimental model

#### Flash Models
- **gemini-1.5-flash-latest** - Latest flash model pointer
- **gemini-1.5-flash-8b** - 8 billion parameter flash model
- **gemini-1.5-flash-8b-exp-0924** - September 24 experimental flash variant
- **gemini-1.5-flash-exp-0827** - August 27 experimental flash variant
- **gemini-1.5-flash-8b-exp-0827** - August 27 experimental 8B flash variant

**Migration Path:** Use currently supported models:
- **gemini-2.0-flash** - Generation 2.0 flash model
- **gemini-2.0-flash-lite** - Generation 2.0 flash lite model
- **gemini-2.5-pro** - Generation 2.5 pro model
- **gemini-2.5-flash** - Generation 2.5 flash model
- **gemini-2.5-flash-lite** - Generation 2.5 flash lite model

**Announcement:** [Google Gemini 1.5 Series Models Deprecation Notice](en/news/2025-09-27-google-gemini-models-deprecation.md)

## Migration Support

If you need assistance migrating from deprecated models:

1. **Review Current Usage**: Identify which deprecated models you're currently using
2. **Select Alternatives**: Choose appropriate replacement models based on your use case
3. **Update Implementation**: Modify your code to use the new model names
4. **Test Thoroughly**: Ensure your applications work correctly with the replacement models
5. **Monitor Performance**: Verify that the new models meet your requirements

## Support Resources

- [Model Selection Guide](en/guides/model-selection.md)
- [Best Practices](en/guides/best-practices.md)
- [Error Handling](en/guides/error-handling.md)
- [Contact Support](https://avalai.ir/contact-us-avalai)

## Historical Deprecations

*This section will be updated as models are deprecated over time.*

---

**Last Updated:** 2026-06-18

For the most current information about model availability, please refer to our [Models Documentation](en/models/model-details.md) or contact our support team.