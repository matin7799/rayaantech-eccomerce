# Cohere Models

AvalAI provides access to Cohere's suite of models designed for enterprise use cases, including advanced chat, retrieval-augmented generation (RAG), embedding, and reranking capabilities.

## Chat Models (Command Series)

Cohere's Command models are optimized for conversational AI and long-context tasks.

### Command R+

Cohere's most powerful and scalable model, excelling at complex RAG and tool use tasks.

| Feature        | Details                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| Model ID       | `command-r-plus`                                                   |
| Context window | 128,000 tokens                                                            |
| Capabilities   | Chat, Advanced RAG, Tool Use (Function Calling), Multilingual             |
| Input pricing  | $0.50 / 1M tokens                                                         |
| Output pricing | $1.50 / 1M tokens                                                         |
| Strengths      | State-of-the-art for RAG, complex workflows, enterprise-grade reliability |
| Best for       | Demanding RAG applications, multi-step tool use, complex business logic   |

```python
response = client.chat.completions.create(
    model="command-r-plus",
    messages=[
        {
            "role": "user",
            "content": "Based on the provided documents [cite documents], summarize the key findings regarding market trends.",
        },
        # Add documents/citations as needed by Cohere's chat endpoint structure
    ],
    # Add tool definitions if using Tool Use
)
```

### Command R

A highly capable and scalable model balancing performance and cost for RAG and tool use.

| Feature        | Details                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| Model ID       | `command-r`                                                             |
| Context window | 128,000 tokens                                                                 |
| Capabilities   | Chat, RAG, Tool Use (Function Calling), Multilingual                           |
| Input pricing  | $0.50 / 1M tokens (Note: Typically lower than R+, check Cohere pricing)        |
| Output pricing | $1.50 / 1M tokens (Note: Typically lower than R+, check Cohere pricing)        |
| Strengths      | Strong balance of performance and cost for RAG and tool use                    |
| Best for       | General RAG applications, chatbots requiring citations, tool-enabled workflows |

```python
response = client.chat.completions.create(
    model="command-r",
    messages=[
        {"role": "user", "content": "What is Cohere's Command R model?"},
    ],
)
```

_Note: Older models like `command` and `cohere.command-light` might also be available with smaller context windows._

## Rerank Models

Cohere's Rerank models improve the quality of search results for RAG systems by re-ordering documents based on relevance to the query.

### Rerank v4.0 Pro

The highest-quality reranking model with 32,768-token context window—8x larger than v3.5.

| Feature        | Details                                                       |
| -------------- | ------------------------------------------------------------- |
| Model ID       | `cohere-rerank-v4.0-pro`                                      |
| Context Window | 32,768 tokens                                                 |
| Input type     | Query string, list of document texts/IDs                      |
| Output type    | Re-ordered list of documents with relevance scores [0, 1]     |
| Languages      | 100+ languages supported                                      |
| Pricing        | $0.0025 / query                                               |
| Strengths      | Highest accuracy, long document support, multilingual         |
| Best for       | Production RAG systems requiring maximum relevance accuracy   |

```python
import requests

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "cohere-rerank-v4.0-pro",
        "query": "What is the capital of Canada?",
        "documents": [
            "Ottawa is the capital of Canada.",
            "Toronto is the largest city in Canada.",
        ],
        "top_n": 2,
    },
)
```

### Rerank v4.0 Fast

A cost-effective reranking model optimized for high-throughput applications with minimal latency.

| Feature        | Details                                                       |
| -------------- | ------------------------------------------------------------- |
| Model ID       | `cohere-rerank-v4.0-fast`                                     |
| Context Window | 32,768 tokens                                                 |
| Input type     | Query string, list of document texts/IDs                      |
| Output type    | Re-ordered list of documents with relevance scores [0, 1]     |
| Languages      | 100+ languages supported                                      |
| Pricing        | $0.002 / query                                                |
| Strengths      | Fast, cost-effective, good accuracy                           |
| Best for       | High-throughput applications with cost sensitivity            |

```python
import requests

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "cohere-rerank-v4.0-fast",
        "query": "What is the capital of Canada?",
        "documents": [
            "Ottawa is the capital of Canada.",
            "Toronto is the largest city in Canada.",
        ],
        "top_n": 2,
    },
)
```

### Rerank v3.5

The previous generation reranking model.

| Feature     | Details                                                       |
| ----------- | ------------------------------------------------------------- |
| Model ID    | `cohere.rerank-v3-5:0`                                        |
| Input type  | Query string, list of document texts/IDs                      |
| Output type | Re-ordered list of documents with relevance scores            |
| Pricing     | $1.00 / 1,000 Search Units                                    |
| Strengths   | Significantly improves search relevance for documents         |
| Best for    | Enhancing RAG systems, semantic search applications           |

```python
# Example using Cohere's SDK (AvalAI might use a compatible endpoint)
# results = co.rerank(query="What is the capital of Canada?", documents=docs, model="cohere.rerank-v3-5:0")
```

## Embedding Models (Embed Series)

Cohere's Embed models generate high-quality text and (for v3 Multilingual) image embeddings for semantic search and other representation tasks.

### Embed English v3

State-of-the-art English embedding model.

| Feature          | Details                                               |
| ---------------- | ----------------------------------------------------- |
| Model ID         | `cohere.embed-english-v3.0`                           |
| Dimensions       | 1024                                                  |
| Max input tokens | 512                                                   |
| Input pricing    | $0.10 / 1M tokens                                     |
| Strengths        | Top performance on English embedding benchmarks       |
| Best for         | Semantic search, clustering, classification (English) |

```python
response = client.embeddings.create(
    model="cohere.embed-english-v3.0",
    input=["Your text here", "Another piece of text"],
    input_type="search_document",  # Or: search_query, classification, clustering
)
```

### Embed Multilingual v3

State-of-the-art multilingual embedding model, supporting 100+ languages and image inputs.

| Feature          | Details                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| Model ID         | `cohere.embed-multilingual-v3.0`                                         |
| Dimensions       | 1024                                                                     |
| Max input tokens | 512 (text)                                                               |
| Input pricing    | $0.10 / 1M tokens (text)                                                 |
| Strengths        | High performance across many languages, supports text & image embeddings |
| Best for         | Multilingual semantic search, cross-modal search (text/image)            |

```python
# Text Embedding
response = client.embeddings.create(
    model="cohere.embed-multilingual-v3.0",
    input=["Aquí está tu texto", "Ein weiterer Text"],
    input_type="search_document",
)

# Image Embedding requires specific handling, check cohere.AvalAI docs
```


### Embed v4 (AWS)

Cohere's latest multimodal embedding model supporting text, images, and mixed content including PDFs. Features a massive 128k context window and flexible output dimensions. Served via AWS infrastructure.

| Feature          | Details                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| Model ID         | `cohere.embed-v4:0`                                                      |
| Provider         | AWS                                                                      |
| Dimensions       | 256, 512, 1024, or 1536 (default)                                        |
| Max input tokens | 128,000 tokens                                                           |
| Input types      | Text, Images, Mixed texts/images (PDFs)                                  |
| Text pricing     | Contact for pricing                                                      |
| Image pricing    | Contact for pricing                                                      |
| Similarity metrics | Cosine Similarity, Dot Product Similarity, Euclidean Distance          |
| Strengths        | Multimodal support, large context window, flexible dimensions            |
| Best for         | Document embeddings, PDF processing, multimodal search, RAG systems      |

```python
# Text Embedding
response = client.embeddings.create(
    model="cohere.embed-v4:0",
    input=["Your text here", "Another piece of text"],
    encoding_format="float",
)

# You can also specify custom dimensions
response = client.embeddings.create(
    model="cohere.embed-v4:0",
    input=["Your text here"],
    dimensions=1024,  # Choose from 256, 512, 1024, or 1536
    encoding_format="float",
)
```

### Embed v4 (Azure) - High Rate Limit

The same Cohere Embed v4 model served via Azure AI services infrastructure. Offers up to 30x higher rate limits compared to the AWS endpoint, ideal for high-throughput production workloads.

| Feature          | Details                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| Model ID         | `embed-v-4-0`                                                            |
| Provider         | Azure AI Services                                                        |
| Dimensions       | 256, 512, 1024, or 1536 (default)                                        |
| Max input tokens | 128,000 tokens                                                           |
| Input types      | Text, Images, Mixed texts/images (PDFs)                                  |
| Text pricing     | $0.12 / 1M tokens                                                        |
| Image pricing    | $0.47 / 1M tokens                                                        |
| Similarity metrics | Cosine Similarity, Dot Product Similarity, Euclidean Distance          |
| Rate limits      | Up to 30x higher than AWS endpoint                                       |
| Strengths        | High throughput, enterprise-grade stability, identical quality           |
| Best for         | High-throughput applications, production RAG systems, batch processing   |

```python
# Text Embedding with high rate limits
response = client.embeddings.create(
    model="embed-v-4-0",
    input=["Your text here", "Another piece of text"],
    encoding_format="float",
)

# You can also specify custom dimensions
response = client.embeddings.create(
    model="embed-v-4-0",
    input=["Your text here"],
    dimensions=1024,  # Choose from 256, 512, 1024, or 1536
    encoding_format="float",
)
```

_Note: Both `cohere.embed-v4:0` (AWS) and `embed-v-4-0` (Azure) produce identical embeddings. Choose based on your rate limit and throughput requirements._

_Note: Light and v2 versions of embedding models might also be available._

## Using Cohere Models via AvalAI

Access Cohere models using standard AvalAI API endpoints. Chat models use the OpenAI-compatible `/chat/completions` endpoint. Embedding and Rerank models may use `/embeddings` and potentially custom endpoints compatible with Cohere's API structure. Check AvalAI documentation for specifics on Rerank usage.

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Example using Command R+ Chat
response = client.chat.completions.create(
    model="cohere.command-r-plus",
    messages=[{"role": "user", "content": "What are Cohere's main product areas?"}],
)

# Example using Embed English v3
embed_response = client.embeddings.create(
    model="cohere.embed-english-v3.0", input=["This is a test sentence."]
)

print(response.choices[0].message.content)
# print(embed_response.data[0].embedding)
```

## Related Resources

- [Chat Completions API](en/api-reference/chat.md)
- [Embeddings API](en/api-reference/embeddings.md)
- [Model Index](en/models/model-details.md)
- [Authentication](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)
