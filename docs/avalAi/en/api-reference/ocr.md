# OCR API

The OCR API enables you to extract text and images from PDF documents and images using Mistral's advanced OCR models. This is a dedicated service endpoint that processes documents and returns structured content in Markdown format.

> **Note:** The `v1/ocr` endpoint is not an OpenAI-standard endpoint. It is a specialized service added by AvalAI for document processing.

## Endpoint

```
POST https://api.avalai.ir/v1/ocr
```

## Request Body

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | The OCR model to use (e.g., "mistral-ocr-latest") |
| `document` | object | Yes | Document to process. Must contain `type` and URL field |
| `document.type` | string | Yes | Either "document_url" for PDFs/docs or "image_url" for images |
| `document.document_url` | string | Conditional | URL to the document (required if type is "document_url") |
| `document.image_url` | string | Conditional | URL to the image (required if type is "image_url") |
| `pages` | array | No | List of specific page indices to process (0-indexed) |
| `include_image_base64` | boolean | No | Whether to include extracted images as base64 strings |
| `image_limit` | integer | No | Maximum number of images to return |
| `image_min_size` | integer | No | Minimum size (in pixels) for images to include |
| `id` | string | No | Optional identifier for the request |
| `document_annotation_format` | object | No | Output format for document-level annotations. See [Response Formats](#response-formats) |
| `bbox_annotation_format` | object | No | Output format for bounding box annotations. See [Response Formats](#response-formats) |
| `extract_header` | boolean | No | Whether to extract document headers. Default: `false` |
| `extract_footer` | boolean | No | Whether to extract document footers. Default: `false` |
| `table_format` | string | No | Format for extracted tables: `"markdown"` or `"html"`. Default: `"markdown"` |

### Document Format Examples

**For PDFs and documents:**

```json
{
  "type": "document_url",
  "document_url": "https://example.com/document.pdf"

}
```

**For images:**

```json
{
  "type": "image_url",
  "image_url": "https://example.com/image.png"

}
```

**For base64-encoded content:**

```json
{
  "type": "document_url",
  "document_url": "data:application/pdf;base64,JVBERi0xLjQKJ..."
}
```

### Response Formats

The OCR API supports structured JSON output through the `document_annotation_format` and `bbox_annotation_format` parameters. These allow you to receive OCR results in a specific JSON format instead of plain markdown.

#### Format Types

| Type | Description |
| ---- | ----------- |
| `text` | Default. Returns markdown text output |
| `json_object` | Enables JSON mode. The model output will be valid JSON. You must instruct the model to produce JSON via a system or user message |
| `json_schema` | Enables JSON Schema mode. Guarantees output follows the provided JSON schema |

#### Response Format Object

```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "your_schema_name",
    "schema": {
      "type": "object",
      "properties": {
        "field1": {
          "type": "string"
        },
        "field2": {
          "type": "number"
        }
      },
      "required": [
        "field1",
        "field2"
      ]
    }
  }
}
```

#### Example: Structured Data Extraction

You can use JSON Schema mode to extract structured data from documents:

```json
{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "document_url",
    "document_url": "https://example.com/invoice.pdf"

  },
  "document_annotation_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "invoice_data",
      "schema": {
        "type": "object",
        "properties": {
          "invoice_number": { "type": "string" },
          "date": { "type": "string" },
          "total_amount": { "type": "number" },
          "vendor_name": { "type": "string" },
          "line_items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "description": { "type": "string" },
                "quantity": { "type": "number" },
                "unit_price": { "type": "number" }
              }
            }
          }
        },
        "required": ["invoice_number", "date", "total_amount"]
      }
    }
  }
}
```

When using `document_annotation_format`, the structured output will be returned in the `document_annotation` field of the response as a JSON string.

## Examples

### Basic OCR Request

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
      "type": "document_url",
      "document_url": "https://arxiv.org/pdf/2201.04234"
    }
  }'

python=:import requests
import os

api_key = os.getenv("AVALAI_API_KEY")

response = requests.post(
    "https://api.avalai.ir/v1/ocr",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "mistral-ocr-latest",
        "document": {
            "type": "document_url",
            "document_url": "https://arxiv.org/pdf/2201.04234",
        },
    },
)

result = response.json()
for page in result["pages"]:
    print(f"Page {page['index']}: {page['markdown'][:100]}...")

javascript=:const response = await fetch("https://api.avalai.ir/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      document_url: "https://arxiv.org/pdf/2201.04234"
    }
  })
});

const result = await response.json();
result.pages.forEach(page => {
  console.log(`Page ${page.index}: ${page.markdown.substring(0, 100)}...`);
});

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type OCRRequest struct {
	Model    string   `json:"model"`
	Document Document `json:"document"`
}

type Document struct {
	Type        string `json:"type"`
	DocumentURL string `json:"document_url"`
}

type OCRResponse struct {
	Pages []struct {
		Index    int    `json:"index"`
		Markdown string `json:"markdown"`
	} `json:"pages"`
	Model  string `json:"model"`
	Object string `json:"object"`
}

func main() {
	apiKey := "YOUR_AVALAI_API_KEY"
	url := "https://api.avalai.ir/v1/ocr"

	reqBody := OCRRequest{
		Model: "mistral-ocr-latest",
		Document: Document{
			Type:        "document_url",
			DocumentURL: "https://arxiv.org/pdf/2201.04234",
		},
	}

	jsonData, _ := json.Marshal(reqBody)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var result OCRResponse
	json.Unmarshal(body, &result)

	for _, page := range result.Pages {
		fmt.Printf("Page %d: %s...\n", page.Index, page.Markdown[:100])
	}
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/ocr';

$data = [
    'model' => 'mistral-ocr-latest',
    'document' => [
        'type' => 'document_url',
        'document_url' => 'https://arxiv.org/pdf/2201.04234'
    ]
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
    echo "cURL Error: " . $err;
} elseif ($httpcode >= 400) {
    echo "HTTP Error: " . $httpcode . "\n";
    echo $response;
} else {
    $responseData = json_decode($response, true);
    foreach ($responseData['pages'] as $page) {
        echo "Page " . $page['index'] . ": " . substr($page['markdown'], 0, 100) . "...\n";
    }
}
?>

```

### Processing Specific Pages

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
      "type": "document_url",
      "document_url": "https://arxiv.org/pdf/2201.04234"
    },
    "pages": [0, 1, 2]
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/ocr",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "mistral-ocr-latest",
        "document": {
            "type": "document_url",
            "document_url": "https://arxiv.org/pdf/2201.04234",
        },
        "pages": [0, 1, 2],
    },
)

result = response.json()

javascript=:const response = await fetch("https://api.avalai.ir/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      document_url: "https://arxiv.org/pdf/2201.04234"
    },
    pages: [0, 1, 2]
  })
});

const result = await response.json();

```

### Extract Images with OCR

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
      "type": "document_url",
      "document_url": "https://arxiv.org/pdf/2201.04234"
    },
    "include_image_base64": true,
    "image_limit": 10,
    "image_min_size": 100
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/ocr",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "mistral-ocr-latest",
        "document": {
            "type": "document_url",
            "document_url": "https://arxiv.org/pdf/2201.04234",
        },
        "include_image_base64": True,
        "image_limit": 10,
        "image_min_size": 100,
    },
)

result = response.json()
for page in result["pages"]:
    if page.get("images"):
        print(f"Page {page['index']} has {len(page['images'])} images")

javascript=:const response = await fetch("https://api.avalai.ir/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      document_url: "https://arxiv.org/pdf/2201.04234"
    },
    include_image_base64: true,
    image_limit: 10,
    image_min_size: 100
  })
});

const result = await response.json();
result.pages.forEach(page => {
  if (page.images) {
    console.log(`Page ${page.index} has ${page.images.length} images`);
  }
});

```

### Processing an Image

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
      "type": "image_url",
      "image_url": "https://example.com/image.png"
    }
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/ocr",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "mistral-ocr-latest",
        "document": {"type": "image_url", "image_url": "https://example.com/image.png"},
    },
)

result = response.json()
print(result["pages"][0]["markdown"])

javascript=:const response = await fetch("https://api.avalai.ir/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "image_url",
      image_url: "https://example.com/image.png"
    }
  })
});

const result = await response.json();
console.log(result.pages[0].markdown);

```

### Using Mistral AI SDK

You can also use the official Mistral AI SDK to access the OCR endpoint by configuring it to use AvalAI's server URL. This works with the Mistral AI SDK in Python and other languages, as long as the SDK supports custom server URLs.

```python
from mistralai import Mistral

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
```

> **Note:** The same approach works for other Mistral AI SDKs in different languages (JavaScript, Go, etc.) as long as they allow setting a custom server URL. Simply configure the SDK to point to `https://api.avalai.ir` and use your AvalAI API key.

For more information about using Mistral AI SDKs with AvalAI, see the [Mistral AI SDK Guide](en/providers/mistralai.md).

### Structured JSON Output

Use the `document_annotation_format` parameter to extract structured data from documents. This is useful for processing invoices, receipts, forms, and other structured documents.

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
      "type": "document_url",
      "document_url": "https://example.com/invoice.pdf"
    },
    "document_annotation_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "invoice_data",
        "schema": {
          "type": "object",
          "properties": {
            "invoice_number": { "type": "string" },
            "date": { "type": "string" },
            "total_amount": { "type": "number" },
            "vendor_name": { "type": "string" }
          },
          "required": ["invoice_number", "total_amount"]
        }
      }
    }
  }'

python=:import requests
import json
import os

api_key = os.getenv("AVALAI_API_KEY")

# Define the JSON schema for structured extraction
invoice_schema = {
    "type": "json_schema",
    "json_schema": {
        "name": "invoice_data",
        "schema": {
            "type": "object",
            "properties": {
                "invoice_number": {"type": "string"},
                "date": {"type": "string"},
                "total_amount": {"type": "number"},
                "vendor_name": {"type": "string"},
                "line_items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "description": {"type": "string"},
                            "quantity": {"type": "number"},
                            "unit_price": {"type": "number"},
                        },
                    },
                },
            },
            "required": ["invoice_number", "total_amount"],
        },
    },
}

response = requests.post(
    "https://api.avalai.ir/v1/ocr",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "mistral-ocr-latest",
        "document": {
            "type": "document_url",
            "document_url": "https://example.com/invoice.pdf",
        },
        "document_annotation_format": invoice_schema,
    },
)

result = response.json()

# The structured data is in document_annotation as a JSON string
if result.get("document_annotation"):
    invoice_data = json.loads(result["document_annotation"])
    print(f"Invoice Number: {invoice_data.get('invoice_number')}")
    print(f"Total Amount: {invoice_data.get('total_amount')}")

javascript=:const invoiceSchema = {
  type: "json_schema",
  json_schema: {
    name: "invoice_data",
    schema: {
      type: "object",
      properties: {
        invoice_number: { type: "string" },
        date: { type: "string" },
        total_amount: { type: "number" },
        vendor_name: { type: "string" },
        line_items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              unit_price: { type: "number" }
            }
          }
        }
      },
      required: ["invoice_number", "total_amount"]
    }
  }
};

const response = await fetch("https://api.avalai.ir/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      document_url: "https://example.com/invoice.pdf"
    },
    document_annotation_format: invoiceSchema
  })
});

const result = await response.json();

// The structured data is in document_annotation as a JSON string
if (result.document_annotation) {
  const invoiceData = JSON.parse(result.document_annotation);
  console.log(`Invoice Number: ${invoiceData.invoice_number}`);
  console.log(`Total Amount: ${invoiceData.total_amount}`);
}

```

### Tables in HTML Format

You can extract tables in HTML format instead of markdown:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
      "type": "document_url",
      "document_url": "https://example.com/document-with-tables.pdf"
    },
    "table_format": "html"
  }'

python=:import requests
import os

api_key = os.getenv("AVALAI_API_KEY")

response = requests.post(
    "https://api.avalai.ir/v1/ocr",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "mistral-ocr-latest",
        "document": {
            "type": "document_url",
            "document_url": "https://example.com/document-with-tables.pdf",
        },
        "table_format": "html",  # Tables will be returned in HTML format
    },
)

result = response.json()
for page in result["pages"]:
    print(page["markdown"])  # Tables will be in <table> HTML tags

javascript=:const response = await fetch("https://api.avalai.ir/v1/ocr", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      document_url: "https://example.com/document-with-tables.pdf"
    },
    table_format: "html"  // Tables will be returned in HTML format
  })
});

const result = await response.json();
result.pages.forEach(page => {
  console.log(page.markdown);  // Tables will be in <table> HTML tags
});

```

## Response Format

```json
{
  "pages": [
    {
      "index": 0,
      "markdown": "# Document Title\n\nExtracted text content...",
      "dimensions": {
        "dpi": 200,
        "height": 2200,
        "width": 1700
      },
      "images": [
        {
          "image_base64": "base64string...",
          "bbox": {
            "x": 100,
            "y": 200,
            "width": 300,
            "height": 400
          }
        }
      ]
    }
  ],
  "model": "mistral-ocr-latest",
  "usage_info": {
    "pages_processed": 29,
    "doc_size_bytes": 3002783
  },
  "document_annotation": null,
  "object": "ocr"
}
```

## Response Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `pages` | array | List of processed pages with extracted content |
| `pages[].index` | integer | Page number (0-indexed) |
| `pages[].markdown` | string | Extracted text in Markdown format |
| `pages[].dimensions` | object | Page dimensions (dpi, height, width in pixels) |
| `pages[].images` | array | Extracted images from the page (if include_image_base64=true) |
| `model` | string | The model used for OCR processing |
| `usage_info` | object | Processing statistics (pages processed, document size) |
| `usage_info.pages_processed` | integer | Total number of pages processed |
| `usage_info.doc_size_bytes` | integer | Size of the document in bytes |
| `document_annotation` | object | Optional document-level annotations |
| `object` | string | Always "ocr" for OCR responses |

### Page Dimensions Object

| Field | Type | Description |
| ----- | ---- | ----------- |
| `dpi` | integer | Dots per inch (resolution) of the page |
| `height` | integer | Height of the page in pixels |
| `width` | integer | Width of the page in pixels |

### Image Object

| Field | Type | Description |
| ----- | ---- | ----------- |
| `image_base64` | string | Base64-encoded image data |
| `bbox` | object | Bounding box coordinates of the image |
| `bbox.x` | integer | X-coordinate of the top-left corner |
| `bbox.y` | integer | Y-coordinate of the top-left corner |
| `bbox.width` | integer | Width of the image in pixels |
| `bbox.height` | integer | Height of the image in pixels |

## Error Handling

The API may return various error codes:

| Status Code | Description |
| ----------- | ----------- |
| 400 | Bad Request - Invalid parameters or malformed document URL |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions or quota exceeded |
| 404 | Not Found - Document URL could not be accessed |
| 413 | Payload Too Large - Document size exceeds maximum limit |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side processing error |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Best Practices

1. **Specify Pages**: When processing large documents, use the `pages` parameter to extract only the pages you need
2. **Image Extraction**: Set `include_image_base64` to `true` only when you need the images to reduce response size
3. **Filter Images**: Use `image_min_size` to filter out small, irrelevant images like icons or decorations
4. **Document URLs**: Ensure document URLs are publicly accessible or use base64-encoded content for private documents
5. **Handle Large Responses**: Be prepared to handle large response payloads when extracting images from documents
6. **Cache Results**: Consider caching OCR results for frequently accessed documents
7. **Use JSON Schema for Structured Data**: When extracting structured information (invoices, forms, receipts), use `document_annotation_format` with JSON Schema to get consistent, typed output
8. **HTML Tables for Web Integration**: Use `table_format: "html"` when you need to display extracted tables in web applications

## Related Resources

- [Processing Documents with Mistral OCR](en/examples/processing_documents_with_mistral_ocr.md) - Comprehensive guide with examples
- [Mistral OCR Model](en/models/mistral-ocr-2512.md) - Model details and specifications
- [PDF Files Guide](en/guides/pdf-files.md) - Learn about processing PDF files
- [Vision Guide](en/guides/vision.md) - Learn about image processing capabilities
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits