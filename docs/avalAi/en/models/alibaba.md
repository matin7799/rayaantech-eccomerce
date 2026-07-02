# Alibaba Models (Qwen)

AvalAI provides comprehensive access to Alibaba's complete Qwen model family through their official [DashScope](https://dashscope.console.aliyun.com/) cloud infrastructure. These models offer cutting-edge capabilities across text generation, multimodal processing, reasoning, machine translation, and coding tasks, all accessible via our unified API endpoints.

## Important: `enable_thinking` Parameter

> **⚠️ Note for Non-Streaming Requests**: Most Alibaba Qwen models require you to explicitly set [`extra_body`](en/guides/provider-specific-params.md) parameter `{"enable_thinking": False}` when making **non-streaming** requests (`stream=False`). Without this parameter, DashScope may return an error.
>
> **Key Requirements**:
>
> - **Non-streaming requests**: Must include `extra_body={"enable_thinking": False}`
> - **Streaming requests with thinking**: Can use `extra_body={"enable_thinking": True}` only with `stream=True`
> - **Error if violated**: Setting `enable_thinking: True` without streaming will result in an `invalid_request` error

**Example for non-streaming requests**:

```python
response = client.chat.completions.create(
    model="qwen3-8b",
    messages=[{"role": "user", "content": "Your question here"}],
    stream=False,
    extra_body={"enable_thinking": False},  # Required for non-streaming
)
```

**Example for streaming requests with thinking**:

```python
stream = client.chat.completions.create(
    model="qwen3-8b",
    messages=[{"role": "user", "content": "Your question here"}],
    stream=True,
    extra_body={"enable_thinking": True},  # Only supported with streaming
)
```

## Available Models

Alibaba's Qwen models are organized into several specialized families, each optimized for different use cases and performance requirements. All models support the `v1/chat/completions` endpoint with full feature compatibility, and limited support is available on the `v1/messages` endpoint.

## Qwen Flash Series

High-performance models optimized for speed and efficiency, ideal for applications requiring fast response times with excellent quality.

> **⚠️ Deprecation Notice:** The legacy `qwen-turbo` series (`qwen-turbo`, `qwen-turbo-latest`, `qwen-turbo-2025-04-28`) is being decommissioned by Alibaba between **May 13, 2026** and **May 31, 2026**. Please migrate to `qwen-flash` or `qwen3.6-flash`. See [Deprecations](en/deprecations.md) for details.

| Feature           | qwen-flash                 | qwen-flash-2025-07-28 |
| ----------------- | -------------------------- | --------------------- |
| Provider          | DashScope                  | DashScope             |
| Owner             | Alibaba                    | Alibaba               |
| Context Window    | 131,072 tokens             | 131,072 tokens        |
| Max Input Tokens  | 129,024                    | 129,024               |
| Max Output Tokens | 16,384                     | 16,384                |
| Strengths         | Ultra-fast, Tiered pricing | Stable flash version  |
| Best for          | Cost-effective speed       | Production flash      |

```python
# Example using Qwen Flash for fast text generation
response = client.chat.completions.create(
    model="qwen3.6-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key benefits of renewable energy in 3 bullet points.",
        }
    ],
    max_tokens=200,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

## Qwen3.7 Max Series

Alibaba's newest flagship proprietary model designed for the agent era. Qwen3.7-Max is a versatile agent foundation that excels at coding, office productivity, and long-horizon autonomous execution, with cross-harness generalization across Claude Code, OpenClaw, Qwen Code, and custom tool-use frameworks.

### qwen3.7-max

The latest flagship Qwen model built for agentic workflows. Features frontier coding capabilities, strong reasoning, and sustained autonomous execution across hundreds or thousands of tool calls.

> **🎉 Promotional Pricing:** A 50% discount is applied to all Qwen3.7-Max requests through **Jun 22, 2026**. Standard pricing resumes after this date.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.7-max` |
| Context window | 256,000 tokens |
| Maximum output | 65,536 tokens |
| Input pricing (promo through Jun 22) | $2.50 / 1M tokens |
| Cache creation (promo) | $3.125 / 1M tokens |
| Cached input pricing (promo) | $0.25 / 1M tokens (90% cost reduction) |
| Output pricing (promo) | $7.50 / 1M tokens |
| Input pricing (after Jun 22) | $5.00 / 1M tokens |
| Cache creation (after Jun 22) | $6.25 / 1M tokens |
| Cached input pricing (after Jun 22) | $0.50 / 1M tokens (90% cost reduction) |
| Output pricing (after Jun 22) | $15.00 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` (partial) |

**Key Features:**
- **Agent Foundation**: Built for the agent era — coding, office productivity, and long-horizon execution
- **Frontier Coding Agent**: 80.4 on SWE-Verified, 60.6 on SWE-Pro, 78.3 on SWE-Multilingual, 69.7 on Terminal-Bench 2.0
- **Strong Reasoning**: 92.4 on GPQA Diamond, 97.1 on HMMT 2026 Feb, 90.0 on IMOAnswerBench, 44.5 on Apex
- **Agent Benchmarks**: 60.8 on MCP-Mark, 76.4 on MCP-Atlas, 87.0 on SpreadSheetBench-v1, 75.0 on BFCL-V4
- **Long-Horizon Execution**: Demonstrated 35-hour autonomous kernel optimization with 1,158 tool calls and 10.0x speedup
- **Cross-Harness Generalization**: Consistent performance across Claude Code, OpenClaw, Qwen Code, and custom frameworks
- **Hybrid Thinking**: Optional reasoning mode via `enable_thinking` (streaming only)
- **Preserve Thinking**: Recommended for multi-turn agent workflows via `preserve_thinking`

**Benchmark Performance:**
- SWE-Verified: 80.4 (on par with Opus-4.6 Max at 80.8)
- SWE-Pro: 60.6 (vs. K2.6 at 59.5)
- SWE-Multilingual: 78.3 (vs. Opus-4.6 at 77.5)
- Terminal-Bench 2.0: 69.7 (vs. DS-V4-Pro Max at 67.9)
- NL2Repo: 47.2
- HMMT 2026 Feb: 97.1 (best in class)
- GPQA Diamond: 92.4 (best in class)
- IMOAnswerBench: 90.0 (best in class)
- MMLU-Pro: 89.6
- MRCR-v2 128k: 90.4 (best in class)
- WMT24++: 85.8 (best in class)

```python
# Example using Qwen3.7-Max for long-horizon agentic tasks
stream = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[
        {
            "role": "user",
            "content": "Build a multi-file Python CLI that downloads, validates, and merges CSV files from S3.",
        }
    ],
    stream=True,
    extra_body={
        "enable_thinking": True,
        "preserve_thinking": True,
    },
)
```

---

## Qwen3.6 Plus Series

Alibaba's flagship Qwen3.6 model with massive capability upgrades, featuring a 1M context window by default, significantly improved agentic coding capabilities, and better multimodal perception and reasoning.

### qwen3.6-plus

The latest flagship model with enhanced agentic coding and multimodal capabilities.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.6-plus` |
| Context window | 1,000,000 tokens (default) |
| Input pricing | $0.50 / 1M tokens |
| Input pricing (above 256K) | $2.00 / 1M tokens |
| Cache creation | $0.625 / 1M tokens |
| Cache creation (above 256K) | $2.50 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (90% cost reduction) |
| Cached input (above 256K) | $0.20 / 1M tokens |
| Output pricing | $3.00 / 1M tokens |
| Output pricing (above 256K) | $6.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **1M Context Window**: Default million-token context for extensive documents and conversations
- **SOTA Agentic Coding**: From frontend web development to complex repository-level problem solving
- **Enhanced Multimodal**: Greater accuracy and sharper multimodal reasoning
- **Coding Agent Excellence**: 78.8% on SWE-bench Verified, 61.6% on Terminal-Bench 2.0
- **Deep Planning**: 41.5% on DeepPlanning benchmark (leading performance)
- **MCP Support**: 48.2% on MCPMark for Model Context Protocol integration
- **Tool Decathlon**: Strong performance across diverse tool-use scenarios

**Benchmark Performance:**
- SWE-bench Verified: 78.8%
- SWE-bench Multilingual: 73.8%
- SWE-bench Pro: 56.6%
- Terminal-Bench 2.0: 61.6%
- TAU3-Bench: 70.7%
- DeepPlanning: 41.5%
- MCPMark: 48.2%
- MMLU-Pro: 88.5%
- SuperGPQA: 71.6%

```python
# Example using Qwen3.6-Plus for agentic coding
response = client.chat.completions.create(
    model="qwen3.6-plus",
    messages=[
        {
            "role": "user",
            "content": "Analyze this codebase and implement a fix for the bug in the authentication module.",
        }
    ],
    max_tokens=4000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

---

## Qwen3.6 Series (Flash, 27B, 35B-A3B, Max-Preview)

Four new models from the Qwen3.6 series with significant improvements in agentic coding, STEM reasoning, spatial intelligence, and object detection over the Qwen3.5 generation. The flash/27B/35B-A3B variants are native vision-language models; the max-preview is the largest and most capable text-only variant.

### qwen3.6-flash

The Qwen3.6 native vision-language Flash model with a 1M context window and significantly improved agentic coding, mathematical reasoning, and spatial intelligence over qwen3.5-flash.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.6-flash` |
| Context window | 1,000,000 tokens (256K tier-one pricing) |
| Maximum output | 64K tokens |
| Input pricing | $0.25 / 1M tokens |
| Input pricing (above 256K) | $1.00 / 1M tokens |
| Cache creation | $0.3125 / 1M tokens |
| Cache creation (above 256K) | $1.25 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens (90% cost reduction) |
| Cached input (above 256K) | $0.10 / 1M tokens |
| Output pricing | $1.50 / 1M tokens |
| Output pricing (above 128K) | $4.00 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Native Vision-Language**: Processes text, images, and videos natively
- **1M Context Window**: Extended context for long documents and conversations
- **Agentic Coding**: Substantially outperforms Qwen3.5-Flash on code-agent benchmarks
- **Spatial Intelligence**: Markedly improved object localization and detection
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`
- **Tool Support**: Function calling, structured output, and web search

```python
response = client.chat.completions.create(
    model="qwen3.6-flash",
    messages=[
        {
            "role": "user",
            "content": "Implement a binary search tree in Python with insert, delete, and in-order traversal methods.",
        }
    ],
    extra_body={"enable_thinking": True},
)
```

### qwen3.6-27b

The Qwen3.6 27B native vision-language dense model with key improvements in agentic coding, STEM reasoning, and visual agent capabilities.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.6-27b` |
| Context window | 256,000 tokens |
| Maximum output | 64K tokens |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.06 / 1M tokens (90% cost reduction) |
| Output pricing | $3.60 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Native Vision-Language**: Processes text, images, and videos natively
- **256K Context Window**: Extended context for complex tasks
- **Enhanced STEM Reasoning**: Improved mathematical and code reasoning skills
- **Visual Agents**: Advances in video understanding, document OCR, and visual agent capabilities
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`

```python
response = client.chat.completions.create(
    model="qwen3.6-27b",
    messages=[
        {
            "role": "user",
            "content": "Analyze this diagram and extract the workflow steps.",
        }
    ],
    max_tokens=4096,
)
```

### qwen3.6-35b-a3b

The Qwen3.6 35B-A3B native vision-language model with a hybrid architecture integrating linear attention and sparse mixture-of-experts for higher inference efficiency.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.6-35b-a3b` |
| Context window | 256,000 tokens |
| Maximum output | 64K tokens |
| Input pricing | $0.248 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens (90% cost reduction) |
| Output pricing | $1.485 / 1M tokens |
| Input modalities | Text, Image, Video |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Hybrid Architecture**: Linear attention combined with sparse MoE for higher efficiency
- **Improved Agentic Coding**: Significantly better code-agent performance
- **Spatial Intelligence**: Advances in object localization and detection
- **Cost-Effective**: Very low pricing thanks to efficient sparse activation
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`

```python
response = client.chat.completions.create(
    model="qwen3.6-35b-a3b",
    messages=[
        {
            "role": "user",
            "content": "Refactor this monolithic service into microservices.",
        }
    ],
    max_tokens=4096,
)
```

### qwen3.6-max-preview

The largest and most capable variant in the Qwen3.6 series, available in preview with text-only capabilities. Features enhanced vibe coding, efficient coding agent execution, and upgraded long-tail knowledge retention.

| Feature | Details |
|---------|---------|
| Model ID | `qwen3.6-max-preview` |
| Context window | 256,000 tokens (128K tier-one pricing) |
| Maximum output | 64K tokens |
| Input pricing | $1.30 / 1M tokens |
| Input pricing (above 128K) | $2.00 / 1M tokens |
| Cache creation | $1.625 / 1M tokens |
| Cache creation (above 128K) | $2.50 / 1M tokens |
| Cached input pricing | $0.13 / 1M tokens (90% cost reduction) |
| Cached input (above 128K) | $0.20 / 1M tokens |
| Output pricing | $7.80 / 1M tokens |
| Output pricing (above 128K) | $12.00 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Largest Qwen3.6 Model**: Most capable variant in the Qwen3.6 series
- **Enhanced Vibe Coding**: Stronger front-end development and coding agent execution
- **Long-Tail Knowledge**: Upgraded knowledge retention for specialized topics
- **256K Context Window**: Extended context for complex tasks
- **Deep Thinking**: Optional reasoning mode via `enable_thinking`

```python
response = client.chat.completions.create(
    model="qwen3.6-max-preview",
    messages=[
        {
            "role": "user",
            "content": "Build a polished Next.js landing page for a SaaS product with hero, features, testimonials, and pricing sections.",
        }
    ],
    max_tokens=8192,
)
```

---

## Qwen Plus Series

Balanced models offering excellent performance across diverse tasks, providing the optimal combination of capability and efficiency.

| Feature           | qwen-plus             | qwen-plus-latest      | qwen-plus-2025-09-11 | qwen-plus-2025-07-28 | qwen-plus-2025-07-14 | qwen-plus-2025-04-28 |
| ----------------- | --------------------- | --------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| Provider          | DashScope             | DashScope             | DashScope            | DashScope            | DashScope            | DashScope            |
| Owner             | Alibaba               | Alibaba               | Alibaba              | Alibaba              | Alibaba              | Alibaba              |
| Context Window    | 131,072 tokens        | 131,072 tokens        | 131,072 tokens       | 131,072 tokens       | 131,072 tokens       | 131,072 tokens       |
| Max Input Tokens  | 129,024               | 129,024               | 129,024              | 129,024              | 129,024              | 129,024              |
| Max Output Tokens | 16,384                | 16,384                | 16,384               | 16,384               | 16,384               | 16,384               |
| Strengths         | Balanced Performance  | Latest Features       | Enhanced Reasoning   | Previous Stable      | Stable Release       | Legacy Version       |
| Best for          | General-purpose tasks | Cutting-edge features | Advanced analysis    | Production use       | Stable production    | Legacy compatibility |

```python
# Example using Qwen Plus for general-purpose tasks
response = client.chat.completions.create(
    model="qwen-plus",
    messages=[
        {
            "role": "user",
            "content": "Explain the concept of machine learning to a beginner.",
        }
    ],
    max_tokens=500,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

## Qwen3 Max Series

Premium models designed for the most demanding applications, offering superior reasoning and complex problem-solving capabilities.

> **New:** The flagship `qwen3-max` model is now available for complex reasoning and agentic workflows. See the [June 5, 2026 update](en/news/2026-06-05-gemini-image-stable-and-qwen3-max-added.md) for details.

> **⚠️ Deprecation Notice:** The legacy `qwen-max` series (`qwen-max`, `qwen-max-latest`, `qwen-max-2025-01-25`) is being decommissioned by Alibaba between **May 13, 2026** and **May 31, 2026**. Please migrate to `qwen3.7-max`, `qwen3-max`, `qwen3.6-plus`, or `qwen3.6-max-preview`. See [Deprecations](en/deprecations.md) for details.

| Feature           | qwen3-max                            | qwen3-max-2026-01-23  | qwen3-max-preview    |
| ----------------- | ------------------------------------ | --------------------- | -------------------- |
| Provider          | DashScope                            | DashScope             | DashScope            |
| Owner             | Alibaba                              | Alibaba               | Alibaba              |
| Context Window    | 262,144 tokens                       | 262,144 tokens        | 262,144 tokens       |
| Max Input Tokens  | 258,048                              | 258,048               | 258,048              |
| Max Output Tokens | 32,768                               | 32,768                | 32,768               |
| Strengths         | Enhanced Agent Programming           | Latest Snapshot       | 1T+ Parameters       |
| Best for          | Agent programming, Complex scenarios | Production stability  | Most demanding tasks |

```python
# Example using Qwen3-Max for enhanced agent programming tasks
response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {
            "role": "user",
            "content": "Design an intelligent agent system that can autonomously manage complex multi-step workflows with tool invocation capabilities.",
        }
    ],
    max_tokens=2000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

# Example using Qwen3-Max-Preview for the most demanding tasks
response = client.chat.completions.create(
    model="qwen3-max-preview",
    messages=[
        {
            "role": "user",
            "content": "Perform a comprehensive analysis of quantum computing's potential impact on cryptography and data security.",
        }
    ],
    max_tokens=2000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

## Qwen 3.5 Series

Next-generation native vision-language models built on a hybrid architecture that integrates linear attention mechanisms with sparse mixture-of-experts, achieving higher inference efficiency with state-of-the-art performance.

| Feature           | qwen3.5-plus                         | qwen3.5-plus-2026-02-15              | qwen3.5-flash                        | qwen3.5-397b-a17b                    | qwen3.5-35b-a3b                      |
| ----------------- | ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| Provider          | DashScope                            | DashScope                            | DashScope                            | DashScope                            | DashScope                            |
| Owner             | Alibaba                              | Alibaba                              | Alibaba                              | Alibaba                              | Alibaba                              |
| Parameters        | Hosted                               | Hosted                               | Hosted                               | 397B total, 17B activated            | 35B total, 3B activated              |
| Context Window    | 1,000,000 tokens                     | 1,000,000 tokens                     | 1,000,000 tokens                     | 131,072 tokens                       | 131,072 tokens                       |
| Max Output Tokens | 32,768                               | 32,768                               | 16,384                               | 16,384                               | 16,384                               |
| Input Modalities  | Text, Image, Video                   | Text, Image, Video                   | Text, Image, Video                   | Text, Image, Video                   | Text, Image, Video                   |
| Strengths         | 1M context, built-in tools           | Stable version                       | 1M context, high efficiency          | Open-weight, strong agents           | Open-weight, lightweight MoE         |
| Best for          | Long context, multimodal agents      | Production deployments               | Cost-effective long context          | Open-source deployments              | Edge deployment, efficient inference |

**Key Features:**

- **Hybrid Architecture**: Integrates linear attention (via Gated Delta Networks) with sparse mixture-of-experts for higher inference efficiency
- **Native Vision-Language**: Process text, images, and videos natively
- **1M Context Window**: Extended context for qwen3.5-plus and qwen3.5-flash via Alibaba Cloud Model Studio
- **201 Languages**: Expanded language and dialect support from 119 to 201 languages
- **Built-in Tools**: Official adaptive tool use support for agentic workflows
- **Deep Thinking**: Advanced reasoning capabilities on par with leading frontier models
- **Open-Weight Models**: qwen3.5-397b-a17b and qwen3.5-35b-a3b are open-source under Apache 2.0

**Pricing:**

| Model | Input | Input >256K | Cache Creation | Cache Creation >256K | Cached Input | Cached Input >256K | Output | Output >256K |
|-------|-------|-------------|----------------|----------------------|--------------|-------------------|--------|--------------|
| qwen3.5-plus | $0.40/1M | $1.20/1M | $0.50/1M | $1.50/1M | $0.04/1M | $0.12/1M | $2.40/1M | $7.20/1M |
| qwen3.5-flash | $0.10/1M | $0.30/1M | $0.125/1M | $0.375/1M | $0.01/1M | $0.03/1M | $0.40/1M | $1.20/1M |
| qwen3.5-397b-a17b | $0.60/1M | - | - | - | $0.06/1M | - | $3.60/1M | - |
| qwen3.5-35b-a3b | $0.25/1M | - | - | - | $0.12/1M | - | $2.00/1M | - |

```python
# Example using Qwen3.5 Plus for multimodal agent tasks
response = client.chat.completions.create(
    model="qwen3.5-plus",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analyze this image and describe the key elements.",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.png"},
                },
            ],
        }
    ],
    max_tokens=2000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

# Example using Qwen3.5-397B for complex reasoning tasks
response = client.chat.completions.create(
    model="qwen3.5-397b-a17b",
    messages=[
        {
            "role": "user",
            "content": "Design a comprehensive software architecture for a distributed microservices system.",
        }
    ],
    max_tokens=4000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

# Example using Qwen3.5-Flash for cost-effective long context processing
response = client.chat.completions.create(
    model="qwen3.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key points from this lengthy document...",
        }
    ],
    max_tokens=2000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

# Example using Qwen3.5-35B-A3B for efficient open-weight inference
response = client.chat.completions.create(
    model="qwen3.5-35b-a3b",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe what you see in this image."},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.jpg"},
                },
            ],
        }
    ],
    max_tokens=1000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

## Web Search

The `qwen3-max` model supports real-time web search capabilities, allowing it to retrieve up-to-date information from the internet to answer questions about current events, stock prices, weather, and other real-time data that may not be in the model's training data.

> **Note**: As of December 2025, only `qwen3-max` and `qwen3-max-2025-09-23` models support the web search feature. The search strategy must be set to `agent` for international (Singapore) regions.

### How It Works

When you enable web search by passing `enable_search: true`, the model will:
1. Analyze if the user's question requires real-time information
2. If needed, perform a web search and use the results to generate a response
3. If not needed, use its own knowledge to answer

### Usage Example

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-max",
    "messages": [
        {
            "role": "user",
            "content": "What is Alibaba stock price"
        }
    ],
    "enable_search": true,
    "search_options": {"search_strategy": "agent"}
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {
            "role": "user",
            "content": "What is the weather forecast for tomorrow in New York?",
        }
    ],
    extra_body={"enable_search": True, "search_options": {"search_strategy": "agent"}},
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "qwen3-max",
  messages: [
    { role: "user", content: "What are the latest tech news today?" }
  ],
  enable_search: true,
  search_options: { search_strategy: "agent" }
});

console.log(response.choices[0].message.content);

```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `enable_search` | boolean | Set to `true` to enable web search. The model decides if a search is needed. |
| `search_options.search_strategy` | string | Must be set to `"agent"` for international regions. |

### Use Cases

- **Real-time stock prices**: Get current market data and stock information
- **Weather forecasts**: Retrieve up-to-date weather predictions for any location
- **Current events**: Answer questions about recent news and happenings
- **Sports scores**: Get live or recent game results
- **Product information**: Find current prices and availability

### Billing

Web search involves two cost components:
1. **Model call fees**: Web search results are added to the prompt, increasing input tokens. Standard model pricing applies.
2. **Search policy fees**: For the `agent` strategy in international regions, the fee is $10.00 per 1,000 calls.

## Vision-Language Models

Multimodal models capable of understanding and processing both text and visual inputs, enabling sophisticated image analysis and description tasks.

### Qwen3 VL Series

Next-generation vision-language models with enhanced capabilities for understanding images, videos, and text.

| Model                   | Context Window | Max Input | Max Output | Best for                         |
| ----------------------- | -------------- | --------- | ---------- | -------------------------------- |
| qwen3-vl-32b-instruct   | 131,072        | 129,024   | 8,192      | Open-source balanced VL tasks    |
| qwen3-vl-plus           | 131,072+       | 129,024+  | 8,192      | Long context, video, agent tasks |
| qwen3-vl-flash          | 131,072+       | 129,024+  | 8,192      | Fast, cost-effective VL tasks    |

**Key Features:**

- **Long Document Support**: Process documents with millions of tokens
- **Long Video Understanding**: Analyze videos up to 1 hour in length
- **OCR Capabilities**: Advanced text extraction from images
- **Agent Capabilities**: Image retrieval and tool use
- **Tiered Pricing**: Cost optimization based on context length

```python
# Example using Qwen3-VL-Plus for vision-language tasks
response = client.chat.completions.create(
    model="qwen3-vl-plus",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analyze this document and extract key information.",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/document.png"},
                },
            ],
        }
    ],
    extra_body={"enable_thinking": False},
)
```

### Qwen 2.5 VL Series

| Model                   | Context Window | Max Input | Max Output | Best for                   |
| ----------------------- | -------------- | --------- | ---------- | -------------------------- |
| qwen2.5-vl-72b-instruct | 131,072        | 129,024   | 8,192      | Complex vision tasks       |
| qwen2.5-vl-32b-instruct | 131,072        | 129,024   | 8,192      | Balanced vision processing |
| qwen2.5-vl-7b-instruct  | 131,072        | 129,024   | 8,192      | Efficient vision tasks     |
| qwen2.5-vl-3b-instruct  | 131,072        | 129,024   | 8,192      | Lightweight vision         |

### Qwen VL OCR

> **⚠️ Deprecation Notice:** The legacy `qwen-vl-max` and `qwen-vl-plus` series (including `-latest` and dated snapshots) are being decommissioned by Alibaba between **May 13, 2026** and **May 31, 2026**. Please migrate to the Qwen3 VL series (e.g., `qwen3-vl-plus`, `qwen3-vl-flash`) or Qwen 3.5 VL models. See [Deprecations](en/deprecations.md) for details.

| Model        | Context Window | Max Input | Max Output | Specialization                |
| ------------ | -------------- | --------- | ---------- | ----------------------------- |
| qwen-vl-ocr  | 34,096         | 30,000    | 4,096      | Optical character recognition |

```python
# Example using Qwen VL for image analysis
response = client.chat.completions.create(
    model="qwen2.5-vl-72b-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What objects do you see in this image and their approximate locations?",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
                    },
                },
            ],
        }
    ],
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

## Qwen 3 Series

Next-generation models with enhanced capabilities and improved performance across various tasks.

### Standard Qwen 3 Models

| Model      | Context Window | Max Input | Max Output | Parameters |
| ---------- | -------------- | --------- | ---------- | ---------- |
| qwen3-32b  | 131,072        | 98,304    | 16,384     | 32B        |
| qwen3-14b  | 131,072        | 98,304    | 8,192      | 14B        |
| qwen3-8b   | 131,072        | 98,304    | 8,192      | 8B         |
| qwen3-4b   | 131,072        | 98,304    | 8,192      | 4B         |
| qwen3-1.7b | 131,072        | 98,304    | 8,192      | 1.7B       |
| qwen3-0.6b | 131,072        | 98,304    | 8,192      | 0.6B       |

### Qwen 3 A3B Series

| Model                       | Context Window | Max Input | Max Output | Specialization                   |
| --------------------------- | -------------- | --------- | ---------- | -------------------------------- |
| qwen3-next-80b-a3b-thinking | 131,072        | 98,304    | 32,768     | Advanced reasoning with thinking |
| qwen3-next-80b-a3b-instruct | 131,072        | 98,304    | 32,768     | Enhanced instruction following   |
| qwen3-30b-a3b               | 131,072        | 98,304    | 32,768     | Advanced reasoning               |
| qwen3-30b-a3b-thinking-2507 | 131,072        | 98,304    | 32,768     | Thinking processes               |
| qwen3-30b-a3b-instruct-2507 | 131,072        | 98,304    | 32,768     | Instruction following            |

### Qwen 3 A22B Series

| Model                         | Context Window | Max Input | Max Output | Specialization        |
| ----------------------------- | -------------- | --------- | ---------- | --------------------- |
| qwen3-235b-a22b               | 131,072        | 131,072   | 32,768     | Large-scale reasoning |
| qwen3-235b-a22b-instruct-2507 | 131,072        | 131,072   | 32,768     | Advanced instructions |
| qwen3-235b-a22b-thinking-2507 | 131,072        | 131,072   | 32,768     | Complex thinking      |

## Specialized Models

### QWQ Plus Series (Reasoning Models)

| Model               | Context Window | Max Input | Max Output | Focus              |
| ------------------- | -------------- | --------- | ---------- | ------------------ |
| qwq-plus            | 131,072        | 131,072   | 8,192      | Advanced reasoning |
| qwq-plus-2025-03-05 | 131,072        | 131,072   | 8,192      | Stable reasoning   |

### Machine Translation Models

Professional translation models supporting 92 languages with high-quality bidirectional translation.

| Model         | Context Window | Max Input | Max Output | Specialization           |
| ------------- | -------------- | --------- | ---------- | ------------------------ |
| qwen-mt-plus  | 2,048          | 2,048     | 2,048      | Advanced translation     |
| qwen-mt-turbo | 2,048          | 2,048     | 2,048      | Fast translation         |
| qwen-mt-flash | 8,192          | 8,192     | 8,192      | High-quality translation |
| qwen-mt-lite  | 8,192          | 8,192     | 8,192      | Fast, cost-effective     |

**Key Features:**

- **92 Languages**: Support for major world languages including European, Asian, and Middle Eastern
- **Bidirectional**: Translate between any pair of supported languages
- **Direct Translation**: Translate between non-Chinese languages without intermediate Chinese
- **Persian/Farsi Support**: Full support for Persian, Dari, Arabic, Urdu, Turkish, and more

**Supported Languages Include:**
Arabic, Chinese (Simplified/Traditional), Dutch, English, French, German, Italian, Japanese, Korean, Persian, Portuguese, Russian, Spanish, Turkish, Vietnamese, and 77 more languages.

```python
# Example using Qwen-MT for translation
response = client.chat.completions.create(
    model="qwen-mt-flash",
    messages=[
        {"role": "system", "content": "Translate from English to Persian"},
        {
            "role": "user",
            "content": "Artificial intelligence is transforming the way we live and work.",
        },
    ],
    extra_body={"enable_thinking": False},
)
# Output: هوش مصنوعی در حال تغییر نحوه زندگی و کار ما است.
```

### Character/Role-Playing Models

Specialized models for creating consistent virtual character interactions with personality preservation.

| Model               | Context Window | Max Input | Max Output | Specialization                  |
| ------------------- | -------------- | --------- | ---------- | ------------------------------- |
| qwen-plus-character | 131,072        | 129,024   | 16,384     | Virtual characters, role-playing |

**Key Features:**

- **Character Consistency**: Maintain defined personalities, traits, and speech styles across conversations
- **Response Variety**: Avoid repetitive responses with style markers
- **Relationship Memory**: Preserve interaction history and relationship dynamics
- **Genre Flexibility**: Support for fantasy, sci-fi, romance, and modern scenarios

```python
# Example using Qwen-Plus-Character for virtual characters
response = client.chat.completions.create(
    model="qwen-plus-character",
    messages=[
        {
            "role": "system",
            "content": "You are a wise wizard named Merlin from a fantasy world. Speak with ancient wisdom and occasional riddles.",
        },
        {"role": "user", "content": "Merlin, how do I become a great sorcerer?"},
    ],
    extra_body={"enable_thinking": False},
)
```

### Long Context Models

| Model                   | Context Window | Max Input | Max Output | Specialization        |
| ----------------------- | -------------- | --------- | ---------- | --------------------- |
| qwen2.5-7b-instruct-1m  | 1,008,192      | 1,000,000 | 8,192      | Million-token context |
| qwen2.5-14b-instruct-1m | 1,008,192      | 1,000,000 | 8,192      | Extended context      |

### Coding Models

| Model                          | Context Window | Max Input | Max Output | Specialization                  |
| ------------------------------ | -------------- | --------- | ---------- | ------------------------------- |
| qwen3-coder-480b-a35b-instruct | 262,144        | 204,800   | 65,536     | Advanced coding                 |
| qwen3-coder-next               | 1,000,000      | 997,952   | 65,536     | Frontier coding agents (80B MoE)|
| qwen3-coder-flash              | 1,000,000      | 997,952   | 65,536     | Fast coding with tiered pricing |
| qwen3-coder-flash-2025-07-28   | 1,000,000      | 997,952   | 65,536     | Stable fast coding              |
| qwen3-coder-plus               | 1,000,000      | 997,952   | 65,536     | Code generation                 |
| qwen3-coder-plus-2025-07-22    | 1,000,000      | 997,952   | 65,536     | Latest coding                   |

**Qwen3-Coder-Next**

Qwen3-Coder-Next is a frontier 80B MoE (Mixture of Experts) model optimized for coding agents, featuring 10B activated parameters for efficient inference.

**Key Features:**

- **80B MoE Architecture**: Large-scale mixture of experts with 10B activated parameters
- **1M Context Window**: Extended context for large codebase understanding
- **Agentic Optimization**: Designed for autonomous coding workflows
- **High Efficiency**: Optimized inference with sparse activation

**Pricing:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| qwen3-coder-next | $0.30/1M | $0.15/1M | $1.50/1M |

```python
# Example using Qwen3-Coder-Next for agentic coding tasks
response = client.chat.completions.create(
    model="qwen3-coder-next",
    messages=[
        {
            "role": "user",
            "content": "Analyze this codebase and refactor the authentication module to use JWT tokens with refresh token rotation.",
        }
    ],
    max_tokens=8000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

# Example using Qwen Coder for programming tasks
response = client.chat.completions.create(
    model="qwen3-coder-plus",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to implement a binary search algorithm with proper error handling.",
        }
    ],
    max_tokens=1000,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

## Image Generation Models

Advanced image generation and editing models with dual SDK support, compatible with both OpenAI schema and native Alibaba Dashscope schema.

| Model               | Specialization                 | Cost per Image   | Resolution Options        | Best for                      |
| ------------------- | ------------------------------ | ---------------- | ------------------------- | ----------------------------- |
| qwen-image-2.0-pro  | Professional typography        | $0.075           | Native 2K (2048×2048)     | PPTs, posters, infographics   |
| qwen-image-2.0      | Unified generation/editing     | $0.035           | Native 2K (2048×2048)     | General image generation      |
| qwen-image          | Text-to-image generation       | $0.035           | 1:1, 4:3, 3:4, 16:9, 9:16 | Creative image generation     |
| qwen-image-edit     | Image editing and modification | $0.045           | Based on input image      | Image enhancement and editing |
| z-image-turbo       | Fast text-to-image             | $0.015 (std) / $0.030 (thinking) | 512×512 to 2048×2048 | Fast generation, text rendering |
| qwen-image-edit-plus | Advanced image editing        | $0.03            | Based on input image      | Professional editing, style transfer |

### qwen-image-2.0-pro

Alibaba's next-generation professional image generation model with advanced typography rendering, supporting 1K-token instructions for direct generation of professional infographics including PPTs, posters, and comics.

| Feature | Details |
|---------|---------|
| Model ID | `qwen-image-2.0-pro` |
| Resolution | Native 2K (2048×2048) |
| Input pricing | $0.00 / request |
| Output pricing | $75.00 / 1M tokens ($0.075 / image) |
| Input modalities | Text, Image |
| Output modalities | Image |
| Supported endpoints | `/v1/images/generations`, `/v1/images/edits` |

**Key Features:**
- **Professional Typography**: 1K-token instruction support for PPTs, posters, and infographics
- **Complex Layout**: Pixel-perfect multi-script layout with sophisticated text-image composition
- **Native 2K Resolution**: 2048×2048 for finely detailed realistic scenes
- **Unified Model**: Generation and editing in a single model
- **Photorealism**: Microscopic detail on skin pores, fabric weave, architectural textures
- **Multiple Calligraphic Styles**: Support for various script styles and fonts
- **Image Editing**: Full support for image-to-image editing tasks

```python
# Generate professional infographic with Qwen-Image-2.0-Pro
response = client.images.generate(
    model="qwen-image-2.0-pro",
    prompt="A professional business presentation slide showing Q4 revenue growth with clean typography and modern design",
    size="1024x1024",
    n=1,
)
print(response.data[0].url)
```

### qwen-image-2.0

The standard version of Qwen-Image-2.0, offering the same advanced capabilities at a more accessible price point.

| Feature | Details |
|---------|---------|
| Model ID | `qwen-image-2.0` |
| Resolution | Native 2K (2048×2048) |
| Input pricing | $0.00 / request |
| Output pricing | $35.00 / 1M tokens ($0.035 / image) |
| Input modalities | Text, Image |
| Output modalities | Image |
| Supported endpoints | `/v1/images/generations`, `/v1/images/edits` |

**Key Features:**
- **Typography Rendering**: Support for professional text-in-image generation
- **Native 2K Resolution**: High-quality image output
- **Unified Model**: Generation and editing capabilities combined
- **Strong Semantic Adherence**: Accurate prompt following
- **Lighter Architecture**: Smaller model size with faster inference
- **Cost-Effective**: Accessible pricing for high-volume usage

```python
# Generate image with Qwen-Image-2.0
response = client.images.generate(
    model="qwen-image-2.0",
    prompt="A serene mountain landscape at sunset with 'Peace' written in elegant calligraphy",
    size="1024x1024",
    n=1,
)
print(response.data[0].url)
```

### z-image-turbo

Fast, high-quality image generation model optimized for speed with excellent text rendering.

**Key Features:**

- **High-Speed Generation**: Optimized for fast production workflows
- **Improved Text Rendering**: Better character consistency and text generation
- **Crown Support**: Add logos or watermarks to generated images
- **Flexible Sizes**: 42 preset ratios plus custom sizes (512×512 to 2048×2048)
- **Thinking Mode**: Optional enhanced generation at $0.030 per image

```python
# Example using z-image-turbo
response = client.images.generate(
    model="z-image-turbo",
    prompt="A professional logo with text 'AI TECH' in modern minimalist style",
    size="1024x1024",
    n=1,
)
```

### qwen-image-edit-plus

Advanced image editing model supporting complex operations including background removal, inpainting, and style transfer.

**Key Features:**

- **Background Removal**: Isolate subjects from backgrounds
- **Image Inpainting**: Fill or replace selected areas
- **Style Transfer**: Apply artistic styles to images
- **Search & Recolor**: Change colors in specific regions
- **Control Structure**: Maintain structural consistency in edits

```python
# Example using qwen-image-edit-plus for background removal
import requests

with open("input_image.png", "rb") as image_file:
    response = requests.post(
        "https://api.avalai.ir/v1/images/edits",
        headers={"Authorization": f"Bearer {api_key}"},
        files={"image": image_file},
        data={
            "model": "qwen-image-edit-plus",
            "prompt": "Remove the background and keep only the main subject",
        },
    )
```

### Key Features

- **Dual SDK Support**: Compatible with OpenAI SDK format and native Dashscope API
- **Multiple Resolutions**: Support for various aspect ratios (1328×1328, 1664×928, 1472×1140, 1140×1472, 928×1664)
- **Advanced Parameters**: Negative prompts, intelligent prompt rewriting, watermark control, seed support
- **High Quality**: Professional-grade image generation with customizable parameters

### Usage Examples

```python
# Text-to-image generation using OpenAI SDK format
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="qwen-image",
    prompt="A serene mountain landscape with a crystal clear lake reflecting snow-capped peaks",
    size="1328x1328",
    n=1,
    response_format="url",  # or b64_json
)

print(response.data[0].url)

# Image editing using OpenAI SDK format
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
```

### Native Dashscope Format

```python
# Using native Dashscope schema for advanced parameters
import requests

response = requests.post(
    "https://api.avalai.ir/v1/images/generations",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "qwen-image",
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "text": "A professional headshot of a confident business person in modern office setting"
                        }
                    ],
                }
            ]
        },
        "parameters": {
            "size": "1328*1328",
            "prompt_extend": True,
            "watermark": False,
            "negative_prompt": "blurry, low quality, distorted",
        },
    },
)

print(response.json())
```
## Embedding Models

Advanced embedding models for text and multimodal content, supporting semantic search, similarity calculation, and content classification.

### Text Embedding Models

| Model             | Vector Dimensions     | Max Tokens | Specialization                     | Pricing (per 1M tokens) |
| ----------------- | --------------------- | ---------- | ---------------------------------- | ----------------------- |
| text-embedding-v4 | 64-2,048 (configurable) | 8,192      | Latest generation, task instructions, sparse vectors | $0.07     |
| text-embedding-v3 | 512-1,024 (configurable) | 8,192      | Previous generation, proven performance               | $0.07     |

#### text-embedding-v4

The latest generation text embedding model with advanced features:

**Key Features:**
- **Configurable Dimensions**: 2,048, 1,536, 1,024 (default), 768, 512, 256, 128, 64
- **Task Instructions (instruct)**: Optimize vector quality for specific retrieval scenarios
- **Text Type Differentiation**: Separate embeddings for query vs document text
- **Dense & Sparse Vectors**: Generate both types for hybrid search
- **Batch Processing**: Process up to 10 texts per request

**Use Cases:**
- Semantic search and retrieval
- AI chat and content recommendation
- High-quality production search engines
- Classification and clustering

**Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "text-embedding-v4",
    "input": "Machine learning is transforming technology",
    "dimensions": 1024
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    model="text-embedding-v4",
    input="Machine learning is transforming technology",
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
  input: "Machine learning is transforming technology",
  dimensions: 1024,
});

console.log(response.data[0].embedding);

```

**Advanced Features with Native API:**

```python
# Using extra_body for advanced features
response = client.embeddings.create(
    model="text-embedding-v4",
    input="Research papers on machine learning",
    dimensions=1024,
    extra_body={
        "text_type": "query",  # or "document"
        "instruct": "Given a research paper query, retrieve relevant research papers",
    },
)
```

#### text-embedding-v3

Previous generation text embedding model with proven performance:

**Key Features:**
- **Configurable Dimensions**: 1,024 (default), 768, 512
- **Reliable Performance**: Tested across 50+ languages
- **Batch Processing**: Process up to 10 texts per request

### Multimodal Embedding Models

| Model                        | Vector Dimensions | Max Text Tokens | Image/Video Support | Pricing (per 1M tokens) |
| ---------------------------- | ----------------- | --------------- | ------------------- | ----------------------- |
| tongyi-embedding-vision-plus | 1,152             | 1,024           | Images & Videos     | $0.09                   |
| tongyi-embedding-vision-flash | 768               | 1,024           | Images & Videos     | Image/Video: $0.03, Text: $0.09 |

#### tongyi-embedding-vision-plus

Advanced multimodal embedding model supporting text, images, and videos:

**Key Features:**
- **Cross-Modal Retrieval**: Text-to-image, image-to-video, image-to-image search
- **Semantic Similarity**: Calculate similarity across different modalities
- **Multiple Inputs**: Support up to 8 images per request
- **Video Support**: Process videos up to 10 MB (MP4, MPEG, AVI, MOV, MPG, WEBM, FLV, MKV)
- **Image Formats**: JPG, PNG, BMP (Base64 or URL)

**Use Cases:**
- Cross-modal semantic search
- Video classification and analysis
- Image search using text or other images
- Content classification and clustering

**Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
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

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using extra_body for native Alibaba format
response = client.embeddings.create(
    model="tongyi-embedding-vision-plus",
    input="placeholder",  # Required by OpenAI SDK
    extra_body={
        "input": {
            "contents": [
                {"text": "A beautiful sunset over mountains"},
                {
                    "image": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
                },
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

// Note: For multimodal embeddings, use native HTTP requests
const response = await fetch("https://api.avalai.ir/v1/embeddings", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "tongyi-embedding-vision-plus",
        input: {
            contents: [
                { text: "A beautiful sunset over mountains" },
                { image: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png" }
            ]
        }
    })
});

const result = await response.json();
console.log(result.data[0].embedding);

```

#### tongyi-embedding-vision-flash

Fast multimodal embedding model optimized for speed:

**Key Features:**
- **High Speed**: Optimized for fast processing
- **Multimodal Support**: Text, images, and videos
- **Cost-Effective**: Lower pricing for image/video processing
- **Same Capabilities**: Similar features to vision-plus with faster inference

**Pricing:**
- Image/Video tokens: $0.03 per 1M tokens
- Text tokens: $0.09 per 1M tokens

### Embedding Best Practices

1. **Dimension Selection**:
   - Use 1024 dimensions for optimal balance of performance and cost
   - Use higher dimensions (1536, 2048) for domains requiring high precision
   - Use lower dimensions (768 or below) for cost-sensitive scenarios

2. **Text Type Differentiation** (text-embedding-v4 only):
   - Use `text_type: "query"` for user search queries
   - Use `text_type: "document"` for documents in your database

3. **Task Instructions** (text-embedding-v4 only):
   - Provide clear English instructions to optimize vector quality
   - Example: "Given a research paper query, retrieve relevant research papers"

4. **Multimodal Embeddings**:
   - All modalities generate vectors in the same semantic space
   - Calculate cosine similarity directly between different modalities
   - Use vision-flash for high-volume applications

5. **Batch Processing**:
   - Process multiple texts in a single request (up to 10)
   - Each text must not exceed token limits

### Related Resources

- [Embeddings and Retrieval Guide](en/guides/retrieval.md)
- [Provider-Specific Parameters](en/guides/provider-specific-params.md)
- [Vision Capabilities Guide](en/guides/vision.md)

## Rerank Models

Rerank models perform more accurate sorting of retrieved documents to ensure the most relevant results appear at the top, essential for RAG applications and semantic search.

| Model | Max Documents | Max Tokens per Item | Max Tokens per Request | Languages | Pricing (per 1M tokens) |
|-------|---------------|---------------------|------------------------|-----------|-------------------------|
| qwen3-rerank | 500 | 4,000 | 30,000 | 100+ languages | $0.10 |

### qwen3-rerank

A text-ranking model trained on the Qwen LLM foundation that performs relevance ranking for input queries and candidate documents. It supports over 100 languages and long-text inputs.

**Key Features:**
- **High-Accuracy Ranking**: Precise relevance scoring for documents
- **Multilingual Support**: 100+ languages including Chinese, English, Spanish, French, Portuguese, Indonesian, Japanese, Korean, German, and Russian
- **Long Text Support**: Up to 4,000 tokens per document
- **RAG Optimized**: Designed for Retrieval-Augmented Generation pipelines
- **Prompt Caching**: Supports cached input for cost savings

**Use Cases:**
- Text semantic retrieval
- RAG applications
- Search result re-ranking
- Document relevance scoring

**Pricing:**

| Type | Cost |
|------|------|
| Input Tokens | $0.10 per 1M tokens |
| Cached Input Tokens | $0.0035 per 1M tokens |

**Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-rerank",
    "query": "What is machine learning?",
    "documents": [
      "Machine learning is a field of study...",
      "Deep learning is a subset of machine learning...",
      "Apples are a type of fruit..."
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using the rerank endpoint
import requests

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={
        "Authorization": f"Bearer {client.api_key}",
        "Content-Type": "application/json",
    },
    json={
        "model": "qwen3-rerank",
        "query": "What is machine learning?",
        "documents": [
            "Machine learning is a field of study...",
            "Deep learning is a subset of machine learning...",
            "Apples are a type of fruit...",
        ],
    },
)

print(response.json())

```

**Example Response:**

```json
{
  "model": "qwen3-rerank",
  "results": [
    {
      "index": 1,
      "relevance_score": 0.98,
      "document": {
        "text": "Deep learning is a subset of machine learning..."
      }
    },
    {
      "index": 0,
      "relevance_score": 0.95,
      "document": {
        "text": "Machine learning is a field of study..."
      }
    },
    {
      "index": 2,
      "relevance_score": 0.01,
      "document": {
        "text": "Apples are a type of fruit..."
      }
    }
  ],
  "usage": {
    "total_tokens": 45
  }
}
```

### Related Resources

- [Rerank API Reference](en/api-reference/rerank.md)
- [RAG Best Practices](en/guides/rag-best-practices.md)
- [Retrieval Guide](en/guides/retrieval.md)

## API Endpoints and Integration

### Primary Support: Chat Completions API

All Alibaba models are fully supported on the `v1/chat/completions` endpoint with complete feature compatibility including:

- Function calling and tool use
- Streaming responses
- System messages
- Temperature and other generation parameters
- Multimodal inputs (for vision models)

### Limited Support: Messages API

Basic text generation is available on the `v1/messages` endpoint for simple use cases, though full feature support is recommended via the Chat Completions API.

## Usage Examples

### Basic Text Generation

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="qwen-plus",
    messages=[
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    max_tokens=500,
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)

print(response.choices[0].message.content)
```

### Multimodal Processing

```python
# Vision-language model example
response = client.chat.completions.create(
    model="qwen2.5-vl-72b-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this chart and its key insights."},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/chart.png"},
                },
            ],
        }
    ],
    extra_body={"enable_thinking": False},  # Required for non-streaming requests
)
```

### Streaming Response

```python
# Streaming example (enable_thinking can be omitted or set to False for standard streaming)
stream = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {
            "role": "user",
            "content": "Write a detailed analysis of renewable energy trends.",
        }
    ],
    stream=True,
    # Optional: extra_body={"enable_thinking": True} only if you need thinking mode
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

## Best Practices

1. **Model Selection**: Choose models based on your specific needs:

   - Use **Flash** (e.g., `qwen-flash`, `qwen3.6-flash`) for high-throughput applications requiring speed
   - Use **Plus** (e.g., `qwen-plus`, `qwen3.6-plus`) for balanced performance across general tasks
   - Use **Qwen3 Max** (e.g., `qwen3.7-max`, `qwen3-max`, `qwen3.6-max-preview`) for complex reasoning, agentic workflows, and long-horizon execution
   - Use **Qwen3 VL models** for tasks involving images
   - Use **Coder models** for programming-related tasks

2. **Context Management**: Be mindful of context windows when processing long documents or conversations.

3. **API Optimization**: Use the Chat Completions API for full feature support and the Messages API only for simple text generation.

4. **Version Management**: Use specific dated versions for production applications requiring consistency.

## Pricing Information

For detailed pricing information including input costs, output costs, and cache read pricing for all Alibaba models, please refer to our comprehensive [Model Details](en/models/model-details.md) documentation.

## Related Resources

- [Chat Completions API Reference](en/api-reference/chat.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Model Details and Pricing](en/models/model-details.md)
- [Authentication Guide](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)
- [Vision Guide](en/guides/vision.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [DashScope Official Console](https://dashscope.console.aliyun.com/)
