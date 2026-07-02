# New Model Added: Claude Opus 4.5

**Date:** 2025-11-25 / (1404-09-04)

## Summary

Anthropic's Claude Opus 4.5 is now available on AvalAI. This model delivers state-of-the-art performance in coding, agents, and computer use, with significantly improved efficiency and 80% lower pricing compared to previous Opus models. It uses dramatically fewer tokens while achieving better results across coding benchmarks and complex reasoning tasks.

---

## Details

### Anthropic

We announce the availability of **Claude Opus 4.5** (‍‍‍‍`claude-opus-4-5`), Anthropic's newest and most capable model. This release represents a significant advancement in AI capabilities for software engineering, agentic workflows, and complex problem-solving tasks. [Documentation](en/models/claude-opus-4.md)

**Key Features:**

- **State-of-the-Art Coding**: Leads on SWE-bench Verified and achieves top performance across 7 out of 8 programming languages on SWE-bench Multilingual
- **Enhanced Efficiency**: Uses 48-76% fewer tokens than previous models while maintaining or exceeding performance
- **Advanced Agent Capabilities**: Excels at long-horizon, autonomous tasks with sustained reasoning and multi-step execution
- **Improved Safety**: Most robustly aligned model from Anthropic with superior resistance to prompt injection attacks
- **Effort Control**: New effort parameter allows developers to optimize for speed/cost or maximum capability
- **Context Window**: 200K tokens for handling extensive conversations and documents
- **Endpoint Support**: Available on v1/chat/completions (full support), v1/messages (full support), and v1/responses (partial support)
- **Pricing**: $5/$25 per million tokens (80% reduction from previous Opus pricing)

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| claude-opus-4-5 | $5.00/1M tokens | $1.50/1M tokens | $25.00/1M tokens |

### API Request/Response Examples

#### Example Request (v1/chat/completions)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-5", # Requires Tier 1+ account
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function that efficiently finds prime numbers using the Sieve of Eratosthenes algorithm."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1732532400,
  "model": "claude-opus-4-5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's an efficient implementation of the Sieve of Eratosthenes:\n\n
```python\ndef sieve_of_eratosthenes(limit):\n    \"\"\"Find all prime numbers up to limit using Sieve of Eratosthenes.\"\"\"\n    if limit < 2:\n        return []\n    \n    # Initialize boolean array\n    is_prime = [True] * (limit + 1)\n    is_prime[0] = is_prime[1] = False\n    \n    # Sieve process\n    for i in range(2, int(limit**0.5) + 1):\n        if is_prime[i]:\n            # Mark multiples as composite\n            for j in range(i*i, limit + 1, i):\n                is_prime[j] = False\n    \n    # Return list of primes\n    return [num for num in range(limit + 1) if is_prime[num]]\n```\n\nThis implementation has O(n log log n) time complexity and O(n) space complexity.",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 245,
    "prompt_tokens": 28,
    "total_tokens": 273,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 28,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0062650000",
    "irt": 717.85,
    "exchange_rate": 114600
  }
}
```

#### Example Request (v1/messages - Native Anthropic Format)

```bash
curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Explain the concept of dependency injection in software design."
      }
    ]
  }'
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Help me debug this code and suggest improvements."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="claude-opus-4-5",
    messages=[
        {
            "role": "user",
            "content": "Help me debug this code and suggest improvements.",
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
  model: "claude-opus-4-5",
  messages: [
    {
      role: "user",
      content: "Help me debug this code and suggest improvements.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Advanced Features

#### Function Calling Example

Claude Opus 4.5 excels at function calling with improved precision and fewer errors:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [
      {
        "role": "user",
        "content": "What is the current weather in San Francisco and should I bring an umbrella?"
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
                "description": "City name"
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

python=:tools = [
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
                        "description": "City name",
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
    model="claude-opus-4-5",
    messages=[
        {
            "role": "user",
            "content": "What is the current weather in San Francisco and should I bring an umbrella?",
        }
    ],
    tools=tools,
    tool_choice="auto",
)

javascript=:const tools = [
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
                        description: "City name",
                    },
                    unit: {
                        type: "string",
                        enum: ["celsius", "fahrenheit"],
                        description: "Temperature unit",
                    }
                },
                required: ["location"],
            },
        },
    }
];

const response = await client.chat.completions.create({
    model: "claude-opus-4-5",
    messages: [{role: "user", content: "What is the current weather in San Francisco and should I bring an umbrella?"}],
    tools: tools,
    tool_choice: "auto",
});

```

#### Complex Reasoning Example

For tasks requiring deep analysis and multi-step reasoning:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Design a scalable microservices architecture for an e-commerce platform that handles 1 million daily transactions. Consider database sharding, caching strategies, and fault tolerance."
      }
    ],
    "max_tokens": 4096
  }'

python=:response = client.chat.completions.create(
    model="claude-opus-4-5",
    messages=[
        {
            "role": "user",
            "content": "Design a scalable microservices architecture for an e-commerce platform that handles 1 million daily transactions. Consider database sharding, caching strategies, and fault tolerance.",
        }
    ],
    max_tokens=4096,
)

# Claude Opus 4.5 provides detailed architectural planning with practical considerations
print(response.choices[0].message.content)

javascript=:const response = await client.chat.completions.create({
    model: "claude-opus-4-5",
    messages: [
        {
            role: "user",
            content: "Design a scalable microservices architecture for an e-commerce platform that handles 1 million daily transactions. Consider database sharding, caching strategies, and fault tolerance.",
        },
    ],
    max_tokens: 4096,
});

// Claude Opus 4.5 provides detailed architectural planning with practical considerations
console.log(response.choices[0].message.content);

```

### Use Cases

Claude Opus 4.5 is particularly well-suited for:

- **Software Engineering**: Code generation, refactoring, debugging, and code reviews
- **Agentic Workflows**: Long-running autonomous tasks with multi-step execution
- **Computer Use**: Spreadsheet automation, browser task handling, and desktop operations
- **Complex Problem Solving**: Architecture design, system planning, and strategic analysis
- **Document Processing**: Analysis of extensive documents with 200K token context window
- **Research Tasks**: Deep analysis requiring sustained reasoning over multiple steps

---

## Related Links

- [Claude Opus 4 Model Documentation](en/models/claude-opus-4.md)
- [Anthropic Models Overview](en/providers/anthropic.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Rate Limits and Pricing](en/pricing.md)
- [Prompt Engineering Best Practices](en/guides/prompt-engineering.md)