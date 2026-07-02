# Gemini 3.1 Flash Image Preview (Nano Banana 2) Now Available

**Date:** 2026-02-27 / (1404-12-08)

## Summary

We announce the addition of Google's Gemini 3.1 Flash Image Preview (`gemini-3.1-flash-image-preview`), also known as "Nano Banana 2". This model brings high-fidelity image generation and faster, advanced editing to the Flash model series, serving as the high-efficiency counterpart to Gemini 3 Pro Image with an exceptional price-performance ratio optimized for high-volume developer use cases.

---

## Details

### Google Gemini 3.1 Flash Image Preview (Nano Banana 2)

Google's [`gemini-3.1-flash-image-preview`](en/providers/google.md) (also known as "Nano Banana 2") is now available through AvalAI. This model delivers high-fidelity image generation and advanced editing capabilities, optimized for speed and high-volume developer workflows.

**Model Name:** `gemini-3.1-flash-image-preview`  
**Alias:** Nano Banana 2

#### Key Features

- **Improved World Knowledge**: Leverages Gemini's broad world knowledge with web search grounding to create enhanced visuals using real-world references
- **Advanced Text Rendering**: Delivers reliable, crisp text rendering with in-image localization supporting multiple languages
- **Greater Creative Control**: Vibrant lighting, richer textures, sharper details with configurable thinking levels
- **Native Aspect Ratios**: Support for all existing aspect ratios plus new 4:1, 1:4, 8:1, and 1:8 ratios
- **New 512px Resolution**: Optimized for efficiency with minimal latency for rapid iterations
- **Improved Instruction Following**: Adheres more strictly to complex, multi-layered prompts
- **Resolution Support**: Generate images up to 4K resolution (4096x4096px)
- **Image Editing**: Comprehensive editing capabilities including multi-turn conversational editing
- **Google Image Search Grounding**: Generate images based on real-world image references (exclusive to 3.1 Flash)

#### Pricing

| Type | Cost |
|------|------|
| Input Text | $0.50 per 1M tokens |
| Input Image | $0.50 per 1M tokens |
| Cached Input | $0.25 per 1M tokens |
| Output Text | $3.00 per 1M tokens |
| Output Image (1K-2K) | $0.0672 per image |
| Output Image (2K-4K) | $0.101 per image |
| Output Image (4K) | $0.151 per image |

**Note:** Image output is priced at $60 per 1M tokens. Output images from 1024x1024px (1K) to 2048x2048px (2K) consume approximately 1120 tokens.

#### Understanding the Nano Banana Family

**Nano Banana** is the name for Gemini's native image generation capabilities. Gemini can generate and process images conversationally with text, images, or a combination of both:

- **Nano Banana 2** (`gemini-3.1-flash-image-preview`): The high-efficiency counterpart to Gemini 3 Pro Image, optimized for speed and high-volume developer use cases
- **Nano Banana Pro** (`gemini-3-pro-image-preview`): Designed for professional asset production with advanced reasoning ("Thinking") for complex instructions and high-fidelity text
- **Nano Banana** (`gemini-2.5-flash-image`): Designed for speed and efficiency, optimized for high-volume, low-latency tasks

#### API Request/Response Examples

**Using Chat Completions Endpoint:**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.1-flash-image-preview",
    "messages": [
      {
        "role": "user",
        "content": "Create a photorealistic portrait of a nano banana dish in a fancy restaurant with a Gemini theme"
      }
    ],
    "modalities": ["image", "text"]
  }' | jq '.choices[0].message.images[0].image_url.url |= (.[0:100] + "...[TRUNCATED]")'
```

**Response:**

```json
{
  "id": "chatcmpl-xyz123",
  "created": 1740642000,
  "model": "gemini-3.1-flash-image-preview",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "I've created a photorealistic image of a nano banana dish in an elegant restaurant setting with a Gemini constellation theme.",
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
    "prompt_tokens": 28,
    "total_tokens": 1178,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 28,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0695000000",
    "irt": 7968.3,
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
    "model": "gemini-3.1-flash-image-preview",
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
    model="gemini-3.1-flash-image-preview",
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
  model: "gemini-3.1-flash-image-preview",
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
    "model": "gemini-3.1-flash-image-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Transform this image into a cyberpunk style with neon colors"
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
    model="gemini-3.1-flash-image-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Transform this image into a cyberpunk style with neon colors",
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

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3.1-flash-image-preview",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Transform this image into a cyberpunk style with neon colors",
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

```

#### Native Gemini SDK Example

You can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) to access this model with Google's official SDK:

```python
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options=types.HttpOptions(base_url="https://api.avalai.ir/v1beta"),
)

prompt = (
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"
)
response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[prompt],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("generated_image.png")
```

---

## Related Links

- [Google Models Documentation](en/providers/google.md)
- [Nano Banana Series Guide](en/examples/generate_images_with_nano_banana_series.md)
- [Native Gemini API Reference](en/api-reference/v1beta.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Pricing Information](en/pricing.md)
