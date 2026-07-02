# New Model Added: GLM-4.6 from Z.AI and DeepSeek-V3.2 Upgrade

**Date:** 2025-10-04

## Summary

We announce the addition of GLM-4.6, a cutting-edge AI model from Z.AI optimized for coding and long-context tasks, alongside an automatic upgrade of DeepSeek models to the new DeepSeek-V3.2-Exp base with 50%+ price reduction. GLM-4.6 delivers superior coding performance with a 200K token context window, while DeepSeek-V3.2 introduces efficient sparse attention for enhanced long-context processing.

---

## Details

### Z.AI

#### GLM-4.6

We introduce **GLM-4.6**, the latest model from Z.AI achieving comprehensive enhancements across multiple domains including real-world coding, long-context processing, reasoning, searching, writing, and agentic applications. [Documentation](en/providers/zai.md)

**Key Features:**
- **Context Window**: 200K tokens (expanded from 128K) for handling complex agentic tasks
- **Advanced Capabilities**: Superior coding performance, tool use during inference, function calling, structured outputs
- **Maximum Output**: 128K tokens
- **Reasoning Support**: Built-in thinking mode with `thinking` parameter
- **Real-World Performance**: Outperforms Claude Sonnet 4 in practical coding tests within Claude Code environment
- **Endpoint Support**: Available on v1/chat/completions
- **Web Search**: Integrated web search capabilities at $0.01 per tool call

**Pricing Details:**

| Model | Input | Cached Input | Output | Web Search |
|-------|-------|--------------|--------|------------|
| glm-4.6 | $0.60/1M tokens | $0.11/1M tokens | $2.20/1M tokens | $0.01/call |

**Performance Highlights:**

GLM-4.6 achieves performance on par with Claude Sonnet 4/Claude Sonnet 4.6 across 8 authoritative benchmarks (AIME 25, GPQA, LCB v6, HLE, SWE-Bench Verified), solidifying its position as a top-tier model. In real-world coding tests, GLM-4.6 demonstrates over 30% better token efficiency compared to its predecessor.

**Example Usage:**

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
            "content": "Create a responsive navigation bar with dropdown menus using React and Tailwind CSS.",
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
            content: "Create a responsive navigation bar with dropdown menus using React and Tailwind CSS."
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

**Use Cases:**

- **AI Coding**: Superior performance in Claude Code, Cline, OpenCode, and Roo Code with enhanced frontend aesthetics
- **Smart Office**: Advanced PowerPoint creation and office automation with clear logical structures
- **Translation**: Optimized quality for French, Russian, Japanese, Korean, and informal contexts
- **Content Creation**: Natural expression in novels, scripts, and copywriting with contextual expansion
- **Virtual Characters**: Consistent tone across multi-turn conversations for social AI applications
- **Intelligent Search**: Enhanced intent understanding and deep research capabilities

### DeepSeek

#### Automatic Upgrade to DeepSeek-V3.2-Exp

DeepSeek models have been automatically upgraded to the new **DeepSeek-V3.2-Exp** base model, featuring DeepSeek Sparse Attention (DSA) for faster, more efficient training and inference on long context. This upgrade is seamless and requires no changes to your existing implementation.

**What's New:**

- **DSA Technology**: Fine-grained sparse attention with minimal impact on output quality
- **Enhanced Efficiency**: Improved long-context performance with reduced compute cost
- **Performance**: On par with V3.1-Terminus across benchmarks
- **Price Reduction**: Over 50% cost decrease on API pricing

#### ⚠️ Important: Thinking Mode API Changes (Updated December 2025)

DeepSeek has updated their API for thinking mode (`deepseek-reasoner`). When using tool calls with thinking mode, you **must now pass the `reasoning_content` field back** to the API in subsequent requests.

**Key Changes:**

1. **Response Fields**: The API now returns both `reasoning_content` (CoT reasoning) and `content` (final answer)
2. **Multi-turn Conversations**: Only pass `content` from previous turns, not `reasoning_content`
3. **Tool Calls with Thinking Mode**: You **MUST** include `reasoning_content` in assistant messages when processing tool calls within the same turn

**Error if Not Implemented:**

```
Missing reasoning_content field in the assistant message
```

**Quick Fix Example:**

```python
# When receiving tool_calls from deepseek-reasoner:
assistant_message = {
    "role": "assistant",
    "content": message.content or "",
    "tool_calls": [...],
    # CRITICAL: Include reasoning_content
    "reasoning_content": message.reasoning_content,
}
messages.append(assistant_message)
```

For complete documentation and examples in multiple languages, see the [DeepSeek Models Documentation](en/providers/deepseek.md#thinking-mode-api-details).

**Official Reference:** [DeepSeek Thinking Mode - Tool Calls](https://api-docs.deepseek.com/guides/thinking_mode#tool-calls)

**Updated Pricing:**

| Model | Previous Input | Previous Output | New Input | New Output | Savings |
|-------|----------------|-----------------|-----------|------------|---------|
| deepseek-chat | $0.56/1M | $1.68/1M | $0.28/1M | $0.42/1M | 50%+ |
| deepseek-reasoner | $0.56/1M | $1.68/1M | $0.28/1M | $0.42/1M | 50%+ |

**Note:** Cached input pricing also reduced from $0.07/1M to $0.028/1M tokens.

**Model Routing:**

Your existing API calls to `deepseek-chat` (for standard chat) and `deepseek-reasoner` (for reasoning mode) are automatically routed to the new DeepSeek-V3.2-Exp base model. No action required on your part.

**Example Usage:**

```language-selector
bash=:# Standard chat mode
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ]
  }'

# Reasoning mode
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {
        "role": "user",
        "content": "Design a scalable microservices architecture for an e-commerce platform."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Standard chat mode
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
)

print(response.choices[0].message.content)

# Reasoning mode
reasoning_response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[
        {
            "role": "user",
            "content": "Design a scalable microservices architecture for an e-commerce platform.",
        }
    ],
)

print(reasoning_response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

// Standard chat mode
const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
        {
            role: "user",
            content: "Explain quantum computing in simple terms."
        }
    ]
});

console.log(response.choices[0].message.content);

// Reasoning mode
const reasoningResponse = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
        {
            role: "user",
            content: "Design a scalable microservices architecture for an e-commerce platform."
        }
    ]
});

console.log(reasoningResponse.choices[0].message.content);

```

---

## Related Links

- [Z.AI Models Documentation](en/providers/zai.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Rate Limits and Pricing](en/guides/rate-limits.md)
- [Best Practices for Production](en/guides/production-best-practices.md)