# Generate Images with GPT Image Models

## Introduction

The GPT Image model family represents OpenAI's image generation models that combine advanced language understanding with state-of-the-art image generation capabilities. This guide will walk you through how to use these models through AvalAI's API to generate and edit images.

## Model Options

### GPT Image 2 (Newest)
OpenAI's next-generation image model (alias: `gpt-image-2-2026-04-21`). It builds on GPT Image 1.5 with significant improvements:
- **Best-in-class prompt adherence** - Superior understanding of detailed multi-part prompts
- **Higher visual fidelity** - More photorealistic outputs with finer detail
- **Stronger text rendering** - Accurately renders typography, logos, and signage
- **Lower output cost** - Text output drops from $32.00/1M to $10.00/1M and image output from $32.00/1M to $30.00/1M vs. GPT Image 1.5
- **Dual endpoint support** - Works with both `v1/images/generations` and `v1/images/edits`

**Pricing:** Text Input $5.00/1M tokens, Cached $1.25/1M, Text Output $10.00/1M, Image Input $8.00/1M, Cached Image Input $2.00/1M, Image Output $30.00/1M.

### GPT Image 1.5
OpenAI's previous advanced image generation and editing model:
- **Improved prompt adherence** - Better understanding and execution of detailed prompts
- **Enhanced visual quality** - Higher fidelity and more realistic outputs
- **Better text rendering** - Improved ability to render text accurately in images
- **Support for both generation and editing** - Works with both `v1/images/generations` and `v1/images/edits` endpoints

**Pricing:** Text Input $5.00/1M tokens, Cached $2.00/1M, Text Output $32.00/1M, Image Input $8.00/1M, Image Output $32.00/1M.

### GPT Image 1
The established flagship image generation model offering high quality output with advanced prompt following capabilities.

### GPT Image 1 Mini
A cost-efficient version of GPT Image 1 that provides faster and more affordable image generation while maintaining high-quality output. Perfect for high-volume applications and prototyping. **Available for Tier 3, 4, and 5 users.**

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook/) and the [OpenAI Cookbook GitHub repository](https://github.com/openai/openai-cookbook), especially the GPT Image prompting guide, with AvalAI endpoint and API key changes.

## Key Features

- **Advanced instruction following** - Create precisely what you want with detailed text prompts
- **Photorealistic quality** - Generate high-quality images with remarkable detail
- **Flexible customization** - Adjust quality, size, compression, and transparency
- **Image editing** - Modify existing images or combine multiple images
- **Masking support** - Edit specific parts of images while preserving others

## Production Prompting Playbook

The most reliable GPT Image workflows use prompts that read like a short creative or product brief. Keep the prompt structured, state the intended use, and separate what should change from what must stay fixed.

### General Template

```text
Goal: <what this image will be used for>
Format: <photo, ad, slide, UI mockup, diagram, product shot>
Canvas: <size, aspect ratio, orientation>
Subject: <main object/person/interface>
Composition: <framing, camera angle, placement, whitespace>
Style: <photorealistic, flat vector, editorial, 3D render, etc.>
Text: "<exact text to render>", placement, typography, language
Constraints: no watermark, no extra text, preserve brand colors, keep layout clean
```

### Text Inside Images

Put exact text in quotes and define placement and hierarchy. For small labels, dense infographics, or multilingual text, start with `quality="high"`.

```python
response = client.images.generate(
    model="gpt-image-2",
    prompt=(
        "Goal: product launch slide. Format: clean 16:9 presentation slide. "
        "Canvas: 1536x1024. Subject: a modern analytics dashboard screenshot mockup. "
        'Text: headline exactly "Revenue Signals", subtitle exactly "Weekly pipeline health". '
        "Composition: headline top-left, dashboard centered, three metric callouts on the right. "
        "Style: polished SaaS product visual, crisp typography, restrained colors. "
        "Constraints: no extra words, no watermark, readable text."
    ),
    size="1536x1024",
    quality="high",
    response_format="url",
)
```

### Image Localization

For translating an existing design, ask the model to preserve layout and only replace text. This is useful for ads, UI screenshots, packaging, and infographics.

```text
Translate all visible English text into Persian.
Preserve the original layout, typography hierarchy, colors, icons, logo placement,
spacing, arrows, and image content. Do not add new claims or extra text.
```

### Surgical Edits

For edits, name the change and repeat the invariants. This reduces drift across iterations.

```text
Change only the chair color to matte black.
Keep the camera angle, room layout, lighting, shadows, wall color, floor texture,
table position, and all other objects exactly the same.
```

### Multi-Image Compositing

Reference each input by index and role.

```text
Image 1 is the product photo. Image 2 is the lifestyle background.
Place the product from Image 1 on the table in Image 2.
Match perspective, contact shadow, color temperature, and scale.
Preserve the product label exactly.
```

## Basic Image Generation

To generate an image with GPT Image models, you need to provide a text prompt describing what you want to create. The more detailed your prompt, the better the results. You can use [`gpt-image-2`](en/providers/openai.md) for the newest and best-in-class capabilities, [`gpt-image-1.5`](en/providers/openai.md) for the previous advanced model, [`gpt-image-1`](en/providers/openai.md) for high quality, or [`gpt-image-1-mini`](en/providers/openai.md) for cost-effective generation.

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="gpt-image-2",  # or "gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini"
    prompt="A photorealistic image of a mountain landscape with a lake reflecting the sunset",
    size="1024x1024",
    response_format="url",  # or b64_json
)

# Get the image URL
image_url = response.data[0].url
print(f"Generated image URL: {image_url}")

# If you want the image as base64 data instead of a URL
# image_data = response.data[0].b64_json

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "gpt-image-2", // or "gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini"
  prompt:
    "A photorealistic image of a mountain landscape with a lake reflecting the sunset",
  size: "1024x1024",
  response_format: "url",
});

// Get the image URL
const imageUrl = response.data[0].url;
console.log(`Generated image URL: ${imageUrl}`);

// If you want the image as base64 data instead of a URL
// const imageData = response.data[0].b64_json;

```

## Customizing Output Options

GPT Image models offer several options to customize the generated images:

### Image Size

You can specify the size of the generated image using the `size` parameter:

- `1024x1024` (square)
- `1024x1536` (portrait)
- `1536x1024` (landscape)
- `auto` (default)

`gpt-image-2` also supports flexible custom sizes when both edges are valid multiples and the aspect ratio is not extreme. For production reliability, start with `1024x1024`, `1024x1536`, `1536x1024`, or `2560x1440` before testing larger custom outputs.

```python
# Using GPT Image 2 for high-quality landscape output
response = client.images.generate(
    model="gpt-image-2",
    prompt="A pixel art style portrait of a cat wearing sunglasses",
    size="1536x1024",  # Landscape orientation
    response_format="url",
)

# Using GPT Image 1 Mini for cost-effective generation
response = client.images.generate(
    model="gpt-image-1-mini",
    prompt="A pixel art style portrait of a cat wearing sunglasses",
    size="1024x1536",  # Portrait orientation
    quality="high",  # Specify quality level
    response_format="url",
)
```

### Image Quality

Control the quality of the generated image using the `quality` parameter:

- `low` - Faster generation but lower quality
- `medium` - Balanced quality and speed
- `high` - Highest quality but slower generation
- `auto` (default)

```python
response = client.images.generate(
    model="gpt-image-2",
    prompt="A detailed illustration of a fantasy castle",
    quality="high",  # Highest quality
    response_format="url",  # or b64_json
)
```

### Output Format and Compression

You can specify the output format and compression level:

```python
response = client.images.generate(
    model="gpt-image-2",
    prompt="A minimalist logo design with geometric shapes",
    output_format="jpeg",
    output_compression=75,  # Compression level (0-100)
    response_format="url",  # or b64_json
)
```

### Transparent Background

For formats that support transparency (PNG, WEBP), you can request a transparent background:

```python
response = client.images.generate(
    model="gpt-image-2",
    prompt="A 3D rendered icon of a rocket on a transparent background",
    output_format="png",
    response_format="url",  # or b64_json
    # The model will automatically create a transparent background when mentioned in the prompt
)
```

## Editing Images

GPT Image models can modify existing images based on text instructions. Prefer `gpt-image-2` for production edits where identity, labels, layout, or visual fidelity matter.

For direct HTTP REST API calls, the editing endpoint is `https://api.avalai.ir/v1/images/edits`.
### Basic Image Editing

```python
# Open an existing image - using GPT Image 2
with open("input_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="gpt-image-2",
        image=image_file,
        prompt=(
            "Change only the background to a tropical beach. "
            "Keep the person, pose, clothing, lighting direction, and camera angle the same."
        ),
        response_format="url",  # or b64_json
    )

# Get the edited image URL
edited_image_url = response.data[0].url

# Using GPT Image 1 Mini for cost-effective editing
with open("input_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="gpt-image-1-mini",
        image=image_file,
        prompt="Change the background to a tropical beach",
        response_format="url",  # or b64_json
    )
```

### Combining Multiple Images

You can provide up to 10 input images to combine or reference:

```python
with open("image1.jpg", "rb") as img1, open("image2.jpg", "rb") as img2:
    response = client.images.edit(
        model="gpt-image-2",
        image=[img1, img2],
        prompt=(
            "Image 1 is the person. Image 2 is the setting. "
            "Place the person from Image 1 naturally into Image 2. "
            "Match perspective, lighting, scale, and shadows."
        ),
        response_format="url",  # or b64_json
    )
```

## Using Masks for Precise Editing

For more precise control over which parts of an image are modified, you can provide a mask with an alpha channel:

```python
with open("input_image.jpg", "rb") as image_file, open("mask.png", "rb") as mask_file:
    response = client.images.edit(
        model="gpt-image-2",
        image=image_file,
        mask=mask_file,
        prompt="Add colorful flowers to the masked area",
        response_format="url",  # or b64_json
    )
```

### Creating a Mask with Alpha Channel

If you need to create a mask with an alpha channel from a black and white image:

```python
from PIL import Image
from io import BytesIO

# Load black & white mask as grayscale
mask = Image.open("bw_mask.png").convert("L")

# Convert to RGBA and use the mask itself for the alpha channel
mask_rgba = mask.convert("RGBA")
mask_rgba.putalpha(mask)

# Save the mask with alpha channel
mask_rgba.save("mask_with_alpha.png", "PNG")
```

## Choosing a GPT Image Model

### Use GPT Image 2 when:

- you are starting a new image workflow
- you need the best prompt adherence and visual fidelity
- images include readable text, UI, labels, logos, or infographics
- edits must preserve identity, layout, product labels, or camera perspective
- fewer retries matter more than the lowest possible unit cost

### Use GPT Image 1.5 or GPT Image 1 when:

- you have an existing validated workflow and want a controlled migration
- you need temporary backward compatibility while comparing outputs

### Use GPT Image 1 Mini when:

- You need cost-effective image generation
- Working with high-volume applications
- Prototyping or iterating on ideas
- Quality requirements are high but don't need the absolute maximum

For most new production work, start with `gpt-image-2` and use `quality="low"` for fast drafts, `quality="medium"` for general use, and `quality="high"` for text-heavy, detailed, or final assets.

## Best Practices for GPT Image Models

1. **Be specific and detailed in your prompts** - The model responds well to detailed descriptions, including style, lighting, composition, and subject details.

2. **Specify the desired style explicitly** - For example, "photorealistic," "oil painting," "digital art," "pencil sketch," etc.

3. **Use reference images when possible** - When editing or trying to achieve a specific style, providing reference images can help guide the model.

4. **Experiment with quality settings** - Try different quality settings based on your needs for speed vs. detail.

5. **Use masks and invariants for precise control** - When modifying one part of an image, provide a mask when available and explicitly list what must remain unchanged.

6. **Mention transparency in the prompt** - If you need a transparent background, explicitly mention it in your prompt.

## Limitations

- The model may occasionally generate images that don't exactly match your prompt
- Very complex scenes with multiple elements might not be rendered perfectly
- Text rendering within images may be inconsistent or inaccurate
- When using masks, some bleeding beyond mask boundaries may occur
- Consider `quality="low"` or GPT Image 1 Mini for early iterations, then `gpt-image-2` with `quality="high"` for final text-heavy or fidelity-sensitive outputs

## Conclusion

GPT Image models offer powerful tools for creating and editing images with simple text prompts. For new AvalAI workflows, `gpt-image-2` is the best default: it follows detailed prompts well, handles production-style visual briefs, and is stronger for text, layouts, product mockups, and precise edits.

For more information on image generation with AvalAI, please refer to our [Image Generation Guide](en/guides/image-generation.md).
