# Official Anthropic SDK Support Added to AvalAI

**Date:** 2025-06-03

## Summary

AvalAI now supports official Anthropic SDKs, allowing developers to use native Anthropic client libraries to access Claude models through our unified API system. This enhancement provides developers with greater flexibility, enabling them to choose between OpenAI-compatible SDKs or Anthropic's official SDKs while maintaining access to the same powerful Claude models.

---

## Details

We're excited to announce that AvalAI now supports official Anthropic SDKs in addition to our existing OpenAI-compatible API access. This means developers can now use Anthropic's native client libraries while benefiting from AvalAI's unified API system and competitive pricing.

### What's New

Previously, AvalAI supported accessing all models, including Anthropic's Claude series, through OpenAI-compatible SDKs and API schema. Now, users have the additional option to use **Official Anthropic SDKs** with their familiar syntax and features, providing a more native development experience for Claude models.

### Key Benefits

- **Developer Choice**: Choose between OpenAI SDK (unified approach) or Anthropic SDK (native approach)
- **Native Experience**: Use Anthropic's official SDKs with familiar syntax and parameter names
- **Beta Features**: Access Anthropic's beta namespace for experimental features
- **Consistent Authentication**: Same AvalAI API key works across both SDK approaches
- **No Breaking Changes**: Existing OpenAI SDK implementations continue to work unchanged

### Supported Languages

We support Anthropic's official SDKs for the following programming languages:

- **Python** - `anthropic` package
- **TypeScript/JavaScript** - `@anthropic-ai/sdk` package
- **Go** - `anthropic-sdk-go` package
- **Ruby** - `anthropic` gem

### Getting Started

#### Python

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir",  # AvalAI API endpoint without /v1
)

message = client.messages.create(
    model="anthropic.claude-3-5-haiku-20241022-v1:0",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(message.content)
```

#### TypeScript/JavaScript

```javascript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY, // Replace with your actual API key
  baseURL: "https://api.avalai.ir", // AvalAI API endpoint without /v1
});

const msg = await anthropic.messages.create({
  model: "anthropic.claude-3-5-haiku-20241022-v1:0",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});
console.log(msg);
```

#### Go

```go
package main

import (
	"context"
	"fmt"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

func main() {
	client := anthropic.NewClient(
		option.WithAPIKey("your-avalai-api-key"),    // Replace with your actual API key
		option.WithBaseURL("https://api.avalai.ir"), // AvalAI endpoint without /v1
	)

	message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
		Model:     anthropic.F(anthropic.ModelClaudeSonnet4_0),
		MaxTokens: anthropic.F(int64(1024)),
		Messages: anthropic.F([]anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock("What is a quaternion?")),
		}),
	})
	if err != nil {
		panic(err.Error())
	}
	fmt.Printf("%+v\n", message.Content)
}
```

#### Ruby

```ruby
require "bundler/setup"
require "anthropic"

anthropic = Anthropic::Client.new(
    api_key: "your-avalai-api-key", # Replace with your actual API key
    base_url: "https://api.avalai.ir" # AvalAI endpoint without /v1
)

message = anthropic.messages.create(
    max_tokens: 1024,
    messages: [{
        role: "user",
        content: "Hello, Claude"
    }],
    model: "anthropic.claude-3-5-haiku-20241022-v1:0"
)

puts(message.content)
```

### Beta Features Support

All Anthropic SDKs include beta namespace support for accessing experimental features:

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # AvalAI API endpoint without /v1
)

message = client.beta.messages.create(
    model="anthropic.claude-3-5-haiku-20241022-v1:0",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
    betas=["beta-feature-name"],
)
print(message.content)
```

### cURL Example

You can also use direct HTTP requests with Anthropic's API schema:

```bash
curl https://api.avalai.ir/v1/messages \
  --header "x-api-key: $AVALAI_API_KEY" \
  --header "content-type: application/json" \
  --data '{
    "model": "anthropic.claude-3-5-haiku-20241022-v1:0",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, world"}
    ]
  }'
```

### Available Claude Models

All Claude models available through AvalAI can be accessed using either OpenAI or Anthropic SDKs:

- **Claude Opus 4** - `anthropic.claude-opus-4-20250514-v1:0`
- **Claude Sonnet 4** - `anthropic.claude-sonnet-4-20250514-v1:0`
- **Claude 3.7 Sonnet** - `anthropic.claude-3-7-sonnet-20250219-v1:0`
- **Claude 3.5 Sonnet** - `anthropic.claude-3-5-sonnet-20241022-v2:0`
- **Claude 3.5 Haiku** - `anthropic.claude-3-5-haiku-20241022-v1:0`
- **Claude 3 Opus** - `anthropic.claude-3-opus-20240229-v1:0`
- **Claude 3 Sonnet** - `anthropic.claude-3-sonnet-20240229-v1:0`
- **Claude 3 Haiku** - `anthropic.claude-3-haiku-20240307-v1:0`

For a complete list of available models, see our [Anthropic Models documentation](en/providers/anthropic.md).

---

## Related Links

- [Updated Libraries Documentation](en/libraries.md) - Complete SDK setup guide
- [Quickstart Guide](en/quickstart.md) - Get started in minutes
- [Anthropic Models](en/providers/anthropic.md) - Available Claude models
- [API Reference](en/api-reference/introduction.md) - Detailed API documentation
- [Authentication Guide](en/api-reference/authentication.md) - API key setup and best practices
