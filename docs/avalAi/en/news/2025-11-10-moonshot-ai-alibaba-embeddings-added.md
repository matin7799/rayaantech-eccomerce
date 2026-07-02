# Moonshot.ai Provider and Alibaba Embedding Models Now Available

**Date:** 2025-11-10

## Summary

AvalAI introduces support for Moonshot.ai, a new provider offering 10 advanced models including the powerful Kimi series with up to 128K context windows and reasoning capabilities. Additionally, we introduce 4 new multimodal and text embedding models from Alibaba (Dashscope), expanding your options for vector-based applications. All models are available through our unified API with support for multiple endpoints.

---

## Details

### Moonshot.ai

We introduce 10 new models from Moonshot.ai, featuring the advanced Kimi series with extended context windows, vision capabilities, reasoning features, and tool calling support:

- **[kimi-k2-0711-preview](en/providers/moonshotai.md#kimi-k2-0711-preview)**: Preview release of the next-generation K2 model with enhanced performance and efficiency. 128K context length.

- **[kimi-latest](en/providers/moonshotai.md#kimi-latest)**: The latest stable Kimi model with automatic version selection and optimization. 128K context length.

- **[kimi-thinking-preview](en/providers/moonshotai.md#kimi-thinking-preview)**: Advanced reasoning model with Chain-of-Thought capabilities for complex multi-step problem-solving. 128K context length.

- **[moonshot-v1-8k](en/providers/moonshotai.md#moonshot-v1-8k)**: Cost-effective model for shorter conversations. 8K context length.

- **[moonshot-v1-8k-vision-preview](en/providers/moonshotai.md#moonshot-v1-8k-vision-preview)**: Vision-enabled model for multimodal tasks. 8K context length.

- **[moonshot-v1-32k](en/providers/moonshotai.md#moonshot-v1-32k)**: Balanced model for medium-length conversations. 32K context length.

- **[moonshot-v1-32k-vision-preview](en/providers/moonshotai.md#moonshot-v1-32k-vision-preview)**: Vision-enabled model with extended context. 32K context length.

- **[moonshot-v1-128k](en/providers/moonshotai.md#moonshot-v1-128k)**: Extended context model for document processing. 128K context length.

- **[moonshot-v1-128k-vision-preview](en/providers/moonshotai.md#moonshot-v1-128k-vision-preview)**: Vision-enabled model with maximum context window. 128K context length.

- **[moonshot-v1-auto](en/providers/moonshotai.md#moonshot-v1-auto)**: Automatically selects the optimal model based on your input. Up to 128K context length.

**Key Features:**
- **Extended Context Windows**: 8K to 128K tokens for handling extensive conversations and documents
- **Vision Capabilities**: Vision-preview models support Base64-encoded images and image URLs
- **Reasoning Models**: [`kimi-thinking-preview`](en/providers/moonshotai.md#kimi-thinking-preview) provides Chain-of-Thought reasoning for complex analysis
- **Tool Use (Function Calling)**: All models support function calling with up to 128 tools per request
- **JSON Mode**: Structured output support via `response_format` parameter
- **Partial Mode**: Ability to prefill assistant responses for better output control
- **Auto Selection**: [`moonshot-v1-auto`](en/providers/moonshotai.md#moonshot-v1-auto) intelligently routes to the best model
- **Prompt Caching**: All models support cached input for significant cost savings on repeated tokens
- **OpenAI Compatibility**: Full support for OpenAI SDK and API format

**Endpoint Support:**
- **Full Support**: [`v1/chat/completions`](en/guides/text-generation.md)
- **Partial Support**: [`v1/messages`](en/guides/responses-vs-chat-completions.md), [`v1/responses`](en/guides/responses-vs-chat-completions.md)

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| kimi-k2-0711-preview | $0.66/1M tokens | $0.165/1M tokens | $2.75/1M tokens |
| kimi-latest | $0.22/1M tokens | $0.165/1M tokens | $5.50/1M tokens |
| kimi-thinking-preview | $33.00/1M tokens | $0.165/1M tokens | $33.00/1M tokens |
| moonshot-v1-8k | $0.22/1M tokens | $0.165/1M tokens | $2.20/1M tokens |
| moonshot-v1-8k-vision-preview | $0.22/1M tokens | $0.165/1M tokens | $2.20/1M tokens |
| moonshot-v1-32k | $1.10/1M tokens | $0.165/1M tokens | $3.30/1M tokens |
| moonshot-v1-32k-vision-preview | $1.10/1M tokens | $0.165/1M tokens | $3.30/1M tokens |
| moonshot-v1-128k | $2.20/1M tokens | $0.165/1M tokens | $5.50/1M tokens |
| moonshot-v1-128k-vision-preview | $2.20/1M tokens | $0.165/1M tokens | $5.50/1M tokens |
| moonshot-v1-auto | $2.20/1M tokens | $0.165/1M tokens | $5.50/1M tokens |

**Additional Costs:**
- Web Search Tool Call: $0.005 per call (when using external web search tools)

**Note on Pricing:** Due to Singapore's 9% GST requirements, we've added 10% to official Moonshot.ai pricing to cover payment processing fees. We remain committed to our no-markup, zero-fee API service for base API services. [Learn more about our pricing policy](en/pricing.md).

### Alibaba (Dashscope) Embedding Models

We introduce 4 new embedding models from Alibaba Dashscope, including multimodal capabilities:

- **[tongyi-embedding-vision-plus](en/providers/alibaba.md#tongyi-embedding-vision-plus)**: Advanced multimodal embedding model supporting text, images, and videos. 1,152 dimensions, 1,024 token text limit.

- **[tongyi-embedding-vision-flash](en/providers/alibaba.md#tongyi-embedding-vision-flash)**: Fast multimodal embedding model optimized for speed. 768 dimensions, 1,024 token text limit.

- **[text-embedding-v4](en/providers/alibaba.md#text-embedding-v4)**: Latest generation text embedding model with configurable dimensions (64-2,048). Supports task instructions, sparse vectors, and batch processing.

- **[text-embedding-v3](en/providers/alibaba.md#text-embedding-v3)**: Previous generation text embedding model with proven performance. Configurable dimensions (512-1,024).

**Key Features:**
- **Multimodal Support**: Vision models support text, images, and video inputs
- **Configurable Dimensions**: Text models support multiple dimension options
- **OpenAI Compatibility**: Works with OpenAI SDK through [`v1/embeddings`](en/guides/retrieval.md) endpoint
- **Native API Support**: Also returns Alibaba native response format for advanced features
- **Task Instructions**: [`text-embedding-v4`](en/providers/alibaba.md#text-embedding-v4) supports custom task optimization
- **Sparse Vectors**: [`text-embedding-v4`](en/providers/alibaba.md#text-embedding-v4) can generate both dense and sparse vectors

**Use Cases:**
- Cross-modal retrieval (text-to-image, image-to-video)
- Semantic similarity calculation
- Content classification and clustering
- Text-based image search
- Video content analysis

For native Alibaba API parameters with OpenAI SDK, use the [`extra_body`](en/guides/provider-specific-params.md) field to pass non-OpenAI parameters.

### API Request/Response Examples

#### Example Request - Moonshot.ai Chat

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-latest",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ]
  }'
```

#### Example Response - Moonshot.ai Chat

```json
{
  "id": "cmpl-moonshot-1234567890",
  "created": 1762123456,
  "model": "kimi-latest",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Quantum computing is a revolutionary approach to computation that leverages the principles of quantum mechanics...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 245,
    "prompt_tokens": 18,
    "total_tokens": 263,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": 0,
      "text_tokens": 18,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0013474000",
    "irt": 154.36,
    "exchange_rate": 114600
  }
}
```

#### Example Request - Moonshot.ai Reasoning

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-thinking-preview",
    "messages": [
      {
        "role": "user",
        "content": "Design a scalable microservices architecture for an e-commerce platform"
      }
    ],
    "max_tokens": 4096
  }'
```

#### Example Request - Alibaba Text Embedding

```bash
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "text-embedding-v4",
    "input": "Machine learning is transforming technology",
    "dimensions": 1024
  }'
```

#### Example Response - Alibaba Text Embedding

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        -0.026611328125,
        -0.016571044921875,
        -0.02227783203125,
        0.0156707763671875,
        "...[1024 dimensions total]"
      ]
    }
  ],
  "model": "text-embedding-v4",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  },
  "estimated_cost": {
    "unit": "0.0000005600",
    "irt": 0.06,
    "exchange_rate": 114600
  }
}
```

#### Example Request - Alibaba Multimodal Embedding

```bash
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "tongyi-embedding-vision-plus",
    "input": {
      "contents": [
        {"text": "A beautiful sunset over mountains"},
        {"image": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"}
      ]
    }
  }'
```

### SDK Usage Examples

#### Moonshot.ai Chat Completions

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-latest",
    "messages": [
      {
        "role": "user",
        "content": "What are the key principles of sustainable architecture?"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="kimi-latest",
    messages=[
        {
            "role": "user",
            "content": "What are the key principles of sustainable architecture?",
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
  model: "kimi-latest",
  messages: [
    {
      role: "user",
      content: "What are the key principles of sustainable architecture?",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

#### Moonshot.ai Vision Model

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "moonshot-v1-8k-vision-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
            }
          }
        ]
      }
    ]
  }'

python=:completion = client.chat.completions.create(
    model="moonshot-v1-8k-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
                    },
                },
            ],
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:const completion = await client.chat.completions.create({
  model: "moonshot-v1-8k-vision-preview",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this image?" },
        {
          type: "image_url",
          image_url: { url: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png" },
        },
      ],
    },
  ],
});

console.log(completion.choices[0].message.content);

```

#### Alibaba Text Embeddings

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "text-embedding-v4",
    "input": "Natural language processing enables computers to understand text",
    "dimensions": 1024
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    model="text-embedding-v4",
    input="Natural language processing enables computers to understand text",
    dimensions=1024,
)

print(response.data[0].embedding)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.embeddings.create({
  model: "text-embedding-v4",
  input: "Natural language processing enables computers to understand text",
  dimensions: 1024,
});

console.log(response.data[0].embedding);

```

#### Alibaba Multimodal Embeddings with Native Parameters

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "tongyi-embedding-vision-plus",
    "input": {
      "contents": [
        {"text": "Product image for search"},
        {"image": "https://example.com/product.jpg"}
      ]
    }
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using extra_body for native Alibaba parameters
response = client.embeddings.create(
    model="tongyi-embedding-vision-plus",
    input="placeholder",  # Required by OpenAI SDK
    extra_body={
        "input": {
            "contents": [
                {"text": "Product image for search"},
                {"image": "https://example.com/product.jpg"},
            ]
        }
    },
)

print(response.data[0].embedding)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Using non-standard parameters
const response = await client.embeddings.create({
  model: "tongyi-embedding-vision-plus",
  input: "placeholder", // Required by OpenAI SDK
  // Native Alibaba format in request body
  input: {
    contents: [
      { text: "Product image for search" },
      { image: "https://example.com/product.jpg" }
    ]
  }
});

console.log(response.data[0].embedding);

```

### Reasoning Model Usage

The [`kimi-thinking-preview`](en/providers/moonshotai.md#kimi-thinking-preview) model provides Chain-of-Thought reasoning for complex problem-solving:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-thinking-preview",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the trade-offs between monolithic and microservices architectures"
      }
    ],
    "max_tokens": 4096
  }'

python=:response = client.chat.completions.create(
    model="kimi-thinking-preview",
    messages=[
        {
            "role": "user",
            "content": "Analyze the trade-offs between monolithic and microservices architectures",
        }
    ],
    max_tokens=4096,
)

# The model will show its reasoning process
print(response.choices[0].message.content)

javascript=:const response = await client.chat.completions.create({
    model: "kimi-thinking-preview",
    messages: [
        {
            role: "user",
            content: "Analyze the trade-offs between monolithic and microservices architectures",
        },
    ],
    max_tokens: 4096,
});

// The model will show its reasoning process
console.log(response.choices[0].message.content);

```

### Advanced Text Embedding Features

The [`text-embedding-v4`](en/providers/alibaba.md#text-embedding-v4) model supports advanced features through the native API:

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "text-embedding-v4",
    "input": "Research papers on machine learning",
    "dimensions": 1024,
    "text_type": "query",
    "instruct": "Given a research paper query, retrieve relevant research papers"
  }'

python=:response = client.embeddings.create(
    model="text-embedding-v4",
    input="Research papers on machine learning",
    dimensions=1024,
    extra_body={
        "text_type": "query",
        "instruct": "Given a research paper query, retrieve relevant research papers",
    },
)

print(response.data[0].embedding)

javascript=:const response = await client.embeddings.create({
  model: "text-embedding-v4",
  input: "Research papers on machine learning",
  dimensions: 1024,
  extra_body: {
    text_type: "query",
    instruct: "Given a research paper query, retrieve relevant research papers"
  }
});

console.log(response.data[0].embedding);

```

---

## Related Links

- [Moonshot.ai Models Documentation](en/providers/moonshotai.md)
- [Alibaba (Dashscope) Models Documentation](en/providers/alibaba.md)
- [Text Generation Guide](en/guides/text-generation.md)
- [Embeddings and Retrieval Guide](en/guides/retrieval.md)
- [Provider-Specific Parameters](en/guides/provider-specific-params.md)
- [Pricing Information](en/pricing.md)
- [Vision Capabilities Guide](en/guides/vision.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Model Selection Guide](en/guides/model-selection.md)