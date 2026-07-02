# Black Forest Labs (BFL) Models

AvalAI provides seamless access to Black Forest Labs' FLUX models through our unified API. This page details the available BFL models, their capabilities, and optimal use cases for state-of-the-art image generation and editing.

## Available Models

Black Forest Labs offers cutting-edge image generation models under the FLUX family, each designed for different performance requirements and use cases.

### FLUX Models

The FLUX family represents the latest advancement in image generation technology, offering high-quality image synthesis with various optimization levels.

### flux.2-pro

FLUX.2 Pro (`flux.2-pro`) is Black Forest Labs' most advanced image generation model with multi-reference visual intelligence, unprecedented detail, color precision, and spatial reasoning.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Model Type | Image Generation |
| Max Resolution | Up to 4 megapixels (4096x4096 pixels) |
| Supported Formats | PNG, JPEG |
| Multi-Reference | Up to 8 input images (API), 10 (playground) |
| Input | Text prompts, reference images |
| Output | High-quality images |
| Pricing | $0.03 per megapixel (first MP), $0.015 per additional MP |
| Reference Image Pricing | $0.015 per megapixel |
| Strengths | Multi-reference compositing, color precision, typography, photorealism |
| Best for | Product marketing, creative platforms, food imagery, movie making |

> **💡 Language Tip:** FLUX.2 Pro is optimized for English prompts. For best results, use English prompts when generating images. Non-English prompts may produce inconsistent results.

**Key Capabilities:**

- **Multi-Reference**: Combine elements from up to 8 images while maintaining identity across complex scenes
- **Photorealism & Detail**: Generate photorealistic images with exceptional detail
- **Typography & Text**: Specialized for text rendering and preserving small details
- **Exact Color Control**: Precise hex color matching and structured prompting
- **Grounding Search**: Access real-time information to visualize trending products and current events (max variant only)

**Pricing Notes:**
- 1 megapixel = 1024x1024 pixels
- Resolution is always rounded up to the next megapixel
- For multiple reference images, each is counted separately
- Images exceeding 4 megapixels are resized to 4 megapixels

```python
from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="flux.2-pro",
    prompt="A professional headshot of a confident businesswoman in a modern office, soft natural lighting, shallow depth of field",
    size="1024x1024",
    n=1,
    response_format="b64_json",
)

# Save the image
img_data = base64.b64decode(response.data[0].b64_json)
with open("professional_headshot.png", "wb") as f:
    f.write(img_data)
```

### flux-1.1-pro

FLUX 1.1 Pro (`flux-1.1-pro`) is Black Forest Labs' flagship image generation model, offering the highest quality output with advanced prompt adherence.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Model Type | Image Generation |
| Max Resolution | 2048x2048 pixels |
| Supported Formats | PNG, JPEG |
| Input | Text prompts |
| Output | High-quality images |
| Pricing | $0.04 per image |
| Strengths | Superior image quality, excellent prompt following, photorealistic results |
| Best for | Professional image generation, marketing materials, high-quality artwork |
| Speed | Standard generation time |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="flux-1.1-pro",
    prompt="A serene mountain landscape at sunset with reflective lake",
    size="1024x1024",
    n=1,
    response_format="b64_json",  # or b64_json
)

# Save with transparency
import base64

img_data = base64.b64decode(response.data[0].b64_json)
with open("no_background.png", "wb") as f:
    f.write(img_data)
```

### flux.1-kontext-pro

FLUX.1 Kontext Pro (`flux.1-kontext-pro`) is an advanced model specialized in image editing and contextual modifications while maintaining high quality.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Model Type | Image Generation & Editing |
| Max Resolution | 2048x2048 pixels |
| Supported Formats | PNG, JPEG |
| Input | Text prompts, images for editing |
| Output | High-quality generated or edited images |
| Pricing | $0.04 per image |
| Strengths | Context-aware editing, precise modifications, maintains image coherence |
| Best for | Image editing, style transfer, contextual modifications |
| Special Features | Advanced image-to-image capabilities |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Image editing
with open("test_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="flux.1-kontext-pro",
        image=image_file,
        prompt="Change the sky to a dramatic sunset",
        size="1024x1024",
        n=1,
        response_format="b64_json",  # not supporting 'url'
    )

    # Save the image
    import base64

    img_data = base64.b64decode(response.data[0].b64_json)
    with open("edited_image.png", "wb") as f:
        f.write(img_data)
```

## Key Capabilities

### Advanced Image Generation

FLUX models excel in creating high-quality, photorealistic images with exceptional prompt adherence:

- **Photorealism**: Generate highly realistic images that are difficult to distinguish from photographs
- **Artistic Styles**: Support for various artistic styles and creative interpretations
- **Complex Scenes**: Handle complex multi-object scenes with accurate spatial relationships

### Prompt Understanding

Black Forest Labs models feature sophisticated prompt interpretation:

- **Natural Language**: Understand detailed natural language descriptions
- **Style Instructions**: Interpret artistic style and mood directions
- **Technical Specifications**: Handle technical photography and art terminology

### Image Editing Capabilities

FLUX.1 Kontext Pro provides advanced editing features:

- **Context Preservation**: Maintain image coherence during edits
- **Selective Modifications**: Make targeted changes without affecting the entire image
- **Style Consistency**: Ensure edits match the original image style

## Model Selection Guidelines

### Choosing the Right FLUX Model

When selecting a FLUX model through AvalAI, consider:

1. **Quality Requirements**: Use `flux-1.1-pro` for highest quality generation
2. **Editing Needs**: Use `flux.1-kontext-pro` for image editing and modifications
3. **Use Case**: Both models offer professional-grade results at the same pricing
4. **Workflow**: Consider whether you need generation-only or editing capabilities

## Pricing Information

FLUX models are available through AvalAI with competitive pricing:

| Model | Price per Image |
|-------|----------------|
| flux-1.1-pro | $0.04 |
| flux.1-kontext-pro | $0.04 |

### Pricing Notes

- **Fixed Rate**: Simple per-image pricing regardless of resolution (up to max supported)
- **No Hidden Costs**: Transparent pricing with no additional fees
- **Professional Quality**: Enterprise-grade results at competitive rates

### Performance Comparison

| Use Case | Recommended FLUX Model | Alternative Models |
| --------------------------------- | ----------------------------- | ------------------------------ |
| High-quality image generation | flux-1.1-pro | gpt-image-2, Midjourney |
| Image editing & modification | flux.1-kontext-pro | gpt-image-2 (edit), Stable Diffusion |
| Professional artwork | flux-1.1-pro | Imagen 4, gpt-image-2 |
| Marketing materials | flux-1.1-pro | Imagen 4, gpt-image-2 |
| Creative projects | flux.1-kontext-pro | Stable Diffusion, Midjourney |

## Best Practices for FLUX Models

### Effective Prompting

Provide clear and detailed descriptions. FLUX models excel with specific instructions about style, composition, and mood.

```python
# Good prompt example
prompt = "A professional headshot of a confident businesswoman in a modern office, soft natural lighting, shallow depth of field, shot with 85mm lens"

# Rather than
prompt = "woman in office"
```

### Image Editing Guidelines

When using FLUX.1 Kontext Pro for editing:

1. **Describe Changes Clearly**: Be specific about what you want to modify
2. **Maintain Context**: Ensure edits fit the overall image context
3. **Consider Lighting**: Account for existing lighting conditions in your edit requests

### Quality Optimization

- Use detailed prompts for better results
- Specify desired image style and mood
- Include technical photography terms when relevant
- For editing, describe the relationship between new and existing elements

## Integration Examples

### Basic Image Generation

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="flux-1.1-pro",
    prompt="A futuristic cityscape at night with neon lights reflecting on wet streets",
    size="1024x1024",
    quality="hd",
    n=1,
    response_format="b64_json",  # not supporting 'url'
)

# Save the image
import base64

img_data = base64.b64decode(response.data[0].b64_json)
with open("image.png", "wb") as f:
    f.write(img_data)
```

### Image Editing Workflow

```python
import requests
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Edit an existing image
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="flux.1-kontext-pro",
        image=image_file,
        prompt="Add a rainbow in the sky above the mountains",
        size="1024x1024",
        n=1,
        response_format="b64_json",  # not supporting 'url'
    )

# Save the image
import base64

img_data = base64.b64decode(response.data[0].b64_json)
with open("edited_image.png", "wb") as f:
    f.write(img_data)
```

## Related Resources

- [Black Forest Labs Official Documentation](https://docs.bfl.ai/quick_start/introduction)
- [Image Generation Guide](en/guides/image-generation.md)
- [API Reference - Images](en/api-reference/images.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Best Practices for Image Generation](en/guides/best-practices.md)

---

*Black Forest Labs and FLUX are trademarks of Black Forest Labs. This documentation is provided by AvalAI for integration purposes.*