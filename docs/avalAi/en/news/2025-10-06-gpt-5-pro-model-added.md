# GPT-5 Pro Model Now Available

**Date:** 2025-10-06

## Summary

We announce the addition of GPT-5 Pro, OpenAI's most advanced reasoning model, now available on AvalAI for Tier 2, 3, 4, and 5 users. GPT-5 Pro delivers expert-level intelligence with extended reasoning capabilities for comprehensive and accurate responses across complex tasks in coding, math, writing, health, and more.

---

## Details

### OpenAI

* **gpt-5-pro**: OpenAI's most advanced reasoning model with extended thinking capabilities, producing smarter and more precise responses for complex problems. Available for Tier 2+ users. [Documentation](en/providers/openai.md)

**Key Features:**
- **Context Window**: 400,000 tokens for handling extensive conversations and documents
- **Max Output Tokens**: 272,000 tokens for comprehensive responses
- **Advanced Capabilities**: Function calling, structured outputs, web search, file search, image generation, MCP support
- **Reasoning Support**: High-effort reasoning with visible thinking process for complex problem-solving
- **Endpoint Support**: Available exclusively on v1/responses API
- **Knowledge Cutoff**: September 30, 2024

**Pricing Details:**

| Model | Input | Output |
|-------|-------|--------|
| gpt-5-pro | $15.00/1M tokens | $120.00/1M tokens |

**Note:** GPT-5 Pro is designed for complex, expert-level tasks that require extended reasoning. Some requests may take several minutes to complete. The model defaults to high reasoning effort and is available exclusively in the Responses API to enable multi-turn interactions and advanced features.

### Usage Example

#### Basic Responses API

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5-pro",
    "input": "Design a scalable microservices architecture for an e-commerce platform."
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.responses.create(
    model="gpt-5-pro",
    input="Design a scalable microservices architecture for an e-commerce platform.",
)

print(response.output_text)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5-pro",
  input: "Design a scalable microservices architecture for an e-commerce platform.",
});

console.log(response.output_text);

```

#### With Web Search

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5-pro",
    "tools": [{"type": "web_search"}],
    "input": "What was a positive news story from today?"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.responses.create(
    model="gpt-5-pro",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5-pro",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?",
});

console.log(response.output_text);

```

### Advanced Features

#### Function Calling Example

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5-pro",
    "input": "What is the weather like in New York?",
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

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

tools = [
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

response = client.responses.create(
    model="gpt-5-pro",
    input="What's the weather like in New York?",
    tools=tools,
    tool_choice="auto",
)

print(response.output_text)

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

const response = await client.responses.create({
    model: "gpt-5-pro",
    input: "What's the weather like in New York?",
    tools: tools,
    tool_choice: "auto",
});

console.log(response.output_text);

```

### Model Snapshots

GPT-5 Pro provides snapshot versioning to lock in specific model behavior:

- **gpt-5-pro**: Latest version (automatically updated)
- **gpt-5-pro-2025-10-06**: Fixed snapshot from October 6, 2025

### Performance Highlights

GPT-5 Pro demonstrates state-of-the-art performance across multiple domains:

- **Mathematics**: 94.6% on AIME 2025 (with tools)
- **Coding**: 74.9% on SWE-bench Verified
- **Multimodal**: 84.2% on MMMU college-level visual problem-solving
- **Health**: 46.2% on HealthBench Hard challenging conversations
- **Science**: 88.4% on GPQA Diamond PhD-level questions (with extended reasoning)

The model excels at complex problem-solving, showing expert-level performance across coding, math, writing, health, visual perception, and instruction following.

---

## Related Links

* [OpenAI Models Documentation](en/providers/openai.md)
* [Responses API Guide](en/guides/responses-vs-chat-completions.md)
* [Function Calling Guide](en/guides/function-calling.md)
* [Reasoning Models Guide](en/guides/reasoning.md)
* [Rate Limits Documentation](en/guides/rate-limits.md)