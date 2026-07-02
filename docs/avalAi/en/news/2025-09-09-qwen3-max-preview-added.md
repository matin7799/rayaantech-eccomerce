# New Model Added: Qwen3-Max-Preview with Enhanced Performance and Stability Improvements

**Date:** 2025-09-09

## Summary

We're excited to announce the addition of Qwen3-Max-Preview, Alibaba's most powerful large language model with over 1 trillion parameters, now available on AvalAI. Additionally, we've implemented significant service stability improvements to ensure better performance during peak usage hours.

---

## Details

### Alibaba Qwen3-Max-Preview

We've added Alibaba's flagship **Qwen3-Max-Preview** model, featuring breakthrough capabilities and performance:

- **qwen3-max-preview**: Alibaba's largest model with 1+ trillion parameters, offering exceptional reasoning capabilities, advanced coding support, and superior performance across complex tasks. [Documentation](en/providers/alibaba.md)

**Key Features:**
- **Context Window**: 262,144 tokens (258,048 input, 32,768 output)
- **Advanced Reasoning**: Superior performance on complex analytical tasks
- **Coding Excellence**: Enhanced programming and code generation capabilities
- **Multimodal Support**: Handles structured data formats like JSON
- **Context Caching**: Optimized performance for extended sessions

**API Endpoints:**
- **Primary Support**: `v1/chat/completions` (full feature compatibility)
- **Partial Support**: `v1/messages` (basic text generation)

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="qwen3-max-preview",
    messages=[
        {
            "role": "user",
            "content": "Analyze the economic implications of AI adoption across different industries.",
        }
    ],
    max_tokens=1000,
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "qwen3-max-preview",
  messages: [
    {
      role: "user",
      content: "Analyze the economic implications of AI adoption across different industries.",
    },
  ],
  max_tokens: 1000,
});

console.log(completion.choices[0].message.content);

```

### Service Stability Improvements

We've implemented comprehensive infrastructure enhancements to improve service reliability:

**Enhanced Performance:**
- **Load Balancing**: Improved distribution of requests across our infrastructure
- **Peak Hour Optimization**: Better resource allocation during high-traffic periods
- **Response Time**: Reduced latency for all model endpoints
- **Error Handling**: Enhanced fault tolerance and recovery mechanisms

**User Benefits:**
- More consistent response times during peak usage
- Reduced service interruptions
- Improved overall API reliability
- Better handling of concurrent requests

### Benchmark Performance

Qwen3-Max-Preview demonstrates exceptional performance across industry benchmarks:
- **SuperGPQA**: Leading performance in advanced reasoning
- **AIME25**: Superior mathematical problem-solving capabilities
- **LiveCodeBench v6**: Outstanding coding and programming tasks
- **Arena-Hard v2**: Excellent general-purpose performance
- **LiveBench**: Consistent top-tier results across diverse tasks

---

## Related Links

- [Alibaba Models Documentation](en/providers/alibaba.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
- [Model Selection Guide](en/guides/model-selection.md)