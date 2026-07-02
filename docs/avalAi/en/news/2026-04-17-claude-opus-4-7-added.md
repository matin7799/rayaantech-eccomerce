# New Model Added: Claude Opus 4.7

**Date:** 2026-04-17 / (1405-01-28)

## Summary

Claude Opus 4.7, Anthropic's most capable generally available model, is now available on AvalAI. Opus 4.7 delivers notable improvements over Opus 4.6 in advanced software engineering, high-resolution vision, instruction following, and long-horizon agentic work. It features a 1M token context window, 128K max output tokens, adaptive thinking, and a new `xhigh` effort level. Available via both `v1/chat/completions` and native Anthropic endpoint at `v1/messages` with smart routing across Anthropic API, AWS Bedrock, Azure AI, and Vertex AI.

---

## Details

### Anthropic

We announce access to **Claude Opus 4.7** (`claude-opus-4-7`), Anthropic's most capable generally available model for complex reasoning and agentic coding. [Documentation](en/providers/anthropic.md)

**Key Features:**

- **Advanced Software Engineering**: Notable improvement over Opus 4.6, with particular gains on the most difficult coding tasks. Handles complex, long-running tasks with rigor and consistency
- **High-Resolution Vision**: Accepts images up to 2,576 pixels on the long edge (~3.75 megapixels), more than three times prior Claude models
- **1M Token Context Window**: Full support for extended context window up to 1 million tokens
- **128K Output Tokens**: Support for larger output generation
- **Adaptive Thinking**: The only supported thinking-on mode on Opus 4.7 (extended thinking budgets removed)
- **New `xhigh` Effort Level**: Five effort levels (low, medium, high, xhigh, max) for finer control over reasoning vs latency
- **Task Budgets (Beta)**: Advisory token budgets across full agentic loops
- **Improved Instruction Following**: Takes instructions literally, substantially better compliance
- **File System Memory**: Better at writing and using file-system-based memory across sessions
- **Smart Routing**: Requests distributed across Anthropic API, AWS Bedrock, Azure AI, and Vertex AI for highest performance
- **Endpoint Support**: Available on `v1/chat/completions` and `v1/messages` (native Anthropic SDK)

**Pricing Details:**

| Model | Input | Cached Input | Cache Creation Input | Output |
|-------|-------|--------------|----------------------|--------|
| claude-opus-4-7 | $5.00/1M tokens | $1.50/1M tokens | $6.25/1M tokens | $25.00/1M tokens |

### Smart Routing

Claude Opus 4.7 uses the alias `claude-opus-4-7` with smart routing across all official Anthropic cloud providers. The underlying provider can be Anthropic API, AWS Bedrock, Azure AI, or Vertex AI, distributing requests to the best available provider for highest possible performance and availability.

When a request is routed through AWS Bedrock, for example, the response `model` field will reflect the Bedrock model ID (e.g., `global.anthropic.claude-opus-4-7`).

### API Request/Response Examples

#### Example Request (v1/chat/completions)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-7",
    "messages": [
      {
        "role": "user",
        "content": "Hi there!"
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-1af11...",
  "created": 1776413861,
  "model": "global.anthropic.claude-opus-4-7",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Hi there! 👋 How are you doing today? Is there anything I can help you with?",
        "role": "assistant",
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 25,
    "prompt_tokens": 9,
    "total_tokens": 34,
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "text_tokens": 25
    },
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": 0,
      "text_tokens": 9,
      "image_tokens": null,
      "video_tokens": null,
      "cache_creation_tokens": 0
    },
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  },
  "estimated_cost": {
    "unit": "0.0006700000",
    "irt": 102.64,
    "exchange_rate": 153200
  },
  "service_tier": "default"
}
```

> **Note:** The `model` field in the response may show the underlying provider's model ID (e.g., `global.anthropic.claude-opus-4-7` for AWS Bedrock) rather than the alias `claude-opus-4-7`. This is expected behavior with smart routing.

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-7",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to implement binary search."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use claude-opus-4-7 with smart routing across all Anthropic providers
completion = client.chat.completions.create(
    model="claude-opus-4-7",  # Smart routing across Anthropic, AWS, Azure, GCP
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to implement binary search.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Use claude-opus-4-7 with smart routing across all Anthropic providers
const completion = await client.chat.completions.create({
  model: "claude-opus-4-7",  // Smart routing across Anthropic, AWS, Azure, GCP
  messages: [
    {
      role: "user",
      content: "Write a Python function to implement binary search.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Using Anthropic SDK (v1/messages)

```language-selector
bash=:curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $AVALAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-7",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Explain adaptive thinking in Claude Opus 4.7."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-7",  # Smart routing enabled
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Explain adaptive thinking in Claude Opus 4.7.",
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
  model: "claude-opus-4-7",  // Smart routing enabled
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Explain adaptive thinking in Claude Opus 4.7.",
    },
  ],
});

console.log(message.content[0].text);

```

### Key Changes from Opus 4.6

- **Extended thinking budgets removed**: Setting `thinking: {"type": "enabled", "budget_tokens": N}` returns a 400 error. Use `thinking: {"type": "adaptive"}` instead.
- **Sampling parameters removed**: Setting non-default `temperature`, `top_p`, or `top_k` returns a 400 error.
- **Thinking content omitted by default**: Use `display: "summarized"` to opt back in.
- **Updated tokenizer**: Same input may use roughly 1x-1.35x as many tokens compared to Opus 4.6.
- **New `xhigh` effort level**: Between `high` and `max`, recommended for coding and agentic use cases.

---

## Related Links

- [Anthropic Models Overview](en/providers/anthropic.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Pricing Information](en/pricing.md)
- [Claude Smart Routing](en/news/2025-11-28-claude-base-models-smart-routing.md)
