# New Model Added: Gemini 3.1 Pro Preview

**Date:** 2026-02-19 / (1404-12-01)

## Summary

We announce the addition of Google's newest flagship model: [`gemini-3.1-pro-preview`](en/providers/google.md). Gemini 3.1 Pro is the next iteration in the Gemini 3 series, a highly capable and natively multimodal reasoning model that significantly outperforms Gemini 3 Pro across key benchmarks. The model features a 1M token context window and is available on [`v1/chat/completions`](en/api-reference/chat.md), [`v1/messages`](en/api-reference/messages.md), partial support on [`v1/responses`](en/api-reference/responses.md), and the native [Gemini API (v1beta)](en/api-reference/v1beta.md).

---

## Details

### Google Gemini

#### Gemini 3.1 Pro Preview

Google's most advanced model as of February 2026, [`gemini-3.1-pro-preview`](en/providers/google.md) is the next iteration in the Gemini 3 series, representing significant improvements over Gemini 3 Pro. This natively multimodal model can comprehend vast datasets from multiple information sources including text, audio, images, video, and entire code repositories.

**Key Features:**
- **Context Window**: 1M tokens for handling extensive conversations and documents
- **Output Tokens**: 64K tokens for comprehensive responses
- **Advanced Capabilities**: Native multimodal support (text, vision, audio), reasoning, function calling, structured outputs
- **Architecture**: Based on Gemini 3 Pro with enhanced reasoning capabilities
- **Knowledge Cutoff**: January 2025
- **Endpoint Support**: Available on `v1/chat/completions`, `v1/messages`, partial support on `v1/responses`, and native [Gemini API (v1beta)](en/api-reference/v1beta.md)

**Benchmark Performance Highlights:**
- **Humanity's Last Exam**: 44.4% (no tools) - Best in class without tools
- **ARC-AGI-2**: 77.1% - Significant improvement over Gemini 3 Pro (31.1%)
- **GPQA Diamond**: 94.3% - Best in class scientific knowledge
- **Terminal-Bench 2.0**: 68.5% - Top performance on agentic terminal coding
- **LiveCodeBench Pro**: 2887 Elo - Best competitive coding score
- **BrowseComp**: 85.9% - Leading agentic search performance
- **MMMLU**: 92.6% - Best multilingual Q&A performance

**Best For:**
- Agentic performance and multi-step workflows
- Advanced coding and algorithmic development
- Long context and multimodal understanding
- Complex reasoning and strategic planning
- Research and scientific analysis

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| gemini-3.1-pro-preview | $2.00/1M tokens | $0.825/1M tokens | $12.00/1M tokens | Above 200K: $4.00 input, $18.00 output |

**Audio Pricing:**
- Audio Input: $7.00/1M tokens
- Audio Cached Input: $1.50/1M tokens
- Audio Output: $7.00/1M tokens

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.1-pro-preview",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the technical architecture of a distributed system and propose optimization strategies for handling 10x traffic growth."
      }
    ],
    "max_tokens": 4096
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1740000000,
  "model": "gemini-3.1-pro-preview",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Let me analyze your distributed system architecture and propose optimization strategies for 10x traffic growth...\n\n## System Architecture Analysis\n\n1. **Current State Assessment**\n   - Identify bottlenecks and single points of failure...\n\n2. **Horizontal Scaling Strategies**\n   - Implement stateless service design...\n\n3. **Data Layer Optimization**\n   - Database sharding and read replicas...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 850,
    "prompt_tokens": 32,
    "total_tokens": 882,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 32,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0102640000",
    "irt": 1177.63,
    "exchange_rate": 114700
  }
}
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.1-pro-preview",
    "messages": [
      {
        "role": "user",
        "content": "Solve this complex problem step by step using advanced reasoning."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[
        {
            "role": "user",
            "content": "Solve this complex problem step by step using advanced reasoning.",
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
  model: "gemini-3.1-pro-preview",
  messages: [
    {
      role: "user",
      content: "Solve this complex problem step by step using advanced reasoning.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

## Documentation

For more information about this model and its capabilities, visit:

- [Google Models Documentation](en/providers/google.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Gemini API (v1beta) Reference](en/api-reference/v1beta.md)
- [Pricing Information](en/pricing.md)
