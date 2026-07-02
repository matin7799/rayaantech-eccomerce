# New Alibaba Qwen Models, DeepSeek-V3.1-Terminus Update, X.AI Grok-4-Fast Models, and Enhanced Image Generation

**Date:** 2025-09-23 / (1404-07-01)

## Summary

AvalAI announces the addition of 8 new Alibaba text chat models with comprehensive endpoint support, introduces 2 advanced Qwen image generation models with dual SDK compatibility, adds X.AI's new Grok-4-Fast reasoning models with 2M context window, and delivers automatic backend upgrades to DeepSeek-V3.1-Terminus for improved language consistency and agent performance.

---

## Details

We announce significant expansions to our AI model offerings with new Alibaba text models, advanced image generation capabilities, X.AI's latest cost-efficient reasoning models, and enhanced DeepSeek performance through automatic backend improvements.

### DeepSeek-V3.1-Terminus Automatic Upgrade

DeepSeek has automatically upgraded their backend infrastructure to DeepSeek-V3.1-Terminus. Users of [`deepseek-chat`](en/models/deepseek-chat.md) and [`deepseek-reasoner`](en/models/deepseek-reasoner.md) will automatically benefit from these improvements without changing model names.

#### DeepSeek

- **deepseek-chat**: Now powered by DeepSeek-V3.1-Terminus backend with enhanced language consistency and agent capabilities
- **deepseek-reasoner**: Now powered by DeepSeek-V3.1-Terminus backend with improved reasoning stability

**Key Improvements:**
- **Language Consistency**: Reduced Chinese/English mix-ups and eliminated random character issues
- **Agent Performance**: Stronger Code Agent and Search Agent capabilities
- **Output Stability**: More reliable and consistent outputs across benchmarks
- **Context Length**: 128K tokens
- **Pricing**: Input (cache hit) $0.07/1M tokens, Input (cache miss) $0.56/1M tokens, Output $1.68/1M tokens

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "user",
        "content": "Create a Python function to analyze code complexity"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {
            "role": "user",
            "content": "Create a Python function to analyze code complexity",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
        {
            role: "user",
            content: "Explain the reasoning behind choosing a specific algorithm",
        },
    ],
});

console.log(response.choices[0].message.content);

```

### New Alibaba Text Chat Models

We've added 8 new Alibaba (Dashscope) models with support across multiple endpoints including [`v1/completions`](en/api-reference/completions.md), [`v1/chat/completions`](en/api-reference/chat.md), and partial support on [`v1/messages`](en/api-reference/messages.md).

#### Alibaba

- **qwen-flash**: High-performance model optimized for speed and efficiency with tiered pricing
- **qwen-flash-2025-07-28**: Dated version of qwen-flash with identical capabilities and pricing
- **qwen-plus-2025-09-11**: Enhanced model with improved reasoning capabilities
- **qwen3-next-80b-a3b-thinking**: Advanced reasoning model with exposed thinking process
- **qwen3-next-80b-a3b-instruct**: Instruction-following model optimized for direct responses
- **qwen3-coder-flash**: Specialized coding model with context-aware pricing tiers
- **qwen3-coder-flash-2025-07-28**: Dated version of qwen3-coder-flash
- **qwen-plus-2025-07-28**: Earlier version of qwen-plus with established performance

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| qwen-flash | $0.05/1M | $0.025/1M | $0.40/1M | Above 256K: Input $0.25/1M, Output $2.00/1M |
| qwen-plus-2025-09-11 | $0.40/1M | $0.20/1M | $4.00/1M | - |
| qwen3-next-80b-a3b-thinking | $0.144/1M | $0.072/1M | $1.434/1M | - |
| qwen3-next-80b-a3b-instruct | $0.144/1M | $0.072/1M | $0.574/1M | - |
| qwen3-coder-flash | $0.30/1M | $0.10/1M | $1.50/1M | Tiered pricing above 32K, 128K, 256K |

```language-selector
bash=:# Using qwen-flash for general tasks
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen-flash",
    "messages": [
      {
        "role": "user",
        "content": "Summarize the key benefits of cloud computing"
      }
    ]
  }'

# Using qwen3-coder-flash for coding tasks
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-coder-flash",
    "messages": [
      {
        "role": "user",
        "content": "Write a TypeScript interface for a user management system"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using qwen-flash for general tasks
response = client.chat.completions.create(
    model="qwen-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key benefits of cloud computing",
        }
    ],
)

print(response.choices[0].message.content)

# Using qwen3-coder-flash for coding tasks
coding_response = client.chat.completions.create(
    model="qwen3-coder-flash",
    messages=[
        {
            "role": "user",
            "content": "Write a TypeScript interface for a user management system",
        }
    ],
)

print(coding_response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Using qwen3-next-80b-a3b-thinking for reasoning tasks
const response = await client.chat.completions.create({
    model: "qwen3-next-80b-a3b-thinking",
    messages: [
        {
            role: "user",
            content: "Analyze the pros and cons of microservices architecture",
        },
    ],
});

console.log(response.choices[0].message.content);

```

### New Qwen Image Generation Models

We've introduced two advanced image models with dual SDK support, compatible with both OpenAI schema and native Alibaba Dashscope schema on [`v1/images/generations`](en/api-reference/images.md) and [`v1/images/edits`](en/api-reference/images.md).

#### Alibaba Image Models

- **qwen-image**: Advanced text-to-image generation with intelligent prompt rewriting and customizable parameters
- **qwen-image-edit**: Sophisticated image editing capabilities with multi-image input support

**Pricing:**
- **qwen-image**: $0.035 per generated image
- **qwen-image-edit**: $0.045 per edited image

**Key Features:**
- **Resolution Options**: Multiple aspect ratios (1:1, 4:3, 3:4, 16:9, 9:16)
- **Prompt Enhancement**: Intelligent prompt rewriting for improved results
- **Dual SDK Support**: Compatible with OpenAI SDK and native Dashscope API
- **Advanced Parameters**: Negative prompts, watermark control, seed support

```language-selector
bash=:# Text-to-image generation using OpenAI format
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen-image",
    "prompt": "A serene mountain landscape with a crystal clear lake reflecting snow-capped peaks",
    "size": "1328x1328",
    "n": 1
  }'

# Image editing using OpenAI format
curl https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=qwen-image-edit" \
  -F "prompt=Change the sky to a dramatic sunset with orange and purple colors" \
  -F "image=@input_image.jpg"

# Using native Dashscope format
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen-image",
    "input": {
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "text": "A professional headshot of a confident business person in modern office setting"
            }
          ]
        }
      ]
    },
    "parameters": {
      "size": "1328*1328",
      "prompt_extend": true,
      "watermark": false
    }
  }'

python=:# Using OpenAI SDK format
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Text-to-image generation
response = client.images.generate(
    model="qwen-image",
    prompt="A serene mountain landscape with a crystal clear lake reflecting snow-capped peaks",
    size="1328x1328",
    n=1,
    response_format="url",  # or b64_json
)

print(response.data[0].url)

# Image editing
import requests

with open("input_image.jpg", "rb") as image_file:
    response = requests.post(
        "https://api.avalai.ir/v1/images/edits",
        headers={"Authorization": f"Bearer {api_key}"},
        files={"image": image_file},
        data={
            "model": "qwen-image-edit",
            "prompt": "Change the sky to a dramatic sunset with orange and purple colors",
        },
    )

print(response.json())

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Text-to-image generation
const response = await client.images.generate({
    model: "qwen-image",
    prompt: "A futuristic cityscape with flying cars and neon lights",
    size: "1664x928", // 16:9 aspect ratio
    n: 1,
    response_format: "url", // or b64_json
});

console.log(response.data[0].url);

// Using native Dashscope format
const dashscopeResponse = await fetch("https://api.avalai.ir/v1/images/generations", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "qwen-image",
        input: {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            text: "A professional headshot of a confident business person in modern office setting"
                        }
                    ]
                }
            ]
        },
        parameters: {
            size: "1328*1328",
            prompt_extend: true,
            watermark: false
        }
    })
});

const result = await dashscopeResponse.json();
console.log(result);

```

### New X.AI Grok-4-Fast Models

We've added X.AI's latest cost-efficient reasoning models with massive 2M context windows, designed for advanced reasoning tasks and long-form content processing.

#### X.AI

- **grok-4-fast-reasoning**: Advanced reasoning model with exposed thinking process and 2M context window
- **grok-4-fast-non-reasoning**: Fast inference model optimized for speed without exposed reasoning steps

**Key Features:**
- **Context Window**: 2,000,000 tokens for both models
- **Function Calling**: Connect models to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats
- **Live Search**: Real-time web search capabilities ($25.00 per 1K sources)
- **Cached Input Support**: Significant cost reduction with cached tokens

**Pricing:**
- **Input**: $0.20 per 1M tokens
- **Cached Input**: $0.05 per 1M tokens (75% savings)
- **Output**: $0.50 per 1M tokens
- **Live Search**: $25.00 per 1K sources

```language-selector
bash=:# Using grok-4-fast-reasoning for complex analysis
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4-fast-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the economic implications of quantum computing adoption across different industries"
      }
    ],
    "max_tokens": 2000
  }'

# Using grok-4-fast-non-reasoning for fast responses
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4-fast-non-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Summarize the key benefits of microservices architecture"
      }
    ],
    "max_tokens": 1000
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using grok-4-fast-reasoning for complex reasoning tasks
response = client.chat.completions.create(
    model="grok-4-fast-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Analyze the economic implications of quantum computing adoption across different industries",
        }
    ],
    max_tokens=2000,
)

print(response.choices[0].message.content)

# Using grok-4-fast-non-reasoning for fast inference
fast_response = client.chat.completions.create(
    model="grok-4-fast-non-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key benefits of microservices architecture",
        }
    ],
    max_tokens=1000,
)

print(fast_response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Using grok-4-fast-reasoning for detailed analysis
const response = await client.chat.completions.create({
    model: "grok-4-fast-reasoning",
    messages: [
        {
            role: "user",
            content: "Analyze the economic implications of quantum computing adoption across different industries",
        },
    ],
    max_tokens: 2000,
});

console.log(response.choices[0].message.content);

// Using grok-4-fast-non-reasoning for quick responses
const fastResponse = await client.chat.completions.create({
    model: "grok-4-fast-non-reasoning",
    messages: [
        {
            role: "user",
            content: "Summarize the key benefits of microservices architecture",
        },
    ],
    max_tokens: 1000,
});

console.log(fastResponse.choices[0].message.content);

```

### API Endpoint Support

**Text Chat Models Available On:**
- [`v1/completions`](en/api-reference/completions.md) - Text completion endpoint
- [`v1/chat/completions`](en/api-reference/chat.md) - Chat completions endpoint
- [`v1/messages`](en/api-reference/messages.md) - Anthropic-compatible messages endpoint (partial support)

**Image Models Available On:**
- [`v1/images/generations`](en/api-reference/images.md) - Image generation endpoint
- [`v1/images/edits`](en/api-reference/images.md) - Image editing endpoint

**X.AI Models Available On:**
- [`v1/chat/completions`](en/api-reference/chat.md) - Chat completions endpoint
- [`v1/responses`](en/api-reference/responses.md) - Response generation endpoint
- [`v1/messages`](en/api-reference/messages.md) - Anthropic-compatible messages endpoint

Both OpenAI SDK format and native Alibaba Dashscope format are supported for Qwen models. X.AI models support standard OpenAI format with advanced features like function calling and structured outputs.

---

## Related Links

- [Alibaba Models Documentation](en/providers/alibaba.md)
- [X.AI Models Documentation](en/providers/xai.md)
- [DeepSeek Models Documentation](en/providers/deepseek.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Images API Reference](en/api-reference/images.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Alibaba Dashscope Official Documentation](https://modelstudio.console.alibabacloud.com/?tab=doc#/doc/?type=model&url=2840914)