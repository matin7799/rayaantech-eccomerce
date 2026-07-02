# New Models Added: GPT-5.4 Series and Gemini 3.1 Flash-Lite Preview

**Date:** 2026-03-10 / (1404-12-19)

## Summary

We announce the addition of OpenAI's GPT-5.4 series models (GPT-5.4 Pro, GPT-5.4, and GPT-5.3 Chat) and Google's Gemini 3.1 Flash-Lite Preview. These models bring frontier reasoning capabilities, extended context windows up to 1.05M tokens, and cost-efficient multimodal processing for high-volume tasks.

---

## Details

### OpenAI

#### GPT-5.4 Pro

[`gpt-5.4-pro`](en/providers/openai.md) is OpenAI's most advanced reasoning model, designed for complex professional work. This model uses more compute to think harder and provide consistently better answers.

| Feature | Details |
|---------|---------|
| Context window | 1,050,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $30.00 / 1M tokens |
| Cached input pricing | $0.30 / 1M tokens |
| Output pricing | $180.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |
| Reasoning effort | medium, high, xhigh |
| Availability | Tier 2+ users |

**Key Features:**
- **Extended Context**: 1.05M token context window for handling massive codebases and documents
- **Reasoning Token Support**: Supports medium, high, and xhigh reasoning effort settings
- **Multi-Turn Interactions**: Designed for multi-turn model interactions before responding to API requests
- **Web Search Support**: Supports web search tool for real-time information
- **Computer Use**: Supports computer use capabilities
- **MCP Support**: Supports Model Context Protocol

**Note:** For prompts with >272K input tokens, pricing is 2x input and 1.5x output for the full session. GPT-5.4 Pro is designed to tackle tough problems - some requests may take several minutes to finish. Use background mode to avoid timeouts.

#### GPT-5.4

[`gpt-5.4`](en/providers/openai.md) is OpenAI's frontier model for complex professional work, offering best intelligence at scale for agentic, coding, and professional workflows.

| Feature | Details |
|---------|---------|
| Context window | 1,050,000 input tokens, 128,000 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $2.50 / 1M tokens |
| Cached input pricing | $0.25 / 1M tokens |
| Output pricing | $15.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |
| Reasoning effort | none (default), low, medium, high, xhigh |

**Key Features:**
- **Extended Context**: 1.05M token context window
- **Highest Reasoning**: Configurable reasoning effort levels
- **Full Tool Support**: Web search, file search, image generation, code interpreter, hosted shell, computer use, MCP, and more
- **Distillation Support**: Can be used for model distillation
- **Structured Outputs**: Full support for structured outputs and function calling

**Note:** For prompts with >272K input tokens, pricing is 2x input and 1.5x output for the full session.

#### GPT-5.3 Chat

[`gpt-5.3-chat`](en/providers/openai.md) is the GPT-5.3 Instant model currently used in ChatGPT, optimized for chat use cases with high intelligence at a competitive price point.

| Feature | Details |
|---------|---------|
| Context window | 128,000 input tokens, 16,384 output tokens |
| Training data | Up to August 31, 2025 |
| Input pricing | $1.75 / 1M tokens |
| Cached input pricing | $0.175 / 1M tokens |
| Output pricing | $14.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |

**Key Features:**
- **High Intelligence**: Latest improvements for chat use cases
- **Vision Support**: Can process images as input
- **Function Calling**: Full support for function calling and structured outputs
- **Streaming**: Full streaming support

**Note:** We recommend GPT-5.2 for general API usage, but GPT-5.3 Chat is ideal for testing the latest ChatGPT improvements for conversational applications.

### Google (Gemini)

#### Gemini 3.1 Flash-Lite Preview

[`gemini-3.1-flash-lite-preview`](en/providers/google.md) is Google's most cost-efficient multimodal model, offering the fastest performance for high-frequency, lightweight tasks.

| Feature | Details |
|---------|---------|
| Context window | 1,048,576 input tokens, 65,536 output tokens |
| Knowledge cutoff | January 2025 |
| Input pricing | $0.25 / 1M tokens |
| Cached input pricing | $0.025 / 1M tokens |
| Output pricing | $1.50 / 1M tokens |
| Audio input pricing | $0.50 / 1M tokens |
| Audio cached input | $0.05 / 1M tokens |
| Audio output pricing | $1.50 / 1M tokens |
| Supported inputs | Text, Image, Video, Audio, PDF |
| Supported outputs | Text |
| Supported endpoints | `v1/chat/completions`, `v1beta/` |

**Key Features:**
- **Cost-Efficient**: Most affordable Gemini model for high-volume tasks
- **Fast Performance**: Optimized for extremely low-latency applications
- **Multimodal Input**: Supports text, image, video, audio, and PDF inputs
- **Thinking Support**: Configurable thinking levels for step-by-step reasoning
- **Structured Outputs**: Full support for JSON schema and structured outputs
- **Function Calling**: Native function calling support
- **Search Grounding**: Google Search integration for accurate responses
- **URL Context**: Can fetch and process web content

**Best Use Cases:**
- **Translation**: Fast, cheap, high-volume translation at scale
- **Transcription**: Audio and video transcription without separate pipelines
- **Data Extraction**: Entity extraction, classification, and lightweight data processing
- **Document Summarization**: Parse PDFs and return concise summaries
- **Model Routing**: Use as a classifier to route queries to appropriate models based on task complexity

---

## Pricing Summary

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) |
|-------|---------------------|----------------------------|----------------------|
| `gpt-5.4-pro` | $30.00 | $0.30 | $180.00 |
| `gpt-5.4` | $2.50 | $0.25 | $15.00 |
| `gpt-5.3-chat` | $1.75 | $0.175 | $14.00 |
| `gemini-3.1-flash-lite-preview` | $0.25 | $0.025 | $1.50 |

---

## API Request/Response Examples

### GPT-5.4 Pro Example

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.4-pro",
    "input": "Design a comprehensive distributed system architecture with fault tolerance, scalability, and security considerations for a global financial platform.",
    "reasoning": {"effort": "high"}
  }'
```

### GPT-5.4 Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "messages": [
      {
        "role": "user",
        "content": "Implement a real-time collaborative document editor with conflict resolution."
      }
    ],
    "max_tokens": 4096
  }'
```

### GPT-5.3 Chat Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.3-chat",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ]
  }'
```

### Gemini 3.1 Flash-Lite Preview Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-3.1-flash-lite-preview",
    "messages": [
      {
        "role": "user",
        "content": "Translate the following text to German: Hey, are you down to grab some pizza later? I am starving!"
      }
    ]
  }'
```

**Response:**

```json
{
  "id": "chatcmpl-xyz123",
  "created": 1741608788,
  "model": "gemini-3.1-flash-lite-preview",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Hey, hast du Lust, später Pizza zu holen? Ich bin am Verhungern!",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 22,
    "prompt_tokens": 28,
    "total_tokens": 50,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 28,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0000400000",
    "irt": 4.58,
    "exchange_rate": 114600
  }
}
```

---

## SDK Usage Examples

### Using GPT-5.4 Pro with Python

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using Responses API for advanced reasoning
response = client.responses.create(
    model="gpt-5.4-pro",
    input="Design a comprehensive distributed system architecture for a global financial platform.",
    reasoning={"effort": "high"},
)

print(response.output)
```

### Using GPT-5.4 with Python

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-5.4",
    messages=[
        {"role": "system", "content": "You are an expert software architect."},
        {
            "role": "user",
            "content": "Implement a real-time collaborative document editor with conflict resolution.",
        },
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)
```

### Using Gemini 3.1 Flash-Lite with Python

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3.1-flash-lite-preview",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key points of this document in bullet points.",
        }
    ],
)

print(response.choices[0].message.content)
```

### Using Gemini 3.1 Flash-Lite with Thinking

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-3.1-flash-lite-preview",
    messages=[{"role": "user", "content": "How does AI work?"}],
    extra_body={"generationConfig": {"thinkingConfig": {"thinkingLevel": "high"}}},
)

print(response.choices[0].message.content)
```

---

## Documentation

- [OpenAI Models Documentation](en/providers/openai.md)
- [Google Gemini Models Documentation](en/providers/google.md)
- [Pricing Information](en/pricing.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
