# Files API

The Files API allows you to upload, list, retrieve, and delete files that can be used across various AvalAI endpoints. This is AvalAI's first native service layer, providing an OpenAI-compatible file management system that works seamlessly with all 26+ providers and 410+ models.

> **🎉 FREE Beta Program**: All v1/files operations are completely **FREE** from **January 1, 2026** to **March 1, 2026** (60 days). We encourage you to test and report any issues to [t.me/AvalAISupport](https://t.me/AvalAISupport).

## Why Use the Files API?

Using the Files API instead of inline base64 or URL file inputs offers several advantages:

1. **Avoid Repeated Large File Transfers** - Upload once, reference by `file_id` in subsequent requests
2. **Improved Performance** - Files are stored server-side and retrieved internally, reducing latency
3. **Reduced Network Overhead** - Base64 encoding increases file size by ~33%; using `file_id` is just a short string
4. **Reusable Across Endpoints** - Works with `v1/chat/completions`, `v1/responses`, `v1/messages`, `v1/ocr`, and `v1/images/edits`

## Base URL

```
https://api.avalai.ir/v1
```

## Authentication

All Files API requests require authentication via Bearer token:

```http
Authorization: Bearer YOUR_AVALAI_API_KEY
```

## Supported Endpoints

Files uploaded through the Files API can be used with the following endpoints:

| Endpoint | Description |
|----------|-------------|
| `v1/chat/completions` | OpenAI-compatible chat completions |
| `v1/responses` | OpenAI Responses API |
| `v1/messages` | Anthropic Messages API |
| `v1/ocr` | OCR processing endpoint |
| `v1/images/edits` | Image editing endpoints |

---

## Upload File

Upload a file that can be used across various endpoints.

```
POST https://api.avalai.ir/v1/files
```

### Request Body (Multipart Form)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | file | Yes | The file object to be uploaded. Maximum size: 128MB (beta). |
| `purpose` | string | Yes | The intended purpose of the uploaded file. See [Supported Purposes](#supported-purposes). |
| `expires_after` | object | No | Optional expiration policy for the file. |

### Supported Purposes

| Purpose | Description |
|---------|-------------|
| `assistants` | Used in the Assistants API |
| `batch` | Used in the Batch API |
| `fine-tune` | Used for fine-tuning models |
| `vision` | Images used for vision fine-tuning |
| `user_data` | Flexible file type for any purpose |
| `evals` | Used for evaluation datasets |
| `others` | AvalAI-specific: General purpose for any other use case |

### Expiration Policy Object

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `anchor` | string | Yes | The anchor point for expiration. Currently only `"created_at"` is supported. |
| `seconds` | integer | Yes | Number of seconds after the anchor time when the file will expire. |

### Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="user_data" \
  -F file="@document.pdf"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Upload a file
file = client.files.create(file=open("document.pdf", "rb"), purpose="user_data")

print(f"File uploaded: {file.id}")

# Upload with expiration (30 days)
file_with_expiry = client.files.create(
    file=open("temp_data.jsonl", "rb"),
    purpose="batch",
    expires_after={"anchor": "created_at", "seconds": 2592000},  # 30 days
)

javascript=:import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Upload a file
const file = await client.files.create({
    file: fs.createReadStream("document.pdf"),
    purpose: "user_data",
});

console.log(`File uploaded: ${file.id}`);

// Upload with expiration (30 days)
const fileWithExpiry = await client.files.create({
    file: fs.createReadStream("temp_data.jsonl"),
    purpose: "batch",
    expires_after: {
        anchor: "created_at",
        seconds: 2592000,
    },
});

go=:package main

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

	file, err := os.Open("document.pdf")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	uploaded, err := client.Files.New(context.Background(), openai.FileNewParams{
		File:    openai.F[io.Reader](file),
		Purpose: openai.F(openai.FilePurposeUserData),
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("File uploaded: %s\n", uploaded.ID)
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/files';

$file = new CURLFile('document.pdf', 'application/pdf', 'document.pdf');

$data = [
    'file' => $file,
    'purpose' => 'user_data'
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode >= 400) {
    echo "Error: " . $httpcode . "\n";
    echo $response;
} else {
    $fileData = json_decode($response, true);
    echo "File uploaded: " . $fileData['id'] . "\n";
}
?>

```

### Response

```json
{
  "id": "file-EyVi0MrxuKTgBrvkVas5ZTGz",
  "object": "file",
  "bytes": 13264,
  "created_at": 1767210968,
  "expires_at": null,
  "filename": "document.pdf",
  "purpose": "user_data",
  "status": null,
  "status_details": null
}
```

---

## List Files

Returns a list of files that belong to your organization.

```
GET https://api.avalai.ir/v1/files
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `purpose` | string | No | Filter by purpose (e.g., `user_data`, `fine-tune`). |
| `limit` | integer | No | Number of files to retrieve (1-10000). Default: 10000. |
| `order` | string | No | Sort order by `created_at`. Either `asc` or `desc`. Default: `desc`. |
| `after` | string | No | A cursor for pagination. Get files after this file ID. |

### Examples

```language-selector
bash=:# List all files
curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# List files with specific purpose
curl "https://api.avalai.ir/v1/files?purpose=user_data&limit=10" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# List all files
files = client.files.list()
for file in files.data:
    print(f"{file.id}: {file.filename} ({file.bytes} bytes)")

# List files with specific purpose
user_files = client.files.list(purpose="user_data")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// List all files
const files = await client.files.list();
for (const file of files.data) {
    console.log(`${file.id}: ${file.filename} (${file.bytes} bytes)`);
}

// List files with specific purpose
const userFiles = await client.files.list({ purpose: "user_data" });

go=:package main

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

	files, err := client.Files.List(context.Background(), openai.FileListParams{})
	if err != nil {
		panic(err)
	}

	for _, file := range files.Data {
		fmt.Printf("%s: %s (%d bytes)\n", file.ID, file.Filename, file.Bytes)
	}
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/files';

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
foreach ($data['data'] as $file) {
    echo $file['id'] . ": " . $file['filename'] . " (" . $file['bytes'] . " bytes)\n";
}
?>

```

### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "file-EyVi0MrxuKTgBrvkVas5ZTGz",
      "object": "file",
      "bytes": 13264,
      "created_at": 1767210968,
      "expires_at": null,
      "filename": "document.pdf",
      "purpose": "user_data",
      "status": null,
      "status_details": null
    },
    {
      "id": "file-NWU5LYel4DIxFCITnrVRLLcA",
      "object": "file",
      "bytes": 53,
      "created_at": 1766585221,
      "expires_at": null,
      "filename": "mydata.jsonl",
      "purpose": "fine-tune",
      "status": null,
      "status_details": null
    }
  ],
  "first_id": "file-EyVi0MrxuKTgBrvkVas5ZTGz",
  "last_id": "file-NWU5LYel4DIxFCITnrVRLLcA",
  "has_more": false
}
```

---

## Retrieve File

Returns information about a specific file.

```
GET https://api.avalai.ir/v1/files/{file_id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_id` | string | Yes | The ID of the file to retrieve. |

### Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/files/file-abc123 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

file = client.files.retrieve("file-abc123")
print(f"Filename: {file.filename}")
print(f"Size: {file.bytes} bytes")
print(f"Purpose: {file.purpose}")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const file = await client.files.retrieve("file-abc123");
console.log(`Filename: ${file.filename}`);
console.log(`Size: ${file.bytes} bytes`);
console.log(`Purpose: ${file.purpose}`);

go=:package main

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

	file, err := client.Files.Get(context.Background(), "file-abc123")
	if err != nil {
		panic(err)
	}

	fmt.Printf("Filename: %s\n", file.Filename)
	fmt.Printf("Size: %d bytes\n", file.Bytes)
	fmt.Printf("Purpose: %s\n", file.Purpose)
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$fileId = 'file-abc123';
$apiUrl = "https://api.avalai.ir/v1/files/{$fileId}";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
]);

$response = curl_exec($ch);
curl_close($ch);

$file = json_decode($response, true);
echo "Filename: " . $file['filename'] . "\n";
echo "Size: " . $file['bytes'] . " bytes\n";
echo "Purpose: " . $file['purpose'] . "\n";
?>

```

### Response

```json
{
  "id": "file-EyVi0MrxuKTgBrvkVas5ZTGz",
  "object": "file",
  "bytes": 13264,
  "created_at": 1767210968,
  "expires_at": null,
  "filename": "document.pdf",
  "purpose": "user_data",
  "status": null,
  "status_details": null
}
```

---

## Delete File

Delete a file from your organization's storage.

```
DELETE https://api.avalai.ir/v1/files/{file_id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_id` | string | Yes | The ID of the file to delete. |

### Examples

```language-selector
bash=:curl -X DELETE https://api.avalai.ir/v1/files/file-abc123 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

deleted = client.files.delete("file-abc123")
print(f"Deleted: {deleted.deleted}")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const deleted = await client.files.del("file-abc123");
console.log(`Deleted: ${deleted.deleted}`);

go=:package main

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

	deleted, err := client.Files.Delete(context.Background(), "file-abc123")
	if err != nil {
		panic(err)
	}

	fmt.Printf("Deleted: %v\n", deleted.Deleted)
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$fileId = 'file-abc123';
$apiUrl = "https://api.avalai.ir/v1/files/{$fileId}";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo "Deleted: " . ($result['deleted'] ? 'true' : 'false') . "\n";
?>

```

### Response

```json
{
  "id": "file-abc123",
  "object": "file",
  "deleted": true
}
```

---

## Retrieve File Content

Download the content of a file.

```
GET https://api.avalai.ir/v1/files/{file_id}/content
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_id` | string | Yes | The ID of the file to download. |

### Examples

```language-selector
bash=:# Download file content
curl https://api.avalai.ir/v1/files/file-abc123/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output downloaded_file.pdf

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Download file content
content = client.files.content("file-abc123")

# Save to file
with open("downloaded_file.pdf", "wb") as f:
    f.write(content.read())

javascript=:import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Download file content
const content = await client.files.content("file-abc123");
const buffer = Buffer.from(await content.arrayBuffer());
fs.writeFileSync("downloaded_file.pdf", buffer);

go=:package main

import (
	"context"
	"io"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"),
	)

	content, err := client.Files.Content(context.Background(), "file-abc123")
	if err != nil {
		panic(err)
	}

	file, err := os.Create("downloaded_file.pdf")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	io.Copy(file, content.Body)
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$fileId = 'file-abc123';
$apiUrl = "https://api.avalai.ir/v1/files/{$fileId}/content";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
]);

$content = curl_exec($ch);
curl_close($ch);

file_put_contents('downloaded_file.pdf', $content);
echo "File downloaded successfully\n";
?>

```

---

## File Object

The file object represents a document that has been uploaded to AvalAI.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the file (e.g., `file-EyVi0MrxuKTgBrvkVas5ZTGz`). |
| `object` | string | Object type, always `"file"`. |
| `bytes` | integer | Size of the file in bytes. |
| `created_at` | integer | Unix timestamp when the file was created. |
| `expires_at` | integer or null | Unix timestamp when the file will expire, or null if it doesn't expire. |
| `filename` | string | Name of the file. |
| `purpose` | string | The intended purpose of the file. |
| `status` | string or null | The status of the file (used for async operations). |
| `status_details` | string or null | Additional details about the status. |

---

## Rate Limits

File operations are rate-limited based on your account tier:

### Operations Rate Limits (per minute)

| Tier | Uploads | Downloads | Deletes |
|------|---------|-----------|---------|
| 0 (Free) | 3 | 5 | 10 |
| 1 | 10 | 100 | 100 |
| 2 | 50 | 250 | 250 |
| 3 | 250 | 500 | 500 |
| 4 | 500 | 1,000 | 1,000 |
| 5 | 1,500 | 2,000 | 5,000 |

### Storage Limits by Tier

Each account tier has a maximum total storage limit. Once exhausted, uploads are blocked until you:
- Free up storage by deleting files, OR
- Upgrade to a higher tier

| Tier | Max Storage |
|------|-------------|
| 0 (Free) | 250 MB |
| 1 | 2 GB |
| 2 | 5 GB |
| 3 | 15 GB |
| 4 | 50 GB |
| 5 | 200 GB |

For more information about tiers, see [Rate Limits](en/guides/rate-limits.md).

---

## Using Files in API Calls

Once you've uploaded a file, you can reference it by `file_id` in supported endpoints.

> **⚠️ Model Compatibility Note**: Not all models support all file types. For PDF files, **most OpenAI models (GPT-5.5, GPT-5.4, etc.) do not accept PDFs directly**. Use **Gemini models** (e.g., `gemini-2.5-flash`, `gemini-2.5-pro`) or other vision-capable models that support document processing. Check the model's documentation for supported file types.

### Example: Chat Completions with File

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
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
              "file_id": "file-EyVi0MrxuKTgBrvkVas5ZTGz"
            }
          }
        ]
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Use uploaded file in chat completion
# Note: Use Gemini models for PDF files (OpenAI models don't accept PDFs)
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Summarize this document"},
                {"type": "file", "file": {"file_id": "file-EyVi0MrxuKTgBrvkVas5ZTGz"}},
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Use uploaded file in chat completion
// Note: Use Gemini models for PDF files (OpenAI models don't accept PDFs)
const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: "Summarize this document" },
                { type: "file", file: { file_id: "file-EyVi0MrxuKTgBrvkVas5ZTGz" } },
            ],
        },
    ],
});

console.log(response.choices[0].message.content);

go=:package main

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

	// Use uploaded file in chat completion
	response, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: openai.F("gemini-2.5-flash"),
		Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
			openai.UserMessageParts(
				openai.TextPart("Summarize this document"),
				openai.FilePart("file-abc123"),
			),
		}),
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.Choices[0].Message.Content)
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

$data = [
    'model' => 'gemini-2.5-flash',
    'messages' => [
        [
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => 'Summarize this document'],
                ['type' => 'file', 'file' => ['file_id' => 'file-abc123']],
            ],
        ],
    ],
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey,
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo $result['choices'][0]['message']['content'] . "\n";
?>

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


---

## Limitations

### Beta Phase Limitations

- **Maximum file size**: 128MB per upload
- **Storage limits**: Based on tier (250MB to 200GB)

### Supported Endpoints

During the beta phase, file IDs can be used with:
- `v1/chat/completions`
- `v1/responses`
- `v1/messages`
- `v1/ocr`
- `v1/images/edits`

---

## Storage & Security

### Storage Infrastructure

Files are stored across enterprise-grade cloud providers:
- **AWS S3**
- **Google Cloud Platform (GCP)**
- **Cloudflare**

### Security

- Files are stored with enterprise-grade security measures
- Files are stored without encryption at rest (industry standard for frequently accessed files, similar to other providers)

### Security Reporting

If you discover a security vulnerability, please report it to:
- **Email**: security@avalai.ir
- **Bug bounties** are available for critical security issues that could put user data at risk

---

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid file or missing parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - You don't have permission to access this file |
| 404 | Not Found - File not found |
| 413 | Payload Too Large - File exceeds 128MB limit |
| 429 | Too Many Requests - Rate limit exceeded |
| 507 | Insufficient Storage - Storage limit exceeded for your tier |

---

## Related Resources

- [File Inputs Guide](en/guides/file-inputs.md) - Learn about different methods to provide file inputs
- [Rate Limits](en/guides/rate-limits.md) - Understand rate limits and tiers
- [Chat Completions](en/api-reference/chat.md) - Use files in chat completions
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods

---

## Support

- **Bug Reports**: [t.me/AvalAISupport](https://t.me/AvalAISupport)
- **Security Issues**: security@avalai.ir
