# MiniMax Provider Support Added: M2.1 Reasoning Models Now Available

**Date:** 2025-12-28 / (1404-10-07)

## Summary

AvalAI introduces support for MiniMax, a new AI provider, with 3 new models including the flagship MiniMax M2.1 reasoning model. These models deliver exceptional multi-programming language capabilities, advanced reasoning at o3-level efficiency, and outstanding performance in agentic coding workflows. MiniMax models can be accessed via both OpenAI and Anthropic SDKs.

---

## Details

### MiniMax

MiniMax is an AI company focused on developing frontier foundation models for text, speech, video, and music. Their M2.1 model series combines deep reasoning capabilities with exceptional efficiency, achieving 20x better efficiency than comparable reasoning models. [Official Documentation](https://platform.minimax.io/docs/guides/quickstart)

**Key Highlights:**

- **Exceptional Multi-Programming Language Capabilities**: Systematically enhanced performance in Rust, Java, Golang, C++, Kotlin, Objective-C, TypeScript, JavaScript, and more
- **o3-Level Reasoning**: Combines deep reasoning with up to 20x better efficiency
- **Outstanding Agent/Tool Scaffolding**: Excellent performance across Claude Code, Cline, Kilo Code, Roo Code, and BlackBox
- **Interleaved Thinking**: Native support for reasoning between tool interactions with `thinking` blocks
- **Concise and Efficient Responses**: Improved response speed and reduced token consumption
- **200K Context Window**: Supports extensive conversations and document processing
- **128K Max Output Tokens**: Extended generation capability for complex tasks

### Available Models

| Model ID | Type | Description | Output Speed |
|----------|------|-------------|--------------|
| `minimax-m2.1` | Text Generation | Flagship reasoning model with o3-level performance | ~60 tps |
| `minimax-m2.1-lightning` | Text Generation | Faster variant optimized for speed | ~100 tps |
| `minimax-m2` | Text Generation | Previous generation, agentic capabilities | Standard |

**Model Capabilities:**

| Feature | Details |
|---------|---------|
| Context Window | 204,800 tokens |
| Max Output Tokens | 128,000 tokens |
| Tool Calling | ✓ Supported with Interleaved Thinking |
| Streaming | ✓ Supported |
| Supported Endpoints | `v1/chat/completions` (OpenAI), `v1/messages` (Anthropic) |
| Strengths | Coding, Reasoning, Agentic workflows, Multi-language programming |
| Best For | Complex coding tasks, agentic automation, software engineering |

**Pricing:**

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Cache Creation ($/1M tokens) | Output ($/1M tokens) |
|-------|---------------------|---------------------------|------------------------------|---------------------|
| `minimax-m2.1` | $0.30 | $0.03 | $0.375 | $1.20 |
| `minimax-m2.1-lightning` | $0.30 | $0.03 | $0.375 | $2.40 |
| `minimax-m2` | $0.30 | $0.03 | $0.375 | $1.20 |

---

## SDK Access Methods

MiniMax models can be accessed through two SDK approaches:

| SDK | Base URL | Endpoint | Best For |
|-----|----------|----------|----------|
| OpenAI SDK | `https://api.avalai.ir/v1` | `/v1/chat/completions` | Standard chat completions |
| Anthropic SDK | `https://api.avalai.ir` (without /v1) | `/v1/messages` | Native thinking blocks, tool use |

---

## API Request/Response Examples

### Chat Completion (OpenAI Format)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.1",
    "messages": [
      {
        "role": "user",
        "content": "Write a Rust function to implement a concurrent web crawler with rate limiting"
      }
    ]
  }'
```

**Example Response:**

```json
{
  "id": "chatcmpl-minimax-abc123",
  "created": 1766500800,
  "model": "minimax-m2.1",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a concurrent web crawler implementation in Rust with rate limiting:\n\n
```rust\nuse std::sync::Arc;\nuse tokio::sync::{Semaphore, RwLock};\nuse tokio::time::{sleep, Duration};\nuse reqwest::Client;\nuse std::collections::HashSet;\n\nstruct Crawler {\n    client: Client,\n    rate_limiter: Arc<Semaphore>,\n    visited: Arc<RwLock<HashSet<String>>>,\n    max_concurrent: usize,\n}\n...",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 512,
    "prompt_tokens": 24,
    "total_tokens": 536
  }
}
```

---

## SDK Usage Examples

### OpenAI SDK - Basic Usage

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.1",
    "messages": [
      {
        "role": "user",
        "content": "Implement a JWT authentication system in Node.js with refresh tokens"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.1",
    messages=[
        {
            "role": "user",
            "content": "Implement a JWT authentication system in Node.js with refresh tokens",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "minimax-m2.1",
  messages: [
    {
      role: "user",
      content: "Implement a JWT authentication system in Node.js with refresh tokens",
    },
  ],
});

console.log(response.choices[0].message.content);

```

### Anthropic SDK - Basic Usage

MiniMax models can also be accessed using the Anthropic SDK via the `v1/messages` endpoint. Use `base_url="https://api.avalai.ir"` (without `/v1`).

```language-selector
python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # Note: without /v1
)

message = client.messages.create(
    model="minimax-m2.1",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Implement a JWT authentication system in Node.js"}
    ],
)

print(message.content)

javascript=:import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",  // Note: without /v1
});

const message = await client.messages.create({
  model: "minimax-m2.1",
  max_tokens: 4096,
  messages: [
    { role: "user", content: "Implement a JWT authentication system in Node.js" }
  ],
});

console.log(message.content);

```

### Anthropic SDK - Tool Use with Interleaved Thinking

MiniMax M2.1 natively supports **Interleaved Thinking**, enabling it to reason between each round of tool interactions. Before every tool use, the model reflects on the current environment and tool outputs to decide its next action.

```language-selector
python=:import anthropic
import json

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # Note: without /v1
)

# Define tool: weather query
tools = [
    {
        "name": "get_weather",
        "description": "Get weather of a location, the user should supply a location first.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, US",
                }
            },
            "required": ["location"],
        },
    }
]


def send_messages(messages):
    response = client.messages.create(
        model="minimax-m2.1",
        max_tokens=4096,
        messages=messages,
        tools=tools,
    )
    return response


def process_response(response):
    thinking_blocks = []
    text_blocks = []
    tool_use_blocks = []

    for block in response.content:
        if block.type == "thinking":
            thinking_blocks.append(block)
            print(f"💭 Thinking>\n{block.thinking}\n")
        elif block.type == "text":
            text_blocks.append(block)
            print(f"💬 Model>\t{block.text}")
        elif block.type == "tool_use":
            tool_use_blocks.append(block)
            print(
                f"🔧 Tool>\t{block.name}({json.dumps(block.input, ensure_ascii=False)})"
            )

    return thinking_blocks, text_blocks, tool_use_blocks


# 1. User query
messages = [{"role": "user", "content": "How's the weather in San Francisco?"}]
print(f"\n👤 User>\t {messages[0]['content']}")

# 2. Model returns first response (may include tool calls)
response = send_messages(messages)
thinking_blocks, text_blocks, tool_use_blocks = process_response(response)

# 3. If tool calls exist, execute tools and continue conversation
if tool_use_blocks:
    # ⚠️ Critical: Append the assistant's complete response to message history
    # response.content contains all blocks: [thinking block, text block, tool_use block]
    messages.append({"role": "assistant", "content": response.content})

    # Execute tool and return result (simulating weather API call)
    print(f"\n🔨 Executing tool: {tool_use_blocks[0].name}")
    tool_result = "24℃, sunny"
    print(f"📊 Tool result: {tool_result}")

    # Add tool execution result
    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_blocks[0].id,
                    "content": tool_result,
                }
            ],
        }
    )

    # 4. Get final response
    final_response = send_messages(messages)
    process_response(final_response)

javascript=:import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",  // Note: without /v1
});

const tools = [
  {
    name: "get_weather",
    description: "Get weather of a location, the user should supply a location first.",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, US",
        }
      },
      required: ["location"]
    }
  }
];

async function sendMessages(messages) {
  return await client.messages.create({
    model: "minimax-m2.1",
    max_tokens: 4096,
    messages: messages,
    tools: tools,
  });
}

// User query
let messages = [{ role: "user", content: "How's the weather in San Francisco?" }];
console.log(`👤 User: ${messages[0].content}`);

// Get initial response
let response = await sendMessages(messages);

// Process response blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`💭 Thinking: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`💬 Model: ${block.text}`);
  } else if (block.type === "tool_use") {
    console.log(`🔧 Tool: ${block.name}(${JSON.stringify(block.input)})`);
    
    // Append assistant response to history
    messages.push({ role: "assistant", content: response.content });
    
    // Simulate tool execution
    const toolResult = "24℃, sunny";
    messages.push({
      role: "user",
      content: [{ type: "tool_result", tool_use_id: block.id, content: toolResult }]
    });
    
    // Get final response
    const finalResponse = await sendMessages(messages);
    for (const finalBlock of finalResponse.content) {
      if (finalBlock.type === "text") {
        console.log(`💬 Final: ${finalBlock.text}`);
      }
    }
  }
}

```

### OpenAI SDK - Function Calling

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.1",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in Tokyo?"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get current weather information for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name, e.g. Tokyo"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Temperature unit"
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
            "description": "Get current weather information for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g. Tokyo",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit",
                    },
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="minimax-m2.1",
    messages=[{"role": "user", "content": "What is the weather like in Tokyo?"}],
    tools=tools,
    tool_choice="auto",
)

print(response.choices[0].message)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather information for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name, e.g. Tokyo",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit",
          },
        },
        required: ["location"],
      },
    },
  },
];

const response = await client.chat.completions.create({
  model: "minimax-m2.1",
  messages: [{ role: "user", content: "What is the weather like in Tokyo?" }],
  tools: tools,
  tool_choice: "auto",
});

console.log(response.choices[0].message);

```

### MiniMax M2.1 Lightning (Fast Mode)

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "minimax-m2.1-lightning",
    "messages": [
      {
        "role": "user",
        "content": "Explain the difference between async/await and Promises in JavaScript"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="minimax-m2.1-lightning",
    messages=[
        {
            "role": "user",
            "content": "Explain the difference between async/await and Promises in JavaScript",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "minimax-m2.1-lightning",
  messages: [
    {
      role: "user",
      content: "Explain the difference between async/await and Promises in JavaScript",
    },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Interleaved Thinking: Key Concepts

MiniMax M2.1's **Interleaved Thinking** capability allows the model to reason between tool interactions, making it exceptionally powerful for agentic workflows.

### How It Works

1. **Before Tool Use**: The model reflects on the current environment and decides which tool to call
2. **After Tool Result**: The model analyzes the tool output and plans the next action
3. **Chain of Thought**: The complete reasoning chain is preserved across multiple tool interactions

### Best Practices

- **Preserve Full Response**: Always append the complete `response.content` (including thinking blocks) to message history
- **Don't Modify Content**: Keep thinking blocks intact - they maintain reasoning continuity
- **Use Anthropic SDK**: For native thinking block support, use the Anthropic SDK with `base_url="https://api.avalai.ir"`

### Response Format

When using the Anthropic SDK, responses include three block types:

| Block Type | Description |
|------------|-------------|
| `thinking` | Model's internal reasoning process |
| `text` | Text content output by the model |
| `tool_use` | Tool call information with function name and arguments |

---

## Related Links

- [MiniMax Models Documentation](en/providers/minimax.md)
- [MiniMax Official Documentation](https://platform.minimax.io/docs/guides/quickstart)
- [Libraries & SDKs](en/libraries.md)
- [Pricing](en/pricing.md)
- [Quickstart Guide](en/quickstart.md)
- [Function Calling Guide](en/guides/tools.md)
