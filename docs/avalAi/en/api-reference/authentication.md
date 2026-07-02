# Authentication

This guide explains how to authenticate with the AvalAI API.

## API Keys

All requests to the AvalAI API must include an API key. Your API keys are available in the [AvalAI Dashboard](https://chat.avalai.ir/platform/home).

!> **Security Warning**: Keep your API keys secure! Do not expose them in client-side code or public repositories. API keys should only be used in server-side code.

## Authentication Methods

### Bearer Token Authentication

The recommended way to authenticate with the AvalAI API is using Bearer token authentication in the `Authorization` header:

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


### Client Libraries

When using client libraries, you can configure the API key and base URL during client initialization:

#### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)
```

#### JavaScript/TypeScript

```javascript
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Use environment variables
  baseURL: "https://api.avalai.ir/v1",
});
```

#### Go

```go
package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"
}
```

## API Key Best Practices

1. **Never share your API keys**: Treat your API keys like passwords.
2. **Use environment variables**: Store API keys in environment variables instead of hardcoding them.
3. **Create separate API keys**: Use different API keys for development, testing, and production environments.
4. **Restrict API key permissions**: Create keys with the minimum required permissions.
5. **Rotate API keys regularly**: Regenerate your API keys periodically for enhanced security.
6. **Monitor API key usage**: Regularly check your API usage for unauthorized activities.

## Organization IDs

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

If you belong to multiple organizations, you can specify which organization to use by providing an `AvalAI-Organization` header:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "AvalAI-Organization: org-abc123" \
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


In client libraries:

#### Python

```python
client = OpenAI(
    api_key="AVALAI_API_KEY",
    base_url="https://api.avalai.ir/v1",
    organization="org-abc123",
)
```

#### JavaScript/TypeScript

```javascript
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
  organization: "org-abc123",
});
```

## Rate Limiting

API requests are subject to rate limiting. When you exceed your rate limits, you'll receive a 429 Too Many Requests response. For more information, see the [Rate Limits](en/guides/rate-limits.md) documentation.

## API Key Management

You can manage your API keys in the [AvalAI Dashboard](https://chat.avalai.ir/platform/home):

1. Create new API keys
2. Delete existing API keys
3. View API key usage statistics
4. Set permissions and restrictions for API keys

## Troubleshooting Authentication Issues

If you're experiencing authentication issues:

1. Verify that you're using the correct API key
2. Check that the API key is active and not expired
3. Ensure you're using the correct authentication method
4. Confirm that the API key has the necessary permissions
5. Check your rate limits to ensure you haven't exceeded them

If you continue to experience issues, contact [AvalAI Support](https://avalai.ir/contact-us-avalai).
