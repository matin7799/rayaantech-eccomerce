# New Models Added: GLM-4.7 from Z.AI and Alibaba Qwen Vision, Translation, and Image Models

**Date:** 2025-12-23 / (1404-10-02)

## Summary

AvalAI introduces GLM-4.7 from Z.AI with enhanced coding and reasoning capabilities, plus nine new Alibaba Qwen models including Qwen3-VL vision models, Qwen-MT translation models, Z-Image-Turbo for fast image generation, Qwen-Plus-Character for role-playing, and Qwen-Image-Edit-Plus for image editing.

---

## Details

### Z.AI - GLM-4.7

GLM-4.7 is Z.AI's latest flagship model, featuring upgrades in enhanced programming capabilities and more stable multi-step reasoning/execution. It demonstrates significant improvements in executing complex agent tasks while delivering more natural conversational experiences and superior front-end aesthetics. [Documentation](en/providers/zai.md)

**Key Capabilities:**

- **Enhanced Programming**: Substantially improved performance in multi-language coding and terminal agent applications with "think before acting" mechanism
- **Superior Frontend Aesthetics**: Marked progress in frontend generation quality, producing visually superior webpages, PPTs, and posters
- **Advanced Tool Invocation**: Improved tool calling with 84.7 points on τ²-Bench, surpassing Claude Sonnet 4.5
- **Enhanced Reasoning**: 42.8% on HLE benchmark—a 41% increase over GLM-4.6, surpassing GPT-5.1
- **Context Caching**: Intelligent caching mechanism to optimize performance in long conversations

| Feature | Details |
|---------|---------|
| Model ID | `glm-4.7` |
| Context Window | 200,000 tokens |
| Maximum Output | 128,000 tokens |
| Input Modalities | Text |
| Output Modalities | Text |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Context Caching |
| Best for | AI coding tools (Claude Code, Cline, Roo Code), agentic workflows, smart office |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.60 |
| Cached Input | $0.11 |
| Output | $2.20 |

---

### Alibaba - New Vision Language Models (Qwen3-VL)

Three new Qwen3-VL models for advanced vision-language tasks including high-precision object recognition, agent tool calling, document parsing, and video understanding. [Documentation](en/providers/alibaba.md)

#### qwen3-vl-32b-instruct

A balanced vision-language model with 32 billion parameters for efficient vision processing tasks.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3-vl-32b-instruct` |
| Context Window | 131,072 tokens |
| Max Input Tokens | 129,024 |
| Max Output Tokens | 8,192 |
| Capabilities | Vision, Text, Video Understanding, OCR, Object Detection |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.16 |
| Cached Input | $0.08 |
| Output | $0.64 |

#### qwen3-vl-plus

The most powerful model in the Qwen3-VL series with enhanced capabilities for complex vision tasks.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3-vl-plus` |
| Context Window | 131,072 tokens |
| Max Input Tokens | 129,024 |
| Max Output Tokens | 8,192 |
| Capabilities | Vision, Text, Video Understanding, 3D Localization, Document Parsing |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Pricing (Tiered based on context length):**

| Token Type | Standard | Above 32K | Above 128K |
|------------|----------|-----------|------------|
| Input | $0.20 | $0.30 | $0.60 |
| Cached Input | $0.10 | $0.15 | $0.30 |
| Output | $1.60 | $2.40 | $4.80 |

#### qwen3-vl-flash

A fast and cost-effective vision-language model optimized for response speed while maintaining quality.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3-vl-flash` |
| Context Window | 131,072 tokens |
| Max Input Tokens | 129,024 |
| Max Output Tokens | 8,192 |
| Capabilities | Vision, Text, Video Understanding, OCR |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Pricing (Tiered based on context length):**

| Token Type | Standard | Above 32K | Above 128K |
|------------|----------|-----------|------------|
| Input | $0.05 | $0.075 | $0.12 |
| Cached Input | $0.01 | $0.015 | $0.024 |
| Output | $0.40 | $0.60 | $0.96 |

---

### Alibaba - Machine Translation Models (Qwen-MT)

Two new specialized translation models supporting 92 languages with term intervention, translation memory, and domain prompting features. [Documentation](en/providers/alibaba.md)

#### qwen-mt-flash

A balanced translation model optimized for quality, speed, and cost with incremental streaming output support.

| Feature | Details |
|---------|---------|
| Model ID | `qwen-mt-flash` |
| Context Window | 8,192 tokens |
| Supported Languages | 92 languages |
| Features | Term Intervention, Translation Memory, Domain Prompting, Streaming |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.16 |
| Cached Input | $0.08 |
| Output | $0.49 |

#### qwen-mt-lite

The fastest translation model optimized for real-time scenarios with minimal latency.

| Feature | Details |
|---------|---------|
| Model ID | `qwen-mt-lite` |
| Context Window | 8,192 tokens |
| Supported Languages | 31 languages |
| Features | Term Intervention, Translation Memory, Streaming |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.12 |
| Cached Input | $0.06 |
| Output | $0.36 |

---

### Alibaba - Role-Playing Model

#### qwen-plus-character

A specialized model for personalized chat scenarios including virtual social interactions, game NPCs, IP recreations, and character-driven conversations. [Documentation](en/providers/alibaba.md)

| Feature | Details |
|---------|---------|
| Model ID | `qwen-plus-character` |
| Context Window | 8,192 tokens |
| Capabilities | Character Portrayal, Topic Progression, Empathetic Listening |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |
| Best for | Virtual characters, Game NPCs, Interactive storytelling, Brand personification |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.50 |
| Cached Input | $0.05 |
| Output | $1.40 |

---

### Alibaba - Image Generation Models

Two new image generation and editing models with fast processing and advanced features. [Documentation](en/providers/alibaba.md)

#### z-image-turbo

A lightweight model for fast image generation with Chinese and English text rendering support.

| Feature | Details |
|---------|---------|
| Model ID | `z-image-turbo` |
| Max Resolution | 2048×2048 pixels |
| Supported Sizes | 1:1, 2:3, 3:2, 3:4, 4:3, 7:9, 9:7, 9:16, 16:9, 9:21, 21:9 |
| Features | Text Rendering, Intelligent Prompt Rewriting, Seed Control |
| Supported Endpoints | `v1/images/generations` |
| Best for | Fast image generation, Marketing creatives, Text-in-image |

**Pricing:**

| Mode | Cost per Image |
|------|----------------|
| Standard | $0.015 |
| With Thinking (prompt_extend=true) | $0.030 |

#### qwen-image-edit-plus

An advanced image editing model with enhanced capabilities, the newer version of qwen-image-edit.

| Feature | Details |
|---------|---------|
| Model ID | `qwen-image-edit-plus` |
| Capabilities | Image Editing, Image Inpainting, Style Transfer |
| Supported Endpoints | `v1/images/generations`, `v1/images/edits` |
| Best for | Image enhancement, Creative editing, Style modifications |

**Pricing:**

| Component | Cost |
|-----------|------|
| Per Image | $0.03 |

---

## API Request/Response Examples

### GLM-4.7 Chat Completion

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7",
    "messages": [
      {
        "role": "user",
        "content": "Create a React component for a responsive dashboard with charts"
      }
    ],
    "thinking": {
      "type": "enabled"
    },
    "max_tokens": 4096,
    "temperature": 0.6
  }'
```

**Example Response:**

```json
{
  "id": "chatcmpl-glm47-abc123",
  "created": 1766493600,
  "model": "glm-4.7",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a comprehensive React dashboard component with responsive charts...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 1250,
    "prompt_tokens": 18,
    "total_tokens": 1268
  },
  "estimated_cost": {
    "unit": "0.0027608000",
    "irt": 362.72,
    "exchange_rate": 131400
  }
}
```

### Qwen3-VL-Plus Vision Analysis

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-vl-plus",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/document.png"
            }
          },
          {
            "type": "text",
            "text": "Extract all text from this document and format as JSON"
          }
        ]
      }
    ]
  }'
```

### Z-Image-Turbo Image Generation

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "z-image-turbo",
    "prompt": "A modern minimalist logo design with the text AVALAI in elegant typography, professional branding style",
    "size": "1024x1024",
    "n": 1
  }'
```

**Example Response:**

```json
{
  "created": 1766493600,
  "data": [
    {
      "url": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png?Expires=xxx"

    }
  ],
  "estimated_cost": {
    "unit": "0.0150000000",
    "irt": 1971.0,
    "exchange_rate": 131400
  }
}
```

### Qwen-MT-Flash Translation

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen-mt-flash",
    "messages": [
      {
        "role": "user",
        "content": "Artificial intelligence is transforming industries worldwide."
      }
    ],
    "extra_body": {
      "translation_options": {
        "source_lang": "English",
        "target_lang": "Persian"
      }
    }
  }'
```

---

## SDK Usage Examples

### GLM-4.7 with Thinking Mode

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7",
    "messages": [
      {
        "role": "user",
        "content": "Design a microservices architecture for an e-commerce platform"
      }
    ],
    "thinking": {
      "type": "enabled"
    },
    "max_tokens": 4096
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.7",
    messages=[
        {
            "role": "user",
            "content": "Design a microservices architecture for an e-commerce platform",
        }
    ],
    extra_body={"thinking": {"type": "enabled"}},
    max_tokens=4096,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "glm-4.7",
  messages: [
    {
      role: "user",
      content: "Design a microservices architecture for an e-commerce platform",
    },
  ],
  thinking: {
    type: "enabled",
  },
  max_tokens: 4096,
});

console.log(response.choices[0].message.content);

```

### Qwen3-VL Vision Model

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-vl-plus",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/chart.png"
            }
          },
          {
            "type": "text",
            "text": "Analyze this chart and provide key insights"
          }
        ]
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="qwen3-vl-plus",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/chart.png"},
                },
                {"type": "text", "text": "Analyze this chart and provide key insights"},
            ],
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
  model: "qwen3-vl-plus",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: "https://example.com/chart.png" },
        },
        { type: "text", text: "Analyze this chart and provide key insights" },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

```

### Z-Image-Turbo Image Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "z-image-turbo",
    "prompt": "A futuristic cityscape at sunset with flying vehicles",
    "size": "1024x1024",
    "n": 1
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="z-image-turbo",
    prompt="A futuristic cityscape at sunset with flying vehicles",
    size="1024x1024",
    n=1,
)

print(response.data[0].url)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "z-image-turbo",
  prompt: "A futuristic cityscape at sunset with flying vehicles",
  size: "1024x1024",
  n: 1,
});

console.log(response.data[0].url);

```

### Qwen-Plus-Character Role-Playing

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen-plus-character",
    "messages": [
      {
        "role": "system",
        "content": "You are Luna, a wise and gentle forest spirit who speaks in poetic language and loves nature."
      },
      {
        "role": "user",
        "content": "Hello, who are you?"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="qwen-plus-character",
    messages=[
        {
            "role": "system",
            "content": "You are Luna, a wise and gentle forest spirit who speaks in poetic language and loves nature.",
        },
        {"role": "user", "content": "Hello, who are you?"},
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "qwen-plus-character",
  messages: [
    {
      role: "system",
      content: "You are Luna, a wise and gentle forest spirit who speaks in poetic language and loves nature.",
    },
    { role: "user", content: "Hello, who are you?" },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [Z.AI Models Documentation](en/providers/zai.md)
- [Alibaba Models Documentation](en/providers/alibaba.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Vision Capabilities Guide](en/guides/vision.md)
- [API Reference - Images](en/api-reference/images.md)
- [API Reference - Chat Completions](en/api-reference/chat.md)
- [Pricing](en/pricing.md)