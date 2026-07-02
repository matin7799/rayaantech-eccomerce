# Quick Start Guide

This guide will help you get started with the AvalAI platform in minutes.

## 1. Sign Up and Get API Keys

1. Create an account at [AvalAI Dashboard](https://chat.avalai.ir/platform/home)
2. Navigate to the API Keys section
3. Generate a new API key
4. Store your API key securely - it will only be shown once!

## 2. Install the Client Library

AvalAI supports three SDK approaches:

<div class="doc-card-grid">
  <div class="doc-card"><span class="doc-card-title">OpenAI-Compatible SDKs</span><span class="doc-card-desc"><strong>Unified approach</strong> — Access all models from multiple providers with consistent syntax.</span></div>
  <div class="doc-card"><span class="doc-card-title">Anthropic Official SDKs</span><span class="doc-card-desc"><strong>Native approach</strong> — Use Anthropic's official SDKs to access models from Anthropic, OpenAI, AWS Bedrock, Vertex AI, and Gemini with native syntax.</span></div>
  <div class="doc-card"><span class="doc-card-title">Google GenAI SDK</span><span class="doc-card-desc"><strong>Native approach</strong> — Use Google's official GenAI SDK for native access to Gemini models with Google's native API schema.</span></div>
</div>

### OpenAI-Compatible SDKs

Choose your preferred language:

### Python

```bash
pip install openai
```

### Node.js

```bash
npm install openai
```

### Go

```bash
go get github.com/openai/openai-go
```

### PHP

```bash
composer require openai-php/client
```

## 3. Available Domains

AvalAI provides multiple domains to ensure optimal connectivity based on your location and network conditions.

### 1. Primary Domain - Recommended
- **Address**: `api.avalai.ir`
- **CDN**: Global
- **Best for**: users seeking optimal performance with lowest latency

### Usage

Users can choose any of these domains based on their network conditions. All API endpoints and features are identical across all domains.

#### Python Example

```python
from openai import OpenAI

# Using primary domain
client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)
```

## 4. Configure the Client

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
  apiKey: process.env.AVALAI_API_KEY, // Replace with your actual API key
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});
```

### Go

```go
package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key") // Replace with your actual API key
	client.BaseURL = "https://api.avalai.ir/v1"       // AvalAI API endpoint
}
```

### PHP

```php
<?php

require_once 'vendor/autoload.php';

// Using OpenAI PHP client library (https://github.com/openai-php/client)
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
```

## 5. Make Your First API Call

Let's make a simple chat completion request:

### Python

```python
completion = client.chat.completions.create(
    model="gpt-5.5",  # You can use any supported model
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, world!"},
    ],
)

print(completion.choices[0].message.content)
```

### JavaScript/TypeScript

```javascript
const completion = await client.chat.completions.create({
  model: "gpt-5.5", // You can use any supported model
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, world!" },
  ],
});

console.log(completion.choices[0].message.content);
```

### Go

```go
resp, err := client.CreateChatCompletion(
	context.Background(),
	openai.ChatCompletionRequest{
		Model: "gpt-5.5", // You can use any supported model
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "You are a helpful assistant.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: "Hello, world!",
			},
		},
	},
)

if err != nil {
	fmt.Printf("ChatCompletion error: %v\n", err)
	return
}

fmt.Println(resp.Choices[0].Message.Content)
```

### PHP

```php
try {
 // Make the chat completion request
 $response = $client->chat()->create([
 'model' => 'gpt-5.5', // You can use any supported model
 'messages' => [
 ['role' => 'system', 'content' => 'You are a helpful assistant.'],
 ['role' => 'user', 'content' => 'Hello, world!']
 ]
 ]);

 // Output the response content
 echo $response->choices[0]->message->content;
} catch (\Exception $e) {
 echo "Error: " . $e->getMessage() . "\n";
}
```

## 6. Using Provider-Specific Parameters

When working with non-OpenAI providers through AvalAI (such as Stability AI, Anthropic, etc.), you may need to use parameters that aren't directly supported by the OpenAI client library. AvalAI provides two ways to pass these parameters.

### Using extra_body

The [`extra_body`](en/guides/provider-specific-params.md)  parameter allows you to pass any additional parameters required by the specific provider:

### Python

```python
# Example using provider-specific parameters
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, world!"},
    ],
    extra_body={"provider_param1": "value1", "provider_param2": "value2"},
)
```

### JavaScript/TypeScript

#### Using Undocumented Parameters Directly

For TypeScript users, you can also pass undocumented parameters directly by using `// @ts-expect-error`:

```javascript
// Example using undocumented parameters directly
const response = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, world!" },
  ],
  // @ts-expect-error undocumented parameter
  provider_param1: "value1",
  // @ts-expect-error another undocumented parameter
  provider_param2: "value2",
});
```

This library doesn't validate at runtime that the request matches the type, so any extra values you send will be sent as-is to the provider's API. For GET requests, these extra parameters will be in the query string, while for all other requests, they will be sent in the body.

If you want to explicitly send extra arguments, you can also do so with the `query`, `body`, and `headers` request options.

## 7. Explore Available Models

AvalAI provides access to models from multiple providers. You can specify which model to use in your requests:

- OpenAI models: `gpt-5.5`, `gpt-5.4-pro`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`, `gpt-5.3-chat`, `gpt-5.3-codex`, `gpt-image-2`, etc.
- Anthropic models: `claude-opus-4-7`, `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5`, etc.
- Google models: `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite-preview`, `gemini-3.1-flash-image`, `gemini-embedding-2`, `gemini-3-flash-preview`, `gemini-2.5-pro`, `gemma-4-26b-a4b-it`, etc.
- XAI models: `grok-4.20-reasoning`, `grok-4.20-non-reasoning`, `grok-4-1-fast-reasoning`, etc.
- DeepSeek models: `deepseek-v4-pro`, `deepseek-v4-flash`, `deepseek-chat`, etc.
- Alibaba models: `qwen3.6-plus`, `qwen3.6-flash`, `qwen3.6-max-preview`, `qwen-image-2.0-pro`, `qwen-image-2.0`, etc.
- Moonshot.ai models: `kimi-k2.6`, `kimi-k2`, `kimi-latest`, etc.
- Z.AI models: `glm-5.1`, `glm-5v-turbo`, `glm-5-turbo`, etc.
- MiniMax models: `minimax-m2.7`, `minimax-m2.7-highspeed`, `minimax-m2.5`, etc.
- Meta, Mistral, Cohere, Cloudflare, BytePlus, and other provider models are also available.

### List Available Models via API

You can retrieve a list of all available models programmatically:

```python
# List all models
models = client.models.list()
for model in models.data:
    print(f"{model.id} - {model.owned_by}")

# Get detailed info for a specific model (includes pricing, capabilities, rate limits)
model = client.models.retrieve("gpt-5.5")
print(model)
```

```bash
# Public endpoint (no auth required)
curl https://api.avalai.ir/public/models

# Authenticated endpoint
curl https://api.avalai.ir/v1/models -H "Authorization: Bearer $AVALAI_API_KEY"

# Get specific model details
curl https://api.avalai.ir/v1/models/gpt-5.5 -H "Authorization: Bearer $AVALAI_API_KEY"
```

For a complete list of available models, see the [Models documentation](en/models/model-details.md) or the [Models API Reference](en/api-reference/models.md).

## 8. Track API Costs and Usage (Optional)

For production applications, resellers, and enterprises, AvalAI provides the **User API** for precise cost tracking and usage analytics.

### Get the Request ID

Every API response includes an [`x-request-id`](en/api-reference/response-headers.md#x-request-id) header that uniquely identifies the request:

```python
# Python example - capture response headers
response = client.chat.completions.create(
    model="gpt-5.4-mini", messages=[{"role": "user", "content": "Hello!"}]
)

# The response object doesn't expose headers directly in OpenAI SDK
# To get headers, use HTTP client directly or check your application logs
```

```bash
# Using curl to see headers
curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-5.4-mini", "messages": [{"role": "user", "content": "hi"}]}'

# Look for: x-request-id: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a
```

### Get Precise Costs

Use the [`x-request-id`](en/api-reference/response-headers.md#x-request-id) to lookup exact costs (available within 30 seconds):

```python
import requests

# Lookup precise cost
response = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers={
        "Authorization": f"Bearer {your_api_key}",
        "Content-Type": "application/json",
    },
    json={"transaction_ids": ["019ac4a0-a8f4-7041-845f-3ea8f15dcf1a"]},
)

data = response.json()
# Returns exact cost in USD and IRT with full transaction details
```

### Why Use User API?

- **100% Accurate Costs** - Unlike `estimated_cost` in responses, User API provides guaranteed accurate costs
- **Billing for Resellers** - Charge customers based on actual costs without discrepancies
- **Usage Analytics** - Track spending by model, provider, date, or hour
- **Audit Trail** - Complete transaction history for compliance

**Learn More:**
- [User API Documentation](en/api-reference/user.md) - Complete API reference
- [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Step-by-step guide for accurate billing
- [Enterprise Usage Guide](en/resellers/enterprise-guide.md) - Advanced patterns for large-scale deployments

## 9. Get Help with Documentation

**💡 Pro Tip:** You can copy any documentation page URL from docs.avalai.ir and paste it directly into your prompt at [chat.avalai.ir](https://chat.avalai.ir) (AvalAI Chat Platform). When you include a docs URL in your message, the AI models can access that page's content, allowing you to:

- Ask any model to explain specific documentation sections
- Get help debugging issues using the relevant docs
- Request implementation examples based on the documentation
- Clarify complex concepts with interactive Q&A

Simply paste the documentation URL into your chat message along with your question, and the model will fetch and use that documentation to assist you. This enables faster debugging and implementation by combining our comprehensive documentation with AI-powered assistance.

## 10. Next Steps

- Learn about [Anthropic SDK Multi-Provider Support](en/news/2025-06-09-anthropic-sdk-multi-provider-support.md) - Use official Anthropic SDKs for multiple provider models
- Read about the original [Anthropic SDK Support](en/news/2025-06-03-anthropic-sdk-support-added.md) announcement
- Explore the [Libraries Documentation](en/libraries.md) for complete SDK setup guides including Anthropic SDKs
- Explore the [API Reference](en/api-reference/introduction.md) for detailed information about all available endpoints
- Learn about [Authentication](en/api-reference/authentication.md) methods and best practices
- Check out our [Guides](en/guides/production-best-practices.md) for tips on using the API effectively
- Review our [API Content Policy](en/safety/content-policy.md) for details on data handling and privacy
