# Claude Base Models with Smart Routing: Higher Rate Limits Across Multi-Cloud Providers

**Date:** 2025-11-28 / (1404-09-07)

## Summary

AvalAI introduces Claude base model namespaces with smart routing across all official Anthropic cloud providers. Users can now access Claude models through simplified model names (`claude-opus-4-5`, `claude-sonnet-4-5`, `claude-opus-4-1`, `claude-haiku-4-5`) with significantly higher rate limits thanks to intelligent load distribution across Anthropic (Claude.ai), AWS Bedrock, Google Cloud Platform, and Microsoft Azure.

---

## Details

### Smart Routing for Claude Models

We announce the availability of Claude base model namespaces with smart routing capabilities. This feature automatically distributes API requests across all official Anthropic cloud providers, delivering significantly higher throughput and rate limits compared to single-provider access.

**Supported Providers:**

1. **Anthropic (Claude.ai)** - Direct Anthropic API
2. **AWS Bedrock** - Amazon Web Services
3. **Google Cloud Platform (GCP)** - Vertex AI
4. **Microsoft Azure** - Azure AI

### New Base Model Names

The following base model namespaces are now available:

| Base Model | AWS Bedrock Model ID | Context Window |
|------------|---------------------|----------------|
| `claude-opus-4-5` | `anthropic.claude-opus-4-5-20251101-v1:0` | 200K tokens |
| `claude-sonnet-4-5` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | 200K tokens |
| `claude-opus-4-1` | `anthropic.claude-opus-4-1-20250805-v1:0` | 200K tokens |
| `claude-haiku-4-5` | `anthropic.claude-haiku-4-5-20251001-v1:0` | 200K tokens |

### Rate Limit Improvements

Smart routing enables dramatically higher rate limits by distributing load across multiple cloud providers. Here's a comparison for Tier 1 accounts:

**Tier 1 Rate Limits Comparison:**

| Model | Namespace | Requests/min | Tokens/min |
|-------|-----------|--------------|------------|
| Claude Opus 4.5 | `anthropic.claude-opus-4-5-20251101-v1:0` (Bedrock) | 1 | 40,000 |
| Claude Opus 4.5 | `claude-opus-4-5` (Base) | **10** | 30,000 |
| Claude Sonnet 4.5 | `anthropic.claude-sonnet-4-5-20250929-v1:0` (Bedrock) | 2 | 200,000 |
| Claude Sonnet 4.5 | `claude-sonnet-4-5` (Base) | **25** | 30,000 |
| Claude Opus 4.1 | `anthropic.claude-opus-4-1-20250805-v1:0` (Bedrock) | 1 | 200,000 |
| Claude Opus 4.1 | `claude-opus-4-1` (Base) | **5** | 30,000 |
| Claude Haiku 4.5 | `anthropic.claude-haiku-4-5-20251001-v1:0` (Bedrock) | 25 | 80,000 |
| Claude Haiku 4.5 | `claude-haiku-4-5` (Base) | 25 | 50,000 |

**Tier 5 Rate Limits (Enterprise Grade):**

| Base Model | Requests/min | Tokens/min |
|------------|--------------|------------|
| `claude-opus-4-5` | 1,500 | 4,000,000 |
| `claude-sonnet-4-5` | 1,500 | 4,000,000 |
| `claude-opus-4-1` | 1,500 | 4,000,000 |
| `claude-haiku-4-5` | 1,500 | 8,000,000 |

### Pricing

Base model pricing remains identical to the original AWS Bedrock model pricing:

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| `claude-opus-4-5` | $5.00/1M tokens | $1.50/1M tokens | $25.00/1M tokens |
| `claude-sonnet-4-5` | $3.00/1M tokens | $1.50/1M tokens | $15.00/1M tokens |
| `claude-opus-4-1` | $15.00/1M tokens | $7.50/1M tokens | $75.00/1M tokens |
| `claude-haiku-4-5` | $1.00/1M tokens | $0.50/1M tokens | $5.00/1M tokens |

### Migration Guide

Migrating to base model namespaces is straightforward - simply update the model name in your API calls:

**Before (AWS Bedrock namespace):**
```python
model = "anthropic.claude-opus-4-5-20251101-v1:0"
```

**After (Base model namespace):**
```python
model = "claude-opus-4-5"
```

No other code changes are required. The API interface, response format, and all capabilities remain identical.

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Explain the benefits of multi-cloud architecture for AI workloads."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1732789200,
  "model": "claude-opus-4-5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Multi-cloud architecture for AI workloads offers several key benefits:\n\n1. **High Availability**: Distributing workloads across multiple cloud providers ensures redundancy and minimizes downtime.\n\n2. **Rate Limit Optimization**: By routing requests to multiple providers, you can achieve higher aggregate throughput than any single provider offers.\n\n3. **Cost Optimization**: Different providers may offer better pricing for specific regions or usage patterns.\n\n4. **Vendor Independence**: Avoiding lock-in to a single provider increases flexibility and negotiating leverage.\n\n5. **Geographic Coverage**: Access to data centers across different regions improves latency for global applications.",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 150,
    "prompt_tokens": 18,
    "total_tokens": 168,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 18,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0038400000",
    "irt": 440.06,
    "exchange_rate": 114600
  }
}
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function for binary search."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use base model namespace for smart routing
completion = client.chat.completions.create(
    model="claude-opus-4-5",  # Smart routing across all Anthropic providers
    messages=[
        {
            "role": "user",
            "content": "Write a Python function for binary search.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Use base model namespace for smart routing
const completion = await client.chat.completions.create({
  model: "claude-opus-4-5",  // Smart routing across all Anthropic providers
  messages: [
    {
      role: "user",
      content: "Write a Python function for binary search.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Using Anthropic SDK

Base model namespaces are also supported with the Anthropic official SDK:

```language-selector
bash=:curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Explain smart routing in cloud architecture."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-5",  # Smart routing enabled
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Explain smart routing in cloud architecture.",
        }
    ],
)

print(message.content[0].text)

javascript=:import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",
});

const message = await client.messages.create({
  model: "claude-opus-4-5",  // Smart routing enabled
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Explain smart routing in cloud architecture.",
    },
  ],
});

console.log(message.content[0].text);

```

### Backward Compatibility

AWS Bedrock model namespaces remain fully supported. You can continue using the full model IDs if you prefer direct Bedrock access:

- `anthropic.claude-opus-4-5-20251101-v1:0`
- `anthropic.claude-sonnet-4-5-20250929-v1:0`
- `anthropic.claude-opus-4-1-20250805-v1:0`
- `anthropic.claude-haiku-4-5-20251001-v1:0`

However, we recommend migrating to base model namespaces to benefit from higher rate limits and improved availability through smart routing.

---

## Related Links

- [Anthropic Models Overview](en/providers/anthropic.md)
- [Rate Limits Documentation](en/rate-limits.md)
- [Pricing Information](en/pricing.md)
- [Production Best Practices](en/guides/production-best-practices.md)