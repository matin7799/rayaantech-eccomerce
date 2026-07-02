# Models

AvalAI provides access to a wide range of AI models from multiple providers through a unified API. This page provides an overview of the available models and their capabilities.

For complete details on all models and their capabilities, please visit our [Model Details](en/models/model-details.md) page.

## Model Providers

AvalAI currently supports models from the following providers:

<!-- PROVIDER_LIST_START -->

- [Alibaba (Qwen)](en/providers/alibaba.md)
- [OpenAI](en/providers/openai.md)
- [Anthropic](en/providers/anthropic.md)
- [Google](en/providers/google.md)
- [Meta (Llama)](en/providers/meta.md)
- [Mistral AI](en/providers/mistralai.md)
- [XAI (Grok)](en/providers/xai.md)
- [Cohere](en/providers/cohere.md)
- [Stability AI](en/providers/stabilityai.md)
- [DeepSeek](en/providers/deepseek.md)
- [BFL (FLUX)](en/providers/bfl.md)
- [Cloudflare](en/providers/cloudflare.md)
- [BytePlus](en/providers/byteplus.md)
- [Z.AI](en/providers/zai.md)
- [Perplexity](en/providers/perplexity.md)
- [Tavily](en/providers/tavily.md)
- [DataForSEO](en/providers/dataforseo.md)
- [Exa.AI](en/providers/exa_ai.md)
- [Parallel AI](en/providers/parallel_ai.md)
- [Google PSE](en/providers/google.md#google-programmable-search-engine-pse)
- [Firecrawl](en/providers/firecrawl.md)
- [Moonshot AI](en/providers/moonshotai.md)
- [Runway](en/providers/runwayml.md)
- [groq](en/providers/groq.md)
- [Nvidia NIM](en/providers/nvidianim.md)
- [MiniMax](en/providers/minimax.md)
- [ElevenLabs](en/providers/elevenlabs.md)
- [Serper](en/providers/serper.md)
- [Fireworks.ai](en/providers/fireworksai.md)
<!-- PROVIDER_LIST_END -->

## Model Categories

### Chat and Text Generation Models

These models are designed for conversational AI, text completion, and creative writing tasks.

#### Premium Models

| Provider | Model | Description | Best For |
| --------- | --------------- | ------------------------------------- | ---------------------------------------- |
| OpenAI | gpt-5.5 | OpenAI's newest flagship model with state-of-the-art agentic coding, 1M context | Agentic coding, knowledge work, computer use, scientific research |
| OpenAI | gpt-5.4-pro, gpt-5.4, gpt-5.4-mini, gpt-5.4-nano, gpt-5.3-chat | OpenAI's latest reasoning and chat models with up to 1.05M context | Complex professional work, advanced reasoning, coding excellence, high-volume tasks |
| OpenAI | gpt-5.2, gpt-5.2-pro | OpenAI's advanced flagship models | Professional knowledge work, coding, agentic tasks, complex reasoning |
| OpenAI | gpt-5, gpt-5.1, gpt-5.1-chat, gpt-5-chat, gpt-5-codex, gpt-5.1-codex, gpt-5.1-codex-mini, gpt-5.1-codex-max | OpenAI's next-generation flagship model | Advanced reasoning, complex tasks, coding, chat, agentic coding |
| OpenAI | gpt-5-pro | OpenAI's advanced reasoning model | Expert-level reasoning, complex problem-solving |
| OpenAI | gpt-4.1 | OpenAI's latest gpt-4 upgrade | Cutting-edge features, complex tasks |
| OpenAI | gpt-4o | Fast, intelligent, multimodal GPT | General purpose, vision, speed |
| OpenAI | o1-pro | OpenAI's professional reasoning model | Advanced reasoning, complex instructions |
| OpenAI | o3-pro | Next-gen professional reasoning model | Complex problem solving, research |
| Anthropic | claude-opus-4-8 | Anthropic's most capable flagship model to date with native 1M context | Long-horizon agentic coding, mid-conversation system messages, refusal stop details, adaptive thinking, default high effort, increased honesty |
| Anthropic | claude-opus-4-7 | Previous flagship model with native 1M context | Frontier agentic coding, adaptive thinking, xhigh effort, task budgets, high-res vision |
| Anthropic | claude-opus-4-6 | Anthropic's most powerful model with 1M context | Enhanced agentic coding, 1M context, agent teams, adaptive thinking |
| Anthropic | claude-sonnet-4-6 | Anthropic's most capable Sonnet with 1M context | Opus-class performance, coding, computer use, 1M context |
| Anthropic | claude-opus-4-5 | Anthropic's most capable model with smart routing | State-of-the-art coding, agents, computer use, token efficiency |
| Anthropic | claude-sonnet-4-5 | Latest Sonnet model with smart routing and agent capabilities | Strong performance, coding excellence, autonomous tasks |
| Anthropic | claude-haiku-4-5 | Fast and efficient with smart routing | Pair programming, coding, cost-sensitive deployments |
| Google | gemini-3.5-flash | Google's flagship Flash reasoning model with 1M context and configurable thinking levels | Agentic coding, tool use, multimodal reasoning, long-context analysis |
| Google | gemini-3.1-pro-preview, gemini-3.1-flash-lite, gemini-3.1-flash-lite-preview | Google's latest Gemini 3.1 models | Complex reasoning, strategic planning, algorithmic development, cost-efficient multimodal tasks |
| Google | gemini-3-pro-preview | Google's advanced Gemini 3 model | Complex reasoning, strategic planning, algorithmic development |
| Google | gemini-2.5-pro | Google's advanced multimodal model | Complex reasoning, multimodality |
| XAI | grok-4.3, grok-4.20-reasoning, grok-4.20-non-reasoning, grok-4 | XAI's latest Grok models with up to 2M context and flagship 1M-context reasoning | Complex problem solving, large context, structured outputs, tool-enabled chat |
| MiniMax | minimax-m3, minimax-m2.7, minimax-m2.7-highspeed, minimax-m2.5 | MiniMax's flagship M3 (frontier coding, 1M context, multimodal) and latest agentic productivity and coding models | Complex reasoning, agentic workflows, tool use, long-context, multimodal |

#### Standard Models

| Provider | Model | Description | Best For |
| --------- | --------------- | ------------------------------------- | ---------------------------------------- |
| OpenAI | o1, o1-2024-12-17 | OpenAI's reasoning model | Advanced reasoning, problem solving |
| OpenAI | o3, o3-2025-04-16 | Next-generation reasoning model | Complex reasoning, analysis |
| OpenAI | gpt-4, gpt-4-0613 | OpenAI's flagship model | High-quality text generation |
| OpenAI | gpt-4-turbo | Optimized GPT-4 variant | Faster responses, cost-effective |
| OpenAI | chatgpt-4o-latest | Latest ChatGPT model | Conversational AI, general use |
| Anthropic | claude-sonnet-4-6 | Balanced performance model | General tasks, good performance |
| Anthropic | claude-opus-4-8, claude-opus-4-7 | High-capability flagship models | Complex reasoning, agentic coding, creative tasks |
| Google | gemini-3.5-flash, gemini-3-flash-preview | Google's Flash models with superior reasoning and speed | Agentic workflows, everyday tasks, video analysis, data extraction |
| XAI | grok-3, grok-3-latest, grok-code-fast-1 | XAI's standard reasoning and coding models | Problem solving, large context, coding |

#### Efficient Models

| Provider | Model | Description | Best For |
| --------- | --------------- | ------------------------------------- | ---------------------------------------- |
| OpenAI | gpt-5.4-mini, gpt-5.4-nano, gpt-5-mini, gpt-5-nano | Efficient next-gen models | Fast responses, cost-effective high-volume processing |
| OpenAI | gpt-4.1-mini, gpt-4.1-nano | Compact GPT-4.1 variants | Efficient processing, lower cost |
| OpenAI | o1-mini, o3-mini, o4-mini | Compact reasoning models | Efficient reasoning, moderate tasks |
| Anthropic | claude-haiku-4-5 | Near-frontier coding (Bedrock) | Pair programming, coding, cost-sensitive deployments |
| Google | gemini-3.1-flash-lite, gemini-3.1-flash-lite-preview, gemini-2.5-flash-lite | Lightweight Gemini models | Fast responses, simple tasks, translation, transcription, extraction |
| XAI | grok-3-mini, grok-3-mini-fast | Compact Grok models | Efficient reasoning, cost-effective |

#### Specialized Models

| Provider | Model | Description | Best For |
| --------- | --------------- | ------------------------------------- | ---------------------------------------- |
| OpenAI | computer-use-preview | Computer interaction model | Automation, UI interaction |
| OpenAI | codex-mini-latest | Code generation model | Programming, code completion |
| OpenAI | o3-deep-research | Deep research model | Research tasks, analysis |
| Mistral | mistral-large-3 | Mistral's most capable model (675B params) | Complex reasoning, multilingual, multimodal |
| Mistral | codestral-2501 | Code-specialized model | Programming, development |
| Mistral | mistral-ocr-latest, mistral-ocr-2512 | OCR processing models | Document processing, text extraction |
| Moonshot.ai | kimi-k2.6, kimi-k2-thinking | Latest agentic coding and reasoning models | Agent swarm workflows, full-stack creation, deep reasoning, multi-step tool use |
| Z.AI | glm-5.1 | SOTA agentic engineering with SWE-Bench Pro 58.4% | Complex coding, long-horizon agentic automation, math |
| Z.AI | glm-5v-turbo, glm-5-turbo | Multimodal and OpenClaw-optimized GLM-5 variants | Vision understanding, high-throughput agent workflows, MCP tool use |
| Z.AI | glm-4.7, glm-4.7-flashx, glm-4.7-flash | Fast, cost-effective GLM-4.7 variants | High-throughput, development, translation |
| OpenAI | gpt-5.3-codex, gpt-5.2-codex | Advanced Codex models with long context | Agentic coding, long-horizon tasks |
| MiniMax | minimax-m3, minimax-m2.7, minimax-m2.7-highspeed, minimax-m2.1 | Flagship M3 and latest MiniMax productivity and reasoning models | Agentic workflows, tool use, complex reasoning, long-context, multimodal |

#### Open Source & Alternative Models

| Provider | Model | Description | Best For |
| --------- | --------------- | ------------------------------------- | ---------------------------------------- |
| Meta | llama-3.1-405b, llama-3.1-70b, llama-3.1-8b | Latest Llama 3.1 series | Open source, customizable |
| Meta | llama-3.3-70b | Enhanced Llama model | Strong open model performance |
| Meta | llama-4-scout, llama-4-maverick | Next-gen Llama models | Advanced open source capabilities |
| DeepSeek | deepseek-v4-pro, deepseek-reasoner | Flagship reasoning models (V4-Pro, 1M context, SOTA Agentic Coding) | Complex reasoning, agentic coding, research |
| DeepSeek | deepseek-v4-flash, deepseek-chat | Fast & economical flagship models (V4-Flash, 1M context) | Conversation, high-volume applications, agent workflows |
| DeepSeek | deepseek-r1, deepseek-v3.1, deepseek-coder | Legacy reasoning and code models | Mathematical reasoning, analysis, programming |
| Alibaba | qwen3.6-plus, qwen3.6-flash, qwen3.6-max-preview, qwen3.6-27b, qwen3.6-35b-a3b | Latest Qwen3.6 models with agentic coding and vision-language upgrades | Agentic coding, multimodal reasoning, long-context work |
| Alibaba | qwen3.7-max | Newest flagship agent-foundation model with frontier coding and long-horizon execution | Coding agents, office productivity, long-horizon autonomous workflows |
| Alibaba | qwen-max, qwen-plus, qwen-turbo, qwen3-max, qwen3-max-preview | Qwen model series | Multilingual, efficient processing |
| Alibaba | qwen-plus-character | Role-playing character model | Virtual characters, games, chatbots |
| Alibaba | qwen3-vl-32b-instruct, qwen3-vl-plus, qwen3-vl-flash | Vision-language models | Image analysis, video understanding, OCR |
| Alibaba | qwen-mt-flash, qwen-mt-lite | Machine translation models | 92-language translation |
| Moonshot.ai | kimi-k2.6, kimi-k2-0711-preview, kimi-latest | Kimi advanced models | Agent swarm, full-stack generation, long context, multilingual (Chinese/English) |
| Moonshot.ai | kimi-thinking-preview | Kimi reasoning model | Complex problem solving, deep thinking |
| Moonshot.ai | moonshot-v1-8k, moonshot-v1-32k, moonshot-v1-128k, moonshot-v1-auto | Moonshot text models | Flexible context windows, auto-routing |
| Google | gemma-4-26b-a4b-it, gemma-4-31b-it, gemma-3 series | Open Gemma models | Research, customization, efficient multimodal reasoning |

#### Cloudflare AI Models

| Provider | Model | Description | Best For |
| --------- | --------------- | ------------------------------------- | ---------------------------------------- |
| Cloudflare | cf.nemotron-3-120b-a12b | NVIDIA Nemotron-3 with 1M context via Cloudflare AI | Agentic workflows, long-context reasoning, high-volume workloads |
| Cloudflare | cf.deepseek-r1-distill-qwen-7b | Cloudflare DeepSeek reasoning model | Efficient reasoning, cost-effective |
| Cloudflare | cf.llama-3.1-8b-instruct | Cloudflare Llama 3.1 8B | Open source, general tasks |
| Cloudflare | cf.llama-3.2-1b-instruct | Cloudflare Llama 3.2 1B | Lightweight, efficient processing |
| Cloudflare | cf.llama-3.2-3b-instruct | Cloudflare Llama 3.2 3B | Balanced performance, efficiency |
| Cloudflare | cf.gemma-7b-it | Cloudflare Gemma 7B | Research, experimentation |
| Cloudflare | cf.mistral-7b-instruct-v0.1 | Cloudflare Mistral 7B | General purpose, efficient |
| Cloudflare | cf.qwen1.5-0.5b-chat | Cloudflare Qwen 0.5B | Ultra-lightweight, fast responses |
| Cloudflare | cf.qwen1.5-1.8b-chat | Cloudflare Qwen 1.8B | Compact, efficient processing |
| Cloudflare | cf.qwen1.5-7b-chat-awq | Cloudflare Qwen 7B AWQ | Optimized performance |
| Cloudflare | cf.qwen1.5-14b-chat-awq | Cloudflare Qwen 14B AWQ | Enhanced capabilities |

### Image Generation Models

These models can generate and edit images based on text descriptions.

| Provider | Model | Description | Best For |
| ------------ | ---------------- | ------------------------------- | -------------------------------------- |
| OpenAI | gpt-image-2 | Next-generation image generation and editing | Precise prompt adherence, multilingual text rendering, flexible aspect ratios |
| OpenAI | gpt-image-1.5 | Latest GPT image generation and editing | High-quality image creation and editing |
| OpenAI | gpt-image-1 | GPT image generation model | High-quality image creation |
| OpenAI | gpt-image-1-mini | Cost-efficient image generation | High-volume image applications |
| Google | imagen-4.0-generate | Latest Imagen model | High-quality image generation |
| Google | imagen-4.0-fast-generate | Fast Imagen variant | Quick image generation |
| Google | imagen-4.0-ultra-generate | Ultra-quality Imagen | Premium image generation |
| Google | gemini-3.1-flash-image-preview | Nano Banana 2 - High-efficiency image generation | Speed-optimized, high-volume apps |
| Google | gemini-3-pro-image-preview | Nano Banana Pro - Professional image generation | Complex instructions, high-fidelity text |
| Google | gemini-2.5-flash-image | Nano Banana - Fast image generation | High-volume, low-latency tasks |

| Stability AI | stable-image-ultra | Ultra-quality Stable Diffusion | Premium image generation |
| Stability AI | stable-image-core | Core Stable Diffusion | Standard image generation |
| BFL | flux-1.1-pro | Professional Flux model | High-quality creative images |
| BFL | flux.1-kontext-pro | Context-aware Flux | Contextual image generation |
| Alibaba | qwen-image-2.0-pro | Professional Qwen image generation with native 2K and typography | Infographics, posters, PPTs, professional layouts |
| Alibaba | qwen-image-2.0 | Cost-effective Qwen image generation and editing | Typography, photorealistic images, high-volume image workflows |
| Alibaba | qwen-image | Qwen image generation | Creative image generation |
| Alibaba | qwen-image-edit | Qwen image editing | Image modification and editing |
| Alibaba | z-image-turbo | Fast image generation | Quick generation, text rendering |
| Alibaba | qwen-image-edit-plus | Advanced image editing | Background removal, style transfer |
| Alibaba | wan2.2-t2i-flash | Fast text-to-image | Quick image generation |
| Alibaba | wan2.2-t2i-plus | Enhanced text-to-image | High-quality image generation |
| BytePlus | seedream-5-0-260128 | Latest Seedream image generation with CoT reasoning | MJ-style aesthetics, high-quality creative images |
| BytePlus | seedream-4-0-250828 | State-of-the-art image generation | High-quality creative images with sequential generation |

### Video Generation Models

These models generate AI-powered videos from text prompts with support for image references and various resolutions.

| Provider | Model | Description | Best For |
| -------- | ---------- | ---------------------------------- | --------------------------------------- |
| OpenAI | sora-2 | Standard quality video generation | Social media content, standard applications |
| OpenAI | sora-2-pro | High-quality video generation | Professional content, high-resolution output |
| Google | veo-3.1-fast-generate-001 | Fast video generation with audio | Rapid iteration, cost-effective projects |
| Google | veo-3.1-generate-001 | Premium video generation with rich audio | Production content, cinematic quality |

**Key Features:**
- Asynchronous video generation (Sora: up to 8 seconds, Veo: up to 8 seconds)
- Multiple resolution options (Sora: 720x1280, 1280x720, 1024x1792, 1792x1024; Veo: 720x1280, 1280x720, 1080x1920, 1920x1080)
- Native audio generation (Veo models)
- Image reference support for guided generation
- Remix capability to create variations
- Natural motion and temporal coherence
- Webhook notifications for completion

**See also:**
- [Video Generation API Reference](en/api-reference/videos.md) - Complete API documentation
- [Generate Videos Using Sora Guide](en/guides/generate-videos-using-sora.md) - Practical guide for Sora models
- [Generate Videos Using Veo Guide](en/guides/generate-videos-using-veo.md) - Practical guide for Veo models
- [OpenAI Models](en/providers/openai.md#video-generation-models) - Detailed Sora specifications
- [Google Models](en/providers/google.md#veo-3-1-video-generation-models) - Detailed Veo specifications

### Embedding Models

These models convert text into vector representations for semantic search, clustering, and other machine learning tasks.

| Provider | Model | Description | Best For |
| -------- | ----------------------- | --------------------------------- | -------------------------------- |
| OpenAI | text-embedding-3-large | Most capable embedding model | High-accuracy semantic search |
| OpenAI | text-embedding-3-small | Smaller, faster embedding model | Efficient semantic search |
| OpenAI | text-embedding-ada-002 | Legacy embedding model | Backwards compatibility |
| Google | gemini-embedding-2 | Google's first multimodal Gemini embedding model | Cross-modal search across text, images, audio, video, and PDFs |
| Google | gemini-embedding-001 | Gemini embedding model | Multimodal embeddings |
| Google | gemini-embedding-exp | Experimental embedding | Latest embedding features |
| Cohere | embed-v4, embed-v-4-0 | Latest multimodal embedding (text, images, PDFs) | Document embeddings, multimodal search, RAG |
| Cohere | embed-english-v3 | English-optimized embedding model | English-language semantic search |
| Cohere | embed-multilingual-v3 | Multilingual embedding model | Cross-language semantic search |
| Alibaba | text-embedding-v4 | Latest Qwen text embedding (2,048 dimensions) | Advanced semantic search, RAG |
| Alibaba | text-embedding-v3 | Qwen text embedding (1,024 dimensions) | Multilingual embeddings |
| Alibaba | tongyi-embedding-vision-plus | Multimodal embedding (1,152 dimensions) | Cross-modal retrieval, image search |
| Alibaba | tongyi-embedding-vision-flash | Fast multimodal embedding (768 dimensions) | Efficient multimodal search |
| Nvidia NIM | llama-3.2-nemoretriever-* | Research-focused embedding models | Research, evaluation, prototyping |
| Nvidia NIM | nv-embedqa-e5-v5, nv-embed-v1 | Nvidia embedding models | Research-grade semantic search |
| Nvidia NIM | bge-m3 | BAAI embedding model | Research embeddings |

### Audio Models

These models can transcribe, translate, and generate audio content.

| Provider | Model | Description | Best For |
| -------- | --------- | ---------------------------------- | ----------------------------------- |
| OpenAI | whisper-1 | General purpose speech recognition | Audio transcription and translation |
| OpenAI | gpt-4o-transcribe | Advanced transcription model | High-quality transcription |
| OpenAI | gpt-4o-transcribe-diarize | Enhanced transcription with speaker diarization | Multi-speaker transcription, meeting analysis |
| OpenAI | gpt-4o-mini-transcribe | Efficient transcription | Fast, cost-effective transcription |
| OpenAI | tts-1 | Text-to-speech model | Standard audio generation |
| OpenAI | tts-1-hd | High-definition text-to-speech | High-quality audio generation |
| OpenAI | gpt-4o-mini-tts | Compact TTS model | Efficient speech synthesis |
| OpenAI | gpt-audio | First generally available audio model | Conversational AI with audio input/output |
| OpenAI | gpt-audio-mini | Cost-efficient audio model | High-volume audio applications |
| OpenAI | gpt-4o-audio-preview | Audio-capable chat model | Conversational audio AI |
| OpenAI | gpt-4o-realtime-preview | Real-time audio model | Live audio interaction |
| Google | gemini-2.5-flash-tts | Fast, cost-efficient TTS | High-volume TTS, conversational AI |
| Google | gemini-2.5-pro-tts | Premium quality TTS with advanced control | Audiobooks, multi-speaker, complex styling |
| Google | ~~gemini-2.5-pro-preview-tts~~ | **Deprecated** - Use gemini-2.5-pro-tts | Advanced speech synthesis |
| Google | ~~gemini-2.5-flash-preview-tts~~ | **Deprecated** - Use gemini-2.5-flash-tts | Efficient speech generation |

### Specialized Models

#### Moderation Models

| Provider | Model | Description | Best For |
| -------- | --------- | ---------------------------------- | ----------------------------------- |
| OpenAI | omni-moderation-latest | Latest moderation model | Content safety, moderation |
| OpenAI | text-moderation-latest | Text moderation model | Text content filtering |

#### Rerank Models

| Provider | Model | Description | Best For |
| -------- | --------- | ---------------------------------- | ----------------------------------- |
| Cohere | rerank-v4.0-pro, rerank-v4.0-fast | Latest reranking models with 32K context, 100+ languages | Enterprise RAG, search optimization |
| Cohere | rerank-v3-5 | Advanced reranking model | Search result optimization |
| Nvidia NIM | llama-3.2-nemoretriever-rerank-* | Research-focused reranking models | Research, evaluation, prototyping |
| Nvidia NIM | nv-rerankqa-mistral-4b-v3 | Nvidia reranking models | Research-grade search optimization |

### Direct Web Search

These tools provide programmatic access to web search engines through the [`v1/search`](en/api-reference/search.md) endpoint. Unlike web search in chat completions (which augments LLM responses), these tools return direct search results.

| Provider | Tool | Price per Query | Best For |
| ------------ | -------------------------- | --------------- | --------------------------------------------- |
| Serper | serper-search | $0.001 | Lowest-cost Google-powered search with time and geo filters |
| DataForSEO | dataforseo-search | $0.003 | Cost-effective general search |
| Parallel AI | parallel_ai-search | $0.004 | Fast parallel web search |
| Perplexity | perplexity-search | $0.005 | Balanced performance and accuracy |
| Google | google_pse-search | $0.005 | Google Programmable Search Engine results |
| Tavily | tavily-search | $0.008 | Standard web search with good coverage |
| Parallel AI | parallel_ai-search-pro | $0.009 | Advanced parallel search capabilities |
| Tavily | tavily-search-advanced | $0.016 | Deep search with advanced analysis |
| Exa AI | exa_ai-search | $0.025 | Neural semantic search for precise results |

**Key Features:**
- Direct API access to search results without LLM processing
- Structured JSON responses (Perplexity-compatible format)
- Domain filtering and search depth control
- Cost-effective pricing from $0.001 per query
- Ideal for research automation, price monitoring, news aggregation

**See also:**
- [Search API Reference](en/api-reference/search.md) - Complete API documentation
- [Using v1/search Guide](en/examples/using_v1_search.md) - Practical examples and use cases
- [Web Search in Chat Completions](en/examples/web_search_capabilities.md) - LLM-augmented search


#### Vision Models

Many models support vision capabilities including:
- OpenAI: gpt-5.5, gpt-5.4 series
- Anthropic: claude-opus-4-8, claude-opus-4-7, claude-opus-4-6, claude-opus-4-5, claude-sonnet-4-6, claude-sonnet-4-5, claude-haiku-4-5
- Google: gemini-3.5-flash, gemini-3.1-pro-preview, gemini-3.1-flash-lite, gemini-3.1-flash-lite-preview, gemini-3-flash-preview, gemini-2.5-pro, gemini-2.5-flash, gemma-4 series
- XAI: grok-4.20-reasoning, grok-4.20-non-reasoning, grok-4.3
- Moonshot.ai: kimi-k2.6, kimi-k2.5
- Alibaba: qwen3.6 series, qwen3.5-vl series

## Model Selection

When making API requests, you can specify which model to use. For example:

```python
completion = client.chat.completions.create(
    model="gpt-5.5",  # Specify any supported model here
    messages=[{"role": "user", "content": "Hello!"}],
)
```

You can switch between models from different providers without changing your code structure, as AvalAI's unified API handles the translation between different provider APIs.

## Model Capabilities

Different models have different capabilities. Here's a quick overview:

### Text Generation

All chat models support text generation, but with varying levels of quality, speed, and cost.

### Vision

Many models support image inputs for multimodal tasks. Check the model details for specific vision capabilities.

### Function Calling

Most modern models support function calling or tool use:

- OpenAI: gpt-5.5, gpt-5.4 series
- Anthropic: claude-opus-4-8, claude-opus-4-7, claude-opus-4-6, claude-opus-4-5, claude-sonnet-4-6, claude-sonnet-4-5, claude-haiku-4-5
- Google: gemini-3.5-flash, gemini-3.1-pro-preview, gemini-3.1-flash-lite, gemini-3.1-flash-lite-preview, gemini-3-flash-preview, gemini-2.5-pro, gemini-2.5-flash, gemma-4 series
- XAI: grok-4.20-reasoning, grok-4.20-non-reasoning, grok-4.3
- Moonshot.ai: kimi-k2.6, kimi-k2.5
- Alibaba: qwen3.6 series
- DeepSeek: deepseek v4 models

### JSON Mode

Most models support structured JSON output for reliable data extraction and formatting.

### Reasoning

Advanced reasoning capabilities are available in:
- OpenAI: gpt-5.5, gpt-5.4 series
- Anthropic: claude-opus-4-8, claude-opus-4-7, claude-opus-4-6, claude-opus-4-5, claude-sonnet-4-6, claude-sonnet-4-5, claude-haiku-4-5
- Google: gemini-3.5-flash, gemini-3.1-pro-preview, gemini-3.1-flash-lite, gemini-3.1-flash-lite-preview, gemini-3-flash-preview, gemini-2.5-pro, gemini-2.5-flash, gemma-4 series
- XAI: grok-4.20-reasoning, grok-4.20-non-reasoning, grok-4.3
- Moonshot.ai: kimi-k2.6, kimi-k2.5
- Alibaba: qwen3.6 series
- MiniMax: minimax-m2.7

## Model Pricing

Model pricing varies by provider and specific model. For detailed pricing information, see the [Pricing](en/pricing.md) page.

## Model Versioning

Models are versioned to ensure stability. When a provider releases a new version of a model, AvalAI makes it available while maintaining access to previous versions for backward compatibility.

## Next Steps

- Learn more about specific models from [OpenAI](en/providers/openai.md), [Anthropic](en/providers/anthropic.md), [Google](en/providers/google.md), [Meta](en/providers/meta.md), [Mistral](en/models/mistral.md), [XAI](en/providers/xai.md), [Cohere](en/providers/cohere.md), [Stability AI](en/providers/stabilityai.md), [DeepSeek](en/providers/deepseek.md), [Alibaba](en/providers/alibaba.md), [BFL](en/providers/bfl.md), [Nvidia NIM](en/providers/nvidianim.md), [Fireworks.ai](en/providers/fireworksai.md), and [MiniMax](en/providers/minimax.md)
- Check out the [API Reference](en/api-reference/introduction.md) for details on how to use these models
- See the [Pricing](en/pricing.md) page for information on model costs
- View detailed specifications in our [Model Details](en/models/model-details.md) page
