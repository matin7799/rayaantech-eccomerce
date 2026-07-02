# DeepSeek Models

AvalAI provides seamless access to DeepSeek's advanced reasoning models through our unified API. This page details the available DeepSeek models, their capabilities, and optimal use cases, focusing on the latest DeepSeek-V4 flagship generation.

## Available Models

DeepSeek offers cutting-edge AI models with advanced reasoning capabilities, featuring both thinking and non-thinking modes for different use cases. The V4 family delivers a 1M-token default context window, DeepSeek Sparse Attention (DSA), and dramatically improved agentic coding and reasoning performance.

### DeepSeek-V4 Models

DeepSeek-V4 is the newest flagship family, featuring token-wise compression with DeepSeek Sparse Attention (DSA), 1M-token default context, up to 384K output tokens, and dual thinking/non-thinking modes. Per DeepSeek's benchmarks, V4-Pro achieves open-source SOTA in Agentic Coding and rivals top closed-source models in Math/STEM/Coding, while V4-Flash delivers near V4-Pro reasoning quality at a fraction of the cost.

### deepseek-v4-flash

DeepSeek-V4-Flash is a fast, efficient, and economical flagship with 284B total / 13B active parameters. Reasoning capabilities closely approach V4-Pro, with parity on simple agent tasks, at significantly lower cost and faster latency.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window | 1M tokens (default) |
| Max output tokens | Up to 384K |
| Parameters | 284B total / 13B active |
| Mode | Dual thinking / non-thinking (toggle via `extra_body={"thinking": {"type": ...}}`) |
| Input pricing (cache miss) | $0.14 / 1M tokens |
| Input pricing (cache hit) | $0.028 / 1M tokens |
| Output pricing | $0.28 / 1M tokens |
| Strengths | Fast, economical flagship, near V4-Pro reasoning, 1M context, DSA efficiency |
| Best for | High-volume applications, agentic workflows, large-context document analysis |
| Reasoning | Optional CoT reasoning via `reasoning_effort` and `thinking` toggle |
| Features | JSON Output ✓, Tool Calls ✓, Chat Prefix Completion (Beta) ✓, FIM Completion (Beta, non-thinking only) ✓ |
| Available on | `v1/chat/completions` |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Non-thinking mode for fast responses
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the advantages of a 1M token context window for document analysis.",
        }
    ],
    extra_body={"thinking": {"type": "disabled"}},
)

print(response.choices[0].message.content)
```

### deepseek-v4-pro

DeepSeek-V4-Pro is DeepSeek's most capable flagship with 1.6T total / 49B active parameters. Per DeepSeek's benchmarks, V4-Pro delivers open-source SOTA in Agentic Coding, rivals top closed-source models in Math/STEM/Coding, and offers rich world knowledge that trails only Gemini-3.1-Pro among current open models.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window | 1M tokens (default) |
| Max output tokens | Up to 384K |
| Parameters | 1.6T total / 49B active |
| Mode | Dual thinking / non-thinking (thinking enabled by default) |
| Reasoning effort | `reasoning_effort: "high"` or `"max"` (low/medium → high, xhigh → max) |
| Input pricing (cache miss) | $1.74 / 1M tokens |
| Input pricing (cache hit) | $0.145 / 1M tokens |
| Output pricing | $3.48 / 1M tokens |
| Strengths | Open-source SOTA Agentic Coding, world-class reasoning, rich world knowledge |
| Best for | Complex reasoning, agentic coding, research, competitive programming, long-context analysis |
| Reasoning | Exposed CoT reasoning via `reasoning_content` field |
| Features | JSON Output ✓, Tool Calls ✓, Chat Prefix Completion (Beta) ✓ |
| Available on | `v1/chat/completions` |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Thinking mode with high reasoning effort
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {
            "role": "user",
            "content": "Design a fault-tolerant architecture for a global payment processor handling 50,000 TPS.",
        }
    ],
    reasoning_effort="high",
    extra_body={"thinking": {"type": "enabled"}},
)

print(response.choices[0].message.reasoning_content)
print(response.choices[0].message.content)
```

### DeepSeek-V3.2 Models (Legacy Aliases)

> ⚠️ **Deprecation Notice:** The `deepseek-chat` and `deepseek-reasoner` aliases are now routed to the DeepSeek V4 family (`deepseek-v4-flash` and `deepseek-v4-pro` respectively) and will be fully retired on **July 24, 2026, 15:59 (UTC)**. Please migrate to the explicit V4 model names. See [Deprecations](en/deprecations.md#deepseek-chat--reasoner-models-deprecation-date-july-24-2026) for details.

### deepseek-chat

`deepseek-chat` is now routed to **`deepseek-v4-flash`** (non-thinking mode by default). Pricing is unchanged from `deepseek-v4-flash`.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Routes to | `deepseek-v4-flash` |
| Context window | 1M tokens (inherited from V4-Flash) |
| Max output tokens | Up to 384K |
| Mode | Non-thinking mode by default |
| Input pricing (cache miss) | $0.14 / 1M tokens |
| Input pricing (cache hit) | $0.028 / 1M tokens |
| Output pricing | $0.28 / 1M tokens |
| Strengths | Fast, economical, near V4-Pro reasoning, 1M context, DSA efficiency |
| Best for | Existing integrations that rely on the `deepseek-chat` alias |
| Reasoning | Optional CoT reasoning via `reasoning_effort` and `thinking` toggle |
| Features | JSON Output ✓, Tool Calls ✓, Chat Prefix Completion (Beta) ✓, FIM Completion (Beta, non-thinking only) ✓ |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {
            "role": "user",
            "content": "Explain the concept of quantum entanglement in simple terms",
        }
    ],
)

print(response.choices[0].message.content)
```

### deepseek-reasoner

`deepseek-reasoner` is now routed to **`deepseek-v4-pro`** (thinking mode by default). **Pricing has been raised** to match `deepseek-v4-pro` to reflect the upgraded underlying model.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Routes to | `deepseek-v4-pro` |
| Context window | 1M tokens (inherited from V4-Pro) |
| Max output tokens | Up to 384K |
| Mode | Thinking mode by default (enabled) |
| Reasoning effort | `reasoning_effort: "high"` or `"max"` |
| Input pricing (cache miss) | $1.74 / 1M tokens ⬆️ (raised) |
| Input pricing (cache hit) | $0.145 / 1M tokens ⬆️ (raised) |
| Output pricing | $3.48 / 1M tokens ⬆️ (raised) |
| Strengths | Open-source SOTA Agentic Coding, world-class reasoning, rich world knowledge |
| Best for | Existing integrations that rely on the `deepseek-reasoner` alias |
| Reasoning | Exposed CoT reasoning via `reasoning_content` field |
| Features | JSON Output ✓, Tool Calls ✓, Chat Prefix Completion (Beta) ✓ |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[
        {
            "role": "user",
            "content": "Solve this complex math problem step by step: If a train travels 120 miles in 2 hours, then speeds up by 25% for the next 3 hours, how far did it travel in total?",
        }
    ],
)

print(response.choices[0].message.content)
```

### deepseek-v3.2

DeepSeek-V3.2 via Azure AI, harmonizing high computational efficiency with superior reasoning and agent performance. Features DeepSeek Sparse Attention (DSA) for efficient long-context scenarios.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window | 128K tokens |
| Max output tokens | Standard output limits |
| Provider | Azure AI |
| Mode | Non-thinking mode for efficient responses |
| Input pricing | $0.28 / 1M tokens |
| Input pricing (cache hit) | $0.028 / 1M tokens |
| Output pricing | $0.42 / 1M tokens |
| Strengths | Fast responses, efficient processing, enhanced tool use, GPT-5 level performance |
| Best for | General chat, quick responses, high-volume applications, agentic tasks |
| Reasoning | Standard reasoning without exposed thinking process |
| Features | JSON Output ✓, Tool Calls ✓, Chat Prefix Completion (Beta) ✓ |
| Available on | `v1/chat/completions`, `v1/completions`, `v1/responses`, `v1/messages` |

**Benefits of Azure AI Hosting:**
- **Improved Rate Limits**: Higher throughput compared to direct DeepSeek API
- **Reduced Latency**: Faster response times through Azure's global infrastructure
- **Enhanced Reliability**: Enterprise-grade availability and performance

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.2",
    messages=[
        {
            "role": "user",
            "content": "Create a Python function to implement a binary search tree",
        }
    ],
)

print(response.choices[0].message.content)
```

### deepseek-v3.2-speciale

DeepSeek-V3.2-Speciale via Azure AI, a high-compute variant that surpasses GPT-5 and exhibits reasoning proficiency on par with Gemini-3.0-Pro. Achieved gold-medal performance in the 2025 International Mathematical Olympiad (IMO) and International Olympiad in Informatics (IOI).

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window | 128K tokens |
| Max output tokens | Extended output limits for reasoning |
| Provider | Azure AI |
| Mode | Deep reasoning (thinking) mode |
| Input pricing | $0.28 / 1M tokens |
| Input pricing (cache hit) | $0.028 / 1M tokens |
| Output pricing | $0.42 / 1M tokens |
| Strengths | Expert-level reasoning, Olympiad-level performance, surpasses GPT-5 |
| Best for | Complex mathematics, competitive programming, research, deep analysis |
| Reasoning | Extended thinking with exposed reasoning process |
| Features | JSON Output ✓, Chat Prefix Completion (Beta) ✓ |
| Tool Calling | ✗ Not supported (designed for reasoning tasks only) |
| Available on | `v1/chat/completions`, `v1/completions`, `v1/responses`, `v1/messages` |

**Key Achievements:**
- 🥇 Gold-medal performance in 2025 International Mathematical Olympiad (IMO)
- 🥇 Gold-medal performance in International Olympiad in Informatics (IOI)
- Reasoning proficiency on par with Gemini-3.0-Pro

**Important Note:** DeepSeek-V3.2-Speciale is designed exclusively for deep reasoning tasks and does not support tool-calling functionality.

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.2-speciale",
    messages=[
        {
            "role": "user",
            "content": "Solve this IMO problem: Find all positive integers n such that n^2 + 1 divides n^3 + n + 1",
        }
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)
```

### deepseek-v3.1

DeepSeek-V3.1 via Azure AI, providing direct access to the model with enhanced tool use and agent capabilities.

| Feature | Details |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window | 128K tokens |
| Max output tokens | Standard output limits |
| Provider | Azure AI |
| Mode | Non-thinking mode for efficient responses |
| Input pricing (cache hit) | $0.07 / 1M tokens |
| Input pricing (cache miss) | $0.27 / 1M tokens |
| Output pricing | $1.10 / 1M tokens |
| Strengths | Fast responses, efficient processing, enhanced tool use, agent workflows |
| Best for | General chat, quick responses, high-volume applications, agentic tasks |
| Reasoning | Standard reasoning without exposed thinking process |
| Available on | `v1/chat/completions`, `v1/responses`, `v1/messages` |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.1",
    messages=[
        {
            "role": "user",
            "content": "Create a Python function to analyze log files and extract error patterns",
        }
    ],
)

print(response.choices[0].message.content)
```

## Key Capabilities

### Hybrid Inference

DeepSeek-V3.2 offers unique hybrid inference capabilities, allowing users to choose between thinking and non-thinking modes depending on their needs:

- **Non-thinking mode** (`deepseek-chat`): Balanced inference vs. length - your daily driver at GPT-5 level performance
- **Thinking mode** (`deepseek-reasoner`): Maxed-out reasoning capabilities that rival Gemini-3.0-Pro

### Thinking Mode API Details

When using thinking mode (`deepseek-reasoner`), the API returns two content fields:

- **`reasoning_content`**: The chain-of-thought (CoT) reasoning process
- **`content`**: The final answer

**Accessing Reasoning Content:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {
        "role": "user",
        "content": "9.11 and 9.8, which is greater?"
      }
    ]
  }'

# Response includes:
# - choices[0].message.reasoning_content: The CoT reasoning
# - choices[0].message.content: The final answer

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[{"role": "user", "content": "9.11 and 9.8, which is greater?"}],
)

# Access the reasoning process
reasoning_content = response.choices[0].message.reasoning_content
# Access the final answer
content = response.choices[0].message.content

print(f"Reasoning: {reasoning_content}")
print(f"Answer: {content}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [{ role: "user", content: "9.11 and 9.8, which is greater?" }]
});

// Access the reasoning process
const reasoningContent = response.choices[0].message.reasoning_content;
// Access the final answer
const content = response.choices[0].message.content;

console.log(`Reasoning: ${reasoningContent}`);
console.log(`Answer: ${content}`);

php=:<?php
require 'vendor/autoload.php';

use OpenAI;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$response = $client->chat()->create([
    'model' => 'deepseek-reasoner',
    'messages' => [
        ['role' => 'user', 'content' => '9.11 and 9.8, which is greater?']
    ]
]);

// Access the reasoning process
$reasoningContent = $response->choices[0]->message->reasoning_content ?? null;
// Access the final answer
$content = $response->choices[0]->message->content;

echo "Reasoning: " . $reasoningContent . "\n";
echo "Answer: " . $content . "\n";

```

### Multi-Turn Conversations

In multi-turn conversations with thinking mode:

- Each turn outputs both `reasoning_content` and `content`
- **Important**: When continuing the conversation, only pass the `content` from previous turns, NOT the `reasoning_content`
- The `reasoning_content` from previous turns is not concatenated into the context

```language-selector
bash=:# Turn 1
RESPONSE=$(curl -s https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {"role": "user", "content": "What is 15 + 27?"}
    ]
  }')

CONTENT=$(echo $RESPONSE | jq -r '.choices[0].message.content')

# Turn 2 - Only pass content, NOT reasoning_content
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d "{
    \"model\": \"deepseek-reasoner\",
    \"messages\": [
      {\"role\": \"user\", \"content\": \"What is 15 + 27?\"},
      {\"role\": \"assistant\", \"content\": \"$CONTENT\"},
      {\"role\": \"user\", \"content\": \"Now multiply that by 2.\"}
    ]
  }"

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Turn 1
messages = [{"role": "user", "content": "What is 15 + 27?"}]
response = client.chat.completions.create(model="deepseek-reasoner", messages=messages)

reasoning_content = response.choices[0].message.reasoning_content
content = response.choices[0].message.content

# Turn 2 - Only pass content, NOT reasoning_content
messages.append({"role": "assistant", "content": content})
messages.append({"role": "user", "content": "Now multiply that by 2."})

response = client.chat.completions.create(model="deepseek-reasoner", messages=messages)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

// Turn 1
let messages = [{ role: "user", content: "What is 15 + 27?" }];
let response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: messages
});

const reasoningContent = response.choices[0].message.reasoning_content;
const content = response.choices[0].message.content;

// Turn 2 - Only pass content, NOT reasoning_content
messages.push({ role: "assistant", content: content });
messages.push({ role: "user", content: "Now multiply that by 2." });

response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: messages
});

console.log(response.choices[0].message.content);

php=:<?php
require 'vendor/autoload.php';

use OpenAI;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

// Turn 1
$messages = [['role' => 'user', 'content' => 'What is 15 + 27?']];
$response = $client->chat()->create([
    'model' => 'deepseek-reasoner',
    'messages' => $messages
]);

$reasoningContent = $response->choices[0]->message->reasoning_content ?? null;
$content = $response->choices[0]->message->content;

// Turn 2 - Only pass content, NOT reasoning_content
$messages[] = ['role' => 'assistant', 'content' => $content];
$messages[] = ['role' => 'user', 'content' => 'Now multiply that by 2.'];

$response = $client->chat()->create([
    'model' => 'deepseek-reasoner',
    'messages' => $messages
]);

echo $response->choices[0]->message->content . "\n";

```

### Thinking in Tool-Use

DeepSeek-V3.2 is the first DeepSeek model to integrate thinking directly into tool-use:

- **Dual Mode Support**: Supports tool-use in both thinking and non-thinking modes
- **Agent Training Data**: Massive agent training data synthesis covering 1,800+ environments and 85k+ complex instructions
- **Enhanced Reasoning**: Improved ability to reason through complex tool interactions

**⚠️ Critical: Tool Calls with Thinking Mode**

When using tool calls with thinking mode, you **MUST** pass the `reasoning_content` back to the API in subsequent requests within the same turn. Failure to do so will result in a 400 error:

```
Missing reasoning_content field in the assistant message
```

**Correct Tool Call Implementation:**

```language-selector
bash=:# Note: Tool calls with thinking mode require careful handling of reasoning_content
# This is a simplified example - see Python/JS for complete implementation

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {"role": "user", "content": "What is the weather in Tehran?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get weather of a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string", "description": "The city name"}
            },
            "required": ["location"]
          }
        }
      }
    ]
  }'

# IMPORTANT: When the model returns tool_calls, you MUST include
# reasoning_content in the assistant message when sending back tool results

python=:import json
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather of a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "The city name"},
                },
                "required": ["location"],
            },
        },
    },
]

messages = [{"role": "user", "content": "What's the weather in Tehran?"}]

while True:
    response = client.chat.completions.create(
        model="deepseek-reasoner", messages=messages, tools=tools
    )

    message = response.choices[0].message
    reasoning_content = message.reasoning_content
    content = message.content
    tool_calls = message.tool_calls

    # If no tool calls, we have the final answer
    if not tool_calls:
        print(f"Final answer: {content}")
        break

    # CRITICAL: Include reasoning_content when appending assistant message
    assistant_message = {
        "role": "assistant",
        "content": content or "",
        "tool_calls": [
            {
                "id": tc.id,
                "type": "function",
                "function": {
                    "name": tc.function.name,
                    "arguments": tc.function.arguments,
                },
            }
            for tc in tool_calls
        ],
    }

    # MUST include reasoning_content if present
    if reasoning_content:
        assistant_message["reasoning_content"] = reasoning_content

    messages.append(assistant_message)

    # Process tool calls and add results
    for tc in tool_calls:
        # Your tool implementation here
        tool_result = "Sunny, 15-22°C"  # Example result
        messages.append(
            {
                "role": "tool",
                "tool_call_id": tc.id,
                "content": tool_result,
            }
        )

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
            description: "Get weather of a location",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "The city name" }
                },
                required: ["location"]
            }
        }
    }
];

let messages = [{ role: "user", content: "What's the weather in Tehran?" }];

while (true) {
    const response = await client.chat.completions.create({
        model: "deepseek-reasoner",
        messages: messages,
        tools: tools
    });
    
    const message = response.choices[0].message;
    const reasoningContent = message.reasoning_content;
    const content = message.content;
    const toolCalls = message.tool_calls;
    
    // If no tool calls, we have the final answer
    if (!toolCalls) {
        console.log(`Final answer: ${content}`);
        break;
    }
    
    // CRITICAL: Include reasoning_content when appending assistant message
    const assistantMessage = {
        role: "assistant",
        content: content || "",
        tool_calls: toolCalls.map(tc => ({
            id: tc.id,
            type: "function",
            function: {
                name: tc.function.name,
                arguments: tc.function.arguments
            }
        }))
    };
    
    // MUST include reasoning_content if present
    if (reasoningContent) {
        assistantMessage.reasoning_content = reasoningContent;
    }
    
    messages.push(assistantMessage);
    
    // Process tool calls and add results
    for (const tc of toolCalls) {
        // Your tool implementation here
        const toolResult = "Sunny, 15-22°C";  // Example result
        messages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: toolResult
        });
    }
}

php=:<?php
require 'vendor/autoload.php';

use OpenAI;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$tools = [
    [
        'type' => 'function',
        'function' => [
            'name' => 'get_weather',
            'description' => 'Get weather of a location',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'location' => ['type' => 'string', 'description' => 'The city name']
                ],
                'required' => ['location']
            ]
        ]
    ]
];

$messages = [['role' => 'user', 'content' => "What's the weather in Tehran?"]];

while (true) {
    $response = $client->chat()->create([
        'model' => 'deepseek-reasoner',
        'messages' => $messages,
        'tools' => $tools
    ]);
    
    $message = $response->choices[0]->message;
    $reasoningContent = $message->reasoning_content ?? null;
    $content = $message->content;
    $toolCalls = $message->tool_calls ?? null;
    
    // If no tool calls, we have the final answer
    if (!$toolCalls) {
        echo "Final answer: " . $content . "\n";
        break;
    }
    
    // CRITICAL: Include reasoning_content when appending assistant message
    $assistantMessage = [
        'role' => 'assistant',
        'content' => $content ?? '',
        'tool_calls' => array_map(function($tc) {
            return [
                'id' => $tc->id,
                'type' => 'function',
                'function' => [
                    'name' => $tc->function->name,
                    'arguments' => $tc->function->arguments
                ]
            ];
        }, $toolCalls)
    ];
    
    // MUST include reasoning_content if present
    if ($reasoningContent) {
        $assistantMessage['reasoning_content'] = $reasoningContent;
    }
    
    $messages[] = $assistantMessage;
    
    // Process tool calls and add results
    foreach ($toolCalls as $tc) {
        // Your tool implementation here
        $toolResult = "Sunny, 15-22°C";  // Example result
        $messages[] = [
            'role' => 'tool',
            'tool_call_id' => $tc->id,
            'content' => $toolResult
        ];
    }
}

```

**Important Notes for Tool Calls:**

1. Within a single turn (while processing tool calls), always include `reasoning_content` in assistant messages
2. When starting a new user turn, you can clear `reasoning_content` from history to save bandwidth
3. The `response.choices[0].message` object contains all necessary fields - you can append it directly to messages

### Enhanced Agent Skills

DeepSeek-V3.2 features significant improvements in agent capabilities:

- **Tool Use**: Enhanced ability to use external tools and APIs with thinking integration
- **Multi-step Tasks**: Better performance on complex, multi-step agent workflows
- **Function Calling**: Improved function calling capabilities for integration with external systems

### Advanced Reasoning

The thinking mode provides:

- **Step-by-step Analysis**: Clear breakdown of complex problems
- **Transparent Reasoning**: Exposed thought processes for better understanding
- **Gold-Medal Performance**: DeepSeek-V3.2-Speciale attains gold-level results in IMO, CMO, ICPC World Finals & IOI 2025

### Performance Benchmarks (per DeepSeek claims)

DeepSeek-V3.2 shows significant improvements across key benchmarks:

- **GPT-5 Level**: Non-thinking mode achieves GPT-5 level performance
- **Rivals Gemini-3.0-Pro**: Thinking mode rivals Gemini-3.0-Pro capabilities
- **Multi-step Reasoning**: Enhanced capability for complex search and analysis tasks

## Model Selection Guidelines

### Choosing Between deepseek-chat and deepseek-reasoner

When selecting a DeepSeek model through AvalAI, consider:

1. **Task Complexity**: Use `deepseek-reasoner` for complex problems requiring step-by-step analysis
2. **Speed Requirements**: Use `deepseek-chat` for faster responses in high-volume applications
3. **Transparency Needs**: Use `deepseek-reasoner` when you need to see the reasoning process
4. **Output Length**: `deepseek-reasoner` supports longer outputs (up to 64K) vs `deepseek-chat` (up to 8K)
5. **Tool Integration**: Both models support thinking in tool-use for enhanced agent workflows

## Pricing Information

DeepSeek-V3.2 models are available through AvalAI with competitive pricing based on token usage:

| Model | Cache Hit (Input) | Cache Miss (Input) | Output |
|-------|-------------------|-------------------|--------|
| deepseek-chat | $0.028 / 1M tokens | $0.28 / 1M tokens | $0.42 / 1M tokens |
| deepseek-reasoner | $0.028 / 1M tokens | $0.28 / 1M tokens | $0.42 / 1M tokens |

### Pricing Notes

- **Cache Hit**: When input tokens are found in the model's cache, reducing processing costs
- **Cache Miss**: When input tokens need full processing
- **Effective Date**: Pricing updated December 1st, 2025, with DeepSeek-V3.2 release
- **Reference**: For the most current pricing information, visit [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing/)

### Performance Comparison

| Task | Recommended DeepSeek Model | Alternative Models |
| --------------------------------- | ----------------------------- | ------------------------------ |
| Complex reasoning / Analysis | deepseek-reasoner | Claude Opus 4.7, GPT-5.5, o1 |
| General chat / Content Gen | deepseek-chat | Claude Sonnet 4.6, GPT-5.3 Codex |
| Mathematical problems | deepseek-reasoner | gpt-5.5-pro, Claude Opus  4.7 |
| Code analysis / debugging | deepseek-v4-pro | Claude Sonnet 4.6, GPT-5.5 |
| High-volume applications | deepseek-v4-flash | Claude Haiku 4.5, GPT-5.4 mini |

## Best Practices for DeepSeek Models

### Effective Prompting

Provide clear, specific instructions. For reasoning tasks, explicitly ask for step-by-step analysis when using `deepseek-reasoner`.

### System Instructions

Use the `system` role effectively to guide the model's behavior and response style consistently across both models.

### Temperature and Top_P

Adjust `temperature` and `top_p` to control randomness. Lower values (e.g., temp=0.2) produce more deterministic outputs, while higher values (e.g., temp=0.8) encourage creativity.

## Using DeepSeek Models via AvalAI

All DeepSeek models are accessible through the standard AvalAI API endpoints, using the OpenAI-compatible client libraries:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Use any DeepSeek model by its AvalAI identifier
response = client.chat.completions.create(
    model="deepseek-chat",  # or "deepseek-reasoner"
    messages=[{"role": "user", "content": "Hello!"}],
)
```

## Important Notes

### Model Routing

- **deepseek-v4-flash** and **deepseek-v4-pro** are the new explicit DeepSeek V4 flagship models (recommended).
- **deepseek-chat** is now routed to **deepseek-v4-flash** (non-thinking mode by default).
- **deepseek-reasoner** is now routed to **deepseek-v4-pro** (thinking mode by default).
- The legacy `deepseek-chat` and `deepseek-reasoner` aliases will be **fully retired on July 24, 2026, 15:59 (UTC)**. Migrate to the explicit V4 names to avoid disruption.
- Other model names like `deepseek-v3.2`, `deepseek-v3.2-speciale`, and `deepseek-v3.1` continue to use Azure AI and remain available.
- **Pricing impact**: `deepseek-chat` pricing is unchanged; `deepseek-reasoner` pricing has been raised to match `deepseek-v4-pro`.

### Context Window

DeepSeek V4 flagship models (`deepseek-v4-flash`, `deepseek-v4-pro`, and their aliases `deepseek-chat` / `deepseek-reasoner`) support a **1M-token context window by default**, enabling long-document analysis and extended agentic workflows. The Azure-hosted `deepseek-v3.2`, `deepseek-v3.2-speciale`, and `deepseek-v3.1` retain a 128K-token context window.

### Function Calling Support

DeepSeek-V3.1 supports function calling through the Beta API, enabling integration with external tools and services.

## Differences from Other Model Families

While AvalAI provides a unified API, DeepSeek models have unique characteristics:

1. **Hybrid Reasoning**: Unique thinking/non-thinking mode distinction, toggled via `extra_body={"thinking": {"type": ...}}`
2. **DeepSeek Sparse Attention (DSA)**: Token-wise compression for 1M-token efficient long-context handling
3. **Thinking in Tool-Use**: First family to integrate thinking directly into tool-use
4. **Agent Focus**: Specifically optimized for agent tasks with deep integration for Claude Code, OpenClaw, OpenCode
5. **Reasoning Transparency**: Exposed thought processes via the `reasoning_content` field in thinking mode
6. **Competitive Performance (V4)**: V4-Pro delivers open-source SOTA Agentic Coding; V4-Flash near V4-Pro quality at a fraction of the cost (per DeepSeek benchmarks)

## Model Versioning

DeepSeek models available through AvalAI:

- **deepseek-v4-flash**: DeepSeek-V4-Flash flagship (recommended, explicit name)
- **deepseek-v4-pro**: DeepSeek-V4-Pro flagship (recommended, explicit name)
- **deepseek-chat**: Legacy alias, now routes to `deepseek-v4-flash` (retiring July 24, 2026)
- **deepseek-reasoner**: Legacy alias, now routes to `deepseek-v4-pro` (retiring July 24, 2026)
- **deepseek-v3.2**, **deepseek-v3.2-speciale**, **deepseek-v3.1**: Azure-hosted V3 generation

These model names will continue to point to the latest versions as DeepSeek releases updates, except for the legacy aliases which will be retired on July 24, 2026.

## Pricing

| Model | Input (Cache Hit) | Input (Cache Miss) | Output |
|-------|------------------|-------------------|--------|
| deepseek-v4-flash | $0.028 / 1M tokens | $0.14 / 1M tokens | $0.28 / 1M tokens |
| deepseek-v4-pro | $0.145 / 1M tokens | $1.74 / 1M tokens | $3.48 / 1M tokens |
| deepseek-chat (→ v4-flash) | $0.028 / 1M tokens | $0.14 / 1M tokens | $0.28 / 1M tokens |
| deepseek-reasoner (→ v4-pro) | $0.145 / 1M tokens | $1.74 / 1M tokens | $3.48 / 1M tokens |

For complete pricing information, see:
- [Model Details](en/models/model-details.md) - Detailed pricing and specifications
- [Pricing](en/pricing.md) - Complete pricing overview

## Related Resources

- [Chat Completions API](en/api-reference/chat.md) - How to use chat models
- [Authentication](en/api-reference/authentication.md) - How to authenticate with the AvalAI API
- [Rate Limits](en/guides/rate-limits.md) - Information about API rate limits
- [Error Handling](en/guides/error-handling.md) - How to handle errors when using the API
- [Function Calling](en/guides/function-calling.md) - Guide to using function calling with DeepSeek models
- [Reasoning Guide](en/guides/reasoning.md) - Best practices for reasoning tasks