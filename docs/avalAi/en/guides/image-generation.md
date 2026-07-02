# Image Generation

Learn how to generate or manipulate images using models available through the AvalAI API, such as DALL·E.

## Introduction

The AvalAI [Image API](en/api-reference/images.md) provides endpoints for image creation:

- **Generations:** Create images from scratch based on a text prompt.
- **Edits:** (Model-dependent, e.g., DALL·E 2) Modify existing images based on a new prompt and a mask.
- **Variations:** (Model-dependent, e.g., DALL·E 2) Create variations of an existing image.

This guide covers using these capabilities via AvalAI.

## Which Model to Use?

AvalAI provides access to various image generation models. Capabilities (like edits/variations) and quality can differ:

- **GPT Image 2:** OpenAI's current default recommendation for new high-quality generation and editing workflows. Use it for prompt-heavy visuals, text in images, UI mockups, infographics, product shots, compositing, and edits where preserving identity, layout, or labels matters. See [Generate Images with GPT Image Models](en/examples/generate_images_with_gpt_image.md) for a Cookbook-inspired prompting playbook.
- **GPT Image 1.5:** A previous advanced OpenAI image generation and editing model. Keep it for existing validated workflows while you compare output quality, retry rates, and cost before migrating to GPT Image 2.
- **GPT Image 1 & GPT Image 1 Mini:** Older GPT Image models. GPT Image 1 Mini can still be useful for cost-sensitive drafts and high-volume ideation.
- **Seedream 5.0:** ByteDance's state-of-the-art image generation and editing model with unique capabilities:
  - **seedream-5-0-260128**: Advanced model supporting sequential image generation (up to 15 related images), multi-image blending, streaming output, and high-resolution generation up to 4K. Features intelligent batch processing and supports both text-to-image and image-to-image editing. See our [comprehensive guide](en/examples/generate_images_with_seedream_4.md) for detailed usage examples.
- **Google Imagen 4.0 Models:** Google's latest image generation models with exceptional quality and detail:
- **imagen-4.0-ultra-generate-001**: Ultra-high quality image generation with exceptional detail and realism, supporting resolutions up to 2816x1536.
- **imagen-4.0-generate-001**: High-quality professional image generation supporting resolutions up to 2048x2048.
- **imagen-4.0-fast-generate-001**: Fast image generation optimized for speed while maintaining quality.
- **imagen-3.0-generate-002**: Updated version of Imagen 3.0 with improved capabilities.
- **imagen-3.0-generate-001**: Base Imagen 3.0 model for high-quality image generation.
- **imagen-3.0-fast-generate-001**: A faster version optimized for reduced latency while maintaining good quality.
- **BFL (FLUX) Models:** Advanced image generation and editing models from Black Forest Labs:
- **flux.2-pro**: The most advanced FLUX model with superior image quality and megapixel-based pricing. First megapixel: $0.03, additional megapixels: $0.015, reference image: $0.015/MP. Best for professional-quality image generation. **Note:** Optimized for English prompts only.
- **flux-1.1-pro**: Advanced image generation model with superior performance in image quality, prompt adherence, and generation speed.
- **flux.1-kontext-pro**: Versatile model supporting both generation and editing, excelling in text editing and character preservation tasks.
- **Alibaba Qwen Image Models:** Advanced image generation and editing models with dual SDK support:
  - **qwen-image-2.0-pro**: Professional image generation with advanced typography achieving near-zero text rendering errors in 40+ languages. Native 2K resolution output ideal for infographics and complex visual content. Pricing: $0.06/image.
  - **qwen-image-2.0**: Unified generation and editing model with enhanced photorealism and reliable text rendering. Native 2K resolution with professional-quality output. Pricing: $0.04/image.
  - **z-image-turbo**: Ultra-fast image generation with optional Thinking mode for enhanced quality. Fast default mode ($0.015/image) or Thinking mode ($0.03/image) for complex scenes.
  - **qwen-image-edit-plus**: Advanced image editing with enhanced quality over the original qwen-image-edit. Supports both `v1/images/generations` and `v1/images/edits` endpoints. Pricing: $0.03/image.
  - **qwen-image**: Professional text-to-image generation with intelligent prompt enhancement, supporting multiple aspect ratios and advanced parameters.
  - **qwen-image-edit**: Sophisticated image editing capabilities with multi-image input support and precise modification control.
- **DALL·E 3:** Typically offers higher quality and supports larger/different aspect ratio sizes for generations. Usually limited to 1 image per request.
- **Stability AI Models:** High-quality image generation models like SD3 and Stable Image variants. See our [detailed guide](en/examples/generate_images_with_stability_ai.md) for specific features.

Check the [Models Overview](en/models/model-details.md) for specific image models available through AvalAI and their features.

> The GPT Image guidance above is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook/) and [openai/openai-cookbook](https://github.com/openai/openai-cookbook), with AvalAI model and endpoint details.

## Prompting Pattern for Production Images

For production assets, write prompts as structured briefs:

```text
Goal: where the image will be used
Format: photo, ad, slide, UI mockup, infographic, diagram, product shot
Canvas: size, orientation, aspect ratio
Subject: the main object, person, scene, or interface
Composition: framing, viewpoint, placement, whitespace
Style: photorealistic, editorial, flat vector, 3D render, etc.
Text: exact words in quotes, placement, typography, language
Constraints: no watermark, no extra text, preserve logo/layout/colors
```

Use `quality="low"` for fast drafts, `quality="medium"` for general use, and `quality="high"` for dense text, infographics, close-up product work, identity-sensitive edits, or final customer-facing assets.

For edits, state both the change and the invariants:

```text
Change only the wall color to warm white.
Keep the sofa, table, lighting, shadows, camera angle, floor texture,
object positions, and image crop exactly the same.
```

### Using Non-OpenAI Providers with Provider-Specific Parameters

When using image generation models from providers other than OpenAI (such as Black Forest Labs, Stability AI, or Google), you may need to pass provider-specific parameters that aren't directly supported by the OpenAI client library. AvalAI offers two approaches for this:

#### Using extra_body Parameter

The standard approach is to use the [`extra_body`](en/guides/provider-specific-params.md) parameter. The system will automatically map these provider-specific parameters to the appropriate provider since these are not OpenAI standard parameters.

#### Common Provider-Specific Parameters

Here are some examples of provider-specific parameters for **Black Forest Labs (BFL)** and **Stability AI** models (users can send any provider-specific parameters beyond these):

- `output_format` - Specify the output format for the generated image
- `aspect_ratio` - Control the aspect ratio of generated images
- `prompt_upsampling` - Enable or disable prompt enhancement
- `safety_tolerance` - Adjust content safety filtering
- `cfg_scale` - Control how closely the model follows the prompt
- `clip_guidance_preset` - Set CLIP guidance settings
- `sampler` - Choose the sampling method
- `samples` - Number of samples to generate
- `steps` - Number of diffusion steps
- `style_preset` - Apply predefined style presets
- `extras` - Additional model-specific options
- `image_strength` - Control strength of image-to-image generation
- `init_image_mode` - Set initialization mode for image editing
- `init_image` - Provide initial image for editing

```python
# Python example using Black Forest Labs model with provider-specific parameters
response = client.images.generate(
    model="flux-1.1-pro",
    prompt="A majestic dragon soaring through clouds",
    size="1024x1024",
    extra_body={
        "aspect_ratio": "16:9",
        "output_format": "png",
        "safety_tolerance": 2,
        "prompt_upsampling": True,
    },
)

# Python example using Stability AI model with provider-specific parameters
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A detailed landscape with mountains and a lake at sunset",
    size="1024x1024",
    extra_body={
        "cfg_scale": 7.5,
        "steps": 50,
        "sampler": "K_DPM_2_ANCESTRAL",
        "style_preset": "photographic",
        "seed": 42424,
        "negative_prompt": "blurry, low quality, distorted",
    },
)
```

The [`extra_body`](en/guides/provider-specific-params.md) parameter allows you to pass any additional parameters required by the specific provider. For requests with the GET verb, extra parameters will be in the query string, while for all other requests, they will be sent in the body.

#### Using Undocumented Parameters Directly (JavaScript/TypeScript)

For TypeScript users, you can also pass undocumented parameters directly by using `// @ts-expect-error`:

```javascript
// JavaScript/TypeScript example using undocumented parameters directly
const response = await client.images.generate({
  model: "stability.sd3-5-large-v1:0",
  prompt: "A detailed landscape with mountains and a lake at sunset",
  size: "1024x1024",
  // @ts-expect-error seed is an undocumented parameter
  seed: 42424,
  // @ts-expect-error negative_prompt is an undocumented parameter
  negative_prompt: "blurry, low quality, distorted",
  // @ts-expect-error mode is an undocumented parameter
  mode: "text-to-image",
  response_format: "url", // or b64_json
});
```

This library doesn't validate at runtime that the request matches the type, so any extra values you send will be sent as-is to the provider's API. For GET requests, these extra parameters will be in the query string, while for all other requests, they will be sent in the body.

If you want to explicitly send extra arguments, you can also do so with the `body` request options.

### Alibaba Qwen Image Models

The Qwen image models offer unique dual SDK support, allowing you to use both OpenAI-compatible format and native Alibaba Dashscope format for maximum flexibility and access to advanced features.

#### Using OpenAI SDK Format

```python
# Python example using Qwen models with OpenAI SDK format
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Text-to-image generation
response = client.images.generate(
    model="qwen-image",
    prompt="A serene mountain landscape with a crystal clear lake reflecting snow-capped peaks",
    size="1328x1328",  # Supports multiple aspect ratios
    n=1,
    response_format="url",  # or b64_json
)

print(f"Generated image URL: {response.data[0].url}")

# Image editing
import requests

with open("input_image.jpg", "rb") as image_file:
    edit_response = requests.post(
        "https://api.avalai.ir/v1/images/edits",
        headers={"Authorization": f"Bearer your-avalai-api-key"},
        files={"image": image_file},
        data={
            "model": "qwen-image-edit",
            "prompt": "Change the sky to a dramatic sunset with orange and purple colors",
        },
    )

print(f"Edited image: {edit_response.json()}")
```

#### Using Native Dashscope Format

For advanced features like intelligent prompt enhancement, negative prompts, and precise control, use the native Dashscope format:

```python
# Python example using native Dashscope format for advanced features
import requests

# Advanced text-to-image with native Dashscope parameters
response = requests.post(
    "https://api.avalai.ir/v1/images/generations",
    headers={
        "Authorization": "Bearer your-avalai-api-key",
        "Content-Type": "application/json",
    },
    json={
        "model": "qwen-image",
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "text": "A professional headshot of a confident business person in modern office setting"
                        }
                    ],
                }
            ]
        },
        "parameters": {
            "size": "1328*1328",  # Note: Dashscope uses * instead of x
            "prompt_extend": True,  # Enable intelligent prompt enhancement
            "watermark": False,  # Control watermark
            "negative_prompt": "blurry, low quality, distorted, unprofessional",
            "seed": 12345,  # For reproducible results
        },
    },
)

print(f"Advanced generation result: {response.json()}")

# Advanced image editing with multiple images
edit_response = requests.post(
    "https://api.avalai.ir/v1/images/edits",
    headers={
        "Authorization": "Bearer your-avalai-api-key",
        "Content-Type": "application/json",
    },
    json={
        "model": "qwen-image-edit",
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "image": "https://example.com/input-image.jpg"  # Or base64 data
                        },
                        {
                            "text": "Change the person to a standing position, bending over to hold the front paws of the dog"
                        },
                    ],
                }
            ]
        },
        "parameters": {
            "negative_prompt": "distorted, unnatural pose",
            "watermark": False,
        },
    },
)

print(f"Advanced editing result: {edit_response.json()}")
```

#### Qwen Model-Specific Features

- **Multiple Aspect Ratios**: 1:1, 4:3, 3:4, 16:9, 9:16 (1328×1328, 1664×928, 1472×1140, 1140×1472, 928×1664)
- **Intelligent Prompt Enhancement**: Automatic prompt rewriting for better results
- **Negative Prompts**: Specify what you don't want in the image
- **Watermark Control**: Choose whether to include Qwen-Image watermark
- **Seed Support**: Reproducible results with consistent seed values
- **Multi-Image Input**: Support for multiple reference images in editing tasks

**Important Note for Qwen Models**: While Qwen models support both Chinese and English prompts, using clear and descriptive English prompts often yields the best results for international use cases.

**Important Note for Stability AI Models**: When using Stability AI models, it's recommended to use English prompts as these models have limited understanding of non-English languages. Also, avoid using the U+200C character (ZERO WIDTH NON-JOINER) in prompts as it can cause requests to fail.

## Generations

Create an original image from a text prompt using the `v1/images/generations` endpoint.

```language-selector
python=:# Python Example using AvalAI for Image Generation
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    response = client.images.generate(
        model="gpt-image-2",  # Or another model available via AvalAI, e.g., "gpt-image-1-mini"
        prompt="a white siamese cat",
        size="1024x1024",  # Check supported sizes for the chosen model
        quality="standard",  # Use "hd" for DALL·E 3 if desired and supported by AvalAI
        n=1,  # Number of images (DALL·E 3 usually supports n=1)
        response_format="url",  # Or "b64_json"
    )
    image_url = response.data[0].url
    print(image_url)
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example using AvalAI for Image Generation
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  try {
    const response = await client.images.generate({
      model: "gpt-image-2", // Or another model available via AvalAI
      prompt: "a white siamese cat",
      n: 1, // usually supports n=1
      size: "1024x1024", // Check supported sizes
      response_format: "url", // Or "b64_json"
    });
    console.log(response.data[0].url);
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
main();

bash=:# cURL Example using AvalAI for Image Generation
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-image-2",
  "prompt": "a white siamese cat",
  "n": 1,
  "size": "1024x1024"
}'

go=:// Go Example using AvalAI for Image Generation
package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	req := openai.ImageRequest{
		Model:          openai.CreateImageModelDallE3, // Or CreateImageModelDallE2
		Prompt:         "a white siamese cat",
		N:              1,
		Size:           openai.CreateImageSize1024x1024,     // Check supported sizes
		ResponseFormat: openai.CreateImageResponseFormatURL, // Or CreateImageResponseFormatB64JSON
		// User: "user-123", // Optional
	}

	resp, err := client.CreateImage(context.Background(), req)
	if err != nil {
		fmt.Printf("Image creation error: %v\n", err)
		return
	}

	if len(resp.Data) > 0 {
		fmt.Println(resp.Data[0].URL) // Or resp.Data[0].B64JSON
	} else {
		fmt.Println("No image data received.")
	}
}

php=:<?php
// PHP Example using AvalAI for Image Generation

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/images/generations'; // Use AvalAI base URL

$data = [
'model' => 'gpt-image-2', // Or another model like 'gpt-image-1-mini'
'prompt' => 'a white siamese cat',
'n' => 1, // Number of images (DALL·E 3 usually supports n=1)
'size' => '1024x1024', // Check supported sizes for the model
'quality' => 'standard', // Use "hd" for DALL·E 3 if desired
'response_format' => 'url' // Or 'b64_json'
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
'Content-Length: ' . strlen($jsonData)
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response: " . $response;
} else {
  echo "Image generation response:\n";
  $responseData = json_decode($response, true);
  if (isset($responseData['data'][0]['url'])) {
    echo $responseData['data'][0]['url'] . "\n";
  } elseif (isset($responseData['data'][0]['b64_json'])) {
    echo "Received B64 JSON data (truncated):\n" . substr($responseData['data'][0]['b64_json'], 0, 100) . "...\n";
  } else {
    print_r($responseData);
  }
}
?>

```

### Size and Quality Options

Supported sizes and quality options depend on the model:

- **GPT Image 1:** Sizes: `1024x1024` (square), `1536x1024` (portrait), `1024x1536` (landscape), `auto`. Quality: `low`, `medium`, `high`, `auto`. Supports flexible customization including output format and compression level. See our [detailed guide](en/examples/generate_images_with_gpt_image.md).
- **DALL·E 3:** Sizes: `1024x1024`, `1024x1792`, `1792x1024`. Quality: `standard` (default), `hd`. Usually `n=1`.
- **Stability AI Models:** Most models support `1024x1024` and various other sizes. Additional parameters like `seed`, `negative_prompt`, and `mode` can be passed via `extra_body`. See our [detailed guide on Stability AI models](en/examples/generate_images_with_stability_ai.md).

### Prompting

Provide clear, descriptive prompts. Note that some models (like DALL·E 3) might internally revise prompts for detail or safety. The revised prompt might be available in the response object (`revised_prompt` field) if supported by the AvalAI integration.

## Edits (Model-Dependent)

_Requires a model supporting edits, like GPT Image 1 or DALL·E 2._

The `v1/images/edits` endpoint allows modifying parts of an image using a mask. Upload the original image and a mask (PNG format, same dimensions, transparent areas indicate where to edit). The prompt should describe the _entire desired final image_.

```python
# Python Example using AvalAI for Image Edits (Requires DALL·E 2 or similar)
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    # Ensure model supports edits (e.g., "gpt-image-1")
    response = client.images.edit(
        model="gpt-image-1",  # Specify a model that supports edits
        image=open("original_image.png", "rb"),
        mask=open("mask.png", "rb"),
        prompt="A sunlit indoor lounge area with a pool containing a flamingo",
        n=1,
        size="1024x1024",  # Must be a supported size for the model
        response_format="url",  # or b64_json
    )
    image_url = response.data[0].url
    print(image_url)
except Exception as e:
    print(f"An error occurred: {e}")
    # Check if the model supports edits or if image/mask formats are correct
```

**Requirements:**

- For GPT Image 1: Offers more advanced masking capabilities with better control over edited regions. See our [detailed guide on GPT Image 1](en/examples/generate_images_with_gpt_image.md#using-masks-for-precise-editing) for specific masking techniques.

## Specialized Image Editing Services

AvalAI provides access to 9 specialized Stability AI image editing services designed for professional creative workflows. These services offer advanced capabilities for specific image manipulation tasks, following the implementation patterns documented in the [AWS Bedrock Stability AI Image Services documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/stable-image-services.html).

### Available Services

#### Edit Services
- **Inpaint** (`stability.stable-image-inpaint-v1:0`) - Intelligently fill masked areas with contextually appropriate content
- **Search & Recolor** (`stability.stable-image-search-recolor-v1:0`) - Change colors of specific objects using natural language prompts
- **Search & Replace** (`stability.stable-image-search-replace-v1:0`) - Replace objects within images using descriptive prompts
- **Erase Object** (`stability.stable-image-erase-object-v1:0`) - Remove unwanted elements while maintaining background consistency
- **Remove Background** (`stability.stable-image-remove-background-v1:0`) - Isolate subjects from backgrounds with precision

#### Control Services
- **Control Sketch** (`stability.stable-image-control-sketch-v1:0`) - Generate detailed images from rough sketches and line art
- **Control Structure** (`stability.stable-image-control-structure-v1:0`) - Maintain structural composition while changing visual style
- **Style Guide** (`stability.stable-image-style-guide-v1:0`) - Generate new content following a specific visual style reference
- **Style Transfer** (`stability.stable-style-transfer-v1:0`) - Apply artistic styles from reference images to target content

### Usage Examples

#### Inpainting with Masks

Fill specific areas of an image with new content:

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Inpaint masked areas
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
            "grow_mask": 5,
            "seed": 42,
        },
        response_format="url",  # or b64_json
    )

print(f"Inpainted image: {response.data[0].url}")

javascript=:import fs from 'fs';
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.edit({
    model: "stability.stable-image-inpaint-v1:0",
    image: fs.createReadStream("input-image-inpaint.jpg"),
    mask: fs.createReadStream("mask-image-inpaint.png"),
    prompt: "artificer of time and space",
    extra_body: {
        style_preset: "photographic",
        negative_prompt: "blurry, low quality",
        grow_mask: 5,
        seed: 42
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

#### Object Recoloring

Change the color of specific objects without affecting the rest of the image:

```language-selector
python=:# Recolor specific objects
with open("input-search-recolor.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-search-recolor-v1:0",
        image=img,
        prompt="red jacket",  # New color/style
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
    prompt: "red jacket",
    extra_body: {
        select_prompt: "jacket",
        style_preset: "photographic"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-search-recolor-v1:0" \
  -F "image=@input-search-recolor.jpg" \
  -F "prompt=red jacket" \
  -F "select_prompt=jacket"

```

#### Background Removal

Remove backgrounds while preserving subject details:

```language-selector
python=:# Remove background completely
with open("input-remove-background.jpg", "rb") as img:
    response = client.images.edit(
        model="stability.stable-image-remove-background-v1:0",
        image=img,
        prompt="",  # No prompt needed
        response_format="b64_json",  # Get base64 for transparency
        extra_body={"output_format": "png"},  # PNG for transparency
    )

# Save with transparency
import base64

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

#### Sketch to Image

Transform rough sketches into detailed, realistic images:

```language-selector
python=:# Convert sketch to realistic image
with open("input-control-sketch.jpg", "rb") as sketch:
    response = client.images.edit(
        model="stability.stable-image-control-sketch-v1:0",
        image=sketch,
        prompt="A modern house with mountains and river flowing nearby",
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
    prompt: "A modern house with mountains and river flowing nearby",
    extra_body: {
        control_strength: 0.7,
        style_preset: "photographic"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-control-sketch-v1:0" \
  -F "image=@input-control-sketch.jpg" \
  -F "prompt=A modern house with mountains and river flowing nearby" \
  -F "control_strength=0.7"

```

### Advanced Parameters

All specialized services support advanced parameters through the `extra_body` parameter:

| Parameter | Description | Default | Range/Options |
|-----------|-------------|---------|---------------|
| `style_preset` | Visual style guide | None | `photographic`, `cinematic`, `digital-art`, `anime`, `comic-book`, etc. |
| `negative_prompt` | Content to avoid | None | Text description |
| `seed` | Reproducible results | Random | 0-4294967294 |
| `control_strength` | Input influence (Control services) | 0.7 | 0.0-1.0 |
| `grow_mask` | Expand mask edges (Mask services) | 5 | 0-20 pixels |
| `fidelity` | Style matching strength (Style services) | 0.5 | 0.0-1.0 |
| `output_format` | Image format | `png` | `png`, `jpeg`, `webp` |

### Error Handling for Specialized Services

```python
# Comprehensive error handling for specialized services
try:
    response = client.images.edit(
        model="stability.stable-image-inpaint-v1:0",
        image=image_file,
        mask=mask_file,
        prompt="Your prompt here",
        response_format="url",  # or b64_json
    )
    print(f"Success: {response.data[0].url}")

except Exception as e:
    error_message = str(e).lower()

    if "filter_reason" in error_message:
        print("Content was filtered. Try a different prompt or image.")
    elif "invalid_prompts" in error_message:
        print(
            "Invalid prompt detected. Ensure prompts are descriptive and appropriate."
        )
    elif "size" in error_message:
        print(
            "Image size issue. Ensure image is under 4MB and meets dimension requirements."
        )
    elif "mask" in error_message:
        print(
            "Mask issue. Ensure mask is black and white with same dimensions as input image."
        )
    else:
        print(f"API Error: {e}")
```

### Best Practices

1. **Image Preparation**: Ensure input images are under 4MB and in supported formats (PNG, JPEG, WebP)
2. **Mask Quality**: For mask-based services, use high-contrast black and white masks
3. **Prompt Clarity**: Use clear, descriptive English prompts for best results
4. **Parameter Tuning**: Experiment with `control_strength` and `fidelity` for optimal results
5. **Style Consistency**: Use consistent style presets across related images
6. **Error Handling**: Implement comprehensive error handling for production use

### Service Selection Guide

| Task | Recommended Service | Key Parameters |
|------|-------------------|----------------|
| Fill gaps or holes | Inpaint | `grow_mask`, `style_preset` |
| Change object colors | Search & Recolor | `select_prompt` |
| Replace objects | Search & Replace | `search_prompt`, `grow_mask` |
| Remove objects cleanly | Erase Object | `grow_mask` |
| Isolate subjects | Remove Background | `output_format` |
| Sketch to photo | Control Sketch | `control_strength` |
| Style while keeping structure | Control Structure | `control_strength` |
| Match specific style | Style Guide | `fidelity` |
| Apply artistic style | Style Transfer | `style_strength` |

For detailed examples and advanced usage patterns, see our comprehensive [Stability AI Image Editing Examples](en/examples/stability_ai_image_editing.md) guide.

## Variations (Model-Dependent)

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

_Requires a model supporting variations, like DALL·E 2._

The `v1/images/variations` endpoint creates variations of an input image.

```python
# Python Example using AvalAI for Image Variations (Requires DALL·E 2 or similar)
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    # Ensure model supports variations (e.g., "dall-e-2")
    response = client.images.create_variation(
        model="dall-e-2",  # Specify a model that supports variations
        image=open("input_image.png", "rb"),
        n=1,
        size="1024x1024",  # Must be a supported size for the model
        response_format="url",  # or b64_json
    )
    image_url = response.data[0].url
    print(image_url)
except Exception as e:
    print(f"An error occurred: {e}")
    # Check if the model supports variations or if image format is correct
```

**Requirement:** Input image must be a square PNG < 4MB.

## Content Moderation

Prompts and images submitted via AvalAI are subject to moderation based on underlying provider policies and potentially AvalAI's own policies. Requests may be rejected if flagged.

## Handling Image Data

Examples show reading files from disk. You can also use in-memory image data (e.g., `BytesIO` in Python, `Buffer` in Node.js). Ensure the data object includes a filename with the correct extension (e.g., `.png`) when passing it to the SDK function.

```python
# Python Example with in-memory data (BytesIO)
from io import BytesIO
from PIL import Image  # Example using Pillow library
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Assume 'image_data' is your raw image bytes (e.g., from a download)
# image = Image.open(BytesIO(image_data)) # Example: Load bytes into Pillow

# # --- Optional: Process image (e.g., resize) ---
# width, height = 512, 512
# image = image.resize((width, height))
# # --- End Optional Processing ---

byte_stream = BytesIO()
# Save to BytesIO object, ensuring PNG format if required by API endpoint
image.save(byte_stream, format="PNG")
byte_array = byte_stream.getvalue()

try:
    response = client.images.create_variation(  # Or .edit, .generate
        model="dall-e-2",  # Choose appropriate model
        image=byte_array,  # Pass the byte array
        n=1,
        size="1024x1024",
        response_format="url",  # or b64_json
    )
    print(response.data[0].url)
except Exception as e:
    print(f"An error occurred: {e}")
```

### Example with Stability AI Model

Here's a complete example of generating an image using a Stability AI model:

```python
# Python Example using Stability AI model via AvalAI
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    response = client.images.generate(
        model="stability.sd3-5-large-v1:0",  # Stability AI's SD3.5 model
        prompt="A photorealistic mountain landscape with a lake reflecting the sunset, detailed lighting, high resolution",
        size="1024x1024",
        extra_body={
            "seed": 12345,  # Fixed seed for reproducibility
            "negative_prompt": "blurry, low quality, distorted, deformed features",  # What to avoid
            "mode": "text-to-image",  # Generation mode
        },
        response_format="url",  # or b64_json
    )
    image_url = response.data[0].url
    print(f"Generated image URL: {image_url}")
except Exception as e:
    print(f"An error occurred: {e}")
```

## Error Handling

Wrap API calls in `try...except` (Python) or `try...catch` (JavaScript) blocks to handle potential errors like invalid inputs, rate limits, or provider issues.

```python
# Python Error Handling Example
import openai
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    response = client.images.generate(
        model="gpt-image-2",
        prompt="a valid prompt",
        n=1,
        size="1024x1024",
        response_format="url",  # or b64_json
    )
    print(response.data[0].url)
except openai.APIError as e:
    # Handles API errors (e.g., rate limits, server errors from AvalAI/provider)
    print(f"API Error: {e.status_code} - {e.message}")
    print(e.body)  # Contains more details
except openai.AuthenticationError as e:
    print(f"Authentication Error: {e.message}")
except openai.BadRequestError as e:
    print(f"Bad Request Error: {e.message}")  # e.g., invalid parameters
except Exception as e:
    # Handles other potential errors (network issues, etc.)
    print(f"An unexpected error occurred: {e}")
```
