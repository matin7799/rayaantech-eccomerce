# GPT-5.1 Model Added

**Date:** 2025-11-14 / (1404-08-23)

## Summary

OpenAI's flagship model GPT-5.1 is now available on AvalAI. This advanced model offers configurable reasoning effort, making it ideal for coding and agentic tasks with a 400,000 token context window and 128,000 max output tokens.

---

## Details

### OpenAI

We announce the addition of GPT-5.1, OpenAI's flagship model designed for coding and agentic tasks with advanced reasoning capabilities.

- **[`gpt-5.1`](en/providers/openai.md)**: OpenAI's flagship model for coding and agentic tasks with configurable reasoning and non-reasoning effort. Features a 400,000 token context window and 128,000 max output tokens with reasoning token support.

**Key Features:**
- **Context Window**: 400,000 tokens for handling extensive conversations and documents
- **Max Output Tokens**: 128,000 tokens for comprehensive responses
- **Advanced Capabilities**: Function calling, structured outputs, reasoning token support, vision (image input)
- **Knowledge Cutoff**: May 31, 2024
- **Endpoint Support**: Available on [`v1/chat/completions`](en/api-reference/chat.md) and [`v1/responses`](en/api-reference/responses.md)
- **Tool Support**: Web search, file search, image generation, code interpreter, and MCP

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5.1 | $1.25/1M tokens | $0.125/1M tokens | $10.00/1M tokens |

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to calculate the Fibonacci sequence using dynamic programming."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123def456",
  "created": 1731569214,
  "model": "gpt-5.1",
  "object": "chat.completion",
  "system_fingerprint": "fp_abc123",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's an efficient Python function to calculate the Fibonacci sequence using dynamic programming:\n\n
```python\ndef fibonacci(n):\n    \"\"\"Calculate the nth Fibonacci number using dynamic programming.\"\"\"\n    if n <= 1:\n        return n\n    \n    # Initialize array to store Fibonacci numbers\n    fib = [0] * (n + 1)\n    fib[1] = 1\n    \n    # Build up the sequence\n    for i in range(2, n + 1):\n        fib[i] = fib[i-1] + fib[i-2]\n    \n    return fib[n]\n```\n\nThis approach has O(n) time complexity and O(n) space complexity.",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 156,
    "prompt_tokens": 28,
    "total_tokens": 184,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 28,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0015950000",
    "irt": 182.77,
    "exchange_rate": 114600
  }
}
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1",
    "messages": [
      {
        "role": "user",
        "content": "Explain how machine learning models learn from data."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-5.1",
    messages=[
        {
            "role": "user",
            "content": "Explain how machine learning models learn from data.",
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
  model: "gpt-5.1",
  messages: [
    {
      role: "user",
      content: "Explain how machine learning models learn from data.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Function Calling Example

GPT-5.1 supports advanced function calling capabilities:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in New York?"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get current weather information",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
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
            "description": "Get current weather information",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name",
                    }
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="gpt-5.1",
    messages=[{"role": "user", "content": "What's the weather like in New York?"}],
    tools=tools,
    tool_choice="auto",
)

javascript=:const tools = [
    {
        type: "function",
        function: {
            name: "get_weather",
            description: "Get current weather information",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "City name",
                    }
                },
                required: ["location"],
            },
        },
    }
];

const response = await client.chat.completions.create({
    model: "gpt-5.1",
    messages: [{role: "user", content: "What's the weather like in New York?"}],
    tools: tools,
    tool_choice: "auto",
});

```

### Vision Capabilities

GPT-5.1 supports image input for multimodal tasks:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://example.com/image.jpg"
            }
          }
        ]
      }
    ]
  }'

python=:response = client.chat.completions.create(
    model="gpt-5.1",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.jpg"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:const response = await client.chat.completions.create({
    model: "gpt-5.1",
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: "What is in this image?" },
                {
                    type: "image_url",
                    image_url: { url: "https://example.com/image.jpg" },
                },
            ],
        },
    ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Vision Guide](en/guides/vision.md)
- [Pricing Information](en/pricing.md)