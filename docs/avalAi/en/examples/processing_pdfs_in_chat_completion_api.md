# Processing PDFs with AvalAI API

## Introduction

The AvalAI API provides powerful capabilities for processing PDF documents using advanced language models. This guide demonstrates how to leverage Anthropic (Claude) and Gemini models through AvalAI's OpenAI Compatible API to analyze, extract information, and interact with PDF files. These capabilities enable applications to understand both textual and visual content within documents, making them ideal for document analysis, information extraction, and automated document processing workflows.

## Key Features

- **Text and image understanding** - Process both textual and visual content within PDFs
- **Chart and table analysis** - Extract and interpret data from charts, tables, and diagrams
- **Document summarization** - Generate concise summaries of document content
- **Information extraction** - Pull specific information from documents into structured formats
- **Question answering** - Ask questions about document content and receive accurate answers
- **Unified API access** - Access multiple model providers through a consistent OpenAI-compatible interface

## Available Models

The following models support PDF processing through the AvalAI API:

### Anthropic (Claude) Models

- **claude-opus-4-7** - Most Advanced model with strong document understanding capabilities
- **claude-sonnet-4-6** - Latest Sonnet version with improved document processing
- **claude-haiku-4-5** - More efficient model for document processing

### Gemini Models

- **gemini-3.1-pro-preview** - Most Advanced model with improved data understanding
- **gemini-3.5-flash** - Fast multimodal model for data processing
- **gemini-2.5-pro** - Advanced model with improved data understanding
- **gemini-2.5-flash** - efficient model for data processing

In addition to PDFs, Gemini models can also process the following file types directly using base64 encoding:
- PDF - `application/pdf`
- JavaScript - `application/x-javascript`, `text/javascript`
- Python - `application/x-python`, `text/x-python`
- TXT - `text/plain`
- HTML - `text/html`
- CSS - `text/css`
- Markdown - `text/md`
- CSV - `text/csv`
- XML - `text/xml`
- RTF - `text/rtf`

> **Important Note**: Anthropic (Claude) models support both URL-based and base64-encoded PDF processing, while Gemini models only support the base64-encoded approach.

## Basic Usage

There are two primary methods for processing PDFs with the AvalAI API:

1. **URL-based approach**: Referencing a PDF hosted online
2. **Base64-encoded approach**: Sending the PDF file directly as encoded data

### URL-based PDF Processing

> **Attention**: Anthropic (Claude) models support both URL-based and base64-encoded PDF processing, while Gemini models only support the base64-encoded approach.

This approach allows you to reference a PDF document directly from a URL:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "claude-sonnet-4-6",
 "messages": [{
 "role": "user",
 "content": [
 {"type": "text", "text": "What is this document about?"},
 {
 "type": "file",
 "file": {
 "file_id": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
 }
 }
 ]
 }]
}'

python=:from openai import OpenAI

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# PDF URL
file_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

# Create the request with the URL-based file reference
file_content = [
    {"type": "text", "text": "What is this document about?"},
    {
        "type": "file",
        "file": {
            "file_id": file_url,
        },
    },
]

# Send the request to the model
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// PDF URL
const fileUrl =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Create the request with the URL-based file reference
const fileContent = [
  { type: "text", text: "What is this document about?" },
  {
    type: "file",
    file: {
      file_id: fileUrl,
    },
  },
];

// Send the request to the model
const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [{ role: "user", content: fileContent }],
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

	// PDF URL
	fileUrl := "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

	// Create the request with the URL-based file reference
	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "What is this document about?",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileID: fileUrl,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

// Initialize the client with AvalAI API
$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// PDF URL
$fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Create the request with the URL-based file reference
$fileContent = [
 [
 "type" => "text",
 "text" => "What is this document about?"
 ],
 [
 "type" => "file",
 "file" => [
 "file_id" => $fileUrl
 ]
 ]
];

// Send the request to the model
$completion = $client->chat()->create([
 'model' => 'claude-sonnet-4-6',
 'messages' => [
 [
 'role' => 'user',
 'content' => $fileContent
 ]
 ]
]);

echo $completion->choices[0]->message->content;

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

### Base64-encoded PDF Processing

For cases where you need to send PDFs directly from your local system or when a URL isn't available, you can use base64 encoding:

```language-selector
bash=:# First, encode the PDF file to base64
BASE64_PDF=$(base64 -i /path/to/your/document.pdf | tr -d '\n')

# Then send the API request with the base64-encoded PDF
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "claude-sonnet-4-6",
 "messages": [{
 "role": "user",
 "content": [
 {"type": "text", "text": "What is this document about?"},
 {
 "type": "file",
 "file": {
 "file_data": "data:application/pdf;base64,'$BASE64_PDF'"
 }
 }
 ]
 }]
}'

python=:from openai import OpenAI
import base64
import requests

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Method 1: From a URL
pdf_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
response = requests.get(pdf_url)
file_data = response.content

# Method 2: From a local file
# with open("path/to/your/document.pdf", "rb") as f:
# 	file_data = f.read()

# Encode the PDF data to base64
encoded_file = base64.b64encode(file_data).decode("utf-8")
base64_url = f"data:application/pdf;base64,{encoded_file}"

# Create the request with the base64-encoded file
file_content = [
    {"type": "text", "text": "What is this document about?"},
    {
        "type": "file",
        "file": {
            "file_data": base64_url,
        },
    },
]

# Send the request to the model
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import axios from "axios";
import fs from "fs";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to get base64 encoded PDF
async function getBase64PDF() {
  // Method 1: From a URL
  const pdfUrl =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);

  // Method 2: From a local file
  // const buffer = fs.readFileSync("path/to/your/document.pdf");

  return `data:application/pdf;base64,${buffer.toString("base64")}`;
}

// Main function
async function processPDF() {
  const base64Pdf = await getBase64PDF();

  // Create the request with the base64-encoded file
  const fileContent = [
    { type: "text", text: "What is this document about?" },
    {
      type: "file",
      file: {
        file_data: base64Pdf,
      },
    },
  ];

  // Send the request to the model
  const response = await client.chat.completions.create({
    model: "claude-sonnet-4-6",
    messages: [{ role: "user", content: fileContent }],
  });

  console.log(response.choices[0].message.content);
}

processPDF();

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	openai "github.com/openai/openai-go"
	"io/ioutil"
	"net/http"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Get PDF data
	pdfData, err := getPDFData()
	if err != nil {
		fmt.Printf("Error getting PDF data: %v\n", err)
		return
	}

	// Encode the PDF data to base64
	encodedFile := base64.StdEncoding.EncodeToString(pdfData)
	base64URL := fmt.Sprintf("data:application/pdf;base64,%s", encodedFile)

	// Create the request with the base64-encoded file
	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "What is this document about?",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileData: base64URL,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

// Function to get PDF data either from URL or local file
func getPDFData() ([]byte, error) {
	// Method 1: From a URL
	pdfURL := "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
	resp, err := http.Get(pdfURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return ioutil.ReadAll(resp.Body)

	// Method 2: From a local file
	// return ioutil.ReadFile("path/to/your/document.pdf")
}

php=:<?php

require 'vendor/autoload.php';

// Initialize the client with AvalAI API
$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Function to get base64 encoded PDF
function getBase64PDF() {
 // Method 1: From a URL
 $pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
 $fileData = file_get_contents($pdfUrl);
 
 // Method 2: From a local file
 // $fileData = file_get_contents("path/to/your/document.pdf");
 
 return "data:application/pdf;base64," . base64_encode($fileData);
}

// Get the base64 encoded PDF
$base64Pdf = getBase64PDF();

// Create the request with the base64-encoded file
$fileContent = [
 [
 "type" => "text",
 "text" => "What is this document about?"
 ],
 [
 "type" => "file",
 "file" => [
 "file_data" => $base64Pdf
 ]
 ]
];

// Send the request to the model
$completion = $client->chat()->create([
 'model' => 'claude-sonnet-4-6',
 'messages' => [
 [
 'role' => 'user',
 'content' => $fileContent
 ]
 ]
]);

echo $completion->choices[0]->message->content;

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

## Specifying Format

You can explicitly specify the format of the document to ensure proper processing:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "claude-sonnet-4-6",
 "messages": [{
 "role": "user",
 "content": [
 {"type": "text", "text": "What is this document about?"},
 {
 "type": "file",
 "file": {
 "file_id": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
 "format": "application/pdf"
 }
 }
 ]
 }]
}'

python=:from openai import OpenAI

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# PDF URL
file_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

# Create the request with format specification
file_content = [
    {"type": "text", "text": "What is this document about?"},
    {"type": "file", "file": {"file_id": file_url, "format": "application/pdf"}},
]

# Send the request to the model
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// PDF URL
const fileUrl =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Create the request with format specification
const fileContent = [
  { type: "text", text: "What is this document about?" },
  {
    type: "file",
    file: {
      file_id: fileUrl,
      format: "application/pdf",
    },
  },
];

// Send the request to the model
const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [{ role: "user", content: fileContent }],
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

	// PDF URL
	fileUrl := "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

	// Create the request with format specification
	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "What is this document about?",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileID: fileUrl,
				Format: "application/pdf",
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

// Initialize the client with AvalAI API
$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// PDF URL
$fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Create the request with format specification
$fileContent = [
 [
 "type" => "text",
 "text" => "What is this document about?"
 ],
 [
 "type" => "file",
 "file" => [
 "file_id" => $fileUrl,
 "format" => "application/pdf"
 ]
 ]
];

// Send the request to the model
$completion = $client->chat()->create([
 'model' => 'claude-sonnet-4-6',
 'messages' => [
 [
 'role' => 'user',
 'content' => $fileContent
 ]
 ]
]);

echo $completion->choices[0]->message->content;

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


## Model-Specific Limitations

### Anthropic (Claude) Models

- **Maximum file size**: 32MB per request
- **Maximum pages**: 100 pages per document
- **Format requirements**: Standard PDF (no passwords/encryption)
- **Token usage**: Typically 1,500-3,000 tokens per page depending on content density
- **Visual elements**: Can analyze charts, tables, and diagrams within PDFs
- **Best suited for**: Detailed document analysis, complex document understanding tasks

### Gemini Models

- **Maximum file size**: 20MB for direct uploads (up to 50MB using File API)
- **Maximum pages**: Up to 1,000 pages per document
- **Format requirements**: Standard PDF (no passwords/encryption)
- **Token usage**: Approximately 258 tokens per page
- **Visual elements**: Strong capabilities for analyzing visual content in documents
- **Best suited for**: Large document processing, visual content analysis

## Use Cases

### Document Summarization

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "claude-sonnet-4-6",
 "messages": [{
 "role": "user",
 "content": [
 {"type": "text", "text": "Provide a concise summary of this document."},
 {
 "type": "file",
 "file": {
 "file_id": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
 }
 }
 ]
 }]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

file_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

file_content = [
    {"type": "text", "text": "Provide a concise summary of this document."},
    {
        "type": "file",
        "file": {
            "file_id": file_url,
        },
    },
]

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const fileUrl =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const fileContent = [
  { type: "text", text: "Provide a concise summary of this document." },
  {
    type: "file",
    file: {
      file_id: fileUrl,
    },
  },
];

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [{ role: "user", content: fileContent }],
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

	fileUrl := "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "Provide a concise summary of this document.",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileID: fileUrl,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

$fileContent = [
 [
 "type" => "text",
 "text" => "Provide a concise summary of this document."
 ],
 [
 "type" => "file",
 "file" => [
 "file_id" => $fileUrl
 ]
 ]
];

$completion = $client->chat()->create([
 'model' => 'claude-sonnet-4-6',
 'messages' => [
 [
 'role' => 'user',
 'content' => $fileContent
 ]
 ]
]);

echo $completion->choices[0]->message->content;

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


### Information Extraction

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "claude-sonnet-4-6",
 "messages": [{
 "role": "user",
 "content": [
 {"type": "text", "text": "Extract all dates mentioned in this document and list them in chronological order."},
 {
 "type": "file",
 "file": {
 "file_id": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
 }
 }
 ]
 }]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

file_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

file_content = [
    {
        "type": "text",
        "text": "Extract all dates mentioned in this document and list them in chronological order.",
    },
    {
        "type": "file",
        "file": {
            "file_id": file_url,
        },
    },
]

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const fileUrl =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const fileContent = [
  {
    type: "text",
    text: "Extract all dates mentioned in this document and list them in chronological order.",
  },
  {
    type: "file",
    file: {
      file_id: fileUrl,
    },
  },
];

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [{ role: "user", content: fileContent }],
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

	fileUrl := "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "Extract all dates mentioned in this document and list them in chronological order.",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileID: fileUrl,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

$fileContent = [
 [
 "type" => "text",
 "text" => "Extract all dates mentioned in this document and list them in chronological order."
 ],
 [
 "type" => "file",
 "file" => [
 "file_id" => $fileUrl
 ]
 ]
];

$completion = $client->chat()->create([
 'model' => 'claude-sonnet-4-6',
 'messages' => [
 [
 'role' => 'user',
 'content' => $fileContent
 ]
 ]
]);

echo $completion->choices[0]->message->content;

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

## Troubleshooting

### Common Issues

- **File too large**: If you encounter errors related to file size, try reducing the PDF size or splitting it into smaller documents.
- **Format not recognized**: Ensure you're specifying the correct format (`application/pdf`) when sending the document.
- **Parsing errors**: Some PDFs with complex formatting or scanned content may not process correctly. Try using higher-quality PDFs with proper text encoding.
- **Token limits**: If your document exceeds the model's token limit, consider processing it in chunks or summarizing sections separately.

### Performance Optimization

- **Place text prompts after the PDF**: For best results, place your text prompt after the PDF in your request.
- **Use URL-based approach for larger files**: The URL-based approach is generally more efficient for larger files.
- **Specify clear instructions**: Be specific in your prompts about what information you want to extract from the document.
- **Use lower temperature**: For factual extraction tasks, setting a lower temperature (e.g., 0.2) can improve accuracy.

## Best Practices

1. **Pre-check file compatibility**: Ensure your PDF is not password-protected and is properly formatted.
2. **Verify model support**: Check if your chosen model supports PDF processing before sending requests.
3. **Structure your prompts**: Be specific about what you want the model to do with the document.
4. **Handle large documents appropriately**: Split large documents into logical sections if they exceed page limits.
5. **Consider token usage**: Be aware of the token usage implications, especially for large documents.

## Related Links

- [Chat Completions API Reference](en/api-reference/chat.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Rate Limits](en/guides/rate-limits.md)
- [PDF Files Guide](en/guides/pdf-files.md)
