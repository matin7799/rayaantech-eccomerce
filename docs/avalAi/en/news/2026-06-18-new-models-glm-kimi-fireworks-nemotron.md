# New Models Added: GLM-5.2, Kimi K2.7 Code, and New Provider Fireworks.ai with Nemotron-3-Ultra

**Date:** 2026-06-18 / (1405-03-28)

## Summary

We announce the addition of four new models across three providers, including a new provider, Fireworks.ai. Z.AI's `glm-5.2` extends GLM-5.1 with a 1M-token context window, Moonshot.ai's `kimi-k2.7-code` and `kimi-k2.7-code-highspeed` deliver SOTA open-source coding, and NVIDIA's `nemotron-3-ultra` is now available through the new Fireworks.ai provider. All models are available on `v1/chat/completions`, with partial support on `v1/responses`.

---

## Details

### Z.AI

#### GLM-5.2

[`glm-5.2`](en/providers/zai.md#glm-52) is Z.AI's latest flagship model for agentic engineering, extending GLM-5.1 with an expanded 1M-token context window and improved long-horizon reliability. It pairs frontier coding performance with a large context window suited to multi-file codebases and extended agent sessions.

| Feature | Details |
|---------|---------|
| Model ID | `glm-5.2` |
| Context window | 1,000,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Deep Thinking |
| Input pricing | $1.40 / 1M tokens |
| Cached input pricing | $0.26 / 1M tokens |
| Output pricing | $4.40 / 1M tokens |
| Supported endpoints | `v1/chat/completions` (full), `v1/responses` (partial) |

### Moonshot.ai

#### Kimi K2.7 Code

[`kimi-k2.7-code`](en/providers/moonshotai.md#kimi-k27-code) is Moonshot AI's latest open-source model purpose-built for software engineering and agentic coding, with state-of-the-art results on coding and agentic benchmarks. The model is served through the Fireworks.ai API provider.

[`kimi-k2.7-code-highspeed`](en/providers/moonshotai.md#kimi-k27-code-highspeed) is a high-speed serving variant optimized for low-latency coding workloads, retaining the same capabilities while prioritizing throughput.

| Feature | `kimi-k2.7-code` | `kimi-k2.7-code-highspeed` |
|---------|------------------|----------------------------|
| Context window | 262,144 tokens | 262,144 tokens |
| Input pricing | $1.045 / 1M tokens | $2.09 / 1M tokens |
| Cached input pricing | $0.19 / 1M tokens | $0.418 / 1M tokens |
| Output pricing | $4.40 / 1M tokens | $8.80 / 1M tokens |
| Supported endpoints | `v1/chat/completions` (full), `v1/responses` (partial) | `v1/chat/completions` (full), `v1/responses` (partial) |

> **Pricing Note:** Includes the standard AvalAI Moonshot 10% margin over official pricing for Singapore GST compliance.

### Fireworks.ai (New Provider)

We introduce Fireworks.ai as a new provider on AvalAI. Fireworks.ai is a fast inference platform for open-source AI models, providing production-ready inference with high throughput and competitive pricing. Our first model hosted through Fireworks.ai is NVIDIA's `nemotron-3-ultra`.

#### Nemotron-3-Ultra

[`nemotron-3-ultra`](en/providers/fireworksai.md#nemotron-3-ultra) is NVIDIA's flagship large-scale Nemotron model for complex reasoning, agentic workflows, and high-quality text generation, combining strong capabilities with cost-effective inference.

| Feature | Details |
|---------|---------|
| Model ID | `nemotron-3-ultra` |
| Owner | NVIDIA |
| API Provider | Fireworks.ai |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.12 / 1M tokens |
| Output pricing | $2.40 / 1M tokens |
| Supported endpoints | `v1/chat/completions` (full), `v1/responses` (partial) |

---

## Pricing Summary

| Model | Provider | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) |
|-------|----------|---------------------|----------------------------|----------------------|
| `glm-5.2` | Z.AI | $1.40 | $0.26 | $4.40 |
| `kimi-k2.7-code` | Moonshot.ai | $1.045 | $0.19 | $4.40 |
| `kimi-k2.7-code-highspeed` | Moonshot.ai | $2.09 | $0.418 | $8.80 |
| `nemotron-3-ultra` | Fireworks.ai | $0.60 | $0.12 | $2.40 |

---

## API Request/Response Examples

### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Refactor this large multi-file codebase to introduce a caching layer and explain the migration plan."
      }
    ],
    "max_tokens": 4096
  }'
```

### Example Response

```json
{
  "id": "chatcmpl-glm-5-2-abc123",
  "created": 1781827200,
  "model": "glm-5.2",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here is the migration plan and refactored caching layer...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 412,
    "prompt_tokens": 36,
    "total_tokens": 448,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 36,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0018632000",
    "irt": 213.52,
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
    "model": "kimi-k2.7-code",
    "messages": [
      {
        "role": "user",
        "content": "Implement a REST API in FastAPI with JWT authentication and SQLAlchemy models."
      }
    ],
    "max_tokens": 8192
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="kimi-k2.7-code",
    messages=[
        {
            "role": "user",
            "content": "Implement a REST API in FastAPI with JWT authentication and SQLAlchemy models.",
        }
    ],
    max_tokens=8192,
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "kimi-k2.7-code",
  messages: [
    {
      role: "user",
      content: "Implement a REST API in FastAPI with JWT authentication and SQLAlchemy models.",
    },
  ],
  max_tokens: 8192,
});

console.log(completion.choices[0].message.content);

```

---

## Related Links

- [Z.AI Models](en/providers/zai.md)
- [Moonshot.ai Models](en/providers/moonshotai.md)
- [Fireworks.ai Models](en/providers/fireworksai.md)
- [Pricing](en/pricing.md)
- [Chat Completions API](en/api-reference/chat.md)
- [Reasoning Guide](en/guides/reasoning.md)
