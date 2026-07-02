# Generate and Edit Images with the Nano Banana Series

## Introduction

**Nano Banana** is the name for Gemini's native image generation capabilities. Gemini can generate and process images conversationally with text, images, or a combination of both. This lets you create, edit, and iterate on visuals with unprecedented control.

The Nano Banana family includes three distinct models available through AvalAI:

| Model | ID | Best For |
|-------|-----|----------|
| **Nano Banana 2** | `gemini-3.1-flash-image` | High-efficiency, speed-optimized, high-volume developer use cases |
| **Nano Banana Pro** | `gemini-3-pro-image` | Professional asset production, complex instructions, high-fidelity text rendering |
| **Nano Banana** | `gemini-2.5-flash-image` | Speed and efficiency, high-volume, low-latency tasks |

This guide covers all three models and demonstrates how to use them through AvalAI's API to generate, edit, and transform images with natural language.

> **Note:** All three models now have stable aliases. We recommend using the stable IDs (`gemini-2.5-flash-image`, `gemini-3.1-flash-image`, and `gemini-3-pro-image`) for production workloads. The corresponding preview IDs (`gemini-2.5-flash-image-preview`, `gemini-3.1-flash-image-preview`, and `gemini-3-pro-image-preview`) remain available.

## Key Features

- **State-of-the-art image generation** - Create high-quality, photorealistic images from detailed text prompts
- **Advanced image editing** - Transform existing images with natural language instructions
- **Character consistency** - Maintain consistent appearance of subjects across multiple generations
- **Multi-image fusion** - Combine multiple input images into cohesive compositions
- **Conversational editing** - Iterative refinement through natural dialogue
- **World knowledge integration** - Leverage Gemini's knowledge for contextually accurate images
- **Prompt-based transformations** - Make precise edits with simple text commands

## Basic Image Generation

To generate an image with Gemini 2.5 Flash Image, you need to provide a text prompt describing what you want to create. The model excels at understanding detailed descriptions and creating images that match your vision.

```language-selector
python=:from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Text to image generation
response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=[
        {
            "role": "user",
            "content": "A photorealistic image of a mountain landscape with a lake reflecting the sunset, painted in the style of a romantic landscape painting",
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
ext = header.split(";")[0].split("/")[1]  # e.g. "png" or "jpeg"

# Decode and save image
image_bytes = base64.b64decode(base64_data)
filename = f"generated_image.{ext}"
with open(filename, "wb") as f:
    f.write(image_bytes)
print(f"✅ Image saved as {filename}")

# Print any text response that came with the image
if content:
    print(f"Model response: {content}")

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
        content: "A photorealistic image of a mountain landscape with a lake reflecting the sunset, painted in the style of a romantic landscape painting"
    }],
    modalities: ["image", "text"],
});

// Image is now available in the response
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

// Print any text response that came with the image
if (content) {
 console.log(`Model response: ${content}`);
}

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "A photorealistic image of a mountain landscape with a lake reflecting the sunset, painted in the style of a romantic landscape painting",
                },
                {"type": "input_image", "image_url": "https://example.com/image.png"},
            ],
        }
    ],
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "A photorealistic image of a mountain landscape with a lake reflecting the sunset, painted in the style of a romantic landscape painting" },
        { type: "input_image", image_url: "https://example.com/image.png" },
      ],
    },
  ],
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "A photorealistic image of a mountain landscape with a lake reflecting the sunset, painted in the style of a romantic landscape painting"
          },
          {
            "type": "input_image",
            "image_url": "https://example.com/image.png"
          }
        ]
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Image Editing and Transformation

Gemini 2.5 Flash Image excels at editing existing images based on natural language instructions. You can provide reference images and ask the model to make specific changes or transformations.

### Basic Image-to-Image Editing

```python
# Image to image transformation
prompt = "Transform this image into a Studio Ghibli anime style with vibrant colors and magical atmosphere"
image_url = "https://example.com/your-image.jpg"

# Using image URL
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
content = (
    response.choices[0].message.content.strip()
    if response.choices[0].message.content
    else None
)
# ... (same processing code as above)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
            ],
        }
    ],
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Using Base64 Encoded Images

For better compatibility and when working with local images, you can encode images as base64:

```python
import base64


def encode_image(image_path):
    """Encode image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Load and encode your image
image_path = "path/to/your/image.jpg"
base64_image = encode_image(image_path)

# Create the message with base64 image
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "Change the background to a tropical beach setting while keeping the subject unchanged",
            },
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
            },
        ],
    }
]

response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=messages,
    modalities=["image", "text"],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
            ],
        }
    ],
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Advanced Capabilities

### Character Consistency

One of Gemini 2.5 Flash Image's standout features is maintaining character consistency across multiple generations. You can create a character and then place them in different scenarios while preserving their appearance.

```python
# First, create a character
character_prompt = "Create a photorealistic portrait of a young woman with curly red hair, green eyes, wearing a blue denim jacket. She has a friendly smile and freckles."

response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=[{"role": "user", "content": character_prompt}],
    modalities=["image", "text"],
)

# Save this character image, then use it as reference for consistent appearances
# In subsequent prompts, you can reference this character:
consistency_prompt = "Show the same person from the previous image now standing in a bustling city street at night, with neon lights reflecting on wet pavement"
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input="Describe this image.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Multi-Image Fusion

Combine multiple images to create new compositions:

```python
# Combine two images
fusion_prompt = "Combine these two images: place the person from the first image into the scenic location from the second image, making sure the lighting and atmosphere match naturally"

# You can include multiple images in the content array
messages = [
    {
        "role": "user",
        "content": [
            {"type": "text", "text": fusion_prompt},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image1}"},
            },
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{base64_image2}"},
            },
        ],
    }
]
```

### Conversational Image Editing

You can have a conversation with the model to iteratively refine your images:

```python
# Start with an initial image generation
messages = [
    {"role": "user", "content": "Create a cozy coffee shop interior with warm lighting"}
]

response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=messages,
    modalities=["image", "text"],
)

# Add the model's response to continue the conversation
messages.append({"role": "assistant", "content": response.choices[0].message.content})

# Now make refinements
messages.append(
    {
        "role": "user",
        "content": "Make the lighting warmer and add some plants near the windows",
    }
)

# Continue the conversation for further refinements
refined_response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=messages,
    modalities=["image", "text"],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input="Make the lighting warmer and add some plants near the windows",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Prompt Engineering Best Practices

### 1. Be Specific and Detailed

The model responds well to detailed descriptions that include:
- **Style specifications**: "photorealistic," "oil painting," "digital art," "Studio Ghibli style"
- **Lighting details**: "golden hour lighting," "dramatic shadows," "soft diffused light"
- **Composition elements**: "rule of thirds," "close-up portrait," "wide landscape shot"
- **Technical parameters**: "shallow depth of field," "high contrast," "vibrant colors"

```python
detailed_prompt = """
Create a photorealistic portrait of an elderly craftsman in his workshop. 
Lighting: Warm, golden light streaming through a dusty window, creating dramatic shadows. 
Composition: Close-up shot focusing on his weathered hands working on a piece of wood.
Style: Documentary photography style with rich textures and high detail.
Mood: Contemplative and peaceful, showing the beauty of traditional craftsmanship.
"""
```

### 2. Specify Artistic Styles

```python
style_examples = [
    "in the style of Van Gogh's Starry Night with swirling brushstrokes",
    "as a minimalist line drawing with clean geometric shapes",
    "in the style of 1950s vintage advertisement posters",
    "as a cyberpunk digital art with neon colors and futuristic elements",
    "in the style of Japanese woodblock prints with bold colors and clean lines",
]
```

### 3. Use Reference Context

When editing images, provide clear context about what should change and what should remain the same:

```python
editing_prompt = """
Transform this portrait photo with the following changes:
- Change the background to a library setting with bookshelves
- Keep the person's pose and expression exactly the same
- Adjust the lighting to match the warm, ambient library lighting
- Maintain the same level of detail and photorealistic quality
"""
```

### 4. Leverage World Knowledge

Gemini 2.5 Flash Image can use its knowledge of real places, historical periods, and cultural contexts:

```python
knowledge_prompt = """
Create an accurate historical scene of a medieval European marketplace in the 14th century.
Include period-appropriate clothing, architecture, and daily life activities.
Show merchants selling goods, people in authentic medieval attire, and typical medieval buildings.
Make it historically accurate while maintaining artistic beauty.
"""
```

## Technical Specifications

| Feature | Details |
|---------|---------|
| Model ID | `gemini-2.5-flash-image` |
| Context Window | 32,768 tokens (input) |
| Max Output Tokens | 32,768 tokens |
| Supported Inputs | Images and text |
| Supported Outputs | Images and text |
| Input Pricing | $0.30 / 1M tokens |
| Output Pricing | $2.50 / 1M tokens (text), $30.00 / 1M tokens (image generation) |
| Knowledge Cutoff | June 2025 |

### Using Gemini-Specific Settings (generationConfig)

When using Nano Banana models (`gemini-2.5-flash-image` and `gemini-3-pro-image`) through the OpenAI-compatible `v1/chat/completions` endpoint, you can pass Gemini-specific settings (non-OpenAI parameters) through the `extra_body` dictionary. This allows you to leverage native Gemini features like `aspectRatio` and `imageSize` while using the familiar OpenAI SDK interface.

> **Note:** Users can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) to access Gemini through the native API schema and official Google SDK for full parameter control.

**Supported imageConfig Parameters:**

| Parameter | Type | Description | Supported Values | Supported Models |
|-----------|------|-------------|------------------|------------------|
| `aspectRatio` | string | Image aspect ratio | "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9" | `gemini-2.5-flash-image`, `gemini-3-pro-image` |
| `imageSize` | string | Output image size | "1K", "2K", "4K" | Only `gemini-3-pro-image` |

#### Gemini 2.5 Flash Image (Nano Banana) with Aspect Ratio

```language-selector
python=:from openai import OpenAI
import base64

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

# Generate image with custom aspect ratio using extra_body
response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Generate a sunset beach scene",
                },
            ],
        }
    ],
    modalities=["image", "text"],
    extra_body={"generationConfig": {"imageConfig": {"aspectRatio": "16:9"}}},
)

# Access the generated image
if response.choices[0].message.images:
    image_url = response.choices[0].message.images[0]["image_url"]["url"]
    print(f"Generated image URL: {image_url}")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

// Generate image with custom aspect ratio using extra_body
const response = await client.chat.completions.create({
    model: "gemini-2.5-flash-image",
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Generate a sunset beach scene"
                }
            ]
        }
    ],
    modalities: ["image", "text"],
    extra_body: {
        generationConfig: {
            imageConfig: {
                aspectRatio: "16:9"
            }
        }
    }
});

if (response.choices[0].message.images) {
    const imageUrl = response.choices[0].message.images[0].image_url.url;
    console.log(`Generated image URL: ${imageUrl}`);
}

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
            ],
        }
    ],
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "Describe this image." },
        { type: "input_image", image_url: "https://example.com/image.png" },
      ],
    },
  ],
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Describe this image."
          },
          {
            "type": "input_image",
            "image_url": "https://example.com/image.png"
          }
        ]
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


#### Gemini 3 Pro Image (Nano Banana Pro) with Aspect Ratio and Image Size

The `gemini-3-pro-image` model (Nano Banana Pro) supports both `aspectRatio` and `imageSize` parameters, allowing you to generate images up to 4K resolution:

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

# Generate 4K image with custom aspect ratio
response = client.chat.completions.create(
    model="gemini-3-pro-image",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Generate a sunset beach scene",
                },
            ],
        }
    ],
    modalities=["image", "text"],
    extra_body={
        "generationConfig": {
            "imageConfig": {
                "aspectRatio": "16:9",
                "imageSize": "4k",  # Only supported by gemini-3-pro-image
            }
        }
    },
)

# Access the generated image
if response.choices[0].message.images:
    image_url = response.choices[0].message.images[0]["image_url"]["url"]
    print(f"Generated 4K image URL: {image_url}")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

// Generate 4K image with custom aspect ratio
const response = await client.chat.completions.create({
    model: "gemini-3-pro-image",
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Generate a sunset beach scene"
                }
            ]
        }
    ],
    modalities: ["image", "text"],
    extra_body: {
        generationConfig: {
            imageConfig: {
                aspectRatio: "16:9",
                imageSize: "4k"  // Only supported by gemini-3-pro-image
            }
        }
    }
});

if (response.choices[0].message.images) {
    const imageUrl = response.choices[0].message.images[0].image_url.url;
    console.log(`Generated 4K image URL: ${imageUrl}`);
}

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3-pro-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
            ],
        }
    ],
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "Describe this image." },
        { type: "input_image", image_url: "https://example.com/image.png" },
      ],
    },
  ],
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Describe this image."
          },
          {
            "type": "input_image",
            "image_url": "https://example.com/image.png"
          }
        ]
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**cURL Example:**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "messages": [
      {
        "role": "user",
        "content": "Generate a sunset beach scene"
      }
    ],
    "modalities": ["image", "text"],
    "extra_body": {
      "generationConfig": {
        "imageConfig": {
          "aspectRatio": "16:9",
          "imageSize": "4k"
        }
      }
    }
  }'
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3-pro-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Generate a sunset beach scene",
    "instructions": "You are a helpful assistant."
  }'
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


For more information about provider-specific parameters, see the [Provider-Specific Parameters Guide](en/guides/provider-specific-params.md).

### Image Output Format

Images are returned as base64-encoded data URLs within the text response. The format is:
```
data:image/[format];base64,[base64-encoded-image-data]
```

Where `[format]` is typically `png` or `jpeg`.

## Error Handling and Troubleshooting

### Common Issues and Solutions

1. **No image in response**: Check that you've included `modalities=["image", "text"]` in your request.

2. **Base64 decoding errors**: Ensure you're properly splitting the data URL and extracting only the base64 portion.

3. **Image quality issues**: Try being more specific in your prompts about desired quality, style, and technical details.

```python
def safe_extract_image(response):
 """Safely extract and save image from model response"""
 try:
 if not hasattr(response.choices[0].message, 'images') or not response.choices[0].message.images:
 print("No image found in response")
 return None

 image_url = response.choices[0].message.images[0]["image_url"]["url"]

 header, base64_data = image_url.split(",", 1)
 ext = header.split(";")[0].split("/")[1]

 image_bytes = base64.b64decode(base64_data)
 filename = f"generated_image.{ext}"

 with open(filename, "wb") as f:
 f.write(image_bytes)

 print(f"✅ Image saved as {filename}")
 return filename

 except Exception as e:
 print(f"Error processing image: {e}")
 return None
```

## Comparison with Other Models

### Gemini 2.5 Flash Image vs GPT Image 1

| Feature | Gemini 2.5 Flash Image | GPT Image 1 |
|---------|-------------------------------|-------------|
| **Strengths** | Character consistency, conversational editing, world knowledge integration | Advanced instruction following, masking support, multiple size options |
| **Image Quality** | State-of-the-art, highly rated | High quality, photorealistic |
| **Editing Approach** | Natural language conversation | Direct parameter control |
| **Multi-image Support** | Excellent fusion capabilities | Up to 10 input images |
| **API Interface** | Chat completions with modalities | Dedicated images endpoint |

### When to Choose Gemini 2.5 Flash Image

- **Character consistency** across multiple images
- **Conversational editing** workflows
- **Multi-image fusion** projects
- **Educational applications** leveraging world knowledge
- **Iterative refinement** through dialogue
- **Style transformation** with cultural/historical accuracy

## Limitations and Considerations

- **Text rendering**: Like most image generation models, text within images may be inconsistent
- **Complex scenes**: Very detailed scenes with many elements might not render perfectly
- **Response format**: Images are embedded in text responses rather than separate URLs
- **Processing time**: High-quality generation may take longer than simpler models
- **Context window**: Limited to 32,768 tokens for both input and output

## Conclusion

Gemini 2.5 Flash Image represents a significant advancement in AI image generation and editing, offering powerful capabilities for creating and transforming images through natural language. Its standout features—character consistency, conversational editing, and world knowledge integration—make it particularly valuable for creative professionals, educators, and developers building image-centric applications.

The model's ability to maintain consistency across generations and understand complex editing instructions through dialogue opens up new possibilities for AI-assisted creative workflows. Whether you're generating original artwork, editing existing photos, or creating educational visual content, Gemini 2.5 Flash Image provides the tools to bring your vision to life.

For more information on image generation with AvalAI, please refer to our [Image Generation Guide](en/guides/image-generation.md) and [Google Models Documentation](en/providers/google.md).