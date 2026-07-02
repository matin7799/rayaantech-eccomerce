# Full Alibaba Models Support via DashScope Now Available

**Date:** 2025-07-31

## Summary

AvalAI now provides full native support for Alibaba's comprehensive Qwen model family through their official Alibaba Cloud - DashScope infrastructure. This major update includes over 40 cutting-edge models spanning text generation, vision-language processing, reasoning, machine translation, and coding capabilities, all accessible via our unified API endpoints.

---

## Details

We're excited to announce that AvalAI now offers complete native access to Alibaba's entire Qwen model ecosystem through their official [DashScope](https://dashscope.console.aliyun.com/) cloud platform. This integration provides developers with direct access to Alibaba's most advanced AI models while maintaining the simplicity of our unified API.

### Complete Model Family Coverage

This release includes comprehensive support for all major Qwen model families:

#### Qwen Turbo Series
High-performance models optimized for speed and efficiency:
- **qwen-turbo**: Latest turbo model with 131K context window
- **qwen-turbo-latest**: Always-updated version of the turbo model
- **qwen-turbo-2025-04-28**: Specific dated version for consistency

#### Qwen Plus Series
Balanced models offering excellent performance across diverse tasks:
- **qwen-plus**: Advanced general-purpose model with 131K context
- **qwen-plus-latest**: Most recent plus model version
- **qwen-plus-2025-07-14**: Latest stable release
- **qwen-plus-2025-04-28**: Previous stable version

#### Qwen Max Series
Premium models for the most demanding applications:
- **qwen-max**: Top-tier model with advanced reasoning capabilities
- **qwen-max-latest**: Current flagship model
- **qwen-max-2025-01-25**: Stable production version

#### Vision-Language Models
Multimodal models for text and image understanding:
- **Qwen 2.5 VL Series**: qwen2.5-vl-72b-instruct, qwen2.5-vl-32b-instruct, qwen2.5-vl-7b-instruct, qwen2.5-vl-3b-instruct
- **Qwen VL Series**: qwen-vl-max, qwen-vl-plus, qwen-vl-ocr for specialized vision tasks

#### QVQ Max Series
Advanced reasoning models with visual question-answering capabilities:
- **qvq-max**: Cutting-edge reasoning model
- **qvq-max-latest**: Most recent reasoning model
- **qvq-max-2025-03-25**: Stable reasoning version

#### Qwen 3 Series
Next-generation models with enhanced capabilities:
- **Standard Models**: qwen3-32b, qwen3-14b, qwen3-8b, qwen3-4b, qwen3-1.7b, qwen3-0.6b
- **A3B Models**: qwen3-30b-a3b with thinking and instruct variants
- **A22B Models**: qwen3-235b-a22b with specialized reasoning capabilities

#### Specialized Models
Purpose-built models for specific use cases:
- **QWQ Plus**: Advanced reasoning models (qwq-plus, qwq-plus-2025-03-05)
- **MT Series**: Machine translation models (qwen-mt-plus, qwen-mt-turbo)
- **Coder Series**: Programming-focused models (qwen3-coder-480b-a35b-instruct, qwen3-coder-plus)
- **Long Context**: Extended context models like qwen2.5-7b-instruct-1m and qwen2.5-14b-instruct-1m

### API Integration

All Alibaba models are now accessible through our standard endpoints:

**Primary Support**: `v1/chat/completions` endpoint with full feature support
**Limited Support**: `v1/messages` endpoint for basic interactions

### Usage Examples

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",
)

# Using Qwen Plus for general tasks
response = client.chat.completions.create(
    model="qwen-plus",
    messages=[
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    max_tokens=500,
)

print(response.choices[0].message.content)

# Using Qwen VL for vision tasks
response = client.chat.completions.create(
    model="qwen2.5-vl-72b-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe what you see in this image."},
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

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Using Qwen Max for complex reasoning
const response = await client.chat.completions.create({
    model: "qwen-max",
    messages: [
        {
            role: "user",
            content: "Solve this logic puzzle: If all roses are flowers, and some flowers are red, can we conclude that some roses are red?"
        }
    ],
    max_tokens: 300
});

console.log(response.choices[0].message.content);

// Using Qwen Coder for programming tasks
const codeResponse = await client.chat.completions.create({
    model: "qwen3-coder-plus",
    messages: [
        {
            role: "user",
            content: "Write a Python function to calculate fibonacci numbers using dynamic programming."
        }
    ]
});

```

### Key Features

- **Native Integration**: Direct access to Alibaba's official DashScope infrastructure
- **Comprehensive Coverage**: Over 40 models across all major use cases
- **Unified API**: Access all models through familiar OpenAI-compatible endpoints
- **Advanced Capabilities**: Support for multimodal inputs, long contexts, and specialized tasks
- **Production Ready**: Enterprise-grade reliability through official Alibaba Cloud infrastructure

### Model Specifications

All models include detailed specifications for context windows, token limits, and capabilities. For complete pricing information, please refer to our [Model Details](en/models/model-details.md) documentation.

---

## Related Links

- [Alibaba Models Documentation](en/providers/alibaba.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Model Details and Pricing](en/models/model-details.md)
- [DashScope Official Console](https://dashscope.console.aliyun.com/)