# Nvidia NIM Platform Support Added: Research-Focused Open Weight Models

**Date:** 2025-11-22 / (1404-09-01)

## Summary

We announce support for Nvidia NIM platform, providing access to open-weight models optimized for research and evaluation. These models are offered at research-friendly pricing (1/10th of production rates) with rate limits designed for academic and experimental use. The platform includes 20 models spanning embeddings, reranking, text generation, and vision capabilities from providers like Meta, Google, Nvidia, and Alibaba.

---

## Details

### Nvidia NIM Platform

Nvidia NIM (Nvidia Inference Microservices) provides access to open-weight models that are ideal for researchers, students, and developers exploring AI capabilities. These models are offered free on Nvidia's platform with very low rate limits, and we provide access at research-friendly pricing (approximately 1/10th of production model rates).

**Important Note:** These are research-focused models, not production-ready services. They are designed for:
- Academic research and experimentation
- Model evaluation and benchmarking
- Educational purposes
- Proof-of-concept development

For production workloads, we recommend using the production-grade versions available from other providers (e.g., Groq for Llama models).

### Available Models

#### Embedding Models

**Llama-based Embeddings:**
- **nvidia_nim.llama-3.2-nemoretriever-300m-embed-v1**: Compact embedding model (300M parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-3.2-nemoretriever-300m-embed-v2**: Updated compact embedding model - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-3.2-nemoretriever-1b-vlm-embed-v1**: Vision-language embedding model (1B parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-3.2-nv-embedqa-1b-v2**: Question-answering focused embeddings - [Documentation](en/providers/nvidianim.md)

**General Embeddings:**
- **nvidia_nim.nv-embedqa-e5-v5**: E5 architecture for Q&A tasks - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.nv-embed-v1**: General-purpose embedding model - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.bge-m3**: BAAI's multilingual embedding model - [Documentation](en/providers/nvidianim.md)

#### Reranking Models

- **nvidia_nim.llama-3.2-nemoretriever-500m-rerank-v2**: Compact reranking model (500M parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-3.2-nv-rerankqa-1b-v2**: Q&A focused reranking (1B parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.nv-rerankqa-mistral-4b-v3**: Mistral-based reranking (4B parameters) - [Documentation](en/providers/nvidianim.md)

#### Text Generation Models

**Specialized Models:**
- **nvidia_nim.nemotron-parse**: Document parsing and extraction - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.nvidia-nemotron-nano-9b-v2**: Compact generation model (9B parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.eurollm-9b-instruct**: European-focused instruction model - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.gemma-3-1b-it**: Google's compact instruction model - [Documentation](en/providers/nvidianim.md)

**Advanced Models:**
- **nvidia_nim.gpt-oss-20b**: Open-source GPT architecture (20B parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.gpt-oss-120b**: Large open-source GPT (120B parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.qwen3-next-80b-a3b-thinking**: Alibaba's reasoning model (80B parameters) - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-4-scout-17b-16e-instruct**: Meta's efficient Llama variant - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-3.1-nemotron-ultra-253b-v1**: Ultra-large Nemotron model - [Documentation](en/providers/nvidianim.md)
- **nvidia_nim.llama-3.3-nemotron-super-49b-v1.5**: Optimized Nemotron variant - [Documentation](en/providers/nvidianim.md)

#### Vision Models

- **nvidia_nim.nemotron-nano-12b-v2-vl**: Vision-language model for multimodal tasks - [Documentation](en/providers/nvidianim.md)

### Rate Limits

All Nvidia NIM models have the following rate limits based on your tier:

| Tier | Rate Limit |
|------|------------|
| basic | 3 RPM |
| tier1 | 5 RPM |
| tier2 | 10 RPM |
| tier3 | 15 RPM |
| tier4 | 20 RPM |
| tier5 | 30 RPM |

**Note:** These rate limits are designed for research and experimentation. For production workloads requiring higher throughput, consider using production-grade equivalents from other providers.

### Pricing Comparison

Nvidia NIM models are priced at approximately 1/10th of production equivalents. For example:

**Research vs. Production Pricing:**

| Model | Provider | Input ($/1M) | Cached Input ($/1M) | Output ($/1M) |
|-------|----------|--------------|---------------------|---------------|
| llama-4-scout-17b-16e-instruct | Nvidia NIM (Research) | $0.027 | $0.014 | $0.085 |
| llama-4-scout-17b-16e-instruct | Groq (Production) | $0.11 | $0.055 | $0.34 |

This pricing structure makes Nvidia NIM models ideal for cost-effective research, evaluation, and learning.

### API Request/Response Examples

#### Embedding Model Example

```bash
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "nvidia_nim.nv-embed-v1",
    "input": "Natural language processing enables machines to understand human language"
  }'
```

#### Text Generation Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "nvidia_nim.llama-3.3-nemotron-super-49b-v1.5",
    "messages": [
      {
        "role": "user",
        "content": "Explain the difference between supervised and unsupervised learning."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "your-avalai-api-key",
  "created": 1732262400,
  "model": "nvidia_nim.llama-3.3-nemotron-super-49b-v1.5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Supervised learning uses labeled data where the model learns from input-output pairs, like training a model to recognize cats by showing it images labeled as 'cat' or 'not cat'. Unsupervised learning works with unlabeled data, finding patterns independently, like grouping similar customers without predefined categories. The key difference is that supervised learning has a 'teacher' providing correct answers, while unsupervised learning discovers structure on its own.",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 85,
    "prompt_tokens": 18,
    "total_tokens": 103,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 18,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0000273000",
    "irt": 3.13,
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
    "model": "nvidia_nim.nvidia-nemotron-nano-9b-v2",
    "messages": [
      {
        "role": "user",
        "content": "What are the applications of transformers in NLP?"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="nvidia_nim.nvidia-nemotron-nano-9b-v2",
    messages=[
        {
            "role": "user",
            "content": "What are the applications of transformers in NLP?",
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
  model: "nvidia_nim.nvidia-nemotron-nano-9b-v2",
  messages: [
    {
      role: "user",
      content: "What are the applications of transformers in NLP?",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Reranking Example

```language-selector
bash=:curl https://api.avalai.ir/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "nvidia_nim.nv-rerankqa-mistral-4b-v3",
    "query": "What is machine learning?",
    "documents": [
      "Machine learning is a subset of artificial intelligence.",
      "Python is a popular programming language.",
      "Deep learning uses neural networks with multiple layers."
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Note: Using requests for rerank endpoint
import requests

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "nvidia_nim.nv-rerankqa-mistral-4b-v3",
        "query": "What is machine learning?",
        "documents": [
            "Machine learning is a subset of artificial intelligence.",
            "Python is a popular programming language.",
            "Deep learning uses neural networks with multiple layers.",
        ],
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
        model: "nvidia_nim.nv-rerankqa-mistral-4b-v3",
        query: "What is machine learning?",
        documents: [
            "Machine learning is a subset of artificial intelligence.",
            "Python is a popular programming language.",
            "Deep learning uses neural networks with multiple layers."
        ]
    })
});

const result = await response.json();
console.log(result);

```

### Use Cases

**Research & Academic:**
- Benchmarking model performance across different architectures
- Educational projects and coursework
- Algorithm development and testing
- Paper reproduction and validation

**Development & Prototyping:**
- Proof-of-concept development
- Feature exploration before production deployment
- Cost-effective model evaluation
- Integration testing

**Not Recommended For:**
- Production applications requiring high availability
- Services with significant user traffic
- Mission-critical applications
- Real-time systems requiring low latency at scale

---

## Related Links

- [Nvidia NIM Models Documentation](en/providers/nvidianim.md)
- [API Reference: Chat Completions](en/api-reference/chat.md)
- [API Reference: Embeddings](en/api-reference/embeddings.md)
- [API Reference: Rerank](en/api-reference/rerank.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
- [Pricing](en/pricing.md)