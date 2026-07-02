# Gemini 3 Pro Image Preview and groq Provider Support Added

**Date:** 2025-11-20 / (1404-08-30)

## Summary

We announce the addition of Google's Gemini 3 Pro Image Preview (Nano Banana Pro) model and support for groq as a new provider. The Gemini 3 Pro Image Preview offers advanced image generation and editing capabilities with exceptional text rendering, particularly excelling at Persian character generation. groq provides the fastest inference speed for open-weight models with 14 new models now available through AvalAI.

---

## Details

### Google Gemini 3 Pro Image Preview

Google's [`gemini-3-pro-image-preview`](en/providers/google.md) (also known as "Nano Banana Pro") is now available through AvalAI. This model represents a significant advancement in image generation technology, particularly for text-in-image rendering and Persian character support.

**Model Name:** `gemini-3-pro-image-preview`  
**Alias:** Nano Banana Pro

#### Key Features

- **Advanced Text Rendering**: Generate clear, legible text in images including Persian characters with near-perfect accuracy
- **Studio-Quality Control**: Fine control over composition, lighting, color grading, and aspect ratios
- **Real-World Knowledge**: Leverages Google Search for accurate, grounded image generation
- **Resolution Support**: Generate images up to 4K resolution (4096x4096px)
- **Image Editing**: Comprehensive editing capabilities including aspect ratio adjustments, lighting changes, and subject consistency
- **Default "Thinking" Process**: Refines composition before generation for optimal results
- **Multi-Language Support**: Exceptional capability for localizing designs across different languages
- **Professional Asset Production**: Designed for studio-quality professional use cases

#### Pricing

| Type | Cost |
|------|------|
| Input Text | $2.00 per 1M tokens |
| Input Image | $2.00 per 1M tokens ($0.067 per image at 560 tokens) |
| Cached Input | $0.50 per 1M tokens |
| Output Text | $12.00 per 1M tokens |
| Output Image (1K-2K) | $0.134 per image |
| Output Image (4K) | $0.24 per image |

**Note:** Image output is priced at $120 per 1M tokens. Output images from 1024x1024px (1K) to 2048x2048px (2K) consume 1120 tokens. Output images up to 4096x4096px (4K) consume 2000 tokens.

#### Unique Capabilities

The [`gemini-3-pro-image-preview`](en/providers/google.md) model is the first image generation model to render Persian characters almost perfectly, making it the best image generation model for Persian language content creation. This breakthrough enables designers and developers to create localized marketing materials, posters, and infographics with accurate Persian text rendering.

#### API Request/Response Examples

**Using Chat Completions Endpoint:**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image-preview",
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
  "created": 1732147200,
  "model": "gemini-3-pro-image-preview",
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

#### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image-preview",
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
    model="gemini-3-pro-image-preview",
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
  model: "gemini-3-pro-image-preview",
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

#### Image Editing Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Change the aspect ratio to 16:9 while keeping the subject centered"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/original-image.jpg"
            }
          }
        ]
      }
    ],
    "modalities": ["image", "text"]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3-pro-image-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Change the aspect ratio to 16:9 while keeping the subject centered",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/original-image.jpg"},
                },
            ],
        }
    ],
    extra_body={"modalities": ["image", "text"]},
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3-pro-image-preview",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Change the aspect ratio to 16:9 while keeping the subject centered",
        },
        {
          type: "image_url",
          image_url: { url: "https://example.com/original-image.jpg" },
        },
      ],
    },
  ],
  modalities: ["image", "text"],
});

console.log(response.choices[0].message.content);

```

---

### groq Provider Support

We announce support for groq (groq.com) as a new provider, offering the fastest inference speed for open-weight models. groq's specialized hardware architecture delivers exceptional performance for real-time AI applications.

#### Available Models

We've added 14 models from groq across multiple categories:

**Safety & Content Moderation Models:**
- **`groq.llama-guard-4-12b`**: Advanced content moderation model
- **`groq.llama-prompt-guard-2-22m`**: Lightweight prompt injection detection (22M parameters)
- **`groq.llama-prompt-guard-2-86m`**: Enhanced prompt injection detection (86M parameters)

**Large Language Models:**
- **`groq.llama-4-maverick-17b-128e-instruct`**: Advanced Llama 4 model with 128 experts
- **`groq.llama-4-scout-17b-16e-instruct`**: Efficient Llama 4 model with 16 experts
- **`groq.kimi-k2-instruct-0905`**: Kimi K2 instruction-following model
- **`groq.gpt-oss-120b`**: Large open-source GPT model (120B parameters)
- **`groq.gpt-oss-20b`**: Efficient open-source GPT model (20B parameters)
- **`groq.gpt-oss-safeguard-20b`**: Safety-enhanced GPT model (20B parameters)
- **`groq.qwen3-32b`**: Qwen 3 multilingual model (32B parameters)

**Audio Models:**
- **`groq.playai-tts`**: High-quality text-to-speech synthesis
- **`groq.playai-tts-arabic`**: Arabic-optimized text-to-speech
- **`groq.whisper-large-v3`**: Advanced speech recognition model
- **`groq.whisper-large-v3-turbo`**: Faster speech recognition with maintained accuracy

#### Key Features

- **Ultra-Fast Inference**: Industry-leading inference speeds powered by groq's custom hardware
- **Open-Weight Models**: Access to popular open-source models with production-ready performance
- **Competitive Pricing**: Cost-effective options with prompt caching support
- **Diverse Capabilities**: From safety moderation to multilingual text generation and audio processing
- **Production Ready**: Enterprise-grade reliability and performance

#### Pricing

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| groq.llama-guard-4-12b | $0.20/1M tokens | $0.10/1M tokens | $0.20/1M tokens | - |
| groq.llama-prompt-guard-2-22m | $0.03/1M tokens | $0.015/1M tokens | $0.03/1M tokens | - |
| groq.llama-prompt-guard-2-86m | $0.04/1M tokens | $0.02/1M tokens | $0.04/1M tokens | - |
| groq.llama-4-maverick-17b-128e-instruct | $0.20/1M tokens | $0.10/1M tokens | $0.60/1M tokens | - |
| groq.llama-4-scout-17b-16e-instruct | $0.11/1M tokens | $0.055/1M tokens | $0.34/1M tokens | - |
| groq.kimi-k2-instruct-0905 | $1.00/1M tokens | $0.50/1M tokens | $0.34/1M tokens | - |
| groq.gpt-oss-120b | $0.15/1M tokens | $0.075/1M tokens | $0.75/1M tokens | - |
| groq.gpt-oss-20b | $0.075/1M tokens | $0.0375/1M tokens | $0.30/1M tokens | - |
| groq.gpt-oss-safeguard-20b | $0.075/1M tokens | $0.0375/1M tokens | $0.30/1M tokens | - |
| groq.playai-tts | $50.00/1M chars | - | - | $0.00005 per character |
| groq.playai-tts-arabic | $50.00/1M chars | - | - | $0.00005 per character |
| groq.qwen3-32b | $0.29/1M tokens | $0.145/1M tokens | $0.59/1M tokens | - |
| groq.whisper-large-v3 | - | - | $0.00185/1M tokens | $0.000031 per second |
| groq.whisper-large-v3-turbo | - | - | $0.000067/1M tokens | $0.00001111 per second |

#### API Request/Response Examples

**Text Generation Example:**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "groq.llama-4-maverick-17b-128e-instruct",
    "messages": [
      {
        "role": "user",
        "content": "Explain the benefits of fast AI inference in production systems."
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

**Response:**

```json
{
  "id": "chatcmpl-abc789",
  "created": 1732147200,
  "model": "groq.llama-4-maverick-17b-128e-instruct",
  "object": "chat.completion",
  "system_fingerprint": "fp_groq_v1",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Fast AI inference in production systems offers several key benefits:\n\n1. **Reduced Latency**: Quick response times improve user experience...",
        "role": "assistant",
        "tool_calls": null
      }
    }
  ],
  "usage": {
    "completion_tokens": 256,
    "prompt_tokens": 18,
    "total_tokens": 274,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "cached_tokens": 0
    }
  },
  "estimated_cost": {
    "unit": "0.0001572000",
    "irt": 18.01,
    "exchange_rate": 114600
  }
}
```

#### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "groq.llama-4-maverick-17b-128e-instruct",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to calculate prime numbers."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="groq.llama-4-maverick-17b-128e-instruct",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to calculate prime numbers.",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "groq.llama-4-maverick-17b-128e-instruct",
  messages: [
    {
      role: "user",
      content: "Write a Python function to calculate prime numbers.",
    },
  ],
});

console.log(response.choices[0].message.content);

```

#### Content Moderation Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "groq.llama-guard-4-12b",
    "messages": [
      {
        "role": "user",
        "content": "Check if this content is safe: [content to moderate]"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="groq.llama-guard-4-12b",
    messages=[
        {
            "role": "user",
            "content": "Check if this content is safe: [content to moderate]",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "groq.llama-guard-4-12b",
  messages: [
    {
      role: "user",
      content: "Check if this content is safe: [content to moderate]",
    },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [Google Models Documentation](en/providers/google.md)
- [groq Models Documentation](en/providers/groq.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [API Pricing](en/pricing.md)
- [Model Selection Guide](en/guides/model-selection.md)