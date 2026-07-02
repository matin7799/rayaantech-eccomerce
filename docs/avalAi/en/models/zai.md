# Z.AI Models

AvalAI provides access to Z.AI's GLM (General Language Model) family of models, known for their exceptional coding performance, long-context processing, and comprehensive capabilities across multiple domains.

## GLM-5.2

Z.AI's latest flagship model for agentic engineering, extending GLM-5.1 with an expanded 1M-token context window and improved long-horizon reliability. GLM-5.2 builds on the strong coding and agentic foundations of the GLM-5 series while scaling context handling for repository-level and document-heavy workloads.

### glm-5.2

Z.AI's most capable GLM model, designed for complex software engineering, long-context reasoning, and sustained agentic workflows. GLM-5.2 pairs frontier coding performance with a large context window suited to multi-file codebases and extended agent sessions.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-5.2` |
| Context window | 1,000,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Deep Thinking |
| Input pricing | $1.40 / 1M tokens |
| Cached input pricing | $0.26 / 1M tokens (81% cost reduction) |
| Output pricing | $4.40 / 1M tokens |
| Strengths | Frontier coding, 1M context, long-horizon agentic engineering |
| Best for | Agentic coding, repository-level tasks, long-context reasoning, complex software engineering |
| Available on | `v1/chat/completions`, `v1/responses` (partial) |

**Key Features:**
- **1M Context Window**: Handles repository-level codebases and document-heavy workloads in a single request
- **Frontier Coding Performance**: State-of-the-art results across software engineering and agentic benchmarks
- **Long-Horizon Optimization**: Sustains productive optimization over extended multi-step sessions
- **Self-Revision**: Revisits reasoning and revises strategy through repeated iteration
- **Advanced Capabilities**: Thinking mode, streaming, function calling, context caching, structured output, MCP support

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Refactor this large multi-file codebase to introduce a caching layer and explain the migration plan."
      }
    ],
    "max_tokens": 8192,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5.2",
    messages=[
        {
            "role": "user",
            "content": "Refactor this large multi-file codebase to introduce a caching layer and explain the migration plan.",
        }
    ],
    max_tokens=8192,
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5.2",
    messages: [
        {
            role: "user",
            content: "Refactor this large multi-file codebase to introduce a caching layer and explain the migration plan."
        }
    ],
    max_tokens: 8192,
    temperature: 0.6
});

console.log(response.choices[0].message.content);

```

---

## GLM-5.1

Z.AI's next-generation flagship model for agentic engineering, with significantly stronger coding capabilities than its predecessor. GLM-5.1 achieves state-of-the-art performance on SWE-Bench Pro (58.4%) and leads GLM-5 by a wide margin on NL2Repo and Terminal-Bench 2.0.

### glm-5.1

Z.AI's most advanced model that achieves SOTA performance in complex software engineering tasks, leading all models including GPT-5.4 and Claude Opus 4.6 on SWE-Bench Pro. Built for sustained effectiveness on agentic tasks over extended sessions with 600+ iterations.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-5.1` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Deep Thinking |
| Input pricing | $1.54 / 1M tokens |
| Cached input pricing | $0.286 / 1M tokens (81% cost reduction) |
| Output pricing | $4.84 / 1M tokens |
| Strengths | SOTA SWE-Bench Pro (58.4%), long-horizon optimization, agentic engineering |
| Best for | Agentic coding, complex software engineering, repository-level tasks, long-range agent tasks |
| Available on | `v1/chat/completions` |

**Key Features:**
- **State-of-the-Art on SWE-Bench Pro**: 58.4% performance, leading all models including GPT-5.4 and Claude Opus 4.6
- **Long-Horizon Optimization**: Sustains productive optimization over 600+ iterations with 6,000+ tool calls
- **Self-Revision**: Revisits reasoning and revises strategy through repeated iteration
- **Complex Problem Solving**: Breaks down complex problems, runs experiments, reads results, and identifies blockers with precision
- **Advanced Capabilities**: Thinking mode, streaming, function calling, context caching, structured output, MCP support

**Performance Highlights:**

GLM-5.1 achieves breakthrough performance:
- **SWE-Bench Pro**: 58.4% (SOTA)
- **NL2Repo**: 42.7%
- **Terminal-Bench 2.0**: 63.5%
- **AIME 2026**: 95.3%
- **GPQA-Diamond**: 86.2%
- **HLE (with tools)**: 52.3%

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5.1",
    "messages": [
      {
        "role": "user",
        "content": "Implement a high-performance vector database with IVF clustering and u8 prescoring for approximate nearest neighbor search."
      }
    ],
    "max_tokens": 8192,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5.1",
    messages=[
        {
            "role": "user",
            "content": "Implement a high-performance vector database with IVF clustering and u8 prescoring for approximate nearest neighbor search.",
        }
    ],
    max_tokens=8192,
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5.1",
    messages: [
        {
            role: "user",
            content: "Implement a high-performance vector database with IVF clustering and u8 prescoring for approximate nearest neighbor search."
        }
    ],
    max_tokens: 8192,
    temperature: 0.6
});

console.log(response.choices[0].message.content);

```

---

## GLM-5v-Turbo

Z.AI's multimodal vision model optimized for high-throughput visual understanding tasks.

### glm-5v-turbo

Z.AI's vision-language model for processing and analyzing images with high accuracy, supporting multiple images in a single request.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-5v-turbo` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Vision, Function Calling, Structured Outputs |
| Input pricing | $1.20 / 1M tokens |
| Cached input pricing | $0.24 / 1M tokens (80% cost reduction) |
| Output pricing | $4.00 / 1M tokens |
| Strengths | Vision understanding, multi-image support, high-throughput |
| Best for | Image analysis, visual Q&A, document understanding, multimodal tasks |
| Available on | `v1/chat/completions` |

**Key Features:**
- **Vision Understanding**: Process and analyze images with high accuracy
- **Multi-Image Support**: Handle multiple images in a single request
- **High-Throughput**: Optimized for fast visual processing
- **Context Caching**: 80% cost reduction on cached inputs
- **Function Calling**: Full tool support with visual inputs
- **Streaming**: Real-time streaming responses

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5v-turbo",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "What objects can you identify in this image?"},
          {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
        ]
      }
    ],
    "max_tokens": 2048
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5v-turbo",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What objects can you identify in this image?",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.jpg"},
                },
            ],
        }
    ],
    max_tokens=2048,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5v-turbo",
    messages: [
        {
            role: "user",
            content: [
                {type: "text", text: "What objects can you identify in this image?"},
                {type: "image_url", image_url: {url: "https://example.com/image.jpg"}}
            ]
        }
    ],
    max_tokens: 2048
});

console.log(response.choices[0].message.content);

```

---

## GLM-5

Z.AI's flagship foundation model designed for Agentic Engineering, capable of providing reliable productivity in complex system engineering and long-range Agent tasks. GLM-5 achieves SOTA performance in coding and agentic capabilities among open-weight models.

### glm-5

Z.AI's flagship model that achieves performance alignment with Claude Opus 4.5 in software engineering tasks, with the highest scores among open-weight models on SWE-bench Verified and Terminal Bench 2.0.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-5` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Deep Thinking |
| Input pricing | $1.10 / 1M tokens |
| Cached input pricing | $0.22 / 1M tokens (80% cost reduction) |
| Output pricing | $3.52 / 1M tokens |
| Strengths | SOTA coding, agentic engineering, Claude Opus 4.5 level performance |
| Best for | Agentic coding, long-range agent tasks, software engineering, complex system design |
| Available on | `v1/chat/completions` |

**Key Features:**
- **Agentic Engineering**: Designed for complex system engineering and long-range Agent tasks
- **SOTA Coding Performance**: 77.8 on SWE-bench Verified, 56.2 on Terminal Bench 2.0 (highest among open-weight models)
- **Claude Opus 4.5 Level**: Performance alignment in software engineering tasks
- **Larger Model Scale**: 744B parameters (40B activated) with 28.5T pre-training data
- **Sparse Attention**: DeepSeek Sparse Attention for improved efficiency
- **Advanced Capabilities**: Thinking mode, streaming, function calling, context caching, structured output

**Performance Highlights:**

GLM-5 achieves breakthrough performance:
- Surpasses Gemini 3.0 Pro in overall coding performance
- Achieves SOTA among open-weight models on SWE-bench Verified and τ²-Bench
- Excels at frontend development, backend systems engineering, and long-horizon execution tasks
- Autonomous agentic long-range planning, backend refactoring, and deep debugging

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5",
    "messages": [
      {
        "role": "user",
        "content": "Design and implement a microservices architecture for an e-commerce platform with order management, inventory, and payment services."
      }
    ],
    "max_tokens": 8192,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {
            "role": "user",
            "content": "Design and implement a microservices architecture for an e-commerce platform with order management, inventory, and payment services.",
        }
    ],
    max_tokens=8192,
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5",
    messages: [
        {
            role: "user",
            content: "Design and implement a microservices architecture for an e-commerce platform with order management, inventory, and payment services."
        }
    ],
    max_tokens: 8192,
    temperature: 0.6
});

console.log(response.choices[0].message.content);

```

**Deep Thinking Mode:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5",
    "messages": [
      {
        "role": "user",
        "content": "Analyze this complex codebase and suggest architectural improvements for better maintainability and scalability."
      }
    ],
    "thinking": {
      "type": "enabled",
      "budget_tokens": 15000
    },
    "max_tokens": 16384
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {
            "role": "user",
            "content": "Analyze this complex codebase and suggest architectural improvements for better maintainability and scalability.",
        }
    ],
    extra_body={"thinking": {"type": "enabled", "budget_tokens": 15000}},
    max_tokens=16384,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5",
    messages: [
        {
            role: "user",
            content: "Analyze this complex codebase and suggest architectural improvements for better maintainability and scalability."
        }
    ],
    thinking: {
        type: "enabled",
        budget_tokens: 15000
    },
    max_tokens: 16384
});

console.log(response.choices[0].message.content);

```

---

## GLM-5-Turbo

Z.AI's foundation model deeply optimized for OpenClaw agentic scenarios. It has been specifically optimized for the core requirements of OpenClaw tasks since the training phase, enhancing key capabilities such as tool invocation, command following, timed and persistent tasks, and long-chain execution.

### glm-5-turbo

A ClawBench enhanced model designed for real-world agent workflows, with superior tool calling, instruction following, and long-chain execution capabilities.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-5-turbo` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Thinking Mode, MCP |
| Input pricing | $1.32 / 1M tokens |
| Cached input pricing | $0.264 / 1M tokens (80% cost reduction) |
| Output pricing | $4.40 / 1M tokens |
| Strengths | OpenClaw native, precise tool calling, instruction following, long-chain execution |
| Best for | Agentic workflows, tool-heavy applications, scheduled tasks, multi-step automation |
| Available on | `v1/chat/completions` |

**Key Features:**
- **OpenClaw Native Model**: Systematically constructed for real-world agent workflows from training data to optimization objectives
- **Tool Calling—Precise Invocation**: Strengthened ability to invoke external tools and various skills with greater stability and reliability in multi-step tasks
- **Instruction Following—Enhanced Decomposition**: Stronger comprehension and decomposition capabilities for complex, multi-layered, and long-chain instructions
- **Scheduled and Persistent Tasks**: Optimized for scheduled triggers, continuous execution, and long-running tasks with better time dimension understanding
- **High-Throughput Long Chains**: Enhanced execution efficiency and response stability for high data throughput and long logical chains
- **Thinking Mode**: Multiple thinking modes for different scenarios
- **Streaming Output**: Real-time streaming responses for enhanced user interaction
- **Context Caching**: Intelligent caching mechanism to optimize performance in long conversations
- **Structured Output**: Support for JSON and other structured output formats
- **MCP Support**: Flexibly integrate external MCP tools and data sources

**ZClawBench Performance:**

GLM-5-Turbo delivers substantial improvements over GLM-5 in OpenClaw scenarios:
- Outperforms several leading models across multiple key task categories
- Covers environment setup, software development, information retrieval, data analysis, and content creation
- Handles 30%-50% of research agent workflows autonomously

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "As a marketing expert, please create an attractive slogan for my product."
      },
      {
        "role": "assistant",
        "content": "Sure, to craft a compelling slogan, please tell me more about your product."
      },
      {
        "role": "user",
        "content": "Z.AI Open Platform"
      }
    ],
    "max_tokens": 4096,
    "temperature": 1.0
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5-turbo",
    messages=[
        {
            "role": "user",
            "content": "As a marketing expert, please create an attractive slogan for my product.",
        },
        {
            "role": "assistant",
            "content": "Sure, to craft a compelling slogan, please tell me more about your product.",
        },
        {
            "role": "user",
            "content": "Z.AI Open Platform",
        },
    ],
    max_tokens=4096,
    temperature=1.0,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5-turbo",
    messages: [
        {
            role: "user",
            content: "As a marketing expert, please create an attractive slogan for my product."
        },
        {
            role: "assistant",
            content: "Sure, to craft a compelling slogan, please tell me more about your product."
        },
        {
            role: "user",
            content: "Z.AI Open Platform"
        }
    ],
    max_tokens: 4096,
    temperature: 1.0
});

console.log(response.choices[0].message.content);

```

**Thinking Mode:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Design a research agent harness that supports data pipelines, training environments, and cross-team collaboration."
      }
    ],
    "thinking": {
      "type": "enabled"
    },
    "stream": true,
    "max_tokens": 4096,
    "temperature": 1.0
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5-turbo",
    messages=[
        {
            "role": "user",
            "content": "Design a research agent harness that supports data pipelines, training environments, and cross-team collaboration.",
        }
    ],
    extra_body={"thinking": {"type": "enabled"}},
    stream=True,
    max_tokens=4096,
    temperature=1.0,
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-5-turbo",
    messages: [
        {
            role: "user",
            content: "Design a research agent harness that supports data pipelines, training environments, and cross-team collaboration."
        }
    ],
    thinking: {
        type: "enabled"
    },
    stream: true,
    max_tokens: 4096,
    temperature: 1.0
});

for await (const chunk of response) {
    if (chunk.choices[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
    }
}

```

---

## GLM-4.7

The newest addition to the GLM series, achieving o3-level reasoning depth with up to 20x better efficiency, excelling in coding and agentic tasks.

### glm-4.7

Z.AI's most advanced model that combines o3-level reasoning depth with exceptional efficiency, delivering superior performance in coding, mathematics, and agentic workflows.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-4.7` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Deep Thinking |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.11 / 1M tokens (82% cost reduction) |
| Output pricing | $2.20 / 1M tokens |
| Strengths | o3-level reasoning, 20x efficiency, superior coding, agentic workflows |
| Best for | Complex coding, agentic automation, mathematical problem-solving, competitive programming |
| Available on | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Key Features:**
- **o3-Level Reasoning**: Achieves reasoning depth on par with o3 across challenging benchmarks
- **20x Efficiency**: Delivers up to 20x better efficiency with 50% lower costs compared to competitors
- **Superior Coding**: Outperforms Claude Sonnet 4 and GPT-4.1 in coding tasks
- **Deep Thinking Mode**: Supports `hard_thinking_low` mode for complex reasoning tasks
- **Execution System Integration**: Native support for agentic workflows with code execution
- **Extended Context**: 200K token context window with 128K token output capacity

**Performance Highlights:**

GLM-4.7 achieves breakthrough performance:
- Matches o3 on reasoning benchmarks (AIME 2025, GPQA Diamond)
- Outperforms Claude Sonnet 4 and GPT-4.1 on coding tasks
- Exceptional performance on LiveCodeBench and SWE-Bench
- Up to 20x more efficient than competing models

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7",
    "messages": [
      {
        "role": "user",
        "content": "Implement a binary search tree with AVL balancing in Python, including insert, delete, and search operations."
      }
    ],
    "max_tokens": 4096,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.7",
    messages=[
        {
            "role": "user",
            "content": "Implement a binary search tree with AVL balancing in Python, including insert, delete, and search operations.",
        }
    ],
    max_tokens=4096,
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-4.7",
    messages: [
        {
            role: "user",
            content: "Implement a binary search tree with AVL balancing in Python, including insert, delete, and search operations."
        }
    ],
    max_tokens: 4096,
    temperature: 0.6
});

console.log(response.choices[0].message.content);

```

**Deep Thinking Mode:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7",
    "messages": [
      {
        "role": "user",
        "content": "Solve this IMO problem: Find all positive integers n such that n^2 + 1 is divisible by n^3 + n + 1"
      }
    ],
    "thinking": {
      "type": "enabled",
      "budget_tokens": 10000
    },
    "max_tokens": 8192
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.7",
    messages=[
        {
            "role": "user",
            "content": "Solve this IMO problem: Find all positive integers n such that n^2 + 1 is divisible by n^3 + n + 1",
        }
    ],
    extra_body={"thinking": {"type": "enabled", "budget_tokens": 10000}},
    max_tokens=8192,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-4.7",
    messages: [
        {
            role: "user",
            content: "Solve this IMO problem: Find all positive integers n such that n^2 + 1 is divisible by n^3 + n + 1"
        }
    ],
    thinking: {
        type: "enabled",
        budget_tokens: 10000
    },
    max_tokens: 8192
});

console.log(response.choices[0].message.content);

```

---

## GLM-4.7-Flash Series

The GLM-4.7-Flash series brings the power of GLM-4.7 in smaller, faster, and more affordable packages. These models achieve open-source SOTA scores among models of comparable size on mainstream benchmarks like SWE-bench Verified and τ²-Bench.

### glm-4.7-flashx

The fastest model in the GLM-4.7 family, optimized for speed-critical applications while maintaining excellent programming capabilities.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-4.7-flashx` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs |
| Input pricing | $0.077 / 1M tokens |
| Cached input pricing | $0.011 / 1M tokens (86% cost reduction) |
| Output pricing | $0.44 / 1M tokens |
| Strengths | Fast inference, cost-effective, excellent coding |
| Best for | High-throughput applications, fast responses, cost-sensitive deployments |
| Available on | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Key Features:**
- **Open-source SOTA**: Achieves state-of-the-art scores among similarly sized models on SWE-bench Verified and τ²-Bench
- **Superior Development**: Excels at both frontend and backend development tasks
- **Fast Inference**: Optimized for speed with lower latency responses
- **Cost-Effective**: Significantly lower pricing than the full GLM-4.7 model

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7-flashx",
    "messages": [
      {
        "role": "user",
        "content": "Write a TypeScript function that implements a debounce utility with proper typing."
      }
    ],
    "max_tokens": 2048,
    "temperature": 0.7
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.7-flashx",
    messages=[
        {
            "role": "user",
            "content": "Write a TypeScript function that implements a debounce utility with proper typing.",
        }
    ],
    max_tokens=2048,
    temperature=0.7,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-4.7-flashx",
    messages: [
        {
            role: "user",
            content: "Write a TypeScript function that implements a debounce utility with proper typing."
        }
    ],
    max_tokens: 2048,
    temperature: 0.7
});

console.log(response.choices[0].message.content);

```

---

### glm-4.7-flash

A balanced model offering excellent performance with improved efficiency over the full GLM-4.7 model, particularly strong for development tasks, translation, and long-form text processing.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-4.7-flash` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs |
| Input pricing | $0.07 / 1M tokens |
| Cached input pricing | $0.01 / 1M tokens (86% cost reduction) |
| Output pricing | $0.40 / 1M tokens |
| Strengths | Balanced performance, excellent for development, translation |
| Best for | Frontend/backend development, Chinese writing, translation, long-form text processing |
| Available on | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |

**Key Features:**
- **Versatile Applications**: Excellent for Chinese writing, translation, long-form text processing, and role-playing interactions
- **Superior Frontend Aesthetics**: Produces visually superior webpages, presentations, and posters
- **Cost-Effective**: Nearly 90% lower pricing than the full GLM-4.7 model while maintaining quality
- **Extended Context**: 200K token context window with 128K token output capacity

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7-flash",
    "messages": [
      {
        "role": "user",
        "content": "Create a modern, responsive landing page for a SaaS product with a hero section and pricing table."
      }
    ],
    "max_tokens": 4096,
    "temperature": 0.7
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.7-flash",
    messages=[
        {
            "role": "user",
            "content": "Create a modern, responsive landing page for a SaaS product with a hero section and pricing table.",
        }
    ],
    max_tokens=4096,
    temperature=0.7,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-4.7-flash",
    messages: [
        {
            role: "user",
            content: "Create a modern, responsive landing page for a SaaS product with a hero section and pricing table."
        }
    ],
    max_tokens: 4096,
    temperature: 0.7
});

console.log(response.choices[0].message.content);

```

---

## GLM-4.6

The latest iteration in the GLM series, achieving comprehensive enhancements across coding, reasoning, writing, and agentic applications.

### glm-4.6

Z.AI's flagship model that delivers superior performance in real-world coding tasks and demonstrates capabilities on par with Claude Sonnet 4.

| Feature | Details |
| -------------- | ---------------------------------------------------------------- |
| Model ID | `glm-4.6` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Web Search |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.11 / 1M tokens (82% cost reduction) |
| Output pricing | $2.20 / 1M tokens |
| Web search pricing | $0.01 / call |
| Strengths | Superior coding, long-context processing, reasoning, agentic workflows |
| Best for | AI coding tools, smart office, content creation, translation, virtual characters |
| Available on | `v1/chat/completions` |

**Key Features:**
- **Extended Context Window**: 200K tokens (expanded from 128K) for handling complex agentic tasks
- **Superior Coding Performance**: Outperforms Claude Sonnet 4 in real-world coding tests within Claude Code environment
- **Advanced Reasoning**: Built-in thinking mode with `thinking` parameter for enhanced problem-solving
- **Token Efficiency**: Over 30% more efficient than its predecessor GLM-4.5
- **Tool Use**: Native support for tool invocation during inference
- **Web Search Integration**: Built-in web search capabilities for up-to-date information
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats

**Performance Highlights:**

GLM-4.6 achieves performance on par with Claude Sonnet 4/Claude Sonnet 4.6 across 8 authoritative benchmarks including:
- AIME 25
- GPQA
- LCB v6
- HLE
- SWE-Bench Verified

In 74 real-world coding tests within the Claude Code environment, GLM-4.6 demonstrates superior performance compared to Claude Sonnet 4 and other models, with transparency in all test trajectories (publicly available at https://huggingface.co/datasets/zai-org/CC-Bench-trajectories).

**Basic Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "Create a responsive navigation bar with dropdown menus using React and Tailwind CSS."
      }
    ],
    "max_tokens": 4096,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {
            "role": "user",
            "content": "Create a responsive navigation bar with dropdown menus using React and Tailwind CSS.",
        }
    ],
    max_tokens=4096,
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-4.6",
    messages: [
        {
            role: "user",
            content: "Create a responsive navigation bar with dropdown menus using React and Tailwind CSS."
        }
    ],
    max_tokens: 4096,
    temperature: 0.6
});

console.log(response.choices[0].message.content);

```

**Reasoning Mode with Thinking Parameter:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "Design a scalable microservices architecture for an e-commerce platform."
      }
    ],
    "thinking": {
      "type": "enabled"
    },
    "max_tokens": 4096,
    "temperature": 0.6
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {
            "role": "user",
            "content": "Design a scalable microservices architecture for an e-commerce platform.",
        }
    ],
    extra_body={"thinking": {"type": "enabled"}},
    max_tokens=4096,
    temperature=0.6,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "glm-4.6",
    messages: [
        {
            role: "user",
            content: "Design a scalable microservices architecture for an e-commerce platform."
        }
    ],
    thinking: {
        type: "enabled"
    },
    max_tokens: 4096,
    temperature: 0.6
});

console.log(response.choices[0].message.content);

```

**Function Calling Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in New York?"
      }
    ],
    "tools": [
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
                "description": "City name"
              }
            },
            "required": ["location"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

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
    model="glm-4.6",
    messages=[{"role": "user", "content": "What's the weather like in New York?"}],
    tools=tools,
    tool_choice="auto",
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
            description: "Get current weather information",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "City name",
                    }
                },
                required: ["location"],
            },
        },
    }
];

const response = await client.chat.completions.create({
    model: "glm-4.6",
    messages: [{role: "user", content: "What's the weather like in New York?"}],
    tools: tools,
    tool_choice: "auto",
});

console.log(response.choices[0].message);

```

## Use Cases

### AI Coding

GLM-4.6 supports mainstream programming languages including Python, JavaScript, and Java, delivering superior aesthetics and logical layout in frontend code. It natively handles diverse agent tasks with enhanced autonomous planning and tool invocation capabilities, excelling in:

- Task decomposition
- Cross-tool collaboration
- Dynamic adjustments
- Complex development workflows
- IDE integration (Claude Code, Cline, OpenCode, Roo Code, Kilo Code)

**Example:**

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {
            "role": "user",
            "content": "Refactor this Python function to be more efficient:\n\ndef find_duplicates(arr):\n    result = []\n    for i in range(len(arr)):\n        for j in range(i+1, len(arr)):\n            if arr[i] == arr[j] and arr[i] not in result:\n                result.append(arr[i])\n    return result",
        }
    ],
)

print(response.choices[0].message.content)
```

### Smart Office

Significantly enhances presentation quality in PowerPoint creation and office automation scenarios. Generates aesthetically advanced layouts with clear logical structures while preserving content integrity and expression accuracy, making it ideal for:

- Office automation systems
- AI presentation tools
- Document generation
- Report creation

### Translation and Cross-Language Applications

Translation quality for multiple languages (French, Russian, Japanese, Korean) and informal contexts has been optimized, particularly suitable for:

- Social media content
- E-commerce descriptions
- Short drama translations
- Cross-border services
- Global enterprise communication

Maintains semantic coherence and stylistic consistency in lengthy passages while achieving superior style adaptation and localized expression.

### Content Creation

Supports diverse content production including:

- Novels and creative writing
- Scripts and screenplays
- Marketing copywriting
- Blog posts and articles

Achieves natural expression through contextual expansion and emotional regulation.

### Virtual Characters

Maintains consistent tone and behavior across multi-turn conversations, ideal for:

- Virtual humans
- Social AI applications
- Brand personification
- Customer service bots
- Interactive storytelling

Makes interactions warmer and more authentic with personality consistency.

### Intelligent Search & Deep Research

Enhances user intent understanding, tool retrieval, and result integration. The model:

- Returns precise search results
- Deeply synthesizes outcomes
- Supports Deep Research scenarios
- Delivers insightful answers with web search integration at $0.01 per call

**Web Search Example:**

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {
            "role": "user",
            "content": "What are the latest developments in quantum computing as of 2025?",
        }
    ],
    extra_body={"web_search": True},
)

print(response.choices[0].message.content)
```

## Key Parameters

### thinking

Controls the reasoning mode of the model. When enabled, the model shows its thinking process before providing the final answer.

```python
{"thinking": {"type": "enabled"}}  # or "disabled"
```

### web_search

Enables web search capabilities to retrieve up-to-date information. Each search call costs $0.01.

```python
{"web_search": True}  # or False
```

### temperature

Controls randomness in output generation (0-2). Lower values make output more focused and deterministic.

```python
{"temperature": 0.6}  # Default: 0.6
```

### max_tokens

Maximum number of tokens to generate in the response (up to 128K).

```python
{"max_tokens": 4096}  # Adjust based on your needs
```

## Best Practices

1. **Use Reasoning Mode for Complex Tasks**: Enable the `thinking` parameter for complex problem-solving, architectural design, and strategic planning tasks.

2. **Leverage Long Context**: Take advantage of the 200K context window for processing large codebases, extensive documents, or multi-turn conversations.

3. **Optimize with Cached Input**: Use prompt caching to reduce costs by up to 82% for repeated context.

4. **Enable Web Search When Needed**: Activate web search for tasks requiring current information, but note the $0.01 per call cost.

5. **Function Calling for Integrations**: Utilize function calling to connect GLM-4.6 with external tools, databases, and APIs.

6. **Temperature Control**: Use lower temperatures (0.3-0.6) for coding and analytical tasks, higher temperatures (0.7-1.0) for creative content.

7. **Structured Outputs**: Request specific output formats using structured output capabilities for predictable response parsing.

## Using Z.AI Models via AvalAI

Access GLM models using the standard AvalAI API endpoints and OpenAI-compatible libraries.

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {"role": "user", "content": "Write a haiku about artificial intelligence."}
    ],
)

print(response.choices[0].message.content)
```

## Related Resources

- [Official Z.AI Documentation](https://docs.z.ai/)
- [Chat Completions API](en/api-reference/chat.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Structured Outputs Guide](en/guides/structured-outputs.md)
- [Rate Limits and Pricing](en/guides/rate-limits.md)
- [Best Practices for Production](en/guides/production-best-practices.md)