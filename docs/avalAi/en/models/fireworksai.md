# Fireworks.ai

Fireworks.ai is a fast inference platform for open-source AI models, providing production-ready inference with high throughput, low latency, and competitive pricing. AvalAI provides access to select open-source models hosted on Fireworks.ai, all compatible with the OpenAI SDK format.

## Available Models

- [nemotron-3-ultra](#nemotron-3-ultra) - NVIDIA's flagship large-scale Nemotron model for complex reasoning and agentic workloads

## API Endpoint Support

| Model | v1/chat/completions | v1/responses |
|-------|---------------------|--------------|
| All Fireworks.ai models | ✅ Full | ⚠️ Partial |

## Key Features

- **Fast Inference**: High-throughput, low-latency serving of open-source models
- **OpenAI-Compatible**: Drop-in replacement using the OpenAI SDK and API format
- **Prompt Caching**: Cached input pricing for significant cost savings on repeated context
- **Function Calling**: Tool use support for agentic workflows
- **Production-Ready**: Reliable serving for production workloads

## nemotron-3-ultra

NVIDIA's flagship large-scale Nemotron model, hosted on the Fireworks.ai platform. Nemotron-3 Ultra is built for complex reasoning, agentic workflows, and high-quality text generation, combining strong capabilities with cost-effective inference.

### Features

- **Complex Reasoning**: Strong performance on analytical and multi-step reasoning tasks
- **Agentic Workflows**: Reliable tool use and function calling for autonomous agent pipelines
- **High-Quality Generation**: Suitable for demanding text generation and summarization
- **Prompt Caching**: Cached input pricing reduces cost on repeated context
- **OpenAI-Compatible**: Use directly with the OpenAI SDK

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $0.60 per 1M tokens |
| Cached Input Tokens | $0.12 per 1M tokens |
| Output Tokens | $2.40 per 1M tokens |

### Endpoint Support

| Endpoint | Support |
|----------|---------|
| `v1/chat/completions` | ✅ Full |
| `v1/responses` | ⚠️ Partial |

### Use Cases

- Complex reasoning and analytical tasks
- Agentic workflows with multi-step tool use
- High-quality text generation and summarization
- Cost-effective large-model inference for production workloads

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "nemotron-3-ultra",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures for a high-traffic e-commerce platform."
      }
    ],
    "max_tokens": 4096
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="nemotron-3-ultra",
    messages=[
        {
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures for a high-traffic e-commerce platform.",
        },
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "nemotron-3-ultra",
  messages: [
    {
      role: "user",
      content: "Analyze the trade-offs between microservices and monolithic architectures for a high-traffic e-commerce platform.",
    },
  ],
  max_tokens: 4096,
});

console.log(response.choices[0].message.content);

```

### Function Calling Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "nemotron-3-ultra",
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
    model="nemotron-3-ultra",
    messages=[{"role": "user", "content": "What's the weather like in New York?"}],
    tools=tools,
    tool_choice="auto",
)

print(response.choices[0].message.tool_calls)

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
          },
        },
        required: ["location"],
      },
    },
  },
];

const response = await client.chat.completions.create({
  model: "nemotron-3-ultra",
  messages: [{ role: "user", content: "What's the weather like in New York?" }],
  tools: tools,
  tool_choice: "auto",
});

console.log(response.choices[0].message.tool_calls);

```

## Related Resources

- [Pricing](en/pricing.md) - Full pricing details for all models
- [Chat Completions API](en/api-reference/chat.md) - Chat Completions endpoint reference
- [Reasoning Guide](en/guides/reasoning.md) - Working with reasoning-capable models
- [Function Calling Guide](en/guides/function-calling.md) - Tool use with AvalAI models
