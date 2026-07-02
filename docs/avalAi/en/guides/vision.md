# Vision (Image Input)

Learn how to use the vision capabilities of models available through AvalAI to understand images. Vision allows you to provide images as input to a model and generate text responses based on the visual content.

To generate images, refer to the [Image Generation guide](en/guides/image-generation.md).

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Image Input Methods](#image-input-methods)
- [Providing Image URLs](#providing-image-urls)
  - [Using Chat Completions API](#using-chat-completions-api)
  - [Using Responses API](#using-responses-api)
- [Providing Base64 Encoded Images](#providing-base64-encoded-images)
  - [Using Chat Completions API](#using-chat-completions-api-1)
  - [Using Responses API](#using-responses-api-1)
- [Multiple Images](#multiple-images)
- [Recommended Vision Models](#recommended-vision-models)
- [Gemini-Specific Image Capabilities](#gemini-specific-image-capabilities)
- [Gemini Robotics-ER: Vision for Physical Robotics](#gemini-robotics-er-vision-for-physical-robotics)
- [Calculating Costs](#calculating-costs)

## API Endpoints

AvalAI supports vision capabilities through two API endpoints:

1. **Chat Completions API** ([`v1/chat/completions`](https://api.avalai.ir/v1/chat/completions)) - The standard OpenAI-compatible endpoint using [`chat.completions.create()`](https://platform.openai.com/docs/api-reference/chat/create)
2. **Responses API** ([`v1/responses`](https://api.avalai.ir/v1/responses)) - An alternative endpoint using [`responses.create()`](https://platform.openai.com/docs/api-reference/responses/create)

Both endpoints support the same vision capabilities. Choose the one that best fits your application architecture.

## Recommended Vision Models

Use the latest model families for new multimodal applications:

- **OpenAI:** `gpt-5.5` for flagship image understanding, visual reasoning, tool use, and long-context multimodal workflows; `gpt-5.4`, `gpt-5.4-mini`, and `gpt-5.4-nano` for lower-cost tiers.
- **Google/Gemini:** `gemini-3.5-flash` for current flagship Flash multimodal reasoning, `gemini-3.1-pro-preview` for advanced Pro-class reasoning, `gemini-3.1-flash-lite` for high-throughput vision tasks, and `gemini-2.5-flash` for fast legacy workloads.
- **Anthropic:** `claude-opus-4-7`, `claude-opus-4-6`, and `claude-sonnet-4-6` for strong image analysis and document/screenshot understanding.
- **Z.AI:** `glm-5v-turbo` for efficient vision-language tasks, with `glm-5.1` for text-first reasoning workflows.
- **Alibaba/Qwen:** Qwen VL families remain useful for OCR, visual question answering, and multilingual image understanding; use current `qwen3.7` or `qwen3.6` text models when the task does not require image input.

## Image Input Methods

You can provide images as input in two ways:

1.  By providing a fully qualified URL to an image file.
2.  By providing an image as a Base64-encoded data URL.

## Providing Image URLs

### Using Chat Completions API

Analyze the content of an image using its URL with the chat completions endpoint:

```language-selector
python=:# Python Example using Chat Completions with Image URL
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.chat.completions.create(
    model="gpt-5.5",  # Or another vision-capable model via AvalAI
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What's in this image?",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                        # Optional: specify detail level
                        # "detail": "high" # or "low" or "auto" (default)
                    },
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:// JavaScript Example using Chat Completions with Image URL
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  const response = await client.chat.completions.create({
    model: "gpt-5.5", // Or another vision-capable model via AvalAI
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "what's in this image?" },
          {
            type: "image_url",
            image_url: {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
              // Optional: specify detail level
              // detail: "high" // or "low" or "auto" (default)
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
}
main();

bash=:# cURL Example using Chat Completions with Image URL
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "What is in this image?"},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
          }
        }
      ]
    }
  ]
}'

go=:// Go Example using Chat Completions with Image URL
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"),
	)

	imageURL := "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"

	resp, err := client.Chat.Completions.New(
		context.Background(),
		openai.ChatCompletionNewParams{
			Model: openai.F("gpt-5.5"),
			Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
				openai.UserMessage(
					openai.F([]openai.ChatCompletionContentPartUnionParam{
						openai.TextPart("What's in this image?"),
						openai.ImagePart(imageURL),
					}),
				),
			}),
		},
	)

	if err != nil {
		fmt.Printf("Error creating completion: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php
// PHP Example using Chat Completions with Image URL
require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, [
  'base_url' => 'https://api.avalai.ir/v1',
]);

$response = $client->chat()->create([
  'model' => 'gpt-5.5',
  'messages' => [
    [
      'role' => 'user',
      'content' => [
        [
          'type' => 'text',
          'text' => 'What\'s in this image?'
        ],
        [
          'type' => 'image_url',
          'image_url' => [
            'url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg',
            // 'detail' => 'high' // Optional: specify detail level
          ]
        ]
      ]
    ]
  ]
]);

echo $response->choices[0]->message->content;
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

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


### Using Responses API

Analyze the content of an image using its URL with the responses endpoint:

```language-selector
python=:# Python Example using AvalAI with Image URL
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.responses.create(
    model="gpt-5.5",  # Or another vision-capable model via AvalAI
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "What's in this image?"},
                {
                    "type": "input_image",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    # Optional: specify detail level
                    # "detail": "high" # or "low" or "auto" (default)
                },
            ],
        }
    ],
)

# Access the generated text (may vary based on SDK version)
if hasattr(response, "output_text"):
    print(response.output_text)

else:  # Manual parsing if output_text is not available
    text_output = ""
    if response.output and isinstance(response.output, list):
        for item in response.output:
            if (
                item.type == "message"
                and item.content
                and isinstance(item.content, list)
            ):
                for content_part in item.content:
                    if content_part.type == "output_text":
                        text_output += content_part.text + "\n"
    print(text_output.strip())

javascript=:// JavaScript Example using AvalAI with Image URL
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  const response = await client.responses.create({
    model: "gpt-5.5", // Or another vision-capable model via AvalAI
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "what's in this image?" },
          {
            type: "input_image",
            image_url:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            // Optional: specify detail level
            // detail: "high" // or "low" or "auto" (default)
          },
        ],
      },
    ],
  });

  // Access the generated text (may vary based on SDK version)
  if (response.output_text) {
    console.log(response.output_text);
  } else {
    // Manual parsing if output_text is not available
    let textOutput = "";
    if (response.output && Array.isArray(response.output)) {
      response.output.forEach((item) => {
        if (
          item.type === "message" &&
          item.content &&
          Array.isArray(item.content)
        ) {
          item.content.forEach((contentPart) => {
            if (contentPart.type === "output_text") {
              textOutput += contentPart.text + "\n";
            }
          });
        }
      });
    }
    console.log(textOutput.trim());
  }
}
main();

bash=:# cURL Example using AvalAI with Image URL
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "input": [
  {
    "role": "user",
    "content": [
    {"type": "input_text", "text": "What is in this image?"},
    {
      "type": "input_image",
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
    }
    ]
  }
  ]
}'

go=:// Go Example using AvalAI with Image URL
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
)

func main() {
	// Set up the client with AvalAI base URL
	config := openai.DefaultConfig(os.Getenv("AVALAI_API_KEY"))
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	// Create the response request with image
	imageURL := "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"

	resp, err := client.CreateResponse(
		context.Background(),
		openai.ResponseRequest{
			Model: "gpt-5.5",
			Input: []openai.ResponseMessage{
				{
					Role: "user",
					Content: []openai.ResponseContent{
						{
							Type: "input_text",
							Text: "What's in this image?",
						},
						{
							Type: "input_image",
							ImageURL: &openai.ImageURL{
								URL: imageURL,
								// Detail: "high", // Optional: specify detail level
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error creating response: %v\n", err)
		return
	}

	// Extract text from the response
	var textOutput string
	for _, item := range resp.Output {
		if item.Type == "message" {
			for _, contentPart := range item.Content {
				if contentPart.Type == "output_text" {
					textOutput += contentPart.Text + "\n"
				}
			}
		}
	}

	fmt.Println(textOutput)
}

php=:<?php
// PHP Example using AvalAI with Image URL
require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, [
'base_url' => 'https://api.avalai.ir/v1',
]);

$response = $client->responses()->create([
'model' => 'gpt-5.5',
'input' => [
[
'role' => 'user',
'content' => [
[
'type' => 'input_text',
'text' => 'What\'s in this image?'
],
[
'type' => 'input_image',
'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg',
// 'detail' => 'high' // Optional: specify detail level
]
]
]
]
]);

// Access the generated text (may vary based on SDK version)
if (isset($response->output_text)) {
  echo $response->output_text;
} else {
  // Manual parsing if output_text is not available
  $textOutput = '';
  foreach ($response->output as $item) {
    if ($item->type === 'message' && isset($item->content)) {
      foreach ($item->content as $contentPart) {
        if ($contentPart->type === 'output_text') {
          $textOutput .= $contentPart->text . "\n";
        }
      }
    }
  }
  echo trim($textOutput);
}
?>

```

## Providing Base64 Encoded Images

### Using Chat Completions API

Analyze the content of a local image by encoding it in Base64 with the chat completions endpoint:

```language-selector
python=:# Python Example using Chat Completions with Base64 Image
import base64
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # Use AvalAI base URL
)


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
image_path = "path/to/your/image.jpg"  # Update this path

# Getting the Base64 string
base64_image = encode_image(image_path)

response = client.chat.completions.create(
    model="gpt-5.5",  # Or another vision-capable model via AvalAI
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}",  # Adjust mime type if needed
                        # Optional: specify detail level
                        # "detail": "high"
                    },
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:// JavaScript Example using Chat Completions with Base64 Image
import fs from "fs";
import path from "path"; // Recommended for handling paths
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  const imagePath = "path/to/your/image.jpg"; // Update this path
  const base64Image = fs.readFileSync(imagePath, "base64");
  const mimeType = "image/jpeg"; // Adjust if using PNG, GIF, etc.

  const response = await client.chat.completions.create({
    model: "gpt-5.5", // Or another vision-capable model via AvalAI
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What's in this image?" },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
              // Optional: specify detail level
              // detail: "high"
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
}
main();

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

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


### Using Responses API

Analyze the content of a local image by encoding it in Base64 with the responses endpoint:

```language-selector
python=:# Python Example using AvalAI with Base64 Image
import base64
from openai import OpenAI

client = OpenAI(
    api_key="AVALAI_API_KEY",  # Replace with your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # Use AvalAI base URL
)


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
image_path = "path/to/your/image.jpg"  # Update this path

# Getting the Base64 string
base64_image = encode_image(image_path)

response = client.responses.create(
    model="gpt-5.5",  # Or another vision-capable model via AvalAI
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "What's in this image?"},
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",  # Adjust mime type if needed (e.g., image/png)
                    # Optional: specify detail level
                    # "detail": "high"
                },
            ],
        }
    ],
)

# Access the generated text (may vary based on SDK version)
if hasattr(response, "output_text"):
    print(response.output_text)
else:
    # Manual parsing logic...
    pass

javascript=:// JavaScript Example using AvalAI with Base64 Image
import fs from "fs";
import path from "path"; // Recommended for handling paths
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  const imagePath = "path/to/your/image.jpg"; // Update this path
  const base64Image = fs.readFileSync(imagePath, "base64");
  const mimeType = "image/jpeg"; // Adjust if using PNG, GIF, etc.

  const response = await client.responses.create({
    model: "gpt-5.5", // Or another vision-capable model via AvalAI
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "What's in this image?" },
          {
            type: "input_image",
            image_url: `data:${mimeType};base64,${base64Image}`,
            // Optional: specify detail level
            // detail: "high"
          },
        ],
      },
    ],
  });

  // Access the generated text (may vary based on SDK version)
  if (response.output_text) {
    console.log(response.output_text);
  } else {
    // Manual parsing logic...
  }
}
main();

```

## Image Input Requirements

Input images must meet the following requirements:

- **File Types:** PNG (.png), JPEG (.jpeg, .jpg), WEBP (.webp), non-animated GIF (.gif)
- **Size Limit:** Up to 20MB per image.
- **Resolution Limits for Detail:**
  - `low`: 512px x 512px input.
  - `high`: Image is scaled to fit within 2048px x 2048px, then the shortest side is scaled to 768px. Detailed 512px crops are analyzed.
- **Content Restrictions:** No watermarks, logos, excessive text, or NSFW content. Image must be clear enough for human understanding.

## Specifying Image Detail Level

Use the `detail` parameter within the `input_image` object to control processing detail:

- `"detail": "low"`: (Cost: 85 tokens) Processes a 512px x 512px version. Suitable when high detail isn't needed. Saves tokens and improves speed.
- `"detail": "high"`: Processes the low-res version (85 tokens) plus detailed 512px square crops (170 tokens each). Use when fine details matter.
- `"detail": "auto"`: (Default) Lets the model choose the appropriate detail level.

```json
{
  "type": "input_image",
  "image_url": "...",
  "detail": "high" // Options: "low", "high", "auto"

}
```

_(Note: Token budgets mentioned are based on OpenAI's documentation and might differ slightly for specific models or future updates. Refer to AvalAI's [Pricing page](en/pricing.md) for accurate cost information)._

## Multiple Image Inputs

You can provide multiple images within the [`content`](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) array of a single `user` message. The model will consider all provided images when generating its response.

### Using Chat Completions API

```python
# Example with multiple images using Chat Completions
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What are in these images? Is there any difference?",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "URL_TO_IMAGE_1", "detail": "low"},
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "URL_TO_IMAGE_2", "detail": "low"},
                },
            ],
        }
    ],
)
print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

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


### Using Responses API

```python
# Example with multiple images using Responses
response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "What are in these images? Is there any difference?",
                },
                {"type": "input_image", "image_url": "URL_TO_IMAGE_1", "detail": "low"},
                {"type": "input_image", "image_url": "URL_TO_IMAGE_2", "detail": "low"},
            ],
        }
    ],
)
# print(response.output_text)
```

## Limitations

Be aware of the following limitations when using vision capabilities:

- **Medical Imagery:** Not suitable for interpreting specialized medical images (CT, MRI) or for medical diagnosis.
- **Non-Latin Alphabets:** Performance may degrade on images containing text in scripts like Japanese, Korean, etc.
- **Small Text:** Enlarge text for better readability, but avoid cropping crucial context.
- **Rotation:** Rotated/upside-down text and images might be misinterpreted.
- **Visual Elements:** Difficulty understanding complex graphs or styling variations (e.g., dashed vs. dotted lines).
- **Spatial Reasoning:** Limited accuracy for tasks requiring precise spatial localization (e.g., chess positions).
- **Accuracy:** May occasionally generate incorrect descriptions or captions.
- **Image Shape:** Struggles with panoramic and fisheye images.
- **Metadata:** Does not process original filenames or EXIF metadata.
- **Resizing:** Images are resized before analysis, potentially losing original dimension information.
- **Counting:** Object counts may be approximate.
- **CAPTCHAs:** Blocked for safety reasons.

## Gemini-Specific Image Capabilities

Google's current Gemini models, including `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-pro`, and `gemini-2.5-flash`, provide several advanced image understanding capabilities through AvalAI:

### Object Detection with Bounding Boxes

Gemini models can detect objects in images and provide their bounding box coordinates. The coordinates are returned relative to the image dimensions, scaled to [0, 1000]. You need to descale these coordinates based on your original image size.

To get bounding boxes, include a clear instruction in your prompt:

**Using Chat Completions API:**

```python
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Detect all prominent items in this image. Return bounding boxes in [ymin, xmin, ymax, xmax] format normalized to 0-1000.",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                    },
                },
            ],
        }
    ],
)
print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


**Using Responses API:**

```python
response = client.responses.create(
    model="gemini-3.1-pro-preview",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Detect all prominent items in this image. Return bounding boxes in [ymin, xmin, ymax, xmax] format normalized to 0-1000.",
                },
                {"type": "input_image", "image_url": "data:image/jpeg;base64,..."},
            ],
        }
    ],
)
```

To convert the normalized coordinates to pixel coordinates:

1. Divide each output coordinate by 1000
2. Multiply x-coordinates by the original image width
3. Multiply y-coordinates by the original image height

### Image Segmentation

Starting with Gemini 2.5 and continuing through Gemini 3.1 models, Gemini can also segment objects and provide masks of their contours. Request segmentation masks with a clear instruction:

**Using Chat Completions API:**

```python
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Give segmentation masks for the wooden items. Output a JSON list where each entry contains the bounding box, mask, and label.",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "data:image/jpeg;base64,..."},
                },
            ],
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


**Using Responses API:**

```python
response = client.responses.create(
    model="gemini-3.1-pro-preview",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Give segmentation masks for the wooden items. Output a JSON list where each entry contains the bounding box, mask, and label.",
                },
                {"type": "input_image", "image_url": "data:image/jpeg;base64,..."},
            ],
        }
    ],
)
```

### Important Notes for Gemini Models

- **Base64 Only**: When using Gemini models through AvalAI, images must be provided as base64-encoded strings. URL-based image inputs are not supported for Gemini models.
- **File Limits**: Gemini 3.1, Gemini 2.5 Pro, 2.0 Flash, 1.5 Pro, and 1.5 Flash support a maximum of 3,600 image files per request.
- **Supported Formats**: PNG, JPEG, WEBP, HEIC, and HEIF formats are supported.

### Token Calculation for Gemini Models

Token calculation varies by Gemini model:

- **Gemini 3.1 / 2.5 Flash**: 258 tokens if both dimensions ≤ 384 pixels. Larger images are tiled into 768x768 pixel tiles, each costing 258 tokens.

## Gemini Robotics-ER: Vision for Physical Robotics

The [`gemini-robotics-er-1.5-preview`](en/providers/google.md#gemini-robotics-er-15-preview) model is Google's first vision-language model specifically designed for robotics applications. It excels at understanding physical scenes, spatial relationships, and generating actionable robot commands from visual input.

### Key Capabilities

- **Object Detection with Coordinates**: Returns precise 2D points [y, x] and bounding boxes [ymin, xmin, ymax, xmax] in normalized coordinates (0-1000)
- **Spatial Reasoning**: Understands object relationships and scene context
- **Trajectory Planning**: Generates waypoint paths for robot movement
- **Task Orchestration**: Breaks down natural language commands into executable subtasks

### Quick Example

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

response = client.chat.completions.create(
    model="gemini-robotics-er-1.5-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Point to the red cup"},
                {
                    "type": "image_url",
                    "image_url": {"url": "data:image/jpeg;base64,..."},
                },
            ],
        }
    ],
)

# Response includes normalized coordinates:
# "The red cup is at point [450, 620]"
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-robotics-er-1.5-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### When to Use Robotics-ER

- **Physical robot control** requiring precise spatial understanding
- **Object localization** with normalized coordinate outputs
- **Multi-step task planning** for robotic manipulators
- **Scene understanding** for navigation and safety monitoring

For a comprehensive guide on using this model including trajectory planning, spatial reasoning, and advanced robotics applications, see the full tutorial: [AI in Robotics with Gemini Robotics-ER](en/examples/ai_robotics_with_gemini_er.md).

## Calculating Costs

Image inputs are charged based on tokens, determined by size and the `detail` parameter.

- **`"detail": "low"`:** Fixed cost (e.g., 85 tokens for some models).
- **`"detail": "high"`:**

1. Image scaled to fit within 2048px x 2048px (maintaining aspect ratio).
2. Further scaled so the shortest side is 768px.
3. Image divided into 512px tiles; each tile costs tokens (e.g., 170 tokens).
4. A base cost is added (e.g., 85 tokens).

**Example (based on OpenAI calculation):**

- A 1024x1024 image (`high` detail): Scaled to 768x768 -> 4 tiles. Cost = (170 \* 4) + 85 = 765 tokens.
- A 2048x4096 image (`high` detail): Scaled to 1024x2048 -> 768x1536 -> 6 tiles. Cost = (170 \* 6) + 85 = 1105 tokens.

_(Refer to AvalAI's [Pricing page](en/pricing.md) for specific token costs for models available through AvalAI)._
