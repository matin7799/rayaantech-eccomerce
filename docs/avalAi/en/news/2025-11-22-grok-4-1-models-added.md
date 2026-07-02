# New X.AI Models Added: Grok-4.1 Fast Reasoning and Non-Reasoning

**Date:** 2025-11-22 / (1404-09-01)

## Summary

We announce the addition of two new Grok-4.1 models from X.AI to the AvalAI platform. These frontier multimodal models are optimized for high-performance agentic tool calling, featuring a 2M token context window and support for function calling, structured outputs, and reasoning capabilities.

---

## Details

### X.AI

We have added two variants of the Grok-4.1 Fast model, designed specifically for high-performance agentic workflows:

- **grok-4-1-fast-reasoning**: Frontier multimodal model with extended reasoning capabilities for complex problem-solving. [Documentation](en/providers/xai.md)
- **grok-4-1-fast-non-reasoning**: Frontier multimodal model optimized for fast responses without extended reasoning. [Documentation](en/providers/xai.md)

**Key Features:**
- **Context Window**: 2,000,000 tokens for handling extensive conversations and documents
- **Advanced Capabilities**: Function calling, structured outputs, and reasoning support
- **Multimodal Support**: Process text and images in a single request
- **Agentic Tool Calling**: Optimized for autonomous agent workflows
- **Prompt Caching**: Reduce costs with cached input tokens at $0.05/1M tokens

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| grok-4-1-fast-reasoning | $0.20/1M tokens | $0.05/1M tokens | $0.50/1M tokens |
| grok-4-1-fast-non-reasoning | $0.20/1M tokens | $0.05/1M tokens | $0.50/1M tokens |

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum entanglement in simple terms."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-AqB7xK2mN9pL5sT8vR3wY",
  "created": 1732262400,
  "model": "grok-4-1-fast-reasoning",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Quantum entanglement is a phenomenon where two or more particles become connected in such a way that the state of one particle instantly influences the state of the other, regardless of the distance between them. Think of it like a pair of magic dice: when you roll one and get a six, the other die automatically shows a one, no matter how far apart they are. This connection persists even across vast distances, which Einstein famously called 'spooky action at a distance.'",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 95,
    "prompt_tokens": 15,
    "total_tokens": 110,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 15,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0000505000",
    "irt": 5.79,
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
    "model": "grok-4-1-fast-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "What are the key differences between machine learning and deep learning?"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="grok-4-1-fast-reasoning",
    messages=[
        {
            "role": "user",
            "content": "What are the key differences between machine learning and deep learning?",
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
  model: "grok-4-1-fast-reasoning",
  messages: [
    {
      role: "user",
      content: "What are the key differences between machine learning and deep learning?",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Function Calling Examples

Both models support advanced function calling for agentic workflows:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast-non-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in San Francisco?"
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
    model="grok-4-1-fast-non-reasoning",
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
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
                    },
                },
                required: ["location"],
            },
        },
    }
];

const response = await client.chat.completions.create({
    model: "grok-4-1-fast-non-reasoning",
    messages: [{role: "user", content: "What's the weather like in San Francisco?"}],
    tools: tools,
    tool_choice: "auto",
});

```

### Structured Outputs

Both models support structured outputs using JSON schema:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Extract the key information from this text: John Doe, born on January 15, 1990, works as a software engineer at Tech Corp."
      }
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "person_info",
        "strict": true,
        "schema": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "birth_date": {"type": "string"},
            "occupation": {"type": "string"},
            "company": {"type": "string"}
          },
          "required": ["name", "birth_date", "occupation", "company"],
          "additionalProperties": false
        }
      }
    }
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="grok-4-1-fast-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this text: John Doe, born on January 15, 1990, works as a software engineer at Tech Corp.",
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "person_info",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "birth_date": {"type": "string"},
                    "occupation": {"type": "string"},
                    "company": {"type": "string"},
                },
                "required": ["name", "birth_date", "occupation", "company"],
                "additionalProperties": False,
            },
        },
    },
)

javascript=:const response = await client.chat.completions.create({
    model: "grok-4-1-fast-reasoning",
    messages: [
        {
            role: "user",
            content: "Extract the key information from this text: John Doe, born on January 15, 1990, works as a software engineer at Tech Corp.",
        },
    ],
    response_format: {
        type: "json_schema",
        json_schema: {
            name: "person_info",
            strict: true,
            schema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    birth_date: { type: "string" },
                    occupation: { type: "string" },
                    company: { type: "string" },
                },
                required: ["name", "birth_date", "occupation", "company"],
                additionalProperties: false,
            },
        },
    },
});

```

---

## Related Links

- [X.AI Models Documentation](en/providers/xai.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Structured Outputs Guide](en/guides/structured-outputs.md)
- [API Reference: Chat Completions](en/api-reference/chat.md)
- [Pricing](en/pricing.md)