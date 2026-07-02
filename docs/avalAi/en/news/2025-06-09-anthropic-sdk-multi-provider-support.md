# Anthropic SDK Now Supports Multiple Providers and New Models Added

**Date:** 2025-06-09

## Summary

AvalAI has expanded Anthropic SDK support to include multiple providers beyond Claude models, now supporting OpenAI, Anthropic, Bedrock, Vertex AI, Gemini, Azure, and Azure AI. Additionally, system performance has been significantly improved with a 30% latency reduction and doubled concurrent request capacity. New models have been added including Gemini 2.5 Pro Preview 06-05 and OpenAI's Codex Mini Latest.

---

## Details

We're excited to announce several major updates to the AvalAI platform, enhancing compatibility, performance, and model availability.

### Enhanced Anthropic SDK Support

Just days after adding support for Anthropic's official SDK, we've expanded its capabilities to work with multiple providers beyond Anthropic's own models. This significant enhancement allows developers to use the Anthropic SDK with chat models from:

- **OpenAI**
- **Anthropic**
- **AWS Bedrock**
- **Vertex AI**
- **Gemini**

Any chat model from these providers that supports the chat completion endpoint can now be used through the Anthropic official SDK and the "v1/messages" endpoint in Anthropic's API schema. This improvement further enhances AvalAI's API compatibility, providing developers with more flexibility in how they interact with our unified API system.

#### Python Example

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # AvalAI API endpoint without /v1
)

# Using an OpenAI model through Anthropic SDK
message = client.messages.create(
    model="gpt-4o",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
)
print(message.content)

# Using a Gemini model through Anthropic SDK
message = client.messages.create(
    model="gemini-2.5-pro",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
)
print(message.content)
```

#### JavaScript Example

```javascript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir", // AvalAI API endpoint without /v1
});

# Using an Anthropic model through Anthropic SDK
const message = await anthropic.messages.create({
    model: "anthropic.claude-opus-4-20250514-v1:0",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

### System Performance Improvements

We've made significant infrastructure upgrades to our API system, resulting in:

- **30% reduction in latency** across all API endpoints
- **Doubled system performance** for handling concurrent requests
- **Improved overall throughput** for all model providers

These enhancements ensure a more responsive experience, especially during peak usage times, and provide better reliability for production applications.

### New Models Added

#### Gemini

- **gemini-2.5-pro-preview-06-05**: A new snapshot of Gemini 2.5 Pro with enhanced benchmark performance compared to the previous gemini-2.5-pro-preview-05-06 version. This model maintains the same pricing while delivering improved capabilities.

#### OpenAI

- **codex-mini-latest**: A fast reasoning model optimized specifically for the Codex CLI. This model offers:
  - 200,000 token context window
  - 100,000 max output tokens
  - May 31, 2024 knowledge cutoff
  - Reasoning token support
  - Text and image input capabilities
  - Text output

##### codex-mini-latest Pricing
- **Input**: $1.50 per 1M tokens (Cached input: $0.375 per 1M tokens)
- **Output**: $6.00 per 1M tokens

##### Supported Features
- Streaming
- Function calling
- Structured outputs

##### Available Endpoints
- Chat Completions (v1/chat/completions)
- Responses (v1/responses)

For more details on rate limits and tier-specific information for these new models, please refer to our [rate limits documentation](en/guides/rate-limits.md).

---

## Related Links

- [Anthropic SDK Integration Guide](en/libraries.md)
- [Available Models Documentation](en/api-reference/chat.md)
- [Rate Limits and Pricing](en/guides/rate-limits.md)
- [API Reference](en/api-reference/introduction.md)
- [Previous Anthropic SDK Announcement](en/news/2025-06-03-anthropic-sdk-support-added.md)