# New Image Generation and Editing Capabilities: Gemini 2.5 Flash Image Preview and Expanded Edit Endpoint Support

**Date:** 2025-08-26 / (1404-06-05)

> **Update (2025-10-09):** The preview model has been replaced by the stable version [`gemini-2.5-flash-image`](en/news/2025-10-09-gemini-2-5-flash-image-stable-release.md). The preview model (`gemini-2.5-flash-image-preview`) will be deprecated soon. Please migrate to the stable version for production use.

## Summary

AvalAI now supports Google's latest state-of-the-art image generation model, Gemini 2.5 Flash Image Preview, alongside expanded image editing capabilities through the v1/images/edits endpoint for seven additional models including Stability AI and Imagen models.

---

## Details

We're excited to announce two major enhancements to our image generation and editing capabilities that provide developers with more powerful and flexible options for their AI-powered applications.

### Google Gemini 2.5 Flash Image Preview

#### Google

- **gemini-2.5-flash-image-preview** *(deprecated - use gemini-2.5-flash-image)*: Google's latest state-of-the-art image generation model from the Gemini 2.5 family, featuring top-rated image generation and editing capabilities with support for both text-to-image and image-to-image transformations. [Documentation](en/providers/google.md)

**Key Features:**
- **Input/Output Token Limits**: 32,768 tokens each
- **Supported Data Types**: Images and text input/output
- **Capabilities**: Image generation, structured outputs, caching
- **Knowledge Cutoff**: June 2025
- **API Access**: Available via both [`v1/chat/completions`](en/api-reference/chat.md) and native [`v1beta`](en/news/2025-07-22-native-gemini-api-support-now-available.md) endpoints

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Text to image generation
response = client.chat.completions.create(
    model="gemini-2.5-flash-image-preview",
    messages=[
        {
            "role": "user",
            "content": "A strange character on a colorful galaxy background, with lots of stars and planets.",
        }
    ],
    modalities=["image", "text"],
)

# Image is now available in the response
image_url = response.choices[0].message.images[0]["image_url"]["url"]
content = (
    response.choices[0].message.content.strip()
    if response.choices[0].message.content
    else None
)

# Process the returned image data
header, base64_data = image_url.split(",", 1)
ext = header.split(";")[0].split("/")[1]

import base64

image_bytes = base64.b64decode(base64_data)
with open(f"generated_image.{ext}", "wb") as f:
    f.write(image_bytes)
print(f"✅ Image saved as generated_image.{ext}")

# Print any text response that came with the image
if content:
    print(f"Model response: {content}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Text to image generation
const response = await client.chat.completions.create({
    model: "gemini-2.5-flash-image-preview",
    messages: [{
        role: "user",
        content: "A strange character on a colorful galaxy background, with lots of stars and planets."
    }],
    modalities: ["image", "text"],
});

// Image is now available in the response
const imageUrl = response.choices[0].message.images[0].image_url.url;
const content = response.choices[0].message.content ? response.choices[0].message.content.trim() : null;

// Process the returned image data
const [header, base64Data] = imageUrl.split(",", 2);
const ext = header.split(";")[0].split("/")[1];

const imageBytes = Buffer.from(base64Data, 'base64');
require('fs').writeFileSync(`generated_image.${ext}`, imageBytes);
console.log(`✅ Image saved as generated_image.${ext}`);

// Print any text response that came with the image
if (content) {
 console.log(`Model response: ${content}`);
}

```

### Expanded Image Edit Endpoint Support

We've significantly expanded the [`v1/images/edits`](en/api-reference/images.md) endpoint to support seven additional powerful models for image editing capabilities:

#### Stability AI

- **stability.sd3-large-v1:0**: Advanced Stable Diffusion 3 model for high-quality image editing
- **stability.sd3-5-large-v1:0**: Latest Stable Diffusion 3.5 model with enhanced editing capabilities

#### Google

- **imagen-3.0-generate-001**: Google's Imagen 3.0 model for sophisticated image editing and generation

```language-selector
python=:import requests
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Edit existing image
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="stability.sd3-5-large-v1:0",
        image=image_file,
        prompt="Add a rainbow in the sky above the mountains",
        size="1024x1024",
        n=1,
        response_format="url",  # or b64_json
    )

# Save edited image
edited_image_url = response.data[0].url
edited_image = requests.get(edited_image_url)
with open("edited_image.png", "wb") as f:
    f.write(edited_image.content)

print("✅ Image edited and saved as edited_image.png")

javascript=:import fs from 'fs';
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Edit existing image
const imageFile = fs.createReadStream("input_image.png");
const response = await client.images.edit({
    model: "stability.sd3-5-large-v1:0",
    image: imageFile,
    prompt: "Add a rainbow in the sky above the mountains",
    size: "1024x1024",
    n: 1,
    response_format: "url", // or b64_json
});

// Save edited image
const editedImageUrl = response.data[0].url;
const imageResponse = await fetch(editedImageUrl);
const imageBuffer = await imageResponse.arrayBuffer();
fs.writeFileSync("edited_image.png", Buffer.from(imageBuffer));

console.log("✅ Image edited and saved as edited_image.png");

```

---

## Related Links

- [Generate and Edit Images with Gemini 2.5 Flash Image Preview Guide](en/examples/generate_images_with_gemini_2_5_flash.md)
- [Gemini 2.5 Flash Image Preview Model Documentation](en/models/gemini-2.5-flash-image-preview.md)
- [Images API Reference](en/api-reference/images.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Native Gemini API Support](en/news/2025-07-22-native-gemini-api-support-now-available.md)
- [Image Generation Guide](en/guides/image-generation.md)