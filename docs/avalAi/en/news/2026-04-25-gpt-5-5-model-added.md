# New Flagship Model Added: GPT-5.5

**Date:** 2026-04-25 / (1405-02-05)

## Summary

OpenAI's newest flagship model **GPT-5.5** is now available on AvalAI through both the Responses API (`v1/responses`) and Chat Completions API (`v1/chat/completions`). GPT-5.5 delivers state-of-the-art performance across agentic coding, knowledge work, computer use, and scientific research while maintaining per-token latency comparable to GPT-5.4.

---

## Details

### OpenAI

We announce access to **GPT-5.5** (`gpt-5.5`), OpenAI's smartest and most intuitive model yet, designed for real work across complex, multi-step tasks. [Documentation](en/providers/openai.md)

#### GPT-5.5

GPT-5.5 is OpenAI's newest flagship model, engineered to carry more of the work itself: planning, using tools, checking its own output, navigating ambiguity, and persisting across long-running tasks. It excels at writing and debugging code, researching online, analyzing data, creating documents and spreadsheets, operating software, and moving between tools until a task is finished.

**Key Features:**
- **Context Window**: 1,000,000 input tokens, 128,000 max output tokens
- **Input/Output**: Text and image input, text output
- **Advanced Reasoning**: Configurable reasoning effort (none, low, medium, high, xhigh)
- **State-of-the-Art Performance**: 82.7% Terminal-Bench 2.0, 73.1% Expert-SWE, 84.9% GDPval, 78.7% OSWorld-Verified, 98.0% Tau2-bench Telecom
- **Agentic Coding Excellence**: Stronger long-horizon reasoning, context retention across large codebases, and more reliable tool use
- **Token Efficiency**: Uses significantly fewer tokens than GPT-5.4 to complete the same Codex tasks
- **Endpoint Support**: Available on `v1/responses` and `v1/chat/completions`

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5.5 | $5.00/1M tokens | $0.50/1M tokens | $30.00/1M tokens |

---

### API Request/Response Examples

#### Chat Completions Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "messages": [
      {
        "role": "user",
        "content": "Refactor this Python function into an idiomatic async version and explain the trade-offs."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc789",
  "created": 1777881600,
  "model": "gpt-5.5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's an idiomatic async rewrite using asyncio.gather for concurrent I/O, with explicit cancellation handling and a concise explanation of the trade-offs compared to the synchronous version...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 412,
    "prompt_tokens": 28,
    "total_tokens": 440,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 28,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0124000000",
    "irt": 1420.8,
    "exchange_rate": 114600
  }
}
```

#### Responses API Example Request

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "input": "Analyze this quarterly financial report and surface the three most important risk factors with supporting evidence.",
    "reasoning": {
      "effort": "high"
    }
  }'
```

---

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "messages": [
      {
        "role": "user",
        "content": "Design a distributed rate-limiter that survives partial node failures."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": "Design a distributed rate-limiter that survives partial node failures.",
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
  model: "gpt-5.5",
  messages: [
    {
      role: "user",
      content: "Design a distributed rate-limiter that survives partial node failures.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

### Advanced Features

#### Reasoning Effort Control

GPT-5.5 supports configurable reasoning effort so you can balance latency and depth on a per-request basis:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "input": "Prove, step by step, that the sum of two odd integers is even.",
    "reasoning": {
      "effort": "high"
    }
  }'

python=:response = client.responses.create(
    model="gpt-5.5",
    input="Prove, step by step, that the sum of two odd integers is even.",
    reasoning={"effort": "high"},
)

print(response.output)

javascript=:const response = await client.responses.create({
    model: "gpt-5.5",
    input: "Prove, step by step, that the sum of two odd integers is even.",
    reasoning: { effort: "high" },
});

console.log(response.output);

```

#### Function Calling

GPT-5.5 brings stronger tool use, staying on task for longer and selecting tools more reliably in agentic workflows:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in Tokyo and should I pack a jacket?"
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
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in Tokyo and should I pack a jacket?",
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
    model: "gpt-5.5",
    messages: [{role: "user", content: "What is the weather like in Tokyo and should I pack a jacket?"}],
    tools: tools,
    tool_choice: "auto",
});

```

---

### Benchmark Highlights

GPT-5.5 reaches new state-of-the-art results across coding, knowledge work, and tool use:

| Benchmark | GPT-5.5 | GPT-5.4 |
|-----------|---------|---------|
| Terminal-Bench 2.0 | **82.7%** | 75.1% |
| Expert-SWE (Internal) | **73.1%** | 68.5% |
| GDPval (wins or ties) | **84.9%** | 83.0% |
| OSWorld-Verified | **78.7%** | 75.0% |
| Tau2-bench Telecom | **98.0%** | 92.8% |
| Toolathlon | **55.6%** | 54.6% |
| BrowseComp | **84.4%** | 82.7% |
| FrontierMath Tier 1–3 | **51.7%** | 47.6% |
| FrontierMath Tier 4 | **35.4%** | 27.1% |
| CyberGym | **81.8%** | 79.0% |
| ARC-AGI-2 (Verified) | **85.0%** | 73.3% |

GPT-5.5 also delivers strong long-context retrieval, scoring 74.0% on OpenAI MRCR v2 (8-needle, 512K–1M) compared to 36.6% for GPT-5.4.

---

### Use Cases

GPT-5.5 is particularly suitable for:

- **Agentic Coding**: Long-running autonomous engineering tasks, multi-file refactors, debugging across large codebases
- **Knowledge Work**: Spreadsheet modeling, operational research, document and slide generation
- **Computer Use**: Operating software, navigating UIs, and coordinating across tools
- **Scientific Research**: Bioinformatics, quantitative biology, mathematics, and multi-stage data analysis
- **Financial and Legal Analysis**: Report summarization, risk scoring, contract review
- **Long Context Tasks**: Document analysis and codebase reasoning with a 1M token input window

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Pricing Information](en/pricing.md)
- [Reasoning Guide](en/guides/reasoning.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Responses API Reference](en/api-reference/responses.md)
