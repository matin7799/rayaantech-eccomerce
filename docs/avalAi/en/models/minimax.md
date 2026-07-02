# MiniMax

This page provides information about MiniMax models available on AvalAI.

MiniMax is an AI company focused on developing frontier foundation models for text, speech, video, and music. Their flagship M3 model brings frontier coding, a 1M-token context window, and native multimodality together in a single model, while the M2.5 series achieves SOTA performance in coding (80.2% SWE-Bench Verified), agentic tool use, and real-world productivity tasks with unprecedented cost efficiency. [Official Documentation](https://platform.minimax.io/docs/guides/quickstart)

## Available Models

### Text and Chat Models

MiniMax offers powerful language models for text generation and agentic applications.

#### minimax-m3

The `minimax-m3` model is MiniMax's new flagship model, combining frontier coding capability, an ultra-long 1M-token context window, and native multimodality in a single model. Built on the proprietary MiniMax Sparse Attention (MSA) architecture, M3 supports autonomous task decomposition, tool invocation, and multi-step reasoning.

**Key Features:**

- Frontier Coding & Agentic Capabilities: SWE-Bench Pro 59.0%, Terminal-Bench 2.1 66.0%, MCP Atlas 74.2%, BrowseComp 83.5
- 1M Context Window: Powered by MiniMax Sparse Attention (MSA) for long-range agent tasks, long-range coding, and long-video understanding, with a guaranteed minimum of 512K tokens
- Native Multimodality: Trained with mixed-modality data from step zero, supporting image and video input
- Toggleable Thinking: Switch reasoning on for complex agentic and long-horizon tasks, or off for faster, latency-sensitive scenarios — both modes share the same pricing
- Autonomous Long-Horizon Tasks: Capable of multi-hour autonomous execution with tool calling and self-validation
- Context-Aware Pricing: Standard rate for the common ≤512K input range, with a higher long-context rate only above 512K tokens

**Pricing:**

| Tier | Input | Cached Input | Output |
|------|-------|--------------|--------|
| ≤512K tokens | $0.60/1M tokens | $0.12/1M tokens | $2.40/1M tokens |
| Above 512K tokens | $1.20/1M tokens | $0.24/1M tokens | $4.80/1M tokens |

**Use Cases:**

- Frontier agentic coding and software engineering
- Long-context tasks: full-repository code understanding, ultra-long document parsing
- Multimodal understanding with image and video input
- Long-horizon autonomous agent workflows
- Multi-step reasoning and tool-driven automation

**Endpoint Support:**

- `v1/chat/completions`: Full support via the OpenAI-compatible API
- `v1/messages`: Full support via the Anthropic Messages API format
- `v1/responses`: Partial support (text input/output and basic tool use)

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m3",
    messages=[
        {
            "role": "user",
            "content": "Refactor this Python function for better performance and explain your reasoning.",
        }
    ],
    max_tokens=8192,
)

print(response.choices[0].message.content)
```

#### minimax-m2.1

The `minimax-m2.1` model is MiniMax's flagship reasoning model with o3-level performance. It excels at multi-programming language capabilities and agentic workflows.

**Key Features:**

- Exceptional Multi-Programming Language Capabilities: Systematically enhanced performance in Rust, Java, Golang, C++, Kotlin, Objective-C, TypeScript, JavaScript, and more
- o3-Level Reasoning: Combines deep reasoning with up to 20x better efficiency
- Outstanding Agent/Tool Scaffolding: Excellent performance across Claude Code, Cline, Kilo Code, Roo Code, and BlackBox
- Interleaved Thinking: Native support for reasoning between tool interactions with `thinking` blocks
- Concise and Efficient Responses: Improved response speed and reduced token consumption
- 204K Context Window: Supports extensive conversations and document processing
- 128K Max Output Tokens: Extended generation capability for complex tasks
- Output Speed: Approximately 60 tokens per second

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.30/1M tokens | $0.03/1M tokens | $0.375/1M tokens | $1.20/1M tokens |

**Use Cases:**

- Complex coding tasks and software engineering
- Agentic automation and tool use workflows
- Multi-language programming projects
- Code review and refactoring
- Technical documentation generation
- Research and analysis tasks

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.1",
    messages=[
        {
            "role": "user",
            "content": "Implement a concurrent web crawler in Rust with rate limiting.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### minimax-m2.1-lightning

The `minimax-m2.1-lightning` model is a faster variant of M2.1, optimized for speed while maintaining strong reasoning capabilities.

**Key Features:**

- Output Speed: Approximately 100 tokens per second (60% faster than M2.1)
- Same 204K context window as M2.1
- Optimized for latency-sensitive applications
- Full tool calling and function support
- Maintains reasoning quality with improved throughput

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.30/1M tokens | $0.03/1M tokens | $0.375/1M tokens | $2.40/1M tokens |

**Use Cases:**

- Real-time code assistance and IDE integrations
- Interactive chat applications requiring fast responses
- Live coding sessions and pair programming
- Time-sensitive agentic workflows
- High-throughput batch processing

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.1-lightning",
    messages=[
        {
            "role": "user",
            "content": "Explain the difference between async/await and Promises in JavaScript.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### minimax-m2.5

The `minimax-m2.5` model is MiniMax's latest flagship model designed for real-world productivity with SOTA performance in coding, agentic tool use, and office work tasks.

**Key Features:**

- SOTA Coding Performance: 80.2% on SWE-Bench Verified, 51.3% on Multi-SWE-Bench
- Advanced Search & Tool Calling: 76.3% on BrowseComp with context management
- 37% Faster Than M2.1: Improved task decomposition and token efficiency
- Spec-Writing Architecture: Model actively plans features, structure, and UI design before coding
- 10+ Programming Languages: Go, C, C++, TypeScript, Rust, Kotlin, Python, Java, JavaScript, PHP, Lua, Dart, Ruby
- Full Development Lifecycle: From 0-to-1 system design to 90-to-100 code review and testing
- Office Work Integration: Deep collaboration with finance, law, and social sciences professionals
- 204K Context Window: Supports extensive conversations and document processing
- Output Speed: Approximately 50 tokens per second
- **Built-in Reasoning**: Thinking content in `<think>` tags, separable via `reasoning_split` parameter

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.30/1M tokens | $0.03/1M tokens | $0.375/1M tokens | $1.20/1M tokens |

**Use Cases:**

- Agentic coding and software engineering
- Multi-programming language projects
- Complex search and research tasks
- Office work automation (Word, PowerPoint, Excel)
- Financial modeling and analysis
- Code review and refactoring

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.5",
    messages=[
        {
            "role": "user",
            "content": "Implement a rate-limited concurrent web crawler in Rust with proper error handling.",
        }
    ],
)

print(response.choices[0].message.content)
```

**Reasoning Content:**

MiniMax M2.5 includes built-in reasoning capabilities. By default, the model's thinking process appears within `<think>` and `</think>` tags in the response content. You can use the `reasoning_split` parameter to separate this content into a dedicated field.

```python
# Using reasoning_split to separate thinking content
response = client.chat.completions.create(
    model="minimax-m2.5",
    messages=[{"role": "user", "content": "What is 25 * 37?"}],
    extra_body={"reasoning_split": True},
)

# Access separated reasoning content
message = response.choices[0].message
print(f"Reasoning: {message.reasoning_details}")  # The thinking process
print(f"Answer: {message.content}")  # Only the final answer
```

When managing conversation history with tool calls, append the full response message object (including `tool_calls` field) to preserve context. For more details on the `reasoning_split` parameter, see [Provider-Specific Parameters](en/guides/provider-specific-params.md#minimax-models-m25-reasoning).

#### minimax-m2.5-lightning

The `minimax-m2.5-lightning` model is the ultra-fast variant of M2.5, optimized for speed while maintaining identical capabilities.

**Key Features:**

- Output Speed: Approximately 100 tokens per second (2x faster than other frontier models)
- Same Capabilities as M2.5: Identical intelligence with higher throughput
- On Par with Claude Opus 4.6: Matches completion speed of leading models
- Low-Cost Operation: $0.30 per hour at 100 TPS continuous operation
- 204K context window
- Full caching support

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.30/1M tokens | $0.03/1M tokens | $0.375/1M tokens | $2.40/1M tokens |

**Use Cases:**

- Real-time code assistance and IDE integrations
- Interactive chat applications requiring fast responses
- Live coding sessions and pair programming
- Time-sensitive agentic workflows
- High-throughput batch processing

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.5-lightning",
    messages=[
        {
            "role": "user",
            "content": "Explain the difference between async/await and Promises in JavaScript.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### minimax-m2.7

The `minimax-m2.7` model is MiniMax's latest flagship model featuring revolutionary self-evolution capabilities, becoming the first model to deeply participate in its own evolution. It achieves state-of-the-art performance across coding, agentic tasks, and complex skill execution.

**Key Features:**

- Self-Evolution Architecture: First model to deeply participate in own evolution, redesigning and improving itself
- SOTA Coding Performance: 56.22% on SWE-Pro benchmark, leading among all commercial models
- Advanced Reasoning: Matches top frontier models without extended thinking time
- Agent Teams Support: Multi-agent collaboration for complex agentic workflows
- 97% Skill Adherence: Maintains consistency across 40+ complex skill definitions
- VIBE-Pro Score: 55.6% for vibe-based generation quality
- Terminal Bench 2: 57.0% score on terminal-based tasks
- Output Speed: Approximately 60 tokens per second
- **Built-in Reasoning**: Thinking content in `<think>` tags, separable via `reasoning_split` parameter

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.30/1M tokens | $0.06/1M tokens | $0.375/1M tokens | $1.20/1M tokens |

**Use Cases:**

- Complex agentic coding and software development
- Multi-agent team collaboration workflows
- Self-improving AI system development
- Advanced skill-following applications
- High-reliability production deployments
- Research and development automation

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.7",
    messages=[
        {
            "role": "user",
            "content": "Design a microservices architecture for a real-time collaborative document editor with conflict resolution.",
        }
    ],
)

print(response.choices[0].message.content)
```

**Reasoning Content:**

MiniMax M2.7 includes built-in reasoning capabilities. By default, the model's thinking process appears within `<think>` and `</think>` tags in the response content. You can use the `reasoning_split` parameter to separate this content into a dedicated field.

```python
# Using reasoning_split to separate thinking content
response = client.chat.completions.create(
    model="minimax-m2.7",
    messages=[
        {
            "role": "user",
            "content": "What are the tradeoffs between monolithic and microservices architectures?",
        }
    ],
    extra_body={"reasoning_split": True},
)

# Access separated reasoning content
message = response.choices[0].message
print(f"Reasoning: {message.reasoning_details}")  # The thinking process
print(f"Answer: {message.content}")  # Only the final answer
```

#### minimax-m2.7-highspeed

The `minimax-m2.7-highspeed` model is the ultra-fast variant of M2.7, optimized for maximum speed while maintaining identical self-evolution capabilities.

**Key Features:**

- Output Speed: Approximately 100 tokens per second (fastest in class)
- Same Capabilities as M2.7: Identical self-evolution intelligence with higher throughput
- Agent Teams Support: Full multi-agent collaboration capabilities at high speed
- 97% Skill Adherence: Maintains consistency across 40+ complex skills
- Low-Latency Operation: Ideal for real-time interactive applications
- Full caching support with optimized pricing

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.60/1M tokens | $0.06/1M tokens | $0.375/1M tokens | $2.40/1M tokens |

**Use Cases:**

- Real-time agentic workflows requiring instant responses
- Interactive coding assistants and IDE integrations
- Live multi-agent team coordination
- High-throughput batch processing
- Time-sensitive production applications
- Streaming chat applications

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.7-highspeed",
    messages=[
        {
            "role": "user",
            "content": "Explain the CAP theorem and its implications for distributed database design.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### minimax-m2

The `minimax-m2` model is the previous generation model with strong agentic capabilities, offering a cost-effective option for general tasks.

**Key Features:**

- 204K context window
- Advanced reasoning capabilities
- Tool calling support
- Cost-effective option for production applications
- Strong performance on coding and reasoning tasks

**Pricing:**

| Input | Cached Input | Cache Creation | Output |
|-------|--------------|----------------|--------|
| $0.30/1M tokens | $0.03/1M tokens | $0.375/1M tokens | $1.20/1M tokens |

**Use Cases:**

- General text generation and understanding
- Coding assistance and code generation
- Content creation and summarization
- Question answering and analysis
- Agentic workflows with tool use

## SDK Access Methods

MiniMax models can be accessed through two SDK approaches:

| SDK | Base URL | Endpoint | Best For |
|-----|----------|----------|----------|
| OpenAI SDK | `https://api.avalai.ir/v1` | `/v1/chat/completions` | Standard chat completions |
| Anthropic SDK | `https://api.avalai.ir` (without /v1) | `/v1/messages` | Native thinking blocks, tool use |

## Usage Examples

### OpenAI SDK - Basic Usage

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.1",
    messages=[
        {
            "role": "user",
            "content": "Implement a JWT authentication system in Node.js with refresh tokens",
        }
    ],
)

print(response.choices[0].message.content)
```

### OpenAI SDK - Function Calling

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

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
                        "description": "City name, e.g. Tokyo",
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
    model="minimax-m2.1",
    messages=[{"role": "user", "content": "What is the weather like in Tokyo?"}],
    tools=tools,
    tool_choice="auto",
)

print(response.choices[0].message)
```

### Anthropic SDK - Basic Usage

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # Note: without /v1
)

message = client.messages.create(
    model="minimax-m2.1",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Implement a JWT authentication system in Node.js"}
    ],
)

print(message.content)
```

### Anthropic SDK - Tool Use with Interleaved Thinking

MiniMax M2.1 natively supports **Interleaved Thinking**, enabling it to reason between each round of tool interactions. Before every tool use, the model reflects on the current environment and tool outputs to decide its next action.

```python
import anthropic
import json

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # Note: without /v1
)

# Define tool: weather query
tools = [
    {
        "name": "get_weather",
        "description": "Get weather of a location, the user should supply a location first.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, US",
                }
            },
            "required": ["location"],
        },
    }
]


def send_messages(messages):
    response = client.messages.create(
        model="minimax-m2.1",
        max_tokens=4096,
        messages=messages,
        tools=tools,
    )
    return response


def process_response(response):
    thinking_blocks = []
    text_blocks = []
    tool_use_blocks = []

    for block in response.content:
        if block.type == "thinking":
            thinking_blocks.append(block)
            print(f"💭 Thinking>\n{block.thinking}\n")
        elif block.type == "text":
            text_blocks.append(block)
            print(f"💬 Model>\t{block.text}")
        elif block.type == "tool_use":
            tool_use_blocks.append(block)
            print(
                f"🔧 Tool>\t{block.name}({json.dumps(block.input, ensure_ascii=False)})"
            )

    return thinking_blocks, text_blocks, tool_use_blocks


# User query
messages = [{"role": "user", "content": "How's the weather in San Francisco?"}]
print(f"\n👤 User>\t {messages[0]['content']}")

# Model returns first response (may include tool calls)
response = send_messages(messages)
thinking_blocks, text_blocks, tool_use_blocks = process_response(response)

# If tool calls exist, execute tools and continue conversation
if tool_use_blocks:
    # ⚠️ Critical: Append the assistant's complete response to message history
    messages.append({"role": "assistant", "content": response.content})

    # Execute tool and return result (simulating weather API call)
    print(f"\n🔨 Executing tool: {tool_use_blocks[0].name}")
    tool_result = "24℃, sunny"
    print(f"📊 Tool result: {tool_result}")

    # Add tool execution result
    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_blocks[0].id,
                    "content": tool_result,
                }
            ],
        }
    )

    # Get final response
    final_response = send_messages(messages)
    process_response(final_response)
```

## Interleaved Thinking

MiniMax M2.1's **Interleaved Thinking** capability allows the model to reason between tool interactions, making it exceptionally powerful for agentic workflows.

### How It Works

1. **Before Tool Use**: The model reflects on the current environment and decides which tool to call
2. **After Tool Result**: The model analyzes the tool output and plans the next action
3. **Chain of Thought**: The complete reasoning chain is preserved across multiple tool interactions

### Best Practices

- **Preserve Full Response**: Always append the complete `response.content` (including thinking blocks) to message history
- **Don't Modify Content**: Keep thinking blocks intact - they maintain reasoning continuity
- **Use Anthropic SDK**: For native thinking block support, use the Anthropic SDK with `base_url="https://api.avalai.ir"`

### Response Format

When using the Anthropic SDK, responses include three block types:

| Block Type | Description |
|------------|-------------|
| `thinking` | Model's internal reasoning process |
| `text` | Text content output by the model |
| `tool_use` | Tool call information with function name and arguments |

## JavaScript/TypeScript Examples

### OpenAI SDK

```javascript
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "minimax-m2.1",
  messages: [
    {
      role: "user",
      content: "Implement a JWT authentication system in Node.js with refresh tokens",
    },
  ],
});

console.log(response.choices[0].message.content);
```

### Anthropic SDK

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",  // Note: without /v1
});

const message = await client.messages.create({
  model: "minimax-m2.1",
  max_tokens: 4096,
  messages: [
    { role: "user", content: "Implement a JWT authentication system in Node.js" }
  ],
});

console.log(message.content);
```

## Model Comparison

| Feature | minimax-m3 | minimax-m2.7 | minimax-m2.5 | minimax-m2.1 |
|---------|------------|--------------|--------------|--------------|
| Context Window | Up to 1,000,000 tokens | 204,800 tokens | 1,000,000 tokens | 204,800 tokens |
| Multimodal Input | Text, Image, Video | Text | Text | Text |
| Tool Calling | ✓ | ✓ | ✓ | ✓ |
| Input Price | $0.60/1M (≤512K) | $0.30/1M | $0.30/1M | $0.30/1M |
| Output Price | $2.40/1M (≤512K) | $1.20/1M | $1.20/1M | $1.20/1M |
| Best For | Frontier coding, 1M context, multimodal | Self-evolution, Agent Teams | SOTA coding, productivity | Complex reasoning |

## Related Resources

- [MiniMax Provider Support Announcement](en/news/2025-12-28-minimax-provider-support-added.md)
- [MiniMax Official Documentation](https://platform.minimax.io/docs/guides/quickstart)
- [Libraries & SDKs](en/libraries.md)
- [Pricing](en/pricing.md)
- [Function Calling Guide](en/guides/tools.md)
