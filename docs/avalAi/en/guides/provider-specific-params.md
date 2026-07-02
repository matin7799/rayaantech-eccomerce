# Provider-Specific Parameters

This guide provides comprehensive information about using provider-specific parameters with AvalAI when working with models from different providers through the OpenAI-compatible API.

## Table of Contents

- [What are Provider-Specific Parameters?](#what-are-provider-specific-parameters)
- [When to Use Provider-Specific Parameters](#when-to-use-provider-specific-parameters)
- [Why Use Provider-Specific Parameters](#why-use-provider-specific-parameters)
- [How to Use Provider-Specific Parameters](#how-to-use-provider-specific-parameters)
- [Common Provider-Specific Parameters](#common-provider-specific-parameters)
- [Provider Examples](#provider-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## What are Provider-Specific Parameters?

Provider-specific parameters are additional configuration options that are unique to individual AI model providers (such as Black Forest Labs, Stability AI, Google, Anthropic, etc.) but are not part of the standard OpenAI API specification. These parameters allow you to access advanced features and fine-tune model behavior that goes beyond the basic OpenAI-compatible interface.

When using AvalAI's unified API, you can access models from multiple providers through a single OpenAI-compatible interface. However, each provider may offer unique parameters that enhance functionality, control generation quality, or provide specialized features.

## When to Use Provider-Specific Parameters

You should consider using provider-specific parameters in the following scenarios:

### 1. **Advanced Model Control**
- When you need fine-grained control over model behavior
- For adjusting generation quality, style, or characteristics
- When working with specialized model features

### 2. **Reproducible Results**
- Setting seeds for consistent outputs across multiple runs
- Controlling randomness and sampling methods

### 3. **Quality and Performance Optimization**
- Adjusting inference steps, guidance scales, or sampling methods
- Optimizing for speed vs. quality trade-offs
- Fine-tuning output formats and resolutions

### 4. **Content Safety and Filtering**
- Adjusting safety tolerance levels
- Implementing custom content filtering
- Managing inappropriate content detection

### 5. **Specialized Use Cases**
- Image editing with specific strength controls
- Style transfer with predefined presets
- Advanced prompt engineering features

## Why Use Provider-Specific Parameters

### **Access to Full Model Capabilities**
Each provider designs their models with unique features and optimizations. Provider-specific parameters unlock these capabilities that wouldn't be available through the standard OpenAI interface alone.

### **Better Results for Specific Tasks**
Different providers excel at different tasks. By using their native parameters, you can achieve better results tailored to your specific use case.

### **Cost and Performance Optimization**
Provider-specific parameters often allow you to optimize for cost (fewer steps, lower quality) or performance (more steps, higher quality) based on your needs.

### **Consistency and Reproducibility**
Many provider-specific parameters help ensure consistent results across multiple API calls, which is crucial for production applications.

## How to Use Provider-Specific Parameters

AvalAI provides two main approaches for using provider-specific parameters:

### Method 1: Using `extra_body` Parameter (Recommended)

The [`extra_body`](en/guides/provider-specific-params.md) parameter is the standard and recommended approach:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Example with Stability AI model
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A majestic mountain landscape at sunset",
    size="1024x1024",
    extra_body={
        "cfg_scale": 7.5,
        "steps": 50,
        "sampler": "K_DPM_2_ANCESTRAL",
        "seed": 42424,
        "negative_prompt": "blurry, low quality",
    },
)
```

### Method 2: Direct Parameters (JavaScript/TypeScript)

For TypeScript users, you can pass parameters directly using `@ts-expect-error`:

```javascript
const response = await client.images.generate({
    model: "stability.sd3-5-large-v1:0",
    prompt: "A majestic mountain landscape at sunset",
    size: "1024x1024",
    // @ts-expect-error cfg_scale is a provider-specific parameter
    cfg_scale: 7.5,
    // @ts-expect-error steps is a provider-specific parameter
    steps: 50,
    // @ts-expect-error sampler is a provider-specific parameter
    sampler: "K_DPM_2_ANCESTRAL"
    response_format: "url", // or b64_json
});
```

### How AvalAI Handles Provider-Specific Parameters

1. **Automatic Mapping**: AvalAI automatically detects the model provider and maps the parameters to the correct provider API format
2. **Parameter Validation**: Invalid parameters are filtered out to prevent API errors
3. **Seamless Integration**: Parameters work seamlessly alongside standard OpenAI parameters

## Common Provider-Specific Parameters

Here are the most commonly used provider-specific parameters across different providers:

### **Image Generation Parameters**

| Parameter | Type | Description | Common Values |
|-----------|------|-------------|---------------|
| `cfg_scale` | float | Controls how closely the model follows the prompt | 1.0-20.0 (typical: 7.5) |
| `steps` | integer | Number of inference steps | 10-150 (typical: 20-50) |
| `seed` | integer | Random seed for reproducible results | Any integer |
| `sampler` | string | Sampling method | "K_DPM_2_ANCESTRAL", "K_EULER" |
| `negative_prompt` | string | What to avoid in the generation | "blurry, low quality" |
| `style_preset` | string | Predefined style | "photographic", "digital-art" |
| `aspect_ratio` | string | Image aspect ratio | "16:9", "1:1", "9:16" |
| `output_format` | string | Output image format | "png", "jpeg", "webp" |
| `samples` | integer | Number of samples to generate | 1-10 |
| `guidance_scale` | float | Guidance scale for diffusion models | 1.0-30.0 (typical: 7.5) |
| `safety_checker` | boolean | Enable/disable safety filtering | true, false |

### **Advanced Control Parameters**

| Parameter | Type | Description | Use Case |
|-----------|------|-------------|----------|
| `prompt_upsampling` | boolean | Enhance prompt automatically | Better prompt understanding |
| `safety_tolerance` | integer | Content safety level | 0-6 (0=strict, 6=permissive) |
| `image_strength` | float | Strength for image-to-image | 0.0-1.0 |
| `init_image_mode` | string | Initialization mode | "image_strength", "step_schedule" |
| `init_image` | string | Base64 encoded initial image | For image-to-image generation |
| `clip_guidance_preset` | string | CLIP guidance settings | "FAST_BLUE", "FAST_GREEN" |
| `extras` | object | Additional provider options | Provider-specific |
| `strength` | float | Transformation strength | 0.0-1.0 |
| `fidelity` | float | Fidelity to original image | 0.0-1.0 |
| `control_strength` | float | Control net influence strength | 0.0-2.0 |

### **Style and Composition Parameters**

| Parameter | Type | Description | Use Case |
|-----------|------|-------------|----------|
| `change_strength` | float | Strength of changes applied | Image editing operations |
| `style_strength` | float | Strength of style application | Style transfer operations |
| `composition_fidelity` | float | Fidelity to original composition | Maintaining layout structure |
| `style_image` | string | Base64 encoded style reference | Style transfer and guidance |
| `select_prompt` | string | Specific area selection prompt | Targeted editing operations |
| `grow_mask` | integer | Mask expansion in pixels | Inpainting and editing |

### **Chat and Reasoning Parameters**

| Parameter | Type | Description | Use Case |
|-----------|------|-------------|----------|
| `merge_reasoning_content_in_choices` | boolean | Include reasoning in response | Advanced reasoning models |
| `chat_template_kwargs` | object | Chat template configuration | Custom chat formatting |
| `enable_thinking` | boolean | Enable model thinking process | Reasoning and analysis |
| `reasoning_split` | boolean | Separate thinking content into `reasoning_details` field | MiniMax M2.5 models |
| `parameters` | object | Generic parameter container | Provider-specific options |

## Provider Examples

### Black Forest Labs (FLUX Models)

```python
# FLUX model with BFL-specific parameters
response = client.images.generate(
    model="flux-1.1-pro",
    prompt="A futuristic cityscape with flying cars",
    size="1024x1024",
    extra_body={
        "aspect_ratio": "16:9",
        "output_format": "png",
        "safety_tolerance": 2,
        "prompt_upsampling": True,
    },
)
```

### Stability AI Models

```python
# Stability AI with comprehensive parameters
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="Portrait of a wise old wizard",
    size="1024x1024",
    extra_body={
        "cfg_scale": 8.0,
        "steps": 40,
        "sampler": "K_DPM_2_ANCESTRAL",
        "seed": 123456,
        "negative_prompt": "blurry, distorted, low quality, bad anatomy",
        "style_preset": "fantasy-art",
    },
)
```

### Stability AI Image Editing

```python
# Image inpainting with advanced control
response = client.images.edit(
    model="stability.stable-image-inpaint-v1:0",
    image=base64_image,
    mask=base64_mask,
    prompt="A beautiful garden with colorful flowers",
    extra_body={
        "strength": 0.8,
        "guidance_scale": 7.5,
        "safety_checker": True,
    },
)

# Style transfer with composition fidelity
response = client.images.edit(
    model="stability.stable-style-transfer-v1:0",
    image=content_image,
    prompt="Apply artistic watercolor style",
    extra_body={
        "style_image": style_reference_image,
        "style_strength": 0.7,
        "composition_fidelity": 0.8,
        "change_strength": 0.6,
    },
)

# Selective editing with mask growth
response = client.images.edit(
    model="stability.stable-image-search-replace-v1:0",
    image=base64_image,
    prompt="Replace with a modern electric car",
    extra_body={
        "select_prompt": "old car",
        "grow_mask": 10,
        "fidelity": 0.9,
        "control_strength": 1.2,
    },
)
```

### Google Imagen Models

```python
# Google Imagen with specific parameters
response = client.images.generate(
    model="imagen-4.0-ultra-generate-001",
    prompt="A serene Japanese garden in spring",
    size="1024x1024",
)
```

### Google Nano Banana Image Models (Gemini)

The Nano Banana series models (`gemini-2.5-flash-image` and `gemini-3-pro-image`) are Google's advanced image generation models accessible through AvalAI. When using the OpenAI-compatible `v1/chat/completions` endpoint, you can pass native Gemini parameters like `aspectRatio` and `imageSize` through the `extra_body` parameter.

> **Note:** Users can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) to access Gemini through the native API schema and official Google SDK for full parameter control.

**Supported `imageConfig` Parameters:**

| Parameter | Type | Description | Supported Values | Supported Models |
|-----------|------|-------------|------------------|------------------|
| `aspectRatio` | string | Image aspect ratio | "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9" | `gemini-2.5-flash-image`, `gemini-3-pro-image` |
| `imageSize` | string | Output image size | "1K", "2K", "4K" | Only `gemini-3-pro-image` |

#### Gemini 2.5 Flash Image (Nano Banana)

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate image with custom aspect ratio
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


#### Gemini 3 Pro Image Preview (Nano Banana Pro)

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

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
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3-pro-image` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


For more detailed examples, see [Advanced Image Generation with Gemini](/examples/advanced_gemini_image_generation.md) and [Generate Images with Gemini 2.5 Flash](/examples/generate_images_with_gemini_2_5_flash.md).

### Gemini Safety Settings

When using Gemini models, you can configure built-in safety settings through `extra_body` to control content moderation directly in your API calls:

```python
# Configure safety settings for Gemini models
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": "Your prompt here"}],
    extra_body={
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_LOW_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH",
            },
        ]
    },
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="Your prompt here",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


This is useful when you need content moderation but want to avoid making separate calls to the [Moderation API](en/api-reference/moderation.md). For comprehensive documentation on Gemini safety settings, see the [Gemini Safety Settings Guide](en/guides/gemini-safety-settings.md).

### Chat Completions with Advanced Parameters

Provider-specific parameters also work with chat completions:

```python
# Anthropic Claude with reasoning parameters
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    extra_body={
        "enable_thinking": True,
        "merge_reasoning_content_in_choices": True,
        "chat_template_kwargs": {"format": "detailed"},
        "parameters": {"analysis_depth": "comprehensive"},
    },
)

# OpenAI with custom parameters
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Analyze this data"}],
    extra_body={
        "safety_checker": True,
        "parameters": {"reasoning_mode": "step_by_step"},
    },
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `claude-sonnet-4-6` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="Analyze this data",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### MiniMax Models (M2.5 Reasoning)

MiniMax M2.5 models include built-in reasoning capabilities with thinking content. By default, reasoning content appears within `<think>` and `</think>` tags in the response content. You can use the `reasoning_split` parameter to separate this content into a dedicated `reasoning_details` field.

**Key Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `reasoning_split` | boolean | When `true`, separates thinking content into `reasoning_details` field instead of `<think>` tags in content |

**Default Behavior (reasoning_split=false):**

The model's thinking process appears inline with `<think>` tags:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.5",
    messages=[{"role": "user", "content": "What is 25 * 37?"}],
)

# Response content includes: <think>Let me calculate... 25 * 37 = 925</think>The answer is 925.
print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `minimax-m2.5` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="What is 25 * 37?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**With reasoning_split=true:**

The thinking content is separated into the `reasoning_details` field:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.5",
    messages=[{"role": "user", "content": "What is 25 * 37?"}],
    extra_body={"reasoning_split": True},
)

# Access the separated reasoning content
message = response.choices[0].message
print(f"Reasoning: {message.reasoning_details}")  # Contains the thinking process
print(f"Answer: {message.content}")  # Contains only the final answer
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `minimax-m2.5` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="What is 25 * 37?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**Managing Conversation History:**

When using MiniMax-M2.5, ensure you preserve the full response message (including reasoning) in your conversation history:

```python
messages = [{"role": "user", "content": "Solve this step by step: 2x + 5 = 15"}]

response = client.chat.completions.create(
    model="minimax-m2.5",
    messages=messages,
    extra_body={"reasoning_split": True},
)

# Append the full response to message history (preserves reasoning_details)
assistant_message = response.choices[0].message
messages.append(
    {
        "role": "assistant",
        "content": assistant_message.content,
        # When reasoning_split=True, also include reasoning_details in history
        "reasoning_details": getattr(assistant_message, "reasoning_details", None),
    }
)

# Continue conversation
messages.append({"role": "user", "content": "Now solve 3x + 7 = 22"})
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `minimax-m2.5` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="Now solve 3x + 7 = 22",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


For more details on MiniMax models, see [MiniMax Models](en/providers/minimax.md).

## Best Practices

### 1. **Start with Default Values**
Begin with standard parameters and gradually introduce provider-specific ones as needed:

```python
# Start simple
response = client.images.generate(
    model="stability.sd3-5-large-v1:0", prompt="A beautiful sunset", size="1024x1024"
)

# Then add specific parameters for better control
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A beautiful sunset",
    size="1024x1024",
    extra_body={
        "cfg_scale": 7.5,  # Better prompt adherence
        "steps": 30,  # Higher quality
    },
)
```

### 2. **Use Appropriate Parameter Values**
Research the recommended ranges for each parameter:

```python
# Good parameter values
extra_body = {
    "cfg_scale": 7.5,  # Sweet spot for most cases
    "steps": 20 - 50,  # Balance quality and speed
    "seed": 42424,  # Any consistent integer
    "safety_tolerance": 2,  # Moderate safety level
}

# Avoid extreme values that may cause issues
extra_body = {
    "cfg_scale": 50,  # Too high, may cause artifacts
    "steps": 200,  # Unnecessarily slow
    "safety_tolerance": 6,  # May allow inappropriate content
}
```

### 3. **Handle Errors Gracefully**
Always implement proper error handling:

```python
try:
    response = client.images.generate(
        model="stability.sd3-5-large-v1:0",
        prompt="A landscape painting",
        size="1024x1024",
        extra_body={"cfg_scale": 7.5, "steps": 30},
    )
except Exception as e:
    print(f"Error with provider-specific parameters: {e}")
    # Fallback to basic parameters
    response = client.images.generate(
        model="stability.sd3-5-large-v1:0",
        prompt="A landscape painting",
        size="1024x1024",
    )
```

### 4. **Document Your Parameter Choices**
Keep track of successful parameter combinations:

```python
# Document successful configurations
STABILITY_PHOTOREALISTIC = {
    "cfg_scale": 8.0,
    "steps": 40,
    "sampler": "K_DPM_2_ANCESTRAL",
    "style_preset": "photographic",
    "negative_prompt": "cartoon, anime, painting, drawing",
}

STABILITY_ARTISTIC = {
    "cfg_scale": 7.0,
    "steps": 30,
    "sampler": "K_EULER",
    "style_preset": "digital-art",
}
```

### 5. **Test Parameter Impact**
Experiment with different values to understand their effects:

```python
# A/B test different configurations
configs = [
    {"cfg_scale": 5.0, "steps": 20},
    {"cfg_scale": 7.5, "steps": 30},
    {"cfg_scale": 10.0, "steps": 40},
]

for i, config in enumerate(configs):
    response = client.images.generate(
        model="stability.sd3-5-large-v1:0",
        prompt="Test prompt",
        size="1024x1024",
        extra_body=config,
    )
    # Save and compare results
```

### 6. **Use Seeds for Reproducibility**
Always use seeds when you need consistent results:

```python
# For production applications requiring consistency
PRODUCTION_CONFIG = {
    "seed": 42424,  # Fixed seed
    "cfg_scale": 7.5,  # Consistent quality
    "steps": 30,  # Balanced speed/quality
}

# For experimentation, let seed vary
EXPERIMENTAL_CONFIG = {
    "cfg_scale": 7.5,
    "steps": 30,
    # No seed = random results each time
}
```

### 7. **Optimize for Your Use Case**

#### For Speed (Real-time Applications)
```python
SPEED_OPTIMIZED = {
    "steps": 15,  # Fewer steps
    "cfg_scale": 6.0,  # Lower guidance
    "sampler": "K_EULER",  # Fast sampler
}
```

#### For Quality (Final Production)
```python
QUALITY_OPTIMIZED = {
    "steps": 50,  # More steps
    "cfg_scale": 8.0,  # Higher guidance
    "sampler": "K_DPM_2_ANCESTRAL",  # High-quality sampler
}
```

#### For Consistency (Batch Processing)
```python
CONSISTENCY_OPTIMIZED = {
    "seed": 12345,  # Fixed seed
    "cfg_scale": 7.5,  # Standard guidance
    "steps": 30,  # Consistent steps
    "sampler": "K_DPM_2_ANCESTRAL",
}
```

## Troubleshooting

### Common Issues and Solutions

#### **Issue: Parameters Not Taking Effect**
```python
# Problem: Parameters ignored
response = client.images.generate(
    model="gpt-image-2",  # OpenAI model
    prompt="A sunset",
    extra_body={"cfg_scale": 7.5},  # This won't work with OpenAI models
)

# Solution: Use appropriate model
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",  # Stability AI model
    prompt="A sunset",
    extra_body={"cfg_scale": 7.5},  # This will work
)
```

#### **Issue: Invalid Parameter Values**
```python
# Problem: Invalid parameter range
extra_body = {"cfg_scale": 100, "steps": -5}  # Too high  # Invalid negative value

# Solution: Use valid ranges
extra_body = {
    "cfg_scale": 7.5,  # Valid range: 1.0-20.0
    "steps": 30,  # Valid range: 1-150
}
```

#### **Issue: Parameter Name Errors**
```python
# Problem: Incorrect parameter names
extra_body = {
    "guidance_scale": 7.5,  # Wrong name for Stability AI
    "num_steps": 30,  # Wrong name for Stability AI
}

# Solution: Use correct parameter names
extra_body = {
    "cfg_scale": 7.5,  # Correct for Stability AI
    "steps": 30,  # Correct for Stability AI
}
```

### Debugging Tips

1. **Check Model Compatibility**: Ensure the model supports the parameters you're using
2. **Validate Parameter Names**: Double-check parameter names against provider documentation
3. **Test Incrementally**: Add one parameter at a time to identify issues
4. **Use Error Handling**: Implement try-catch blocks to handle parameter errors gracefully
5. **Check Provider Documentation**: Refer to individual provider docs for parameter specifics

### Getting Help

- **AvalAI Documentation**: Check the [API Reference](en/api-reference/introduction.md) for supported parameters
- **Provider Documentation**: Refer to individual provider docs for detailed parameter information
- **Community Support**: Join the AvalAI community for tips and best practices
- **Error Messages**: Pay attention to error messages which often indicate parameter issues

## Related Resources

- [Quick Start Guide](en/quickstart.md) - Basic usage of provider-specific parameters
- [Image Generation Guide](en/guides/image-generation.md) - Image-specific parameter usage
- [API Reference](en/api-reference/introduction.md) - Complete API documentation
- [Model Documentation](en/models/model-details.md) - Individual model capabilities and parameters
- [Best Practices](en/guides/production-best-practices.md) - Production deployment guidelines
