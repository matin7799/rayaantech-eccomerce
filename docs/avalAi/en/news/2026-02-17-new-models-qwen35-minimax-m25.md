# New Models Added: Qwen3.5 Plus, Qwen3.5-397B and MiniMax M2.5

**Date:** 2026-02-17 / (1404-11-28)

## Summary

AvalAI introduces four new AI models: Qwen3.5 Plus and Qwen3.5-397B-A17B from Alibaba, featuring hybrid architecture with linear attention and sparse mixture-of-experts for enhanced multimodal understanding; and MiniMax M2.5 with M2.5-Lightning, SOTA models for coding, agentic tool use, and real-world productivity tasks with unprecedented cost efficiency.

---

## Details

### Alibaba

We announce access to **Qwen3.5 Plus** (`qwen3.5-plus`) and **Qwen3.5-397B-A17B** (`qwen3.5-397b-a17b`), Alibaba's latest native vision-language models built on innovative hybrid architecture. [Documentation](en/providers/alibaba.md)

#### qwen3.5-plus

**Key Features:**

- **Native Vision-Language Model**: Built for multimodal understanding with text, image, and video inputs
- **Hybrid Architecture**: Integrates linear attention (via Gated Delta Networks) with sparse mixture-of-experts for higher inference efficiency
- **1M Context Window**: Extended context available via Alibaba Cloud Model Studio
- **Deep Thinking**: Advanced reasoning capabilities on par with leading frontier models
- **Official Built-in Tools**: Adaptive tool use with official tool support
- **Function Calling & Structured Output**: Full support for advanced API features
- **201 Languages**: Expanded language and dialect support from 119 to 201 languages
- **Endpoint Support**: Available on `v1/chat/completions`

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.5-plus` |
| Snapshot | `qwen3.5-plus-2026-02-15` |
| Context Window | 1,000,000 tokens |
| Input | Text, Image, Video |
| Output | Text |
| Input Pricing | $0.40 / 1M tokens |
| Input Above 256K | $1.20 / 1M tokens |
| Cache Creation | $0.50 / 1M tokens |
| Cache Creation Above 256K | $1.50 / 1M tokens |
| Cached Input | $0.04 / 1M tokens |
| Cached Input Above 256K | $0.12 / 1M tokens |
| Output Pricing | $2.40 / 1M tokens |
| Output Above 256K | $7.20 / 1M tokens |

#### qwen3.5-397b-a17b

**Key Features:**

- **397B Total Parameters**: Massive model with only 17B activated per forward pass for efficiency
- **Native Vision-Language Model**: Built for multimodal understanding with text, image, and video inputs
- **State-of-the-Art Performance**: Comparable to leading-edge models across language understanding, logical reasoning, code generation, agent-based tasks, image understanding, video understanding, and GUI interactions
- **Open-Weight Model**: Available for download on Hugging Face and ModelScope
- **Strong Agent Capabilities**: Robust code-generation and agent capabilities with excellent generalization
- **Deep Thinking**: Advanced reasoning and visual understanding
- **Endpoint Support**: Available on `v1/chat/completions`

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.5-397b-a17b` |
| Parameters | 397B total, 17B activated |
| Input | Text, Image, Video |
| Output | Text |
| Input Pricing | $0.60 / 1M tokens |
| Cached Input | $0.06 / 1M tokens |
| Output Pricing | $3.60 / 1M tokens |

**Use Cases:**
- Complex multimodal reasoning and analysis
- Long document and video understanding
- Agent-based tasks and autonomous workflows
- GUI interaction and visual understanding
- Multilingual applications across 201 languages
- Code generation and software engineering

---

### MiniMax

We announce access to **MiniMax M2.5** (`minimax-m2.5`) and **MiniMax M2.5-Lightning** (`minimax-m2.5-lightning`), MiniMax's latest models designed for real-world productivity with SOTA performance in coding and agentic tasks. [Documentation](en/providers/minimax.md)

#### minimax-m2.5

**Key Features:**

- **SOTA Coding Performance**: 80.2% on SWE-Bench Verified, 51.3% on Multi-SWE-Bench
- **Advanced Search & Tool Calling**: 76.3% on BrowseComp with context management
- **37% Faster Than M2.1**: Improved task decomposition and token efficiency
- **Spec-Writing Architecture**: Model actively plans features, structure, and UI design before coding
- **Built-in Reasoning**: Thinking content in `<think>` tags, separable via `reasoning_split` parameter
- **10+ Programming Languages**: Go, C, C++, TypeScript, Rust, Kotlin, Python, Java, JavaScript, PHP, Lua, Dart, Ruby
- **Full Development Lifecycle**: From 0-to-1 system design to 90-to-100 code review and testing
- **Office Work Integration**: Deep collaboration with finance, law, and social sciences professionals
- **Cost Effective**: $1 for 1 hour continuous operation at 100 tokens/second
- **Endpoint Support**: Available on `v1/chat/completions`

| Feature | Details |
|---------|---------|
| Model ID | `minimax-m2.5` |
| Context Window | 204,000 tokens |
| Output Speed | ~50 tokens per second |
| Input Pricing | $0.30 / 1M tokens |
| Cached Input | $0.03 / 1M tokens |
| Cache Creation | $0.375 / 1M tokens |
| Output Pricing | $1.20 / 1M tokens |

#### minimax-m2.5-lightning

**Key Features:**

- **Ultra-Fast Inference**: ~100 tokens per second (2x faster than other frontier models)
- **Same Capabilities as M2.5**: Identical intelligence with higher throughput
- **On Par with Claude Opus 4.6**: Matches completion speed of leading models
- **Low-Cost Operation**: $0.30 per hour at 100 TPS continuous operation
- **Full Caching Support**: Context caching for cost optimization
- **Endpoint Support**: Available on `v1/chat/completions`

| Feature | Details |
|---------|---------|
| Model ID | `minimax-m2.5-lightning` |
| Context Window | 204,000 tokens |
| Output Speed | ~100 tokens per second |
| Input Pricing | $0.30 / 1M tokens |
| Cached Input | $0.03 / 1M tokens |
| Cache Creation | $0.375 / 1M tokens |
| Output Pricing | $2.40 / 1M tokens |

**Use Cases:**
- Agentic coding and software engineering (SWE-Bench Verified 80.2%)
- Multi-programming language projects
- Complex search and research tasks
- Office work automation (Word, PowerPoint, Excel)
- Financial modeling and analysis
- Real-time code assistance

---

## Pricing Summary

| Model | Provider | Type | Pricing |
|-------|----------|------|---------|
| `qwen3.5-plus` | Alibaba | Chat | Input: $0.40/1M, Cached: $0.04/1M, Output: $2.40/1M (tiered above 256K) |
| `qwen3.5-397b-a17b` | Alibaba | Chat | Input: $0.60/1M, Cached: $0.06/1M, Output: $3.60/1M |
| `minimax-m2.5` | MiniMax | Chat | Input: $0.30/1M, Cached: $0.03/1M, Output: $1.20/1M |
| `minimax-m2.5-lightning` | MiniMax | Chat | Input: $0.30/1M, Cached: $0.03/1M, Output: $2.40/1M |

---

## API Request/Response Examples

### Qwen3.5 Plus Chat Example

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.5-plus",
    "messages": [
      {
        "role": "user",
        "content": "Design an intelligent agent system that can autonomously manage complex multi-step workflows."
      }
    ],
    "max_tokens": 4096,
    "stream": false,
    "extra_body": {"enable_thinking": false}
  }'
```

#### Response

```json
{
  "id": "chatcmpl-xyz123",
  "created": 1739794897,
  "model": "qwen3.5-plus",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a comprehensive design for an intelligent agent system...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 1024,
    "prompt_tokens": 25,
    "total_tokens": 1049
  },
  "estimated_cost": {
    "unit": "0.0024596",
    "irt": 323.11,
    "exchange_rate": 131350
  }
}
```

### MiniMax M2.5 Coding Example

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.5",
    "messages": [
      {
        "role": "user",
        "content": "Implement a rate-limited concurrent web crawler in Rust with proper error handling."
      }
    ],
    "max_tokens": 4096
  }'
```

#### Response

```json
{
  "id": "chatcmpl-abc456",
  "created": 1739794897,
  "model": "minimax-m2.5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a complete implementation of a rate-limited concurrent web crawler in Rust...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 2048,
    "prompt_tokens": 30,
    "total_tokens": 2078
  },
  "estimated_cost": {
    "unit": "0.0024666",
    "irt": 324.03,
    "exchange_rate": 131350
  }
}
```

### MiniMax M2.5-Lightning Fast Response Example

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.5-lightning",
    "messages": [
      {
        "role": "user",
        "content": "Explain the difference between async/await and Promises in JavaScript."
      }
    ]
  }'
```

#### Response

```json
{
  "id": "chatcmpl-def789",
  "created": 1739794897,
  "model": "minimax-m2.5-lightning",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The key differences between async/await and Promises in JavaScript are...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 512,
    "prompt_tokens": 18,
    "total_tokens": 530
  },
  "estimated_cost": {
    "unit": "0.0012339",
    "irt": 162.08,
    "exchange_rate": 131350
  }
}
```

### MiniMax M2.5 with Reasoning Split

Use `reasoning_split` to separate the model's thinking process from the final answer:

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.5",
    "messages": [
      {
        "role": "user",
        "content": "What is 25 * 37?"
      }
    ],
    "extra_body": {
      "reasoning_split": true
    }
  }'
```

#### Response

```json
{
  "id": "chatcmpl-xyz123",
  "created": 1739794897,
  "model": "minimax-m2.5",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The answer is 925.",
        "role": "assistant",
        "reasoning_details": "Let me calculate 25 * 37 step by step:\n25 * 37 = 25 * (30 + 7) = 750 + 175 = 925"
      }
    }
  ],
  "usage": {
    "completion_tokens": 45,
    "prompt_tokens": 12,
    "total_tokens": 57
  }
}
```

> **Note:** Without `reasoning_split`, the thinking content appears inline with `<think>` tags in the `content` field. When managing multi-turn conversations with tool calls, always preserve the full response message (including `tool_calls` and `reasoning_details` fields) in your message history.

---

## Related Documentation

- [Alibaba Models Documentation](en/providers/alibaba.md)
- [MiniMax Models Documentation](en/providers/minimax.md)
- [Provider-Specific Parameters](en/guides/provider-specific-params.md)
- [Pricing](en/pricing.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
