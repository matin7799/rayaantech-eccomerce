# New Models Added: Grok 4.20 Beta, GLM-5-Turbo, GPT-5.4 Mini/Nano, and MiniMax M2.7

**Date:** 2026-03-18 / (1404-12-27)

## Summary

We announce the addition of seven new models: X.AI's Grok 4.20 Beta (reasoning and non-reasoning variants) with industry-leading speed and 2M context window, Z.AI's GLM-5-Turbo optimized for OpenClaw agentic scenarios, OpenAI's GPT-5.4 Mini and Nano for cost-efficient high-volume tasks, and MiniMax's M2.7 with self-evolution capabilities and SOTA coding performance.

---

## Details

### X.AI (Grok)

#### Grok 4.20 Beta Reasoning

[`grok-4.20-beta-0309-reasoning`](en/providers/xai.md) is X.AI's newest flagship model with industry-leading speed and agentic tool calling capabilities. It combines the lowest hallucination rate on the market with strict prompt adherence, delivering consistently precise and truthful responses.

| Feature | Details |
|---------|---------|
| Context window | 2,000,000 tokens |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Cached input (above 200K) | $0.40 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Reasoning Mode**: The model thinks before responding for complex problem-solving
- **Massive Context**: 2M token context window for extensive documents and conversations
- **Lowest Hallucination Rate**: Industry-leading accuracy and truthfulness
- **Strict Prompt Adherence**: Consistently precise responses
- **Function Calling**: Connect the model to external tools and systems
- **Structured Outputs**: Return responses in specific, organized formats

**Aliases:** `grok-4.20-beta`, `grok-4.20-beta-0309`, `grok-4.20-beta-latest`, `grok-4.20-beta-latest-reasoning`, `grok-4.20-beta-reasoning`

#### Grok 4.20 Beta Non-Reasoning

[`grok-4.20-beta-0309-non-reasoning`](en/providers/xai.md) is the non-reasoning variant optimized for fast responses without extended thinking, perfect for high-throughput applications.

| Feature | Details |
|---------|---------|
| Context window | 2,000,000 tokens |
| Input pricing | $2.00 / 1M tokens |
| Cached input pricing | $0.20 / 1M tokens (90% cost reduction) |
| Output pricing | $6.00 / 1M tokens |
| Input pricing (above 200K) | $4.00 / 1M tokens |
| Output pricing (above 200K) | $12.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Fast Inference**: Optimized for quick responses without reasoning overhead
- **Massive Context**: 2M token context window
- **High-Throughput**: Perfect for latency-sensitive applications
- **Function Calling & Structured Outputs**: Full tool support

### Z.AI (GLM)

#### GLM-5-Turbo

[`glm-5-turbo`](en/providers/zai.md) is Z.AI's foundation model deeply optimized for the OpenClaw agentic scenario. It has been specifically optimized for core requirements of OpenClaw tasks since the training phase, enhancing key capabilities such as tool invocation, command following, timed and persistent tasks, and long-chain execution.

| Feature | Details |
|---------|---------|
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Input pricing | $1.32 / 1M tokens |
| Cached input pricing | $0.264 / 1M tokens (80% cost reduction) |
| Output pricing | $4.40 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **OpenClaw Native Model**: Systematically constructed for real-world agent workflows
- **Tool Calling**: Precise invocation with greater stability and reliability in multi-step tasks
- **Instruction Following**: Enhanced decomposition of complex, multi-layered instructions
- **Scheduled Tasks**: Better understanding of time dimensions for scheduled triggers and long-running tasks
- **High-Throughput Long Chains**: Faster and more stable execution for tasks with high data throughput
- **Thinking Mode**: Multiple thinking modes for different scenarios
- **Streaming Output**: Real-time streaming responses
- **Context Caching**: Intelligent caching mechanism to optimize performance
- **Structured Output**: Support for JSON and other structured formats
- **MCP Support**: Flexibly integrate external MCP tools and data sources

### OpenAI

#### GPT-5.4 Mini

[`gpt-5.4-mini`](en/providers/openai.md) is OpenAI's strongest mini model yet for coding, computer use, and subagents. It brings the strengths of GPT-5.4 to a faster, more efficient model designed for high-volume workloads.

| Feature | Details |
|---------|---------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $0.75 / 1M tokens |
| Cached input pricing | $0.075 / 1M tokens (90% cost reduction) |
| Output pricing | $4.50 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |

**Key Features:**
- **Reasoning Token Support**: Higher reasoning capabilities with fast speed
- **400K Context Window**: Extended conversations and document processing
- **128K Max Output Tokens**: Extended generation capability
- **Function Calling & Structured Outputs**: Full support for tools
- **Streaming**: Full streaming support
- **Distillation Support**: Can be used for model distillation
- **Computer Use**: Supported via Responses API
- **MCP Support**: Model Context Protocol support

**Aliases:** `gpt-5.4-mini-2026-03-17`

#### GPT-5.4 Nano

[`gpt-5.4-nano`](en/providers/openai.md) is OpenAI's cheapest GPT-5.4-class model for simple high-volume tasks. Designed for tasks where speed and cost matter most like classification, data extraction, ranking, and sub-agents.

| Feature | Details |
|---------|---------|
| Context window | 400,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $0.20 / 1M tokens |
| Cached input pricing | $0.02 / 1M tokens (90% cost reduction) |
| Output pricing | $1.25 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |

**Key Features:**
- **High Reasoning**: Strong reasoning at the lowest cost
- **Fast Speed**: Optimized for high-volume tasks
- **400K Context Window**: Extended context handling
- **128K Max Output Tokens**: Extended generation
- **Function Calling & Structured Outputs**: Full support
- **Streaming**: Full streaming support
- **MCP Support**: Model Context Protocol support

**Aliases:** `gpt-5.4-nano-2026-03-17`

### MiniMax

#### MiniMax M2.7

[`minimax-m2.7`](en/providers/minimax.md) is MiniMax's first model deeply participating in its own evolution. M2.7 is capable of building complex agent harnesses and completing highly elaborate productivity tasks, leveraging capabilities such as Agent Teams, complex Skills, and dynamic tool search.

| Feature | Details |
|---------|---------|
| Context window | 204,000 tokens |
| Maximum output | 128,000 tokens |
| Input pricing | $0.30 / 1M tokens |
| Cached input pricing | $0.06 / 1M tokens (80% cost reduction) |
| Cache creation pricing | $0.375 / 1M tokens |
| Output pricing | $1.20 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Self-Evolution**: First model that deeply participates in its own evolution
- **SOTA Software Engineering**: 56.22% on SWE-Pro, nearly matching Opus's best level
- **Professional Productivity**: ELO score of 1495 on GDPval-AA (highest among open-source models)
- **Complex Environment Interaction**: 97% skill adherence rate with 40+ complex skills
- **Agent Teams**: Native support for multi-agent collaboration
- **Office Suite Integration**: Enhanced Word, Excel, PPT handling with multi-round high-fidelity editing
- **Character Consistency**: Excellent emotional intelligence for interactive entertainment
- **Output Speed**: Approximately 60 tokens per second

**Performance Highlights:**
- End-to-end full project delivery (VIBE-Pro 55.6%)
- Terminal Bench 2 (57.0%) for deep understanding of complex engineering systems
- Multi-SWE-Bench (52.7%)
- SWE Multilingual (76.5%)

#### MiniMax M2.7 Highspeed

[`minimax-m2.7-highspeed`](en/providers/minimax.md) is the ultra-fast variant of M2.7, optimized for speed while maintaining identical capabilities.

| Feature | Details |
|---------|---------|
| Context window | 204,000 tokens |
| Maximum output | 128,000 tokens |
| Input pricing | $0.60 / 1M tokens |
| Cached input pricing | $0.06 / 1M tokens |
| Cache creation pricing | $0.375 / 1M tokens |
| Output pricing | $2.40 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Output Speed**: Approximately 100 tokens per second (faster than other frontier models)
- **Same Capabilities as M2.7**: Identical intelligence with higher throughput
- **Low-Cost Operation**: Efficient for real-time applications
- **Full Tool Support**: Same tool calling and skill support as M2.7

---

## Pricing Summary

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) |
|-------|---------------------|----------------------------|----------------------|
| `grok-4.20-beta-0309-reasoning` | $2.00 | $0.20 | $6.00 |
| `grok-4.20-beta-0309-non-reasoning` | $2.00 | $0.20 | $6.00 |
| `glm-5-turbo` | $1.32 | $0.264 | $4.40 |
| `gpt-5.4-mini` | $0.75 | $0.075 | $4.50 |
| `gpt-5.4-nano` | $0.20 | $0.02 | $1.25 |
| `minimax-m2.7` | $0.30 | $0.06 | $1.20 |
| `minimax-m2.7-highspeed` | $0.60 | $0.06 | $2.40 |

---

## API Request/Response Examples

### Grok 4.20 Beta Reasoning Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4.20-beta-0309-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Design a comprehensive digital marketing strategy for a tech startup."
      }
    ],
    "max_tokens": 4096
  }'
```

### GLM-5-Turbo with Thinking Mode

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "As a marketing expert, create an attractive slogan for Z.AI Open Platform."
      }
    ],
    "thinking": {
      "type": "enabled"
    },
    "max_tokens": 4096,
    "temperature": 1.0
  }'
```

### GPT-5.4 Mini Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [
      {
        "role": "user",
        "content": "Implement a rate-limited API client in Python with exponential backoff."
      }
    ],
    "max_tokens": 4096
  }'
```

### GPT-5.4 Nano Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.4-nano",
    "messages": [
      {
        "role": "user",
        "content": "Classify the following text as positive, negative, or neutral: 'The product works well but shipping was slow.'"
      }
    ]
  }'
```

### MiniMax M2.7 Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.7",
    "messages": [
      {
        "role": "user",
        "content": "Build a research agent harness that can handle data pipelines, training environments, and cross-team collaboration."
      }
    ],
    "max_tokens": 8192
  }'
```

---

## SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [
      {
        "role": "user",
        "content": "Explain the key differences between microservices and monolithic architecture."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using GPT-5.4 Mini
response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[
        {
            "role": "user",
            "content": "Explain the key differences between microservices and monolithic architecture.",
        }
    ],
)

print(response.choices[0].message.content)

# Using Grok 4.20 Beta
response = client.chat.completions.create(
    model="grok-4.20-beta-0309-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a fault-tolerant distributed system architecture.",
        }
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Using GPT-5.4 Mini
const response = await client.chat.completions.create({
  model: "gpt-5.4-mini",
  messages: [
    {
      role: "user",
      content: "Explain the key differences between microservices and monolithic architecture.",
    },
  ],
});

console.log(response.choices[0].message.content);

// Using MiniMax M2.7
const m2Response = await client.chat.completions.create({
  model: "minimax-m2.7",
  messages: [
    {
      role: "user",
      content: "Build an agent that can autonomously manage ML experiments.",
    },
  ],
  max_tokens: 8192,
});

console.log(m2Response.choices[0].message.content);

```

---

## Documentation Links

- [X.AI Models Documentation](en/providers/xai.md)
- [Z.AI Models Documentation](en/providers/zai.md)
- [OpenAI Models Documentation](en/providers/openai.md)
- [MiniMax Models Documentation](en/providers/minimax.md)
- [Pricing Details](en/pricing.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
