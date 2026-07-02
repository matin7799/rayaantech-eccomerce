# BytePlus Models

BytePlus, ByteDance's cloud platform, offers cutting-edge AI models through AvalAI's unified API. BytePlus specializes in advanced image generation and editing capabilities, providing state-of-the-art models for creative and commercial applications.

## Available Models

BytePlus models are accessible through AvalAI's standard endpoints, offering seamless integration with familiar OpenAI-compatible APIs while providing access to ByteDance's innovative AI technologies.

### Image Generation Models

BytePlus offers the most advanced image generation models available, featuring both text-to-image and image-to-image capabilities with unprecedented quality and flexibility.

## Seedream 5.0

**Model ID:** `seedream-5-0-260128`

Seedream 5.0 is BytePlus's most advanced image generation model, featuring Chain of Thought (CoT) reasoning for intelligent prompt optimization and built-in MJ-style aesthetic generation. This model represents a significant leap forward in AI-assisted creative generation.

| Feature | Details |
|---------|---------|
| **Model Type** | Image Generation & Editing |
| **Max Resolution** | 4K (4096x4096 pixels) |
| **Supported Formats** | JPEG, PNG |
| **Input Methods** | Text prompts, Image URLs, Base64 |
| **Batch Generation** | Up to 15 images per request |
| **Multi-Image Input** | Up to 10 reference images |
| **Streaming Support** | Yes |
| **CoT Reasoning** | Built-in intelligent prompt optimization |
| **Pricing** | $0.035 per image ($35.00/1K images) |

### Key Capabilities

#### 🧠 **Chain of Thought Reasoning**
- **Intelligent Prompt Analysis**: Analyzes prompts to understand artistic intent
- **Automatic Enhancement**: Optimizes prompts for better visual outcomes
- **Style Recognition**: Identifies and enhances desired artistic styles
- **Composition Planning**: Plans image composition before generation

#### 🎨 **MJ-Style Aesthetic Generation**
- **Built-in Aesthetics**: Native support for Midjourney-style artistic generation
- **Photorealistic Quality**: Professional-grade photorealistic outputs
- **Artistic Versatility**: Support for various artistic styles and mediums
- **Typography Excellence**: Advanced text rendering with superior consistency

#### ⚡ **Technical Excellence**
- **High Resolution Support**: Generate images up to 4K resolution
- **Flexible Aspect Ratios**: Support ratios from 1:16 to 16:1
- **Real-time Streaming**: Progressive image generation with live updates
- **Smart Batch Processing**: Automatic determination of optimal image count

### Usage Examples

#### Text-to-Image Generation with CoT

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A serene Japanese garden at sunset with cherry blossoms",
    size="4K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Generated image: {response.data[0].url}")
```

#### Image Editing with CoT Reasoning

```python
response = client.images.edit(
    model="seedream-5-0-260128",
    image="https://example.com/input-image.jpg",
    prompt="Transform into a professional portrait with studio lighting and subtle background blur",
    size="2K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Edited image: {response.data[0].url}")
```

---

#### Streaming Generation

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
        "prompt": "A detailed digital artwork of a magical forest",
        "size": "2K",
        "stream": True,
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {"max_images": 3},
    }

    response = requests.post(url, headers=headers, json=data, stream=True)

    for line in response.iter_lines():
        if line:
            try:
                chunk = json.loads(line.decode("utf-8").replace("data: ", ""))
                if "data" in chunk:
                    for image in chunk["data"]:
                        if "url" in image:
                            print(f"Image ready: {image['url']}")
            except json.JSONDecodeError:
                continue


stream_image_generation()
```

## Key Parameters

### Core Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `model` | string | Model identifier | Required |
| `prompt` | string | Text description (max 600 words) | Required |
| `size` | string | Resolution: "1K", "2K", "4K" or "WxH" | "2048x2048" |
| `response_format` | string | "url" or "b64_json" | "url" |

### BytePlus-Specific Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `sequential_image_generation` | string | "auto" or "disabled" | "disabled" |
| `sequential_image_generation_options` | object | Batch generation settings | - |
| `max_images` | integer | Max images in batch (1-15) | 15 |
| `stream` | boolean | Enable streaming output | false |
| `watermark` | boolean | Add AI watermark | true |
| `image` | string/array | Reference image(s) for editing | - |

### Supported Resolutions

| Aspect Ratio | Recommended Dimensions |
|--------------|----------------------|
| 1:1 | 2048x2048 |
| 4:3 | 2304x1728 |
| 3:4 | 1728x2304 |
| 16:9 | 2560x1440 |
| 9:16 | 1440x2560 |
| 3:2 | 2496x1664 |
| 2:3 | 1664x2496 |
| 21:9 | 3024x1296 |

## Best Practices

### Prompt Engineering
1. **Be Descriptive**: Use detailed prompts up to 600 English words
2. **Style Specification**: Include artistic style, mood, and technical details
3. **Composition Details**: Specify lighting, perspective, and visual elements
4. **Quality Keywords**: Use terms like "high quality", "detailed", "professional"

### Technical Optimization
1. **Resolution Planning**: Choose appropriate resolution for your use case
2. **Batch Generation**: Use sequential generation for related image series
3. **Streaming for Large Batches**: Enable streaming for multiple image requests
4. **Format Selection**: Use URL format for web applications, Base64 for direct processing

### Image Input Guidelines
1. **Format Requirements**: JPEG or PNG formats only
2. **Size Limits**: Maximum 10MB per image, 6000x6000 pixels
3. **Aspect Ratios**: Keep within 1:3 to 3:1 range
4. **Multiple Images**: Up to 10 reference images for blending

## Use Cases

### Creative Applications
- **Digital Art Creation**: High-quality artwork and illustrations
- **Concept Art**: Visual development for games, films, and products
- **Style Transfer**: Transform images into different artistic styles
- **Creative Exploration**: Generate variations and iterations of ideas

### Commercial Applications
- **Marketing Materials**: Product visualizations and promotional graphics
- **Brand Assets**: Logo variations, brand imagery, and visual identity
- **Content Creation**: Social media graphics, blog illustrations
- **E-commerce**: Product mockups and lifestyle imagery

### Technical Applications
- **Prototyping**: Quick visualization of design concepts
- **Batch Processing**: Generate series of related images efficiently
- **Image Enhancement**: Improve and transform existing imagery
- **Custom Workflows**: Integrate with existing creative pipelines

## Integration with AvalAI

Seedream 5.0 integrates seamlessly with AvalAI's unified API ecosystem:

- **OpenAI Compatibility**: Use familiar OpenAI client libraries
- **Standard Endpoints**: `v1/images/generations` and `v1/images/edits`
- **Unified Authentication**: Single API key for all models
- **Consistent Response Format**: Standard JSON responses across all providers
- **Error Handling**: Unified error codes and messages

## Limitations

1. **Content Filtering**: Images may be rejected by content safety filters
2. **Generation Time**: High-resolution images may take longer to generate
3. **Batch Limits**: Maximum 15 images per request (including reference images)
4. **Language Support**: Prompts work best in English
5. **URL Expiration**: Generated image URLs expire after 24 hours

## Related Resources

- [Image Generation Guide](en/guides/image-generation.md)
- [API Reference](en/api-reference/images.md)
- [Seedream 5.0 Examples](en/examples/generate_images_with_seedream_4.md)
- [Pricing Information](en/pricing.md)

---

*BytePlus models are provided through ByteDance's cloud platform and integrated into AvalAI's unified API for seamless access and consistent developer experience.*