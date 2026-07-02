# Files API Beta Launched - OpenAI-Compatible File Management

**Date:** 2026-01-01 / (1404-10-11)

## Summary

AvalAI introduces the Files API (`/v1/files`), our first native service layer providing OpenAI-compatible file management. Upload files once and reference them by `file_id` across multiple API requests, reducing network overhead and improving performance. The Files API is completely free during the 60-day beta period through March 1, 2026.

---

## Details

### What is the Files API?

The Files API is AvalAI's first native service layer that provides an OpenAI-compatible file management system. Instead of sending base64-encoded files or URLs with every API request, you can:

1. **Upload once, use everywhere** - Upload a file to get a `file_id`, then reference it in subsequent requests
2. **Reduce network overhead** - No more sending large base64 payloads (which add ~33% overhead) with each request
3. **Improve performance** - Files are stored server-side and retrieved internally, reducing latency
4. **Cross-endpoint compatibility** - Use uploaded files with `v1/chat/completions`, `v1/responses`, `v1/messages`, `v1/ocr`, and `v1/images/edits`

### Free Beta Program

> **🎉 Free for 60 Days**: All Files API operations are completely **FREE** from January 1, 2026 through March 1, 2026. We encourage you to test the service and report any issues to [t.me/AvalAISupport](https://t.me/AvalAISupport).

### Supported File Purposes

| Purpose | Description |
|---------|-------------|
| `assistants` | For use with the Assistants API |
| `batch` | For use with the Batch API |
| `fine-tune` | For model fine-tuning |
| `vision` | Images for vision fine-tuning |
| `user_data` | Flexible file type for any purpose |
| `evals` | For evaluation datasets |
| `others` | AvalAI-specific: General purpose for any other use case |

### Rate Limits by Tier

#### File Operations (per minute)

| Tier | Uploads | Downloads | Deletes |
|------|---------|-----------|---------|
| 0 (Free) | 3 | 5 | 10 |
| 1 | 10 | 100 | 100 |
| 2 | 50 | 250 | 250 |
| 3 | 250 | 500 | 500 |
| 4 | 500 | 1,000 | 1,000 |
| 5 | 1,500 | 2,000 | 5,000 |

#### Storage Limits

| Tier | Max Storage |
|------|-------------|
| 0 (Free) | 250 MB |
| 1 | 2 GB |
| 2 | 5 GB |
| 3 | 15 GB |
| 4 | 50 GB |
| 5 | 200 GB |

**Maximum file size**: 128 MB per file (during beta)

---

## API Endpoints

The Files API provides 5 endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/files` | Upload a file |
| GET | `/v1/files` | List all files |
| GET | `/v1/files/{file_id}` | Retrieve file metadata |
| DELETE | `/v1/files/{file_id}` | Delete a file |
| GET | `/v1/files/{file_id}/content` | Download file content |

---

## API Request/Response Examples

### Upload a File

```bash
curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="user_data" \
  -F file="@document.pdf"
```

#### Response

```json
{
  "id": "file-abc123def456",
  "object": "file",
  "bytes": 1024000,
  "created_at": 1735689600,
  "expires_at": null,
  "filename": "document.pdf",
  "purpose": "user_data"
}
```

### List Files

```bash
curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "file-abc123def456",
      "object": "file",
      "bytes": 1024000,
      "created_at": 1735689600,
      "expires_at": null,
      "filename": "document.pdf",
      "purpose": "user_data"
    }
  ]
}
```

### Use File in Chat Completion

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this document?"
          },
          {
            "type": "file",
            "file": {
              "file_id": "file-abc123def456"
            }
          }
        ]
      }
    ]
  }'
```

---

## SDK Usage Examples

### Upload and Use a File

```language-selector
bash=:# Upload a file
FILE_RESPONSE=$(curl -s https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="user_data" \
  -F file="@document.pdf")

FILE_ID=$(echo $FILE_RESPONSE | jq -r '.id')

# Use the file in a chat completion
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Summarize this document"},
          {"type": "file", "file": {"file_id": "'$FILE_ID'"}}
        ]
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Upload a file
file = client.files.create(file=open("document.pdf", "rb"), purpose="user_data")

print(f"File uploaded: {file.id}")

# Use the file in a chat completion
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Summarize this document"},
                {"type": "file", "file": {"file_id": file.id}},
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

// Upload a file
const file = await client.files.create({
  file: fs.createReadStream("document.pdf"),
  purpose: "user_data",
});

console.log(`File uploaded: ${file.id}`);

// Use the file in a chat completion
const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Summarize this document" },
        { type: "file", file: { file_id: file.id } },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

```

### File with Expiration Policy

```language-selector
bash=:# Upload a file that expires after 24 hours
curl https://api.avalai.ir/v1/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="user_data" \
  -F file="@temp_document.pdf" \
  -F 'expires_after={"anchor":"created_at","seconds":86400}'

python=:# Upload a file that expires after 24 hours
file = client.files.create(
    file=open("temp_document.pdf", "rb"),
    purpose="user_data",
    expires_after={"anchor": "created_at", "seconds": 86400},  # 24 hours
)

print(f"File expires at: {file.expires_at}")

javascript=:// Upload a file that expires after 24 hours
const file = await client.files.create({
  file: fs.createReadStream("temp_document.pdf"),
  purpose: "user_data",
  expires_after: {
    anchor: "created_at",
    seconds: 86400, // 24 hours
  },
});

console.log(`File expires at: ${file.expires_at}`);

```

---

## Why Use the Files API?

### Before (Without Files API)

Every request sends the full file content:

```python
# Each request sends the entire base64-encoded file
for question in questions:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": question},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_encoded_file}"  # ~33% larger
                        },
                    },
                ],
            }
        ],
    )
```

### After (With Files API)

Upload once, reference by ID:

```python
# Upload once
file = client.files.create(file=open("document.pdf", "rb"), purpose="user_data")

# Reference by ID in multiple requests - no large payloads
for question in questions:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": question},
                    {
                        "type": "file",
                        "file": {"file_id": file.id},
                    },  # Just a short string
                ],
            }
        ],
    )
```

---

## Storage and Security

### Storage Infrastructure

Files are stored across enterprise-grade cloud providers:
- **AWS S3**
- **Google Cloud Platform (GCP)**
- **Cloudflare**

### Security Considerations

- Files are stored with enterprise-grade security measures
- Files are stored without encryption at rest (industry standard for high-throughput files, similar to other providers)
- Access is controlled by your API key - only your organization can access your files

### Bug Bounty Program

If you discover a security vulnerability, please report it to:
- **Email**: security@avalai.ir
- **Bug bounty** available for critical security issues that could compromise user data

---

## Related Links

- [Files API Reference](en/api-reference/files.md) - Complete API documentation with all endpoints
- [File Inputs Guide](en/guides/file-inputs.md) - Learn about different methods for sending files
- [Rate Limits](en/guides/rate-limits.md) - Understand tier-based rate limits
- [Chat Completions API](en/api-reference/chat.md) - Use files in chat completions
- [OCR API](en/api-reference/ocr.md) - Process documents with OCR

---

## Support

For questions or issues with the Files API beta:
- **Telegram**: [t.me/AvalAISupport](https://t.me/AvalAISupport)
- **Documentation**: [Files API Reference](en/api-reference/files.md)
