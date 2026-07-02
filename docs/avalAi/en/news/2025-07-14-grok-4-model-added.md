# New X.AI Model Added: Grok-4

**Date:** 2025-07-14

## Summary

We're excited to announce the addition of Grok-4, X.AI's flagship model, to the AvalAI platform. This cutting-edge model offers unparalleled performance in natural language processing, mathematics, and reasoning, making it the perfect all-purpose AI solution for diverse applications.

---

## Details

### X.AI

- **grok-4**: X.AI's latest and greatest flagship model, offering exceptional performance across natural language, math, and reasoning tasks. This versatile model serves as the perfect jack-of-all-trades for comprehensive AI applications. [Documentation](en/models/grok-4.md)

### Key Features

**Advanced Capabilities:**
- **Function Calling**: Connect the model to external tools and systems for enhanced functionality
- **Structured Outputs**: Return responses in specific, organized formats for better integration
- **Reasoning**: The model thinks before responding, providing more thoughtful and accurate answers
- **Large Context Window**: 256,000 tokens context window for handling extensive conversations and documents

**Performance Specifications:**
- **Model Names**: `grok-4-0709`, `grok-4`, `grok-4-latest`
- **Context Window**: 256,000 tokens

### Pricing

- **Input**: $3.00 per 1M tokens
- **Cached Input**: $0.75 per 1M tokens (75% cost reduction)
- **Output**: $15.00 per 1M tokens

The cached input pricing can significantly reduce your costs when working with repeated content or long conversations.

### Usage Examples

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="grok-4",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms and provide a mathematical example.",
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
  model: "grok-4",
  messages: [
    {
      role: "user",
      content:
        "Explain quantum computing in simple terms and provide a mathematical example.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Function Calling Example

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Define a function for the model to call
tools = [
    {
        "type": "function",
        "function": {
            "name": "calculate_math",
            "description": "Perform mathematical calculations",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate",
                    }
                },
                "required": ["expression"],
            },
        },
    }
]

completion = client.chat.completions.create(
    model="grok-4",
    messages=[{"role": "user", "content": "What is 15 * 23 + 47?"}],
    tools=tools,
    tool_choice="auto",
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Define a function for the model to call
const tools = [
  {
    type: "function",
    function: {
      name: "calculate_math",
      description: "Perform mathematical calculations",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Mathematical expression to evaluate",
          },
        },
        required: ["expression"],
      },
    },
  },
];

const completion = await client.chat.completions.create({
  model: "grok-4",
  messages: [
    {
      role: "user",
      content: "What is 15 * 23 + 47?",
    },
  ],
  tools: tools,
  tool_choice: "auto",
});

console.log(completion.choices[0].message.content);

```

### Use Cases

Grok-4 excels in various applications:

- **Complex Reasoning**: Advanced problem-solving and logical analysis
- **Mathematical Computations**: Sophisticated mathematical reasoning and calculations
- **Natural Language Tasks**: High-quality text generation, summarization, and analysis
- **Code Generation**: Programming assistance and code explanation
- **Research and Analysis**: In-depth research tasks with comprehensive reasoning
- **Creative Writing**: Content creation with advanced language understanding

---

## Related Links

- [Grok-4 Model Documentation](en/models/grok-4.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Structured Outputs Guide](en/guides/structured-outputs.md)
- [Rate Limits Documentation](en/guides/rate-limits.md)
- [API Reference](en/api-reference/)