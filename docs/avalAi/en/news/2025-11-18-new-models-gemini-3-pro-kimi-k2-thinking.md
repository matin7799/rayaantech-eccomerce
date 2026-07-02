# New Advanced Models: Gemini 3 Pro Preview and Kimi K2 Thinking

**Date:** 2025-11-18 / (1404-08-27)

## Summary

We announce the addition of two flagship models: [`gemini-3-pro-preview`](en/providers/google.md) from Google and [`kimi-k2-thinking`](en/providers/moonshotai.md) from Moonshot AI. Gemini 3 Pro Preview is Google's most advanced model for complex reasoning tasks with 1M token context window, while Kimi K2 Thinking is Moonshot AI's newest flagship model with deep reasoning capabilities and multi-step tool use. Both models are available on [`v1/chat/completions`](en/api-reference/chat.md) with partial support on [`v1/responses`](en/api-reference/responses.md).

---

## Details

### Google Gemini

#### Gemini 3 Pro Preview

Google's most advanced model in the Gemini series, [`gemini-3-pro-preview`](en/providers/google.md) represents a significant advancement in AI capabilities. This natively multimodal model excels at complex reasoning tasks and can comprehend vast datasets from multiple information sources including text, audio, images, video, and entire code repositories.

**Key Features:**
- **Context Window**: 1M tokens for handling extensive conversations and documents
- **Output Tokens**: 64K tokens for comprehensive responses
- **Advanced Capabilities**: Native multimodal support (text, vision, audio), reasoning, function calling, structured outputs
- **Architecture**: Sparse mixture-of-experts (MoE) transformer-based model
- **Knowledge Cutoff**: January 2025
- **Endpoint Support**: Available on `v1/chat/completions`, partial support on `v1/responses`

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| gemini-3-pro-preview | $2.00/1M tokens | $0.825/1M tokens | $12.00/1M tokens | Above 200K: $4.00 input, $18.00 output |

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-pro-preview",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the technical architecture of a distributed system and propose optimization strategies."
      }
    ],
    "max_tokens": 2048
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1731945600,
  "model": "gemini-3-pro-preview",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Let me analyze the distributed system architecture...\n\n## System Architecture Analysis\n\n1. **Load Balancing Layer**\n   - Current implementation uses round-robin...\n\n2. **Optimization Strategies**\n   - Implement adaptive load balancing...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 450,
    "prompt_tokens": 25,
    "total_tokens": 475,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 25,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0054500000",
    "irt": 624.93,
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
    "model": "gemini-3-pro-preview",
    "messages": [
      {
        "role": "user",
        "content": "Solve this complex problem step by step."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gemini-3-pro-preview",
    messages=[
        {
            "role": "user",
            "content": "Solve this complex problem step by step.",
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
  model: "gemini-3-pro-preview",
  messages: [
    {
      role: "user",
      content: "Solve this complex problem step by step.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

### Moonshot AI

#### Kimi K2 Thinking

Moonshot AI's newest flagship model, [`kimi-k2-thinking`](en/providers/moonshotai.md), is a general-purpose agentic reasoning model designed for deep reasoning and multi-step tool use. This model excels at solving highly complex problems through extended reasoning chains and sequential tool calls.

**Key Features:**
- **Deep Reasoning**: Extended reasoning capabilities with `reasoning_content` field
- **Multi-Step Tool Use**: Designed to perform deep reasoning across multiple tool calls
- **Agentic Performance**: Excels at planning and executing complex multi-step tasks
- **Advanced Problem Solving**: Capable of tackling the hardest problems through step-by-step reasoning
- **Endpoint Support**: Available on `v1/chat/completions`, partial support on `v1/responses`

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| kimi-k2-thinking | $0.66/1M tokens | $0.165/1M tokens | $2.75/1M tokens | Search context: $0.005 per query |

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2-thinking",
    "messages": [
      {
        "role": "user",
        "content": "Design a comprehensive digital marketing strategy for a tech startup"
      }
    ],
    "max_tokens": 16000,
    "temperature": 1.0,
    "stream": true
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-xyz789",
  "created": 1731945600,
  "model": "kimi-k2-thinking",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "## Comprehensive Digital Marketing Strategy\n\n### Phase 1: Foundation\n1. **Brand Identity Development**\n   - Define core values and mission\n   - Create visual identity system\n\n### Phase 2: Channel Strategy\n...",
        "role": "assistant",
        "reasoning_content": "Let me think through this systematically. First, I need to understand the startup's context... Then I'll structure a multi-phase approach...",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 1250,
    "prompt_tokens": 20,
    "total_tokens": 1270,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 20,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0034125000",
    "irt": 391.07,
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
    "model": "kimi-k2-thinking",
    "messages": [
      {
        "role": "user",
        "content": "Solve this complex problem."
      }
    ],
    "max_tokens": 16000,
    "temperature": 1.0
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="kimi-k2-thinking",
    messages=[
        {
            "role": "user",
            "content": "Solve this complex problem.",
        }
    ],
    max_tokens=16000,
    temperature=1.0,
)

# Access reasoning content if available
message = completion.choices[0].message
if hasattr(message, "reasoning_content"):
    reasoning = getattr(message, "reasoning_content")
    print("Reasoning:", reasoning)

print("Answer:", message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "kimi-k2-thinking",
  messages: [
    {
      role: "user",
      content: "Solve this complex problem.",
    },
  ],
  max_tokens: 16000,
  temperature: 1.0,
});

// Access reasoning content if available
const message = completion.choices[0].message;
if ("reasoning_content" in message) {
  console.log("Reasoning:", message.reasoning_content);
}

console.log("Answer:", message.content);

```

### Recommended Settings for Kimi K2 Thinking

For optimal performance with [`kimi-k2-thinking`](en/providers/moonshotai.md):

- **max_tokens**: Set ≥ 16,000 to ensure full reasoning_content and final content can be returned
- **temperature**: Use 1.0 for best performance
- **stream**: Enable streaming (`stream: true`) for better user experience and to avoid timeout issues
- **Multi-step reasoning**: Include the entire `reasoning_content` from previous responses in your context

---

## Google Model Deprecations

Google has deprecated the following models, effective immediately. We recommend migrating to [`gemini-3-pro-preview`](en/providers/google.md) or other current models. See our [deprecations page](en/deprecations.md) for more details.

**Deprecated Models:**
- `gemini-2.0-flash-exp`
- `gemini-2.0-flash-lite-preview`
- `gemini-2.0-flash-lite-preview-02-05`
- `gemini-2.0-flash-thinking-exp`
- `gemini-2.0-flash-thinking-exp-01-21`
- `gemini-2.0-flash-thinking-exp-1219`
- `gemini-2.5-flash-lite-preview-06-17`
- `gemini-2.5-flash-preview-05-20`
- `gemini-2.5-pro-preview-06-05`
- `gemini-2.5-pro-preview-03-25`
- `gemini-2.5-pro-preview-05-06`

---

## Related Links

- [Google Models Documentation](en/providers/google.md)
- [Moonshot AI Models Documentation](en/providers/moonshotai.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Model Pricing](en/pricing.md)
- [Model Deprecations](en/deprecations.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Function Calling Guide](en/guides/function-calling.md)