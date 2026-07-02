# Gemini 2.5 Flash Image (Nano Banana) Stable Release

**Date:** 2025-10-09

## Summary

Google Gemini has released the stable version of their state-of-the-art image generation model, **gemini-2.5-flash-image** (**Nano Banana**). This model replaces the preview version and provides enhanced stability and performance for production use. The preview version (**gemini-2.5-flash-image-preview**) will be deprecated in the coming weeks.

---

## Details

### Stable Model Release

We announce the availability of **gemini-2.5-flash-image**, the stable production-ready version of Google's advanced image generation and editing model from the Gemini 2.5 family. This release marks the transition from the preview phase to a fully supported, production-grade model.

### Google

- **gemini-2.5-flash-image**: Google's stable state-of-the-art image generation model featuring top-rated image generation and editing capabilities with support for both text-to-image and image-to-image transformations. [Documentation](en/providers/google.md)

**Key Features:**
- **State-of-the-art image generation** - Create high-quality, photorealistic images from detailed text prompts
- **Advanced image editing** - Transform existing images with natural language instructions
- **Character consistency** - Maintain consistent appearance of subjects across multiple generations
- **Multi-image fusion** - Combine multiple input images into cohesive compositions
- **Conversational editing** - Iterative refinement through natural dialogue
- **Production stability** - Enhanced reliability and consistent performance for production workloads
- **Context Window**: 32,768 tokens for handling extensive conversations
- **Dual Output**: Supports both image and text outputs
- **Endpoint Support**: Available on `v1/chat/completions` with modalities parameter

**Pricing Details:**

| Model | Input | Output (Text) | Output (Image) |
|-------|-------|---------------|----------------|
| gemini-2.5-flash-image | $0.30/1M tokens | $2.50/1M tokens | $30.00/1M tokens |

### Migration from Preview Version

If you are currently using **gemini-2.5-flash-image-preview**, we recommend migrating to the stable **gemini-2.5-flash-image** model. The preview version will be deprecated soon. Migration is seamless - simply update the model name in your API calls:

```diff
- model="gemini-2.5-flash-image-preview"
+ model="gemini-2.5-flash-image"
```

All features and capabilities remain the same, with improved stability and performance in the stable release.

### Usage Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash-image",
    "messages": [
      {
        "role": "user",
        "content": "A photorealistic image of a mountain landscape with a lake reflecting the sunset"
      }
    ],
    "modalities": ["image", "text"]
  }'

python=:from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Text to image generation
response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=[
        {
            "role": "user",
            "content": "A photorealistic image of a mountain landscape with a lake reflecting the sunset",
        }
    ],
    modalities=["image", "text"],
)

# Image is available in the response
image_url = response.choices[0].message.images[0]["image_url"]["url"]
content = (
    response.choices[0].message.content.strip()
    if response.choices[0].message.content
    else None
)

# Process the returned image data
header, base64_data = image_url.split(",", 1)
ext = header.split(";")[0].split("/")[1]

# Decode and save image
image_bytes = base64.b64decode(base64_data)
filename = f"generated_image.{ext}"
with open(filename, "wb") as f:
    f.write(image_bytes)
print(f"✅ Image saved as {filename}")

javascript=:import { OpenAI } from "openai";
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Text to image generation
const response = await client.chat.completions.create({
    model: "gemini-2.5-flash-image",
    messages: [{
        role: "user",
        content: "A photorealistic image of a mountain landscape with a lake reflecting the sunset"
    }],
    modalities: ["image", "text"],
});

// Image is available in the response
const imageUrl = response.choices[0].message.images[0].image_url.url;
const content = response.choices[0].message.content ? response.choices[0].message.content.trim() : null;

// Process the returned image data
const [header, base64Data] = imageUrl.split(",", 2);
const ext = header.split(";")[0].split("/")[1];

// Decode and save image
const imageBytes = Buffer.from(base64Data, 'base64');
const filename = `generated_image.${ext}`;
fs.writeFileSync(filename, imageBytes);
console.log(`✅ Image saved as ${filename}`);

```

### Image-to-Image Editing Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash-image",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Transform this image into a Studio Ghibli anime style"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/your-image.jpg"
            }
          }
        ]
      }
    ],
    "modalities": ["image", "text"]
  }'

python=:# Image to image transformation
prompt = "Transform this image into a Studio Ghibli anime style"
image_url = "https://example.com/your-image.jpg"

messages = [
    {
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": image_url}},
        ],
    }
]

response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=messages,
    modalities=["image", "text"],
)

# Process the response the same way as text-to-image
image_url = response.choices[0].message.images[0]["image_url"]["url"]

javascript=:// Image to image transformation
const prompt = "Transform this image into a Studio Ghibli anime style";
const imageUrl = "https://example.com/your-image.jpg";

const messages = [
    {
        role: "user",
        content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
        ],
    }
];

const response = await client.chat.completions.create({
    model: "gemini-2.5-flash-image",
    messages: messages,
    modalities: ["image", "text"],
});

// Process the response
const resultImageUrl = response.choices[0].message.images[0].image_url.url;

```

---

## Related Links

- [Generate and Edit Images with Gemini 2.5 Flash Guide](en/examples/generate_images_with_gemini_2_5_flash.md)
- [Google Models Documentation](en/providers/google.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Images API Reference](en/api-reference/images.md)