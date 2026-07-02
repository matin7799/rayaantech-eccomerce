# DeepSeek-V3.1 Models, Grok Code Fast 1, and Enhanced Streaming Performance

**Date:** 2025-09-14 / (1404-06-24)

## Summary

AvalAI introduces DeepSeek-V3.1 models via Azure AI across multiple endpoints, adds X.AI's new grok-code-fast-1 optimized for agentic coding workflows, and delivers significant streaming API improvements with up to 6x faster response speeds achieving 95% provider performance parity.

---

## Details

We're excited to announce three major enhancements that significantly expand our AI capabilities and improve performance across our platform.

### DeepSeek-V3.1 Models via Azure AI

We've integrated DeepSeek-V3.1, the latest advancement in reasoning AI designed for the agent era, now available through our Azure AI partnership across multiple endpoints.

#### DeepSeek

- **deepseek-v3.1**: DeepSeek-V3.1 in non-thinking mode, optimized for fast and efficient responses with hybrid inference capabilities and enhanced tool use. [Documentation](https://api-docs.deepseek.com/news/news250821)

**Key Features:**
- **Context window**: 128K tokens
- **Max output tokens**: Standard output limits
- **Mode**: Non-thinking mode for efficient responses
- **Input pricing (cache hit)**: $0.07 / 1M tokens
- **Input pricing (cache miss)**: $0.27 / 1M tokens
- **Output pricing**: $1.10 / 1M tokens
- **Strengths**: Fast responses, efficient processing, strong general capabilities, enhanced tool use
- **Best for**: General chat, quick responses, high-volume applications, agentic workflows
- **Reasoning**: Standard reasoning without exposed thinking process
- **Available on**: [`v1/chat/completions`](en/api-reference/chat.md), [`v1/responses`](en/api-reference/responses.md), [`v1/messages`](en/api-reference/messages.md)

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.1",
    messages=[
        {
            "role": "user",
            "content": "Explain the concept of quantum entanglement in simple terms",
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
    model: "deepseek-v3.1",
    messages: [
        {
            role: "user",
            content: "Explain the concept of quantum entanglement in simple terms",
        },
    ],
});

console.log(response.choices[0].message.content);

```

### X.AI Grok Code Fast 1

We've added X.AI's latest grok-code-fast-1, a speedy and economical reasoning model that excels at agentic coding workflows with blazing-fast inference speeds.

#### X.AI

- **grok-code-fast-1**: A purpose-built model optimized for agentic coding workflows with exceptional speed and tool mastery. [Documentation](https://x.ai/news/grok-code-fast-1)

**Key Features:**
- **Context window**: Large context support for extensive codebases
- **Input pricing**: $0.20 / 1M tokens
- **Output pricing**: $1.50 / 1M tokens
- **Cached input pricing**: $0.02 / 1M tokens
- **Strengths**: Blazing fast responses, agentic coding, tool mastery (grep, terminal, file editing)
- **Best for**: IDE integration, code generation, debugging, pull request analysis
- **Performance**: 190+ tokens per second with 90%+ cache hit rates
- **Languages**: TypeScript, Python, Java, Rust, C++, Go
- **Available on**: [`v1/chat/completions`](en/api-reference/chat.md), [`v1/responses`](en/api-reference/responses.md), [`v1/messages`](en/api-reference/messages.md)

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="grok-code-fast-1",
    messages=[
        {
            "role": "user",
            "content": "Create a Python function to implement binary search with proper error handling",
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
    model: "grok-code-fast-1",
    messages: [
        {
            role: "user",
            content: "Create a TypeScript interface for a user management system",
        },
    ],
});

console.log(response.choices[0].message.content);

```

### Enhanced Streaming API Performance

We've significantly upgraded our core API infrastructure with major streaming improvements that deliver exceptional performance across all supported endpoints.

**Performance Improvements:**
- **Speed Enhancement**: Up to 6x faster streaming responses (chunks/second)
- **Provider Parity**: 95% identical performance to main provider streaming
- **Coverage**: Improvements across Chat Completions, Responses, Messages, and Gemini v1beta/models APIs
- **Optimization**: Advanced chunk processing and connection management
- **Reliability**: Enhanced error handling and connection stability

**Affected Endpoints:**
- [`v1/chat/completions`](en/api-reference/chat.md) - Chat completions with streaming
- [`v1/responses`](en/api-reference/responses.md) - Response generation with streaming
- [`v1/messages`](en/api-reference/messages.md) - Message processing with streaming
- [`/v1beta/models`](en/news/2025-07-22-native-gemini-api-support-now-available.md) - Gemini native API streaming

These improvements ensure that streaming responses now match the speed and reliability of direct provider access while maintaining all the benefits of AvalAI's unified API approach.

---

## Related Links

- [DeepSeek Models Documentation](en/providers/deepseek.md)
- [X.AI Models Documentation](en/providers/xai.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Messages API Reference](en/api-reference/messages.md)
- [Streaming Responses Guide](en/guides/streaming-responses.md)
- [DeepSeek Official Documentation](https://api-docs.deepseek.com/news/news250821)