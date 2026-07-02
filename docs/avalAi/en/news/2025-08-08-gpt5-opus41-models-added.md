# New Frontier Models Added: GPT-5 Series and Claude Opus 4.1

**Date:** 2025-08-08

## Summary

AvalAI now supports OpenAI's latest GPT-5 series models and Anthropic's Claude Opus 4.1, bringing you access to the most advanced AI capabilities for coding, reasoning, and agentic tasks. These frontier models offer enhanced performance with improved cost-efficiency options across the entire range.

---

## Details

We're excited to announce the addition of cutting-edge models from OpenAI and Anthropic to our platform. These new models represent significant advances in AI capabilities, particularly for complex reasoning, coding tasks, and agentic workflows.

### OpenAI GPT-5 Series

OpenAI's GPT-5 series represents their most advanced models, offering superior performance across coding, reasoning, and agentic tasks with flexible pricing options.

- **[`gpt-5`](en/providers/openai.md#gpt-5)**: The flagship model optimized for coding and agentic tasks across domains with 400K context window and reasoning token support
- **[`gpt-5-2025-08-07`](en/providers/openai.md#gpt-5)**: Specific snapshot version of GPT-5 for consistent performance
- **[`gpt-5-mini`](en/providers/openai.md#gpt-5-mini)**: Faster, more cost-efficient version perfect for well-defined tasks with 80% cost savings
- **[`gpt-5-mini-2025-08-07`](en/providers/openai.md#gpt-5-mini)**: Snapshot version of GPT-5 mini
- **[`gpt-5-nano`](en/providers/openai.md#gpt-5-nano)**: The fastest and most cost-efficient option, ideal for summarization and classification tasks
- **[`gpt-5-nano-2025-08-07`](en/providers/openai.md#gpt-5-nano)**: Snapshot version of GPT-5 nano
- **[`gpt-5-chat`](en/providers/openai.md#gpt-5-chat)**: The same model used in ChatGPT interface
- **[`gpt-5-chat-latest`](en/providers/openai.md#gpt-5-chat)**: Always points to the latest GPT-5 Chat version

**Key Features:**
- 400,000 token context window (128,000 max output)
- Vision capabilities (text and image input)
- Function calling and structured outputs
- Reasoning token support
- Prompt caching for cost optimization
- Fine-tuning support

### Anthropic Claude Opus 4.1

Claude Opus 4.1 delivers significant improvements in coding performance, achieving 74.5% on SWE-bench Verified, along with enhanced research and data analysis capabilities.

- **[`claude-opus-4-1`](en/providers/anthropic.md#claude-opus-41)**: Advanced model excelling at multi-file code refactoring and precise debugging within large codebases

**Key Improvements:**
- Enhanced agentic task performance
- Superior real-world coding capabilities
- Improved reasoning and detail tracking
- Better data analysis and research skills
- Computer use capabilities
- 200,000 token context window

### Usage Examples

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using GPT-5 for complex reasoning
completion = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {
            "role": "user",
            "content": "Analyze this codebase and suggest architectural improvements.",
        }
    ],
)

print(completion.choices[0].message.content)

# Using GPT-5 nano for classification
completion = client.chat.completions.create(
    model="gpt-5-nano",
    messages=[
        {
            "role": "user",
            "content": "Classify this text as positive, negative, or neutral: 'The product works well but could be improved.'",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Using GPT-5 mini for efficient tasks
const completion = await client.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
        {
            role: "user",
            content: "Generate a Python function to calculate fibonacci numbers.",
        },
    ],
});

console.log(completion.choices[0].message.content);

// Using Claude Opus 4.1 for complex coding tasks
const opusCompletion = await client.chat.completions.create({
    model: "claude-opus-4-1",
    messages: [
        {
            role: "user",
            content: "Refactor this multi-file JavaScript project to use TypeScript with proper type definitions.",
        },
    ],
});

console.log(opusCompletion.choices[0].message.content);

```

### Pricing Overview

The GPT-5 series offers flexible pricing tiers:

- **GPT-5**: $1.25 input / $10.00 output per 1M tokens
- **GPT-5 Mini**: $0.25 input / $2.00 output per 1M tokens 
- **GPT-5 Nano**: $0.05 input / $0.40 output per 1M tokens
- **Claude Opus 4.1**: $15.00 input / $75.00 output per 1M tokens

All models support prompt caching for additional cost savings on repeated context.

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Anthropic Models Documentation](en/providers/anthropic.md)
- [Chat Completions API Documentation](en/api-reference/chat.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Structured Outputs Guide](en/guides/structured-outputs.md)
- [Rate Limits and Pricing](en/guides/rate-limits.md)