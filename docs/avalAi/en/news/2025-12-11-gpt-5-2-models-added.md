# New Models Added: GPT-5.2 and GPT-5.2 Pro

**Date:** 2025-12-11 / (1404-09-20)

## Summary

OpenAI's latest flagship models GPT-5.2 and GPT-5.2 Pro are now available on AvalAI. GPT-5.2 is designed for coding and agentic tasks across industries with improved general intelligence, instruction following, and multimodality. GPT-5.2 Pro delivers smarter and more precise responses for complex professional tasks, setting new state-of-the-art benchmarks across knowledge work, coding, science, and mathematics.

---

## Details

### OpenAI

We announce access to **GPT-5.2** (`gpt-5.2`) and **GPT-5.2 Pro** (`gpt-5.2-pro`), OpenAI's most advanced models for professional knowledge work and long-running agents. [Documentation](en/providers/openai.md)

#### GPT-5.2

GPT-5.2 is OpenAI's best general-purpose model, optimized for coding and agentic tasks across industries.

**Key Features:**
- **Context Window**: 400,000 input tokens, 128,000 max output tokens
- **Knowledge Cutoff**: August 31, 2025
- **Input/Output**: Text and image input/output support
- **Advanced Reasoning**: Configurable reasoning effort (none, low, medium, high, xhigh)
- **Improved Capabilities**: General intelligence, instruction following, accuracy, token efficiency, multimodality, vision, code generation, tool calling, context management
- **Endpoint Support**: Available on v1/chat/completions, v1/responses, and more

#### GPT-5.2 Pro

GPT-5.2 Pro is the most capable version of GPT-5.2, producing smarter and more precise responses for difficult problems.

**Key Features:**
- **Context Window**: 400,000 input tokens, 128,000 max output tokens
- **Knowledge Cutoff**: August 31, 2025
- **Input/Output**: Text and image input, text output
- **Extended Thinking**: Reasoning effort supports medium, high, xhigh
- **API Access**: Responses API only (v1/responses)
- **Performance**: Sets new state-of-the-art on GDPval (74.1%), GPQA Diamond (93.2%), ARC-AGI-1 Verified (90.5%)

**Note:** GPT-5.2 Pro is designed for tough problems and some requests may take several minutes to complete. Use background mode to avoid timeouts.

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5.2 | $1.75/1M tokens | $0.175/1M tokens | $14.00/1M tokens |
| gpt-5.2-pro | $21.00/1M tokens | - | $168.00/1M tokens |

### API Request/Response Examples

#### GPT-5.2 Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Design an algorithm to optimize route planning for a delivery service."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-xyz123",
  "created": 1733936400,
  "model": "gpt-5.2",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's an optimized route planning algorithm using a combination of techniques...\n\n## Algorithm Overview\n\n1. **Clustering**: Group deliveries by geographic proximity using k-means clustering\n2. **TSP Optimization**: Apply genetic algorithm for each cluster\n3. **Dynamic Re-routing**: Real-time adjustment based on traffic data\n\n
```python\nfrom sklearn.cluster import KMeans\nimport numpy as np\n\nclass DeliveryOptimizer:\n    def __init__(self, deliveries, num_vehicles):\n        self.deliveries = deliveries\n        self.num_vehicles = num_vehicles\n    \n    def cluster_deliveries(self):\n        coords = np.array([(d.lat, d.lng) for d in self.deliveries])\n        kmeans = KMeans(n_clusters=self.num_vehicles)\n        return kmeans.fit_predict(coords)\n```\n\nThis approach reduces total travel distance by approximately 30% compared to naive routing.",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 320,
    "prompt_tokens": 18,
    "total_tokens": 338,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 18,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0048115000",
    "irt": 551.24,
    "exchange_rate": 114600
  }
}
```

#### GPT-5.2 Pro Example Request (Responses API)

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.2-pro",
    "input": "Design a comprehensive distributed system architecture with fault tolerance and scalability considerations for a financial trading platform.",
    "reasoning": {
      "effort": "high"
    }
  }'
```

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {
        "role": "user",
        "content": "Create a React component with TypeScript for a data visualization dashboard."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-5.2",
    messages=[
        {
            "role": "user",
            "content": "Create a React component with TypeScript for a data visualization dashboard.",
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
  model: "gpt-5.2",
  messages: [
    {
      role: "user",
      content: "Create a React component with TypeScript for a data visualization dashboard.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Advanced Features

#### Reasoning Effort Control

GPT-5.2 supports configurable reasoning effort for balancing speed and quality:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "input": "Solve this complex mathematical proof step by step.",
    "reasoning": {
      "effort": "high"
    }
  }'

python=:response = client.responses.create(
    model="gpt-5.2",
    input="Solve this complex mathematical proof step by step.",
    reasoning={"effort": "high"},
)

print(response.output)

javascript=:const response = await client.responses.create({
    model: "gpt-5.2",
    input: "Solve this complex mathematical proof step by step.",
    reasoning: { effort: "high" },
});

console.log(response.output);

```

#### Function Calling

GPT-5.2 excels at function calling with improved accuracy:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
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
    model="gpt-5.2",
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
    model: "gpt-5.2",
    messages: [{role: "user", content: "What is the current weather in San Francisco and should I bring an umbrella?"}],
    tools: tools,
    tool_choice: "auto",
});

```

### Use Cases

GPT-5.2 and GPT-5.2 Pro are particularly suitable for:

- **Software Engineering**: Code generation, debugging, refactoring, feature implementation
- **Agentic Workflows**: Long-running autonomous tasks with multi-step execution
- **Professional Knowledge Work**: Spreadsheets, presentations, reports, document analysis
- **Complex Problem Solving**: Architecture design, system planning, strategic analysis
- **Scientific Research**: Advanced mathematics, physics, chemistry, biology questions
- **Long Context Tasks**: Document analysis with 400K token context window
- **Multi-modal Tasks**: Vision-based analysis, image understanding, UI interaction

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Pricing Information](en/pricing.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Reasoning Guide](en/guides/reasoning.md)
- [Responses API Reference](en/api-reference/responses.md)