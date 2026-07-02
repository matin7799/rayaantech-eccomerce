# New Model Added: GPT Image 1 Mini Now Available

**Date:** 2025-10-08

## Summary

AvalAI introduces support for OpenAI's GPT Image 1 Mini, a cost-efficient version of GPT Image 1 that offers faster and more affordable image generation while maintaining high-quality output. This model provides the same advanced language understanding and image generation capabilities as GPT Image 1 at a significantly reduced cost, making it ideal for high-volume applications.

---

## Details

### OpenAI

* **gpt-image-1-mini**: A cost-efficient image generation model with advanced instruction-following capabilities and photorealistic output quality at reduced pricing. [Documentation](en/examples/generate_images_with_gpt_image.md)

GPT Image 1 Mini provides the same powerful image generation technology as GPT Image 1 but optimized for cost-effectiveness. This model is perfect for applications requiring high-volume image generation, prototyping, or scenarios where the reduced pricing offers significant advantages while still delivering excellent results.

### Key Features

* **Cost-Effective**: Significantly lower pricing compared to GPT Image 1
* **Multimodal Input**: Accepts both text and image inputs for versatile use cases
* **Quality Options**: Support for low, medium, and high-quality generation modes
* **Flexible Sizing**: Multiple resolution options including 1024x1024, 1024x1536, and 1536x1024
* **Advanced Editing**: Combine or modify existing images with text instructions
* **Masking Support**: Edit specific parts of images while preserving others

### Availability

GPT Image 1 Mini is available for **Tier 3, 4, and 5** users on AvalAI.

### Pricing Details

GPT Image 1 Mini offers significantly reduced pricing compared to GPT Image 1:

| Token Type | Price per 1M tokens |
|------------|---------------------|
| Text Input | $5.00 |
| Cached Text Input | $1.25 |
| Image Input | $10.00 |
| Cached Image Input | $2.50 |
| Image Output | $40.00 |

**Image Generation Pricing:**

| Quality | Size | Price per Image |
|---------|------|-----------------|
| Low | 1024x1024 | $0.011 |
| Low | 1024x1536 / 1536x1024 | $0.016 |
| Medium | 1024x1024 | $0.042 |
| Medium | 1024x1536 / 1536x1024 | $0.063 |
| High | 1024x1024 | $0.036 |
| High | 1024x1536 / 1536x1024 | $0.052 |

### GPT Image 1 Mini Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-image-1-mini",
    "prompt": "A photorealistic image of a futuristic city with flying cars and tall glass buildings",
    "size": "1024x1024",
    "quality": "high",
    "response_format": "url"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate a new image
response = client.images.generate(
    model="gpt-image-1-mini",
    prompt="A photorealistic image of a futuristic city with flying cars and tall glass buildings",
    size="1024x1024",
    quality="high",
    response_format="url",  # or b64_json
)

# Access the image URL
image_url = response.data[0].url
print(f"Generated image URL: {image_url}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Generate a new image
const response = await client.images.generate({
  model: "gpt-image-1-mini",
  prompt: "A photorealistic image of a futuristic city with flying cars and tall glass buildings",
  size: "1024x1024",
  quality: "high",
  response_format: "url", // or b64_json
});

// Access the image URL
const imageUrl = response.data[0].url;
console.log(`Generated image URL: ${imageUrl}`);

```

### Image Editing with GPT Image 1 Mini

GPT Image 1 Mini also supports image editing capabilities:

```language-selector
bash=:curl https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F model="gpt-image-1-mini" \
  -F image="@input_image.jpg" \
  -F prompt="Change the background to a tropical beach" \
  -F response_format="url"

python=:# Edit an existing image
with open("input_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="gpt-image-1-mini",
        image=image_file,
        prompt="Change the background to a tropical beach",
        response_format="url",  # or b64_json
    )

edited_image_url = response.data[0].url
print(f"Edited image URL: {edited_image_url}")

javascript=:import fs from "fs";

// Edit an existing image
const response = await client.images.edit({
  model: "gpt-image-1-mini",
  image: fs.createReadStream("input_image.jpg"),
  prompt: "Change the background to a tropical beach",
  response_format: "url", // or b64_json
});

const editedImageUrl = response.data[0].url;
console.log(`Edited image URL: ${editedImageUrl}`);

```

### Mask-Based Editing

For precise control over which parts of an image are modified:

```python
# Edit with mask
with open("input_image.jpg", "rb") as image_file, open("mask.png", "rb") as mask_file:
    response = client.images.edit(
        model="gpt-image-1-mini",
        image=image_file,
        mask=mask_file,
        prompt="Add colorful flowers to the masked area",
        response_format="url",  # or b64_json
    )
```

### Supported Endpoints

GPT Image 1 Mini is available on the following endpoints:

* **v1/images/generations** - For direct image generation
* **v1/images/edits** - For editing existing images

---

## Related Links

* [GPT Image 1 How-To Guide](en/examples/generate_images_with_gpt_image.md)
* [Image Generation Guide](en/guides/image-generation.md)
* [OpenAI Models Documentation](en/providers/openai.md)
* [Pricing Information](en/pricing.md)