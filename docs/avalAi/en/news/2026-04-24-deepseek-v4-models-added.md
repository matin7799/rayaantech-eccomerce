# New Flagship Models Added: DeepSeek-V4-Flash and DeepSeek-V4-Pro

**Date:** 2026-04-24 / (1405-02-04)

## Summary

We announce the addition of DeepSeek's new flagship models, `deepseek-v4-flash` and `deepseek-v4-pro`, on the `v1/chat/completions` endpoint. DeepSeek V4 introduces a 1M context window as standard, novel attention with token-wise compression and DeepSeek Sparse Attention (DSA), and dual thinking/non-thinking modes. The legacy `deepseek-chat` and `deepseek-reasoner` aliases are now routed to the V4 family and will be deprecated on July 24, 2026.

---

## Details

### DeepSeek

#### DeepSeek-V4-Flash

We introduce **DeepSeek-V4-Flash** (`deepseek-v4-flash`), a fast, efficient, and economical flagship with 284B total / 13B active parameters. Reasoning capabilities closely approach V4-Pro and performance is on par with V4-Pro on simple agent tasks, while offering smaller parameter size, faster response times, and highly cost-effective pricing. [Documentation](en/providers/deepseek.md)

#### DeepSeek-V4-Pro

We introduce **DeepSeek-V4-Pro** (`deepseek-v4-pro`), DeepSeek's most capable flagship with 1.6T total / 49B active parameters. Per DeepSeek's benchmarks, V4-Pro delivers open-source SOTA in Agentic Coding benchmarks, world-class reasoning that rivals top closed-source models in Math/STEM/Coding, and rich world knowledge that trails only Gemini-3.1-Pro among current open models. [Documentation](en/providers/deepseek.md)

**Key Features (both models):**

- **Context Window**: 1M tokens (default across all DeepSeek V4 services)
- **Max Output Tokens**: Up to 384K
- **Dual Modes**: Supports both thinking (default) and non-thinking modes — toggle via `extra_body={"thinking": {"type": "enabled"/"disabled"}}`
- **Thinking Effort Control**: `reasoning_effort: "high"/"max"` (low/medium are mapped to high, xhigh is mapped to max)
- **Structural Innovation**: Token-wise compression + DeepSeek Sparse Attention (DSA) for peak long-context efficiency
- **Advanced Capabilities**: JSON Output, Tool Calls, Chat Prefix Completion (Beta)
- **FIM Completion (Beta)**: Available in non-thinking mode only
- **Agent Integration**: Seamlessly integrated with leading AI agents like Claude Code, OpenClaw, and OpenCode
- **Endpoint Support**: Available on [`v1/chat/completions`](en/api-reference/chat.md)

**Pricing Details:**

| Model | Input (Cache Miss) | Input (Cache Hit) | Output |
|-------|--------------------|-------------------|--------|
| deepseek-v4-flash | $0.14 / 1M tokens | $0.028 / 1M tokens | $0.28 / 1M tokens |
| deepseek-v4-pro | $1.74 / 1M tokens | $0.145 / 1M tokens | $3.48 / 1M tokens |

#### Model Routing and Legacy Aliases

To preserve backward compatibility, AvalAI now routes the legacy aliases to the new V4 flagships:

- **`deepseek-chat`** → routed to **`deepseek-v4-flash`** (non-thinking mode)
- **`deepseek-reasoner`** → routed to **`deepseek-v4-pro`** (thinking mode)

**Pricing impact for legacy aliases:**

- **`deepseek-chat`** pricing is unchanged — same as `deepseek-v4-flash` ($0.14 / $0.028 / $0.28 per 1M tokens for input / cached input / output).
- **`deepseek-reasoner`** pricing has been raised to match `deepseek-v4-pro` ($1.74 / $0.145 / $3.48 per 1M tokens for input / cached input / output) to reflect the upgrade in underlying capability.

#### ⚠️ Deprecation Notice

Per DeepSeek's official announcement, `deepseek-chat` and `deepseek-reasoner` will be fully retired and inaccessible after **July 24, 2026, 15:59 (UTC)**. Users are encouraged to migrate to the explicit `deepseek-v4-flash` and `deepseek-v4-pro` model names. See the [Deprecations page](en/deprecations.md#deepseek-chat--reasoner-models-deprecation-date-july-24-2026) for full details.

### API Request/Response Examples

#### Example Request — DeepSeek-V4-Flash (non-thinking mode)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {
        "role": "user",
        "content": "Explain the key benefits of DeepSeek Sparse Attention (DSA) in one paragraph."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-deepseek-v4-flash-xxxxx",
  "created": 1745481600,
  "model": "deepseek-v4-flash",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "DeepSeek Sparse Attention (DSA) combines token-wise compression with a sparse attention pattern to dramatically reduce compute and memory cost in long-context scenarios. This enables 1M-token default context across DeepSeek services while keeping inference fast and economical.",
        "role": "assistant",
        "reasoning_content": null,
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 58,
    "prompt_tokens": 22,
    "total_tokens": 80,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": 0,
      "text_tokens": 22,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0000193200",
    "irt": 2.21,
    "exchange_rate": 114600
  }
}
```

#### Example Request — DeepSeek-V4-Pro (thinking mode)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [
      {
        "role": "user",
        "content": "Design a fault-tolerant architecture for a global payment processor that handles 50,000 TPS."
      }
    ],
    "reasoning_effort": "high"
  }'
```

#### Example Response (thinking mode)

```json
{
  "id": "chatcmpl-deepseek-v4-pro-xxxxx",
  "created": 1745481700,
  "model": "deepseek-v4-pro",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here is a fault-tolerant architecture for a global payment processor ...",
        "reasoning_content": "The user wants a fault-tolerant architecture for 50K TPS globally. I should cover regional active-active deployment, consensus for ledger consistency, idempotency keys, saga-based orchestration, and disaster recovery ...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 1842,
    "prompt_tokens": 35,
    "total_tokens": 1877,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": 0,
      "text_tokens": 35,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0064703100",
    "irt": 741.5,
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
    "model": "deepseek-v4-flash",
    "messages": [
      {
        "role": "user",
        "content": "Summarize the advantages of a 1M token context window for document analysis."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Non-thinking mode (fast, economical)
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the advantages of a 1M token context window for document analysis.",
        }
    ],
    extra_body={"thinking": {"type": "disabled"}},
)

print(response.choices[0].message.content)

# Thinking mode (deep reasoning)
reasoning_response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {
            "role": "user",
            "content": "Prove that the sum of the first n odd numbers equals n^2.",
        }
    ],
    reasoning_effort="high",
    extra_body={"thinking": {"type": "enabled"}},
)

print(reasoning_response.choices[0].message.reasoning_content)
print(reasoning_response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Non-thinking mode (fast, economical)
const response = await client.chat.completions.create({
  model: "deepseek-v4-flash",
  messages: [
    {
      role: "user",
      content: "Summarize the advantages of a 1M token context window for document analysis.",
    },
  ],
});

console.log(response.choices[0].message.content);

// Thinking mode (deep reasoning)
const reasoningResponse = await client.chat.completions.create({
  model: "deepseek-v4-pro",
  messages: [
    {
      role: "user",
      content: "Prove that the sum of the first n odd numbers equals n^2.",
    },
  ],
  reasoning_effort: "high",
});

console.log(reasoningResponse.choices[0].message.reasoning_content);
console.log(reasoningResponse.choices[0].message.content);

```

### Migration Guidance

- **No action required for existing integrations**: calls to `deepseek-chat` and `deepseek-reasoner` continue to work and are automatically routed to the V4 family until **July 24, 2026**.
- **Recommended**: update your model identifiers to `deepseek-v4-flash` or `deepseek-v4-pro` to benefit from the 1M context, explicit mode control via the `thinking` parameter, and to avoid disruption when the legacy aliases are retired.
- **Pricing awareness**: if you currently use `deepseek-reasoner`, note that its output pricing now reflects `deepseek-v4-pro` ($3.48 / 1M tokens output) to match the upgraded underlying model.

---

## Related Links

- [DeepSeek Models Documentation](en/providers/deepseek.md)
- [Deprecations](en/deprecations.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Pricing Information](en/pricing.md)
