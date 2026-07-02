# New Models Added: GPT-Image-1.5, FLUX.2 Pro, and DeepSeek-V3.2 on Azure AI

**Date:** 2025-12-17 / (1404-09-26)

## Summary

AvalAI introduces four new models: GPT-Image-1.5 from OpenAI with state-of-the-art image generation capabilities, FLUX.2 Pro from Black Forest Labs with multi-reference visual intelligence, and DeepSeek-V3.2 models hosted on Azure AI for improved rate limits and reduced latency.

---

## Details

### OpenAI - GPT-Image-1.5

GPT-Image-1.5 is OpenAI's latest image generation model, delivering major improvements in realism, accuracy, and editability compared to GPT-Image-1. [Documentation](en/providers/openai.md)

**Key Capabilities:**

- **High-fidelity photorealism** with natural lighting, accurate materials, and rich color rendering
- **Flexible quality–latency tradeoffs** for faster generation at lower settings
- **Robust facial and identity preservation** for edits, character consistency, and multi-step workflows
- **Reliable text rendering** with crisp lettering, consistent layout, and strong contrast inside images
- **Complex structured visuals** including infographics, diagrams, and multi-panel compositions
- **Precise style control and style transfer** with minimal prompting

| Feature | Details |
|---------|---------|
| Model Type | Image Generation & Editing |
| Input | Text, Image |
| Output | Image, Text |
| Supported Endpoints | `v1/images/generations`, `v1/images/edits` |
| Strengths | State-of-the-art photorealism, text rendering, style transfer |
| Best for | Professional design, marketing creatives, infographics, product mockups |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Text Input | $5.00 |
| Cached Text Input | $2.00 |
| Text Output | $32.00 |
| Image Input | $8.00 |
| Image Output | $32.00 |

---

### Black Forest Labs - FLUX.2 Pro

FLUX.2 Pro is Black Forest Labs' advanced image generation model with multi-reference visual intelligence, unprecedented detail, color precision, and spatial reasoning. [Documentation](en/providers/bfl.md)

**Key Capabilities:**

- **Multi-Reference**: Combine elements from up to 8 images (API) while maintaining identity across complex scenes
- **Photorealism & Detail**: Generate photorealistic images with exceptional detail
- **Typography & Text**: Specialized for text rendering and preserving small details
- **Exact Color Control**: Precise hex color matching and structured prompting
- **Production Ready**: High quality, production-grade image generation at scale

| Feature | Details |
|---------|---------|
| Model Type | Image Generation |
| Max Resolution | Up to 4 megapixels (4096x4096) |
| Multi-Reference | Up to 8 input images (API), 10 (playground) |
| Supported Endpoints | `v1/images/generations` |
| Strengths | Multi-reference compositing, color precision, typography |
| Best for | Product marketing, creative platforms, food imagery, movie making |

**Pricing:**

| Component | Price |
|-----------|-------|
| Generated image (1 megapixel) | $0.03 |
| Each additional megapixel | $0.015 |
| Reference image (per megapixel) | $0.015 |

**Pricing Notes:**
- 1 megapixel = 1024x1024 pixels
- Resolution is rounded up to the next megapixel
- Images exceeding 4 megapixels are resized to 4 megapixels

> **💡 Language Tip:** FLUX.2 Pro is optimized for English prompts. For best results, use English prompts when generating images with FLUX models. Non-English prompts may produce inconsistent results.

---

### DeepSeek - DeepSeek-V3.2 and DeepSeek-V3.2-Speciale (via Azure AI)

DeepSeek-V3.2 models are now available through Azure AI, offering improved rate limits and reduced latency compared to direct DeepSeek API access. [Documentation](en/providers/deepseek.md)

**DeepSeek-V3.2** harmonizes high computational efficiency with superior reasoning and agent performance, featuring DeepSeek Sparse Attention (DSA) for efficient long-context scenarios.

**DeepSeek-V3.2-Speciale** is a high-compute variant that surpasses GPT-5 and exhibits reasoning proficiency on par with Gemini-3.0-Pro. It achieved gold-medal performance in the 2025 International Mathematical Olympiad (IMO) and International Olympiad in Informatics (IOI).

| Feature | DeepSeek-V3.2 | DeepSeek-V3.2-Speciale |
|---------|---------------|------------------------|
| Provider | Azure AI | Azure AI |
| Context Window | 128K tokens | 128K tokens |
| Mode | Non-thinking (efficient) | Deep reasoning (thinking) |
| Tool Calling | ✓ Supported | ✗ Not supported |
| Strengths | Fast responses, efficient processing | Expert-level reasoning, Olympiad-level performance |
| Best for | General chat, agentic tasks | Complex math, competitive programming, research |
| Supported Endpoints | `v1/chat/completions`, `v1/completions`, `v1/responses`, `v1/messages` | `v1/chat/completions`, `v1/completions`, `v1/responses`, `v1/messages` |

**Pricing (Both Models):**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.28 |
| Cached Input | $0.028 |
| Output | $0.42 |

**Benefits of Azure AI Hosting:**

- **Improved Rate Limits**: Higher throughput compared to direct DeepSeek API
- **Reduced Latency**: Faster response times through Azure's global infrastructure
- **Enhanced Reliability**: Enterprise-grade availability and performance

---

## API Request/Response Examples

### GPT-Image-1.5 Image Generation

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-image-1.5",
    "prompt": "A photorealistic candid photograph of an elderly sailor standing on a small fishing boat with weathered skin and traditional tattoos",
    "size": "1024x1024",
    "quality": "high",
    "n": 1,
    "response_format": "b64_json"
  }'
```

**Example Response:**

```json
{
  "created": 1765933200,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAABAAAAAQA...[TRUNCATED]",
      "revised_prompt": "A photorealistic candid photograph..."
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 1024,
    "total_tokens": 1069
  },
  "estimated_cost": {
    "unit": "0.0328800000",
    "irt": 4321.08,
    "exchange_rate": 131400
  }
}
```

### GPT-Image-1.5 Image Editing

```bash
curl https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=gpt-image-1.5" \
  -F "image=@input_image.png" \
  -F "prompt=Make it look like a winter evening with snowfall" \
  -F "size=1024x1024"
```

### FLUX.2 Pro Image Generation

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "flux.2-pro",
    "prompt": "A professional headshot of a confident businesswoman in a modern office, soft natural lighting, shallow depth of field",
    "size": "1024x1024",
    "n": 1,
    "response_format": "b64_json"
  }'
```

**Example Response:**

```json
{
  "created": 1765933200,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAABAAAAAQA...[TRUNCATED]"
    }
  ],
  "estimated_cost": {
    "unit": "0.0300000000",
    "irt": 3942.0,
    "exchange_rate": 131400
  }
}
```

### DeepSeek-V3.2 Chat Completion

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-v3.2",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum entanglement in simple terms"
      }
    ]
  }'
```

**Example Response:**

```json
{
  "id": "chatcmpl-abc123",
  "created": 1765933200,
  "model": "deepseek-v3.2",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Quantum entanglement is a phenomenon where two or more particles become connected in such a way that the quantum state of each particle cannot be described independently...",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 245,
    "prompt_tokens": 12,
    "total_tokens": 257
  },
  "estimated_cost": {
    "unit": "0.0001063800",
    "irt": 13.98,
    "exchange_rate": 131400
  }
}
```

### DeepSeek-V3.2-Speciale Reasoning

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-v3.2-speciale",
    "messages": [
      {
        "role": "user",
        "content": "Solve this IMO problem: Find all positive integers n such that n^2 + 1 divides n^3 + n + 1"
      }
    ],
    "max_tokens": 4096
  }'
```

---

## SDK Usage Examples

### GPT-Image-1.5

```language-selector
bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-image-1.5",
    "prompt": "Create a detailed infographic explaining how a coffee machine works",
    "size": "1024x1024",
    "quality": "high",
    "n": 1,
    "response_format": "b64_json"
  }'

python=:from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="gpt-image-1.5",
    prompt="Create a detailed infographic explaining how a coffee machine works",
    size="1024x1024",
    quality="high",
    n=1,
    response_format="b64_json",
)

# Save the image
img_data = base64.b64decode(response.data[0].b64_json)
with open("infographic.png", "wb") as f:
    f.write(img_data)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "gpt-image-1.5",
  prompt: "Create a detailed infographic explaining how a coffee machine works",
  size: "1024x1024",
  quality: "high",
  n: 1,
  response_format: "b64_json",
});

// Save the image
const imgData = Buffer.from(response.data[0].b64_json, "base64");
fs.writeFileSync("infographic.png", imgData);

```

### FLUX.2 Pro

```language-selector
bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "flux.2-pro",
    "prompt": "A serene mountain landscape at sunset with reflective lake",
    "size": "1024x1024",
    "n": 1,
    "response_format": "b64_json"
  }'

python=:from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="flux.2-pro",
    prompt="A serene mountain landscape at sunset with reflective lake",
    size="1024x1024",
    n=1,
    response_format="b64_json",
)

# Save the image
img_data = base64.b64decode(response.data[0].b64_json)
with open("landscape.png", "wb") as f:
    f.write(img_data)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "flux.2-pro",
  prompt: "A serene mountain landscape at sunset with reflective lake",
  size: "1024x1024",
  n: 1,
  response_format: "b64_json",
});

// Save the image
const imgData = Buffer.from(response.data[0].b64_json, "base64");
fs.writeFileSync("landscape.png", imgData);

```

### DeepSeek-V3.2 (Azure AI)

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-v3.2",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to implement a binary search tree"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.2",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to implement a binary search tree",
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
  model: "deepseek-v3.2",
  messages: [
    {
      role: "user",
      content: "Write a Python function to implement a binary search tree",
    },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Black Forest Labs Models Documentation](en/providers/bfl.md)
- [DeepSeek Models Documentation](en/providers/deepseek.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [API Reference - Images](en/api-reference/images.md)
- [Pricing](en/pricing.md)