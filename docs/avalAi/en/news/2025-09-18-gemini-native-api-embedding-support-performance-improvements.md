# Expanded Gemini Native API: Embedding Support and Performance Improvements

**Date:** 2025-09-18 / (1404-06-28) 

## Summary

AvalAI expands the `v1beta` Gemini Native API with embedding support through the new `embedContent` endpoint, introduces task-specific optimization features, and delivers API performance improvements including enhanced success rates and reduced latency as part of our ongoing performance improvement sprint.

---

## Details

We announce enhancements to our `v1beta` Gemini Native API that expand embedding capabilities while delivering improved performance across our platform.

### Gemini Native API Embedding Support

We've added comprehensive embedding support to the `v1beta` Gemini Native API, enabling developers to leverage Google's advanced embedding models through both OpenAI-compatible and native Google GenAI SDK approaches.

#### New embedContent Endpoint

- **gemini-embedding-001**: Google's flagship embedding model with advanced task-specific optimization and flexible dimensionality control. [Documentation](en/providers/google.md)

**Key Features:**
- **Endpoint**: `/v1beta/models/{model}:embedContent`
- **Max input tokens**: 2,048 tokens
- **Output dimensions**: Flexible 128-3072 (Recommended: 768, 1536, 3072)
- **Input pricing**: $0.15 / 1M tokens
- **Output pricing**: $0.075 / 1M tokens
- **Task types**: `SEMANTIC_SIMILARITY`, `CLASSIFICATION`, `CLUSTERING`, `RETRIEVAL_DOCUMENT`, `RETRIEVAL_QUERY`, `CODE_RETRIEVAL_QUERY`, `QUESTION_ANSWERING`, `FACT_VERIFICATION`
- **Advanced features**: Matryoshka Representation Learning (MRL) for flexible dimensionality
- **Available on**: [`/v1beta/models`](en/api-reference/v1beta.md), [`v1/embeddings`](en/api-reference/embeddings.md)

```language-selector
python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Basic embedding generation
result = client.models.embed_content(
    model="gemini-embedding-001", contents="What is the meaning of life?"
)

print(f"Embedding dimensions: {len(result.embeddings[0].values)}")

# Advanced usage with task type and custom dimensions
result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=[
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ],
    config=types.EmbedContentConfig(
        task_type="SEMANTIC_SIMILARITY", output_dimensionality=768
    ),
)

for i, embedding in enumerate(result.embeddings):
    print(f"Embedding {i}: {len(embedding.values)} dimensions")

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

// Basic embedding generation
const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "What is the meaning of life?"
});

console.log(`Embedding dimensions: ${response.embeddings[0].values.length}`);

// Advanced usage with task type
const advancedResponse = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [
        "What is the meaning of life?",
        "What is the purpose of existence?"
    ],
    taskType: "SEMANTIC_SIMILARITY",
    outputDimensionality: 768
});

console.log(`Generated ${advancedResponse.embeddings.length} embeddings`);

bash=:# Basic embedding with native API
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [
      {"parts": [{"text": "What is the meaning of life?"}]}
    ]
  }'

# Advanced usage with task type and custom dimensions
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [
      {"parts": [{"text": "What is the meaning of life?"}]},
      {"parts": [{"text": "What is the purpose of existence?"}]}
    ],
    "embedding_config": {
      "task_type": "SEMANTIC_SIMILARITY",
      "output_dimensionality": 768
    }
  }'

```

### Enhanced OpenAI-Compatible Embedding Support

In addition to native API support, we've enhanced our OpenAI-compatible embeddings endpoint with full Gemini embedding capabilities:

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Advanced Gemini embedding with task type and custom dimensions
response = client.embeddings.create(
    model="gemini-embedding-001",
    input=[
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ],
    extra_body={"task_type": "SEMANTIC_SIMILARITY", "output_dimensionality": 768},
)

# Calculate cosine similarity
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

embeddings = [item.embedding for item in response.data]
embeddings_matrix = np.array(embeddings)
similarity_matrix = cosine_similarity(embeddings_matrix)

print(f"Similarity between first two texts: {similarity_matrix[0, 1]:.4f}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Advanced Gemini embedding with task type
const response = await client.embeddings.create({
    model: "gemini-embedding-001",
    input: [
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?"
    ],
    // @ts-expect-error extra_body is a provider-specific parameter
    extra_body: {
        task_type: "SEMANTIC_SIMILARITY",
        output_dimensionality: 768
    }
});

const embeddings = response.data.map(item => item.embedding);
console.log(`Generated ${embeddings.length} embeddings with ${embeddings[0].length} dimensions`);

```

### Performance Improvement Sprint Results

As part of our ongoing performance improvement sprint that began last month, we've delivered significant enhancements to API service stability and performance:

**Performance Improvements:**
- **Success Rate Enhancement**: Improved API success rates across all endpoints
- **Latency Reduction**: Reduced average response latency for embedding operations
- **Connection Stability**: Enhanced connection management and error handling
- **Throughput Optimization**: Increased concurrent request handling capacity by 70%
- **Error Recovery**: Improved automatic retry mechanisms and graceful degradation

**Affected Services:**
- [`v1/embeddings`](en/api-reference/embeddings.md) - Enhanced embedding generation performance
- [`/v1beta/models`](en/api-reference/v1beta.md) - Improved native Gemini API reliability
- [`v1/chat/completions`](en/api-reference/chat.md) - Optimized streaming and batch processing
- [`v1/responses`](en/api-reference/responses.md) - Enhanced response generation stability

### Advanced Embedding Features

Our Gemini embedding implementation includes cutting-edge features for optimal performance:

**Task-Specific Optimization:**
- **`SEMANTIC_SIMILARITY`**: Optimized for recommendation systems and duplicate detection
- **`CLASSIFICATION`**: Enhanced for sentiment analysis and spam detection  
- **`CLUSTERING`**: Improved for document organization and market research
- **`RETRIEVAL_DOCUMENT`**: Optimized for RAG systems and search engines
- **`RETRIEVAL_QUERY`**: Enhanced for custom search applications
- **`CODE_RETRIEVAL_QUERY`**: Specialized for code search and documentation lookup
- **`QUESTION_ANSWERING`**: Optimized for chatbots and FAQ systems
- **`FACT_VERIFICATION`**: Enhanced for automated verification systems

**Flexible Dimensionality Control:**
- Support for 128-3072 dimensions with Matryoshka Representation Learning (MRL)
- Recommended dimensions: 768, 1536, 3072 for optimal performance
- Automatic normalization for 3072 dimensions
- Manual normalization guidance for smaller dimensions

---

## Related Links

- [Google Models Documentation](en/providers/google.md) - Complete guide to Gemini models and embeddings
- [Embeddings API Reference](en/api-reference/embeddings.md) - OpenAI-compatible embedding endpoint documentation
- [v1beta API Reference](en/api-reference/v1beta.md) - Native Gemini API documentation with embedContent endpoint
- [Native Gemini API Support](en/news/2025-07-22-native-gemini-api-support-now-available.md) - Previous announcement of native API support
- [Streaming Performance Improvements](en/news/2025-09-14-deepseek-v3-1-grok-code-fast-1-streaming-improvements.md) - Previous performance enhancement announcement