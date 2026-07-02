# Generate and Edit Images with Seedream Models

ByteDance's Seedream models offer state-of-the-art image generation capabilities, from text-to-image generation to advanced image-to-image editing. This guide demonstrates how to harness their full potential through AvalAI's unified API.

## Introduction

Seedream models stand out with unique features:
- **Chain of Thought Reasoning** (5.0): Intelligent prompt analysis and optimization
- **MJ-Style Aesthetics** (5.0): Built-in support for Midjourney-style generation
- **Sequential Image Generation**: Create batches of thematically related images
- **Multi-Image Blending**: Combine multiple reference images with text prompts
- **High-Resolution Output**: Generate images up to 4K resolution
- **Streaming Support**: Real-time image generation with progressive updates
- **Advanced Control**: Fine-tune generation with specialized parameters

## Available Models

| Model | Capabilities | Best For |
|-------|-------------|----------|
| `seedream-5-0-260128` | CoT reasoning, MJ-style aesthetics, Text-to-image, Image-to-image, Intelligent prompt optimization | Premium creative content, artistic generation, professional photography |

## Basic Usage

### Text-to-Image Generation

Generate high-quality images from text descriptions:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Basic text-to-image generation
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A majestic dragon soaring through clouds at sunset, digital art style, highly detailed, cinematic lighting",
    size="2K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Generated image: {response.data[0].url}")
```

### Image-to-Image Editing

Transform existing images with text guidance:

```python
# Image-to-image editing
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="seedream-5-0-260128",
        image=image_file,
        prompt="Transform this landscape into a cyberpunk cityscape with neon lights and futuristic buildings",
        size="2K",
        response_format="url",
        extra_body={"sequential_image_generation": "disabled", "watermark": False},
    )

print(f"Edited image: {response.data[0].url}")
```

## Advanced Features

### Sequential Image Generation

Create batches of thematically related images automatically:

```python
# Sequential generation - let the model decide how many images
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A story of a magical forest through the four seasons, each showing different magical creatures and atmospheric changes",
    size="2K",
    extra_body={
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {"max_images": 6},
        "watermark": False,
    },
)

print(f"Generated {len(response.data)} images:")
for i, image in enumerate(response.data):
    print(f"Image {i+1}: {image.url}")
```

### Multi-Image Blending

Combine multiple reference images to create something new:

```python
# Multi-image blending
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="Create a modern architectural design that blends these different styles harmoniously",
    extra_body={
        "image": [
            "https://example.com/gothic-cathedral.jpg",
            "https://example.com/modern-skyscraper.jpg",
            "https://example.com/traditional-japanese-temple.jpg",
        ],
        "sequential_image_generation": "disabled",
        "size": "2K",
        "watermark": False,
    },
)

print(f"Blended architecture: {response.data[0].url}")
```

### Streaming Generation

Get real-time updates as images are generated:

```python
import requests
import json


def stream_image_generation():
    url = "https://api.avalai.ir/v1/images/generations"
    headers = {
        "Authorization": "Bearer your-avalai-api-key",
        "Content-Type": "application/json",
    }

    data = {
        "model": "seedream-5-0-260128",
        "prompt": "A series of concept art pieces for a fantasy video game, showing different environments and characters",
        "size": "2K",
        "stream": True,
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {"max_images": 5},
        "watermark": False,
    }

    response = requests.post(url, headers=headers, json=data, stream=True)

    for line in response.iter_lines():
        if line:
            try:
                chunk = json.loads(line.decode("utf-8").replace("data: ", ""))
                if "data" in chunk:
                    for image in chunk["data"]:
                        if "url" in image:
                            print(f"New image ready: {image['url']}")
                            print(f"Size: {image.get('size', 'Unknown')}")
            except json.JSONDecodeError:
                continue


# Run streaming generation
stream_image_generation()
```

## Resolution and Quality Control

### High-Resolution Generation

Generate images at different resolutions:

```python
# 4K high-resolution generation
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="An ultra-detailed portrait of a cyberpunk character with intricate mechanical augmentations, professional photography lighting, 8K quality",
    size="4K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"4K image: {response.data[0].url}")
print(f"Actual size: {response.data[0].size}")
```

### Custom Aspect Ratios

Generate images with specific dimensions:

```python
# Custom aspect ratio - wide cinematic
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A cinematic wide shot of a spaceship battle in deep space, epic scale, dramatic lighting",
    size="3024x1296",  # 21:9 aspect ratio
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Cinematic image: {response.data[0].url}")

# Portrait orientation
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A tall fantasy tower reaching into the clouds, vertical composition, detailed architecture",
    size="1440x2560",  # 9:16 aspect ratio
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Portrait image: {response.data[0].url}")
```

## Creative Applications

### Style Transfer and Artistic Effects

```python
# Style transfer example
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="seedream-5-0-260128",
        image=image_file,
        prompt="Transform this photo into a Van Gogh painting style with swirling brushstrokes and vibrant colors",
        size="2K",
        response_format="url",
        extra_body={"sequential_image_generation": "disabled", "watermark": False},
    )

print(f"Van Gogh style: {response.data[0].url}")

# Multiple style variations
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="seedream-5-0-260128",
        image=image_file,
        prompt="Create artistic variations of this portrait in different styles: oil painting, watercolor, digital art, and pencil sketch",
        size="2K",
        extra_body={
            "sequential_image_generation": "auto",
            "sequential_image_generation_options": {"max_images": 4},
            "watermark": False,
        },
    )

print(f"Generated {len(response.data)} style variations:")
for i, image in enumerate(response.data):
    print(f"Style {i+1}: {image.url}")
```

### Product Visualization

```python
# Product mockup generation
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A sleek modern smartphone on a minimalist desk setup, professional product photography, clean background, studio lighting",
    size="2K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Product mockup: {response.data[0].url}")

# Multiple product angles
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="Professional product shots of a luxury watch from multiple angles: front view, side profile, back view, and wrist shot",
    size="2K",
    extra_body={
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {"max_images": 4},
        "watermark": False,
    },
)

print(f"Generated {len(response.data)} product angles:")
for i, image in enumerate(response.data):
    print(f"Angle {i+1}: {image.url}")
```

### Character Design and Concept Art

```python
# Character design variations
response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="Fantasy character design: a powerful wizard with unique magical abilities, show different outfit variations and poses",
    size="2K",
    extra_body={
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {"max_images": 6},
        "watermark": False,
    },
)

print(f"Character variations: {len(response.data)} designs")
for i, image in enumerate(response.data):
    print(f"Design {i+1}: {image.url}")
```

## JavaScript/Node.js Examples

### Basic Usage with Node.js

```javascript
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

async function generateImage() {
    try {
        const response = await client.images.generate({
            model: "seedream-5-0-260128",
            prompt: "A beautiful sunset over a mountain landscape, photorealistic, high detail",
            size: "2K",
            response_format: "url",
            // @ts-expect-error extra_body is a provider-specific parameter
            extra_body: {
                "sequential_image_generation": "disabled",
                "watermark": false
            }
        });

        console.log("Generated image:", response.data[0].url);
        return response.data[0].url;
    } catch (error) {
        console.error("Error generating image:", error);
    }
}

generateImage();
```

### Sequential Generation with Node.js

```javascript
async function generateImageSeries() {
    try {
        const response = await client.images.generate({
            model: "seedream-5-0-260128",
            prompt: "A time-lapse story of a city from dawn to midnight, showing the changing atmosphere and lighting",
            size: "2K",
            // @ts-expect-error extra_body is a provider-specific parameter
            extra_body: {
                "sequential_image_generation": "auto",
                "sequential_image_generation_options": {
                    "max_images": 8
                },
                "watermark": false
            }
        });

        console.log(`Generated ${response.data.length} images in the series:`);
        response.data.forEach((image, index) => {
            console.log(`Time ${index + 1}: ${image.url}`);
        });

        return response.data;
    } catch (error) {
        console.error("Error generating image series:", error);
    }
}

generateImageSeries();
```

## Direct API Calls

### Using cURL

```bash
# Basic text-to-image generation
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "seedream-5-0-260128",
    "prompt": "A futuristic city skyline at night with flying cars and neon lights",
    "sequential_image_generation": "disabled",
    "response_format": "url",
    "size": "2K",
    "watermark": false
  }'

# Sequential generation
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "seedream-5-0-260128",
    "prompt": "A collection of fantasy creatures in their natural habitats",
    "sequential_image_generation": "auto",
    "sequential_image_generation_options": {
      "max_images": 5
    },
    "response_format": "url",
    "size": "2K",
    "watermark": false
  }'

# Image editing
curl https://api.avalai.ir/v1/images/edits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "seedream-5-0-260128",
    "image": "https://example.com/input-image.jpg",
    "prompt": "Add magical elements and fantasy lighting to this scene",
    "sequential_image_generation": "disabled",
    "response_format": "url",
    "size": "2K",
    "watermark": false
  }'
```

## Best Practices

### Prompt Engineering

1. **Be Specific and Detailed**
   ```python
# Good prompt
   prompt = "A steampunk airship flying through storm clouds, brass and copper details, Victorian era design, dramatic lighting with lightning, highly detailed mechanical components, cinematic composition"
   
   # Less effective prompt
   prompt = "A cool airship"
```

2. **Include Technical Specifications**
   ```python
prompt = "Professional product photography of a luxury watch, macro lens, studio lighting, white background, commercial quality, high resolution, sharp focus"
```

3. **Specify Artistic Style**
   ```python
prompt = "Digital painting in the style of concept art, matte painting technique, photorealistic rendering, trending on ArtStation"
```

### Performance Optimization

1. **Choose Appropriate Resolution**
   ```python
# For web use
   size = "1K"  # Faster generation
   
   # For print or detailed work
   size = "4K"  # Higher quality, slower generation
```

2. **Use Streaming for Batch Generation**
   ```python
# Enable streaming for multiple images
   extra_body = {
       "stream": True,
       "sequential_image_generation": "auto"
   }
```

3. **Optimize Batch Sizes**
   ```python
# Balance between efficiency and resource usage
   sequential_image_generation_options = {
       "max_images": 5  # Sweet spot for most use cases
   }
```

## Error Handling

```python
import time
from openai import OpenAI


def robust_image_generation(prompt, max_retries=3):
    client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

    for attempt in range(max_retries):
        try:
            response = client.images.generate(
                model="seedream-5-0-260128",
                prompt=prompt,
                size="2K",
                response_format="url",
                extra_body={
                    "sequential_image_generation": "disabled",
                    "watermark": False,
                },
            )

            # Check if generation was successful
            if response.data and response.data[0].url:
                return response.data[0].url
            else:
                raise Exception("No image URL in response")

        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(2**attempt)  # Exponential backoff
            else:
                raise e


# Usage
try:
    image_url = robust_image_generation("A beautiful landscape painting")
    print(f"Successfully generated: {image_url}")
except Exception as e:
    print(f"Failed to generate image after all retries: {e}")
```

## Conclusion

Seedream 5.0 offers unprecedented capabilities for image generation and editing. Its unique features like sequential generation, multi-image blending, and streaming support make it ideal for both creative and commercial applications. By following the examples and best practices in this guide, you can harness the full potential of this state-of-the-art model through AvalAI's unified API.

## Related Resources

- [BytePlus Models Documentation](en/providers/byteplus.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [API Reference](en/api-reference/images.md)
- [Pricing Information](en/pricing.md)