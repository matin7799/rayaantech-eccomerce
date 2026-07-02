# New Stable Models Added: Claude Haiku 4.5 and Cohere Embed v4

**Date:** 2025-10-15 / (1404-07-24)

## Summary

We announce the addition of two new stable models to AvalAI: Anthropic's Claude Haiku 4.5, a high-performance coding model offering near-frontier capabilities with exceptional speed and cost efficiency, and Cohere's Embed v4, an advanced embedding model supporting text, images, and mixed content with a 128k context window.

---

## Details

### Anthropic

- **[Claude Haiku 4.5](en/providers/anthropic.md)** (‍‍‍‍`claude-haiku-4-5`): A powerful small model delivering near-frontier coding performance at one-third the cost and more than twice the speed of Claude Sonnet 4. Ideal for real-time applications, chat assistants, customer service agents, pair programming, and agentic workflows. [Model Documentation](en/providers/anthropic.md)

**Key Features:**
- **High Performance**: Matches Claude Sonnet 4 coding capabilities with superior computer use performance
- **Exceptional Speed**: Up to 4-5 times faster than Sonnet 4.5 for rapid prototyping and multi-agent orchestration
- **Cost Efficiency**: Delivers premium model performance at our most economical price point
- **Advanced Capabilities**: Function calling, structured outputs, computer use, and vision support
- **Context Window**: 200k tokens for extensive conversations and document processing
- **Endpoint Support**: Available on v1/chat/completions and v1/messages

**Pricing:**

| Model | Input | Output |
|-------|-------|--------|
| claude-haiku-4-5-20251001-v1:0 | $1.00/1M tokens | $5.00/1M tokens |

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-haiku-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to calculate the Fibonacci sequence efficiently using memoization."
      }
    ],
    "max_tokens": 1024
  }'
```

#### Example Response

```json
{
  "id": "msg_01ABC123xyz",
  "created": 1729026000,
  "model": "claude-haiku-4-5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's an efficient Python function to calculate Fibonacci numbers using memoization:\n\n
```python\ndef fibonacci(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n    return memo[n]\n\n# Example usage\nfor i in range(10):\n    print(f\"F({i}) = {fibonacci(i)}\")\n```\n\nThis implementation uses a dictionary to cache previously calculated values, reducing time complexity from O(2^n) to O(n).",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 145,
    "prompt_tokens": 23,
    "total_tokens": 168,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 23,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0007480000",
    "irt": 85.72,
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
    "model": "claude-haiku-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Help me debug this Python code."
      }
    ],
    "max_tokens": 2048
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="claude-haiku-4-5",
    messages=[
        {
            "role": "user",
            "content": "Help me debug this Python code.",
        }
    ],
    max_tokens=2048,
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "claude-haiku-4-5",
  messages: [
    {
      role: "user",
      content: "Help me debug this Python code.",
    },
  ],
  max_tokens: 2048,
});

console.log(completion.choices[0].message.content);

```

### Cohere

- **[Cohere Embed v4](en/providers/cohere.md)** (`cohere.embed-v4:0`): An advanced embedding model that supports text, images, and mixed content (including PDFs). Ideal for semantic search, retrieval-augmented generation (RAG), document classification, and similarity matching. [Model Documentation](en/providers/cohere.md)

**Key Features:**
- **Multimodal Support**: Process text, images, and mixed text/image documents
- **Flexible Dimensions**: Choose from 256, 512, 1024, or 1536 (default) output dimensions
- **Large Context Window**: 128k tokens for processing extensive documents
- **Multiple Similarity Metrics**: Supports Cosine Similarity, Dot Product Similarity, and Euclidean Distance
- **PDF Processing**: Native support for embedding PDF documents
- **Endpoint Support**: Available on v1/embeddings

### Embedding API Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "cohere.embed-v4:0",
    "input": "Artificial intelligence is transforming how we work and live.",
    "encoding_format": "float"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    model="cohere.embed-v4:0",
    input="Artificial intelligence is transforming how we work and live.",
    encoding_format="float",
)

print(response.data[0].embedding[:10])  # First 10 dimensions

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.embeddings.create({
  model: "cohere.embed-v4:0",
  input: "Artificial intelligence is transforming how we work and live.",
  encoding_format: "float"
});

console.log(response.data[0].embedding.slice(0, 10));  // First 10 dimensions

```

#### Embedding Response Example

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        0.0234375,
        -0.015625,
        0.0456789,
        -0.0123456,
        0.0678901,
        "...[1536 dimensions total]"
      ]
    }
  ],
  "model": "cohere.embed-v4:0",
  "usage": {
    "prompt_tokens": 12,
    "total_tokens": 12
  },
  "estimated_cost": {
    "unit": "0.0000120000",
    "irt": 1.38,
    "exchange_rate": 114600
  }
}
```

---

## Use Cases

### Claude Haiku 4.5
- **Real-time Applications**: Chat assistants and customer service with low latency
- **Coding Workflows**: Pair programming, code review, and rapid prototyping
- **Agentic Systems**: Multi-agent orchestration with parallel task execution
- **Computer Use**: Automated workflows requiring interaction with computer interfaces
- **Cost-Sensitive Applications**: Production deployments requiring high intelligence at scale

### Cohere Embed v4
- **Semantic Search**: Build intelligent search systems with contextual understanding
- **RAG Systems**: Enhance language models with relevant document retrieval
- **Document Classification**: Categorize and organize large document collections
- **Similarity Matching**: Find similar content across text and image datasets
- **PDF Processing**: Extract and embed information from PDF documents

---

## Related Links

- [Anthropic Models Documentation](en/providers/anthropic.md)
- [Cohere Models Documentation](en/providers/cohere.md)
- [Embeddings API Guide](en/guides/retrieval.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [RAG Best Practices](en/guides/rag-best-practices.md)