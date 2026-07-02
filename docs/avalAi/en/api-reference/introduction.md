# API Reference

Welcome to the AvalAI API reference documentation. AvalAI provides a unified API that's compatible with OpenAI's API structure, allowing you to access models from multiple providers through a single, consistent interface.

## Base URL

All API requests should be made to the following base URL:

```
https://api.avalai.ir/v1
```

## Authentication

All API endpoints require authentication. You must include your API key in the `Authorization` header of each request. See the [Authentication](en/api-reference/authentication.md) guide for more details.

## API Endpoints

### Chat Completions

The Chat Completions API is the core of the AvalAI platform, allowing you to generate conversational responses from various AI models.

[Learn more about Chat Completions →](en/api-reference/chat.md)

### Images

The Images API enables you to generate and edit images using AI models like DALL·E.

[Learn more about Images →](en/api-reference/images.md)

### Embeddings

The Embeddings API allows you to convert text into vector representations for use in search, clustering, and other machine learning tasks.

[Learn more about Embeddings →](en/api-reference/embeddings.md)

### Audio

The Audio API provides transcription, translation, and generation capabilities for audio content.

[Learn more about Audio →](en/api-reference/audio.md)

### Moderation

The Moderation API helps you identify potentially harmful content in text.

[Learn more about Moderation →](en/api-reference/moderation.md)

### User API

The User API provides precise cost tracking, transaction history, and usage analytics for your API calls. Perfect for resellers, enterprises, and production applications requiring accurate billing.

**Key Features:**
- 100% accurate cost tracking using [`x-request-id`](en/api-reference/response-headers.md#x-request-id) from response headers
- Transaction history with filtering capabilities
- Usage analytics and summaries
- Available within 30 seconds of API call

[Learn more about User API →](en/api-reference/user.md)

## Request and Response Formats

All API endpoints accept and return JSON data. Make sure to include the `Content-Type: application/json` header in your requests.

### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "messages": [{"role": "user", "content": "Hello!"}]
}'
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Hello!",
    "instructions": "You are a helpful assistant."
  }'
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Example Response

```json
{
  "id": "chatcmpl-123abc",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-5.5",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}
```

## Error Handling

The AvalAI API uses conventional HTTP response codes to indicate the success or failure of an API request. In general:

- 2xx: Success
- 4xx: Client error (e.g., invalid request, authentication error)
- 5xx: Server error

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Rate Limits

API requests are subject to rate limiting. When you exceed your rate limits, you'll receive a 429 Too Many Requests response. For more information, see the [Rate Limits](en/guides/rate-limits.md) guide.

## SDKs and Client Libraries

AvalAI is compatible with OpenAI's client libraries. You can use these libraries by specifying the AvalAI base URL:

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)
```

### JavaScript/TypeScript

```javascript
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});
```

### Go

```go
package main

import (
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"
}
```

## API Versioning

The AvalAI API is versioned to ensure backward compatibility as it evolves. The current version is `v1`.

## Next Steps

Explore the detailed documentation for each API endpoint:

- [Chat Completions](en/api-reference/chat.md)
- [Images](en/api-reference/images.md)
- [Embeddings](en/api-reference/embeddings.md)
- [Audio](en/api-reference/audio.md)
- [Moderation](en/api-reference/moderation.md)
- [User API](en/api-reference/user.md) - Cost tracking and usage analytics
- [Response Headers](en/api-reference/response-headers.md) - Understanding API response headers
