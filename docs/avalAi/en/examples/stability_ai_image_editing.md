# Stability AI Image Editing Services - Complete Guide

This comprehensive guide demonstrates all 9 specialized Stability AI image editing services available through AvalAI's `v1/images/edits` endpoint. These examples follow the implementation patterns from the [AWS Bedrock Stability AI Image Services documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/stable-image-services.html).

## Overview

AvalAI provides access to 9 specialized image editing services from Stability AI, each optimized for specific professional creative workflows:

### Edit Services
1. **Inpaint** - Fill masked areas intelligently
2. **Search & Recolor** - Change object colors
3. **Search & Replace** - Replace objects with prompts
4. **Erase Object** - Remove unwanted elements
5. **Remove Background** - Isolate subjects

### Control Services
6. **Control Sketch** - Generate from sketches
7. **Control Structure** - Maintain structure, change style
8. **Style Guide** - Generate in specific style
9. **Style Transfer** - Apply artistic styles

## Setup

All examples use the OpenAI SDK with AvalAI's endpoint:

```language-selector
python=:from openai import OpenAI
import base64
import requests

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",
)

javascript=:import { OpenAI } from "openai";
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

bash=:# Set your API key
export AVALAI_API_KEY="your-avalai-api-key"

```

---

## 1. Inpaint - Fill Masked Areas

**Use Case:** Fill gaps, remove objects with context, or add new elements to specific areas.

**Input Requirements:** Original image + mask (white areas will be filled)

### Example: Fill Masked Area

| Input Image | Mask | Output Result |
|-------------|------|---------------|
| ![Input](../_media/img/input-image-inpaint.jpg ':size=1000') | ![Mask](../_media/img/mask-image-inpaint.png ':size=1000') | ![Output](../_media/img/output-image-inpaint.jpg ':size=1000') |

```language-selector
python=:# Inpaint example
with open("input-image-inpaint.jpg", "rb") as img, open(
    "mask-image-inpaint.png", "rb"
) as msk:
    response = client.images.edit(
        model="stability.stable-image-inpaint-v1:0",
        image=img,
        mask=msk,
        prompt="artificer of time and space",
        extra_body={
            "style_preset": "photographic",
            "negative_prompt": "blurry, low quality",
            "seed": 42,
            "grow_mask": 5,
        },
        response_format="url",  # or b64_json
    )

print(f"Inpainted image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-inpaint-v1:0",
    image: fs.createReadStream("input-image-inpaint.jpg"),
    mask: fs.createReadStream("mask-image-inpaint.png"),
    prompt: "artificer of time and space",
    extra_body: {
        style_preset: "photographic",
        negative_prompt: "blurry, low quality",
        seed: 42,
        grow_mask: 5
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-inpaint-v1:0" \
  -F "image=@input-image-inpaint.jpg" \
  -F "mask=@mask-image-inpaint.png" \
  -F "prompt=artificer of time and space" \
  -F "style_preset=photographic" \
  -F "negative_prompt=blurry, low quality" \
  -F "grow_mask=5"

```

**Key Parameters:**
- `grow_mask`: Expands mask edges (0-20 pixels)
- `style_preset`: Visual style guide
- `negative_prompt`: Content to avoid

---

## 2. Search & Recolor - Change Object Colors

**Use Case:** Change the color of specific objects without affecting the rest of the image.

**Input Requirements:** Original image + color description + object selection

### Example: Recolor Jacket

| Input Image | Output Result |
|-------------|---------------|
| ![Input](../_media/img/input-search-recolor.jpg ':size=1000') | ![Output](../_media/img/output-search-recolor.jpg ':size=1000') |

```language-selector
python=:# Search and recolor example
with open("input-search-recolor.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-search-recolor-v1:0",
        image=img,
        prompt="pink jacket",  # New color/style
        extra_body={
            "select_prompt": "jacket",  # What to recolor
            "style_preset": "photographic",
        },
        response_format="url",  # or b64_json
    )

print(f"Recolored image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-search-recolor-v1:0",
    image: fs.createReadStream("input-search-recolor.jpg"),
    prompt: "pink jacket",
    extra_body: {
        select_prompt: "jacket",
        style_preset: "photographic"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-search-recolor-v1:0" \
  -F "image=@input-search-recolor.jpg" \
  -F "prompt=pink jacket" \
  -F "select_prompt=jacket"

```

**Key Parameters:**
- `select_prompt`: Describes what object to recolor
- `prompt`: Describes the new color or style

---

## 3. Search & Replace - Replace Objects

**Use Case:** Replace specific objects with new ones using natural language descriptions.

**Input Requirements:** Original image + replacement description + search target

### Example: Replace Sweater with Jacket

| Input Image | Output Result |
|-------------|---------------|
| ![Input](../_media/img/input-search-replace.jpg ':size=1000') | ![Output](../_media/img/output-search-replace.jpg ':size=1000') |

```language-selector
python=:# Search and replace example
with open("input-search-replace.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-search-replace-v1:0",
        image=img,
        prompt="modern leather jacket",  # Replace with
        extra_body={"search_prompt": "sweater", "grow_mask": 10},  # What to replace
        response_format="url",  # or b64_json
    )

print(f"Replaced image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-search-replace-v1:0",
    image: fs.createReadStream("input-search-replace.jpg"),
    prompt: "modern leather jacket",
    extra_body: {
        search_prompt: "sweater",
        grow_mask: 10
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-search-replace-v1:0" \
  -F "image=@input-search-replace.jpg" \
  -F "prompt=modern leather jacket" \
  -F "search_prompt=sweater" \
  -F "grow_mask=10"

```

**Key Parameters:**
- `search_prompt`: Describes what to replace
- `prompt`: Describes the replacement object
- `grow_mask`: Expands replacement area

---

## 4. Erase Object - Remove Unwanted Elements

**Use Case:** Remove unwanted objects while maintaining background consistency.

**Input Requirements:** Original image + mask (optional)

### Example: Erase Objects

| Input Image | Mask | Output Result |
|-------------|------|---------------|
| ![Input](../_media/img/input-erase-object.jpg ':size=1000') | ![Mask](../_media/img/mask-erase-object.png ':size=1000') | ![Output](../_media/img/output-erase-object.jpg ':size=1000') |

```language-selector
python=:# Erase object with mask
with open("input-erase-object.jpg", "rb") as img, open(
    "mask-erase-object.png", "rb"
) as msk:
    response = client.images.edit(
        model="stability.stable-image-erase-object-v1:0",
        image=img,
        mask=msk,
        prompt="",  # Empty prompt for erase
        extra_body={"grow_mask": 3},
        response_format="url",  # or b64_json
    )

print(f"Erased image: {response.data[0].url}")

# Alternative: Erase without explicit mask (uses alpha channel)
with open("input-erase-object.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-erase-object-v1:0", image=img, prompt=""
    )

javascript=:// Erase with mask
const response = await client.images.edit({
    model: "stability.stable-image-erase-object-v1:0",
    image: fs.createReadStream("input-erase-object.jpg"),
    mask: fs.createReadStream("mask-erase-object.png"),
    prompt: "",
    extra_body: {
        grow_mask: 3
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-erase-object-v1:0" \
  -F "image=@input-erase-object.jpg" \
  -F "mask=@mask-erase-object.png"

```

**Key Parameters:**
- `mask`: Optional - white areas will be erased
- `grow_mask`: Expand erase area
- `prompt`: Usually empty for erase operations

---

## 5. Remove Background - Isolate Subjects

**Use Case:** Remove backgrounds completely while preserving subject details.

**Input Requirements:** Original image only

### Example: Remove Background

| Input Image | Output Result |
|-------------|---------------|
| ![Input](../_media/img/input-remove-background.jpg ':size=1000') | ![Output](../_media/img/output-remove-background.jpg ':size=1000') |

```language-selector
python=:# Remove background
with open("input-remove-background.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-remove-background-v1:0",
        image=img,
        prompt="",  # No prompt needed
        response_format="b64_json",  # Get base64 for transparency
        extra_body={"output_format": "png"},  # PNG for transparency
    )

# Save with transparency
img_data = base64.b64decode(response.data[0].b64_json)
with open("no_background.png", "wb") as f:
    f.write(img_data)

print("Background removed and saved as no_background.png")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-remove-background-v1:0",
    image: fs.createReadStream("input-remove-background.jpg"),
    prompt: "",
    response_format: "b64_json",
    extra_body: {
        output_format: "png"
    }
});

// Save the base64 image
const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
fs.writeFileSync("no_background.png", imageBuffer);

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-remove-background-v1:0" \
  -F "image=@input-remove-background.jpg" \
  -F "output_format=png"

```

**Key Parameters:**
- `output_format`: Use "png" for transparency
- `response_format`: Use "b64_json" to preserve transparency

---

## 6. Control Sketch - Generate from Sketches

**Use Case:** Transform rough sketches into detailed, realistic images.

**Input Requirements:** Sketch or line art + descriptive prompt

### Example: Sketch to Realistic Image

| Input Sketch | Output Result |
|--------------|---------------|
| ![Input](../_media/img/input-control-sketch.jpg ':size=1000') | ![Output](../_media/img/output-control-sketch.jpg ':size=1000') |

```language-selector
python=:# Control sketch example
with open("input-control-sketch.jpg", "rb") as sketch:
    response = client.images.edit(
        model="stability.stable-image-control-sketch-v1:0",
        image=sketch,
        prompt="a house with background of mountains and river flowing nearby",
        extra_body={
            "control_strength": 0.7,  # How much the sketch influences (0-1)
            "style_preset": "photographic",
        },
        response_format="url",  # or b64_json
    )

print(f"Generated image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-control-sketch-v1:0",
    image: fs.createReadStream("input-control-sketch.jpg"),
    prompt: "a house with background of mountains and river flowing nearby",
    extra_body: {
        control_strength: 0.7,
        style_preset: "photographic"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-control-sketch-v1:0" \
  -F "image=@input-control-sketch.jpg" \
  -F "prompt=a house with background of mountains and river flowing nearby" \
  -F "control_strength=0.7" \
  -F "style_preset=photographic"

```

**Key Parameters:**
- `control_strength`: How much the sketch influences the result (0.0-1.0)
- `style_preset`: Visual style for the output

---

## 7. Control Structure - Maintain Structure, Change Style

**Use Case:** Keep the structural composition while changing the visual style.

**Input Requirements:** Reference image + style description

### Example: Change Style While Preserving Structure

| Input Image | Output Result |
|-------------|---------------|
| ![Input](../_media/img/input-control-structure.jpg ':size=1000') | ![Output](../_media/img/output-control-structure.jpg ':size=1000') |

```language-selector
python=:# Control structure example
with open("input-control-structure.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-control-structure-v1:0",
        image=img,
        prompt="surreal structure with motion generated sparks lighting the scene",
        extra_body={"control_strength": 0.8, "style_preset": "neon-punk"},
        response_format="url",  # or b64_json
    )

print(f"Styled image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-control-structure-v1:0",
    image: fs.createReadStream("input-control-structure.jpg"),
    prompt: "surreal structure with motion generated sparks lighting the scene",
    extra_body: {
        control_strength: 0.8,
        style_preset: "neon-punk"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-control-structure-v1:0" \
  -F "image=@input-control-structure.jpg" \
  -F "prompt=surreal structure with motion generated sparks lighting the scene" \
  -F "control_strength=0.8" \
  -F "style_preset=neon-punk"

```

**Key Parameters:**
- `control_strength`: Balance between structure preservation and style application
- `style_preset`: Target visual style

---

## 8. Style Guide - Generate in Specific Style

**Use Case:** Generate new content that matches a specific visual style reference.

**Input Requirements:** Style reference image + content description

### Example: Generate Content in Specific Style

| Style Reference | Output Result |
|-----------------|---------------|
| ![Input](../_media/img/input-style-guide.jpg ':size=1000') | ![Output](../_media/img/output-style-guide.jpg ':size=1000') |

```language-selector
python=:# Style guide example
with open("input-style-guide.jpg", "rb") as style_img:
    response = client.images.edit(
        model="stability.stable-image-style-guide-v1:0",
        image=style_img,  # Style reference image
        prompt="wide shot of modern metropolis",
        extra_body={
            "fidelity": 0.5,  # How closely to match style (0-1)
            "aspect_ratio": "16:9",
        },
        response_format="url",  # or b64_json
    )

print(f"Style-guided image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-style-guide-v1:0",
    image: fs.createReadStream("input-style-guide.jpg"),
    prompt: "wide shot of modern metropolis",
    extra_body: {
        fidelity: 0.5,
        aspect_ratio: "16:9"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-style-guide-v1:0" \
  -F "image=@input-style-guide.jpg" \
  -F "prompt=wide shot of modern metropolis" \
  -F "fidelity=0.5" \
  -F "aspect_ratio=16:9"

```

**Key Parameters:**
- `fidelity`: How closely to match the reference style (0.0-1.0)
- `aspect_ratio`: Output image aspect ratio

---

## 9. Style Transfer - Apply Artistic Styles

**Use Case:** Apply the artistic style from one image to the content of another.

**Input Requirements:** Content image + style reference

### Example: Apply Artistic Style

| Input Image | Output Result |
|-------------|---------------|
| ![Input](../_media/img/input-style-transfer.jpg ':size=1000') | ![Output](../_media/img/output-style-transfer.jpg ':size=1000') |

```language-selector
python=:# Style transfer example
with open("input-style-transfer.jpg", "rb") as content:
    # Note: For style transfer, you need to provide the style image separately
    # This example shows the basic structure - you would need both images
    response = client.images.edit(
        model="stability.stable-style-transfer-v1:0",
        image=content,  # Content image
        prompt="statue",
        extra_body={
            "style_strength": 0.6,  # How strongly to apply style (0-1)
            "preserve_content_structure": True,
        },
        response_format="url",  # or b64_json
    )

print(f"Style transferred image: {response.data[0].url}")

javascript=:const response = await client.images.edit({
    model: "stability.stable-style-transfer-v1:0",
    image: fs.createReadStream("input-style-transfer.jpg"),
    prompt: "statue",
    extra_body: {
        style_strength: 0.6,
        preserve_content_structure: true
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-style-transfer-v1:0" \
  -F "image=@input-style-transfer.jpg" \
  -F "prompt=statue" \
  -F "style_strength=0.6"

```

**Key Parameters:**
- `style_strength`: How strongly to apply the artistic style
- `preserve_content_structure`: Maintain original composition

---

## Advanced Usage Patterns

### Batch Processing Multiple Images

```python
# Process multiple images with the same service
import os
from concurrent.futures import ThreadPoolExecutor


def process_image(image_path, service_config):
    """Process a single image with specified service"""
    with open(image_path, "rb") as img:
        response = client.images.edit(
            model=service_config["model"],
            image=img,
            prompt=service_config["prompt"],
            extra_body=service_config.get("extra_body", {}),
            response_format="url",  # or b64_json
        )
    return response.data[0].url


# Configuration for batch processing
configs = [
    {
        "model": "stability.stable-image-remove-background-v1:0",
        "prompt": "",
        "extra_body": {"output_format": "png"},
    },
    {
        "model": "stability.stable-image-search-recolor-v1:0",
        "prompt": "blue shirt",
        "extra_body": {"select_prompt": "shirt"},
    },
]

image_paths = ["image1.jpg", "image2.jpg", "image3.jpg"]

# Process in parallel
with ThreadPoolExecutor(max_workers=3) as executor:
    results = []
    for config in configs:
        batch_results = list(
            executor.map(lambda path: process_image(path, config), image_paths)
        )
        results.extend(batch_results)

print(f"Processed {len(results)} images")
```

### Error Handling and Retry Logic

```python
import time
import random


def robust_image_edit(model, image_path, prompt, extra_body=None, max_retries=3):
    """Robust image editing with retry logic"""

    for attempt in range(max_retries):
        try:
            with open(image_path, "rb") as img:
                response = client.images.edit(
                    model=model,
                    image=img,
                    prompt=prompt,
                    extra_body=extra_body or {},
                    response_format="url",  # or b64_json
                )
            return response.data[0].url

        except Exception as e:
            error_msg = str(e).lower()

            if "rate limit" in error_msg and attempt < max_retries - 1:
                # Exponential backoff for rate limits
                wait_time = (2**attempt) + random.uniform(0, 1)
                print(f"Rate limited, waiting {wait_time:.2f}s...")
                time.sleep(wait_time)
                continue

            elif "filter_reason" in error_msg:
                print("Content filtered. Try a different prompt.")
                return None

            elif attempt == max_retries - 1:
                print(f"Failed after {max_retries} attempts: {e}")
                return None
            else:
                print(f"Attempt {attempt + 1} failed: {e}")
                time.sleep(1)

    return None


# Usage
result = robust_image_edit(
    model="stability.stable-image-inpaint-v1:0",
    image_path="input.jpg",
    prompt="beautiful landscape",
    extra_body={"style_preset": "photographic"},
)
```

### Service Selection Helper

```python
def recommend_service(task_description):
    """Recommend the best service for a given task"""

    task_lower = task_description.lower()

    recommendations = {
        "fill": "stability.stable-image-inpaint-v1:0",
        "gap": "stability.stable-image-inpaint-v1:0",
        "hole": "stability.stable-image-inpaint-v1:0",
        "color": "stability.stable-image-search-recolor-v1:0",
        "recolor": "stability.stable-image-search-recolor-v1:0",
        "replace": "stability.stable-image-search-replace-v1:0",
        "swap": "stability.stable-image-search-replace-v1:0",
        "remove": "stability.stable-image-erase-object-v1:0",
        "erase": "stability.stable-image-erase-object-v1:0",
        "delete": "stability.stable-image-erase-object-v1:0",
        "background": "stability.stable-image-remove-background-v1:0",
        "isolate": "stability.stable-image-remove-background-v1:0",
        "sketch": "stability.stable-image-control-sketch-v1:0",
        "drawing": "stability.stable-image-control-sketch-v1:0",
        "style": "stability.stable-image-control-structure-v1:0",
        "artistic": "stability.stable-style-transfer-v1:0",
        "transfer": "stability.stable-style-transfer-v1:0",
    }

    for keyword, service in recommendations.items():
        if keyword in task_lower:
            return service

    return "stability.stable-image-inpaint-v1:0"  # Default fallback


# Usage
task = "I want to change the color of the car"
recommended_service = recommend_service(task)
print(f"Recommended service: {recommended_service}")
```

## Best Practices

### 1. Image Preparation
- **File Size**: Keep images under 4MB
- **Format**: Use PNG, JPEG, or WebP
- **Resolution**: Optimal results with 1024x1024 or similar
- **Quality**: Higher quality inputs produce better outputs

### 2. Prompt Engineering
- **Be Specific**: Use detailed, descriptive prompts
- **Use English**: All Stability AI models work best with English prompts
- **Avoid Ambiguity**: Clear descriptions yield better results
- **Style Consistency**: Use consistent terminology across related images

### 3. Parameter Optimization
- **Control Strength**: Start with 0.7, adjust based on results
- **Grow Mask**: Use 3-5 pixels for clean edges, higher for smoother blending
- **Style Presets**: Choose appropriate presets for your use case
- **Negative Prompts**: Always include quality-related negative prompts

### 4. Production Considerations
- **Rate Limiting**: Implement proper rate limiting and retry logic
- **Error Handling**: Handle content filtering and API errors gracefully
- **Caching**: Cache results when appropriate to reduce API calls
- **Monitoring**: Track usage and costs for budget management

## Pricing

All specialized image editing services are priced at **$0.040 per image**, making them cost-effective for professional workflows.

## Technical Reference

These implementations follow the official [AWS Bedrock Stability AI Image Services documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/stable-image-services.html) patterns and specifications.

## Related Resources

- [Image Generation API Reference](en/api-reference/images.md) - Complete API documentation
- [Image Generation Guide](en/guides/image-generation.md) - Comprehensive usage guide
- [Provider-Specific Parameters](en/guides/provider-specific-params.md) - Advanced parameter usage
- [Error Handling Guide](en/guides/error-handling.md) - Error handling best practices