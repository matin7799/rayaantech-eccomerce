# Nvidia NIM Models

AvalAI provides access to Nvidia NIM (Nvidia Inference Microservices) platform, offering open-weight models optimized for research and evaluation. These models are provided at research-friendly pricing (approximately 1/10th of production rates) and are ideal for academic research, model evaluation, and educational purposes.

## Important Notice

**These are research-focused models, not production-ready services.** They are designed for:
- Academic research and experimentation
- Model evaluation and benchmarking  
- Educational projects and coursework
- Proof-of-concept development

For production workloads requiring high availability and throughput, we recommend using production-grade versions from other providers (e.g., Groq for Llama models, direct provider APIs for others).

## Available Models

### Embedding Models

Nvidia NIM provides several embedding models for various text understanding tasks.

#### Llama-based Embeddings

**nvidia_nim.llama-3.2-nemoretriever-300m-embed-v1**

Compact embedding model with 300M parameters for efficient text representation.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.2-nemoretriever-300m-embed-v1` |
| Parameters | 300M |
| Input pricing | $0.002 / 1M tokens |
| Cached input pricing | $0.001 / 1M tokens |
| Best for | General-purpose embeddings, semantic search |

**nvidia_nim.llama-3.2-nemoretriever-300m-embed-v2**

Updated version of the 300M embedding model with improved performance.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.2-nemoretriever-300m-embed-v2` |
| Parameters | 300M |
| Input pricing | $0.002 / 1M tokens |
| Best for | General-purpose embeddings, semantic search |

**nvidia_nim.llama-3.2-nemoretriever-1b-vlm-embed-v1**

Vision-language embedding model for multimodal understanding.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.2-nemoretriever-1b-vlm-embed-v1` |
| Parameters | 1B |
| Capabilities | Text and image embeddings |
| Input pricing | $0.002 / 1M tokens |
| Best for | Multimodal search, image-text matching |

**nvidia_nim.llama-3.2-nv-embedqa-1b-v2**

Optimized for question-answering tasks with 1B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.2-nv-embedqa-1b-v2` |
| Parameters | 1B |
| Input pricing | $0.002 / 1M tokens |
| Best for | Q&A systems, information retrieval |

#### General-Purpose Embeddings

**nvidia_nim.nv-embedqa-e5-v5**

E5 architecture optimized for question-answering.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.nv-embedqa-e5-v5` |
| Architecture | E5-based |
| Input pricing | $0.002 / 1M tokens |
| Best for | Q&A retrieval, semantic search |

**nvidia_nim.nv-embed-v1**

General-purpose embedding model from Nvidia.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.nv-embed-v1` |
| Input pricing | $0.002 / 1M tokens |
| Best for | General text embeddings, clustering |

**nvidia_nim.bge-m3**

BAAI's multilingual embedding model.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.bge-m3` |
| Owner | BAAI |
| Capabilities | Multilingual embeddings |
| Input pricing | $0.002 / 1M tokens |
| Best for | Cross-lingual search, multilingual applications |

### Reranking Models

Reranking models improve search results by re-scoring document relevance.

**nvidia_nim.llama-3.2-nemoretriever-500m-rerank-v2**

Compact reranking model with 500M parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.2-nemoretriever-500m-rerank-v2` |
| Parameters | 500M |
| Pricing | $0.0002 per query |
| Best for | Fast reranking, cost-sensitive applications |

**nvidia_nim.llama-3.2-nv-rerankqa-1b-v2**

Q&A-focused reranking with 1B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.2-nv-rerankqa-1b-v2` |
| Parameters | 1B |
| Pricing | $0.0002 per query |
| Best for | Question-answering systems |

**nvidia_nim.nv-rerankqa-mistral-4b-v3**

Mistral-based reranking model with 4B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.nv-rerankqa-mistral-4b-v3` |
| Parameters | 4B |
| Pricing | $0.0002 per query |
| Best for | High-quality reranking, complex queries |

### Text Generation Models

#### Specialized Models

**nvidia_nim.nemotron-parse**

Specialized for document parsing and extraction tasks.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.nemotron-parse` |
| Input pricing | $0.01 / 1M tokens |
| Cached input pricing | $0.001 / 1M tokens |
| Output pricing | $0.06 / 1M tokens |
| Best for | Document parsing, data extraction |

**nvidia_nim.nvidia-nemotron-nano-9b-v2**

Compact 9B parameter model for general text generation.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.nvidia-nemotron-nano-9b-v2` |
| Parameters | 9B |
| Input pricing | $0.004 / 1M tokens |
| Output pricing | $0.016 / 1M tokens |
| Best for | General text generation, summarization |

**nvidia_nim.eurollm-9b-instruct**

European-focused instruction-following model.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.eurollm-9b-instruct` |
| Parameters | 9B |
| Owner | Utter Project |
| Input pricing | $0.022 / 1M tokens |
| Output pricing | $0.022 / 1M tokens |
| Best for | European language tasks, instruction following |

**nvidia_nim.gemma-3-1b-it**

Google's compact instruction-tuned model.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.gemma-3-1b-it` |
| Parameters | 1B |
| Owner | Google |
| Input pricing | $0.001 / 1M tokens |
| Output pricing | $0.005 / 1M tokens |
| Best for | Efficient text generation, edge deployment |

#### Advanced Models

**nvidia_nim.gpt-oss-20b**

Open-source GPT architecture with 20B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.gpt-oss-20b` |
| Parameters | 20B |
| Owner | OpenAI |
| Input pricing | $0.007 / 1M tokens |
| Output pricing | $0.03 / 1M tokens |
| Best for | General text generation, research |

**nvidia_nim.gpt-oss-120b**

Large open-source GPT with 120B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.gpt-oss-120b` |
| Parameters | 120B |
| Owner | OpenAI |
| Input pricing | $0.03 / 1M tokens |
| Output pricing | $0.25 / 1M tokens |
| Best for | Complex reasoning, research benchmarking |

**nvidia_nim.qwen3-next-80b-a3b-thinking**

Alibaba's reasoning model with 80B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.qwen3-next-80b-a3b-thinking` |
| Parameters | 80B |
| Owner | Alibaba |
| Capabilities | Extended reasoning |
| Input pricing | $0.015 / 1M tokens |
| Output pricing | $0.12 / 1M tokens |
| Best for | Complex reasoning, analytical tasks |

**nvidia_nim.llama-4-scout-17b-16e-instruct**

Meta's efficient Llama variant optimized for performance.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-4-scout-17b-16e-instruct` |
| Parameters | 17B |
| Owner | Meta |
| Input pricing | $0.011 / 1M tokens |
| Cached input pricing | $0.0055 / 1M tokens |
| Output pricing | $0.034 / 1M tokens |
| Best for | General text generation, instruction following |

**Pricing Comparison:**

| Provider | Model | Input ($/1M) | Cached ($/1M) | Output ($/1M) |
|----------|-------|--------------|---------------|---------------|
| Nvidia NIM (Research) | llama-4-scout-17b-16e-instruct | $0.027 | $0.014 | $0.085 |
| Groq (Production) | llama-4-scout-17b-16e-instruct | $0.11 | $0.055 | $0.34 |

**nvidia_nim.llama-3.1-nemotron-ultra-253b-v1**

Ultra-large Nemotron model with 253B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.1-nemotron-ultra-253b-v1` |
| Parameters | 253B |
| Owner | Nvidia |
| Input pricing | $0.06 / 1M tokens |
| Output pricing | $0.18 / 1M tokens |
| Best for | Complex reasoning, research applications |

**nvidia_nim.llama-3.3-nemotron-super-49b-v1.5**

Optimized Nemotron variant with 49B parameters.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.llama-3.3-nemotron-super-49b-v1.5` |
| Parameters | 49B |
| Owner | Nvidia |
| Input pricing | $0.01 / 1M tokens |
| Output pricing | $0.03 / 1M tokens |
| Best for | Balanced performance and cost |

### Vision Models

**nvidia_nim.nemotron-nano-12b-v2-vl**

Vision-language model for multimodal tasks.

| Feature | Details |
|---------|---------|
| Model ID | `nvidia_nim.nemotron-nano-12b-v2-vl` |
| Parameters | 12B |
| Capabilities | Text and image understanding |
| Input pricing | $0.01 / 1M tokens |
| Output pricing | $0.06 / 1M tokens |
| Best for | Image captioning, visual Q&A |

## Production NVIDIA Models (via Fireworks.ai)

In addition to the research-focused NIM models above, AvalAI offers a production-grade NVIDIA Nemotron model served through the Fireworks.ai platform. Unlike the NIM research models, this model is intended for production workloads with standard rate limits.

**nemotron-3-ultra**

NVIDIA's flagship large-scale Nemotron model for complex reasoning and agentic workflows, hosted on Fireworks.ai.

| Feature | Details |
|---------|---------|
| Model ID | `nemotron-3-ultra` |
| Owner | NVIDIA |
| API Provider | Fireworks.ai |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.12 / 1M tokens |
| Output pricing | $2.40 / 1M tokens |
| Available on | `v1/chat/completions`, `v1/responses` (partial) |
| Best for | Complex reasoning, agentic workflows, high-quality text generation |

For full documentation, usage examples, and function calling, see the [Fireworks.ai provider page](en/providers/fireworksai.md#nemotron-3-ultra).

## Rate Limits

All Nvidia NIM models have tier-based rate limits designed for research use:

| Tier | Rate Limit |
|------|------------|
| basic | 3 RPM |
| tier1 | 5 RPM |
| tier2 | 10 RPM |
| tier3 | 15 RPM |
| tier4 | 20 RPM |
| tier5 | 30 RPM |

**Note:** These low rate limits reflect the research-focused nature of these models. For production workloads, use production-grade alternatives.

## Usage Examples

### Embedding Example

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate embeddings
response = client.embeddings.create(
    model="nvidia_nim.nv-embed-v1",
    input="Natural language processing enables machines to understand human language",
)

print(response.data[0].embedding[:5])  # First 5 dimensions
```

### Text Generation Example

```python
response = client.chat.completions.create(
    model="nvidia_nim.llama-3.3-nemotron-super-49b-v1.5",
    messages=[
        {
            "role": "user",
            "content": "Explain the difference between supervised and unsupervised learning.",
        }
    ],
)

print(response.choices[0].message.content)
```

### Reranking Example

```python
import requests

api_key = "your-avalai-api-key"

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
```

### Vision Model Example

```python
import base64


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


base64_image = encode_image("path/to/image.jpg")

response = client.chat.completions.create(
    model="nvidia_nim.nemotron-nano-12b-v2-vl",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)
```

## Use Cases

### Research & Academic
- Benchmarking model performance across architectures
- Educational projects and coursework
- Algorithm development and testing
- Paper reproduction and validation
- Model comparison studies

### Development & Prototyping
- Proof-of-concept development
- Feature exploration before production
- Cost-effective model evaluation
- Integration testing
- Rapid prototyping

### Not Recommended For
- Production applications requiring high availability
- Services with significant user traffic
- Mission-critical applications
- Real-time systems requiring low latency at scale
- Applications requiring guaranteed uptime

## Best Practices

1. **Rate Limit Management**: Plan your requests within tier limits
2. **Cost Optimization**: Use cached inputs when possible
3. **Model Selection**: Choose the smallest model that meets your needs
4. **Evaluation**: Test thoroughly before considering production alternatives
5. **Fallback Strategy**: Have production alternatives identified for scaling

## Transition to Production

When ready to move from research to production:

1. **Identify Production Alternatives**:
   - Llama models → Groq, Together AI, or Fireworks AI
   - Qwen models → Alibaba DashScope
   - General models → Direct provider APIs

2. **Performance Comparison**: Benchmark against production versions
3. **Cost Analysis**: Calculate production costs vs. research pricing
4. **Rate Limit Planning**: Ensure production rate limits meet your needs

## Related Resources

- [Nvidia NIM Platform Support News](en/news/2025-11-22-nvidia-nim-platform-support-added.md)
- [API Reference: Chat Completions](en/api-reference/chat.md)
- [API Reference: Embeddings](en/api-reference/embeddings.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Pricing](en/pricing.md)