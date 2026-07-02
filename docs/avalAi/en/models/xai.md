# XAI Models (Grok)

AvalAI provides access to XAI's Grok family of models, known for their large context windows and real-time information access capabilities (when used directly via XAI).

## Grok 4.3

XAI's new flagship reasoning model with a 1,000,000-token context window, function calling, structured outputs, and context-aware pricing above 200K tokens.

### grok-4.3

Grok-4.3 is designed for advanced reasoning, long-context analysis, structured outputs, and tool-enabled chat workflows through the Chat Completions API.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4.3` |
| Upstream alias | `grok-4.3-latest` |
| Context window | 1,000,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning |
| Available on | `v1/chat/completions` |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (84% cost reduction) |
| Output pricing | $2.50 / 1M tokens |
| Input pricing (above 200K) | $2.50 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $5.00 / 1M tokens |
| Strengths | Advanced reasoning, long-context analysis, structured outputs, function calling |
| Best for | Complex problem-solving, agentic workflows, document analysis, tool-enabled chat |

**Key Features:**
- **Large Context Window**: 1M tokens for long documents, large conversations, and extensive context
- **Reasoning**: The model thinks before responding for complex problem-solving
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats
- **Context-Aware Pricing**: Different rates apply when requests exceed the 200K context window

```python
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {
            "role": "user",
            "content": "Analyze this architecture proposal and identify the highest-risk assumptions.",
        },
    ],
)
```

**Function Calling Example:**

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_inventory",
            "description": "Get current inventory information for a SKU",
            "parameters": {
                "type": "object",
                "properties": {
                    "sku": {
                        "type": "string",
                        "description": "Product SKU",
                    }
                },
                "required": ["sku"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "Check inventory for SKU AVAL-123."}],
    tools=tools,
    tool_choice="auto",
)
```

---

## Grok 4

The latest and most advanced model from XAI, offering unparalleled performance in natural language processing, mathematics, and reasoning capabilities.

### Grok 4

XAI's flagship model that serves as the perfect all-purpose AI solution with exceptional capabilities across diverse applications.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4`, `grok-4-latest`, `grok-4-0709` |
| Context window | 256,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs, Reasoning |
| Input pricing | $3.00 / 1M tokens |
| Cached input pricing | $0.75 / 1M tokens (75% cost reduction) |
| Output pricing | $15.00 / 1M tokens |
| Strengths | Advanced reasoning, mathematical computation, vision understanding, natural language tasks |
| Best for | Complex problem-solving, code generation, image analysis, research and analysis |

**Key Features:**
- **Vision Capabilities**: Analyze and understand images alongside text
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats
- **Reasoning**: The model thinks before responding for more accurate answers
- **Large Context Window**: Handle extensive conversations and documents

```python
response = client.chat.completions.create(
    model="grok-4",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing and provide a mathematical example.",
        },
    ],
)
```

**Function Calling Example:**

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "calculate_math",
            "description": "Perform mathematical calculations",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate",
                    }
                },
                "required": ["expression"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="grok-4",
    messages=[{"role": "user", "content": "What is 15 * 23 + 47?"}],
    tools=tools,
    tool_choice="auto",
)
```

**Vision Example:**

```python
import base64


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
image_path = "path/to/your/image.jpg"
base64_image = encode_image(image_path)

# Create a message with text and image
response = client.chat.completions.create(
    model="grok-4",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What's in this image? Provide a detailed analysis.",
                },
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

## Grok 4.20 (Stable)

The stable release of X.AI's flagship Grok 4.20 model, now generally available with both reasoning and non-reasoning variants. Combines industry-leading speed, agentic tool calling, the lowest hallucination rate on the market, and strict prompt adherence for consistently precise and truthful responses.

### grok-4.20-reasoning

The stable reasoning variant of Grok 4.20, designed for complex problem-solving tasks that require deep analytical thinking.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4.20-reasoning` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs, Reasoning |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Strengths | Industry-leading speed, lowest hallucination rate, strict prompt adherence, agentic tool calling |
| Best for | Complex reasoning, agentic workflows, precise responses, truthful outputs |

**Key Features:**
- **Reasoning Mode**: Extended thinking before responding for complex problem-solving
- **Massive Context Window**: 2M tokens for extensive documents and conversations
- **Lowest Hallucination Rate**: Industry-leading accuracy and truthfulness
- **Strict Prompt Adherence**: Consistently precise responses
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats
- **Higher Context Pricing**: Different rates for requests exceeding 200K context window

```python
response = client.chat.completions.create(
    model="grok-4.20-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a fault-tolerant distributed system architecture for a global payment platform.",
        },
    ],
    max_tokens=4096,
)
```

### grok-4.20-non-reasoning

The stable non-reasoning variant optimized for fast responses without extended thinking, perfect for high-throughput applications.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4.20-non-reasoning` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Strengths | Fast inference, massive context, high-throughput, precise responses |
| Best for | High-throughput applications, real-time systems, rapid tool execution |

**Key Features:**
- **Fast Inference**: Optimized for quick responses without reasoning overhead
- **Massive Context Window**: 2M token capacity for extensive context handling
- **Cost-Effective Caching**: 90% cost reduction with cached input tokens
- **Function Calling**: External tool integration capabilities
- **Structured Outputs**: Organized response formatting

```python
response = client.chat.completions.create(
    model="grok-4.20-non-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key points from this document.",
        },
    ],
)
```

---

## Grok 4.20 Beta

X.AI's beta flagship model with industry-leading speed and agentic tool calling capabilities. It combines the lowest hallucination rate on the market with strict prompt adherence, delivering consistently precise and truthful responses.

### grok-4.20-beta-0309-reasoning

The reasoning variant of Grok 4.20 Beta, designed for complex problem-solving tasks that require deep analytical thinking.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4.20-beta-0309-reasoning` |
| Aliases | `grok-4.20-beta`, `grok-4.20-beta-0309`, `grok-4.20-beta-latest`, `grok-4.20-beta-latest-reasoning`, `grok-4.20-beta-reasoning` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs, Reasoning |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Strengths | Industry-leading speed, lowest hallucination rate, strict prompt adherence, agentic tool calling |
| Best for | Complex reasoning, agentic workflows, precise responses, truthful outputs |

**Key Features:**
- **Reasoning Mode**: The model thinks before responding for complex problem-solving
- **Massive Context Window**: 2M tokens for extensive documents and conversations
- **Lowest Hallucination Rate**: Industry-leading accuracy and truthfulness
- **Strict Prompt Adherence**: Consistently precise responses
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats
- **Higher Context Pricing**: Different rates for requests exceeding 200K context window

```python
response = client.chat.completions.create(
    model="grok-4.20-beta-0309-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a comprehensive digital marketing strategy for a tech startup.",
        },
    ],
    max_tokens=4096,
)
```

### grok-4.20-beta-0309-non-reasoning

The non-reasoning variant optimized for fast responses without extended thinking, perfect for high-throughput applications.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4.20-beta-0309-non-reasoning` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Strengths | Fast inference, massive context, high-throughput, precise responses |
| Best for | High-throughput applications, real-time systems, rapid tool execution |

**Key Features:**
- **Fast Inference**: Optimized for quick responses without reasoning overhead
- **Massive Context Window**: 2M token capacity for extensive context handling
- **Cost-Effective Caching**: 90% cost reduction with cached input tokens
- **Function Calling**: External tool integration capabilities
- **Structured Outputs**: Organized response formatting

```python
response = client.chat.completions.create(
    model="grok-4.20-beta-0309-non-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key points from this document.",
        },
    ],
)
```

---

## Grok 4.1 Fast

The latest advancement from XAI, optimized specifically for high-performance agentic tool calling with extended reasoning capabilities and a massive 2M token context window.

### grok-4-1-fast-reasoning

Frontier multimodal model with extended reasoning capabilities for complex problem-solving and agentic workflows.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4-1-fast-reasoning` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs, Reasoning |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (75% cost reduction) |
| Output pricing | $0.50 / 1M tokens |
| Strengths | Extended reasoning, agentic tool calling, multimodal understanding |
| Best for | Complex agentic workflows, autonomous systems, tool-heavy applications |

**Key Features:**
- **Extended Reasoning**: The model engages in deep analytical thinking before responding
- **Agentic Tool Calling**: Optimized for autonomous agent workflows with sophisticated tool use
- **Massive Context**: 2M tokens allows processing of extensive documents and conversations
- **Multimodal**: Process text and images in a single request
- **Prompt Caching**: Significant cost savings with cached input tokens

```python
response = client.chat.completions.create(
    model="grok-4-1-fast-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a comprehensive digital marketing strategy for a tech startup.",
        },
    ],
)
```

### grok-4-1-fast-non-reasoning

Frontier multimodal model optimized for fast responses without extended reasoning, perfect for high-throughput applications.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4-1-fast-non-reasoning` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (75% cost reduction) |
| Output pricing | $0.50 / 1M tokens |
| Strengths | Fast responses, agentic tool calling, multimodal understanding |
| Best for | High-throughput applications, real-time systems, rapid tool execution |

**Key Features:**
- **Fast Inference**: Optimized for quick responses without extended reasoning overhead
- **Agentic Tool Calling**: Purpose-built for autonomous agent workflows
- **Massive Context**: 2M tokens for handling extensive information
- **Multimodal**: Support for text and image processing
- **Cost-Effective Caching**: Reduce costs with prompt caching

```python
response = client.chat.completions.create(
    model="grok-4-1-fast-non-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key points from this document.",
        },
    ],
)
```

**Function Calling Example:**

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather information for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit",
                    },
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="grok-4-1-fast-non-reasoning",
    messages=[{"role": "user", "content": "What's the weather like in New York?"}],
    tools=tools,
    tool_choice="auto",
)
```

## Grok 4 Fast

XAI's latest advancement in cost-efficient reasoning models, offering exceptional performance at affordable pricing with massive context windows.

### grok-4-fast-reasoning

The reasoning variant of Grok 4 Fast, designed for complex problem-solving tasks that require deep analytical thinking.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4-fast-reasoning`, `grok-4-fast`, `grok-4-fast-reasoning-latest` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (75% cost reduction) |
| Output pricing | $0.50 / 1M tokens |
| Live search pricing | $25.00 / 1K sources |
| Strengths | Cost-efficient reasoning, massive context, advanced problem-solving |
| Best for | Complex analysis, strategic planning, research tasks, large document processing |

**Key Features:**
- **Massive Context Window**: Handle up to 2M tokens for extensive conversations and documents
- **Cost-Efficient Reasoning**: Advanced reasoning capabilities at affordable pricing
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats
- **Cached Input Optimization**: Significant cost savings with cached tokens

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="grok-4-fast-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a comprehensive digital marketing strategy for a tech startup, including budget allocation and timeline",
        }
    ],
    max_tokens=2048,
)

print(response.choices[0].message.content)
```

### grok-4-fast-non-reasoning

The non-reasoning variant optimized for general chat and content generation tasks without the reasoning overhead.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-4-fast-non-reasoning`, `grok-4-fast-non-reasoning-latest` |
| Context window | 2,000,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (75% cost reduction) |
| Output pricing | $0.50 / 1M tokens |
| Live search pricing | $25.00 / 1K sources |
| Strengths | Fast responses, massive context, cost-effective for general tasks |
| Best for | General chat, content generation, quick responses, high-volume applications |

**Key Features:**
- **High-Speed Processing**: Optimized for fast responses without reasoning overhead
- **Massive Context Window**: 2M token capacity for extensive context handling
- **Cost-Effective**: Affordable pricing for high-volume applications
- **Function Calling**: External tool integration capabilities
- **Structured Outputs**: Organized response formatting

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="grok-4-fast-non-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Summarize the latest trends in artificial intelligence for 2025",
        }
    ],
)

print(response.choices[0].message.content)
```

**Function Calling Example:**

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather information",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name",
                    }
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="grok-4-fast-reasoning",
    messages=[{"role": "user", "content": "What's the weather like in New York?"}],
    tools=tools,
    tool_choice="auto",
)
```

## Grok Code Fast 1

A specialized model optimized for agentic coding workflows with exceptional speed and tool mastery.

### grok-code-fast-1

XAI's purpose-built model for developers, designed to excel in coding tasks with blazing-fast inference and superior tool integration.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `grok-code-fast-1` |
| Context window | Large context support for extensive codebases |
| Capabilities | Chat, Code Generation, Tool Use, Agentic Workflows |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.02 / 1M tokens (90% cost reduction) |
| Output pricing | $1.50 / 1M tokens |
| Strengths | Blazing fast responses (190+ TPS), agentic coding, tool mastery |
| Best for | IDE integration, code generation, debugging, pull request analysis |
| Supported Languages | TypeScript, Python, Java, Rust, C++, Go |
| Available on | `v1/chat/completions`, `v1/responses`, `v1/messages` |

**Key Features:**
- **Agentic Coding**: Purpose-built for coding workflows with loops of reasoning and tool calls
- **Tool Mastery**: Excels at using grep, terminal, file editing, and other development tools
- **High Performance**: 190+ tokens per second with 90%+ cache hit rates
- **Multi-Language**: Versatile across the full software development stack
- **Cost Effective**: Economical pricing for high-volume development tasks

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="grok-code-fast-1",
    messages=[
        {
            "role": "user",
            "content": "Create a Python function to implement binary search with proper error handling and type hints",
        }
    ],
)

print(response.choices[0].message.content)
```

**Coding Example:**

```python
response = client.chat.completions.create(
    model="grok-code-fast-1",
    messages=[
        {
            "role": "user",
            "content": "Review this TypeScript code and suggest improvements:\n\nfunction processData(data: any[]) {\n  return data.map(item => item.value * 2);\n}",
        }
    ],
)

print(response.choices[0].message.content)
```

## Grok 3 Series

The latest generation of Grok models, offering advanced reasoning, multimodal capabilities, and large context windows.

### Image Understanding Capabilities

Currently, only the `grok-2-vision-latest` model supports vision capabilities among XAI models. With this model, you can:

- Caption and describe image content
- Answer questions about visual elements in images
- Detect objects and provide bounding box coordinates
- Analyze visual content alongside text

**Important Notes:**

- When using XAI models with vision capabilities through AvalAI, while URL-based image inputs are technically supported, they may not work reliably. For best results, we recommend providing images as base64-encoded strings.
- While Grok 3 series models are listed with vision capabilities, this feature may not be fully enabled yet. We will update documentation when these models fully support vision features.

### Grok 3

The most capable model in the Grok 3 series, balancing performance and cost.

| Feature        | Details                                                          |
| -------------- | ---------------------------------------------------------------- |
| Model ID       | `grok-3-latest`                                                    |
| Context window | 131,072 tokens                                                   |
| Capabilities   | Chat, Vision, Function Calling, Tool Choice                      |
| Input pricing  | $0.30 / 1M tokens                                                |
| Output pricing | $15.00 / 1M tokens                                               |
| Strengths      | Strong reasoning, large context, multimodal understanding        |
| Best for       | Complex tasks requiring deep understanding and extensive context |

```python
response = client.chat.completions.create(
    model="grok-4-latest",
    messages=[
        {
            "role": "user",
            "content": "Explain the significance of the Grok models in the AI landscape.",
        },
    ],
)
```

### Grok 3 Fast

Optimized for speed while maintaining strong capabilities.

| Feature        | Details                                                       |
| -------------- | ------------------------------------------------------------- |
| Model ID       | `grok-3-fast`                                            |
| Context window | 131,072 tokens                                                |
| Capabilities   | Chat, Vision, Function Calling, Tool Choice                   |
| Input pricing  | $5.00 / 1M tokens                                             |
| Output pricing | $25.00 / 1M tokens                                            |
| Strengths      | Faster inference speed compared to standard Grok 3            |
| Best for       | Applications requiring quicker responses with high capability |

```python
response = client.chat.completions.create(
    model="grok-3-fast",
    messages=[
        {
            "role": "user",
            "content": "Summarize the latest news about space exploration.",
        },
    ],
)
```

### Grok 3 Mini

A smaller, highly cost-effective version in the Grok 3 series.

| Feature        | Details                                                                              |
| -------------- | ------------------------------------------------------------------------------------ |
| Model ID       | `grok-3-mini`                                                                   |
| Context window | 131,072 tokens                                                                       |
| Capabilities   | Chat, Vision, Function Calling, Tool Choice                                          |
| Input pricing  | $0.30 / 1M tokens                                                                    |
| Output pricing | $0.50 / 1M tokens                                                                    |
| Strengths      | Very cost-effective, large context window for its class                              |
| Best for       | Cost-sensitive applications, tasks benefiting from large context but less complexity |

```python
response = client.chat.completions.create(
    model="grok-3-mini",
    messages=[
        {
            "role": "user",
            "content": "What are some interesting facts about the planet Mars?",
        },
    ],
)
```

### Grok 3 Mini Fast

The fastest model in the Grok 3 Mini tier, optimized for latency.

| Feature        | Details                                                                |
| -------------- | ---------------------------------------------------------------------- |
| Model ID       | `grok-3-mini-fast-beta`                                                |
| Context window | 131,072 tokens                                                         |
| Capabilities   | Chat, Vision, Function Calling, Tool Choice                            |
| Input pricing  | $0.60 / 1M tokens                                                      |
| Output pricing | $4.00 / 1M tokens                                                      |
| Strengths      | Optimized for speed within the Mini tier                               |
| Best for       | Real-time applications needing cost-effective, large-context responses |

```python
response = client.chat.completions.create(
    model="grok-3-mini-fast-beta",
    messages=[
        {"role": "user", "content": "Translate 'Good morning' into Spanish."},
    ],
)
```

## Earlier Grok Models

Previous generations like Grok 2 (`grok-2-latest`) and Grok 2 Vision (`grok-2-vision-latest`) might also be available through AvalAI, offering different performance and pricing characteristics. Check the [Model Details](en/models/model-details.md) page for full availability.

### Using Grok Vision with Images

When using the `grok-2-vision-latest` model with images, you must provide images as base64-encoded strings:

```python
import base64
from openai import OpenAI

client = OpenAI(
    api_key="AVALAI_API_KEY",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
image_path = "path/to/your/image.jpg"
base64_image = encode_image(image_path)

# Create a message with text and image
response = client.chat.completions.create(
    model="grok-2-vision-latest",
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

## Using XAI Models via AvalAI

Access Grok models using the standard AvalAI API endpoints and OpenAI-compatible libraries.

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Example using Grok 3 Mini
response = client.chat.completions.create(
    model="grok-3-mini",
    messages=[{"role": "user", "content": "Tell me a joke."}],
)

print(response.choices[0].message.content)
```

## Related Resources

- [Chat Completions API](en/api-reference/chat.md)
- [Model Index](en/models/model-details.md)
- [Authentication](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)
