# Flex Service Tier Launched: 50% Reduced Pricing for Select OpenAI Models

**Date:** 2025-12-15 / (1404-09-24)

## Summary

AvalAI introduces the Flex Service Tier, offering 50% reduced pricing for select OpenAI models. This new pricing tier provides significant cost savings for batch processing, non-time-sensitive workloads, and high-volume API usage in exchange for higher latency.

---

## Details

### What is the Flex Service Tier?

The Flex Service Tier is a new pricing option that offers **50% reduced costs** compared to the default tier for select OpenAI models. This tier is designed for workloads where cost savings are more important than response latency.

### Key Features

- **50% Cost Reduction**: Pay half the default rate for supported models
- **Opt-in Parameter**: Simply add `"service_tier": "flex"` to your API requests
- **Response Tracking**: All API responses include the `service_tier` field indicating which tier was used
- **Seamless Integration**: Works with existing OpenAI-compatible SDKs

### Supported Models

The Flex Service Tier is available for the following OpenAI models:

| Model | Model Aliases |
| :---- | :------------ |
| `gpt-5.2` | `gpt-5.2-2025-12-11` |
| `gpt-5.1` | `gpt-5.1-2025-11-13` |
| `gpt-5` | `gpt-5-2025-08-07` |
| `gpt-5-mini` | `gpt-5-mini-2025-08-07` |
| `gpt-5-nano` | `gpt-5-nano-2025-08-07` |
| `o3` | - |
| `o4-mini` | - |

### Flex Tier Pricing

Prices are per 1 million tokens and represent **50% savings** compared to default tier pricing.

| Model | Input | Cached Input | Output |
| :---- | :---- | :----------- | :----- |
| `gpt-5.2` | $0.875 | $0.0875 | $7.00 |
| `gpt-5.1` | $0.625 | $0.0625 | $5.00 |
| `gpt-5` | $0.625 | $0.0625 | $5.00 |
| `gpt-5-mini` | $0.125 | $0.0125 | $1.00 |
| `gpt-5-nano` | $0.025 | $0.0025 | $0.20 |
| `o3` | $1.00 | $0.25 | $4.00 |
| `o4-mini` | $0.55 | $0.138 | $2.20 |

### Important Considerations

> **⚠️ Latency and Reliability**
>
> The Flex tier has **higher latency** compared to the default tier:
> - Requests may take longer to process
> - Server timeout can be up to **900 seconds (15 minutes)**
> - Requests may time out or fail during processing
> - **Recommended for**: Batch processing, non-time-sensitive tasks, background jobs
> - **Not recommended for**: Interactive applications, real-time assistants, user-facing interfaces

> **⚠️ Credit Package Limitation**
>
> Credit packages do **NOT** cover Flex tier costs. When using `service_tier: "flex"`, costs are deducted from your standard account balance, not from credit package allocations.

---

## API Request/Response Examples

### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5-mini",
    "messages": [
      {
        "role": "user",
        "content": "Summarize the key points of machine learning."
      }
    ],
    "service_tier": "flex"
  }'
```

### Example Response

```json
{
  "id": "chatcmpl-123",
  "created": 1765789075,
  "model": "gpt-5-mini-2025-08-07",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. Key points include:\n\n1. **Supervised Learning**: Training with labeled data\n2. **Unsupervised Learning**: Finding patterns in unlabeled data\n3. **Reinforcement Learning**: Learning through trial and error\n4. **Deep Learning**: Neural networks with multiple layers\n5. **Applications**: Image recognition, NLP, recommendation systems",
        "role": "assistant",
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 150,
    "prompt_tokens": 20,
    "total_tokens": 170,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0
    },
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0
    }
  },
  "service_tier": "flex",
  "estimated_cost": {
    "unit": "0.0001525000",
    "irt": 20.03,
    "exchange_rate": 131350
  }
}
```

### Unsupported Model Error

If you attempt to use the Flex tier with an unsupported model:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [{"role": "user", "content": "hi"}],
    "service_tier": "flex"
  }'
```

**Error Response:**

```json
{
  "error": {
    "message": "Model 'gpt-5.4-mini' does not support service_tier='flex'. Flex tier is only available for: gpt-5, gpt-5-2025-08-07, gpt-5-mini, gpt-5-mini-2025-08-07, gpt-5-nano, gpt-5-nano-2025-08-07, gpt-5.1, gpt-5.1-2025-11-13, gpt-5.2, gpt-5.2-2025-12-11, o3, o4-mini. checkout https://docs.avalai.ir/fa/service-tiers for more information.",

    "type": "invalid_request",
    "param": null,
    "code": "invalid_request",
    "request_id": "019b214f-4f5d-7321-8a3a-59f89d473c7c"
  }
}
```

---

## SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5-mini",
    "messages": [
      {
        "role": "user",
        "content": "Summarize the key points of machine learning."
      }
    ],
    "service_tier": "flex"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use flex tier for cost savings on non-time-sensitive tasks
response = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key points of machine learning.",
        }
    ],
    service_tier="flex",
)

print(response.choices[0].message.content)
print(f"Service tier used: {response.service_tier}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Use flex tier for cost savings on non-time-sensitive tasks
const response = await client.chat.completions.create({
  model: "gpt-5-mini",
  messages: [
    {
      role: "user",
      content: "Summarize the key points of machine learning.",
    },
  ],
  service_tier: "flex"
});

console.log(response.choices[0].message.content);
console.log(`Service tier used: ${response.service_tier}`);

```

---

## Best Practices

### When to Use Flex Tier

- **Batch Processing**: Processing large amounts of data where time is not critical
- **Background Tasks**: Scheduled jobs, data analysis, content generation
- **Cost Optimization**: When cost reduction is the priority and you can tolerate delays
- **Non-Production Workloads**: Testing, development, experimentation

### When to Use Default (Standard) Tier

- **Interactive Applications**: Chatbots, real-time assistants, user-facing interfaces
- **Time-Sensitive Tasks**: When quick responses are required
- **Production Workflows**: Where reliability is critical
- **Credit Package Usage**: When you want costs covered by credit packages

### Implementing Retry Logic

For production applications using Flex tier, implement retry logic with fallback to default tier:

```python
def make_request_with_fallback(messages, model="gpt-5-mini"):
    # First, try flex tier for cost savings
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            service_tier="flex",
            timeout=900,  # 15 minute timeout
        )
        return response, "flex"
    except Exception as e:
        print(f"Flex tier failed: {e}. Falling back to default...")

    # Fall back to default tier
    response = client.chat.completions.create(
        model=model, messages=messages, service_tier="default"
    )
    return response, "default"
```

---

## Related Links

- [Service Tiers Documentation](en/service-tiers.md) - Comprehensive guide to service tiers
- [Pricing](en/pricing.md#flex-service-tier) - Complete pricing information
- [Credit Packages](en/credit-packages.md) - Credit package limitations with Flex tier
- [Chat Completions API](en/api-reference/chat.md) - API reference with service_tier parameter
- [Responses API](en/api-reference/responses.md) - Responses API with service_tier parameter