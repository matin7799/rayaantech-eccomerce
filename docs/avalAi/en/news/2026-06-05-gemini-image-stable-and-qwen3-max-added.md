# New Models Added: Gemini 3 Pro Image, Gemini 3.1 Flash Image Stable, and Qwen3-Max

**Date:** 2026-06-05 / (1405-03-15)

## Summary

We announce the addition of three new models. Google's [`gemini-3-pro-image`](en/providers/google.md) (Nano Banana Pro) and [`gemini-3.1-flash-image`](en/providers/google.md) (Nano Banana 2) are now available as stable aliases, graduating from their preview releases with identical capabilities and pricing. Alibaba's [`qwen3-max`](en/providers/alibaba.md) flagship model is also available for complex reasoning and agentic workflows.

---

## Details

### Google (Gemini)

#### Gemini 3 Pro Image (Nano Banana Pro) — Stable Release

[`gemini-3-pro-image`](en/providers/google.md) is the stable release of [`gemini-3-pro-image-preview`](en/providers/google.md), previously announced in our [November 20, 2025 update](en/news/2025-11-20-gemini-3-pro-image-groq-provider-added.md). The stable alias delivers the same capabilities and pricing as the preview model, providing a reliable option for professional, production-grade image generation and editing. It remains the leading model for rendering Persian characters in images with near-perfect accuracy.

| Feature | Details |
|---------|---------|
| Model ID | `gemini-3-pro-image` |
| Alias | Nano Banana Pro |
| Max output | Images up to 4K resolution (4096x4096px), plus text responses |
| Inputs | Text prompts, reference images |
| Outputs | Images (1K-4K resolution) and text |
| Input pricing | $2.00 / 1M tokens (text), $2.00 / 1M tokens (image input, ~$0.067 per image) |
| Cached input pricing | $0.50 / 1M tokens |
| Output pricing | $12.00 / 1M tokens (text), $0.134 per 1K-2K image, $0.24 per 4K image |
| Supported endpoints | `v1/chat/completions`, `v1beta/` |

**Key Features:**
- **Advanced Text Rendering**: Renders clear, legible text in images including Persian characters with near-perfect accuracy
- **Studio-Quality Control**: Fine control over composition, lighting, color grading, and aspect ratios
- **Real-World Knowledge**: Leverages Google Search for accurate, grounded image generation
- **Resolution Support**: Generate images up to 4K resolution (4096x4096px)
- **Image Editing**: Comprehensive editing including aspect ratio adjustments, lighting changes, and subject consistency
- **Default "Thinking" Process**: Refines composition before generation for optimal results
- **Production-Ready**: Stable alias suitable for long-term integrations

#### Gemini 3.1 Flash Image (Nano Banana 2) — Stable Release

[`gemini-3.1-flash-image`](en/providers/google.md) is the stable release of [`gemini-3.1-flash-image-preview`](en/providers/google.md), previously announced in our [February 27, 2026 update](en/news/2026-02-27-gemini-3-1-flash-image-preview-added.md). The stable alias delivers high-fidelity image generation and advanced editing optimized for speed and high-volume developer workflows, serving as the high-efficiency counterpart to Gemini 3 Pro Image.

| Feature | Details |
|---------|---------|
| Model ID | `gemini-3.1-flash-image` |
| Alias | Nano Banana 2 |
| Max output | Images up to 4K resolution (4096x4096px), plus text responses |
| Inputs | Text prompts, reference images |
| Outputs | Images (512px-4K resolution) and text |
| Input pricing | $0.50 / 1M tokens (text), $0.50 / 1M tokens (image input) |
| Cached input pricing | $0.25 / 1M tokens |
| Output pricing | $3.00 / 1M tokens (text), $60.00 / 1M tokens (image output) |
| Per-image pricing | $0.0672 per 1K-2K image, $0.101 per 2K-4K image, $0.151 per 4K image |
| Supported endpoints | `v1/chat/completions`, `v1beta/` |

**Key Features:**
- **Improved World Knowledge**: Leverages broad world knowledge with web search grounding for enhanced visuals
- **Advanced Text Rendering**: Reliable, crisp text rendering with in-image localization supporting multiple languages
- **Greater Creative Control**: Vibrant lighting, richer textures, sharper details with configurable thinking levels
- **Native Aspect Ratios**: Support for all existing ratios plus 4:1, 1:4, 8:1, and 1:8 ratios
- **New 512px Resolution**: Optimized for efficiency with minimal latency for rapid iterations
- **Google Image Search Grounding**: Generate images based on real-world image references

#### Understanding the Nano Banana Family

**Nano Banana** is the name for Gemini's native image generation capabilities. Gemini can generate and process images conversationally with text, images, or a combination of both:

- **Nano Banana 2** (`gemini-3.1-flash-image`): The high-efficiency counterpart to Gemini 3 Pro Image, optimized for speed and high-volume developer use cases
- **Nano Banana Pro** (`gemini-3-pro-image`): Designed for professional asset production with advanced reasoning ("Thinking") for complex instructions and high-fidelity text
- **Nano Banana** (`gemini-2.5-flash-image`): Designed for speed and efficiency, optimized for high-volume, low-latency tasks

### Alibaba (Qwen)

#### Qwen3-Max

[`qwen3-max`](en/providers/alibaba.md) is Alibaba's flagship proprietary model from the Qwen3 Max series, designed for the most demanding applications. It offers superior reasoning, enhanced agent programming, and strong performance on complex multi-step problem-solving and tool-use workflows.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3-max` |
| Context window | 262,144 tokens |
| Max output | 32,768 tokens |
| Input pricing | $1.20 / 1M tokens |
| Cached input pricing | $0.10 / 1M tokens |
| Output pricing | $6.00 / 1M tokens |
| Tiered pricing | Above 32K: $2.40 / $12.00, Above 128K: $3.00 / $15.00 |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` (partial) |

**Key Features:**
- **Enhanced Agent Programming**: Optimized for agentic coding and complex tool-use scenarios
- **Superior Reasoning**: Strong performance on demanding reasoning and problem-solving tasks
- **Large Context Window**: 262,144 tokens for extensive conversations and documents
- **Real-Time Web Search**: Supports web search for up-to-date information (set search strategy to `agent` for international regions)
- **Hybrid Thinking**: Optional reasoning mode via `enable_thinking` (streaming only)

---

## Pricing Summary

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) | Special Pricing |
|-------|---------------------|----------------------------|----------------------|-----------------|
| `gemini-3-pro-image` | $2.00 (text), $2.00 (image) | $0.50 | $12.00 (text), $120.00 (image) | $0.134 per 1K-2K image, $0.24 per 4K image |
| `gemini-3.1-flash-image` | $0.50 (text), $0.50 (image) | $0.25 | $3.00 (text), $60.00 (image) | $0.0672 (1K-2K), $0.101 (2K-4K), $0.151 (4K) per image |
| `qwen3-max` | $1.20 | $0.10 | $6.00 | Above 32K: $2.40/$12.00, Above 128K: $3.00/$15.00 |

---

## API Request/Response Examples

### Gemini 3 Pro Image (OpenAI-Compatible)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "messages": [
      {
        "role": "user",
        "content": "Create a minimalist poster with Persian text that says \"هوش مصنوعی\" (Artificial Intelligence) in a modern, tech-inspired style with blue and white colors"
      }
    ],
    "modalities": ["image", "text"]
  }' | jq '.choices[0].message.images[0].image_url.url |= (.[0:100] + "...[TRUNCATED]")'
```

**Response:**

```json
{
  "id": "chatcmpl-xyz123",
  "created": 1780000000,
  "model": "gemini-3-pro-image",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "I've created a minimalist tech-inspired poster featuring the Persian text \"هوش مصنوعی\" in a modern style with blue and white colors.",
        "role": "assistant",
        "images": [
          {
            "image_url": {
              "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zU...[TRUNCATED]",
              "detail": "auto"
            },
            "index": 0,
            "type": "image_url"
          }
        ],
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 1150,
    "prompt_tokens": 32,
    "total_tokens": 1182,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 32,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.1558000000",
    "irt": 17864.68,
    "exchange_rate": 114600
  }
}
```

### Gemini 3 Pro Image (Native Gemini API)

You can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) endpoint:

```bash
GEMINI_API_KEY="$AVALAI_API_KEY"
MODEL_ID="gemini-3-pro-image"
GENERATE_CONTENT_API="generateContent"

cat <<EOF >request.json
{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "a cat"
          }
        ]
      }
    ],
    "generationConfig": {
      "responseModalities": ["IMAGE", "TEXT"]
    }
}
EOF

curl \
  -X POST \
  -H "Content-Type: application/json" \
  "https://api.avalai.ir/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
  -d '@request.json' \
  --output response.json
```

### Gemini 3.1 Flash Image (Native Gemini API)

```bash
GEMINI_API_KEY="$AVALAI_API_KEY"
MODEL_ID="gemini-3.1-flash-image"
GENERATE_CONTENT_API="generateContent"

cat <<EOF >request.json
{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "a cat"
          }
        ]
      }
    ],
    "generationConfig": {
      "responseModalities": ["IMAGE", "TEXT"]
    }
}
EOF

curl \
  -X POST \
  -H "Content-Type: application/json" \
  "https://api.avalai.ir/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
  -d '@request.json' \
  --output response.json
```

### Qwen3-Max Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-max",
    "messages": [
      {
        "role": "user",
        "content": "Design an intelligent agent system that can autonomously manage complex multi-step workflows with tool invocation capabilities."
      }
    ],
    "max_tokens": 2000
  }'
```

**Response:**

```json
{
  "id": "chatcmpl-abc789",
  "created": 1780000000,
  "model": "qwen3-max",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a comprehensive design for an intelligent agent system...",
        "role": "assistant",
        "tool_calls": null
      }
    }
  ],
  "usage": {
    "completion_tokens": 512,
    "prompt_tokens": 24,
    "total_tokens": 536,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "cached_tokens": 0
    }
  },
  "estimated_cost": {
    "unit": "0.0031008000",
    "irt": 355.35,
    "exchange_rate": 114600
  }
}
```

---

## SDK Usage Examples

### Gemini Image Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.1-flash-image",
    "messages": [
      {
        "role": "user",
        "content": "Create a modern logo for a tech company called \"AvalAI\" with clean typography and a minimalist design"
      }
    ],
    "modalities": ["image", "text"]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3.1-flash-image",
    messages=[
        {
            "role": "user",
            "content": 'Create a modern logo for a tech company called "AvalAI" with clean typography and a minimalist design',
        }
    ],
    extra_body={"modalities": ["image", "text"]},
)

# Access the generated image
if hasattr(response.choices[0].message, "images"):
    images = getattr(response.choices[0].message, "images")
    for img in images:
        print(f"Image URL: {img.image_url.url[:100]}...")

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3.1-flash-image",
  messages: [
    {
      role: "user",
      content: "Create a modern logo for a tech company called \"AvalAI\" with clean typography and a minimalist design",
    },
  ],
  modalities: ["image", "text"],
});

// Access the generated image
if (response.choices[0].message.images) {
  const images = response.choices[0].message.images;
  images.forEach((img, idx) => {
    console.log(`Image ${idx}: ${img.image_url.url.substring(0, 100)}...`);
  });
}

console.log(response.choices[0].message.content);

```

### Qwen3-Max

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-max",
    "messages": [
      {
        "role": "user",
        "content": "Perform a comprehensive analysis of quantum computing's potential impact on cryptography."
      }
    ],
    "max_tokens": 2000
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {
            "role": "user",
            "content": "Perform a comprehensive analysis of quantum computing's potential impact on cryptography.",
        }
    ],
    max_tokens=2000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "qwen3-max",
  messages: [
    {
      role: "user",
      content: "Perform a comprehensive analysis of quantum computing's potential impact on cryptography.",
    },
  ],
  max_tokens: 2000,
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [Google Models Documentation](en/providers/google.md)
- [Alibaba Models Documentation](en/providers/alibaba.md)
- [Nano Banana Series Guide](en/examples/generate_images_with_nano_banana_series.md)
- [Native Gemini API Reference](en/api-reference/v1beta.md)
- [Pricing Information](en/pricing.md)
