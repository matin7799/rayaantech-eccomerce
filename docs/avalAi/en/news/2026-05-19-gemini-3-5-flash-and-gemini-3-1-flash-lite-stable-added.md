# New Flagship Gemini 3.5 Flash Added and Gemini 3.1 Flash-Lite Stable Released

**Date:** 2026-05-19 / (1405-02-29)

## Summary

We are pleased to announce the addition of Google's new flagship multimodal reasoning model, [`gemini-3.5-flash`](en/providers/google.md), along with the stable release of [`gemini-3.1-flash-lite`](en/providers/google.md). Both models are now available through the OpenAI-compatible `v1/chat/completions` endpoint and the native Gemini `v1beta/models` endpoint.

---

## Details

### Google (Gemini)

#### Gemini 3.5 Flash

[`gemini-3.5-flash`](en/providers/google.md) is Google's next-generation flagship Flash model, built on the Gemini 3 Flash reasoning foundation with configurable thinking levels to balance quality, cost, and latency. Published in May 2026, it delivers strong improvements in coding, agentic tool use, expert tasks, multimodal understanding, and long-context performance compared with Gemini 3 Flash.

| Feature | Details |
|---------|---------|
| Context window | 1,048,576 input tokens, 65,536 output tokens |
| Knowledge cutoff | January 2025 |
| Input pricing | $1.50 / 1M tokens |
| Cached input pricing | $0.25 / 1M tokens |
| Output pricing | $9.00 / 1M tokens |
| Audio input pricing | $1.00 / 1M tokens |
| Audio cached input | $0.50 / 1M tokens |
| Audio output pricing | $1.00 / 1M tokens |
| Supported inputs | Text, Image, Video, Audio, PDF |
| Supported outputs | Text |
| Supported endpoints | `v1/chat/completions`, `v1beta/` |
| Thinking levels | low, medium, high |

**Key Features:**
- **Flagship Flash Intelligence**: Built on the Gemini 3 Flash reasoning foundation with measurable benchmark improvements
- **Configurable Thinking**: Supports `thinkingLevel` (low / medium / high) to control the quality/cost/latency trade-off
- **Multimodal Native**: Accepts text, images, audio, video, and PDF inputs in a single request
- **Long Context**: 1M input token context window suitable for large documents and codebases
- **Tool Use**: Native function calling, parallel function calling, structured outputs, prompt caching, and Google Search grounding
- **Coding & Agents**: Strong results on Terminal-bench 2.1 (76.2%), SWE-Bench Pro (55.1%), MCP Atlas (83.6%), and Toolathlon (56.5%)
- **Multimodal Reasoning**: CharXiv Reasoning 84.2%, MMMU-Pro 83.6%, OSWorld-Verified 78.4%
- **Reasoning**: Humanity's Last Exam 40.2%, ARC-AGI-2 72.1%, MRCR v2 1M pointwise 26.6%

**Best Use Cases:**
- High-throughput agentic workflows that need strong tool-use and coding ability at a Flash price point
- Multimodal pipelines combining vision, audio, and document understanding
- Long-context analysis over codebases, research papers, and structured documents
- Cost-aware deployments where thinking levels can be tuned per request

#### Gemini 3.1 Flash-Lite (Stable Release)

[`gemini-3.1-flash-lite`](en/providers/google.md) is the stable release of [`gemini-3.1-flash-lite-preview`](en/providers/google.md), previously announced in our [March 10, 2026 update](en/news/2026-03-10-new-openai-gemini-models-added.md). The stable alias delivers the same capabilities and pricing as the preview model, providing a reliable, cost-efficient option for high-volume multimodal workloads.

| Feature | Details |
|---------|---------|
| Context window | 1,048,576 input tokens, 65,536 output tokens |
| Knowledge cutoff | January 2025 |
| Input pricing | $0.25 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens |
| Output pricing | $1.50 / 1M tokens |
| Audio input pricing | $0.50 / 1M tokens |
| Audio cached input | $0.05 / 1M tokens |
| Audio output pricing | $1.50 / 1M tokens |
| Supported inputs | Text, Image, Video, Audio, PDF |
| Supported outputs | Text |
| Supported endpoints | `v1/chat/completions`, `v1beta/` |

**Key Features:**
- **Production-Ready**: Stable alias suitable for long-term integrations
- **Most Cost-Efficient Gemini 3 Model**: Same low pricing as the preview release
- **Multimodal**: Text, image, video, audio, and PDF input support
- **Thinking Support**: Configurable thinking levels for step-by-step reasoning
- **Function Calling, Structured Outputs, Search Grounding, URL Context**

---

## Pricing Summary

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) | Audio Input | Audio Cached | Audio Output |
|-------|---------------------|----------------------------|----------------------|-------------|--------------|--------------|
| `gemini-3.5-flash` | $1.50 | $0.25 | $9.00 | $1.00 | $0.50 | $1.00 |
| `gemini-3.1-flash-lite` | $0.25 | $0.025 | $1.50 | $0.50 | $0.05 | $1.50 |

---

## API Request/Response Examples

### Gemini 3.5 Flash Example (OpenAI-Compatible)

<!-- tabs:start -->

#### **bash**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "Outline a robust strategy to migrate a large monolithic Python service to event-driven microservices."
      }
    ]
  }'
```

#### **python**

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Outline a robust strategy to migrate a large monolithic Python service to event-driven microservices.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### **javascript**

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3.5-flash",
  messages: [
    {
      role: "user",
      content:
        "Outline a robust strategy to migrate a large monolithic Python service to event-driven microservices.",
    },
  ],
});

console.log(response.choices[0].message.content);
```

<!-- tabs:end -->

**Response:**

```json
{
  "id": "chatcmpl-abc789",
  "created": 1747641600,
  "model": "gemini-3.5-flash",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "A robust migration strategy starts with the strangler-fig pattern: identify bounded contexts, expose them behind a stable API, then incrementally extract each context into an independent service while keeping the monolith authoritative until cut-over. Introduce an event backbone (e.g., Kafka or Pub/Sub) early, define outbox-based publishing for transactional integrity, and require contract tests for every new service. Plan observability, schema evolution, and rollback paths before touching production traffic.",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 92,
    "prompt_tokens": 23,
    "total_tokens": 115,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 23,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0008625000",
    "irt": 98.84,
    "exchange_rate": 114600
  }
}
```

### Gemini 3.5 Flash with Thinking Configuration

<!-- tabs:start -->

#### **bash**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "A train leaves Station A at 8:00 AM traveling at 60 km/h. Another train leaves Station B at 9:00 AM traveling at 80 km/h toward Station A. The stations are 280 km apart. When and where do they meet?"
      }
    ],
    "extra_body": {
      "generationConfig": {
        "thinkingConfig": {
          "thinkingLevel": "high"
        }
      }
    }
  }'
```

#### **python**

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3.5-flash",
    messages=[
        {
            "role": "user",
            "content": "A train leaves Station A at 8:00 AM traveling at 60 km/h. Another train leaves Station B at 9:00 AM traveling at 80 km/h toward Station A. The stations are 280 km apart. When and where do they meet?",
        }
    ],
    extra_body={"generationConfig": {"thinkingConfig": {"thinkingLevel": "high"}}},
)

print(response.choices[0].message.content)
```

#### **javascript**

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3.5-flash",
  messages: [
    {
      role: "user",
      content:
        "A train leaves Station A at 8:00 AM traveling at 60 km/h. Another train leaves Station B at 9:00 AM traveling at 80 km/h toward Station A. The stations are 280 km apart. When and where do they meet?",
    },
  ],
  // @ts-ignore - extra_body is supported by AvalAI for Gemini-specific options
  extra_body: {
    generationConfig: { thinkingConfig: { thinkingLevel: "high" } },
  },
});

console.log(response.choices[0].message.content);
```

<!-- tabs:end -->

### Gemini 3.5 Flash via Native v1beta Endpoint

<!-- tabs:start -->

#### **bash**

```bash
curl https://api.avalai.ir/v1beta/models/gemini-3.5-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {"text": "Summarize the main advantages of event-driven architectures in three bullet points."}
        ]
      }
    ],
    "generationConfig": {
      "thinkingConfig": {"thinkingLevel": "medium"}
    }
  }'
```

#### **python**

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"base_url": "https://api.avalai.ir"},
)

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Summarize the main advantages of event-driven architectures in three bullet points.",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="medium"),
    ),
)

print(response.text)
```

#### **javascript**

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AVALAI_API_KEY,
  httpOptions: { baseUrl: "https://api.avalai.ir" },
});

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents:
    "Summarize the main advantages of event-driven architectures in three bullet points.",
  config: {
    thinkingConfig: { thinkingLevel: "medium" },
  },
});

console.log(response.text);
```

<!-- tabs:end -->

### Gemini 3.1 Flash-Lite Stable Example

<!-- tabs:start -->

#### **bash**

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.1-flash-lite",
    "messages": [
      {
        "role": "user",
        "content": "Classify the following support ticket into one of: billing, technical, account, other. Ticket: I cannot reset my password and the email link has expired."
      }
    ]
  }'
```

#### **python**

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3.1-flash-lite",
    messages=[
        {
            "role": "user",
            "content": "Classify the following support ticket into one of: billing, technical, account, other. Ticket: I cannot reset my password and the email link has expired.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### **javascript**

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3.1-flash-lite",
  messages: [
    {
      role: "user",
      content:
        "Classify the following support ticket into one of: billing, technical, account, other. Ticket: I cannot reset my password and the email link has expired.",
    },
  ],
});

console.log(response.choices[0].message.content);
```

<!-- tabs:end -->

**Response:**

```json
{
  "id": "chatcmpl-def456",
  "created": 1747641900,
  "model": "gemini-3.1-flash-lite",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "account",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 2,
    "prompt_tokens": 41,
    "total_tokens": 43,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 41,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0000132500",
    "irt": 1.52,
    "exchange_rate": 114600
  }
}
```

### Gemini 3.1 Flash-Lite via Native v1beta Endpoint

```bash
curl https://api.avalai.ir/v1beta/models/gemini-3.1-flash-lite:generateContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {"text": "Extract the company names from: Apple announced a partnership with OpenAI and Microsoft this quarter."}
        ]
      }
    ]
  }'
```

---

## Migration Notes

- Existing integrations using [`gemini-3.1-flash-lite-preview`](en/providers/google.md) can switch to the stable alias [`gemini-3.1-flash-lite`](en/providers/google.md) without code or pricing changes.
- The preview alias remains available for backward compatibility.
- [`gemini-3.5-flash`](en/providers/google.md) is a separate, more capable flagship Flash model — not a direct replacement for [`gemini-3.1-flash-lite`](en/providers/google.md). Choose based on your quality/cost trade-off:
  - Use [`gemini-3.5-flash`](en/providers/google.md) for agentic, coding, multimodal reasoning, and long-context tasks where quality matters.
  - Use [`gemini-3.1-flash-lite`](en/providers/google.md) for high-volume classification, extraction, translation, and routing tasks where cost matters most.

---

## Documentation

- [Google Gemini Models Documentation](en/providers/google.md)
- [Pricing Information](en/pricing.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Gemini v1beta API Reference](en/api-reference/v1beta.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Models Index](en/models/index.md)
