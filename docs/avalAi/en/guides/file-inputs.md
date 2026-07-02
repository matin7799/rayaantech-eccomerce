# File Inputs

Learn how to provide files as inputs to AvalAI API endpoints using URLs, Base64 encoding, or file IDs from the Files API.

## Overview

AvalAI API supports three methods for providing file inputs to various endpoints:

1. **URL** - Provide a direct link to a publicly accessible file
2. **Base64** - Encode file content as a Base64 string
3. **File ID** - Upload files to the [`v1/files`](en/api-reference/files.md) endpoint first, then reference by ID

> **📁 Files API Now Available**: AvalAI's Files API (`v1/files`) is now in beta! Upload files once, reference them by `file_id` in multiple requests. All operations are **FREE** until **March 1, 2026**. See the [Files API Reference](en/api-reference/files.md) for complete documentation.

Each method has its advantages depending on your use case:

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| URL | Publicly accessible files | Simple, no encoding needed | Requires public URL |
| Base64 | Local files, private content | Works with any file | Increases request size |
| File ID | Large files, reusable content | Clean requests, reusable | Requires upload step |

## Supported Endpoints

Inline files are supported across multiple AvalAI API endpoints:

- [`v1/chat/completions`](en/api-reference/chat.md) - Main chat API for OpenAI, Anthropic, Gemini models
- [`v1/messages`](en/api-reference/messages.md) - Anthropic Messages API
- [`v1/responses`](en/api-reference/responses.md) - OpenAI Responses API
- [`v1/ocr`](en/api-reference/ocr.md) - Mistral OCR API

## File Size Limits

Different models and providers have varying limits for inline file data:

| Provider/Model | Max Inline File Size | Notes |
|----------------|---------------------|-------|
| **Gemini models** | 20MB | Total for all inline data in the request |
| **Mistral OCR** | 50MB | Per document, up to 1,000 pages |
| **OpenAI models** | 20MB | Per request |
| **Anthropic (Claude)** | 32MB | Per request |
| **Other models** | 20MB | Default limit |

> **Note**: These limits may differ from official provider limits. If you need higher limits or have specific requirements, contact our support team at [t.me/AvalAISupport](https://t.me/AvalAISupport).

## Supported File Types

### Images
- JPEG (`.jpg`, `.jpeg`) - `image/jpeg`
- PNG (`.png`) - `image/png`
- GIF (`.gif`) - `image/gif` (non-animated, single frame only)
- WebP (`.webp`) - `image/webp`

### Documents
- PDF (`.pdf`) - `application/pdf`

### Audio
- MP3 (`.mp3`) - `audio/mp3` or `audio/mpeg`
- WAV (`.wav`) - `audio/wav`
- M4A (`.m4a`) - `audio/m4a`
- FLAC (`.flac`) - `audio/flac`

### Spreadsheets
- Excel (`.xlsx`) - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Excel Legacy (`.xls`) - `application/vnd.ms-excel`

## Method 1: URL-based Files

The simplest method for publicly accessible files is to provide a direct URL.

### Image URL in Chat Completions

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/sample-image.jpg"
          }
        }
      ]
    }
  ]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/sample-image.jpg"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this image?" },
        {
          type: "image_url",
          image_url: { url: "https://example.com/sample-image.jpg" },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "What is in this image?",
						},
						{
							Type: "image_url",
							ImageURL: &openai.ImageURL{
								URL: "https://example.com/sample-image.jpg",
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$response = $client->chat()->create([
    'model' => 'gpt-5.5',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'What is in this image?'],
                [
                    'type' => 'image_url',
                    'image_url' => ['url' => 'https://example.com/sample-image.jpg']
                ]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

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


### PDF URL in Chat Completions

For Anthropic (Claude) models, you can provide PDFs via URL:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "claude-sonnet-4-6",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is this document about?"
        },
        {
          "type": "file",
          "file": {
            "file_id": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          }
        }
      ]
    }
  ]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# PDF URL
file_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is this document about?"},
                {"type": "file", "file": {"file_id": file_url}},
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is this document about?" },
        { type: "file", file: { file_id: fileUrl } },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	fileURL := "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "What is this document about?",
						},
						{
							Type: "file",
							File: &openai.ChatMessageFile{
								FileID: fileURL,
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

$response = $client->chat()->create([
    'model' => 'claude-sonnet-4-6',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'What is this document about?'],
                ['type' => 'file', 'file' => ['file_id' => $fileUrl]]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `claude-sonnet-4-6` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
                {"type": "input_text", "text": "Summarize the uploaded file."},
                {"type": "input_file", "file_id": "file_abc123"},
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
        { type: "input_text", text: "Summarize the uploaded file." },
        { type: "input_file", file_id: "file_abc123" },
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
            "text": "Summarize the uploaded file."
          },
          {
            "type": "input_file",
            "file_id": "file_abc123"
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


### Document URL in OCR API

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770"
  },
  "include_image_base64": true
}' -o ocr_output.json

python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="your-avalai-api-key")

document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=list(range(0, 100)),  # Process up to 100 pages
)

print(ocr_response)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "your-avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: Array.from({ length: 100 }, (_, i) => i),
});

console.log(ocrResponse);

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	apiKey := "your-avalai-api-key"

	requestBody := map[string]interface{}{
		"model": "mistral-ocr-latest",
		"document": map[string]string{
			"type":         "document_url",
			"document_url": "https://arxiv.org/pdf/1805.04770",
		},
		"include_image_base64": true,
	}

	jsonBody, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", "https://api.avalai.ir/v1/ocr", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');

$data = [
    'model' => 'mistral-ocr-latest',
    'document' => [
        'type' => 'document_url',
        'document_url' => 'https://arxiv.org/pdf/1805.04770'
    ],
    'include_image_base64' => true
];

$ch = curl_init('https://api.avalai.ir/v1/ocr');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;

```

## Method 2: Base64-encoded Files

For local files or private content, encode the file as Base64 and include it in the request.

### Data URL Format

Base64-encoded files use the data URL format:

```
data:{mime_type};base64,{encoded_data}
```

For example:
- Image: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
- PDF: `data:application/pdf;base64,JVBERi0xLjQK...`
- Audio: `data:audio/mp3;base64,SUQzAwAAAAA...`

### Image with Base64 in Chat Completions

```language-selector
bash=:# Encode image to base64
IMAGE_BASE64=$(base64 -i image.jpg | tr -d '\n') # Use -w 0 on Linux

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,'"$IMAGE_BASE64"'"
          }
        }
      ]
    }
  ]
}'

python=:import base64
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Read and encode the image
with open("image.jpg", "rb") as image_file:
    image_data = image_file.read()

base64_image = base64.b64encode(image_data).decode("utf-8")

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Read and encode the image
const imageData = fs.readFileSync("image.jpg");
const base64Image = imageData.toString("base64");

const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this image?" },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Read and encode the image
	imageData, err := ioutil.ReadFile("image.jpg")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64Image := base64.StdEncoding.EncodeToString(imageData)
	dataURL := "data:image/jpeg;base64," + base64Image

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "What is in this image?",
						},
						{
							Type: "image_url",
							ImageURL: &openai.ImageURL{
								URL: dataURL,
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Read and encode the image
$imageData = file_get_contents('image.jpg');
$base64Image = base64_encode($imageData);

$response = $client->chat()->create([
    'model' => 'gpt-5.5',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'What is in this image?'],
                [
                    'type' => 'image_url',
                    'image_url' => ['url' => 'data:image/jpeg;base64,' . $base64Image]
                ]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

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


### PDF with Base64 in Chat Completions

```language-selector
bash=:# Encode PDF to base64
PDF_BASE64=$(base64 -i document.pdf | tr -d '\n') # Use -w 0 on Linux

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Summarize this document"
        },
        {
          "type": "file",
          "file": {
            "file_data": "data:application/pdf;base64,'"$PDF_BASE64"'"
          }
        }
      ]
    }
  ]
}'

python=:import base64
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Read and encode the PDF
with open("document.pdf", "rb") as pdf_file:
    pdf_data = pdf_file.read()

base64_pdf = base64.b64encode(pdf_data).decode("utf-8")

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Summarize this document"},
                {
                    "type": "file",
                    "file": {"file_data": f"data:application/pdf;base64,{base64_pdf}"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Read and encode the PDF
const pdfData = fs.readFileSync("document.pdf");
const base64Pdf = pdfData.toString("base64");

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Summarize this document" },
        {
          type: "file",
          file: { file_data: `data:application/pdf;base64,${base64Pdf}` },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Read and encode the PDF
	pdfData, err := ioutil.ReadFile("document.pdf")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64Pdf := base64.StdEncoding.EncodeToString(pdfData)
	dataURL := "data:application/pdf;base64," + base64Pdf

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "Summarize this document",
						},
						{
							Type: "file",
							File: &openai.ChatMessageFile{
								FileData: dataURL,
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Read and encode the PDF
$pdfData = file_get_contents('document.pdf');
$base64Pdf = base64_encode($pdfData);

$response = $client->chat()->create([
    'model' => 'gemini-2.5-flash',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'Summarize this document'],
                [
                    'type' => 'file',
                    'file' => ['file_data' => 'data:application/pdf;base64,' . $base64Pdf]
                ]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
                {"type": "input_text", "text": "Summarize the uploaded file."},
                {"type": "input_file", "file_id": "file_abc123"},
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
        { type: "input_text", text: "Summarize the uploaded file." },
        { type: "input_file", file_id: "file_abc123" },
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
            "text": "Summarize the uploaded file."
          },
          {
            "type": "input_file",
            "file_id": "file_abc123"
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


### Audio with Base64 in Chat Completions

```language-selector
bash=:# Encode audio to base64
AUDIO_BASE64=$(base64 -i audio.mp3 | tr -d '\n')

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Transcribe this audio"
        },
        {
          "type": "file",
          "file": {
            "file_data": "data:audio/mp3;base64,'"$AUDIO_BASE64"'"
          }
        }
      ]
    }
  ]
}'

python=:import base64
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Read and encode the audio
with open("audio.mp3", "rb") as audio_file:
    audio_data = audio_file.read()

base64_audio = base64.b64encode(audio_data).decode("utf-8")

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Transcribe this audio"},
                {
                    "type": "file",
                    "file": {"file_data": f"data:audio/mp3;base64,{base64_audio}"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Read and encode the audio
const audioData = fs.readFileSync("audio.mp3");
const base64Audio = audioData.toString("base64");

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Transcribe this audio" },
        {
          type: "file",
          file: { file_data: `data:audio/mp3;base64,${base64Audio}` },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Read and encode the audio
	audioData, err := ioutil.ReadFile("audio.mp3")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64Audio := base64.StdEncoding.EncodeToString(audioData)
	dataURL := "data:audio/mp3;base64," + base64Audio

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "Transcribe this audio",
						},
						{
							Type: "file",
							File: &openai.ChatMessageFile{
								FileData: dataURL,
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Read and encode the audio
$audioData = file_get_contents('audio.mp3');
$base64Audio = base64_encode($audioData);

$response = $client->chat()->create([
    'model' => 'gemini-2.5-flash',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'Transcribe this audio'],
                [
                    'type' => 'file',
                    'file' => ['file_data' => 'data:audio/mp3;base64,' . $base64Audio]
                ]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the audio input.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Summarize the audio input.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize the audio input.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Excel with Base64 in Chat Completions

```language-selector
bash=:# Encode Excel file to base64
EXCEL_BASE64=$(base64 -i spreadsheet.xlsx | tr -d '\n')

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this spreadsheet and provide key insights"
        },
        {
          "type": "file",
          "file": {
            "file_data": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'"$EXCEL_BASE64"'"
          }
        }
      ]
    }
  ]
}'

python=:import base64
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Read and encode the Excel file
with open("spreadsheet.xlsx", "rb") as excel_file:
    excel_data = excel_file.read()

base64_excel = base64.b64encode(excel_data).decode("utf-8")
mime_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analyze this spreadsheet and provide key insights",
                },
                {
                    "type": "file",
                    "file": {"file_data": f"data:{mime_type};base64,{base64_excel}"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Read and encode the Excel file
const excelData = fs.readFileSync("spreadsheet.xlsx");
const base64Excel = excelData.toString("base64");
const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Analyze this spreadsheet and provide key insights" },
        {
          type: "file",
          file: { file_data: `data:${mimeType};base64,${base64Excel}` },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Read and encode the Excel file
	excelData, err := ioutil.ReadFile("spreadsheet.xlsx")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64Excel := base64.StdEncoding.EncodeToString(excelData)
	mimeType := "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	dataURL := fmt.Sprintf("data:%s;base64,%s", mimeType, base64Excel)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "Analyze this spreadsheet and provide key insights",
						},
						{
							Type: "file",
							File: &openai.ChatMessageFile{
								FileData: dataURL,
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Read and encode the Excel file
$excelData = file_get_contents('spreadsheet.xlsx');
$base64Excel = base64_encode($excelData);
$mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

$response = $client->chat()->create([
    'model' => 'gpt-5.5',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'Analyze this spreadsheet and provide key insights'],
                [
                    'type' => 'file',
                    'file' => ['file_data' => 'data:' . $mimeType . ';base64,' . $base64Excel]
                ]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

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
                {"type": "input_text", "text": "Summarize the uploaded file."},
                {"type": "input_file", "file_id": "file_abc123"},
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
        { type: "input_text", text: "Summarize the uploaded file." },
        { type: "input_file", file_id: "file_abc123" },
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
            "text": "Summarize the uploaded file."
          },
          {
            "type": "input_file",
            "file_id": "file_abc123"
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


## Method 3: Using the Files API (v1/files)

For large files or when you need to reuse files across multiple requests, upload them first to the [`v1/files`](en/api-reference/files.md) endpoint and reference them by ID.

> **🎉 FREE Beta**: The Files API is completely free during the beta period (**January 1, 2026 - March 1, 2026**). See the [Files API Reference](en/api-reference/files.md) for complete documentation, including rate limits, storage limits, and supported file purposes.

### Why Use the Files API?

1. **Avoid repeated large file transfers** - Upload once, reference by `file_id`
2. **Improved performance** - Files stored server-side, faster API calls
3. **Reduced network overhead** - No Base64 encoding overhead on each request
4. **Reusable across endpoints** - Works with `v1/chat/completions`, `v1/responses`, `v1/messages`, `v1/ocr`, `v1/images/edits`

### Upload a File

### Upload a File

```language-selector
bash=:curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="user_data" \
  -F file="@document.pdf"

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Upload the file
file = client.files.create(file=open("document.pdf", "rb"), purpose="user_data")

print(f"File uploaded with ID: {file.id}")

javascript=:import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Upload the file
const file = await client.files.create({
  file: fs.createReadStream("document.pdf"),
  purpose: "user_data",
});

console.log(`File uploaded with ID: ${file.id}`);

go=:package main

import (
	"context"
	"fmt"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Upload file
	fileReq := openai.FileRequest{
		FilePath: "document.pdf",
		Purpose:  "user_data",
	}
	file, err := client.CreateFile(context.Background(), fileReq)
	if err != nil {
		fmt.Printf("File upload error: %v\n", err)
		return
	}
	fmt.Printf("File uploaded with ID: %s\n", file.ID)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

// Upload file
$file = $client->files()->create([
    'purpose' => 'user_data',
    'file' => fopen('document.pdf', 'r'),
]);

echo "File uploaded with ID: " . $file->id . "\n";

```

### Use File ID in Chat Completions

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Summarize this document"
        },
        {
          "type": "file",
          "file": {
            "file_id": "file-abc123xyz"
          }
        }
      ]
    }
  ]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Assuming file was already uploaded with ID "file-abc123xyz"
file_id = "file-abc123xyz"

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Summarize this document"},
                {"type": "file", "file": {"file_id": file_id}},
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Assuming file was already uploaded with ID "file-abc123xyz"
const fileId = "file-abc123xyz";

const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Summarize this document" },
        { type: "file", file: { file_id: fileId } },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Assuming file was already uploaded
	fileID := "file-abc123xyz"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: "text",
							Text: "Summarize this document",
						},
						{
							Type: "file",
							File: &openai.ChatMessageFile{
								FileID: fileID,
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

// Assuming file was already uploaded
$fileId = 'file-abc123xyz';

$response = $client->chat()->create([
    'model' => 'gpt-5.5',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'Summarize this document'],
                ['type' => 'file', 'file' => ['file_id' => $fileId]]
            ]
        ]
    ]
]);

echo $response->choices[0]->message->content;

```

### Use File ID in Responses API

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_file",
          "file_id": "file-abc123xyz"
        },
        {
          "type": "input_text",
          "text": "What is the first topic in this document?"
        }
      ]
    }
  ]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

file_id = "file-abc123xyz"

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_file", "file_id": file_id},
                {
                    "type": "input_text",
                    "text": "What is the first topic in this document?",
                },
            ],
        }
    ],
)

print(response.output_text)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const fileId = "file-abc123xyz";

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_file", file_id: fileId },
        { type: "input_text", text: "What is the first topic in this document?" },
      ],
    },
  ],
});

console.log(response.output_text);

go=:package main

import (
	"context"
	"fmt"

	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	fileID := "file-abc123xyz"

	resp, err := client.CreateResponse(
		context.Background(),
		openai.ResponseRequest{
			Model: "gpt-5.5",
			Input: []openai.ResponseInput{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ResponseContent{
						{
							Type:   "input_file",
							FileID: fileID,
						},
						{
							Type: "input_text",
							Text: "What is the first topic in this document?",
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$fileId = 'file-abc123xyz';

$response = $client->responses()->create([
    'model' => 'gpt-5.5',
    'input' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'input_file', 'file_id' => $fileId],
                ['type' => 'input_text', 'text' => 'What is the first topic in this document?']
            ]
        ]
    ]
]);

echo $response->outputText;

```

## Model-Specific Considerations

### Gemini Models

- **Base64 Required**: Gemini models require Base64-encoded images; URL-based image inputs are not supported
- **Total Limit**: 20MB total for all inline file data in a single request
- **File Count**: Up to 3,600 image files per request for Gemini 2.5 Pro, 2.0 Flash, 1.5 Pro, and 1.5 Flash

### OpenAI Models

- Support both URL and Base64 methods for images
- PDF processing requires vision-capable models (e.g., `gpt-5.4`)

### Anthropic (Claude) Models

- Support both URL and Base64 methods for PDFs and images
- 32MB per request limit

### Mistral OCR

- Supports up to 50MB per document
- Can process up to 1,000 pages per document
- Supports both `document_url` and `image_url` types

## Best Practices

1. **Choose the right method**:
   - Use **URLs** for publicly accessible files to reduce request size
   - Use **Base64** for local files under size limits
   - Use **File IDs** for large files or when reusing content across requests

2. **Handle size limits**:
   - Check file size before sending
   - Compress images when possible
   - Split large documents into smaller chunks

3. **Optimize for performance**:
   - URLs may introduce latency due to network fetching
   - Base64 increases request body size by ~33%
   - File IDs are most efficient for repeated use

4. **Error handling**:
   - Validate MIME types before encoding
   - Handle encoding errors gracefully
   - Check for supported file formats per model

## Troubleshooting

### File Size Exceeded

```
Error: File size exceeds maximum allowed limit
```

**Solution**: Check the file size limits table above. Consider using the Files API for larger files or compressing the file.

### Invalid MIME Type

```
Error: Unsupported file type
```

**Solution**: Ensure you're using a supported MIME type. Double-check the file extension and encoding format.

### Base64 Encoding Issues

```
Error: Invalid base64 encoding
```

**Solution**:
- Ensure no line breaks in the base64 string (use `-w 0` on Linux or `| tr -d '\n'`)
- Verify the data URL format is correct: `data:{mime_type};base64,{data}`

### URL Not Accessible

```
Error: Unable to fetch file from URL
```

**Solution**:
- Ensure the URL is publicly accessible (no authentication required)
- Check that the URL returns the correct content type
- Verify the URL is using HTTPS

## Related Resources

- [PDF File Inputs Guide](en/guides/pdf-files.md)
- [Vision Guide](en/guides/vision.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [Chat Completions API](en/api-reference/chat.md)
- [Responses API](en/api-reference/responses.md)
- [Messages API](en/api-reference/messages.md)
- [OCR API](en/api-reference/ocr.md)
- [Processing Excel Files](en/examples/processing_excel_files_in_chat_completion_api.md)
- [Processing PDFs in Chat Completions](en/examples/processing_pdfs_in_chat_completion_api.md)
