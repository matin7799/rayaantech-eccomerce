# Anthropic Models

AvalAI provides seamless access to Anthropic's Claude models through multiple approaches. You can choose between OpenAI-compatible SDKs (unified approach) or Anthropic's official SDKs (native approach). This page details the available Anthropic models, their capabilities, and optimal use cases. As of June 2025, Anthropic's official SDKs can also be used to access models from other providers like OpenAI, AWS Bedrock, Vertex AI, and Gemini.

## SDK Options

### OpenAI-Compatible SDKs (Unified Approach)

Use familiar OpenAI client libraries to access Claude models alongside other providers through AvalAI's unified API.

### Anthropic Official SDKs (Native Approach)

Use Anthropic's official SDKs for a native experience with full access to Anthropic-specific features and the latest capabilities. As of June 2025, Anthropic SDKs can now be used to access models from multiple providers, not just Claude models.

?> AvalAI now supports both approaches, giving you the flexibility to choose the integration method that best fits your needs.

## Extended Context Window Support

?> **1 Million Token Context Window**: Select Anthropic Claude models now support an extended context window of up to 1 million tokens. This capability is currently achieved by setting custom headers in your API requests.

### Models Supporting 1M Context

Currently, **Claude Opus 4.8**, **Claude Opus 4.7**, **Claude Opus 4.6**, **Claude Sonnet 4.6**, and **Claude Sonnet 4.5** support the extended 1 million token context window through the beta header `context-1m-2025-08-07`. Note: Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6 have native 1M token support without requiring the beta header (Opus 4.8 ships with native 1M context by default on the Claude API).

### Enabling Extended Context

**For Direct API Calls:**

Simply append the header to your HTTP request:

```bash
curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-avalai-api-key" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Your prompt here"}]
  }'
```

**For OpenAI SDK:**

Use the `extra_headers` parameter when creating chat completions:

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer specializing in code refactoring.",
        },
        {
            "role": "user",
            "content": "Refactor this multi-file Python project to improve maintainability and add proper error handling.",
        },
    ],
    extra_headers={"anthropic-beta": "context-1m-2025-08-07"},
)
```

## Anthropic Beta Features

Anthropic provides several beta features that can be accessed through custom headers. Below is a table of currently supported beta features and their corresponding headers:

| Beta Feature | Beta Header | Notes |
|--------------|-------------|-------|
| Computer use | `computer-use-2025-01-24` | Compatible with the latest Claude 4.5+ models. |
| Tool use | `token-efficient-tools-2025-02-19` | Compatible with the latest Claude 4.5+ models. |
| Interleaved thinking | `Interleaved-thinking-2025-05-14` | Compatible with the latest Claude 4.5+ models. |
| Enables output tokens up to 128K | `output-128k-2025-02-19` | Compatible with Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6. |
| 1 million tokens | `context-1m-2025-08-07` | Compatible with Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 4.6, and Claude Sonnet 4.5. |
| Context management | `context-management-2025-06-27` | Compatible with Claude Sonnet 4.5 and Claude Haiku 4.5. |

To use any of these beta features, include the appropriate header in your API requests using the same methods shown in the Extended Context Window section above.

## Available Claude Models

### Base Model Namespaces with Smart Routing

AvalAI now supports simplified base model namespaces that enable smart routing across all official Anthropic cloud providers (Anthropic Claude.ai, AWS Bedrock, Google Cloud Platform, and Microsoft Azure). This intelligent load distribution delivers significantly higher rate limits compared to single-provider access.

**Available Base Model Names:**

| Base Model | AWS Bedrock Equivalent | Context Window |
|------------|------------------------|----------------|
| `claude-opus-4-8` | `global.anthropic.claude-opus-4-8` | 1M tokens |
| `claude-opus-4-7` | `global.anthropic.claude-opus-4-7` | 1M tokens |
| `claude-opus-4-6` | `anthropic.claude-opus-4-6-v1` | 1M tokens (beta) |
| `claude-sonnet-4-6` | `anthropic.claude-sonnet-4-6-v1` | 1M tokens (beta) |
| `claude-sonnet-4-5` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | 200K tokens |
| `claude-haiku-4-5` | `anthropic.claude-haiku-4-5-20251001-v1:0` | 200K tokens |

**Benefits of Base Model Namespaces:**
- **Higher Rate Limits**: Up to 10x more requests per minute through multi-cloud distribution
- **Improved Availability**: Automatic failover across providers
- **Same Pricing**: Identical pricing to direct AWS Bedrock access
- **Simple Migration**: Just change the model name - no other code changes required

**Example Usage:**

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use base model namespace for smart routing
response = client.chat.completions.create(
    model="claude-opus-4-8",  # Smart routing across all providers
    messages=[{"role": "user", "content": "Hello!"}],
)
```

?> Both the base model namespaces and full AWS Bedrock model IDs remain supported. We recommend migrating to base model namespaces for improved rate limits and availability.

### Claude Opus 4.8

Claude Opus 4.8 is Anthropic's most capable generally available model to date. It builds on Opus 4.7 with improvements across long-horizon agentic coding, reasoning effort calibration, tool triggering, and honesty. Opus 4.8 ships with native 1M token context by default, 128K max output tokens, adaptive thinking, mid-conversation system messages, refusal stop details, and a lower 1,024-token cacheable prompt minimum. Pricing for regular usage is unchanged from Opus 4.7.

| Feature | Details |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Context window | 1,000,000 tokens (native) |
| Training data | Up to May 2026 |
| Input pricing | $5.00 / 1M tokens |
| Cached input pricing | $1.50 / 1M tokens |
| Cache creation pricing | $6.25 / 1M tokens |
| Output pricing | $25.00 / 1M tokens |
| Strengths | Long-horizon agentic coding, reasoning effort calibration, better tool triggering, increased honesty, mid-conversation system messages, adaptive thinking, 5 effort levels (low/medium/high/xhigh/max), 128K output tokens, refusal stop details |
| Best for | Codebase-scale migrations, multi-service refactoring, long-running agentic loops, deep research, knowledge work, analyses where reliability and honesty matter |

**Key Improvements over Opus 4.7:**
- **Long-horizon agentic coding**: Better long-context handling, fewer compactions, and better compaction recovery for very large-scale tasks
- **Reasoning effort calibration**: More reliable behavior at each effort level across a range of domains
- **Better tool triggering**: Fewer cases of skipping a tool call that the task required, fixes comment-verbosity and tool-calling issues seen with Opus 4.7
- **Increased honesty**: Approximately 4× less likely than Opus 4.7 to allow flaws in code it has written to pass unremarked, with more reliable flagging of uncertainty
- **Mid-conversation system messages**: Append updated `role: "system"` messages mid-conversation while preserving prompt cache hits and reducing input cost on agentic loops
- **Refusal stop details**: Publicly documented `stop_details` object on refusal responses for routing different classes of declined requests
- **Lower prompt cache minimum**: 1,024-token minimum cacheable prompt length (down from Opus 4.7), enabling cache entries for shorter prompts
- **Effort defaults**: Default effort is now `high` on all surfaces (Claude API and Claude Code)
- **Strong computer use & browser agents**: 84% on Online-Mind2Web, a meaningful jump over Opus 4.7
- **Improved alignment**: Substantially lower rates of misaligned behavior versus Opus 4.7 and stronger prosocial traits

**Endpoint Support:** Available on `v1/chat/completions` (full support), `v1/messages` (full support), and `v1/responses` (partial support).

**API constraints inherited from Opus 4.7 (unchanged):** Sampling parameters (`temperature`, `top_p`, `top_k`) are not supported on the Messages API; setting non-default values returns a 400 error. Extended thinking budgets are not supported — use `thinking: {"type": "adaptive"}` together with the `effort` parameter to control thinking depth.

**OpenAI-Compatible SDK:**

```python
response = client.chat.completions.create(
    model="claude-opus-4-8",  # Requires Tier 1+ account - read more https://docs.avalai.ir/rate-limits
    messages=[
        {
            "role": "system",
            "content": "You are an autonomous coding agent specialized in long-running, codebase-scale migrations.",
        },
        {
            "role": "user",
            "content": "Plan and execute a migration of this monorepo to a shared error-handling middleware across all services.",
        },
    ],
)
```

**Anthropic Official SDK:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-8",  # Requires Tier 1+ account - read more https://docs.avalai.ir/rate-limits
    max_tokens=4096,
    system="You are an autonomous coding agent specialized in long-running, codebase-scale migrations.",
    messages=[
        {
            "role": "user",
            "content": "Plan and execute a migration of this monorepo to a shared error-handling middleware across all services.",
        }
    ],
)
```

### Claude Opus 4.7

Claude Opus 4.7 is Anthropic's most capable generally available model, highly autonomous and performing exceptionally well on long-horizon agentic work, knowledge work, vision tasks, and memory tasks. It is a notable improvement over Opus 4.6 in advanced software engineering, with particular gains on the most difficult tasks. The model features high-resolution vision support (up to 2,576px / 3.75MP), a new `xhigh` effort level, and task budgets in beta.

| Feature | Details |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Context window | 1,000,000 tokens |
| Training data | Up to April 2026 |
| Input pricing | $5.00 / 1M tokens |
| Cached input pricing | $1.50 / 1M tokens |
| Cache creation pricing | $6.25 / 1M tokens |
| Output pricing | $25.00 / 1M tokens |
| Strengths | Advanced software engineering, high-resolution vision, instruction following, file-system memory, adaptive thinking, 5 effort levels (low/medium/high/xhigh/max), task budgets, 128K output tokens |
| Best for | Complex coding projects, agentic workflows, long-horizon tasks, knowledge work, high-resolution vision tasks, multi-file refactoring, research applications |

**Key Improvements over Opus 4.6:**
- **Advanced Software Engineering**: Notable improvement on the most difficult coding tasks, with complex long-running tasks handled with rigor and consistency
- **High-Resolution Vision**: Accepts images up to 2,576 pixels on the long edge (~3.75 megapixels), more than three times prior models
- **New `xhigh` Effort Level**: Finer control over reasoning vs latency tradeoff between `high` and `max`
- **Task Budgets (Beta)**: Advisory token budgets across full agentic loops
- **Improved Instruction Following**: Substantially better at following instructions literally
- **File System Memory**: Better at writing and using file-system-based memory across sessions
- **Smart Routing**: Distributed across Anthropic API, AWS Bedrock, Azure AI, and Vertex AI

**OpenAI-Compatible SDK:**

```python
response = client.chat.completions.create(
    model="claude-opus-4-7",  # Requires Tier 1+ account - read more https://docs.avalai.ir/rate-limits
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer specializing in complex codebase analysis.",
        },
        {
            "role": "user",
            "content": "Analyze this multi-file application and suggest architectural improvements for better maintainability.",
        },
    ],
)
```

**Anthropic Official SDK:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-7",  # Requires Tier 1+ account - read more https://docs.avalai.ir/rate-limits
    max_tokens=4096,
    system="You are an expert software engineer specializing in complex codebase analysis.",
    messages=[
        {
            "role": "user",
            "content": "Analyze this multi-file application and suggest architectural improvements for better maintainability.",
        }
    ],
)
```

### Claude Opus 4.6

Claude Opus 4.6 is Anthropic's most powerful model upgrade, improving on its predecessor's coding skills with better planning, sustained agentic tasks, reliable operation in larger codebases, and enhanced debugging capabilities. It features a 1M token context window in beta, state-of-the-art performance on Terminal-Bench 2.0, Humanity's Last Exam, and GDPval-AA benchmarks.

| Feature | Details |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Context window | 1,000,000 tokens (beta) |
| Training data | Up to February 6, 2026 |
| Input pricing | $5.00 / 1M tokens |
| Cached input pricing | $1.50 / 1M tokens |
| Cache creation pricing | $6.25 / 1M tokens |
| Output pricing | $25.00 / 1M tokens |
| Premium pricing (above 200K) | $10.00 / $37.50 / 1M tokens (input/output) |
| Strengths | Enhanced agentic coding, 1M context window, agent teams, adaptive thinking, context compaction, 128K output tokens |
| Best for | Complex coding projects, agentic workflows, long-context tasks, multi-file refactoring, debugging large codebases, research applications |

**Key Improvements over the previous Opus generation:**
- **Enhanced Coding**: Better planning, sustained agentic tasks for longer, reliable operation in larger codebases, improved code review and debugging
- **1M Token Context (Beta)**: Opus-class model with 1M token context window and significantly reduced context rot
- **Agent Teams**: Spin up multiple agents working in parallel and coordinating autonomously (Claude Code)
- **Adaptive Thinking**: Model can decide when deeper reasoning is helpful
- **Effort Controls**: Four effort levels (low, medium, high, max) for developers
- **Context Compaction**: Automatic summarization to perform longer tasks without hitting limits
- **128K Output Tokens**: Support for larger output generation

**OpenAI-Compatible SDK:**

```python
response = client.chat.completions.create(
    model="claude-opus-4-6",  # Requires Tier 1+ account - read more https://docs.avalai.ir/rate-limits
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer specializing in complex codebase analysis.",
        },
        {
            "role": "user",
            "content": "Analyze this multi-file application and suggest architectural improvements for better maintainability.",
        },
    ],
)
```

**Anthropic Official SDK:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-opus-4-6",  # Requires Tier 1+ account - read more https://docs.avalai.ir/rate-limits
    max_tokens=4096,
    system="You are an expert software engineer specializing in complex codebase analysis.",
    messages=[
        {
            "role": "user",
            "content": "Analyze this multi-file application and suggest architectural improvements for better maintainability.",
        }
    ],
)
```

### Claude Sonnet 4.6

Claude Sonnet 4.6 is Anthropic's most capable Sonnet model, delivering a full upgrade of skills across coding, computer use, long-context reasoning, agent planning, knowledge work, and design. It features a 1M token context window in beta and approaches Opus-level intelligence at Sonnet pricing on real-world, economically valuable tasks.

| Feature | Details |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Context window | 1,000,000 tokens (beta) |
| Training data | Up to February 19, 2026 |
| Input pricing | $3.00 / 1M tokens |
| Cached input pricing | $1.50 / 1M tokens |
| Cache creation pricing | $3.75 / 1M tokens |
| Output pricing | $15.00 / 1M tokens |
| Strengths | Full model upgrade, 1M context window, computer use excellence, Opus-class performance at Sonnet pricing, coding improvements, adaptive thinking |
| Best for | Complex coding, computer use automation, long-context tasks, agent development, knowledge work, design tasks |

**Key Improvements over Sonnet 4.5:**
- **Full Model Upgrade**: Improvements across coding, computer use, long-context reasoning, agent planning, knowledge work, and design
- **1M Token Context (Beta)**: Extended context for entire codebases, lengthy contracts, or dozens of research papers
- **Computer Use Excellence**: Major improvement over prior Sonnet models with enhanced prompt injection resistance
- **Opus-Class Performance**: Approaches Opus-level intelligence at Sonnet pricing on economically valuable office tasks
- **Coding Excellence**: 70% preference over Sonnet 4.5 in Claude Code, better context reading, consolidates shared logic
- **Efficient Opus-class performance**: Delivers near-Opus intelligence at Sonnet pricing with less overengineering and lower latency
- **Adaptive Thinking**: Supports both adaptive thinking and extended thinking
- **Context Compaction**: Beta support for automatic summarization as conversations approach limits
- **Endpoint Support**: Available on v1/chat/completions (full support), v1/messages (full support), and v1/responses (partial support)

**OpenAI-Compatible SDK:**

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer specializing in code review and refactoring.",
        },
        {
            "role": "user",
            "content": "Review this codebase and suggest improvements for better maintainability.",
        },
    ],
)
```

**Anthropic Official SDK:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    system="You are an expert software engineer specializing in code review and refactoring.",
    messages=[
        {
            "role": "user",
            "content": "Review this codebase and suggest improvements for better maintainability.",
        }
    ],
)
```

### Claude Sonnet 4.5

Claude Sonnet 4.5 is Anthropic's advanced model for building complex agents that can work independently for extended periods. It advances the frontier in coding capabilities, achieves state-of-the-art performance in computer use, and excels at powering agents for financial analysis, cybersecurity, and research applications.

| Feature | Details |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Context window | 200,000 tokens |
| Training data | Up to September 29, 2025 |
| Input pricing | $3.00 / 1M tokens |
| Cached input pricing | $0.30 / 1M tokens |
| Output pricing | $15.00 / 1M tokens |
| Strengths | Best coding model to date, extended autonomous operation, enhanced tool usage, advanced context management, creative content generation |
| Best for | Complex agent development, extended autonomous tasks, advanced coding projects, financial analysis, cybersecurity applications, research |

**Key Improvements over earlier Sonnet models:**
- **Coding Excellence**: Advanced state-of-the-art on SWE-bench Verified, enhanced planning and system design, improved security engineering
- **Agent Capabilities**: Extended autonomous operation for hours, context awareness with token usage tracking, enhanced tool usage with parallel calls
- **Communication Style**: Refined, concise, and direct communication with fact-based progress updates
- **Creative Content**: Produces high-quality presentations and animations with strong first-attempt results

**OpenAI-Compatible SDK:**

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer specializing in code refactoring.",
        },
        {
            "role": "user",
            "content": "Refactor this multi-file Python project for better maintainability and add proper error handling.",
        },
    ],
)
```

**Anthropic Official SDK:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    system="You are an expert software engineer specializing in code refactoring.",
    messages=[
        {
            "role": "user",
            "content": "Refactor this multi-file Python project for better maintainability and add proper error handling.",
        }
    ],
)
```

### Claude Haiku 4.5

Claude Haiku 4.5 is Anthropic's latest fast and cost-efficient small model, delivering near-frontier coding performance with exceptional speed. It provides strong coding quality at a lower price point, making it ideal for real-time applications and high-throughput workloads.

| Feature | Details |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Context window | 200,000 tokens |
| Training data | Up to October 2025 |
| Input pricing | $1.00 / 1M tokens |
| Output pricing | $5.00 / 1M tokens |
| Strengths | Near-frontier coding quality, exceptional speed, cost efficiency, strong computer-use capabilities |
| Best for | Real-time chat assistants, customer service, pair programming, agentic workflows, cost-sensitive production deployments |

**Key Capabilities:**
- **Coding Performance**: Near-frontier coding quality suitable for pair programming and rapid iteration
- **Speed**: Fast responses for responsive user experiences and multi-agent orchestration
- **Computer Use**: Strong computer-use skills for agentic workflows
- **Cost Efficiency**: Most economical Claude option among the latest supported models
- **Endpoint Support**: Available on v1/chat/completions and v1/messages

**OpenAI-Compatible SDK:**

```python
response = client.chat.completions.create(
    model="claude-haiku-4-5",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {
            "role": "user",
            "content": "Write a Python function to validate email addresses using regex.",
        },
    ],
)
```

**Anthropic Official SDK:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=1000,
    system="You are a helpful coding assistant.",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to validate email addresses using regex.",
        }
    ],
)
```

## Key Capabilities

### Vision

The latest Claude Opus, Sonnet, and Haiku models support image inputs, allowing them to analyze and respond to visual content:

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",  # Or claude-opus-4-7, claude-haiku-4-5
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
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
```

### Tool Use

Claude models support tool use (function calling) with improved accuracy:

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "system",
            "content": "You have access to the following tools:\n<tool_description>\n<tool_name>get_weather</tool_name>\n<description>Get the current weather for a location</description>\n<parameters>\n<parameter>\n<name>location</name>\n<type>string</type>\n<description>The city and state, e.g. San Francisco, CA</description>\n<required>true</required>\n</parameter>\n<parameter>\n<name>unit</name>\n<type>string</type>\n<enum>celsius,fahrenheit</enum>\n<description>The temperature unit</description>\n<required>false</required>\n</parameter>\n</parameters>\n</tool_description>",
        },
        {"role": "user", "content": "What's the weather like in Boston?"},
    ],
)
```

### Structured Output

Claude models can generate structured outputs like JSON:

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",  # Or other Claude models
    messages=[
        {"role": "system", "content": "You are a helpful assistant that outputs JSON."},
        {
            "role": "user",
            "content": "List the top 3 programming languages with their key features.",
        },
    ],
)
```

## Model Selection Guidelines

### Choosing the Right Claude Model

When selecting a Claude model through AvalAI, consider:

1. **Task complexity**: More complex tasks benefit from Claude Opus 4.8 or Claude Opus 4.7, while simpler tasks can use Claude Haiku 4.5
2. **Response quality vs. cost**: Balance the need for high-quality responses with budget considerations
3. **Speed requirements**: For real-time applications, Claude Haiku 4.5 offers the fastest responses
4. **Context length**: The latest Claude models support context windows from 200,000 tokens up to 1,000,000 tokens depending on the model

### Performance Comparison

| Task                          | Recommended Claude Model              | Alternative Models     |
| ----------------------------- | ------------------------------------- | ---------------------- |
| Complex reasoning             | Claude Opus 4.8 / Claude Opus 4.7 | GPT-5.5, o3, Gemini 3.5 Flash |
| Long-horizon agentic coding   | Claude Opus 4.8 / Claude Opus 4.7 | GPT-5.5, GPT-5.3 Codex, Gemini 3.1 Pro |
| Enterprise workloads / Coding | Claude Opus 4.8 / Claude Sonnet 4.6 | Claude Opus 4.7, Gemini 2.5 Pro |
| General chat / Content        | Claude Sonnet 4.6 / Claude Sonnet 4.5 | GPT-5-chat, o3-mini |
| Pair programming / Fast coding | Claude Haiku 4.5 | Claude Sonnet 4.5, o3-mini |
| Summarization / Simple tasks  | Claude Haiku 4.5 | GPT-4o mini, gpt-4.1-mini |
| Vision tasks                  | Claude Opus 4.8 / Claude Opus 4.7 | GPT-5.5, Gemini 2.5 Pro |
| Real-time / High throughput   | Claude Haiku 4.5 | GPT-4o mini, o3-mini |

## Best Practices for Claude Models

### System Prompts

Claude models respond well to clear system prompts that define their role and constraints:

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "system",
            "content": "You are a professional writing assistant. Your responses should be concise, clear, and well-structured. Focus on providing actionable advice for improving the user's writing.",
        },
        {
            "role": "user",
            "content": "Can you help me improve this paragraph: 'The company was founded in 2010 and it makes software and it has offices in many countries and it is growing fast.'",
        },
    ],
)
```

### XML Tags for Structure

Claude models work well with XML tags to structure output:

```python
response = client.chat.completions.create(
    model="claude-opus-4-8",
    messages=[
        {
            "role": "system",
            "content": "When analyzing text, structure your response with XML tags like <summary>, <strengths>, <weaknesses>, and <suggestions>.",
        },
        {
            "role": "user",
            "content": "Analyze this paragraph: 'The company was founded in 2010 and it makes software and it has offices in many countries and it is growing fast.'",
        },
    ],
)
```

### Few-Shot Examples

Provide examples to guide Claude's responses:

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant that rewrites text to be more concise.",
        },
        {
            "role": "user",
            "content": "Example 1:\nOriginal: The meeting that we had yesterday, which included all department heads and several team leaders, was extremely long and rather tedious, with many points being repeated unnecessarily.\nRewrite: Yesterday's meeting with department heads and team leaders was long and repetitive.\n\nExample 2:\nOriginal: The software application that our company developed over the course of the last fiscal year has many different features and functionalities that users can utilize to accomplish various tasks related to data analysis and reporting.\nRewrite: Our company's new software offers various data analysis and reporting features.\n\nNow rewrite this to be more concise: The quarterly financial report that was prepared by the accounting department contains detailed information about revenue streams, expense categories, profit margins, and future projections for the next fiscal quarter.",
        },
    ],
)
```

## Using Claude Models via AvalAI

AvalAI now supports two approaches for accessing Claude models:

### Option 1: OpenAI-Compatible SDKs (Unified Approach)

Use familiar OpenAI client libraries to access Claude models through AvalAI's unified API:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Use any Claude model
response = client.chat.completions.create(
    model="claude-opus-4-8",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

### Option 2: Anthropic Official SDKs (Native Approach)

Use Anthropic's official SDKs for a native experience with multiple model providers:

**Python:**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir",  # Note: No /v1 suffix for Anthropic SDKs
)

# Using a Claude model
message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hello!"}],
)

# Using an OpenAI model through the Anthropic SDK
openai_message = client.messages.create(
    model="gpt-5.4",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hello!"}],
)

# Using a Gemini model through the Anthropic SDK
gemini_message = client.messages.create(
    model="gemini-2.5-pro",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hello!"}],
)
```

**TypeScript/JavaScript:**

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "your-avalai-api-key", // Replace with your actual API key
  baseURL: "https://api.avalai.ir", // Note: No /v1 suffix for Anthropic SDKs
});

// Using a Claude model
const message = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "Hello!",
    },
  ],
});

// Using an OpenAI model through the Anthropic SDK
const openaiMessage = await client.messages.create({
  model: "gpt-5.4",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "Hello!",
    },
  ],
});

// Using a Gemini model through the Anthropic SDK
const geminiMessage = await client.messages.create({
  model: "gemini-2.5-pro",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "Hello!",
    },
  ],
});
```

**Go:**

```go
package main

import (
	"context"
	"fmt"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

func main() {
	client := anthropic.NewClient(
		option.WithAPIKey("your-avalai-api-key"),    // Replace with your actual API key
		option.WithBaseURL("https://api.avalai.ir"), // Note: No /v1 suffix
	)

	message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
		Model:     anthropic.F("claude-opus-4-8"),
		MaxTokens: anthropic.F(int64(1000)),
		Messages: anthropic.F([]anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock("Hello!")),
		}),
	})
}
```

**Ruby:**

```ruby
require 'anthropic'

client = Anthropic::Client.new(
    api_key: 'your-avalai-api-key', # Replace with your actual API key
    base_url: 'https://api.avalai.ir' # Note: No /v1 suffix
)

message = client.messages(
    model: 'claude-opus-4-8',
    max_tokens: 1000,
    messages: [
        {
            role: 'user',
            content: 'Hello!'
        }
    ]
)
```

### Choosing Your Approach

- **OpenAI-Compatible SDKs**: Best for existing OpenAI integrations, unified multi-provider workflows, and familiar syntax
- **Anthropic Official SDKs**: Best for Anthropic-specific features, native parameter support, and access to beta capabilities. As of June 2025, Anthropic SDKs can also be used with models from OpenAI, AWS Bedrock, Vertex AI, and Gemini.

## Differences from OpenAI Models

While AvalAI provides a unified API, there are some differences to be aware of when using Claude models:

1. **XML vs. JSON for function calling**: Claude uses XML format for tool use, while OpenAI uses JSON
2. **Message formatting**: Claude has slightly different conventions for system prompts
3. **Parameter support**: Some parameters may behave differently between Claude and OpenAI models

AvalAI handles these differences behind the scenes, allowing you to use a consistent API interface while still leveraging each model's unique capabilities.

## Model Versioning

Anthropic models are versioned to ensure stability. AvalAI provides access to both the latest versions and specific snapshots:

- Latest version aliases: `claude-opus-4-8`, `claude-opus-4-7`, `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-sonnet-4-5`, `claude-haiku-4-5`

Using a specific snapshot ensures consistent behavior even as models are updated.

## Related Resources

- [Messages API](en/api-reference/messages.md) - How to use chat models via v1/messages endpoint
- [Chat Completions API](en/api-reference/chat.md) - How to use chat models
- [Authentication](en/api-reference/authentication.md) - How to authenticate with the AvalAI API
- [Rate Limits](en/guides/rate-limits.md) - Information about API rate limits
- [Error Handling](en/guides/error-handling.md) - How to handle errors when using the API
