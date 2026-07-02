# New Cohere Models Added: Rerank v4 and Azure Embed v4

**Date:** 2025-12-14 / (1403-09-23)

## Summary

We announce the addition of Cohere's latest Rerank v4 models (Pro and Fast variants) for advanced semantic search reranking, and the new `embed-v-4-0` embedding model on Azure AI services infrastructure delivering up to 30x higher rate limits compared to the standard Cohere embed endpoint.

---

## Details

### Cohere Rerank v4 Models

Cohere's Rerank v4 models represent a significant advancement in semantic search reranking, offering a 32,768-token context window—approximately 8x larger than previous versions. Both models support 100+ languages and handle structured data formatted as YAML strings.

- **[Cohere Rerank v4 Pro](en/providers/cohere.md)** (`cohere-rerank-v4.0-pro`): The highest-quality reranking model for production workloads requiring maximum relevance accuracy. [Model Documentation](en/providers/cohere.md)

- **[Cohere Rerank v4 Fast](en/providers/cohere.md)** (`cohere-rerank-v4.0-fast`): A cost-effective reranking model optimized for high-throughput applications with minimal latency. [Model Documentation](en/providers/cohere.md)

**Key Features:**
- **Large Context Window**: 32,768 tokens per document (8x larger than v3.5)
- **Multilingual Support**: Over 100 languages supported
- **Structured Data**: Native support for YAML-formatted structured documents
- **High Document Capacity**: Process up to 10,000 documents per request
- **Normalized Scores**: Relevance scores in [0, 1] range for easy interpretation
- **Endpoint Support**: Available on v1/rerank

**Pricing:**

| Model | Cost per Query |
|-------|----------------|
| cohere-rerank-v4.0-pro | $0.0025/query |
| cohere-rerank-v4.0-fast | $0.002/query |

### Rerank API Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "cohere-rerank-v4.0-pro",
    "query": "What is the capital of the United States?",
    "documents": [
      "Carson City is the capital city of the American state of Nevada.",
      "Washington, D.C. is the capital of the United States. It is a federal district.",
      "Capital punishment has existed in the United States since before it was a country."
    ],
    "top_n": 3
  }'
```

#### Example Response

```json
{
  "id": "rerank-abc123xyz",
  "results": [
    {
      "index": 1,
      "relevance_score": 0.943264
    },
    {
      "index": 0,
      "relevance_score": 0.590401
    },
    {
      "index": 2,
      "relevance_score": 0.466457
    }
  ],
  "usage": {
    "search_units": 1
  },
  "estimated_cost": {
    "unit": "0.0025000000",
    "irt": 286.5,
    "exchange_rate": 114600
  }
}
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "cohere-rerank-v4.0-pro",
    "query": "What is machine learning?",
    "documents": [
      "Machine learning is a subset of artificial intelligence.",
      "Deep learning uses neural networks with many layers.",
      "The weather today is sunny with clear skies."
    ],
    "top_n": 2
  }'

python=:from openai import OpenAI
import requests

api_key = "your-avalai-api-key"

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "cohere-rerank-v4.0-pro",
        "query": "What is machine learning?",
        "documents": [
            "Machine learning is a subset of artificial intelligence.",
            "Deep learning uses neural networks with many layers.",
            "The weather today is sunny with clear skies.",
        ],
        "top_n": 2,
    },
)

print(response.json())

javascript=:const response = await fetch("https://api.avalai.ir/v1/rerank", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "cohere-rerank-v4.0-pro",
        query: "What is machine learning?",
        documents: [
            "Machine learning is a subset of artificial intelligence.",
            "Deep learning uses neural networks with many layers.",
            "The weather today is sunny with clear skies."
        ],
        top_n: 2
    })
});

const result = await response.json();
console.log(result);

```

### Azure Embed v4 (High Rate Limit)

- **[Embed v4 (Azure)](en/providers/cohere.md)** (`embed-v-4-0`): Cohere's latest embedding model served through Azure AI services infrastructure, delivering up to 30x higher rate limits and improved stability compared to the standard `cohere.embed-v4:0` endpoint. [Model Documentation](en/providers/cohere.md)

**Key Features:**
- **High Rate Limits**: Up to 30x more throughput than standard Cohere embed endpoint
- **Multimodal Support**: Process text and images
- **Flexible Dimensions**: Choose from 256, 512, 1024, or 1536 (default) output dimensions
- **Large Context Window**: 128k tokens for processing extensive documents
- **Enhanced Stability**: Azure infrastructure provides enterprise-grade reliability
- **Same Model Quality**: Identical embedding quality to `cohere.embed-v4:0`
- **Endpoint Support**: Available on v1/embeddings

**Pricing:**

| Model | Text Input | Image Input |
|-------|------------|-------------|
| embed-v-4-0 | $0.12/1M tokens | $0.47/1M tokens |

### Embedding API Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "embed-v-4-0",
    "input": "Artificial intelligence is transforming how we work and live.",
    "encoding_format": "float"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    model="embed-v-4-0",
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
  model: "embed-v-4-0",
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
  "model": "embed-v-4-0",
  "usage": {
    "prompt_tokens": 12,
    "total_tokens": 12
  },
  "estimated_cost": {
    "unit": "0.0000014400",
    "irt": 0.17,
    "exchange_rate": 114600
  }
}
```

---

## Use Cases

### Cohere Rerank v4
- **RAG Systems**: Improve retrieval quality by reranking retrieved documents before passing to LLMs
- **Semantic Search**: Enhance search result relevance for enterprise search applications
- **Document Processing**: Rerank long documents with the expanded 32k context window
- **Multilingual Search**: Build search systems supporting 100+ languages
- **Structured Data Search**: Rerank YAML-formatted structured documents

### Azure Embed v4 (embed-v-4-0)
- **High-Throughput Applications**: Ideal for production systems requiring consistent high request rates
- **Enterprise RAG**: Build reliable RAG systems with stable embedding generation
- **Batch Processing**: Process large document collections efficiently
- **Multimodal Search**: Create search systems combining text and image content
- **Real-time Applications**: Suitable for applications requiring low-latency embeddings at scale

---

## Migration Note

If you're currently using `cohere.embed-v4:0`, you can seamlessly switch to `embed-v-4-0` for higher rate limits. Both models produce identical embeddings, ensuring compatibility with existing vector databases and applications.

---

## Related Links

- [Cohere Models Documentation](en/providers/cohere.md)
- [Rerank API Reference](en/api-reference/rerank.md)
- [Embeddings API Reference](en/api-reference/embeddings.md)
- [RAG Best Practices](en/guides/rag-best-practices.md)
- [Retrieval Guide](en/guides/retrieval.md)