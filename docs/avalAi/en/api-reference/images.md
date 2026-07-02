# Image Generation API

The Image Generation API allows you to create and edit images using AI models from various providers through the AvalAI platform.

## Endpoint

```
POST https://api.avalai.ir/v1/images/generations
```

## Request Body

| Parameter         | Type    | Required | Description                                                                                                         |
| ----------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `model`           | string  | Yes      | ID of the model to use (e.g., "gpt-image-2").                                                                          |
| `prompt`          | string  | Yes      | A text description of the desired image(s). Maximum length is 1000 characters.                                      |
| `n`               | integer | No       | The number of images to generate. Defaults to 1.                                                                    |
| `size`            | string  | No       | The size of the generated images. Must be one of "1024x1024", "1024x1792", or "1792x1024". Defaults to "1024x1024". |
| `quality`         | string  | No       | The quality of the image generation. Must be one of "standard" or "hd". Defaults to "standard".                     |
| `style`           | string  | No       | The style of the generated images. Must be one of "vivid" or "natural". Defaults to "vivid".                        |
| `response_format` | string  | No       | The format in which the generated images are returned. Must be one of "url" or "b64_json". Defaults to "url".       |
| `user`            | string  | No       | A unique identifier representing your end-user, which can help monitor and detect abuse.                            |

## Examples

### Basic Image Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-image-2",
  "prompt": "A cute baby sea otter floating on its back in the ocean",
  "n": 1,
  "size": "1024x1024"
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.images.generate(
    model="gpt-image-2",
    prompt="A cute baby sea otter floating on its back in the ocean",
    n=1,
    size="1024x1024",
)

image_url = response.data[0].url
print(image_url)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "gpt-image-2",
  prompt: "A cute baby sea otter floating on its back in the ocean",
  n: 1,
  size: "1024x1024",
  response_format: "url", // or b64_json
});

const imageUrl = response.data[0].url;
console.log(imageUrl);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateImage(
		context.Background(),
		openai.ImageRequest{
			Model:  openai.CreateImageModelDallE3,
			Prompt: "A cute baby sea otter floating on its back in the ocean",
			N:      1,
			Size:   openai.CreateImageSize1024x1024,
		},
	)

	if err != nil {
		fmt.Printf("Image creation error: %v\n", err)
		return
	}

	fmt.Println(resp.Data[0].URL)
}

php=:<?php
// PHP Example for Image Generation via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/images/generations';

$data = [
'model' => 'gpt-image-2',
'prompt' => 'A cute baby sea otter floating on its back in the ocean',
'n' => 1,
'size' => '1024x1024'
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
  echo $response;
} else {
  $responseData = json_decode($response, true);
  if (isset($responseData['data'][0]['url'])) {
    echo "Image URL: " . $responseData['data'][0]['url'] . "\n";
  } else {
    echo "Response received:\n";
    print_r($responseData);
  }
}
?>

```

## Provider-Specific Parameters

When using non-OpenAI image generation or editing models (such as Black Forest Labs, Stability AI, or Google models), you may need to pass provider-specific parameters that aren't directly supported by the OpenAI SDK. Use the [`extra_body`](en/guides/provider-specific-params.md) parameter to pass these additional parameters.

### Using extra_body for Provider-Specific Parameters

The system will automatically map provider-specific parameters to the appropriate provider since these are not OpenAI standard parameters.

#### Common Provider-Specific Parameters

Here are some examples of provider-specific parameters for **Black Forest Labs (BFL)** and **Stability AI** models:

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

### Example with Provider-Specific Parameters

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Using Black Forest Labs model with provider-specific parameters
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

image_url = response.data[0].url
print(image_url)

# Using Stability AI model with provider-specific parameters
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A cyberpunk cityscape at night",
    size="1024x1024",
    extra_body={
        "cfg_scale": 7.5,
        "steps": 50,
        "sampler": "K_DPM_2_ANCESTRAL",
        "style_preset": "cyberpunk",
    },
)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Using Black Forest Labs model with provider-specific parameters
const response = await client.images.generate({
    model: "flux-1.1-pro",
    prompt: "A majestic dragon soaring through clouds",
    size: "1024x1024",
    // @ts-expect-error extra_body is a provider-specific parameter
    extra_body: {
        aspect_ratio: "16:9",
        output_format: "png",
        safety_tolerance: 2,
        prompt_upsampling: true
    },
    response_format: "url", // or b64_json
});

const imageUrl = response.data[0].url;
console.log(imageUrl);

// Using Stability AI model with provider-specific parameters
const stabilityResponse = await client.images.generate({
    model: "stability.sd3-5-large-v1:0",
    prompt: "A cyberpunk cityscape at night",
    size: "1024x1024",
    // @ts-expect-error extra_body is a provider-specific parameter
    extra_body: {
        cfg_scale: 7.5,
        steps: 50,
        sampler: "K_DPM_2_ANCESTRAL",
        style_preset: "cyberpunk"
    }
});

```

### Alibaba Qwen Image Models

The Qwen image models support both OpenAI SDK format and native Alibaba Dashscope format, providing maximum flexibility for developers.

```language-selector
python=:from openai import OpenAI
import requests

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Text-to-image generation using OpenAI SDK format
response = client.images.generate(
    model="qwen-image",
    prompt="A serene mountain landscape with a crystal clear lake reflecting snow-capped peaks",
    size="1328x1328",
    n=1,
)

print(f"Generated image URL: {response.data[0].url}")

# Image editing using OpenAI SDK format
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

# Using native Dashscope format for advanced parameters
dashscope_response = requests.post(
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
            "size": "1328*1328",
            "prompt_extend": True,
            "watermark": False,
            "negative_prompt": "blurry, low quality, distorted",
        },
    },
)

print(f"Dashscope format result: {dashscope_response.json()}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Text-to-image generation using OpenAI SDK format
const response = await client.images.generate({
    model: "qwen-image",
    prompt: "A futuristic cityscape with flying cars and neon lights",
    size: "1664x928", // 16:9 aspect ratio
    n: 1,
    response_format: "url", // or b64_json
});

console.log(`Generated image URL: ${response.data[0].url}`);

// Using native Dashscope format for advanced parameters
const dashscopeResponse = await fetch("https://api.avalai.ir/v1/images/generations", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "qwen-image",
        input: {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            text: "A magical forest scene with glowing mushrooms and fairy lights"
                        }
                    ]
                }
            ]
        },
        parameters: {
            size: "1328*1328",
            prompt_extend: true,
            watermark: false,
            negative_prompt: "dark, gloomy, scary"
        }
    })
});

const result = await dashscopeResponse.json();
console.log("Dashscope format result:", result);

```

#### Qwen Model-Specific Parameters

When using the native Dashscope format, you can access additional parameters:

- `prompt_extend` - Enable intelligent prompt rewriting for better results
- `watermark` - Control whether to add Qwen-Image watermark
- `negative_prompt` - Specify what you don't want in the image
- `size` - Support for multiple aspect ratios (1328×1328, 1664×928, 1472×1140, 1140×1472, 928×1664)
- `seed` - Set random seed for reproducible results

> **Note:** The specific parameters available depend on the model provider. Refer to the individual model documentation for complete parameter lists. The system will automatically handle the mapping of these parameters to the appropriate provider's API format.

## Response Format

```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://avalai-generated-images.storage.googleapis.com/image1.png",

      "revised_prompt": "A cute baby sea otter with brown fur, floating on its back in the clear blue ocean water. The otter's small paws are visible as it rests peacefully, with gentle waves surrounding it under a bright sky."
    }
  ]
}
```

When `response_format` is set to `b64_json`, the response will include base64-encoded JSON:

```json
{
  "created": 1589478378,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEU...",
      "revised_prompt": "A cute baby sea otter with brown fur, floating on its back in the clear blue ocean water. The otter's small paws are visible as it rests peacefully, with gentle waves surrounding it under a bright sky."
    }
  ]
}
```

## Response Parameters

| Parameter | Type    | Description                                                      |
| --------- | ------- | ---------------------------------------------------------------- |
| `created` | integer | The Unix timestamp (in seconds) of when the images were created. |
| `data`    | array   | An array of image objects.                                       |

### Image Object

| Parameter        | Type   | Description                                                                                        |
| ---------------- | ------ | -------------------------------------------------------------------------------------------------- |
| `url`            | string | The URL of the generated image. Only present when `response_format` is "url".                      |
| `b64_json`       | string | The base64-encoded JSON of the generated image. Only present when `response_format` is "b64_json". |
| `revised_prompt` | string | The prompt that was used to generate the image, potentially modified for improved results.         |

## Image Editing

AvalAI supports comprehensive image editing capabilities through the following endpoint:

```
POST https://api.avalai.ir/v1/images/edits
```

This allows you to edit an existing image by providing the image file and a descriptive prompt for the desired changes.

### Request Body (Form Data)

| Parameter | Type | Required | Description |
| ----------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `model` | string | Yes | ID of the model to use for editing (see supported models below). |
| `image` | file | Yes | The image file to edit. Must be a valid PNG file, less than 4MB, and square. |
| `prompt` | string | Yes | A text description of the desired edit. Maximum length is 1000 characters. |
| `n` | integer | No | The number of edited images to generate. Defaults to 1. |
| `size` | string | No | The size of the edited images. Must be one of "1024x1024", "1024x1792", or "1792x1024". Defaults to "1024x1024". |
| `response_format` | string | No | The format in which the edited images are returned. Must be one of "url" or "b64_json". Defaults to "url". |
| `user` | string | No | A unique identifier representing your end-user, which can help monitor and detect abuse. |

### Supported Models for Image Editing

The following models support the `v1/images/edits` endpoint:

#### Stability AI Models

**General Image Editing Models:**
- **stability.sd3-large-v1:0** - Advanced Stable Diffusion 3 model for high-quality image editing
- **stability.sd3-5-large-v1:0** - Latest Stable Diffusion 3.5 model with enhanced editing capabilities
- **stability.stable-image-core-v1:0** - Core Stable Image model optimized for reliable editing
- **stability.stable-image-core-v1:1** - Updated version of the core model with improved performance
- **stability.stable-image-ultra-v1:0** - Ultra-high quality image editing model
- **stability.stable-image-ultra-v1:1** - Enhanced ultra model with latest improvements

**Specialized Image Services (9 Services):**
- **stability.stable-image-inpaint-v1:0** - Intelligently fill masked areas with contextually appropriate content
- **stability.stable-image-search-recolor-v1:0** - Change colors of specific objects using natural language prompts
- **stability.stable-image-search-replace-v1:0** - Replace objects within images using descriptive prompts
- **stability.stable-image-erase-object-v1:0** - Remove unwanted elements while maintaining background consistency
- **stability.stable-image-remove-background-v1:0** - Isolate subjects from backgrounds with precision
- **stability.stable-image-control-sketch-v1:0** - Generate detailed images from rough sketches and line art
- **stability.stable-image-control-structure-v1:0** - Maintain structural composition while changing visual style
- **stability.stable-image-style-guide-v1:0** - Generate new content following a specific visual style reference
- **stability.stable-style-transfer-v1:0** - Apply artistic styles from reference images to target content

> **Note:** These specialized services follow the implementation patterns documented in the [AWS Bedrock Stability AI Image Services documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/stable-image-services.html). Each service is optimized for specific image editing tasks and supports advanced parameters through the `extra_body` parameter.

#### Google Models
- **imagen-3.0-generate-001** - Google's Imagen 3.0 model for sophisticated image editing and generation

### Image Editing Example

```language-selector
python=:import requests
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Edit existing image
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="stability.sd3-5-large-v1:0",
        image=image_file,
        prompt="Add a rainbow in the sky above the mountains",
        size="1024x1024",
        n=1,
    )

# Save edited image
edited_image_url = response.data[0].url
edited_image = requests.get(edited_image_url)
with open("edited_image.png", "wb") as f:
    f.write(edited_image.content)

print("✅ Image edited and saved as edited_image.png")

javascript=:import fs from 'fs';
import { OpenAI } from "openai";

const client = new OpenAI({
 apiKey: process.env.AVALAI_API_KEY,
 baseURL: "https://api.avalai.ir/v1",
});

// Edit existing image
const imageFile = fs.createReadStream("input_image.png");
const response = await client.images.edit({
 model: "stability.sd3-5-large-v1:0",
 image: imageFile,
 prompt: "Add a rainbow in the sky above the mountains",
 size: "1024x1024",
 n: 1,
});

// Save edited image
const editedImageUrl = response.data[0].url;
const imageResponse = await fetch(editedImageUrl);
const imageBuffer = await imageResponse.arrayBuffer();
fs.writeFileSync("edited_image.png", Buffer.from(imageBuffer));

console.log("✅ Image edited and saved as edited_image.png");

```

### Specialized Image Editing Services

The specialized Stability AI image editing services provide advanced capabilities for specific image manipulation tasks. These services are designed for professional workflows and support various advanced parameters.

#### Inpainting Example

Fill masked areas with contextually appropriate content:

```language-selector
python=:import requests
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Inpaint with mask
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
        },
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

#### Search and Recolor Example

Change colors of specific objects using natural language:

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

#### Background Removal Example

Remove backgrounds while preserving subject details:

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
import base64

img_data = base64.b64decode(response.data[0].b64_json)
with open("no_background.png", "wb") as f:
    f.write(img_data)

javascript=:const response = await client.images.edit({
    model: "stability.stable-image-remove-background-v1:0",
    image: fs.createReadStream("input-remove-background.jpg"),
    prompt: "",
    response_format: "b64_json",
    extra_body: {
        output_format: "png"
    }
});

bash=:curl -X POST https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=stability.stable-image-remove-background-v1:0" \
  -F "image=@input-remove-background.jpg" \
  -F "output_format=png"

```

### Advanced Parameters for Specialized Services

The specialized services support various advanced parameters through the `extra_body` parameter:

| Parameter | Description | Services | Range/Options |
|-----------|-------------|----------|---------------|
| `style_preset` | Visual style guide | Most services | `photographic`, `cinematic`, `digital-art`, `anime`, etc. |
| `control_strength` | Input image influence | Control services | 0.0-1.0 (default: 0.7) |
| `negative_prompt` | Content to avoid | Most services | Text description |
| `seed` | Reproducible results | All services | 0-4294967294 |
| `grow_mask` | Expand mask edges | Mask-based services | 0-20 pixels (default: 5) |
| `select_prompt` | Object to modify | Search services | Text description |
| `search_prompt` | Object to replace | Replace service | Text description |
| `fidelity` | Style matching strength | Style services | 0.0-1.0 (default: 0.5) |
| `output_format` | Image format | All services | `png`, `jpeg`, `webp` |

### Service-Specific Use Cases

| Service | Best For | Input Requirements |
|---------|----------|-------------------|
| **Inpaint** | Filling gaps, removing objects with context | Image + mask |
| **Search & Recolor** | Changing object colors | Image + color prompt |
| **Search & Replace** | Swapping objects | Image + replacement prompt |
| **Erase Object** | Clean object removal | Image + mask (optional) |
| **Remove Background** | Subject isolation | Image only |
| **Control Sketch** | Sketch to realistic image | Sketch/line art |
| **Control Structure** | Style transfer with structure | Reference image |
| **Style Guide** | Consistent style generation | Style reference |
| **Style Transfer** | Artistic style application | Content + style images |

> **Technical Reference:** These implementations follow the [AWS Bedrock Stability AI Image Services documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/stable-image-services.html) patterns and specifications.

## Image Variations

_Requires a model supporting variations, like DALL·E 2._

You can create variations of an existing image using:

```
POST https://api.avalai.ir/v1/images/variations
```

This generates variations of a given image.

## Available Models

AvalAI supports various image generation and editing models from different providers:

### Image Generation Models

| Provider | Model | Description | Supported Endpoints |
| ------------ | ------------------ | ---------------------------------------------------------- | ------------------- |
| BytePlus | seedream-5-0-260128 | Most advanced Seedream model with Chain of Thought reasoning, MJ-style aesthetics, and intelligent prompt optimization | `v1/images/generations`, `v1/images/edits` |
| BytePlus | seedream-4-5-251128 | Latest Seedream model with enhanced generation modes, improved prompt adherence, and multi-image editing capabilities | `v1/images/generations`, `v1/images/edits` |
| BytePlus | seedream-4-0-250828 | State-of-the-art image generation and editing with sequential generation, multi-image blending, and streaming support | `v1/images/generations`, `v1/images/edits` |
| OpenAI | gpt-image-2 | OpenAI's next-generation image model (alias: `gpt-image-2-2026-04-21`) with enhanced prompt adherence and editing capabilities | `v1/images/generations`, `v1/images/edits` |
| OpenAI | gpt-image-1.5 | OpenAI's latest and most advanced image generation and editing model with improved prompt adherence and visual quality | `v1/images/generations`, `v1/images/edits` |
| OpenAI | gpt-image-1 | OpenAI's advanced image generation and editing model (Tier 3, 4, 5 only) | `v1/images/generations`, `v1/images/edits` |
| OpenAI | gpt-image-1-mini | Cost-efficient version of GPT Image 1 for high-volume applications (Tier 3, 4, 5 only) | `v1/images/generations`, `v1/images/edits` |
| Black Forest Labs | flux.2-pro | Most advanced FLUX model with superior image quality and megapixel-based pricing | `v1/images/generations` |
| Black Forest Labs | flux-1.1-pro | Advanced FLUX model | `v1/images/generations` |
| Black Forest Labs | flux.1-kontext-pro | Advanced FLUX model with professional editing capabilities | `v1/images/generations` |

| Google | gemini-2.5-flash-image | Nano Banana - Stable state-of-the-art image generation model with text-to-image and image-to-image capabilities | `v1/chat/completions` |
| Google | gemini-3-pro-image | Nano Banana Pro (stable) - Professional-grade image generation for brand assets, photorealistic quality | `v1/chat/completions`, `v1beta/` |
| Google | gemini-3.1-flash-image | Nano Banana 2 (stable) - Flagship high-efficiency image generation with up to 4K resolution, advanced text rendering | `v1/chat/completions`, `v1beta/` |
| Google | gemini-3-pro-image-preview | Legacy preview alias for Nano Banana Pro. Prefer `gemini-3-pro-image` for new production integrations | `v1/chat/completions` |
| Google | gemini-3.1-flash-image-preview | Legacy preview alias for Nano Banana 2. Prefer `gemini-3.1-flash-image` for new production integrations | `v1/chat/completions` |
| Google | imagen-4.0-ultra-generate-001 | ⚠️ **Deprecating (Aug 17, 2026)** - Ultra-high quality image generation with exceptional detail. Migrate to `gemini-3.1-flash-image` | `v1/images/generations` |
| Google | imagen-4.0-generate-001 | ⚠️ **Deprecating (Aug 17, 2026)** - High-quality professional image generation. Migrate to `gemini-3.1-flash-image` | `v1/images/generations` |
| Google | imagen-4.0-fast-generate-001 | ⚠️ **Deprecating (Aug 17, 2026)** - Fast image generation optimized for speed. Migrate to `gemini-3.1-flash-image` | `v1/images/generations` |
| Google | imagen-3.0-generate-001 | **Deprecated** - Google's Imagen 3.0 model for image generation and editing | `v1/images/generations`, `v1/images/edits` |
| Alibaba | qwen-image-2.0-pro | Professional image generation with advanced typography and 2K native resolution | `v1/images/generations` |
| Alibaba | qwen-image-2.0 | Unified generation and editing with 2K native resolution and photorealism | `v1/images/generations`, `v1/images/edits` |
| Alibaba | z-image-turbo | Ultra-fast image generation with Thinking mode for enhanced quality | `v1/images/generations` |
| Alibaba | qwen-image | Advanced text-to-image generation with intelligent prompt enhancement | `v1/images/generations` |
| Stability AI | stable-diffusion-3 | Open source image generation model | `v1/images/generations` |
| Cloudflare | cf.flux-2-klein-9b | FLUX 2 Klein 9B - High quality image generation | `v1/images/generations` |
| Cloudflare | cf.flux-2-klein-4b | FLUX 2 Klein 4B - Fast image generation | `v1/images/generations` |
| Cloudflare | cf.flux-2-dev | FLUX 2 Dev - Development version with flexible features | `v1/images/generations` |
| Cloudflare | cf.lucid-origin | Lucid Origin - Creative and artistic image generation | `v1/images/generations` |
| Cloudflare | cf.phoenix-1.0 | Phoenix 1.0 - Balanced quality and speed | `v1/images/generations` |

### Image Editing Models

| Provider | Model | Description | Supported Endpoints |
| ------------ | ------------------ | ---------------------------------------------------------- | ------------------- |
| OpenAI | gpt-image-2 | OpenAI's next-generation image editing model (alias: `gpt-image-2-2026-04-21`) | `v1/images/edits` |
| OpenAI | gpt-image-1.5 | OpenAI's latest and most advanced image editing model with improved prompt adherence | `v1/images/edits` |
| OpenAI | gpt-image-1 | OpenAI's advanced image generation and editing model (Tier 3, 4, 5 only) | `v1/images/edits` |
| OpenAI | gpt-image-1-mini | Cost-efficient version of GPT Image 1 for high-volume applications (Tier 3, 4, 5 only) | `v1/images/edits` |
| Black Forest Labs | flux.1-kontext-pro | Advanced FLUX model with professional editing capabilities | `v1/images/edits` |
| Stability AI | stability.sd3-large-v1:0 | Advanced Stable Diffusion 3 model for high-quality editing | `v1/images/edits` |
| Stability AI | stability.sd3-5-large-v1:0 | Latest Stable Diffusion 3.5 with enhanced editing capabilities | `v1/images/edits` |
| Google | imagen-3.0-generate-001 | Google's Imagen 3.0 for sophisticated image editing | `v1/images/edits` |
| Alibaba | qwen-image-2.0-pro | Professional editing with near-zero typography errors in 40+ languages | `v1/images/edits` |
| Alibaba | qwen-image-2.0 | Unified generation and editing with professional photorealistic output | `v1/images/edits` |
| Alibaba | qwen-image-edit-plus | Advanced image editing with enhanced quality and multi-image support | `v1/images/generations`, `v1/images/edits` |
| Alibaba | qwen-image-edit | Sophisticated image editing with multi-image input support | `v1/images/edits` |

## Error Handling

The API may return various error codes:

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 400         | Bad Request - Your request is invalid (e.g., prompt too long). |
| 401         | Unauthorized - Your API key is wrong.                          |
| 403         | Forbidden - You don't have permission to access this resource. |
| 404         | Not Found - The specified resource could not be found.         |
| 429         | Too Many Requests - You have exceeded your rate limit.         |
| 500         | Internal Server Error - We had a problem with our server.      |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Content Moderation

All image generation requests are subject to content moderation. Prompts that violate the content policy will be rejected. For more information, see the [Content Policy](en/guides/content-policy.md) guide.

## Related Resources

- [Models](en/models/model-details.md) - Learn about available image generation models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits
