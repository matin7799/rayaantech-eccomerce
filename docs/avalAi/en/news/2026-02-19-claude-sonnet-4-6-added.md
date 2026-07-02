# New Model Added: Claude Sonnet 4.6

**Date:** 2026-02-19 / (1404-11-30)

## Summary

Claude Sonnet 4.6, Anthropic's most capable Sonnet model, is now available on AvalAI. This full upgrade improves coding skills, computer use, long-context reasoning, agent planning, knowledge work, and design. Sonnet 4.6 features a 1M token context window in beta and matches or exceeds Opus-class performance on many real-world tasks while maintaining Sonnet-level pricing.

---

## Details

### Anthropic

We announce access to **Claude Sonnet 4.6** (`claude-sonnet-4-6`), Anthropic's upgraded Sonnet model with substantial improvements across coding, computer use, and agentic capabilities. [Documentation](en/providers/anthropic.md)

**Key Features:**

- **Full Model Upgrade**: Improvements across coding, computer use, long-context reasoning, agent planning, knowledge work, and design
- **1M Token Context Window**: Beta support for extended context window up to 1 million tokens
- **Computer Use Excellence**: Major improvement in computer use skills compared to prior Sonnet models, with enhanced prompt injection resistance
- **Opus-Class Performance**: Approaches Opus-level intelligence at Sonnet pricing on real-world, economically valuable office tasks
- **Coding Improvements**: 70% preference over Sonnet 4.5 in Claude Code, better context reading before modifying code, consolidates shared logic rather than duplicating
- **Even Beats Opus 4.5**: Users preferred Sonnet 4.6 to Opus 4.5 59% of the time with significantly less overengineering and "laziness"
- **Long-Context Reasoning**: Reasons effectively across entire codebases, lengthy contracts, or dozens of research papers
- **Adaptive Thinking**: Supports both adaptive thinking and extended thinking
- **Context Compaction**: Beta support for automatic summarization as conversations approach limits
- **Endpoint Support**: Available on v1/chat/completions (full support), v1/messages (full support), and v1/responses (partial support)

**Pricing Details:**

| Model | Input | Cached Input | Cache Creation Input | Output |
|-------|-------|--------------|----------------------|--------|
| claude-sonnet-4-6 | $3.00/1M tokens | $1.50/1M tokens | $3.75/1M tokens | $15.00/1M tokens |

### API Request/Response Examples

#### Example Request (v1/chat/completions)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [
      {
        "role": "user",
        "content": "Review this code and suggest improvements for better maintainability."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1739956800,
  "model": "claude-sonnet-4-6",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "I'll review your code and provide suggestions for improved maintainability...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 256,
    "prompt_tokens": 32,
    "total_tokens": 288,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 32,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0039360000",
    "irt": 517.11,
    "exchange_rate": 131350
  }
}
```

#### Example Request (v1/messages - Native Anthropic Format)

```bash
curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "Help me refactor this multi-file application for better modularity."
      }
    ]
  }'
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [
      {
        "role": "user",
        "content": "Help me improve this codebase for better maintainability."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "user",
            "content": "Help me improve this codebase for better maintainability.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [
    {
      role: "user",
      content: "Help me improve this codebase for better maintainability.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

**Native Anthropic SDK Format:**

```language-selector
bash=:curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "Help me improve this codebase for better maintainability."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Help me improve this codebase for better maintainability.",
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
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Help me improve this codebase for better maintainability.",
    },
  ],
});

console.log(message.content[0].text);

```

---

## Related Links

- [Anthropic Models Documentation](en/providers/anthropic.md)
- [Pricing Details](en/pricing.md)
- [API Reference - Chat Completions](en/api-reference/chat.md)
- [API Reference - Messages](en/api-reference/messages.md)
