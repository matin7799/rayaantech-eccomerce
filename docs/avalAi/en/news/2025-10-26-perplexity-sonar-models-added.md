# Perplexity Sonar Models Now Available

**Date:** 2025-10-26

## Summary

AvalAI now supports 5 new Perplexity Sonar models with advanced web search capabilities and reasoning features. These models provide real-time web search integration, Chain-of-Thought reasoning, and comprehensive research capabilities through our unified API with support for multiple endpoints including [`v1/chat/completions`](en/guides/text-generation.md), [`v1/completions`](en/guides/text-generation.md), [`v1/messages`](en/guides/responses-vs-chat-completions.md), and [`v1/responses`](en/guides/responses-vs-chat-completions.md).

---

## Details

### Perplexity

We introduce 5 new models from Perplexity that combine AI-powered text generation with real-time web search and reasoning capabilities:

- **[sonar](en/providers/perplexity.md#sonar)**: Fast answers with reliable search results. A lightweight, cost-effective search model optimized for quick, grounded answers with real-time web search. 128K context length.

- **[sonar-pro](en/providers/perplexity.md#sonar-pro)**: Advanced search with enhanced search results. An advanced search model designed for complex queries, delivering 2x more search results than standard Sonar. 200K context length.

- **[sonar-reasoning](en/providers/perplexity.md#sonar-reasoning)**: Quick reasoning with real-time search. A reasoning-focused model that applies Chain-of-Thought (CoT) reasoning for structured analysis with web search. 128K context length.

- **[sonar-reasoning-pro](en/providers/perplexity.md#sonar-reasoning-pro)**: Advanced reasoning with comprehensive search. Enhanced Chain-of-Thought reasoning with 2x more search results for complex multi-step analysis. 128K context length.

- **[sonar-deep-research](en/providers/perplexity.md#sonar-deep-research)**: Exhaustive research across hundreds of sources. Expert-level subject analysis with detailed report generation and citation support. 128K context length.

**Key Features:**
- **Real-Time Web Search**: All models integrate live web search with citations and search results metadata
- **Chain-of-Thought Reasoning**: Reasoning models support structured problem-solving with detailed thinking processes
- **Flexible Context Windows**: 128K-200K context lengths for handling extensive documents
- **Multiple API Endpoints**: Full support for v1/chat/completions and v1/completions; partial support for v1/messages and v1/responses
- **Citation Support**: Automatic citation generation with source URLs and search result metadata
- **Cost-Effective Options**: Various pricing tiers from free input tokens to premium deep research capabilities

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| sonar | $1.00/1M tokens | $0.50/1M tokens | $1.00/1M tokens | $5-$12 per 1K requests (search context) |
| sonar-pro | $3.00/1M tokens | $1.50/1M tokens | $15.00/1M tokens | $6-$14 per 1K requests (search context) |
| sonar-reasoning | $1.00/1M tokens | $0.50/1M tokens | $5.00/1M tokens | $5-$12 per 1K requests (search context) |
| sonar-reasoning-pro | $2.00/1M tokens | $1.00/1M tokens | $8.00/1M tokens | $6-$14 per 1K requests (search context) |
| sonar-deep-research | $2.00/1M tokens | $1.00/1M tokens | $8.00/1M tokens | $3.00/1M reasoning tokens, $2.00/1M citation tokens, $0.005 per search query |

**Note:** Search context pricing varies based on query complexity (low/medium/high) and is charged per 1K requests.

### API Request/Response Examples

#### Example Request - Sonar

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar",
    "messages": [
      {
        "role": "user",
        "content": "What is the latest news in AI research?"
      }
    ]
  }'
```

#### Example Response - Sonar

```json
{
  "id": "80cff570-614d-4344-8cd4-9f78af816a3d",
  "created": 1761492286,
  "model": "sonar",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The latest news in AI research for 2025 highlights several groundbreaking advances...",
        "role": "assistant",
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 592,
    "prompt_tokens": 9,
    "total_tokens": 601,
    "completion_tokens_details": null,
    "prompt_tokens_details": null,
    "cost": {
      "input_tokens_cost": 0.0,
      "output_tokens_cost": 0.001,
      "request_cost": 0.005,
      "total_cost": 0.006
    },
    "search_context_size": "low"
  },
  "citations": [
    "https://news.microsoft.com/source/features/ai/6-ai-trends-youll-see-more-of-in-2025/",

    "https://news.stanford.edu/artificial-intelligence",

    "https://www.artificialintelligence-news.com"

  ],
  "search_results": [
    {
      "title": "6 AI trends you'll see more of in 2025 - Microsoft Source",
      "url": "https://news.microsoft.com/source/features/ai/6-ai-trends-youll-see-more-of-in-2025/",

      "date": "2024-12-05",
      "last_updated": "2025-10-26",
      "snippet": "In 2025, AI will evolve from a tool for work and home to an integral part of both...",
      "source": "web"
    }
  ],
  "estimated_cost": {
    "unit": "0.0006010000",
    "irt": 65.03,
    "exchange_rate": 108200
  }
}
```

#### Example Request - Sonar Reasoning

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Design a comprehensive digital marketing strategy for a tech startup"
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
    "model": "sonar",
    "messages": [
      {
        "role": "user",
        "content": "What are the latest developments in quantum computing?"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="sonar",
    messages=[
        {
            "role": "user",
            "content": "What are the latest developments in quantum computing?",
        }
    ],
)

print(completion.choices[0].message.content)
# Access citations and search results
print(completion.citations)
print(completion.search_results)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "sonar",
  messages: [
    {
      role: "user",
      content: "What are the latest developments in quantum computing?",
    },
  ],
});

console.log(completion.choices[0].message.content);
// Access citations and search results
console.log(completion.citations);
console.log(completion.search_results);

```

### Reasoning Model Usage

For reasoning models like [`sonar-reasoning`](en/providers/perplexity.md#sonar-reasoning) and [`sonar-reasoning-pro`](en/providers/perplexity.md#sonar-reasoning-pro), the model shows its thinking process:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the competitive landscape of AI search engines"
      }
    ],
    "max_tokens": 2048
  }'

python=:response = client.chat.completions.create(
    model="sonar-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Analyze the competitive landscape of AI search engines",
        }
    ],
    max_tokens=2048,
)

# The model will show its Chain-of-Thought reasoning process
print(response.choices[0].message.content)

javascript=:const response = await client.chat.completions.create({
    model: "sonar-reasoning",
    messages: [
        {
            role: "user",
            content: "Analyze the competitive landscape of AI search engines",
        },
    ],
    max_tokens: 2048,
});

// The model will show its Chain-of-Thought reasoning process
console.log(response.choices[0].message.content);

```

### API Endpoint Support

**Full Support:**
- [`v1/chat/completions`](en/guides/text-generation.md): Complete support for all Perplexity Sonar models with streaming
- [`v1/completions`](en/guides/text-generation.md): Text completion format support

**Partial Support:**
- [`v1/messages`](en/guides/responses-vs-chat-completions.md): Anthropic-style messages API
- [`v1/responses`](en/guides/responses-vs-chat-completions.md): Alternative response format

### Use Cases by Model

**Sonar**: Quick searches, fact-checking, news summaries, straightforward Q&A

**Sonar Pro**: Complex research questions, comparative analysis, information synthesis

**Sonar Reasoning**: Multi-step problem solving, logical analysis, strategic planning

**Sonar Reasoning Pro**: Advanced multi-step analysis, deep reasoning tasks, comprehensive decision making

**Sonar Deep Research**: Academic research, market analysis, due diligence, investigative research

**Sonar Medium Chat**: Interactive conversations, balanced cost-performance for search tasks

**Sonar Medium Online**: High-volume applications where token costs need to be minimized

---

## Related Links

- [Perplexity Models Documentation](en/providers/perplexity.md)
- [Text Generation Guide](en/guides/text-generation.md)
- [Web Search Tools](en/guides/tools-web-search.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [API Reference - Chat Completions](en/guides/text-generation.md)
- [Streaming Responses](en/guides/streaming-responses.md)