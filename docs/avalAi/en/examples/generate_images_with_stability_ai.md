# Generate Images with Stability AI Models

## Introduction

Stability AI offers powerful image generation models that are accessible through AvalAI's unified API. This guide will walk you through how to use Stability AI models to generate high-quality images for various use cases, from photorealistic renderings to artistic creations.

## Key Features

- **Photorealistic generation** - Create highly realistic images with SD3 models
- **Versatile image creation** - Generate various styles from artistic to photographic
- **Fine-tuned control** - Adjust parameters like seed, negative_prompt, and mode for precise results
- **Multiple model options** - Choose between SD3 and Stable Image variants based on your needs
- **Different quality tiers** - Select from Core and Ultra models depending on quality requirements

## Available Models

AvalAI provides access to several Stability AI models:

- **SD3 Models**: 
  - `stability.sd3-large-v1:0`
  - `stability.sd3-5-large-v1:0`
  
- **Stable Image Core Models**:
  - `stability.stable-image-core-v1:0`
  - `stability.stable-image-core-v1:1`
  
- **Stable Image Ultra Models**:
  - `stability.stable-image-ultra-v1:0`
  - `stability.stable-image-ultra-v1:1`

## Basic Image Generation

To generate an image with Stability AI models, you need to provide a text prompt describing what you want to create. The more detailed your prompt, the better the results.

## Important Warnings

Before you start generating images with Stability AI models, be aware of these critical limitations:

1. **No U+200C Character Support**: Prompts cannot contain the U+200C character (ZERO WIDTH NON-JOINER). Including this character will cause the request to fail.

2. **English Prompts Recommended**: Stability AI models have poor understanding of non-English languages, especially Persian. For best results, use English prompts even when the rest of your application is in another language.

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A photorealistic mountain landscape with a lake reflecting the sunset, detailed lighting, high resolution",
    size="1024x1024",
    response_format="url",  # or b64_json
)

# Get the image URL
image_url = response.data[0].url
print(f"Generated image URL: {image_url}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "stability.sd3-5-large-v1:0",
  prompt:
    "A photorealistic mountain landscape with a lake reflecting the sunset, detailed lighting, high resolution",
  size: "1024x1024",
  response_format: "url", # or b64_json
});

// Get the image URL
const imageUrl = response.data[0].url;
console.log(`Generated image URL: ${imageUrl}`);

```

## Customizing Generation Parameters

Stability AI models offer several parameters to customize the image generation process. These parameters can be passed using the `extra_body` parameter or directly as undocumented parameters with `// @ts-expect-error` for TypeScript users:

### Using extra_body for Parameters

The standard approach is to use the `extra_body` parameter:

### Using Negative Prompts

Negative prompts help define what you don't want to see in the generated image:

```python
response = client.images.generate(
    model="stability.stable-image-ultra-v1:1",
    prompt="A fantasy castle on a floating island with waterfalls cascading down the sides, magical atmosphere",
    size="1024x1024",
    extra_body={
        "negative_prompt": "dark, gloomy, scary, ruins, destroyed, low quality"
    },
)
```

### Creating Reproducible Results with Seed

The `seed` parameter allows you to generate the same or similar images by using a fixed random seed value:

```python
# Generate an image with a specific seed
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A futuristic cityscape at night with neon lights and flying vehicles",
    size="1024x1024",
    extra_body={"seed": 42424},  # Fixed seed for reproducibility
)

# Generate a variation using the same seed but a slightly different prompt
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A futuristic cityscape at sunset with neon lights and flying vehicles",
    size="1024x1024",
    extra_body={"seed": 42424},  # Same seed as before
)
```

### Selecting Image Dimensions

You can specify the dimensions of your generated image using the `size` parameter:

```python
# Landscape orientation (16:9)
response = client.images.generate(
    model="stability.stable-image-core-v1:1",
    prompt="A wide panoramic view of a beautiful landscape with mountains and a river",
    size="1792x1024",
)

# Portrait orientation (9:16)
response = client.images.generate(
    model="stability.stable-image-core-v1:1",
    prompt="A tall skyscraper reaching into the clouds, viewed from street level",
    size="1024x1792",
)
```

### Setting Generation Mode

You can specify the generation mode using the `mode` parameter:

```python
# Text-to-image mode (default)
response = client.images.generate(
    model="stability.stable-image-ultra-v1:1",
    prompt="A futuristic robot in a garden, detailed mechanical parts",
    size="1024x1024",
    extra_body={"mode": "text-to-image"},
)
```

### Using Undocumented Parameters Directly (JavaScript/TypeScript)

For TypeScript users, you can also pass undocumented parameters directly using `// @ts-expect-error`:

```javascript
// Using undocumented parameters directly with @ts-expect-error
const response = await client.images.generate({
  model: "stability.stable-image-ultra-v1:1",
  prompt: "A futuristic robot in a garden, detailed mechanical parts",
  size: "1024x1024",
  // @ts-expect-error mode is an undocumented parameter
  mode: "text-to-image",
  // @ts-expect-error negative_prompt is an undocumented parameter
  negative_prompt: "blurry, low quality, distorted features",
  // @ts-expect-error seed is an undocumented parameter
  seed: 12345,
  response_format: "url", // or b64_json
});
```

This approach allows you to pass undocumented parameters directly in the request object rather than nesting them in the `extra_body` property. The library doesn't validate at runtime that the request matches the type, so any extra values you send will be sent as-is to the Stability AI API.

## Choosing the Right Model

Different Stability AI models are optimized for different use cases:

### SD3 Models for Photorealism

SD3 models excel at creating photorealistic images with high fidelity to the prompt.

```python
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A photorealistic close-up portrait of a person with freckles, natural lighting, detailed skin texture, professional photography",
    size="1024x1024",
    extra_body={
        "seed": 12345,
        "negative_prompt": "blurry, low quality, distorted features, unrealistic skin",
    },
)
```

### Stable Image Core for General Purpose

Stable Image Core models provide a good balance between quality and generation speed, making them suitable for a wide range of applications.

```python
response = client.images.generate(
    model="stability.stable-image-core-v1:1",
    prompt="A colorful illustration of a fantasy character, digital art style",
    size="1024x1024",
    extra_body={"seed": 67890, "negative_prompt": "dull, monochrome, poor details"},
)
```

### Stable Image Ultra for Highest Quality

Stable Image Ultra models offer the highest quality output with more detailed control, ideal for professional use cases.

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

## Best Practices for Stability AI Models

1. **Use English prompts** - Stability AI models work best with English prompts, even if your application is in another language.

2. **Be specific and detailed in your prompts** - Include information about style, lighting, camera angle, and specific details you want to see.

3. **Use negative prompts effectively** - Specify what you don't want to see in the image to avoid common issues like blurriness or distortion.

4. **Save seeds of images you like** - When you get a result you like, note the seed value to create variations or similar images later.

5. **Choose the right model for your use case** - Use SD3 for photorealism, Stable Image Core for general purpose, and Stable Image Ultra for highest quality professional work.

6. **Consider aspect ratio carefully** - Different aspect ratios can dramatically affect composition. Choose based on your intended use.

7. **Use descriptive style terms** - Include terms like "photorealistic," "digital art," "oil painting," "pencil sketch," etc., to guide the style.

8. **Avoid special characters** - Don't use characters like U+200C (ZERO WIDTH NON-JOINER) in your prompts as they will cause failures.

## Limitations

- The models may occasionally generate images that don't exactly match your prompt
- Very complex scenes with multiple elements might not be rendered perfectly
- Text rendering within images may be inconsistent or inaccurate
- Some models may have specific size constraints or parameter limitations
- Poor understanding of non-English languages, especially Persian
- Cannot process prompts containing U+200C character (ZERO WIDTH NON-JOINER)

## Conclusion

Stability AI models provide powerful tools for creating high-quality images across a range of styles and use cases. By understanding the different models and parameters available, you can generate images that meet your specific needs, from photorealistic renderings to artistic illustrations.

For more information on image generation with AvalAI, please refer to our [Image Generation Guide](en/guides/image-generation.md) and the [Stability AI Models documentation](en/providers/stabilityai.md).