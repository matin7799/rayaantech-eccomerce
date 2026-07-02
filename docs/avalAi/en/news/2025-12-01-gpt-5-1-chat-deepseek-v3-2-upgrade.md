# New Model Added: GPT-5.1 Chat and DeepSeek-V3.2 Upgrade

**Date:** 2025-12-01 / (1404-09-10)

## Summary

We announce the addition of GPT-5.1 Chat, a chat-optimized version of GPT-5.1 from OpenAI, alongside an automatic upgrade of DeepSeek models to the new DeepSeek-V3.2 base. GPT-5.1 Chat offers the same pricing as GPT-5.1 with optimized conversational capabilities. According to DeepSeek's benchmarks, DeepSeek-V3.2 delivers GPT-5 level performance in non-reasoning mode and rivals Gemini-3.0-Pro in reasoning mode, with no action required from users.

---

## Details

### OpenAI

#### GPT-5.1 Chat

We introduce **GPT-5.1 Chat** (`gpt-5.1-chat`), a chat-optimized version of GPT-5.1 designed for conversational applications. This model provides the same advanced capabilities as GPT-5.1 with enhanced optimization for interactive chat experiences. [Documentation](en/providers/openai.md)

**Key Features:**
- **Context Window**: 400,000 tokens for handling extensive conversations and documents
- **Max Output Tokens**: 128,000 tokens for comprehensive responses
- **Advanced Capabilities**: Function calling, structured outputs, reasoning token support, vision (image input)
- **Chat Optimization**: Enhanced for conversational flows and interactive applications
- **Knowledge Cutoff**: May 31, 2024
- **Endpoint Support**: Available on [`v1/chat/completions`](en/api-reference/chat.md) and [`v1/responses`](en/api-reference/responses.md)
- **Tool Support**: Web search, file search, image generation, code interpreter, and MCP

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5.1-chat | $1.25/1M tokens | $0.125/1M tokens | $10.00/1M tokens |

**Example Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1-chat",
    "messages": [
      {
        "role": "user",
        "content": "Explain the key differences between microservices and monolithic architecture."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-5.1-chat",
    messages=[
        {
            "role": "user",
            "content": "Explain the key differences between microservices and monolithic architecture.",
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
  model: "gpt-5.1-chat",
  messages: [
    {
      role: "user",
      content: "Explain the key differences between microservices and monolithic architecture.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### DeepSeek

#### Automatic Upgrade to DeepSeek-V3.2

DeepSeek models have been automatically upgraded to the new **DeepSeek-V3.2** base model. According to DeepSeek's official benchmarks, this represents a significant milestone in reasoning AI capabilities. This upgrade happens at the provider level and requires no action from users.

**What's New (based on DeepSeek's claims):**

- **DeepSeek-V3.2** (`deepseek-chat`): Balanced inference vs. length - your daily driver at GPT-5 level performance
- **DeepSeek-V3.2-Speciale** (`deepseek-reasoner`): Maxed-out reasoning capabilities that rival Gemini-3.0-Pro
- **Thinking in Tool-Use**: First DeepSeek model to integrate thinking directly into tool-use, supporting tool-use in both thinking and non-thinking modes
- **Agent Capabilities**: Massive agent training data synthesis covering 1,800+ environments and 85k+ complex instructions
- **Gold-Medal Performance**: DeepSeek-V3.2-Speciale attains gold-level results in IMO, CMO, ICPC World Finals & IOI 2025

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

**Model Routing:**

Your existing API calls remain unchanged:
- `deepseek-chat` → Routes to DeepSeek-V3.2 non-thinking mode (GPT-5 level per DeepSeek benchmarks)
- `deepseek-reasoner` → Routes to DeepSeek-V3.2 thinking mode (rivals Gemini-3.0-Pro per DeepSeek benchmarks)

**No action required** - your existing integrations will automatically benefit from the upgraded model.

**Pricing (Unchanged):**

| Model | Cache Hit (Input) | Cache Miss (Input) | Output |
|-------|-------------------|-------------------|--------|
| deepseek-chat | $0.028/1M tokens | $0.28/1M tokens | $0.42/1M tokens |
| deepseek-reasoner | $0.028/1M tokens | $0.28/1M tokens | $0.42/1M tokens |

**Model Details:**

| Feature | deepseek-chat | deepseek-reasoner |
|---------|---------------|-------------------|
| Model Version | DeepSeek-V3.2 (Non-thinking Mode) | DeepSeek-V3.2 (Thinking Mode) |
| Context Length | 128K | 128K |
| Max Output (Default) | 4K (Max: 8K) | 32K (Max: 64K) |
| JSON Output | ✓ | ✓ |
| Tool Calls | ✓ | ✓ |
| Chat Prefix Completion (Beta) | ✓ | ✓ |
| FIM Completion (Beta) | ✓ | ✗ |

**Example Usage:**

```language-selector
bash=:# Standard chat mode (GPT-5 level performance)
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

# Reasoning mode (Gemini-3-Pro-Preview level performance)
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

# Standard chat mode (GPT-5 level performance)
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
)

print(response.choices[0].message.content)

# Reasoning mode (Gemini-3-Pro-Preview level performance)
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

// Standard chat mode (GPT-5 level performance)
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

// Reasoning mode (Gemini-3-Pro-Preview level performance)
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

- [OpenAI Models Documentation](en/providers/openai.md)
- [DeepSeek Models Documentation](en/providers/deepseek.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Pricing Information](en/pricing.md)