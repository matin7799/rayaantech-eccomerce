# New Model Added: Claude Opus 4.6

**Date:** 2026-02-06 / (1404-11-17)

## Summary

Claude Opus 4.6, Anthropic's most powerful model upgrade, is now available on AvalAI. This model improves on its predecessor's coding skills with better planning, sustained agentic tasks, reliable operation in larger codebases, and enhanced debugging capabilities. Opus 4.6 features a 1M token context window in beta, state-of-the-art performance on Terminal-Bench 2.0, Humanity's Last Exam, and GDPval-AA benchmarks.

---

## Details

### Anthropic

We announce access to **Claude Opus 4.6** (`claude-opus-4-6`), Anthropic's upgraded flagship model with substantial improvements in agentic coding and reasoning capabilities. [Documentation](en/providers/anthropic.md)

**Key Features:**

- **Enhanced Coding**: Better planning, sustained agentic tasks, reliable operation in larger codebases, improved code review and debugging
- **1M Token Context Window**: Beta support for extended context window up to 1 million tokens
- **State-of-the-Art Performance**: Highest score on Terminal-Bench 2.0 (agentic coding), leads Humanity's Last Exam (multidisciplinary reasoning), outperforms GPT-5.2 on GDPval-AA
- **Knowledge Work Excellence**: Running financial analyses, research, creating documents, spreadsheets, and presentations
- **Improved Long-Context**: 76% on 8-needle 1M MRCR v2 vs 18.5% for Sonnet 4.5, significantly reduced context rot
- **Agent Teams**: New capability to spin up multiple agents working in parallel (Claude Code)
- **Adaptive Thinking**: Model can decide when deeper reasoning is helpful
- **Effort Controls**: Four effort levels (low, medium, high, max) for developers
- **Context Compaction**: Automatic summarization to perform longer tasks without hitting limits
- **128K Output Tokens**: Support for larger output generation
- **Endpoint Support**: Available on v1/chat/completions (full support), v1/messages (full support), and v1/responses (partial support)

**Pricing Details:**

| Model | Input | Cached Input | Cache Creation Input | Output |
|-------|-------|--------------|----------------------|--------|
| claude-opus-4-6 | $5.00/1M tokens | $1.50/1M tokens | $6.25/1M tokens | $25.00/1M tokens |

**Premium Pricing (above 200K tokens):**
- Input: $10.00/1M tokens
- Output: $37.50/1M tokens

### API Request/Response Examples

#### Example Request (v1/chat/completions)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-6",
    "messages": [
      {
        "role": "user",
        "content": "Analyze this codebase and suggest architectural improvements for better maintainability."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1738839600,
  "model": "claude-opus-4-6",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Based on my analysis of your codebase, I recommend the following architectural improvements...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 512,
    "prompt_tokens": 45,
    "total_tokens": 557,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 45,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0130225000",
    "irt": 1710.56,
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
    "model": "claude-opus-4-6",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "Help me debug this complex multi-file application and identify potential issues."
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
    "model": "claude-opus-4-6",
    "messages": [
      {
        "role": "user",
        "content": "Help me refactor this codebase for better maintainability."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="claude-opus-4-6",
    messages=[
        {
            "role": "user",
            "content": "Help me refactor this codebase for better maintainability.",
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
  model: "claude-opus-4-6",
  messages: [
    {
      role: "user",
      content: "Help me refactor this codebase for better maintainability.",
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
    "model": "claude-opus-4-6",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "Help me refactor this codebase for better maintainability."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Help me refactor this codebase for better maintainability.",
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
  model: "claude-opus-4-6",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Help me refactor this codebase for better maintainability.",
    },
  ],
});

console.log(message.content[0].text);

```

---

## Related Links

- [Anthropic Models Documentation](en/providers/anthropic.md)
- [API Reference - Chat Completions](en/api-reference/chat.md)
- [API Reference - Messages](en/api-reference/messages.md)
- [Pricing](en/pricing.md)
