# New Models Added: GPT-5.3-Codex, GPT-Audio-1.5, Qwen3.5 Flash, Qwen3-Coder-Next, and Seedream 5.0

**Date:** 2026-02-25 / (1404-12-06)

## Summary

We announce the availability of six new models across three providers: OpenAI's GPT-5.3-Codex (the most capable agentic coding model) and GPT-Audio-1.5 (the best voice model for audio I/O), Alibaba's Qwen3.5-Flash, Qwen3-Coder-Next, and Qwen3.5-35B-A3B (next-generation efficient models), and BytePlus's Seedream 5.0 (advanced image generation with Chain of Thought reasoning). These models bring state-of-the-art capabilities in agentic coding, audio processing, efficient inference, and image generation.

---

## Details

### OpenAI

#### GPT-5.3-Codex

**GPT-5.3-Codex** (`gpt-5.3-codex`) is OpenAI's most capable agentic coding model to date. It advances both the frontier coding performance of GPT-5.2-Codex and the reasoning capabilities of GPT-5.2, together in one model, which is also 25% faster. [Documentation](en/providers/openai.md)

**Key Features:**

- **State-of-the-Art Coding**: Sets new industry highs on SWE-Bench Pro and Terminal-Bench
- **400K Context Window**: Handle large codebases and extensive documentation
- **128K Max Output Tokens**: Generate comprehensive code solutions
- **Reasoning Token Support**: Configurable effort levels (low, medium, high, xhigh)
- **Vision Support**: Process images for visual code understanding
- **Interactive Collaboration**: Provides frequent updates during long-running tasks
- **Self-Improving**: First model instrumental in creating itself
- **Endpoint Support**: Available on `v1/responses`

**Pricing:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5.3-codex | $1.75/1M tokens | $0.175/1M tokens | $14.00/1M tokens |

#### GPT-Audio-1.5

**GPT-Audio-1.5** (`gpt-audio-1.5`) is OpenAI's best voice model for audio in, audio out with Chat Completions. It's optimized for real-time interaction with low latency and natural-sounding speech. [Documentation](en/providers/openai.md)

**Key Features:**

- **Multimodal I/O**: Text and audio inputs, text and audio outputs
- **Low Latency**: Optimized for real-time conversational AI
- **Natural Speech**: Smoother, more conversational audio output
- **Function Calling**: Support for interactive, tool-driven applications
- **128K Context Window**: Handle extensive conversations
- **16K Max Output Tokens**: Generate comprehensive responses
- **Endpoint Support**: Available on `v1/chat/completions`

**Pricing:**

| Model | Text Input | Cached Input | Audio Input | Text Output | Audio Output |
|-------|------------|--------------|-------------|-------------|--------------|
| gpt-audio-1.5 | $2.50/1M tokens | $1.25/1M tokens | $32.00/1M tokens | $10.00/1M tokens | $64.00/1M tokens |

### Alibaba (Qwen)

#### Qwen3.5-Flash

**Qwen3.5-Flash** (`qwen3.5-flash`) is the hosted version of Qwen3.5-35B-A3B with production features including 1M context length and official built-in tools. It's designed for extreme inference efficiency using a hybrid architecture. [Documentation](en/providers/alibaba.md)

**Key Features:**

- **Hybrid Architecture**: Gated Delta Networks + Sparse Mixture-of-Experts for high-throughput inference
- **Native Multimodal**: Process text, images, and videos natively
- **1M Context Window**: Extended context for long-form content
- **201 Languages**: Expanded language and dialect support
- **Built-in Tools**: Official adaptive tool use support for agentic workflows
- **Cache Creation Support**: Efficient caching with tiered pricing

**Pricing:**

| Model | Input | Cache Creation | Cached Input | Output |
|-------|-------|----------------|--------------|--------|
| qwen3.5-flash | $0.10/1M tokens | $0.125/1M tokens | $0.01/1M tokens | $0.40/1M tokens |

#### Qwen3-Coder-Next

**Qwen3-Coder-Next** (`qwen3-coder-next`) is an open-weight 80B parameter Mixture-of-Experts model designed specifically for coding agents and local development with only 3B activated parameters. [Documentation](en/providers/alibaba.md)

**Key Features:**

- **Super Efficient**: 80B total / 3B activated parameters - performance comparable to models 10-20x larger
- **Advanced Agentic Capabilities**: Excels at long-horizon reasoning, complex tool usage, and error recovery
- **256K Context Window**: Analyze large code repositories
- **IDE Integration**: Seamless integration with CLI/IDE platforms (Claude Code, Qwen Code, Cline, Trae, etc.)
- **Non-Thinking Mode**: Optimized for rapid, real-time code generation

**Pricing:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| qwen3-coder-next | $0.30/1M tokens | $0.15/1M tokens | $1.50/1M tokens |

#### Qwen3.5-35B-A3B

**Qwen3.5-35B-A3B** (`qwen3.5-35b-a3b`) is the open-weight version of Qwen3.5-Flash, featuring 35B total parameters with 3B activated for efficient inference. [Documentation](en/providers/alibaba.md)

**Key Features:**

- **Hybrid Architecture**: Gated Delta Networks + Sparse MoE for efficient inference
- **Native Vision-Language**: Unified multimodal foundation
- **262K Native Context**: Extensible up to 1M tokens
- **Strong Coding**: 69.2% on SWE-bench Verified
- **Agent Capabilities**: 81.2% on TAU2-Bench

**Pricing:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| qwen3.5-35b-a3b | $0.25/1M tokens | $0.12/1M tokens | $2.00/1M tokens |

### BytePlus (ByteDance)

#### Seedream 5.0

**Seedream 5.0** (`seedream-5-0-260128`) is ByteDance's latest high-performance image generation model with Chain of Thought reasoning for improved spatial logic and physics compliance. [Documentation](en/providers/byteplus.md)

**Key Features:**

- **Intelligent Reasoning**: Chain of Thought (CoT) for improved spatial logic and physics compliance
- **Web-Enabled Context**: Connect to live web searches for current events and products
- **Multi-Round Editing**: Conversational image editing with iterative adjustments
- **Enhanced Text Rendering**: Improved capabilities for rendering text in images (posters, logos) in multiple languages
- **High Resolution**: Generate images up to 4K resolution
- **Batch Consistency**: Stronger subject and layout retention across generations
- **Fast Generation**: 2-3 seconds per image
- **Endpoint Support**: Available on `v1/images/generations` and `v1/images/edit`

**Pricing:**

| Model | Output |
|-------|--------|
| seedream-5-0-260128 | $35.00/1M tokens (~$0.035 per image) |

---

## API Request/Response Examples

### GPT-5.3-Codex Example

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.3-codex",
    "input": "Refactor this codebase to implement dependency injection and add comprehensive test coverage.",
    "reasoning": {"effort": "high"}
  }'
```

### GPT-Audio-1.5 Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio-1.5",
    "messages": [
      {
        "role": "user",
        "content": "Tell me a short story about a robot learning to paint."
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "nova"
    }
  }'
```

### Qwen3.5-Flash Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "Design a comprehensive microservices architecture for an e-commerce platform."
      }
    ],
    "extra_body": {"enable_thinking": false}
  }'
```

### Qwen3-Coder-Next Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-coder-next",
    "messages": [
      {
        "role": "user",
        "content": "Write a quick sort algorithm with comprehensive error handling."
      }
    ],
    "max_tokens": 4096,
    "temperature": 1.0,
    "extra_body": {"enable_thinking": false}
  }'
```

### Seedream 5.0 Example

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "seedream-5-0-260128",
    "prompt": "Professional product photography of a luxury watch with text 'PREMIUM QUALITY', dramatic lighting, 4K resolution",
    "size": "4K",
    "response_format": "url",
    "sequential_image_generation": "disabled",
    "watermark": false
  }'
```

---

## SDK Usage Examples

```language-selector
bash=:# GPT-5.3-Codex via Responses API
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.3-codex",
    "input": "Design and implement a REST API for a task management system.",
    "reasoning": {"effort": "medium"}
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# GPT-5.3-Codex for agentic coding
response = client.responses.create(
    model="gpt-5.3-codex",
    input="Design and implement a REST API for a task management system.",
    reasoning={"effort": "medium"},
)

print(response.output_text)

# Qwen3.5-Flash for general tasks
completion = client.chat.completions.create(
    model="qwen3.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms.",
        }
    ],
    extra_body={"enable_thinking": False},
)

print(completion.choices[0].message.content)

# Seedream 5.0 for image generation
image_response = client.images.generate(
    model="seedream-5-0-260128",
    prompt="A futuristic cityscape at sunset with flying cars",
    size="4K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Generated image: {image_response.data[0].url}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// GPT-5.3-Codex for agentic coding
const response = await client.responses.create({
  model: "gpt-5.3-codex",
  input: "Design and implement a REST API for a task management system.",
  reasoning: { effort: "medium" },
});

console.log(response.output_text);

// Qwen3-Coder-Next for coding tasks
const completion = await client.chat.completions.create({
  model: "qwen3-coder-next",
  messages: [
    {
      role: "user",
      content: "Implement a binary search tree with insert, delete, and search operations.",
    },
  ],
  max_tokens: 4096,
  temperature: 1.0,
});

console.log(completion.choices[0].message.content);

// Seedream 5.0 for image generation
const imageResponse = await client.images.generate({
  model: "seedream-5-0-260128",
  prompt: "A futuristic cityscape at sunset with flying cars",
  size: "4K",
  response_format: "url",
});

console.log(`Generated image: ${imageResponse.data[0].url}`);

```

---

## Use Cases

### GPT-5.3-Codex
- **Agentic Coding**: Long-horizon autonomous development tasks
- **Large Codebase Refactoring**: Handle complex multi-file changes
- **Web Development**: Build complete applications with games and interactive features
- **Debugging**: Self-diagnose and fix code issues
- **Research Acceleration**: Accelerate development workflows

### GPT-Audio-1.5
- **Voice Agents**: Build responsive, human-like voice bots
- **Real-time Translation**: Efficient live translation
- **Interactive Assistants**: Conversational interfaces with low latency
- **Customer Support**: Natural voice-based customer service

### Qwen3.5-Flash & Qwen3.5-35B-A3B
- **Long-Context Tasks**: Process extensive documents and conversations
- **Multimodal Agents**: Vision and text understanding in unified workflows
- **Multilingual Applications**: Support for 201 languages and dialects
- **Cost-Effective Inference**: High-quality outputs with minimal compute

### Qwen3-Coder-Next
- **Local Development**: Efficient coding assistance on consumer hardware
- **IDE Integration**: Real-time code generation in development environments
- **Agentic Workflows**: Tool usage and error recovery for complex tasks
- **Code Review**: Analyze large repositories with 256K context

### Seedream 5.0
- **E-commerce**: Product visualization with text rendering
- **Marketing**: Professional visuals with enhanced typography
- **Architectural Rendering**: Accurate material textures and lighting
- **UI/UX Mockups**: Design prototypes with precise control

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Alibaba Models Documentation](en/providers/alibaba.md)
- [BytePlus Models Documentation](en/providers/byteplus.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Image Generation API](en/api-reference/images.md)
- [Audio API Reference](en/api-reference/audio.md)
- [Rate Limits and Pricing](en/pricing.md)
