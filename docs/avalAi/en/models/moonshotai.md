# Moonshot.ai

Moonshot.ai provides advanced AI models through their Kimi series, featuring extended context windows, vision capabilities, reasoning features, and comprehensive tool calling support. All models are optimized for both Chinese and English conversations and support the OpenAI SDK format.

> **Note on Pricing:** Due to Singapore's 9% GST requirements, we've added 10% to official Moonshot.ai pricing to cover payment processing fees. We remain committed to our no-markup, zero-fee API service for base API services. [Learn more about our pricing policy](en/pricing.md).

## Available Models

- [kimi-k2.7-code](#kimi-k27-code) - Latest open-source coding model with SOTA software engineering and agentic capabilities
- [kimi-k2.7-code-highspeed](#kimi-k27-code-highspeed) - High-speed variant of K2.7 Code for low-latency coding workloads
- [kimi-k2.6](#kimi-k26) - Open-source model with SOTA coding, long-horizon execution, and agent swarm
- [kimi-k2.5](#kimi-k25) - Most powerful open-source multimodal model with agent swarm capabilities
- [kimi-k2-thinking](#kimi-k2-thinking) - Flagship agentic reasoning model with deep reasoning capabilities
- [kimi-k2-0711-preview](#kimi-k2-0711-preview) - Next-generation K2 model preview
- [kimi-latest](#kimi-latest) - Latest stable Kimi model with auto-versioning
- [kimi-thinking-preview](#kimi-thinking-preview) - Advanced reasoning model with Chain-of-Thought
- [moonshot-v1-8k](#moonshot-v1-8k) - Cost-effective 8K context model
- [moonshot-v1-8k-vision-preview](#moonshot-v1-8k-vision-preview) - 8K vision-enabled model
- [moonshot-v1-32k](#moonshot-v1-32k) - Balanced 32K context model
- [moonshot-v1-32k-vision-preview](#moonshot-v1-32k-vision-preview) - 32K vision-enabled model
- [moonshot-v1-128k](#moonshot-v1-128k) - Extended 128K context model
- [moonshot-v1-128k-vision-preview](#moonshot-v1-128k-vision-preview) - 128K vision-enabled model
- [moonshot-v1-auto](#moonshot-v1-auto) - Automatic model selection

## API Endpoint Support

| Model | v1/chat/completions | v1/messages | v1/responses |
|-------|---------------------|-------------|--------------|
| All Moonshot models | ✅ Full | ⚠️ Partial | ⚠️ Partial |

## Key Features

- **Extended Context Windows**: 8K to 128K tokens for handling extensive conversations and documents
- **Vision Capabilities**: Vision-preview models support Base64-encoded images and image URLs
- **Tool Use (Function Calling)**: All models support up to 128 tools per request
- **JSON Mode**: Structured output support via `response_format` parameter
- **Partial Mode**: Ability to prefill assistant responses for better output control
- **Prompt Caching**: All models support cached input for significant cost savings
- **Bilingual Support**: Optimized for both Chinese and English conversations

## kimi-k2.7-code

**SOTA Open-Source Coding — Software Engineering and Agentic Workflows**

Kimi K2.7 Code is Moonshot AI's latest open-source model purpose-built for software engineering and agentic coding. It delivers state-of-the-art results on coding and agentic benchmarks, with strong multi-step reliability for full-stack generation, repository-level tasks, and long-horizon tool use. The model is served through the Fireworks.ai API provider.

### Features

- **SOTA Coding**: State-of-the-art software engineering performance across front-end and back-end tasks
- **Agentic Workflows**: Reliable multi-step execution with tool use for repository-level and full-stack work
- **Long-Horizon Execution**: Handles complex, multi-step tasks with high reliability
- **Tool Calling**: Full function calling support
- **Extended Context**: 262,144-token context window for large codebases and long sessions

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $1.045 per 1M tokens |
| Cached Input Tokens | $0.19 per 1M tokens |
| Output Tokens | $4.40 per 1M tokens |

> **Pricing Note:** Includes the standard AvalAI Moonshot 10% margin over official pricing for Singapore GST compliance.

### Endpoint Support

| Endpoint | Support |
|----------|---------|
| `v1/chat/completions` | ✅ Full |
| `v1/responses` | ⚠️ Partial |

### Use Cases

- Full-stack web application generation
- Repository-level code understanding and refactoring
- Agentic coding workflows with multi-step tool use
- Low-cost, high-quality open-source coding alternative

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.7-code",
    "messages": [
      {
        "role": "user",
        "content": "Implement a REST API in FastAPI with JWT authentication and SQLAlchemy models."
      }
    ],
    "max_tokens": 8192
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-k2.7-code",
    messages=[
        {
            "role": "user",
            "content": "Implement a REST API in FastAPI with JWT authentication and SQLAlchemy models.",
        },
    ],
    max_tokens=8192,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "kimi-k2.7-code",
  messages: [
    {
      role: "user",
      content: "Implement a REST API in FastAPI with JWT authentication and SQLAlchemy models.",
    },
  ],
  max_tokens: 8192,
});

console.log(response.choices[0].message.content);

```

---

## kimi-k2.7-code-highspeed

**Low-Latency Coding — High-Speed Variant of K2.7 Code**

Kimi K2.7 Code Highspeed is a high-speed serving variant of Kimi K2.7 Code, optimized for low-latency coding workloads where faster response times matter. It retains the same software engineering and agentic capabilities while prioritizing throughput, at a higher per-token price reflecting the dedicated high-speed serving path. The model is served through the Fireworks.ai API provider.

### Features

- **High-Speed Serving**: Optimized for low-latency responses in interactive coding scenarios
- **SOTA Coding**: Same state-of-the-art software engineering performance as K2.7 Code
- **Agentic Workflows**: Reliable multi-step execution with tool use
- **Tool Calling**: Full function calling support
- **Extended Context**: 262,144-token context window

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $2.09 per 1M tokens |
| Cached Input Tokens | $0.418 per 1M tokens |
| Output Tokens | $8.80 per 1M tokens |

> **Pricing Note:** Includes the standard AvalAI Moonshot 10% margin over official pricing for Singapore GST compliance. Higher pricing reflects the dedicated high-speed serving path.

### Endpoint Support

| Endpoint | Support |
|----------|---------|
| `v1/chat/completions` | ✅ Full |
| `v1/responses` | ⚠️ Partial |

### Use Cases

- Interactive IDE assistants requiring fast response times
- Latency-sensitive agentic coding workflows
- Real-time code generation and completion

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.7-code-highspeed",
    "messages": [
      {
        "role": "user",
        "content": "Write a debounced search hook in React with TypeScript."
      }
    ],
    "max_tokens": 4096
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-k2.7-code-highspeed",
    messages=[
        {
            "role": "user",
            "content": "Write a debounced search hook in React with TypeScript.",
        },
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "kimi-k2.7-code-highspeed",
  messages: [
    {
      role: "user",
      content: "Write a debounced search hook in React with TypeScript.",
    },
  ],
  max_tokens: 4096,
});

console.log(response.choices[0].message.content);

```

---

## kimi-k2.6

**From Code to Creation, From One to Many — SOTA Coding with Long-Horizon Execution**

Kimi K2.6 is Moonshot AI's latest open-source model featuring state-of-the-art coding, long-horizon execution, and agent swarm capabilities. It builds on K2.5 with stronger multi-step reliability, full-stack generation, Document-to-Skills reusability, Claw Groups (Preview), and Kimi Slides.

### Features

- **SOTA Coding**: Transforms prompts into Awwwards-level front-end interfaces with clean linework, animations, and interactivity
- **Full-Stack Generation**: Creates complete working websites with authentication, interactions, and database operations from a single prompt
- **Long-Horizon Execution**: Handles complex, multi-step tasks with higher reliability and fewer unnecessary changes
- **Agent Swarm**: Coordinates multiple agents in parallel for search, research, analysis, long-form writing, and multi-format content generation
- **Document to Skills**: Turn high-quality documents into reusable skills that apply across future tasks
- **Claw Groups (Preview)**: Multi-agent team workflow with a coordinator assigning tasks and managing dependencies
- **Kimi Slides**: Production-ready presentation generation from prompts or multi-format inputs
- **Tool Calling**: Full function calling support

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $1.05 per 1M tokens |
| Cached Input Tokens | $0.18 per 1M tokens |
| Output Tokens | $4.40 per 1M tokens |

> **Pricing Note:** Includes the standard AvalAI Moonshot 10% margin over official pricing for Singapore GST compliance.

### Use Cases

- Full-stack web application generation with clean UI and authentication
- Long-horizon agent workflows (research, analysis, creative production)
- Multi-agent coordination via Claw Groups for complex projects
- Production-grade presentation generation with Kimi Slides
- Document-to-Skills conversion for reusable task patterns
- Market strategy and multi-format content creation

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.6",
    "messages": [
      {
        "role": "user",
        "content": "Build a full-stack task management web application with user authentication, real-time updates, and a clean modern UI."
      }
    ],
    "max_tokens": 8192
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-k2.6",
    messages=[
        {
            "role": "user",
            "content": "Build a full-stack task management web application with user authentication, real-time updates, and a clean modern UI.",
        },
    ],
    max_tokens=8192,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "kimi-k2.6",
  messages: [
    {
      role: "user",
      content: "Build a full-stack task management web application with user authentication, real-time updates, and a clean modern UI.",
    },
  ],
  max_tokens: 8192,
});

console.log(response.choices[0].message.content);

```

## kimi-k2.5

**The Most Powerful Open-Source Multimodal Model with Visual Agentic Intelligence**

Kimi K2.5 is Moonshot AI's most powerful open-source model to date, built on Kimi K2 with continued pretraining over approximately 15T mixed visual and text tokens. As a native multimodal model, K2.5 delivers state-of-the-art **coding and vision** capabilities and a self-directed **agent swarm** paradigm.

### Features

- **Visual Agentic Intelligence**: Native multimodal capabilities with state-of-the-art coding and vision
- **Agent Swarm**: Self-direct up to 100 sub-agents, executing parallel workflows across up to 1,500 tool calls
- **Coding with Vision**: Excel at front-end development, video-to-code generation, and visual debugging
- **4.5x Faster Execution**: Agent swarm reduces execution time compared to single-agent setup
- **Multi-Endpoint Support**: Available on both `v1/chat/completions` and `v1/responses` endpoints
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.66 per 1M tokens |
| Cached Input Tokens | $0.11 per 1M tokens |
| Output Tokens | $3.30 per 1M tokens |

### Use Cases

- Complex front-end development with interactive layouts and rich animations
- Video-to-code generation and visual debugging
- Multi-agent workflows with parallel execution
- Image and video reasoning tasks
- Advanced coding tasks with visual understanding
- Autonomous agent applications

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.5",
    "messages": [
      {
        "role": "user",
        "content": "Create a responsive landing page with scroll-triggered animations."
      }
    ],
    "max_tokens": 8000
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-k2.5",
    messages=[
        {
            "role": "user",
            "content": "Create a responsive landing page with scroll-triggered animations.",
        },
    ],
    max_tokens=8000,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "kimi-k2.5",
  messages: [
    {
      role: "user",
      content: "Create a responsive landing page with scroll-triggered animations.",
    },
  ],
  max_tokens: 8000,
});

console.log(response.choices[0].message.content);

```

---

## kimi-k2-thinking

**Moonshot AI's flagship agentic reasoning model with deep reasoning capabilities**

The newest flagship model from Moonshot AI, [`kimi-k2-thinking`](en/news/2025-11-18-new-models-gemini-3-pro-kimi-k2-thinking.md) is a general-purpose agentic reasoning model designed for deep reasoning and multi-step tool use. This model excels at solving highly complex problems through extended reasoning chains and sequential tool calls.

### Features

- **Deep Reasoning**: Extended reasoning capabilities with `reasoning_content` field
- **Multi-Step Tool Use**: Designed to perform deep reasoning across multiple tool calls
- **Agentic Performance**: Excels at planning and executing complex multi-step tasks
- **Advanced Problem Solving**: Capable of tackling the hardest problems through step-by-step reasoning
- **Context Window**: Large context support for comprehensive problem analysis
- **Recommended Temperature**: 1.0 for optimal performance
- **Recommended max_tokens**: ≥ 16,000 to ensure full reasoning_content can be returned
- **Streaming Recommended**: Enable `stream: true` for better user experience and to avoid timeout issues
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.66 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $2.75 per 1M tokens |
| Search Context | $0.005 per query |

### Use Cases

- Complex reasoning and problem-solving tasks
- Multi-step agentic workflows with tool use
- Strategic planning and decision making
- Advanced research and analysis
- Code generation with deep reasoning
- Multi-turn complex conversations requiring context retention

### Important Implementation Notes

For optimal results with [`kimi-k2-thinking`](en/news/2025-11-18-new-models-gemini-3-pro-kimi-k2-thinking.md):

1. **Include Full Reasoning Context**: Always include the entire `reasoning_content` field from previous responses in your input. The model will decide which parts are necessary for further reasoning.

2. **Set Adequate max_tokens**: Use `max_tokens ≥ 16,000` to ensure the full `reasoning_content` and final content can be returned without truncation.

3. **Use Recommended Temperature**: Set `temperature = 1.0` to get the best performance from the model.

4. **Enable Streaming**: Use `stream = true` for better user experience and to help avoid network-timeout issues, as reasoning responses can be larger than typical completions.

5. **Accessing reasoning_content**: In the OpenAI SDK, use `hasattr(obj, "reasoning_content")` to check if the field exists, and `getattr(obj, "reasoning_content")` to retrieve its value. The `reasoning_content` field appears at the same level as the `content` field.

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2-thinking",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI with advanced reasoning capabilities."
      },
      {
        "role": "user",
        "content": "Design a comprehensive digital marketing strategy for a tech startup."
      }
    ],
    "max_tokens": 16000,
    "temperature": 1.0,
    "stream": true
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-k2-thinking",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI with advanced reasoning capabilities.",
        },
        {
            "role": "user",
            "content": "Design a comprehensive digital marketing strategy for a tech startup.",
        },
    ],
    max_tokens=16000,
    temperature=1.0,
)

# Access reasoning content if available
message = response.choices[0].message
if hasattr(message, "reasoning_content"):
    reasoning = getattr(message, "reasoning_content")
    print("Reasoning:", reasoning)

print("Answer:", message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "kimi-k2-thinking",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI with advanced reasoning capabilities.",
    },
    {
      role: "user",
      content: "Design a comprehensive digital marketing strategy for a tech startup.",
    },
  ],
  max_tokens: 16000,
  temperature: 1.0,
});

// Access reasoning content if available
const message = response.choices[0].message;
if ("reasoning_content" in message) {
  console.log("Reasoning:", message.reasoning_content);
}

console.log("Answer:", message.content);

```

### Multi-Step Tool Calling Example

```python
from openai import OpenAI
import json

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Define tools for the model to use
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather information",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City name"}
                },
                "required": ["location"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "Search the web for information",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"}
                },
                "required": ["query"],
            },
        },
    },
]

messages = [
    {
        "role": "system",
        "content": "You are Kimi, an AI assistant with access to tools for gathering information.",
    },
    {
        "role": "user",
        "content": "What's the weather like in Tokyo and find recent news about AI developments?",
    },
]

# Multi-turn conversation with tool calls
max_iterations = 10
for iteration in range(max_iterations):
    response = client.chat.completions.create(
        model="kimi-k2-thinking",
        messages=messages,
        tools=tools,
        max_tokens=16000,
        temperature=1.0,
    )

    message = response.choices[0].message

    # Display reasoning if available
    if hasattr(message, "reasoning_content"):
        reasoning = getattr(message, "reasoning_content")
        print(f"\\n=== Reasoning (Iteration {iteration + 1}) ===")
        print(reasoning[:200] + "..." if len(reasoning) > 200 else reasoning)

    # Add assistant message to history (preserves reasoning_content)
    messages.append(message)

    # If no tool calls, conversation is complete
    if not message.tool_calls:
        print("\\n=== Final Answer ===")
        print(message.content)
        break

    # Handle tool calls
    print(f"\\nModel called {len(message.tool_calls)} tool(s)")
    for tool_call in message.tool_calls:
        func_name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        print(f"  - {func_name}({args})")

        # Simulate tool execution (replace with actual tool calls)
        if func_name == "get_weather":
            result = f"Weather in {args['location']}: Sunny, 22°C"
        elif func_name == "web_search":
            result = f"Search results for '{args['query']}': [Recent AI news...]"
        else:
            result = "Tool not found"

        # Add tool result to messages
        messages.append(
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": func_name,
                "content": result,
            }
        )
```

---

---

## kimi-k2-0711-preview

**Next-generation K2 model preview with enhanced performance**

The preview release of Moonshot's next-generation K2 model, offering improved performance and efficiency over previous versions.

### Features

- **Context Window**: 128K tokens
- **Recommended Temperature**: 0.6
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.66 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $2.75 per 1M tokens |

### Use Cases

- Complex reasoning tasks
- Multi-turn conversations
- Document analysis and summarization
- Technical content generation

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2-0711-preview",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "Explain the concept of prompt caching."
      }
    ],
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-k2-0711-preview",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {
            "role": "user",
            "content": "Explain the concept of prompt caching.",
        },
    ],
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "kimi-k2-0711-preview",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI.",
    },
    {
      role: "user",
      content: "Explain the concept of prompt caching.",
    }
  ],
  temperature: 0.6,
});

console.log(response.choices[0].message.content);

```

---

## kimi-latest

**Latest stable Kimi model with automatic version selection**

The latest stable version of Kimi with automatic version selection, ensuring you always have access to the most current and optimized model.

### Features

- **Context Window**: 128K tokens
- **Recommended Temperature**: 0.6
- **Auto-Versioning**: Automatically uses the latest stable release
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.22 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $5.50 per 1M tokens |

### Use Cases

- General-purpose conversations
- Content generation and editing
- Code assistance and debugging
- Question answering

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-latest",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "Write a Python function to calculate Fibonacci numbers."
      }
    ],
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-latest",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {
            "role": "user",
            "content": "Write a Python function to calculate Fibonacci numbers.",
        },
    ],
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "kimi-latest",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI.",
    },
    {
      role: "user",
      content: "Write a Python function to calculate Fibonacci numbers.",
    }
  ],
  temperature: 0.6,
});

console.log(response.choices[0].message.content);

```

---

## kimi-thinking-preview

**Advanced reasoning model with Chain-of-Thought capabilities**

A specialized reasoning model that applies Chain-of-Thought (CoT) reasoning for complex multi-step problem-solving and analysis.

### Features

- **Reasoning Model**: Chain-of-Thought (CoT) capabilities
- **Context Window**: 128K tokens
- **Recommended Temperature**: 1.0
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Visible Thinking Process**: Shows step-by-step reasoning

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $33.00 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $33.00 per 1M tokens |

### Use Cases

- Complex problem solving
- Multi-step reasoning tasks
- Strategic planning and analysis
- Mathematical and logical problems
- System architecture design

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-thinking-preview",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "Design a scalable database schema for a social media platform."
      }
    ],
    "temperature": 1.0,
    "max_tokens": 4096
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="kimi-thinking-preview",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {
            "role": "user",
            "content": "Design a scalable database schema for a social media platform.",
        },
    ],
    temperature=1.0,
    max_tokens=4096,
)

# The model will show its Chain-of-Thought reasoning process
print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "kimi-thinking-preview",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI.",
    },
    {
      role: "user",
      content: "Design a scalable database schema for a social media platform.",
    }
  ],
  temperature: 1.0,
  max_tokens: 4096,
});

// The model will show its Chain-of-Thought reasoning process
console.log(response.choices[0].message.content);

```

---

## moonshot-v1-8k

**Cost-effective model for shorter conversations**

A cost-effective model with an 8K context window, ideal for shorter conversations and quick tasks.

### Features

- **Context Window**: 8K tokens
- **Recommended Temperature**: 0.6
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content
- **Cost-Effective**: Lower pricing for budget-conscious applications

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.22 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $2.20 per 1M tokens |

### Use Cases

- Quick Q&A
- Short content generation
- Simple code snippets
- Brief summaries

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "moonshot-v1-8k",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "What is machine learning?"
      }
    ],
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="moonshot-v1-8k",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {
            "role": "user",
            "content": "What is machine learning?",
        },
    ],
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "moonshot-v1-8k",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI.",
    },
    {
      role: "user",
      content: "What is machine learning?",
    }
  ],
  temperature: 0.6,
});

console.log(response.choices[0].message.content);

```

---

## moonshot-v1-8k-vision-preview

**Vision-enabled model for multimodal tasks**

An 8K context model with vision capabilities, supporting image understanding through Base64-encoded images and URLs.

### Features

- **Context Window**: 8K tokens
- **Recommended Temperature**: 0.6
- **Vision Capabilities**: Supports JPG, PNG, BMP images
- **Image Input**: Base64 encoding and URL support
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.22 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $2.20 per 1M tokens |

### Use Cases

- Image description and analysis
- Visual question answering
- Document understanding with images
- Product image analysis

### Example

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

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
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

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
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

console.log(response.choices[0].message.content);

```

---

## moonshot-v1-32k

**Balanced model for medium-length conversations**

A balanced model with a 32K context window, suitable for medium-length conversations and document processing.

### Features

- **Context Window**: 32K tokens
- **Recommended Temperature**: 0.6
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content
- **Balanced Performance**: Good mix of capacity and cost

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $1.10 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $3.30 per 1M tokens |

### Use Cases

- Medium-length document analysis
- Multi-turn conversations
- Code review and explanation
- Content summarization

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "moonshot-v1-32k",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "Summarize this article: [article content]"
      }
    ],
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="moonshot-v1-32k",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {
            "role": "user",
            "content": "Summarize this article: [article content]",
        },
    ],
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "moonshot-v1-32k",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI.",
    },
    {
      role: "user",
      content: "Summarize this article: [article content]",
    }
  ],
  temperature: 0.6,
});

console.log(response.choices[0].message.content);

```

---

## moonshot-v1-32k-vision-preview

**Vision-enabled model with extended context**

A 32K context model with vision capabilities, suitable for multimodal tasks requiring more context.

### Features

- **Context Window**: 32K tokens
- **Recommended Temperature**: 0.6
- **Vision Capabilities**: Supports JPG, PNG, BMP images
- **Image Input**: Base64 encoding and URL support
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $1.10 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $3.30 per 1M tokens |

### Use Cases

- Complex visual analysis with context
- Multi-page document understanding
- Visual content generation
- Image-based research assistance

---

## moonshot-v1-128k

**Extended context model for document processing**

A model with an extended 128K context window, ideal for processing lengthy documents and extensive conversations.

### Features

- **Context Window**: 128K tokens
- **Recommended Temperature**: 0.6
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Significant savings on large documents
- **Extended Capacity**: Handle book-length content

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $2.20 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $5.50 per 1M tokens |

### Use Cases

- Long document analysis and summarization
- Extended research papers
- Codebase understanding
- Book-length content processing
- Extensive conversation history

---

## moonshot-v1-128k-vision-preview

**Vision-enabled model with maximum context window**

The flagship vision model with a 128K context window, supporting complex multimodal tasks with extensive context.

### Features

- **Context Window**: 128K tokens
- **Recommended Temperature**: 0.6
- **Vision Capabilities**: Supports JPG, PNG, BMP images
- **Image Input**: Base64 encoding and URL support
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Maximum Capacity**: Largest context for vision tasks

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $2.20 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $5.50 per 1M tokens |

### Use Cases

- Complex visual document analysis
- Multi-image understanding
- Technical diagram interpretation
- Visual research with extensive context

---

## moonshot-v1-auto

**Automatic model selection based on input**

An intelligent routing model that automatically
selects the optimal model based on your input, balancing performance and cost.

### Features

- **Context Window**: Up to 128K tokens (depending on selected model)
- **Recommended Temperature**: 0.6
- **Intelligent Routing**: Automatically selects the best model
- **Tool Calling**: Up to 128 functions per request
- **JSON Mode**: Structured output support
- **Prompt Caching**: Reduces cost on repeated content
- **Cost Optimization**: Balances performance and efficiency

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $2.20 per 1M tokens |
| Cached Input Tokens | $0.165 per 1M tokens |
| Output Tokens | $5.50 per 1M tokens |

**Note**: Pricing reflects maximum model capacity. Actual costs may be lower if a smaller model is automatically selected.

### Use Cases

- Variable-length conversations
- Diverse task types
- Applications requiring cost optimization
- General-purpose AI assistance

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "moonshot-v1-auto",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "Help me understand recursion in programming."
      }
    ],
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="moonshot-v1-auto",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {
            "role": "user",
            "content": "Help me understand recursion in programming.",
        },
    ],
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "moonshot-v1-auto",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant provided by Moonshot AI.",
    },
    {
      role: "user",
      content: "Help me understand recursion in programming.",
    }
  ],
  temperature: 0.6,
});

console.log(response.choices[0].message.content);

```

---

## Advanced Features

### Function Calling (Tool Use)

All Moonshot.ai models support function calling with up to 128 tools per request. Functions must follow OpenAI's tool specification format.

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-latest",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "What is the weather in Paris?"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get current weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"]
              }
            },
            "required": ["location"]
          }
        }
      }
    ],
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City name"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="kimi-latest",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {"role": "user", "content": "What is the weather in Paris?"},
    ],
    tools=tools,
    temperature=0.6,
)

print(response.choices[0].message)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City name" },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  }
];

const response = await client.chat.completions.create({
  model: "kimi-latest",
  messages: [
    { role: "system", content: "You are Kimi, an AI assistant provided by Moonshot AI." },
    { role: "user", content: "What is the weather in Paris?" },
  ],
  tools: tools,
  temperature: 0.6,
});

console.log(response.choices[0].message);

```

### JSON Mode

Enable structured JSON output by setting the `response_format` parameter:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-latest",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant. Extract user information as JSON."
      },
      {
        "role": "user",
        "content": "My name is John, I am 30 years old, and I live in New York."
      }
    ],
    "response_format": {"type": "json_object"},
    "temperature": 0.6
  }'

python=:response = client.chat.completions.create(
    model="kimi-latest",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant. Extract user information as JSON.",
        },
        {
            "role": "user",
            "content": "My name is John, I am 30 years old, and I live in New York.",
        },
    ],
    response_format={"type": "json_object"},
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:const response = await client.chat.completions.create({
  model: "kimi-latest",
  messages: [
    {
      role: "system",
      content: "You are Kimi, an AI assistant. Extract user information as JSON.",
    },
    {
      role: "user",
      content: "My name is John, I am 30 years old, and I live in New York.",
    },
  ],
  response_format: { type: "json_object" },
  temperature: 0.6,
});

console.log(response.choices[0].message.content);

```

### Streaming Responses

Enable streaming for real-time token generation:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-latest",
    "messages": [
      {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI."
      },
      {
        "role": "user",
        "content": "Write a short story about AI."
      }
    ],
    "stream": true,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

stream = client.chat.completions.create(
    model="kimi-latest",
    messages=[
        {
            "role": "system",
            "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
        },
        {"role": "user", "content": "Write a short story about AI."},
    ],
    stream=True,
    temperature=0.6,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const stream = await client.chat.completions.create({
  model: "kimi-latest",
  messages: [
    { role: "system", content: "You are Kimi, an AI assistant provided by Moonshot AI." },
    { role: "user", content: "Write a short story about AI." },
  ],
  stream: true,
  temperature: 0.6,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}

```

## Best Practices

### Choosing the Right Model

- **Quick tasks**: Use [`moonshot-v1-8k`](#moonshot-v1-8k) for cost-effective short conversations
- **General use**: Use [`kimi-latest`](#kimi-latest) for balanced performance and auto-updates
- **Vision tasks**: Use vision-preview models for image understanding
- **Complex reasoning**: Use [`kimi-thinking-preview`](#kimi-thinking-preview) for multi-step problems
- **Long documents**: Use 128K models for extensive context
- **Flexible needs**: Use [`moonshot-v1-auto`](#moonshot-v1-auto) for automatic optimization

### Temperature Settings

- **Recommended for most models**: 0.6
- **Recommended for reasoning models**: 1.0
- **Lower values (0.2-0.4)**: More deterministic, focused outputs
- **Higher values (0.8-1.0)**: More creative, diverse outputs

### Cost Optimization

- **Use prompt caching**: Significantly reduces costs on repeated content
- **Choose appropriate context window**: Don't use 128K if 8K suffices
- **Consider moonshot-v1-auto**: Automatically balances cost and performance
- **Leverage cached input pricing**: $0.165 per 1M tokens vs. standard input costs

### Multi-turn Conversations

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

history = [
    {
        "role": "system",
        "content": "You are Kimi, an AI assistant provided by Moonshot AI.",
    }
]


def chat(query, history):
    history.append({"role": "user", "content": query})

    response = client.chat.completions.create(
        model="kimi-latest",
        messages=history,
        temperature=0.6,
    )

    result = response.choices[0].message.content
    history.append({"role": "assistant", "content": result})

    return result


# Example conversation
print(chat("What is the capital of France?", history))
print(chat("What is its population?", history))  # Context maintained
```

## Related Resources

- [Text Generation Guide](en/guides/text-generation.md)
- [Vision Capabilities Guide](en/guides/vision.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Prompt Caching Guide](en/guides/prompt-caching.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Pricing Information](en/pricing.md)
- [News: Moonshot.ai Provider Added](en/news/2025-11-10-moonshot-ai-alibaba-embeddings-added.md)