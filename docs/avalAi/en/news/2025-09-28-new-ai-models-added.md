# New AI Models Added: GPT-5 Codex, Gemini Flash Latest, and Qwen3-Max

**Date:** 2025-09-28

## Summary

We announce the addition of six new AI models from OpenAI, Google, and Alibaba, including the advanced GPT-5 Codex optimized for coding tasks, Gemini Flash Latest with hybrid reasoning capabilities, and Qwen3-Max with enhanced agent programming features. These models expand our platform's capabilities in coding, reasoning, and cost-effective AI solutions.

---

## Details

### OpenAI

* **[`gpt-5-codex`](en/providers/openai.md)**: Advanced coding model optimized for agentic coding tasks with reasoning capabilities and 400K context window. Available in Responses API with regular model snapshot updates.

**Key Features:**
- **Context Window**: 400,000 tokens for extensive code analysis and generation
- **Advanced Capabilities**: Reasoning token support, function calling, structured outputs
- **Specialized Focus**: Optimized for agentic coding tasks in Codex environments
- **Endpoint Support**: Available on v1/chat/completions, v1/responses, v1/assistants, v1/batch

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5-codex | $1.25/1M tokens | $0.125/1M tokens | $10.00/1M tokens |

### Google

* **[`gemini-flash-latest`](en/providers/google.md)**: Points to gemini-2.5-flash-preview-09-2025, our hybrid reasoning model with 1M token context window and thinking budgets.
* **[`gemini-2.5-flash-preview-09-2025`](en/providers/google.md)**: Latest preview of Gemini 2.5 Flash with enhanced reasoning capabilities and extensive context handling.
* **[`gemini-flash-lite-latest`](en/providers/google.md)**: Points to gemini-2.5-flash-lite-preview-09-2025, the most cost-effective model built for at-scale usage.
* **[`gemini-2.5-flash-lite-preview-09-2025`](en/providers/google.md)**: Smallest and most cost-effective model in the Gemini 2.5 series with optimized pricing.

**Key Features:**
- **Context Window**: Up to 1M tokens for extensive document processing
- **Advanced Capabilities**: Hybrid reasoning, thinking budgets, function calling
- **Dual Pricing Tiers**: Standard Flash and cost-effective Flash-Lite variants
- **Latest Aliases**: Flash-latest and Flash-lite-latest point to the newest preview versions

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gemini-flash-latest | $0.30/1M tokens | $0.15/1M tokens | $2.50/1M tokens |
| gemini-2.5-flash-preview-09-2025 | $0.30/1M tokens | $0.15/1M tokens | $2.50/1M tokens |
| gemini-flash-lite-latest | $0.10/1M tokens | $0.05/1M tokens | $0.40/1M tokens |
| gemini-2.5-flash-lite-preview-09-2025 | $0.10/1M tokens | $0.05/1M tokens | $0.40/1M tokens |

### Alibaba

* **[`qwen3-max`](en/providers/alibaba.md)**: Latest Qwen 3 series Max model with specialized upgrades in agent programming and tool invocation, achieving state-of-the-art performance for complex agent scenarios.

**Key Features:**
- **Context Window**: Advanced context handling with tiered pricing above 32K and 128K tokens
- **Advanced Capabilities**: Enhanced agent programming, tool invocation, complex reasoning
- **Specialized Focus**: Optimized for agents operating in complex scenarios
- **Performance**: State-of-the-art (SOTA) performance in agent programming tasks

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| qwen3-max | $1.20/1M tokens | $0.10/1M tokens | $6.00/1M tokens | Above 32K: Input $2.40/1M, Output $12.00/1M |
| qwen3-max | - | - | - | Above 128K: Input $3.00/1M, Output $15.00/1M |

### Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5-codex",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to implement a binary search tree with insert, search, and delete operations."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-5-codex",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to implement a binary search tree with insert, search, and delete operations.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "gpt-5-codex",
  messages: [
    {
      role: "user",
      content: "Write a Python function to implement a binary search tree with insert, search, and delete operations.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Advanced Features

#### Reasoning Capabilities
GPT-5 Codex and Gemini Flash models support advanced reasoning with thinking processes visible in responses:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-flash-latest",
    "messages": [
      {
        "role": "user",
        "content": "Design a scalable microservices architecture for an e-commerce platform"
      }
    ],
    "max_tokens": 2048
  }'

python=:response = client.chat.completions.create(
    model="gemini-flash-latest",
    messages=[
        {
            "role": "user",
            "content": "Design a scalable microservices architecture for an e-commerce platform",
        }
    ],
    max_tokens=2048,
)

# The model will show its thinking process before providing the final answer
print(response.choices[0].message.content)

javascript=:const response = await client.chat.completions.create({
    model: "gemini-flash-latest",
    messages: [
        {
            role: "user",
            content: "Design a scalable microservices architecture for an e-commerce platform",
        },
    ],
    max_tokens: 2048,
});

// The model will show its thinking process before providing the final answer
console.log(response.choices[0].message.content);

```

---

## Related Links

* [OpenAI Models Documentation](en/providers/openai.md)
* [Google Models Documentation](en/providers/google.md)
* [Alibaba Models Documentation](en/providers/alibaba.md)
* [Chat Completions API Reference](en/api-reference/chat.md)
* [Function Calling Guide](en/guides/function-calling.md)