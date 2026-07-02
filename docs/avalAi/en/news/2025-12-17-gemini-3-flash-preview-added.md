# New Model Added: Gemini 3 Flash Preview

**Date:** 2025-12-17 / (1404-09-26)

## Summary

AvalAI introduces Google's Gemini 3 Flash Preview (`gemini-3-flash-preview`), the latest efficient model combining frontier intelligence with superior search and grounding capabilities. This model offers pro-grade reasoning performance at a fraction of the cost, making it ideal for everyday use with a 1M token context window.

---

## Details

### Google - Gemini 3 Flash Preview

Gemini 3 Flash Preview (`gemini-3-flash-preview`) is Google's most intelligent model built for speed, combining frontier intelligence with superior search and grounding. Released December 2025, this model offers significant improvements over Gemini 2.5 Flash and matches the performance of other frontier models in key benchmarks. [Documentation](en/providers/google.md)

**Key Capabilities:**

- **1M Token Context Window**: Handle extensive conversations, documents, and code repositories
- **Multimodal Input**: Process text, images, video, audio, and PDF files
- **Thinking/Reasoning**: Built-in reasoning capabilities for complex problem-solving
- **Function Calling**: Full support for tool use and agentic workflows
- **Structured Outputs**: Generate structured JSON responses
- **Search Grounding**: Superior search and grounding with real-world knowledge
- **Code Execution**: Run code directly within the model
- **URL Context**: Process and understand web page content
- **Context Caching**: Efficient token caching for repeated contexts

| Feature | Details |
|---------|---------|
| Model Code | `gemini-3-flash-preview` |
| Context Window | Up to 1,048,576 tokens (1M) |
| Max Output Tokens | 65,536 tokens |
| Inputs | Text, Image, Video, Audio, PDF |
| Output | Text |
| Knowledge Cutoff | January 2025 |
| Supported Endpoints | `v1/chat/completions`, `v1/completions` |
| Strengths | Speed, efficiency, pro-grade reasoning, search grounding |
| Best for | Everyday tasks, video analysis, data extraction, visual Q&A, quick workflows |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.50 |
| Cached Input | $0.25 |
| Output | $3.00 |
| Audio Input | $1.50 |
| Audio Cached Input | $0.50 |
| Audio Output | $1.50 |

**Benchmark Performance:**

- **Humanity's Last Exam**: 33.7% (without tool use) - matches GPT-5.2 (34.5%)
- **MMMU-Pro**: 81.2% - outperforms all competitors including GPT-5.2 (79.5%)
- Significant improvements over Gemini 2.5 Flash in all major benchmarks
- 3x faster than Gemini 2.5 Pro while matching performance
- Uses 30% fewer tokens on average for thinking tasks compared to 2.5 Pro

**Supported Capabilities:**

| Capability | Status |
|------------|--------|
| Batch API | ✓ Supported |
| Caching | ✓ Supported |
| Code Execution | ✓ Supported |
| File Search | ✓ Supported |
| Function Calling | ✓ Supported |
| Search Grounding | ✓ Supported |
| Structured Outputs | ✓ Supported |
| Thinking | ✓ Supported |
| URL Context | ✓ Supported |
| Audio Generation | ✗ Not supported |
| Image Generation | ✗ Not supported |
| Live API | ✗ Not supported |
| Grounding with Google Maps | ✗ Not supported |

---

## API Request/Response Examples

### Basic Chat Completion

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms"
      }
    ]
  }'
```

**Example Response:**

```json
{
  "id": "chatcmpl-gemini3flash-abc123",
  "created": 1765933200,
  "model": "gemini-3-flash-preview",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Quantum computing is a new type of computing that uses the principles of quantum mechanics to process information...",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 245,
    "prompt_tokens": 12,
    "total_tokens": 257
  },
  "estimated_cost": {
    "unit": "0.0007410000",
    "irt": 97.39,
    "exchange_rate": 131400
  }
}
```

### With Thinking/Reasoning

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [
      {
        "role": "user",
        "content": "Solve this step by step: If a train travels 120 km in 2 hours, then stops for 30 minutes, then travels another 90 km in 1.5 hours, what is the average speed for the entire journey?"
      }
    ],
    "max_tokens": 2048
  }'
```

### Multimodal Input (Image Analysis)

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Analyze this image and describe what you see in detail"
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
```

### Function Calling

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
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
```

---

## SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to calculate the Fibonacci sequence"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3-flash-preview",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to calculate the Fibonacci sequence",
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
  model: "gemini-3-flash-preview",
  messages: [
    {
      role: "user",
      content: "Write a Python function to calculate the Fibonacci sequence",
    },
  ],
});

console.log(response.choices[0].message.content);

```

### With Multimodal Input

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "What is in this image?"},
          {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
        ]
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3-flash-preview",
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

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-3-flash-preview",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this image?" },
        { type: "image_url", image_url: { url: "https://example.com/image.jpg" } },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [Google Models Documentation](en/providers/google.md)
- [Text Generation Guide](en/guides/text-generation.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Vision Guide](en/guides/vision.md)
- [Pricing](en/pricing.md)