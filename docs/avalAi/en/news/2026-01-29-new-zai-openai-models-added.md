# New Models Added: GLM-4.7-Flash, GLM-4.7-FlashX from Z.AI and GPT-5.2-Codex from OpenAI

**Date:** 2026-01-29 / (1404-11-10)

## Summary

AvalAI adds three new models: GLM-4.7-Flash and GLM-4.7-FlashX from Z.AI offering faster and more cost-effective versions of the flagship GLM-4.7, plus GPT-5.2-Codex from OpenAI optimized for long-horizon agentic coding tasks with 400K context window and reasoning token support.

---

## Details

### Z.AI - GLM-4.7-Flash Series

The GLM-4.7-Flash series brings the power of GLM-4.7 in smaller, faster, and more affordable packages. These models achieve open-source SOTA scores among models of comparable size on mainstream benchmarks like SWE-bench Verified and τ²-Bench. [Documentation](en/providers/zai.md)

#### glm-4.7-flashx

The fastest model in the GLM-4.7 family, optimized for speed-critical applications while maintaining excellent programming capabilities.

| Feature | Details |
|---------|---------|
| Model ID | `glm-4.7-flashx` |
| Context Window | 200,000 tokens |
| Maximum Output | 128,000 tokens |
| Input Modalities | Text |
| Output Modalities | Text |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |
| Capabilities | Chat, Function Calling, Structured Outputs |
| Best for | High-throughput applications, fast responses, cost-sensitive deployments |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.077 |
| Cached Input | $0.011 |
| Output | $0.44 |

#### glm-4.7-flash

A balanced model offering excellent performance with improved efficiency over the full GLM-4.7 model.

| Feature | Details |
|---------|---------|
| Model ID | `glm-4.7-flash` |
| Context Window | 200,000 tokens |
| Maximum Output | 128,000 tokens |
| Input Modalities | Text |
| Output Modalities | Text |
| Supported Endpoints | `v1/chat/completions`, `v1/responses` (partial), `v1/messages` (partial) |
| Capabilities | Chat, Function Calling, Structured Outputs |
| Best for | Frontend/backend development, Chinese writing, translation, long-form text processing |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $0.07 |
| Cached Input | $0.01 |
| Output | $0.40 |

**Key Features of GLM-4.7-Flash Series:**

- **Open-source SOTA**: Achieves state-of-the-art scores among similarly sized models on SWE-bench Verified and τ²-Bench
- **Superior Development Capabilities**: Excels at both frontend and backend development tasks
- **Cost-Effective**: Significantly lower pricing than the full GLM-4.7 model while maintaining quality
- **Fast Inference**: Optimized for speed with lower latency responses
- **Versatile Applications**: Excellent for Chinese writing, translation, long-form text processing, and role-playing interactions

---

### OpenAI - GPT-5.2-Codex

GPT-5.2-Codex is OpenAI's most intelligent coding model, optimized for long-horizon, agentic coding tasks in Codex or similar environments. [Documentation](en/providers/openai.md)

| Feature | Details |
|---------|---------|
| Model ID | `gpt-5.2-codex` |
| Context Window | 400,000 tokens |
| Maximum Output | 128,000 tokens |
| Knowledge Cutoff | August 31, 2025 |
| Input Modalities | Text, Image |
| Output Modalities | Text |
| Supported Endpoints | `v1/chat/completions`, `v1/responses`, `v1/realtime` |
| Capabilities | Streaming, Function Calling, Structured Outputs, Reasoning Tokens |
| Best for | Agentic coding, long-horizon tasks, complex software development |

**Pricing:**

| Token Type | Price per 1M Tokens |
|------------|---------------------|
| Input | $1.75 |
| Cached Input | $0.175 |
| Output | $14.00 |

**Key Features:**

- **Reasoning Token Support**: Supports low, medium, high, and xhigh reasoning effort settings
- **Extended Context**: 400K token context window for handling large codebases
- **High Output Capacity**: Up to 128K tokens output for comprehensive code generation
- **Vision Support**: Can process images as input for visual code understanding
- **Agentic Workflows**: Optimized for autonomous coding agents and iterative development

---

## API Usage Examples

### GLM-4.7-FlashX Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-4.7-flashx",
    "messages": [
      {
        "role": "user",
        "content": "Write a TypeScript function that implements a debounce utility with proper typing."
      }
    ],
    "max_tokens": 2048,
    "temperature": 0.7
  }'
```

### GPT-5.2-Codex Example

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.2-codex",
    "messages": [
      {
        "role": "user",
        "content": "Refactor this codebase to use dependency injection and implement a comprehensive test suite."
      }
    ],
    "max_tokens": 8192,
    "temperature": 0.6
  }'
```

---

## Pricing Comparison

| Model | Input | Cached Input | Output | Best For |
|-------|-------|--------------|--------|----------|
| `glm-4.7-flashx` | $0.077 | $0.011 | $0.44 | Fast responses, high throughput |
| `glm-4.7-flash` | $0.07 | $0.01 | $0.40 | Balanced performance |
| `glm-4.7` | $0.60 | $0.11 | $2.20 | Complex reasoning, full capability |
| `gpt-5.2-codex` | $1.75 | $0.175 | $14.00 | Agentic coding, long-horizon tasks |

---

## Related Links

- [Z.AI Models Documentation](en/providers/zai.md)
- [OpenAI Models Documentation](en/providers/openai.md)
- [Pricing Overview](en/pricing.md)
- [API Reference](en/api-reference/introduction.md)
