# New Flagship Model Added: MiniMax M3

**Date:** 2026-06-07 / (1405-03-17)

## Summary

We announce the addition of MiniMax's new flagship model, `minimax-m3`. M3 brings frontier-level coding and agentic capabilities, a 1M-token context window powered by the MiniMax Sparse Attention (MSA) architecture, and native multimodal understanding for image and video input. The model is available on `v1/chat/completions`, with support via `v1/messages` and partial support on `v1/responses`.

---

## Details

### MiniMax

#### MiniMax M3

[`minimax-m3`](en/providers/minimax.md) is MiniMax's new flagship model, combining frontier coding capability, an ultra-long 1M-token context window, and native multimodality in a single model. Built on the proprietary MiniMax Sparse Attention (MSA) architecture, M3 supports autonomous task decomposition, tool invocation, and multi-step reasoning — providing a reliable foundation for AI coding assistants and automated workflows.

| Feature | Details |
|---------|---------|
| Context window | Up to 1,000,000 tokens (guaranteed minimum 512K) |
| Input pricing (≤512K) | $0.60 / 1M tokens |
| Cached input pricing (≤512K) | $0.12 / 1M tokens (80% cost reduction) |
| Output pricing (≤512K) | $2.40 / 1M tokens |
| Input pricing (above 512K) | $1.20 / 1M tokens |
| Cached input (above 512K) | $0.24 / 1M tokens |
| Output pricing (above 512K) | $4.80 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/messages` (full), `v1/responses` (partial) |

**Key Features:**

- **Frontier Coding & Agentic Capabilities**: Strong performance across software engineering and terminal execution benchmarks (SWE-Bench Pro 59.0%, Terminal-Bench 2.1 66.0%, MCP Atlas 74.2%)
- **1M Context Window**: Powered by MiniMax Sparse Attention (MSA) for long-range agent tasks, long-range coding, and long-video understanding, with a guaranteed minimum of 512K tokens
- **Native Multimodality**: Trained with mixed-modality data from step zero, supporting image and video input for deep alignment between textual and visual semantic spaces
- **Toggleable Thinking**: Switch reasoning on for complex agentic and long-horizon tasks, or off for faster, latency-sensitive scenarios — both modes share the same pricing
- **Autonomous Long-Horizon Tasks**: Capable of multi-hour autonomous execution with tool calling and self-validation
- **Context-Aware Pricing**: Standard rate for the common ≤512K input range, with a higher long-context rate only above 512K tokens

**Performance Highlights:**

- SWE-Bench Pro: 59.0%
- Terminal-Bench 2.1: 66.0%
- SWE-fficiency: 34.8%
- KernelBench Hard: 28.8%
- MCP Atlas: 74.2%
- BrowseComp: 83.5

---

## Pricing Summary

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) | Above 512K (Input / Cached / Output) |
|-------|---------------------|----------------------------|----------------------|--------------------------------------|
| `minimax-m3` | $0.60 | $0.12 | $2.40 | $1.20 / $0.24 / $4.80 |

---

## API Request/Response Examples

### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m3",
    "messages": [
      {
        "role": "user",
        "content": "Refactor this Python function for better performance and explain your reasoning."
      }
    ],
    "max_tokens": 4096
  }'
```

### Example Response

```json
{
  "id": "chatcmpl-minimax-m3-abc123",
  "created": 1780270281,
  "model": "minimax-m3",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here is the refactored function with explanations...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 320,
    "prompt_tokens": 28,
    "total_tokens": 348,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 28,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0007848000",
    "irt": 89.94,
    "exchange_rate": 114600
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
    "model": "minimax-m3",
    "messages": [
      {
        "role": "user",
        "content": "Build an agent harness that can parse a research paper and reproduce its core experiments."
      }
    ],
    "max_tokens": 8192
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m3",
    messages=[
        {
            "role": "user",
            "content": "Build an agent harness that can parse a research paper and reproduce its core experiments.",
        }
    ],
    max_tokens=8192,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "minimax-m3",
  messages: [
    {
      role: "user",
      content: "Build an agent harness that can parse a research paper and reproduce its core experiments.",
    },
  ],
  max_tokens: 8192,
});

console.log(response.choices[0].message.content);

```

### Anthropic SDK (v1/messages)

M3 is also available through the Anthropic Messages API format, with full support for native thinking blocks and tool use.

```language-selector
bash=:curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $AVALAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "minimax-m3",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "Design a fault-tolerant distributed task queue."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # Note: without /v1
)

message = client.messages.create(
    model="minimax-m3",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Design a fault-tolerant distributed task queue."}
    ],
)

print(message.content)

javascript=:import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",  // Note: without /v1
});

const message = await client.messages.create({
  model: "minimax-m3",
  max_tokens: 4096,
  messages: [
    { role: "user", content: "Design a fault-tolerant distributed task queue." }
  ],
});

console.log(message.content);

```

---

## Endpoint Support

- **`v1/chat/completions`**: Full support via the OpenAI-compatible API
- **`v1/messages`**: Full support via the Anthropic Messages API format, including native thinking blocks and tool use
- **`v1/responses`**: Partial support (text input/output and basic tool use)

---

## Documentation Links

- [MiniMax Models Documentation](en/providers/minimax.md)
- [Pricing Details](en/pricing.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Responses API Reference](en/api-reference/responses.md)
