# New Models Added: Grok 4.20 Stable, GPT-Image-2, Qwen3.6 Series, Kimi K2.6, and Gemini Embedding 2

**Date:** 2026-04-23 / (1405-02-03)

## Summary

We announce the addition of ten new models across five leading providers: X.AI's stable `grok-4.20-reasoning` and `grok-4.20-non-reasoning`, OpenAI's `gpt-image-2` (the next-generation image generation model), Alibaba's `qwen3.6-flash`, `qwen3.6-27b`, `qwen3.6-35b-a3b`, and `qwen3.6-max-preview` vision-language models, Moonshot AI's `kimi-k2.6` open-source agentic coding model, and Google's first multimodal embedding model `gemini-embedding-2`.

---

## Details

### X.AI (Grok)

The stable release of Grok 4.20 is now available with both reasoning and non-reasoning variants, moving beyond the previous beta versions while retaining the same 2M context window and industry-leading speed.

#### grok-4.20-reasoning

[`grok-4.20-reasoning`](en/providers/xai.md) is the stable release of X.AI's flagship Grok 4.20 reasoning model. It delivers industry-leading speed, agentic tool calling, the lowest hallucination rate on the market, and strict prompt adherence for consistently precise responses.

| Feature | Details |
|---------|---------|
| Context window | 2,000,000 tokens |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Reasoning Mode**: Extended thinking before responding for complex problem-solving
- **Massive Context**: 2M token context window for extensive documents and conversations
- **Lowest Hallucination Rate**: Industry-leading accuracy and truthfulness
- **Strict Prompt Adherence**: Consistently precise responses
- **Function Calling & Structured Outputs**: Full support for external tools and systems

#### grok-4.20-non-reasoning

[`grok-4.20-non-reasoning`](en/providers/xai.md) is the stable non-reasoning variant optimized for fast responses without extended thinking, ideal for high-throughput and latency-sensitive applications.

| Feature | Details |
|---------|---------|
| Context window | 2,000,000 tokens |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Fast Inference**: Optimized for quick responses without reasoning overhead
- **Massive Context**: 2M token context window
- **High-Throughput**: Ideal for latency-sensitive applications
- **Function Calling & Structured Outputs**: Full tool support

### OpenAI

#### gpt-image-2

[`gpt-image-2`](en/providers/openai.md) is OpenAI's next-generation image generation model, delivering greater precision and control, stronger multilingual text rendering, stylistic sophistication and realism, enhanced real-world intelligence, and support for flexible aspect ratios. It is available on both `v1/images/generations` and `v1/images/edits` endpoints.

| Feature | Details |
|---------|---------|
| Text input pricing | $5.00 / 1M tokens |
| Image input pricing | $8.00 / 1M tokens |
| Cached text input | $1.25 / 1M tokens |
| Cached image input | $2.00 / 1M tokens |
| Text output pricing | $10.00 / 1M tokens |
| Image output pricing | $30.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Image, Text |
| Supported endpoints | `v1/images/generations`, `v1/images/edits` |

**Key Features:**
- **Greater Precision & Control**: Significantly improved image generation accuracy and adherence to prompt details
- **Multilingual Text Rendering**: Strong performance across global scripts including Japanese, Arabic, Korean, Devanagari, Cyrillic, Bengali, Greek, Chinese, and Latin
- **Stylistic Sophistication & Realism**: Higher fidelity across photography, illustration, manga, pixel art, and other visual styles
- **Flexible Aspect Ratios**: Horizontal, Square, and Vertical formats for use cases from banners to mobile screens
- **Thinking Mode**: Uses reasoning to research, transform inputs, and produce cohesive, end-to-end visual assets
- **Image Editing**: Supports both generation and edit endpoints for complete image workflows

**Aliases:** `gpt-image-2-2026-04-21`

### Alibaba (Qwen3.6 Series)

Four new models from the Qwen3.6 series are now available, delivering significant improvements in agentic coding, STEM reasoning, spatial intelligence, and object detection over the Qwen3.5 generation.

#### qwen3.6-flash

[`qwen3.6-flash`](en/providers/alibaba.md) is the Qwen3.6 native vision-language Flash model, featuring a 1M context window and significantly improved agentic coding, mathematical reasoning, and spatial intelligence over qwen3.5-flash.

| Feature | Details |
|---------|---------|
| Context window | 1,000,000 tokens (256K tier-one pricing) |
| Maximum output | 64K tokens |
| Input pricing | $0.25 / 1M tokens |
| Input pricing (above 256K) | $1.00 / 1M tokens |
| Cache creation input | $0.3125 / 1M tokens |
| Cache creation input (above 256K) | $1.25 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens (90% cost reduction) |
| Cached input (above 256K) | $0.10 / 1M tokens |
| Output pricing | $1.50 / 1M tokens |
| Output pricing (above 128K) | $4.00 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Native Vision-Language**: Processes text, images, and videos natively
- **1M Context Window**: Extended context for long documents and conversations
- **Agentic Coding**: Substantially outperforms Qwen3.5-Flash on code-agent benchmarks
- **Spatial Intelligence**: Markedly improved object localization and detection
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`
- **Tool Support**: Function calling, structured output, and web search

#### qwen3.6-27b

[`qwen3.6-27b`](en/providers/alibaba.md) is the Qwen3.6 27B native vision-language dense model, built on the 3.5-27B architecture with key improvements in agentic coding, STEM reasoning, and visual agent capabilities.

| Feature | Details |
|---------|---------|
| Context window | 256,000 tokens |
| Maximum output | 64K tokens |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.06 / 1M tokens (90% cost reduction) |
| Output pricing | $3.60 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Native Vision-Language**: Processes text, images, and videos natively
- **256K Context Window**: Extended context for complex tasks
- **Enhanced STEM Reasoning**: Improved mathematical and code reasoning skills
- **Visual Agents**: Advances in video understanding, document OCR, and visual agent capabilities
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`

#### qwen3.6-35b-a3b

[`qwen3.6-35b-a3b`](en/providers/alibaba.md) is the Qwen3.6 35B-A3B native vision-language model, built on a hybrid architecture that integrates linear attention with a sparse mixture-of-experts framework for higher inference efficiency.

| Feature | Details |
|---------|---------|
| Context window | 256,000 tokens |
| Maximum output | 64K tokens |
| Input pricing | $0.248 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens (90% cost reduction) |
| Output pricing | $1.485 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Hybrid Architecture**: Linear attention combined with sparse MoE for higher efficiency
- **Improved Agentic Coding**: Significantly better code-agent performance
- **Spatial Intelligence**: Advances in object localization and detection
- **Cost-Effective**: Very low pricing thanks to efficient sparse activation
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`

#### qwen3.6-max-preview

[`qwen3.6-max-preview`](en/providers/alibaba.md) is the largest and most capable variant in the Qwen3.6 series, available in preview with text-only capabilities. It features enhanced vibe coding, efficient coding agent execution, and upgraded long-tail knowledge retention.

| Feature | Details |
|---------|---------|
| Context window | 256,000 tokens (128K tier-one pricing) |
| Maximum output | 64K tokens |
| Input pricing | $1.30 / 1M tokens |
| Input pricing (above 128K) | $2.00 / 1M tokens |
| Cache creation input | $1.625 / 1M tokens |
| Cache creation input (above 128K) | $2.50 / 1M tokens |
| Cached input pricing | $0.13 / 1M tokens (90% cost reduction) |
| Cached input (above 128K) | $0.20 / 1M tokens |
| Output pricing | $7.80 / 1M tokens |
| Output pricing (above 128K) | $12.00 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Largest Qwen3.6 Model**: Most capable variant in the Qwen3.6 series
- **Enhanced Vibe Coding**: Stronger front-end development and coding agent execution
- **Long-Tail Knowledge**: Upgraded knowledge retention for specialized topics
- **256K Context Window**: Extended context for complex tasks
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`

### Moonshot AI

#### kimi-k2.6

[`kimi-k2.6`](en/providers/moonshotai.md) is Moonshot AI's latest open-source model featuring state-of-the-art coding, long-horizon execution, and agent swarm capabilities. It builds on K2.5 with stronger multi-step reliability, full-stack capability, and Document-to-Skills reusability.

| Feature | Details |
|---------|---------|
| Input pricing | $1.05 / 1M tokens |
| Cached input pricing | $0.18 / 1M tokens |
| Output pricing | $4.40 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **SOTA Coding**: Transforms prompts into Awwwards-level front-end interfaces with clean linework, animations, and interactivity
- **Full-Stack Generation**: Creates complete working websites with authentication, interactions, and database operations from a single prompt
- **Long-Horizon Execution**: Handles complex, multi-step tasks with higher reliability and fewer unnecessary changes
- **Agent Swarm**: Coordinates multiple agents in parallel for search, research, analysis, long-form writing, and multi-format content generation
- **Document to Skills**: Turn high-quality documents into reusable skills that apply across future tasks
- **Claw Groups (Preview)**: New multi-agent team workflow with a coordinator assigning tasks and managing dependencies
- **Kimi Slides**: Production-ready presentation generation from prompts or multi-format inputs

> **Note**: Due to Singapore's 9% GST requirements, AvalAI pricing adds a 10% margin over official Moonshot.ai pricing to cover payment processing fees.

### Google

#### gemini-embedding-2

[`gemini-embedding-2`](en/providers/google.md) is Google's first multimodal embedding model in the Gemini API. It maps text, images, video, audio, and documents into a unified embedding space, enabling cross-modal search, classification, and clustering across over 100 languages.

| Feature | Details |
|---------|---------|
| Text input pricing | $0.20 / 1M tokens |
| Cached text input | $0.02 / 1M tokens (90% cost reduction) |
| Image input pricing | $0.45 / 1M tokens |
| Audio input pricing | $6.50 / 1M tokens |
| Video input pricing | $12.00 / 1M tokens |
| Output pricing | $0.15 / 1M tokens |
| Input token limit | 8,192 tokens |
| Output dimensions | Flexible (128 - 3072, default 3072, recommended 768/1536/3072) |
| Input modalities | Text, Image, Audio, Video, PDF |
| Output modalities | Embeddings |
| Supported endpoints | `v1/embeddings`, `v1beta/models/{model}:embedContent` (native Gemini) |

**Key Features:**
- **First Multimodal Embedding**: Unified embedding space across text, images, video, audio, and PDFs
- **Cross-Modal Search**: Compare and retrieve content across modalities in the same vector space
- **100+ Languages**: Broad multilingual support for international applications
- **Matryoshka Representation Learning (MRL)**: Flexible output dimensions (128–3072) without quality loss
- **Automatic Renormalization**: Truncated dimensions (e.g., 768, 1536) are auto-normalized for accurate similarity
- **Embedding Aggregation**: Single aggregated embedding for multi-part inputs (text + image, etc.)
- **Task Instructions**: Include task types directly in prompts (e.g., `task: search result | query: ...`) for optimized performance
- **Supported Modalities**: Text (8,192 tokens), Images (PNG/JPEG, max 6), Audio (MP3/WAV, max 180s), Video (MP4/MOV, max 120s, 32 frames), PDFs (max 6 pages)
- **Dual API Support**: Available on both the OpenAI-compatible `v1/embeddings` endpoint and the native Gemini `v1beta/models/{model}:embedContent` endpoint

**Aliases:** `gemini-embedding-2-preview`

---

## Pricing Summary

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) |
|-------|---------------------|----------------------------|----------------------|
| `grok-4.20-reasoning` | $2.00 | $0.20 | $6.00 |
| `grok-4.20-non-reasoning` | $2.00 | $0.20 | $6.00 |
| `gpt-image-2` (text) | $5.00 | $1.25 | $10.00 |
| `gpt-image-2` (image) | $8.00 | $2.00 | $30.00 |
| `qwen3.6-flash` | $0.25 | $0.025 | $1.50 |
| `qwen3.6-27b` | $0.60 | $0.06 | $3.60 |
| `qwen3.6-35b-a3b` | $0.248 | $0.025 | $1.485 |
| `qwen3.6-max-preview` | $1.30 | $0.13 | $7.80 |
| `kimi-k2.6` | $1.05 | $0.18 | $4.40 |
| `gemini-embedding-2` (text) | $0.20 | $0.02 | $0.15 |

---

## API Request/Response Examples

### Grok 4.20 Reasoning Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4.20-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Design a fault-tolerant distributed system architecture for a global payment platform."
      }
    ],
    "max_tokens": 4096
  }'
```

**Example Response:**

```json
{
  "id": "chatcmpl-grok420-abc123",
  "created": 1776321600,
  "model": "grok-4.20-reasoning",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "A fault-tolerant global payment platform should adopt a multi-region active-active architecture...",
        "role": "assistant",
        "thinking_blocks": [
          {
            "type": "thinking",
            "thinking": "Let me break down the requirements: global reach, fault tolerance, payment-grade reliability..."
          }
        ],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 1420,
    "prompt_tokens": 25,
    "total_tokens": 1445,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "text_tokens": 25
    }
  },
  "estimated_cost": {
    "unit": "0.0085700000",
    "irt": 982.13,
    "exchange_rate": 114600
  }
}
```

### GPT-Image-2 Generation Example

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A modernist editorial poster titled \"Typography\" that celebrates global scripts including Japanese, Arabic, Korean, and Latin letterforms, in red, blue, and black tones.",
    "size": "1024x1024",
    "n": 1
  }'
```

**Example Response:**

```json
{
  "created": 1776321700,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zU...[TRUNCATED]",
      "revised_prompt": "A modernist editorial poster..."
    }
  ],
  "usage": {
    "input_tokens": 32,
    "input_tokens_details": {
      "text_tokens": 32,
      "image_tokens": 0
    },
    "output_tokens": 4160,
    "total_tokens": 4192
  },
  "estimated_cost": {
    "unit": "0.1249600000",
    "irt": 14320.22,
    "exchange_rate": 114600
  }
}
```

### GPT-Image-2 Edit Example

```bash
curl https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=gpt-image-2" \
  -F "image=@input.png" \
  -F "prompt=Add a gold Art Deco frame and soft sunrise lighting" \
  -F "size=1024x1024"
```

### Qwen3.6-Flash with Thinking Mode

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.6-flash",
    "messages": [
      {
        "role": "user",
        "content": "Implement a binary search tree in Python with insert, delete, and in-order traversal methods."
      }
    ],
    "extra_body": {
      "enable_thinking": true
    },
    "stream": true
  }'
```

### Qwen3.6-Max-Preview Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.6-max-preview",
    "messages": [
      {
        "role": "user",
        "content": "Build a polished Next.js landing page for a SaaS product with hero, features, testimonials, and pricing sections."
      }
    ],
    "max_tokens": 8192
  }'
```

### Kimi K2.6 Agent Swarm Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.6",
    "messages": [
      {
        "role": "user",
        "content": "Build a full-stack task management web application with user authentication, real-time updates, and a clean modern UI."
      }
    ],
    "max_tokens": 8192
  }'
```

### Gemini Embedding 2 Example (Text)

```bash
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-embedding-2",
    "input": "task: search result | query: What is the meaning of life?",
    "dimensions": 768
  }'
```

**Example Response:**

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        0.0123,
        -0.0456,
        0.0789,
        "...[TRUNCATED 768 values]"
      ]
    }
  ],
  "model": "gemini-embedding-2",
  "usage": {
    "prompt_tokens": 14,
    "total_tokens": 14
  },
  "estimated_cost": {
    "unit": "0.0000028000",
    "irt": 0.32,
    "exchange_rate": 114600
  }
}
```

### Gemini Embedding 2 Multimodal via OpenAI-Compatible Endpoint

The `v1/embeddings` endpoint accepts multimodal inputs (images, audio, video) as `data:` URIs in the `input` array:

```bash
# Text + Image (base64 data URI) via OpenAI-compatible endpoint
curl -i "https://api.avalai.ir/v1/embeddings" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": [
      "The food was delicious and the waiter...",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
    ],
    "model": "gemini-embedding-2"
  }'
```

```bash
# Text + Audio (base64 data URI) via OpenAI-compatible endpoint
AUDIO_PATH="./speech.mp3"
AUDIO_BASE64="$(base64 -i "$AUDIO_PATH" | tr -d '\n')"

cat >/tmp/embeddings-audio.json <<EOF
{
  "input": [
    "The food was delicious and the waiter...",
    "data:audio/mpeg;base64,${AUDIO_BASE64}"
  ],
  "model": "gemini-embedding-2"
}
EOF

curl -i "https://api.avalai.ir/v1/embeddings" \
  -H "Authorization: Bearer ${AVALAI_API_KEY}" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/embeddings-audio.json
```

```bash
# Text + Video (base64 data URI) via OpenAI-compatible endpoint
VIDEO_PATH="./sample_video.mp4"
VIDEO_BASE64="$(base64 -i "$VIDEO_PATH" | tr -d '\n')"

cat >/tmp/embeddings-video.json <<EOF
{
  "input": [
    "The food was delicious and the waiter...",
    "data:video/mp4;base64,${VIDEO_BASE64}"
  ],
  "model": "gemini-embedding-2"
}
EOF

curl -i "https://api.avalai.ir/v1/embeddings" \
  -H "Authorization: Bearer ${AVALAI_API_KEY}" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/embeddings-video.json
```

### Gemini Embedding 2 via Native Gemini API (`v1beta`)

`gemini-embedding-2` is also available via the native Gemini `v1beta/models/{model}:embedContent` endpoint, which accepts `inline_data` parts for images, audio, video, and PDFs.

**Text embedding (native API):**

```bash
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-2:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: ${AVALAI_API_KEY}" \
  -d '{
    "model": "gemini-embedding-2",
    "content": {
      "parts": [{
        "text": "What is the meaning of life?"
      }]
    }
  }'
```

**Image embedding (native API):**

```bash
IMG_PATH="./sample_image.jpg"
# macOS: IMG_BASE64="$(base64 -i "$IMG_PATH" | tr -d '\n')"
IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

cat >/tmp/payload.json <<EOF
{
  "content": {
    "parts": [
      {
        "inline_data": {
          "mime_type": "image/png",
          "data": "${IMG_BASE64}"
        }
      }
    ]
  }
}
EOF

curl -sS "https://api.avalai.ir/v1beta/models/gemini-embedding-2:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: ${AVALAI_API_KEY}" \
  --data-binary @/tmp/payload.json
```

**Audio embedding (native API):**

```bash
AUDIO_PATH="./speech.mp3"
AUDIO_BASE64="$(base64 -i "$AUDIO_PATH" | tr -d '\n')"

curl -sS "https://api.avalai.ir/v1beta/models/gemini-embedding-2:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: ${AVALAI_API_KEY}" \
  -d '{
    "content": {
      "parts": [{
        "inline_data": {
          "mime_type": "audio/mpeg",
          "data": "'"${AUDIO_BASE64}"'"
        }
      }]
    }
  }'
```

**Video embedding (native API):**

```bash
VIDEO_PATH="./sample_video.mp4"
VIDEO_BASE64="$(base64 -i "$VIDEO_PATH" | tr -d '\n')"

curl -sS "https://api.avalai.ir/v1beta/models/gemini-embedding-2:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: ${AVALAI_API_KEY}" \
  --data-binary @- <<EOF
{
  "content": {
    "parts": [
      {
        "inline_data": {
          "mime_type": "video/mp4",
          "data": "${VIDEO_BASE64}"
        }
      }
    ]
  }
}
EOF
```

**Text + Image aggregation (native API):**

```bash
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-2:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -d '{
    "content": {
      "parts": [
        {"text": "An image of a dog"},
        {
          "inline_data": {
            "mime_type": "image/png",
            "data": "iVBORw0KGgo...[TRUNCATED]"
          }
        }
      ]
    }
  }'
```

> **Note**: When multiple parts are provided in a single request, `gemini-embedding-2` returns a single aggregated embedding. Use the Batch API or multiple requests if you need separate embeddings per input.

---

## SDK Usage Examples

### Chat Completions (Grok, Qwen, Kimi)

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.6",
    "messages": [
      {
        "role": "user",
        "content": "Build a minimalist personal portfolio website with a hero section, projects grid, and contact form."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using Kimi K2.6 for full-stack coding
response = client.chat.completions.create(
    model="kimi-k2.6",
    messages=[
        {
            "role": "user",
            "content": "Build a minimalist personal portfolio website with a hero section, projects grid, and contact form.",
        }
    ],
)

print(response.choices[0].message.content)

# Using Grok 4.20 Reasoning
response = client.chat.completions.create(
    model="grok-4.20-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a fault-tolerant distributed system architecture.",
        }
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)

# Using Qwen3.6-Flash with thinking mode
response = client.chat.completions.create(
    model="qwen3.6-flash",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum entanglement with practical implications.",
        }
    ],
    extra_body={"enable_thinking": True},
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Using Kimi K2.6
const kimiResponse = await client.chat.completions.create({
  model: "kimi-k2.6",
  messages: [
    {
      role: "user",
      content: "Build a minimalist personal portfolio website with a hero section, projects grid, and contact form.",
    },
  ],
});

console.log(kimiResponse.choices[0].message.content);

// Using Qwen3.6-Max-Preview
const qwenResponse = await client.chat.completions.create({
  model: "qwen3.6-max-preview",
  messages: [
    {
      role: "user",
      content: "Build a polished Next.js landing page for a SaaS product.",
    },
  ],
  max_tokens: 8192,
});

console.log(qwenResponse.choices[0].message.content);

```

### Image Generation (GPT-Image-2)

```language-selector
bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A Bauhaus-inspired poster with bold typography and geometric shapes in red, blue, and black.",
    "size": "1024x1024",
    "n": 1
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="gpt-image-2",
    prompt="A Bauhaus-inspired poster with bold typography and geometric shapes in red, blue, and black.",
    size="1024x1024",
    n=1,
)

print(response.data[0].b64_json[:100] + "...")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "gpt-image-2",
  prompt: "A Bauhaus-inspired poster with bold typography and geometric shapes in red, blue, and black.",
  size: "1024x1024",
  n: 1,
});

console.log(response.data[0].b64_json.slice(0, 100) + "...");

```

### Embeddings (Gemini Embedding 2)

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-embedding-2",
    "input": "task: search result | query: What is the meaning of life?",
    "dimensions": 768
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    model="gemini-embedding-2",
    input="task: search result | query: What is the meaning of life?",
    dimensions=768,
)

print(f"Embedding length: {len(response.data[0].embedding)}")
print(f"First 5 values: {response.data[0].embedding[:5]}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.embeddings.create({
  model: "gemini-embedding-2",
  input: "task: search result | query: What is the meaning of life?",
  dimensions: 768,
});

console.log(`Embedding length: ${response.data[0].embedding.length}`);
console.log(`First 5 values:`, response.data[0].embedding.slice(0, 5));

```

---

## Documentation Links

- [X.AI Models Documentation](en/providers/xai.md)
- [OpenAI Models Documentation](en/providers/openai.md)
- [Alibaba Models Documentation](en/providers/alibaba.md)
- [Moonshot AI Models Documentation](en/providers/moonshotai.md)
- [Google Models Documentation](en/providers/google.md)
- [Pricing Details](en/pricing.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Images API Reference](en/api-reference/images.md)
- [Embeddings API Reference](en/api-reference/embeddings.md)
- [Native Gemini v1beta API Reference](en/api-reference/v1beta.md)
