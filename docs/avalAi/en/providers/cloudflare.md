# Cloudflare AI Models

Cloudflare Workers AI provides access to a comprehensive collection of AI models running on Cloudflare's global edge network. Through AvalAI, you can access 33 powerful Cloudflare AI models with low latency and high performance, leveraging Cloudflare's distributed infrastructure for optimal AI inference.

## Available Models

Cloudflare AI models span multiple categories and providers, offering everything from compact efficient models to large-scale reasoning systems. All models are optimized for edge deployment and provide consistent performance across Cloudflare's global network.

### Meta Llama Models

Cloudflare hosts a comprehensive collection of Meta's Llama models, from the latest Llama 4 Scout to various versions of Llama 3.x series.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.llama-4-scout-17b-16e-instruct`| 17B (16 experts) | Multimodal, Text & Image | 128K |
| `cf.llama-3.3-70b-instruct-fp8-fast`| 70B (FP8) | Fast inference, General purpose | 128K |
| `cf.llama-3.1-8b-instruct-fast`| 8B | Fast multilingual dialogue | 128K |
| `cf.llama-3.1-8b-instruct-awq`| 8B (int4) | Efficient inference | 128K |
| `cf.llama-3.1-8b-instruct-fp8`| 8B (FP8) | Balanced performance | 128K |
| `cf.llama-3.1-8b-instruct`| 8B | Standard dialogue | 128K |
| `cf.llama-3.1-70b-instruct`| 70B | Complex reasoning | 128K |
| `cf.llama-3.2-1b-instruct`| 1B | Compact dialogue | 128K |
| `cf.llama-3.2-3b-instruct`| 3B | Agentic tasks | 128K |
| `cf.meta-llama-3-8b-instruct`| 8B | Improved reasoning | 8K |
| `cf.llama-3-8b-instruct-awq`| 8B (int4) | Efficient deployment | 8K |
| `cf.llama-3-8b-instruct`| 8B | Standard instruction | 8K |
| `cf.llama-guard-3-8b`| 8B | Content safety | 8K |

#### Llama 4 Scout - Multimodal Excellence

The newest addition to the Llama family, featuring native multimodal capabilities:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Text and image understanding
completion = client.chat.completions.create(
    model="cf.llama-4-scout-17b-16e-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "data:image/jpeg;base64,..."},
                },
            ],
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.llama-4-scout-17b-16e-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
            ],
        }
    ],
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Google Gemma Models

Google's Gemma models offer excellent performance with multilingual capabilities and LoRA support.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.gemma-3-12b-it`| 12B | Multimodal, 140+ languages | 128K |
| `cf.gemma-7b-it-lora`| 7B | LoRA fine-tuning | 8K |
| `cf.gemma-2b-it-lora`| 2B | Compact LoRA | 8K |
| `cf.gemma-7b-it`| 7B | General instruction | 8K |

#### Gemma 3 - Advanced Multimodal

```python
# Gemma 3 with extended context
completion = client.chat.completions.create(
    model="cf.gemma-3-12b-it",
    messages=[
        {
            "role": "user",
            "content": "Analyze this document and provide a comprehensive summary.",
        }
    ],
    max_tokens=2048,
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.gemma-3-12b-it` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Analyze this document and provide a comprehensive summary.",
                },
                {"type": "input_file", "file_id": "file_abc123"},
            ],
        }
    ],
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Mistral AI Models

Mistral's latest models with enhanced vision understanding and extended context capabilities.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.mistral-small-3.1-24b-instruct`| 24B | Vision + Text, Function calling | 128K |

#### Mistral Small 3.1 - Vision Enhanced

```python
# Function calling with vision
completion = client.chat.completions.create(
    model="cf.mistral-small-3.1-24b-instruct",
    messages=[
        {"role": "user", "content": "Analyze this chart and extract the key metrics"}
    ],
    tools=[
        {
            "type": "function",
            "function": {
                "name": "extract_metrics",
                "description": "Extract numerical metrics from data",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "metrics": {"type": "array", "items": {"type": "number"}}
                    },
                },
            },
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.mistral-small-3.1-24b-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="Analyze this chart and extract the key metrics",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Qwen Models

Alibaba's Qwen models specialized for reasoning, code generation, and embeddings.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.qwq-32b`| 32B | Advanced reasoning | 32K |
| `cf.qwen2.5-coder-32b-instruct`| 32B | Code generation | 128K |
| `cf.qwen3-30b-a3b-fp8`| 30B (FP8) | Chat, balanced performance | 128K |
| `cf.qwen3-embedding-0.6b`| 0.6B | Text embeddings | N/A |

#### QwQ - Reasoning Model

```python
# Advanced reasoning tasks
completion = client.chat.completions.create(
    model="cf.qwq-32b",
    messages=[
        {
            "role": "user",
            "content": "Solve this complex math problem step by step: If a train travels 120 km in 2 hours, and then increases its speed by 20%, how long will it take to travel the next 180 km?",
        }
    ],
    temperature=0.1,  # Lower temperature for reasoning tasks
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.qwq-32b` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Solve this complex math problem step by step: If a train travels 120 km in 2 hours, and then increases its speed by 20%, how long will it take to travel the next 180 km?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


#### Qwen2.5-Coder - Programming Specialist

```python
# Code generation and explanation
completion = client.chat.completions.create(
    model="cf.qwen2.5-coder-32b-instruct",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to implement a binary search tree with insert, search, and delete operations.",
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.qwen2.5-coder-32b-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a Python function to implement a binary search tree with insert, search, and delete operations.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### DeepSeek Models

DeepSeek's distilled reasoning models offering competitive performance.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.deepseek-r1-distill-qwen-32b`| 32B | Reasoning, outperforms o1-mini | 128K |

### OpenAI Open Source Models

OpenAI's open-weight models available on Cloudflare's edge network.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.gpt-oss-120b`| 120B | Large-scale reasoning | 128K |
| `cf.gpt-oss-20b`| 20B | Efficient general purpose | 128K |

### NVIDIA Nemotron Models

NVIDIA's latest Nemotron models with hybrid LatentMoE architecture.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.nemotron-3-120b-a12b`| 120B (12B active) | Agentic workflows, long-context reasoning | 1M |

#### Nemotron-3-120B-A12B - Agentic Excellence

NVIDIA's Nemotron-3-Super-120B-A12B is a large language model designed to deliver strong agentic, reasoning, and conversational capabilities. It employs a hybrid LatentMoE architecture utilizing interleaved Mamba-2 and MoE layers with Multi-Token Prediction (MTP) for faster text generation.

| Feature | Details |
|---------|---------|
| Total Parameters | 120B (12B active) |
| Architecture | LatentMoE - Mamba-2 + MoE + Attention hybrid |
| Context window | 1,000,000 tokens |
| Input pricing | $0.50 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (90% cost reduction) |
| Output pricing | $1.50 / 1M tokens |
| Supported languages | English, French, German, Italian, Japanese, Spanish, Chinese |
| Best for | Agentic workflows, long-context reasoning, high-volume workloads, IT ticket automation |

**Key Features:**
- **1M Context Window**: Industry-leading context length for extensive documents
- **Configurable Reasoning**: Enable or disable reasoning mode via chat template
- **Multi-Token Prediction**: MTP layers for faster text generation
- **Tool Use & RAG**: Excellent for tool calling and retrieval-augmented generation
- **Cost-Effective**: Only 12B active parameters for exceptional efficiency

**Benchmark Highlights:**
- SWE-Bench (OpenHands): 60.47%
- AIME 2025: 90.21%
- HMMT Feb 2025 (with tools): 94.73%
- LiveCodeBench: 81.19%

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Long-context reasoning with Nemotron
completion = client.chat.completions.create(
    model="cf.nemotron-3-120b-a12b",
    messages=[
        {
            "role": "user",
            "content": "Analyze this extensive codebase and suggest architectural improvements for better scalability.",
        }
    ],
    temperature=1.0,  # Recommended setting for Nemotron
    top_p=0.95,
)

print(completion.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.nemotron-3-120b-a12b` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Analyze this extensive codebase and suggest architectural improvements for better scalability.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### IBM Granite Models

IBM's Granite models for enterprise applications.

| Model | Parameters | Specialization | Context Window |
|-------|------------|----------------|----------------|
| `cf.granite-4.0-h-micro`| Micro | Efficient enterprise chat | 128K |

### Image Generation Models

Cloudflare AI offers powerful image generation models via the `v1/images/generations` endpoint.

| Model | Description | Base Price (1MP) |
|-------|-------------|------------------|
| `cf.flux-2-klein-9b` | FLUX 2 Klein 9B parameter model | $0.015/image |
| `cf.flux-2-klein-4b` | FLUX 2 Klein 4B compact model | $0.010/image |
| `cf.flux-2-dev` | FLUX 2 Development model | $0.010/image |
| `cf.lucid-origin` | Lucid Origin image generation | $0.015/image |
| `cf.phoenix-1.0` | Phoenix 1.0 image generation | $0.015/image |

#### Image Generation Example

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate an image with FLUX 2 Klein
response = client.images.generate(
    model="cf.flux-2-klein-9b",
    prompt="A futuristic cityscape at sunset with flying cars",
    n=1,
    size="1024x1024",
)

print(response.data[0].url)
```

### Embedding Models

Cloudflare AI provides embedding models for semantic search and text analysis via the `v1/embeddings` endpoint.

| Model | Owner | Description | Input Price ($/1M tokens) |
|-------|-------|-------------|--------------------------|
| `cf.qwen3-embedding-0.6b` | Alibaba | Qwen3 Embedding 0.6B | $0.012 |
| `cf.plamo-embedding-1b` | PFN | PLaMo Embedding 1B | $0.019 |
| `cf.embeddinggemma-300m` | Google | EmbeddingGemma 300M | $0.012 |

#### Embedding Example

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate embeddings
response = client.embeddings.create(
    model="cf.qwen3-embedding-0.6b",
    input="Machine learning enables computers to learn from data.",
)

embedding = response.data[0].embedding
print(f"Embedding dimension: {len(embedding)}")
```

## Key Parameters

Cloudflare models support standard OpenAI-compatible parameters:

| Parameter | Description | Default | Range |
|-----------|-------------|---------|--------|
| `temperature`| Controls randomness | 0.7 | 0.0-2.0 |
| `max_tokens`| Maximum response length | 2048 | 1-4096 |
| `top_p`| Nucleus sampling | 1.0 | 0.0-1.0 |
| `frequency_penalty`| Reduces repetition | 0.0 | -2.0-2.0 |
| `presence_penalty`| Encourages new topics | 0.0 | -2.0-2.0 |

## API Endpoints

Cloudflare models are available through multiple AvalAI endpoints depending on model type:

- **Chat Completions**: [`v1/chat/completions`](en/api-reference/chat.md) (full support)
- **Responses**: [`v1/responses`](en/api-reference/responses.md) (partial support)
- **Embeddings**: [`v1/embeddings`](en/api-reference/embeddings.md) (embedding models)
- **Image Generation**: [`v1/images/generations`](en/api-reference/images.md) (image models)
- **Messages**: [`v1/messages`](en/api-reference/messages.md) (partial support)

## Example Usage

### Basic Text Generation

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="cf.llama-3.1-8b-instruct",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."},
    ],
    temperature=0.7,
    max_tokens=1024,
)

print(completion.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.llama-3.1-8b-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Explain quantum computing in simple terms.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Streaming Responses

```python
# Streaming for real-time responses
stream = client.chat.completions.create(
    model="cf.llama-3.3-70b-instruct-fp8-fast",
    messages=[
        {"role": "user", "content": "Write a short story about AI and humanity."}
    ],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.llama-3.3-70b-instruct-fp8-fast` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a short story about AI and humanity.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Function Calling

```python
# Function calling with supported models
completion = client.chat.completions.create(
    model="cf.mistral-small-3.1-24b-instruct",
    messages=[{"role": "user", "content": "What's the weather like in Paris?"}],
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather for a city",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "City name"}
                    },
                    "required": ["city"],
                },
            },
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.mistral-small-3.1-24b-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="What",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Best Practices

### Model Selection

- **For speed**: Use FP8 or AWQ quantized models like `cf.llama-3.3-70b-instruct-fp8-fast`
- **For reasoning**: Choose `cf.qwq-32b`or `cf.deepseek-r1-distill-qwen-32b`
- **For code**: Use `cf.qwen2.5-coder-32b-instruct`
- **For multimodal**: Select `cf.llama-4-scout-17b-16e-instruct` or `cf.gemma-3-12b-it`
- **For efficiency**: Try compact models like `cf.llama-3.2-1b-instruct`

### Performance Optimization

1. **Use appropriate quantization**: FP8 models offer good balance of speed and quality
2. **Leverage edge deployment**: Models run on Cloudflare's global network for low latency
3. **Context management**: Utilize extended context windows (up to 128K) efficiently
4. **Streaming**: Enable streaming for better user experience in interactive applications

### Content Safety

Implement `cf.llama-guard-3-8b`for content moderation:

```python
# Content safety check
safety_check = client.chat.completions.create(
    model="cf.llama-guard-3-8b",
    messages=[{"role": "user", "content": "User message to check for safety"}],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cf.llama-guard-3-8b` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="User message to check for safety",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Using Cloudflare Models via AvalAI

Cloudflare AI models are seamlessly integrated into AvalAI's unified API. All models use the standard OpenAI-compatible interface, making it easy to switch between different Cloudflare models or combine them with other providers.

### Authentication

```python
client = OpenAI(
    api_key="your-avalai-api-key",  # Your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # AvalAI endpoint
)
```

### Rate Limits

Cloudflare models follow AvalAI's standard rate limiting policies. Check your tier limits in the [Rate Limits Guide](en/guides/rate-limits.md).

## Related Resources

- [Chat Completions API Reference](en/api-reference/chat.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Vision Capabilities Guide](en/guides/vision.md)
- [Streaming Responses Guide](en/guides/streaming-responses.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
- [Best Practices Guide](en/guides/best-practices.md)