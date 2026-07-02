# PDF File Inputs

> **Alternative Approach**: While the dedicated Files API for PDF processing is still in development, you can use the Chat Completions API to process PDFs directly. See our [PDF Processing with AvalAI API](en/examples/processing_pdfs_in_chat_completion_api.md) example for a detailed guide.

Learn how to use PDF files as inputs to the AvalAI API.

AvalAI models with vision capabilities can accept PDF files as input. Provide PDFs either as Base64-encoded data or as file IDs obtained after uploading files to the `v1/files` endpoint through the [API](en/api-reference/files.md).

## How it works

To help models understand PDF content, we put into the model's context both the extracted text and an image of each page. The model can then use both the text and the images to generate a response. This is useful, for example, if diagrams contain key information that isn't in the text.

## Uploading files

In the example below, we first upload a PDF using the [Files API](en/api-reference/files.md), then reference its file ID in an API request to the model.

### Upload a file to use in a response

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We'll announce its release through our official channels. Stay tuned for updates!

```language-selector
bash=:curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="user_data" \
  -F file="@draconomicon.pdf"

curl "https://api.avalai.ir/v1/responses" \
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
 "file_id": "file-6F2ksmvXxt4VdoqmHRw6kL" # Replace with your actual file ID
 },
 {
 "type": "input_text",
 "text": "What is the first dragon in the book?"
 }
 ]
 }
 ]
 }'

javascript=:import fs from "fs";
import OpenAI from "openai"; // The OpenAI library is commonly used

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const file = await client.files.create({
  file: fs.createReadStream("draconomicon.pdf"),
  purpose: "user_data",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          file_id: file.id,
        },
        {
          type: "input_text",
          text: "What is the first dragon in the book?",
        },
      ],
    },
  ],
});

console.log(response.output_text);

python=:from openai import OpenAI  # The OpenAI library is commonly used
import os

client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

file = client.files.create(file=open("draconomicon.pdf", "rb"), purpose="user_data")

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_id": file.id,
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?",
                },
            ],
        }
    ],
)

print(response.output_text)

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go" // The openai-go library is compatible
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	// Upload file
	fileReq := openai.FileRequest{
		FilePath: "draconomicon.pdf",
		Purpose:  "user_data",
	}
	file, err := client.CreateFile(context.Background(), fileReq)
	if err != nil {
		fmt.Printf("File upload error: %v\n", err)
		return
	}
	fmt.Printf("File uploaded with ID: %s\n", file.ID)

	// Create response using file ID
	resp, err := client.CreateResponse( // Assuming a CreateResponse method exists or adapting CreateChatCompletion
		context.Background(),
		openai.ResponseRequest{ // Assuming a ResponseRequest struct or adapting ChatCompletionRequest
			Model: "gpt-5.5",
			Input: []openai.ResponseInput{ // Assuming ResponseInput struct
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ResponseContent{ // Assuming ResponseContent struct
						{
							Type:   "input_file",
							FileID: file.ID,
						},
						{
							Type: "input_text",
							Text: "What is the first dragon in the book?",
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Response creation error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText) // Assuming OutputText field exists
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have the openai-php client installed

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, [
    'base_url' => 'https://api.avalai.ir/v1'
]);

// Upload file
$file = $client->files()->create([
    'purpose' => 'user_data',
    'file' => fopen('draconomicon.pdf', 'r'),
]);

echo "File uploaded with ID: " . $file->id . "\n";

// Create response using file ID
// Note: The exact method/structure might differ based on AvalAI's specific API implementation
//       within the openai-php client or if a dedicated AvalAI client is needed.
//       This assumes a 'responses()->create' method analogous to 'chat()->create'.
$response = $client->responses()->create([ // Adjust if necessary
    'model' => 'gpt-5.5',
    'input' => [
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'input_file',
                    'file_id' => $file->id,
                ],
                [
                    'type' => 'input_text',
                    'text' => 'What is the first dragon in the book?',
                ],
            ],
        ],
    ],
]);

echo $response->outputText; // Adjust field access if necessary

```

## Base64-encoded files

You can send PDF file inputs as Base64-encoded inputs as well.

### Base64 encode a file to use in a response

```language-selector
bash=:PDF_BASE64=$(base64 -i draconomicon.pdf) # Use -w 0 on Linux for no line breaks

curl "https://api.avalai.ir/v1/responses" \
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
 "filename": "draconomicon.pdf",
 "file_data": "data:application/pdf;base64,'"$PDF_BASE64"'"
 },
 {
 "type": "input_text",
 "text": "What is the first dragon in the book?"
 }
 ]
 }
 ]
 }'

javascript=:import fs from "fs";
import OpenAI from "openai"; // The OpenAI library is commonly used

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const data = fs.readFileSync("draconomicon.pdf");
const base64String = data.toString("base64");

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          filename: "draconomicon.pdf",
          file_data: `data:application/pdf;base64,${base64String}`,
        },
        {
          type: "input_text",
          text: "What is the first dragon in the book?",
        },
      ],
    },
  ],
});

console.log(response.output_text);

python=:import base64
from openai import OpenAI  # The OpenAI library is commonly used
import os

client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

with open("draconomicon.pdf", "rb") as f:
    data = f.read()

base64_string = base64.b64encode(data).decode("utf-8")

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "filename": "draconomicon.pdf",
                    "file_data": f"data:application/pdf;base64,{base64_string}",
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?",
                },
            ],
        },
    ],
)

print(response.output_text)

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"os"

	openai "github.com/openai/openai-go" // The openai-go library is compatible
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	// Read and encode file
	pdfBytes, err := ioutil.ReadFile("draconomicon.pdf")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64String := base64.StdEncoding.EncodeToString(pdfBytes)
	fileData := "data:application/pdf;base64," + base64String

	// Create response using base64 data
	resp, err := client.CreateResponse( // Assuming a CreateResponse method exists
		context.Background(),
		openai.ResponseRequest{ // Assuming a ResponseRequest struct
			Model: "gpt-5.5",
			Input: []openai.ResponseInput{ // Assuming ResponseInput struct
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ResponseContent{ // Assuming ResponseContent struct
						{
							Type:     "input_file",
							Filename: "draconomicon.pdf",
							FileData: fileData,
						},
						{
							Type: "input_text",
							Text: "What is the first dragon in the book?",
						},
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Response creation error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText) // Assuming OutputText field exists
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have the openai-php client installed

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, [
    'base_url' => 'https://api.avalai.ir/v1'
]);

// Read and encode file
$data = file_get_contents('draconomicon.pdf');
$base64String = base64_encode($data);
$fileData = 'data:application/pdf;base64,' . $base64String;

// Create response using base64 data
// Note: Adjust method/structure if needed based on AvalAI's API implementation.
$response = $client->responses()->create([ // Adjust if necessary
    'model' => 'gpt-5.5',
    'input' => [
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'input_file',
                    'filename' => 'draconomicon.pdf',
                    'file_data' => $fileData,
                ],
                [
                    'type' => 'input_text',
                    'text' => 'What is the first dragon in the book?',
                ],
            ],
        ],
    ],
]);

echo $response->outputText; // Adjust field access if necessary

```

## Usage considerations

Below are a few considerations to keep in mind while using PDF inputs.

**Token usage**

To help models understand PDF content, we put into the model's context both extracted text and an image of each page—regardless of whether the page includes images. Before deploying your solution at scale, ensure you understand the pricing and token usage implications of using PDFs as input. [More on pricing](en/pricing.md).

**File size limitations**

You can upload up to 100 pages and 32MB of total content in a single request to the API, across multiple file inputs.

**Supported models**

Only models that support both text and image inputs (like `gpt-5.4`) can accept PDF files as input. [Check model features here](en/models/model-details.md).

**File upload purpose**

You can upload these files to the Files API with any [purpose](en/api-reference/files.md#create-file), but we recommend using the `user_data` purpose for files you plan to use as model inputs.

## Related Resources

- [Files API Reference](en/api-reference/files.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Vision Guide](en/guides/vision.md)
- [Pricing](en/pricing.md)

## OCR Processing with Mistral OCR

AvalAI now supports the powerful mistral-ocr-latest model for advanced Optical Character Recognition (OCR) and document understanding capabilities. This model enables you to extract text and structured content from PDF documents and images while preserving formatting, structure, and hierarchy.

!> Note: Since the `v1/files` endpoint is not yet available, you can use Mistral OCR with either valid HTTP/HTTPS URLs or base64-encoded files.

### Key Features

- Extracts text content while maintaining document structure and hierarchy
- Preserves formatting like headers, paragraphs, lists and tables
- Returns results in markdown format for easy parsing and rendering
- Handles complex layouts including multi-column text and mixed content
- Processes documents at scale with high accuracy (up to 2000 pages per minute)
- Natively multilingual, capable of parsing thousands of scripts, fonts, and languages
- Outperforms other leading OCR models in benchmark tests

### OCR with PDF URL

You can process a PDF document by providing its URL:

```language-selector
python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

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
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: Array.from({ length: 100 }, (_, i) => i), // Process up to 100 pages
});

console.log(ocrResponse);

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

```

### OCR with Base64-encoded PDF

Since the `v1/files` endpoint is not yet available, you can use base64 encoding to process PDF files directly:

```language-selector
python=:import base64
from mistralai import Mistral

# Read and encode the PDF file
with open("document.pdf", "rb") as f:
    pdf_data = f.read()

base64_pdf = base64.b64encode(pdf_data).decode("utf-8")
document_url = f"data:application/pdf;base64,{base64_pdf}"

# Process the encoded PDF
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {"type": "document_url", "document_url": document_url}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=list(range(0, 100)),  # Process up to 100 pages
)

print(ocr_response)

javascript=:import fs from "fs";
import { Mistral } from "mistralai";

// Read and encode the PDF file
const pdfData = fs.readFileSync("document.pdf");
const base64Pdf = pdfData.toString("base64");
const documentUrl = `data:application/pdf;base64,${base64Pdf}`;

// Process the encoded PDF
const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: documentUrl,
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: Array.from({ length: 100 }, (_, i) => i),
});

console.log(ocrResponse);

bash=:# Convert PDF to base64
PDF_BASE64=$(base64 -i document.pdf) # Use -w 0 on Linux for no line breaks

# Process the encoded PDF
curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "mistral-ocr-latest",
"document": {
"type": "document_url",
"document_url": "data:application/pdf;base64,'"$PDF_BASE64"'"
},
"include_image_base64": true
}' -o ocr_output.json

```

### OCR with Images

Mistral OCR can process images in two ways:

#### Using a direct image URL:

```bash
curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "mistral-ocr-latest",
"document": {
"type": "image_url",
"image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
}
}' -o ocr_output.json
```

#### Using base64-encoded images:

```language-selector
python=:import base64
from mistralai import Mistral

# Read and encode the image file
with open("document.jpg", "rb") as f:
    image_data = f.read()

base64_image = base64.b64encode(image_data).decode("utf-8")
image_url = f"data:image/jpeg;base64,{base64_image}"

# Process the encoded image
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {"type": "image_url", "image_url": image_url}

ocr_response = client.ocr.process(model="mistral-ocr-latest", document=document_param)

print(ocr_response)

bash=:# Convert image to base64
IMAGE_BASE64=$(base64 -i document.jpg) # Use -w 0 on Linux for no line breaks

# Process the encoded image
curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "mistral-ocr-latest",
"document": {
"type": "image_url",
"image_url": "data:image/jpeg;base64,'"$IMAGE_BASE64"'"
}
}' -o ocr_output.json

```

### Example Output

The OCR API returns both the extracted text content in markdown format and metadata about the document structure:

```json
{
  "pages": [
    {
      "index": 1,
      "markdown": "# LEVERAGING UNLABELED DATA TO PREDICT OUT-OF-DISTRIBUTION PERFORMANCE \n\nSaurabh Garg*<br>Carnegie Mellon University<br>sgarg2@andrew.cmu.edu<br>Sivaraman Balakrishnan<br>Carnegie Mellon University<br>sbalakri@andrew.cmu.edu<br>Zachary C. Lipton<br>Carnegie Mellon University<br>zlipton@andrew.cmu.edu\n\n## Behnam Neyshabur\n\nGoogle Research, Blueshift team\nneyshabur@google.com\n\nHanie Sedghi<br>Google Research, Brain team<br>hsedghi@google.com\n\n\n#### Abstract\n\nReal-world machine learning deployments are characterized by mismatches between the source (training) and target (test) distributions that may cause performance drops...",
      "images": [],
      "dimensions": {
        "dpi": 200,
        "height": 2200,
        "width": 1700
      }
    }
    // Additional pages...

  ],
  "model": "mistral-ocr-latest",
  "usage_info": {
    "pages_processed": 3,
    "doc_size_bytes": null
  }
}
```

### Document Understanding

You can combine Mistral OCR with language models to enable natural language interaction with document content. This allows you to extract information and insights from documents by asking questions in natural language:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-small-latest",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "what is the last sentence in the document"
        },
        {
          "type": "document_url",
          "document_url": "https://arxiv.org/pdf/1805.04770"
        }
      ]
    }
  ]
}'
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `mistral-small-latest` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```bash
curl https://api.avalai.ir/v1/responses \
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


### Usage Considerations

- **File Size Limits**: Uploaded document files must not exceed 50 MB in size and should be no longer than 1,000 pages.
- **Supported Image Formats**: PNG (.png), JPEG (.jpeg and .jpg), WEBP (.webp), and non-animated GIF with only one frame (.gif).
- **Pricing**: The mistral-ocr-latest model is priced at 1000 pages per dollar, with approximately double the pages per dollar when using batch inference.

### Related Resources

- [Mistral AI Models](en/providers/mistralai.md)
- [OCR Announcement](en/news/2025-05-15-mistral-ocr-latest-added.md)
