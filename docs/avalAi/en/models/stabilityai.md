# Stability AI Models

AvalAI provides access to Stability AI's powerful image generation models through our unified API. This page details the available Stability AI models, their capabilities, and optimal use cases, focusing on the latest generations.

## Available Models

Stability AI offers several state-of-the-art image generation models, each with specific strengths and capabilities.

### SD3 Models

SD3 models represent Stability AI's advanced diffusion models specialized for photorealistic image generation with exceptional prompt following capabilities.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Provider | AWS Bedrock |
| Strengths | Photorealistic image generation, strong prompt following, high-quality details |
| Best for | Professional-quality images, realistic visualizations, detailed concept art |

!> Important Warnings:
When using Stability AI models, be aware of these critical limitations:
1. **No U+200C Character Support**: Prompts cannot contain the U+200C character (ZERO WIDTH NON-JOINER). Including this character will cause the request to fail.
2. **English Prompts Recommended**: Stability AI models have poor understanding of non-English languages, especially Persian. For best results, use English prompts even when the rest of your application is in another language.

#### ~~stability.sd3-large-v1:0~~ - **Deprecated**

The SD3 large model offers exceptional image quality with strong photorealistic capabilities.

```

#### stability.sd3-5-large-v1:0

The SD3.5 large model is the latest iteration with improved capabilities for generating highly detailed and realistic images.

```python
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A detailed portrait of a character with intricate costume design, studio lighting, professional photography",
    size="1024x1024",
    extra_body={
        "seed": 12345,
        "negative_prompt": "blurry, low quality, distorted, deformed features",
    },
)
```

### Stable Image Models

Stability AI's Stable Image models come in two variants: Core and Ultra, each designed for different use cases and quality requirements.

#### Stable Image Core Models

Stable Image Core models are optimized for general-purpose image creation with a good balance between quality and speed.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Model IDs | stability.stable-image-core-v1:0, stability.stable-image-core-v1:1 |
| Provider | AWS Bedrock |
| Strengths | Good quality/speed balance, versatile image generation |
| Best for | General-purpose image creation, concept visualization, content generation |

```python
response = client.images.generate(
    model="stability.stable-image-core-v1:1",
    prompt="A colorful illustration of a fantasy landscape with floating islands and waterfalls",
    size="1024x1024",
    extra_body={"seed": 67890, "negative_prompt": "dull, monochrome, flat, no depth"},
)
```

#### Stable Image Ultra Models

Stable Image Ultra models provide the highest quality outputs with more detailed control, ideal for professional use cases where quality is paramount.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Model IDs | stability.stable-image-ultra-v1:0, stability.stable-image-ultra-v1:1 |
| Provider | AWS Bedrock |
| Strengths | Highest quality outputs, fine-grained detail control |
| Best for | Professional artwork, detailed visualizations, high-quality marketing materials |

```python
response = client.images.generate(
    model="stability.stable-image-ultra-v1:1",
    prompt="A hyper-detailed digital artwork of a futuristic cityscape at night with neon lights reflecting on wet streets, cinematic lighting, 8k resolution",
    size="1024x1024",
    extra_body={
        "seed": 54321,
        "negative_prompt": "daylight, blurry, low resolution, poor details",
        "mode": "text-to-image",
    },
)
```

## Key Parameters

Stability AI models support several parameters that allow fine-tuning of the image generation process. These parameters must be passed using the `extra_body` parameter in the OpenAI client:

### Core Parameters

| Parameter | Description | Default | Availability |
|-----------|-------------|---------|-------------|
| `prompt` | Text description of the desired image | Required | All models |
| `negative_prompt` | Text description of what to avoid in the image | None | All models |
| `seed` | Random noise seed for reproducible results | Random | All models |
| `mode` | Generation mode ("text-to-image" or "image-to-image") | "text-to-image" | All models |
| `strength` | Strength of the effect when editing images | 0.8 | Some models (used with image-to-image mode) |
| `output_format` | Format of the output image | "png" | Some models |
| `aspect_ratio` | Aspect ratio of the generated image | Model-specific | Some models |

### Size Options

Different models support different dimension constraints:

- SD3 models typically support dimensions between 512x512 and 1024x1024
- Stable Image models may support additional sizes and aspect ratios

## Example Usage

### Basic Image Generation

To generate an image with minimal parameters:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A serene Japanese garden with cherry blossoms, a small bridge over a pond, and traditional architecture",
    response_format="url",  # or b64_json
)

# Get the image URL
image_url = response.data[0].url
print(f"Generated image URL: {image_url}")
```

### Advanced Parameter Usage

For more control over the generated image:

```python
response = client.images.generate(
    model="stability.stable-image-ultra-v1:1",
    prompt="A detailed portrait of a fantasy character, warrior with ornate armor, dramatic lighting, detailed facial features",
    size="1024x1024",
    extra_body={
        "seed": 42424,  # Fixed seed for reproducibility
        "negative_prompt": "blurry, low quality, deformed features, unrealistic lighting",
        "mode": "text-to-image",  # Default generation mode
    },
    response_format="url",  # or b64_json
)

# Get the image URL
image_url = response.data[0].url
```

## Best Practices

To get the best results from Stability AI models:

1. **Be specific and detailed in your prompts** - Include details about style, lighting, composition, and subject characteristics.

2. **Use negative prompts effectively** - Specify what you don't want to see in the image to avoid common issues like blurriness, distortion, or unwanted elements.

3. **Use seed values for consistency** - When you find an image you like, save its seed value to generate variations or similar images later.

4. **Consider aspect ratio carefully** - Different aspect ratios can dramatically affect composition. Choose based on your intended use (landscape, portrait, square).

5. **Use the correct mode** - Use "text-to-image" for creating new images from scratch, and "image-to-image" when you want to modify an existing image.

6. **Structure your prompts well** - Start with the subject, then describe details, style, lighting, and other characteristics.

## Using Stability AI Models via AvalAI

All Stability AI models are accessible through the standard AvalAI API endpoints using OpenAI-compatible client libraries:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Example: Using SD3 Large model
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A beautiful landscape with mountains and lakes",
)

# Example: Using Stable Image Ultra model
response = client.images.generate(
    model="stability.stable-image-ultra-v1:1",
    prompt="A detailed character portrait in fantasy style",
    size="1024x1024",
    extra_body={
        "negative_prompt": "blurry, low quality, deformed features",
        "seed": 12345,
        "mode": "text-to-image",
    },
)
```

## Related Resources

- [Images API](en/api-reference/images.md)
- [Authentication](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)
- [Image Generation Guide](en/guides/image-generation.md)