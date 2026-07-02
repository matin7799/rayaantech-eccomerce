 # OpenAI Models

AvalAI provides access to a wide range of OpenAI models through our unified API. This page details the available OpenAI models, their capabilities, and optimal use cases, focusing on the latest generations.

## Chat, Reasoning, and Multimodal Models

### GPT-5.5

GPT-5.5 is OpenAI's newest flagship model, designed for real work across complex, multi-step tasks. It excels at agentic coding, knowledge work, computer use, and scientific research, delivering state-of-the-art performance while matching GPT-5.4 per-token latency.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 1,000,000 input tokens, 128,000 output tokens |
| Input pricing | $5.00 / 1M tokens |
| Cached input pricing | $0.50 / 1M tokens |
| Output pricing | $30.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |
| Reasoning effort | none (default), low, medium, high, xhigh |
| Strengths | State-of-the-art agentic coding, long-horizon reasoning, tool use, token efficiency |
| Best for | Complex coding, agentic workflows, knowledge work, computer use, scientific research |

**Key Features:**
- **Frontier Performance**: State-of-the-art on Terminal-Bench 2.0 (82.7%), Expert-SWE (73.1%), GDPval (84.9%), OSWorld-Verified (78.7%), and Tau2-bench Telecom (98.0%)
- **Agentic Coding Excellence**: Stronger conceptual clarity, long-horizon planning, and reliable tool use across large codebases
- **Token Efficiency**: Uses significantly fewer tokens than GPT-5.4 to complete the same Codex tasks
- **1M Context Window**: Extended input context for reasoning across massive documents and codebases
- **Full Tool Support**: Function calling, structured outputs, web search, file search, image generation, computer use, MCP

```python
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {"role": "system", "content": "You are an expert AI assistant."},
        {
            "role": "user",
            "content": "Refactor this function into an idiomatic async version and explain the trade-offs.",
        },
    ],
)
```

### GPT-5.4 Pro

GPT-5.4 Pro is OpenAI's most advanced reasoning model, designed for complex professional work. This model uses more compute to think harder and provide consistently better answers.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 1,050,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $30.00 / 1M tokens |
| Cached input pricing | $0.30 / 1M tokens |
| Output pricing | $180.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |
| Reasoning effort | medium, high, xhigh |
| Strengths | Expert-level reasoning, extended thinking, complex problem-solving |
| Best for | Research, advanced mathematics, complex coding, strategic planning |
| Availability | Tier 2, 3, 4, 5 users only |

**Key Features:**
- **Extended Context**: 1.05M token context window for handling massive codebases and documents
- **Reasoning Token Support**: Supports medium, high, and xhigh reasoning effort settings
- **Multi-Turn Interactions**: Designed for multi-turn model interactions before responding
- **Full Tool Support**: Web search, file search, image generation, computer use, MCP support

**Note:** GPT-5.4 Pro is exclusively available through the Responses API (v1/responses) and supports reasoning.effort: medium, high, xhigh. For prompts with >272K input tokens, pricing is 2x input and 1.5x output. Some requests may take several minutes to complete. Use background mode to avoid timeouts.

```python
# GPT-5.4 Pro uses the Responses API
response = client.responses.create(
    model="gpt-5.4-pro",  # Or specific snapshot like gpt-5.4-pro-2026-03-05
    input="Design a comprehensive distributed system architecture with fault tolerance and scalability considerations.",
    reasoning={"effort": "high"},
)
```

### GPT-5.4

GPT-5.4 is OpenAI's frontier model for complex professional work, offering best intelligence at scale for agentic, coding, and professional workflows.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 1,050,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $2.50 / 1M tokens |
| Cached input pricing | $0.25 / 1M tokens |
| Output pricing | $15.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |
| Reasoning effort | none (default), low, medium, high, xhigh |
| Strengths | Highest reasoning, configurable effort, coding excellence, vision support |
| Best for | Complex coding, agentic workflows, multimodal tasks, professional knowledge work |

**Key Features:**
- **Extended Context**: 1.05M token context window
- **Highest Reasoning**: Configurable reasoning effort levels
- **Full Tool Support**: Web search, file search, image generation, code interpreter, computer use, MCP
- **Distillation Support**: Can be used for model distillation
- **Structured Outputs**: Full support for structured outputs and function calling

**Note:** For prompts with >272K input tokens, pricing is 2x input and 1.5x output for the full session.

```python
response = client.chat.completions.create(
    model="gpt-5.4",  # Or specific snapshot like gpt-5.4-2026-03-05
    messages=[
        {"role": "system", "content": "You are an expert AI assistant."},
        {
            "role": "user",
            "content": "Design an algorithm to optimize route planning for a delivery service.",
        },
    ],
)
```

### GPT-5.4 Mini

GPT-5.4 Mini is OpenAI's fast, cost-efficient model optimized for high-volume tasks with strong reasoning capabilities.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 100,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $0.75 / 1M tokens |
| Cached input pricing | $0.075 / 1M tokens |
| Output pricing | $4.50 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |
| Reasoning effort | none (default), low, medium |
| Strengths | Fast responses, cost-effective, strong reasoning, high throughput |
| Best for | High-volume production, cost-sensitive applications, interactive chat |

**Key Features:**
- **Fast Responses**: Optimized for low-latency generation
- **400K Context**: Extended context window for complex tasks
- **Reasoning Support**: Supports none, low, and medium reasoning effort
- **Vision Support**: Can process images as input
- **Cost-Effective**: Ideal for high-volume applications

```python
response = client.chat.completions.create(
    model="gpt-5.4-mini",  # Or specific snapshot
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Summarize the key principles of clean code.",
        },
    ],
)
```

### GPT-5.4 Nano

GPT-5.4 Nano is OpenAI's fastest and most affordable model, designed for simple tasks requiring minimal compute.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 100,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.02 / 1M tokens |
| Output pricing | $1.25 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |
| Reasoning effort | none (default), low |
| Strengths | Fastest responses, lowest cost, high throughput |
| Best for | Simple tasks, classification, basic Q&A, high-volume lightweight workloads |

**Key Features:**
- **Fastest in Class**: Optimized for minimal latency
- **400K Context**: Full extended context window support
- **Lowest Cost**: Most affordable GPT-5.4 series model
- **Vision Support**: Can process images as input
- **High Throughput**: Ideal for batch processing

```python
response = client.chat.completions.create(
    model="gpt-5.4-nano",  # Or specific snapshot
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "What is the capital of France?",
        },
    ],
)
```

### GPT-5.3 Chat

GPT-5.3 Chat is the GPT-5.3 Instant model currently used in ChatGPT, optimized for chat use cases with high intelligence at a competitive price point.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $1.75 / 1M tokens |
| Cached input pricing | $0.175 / 1M tokens |
| Output pricing | $14.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |
| Strengths | High intelligence, chat optimization, function calling, streaming |
| Best for | Conversational AI, chatbots, interactive applications |

**Key Features:**
- **High Intelligence**: Latest improvements for chat use cases
- **Vision Support**: Can process images as input
- **Function Calling**: Full support for function calling and structured outputs
- **Streaming**: Full streaming support

**Note:** We recommend GPT-5.2 for general API usage, but GPT-5.3 Chat is ideal for testing the latest ChatGPT improvements for conversational applications.

```python
response = client.chat.completions.create(
    model="gpt-5.3-chat",  # Or gpt-5.3-chat-latest
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms.",
        },
    ],
)
```

### GPT-5.2 Pro

GPT-5.2 Pro is OpenAI's most advanced reasoning model, producing smarter and more precise responses for difficult problems. It sets new state-of-the-art benchmarks across knowledge work, coding, science, and mathematics.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $21.00 / 1M tokens |
| Output pricing | $168.00 / 1M tokens |
| Strengths | Expert-level reasoning, extended thinking, complex problem-solving, professional knowledge work |
| Best for | Research, advanced mathematics, complex coding, strategic planning, scientific research |
| Availability | Tier 2, 3, 4, 5 users only |
| API Endpoint | v1/responses only |

**Note:** GPT-5.2 Pro is exclusively available through the Responses API (v1/responses) and supports reasoning.effort: medium, high, xhigh. Some requests may take several minutes to complete. Use background mode to avoid timeouts.

```python
# GPT-5.2 Pro uses the Responses API
response = client.responses.create(
    model="gpt-5.2-pro",  # Or specific snapshot like gpt-5.2-pro-2025-12-11
    input="Design a comprehensive distributed system architecture with fault tolerance and scalability considerations.",
    reasoning={"effort": "high"},
)
```

### GPT-5.2

GPT-5.2 is OpenAI's best general-purpose model for coding and agentic tasks across industries with improved general intelligence, instruction following, and multimodality.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $1.75 / 1M tokens |
| Cached input pricing | $0.175 / 1M tokens |
| Output pricing | $14.00 / 1M tokens |
| Strengths | Advanced reasoning, configurable effort, coding excellence, vision support, multimodal I/O |
| Best for | Complex coding, agentic workflows, multimodal tasks, professional knowledge work |

```python
response = client.chat.completions.create(
    model="gpt-5.2",  # Or specific snapshot like gpt-5.2-2025-12-11
    messages=[
        {"role": "system", "content": "You are an expert AI assistant."},
        {
            "role": "user",
            "content": "Design an algorithm to optimize route planning for a delivery service.",
        },
    ],
)
```

### GPT-5.3-Codex

GPT-5.3-Codex is OpenAI's most capable agentic coding model to date. It advances both the frontier coding performance of GPT-5.2-Codex and the reasoning capabilities of GPT-5.2, together in one model, which is also 25% faster. This model was instrumental in creating itself, with the Codex team using early versions to debug its own training and manage deployment.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $1.75 / 1M tokens |
| Cached input pricing | $0.175 / 1M tokens (90% cost reduction) |
| Output pricing | $14.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/responses` |
| Capabilities | Streaming, Function Calling, Structured Outputs, Reasoning Tokens |
| Strengths | State-of-the-art coding, agentic workflows, interactive collaboration |
| Best for | Agentic coding tasks, web development, large codebase refactoring, research acceleration |

**Key Features:**
- **State-of-the-Art Performance**: Sets new industry highs on SWE-Bench Pro (56.8%) and Terminal-Bench 2.0 (77.3%)
- **Reasoning Token Support**: Supports low, medium, high, and xhigh reasoning effort settings
- **Extended Context**: 400K token context window for handling large codebases
- **High Output Capacity**: Up to 128K tokens output for comprehensive code generation
- **Vision Support**: Can process images as input for visual code understanding
- **Interactive Collaboration**: Provides frequent updates during long-running tasks
- **Self-Improving**: First model that was instrumental in creating itself

```python
# GPT-5.3-Codex uses the Responses API
response = client.responses.create(
    model="gpt-5.3-codex",
    input="Refactor this codebase to use dependency injection and implement a comprehensive test suite.",
    reasoning={"effort": "high"},
)
```

### GPT-5.2-Codex

GPT-5.2-Codex is OpenAI's intelligent coding model, optimized for long-horizon, agentic coding tasks in Codex or similar environments.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $1.75 / 1M tokens |
| Cached input pricing | $0.175 / 1M tokens (90% cost reduction) |
| Output pricing | $14.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses`, `v1/realtime` |
| Capabilities | Streaming, Function Calling, Structured Outputs, Reasoning Tokens |
| Strengths | Long-horizon coding, agentic workflows, autonomous code generation |
| Best for | Agentic coding tasks, large codebase refactoring, autonomous development agents |

**Key Features:**
- **Reasoning Token Support**: Supports low, medium, high, and xhigh reasoning effort settings
- **Extended Context**: 400K token context window for handling large codebases
- **High Output Capacity**: Up to 128K tokens output for comprehensive code generation
- **Vision Support**: Can process images as input for visual code understanding
- **Agentic Workflows**: Optimized for autonomous coding agents and iterative development

```python
response = client.chat.completions.create(
    model="gpt-5.2-codex",
    messages=[
        {"role": "system", "content": "You are an expert coding assistant."},
        {
            "role": "user",
            "content": "Refactor this codebase to use dependency injection and implement a comprehensive test suite.",
        },
    ],
    max_tokens=8192,
    temperature=0.6,
)
```

### GPT-5 Pro

GPT-5 Pro is OpenAI's most advanced reasoning model with extended thinking capabilities, designed for complex, expert-level tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 272,000 output tokens |
| Training data | Up to September 30, 2024 |
| Input pricing | $15.00 / 1M tokens |
| Output pricing | $120.00 / 1M tokens |
| Strengths | Expert-level reasoning, extended thinking, complex problem-solving |
| Best for | Research, advanced mathematics, complex coding, strategic planning |
| Availability | Tier 2, 3, 4, 5 users only |
| API Endpoint | v1/responses only |

**Note:** GPT-5 Pro is exclusively available through the Responses API (v1/responses) and uses extended reasoning for comprehensive answers. Some requests may take several minutes to complete.

```python
# GPT-5 Pro uses the Responses API
response = client.responses.create(
    model="gpt-5-pro",  # Or specific snapshot like gpt-5-pro-2025-10-06
    input="Design a comprehensive distributed system architecture with fault tolerance and scalability considerations.",
)
```

### GPT-5.1

GPT-5.1 is OpenAI's flagship model for coding and agentic tasks with configurable reasoning and non-reasoning effort.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Advanced reasoning, configurable effort, coding excellence, vision support |
| Best for | Complex coding, agentic workflows, multimodal tasks, reasoning with images |

```python
response = client.chat.completions.create(
    model="gpt-5.1",  # Or specific snapshot like gpt-5.1-2025-11-13
    messages=[
        {"role": "system", "content": "You are an expert AI assistant."},
        {
            "role": "user",
            "content": "Design an algorithm to optimize route planning for a delivery service.",
        },
    ],
)
```

### GPT-5.1 Chat

GPT-5.1 Chat is a chat-optimized version of GPT-5.1 designed for conversational applications, offering the same advanced capabilities with enhanced optimization for interactive chat experiences.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Chat optimization, advanced reasoning, coding excellence, vision support |
| Best for | Interactive conversations, chatbots, conversational AI applications |

```python
response = client.chat.completions.create(
    model="gpt-5.1-chat",
    messages=[
        {"role": "system", "content": "You are a helpful conversational assistant."},
        {
            "role": "user",
            "content": "Explain the key differences between microservices and monolithic architecture.",
        },
    ],
)
```

### GPT-5

GPT-5 is OpenAI's flagship model for coding, reasoning, and agentic tasks across domains, representing their most advanced AI capabilities.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to September 30, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Best-in-class coding, reasoning, agentic tasks, multimodal capabilities |
| Best for | Complex coding projects, advanced reasoning, agentic workflows, research |

```python
response = client.chat.completions.create(
    model="gpt-5",  # Or specific snapshot like gpt-5-2025-08-07
    messages=[
        {"role": "system", "content": "You are an expert software architect."},
        {
            "role": "user",
            "content": "Design a scalable microservices architecture for an e-commerce platform.",
        },
    ],
)
```

### GPT-5 Mini

GPT-5 Mini is a faster, more cost-efficient version of GPT-5, perfect for well-defined tasks with excellent performance.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to May 30, 2024 |
| Input pricing | $0.25 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens |
| Output pricing | $2.00 / 1M tokens |
| Strengths | Fast, cost-efficient, strong reasoning, good for structured tasks |
| Best for | Well-defined coding tasks, content generation, analysis with precise prompts |

```python
response = client.chat.completions.create(
    model="gpt-5-mini",  # Or specific snapshot like gpt-5-mini-2025-08-07
    messages=[
        {"role": "system", "content": "You are a code optimization expert."},
        {
            "role": "user",
            "content": "Optimize this Python function for better performance and readability.",
        },
    ],
)
```

### GPT-5 Nano

GPT-5 Nano is the fastest, most cost-efficient version of GPT-5, ideal for summarization and classification tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to May 30, 2024 |
| Input pricing | $0.05 / 1M tokens |
| Cached input pricing | $0.005 / 1M tokens |
| Output pricing | $0.40 / 1M tokens |
| Strengths | Very fast, extremely cost-effective, good for simple tasks |
| Best for | Text summarization, classification, content moderation, high-volume tasks |

```python
response = client.chat.completions.create(
    model="gpt-5-nano",  # Or specific snapshot like gpt-5-nano-2025-08-07
    messages=[
        {"role": "system", "content": "You are a text classifier."},
        {
            "role": "user",
            "content": "Classify this customer feedback as positive, negative, or neutral: 'The product works well but could be improved.'",
        },
    ],
)
```

### GPT-5 Chat

GPT-5 Chat points to the GPT-5 snapshot currently used in ChatGPT, providing the same experience as the ChatGPT interface.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to September 29, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | ChatGPT-equivalent experience, high intelligence, conversational |
| Best for | Interactive conversations, general-purpose tasks, ChatGPT-like applications |

```python
response = client.chat.completions.create(
    model="gpt-5-chat-latest",  # Always points to latest ChatGPT version
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Explain quantum computing concepts in simple terms.",
        },
    ],
)
```

### GPT-5 Codex

GPT-5 Codex is a specialized version of GPT-5 optimized for agentic coding tasks, designed specifically for use in Codex environments and advanced programming workflows.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to September 30, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Optimized for agentic coding, reasoning tokens, advanced programming |
| Best for | Agentic coding tasks, complex software development, automated programming |

```python
response = client.chat.completions.create(
    model="gpt-5-codex",
    messages=[
        {"role": "system", "content": "You are an expert programming agent."},
        {
            "role": "user",
            "content": "Create a complete Python class for a binary search tree with insert, search, delete, and traversal methods.",
        },
    ],
)
```
### GPT-5.1 Codex

GPT-5.1 Codex is the latest advanced reasoning model specifically optimized for agentic coding tasks, debugging, and multi-step programming workflows. **This model is only accessible through the v1/responses endpoint.**

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Superior agentic coding, advanced debugging, autonomous agent workflows |
| Best for | Complex code generation, refactoring, autonomous programming agents |
| **Important** | Only works with v1/responses endpoint |

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "gpt-5.1-codex",
    "messages": [
        {
            "role": "user",
            "content": "Create a complete TypeScript implementation of a thread-safe LRU cache with TTL support.",
        }
    ],
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["choices"][0]["message"]["content"])
```

### GPT-5.1 Codex Mini

GPT-5.1 Codex Mini is a lightweight version offering excellent code generation capabilities at a more accessible price point. Ideal for high-volume agentic tasks where cost efficiency matters. **This model is only accessible through the v1/responses endpoint.**

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $0.25 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens |
| Output pricing | $2.00 / 1M tokens |
| Strengths | Cost-efficient coding, fast execution, good for structured tasks |
| Best for | High-volume coding tasks, automated code reviews, batch processing |
| **Important** | Only works with v1/responses endpoint |

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "gpt-5.1-codex-mini",
    "messages": [
        {
            "role": "user",
            "content": "Write a Python function to validate email addresses using regex.",
        }
    ],
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["choices"][0]["message"]["content"])
```

### GPT-5.1-Codex-Max

GPT-5.1-Codex-Max is OpenAI's most intelligent coding model, purpose-built for agentic coding. It is optimized for long-horizon, multi-step programming tasks and autonomous agent workflows.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to September 30, 2024 |
| Input pricing | $1.25 / 1M tokens |
| Cached input pricing | $0.125 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Superior agentic coding, long-horizon tasks, advanced reasoning |
| Best for | Complex multi-step coding, autonomous programming agents, extensive codebase work |
| Modalities | Text input/output, Image input |

```python
response = client.chat.completions.create(
    model="gpt-5.1-codex-max",
    messages=[
        {"role": "system", "content": "You are an expert programming agent."},
        {
            "role": "user",
            "content": "Create a complete distributed task queue system with worker management, task prioritization, and failure recovery.",
        },
    ],
)
```

### o3-pro

o3-pro is OpenAI's most advanced reasoning model for complex problem-solving and analysis, offering the highest level of reasoning capabilities.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 200,000 input tokens, 100,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $15.00 / 1M tokens |
| Output pricing | $60.00 / 1M tokens |
| Strengths | Highest-level reasoning, complex problem-solving, advanced analysis |
| Best for | Most complex reasoning tasks, professional analysis, research applications |

```python
response = client.chat.completions.create(
    model="o3-pro",
    messages=[
        {"role": "system", "content": "You are an expert problem solver."},
        {
            "role": "user",
            "content": "Analyze this complex mathematical proof and provide detailed improvements.",
        },
    ],
)
```

### o3-deep-research

o3-deep-research is our most powerful deep research model designed to tackle complex, multi-step research tasks. It can search and synthesize information from across the internet as well as from your own data. **This model is only accessible through the v1/responses endpoint and requires tools to be selected.**

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 200,000 input tokens, 100,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $10.00 / 1M tokens |
| Cached input pricing | $2.50 / 1M tokens |
| Output pricing | $40.00 / 1M tokens |
| Strengths | Deep research capabilities, internet search, multi-step analysis, reasoning tokens |
| Best for | Complex research tasks, information synthesis, multi-step investigations |
| **Important** | Only works with v1/responses endpoint and requires tools |

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "o3-deep-research",
    "tools": [{"type": "web_search", "search_context_size": "medium"}],
    "input": "Research the latest developments in quantum computing and their implications",
}

response = requests.post(url, headers=headers, json=data)
```

#### Web Search with Domain Filtering

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "o3-deep-research",
    "tools": [
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "arxiv.org",
                    "nature.com",
                    "science.org",
                    "ieee.org",
                ]
            },
        }
    ],
    "input": "Research quantum computing breakthroughs from academic sources",
}

response = requests.post(url, headers=headers, json=data)
```

### o3

o3 is OpenAI's most powerful reasoning model, setting a new standard for math, science, coding, and visual reasoning tasks. It excels at technical writing and instruction-following.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 200,000 input tokens, 100,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $10.00 / 1M tokens |
| Output pricing | $40.00 / 1M tokens |
| Strengths | Advanced reasoning, multi-step problems, analysis across text, code, and images |
| Best for | Complex reasoning tasks, technical problem-solving requiring deep analysis |

```python
response = client.chat.completions.create(
    model="o3",  # Or specific snapshot like o3-2025-04-16
    messages=[
        {"role": "system", "content": "You are an expert problem solver."},
        {
            "role": "user",
            "content": "Analyze this mathematical proof and identify any errors or improvements.",
        },
    ],
)
```

### o4-mini-deep-research

o4-mini-deep-research is our faster, more affordable deep research model—ideal for tackling complex, multi-step research tasks. It can search and synthesize information from across the internet as well as from your own data. **This model is only accessible through the v1/responses endpoint and requires tools to be selected.**

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 200,000 input tokens, 100,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.50 / 1M tokens |
| Output pricing | $8.00 / 1M tokens |
| Strengths | Fast, affordable deep research, internet search, reasoning tokens |
| Best for | Cost-effective research tasks, information synthesis, multi-step analysis |
| **Important** | Only works with v1/responses endpoint and requires tools |

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "o4-mini-deep-research",
    "tools": [{"type": "web_search", "search_context_size": "medium"}],
    "input": "Research current trends in renewable energy technology",
}

response = requests.post(url, headers=headers, json=data)
```

#### Web Search with User Location

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "o4-mini-deep-research",
    "tools": [
        {
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "country": "US",
                "city": "San Francisco",
                "region": "California",
                "timezone": "America/Los_Angeles",
            },
        }
    ],
    "input": "Find renewable energy companies near me",
}

response = requests.post(url, headers=headers, json=data)
```

### o4-mini

o4-mini is OpenAI's latest small o-series model, optimized for fast, effective reasoning with exceptionally efficient performance in coding and visual tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 200,000 input tokens, 100,000 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $1.10 / 1M tokens |
| Output pricing | $4.40 / 1M tokens |
| Strengths | Fast, cost-effective reasoning, good for visual tasks and coding |
| Best for | Fast reasoning, coding tasks, visual understanding with cost efficiency |

```python
response = client.chat.completions.create(
    model="o4-mini",  # Or specific snapshot like o4-mini-2025-04-16
    messages=[
        {"role": "system", "content": "You are a coding assistant."},
        {
            "role": "user",
            "content": "Write a function to check if a string is a palindrome.",
        },
    ],
)
```

### ~~GPT-4.5 Preview~~ - **Deprecated**

~~GPT-4.5~~ is OpenAI's an advanced preview model, offering state-of-the-art performance across text, code, vision, and reasoning.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Assumed latest available |
| Input pricing | $75.00 / 1M tokens |
| Output pricing | $150.00 / 1M tokens |
| Strengths | Top-tier reasoning, multimodal understanding, complex task solving |
| Best for | Cutting-edge applications requiring the highest level of capability, research |

### GPT-4o

GPT-4o ("omni") is OpenAI's flagship multimodal model, balancing high capability with optimized cost and speed.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Up to late 2023 (assumed) |
| Input pricing | $2.50 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Strengths | Strong performance across text, code, vision; web search capability |
| Best for | Complex reasoning, multimodal applications, creative content generation, general tasks |

```python
response = client.chat.completions.create(
    model="gpt-4o",  # Or specific snapshot like gpt-4o-2024-08-06
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."},
    ],
)
```
### GPT-4o Search Preview

A variant of GPT-4o optimized for tasks involving web search integration.

| Feature | Details |
| ------------------- | ----------------------------------------------------------------------- |
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Up to late 2023 (assumed), with enhanced search integration |
| Input pricing | (Check provider details via AvalAI) |
| Output pricing | (Check provider details via AvalAI) |
| Max Req/min | 50.0 |
| Max Tokens/min | 100,000.0 |
| Strengths | Integrates web search results directly into responses |
| Best for | Questions requiring up-to-date information, research tasks |
| Model IDs | `gpt-4o-search-preview`, `gpt-4o-search-preview-2025-03-11` |

```python
response = client.chat.completions.create(
    model="gpt-4o-search-preview",  # Or specific snapshot
    messages=[
        {
            "role": "user",
            "content": "What are the latest developments in fusion energy research?",
        },
    ],
)
```


### GPT-4o mini

GPT-4o mini offers intelligence comparable to GPT-4 Turbo at a significantly lower price and higher speed, including multimodal capabilities.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Up to late 2023 (assumed) |
| Input pricing | $0.15 / 1M tokens |
| Output pricing | $0.60 / 1M tokens |
| Strengths | Very fast, highly cost-effective, strong general capabilities, vision, web search |
| Best for | High-throughput tasks, chatbots, summarization, content moderation, simple analysis |

```python
response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[
        {"role": "system", "content": "You are a customer support chatbot."},
        {"role": "user", "content": "What are your return policies?"},
    ],
)
```

### GPT-4.1

GPT-4.1 is OpenAI's flagship model for complex tasks, well suited for problem solving across domains.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 1,047,576 input tokens, 32,768 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $2.00 / 1M tokens |
| Output pricing | $8.00 / 1M tokens |
| Strengths | Strong problem-solving capabilities across domains |
| Best for | Complex tasks requiring deep understanding and reasoning |

```python
response = client.chat.completions.create(
    model="gpt-4.1",  # Or specific snapshot like gpt-4.1-2025-04-14
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Analyze the implications of recent advances in quantum computing.",
        },
    ],
)
```

### GPT-4.1-mini

GPT-4.1-mini provides a balance between intelligence, speed, and cost that makes it an attractive model for many use cases.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 1,047,576 input tokens, 32,768 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $0.40 / 1M tokens |
| Output pricing | $1.60 / 1M tokens |
| Strengths | Balanced performance, good speed and cost efficiency |
| Best for | General-purpose tasks requiring good performance at moderate cost |

```python
response = client.chat.completions.create(
    model="gpt-4.1-mini",  # Or specific snapshot like gpt-4.1-mini-2025-04-14
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Provide a summary of the latest climate change research.",
        },
    ],
)
```

### GPT-4.1-nano

GPT-4.1-nano is the fastest, most cost-effective GPT-4.1 model, offering good performance for everyday tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 1,047,576 input tokens, 32,768 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $0.10 / 1M tokens |
| Output pricing | $0.40 / 1M tokens |
| Strengths | Very fast, highly cost-effective |
| Best for | High-volume applications, simple tasks, content generation |

```python
response = client.chat.completions.create(
    model="gpt-4.1-nano",  # Or specific snapshot like gpt-4.1-nano-2025-04-14
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a short blog post about sustainable living.",
        },
    ],
)
```

### GPT-4o mini Search Preview

A variant of GPT-4o mini optimized for tasks involving web search integration, offering speed and cost-effectiveness.

| Feature | Details |
| ------------------- | ----------------------------------------------------------------------- |
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Up to late 2023 (assumed), with enhanced search integration |
| Input pricing | (Check provider details via AvalAI) |
| Output pricing | (Check provider details via AvalAI) |
| Max Req/min | 50.0 |
| Max Tokens/min | 100,000.0 |
| Strengths | Fast and cost-effective web search integration |
| Best for | High-throughput queries needing recent information |
| Model IDs | `gpt-4o-mini-search-preview`, `gpt-4o-mini-search-preview-2025-03-11` |

```python
response = client.chat.completions.create(
    model="gpt-4o-mini-search-preview",  # Or specific snapshot
    messages=[
        {"role": "user", "content": "Summarize today's top news headlines."},
    ],
)
```

### O1

O1 is a high-intelligence reasoning model focused on complex problem-solving and agency tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 200,000 input tokens, 100,000 output tokens |
| Training data | Assumed latest available |
| Input pricing | $15.00 / 1M tokens |
| Output pricing | $60.00 / 1M tokens |
| Strengths | Advanced reasoning, step-by-step task execution, high intelligence |
| Best for | Complex reasoning, agentic workflows, problem-solving requiring deep analysis |

```python
response = client.chat.completions.create(
    model="o1",  # Or specific snapshot like o1-2024-12-17
    messages=[
        {"role": "system", "content": "You are a logical reasoning expert."},
        {
            "role": "user",
            "content": "Analyze the logical structure of this argument and identify any fallacies.",
        },
    ],
)
```

### O1 mini

O1 mini provides strong reasoning capabilities optimized for speed and cost, suitable for many reasoning-intensive tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 65,536 output tokens |
| Training data | Assumed latest available |
| Input pricing | $1.10 / 1M tokens |
| Output pricing | $4.40 / 1M tokens |
| Strengths | Fast, cost-effective reasoning, good for step-by-step tasks |
| Best for | Mid-complexity reasoning, structured data extraction, task decomposition |

```python
response = client.chat.completions.create(
    model="o1-mini",  # Or specific snapshot like o1-mini-2024-09-12
    messages=[
        {"role": "system", "content": "You assist with planning complex tasks."},
        {
            "role": "user",
            "content": "Break down the steps needed to organize a large conference.",
        },
    ],
)
```

### GPT-4 Turbo

GPT-4 Turbo was a previous flagship model, now largely superseded by GPT-4o but still available. It offers strong capabilities with a large context window.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 tokens input, 4,096 output tokens |
| Training data | Up to December 2023 |
| Input pricing | $10.00 / 1M tokens |
| Output pricing | $30.00 / 1M tokens |
| Strengths | Strong reasoning, instruction following, vision capabilities |
| Best for | Legacy applications, tasks requiring GPT-4 level quality where GPT-4o is not suitable |

```python
response = client.chat.completions.create(
    model="gpt-4.1",  # Or specific snapshot like gpt-4.1-2025-04-14
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a detailed analysis of renewable energy trends.",
        },
    ],
)
```

### GPT-3.5 Turbo

GPT-3.5 Turbo is a highly cost-effective model optimized for speed, suitable for a wide range of simpler tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 16,385 input tokens, 4,096 output tokens |
| Training data | Up to September 2021 |
| Input pricing | $1.50 / 1M tokens |
| Output pricing | $2.00 / 1M tokens |
| Strengths | Very fast, extremely cost-effective, good for basic tasks |
| Best for | Simple chatbots, content generation, summarization, classification |

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",  # Or specific snapshot like gpt-3.5-turbo-1106
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Summarize the key features of machine learning."},
    ],
)
```

## Open-Source Models

### GPT-OSS-120B

OpenAI's most powerful open-weight model, designed for high-end reasoning tasks and fitting within a single H100 GPU (117B parameters with 5.1B active parameters).

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 131,072 input tokens, 131,072 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $0.30 / 1M tokens (Azure AI) |
| Output pricing | $2.50 / 1M tokens (Azure AI) |
| Provider | Azure AI |
| License | Apache 2.0 |
| Strengths | Configurable reasoning effort, full chain-of-thought, fine-tunable, agentic capabilities |
| Best for | Complex reasoning tasks, local deployment, specialized use cases requiring customization |

```python
response = client.chat.completions.create(
    model="gpt-oss-120b",
    messages=[
        {"role": "system", "content": "You are an expert problem solver."},
        {
            "role": "user",
            "content": "Analyze this complex algorithmic problem and provide a step-by-step solution.",
        },
    ],
)
```

### GPT-OSS-120B (AWS Bedrock)

The same powerful 120B parameter model available through AWS Bedrock with competitive pricing.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 131,072 input tokens, 131,072 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $0.15 / 1M tokens (AWS Bedrock) |
| Output pricing | $0.60 / 1M tokens (AWS Bedrock) |
| Provider | AWS Bedrock |
| License | Apache 2.0 |
| Strengths | More cost-effective pricing, configurable reasoning effort, full chain-of-thought |
| Best for | Cost-sensitive applications requiring high-end reasoning capabilities |

```python
response = client.chat.completions.create(
    model="openai.gpt-oss-120b-1:0",
    messages=[
        {"role": "system", "content": "You are a research assistant."},
        {
            "role": "user",
            "content": "Conduct a thorough analysis of the given research paper and identify key insights.",
        },
    ],
)
```

### GPT-OSS-20B

A medium-sized open-weight model optimized for low latency and local deployment (21B parameters with 3.6B active parameters).

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 131,072 input tokens, 131,072 output tokens |
| Training data | Up to May 31, 2024 |
| Input pricing | $0.07 / 1M tokens (AWS Bedrock) |
| Output pricing | $0.30 / 1M tokens (AWS Bedrock) |
| Provider | AWS Bedrock |
| License | Apache 2.0 |
| Strengths | Fast inference, cost-effective, configurable reasoning effort, fine-tunable |
| Best for | Low latency applications, high-volume processing, local deployment scenarios |

```python
response = client.chat.completions.create(
    model="openai.gpt-oss-20b-1:0",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Summarize this document and extract the key action items.",
        },
    ],
)
```

### Key Features of Open-Source Models

All OpenAI open-source models share these powerful capabilities:

- **Permissive Apache 2.0 License**: Build freely without copyleft restrictions or patent risk
- **Configurable Reasoning Effort**: Adjust reasoning effort (low, medium, high) based on your needs
- **Full Chain-of-Thought**: Complete access to the model's reasoning process for debugging and trust
- **Fine-Tunable**: Customize models to your specific use case through parameter fine-tuning
- **Agentic Capabilities**: Native support for function calling, web browsing, Python code execution, and structured outputs


## Video Generation Models

### Sora 2

Sora 2 is OpenAI's video generation model optimized for speed and flexibility, ideal for rapid iteration and content exploration. **Accessible through the v1/videos endpoint only.**

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Resolution options | 720x1280 (portrait), 1280x720 (landscape) |
| Duration | 4-8+ seconds |
| Pricing | $0.10 per second of generated video |
| Strengths | Fast generation, cost-effective, good quality for prototyping |
| Best for | Social media content, rapid iteration, prototypes, concepting |
| Model ID | `sora-2` |
| **Important** | Only works with v1/videos endpoint |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create a video generation job
video = client.videos.create(
    model="sora-2",
    prompt="A calico cat playing a piano on stage, cinematic lighting",
    size="720x1280",
    seconds=4,
)

print(f"Video job created: {video.id}")

# Poll for completion
video_status = client.videos.retrieve(video.id)
while video_status.status in ["queued", "in_progress"]:
    time.sleep(10)
    video_status = client.videos.retrieve(video.id)
    print(f"Status: {video_status.status}, Progress: {video_status.progress}%")

# Download completed video
if video_status.status == "completed":
    content = client.videos.download_content(video.id, variant="video")
    content.write_to_file("output.mp4")
```

**Key Features:**
- **Asynchronous Generation**: Jobs are processed asynchronously with status polling or webhook notifications
- **Image References**: Provide input images to guide video generation
- **Remix Capability**: Iterate on completed videos with targeted adjustments
- **Supporting Assets**: Download thumbnails and spritesheets alongside videos

### Sora 2 Pro

Sora 2 Pro is OpenAI's premium video generation model designed for production-quality output with enhanced visual fidelity. **Accessible through the v1/videos endpoint only.**

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Resolution options | 720x1280, 1280x720, 1024x1792, 1792x1024 |
| Duration | 4-8+ seconds |
| Pricing | $0.30/second (720x1280, 1280x720), $0.50/second (1024x1792, 1792x1024) |
| Strengths | High-quality output, cinematic results, stable motion, detailed rendering |
| Best for | Marketing assets, cinematic footage, production-quality content |
| Model ID | `sora-2-pro` |
| **Important** | Only works with v1/videos endpoint |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create a high-quality video
video = client.videos.create(
    model="sora-2-pro",
    prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead, cinematic quality",
    size="1280x720",
    seconds=8,
)

# Use webhooks or polling to monitor completion
# Once completed, download the video
content = client.videos.download_content(video.id)
content.write_to_file("professional_video.mp4")
```

**Advanced Features:**
- **Higher Resolution Support**: Includes 1024x1792 and 1792x1024 for ultra-high-quality output
- **Enhanced Motion Stability**: Improved camera movement and object tracking
- **Cinematic Quality**: Superior lighting, color grading, and visual consistency
- **Longer Generation Time**: Takes more time but produces polished results

For detailed video generation workflows, see the [Video Generation Guide](en/guides/generate-videos-using-sora.md).

## Image Generation Models

### GPT-Image-2

GPT-Image-2 is OpenAI's next-generation image generation model (ChatGPT Images 2.0), delivering greater precision and control, stronger multilingual text rendering, stylistic sophistication and realism, and support for flexible aspect ratios. It leverages thinking mode to research, transform inputs, and produce cohesive, end-to-end visual assets.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Model ID | `gpt-image-2` |
| Aliases | `gpt-image-2-2026-04-21` |
| Supported Endpoints | `v1/images/generations`, `v1/images/edits` |
| Input | Text, Image |
| Output | Image, Text |
| Text Input pricing | $5.00 / 1M tokens |
| Text Cached Input pricing | $1.25 / 1M tokens |
| Text Output pricing | $10.00 / 1M tokens |
| Image Input pricing | $8.00 / 1M tokens |
| Image Cached Input pricing | $2.00 / 1M tokens |
| Image Output pricing | $30.00 / 1M tokens |
| Strengths | Greater precision & control, multilingual text rendering, stylistic sophistication, flexible aspect ratios, thinking mode |
| Best for | Professional design, editorial posters, global typography, stylized illustrations, complex visual storytelling |

**Key Capabilities:**
- **Greater Precision & Control** — significantly improved accuracy and adherence to prompt details
- **Multilingual Text Rendering** — strong performance across Japanese, Arabic, Korean, Devanagari, Cyrillic, Bengali, Greek, Chinese, and Latin scripts
- **Stylistic Sophistication & Realism** — higher fidelity across photography, illustration, manga, pixel art, and other styles
- **Flexible Aspect Ratios** — Horizontal, Square, and Vertical formats for banners, posts, and mobile screens
- **Thinking Mode** — uses reasoning to research, transform inputs, and produce cohesive, end-to-end visual assets
- **Image Editing** — supports both `v1/images/generations` and `v1/images/edits` endpoints

```python
response = client.images.generate(
    model="gpt-image-2",
    prompt='A modernist editorial poster titled "Typography" celebrating global scripts including Japanese, Arabic, Korean, and Latin letterforms, in red, blue, and black tones.',
    size="1024x1024",
    n=1,
)
```

### GPT-Image-1

GPT-Image-1 is OpenAI's latest image generation model, designed for high-quality, photorealistic image creation with exceptional prompt following.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Sizes | 1024x1024, 1024x1792, 1792x1024, 1792x1792 |
| Quality options | Low, Medium, High |
| Pricing | $0.011 / image (Low), $0.042 / image (Medium), $0.167 / image (High) |
| Strengths | Photorealistic images, strong prompt adherence, consistent style |
| Best for | Creating high-quality images from detailed text descriptions |

```python
response = client.images.generate(
    model="gpt-image-1",
    prompt="A photorealistic image of a futuristic city with flying cars and tall skyscrapers covered in vegetation, sunset lighting, highly detailed",
    size="1024x1024",
    quality="medium",
    n=1,
    response_format="url",  # or b64_json
)
```
### GPT-Image-1.5

GPT-Image-1.5 is OpenAI's latest image generation model, delivering major improvements in realism, accuracy, and editability compared to GPT-Image-1. It supports high-fidelity photorealism, text rendering, style transfer, and complex structured visuals like infographics.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Supported Endpoints | `v1/images/generations`, `v1/images/edits` |
| Input | Text, Image |
| Output | Image, Text |
| Quality options | Low, Medium, High |
| Text Input pricing | $5.00 / 1M tokens |
| Text Cached Input pricing | $2.00 / 1M tokens |
| Text Output pricing | $32.00 / 1M tokens |
| Image Input pricing | $8.00 / 1M tokens |
| Image Output pricing | $32.00 / 1M tokens |
| Strengths | State-of-the-art photorealism, text rendering in images, style transfer, infographics |
| Best for | Professional design, marketing creatives, infographics, product mockups, identity-preserved editing |

**Key Capabilities:**
- **High-fidelity photorealism** with natural lighting, accurate materials, and rich color rendering
- **Reliable text rendering** with crisp lettering, consistent layout, and strong contrast inside images
- **Complex structured visuals** including infographics, diagrams, and multi-panel compositions
- **Precise style control and style transfer** with minimal prompting
- **Robust facial and identity preservation** for edits, character consistency, and multi-step workflows

```python
# Image Generation
response = client.images.generate(
    model="gpt-image-1.5",
    prompt="A detailed infographic explaining how a coffee machine works, with labeled components and flow diagram",
    size="1024x1024",
    quality="high",
    n=1,
    response_format="b64_json",
)

# Image Editing
with open("input_image.png", "rb") as image_file:
    response = client.images.edit(
        model="gpt-image-1.5",
        image=image_file,
        prompt="Make it look like a winter evening with snowfall",
        size="1024x1024",
    )
```

### GPT-Image-1-Mini

GPT-Image-1-Mini is a cost-efficient version of GPT-Image-1, offering faster and more affordable image generation while maintaining high-quality, photorealistic output. Available for Tier 3, 4, and 5 users.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Sizes | 1024x1024, 1024x1536, 1536x1024 |
| Quality options | Low, Medium, High |
| Pricing | $0.011 / image (Low 1024x1024), $0.042 / image (Medium 1024x1024), $0.036 / image (High 1024x1024) |
| Token pricing | Input: $5.00/1M, Cached: $1.25/1M, Output: $40.00/1M |
| Strengths | Cost-effective, fast generation, photorealistic images, strong prompt adherence |
| Best for | High-volume image generation, prototyping, cost-sensitive applications |
| Availability | Tier 3, 4, 5 users |

```python
response = client.images.generate(
    model="gpt-image-1-mini",
    prompt="A photorealistic image of a mountain landscape with a lake reflecting the sunset",
    size="1024x1024",
    quality="high",
    n=1,
    response_format="url",  # or b64_json
)
```

## Embedding Models

### text-embedding-3-large

OpenAI's most capable embedding model for tasks requiring nuanced understanding.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Dimensions | 3072 (default) or configurable |
| Max input tokens | 8191 |
| Pricing | $0.13 / 1M tokens |
| Strengths | Highest quality embeddings for semantic search, clustering, classification |
| Best for | Applications demanding maximum accuracy in text similarity and understanding |

```python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="The food was delicious and the service was excellent.",
)
```

### text-embedding-3-small

A highly efficient embedding model offering a great balance of performance and cost.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Dimensions | 1536 (default) or configurable |
| Max input tokens | 8191 |
### GPT-4o Transcribe & GPT-4o mini Transcribe

Specialized variants of GPT-4o and GPT-4o mini fine-tuned for high-accuracy speech-to-text transcription tasks. These offer potentially improved accuracy or efficiency over the general Whisper model for transcription.

| Feature | Details (Applies to both unless noted) |
| ------------------- | ----------------------------------------------------------------------- |
| Input formats | mp3, mp4, mpeg, mpga, m4a, wav, webm |
| Max file size | (Check provider details - likely similar to Whisper) |
| Pricing | (Check provider details via AvalAI) |
| Max Req/min | 500.0 |
| Max Tokens/min | 200,000.0 |
| Strengths | Optimized for transcription accuracy and/or efficiency |
| Best for | High-quality transcription needs, potentially lower latency/cost than Whisper |
| Model IDs | `gpt-4o-transcribe`, `gpt-4o-mini-transcribe` |

```python
# Example using GPT-4o Transcribe
with open("meeting_audio.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="gpt-4o-transcribe",  # Or gpt-4o-mini-transcribe
        file=audio_file,
        # Additional parameters like language might be supported
    )

# Example using GPT-4o Mini Transcribe
with open("short_clip.wav", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="gpt-4o-mini-transcribe",
        file=audio_file,
    )
```
### GPT-4o Transcribe Diarize

Enhanced version of [`gpt-4o-transcribe`](#gpt-4o-transcribe--gpt-4o-mini-transcribe) with advanced speaker diarization capabilities, enabling accurate identification and separation of multiple speakers in audio recordings.

| Feature | Details |
| ------------------- | ----------------------------------------------------------------------- |
| Input formats | mp3, mp4, mpeg, mpga, m4a, wav, webm |
| Max file size | (Check provider details - likely similar to Whisper) |
| Text input pricing | $2.50 / 1M tokens |
| Audio input pricing | $6.00 / 1M tokens |
| Cached input pricing | $1.50 / 1M tokens |
| Output pricing | $10.00 / 1M tokens |
| Max Req/min | 500.0 |
| Max Tokens/min | 200,000.0 |
| Strengths | Speaker diarization, fast transcription (~15s for 10min audio), 100+ languages |
| Best for | Meeting transcription, interview analysis, multi-speaker content, customer service calls |
| Model ID | `gpt-4o-transcribe-diarize` |

?> **Note:** This model provides the same pricing as `gpt-4o-transcribe` while offering enhanced speaker identification capabilities through the `verbose_json` response format.
```python
# Example using GPT-4o Transcribe Diarize with speaker identification
with open("meeting_audio.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="gpt-4o-transcribe-diarize",
        file=audio_file,
        response_format="verbose_json",  # Required for speaker diarization
    )

# Access speaker information from segments
for segment in transcription.segments:
    print(f"{segment.speaker}: {segment.text}")
    # Output example:
    # SPEAKER_1: Hello, welcome to the meeting.
    # SPEAKER_2: Thank you, glad to be here.
```

**Use Cases:**
- **Meeting Analysis**: Automatically transcribe and attribute speaker contributions for meeting summaries
- **Customer Service**: Analyze customer-agent interactions with accurate speaker attribution
- **Content Production**: Transcribe interviews and podcasts with speaker labels for post-production
- **Compliance Monitoring**: Track individual participation and speaking time in recorded conversations

```

| Pricing | $0.02 / 1M tokens |
| Strengths | Excellent performance-to-cost ratio |
| Best for | Most embedding use cases, including large-scale search and retrieval |

```python
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="The food was delicious and the service was excellent.",
)
```

### text-embedding-ada-002

Legacy embedding model, primarily for backward compatibility. `text-embedding-3-small` is recommended for new applications.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Dimensions | 1536 |
| Max input tokens | 8191 |
| Pricing | $0.10 / 1M tokens |
| Strengths | Consistent performance for legacy systems |
| Best for | Maintaining compatibility with systems built on `ada-002` |

```python
response = client.embeddings.create(
    model="text-embedding-ada-002",
    input="The food was delicious and the service was excellent.",
)
```

## Audio Models

### GPT-Audio-1.5

GPT-Audio-1.5 is OpenAI's best voice model for audio in, audio out with Chat Completions. It's optimized for real-time interaction with low latency and natural-sounding speech, making it ideal for voice agents and conversational AI applications.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 tokens |
| Max output tokens | 16,384 tokens |
| Knowledge cutoff | September 30, 2024 |
| Text input pricing | $2.50 / 1M tokens |
| Cached input pricing | $1.25 / 1M tokens |
| Text output pricing | $10.00 / 1M tokens |
| Audio input pricing | $32.00 / 1M tokens |
| Audio output pricing | $64.00 / 1M tokens |
| Input modalities | Text, Audio |
| Output modalities | Text, Audio |
| Strengths | Low latency, natural speech, improved instruction following, function calling |
| Best for | Voice agents, real-time translators, interactive assistants |
| Model IDs | `gpt-audio-1.5` |

**Key Features:**
- **Low Latency & High Speed**: Optimized for real-time interaction
- **Natural Sounding Speech**: Smoother, more conversational audio with enhanced pacing and prosody
- **Improved Instruction Following**: Better alignment with user and developer instructions
- **Function Calling**: Support for interactive, tool-driven applications
- **Multiple Voice Options**: Clear and consistent audio across different voices

```python
response = client.chat.completions.create(
    model="gpt-audio-1.5",
    messages=[
        {
            "role": "user",
            "content": "Tell me a short story about a robot learning to paint.",
        }
    ],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)

# Access audio data
audio_data = response.choices[0].message.audio.data
transcript = response.choices[0].message.audio.transcript
```

### GPT Audio

GPT Audio is OpenAI's generally available audio model for conversational AI applications. It supports both audio and text inputs and outputs through the Chat Completions API.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 tokens |
| Max output tokens | 16,384 tokens |
| Training data | Up to October 1, 2023 |
| Text input pricing | $2.50 / 1M tokens |
| Cached input pricing | $1.25 / 1M tokens |
| Text output pricing | $10.00 / 1M tokens |
| Audio input pricing | $32.00 / 1M tokens |
| Audio output pricing | $64.00 / 1M tokens |
| Strengths | Native audio processing, multimodal conversations, function calling |
| Best for | Voice assistants, conversational apps, audio-based interactions |
| Model IDs | `gpt-audio`, `gpt-audio-2025-08-28` |

```python
response = client.chat.completions.create(
    model="gpt-audio",
    messages=[{"role": "user", "content": "Tell me about artificial intelligence."}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)

# Access audio data
audio_data = response.choices[0].message.audio.data
transcript = response.choices[0].message.audio.transcript
```

### GPT Audio Mini

GPT Audio Mini is a cost-efficient version of GPT Audio, ideal for high-volume audio processing applications.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 tokens |
| Max output tokens | 16,384 tokens |
| Training data | Up to October 1, 2023 |
| Text input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.30 / 1M tokens |
| Text output pricing | $2.40 / 1M tokens |
| Audio input pricing | $10.00 / 1M tokens |
| Audio output pricing | $20.00 / 1M tokens |
| Strengths | Cost-effective audio processing, multimodal, function calling |
| Best for | High-volume audio applications, cost-sensitive voice interactions |
| Model IDs | `gpt-audio-mini`, `gpt-audio-mini-2025-10-06` |

```python
response = client.chat.completions.create(
    model="gpt-audio-mini",
    messages=[{"role": "user", "content": "What is machine learning?"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "alloy"},
)
```

**Legacy Audio Models:**

For backwards compatibility, the following preview models remain available:
- `gpt-4o-audio-preview`
- `gpt-4o-mini-audio-preview`

**Audio Format Support:**
- Output formats: `mp3`, `wav`, `pcm16`, `opus`, `aac`, `flac`
- Voice options: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`


### Whisper

Whisper is a versatile speech-to-text model for transcription and translation.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Input formats | mp3, mp4, mpeg, mpga, m4a, wav, webm |
| Max file size | 25 MB |
| Pricing | $0.006 / minute (rounded to nearest second) |
| Strengths | Accurate transcription and translation across many languages |
| Best for | Transcribing meetings, interviews, audio notes; translating spoken content |

```python
with open("audio.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="whisper-1", file=audio_file
    )
```

### GPT-4o mini TTS

GPT-4o mini TTS is a text-to-speech model powered by GPT-4o mini, providing natural-sounding speech synthesis.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Max input tokens | 2,000 |
| Input pricing | $0.60 / 1M tokens |
| Output pricing | $12.00 / 1M tokens (audio) |
| Strengths | Fast, high-quality speech synthesis |
| Best for | Applications requiring natural-sounding voice output |

```python
response = client.audio.speech.create(
    model="gpt-4o-mini-tts",
    voice="nova",  # Assuming it supports the same voices as standard TTS
    input="This is GPT-4o mini TTS converting text to natural-sounding speech.",
)
```

### TTS (Text-to-Speech)

TTS models convert text into natural-sounding human speech.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Models | `tts-1` (Real-time optimized), `tts-1-hd` (Quality optimized) |
| Voices | alloy, echo, fable, onyx, nova, shimmer |
| Pricing | $15.00 / 1M characters (TTS), $30.00 / 1M characters (TTS HD) |
| Strengths | High-quality, natural-sounding speech synthesis |
| Best for | Voice generation for applications, accessibility tools, content creation |

```python
response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input="Hello world! This is a text-to-speech model speaking.",
)
```

## Web Search Capabilities

OpenAI models support advanced web search capabilities that allow them to access up-to-date information from the internet and provide answers with sourced citations. Web search is available through the Responses API using the [`web_search`](en/guides/tools-web-search.md) tool.

### Types of Web Search

There are three main types of web search available with OpenAI models:

1. **Non-reasoning web search**: The model sends the user's query to the web search tool, which returns the response based on top results. There's no internal planning and the model simply passes along the search tool's responses. This method is fast and ideal for quick lookups.

2. **Agentic search with reasoning models**: The model actively manages the search process. It can perform web searches as part of its chain of thought, analyze results, and decide whether to keep searching. This flexibility makes agentic search well suited to complex workflows, but searches take longer than quick lookups.

3. **Deep research**: A specialized, agent-driven method for in-depth, extended investigations by reasoning models. The model conducts web searches as part of its chain of thought, often tapping into hundreds of sources. Deep research can run for several minutes and is best used with background mode.

### Web Search Tool Configuration

#### Basic Web Search

```python
import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "gpt-5",
    "tools": [{"type": "web_search"}],
    "input": "What was a positive news story from today?",
}

response = requests.post(url, headers=headers, json=data)
```

#### Domain Filtering

Domain filtering lets you limit results to a specific set of domains. You can set an allow-list of up to 20 URLs:

```python
data = {
    "model": "gpt-5",
    "tools": [
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "pubmed.ncbi.nlm.nih.gov",
                    "clinicaltrials.gov",
                    "www.who.int",
                    "www.cdc.gov",
                    "www.fda.gov",
                ]
            },
        }
    ],
    "input": "Please perform a web search on how semaglutide is used in the treatment of diabetes.",
}
```

#### User Location

To refine search results based on geography, you can specify an approximate user location:

```python
data = {
    "model": "o4-mini",
    "tools": [
        {
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "country": "GB",
                "city": "London",
                "region": "London",
                "timezone": "Europe/London",
            },
        }
    ],
    "input": "What are the best restaurants around Granary Square?",
}
```

#### Sources Field

To view all URLs retrieved during a web search, use the `sources` field:

```python
data = {
    "model": "gpt-5",
    "reasoning": {"effort": "low"},
    "tools": [
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "pubmed.ncbi.nlm.nih.gov",
                    "clinicaltrials.gov",
                    "www.who.int",
                ]
            },
        }
    ],
    "tool_choice": "auto",
    "include": ["web_search_call.action.sources"],
    "input": "Please perform a web search on how semaglutide is used in the treatment of diabetes.",
}
```

### Response Format and Citations

Model responses that use the web search tool include two parts:

1. **A `web_search_call` output item** with the ID of the search call, along with the action taken in `web_search_call.action`. The action is one of:
   - `search`: represents a web search with query and domains searched
   - `open_page`: represents a page being opened (supported in reasoning models)
   - `find_in_page`: represents searching within a page (supported in reasoning models)

2. **A `message` output item** containing:
   - The text result in `message.content[0].text`
   - Annotations `message.content[0].annotations` for the cited URLs

#### Example Response Structure

```json
[
  {
    "type": "web_search_call",
    "id": "ws_67c9fa0502748190b7dd390736892e100be649c1a5ff9609",
    "status": "completed"
  },
  {
    "id": "msg_67c9fa077e288190af08fdffda2e34f20be649c1a5ff9609",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "On March 6, 2025, several news...",
        "annotations": [
          {
            "type": "url_citation",
            "start_index": 2606,
            "end_index": 2758,
            "url": "https://...",

            "title": "Title..."
          }
        ]
      }
    ]
  }
]
```

### API Compatibility

Web search is available in the Responses API as:
- `web_search`: The generally available version of the tool
- `web_search_preview`: The earlier tool version

To use web search in the Chat Completions API, use the specialized web search models:
- `gpt-4o-search-preview`
- `gpt-4o-mini-search-preview`

### Limitations

- Web search is currently not supported in `gpt-5` with minimal reasoning and `gpt-4.1-nano`
- When used as a tool in the Responses API, web search has the same tiered rate limits as the underlying models
- Web search is limited to a context window size of 128,000 tokens (even with `gpt-4.1` and `gpt-4.1-mini` models)
- User location is not supported for deep research models using web search

## Moderation Models

### text-moderation-latest / omni-moderation-latest

Free models for identifying potentially harmful or policy-violating content in text. `omni-moderation` is the newest version.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Categories | Various categories including hate, self-harm, sexual, violence |
| Pricing | Free |
| Strengths | Fast, reliable detection of problematic content |
| Best for | Content filtering, enforcing usage policies, maintaining safe online environments |

```python
response = client.moderations.create(
    model="omni-moderation-latest",  # Or text-moderation-latest
    input="Sample text to check for harmful content.",
)
```

## Model Selection Guidelines

### Choosing the Right Model

1.  **Task Type**: Identify the primary task (chat, reasoning, image gen, embedding, audio, moderation).
2.  **Complexity & Quality**: More complex tasks or those needing highest quality benefit from GPT-5, GPT-4.1, o4-mini or O3.
3.  **Speed & Cost**: For high volume, low latency, or cost-sensitive tasks, GPT-4.1 mini, GPT-5-mini, or O4 mini are strong choices.
4.  **Multimodality**: If vision or audio input/output is needed, select models like GPT-5-chat, GPT-5 mini, or specialized audio models.
5.  **Context Length**: Consider the amount of input information the model needs to process (most modern models support 128k+ tokens).

### Performance Comparison (General Guide)

| Task | Recommended OpenAI Models | Alternative Models (Other Providers) |
|-------------------------------|-----------------------------------|--------------------------------------|
| Complex Reasoning / Research | GPT-5, O3, GPT-4.1 | Claude 4.1 Opus, Gemini 2.5 Pro |
| General Chat / Content Gen | GPT-5-chat, GPT-5 mini | Claude 4/3.7 Sonnet, Gemini 2.5 Flash |
| Code Generation / Analysis | GPT-5 Chat, O4 mini | Claude 4/3.7 Sonnet, Gemini 2.5 Pro |
| High Volume / Low Latency | GPT-4o mini, GPT-3.5 Turbo | Claude 3.5 Haiku, Gemini 1.5/2.0 Flash |
| Vision / Multimodal Tasks | GPT-5 Chat, O3, GPT-5 mini | Claude 3 series, Gemini 2.5 models |
| Image Generation | DALL·E 3 | Stable Diffusion 3, Midjourney |
| Embeddings (Balanced) | text-embedding-3-small | Cohere Embed v3 |
| Embeddings (Highest Quality) | text-embedding-3-large | N/A |
| Audio Transcription | Whisper | Gemini models, Claude 4 Sonnet |

## Using OpenAI Models via AvalAI

All OpenAI models are accessible through the standard AvalAI API endpoints using OpenAI-compatible client libraries:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Example: Using GPT-4o mini
response = client.chat.completions.create(
    model="gpt-5.4-mini", messages=[{"role": "user", "content": "Hello!"}]
)

# Example: Generating an image with gpt-image-2
image_response = client.images.generate(
    model="gpt-image-2", prompt="A cute cat wearing a wizard hat", n=1, size="1024x1024"
)
```

## Model Versioning

OpenAI frequently updates models. AvalAI provides access using both general aliases (e.g., `gpt-4o`) and specific version snapshots (e.g., `gpt-4o-2024-08-06`). Using snapshots guarantees stability for your application.

- **Latest Aliases**: `gpt-5`, `gpt-5-mini`, `gpt-5-nano`, `gpt-5-chat-latest`, `o4-mini`, `o1-pro`, `o3`, `o3-mini`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`, `gpt-4o`, `gpt-4o-mini`, `o1`, `o1-mini`, `dall-e-3`, `text-embedding-3-large`, `text-embedding-3-small`, `whisper-1`, `tts-1`, `omni-moderation-latest`
- **Specific Snapshots**: e.g., `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `o1-pro-2025-03-19`, `o3-2025-04-16`, `gpt-4.1-2025-04-14`, `gpt-4o-2024-08-06`, `gpt-5.4-mini-2026-03-17`, `o1-2024-12-17`

Check the [Model Details](en/models/model-details.md) page for the full list of available snapshots and aliases.

## Related Resources

- [Chat Completions API](en/api-reference/chat.md)
- [Images API](en/api-reference/images.md)
- [Embeddings API](en/api-reference/embeddings.md)
- [Audio API](en/api-reference/audio.md)
- [Moderation API](en/api-reference/moderation.md)
- [Authentication](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)