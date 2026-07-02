# New Flagship Model Added: Claude Opus 4.8

**Date:** 2026-05-28 / (1405-03-07)

## Summary

Claude Opus 4.8, Anthropic's most capable generally available model to date, is now available on AvalAI. Opus 4.8 builds on Opus 4.7 with improvements in long-horizon agentic coding, reasoning effort calibration, tool triggering, and honesty. It features a native 1M token context window, 128K max output tokens, adaptive thinking, mid-conversation system messages, refusal stop details, and a lower 1,024-token cacheable prompt minimum. Available via `v1/chat/completions` with full support via `v1/messages` and partial support via `v1/responses`, all at the same pricing as Opus 4.7.

---

## Details

### Anthropic

We announce access to **Claude Opus 4.8** (`claude-opus-4-8`), Anthropic's most capable generally available model to date for complex reasoning, long-horizon agentic coding, and high-autonomy work. [Documentation](en/providers/anthropic.md)

**Key Features:**

- **Improved Long-Horizon Agentic Coding**: Better long-context handling, fewer compactions, and better compaction recovery for codebase-scale tasks
- **Reasoning Effort Calibration**: More reliable behavior at each effort level across a range of domains
- **Better Tool Triggering**: Fewer cases of skipping a tool call that the task required, fixing comment-verbosity and tool-calling issues seen with Opus 4.7
- **Increased Honesty**: Approximately four times less likely than Opus 4.7 to allow flaws in code it has written to pass unremarked, with more reliable flagging of uncertainty
- **Native 1M Token Context Window**: Default support on Claude API for extended context up to 1 million tokens
- **128K Output Tokens**: Support for larger output generation
- **Adaptive Thinking**: The only supported thinking-on mode on Opus 4.8 (extended thinking budgets removed)
- **Mid-Conversation System Messages**: Append updated instructions later in long-running conversations without breaking prompt cache hits or restating the full system prompt
- **Refusal Stop Details**: Publicly documented `stop_details` object on refusal responses, making it easier to route declined requests
- **Lower Prompt Cache Minimum**: 1,024-token minimum cacheable prompt length (down from Opus 4.7), enabling cache entries for shorter prompts
- **Effort Defaults**: `high` is the default effort level on Claude API and Claude Code; supports `low`, `medium`, `high`, `xhigh`, and `max`
- **Strong Computer Use & Browser Agents**: 84% on Online-Mind2Web, a meaningful jump over Opus 4.7
- **Improved Alignment**: Substantially lower rates of misaligned behavior versus Opus 4.7 and stronger prosocial traits
- **Smart Routing**: Distributed across Anthropic API, AWS Bedrock, Azure AI, and Vertex AI for highest performance and availability
- **Endpoint Support**: Available on `v1/chat/completions` (full support), `v1/messages` (full support), and `v1/responses` (partial support)

**Pricing Details:**

| Model | Input | Cached Input | Cache Creation Input | Output |
|-------|-------|--------------|----------------------|--------|
| claude-opus-4-8 | $5.00/1M tokens | $1.50/1M tokens | $6.25/1M tokens | $25.00/1M tokens |

> Pricing is unchanged from Claude Opus 4.7. AvalAI currently bills Opus 4.8 at the regular usage rate.

### Smart Routing

Claude Opus 4.8 uses the alias `claude-opus-4-8` with smart routing across all official Anthropic cloud providers. The underlying provider can be Anthropic API, AWS Bedrock, Azure AI, or Vertex AI, distributing requests to the best available provider for highest possible performance and availability.

When a request is routed through AWS Bedrock, for example, the response `model` field will reflect the Bedrock model ID (e.g., `global.anthropic.claude-opus-4-8`).

### API Request/Response Examples

#### Example Request (v1/chat/completions)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-8",
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
  "id": "chatcmpl-2af11...",
  "created": 1779148800,
  "model": "global.anthropic.claude-opus-4-8",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Hi there! 👋 How can I help you today?",
        "role": "assistant",
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 14,
    "prompt_tokens": 9,
    "total_tokens": 23,
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "text_tokens": 14
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
    "unit": "0.0003950000",
    "irt": 60.51,
    "exchange_rate": 153200
  },
  "service_tier": "default"
}
```

> **Note:** The `model` field in the response may show the underlying provider's model ID (e.g., `global.anthropic.claude-opus-4-8` for AWS Bedrock) rather than the alias `claude-opus-4-8`. This is expected behavior with smart routing.

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-8",
    "messages": [
      {
        "role": "user",
        "content": "Refactor a large multi-service codebase to use a shared error-handling middleware."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use claude-opus-4-8 with smart routing across all Anthropic providers
completion = client.chat.completions.create(
    model="claude-opus-4-8",  # Smart routing across Anthropic, AWS, Azure, GCP
    messages=[
        {
            "role": "user",
            "content": "Refactor a large multi-service codebase to use a shared error-handling middleware.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Use claude-opus-4-8 with smart routing across all Anthropic providers
const completion = await client.chat.completions.create({
  model: "claude-opus-4-8", // Smart routing across Anthropic, AWS, Azure, GCP
  messages: [
    {
      role: "user",
      content:
        "Refactor a large multi-service codebase to use a shared error-handling middleware.",
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
    "model": "claude-opus-4-8",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Explain mid-conversation system messages in Claude Opus 4.8."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-8",  # Smart routing enabled
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Explain mid-conversation system messages in Claude Opus 4.8.",
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
  model: "claude-opus-4-8", // Smart routing enabled
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Explain mid-conversation system messages in Claude Opus 4.8.",
    },
  ],
});

console.log(message.content[0].text);

```

### Mid-Conversation System Messages

Claude Opus 4.8 accepts `role: "system"` messages immediately after a user turn in the `messages` array. This lets you append updated instructions later in a long-running conversation without restating the full system prompt, preserving prompt cache hits on earlier turns and reducing input cost on agentic loops. No beta header is required.

```python
message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="You are an autonomous coding agent.",
    messages=[
        {"role": "user", "content": "Start the migration."},
        {"role": "assistant", "content": "Beginning migration..."},
        {"role": "user", "content": "Apply formatting checks."},
        {
            "role": "system",
            "content": "From now on, run the linter on every file you change.",
        },
        {"role": "user", "content": "Continue with src/services/."},
    ],
)
```

### Adaptive Thinking and Effort

Claude Opus 4.8 inherits the same adaptive thinking model from Opus 4.7. It does not support extended thinking budgets — set `thinking: {"type": "adaptive"}` and use the `effort` parameter to control reasoning depth. Default effort on Opus 4.8 is `high` on all surfaces, including Claude API and Claude Code. The five effort levels are `low`, `medium`, `high`, `xhigh`, and `max`.

```python
response = client.chat.completions.create(
    model="claude-opus-4-8",
    messages=[
        {
            "role": "user",
            "content": "Plan a multi-week migration of a monolith to microservices, accounting for data migration risk.",
        }
    ],
    extra_body={
        "thinking": {"type": "adaptive"},
        "output_config": {"effort": "xhigh"},
    },
)
```

### Key Changes from Opus 4.7

- **Mid-conversation system messages**: New capability to append `role: "system"` messages mid-conversation while preserving prompt cache hits.
- **Refusal stop details**: The `stop_details` object on refusal responses is now publicly documented for routing different classes of declined requests.
- **Lower prompt cache minimum**: Cacheable prompt length is now 1,024 tokens (down from Opus 4.7), enabling cache entries for shorter prompts.
- **Effort defaults**: Default effort level is now `high` on all surfaces (Claude API and Claude Code).
- **Improved tool triggering and compaction handling**: Long agentic traces stay on task with fewer derailments after compaction; fewer skipped tool calls.
- **API constraints unchanged**: Sampling parameters (`temperature`, `top_p`, `top_k`) and extended thinking budgets remain unsupported, identical to Opus 4.7.
- **Same pricing**: Regular usage pricing is identical to Opus 4.7 ($5/1M input, $25/1M output).

---

## Related Links

- [Anthropic Models Overview](en/providers/anthropic.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Pricing](en/pricing.md)
- [Rate Limits](en/guides/rate-limits.md)
