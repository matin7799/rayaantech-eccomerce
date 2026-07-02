
# Pricing

> **📞 Support & Feedback**
>
> Need help or found an issue with this documentation? Contact our support team on Telegram: [t.me/AvalAISupport](https://t.me/AvalAISupport)
>
> We're here to assist with technical questions, billing inquiries, and documentation improvements.

At AvalAI, we believe in full transparency. Our pricing is 100% aligned with the base API rates of the original providers, ensuring you always get fair and competitive costs without any hidden markups from our core services.

New users receive **25,000 Tomans in free credit** upon registration, allowing you to get a head start and test our services without immediate cost.

For complete details on all models and their capabilities, please visit our [Model Details](en/models/model-details.md) page.

## Flex Service Tier

The **Flex Service Tier** offers **50% reduced costs** compared to the default tier for select OpenAI models. This pricing tier provides significant savings for high-volume API usage.

> **⚠️ Important Considerations**
>
> The flex service tier has **higher latency** compared to the default tier. Requests may take longer to process, time out, or fail during processing.
>
> - **For faster processing** of API requests, use the default (standard) service tier (`"default"`)
> - **For lower prices with higher latency**, use the flex processing tier (`"flex"`)
> - **Server timeout**: Flex requests may take up to 900 seconds (15 minutes) to complete
> - **Production usage**: For time-sensitive applications, we recommend implementing a retry mechanism with fallback to `service_tier: "default"`

### How It Works

- **Default behavior**: All requests use the `"default"` service tier unless otherwise specified
- **Opt-in**: Send `"service_tier": "flex"` in your request to use flex pricing
- **Model validation**: Server rejects requests with `service_tier: "flex"` for unsupported models
- **Response field**: All API responses include a `"service_tier"` field indicating which tier was used

### Flex Tier Pricing

Prices are listed per 1 million tokens. These represent 50% savings compared to default tier pricing.

| Model | Input ($/1M tokens) | Cached Input ($/1M tokens) | Output ($/1M tokens) |
| :---- | :------------------ | :------------------------- | :------------------- |
| `gpt-5.2` | $0.875 | $0.0875 | $7.00 |
| `gpt-5.1` | $0.625 | $0.0625 | $5.00 |
| `gpt-5` | $0.625 | $0.0625 | $5.00 |
| `gpt-5-mini` | $0.125 | $0.0125 | $1.00 |
| `gpt-5-nano` | $0.025 | $0.0025 | $0.20 |
| `o3` | $1.00 | $0.25 | $4.00 |
| `o4-mini` | $0.55 | $0.138 | $2.20 |

### Usage Example

```bash
curl -i https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-mini",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false,
    "service_tier": "flex"
  }'
```

**Example Response:**

```json
{
  "id": "chatcmpl-123",
  "created": 1765789075,
  "model": "gpt-5-mini-2025-08-07",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Hi — how can I help you today?",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 123,
    "prompt_tokens": 7,
    "total_tokens": 130
  },
  "service_tier": "flex",
  "estimated_cost": {
    "unit": "0.0001238750",
    "irt": 16.27,
    "exchange_rate": 131350
  }
}
```

> **⚠️ Important: Credit Packages and Flex Tier**
>
> Credit packages do **NOT** cover flex service tier costs. When using `service_tier: "flex"`, costs are charged to your default account balance, not deducted from credit package allocations. Credit packages only apply to default service tier usage.

## Model Pricing Overview

Prices are listed per 1 million tokens, unless otherwise specified.

> **💡 Note: Cache Creation Costs**
>
> Some providers charge a separate fee for **Cache Creation** in addition to default input and cached input costs. This fee applies when first creating a cache for content and is typically **1.25× the input price**:
>
> | Provider | Model | Input Price | Cached Input Price | Cache Creation Price |
> |----------|-------|-------------|-------------------|----------------------|
> | **Anthropic** | claude-opus-4-8 | $5.00/1M | $1.50/1M | $6.25/1M |
> | **Anthropic** | claude-opus-4-7 | $5.00/1M | $1.50/1M | $6.25/1M |
> | **Anthropic** | claude-opus-4-6 | $5.00/1M | $1.50/1M | $6.25/1M |
> | **Anthropic** | claude-sonnet-4-6 | $3.00/1M | $1.50/1M | $3.75/1M |
> | **Anthropic** | claude-opus-4-5 | $5.00/1M | $1.50/1M | $6.25/1M |
> | **Anthropic** | claude-opus-4-1 | $15.00/1M | $7.50/1M | $18.75/1M |
> | **Anthropic** | claude-sonnet-4-5 | $3.00/1M | $1.50/1M | $3.75/1M |
> | **Anthropic** | claude-haiku-4-5 | $1.00/1M | $0.50/1M | $1.25/1M |
> | **Anthropic** | claude-3-5-haiku | $0.80/1M | $0.40/1M | $1.00/1M |
> | **Anthropic** | claude-3-haiku | $0.25/1M | $0.15/1M | $0.3125/1M |
> | **MiniMax** | minimax-m2.1 | $0.30/1M | $0.03/1M | $0.375/1M |
> | **MiniMax** | minimax-m2.1-lightning | $0.30/1M | $0.03/1M | $0.375/1M |
> | **MiniMax** | minimax-m2 | $0.30/1M | $0.03/1M | $0.375/1M |
>
> For these models, caching costs are calculated as follows:
> - **First request**: Standard input cost + cache creation cost (when caching is enabled)
> - **Subsequent requests**: Cached input cost (for cached content)

### Chat & Completion Models

| Model ID | Provider | Input Price ($/1M tokens) | Cached Input Price ($/1M tokens) | Output Price ($/1M tokens) | Notes |
| :--------------------------------- | :--------- | :------------------------ | :----------------------------- | :------------------------- | :---- |
| `gpt-5.5` | OpenAI | $5.00 | $0.50 | $30.00 | Flagship model, 1M context, agentic coding SOTA |
| `gpt-5.4-pro` <br> `gpt-5.4-pro-2026-03-05` | OpenAI | $30.00 | $0.30 | $180.00 | Tier 2+ users, 1.05M context, >272K: 2x input/1.5x output |
| `gpt-5.4` <br> `gpt-5.4-2026-03-05` | OpenAI | $2.50 | $0.25 | $15.00 | 1.05M context, >272K: 2x input/1.5x output |
| `gpt-5.4-mini` | OpenAI | $0.75 | $0.075 | $4.50 | 400K context, fast & cost-efficient |
| `gpt-5.4-nano` | OpenAI | $0.20 | $0.02 | $1.25 | 400K context, fastest & most affordable |
| `gpt-5.3-chat` <br> `gpt-5.3-chat-latest` | OpenAI | $1.75 | $0.175 | $14.00 | 128K context, ChatGPT optimized |
| `gpt-5.2` <br> `gpt-5.2-2025-12-11` | OpenAI | $1.75 | $0.175 | $14.00 | |
| `gpt-5.2-pro` <br> `gpt-5.2-pro-2025-12-11` | OpenAI | $21.00 | - | $168.00 | Tier 2+ users, Responses only |
| `gpt-5.3-codex` | OpenAI | $1.75 | $0.175 | $14.00 | Frontier agentic coding, 512K context, Responses only |
| `gpt-5.2-codex` | OpenAI | $1.75 | $0.175 | $14.00 | Agentic coding, 400K context |
| `gpt-5` <br> `gpt-5-2025-08-07` <br> `gpt-5-chat` <br> `gpt-5-chat-latest` | OpenAI | $1.25 | $0.125 | $10.00 | |
| `gpt-5.1` <br> `gpt-5.1-2025-11-13` | OpenAI | $1.25 | $0.125 | $10.00 | |
| `gpt-5.1-chat` <br> `gpt-5.1-chat-2025-12-01` | OpenAI | $1.25 | $0.125 | $10.00 | Chat-optimized |
| `gpt-5-pro` <br> `gpt-5-pro-2025-10-06` | OpenAI | $15.00 | - | $120.00 | Tier 2+ users |
| `gpt-5.1-codex` | OpenAI | $1.25 | $0.125 | $10.00 | Responses mode only |
| `gpt-5.1-codex-mini` | OpenAI | $0.25 | $0.025 | $2.00 | Responses mode only |
| `gpt-5.1-codex-max` | OpenAI | $1.25 | $0.125 | $10.00 | Agentic coding |
| `gpt-5-codex` | OpenAI | $1.25 | $0.125 | $10.00 | Responses mode |
| `gpt-5-mini` <br> `gpt-5-mini-2025-08-07` | OpenAI | $0.25 | $0.025 | $2.00 | |
| `gpt-5-nano` <br> `gpt-5-nano-2025-08-07` | OpenAI | $0.05 | $0.005 | $0.40 | |
| ~~`gpt-4.5-preview`~~ <br> ~~`gpt-4.5-preview-2025-02-27`~~ | OpenAI | $75.00 | $37.00 | $150.00 | **gpt-4.5-preview deprecated** |
| `gpt-4o` <br> `gpt-4o-2024-08-06` <br> `gpt-4o-2024-11-20` | OpenAI | $2.50 | $1.25 | $10.00 | |
| `chatgpt-4o-latest` | OpenAI | $5.00 | $2.50 | $15.00 | |
| `gpt-4o-2024-05-13` | OpenAI | $5.00 | $1.25 | $15.00 | |
| `gpt-4o-mini` <br> `gpt-4o-mini-2024-07-18` | OpenAI | $0.15 | $0.075 | $0.60 | |
| `gpt-4` <br> `gpt-4-0613` | OpenAI | $30.00 | $15.00 | $60.00 | |
| `gpt-4-0125-preview` <br> `gpt-4-1106-preview` <br> `gpt-4-turbo` <br> `gpt-4-turbo-2024-04-09` | OpenAI | $10.00 | $5.00 | $30.00 | |
| ~~`gpt-3.5-turbo`~~ <br> `gpt-3.5-turbo-0125` | OpenAI | $0.50 | $0.25 | $1.50 | **gpt-3.5-turbo deprecated** |
| `gpt-3.5-turbo-1106` | OpenAI | $1.00 | $0.50 | $2.00 | |
| `gpt-3.5-turbo-0613` <br> `gpt-3.5-turbo-0301` | OpenAI | $1.50 | $0.75 | $2.00 | |
| `gpt-3.5-turbo-16k-0613` | OpenAI | $3.00 | $1.50 | $4.00 | |
| `gpt-3.5-turbo-instruct` | OpenAI | $1.50 | $0.75 | $2.00 | Completion model |
| `codex-mini-latest` | OpenAI | $1.50 | $0.375 | $6.00 | Responses mode |
| `o1-pro` <br> `o1-pro-2025-03-19` | OpenAI | $150.00 | $75.00 | $600.00 | Responses mode |
| `o3` <br> `o3-2025-04-16` | OpenAI | $2.00 | $0.50 | $8.00 | |
| `o3-pro` <br> `o3-pro-2025-06-10` | OpenAI | $20.00 | $10.00 | $80.00 | |
| `o3-deep-research` <br> `o3-deep-research-2025-06-26` | OpenAI | $10.00 | $2.50 | $40.00 | |
| `o4-mini` <br> `o4-mini-2025-04-16` | OpenAI | $1.10 | $0.55 | $4.40 | |
| `o4-mini-deep-research` <br> `o4-mini-deep-research-2025-06-26` | OpenAI | $2.00 | $0.50 | $8.00 | |
| `o3-mini` <br> `o3-mini-2025-01-31` | OpenAI | $1.10 | $0.55 | $4.40 | |
| `o1-mini` <br> `o1-mini-2024-09-12` | OpenAI | $1.10 | $0.55 | $4.40 | |
| `o1` <br> `o1-2024-12-17` | OpenAI | $15.00 | $7.50 | $60.00 | |
| `o1-preview` <br> `o1-preview-2024-09-12` | OpenAI | $15.00 | $7.50 | $60.00 | |
| `gpt-4.1` <br> `gpt-4.1-2025-04-14` | OpenAI | $2.00 | $0.50 | $8.00 | |
| `gpt-4.1-mini` <br> `gpt-4.1-mini-2025-04-14` | OpenAI | $0.40 | $0.10 | $1.60 | |
| `gpt-4.1-nano` <br> `gpt-4.1-nano-2025-04-14` | OpenAI | $0.10 | $0.025 | $0.40 | |
| `gpt-oss-120b` | OpenAI | $0.30 | $0.15 | $2.50 | |
| `openai.gpt-oss-120b-1:0` | OpenAI | $0.15 | $0.075 | $0.60 | |
| `gpt-oss-20b` | OpenAI | $0.07 | $0.0035 | $0.30 | |
| `openai.gpt-oss-20b-1:0` | OpenAI | $0.07 | $0.0035 | $0.30 | |
| `computer-use-preview` <br> `computer-use-preview-2025-03-11` | OpenAI | $3.00 | $1.50 | $12.00 | |
| `gemini-3.5-flash` | Google | $1.50 | $0.25 | $9.00 | Audio: $1.00/$0.50 (cached)/$1.00 (output) |
| `gemini-3.1-pro-preview` | Google | $2.00 | $0.825 | $12.00 | Input/Output above 200K tokens: $4.00/$18.00, Audio: $7.00/$1.50 (cached)/$7.00 |
| `gemini-3.1-flash-lite-preview` <br> `gemini-3.1-flash-lite` | Google | $0.25 | $0.025 | $1.50 | Audio: $0.50/$0.05 (cached)/$1.50 (output) |
| `gemini-3-pro-preview` | Google | $2.00 | $0.825 | $12.00 | Input/Output above 200K tokens: $4.00/$18.00, Audio: $7.00/$7.00/$1.50 (cached) |
| `gemini-3-flash-preview` | Google | $0.50 | $0.25 | $3.00 | Audio: $1.50/$0.50 (cached)/$1.50 (output) |
| `gemini-2.5-pro` <br> ~~`gemini-2.5-pro-preview-06-05`~~ <br> ~~`gemini-2.5-pro-preview-05-06`~~ <br> ~~`gemini-2.5-pro-preview-03-25`~~ | Google | $1.25 | $0.625 | $10.00 | Input/Output above 200K tokens: $2.50/$15.00, Audio: $7.00/$7.00 |
| `gemini-2.5-flash` <br> `gemini-2.5-flash-preview-09-2025` <br> ~~`gemini-2.5-flash-preview-05-20`~~ <br> `gemini-2.5-flash-preview-04-17` <br> `gemini-flash-latest` | Google | $0.30 | $0.15 | $2.50 | Audio: $1.00/$1.00 |
| `gemini-robotics-er-1.5-preview` | Google | $0.30 | $0.15 | $2.50 | Audio: $1.00/$0.25 (cached) - Robotics vision-language model |
| `gemini-2.5-flash-lite` <br> `gemini-2.5-flash-lite-preview-09-2025` <br> ~~`gemini-2.5-flash-lite-preview-06-17`~~ <br> `gemini-flash-lite-latest` | Google | $0.10 | $0.05 | $0.40 | Audio: $0.10/$0.40 |
| ~~`gemini-2.0-pro-exp-02-05`~~ <br> ~~`gemini-2.0-flash-thinking-exp-01-21`~~ <br> ~~`gemini-2.0-flash-thinking-exp`~~ | Google | $3.50 | $1.50 | $7.00 | Audio: $7.00/$7.00 |
| `gemini-2.0-flash` <br> ~~`gemini-2.0-flash-exp`~~ | Google | $0.10 | $0.025 | $0.40 | Audio: $0.70/$0.40 **gemini-2.0-flash-exp deprecated** |
| `gemini-2.0-flash-lite` | Google | $0.075 | $0.01875 | $0.30 | Audio: $0.075/$0.30 |
| ~~`gemini-1.5-flash-002` <br> `gemini-1.5-flash-001` <br> ~~`gemini-1.5-flash`~~ <br> ~~`gemini-1.5-flash-latest`~~ <br> ~~`gemini-1.5-flash-exp-0827`~~ | Google | $0.075 | $0.0375 | $0.30 | Input/Output above 128K tokens: $0.15/$0.60 **Deprecated** |
| ~~`gemini-1.5-flash-8b`~~ <br> ~~`gemini-1.5-flash-8b-exp-0924`~~ <br> ~~`gemini-1.5-flash-8b-exp-0827`~~ | Google | $0.0375 | $0.02 | $0.15 | Input/Output above 128K tokens: $0.075/$0.30 **Deprecated** |
| ~~`gemini-exp-1114`~~ <br> ~~`gemini-exp-1206`~~ | Google | $2.50 | $0.625 | $10.00 | **Deprecated** |
| ~~`gemini-pro`~~ | Google | $0.50 | $0.25 | $1.50 | **Deprecated** |
| ~~`gemini-1.5-pro`~~ <br> ~~`gemini-1.5-pro-latest`~~ | Google | $1.25 | $0.625 | $5.00 | **Deprecated** - Input/Output above 128K tokens: $2.50/$10.00 |
| ~~`gemini-1.5-pro-002`~~ <br> ~~`gemini-1.5-pro-001`~~ <br> ~~`gemini-1.5-pro-exp-0801`~~ <br> ~~`gemini-1.5-pro-exp-0827`~~ | Google | $2.50 | $0.625 | $10.00 | **Deprecated** |
| `gemma-4-26b-a4b-it` | Google | $0.15 | $0.038 | $0.60 | MoE 26B/4B active, 140 languages, multimodal |
| `gemma-4-31b-it` | Google | $0.25 | $0.063 | $1.00 | Dense 31B, full-precision, chat API only |
| `gemma-3-1b-it` <br> `gemma-3-4b-it` <br> `gemma-3-12b-it` <br> `gemma-3-27b-it` <br> `gemma-3n-e2b-it` <br> `gemma-3n-e4b-it` | Google | $0.001 | $0.0001 | $0.005 | |
| `claude-opus-4-8` <br> `global.anthropic.claude-opus-4-8` | Anthropic | $5.00 | $1.50 | $25.00 | Tier 1+, Smart routing, native 1M context, mid-conversation system messages |
| `claude-opus-4-7` <br> `global.anthropic.claude-opus-4-7` | Anthropic | $5.00 | $1.50 | $25.00 | Tier 1+, Smart routing, 1M context |
| `claude-opus-4-6` <br> `anthropic.claude-opus-4-6-v1` | Anthropic | $5.00 | $1.50 | $25.00 | Tier 1+, Smart routing, 1M context (beta) |
| `claude-sonnet-4-6` <br> `anthropic.claude-sonnet-4-6-v1` | Anthropic | $3.00 | $1.50 | $15.00 | Smart routing, 1M context (beta) |
| `claude-opus-4-5` <br> `anthropic.claude-opus-4-5-20251101-v1:0` | Anthropic | $5.00 | $1.50 | $25.00 | Tier 1+, Smart routing |
| `claude-opus-4-1` <br> `anthropic.claude-opus-4-20250514-v1:0` <br> `anthropic.claude-opus-4-1-20250805-v1:0` <br> `anthropic.claude-3-opus-20240229-v1:0` | Anthropic | $15.00 | $7.50 | $75.00 | Tier 1+, Smart routing (base) |
| `claude-sonnet-4-5` <br> `anthropic.claude-sonnet-4-5-20250929-v1:0` <br> `anthropic.claude-sonnet-4-20250514-v1:0` <br> `anthropic.claude-3-7-sonnet-20250219-v1:0` <br> `anthropic.claude-3-5-sonnet-20241022-v2:0` <br> `anthropic.claude-3-5-sonnet-20240620-v1:0` <br> `anthropic.claude-3-sonnet-20240229-v1:0` | Anthropic | $3.00 | $1.50 | $15.00 | Smart routing (base) |
| `anthropic.claude-3-5-haiku-20241022-v1:0` | Anthropic | $0.80 | $0.40 | $4.00 | |
| `claude-haiku-4-5` <br> `anthropic.claude-haiku-4-5-20251001-v1:0` | Anthropic | $1.00 | $0.50 | $5.00 | Smart routing (base) |
| `anthropic.claude-3-haiku-20240307-v1:0` | Anthropic | $0.25 | $0.15 | $1.25 | |
| `grok-4.3` | XAI | $1.25 | $0.20 | $2.50 | 1M context, >200K: $2.50/$0.40/$5.00, reasoning, function calling |
| `grok-4` <br> `grok-4-0709` <br> `grok-4-latest` | XAI | $3.00 | $0.75 | $15.00 | |
| `grok-3` <br> `grok-3-latest` <br> `grok-3-beta` | XAI | $3.00 | $1.50 | $15.00 | |
| `grok-3-fast` <br> `grok-3-fast-latest` <br> `grok-3-fast-beta` | XAI | $5.00 | $2.50 | $25.00 | |
| `grok-4.20-reasoning` | XAI | $2.00 | $0.20 | $6.00 | Stable, 2M context, >200K: $4.00/$0.40/$12.00, industry-leading speed |
| `grok-4.20-non-reasoning` | XAI | $2.00 | $0.20 | $6.00 | Stable, 2M context, >200K: $4.00/$0.40/$12.00, lowest hallucination |
| `grok-4.20-beta-0309-reasoning` | XAI | $2.00 | $0.20 | $6.00 | 2M context, >200K: $4.00/$0.40/$12.00, industry-leading speed |
| `grok-4.20-beta-0309-non-reasoning` | XAI | $2.00 | $0.20 | $6.00 | 2M context, >200K: $4.00/$0.40/$12.00, lowest hallucination |
| `grok-4-1-fast-reasoning` | XAI | $0.20 | $0.05 | $0.50 | 2M context window |
| `grok-4-1-fast-non-reasoning` | XAI | $0.20 | $0.05 | $0.50 | 2M context window |
| `grok-4-fast-reasoning` <br> `grok-4-fast-non-reasoning` | XAI | $0.20 | $0.05 | $0.50 | |
| `grok-code-fast-1` | XAI | $0.20 | $0.02 | $1.50 | |
| `grok-3-mini` <br> `grok-3-mini-latest` <br> `grok-3-mini-beta` | XAI | $0.30 | $0.15 | $0.50 | |
| `grok-3-mini-fast` <br> `grok-3-mini-fast-latest` <br> `grok-3-mini-fast-beta` | XAI | $0.60 | $0.30 | $4.00 | |
| `grok-2` <br> `grok-2-latest` <br> `grok-2-1212` | XAI | $2.00 | $1.00 | $10.00 | Audio: $7.00/$7.00 |
| `grok-2-vision` <br> `grok-2-vision-latest` <br> `grok-2-vision-1212` | XAI | $2.00 | $1.00 | $10.00 | Image Input: $2.00, Audio: $7.00/$7.00 |
| `cohere.command-light-text-v14` | Cohere | $0.30 | $0.15 | $0.60 | |
| `cohere.command-r-plus-v1:0` | Cohere | $3.00 | $1.50 | $15.00 | |
| `cohere.command-r-v1:0` | Cohere | $0.50 | $0.25 | $1.50 | |
| `cohere.command-text-v14` | Cohere | $1.50 | $0.75 | $2.00 | |
| `deepseek-v4-pro` | DeepSeek | $1.74 | $0.145 | $3.48 | Flagship V4 model (1.6T/49B) with 1M context, SOTA Agentic Coding, thinking mode |
| `deepseek-v4-flash` | DeepSeek | $0.14 | $0.028 | $0.28 | Fast, economical V4 flagship (284B/13B) with 1M context, dual thinking/non-thinking modes |
| `deepseek-reasoner` | DeepSeek | $1.74 | $0.145 | $3.48 | Legacy alias, routes to `deepseek-v4-pro` (retires July 24, 2026) |
| `deepseek-r1-0528` | DeepSeek | $0.28 | $0.028 | $0.42 | DeepSeek-R1 via Azure AI |
| `deepseek-chat` | DeepSeek | $0.14 | $0.028 | $0.28 | Legacy alias, routes to `deepseek-v4-flash` (retires July 24, 2026) |
| `deepseek-coder` <br> `deepseek-v3-0324` <br> `deepseek-v3.1` | DeepSeek | $0.28 | $0.028 | $0.42 | DeepSeek V3 family non-thinking mode |
| `deepseek-v3.2` | DeepSeek | $0.28 | $0.028 | $0.42 | Via Azure AI with improved rate limits and reduced latency |
| `deepseek-v3.2-speciale` | DeepSeek | $0.28 | $0.028 | $0.42 | Via Azure AI. Deep reasoning mode with Olympiad-level performance |
| `deepseek.r1-v1:0` | DeepSeek | $1.35 | $0.675 | $5.40 | |
| `meta.llama3-1-8b-instruct-v1:0` | Meta | $0.22 | $0.11 | $0.22 | |
| `meta.llama3-1-70b-instruct-v1:0` | Meta | $0.50 | $0.25 | $1.50 | |
| `meta.llama3-1-405b-instruct-v1:0` | Meta | $5.50 | $2.50 | $16.00 | |
| `meta.llama3-3-70b-instruct-v1:0` | Meta | $0.72 | $0.50 | $0.72 | |
| `llama-4-scout-17b-16e-instruct` | Meta | $0.18 | $0.09 | $0.59 | |
| `llama-4-maverick-17b-128e-instruct-fp8` | Meta | $0.27 | $0.14 | $0.85 | |
| `mistral.mistral-large-2407-v1:0` | Mistral AI | $3.00 | $1.50 | $9.00 | |
| `mistral-large-3` | Mistral AI | $0.50 | $0.05 | $1.50 | 675B params, Apache 2.0 |
| `mistral-small-2503` | Mistral AI | $0.10 | $0.05 | $0.30 | |
| `codestral-2501` | Mistral AI | $0.30 | $0.15 | $0.90 | |
| `mistral-ocr-2503` | Mistral AI | - | - | - | $0.001/page |
| `mistral-ocr-2505` | Mistral AI | - | - | - | $0.001/page |
| `mistral-ocr-latest` | Mistral AI | - | - | - | $0.002/page |
| `qwen3.7-max` | Alibaba | $2.50 | $0.25 | $7.50 | 50% promo through Jun 22, 2026. After: $5.00 / $0.50 / $15.00. Cache creation: $3.125 promo / $6.25 standard. Partial `v1/responses` support |
| `qwen3-max` | Alibaba | $1.20 | $0.10 | $6.00 | Above 32K: $2.40/$12.00, Above 128K: $3.00/$15.00 |
| `qwen3.6-plus` | Alibaba | $0.45 | $0.045 | $2.70 | 1M context default, agentic coding SOTA 78.8% SWE-bench |
| `qwen3.6-flash` | Alibaba | $0.25 | $0.025 | $1.50 | 1M context, above 256K: $0.50/$0.05/$3.00, hybrid thinking |
| `qwen3.6-27b` | Alibaba | $0.60 | $0.06 | $3.60 | Mid-size dense, 256K context, strong reasoning/coding |
| `qwen3.6-35b-a3b` | Alibaba | $0.248 | $0.025 | $1.485 | 35B total/3B active MoE, open-weight, 256K context |
| `qwen3.6-max-preview` | Alibaba | $1.30 | $0.13 | $7.80 | Flagship preview, above 128K: $2.60/$0.26/$15.60 |
| `qwen3.5-plus` <br> `qwen3.5-plus-2026-02-15` | Alibaba | $0.40 | $0.04 | $2.40 | Above 256K: $1.20/$0.12/$7.20. 1M context, vision-language |
| `qwen3.5-flash` | Alibaba | $0.10 | $0.01 | $0.40 | Cache creation: $0.125/1M. 1M context, hybrid architecture |
| `qwen3.5-397b-a17b` | Alibaba | $0.60 | $0.06 | $3.60 | 397B total/17B active, open-weight vision-language |
| `qwen3.5-35b-a3b` | Alibaba | $0.25 | $0.12 | $2.00 | 35B total/3B active, open-weight hybrid MoE |
| `qwen3-coder-next` | Alibaba | $0.30 | $0.15 | $1.50 | 80B MoE/10B active, frontier coding agents, 1M context |
| `qwen3-next-80b-a3b-thinking` | Alibaba | $0.144 | $0.072 | $1.434 | |
| `qwen3-next-80b-a3b-instruct` | Alibaba | $0.144 | $0.072 | $0.574 | |
| `qwen3-coder-flash` <br> `qwen3-coder-flash-2025-07-28` | Alibaba | $0.30 | $0.10 | $1.50 | Above 32K: $0.50/$2.50, Above 128K: $0.80/$4.00, Above 256K: $1.60/$9.60 |
| `qwen3-max-preview` | Alibaba | $1.20 | $0.10 | $6.00 | Above 32K: $2.40/$12.00, Above 128K: $3.00/$15.00 |
| `qwen3-235b-a22b-fp8-tput` | Alibaba | $0.20 | $0.10 | $0.60 | |
| `qwen3-235b-a22b` | Alibaba | $0.70 | $0.35 | $8.40 | |
| `qwen3-235b-a22b-instruct-2507` | Alibaba | $0.70 | $0.35 | $2.80 | |
| `qwen3-235b-a22b-thinking-2507` | Alibaba | $0.70 | $0.35 | $8.40 | |
| `qwen3-coder-plus` <br> `qwen3-coder-plus-2025-07-22` | Alibaba | $1.00 | $0.10 | $5.00 | Above 32K: $1.80/$9.00, Above 128K: $3.00/$15.00, Above 256K: $6.00/$60.00 |
| `qwen3-coder-480b-a35b-instruct` | Alibaba | $1.50 | $0.15 | $7.50 | Above 32K: $2.70/$13.50, Above 128K: $4.50/$22.50 |
| `qwen3-32b` | Alibaba | $0.70 | $0.35 | $8.40 | |
| `qwen3-30b-a3b` | Alibaba | $0.20 | $0.10 | $2.40 | |
| `qwen3-30b-a3b-instruct-2507` | Alibaba | $0.20 | $0.10 | $0.80 | |
| `qwen3-30b-a3b-thinking-2507` | Alibaba | $0.20 | $0.10 | $2.40 | |
| `qwen3-14b` | Alibaba | $0.35 | $0.16 | $4.20 | |
| `qwen3-8b` | Alibaba | $0.18 | $0.09 | $2.10 | |
| `qwen3-4b` | Alibaba | $0.11 | $0.05 | $1.26 | |
| `qwen3-1.7b` | Alibaba | $0.11 | $0.05 | $1.26 | |
| `qwen3-0.6b` | Alibaba | $0.11 | $0.05 | $1.26 | |
| `qwq-32b` | Alibaba | $1.20 | $0.60 | $1.20 | |
| `qwq-plus` <br> `qwq-plus-latest` <br> `qwq-plus-2025-03-05` | Alibaba | $0.80 | $0.40 | $2.40 | |
| `qvq-max` <br> `qvq-max-latest` <br> `qvq-max-2025-03-25` | Alibaba | $1.20 | $0.60 | $4.80 | |
| `qwen-max` <br> `qwen-max-latest` <br> `qwen-max-2025-01-25` | Alibaba | $1.60 | $0.80 | $6.40 | |
| `qwen-plus` <br> `qwen-plus-latest` <br> `qwen-plus-2025-07-14` <br> `qwen-plus-2025-04-28` | Alibaba | $0.40 | $0.20 | $4.00 | |
| `qwen-flash` <br> `qwen-flash-2025-07-28` | Alibaba | $0.05 | $0.025 | $0.40 | Above 256K: $0.25/$2.00 |
| `qwen-plus-2025-09-11` | Alibaba | $0.40 | $0.20 | $4.00 | |
| `qwen-turbo` <br> `qwen-turbo-latest` <br> `qwen-turbo-2025-04-28` | Alibaba | $0.05 | $0.02 | $0.50 | |
| `qwen-plus-character` | Alibaba | $0.50 | $0.05 | $1.40 | Role-playing, virtual characters |
| `qwen3-vl-32b-instruct` | Alibaba | $0.16 | $0.08 | $0.64 | Open-source vision-language |
| `qwen3-vl-plus` | Alibaba | $0.20 | $0.10 | $1.60 | Above 32K: $0.30/$2.40, Above 128K: $0.60/$4.80 |
| `qwen3-vl-flash` | Alibaba | $0.05 | $0.01 | $0.40 | Above 32K: $0.075/$0.60, Above 128K: $0.12/$0.96 |
| `qwen-mt-plus` | Alibaba | $2.46 | $1.20 | $7.37 | |
| `qwen-mt-turbo` | Alibaba | $0.16 | $0.08 | $0.49 | |
| `qwen-mt-flash` | Alibaba | $0.16 | $0.08 | $0.49 | 92 languages, high-quality |
| `qwen-mt-lite` | Alibaba | $0.12 | $0.06 | $0.36 | 92 languages, fast & economical |
| `qwen2.5-72b-instruct` | Alibaba | $1.40 | $0.70 | $5.60 | |
| `qwen2.5-32b-instruct` | Alibaba | $0.70 | $0.35 | $2.80 | |
| `qwen2.5-14b-instruct` | Alibaba | $0.35 | $0.16 | $1.40 | |
| `qwen2.5-14b-instruct-1m` | Alibaba | $0.805 | $0.40 | $3.22 | |
| `qwen2.5-7b-instruct` | Alibaba | $0.175 | $0.08 | $0.70 | |
| `qwen2.5-7b-instruct-1m` | Alibaba | $0.368 | $0.18 | $1.47 | |
| `qwen2.5-vl-72b-instruct` | Alibaba | $1.95 | $1.00 | $8.00 | |
| `qwen2.5-vl-32b-instruct` | Alibaba | $1.40 | $0.70 | $4.20 | |
| `qwen2.5-vl-7b-instruct` | Alibaba | $0.35 | $0.16 | $1.05 | |
| `qwen2.5-vl-3b-instruct` | Alibaba | $0.21 | $0.10 | $0.63 | |
| `nvidia_nim.llama-3.3-nemotron-super-49b-v1.5` | Nvidia NIM | $0.01 | $0.001 | $0.03 | Research pricing |
| `nvidia_nim.llama-4-scout-17b-16e-instruct` | Nvidia NIM | $0.011 | $0.0055 | $0.034 | Research pricing |
| `nvidia_nim.llama-3.1-nemotron-ultra-253b-v1:0` | Nvidia NIM | $0.06 | $0.001 | $0.18 | Research pricing |
| `nvidia_nim.qwen3-next-80b-a3b-thinking` | Nvidia NIM | $0.015 | $0.001 | $0.12 | Research pricing |
| `nvidia_nim.gpt-oss-120b` | Nvidia NIM | $0.03 | $0.015 | $0.25 | Research pricing |
| `nvidia_nim.gpt-oss-20b` | Nvidia NIM | $0.007 | $0.001 | $0.03 | Research pricing |
| `nvidia_nim.nemotron-parse` | Nvidia NIM | $0.01 | $0.001 | $0.06 | Research pricing |
| `nvidia_nim.nemotron-nano-12b-v2-vl` | Nvidia NIM | $0.01 | $0.001 | $0.06 | Research pricing, Vision |
| `nvidia_nim.nvidia-nemotron-nano-9b-v2` | Nvidia NIM | $0.004 | $0.001 | $0.016 | Research pricing |
| `nvidia_nim.eurollm-9b-instruct` | Nvidia NIM | $0.022 | $0.001 | $0.022 | Research pricing |
| `nvidia_nim.gemma-3-1b-it` | Nvidia NIM | $0.001 | $0.0001 | $0.005 | Research pricing |
| `nemotron-3-ultra` | Fireworks.ai | $0.60 | $0.12 | $2.40 | NVIDIA flagship, complex reasoning & agentic (via Fireworks.ai) |
| `qwen-vl-max` <br> `qwen-vl-max-latest` <br> `qwen-vl-max-2025-04-08` | Alibaba | $0.80 | $0.40 | $3.20 | |
| `qwen-vl-plus` <br> `qwen-vl-plus-latest` <br> `qwen-vl-plus-2025-05-07` | Alibaba | $0.21 | $0.10 | $0.63 | |
| `qwen-vl-ocr` | Alibaba | $0.72 | - | $0.72 | |
| `kimi-k2.7-code` | Moonshot.ai | $1.045 | $0.19 | $4.40 | 10% added for Singapore GST, SOTA open-source coding (via Fireworks.ai) |
| `kimi-k2.7-code-highspeed` | Moonshot.ai | $2.09 | $0.418 | $8.80 | 10% added for Singapore GST, High-speed coding variant (via Fireworks.ai) |
| `kimi-k2.6` | Moonshot.ai | $1.05 | $0.18 | $4.40 | 10% added for Singapore GST, From Code to Creation, Agent Swarm |
| `kimi-k2.5` | Moonshot.ai | $0.66 | $0.11 | $3.30 | 10% added for Singapore GST, Visual agentic intelligence |
| `kimi-k2-thinking` | Moonshot.ai | $0.66 | $0.165 | $2.75 | 10% added for Singapore GST, Search: $0.005/query |
| `kimi-k2-0711-preview` | Moonshot.ai | $0.66 | $0.165 | $2.75 | 10% added for Singapore GST |
| `kimi-latest` | Moonshot.ai | $0.22 | $0.165 | $5.50 | 10% added for Singapore GST |
| `kimi-thinking-preview` | Moonshot.ai | $33.00 | $0.165 | $33.00 | 10% added for Singapore GST |
| `moonshot-v1-8k` | Moonshot.ai | $0.22 | $0.165 | $2.20 | 10% added for Singapore GST |
| `moonshot-v1-8k-vision-preview` | Moonshot.ai | $0.22 | $0.165 | $2.20 | 10% added for Singapore GST |
| `moonshot-v1-32k` | Moonshot.ai | $1.10 | $0.165 | $3.30 | 10% added for Singapore GST |
| `moonshot-v1-32k-vision-preview` | Moonshot.ai | $1.10 | $0.165 | $3.30 | 10% added for Singapore GST |
| `moonshot-v1-128k` | Moonshot.ai | $2.20 | $0.165 | $5.50 | 10% added for Singapore GST |
| `moonshot-v1-128k-vision-preview` | Moonshot.ai | $2.20 | $0.165 | $5.50 | 10% added for Singapore GST |
| `moonshot-v1-auto` | Moonshot.ai | $2.20 | $0.165 | $5.50 | 10% added for Singapore GST |
| `glm-5.2` | Z.AI | $1.40 | $0.26 | $4.40 | 1M context, frontier coding, long-horizon agentic engineering |
| `glm-5.1` | Z.AI | $1.32 | $0.264 | $6.60 | SWE-Bench Pro 58.4%, long-horizon optimization |
| `glm-5v-turbo` | Z.AI | $1.32 | $0.264 | $4.40 | Multimodal vision, 80% cache reduction |
| `glm-5` | Z.AI | $1.10 | $0.22 | $3.52 | Flagship, SOTA coding, agentic engineering |
| `glm-5-turbo` | Z.AI | $1.32 | $0.264 | $4.40 | OpenClaw native, agentic workflows, tool calling, MCP |
| `glm-4.7` | Z.AI | $0.60 | $0.11 | $2.20 | Deep thinking, o3-level reasoning |
| `glm-4.7-flashx` | Z.AI | $0.077 | $0.011 | $0.44 | Fast, cost-effective coding |
| `glm-4.7-flash` | Z.AI | $0.07 | $0.01 | $0.40 | Balanced performance, development |
| `glm-4.6` | Z.AI | $0.60 | $0.11 | $2.20 | Web Search: $0.01/call |
| `groq.llama-guard-4-12b` | groq | $0.20 | $0.10 | $0.20 | Safety & Content Moderation |
| `groq.llama-prompt-guard-2-22m` | groq | $0.03 | $0.015 | $0.03 | Prompt Injection Detection (22M) |
| `groq.llama-prompt-guard-2-86m` | groq | $0.04 | $0.02 | $0.04 | Prompt Injection Detection (86M) |
| `groq.llama-4-maverick-17b-128e-instruct` | groq | $0.20 | $0.10 | $0.60 | Llama 4 with 128 experts |
| `groq.llama-4-scout-17b-16e-instruct` | groq | $0.11 | $0.055 | $0.34 | Llama 4 with 16 experts |
| `groq.kimi-k2-instruct-0905` | groq | $1.00 | $0.50 | $0.34 | Instruction-following model |
| `groq.gpt-oss-120b` | groq | $0.15 | $0.075 | $0.75 | Open-source GPT (120B) |
| `groq.gpt-oss-20b` | groq | $0.075 | $0.0375 | $0.30 | Open-source GPT (20B) |
| `groq.gpt-oss-safeguard-20b` | groq | $0.075 | $0.0375 | $0.30 | Safety-enhanced GPT (20B) |
| `groq.qwen3-32b` | groq | $0.29 | $0.145 | $0.59 | Multilingual Qwen 3 (32B) |
| `minimax-m3` | MiniMax | $0.60 | $0.12 | $2.40 | Flagship: frontier coding, 1M context (MSA), native multimodal. Above 512K: $1.20 / $0.24 / $4.80. [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2.7` | MiniMax | $0.30 | $0.06 | $1.20 | Self-evolution, 56.22% SWE-Pro, ~60 tps, Agent Teams. [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2.7-highspeed` | MiniMax | $0.60 | $0.06 | $2.40 | Self-evolution, ~100 tps, fastest in class. [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2.5` | MiniMax | $0.30 | $0.03 | $1.20 | 204K context, ~50 tps, SOTA coding (80.2% SWE-Bench). [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2.5-lightning` | MiniMax | $0.30 | $0.03 | $2.40 | 204K context, ~100 tps, ultra-fast inference. [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2.1` | MiniMax | $0.30 | $0.03 | $1.20 | 204K context, ~60 tps, o3-level reasoning. [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2.1-lightning` | MiniMax | $0.30 | $0.03 | $2.40 | 204K context, ~100 tps, faster inference. [Docs](https://platform.minimax.io/docs/guides/quickstart) |
| `minimax-m2` | MiniMax | $0.30 | $0.03 | $1.20 | 204K context, previous generation. [Docs](https://platform.minimax.io/docs/guides/quickstart) |

### Cloudflare AI Models

| Model ID | Provider | Input Price ($/1M tokens) | Cached Input Price ($/1M tokens) | Output Price ($/1M tokens) | Notes |
| :--------------------------------- | :--------- | :------------------------ | :----------------------------- | :------------------------- | :---- |
| `cf.llama-4-scout-17b-16e-instruct` | Meta | $0.27 | $0.14 | $0.85 | |
| `cf.llama-3.3-70b-instruct-fp8-fast` | Meta | $0.29 | $0.15 | $2.25 | |
| `cf.llama-3.1-8b-instruct-fast` <br> `cf.llama-3.1-8b-instruct-awq` <br> `cf.llama-3.1-8b-instruct-fp8` <br> `cf.llama-3.1-8b-instruct` | Meta | $0.045-$0.282 | $0.022-$0.14 | $0.266-$0.827 | Various optimizations |
| `cf.llama-3.2-1b-instruct` <br> `cf.llama-3.2-3b-instruct` | Meta | $0.027-$0.051 | $0.014-$0.025 | $0.201-$0.335 | |
| `cf.gemma-3-12b-it` | Google | $0.345 | $0.175 | $0.556 | |
| `cf.mistral-small-3.1-24b-instruct` | Mistral AI | $0.351 | $0.175 | $0.555 | |
| `cf.qwq-32b` <br> `cf.qwen2.5-coder-32b-instruct` | Alibaba | $0.66 | $0.33 | $1.00 | |
| `cf.deepseek-r1-distill-qwen-32b` | DeepSeek | $0.497 | $0.25 | $4.881 | |
| `cf.llama-guard-3-8b` | Meta | $0.484 | $0.242 | $0.03 | |
| `cf.gemma-7b-it` <br> `cf.gemma-2b-it-lora` <br> `cf.gemma-7b-it-lora` | Google | $0.0098-$0.043 | $0.0045-$0.02 | $0.02-$0.09 | |
| `cf.llama-3.1-70b-instruct` | Meta | $1.20 | $0.60 | $4.80 | |
| `cf.nemotron-3-120b-a12b` | NVIDIA | $0.20 | $0.10 | $0.80 | LatentMoE 120B/12B active, 1M context, agentic |
| `cf.qwen3-30b-a3b-fp8` | Alibaba | $0.10 | $0.05 | $0.40 | Compact reasoning model |
| `cf.granite-4.0-h-micro` | IBM | $0.08 | $0.04 | $0.30 | Efficient enterprise model |
| `cf.gpt-oss-120b` | OpenAI OSS | $0.60 | $0.30 | $2.40 | Open source 120B model |
| `cf.gpt-oss-20b` | OpenAI OSS | $0.15 | $0.08 | $0.60 | Open source 20B model |

### Image Generation Models

Prices are listed per image generated.

| Model ID | Provider | Cost per Image ($) | Notes |
| :------------------------------- | :--------- | :----------------- | :---- |
| `gpt-image-2` <br> `gpt-image-2-2026-04-21` | OpenAI | Token-based | Text Input: $5.00/1M, Cached: $1.25/1M, Text Output: $10.00/1M, Image Input: $8.00/1M, Cached: $2.00/1M, Image Output: $30.00/1M. Next-gen image generation & editing |
| `gpt-image-1.5` | OpenAI | Token-based | Text Input: $5.00/1M, Cached: $2.00/1M, Text Output: $32.00/1M, Image Input: $8.00/1M, Image Output: $32.00/1M. State-of-the-art image generation & editing |
| `gpt-image-1` | OpenAI | $0.04 | Input: $5.00/1M tokens, Image Input: $10.00/1M tokens, Output: $40.00/1M tokens. Tier 3, 4, 5 only  |
| `gpt-image-1-mini` | OpenAI | $0.011-$0.052 | Quality-based: Low ($0.011-$0.016), Medium ($0.042-$0.063), High ($0.036-$0.052). Input: $5.00/1M tokens, Cached: $1.25/1M, Output: $40.00/1M. Tier 3, 4, 5 only |
| `dall-e-3` | OpenAI | $0.04 | |
| `imagen-4.0-generate-001` <br> `imagen-4.0-generate-preview-06-06` <br> `imagen-4.0-generate-preview-05-20` | Google | $0.04 | |
| `imagen-4.0-fast-generate-001` <br> `imagen-4.0-fast-generate-preview-06-06` | Google | $0.02 | |
| `imagen-4.0-ultra-generate-001` <br> `imagen-4.0-ultra-generate-exp-05-20` <br> `imagen-4.0-ultra-generate-preview-06-06` | Google | $0.06 | |
| `imagen-3.0-generate-002` <br> `imagen-3.0-generate-001` | Google | $0.04 | |
| `imagen-3.0-fast-generate-001` | Google | $0.02 | |
| `gemini-3-pro-image` | Google | $0.134 (1K-2K), $0.24 (4K) | Input: $2.00/1M tokens (text), $2.00/1M tokens (image), Cached: $0.50/1M, Output: $12.00/1M tokens (text), $0.134/image (1K-2K), $0.24/image (4K). Nano Banana Pro (stable) |
| `gemini-3.1-flash-image` | Google | $0.0672 (1K-2K), $0.101 (2K-4K), $0.151 (4K) | Input: $0.50/1M tokens (text), $0.50/1M tokens (image), Cached: $0.25/1M, Output: $3.00/1M tokens (text), $60.00/1M tokens (image). Nano Banana 2 (stable) |
| `gemini-3.1-flash-image-preview` | Google | $0.0672 (1K-2K), $0.101 (2K-4K), $0.151 (4K) | Input: $0.50/1M tokens (text), $0.50/1M tokens (image), Cached: $0.25/1M, Output: $3.00/1M tokens (text), $60.00/1M tokens (image). Nano Banana 2 |
| `gemini-3-pro-image-preview` | Google | $0.134 (1K-2K), $0.24 (4K) | Input: $2.00/1M tokens (text), $2.00/1M tokens (image), Cached: $0.50/1M, Output: $12.00/1M tokens (text), $0.134/image (1K-2K), $0.24/image (4K). Nano Banana Pro |
| `gemini-2.5-flash-image` | Google | $0.039 | Input: $0.10/1M tokens, Output: $0.40/1M tokens. Nano Banana |
| `gemini-2.0-flash-preview-image-generation` | Google | $0.039 | Input: $0.10/1M tokens, Output: $0.40/1M tokens |
| `stability.sd3-large-v1:0` <br> `stability.sd3-5-large-v1:0` | Stability AI | $0.08 | |
| `stability.stable-image-ultra-v1:1` <br> `stability.stable-image-ultra-v1:0` | Stability AI | $0.14 | |
| `stability.stable-image-core-v1:1` <br> `stability.stable-image-core-v1:0` | Stability AI | $0.04 | |
| `stability.stable-image-inpaint-v1:0` <br> `stability.stable-image-search-recolor-v1:0` <br> `stability.stable-image-search-replace-v1:0` <br> `stability.stable-image-erase-object-v1:0` <br> `stability.stable-image-remove-background-v1:0` <br> `stability.stable-image-control-sketch-v1:0` <br> `stability.stable-image-control-structure-v1:0` <br> `stability.stable-image-style-guide-v1:0` <br> `stability.stable-style-transfer-v1:0` | Stability AI | $0.04 | Image Editing Services |
| `flux.2-pro` | BFL | $0.03/MP | First MP: $0.03, Additional: $0.015/MP, Reference: $0.015/MP. Multi-reference visual intelligence |
| `flux-1.1-pro` | BFL | $0.04 | |
| `flux.1-kontext-pro` | BFL | $0.04 | |
| `qwen-image-2.0-pro` | Alibaba | $0.06 | Professional typography, 2K native, 40+ languages |
| `qwen-image-2.0` | Alibaba | $0.04 | Unified generation/editing, 2K native |
| `qwen-image` | Alibaba | $0.035 | |
| `qwen-image-edit` | Alibaba | $0.045 | |
| `z-image-turbo` | Alibaba | $0.015 (std) / $0.030 (thinking) | Fast generation, text rendering |
| `qwen-image-edit-plus` | Alibaba | $0.03 | Advanced editing, style transfer |
| `wan2.2-t2i-flash` | Alibaba | $0.025 | |
| `wan2.2-t2i-plus` | Alibaba | $0.05 | |
| `seedream-5-0-260128` | BytePlus | $0.035 | CoT reasoning, MJ-style aesthetics, advanced image generation |
| `seedream-4-5-251128` | BytePlus | $0.04 | Enhanced multi-image editing, typography, reference preservation |
| `seedream-4-0-250828` | BytePlus | $0.03 | State-of-the-art image generation and editing |
| `gen4_image` | RunwayML | $0.05 (720p), $0.08 (1080p) | Advanced image editing with multiple resolutions |
| `gen4_image_turbo` | RunwayML | $0.02 | Fast image editing optimized for speed |
| `cf.flux-2-klein-9b` | Cloudflare | $0.015 (≤1024px), $0.025 (>1024px) | High quality FLUX 2 Klein 9B |
| `cf.flux-2-klein-4b` | Cloudflare | $0.01 (≤1024px), $0.018 (>1024px) | Fast FLUX 2 Klein 4B |
| `cf.flux-2-dev` | Cloudflare | $0.012 | Development version |
| `cf.lucid-origin` | Cloudflare | $0.01 | Creative and artistic |
| `cf.phoenix-1.0` | Cloudflare | $0.008 | Balanced quality and speed |

### Video Generation Models

Prices are listed per second of video generated. Video generation is asynchronous - you submit a request and receive the video when processing completes.

| Model ID | Provider | Resolution | Cost per Second ($) | Notes |
| :------------------------------- | :--------- | :----------------- | :------------------ | :---- |
| `sora-2` | OpenAI | 720x1280, 1280x720 | $0.10 | Standard quality, natural motion, max 20 seconds |
| `sora-2-pro` | OpenAI | 720x1280, 1280x720 | $0.30 | High quality, enhanced detail and motion, max 20 seconds |
| `sora-2-pro` | OpenAI | 1024x1792, 1792x1024 | $0.50 | High-resolution output with superior quality, max 20 seconds |
| `veo-3.1-fast-generate-001` | Google | 720x1280, 1280x720, 1080x1920, 1920x1080 | $0.15 | Fast generation, native audio, max 8 seconds (stable) |
| `veo-3.1-fast-generate-preview` | Google | 720x1280, 1280x720, 1080x1920, 1920x1080 | $0.15 | Fast generation, native audio, max 8 seconds (deprecated) |
| `veo-3.1-generate-001` | Google | 720x1280, 1280x720, 1080x1920, 1920x1080 | $0.40 | High quality, rich audio, enhanced detail, max 8 seconds (stable) |
| `veo-3.1-generate-preview` | Google | 720x1280, 1280x720, 1080x1920, 1920x1080 | $0.40 | High quality, rich audio, enhanced detail, max 8 seconds (deprecated) |
| `gen4.5` | RunwayML | 1280x720, 720x1280, 1920x1080, 1080x1920 | $0.12 | World's top-rated video model, state-of-the-art quality |
| `gen4_turbo` | RunwayML | 1280x720, 720x1280, 1920x1080, 1080x1920 | $0.05 | Fast video generation with image reference, max 10 seconds |

**Example Cost Calculations:**
- 5-second 1280x720 video with `sora-2`: $0.50
- 10-second 1280x720 video with `sora-2-pro`: $3.00
- 10-second 1792x1024 video with `sora-2-pro`: $5.00
- 4-second 1280x720 video with `veo-3.1-fast-generate-001`: $0.60
- 8-second 1920x1080 video with `veo-3.1-generate-001`: $3.20

### Embedding Models

Prices are listed per 1 million tokens.

| Model ID | Provider | Input Price ($/1M tokens) | Cached Input Price ($/1M tokens) |
| :----------------------- | :--------- | :------------------------ | :----------------------------- |
| `gemini-embedding-2` <br> `gemini-embedding-2-preview` | Google | $0.20 (text), $0.02 cached, $0.15 output | Multimodal: text/image/audio/video/PDF. MRL dimensions 128-3072. Available on v1/embeddings and v1beta native |
| `gemini-embedding-001` <br> `gemini-embedding-exp-03-07` | Google | $0.15 | $0.075 |
| `cohere.embed-english-v3` <br> `cohere.embed-multilingual-v3` | Cohere | $0.10 | $0.05 |
| `cohere.embed-v4:0` | Cohere | $0.12 | $0.06 |
| `embed-v-4-0` | Cohere | $0.12 | $0.06 | Text: $0.12/1M, Image: $0.47/1M tokens. Azure AI infrastructure with up to 30x higher rate limits |
| `text-embedding-3-small` | OpenAI | $0.02 | $0.01 |
| `text-embedding-3-large` | OpenAI | $0.13 | $0.06 |
| `text-embedding-ada-002` | OpenAI | $0.10 | $0.05 |
| `text-embedding-v4` | Alibaba | $0.07 | - |
| `text-embedding-v3` | Alibaba | $0.07 | - |
| `tongyi-embedding-vision-plus` | Alibaba | $0.09 | - |
| `tongyi-embedding-vision-flash` | Alibaba | $0.03 (image/video), $0.09 (text) | - |
| `nvidia_nim.nv-embed-v1` | Nvidia NIM | $0.002 | $0.001 |
| `nvidia_nim.llama-3.2-nemoretriever-300m-embed-v1` | Nvidia NIM | $0.002 | $0.001 |
| `nvidia_nim.llama-3.2-nemoretriever-300m-embed-v2` | Nvidia NIM | $0.002 | $0.001 |
| `nvidia_nim.llama-3.2-nemoretriever-1b-vlm-embed-v1` | Nvidia NIM | $0.002 | $0.001 |
| `nvidia_nim.llama-3.2-nv-embedqa-1b-v2` | Nvidia NIM | $0.002 | $0.001 |
| `nvidia_nim.nv-embedqa-e5-v5` | Nvidia NIM | $0.002 | $0.001 |
| `nvidia_nim.bge-m3` | Nvidia NIM | $0.002 | $0.001 |
| `cf.qwen3-embedding-0.6b` | Cloudflare | $0.005 | $0.0025 |
| `cf.plamo-embedding-1b` | Cloudflare | $0.005 | $0.0025 |
| `cf.embeddinggemma-300m` | Cloudflare | $0.005 | $0.0025 |

### Reranking Models

Prices are listed per query or per 1 million tokens.

| Model ID | Provider | Cost per Query ($) | Notes |
| :----------------------- | :--------- | :----------------- | :---- |
| `nvidia_nim.llama-3.2-nemoretriever-500m-rerank-v2` | Nvidia NIM | $0.0002 | Research pricing |
| `nvidia_nim.llama-3.2-nv-rerankqa-1b-v2` | Nvidia NIM | $0.0002 | Research pricing |
| `nvidia_nim.nv-rerankqa-mistral-4b-v3` | Nvidia NIM | $0.0002 | Research pricing |

### Audio Models (Speech & Transcription)

Prices are listed per 1 million tokens for input/output, or per second/minute for specific operations.

| Model ID | Provider | Input Price ($/1M tokens) | Cached Input Price ($/1M tokens) | Output Price ($/1M tokens) | Specific Cost | Notes |
| :----------------------------------- | :--------- | :------------------------ | :----------------------------- | :------------------------- | :-------------- | :---- |
| `gemini-2.5-pro-tts` | Google | $1.00 | $0.50 | $20.00 | Audio: 32 tokens/sec | Text to Speech |
| `gemini-2.5-flash-tts` | Google | $0.50 | $0.25 | $10.00 | Audio: 32 tokens/sec | Text to Speech |
| ~~`gemini-2.5-pro-preview-tts`~~ | Google | $1.00 | $0.50 | $20.00 | | **Deprecated** - Use gemini-2.5-pro-tts |
| ~~`gemini-2.5-flash-preview-tts`~~ | Google | $0.50 | $0.25 | $10.00 | | **Deprecated** - Use gemini-2.5-flash-tts |
| ~~`gpt-4.5-preview`~~ <br> `gpt-4.5-preview-2025-02-27` | OpenAI | $75.00 | $37.00 | $150.00 | Audio Input: $100.00/1M tokens, Audio Output: $200.00/1M tokens | Chat with Audio |
| `gpt-4o-realtime-preview` <br> `gpt-4o-realtime-preview-2024-10-01` | OpenAI | $5.00 | $2.50 | $20.00 | Audio Input: $100.00/1M tokens, Audio Output: $200.00/1M tokens | Realtime Audio |
| `gpt-4o-realtime-preview-2024-12-17` | OpenAI | $5.00 | $2.50 | $20.00 | Audio Input: $40.00/1M tokens, Audio Output: $80.00/1M tokens | Realtime Audio |
| `gpt-4o-mini-realtime-preview` <br> `gpt-4o-mini-realtime-preview-2024-12-17` | OpenAI | $0.60 | $0.30 | $2.40 | Audio Input: $10.00/1M tokens, Audio Output: $20.00/1M tokens | Realtime Audio |
| `gpt-4o-mini-tts` | OpenAI | $0.60 | $0.30 | $0.015 | $0.00025/sec (output) | Text to Speech |
| `gpt-4o-transcribe-diarize` | OpenAI | $2.50 | $1.50 | $10.00 | Audio Input: $6.00/1M tokens, $0.0001/sec (input) | Transcription with Speaker Diarization |
| `gpt-4o-transcribe` | OpenAI | $2.50 | $1.50 | $10.00 | $0.0001/sec (input) | Transcription |
| `gpt-4o-mini-transcribe` | OpenAI | $1.25 | $0.75 | $5.00 | $0.00005/sec (input) | Transcription |
| `whisper-1` | OpenAI | - | - | $60.00 | $0.0001/sec (input) | Transcription |
| `tts-1-hd` | OpenAI | $30.00 (per 1M chars) | - | - | $0.00003/char (input) | Text to Speech (HD) |
| `tts-1` | OpenAI | $15.00 (per 1M chars) | - | - | $0.000015/char (input) | Text to Speech |
| `gpt-4o-mini-audio-preview-2024-12-17` <br> `gpt-4o-mini-audio-preview` | OpenAI | $0.15 | $0.15 | $0.60 | Audio Input: $10.00/1M tokens, Audio Output: $20.00/1M tokens | Chat with Audio |
| `gpt-4o-audio-preview-2024-12-17` <br> `gpt-4o-audio-preview-2024-10-01` <br> `gpt-4o-audio-preview` | OpenAI | $2.50 | $1.25 | $10.00 | Audio Input: $40.00/1M tokens, Audio Output: $80.00/1M tokens | Chat with Audio |
| `gpt-audio-1.5` <br> `gpt-audio-1.5-2026-02-15` | OpenAI | $2.50 | $1.25 | $10.00 | Audio Input: $32.00/1M tokens, Audio Output: $64.00/1M tokens | Best voice model, 256K context |
| `gpt-audio` <br> `gpt-audio-2025-08-28` | OpenAI | $2.50 | $1.25 | $10.00 | Audio Input: $32.00/1M tokens, Audio Output: $64.00/1M tokens | Chat with Audio (Production) |
| `gpt-audio-mini` <br> `gpt-audio-mini-2025-10-06` | OpenAI | $0.60 | $0.30 | $2.40 | Audio Input: $10.00/1M tokens, Audio Output: $20.00/1M tokens | Chat with Audio (Production) |
| `eleven_multilingual_v2` | RunwayML | $15.00 (per 1M chars) | - | - | $0.000015/char (input) | Text to Speech - Multilingual (via RunwayML) |
| `eleven_v3` | ElevenLabs | - | - | - | $0.005/sec | Text to Speech - Most advanced, 70+ languages |
| `eleven_turbo_v2` | ElevenLabs | - | - | - | $0.0025/sec | Text to Speech - Fast English |
| `eleven_turbo_v2_5` | ElevenLabs | - | - | - | $0.0025/sec | Text to Speech - Fast multilingual |
| `eleven_flash_v2` | ElevenLabs | - | - | - | $0.00325/sec | Text to Speech - Ultra-fast English |
| `eleven_flash_v2_5` | ElevenLabs | - | - | - | $0.00325/sec | Text to Speech - Ultra-fast multilingual |
| `eleven_multilingual_v2` (ElevenLabs) | ElevenLabs | - | - | - | $0.005/sec | Text to Speech - High quality multilingual |
| `scribe_v2` | ElevenLabs | - | - | - | $0.00009722/sec | Speech to Text - Advanced |
| `scribe_v1` | ElevenLabs | - | - | - | $0.00009722/sec | Speech to Text - Standard |
| `groq.playai-tts` | groq | $50.00 per 1m chars | - | - | $0.00005/char (input) | Text to Speech - High quality |
| `groq.playai-tts-arabic` | groq | $50.00 per 1m chars | - | - | $0.00005/char (input) | Text to Speech - Arabic optimized |
| `groq.whisper-large-v3` | groq | - | - | $0.00185 | $0.000031/sec (input) | Speech Recognition |
| `groq.whisper-large-v3-turbo` | groq | - | - | $0.000067 | $0.00001111/sec (input) | Speech Recognition - Fast |

### Moderation Models

| Model ID | Provider | Cost |
| :------------------------------------ | :--------- | :--- |
| `omni-moderation-latest` <br> `omni-moderation-2024-09-26` | OpenAI | Free |
| `text-moderation-latest` <br> `text-moderation-stable` | OpenAI | Free |

### Fine-tuning Models

Prices are listed per 1 million tokens.

| Model ID | Provider | Training Price ($/1M tokens) | Input Price ($/1M tokens) | Cached Input Price ($/1M tokens) | Output Price ($/1M tokens) |
| :----------------------- | :--------- | :--------------------------- | :------------------------ | :----------------------------- | :------------------------- |
| `gpt-4o-2024-08-06` | OpenAI | $25.00 | $3.75 | $1.875 | $15.00 |
| `gpt-4o-mini-2024-07-18` | OpenAI | $3.00 | $0.30 | $0.15 | $1.20 |
| ~~`gpt-3.5-turbo`~~ | OpenAI | $8.00 | $3.00 | - | $6.00 **Deprecated** |
| `davinci-002` | OpenAI | $6.00 | $12.00 | - | $12.00 |
| `babbage-002` | OpenAI | $0.40 | $1.60 | - | $1.60 |

### Built-in Tools

Tokens used for built-in tools are billed at the chosen model's per-token rates. GB refers to binary gigabytes of storage (also known as gibibyte), where 1GB is 2^30 bytes.

| Tool | Cost | Notes |
| :--------------------------- | :--------------------------- | :---- |
| Code Interpreter | $0.03 / session | |
| File Search Storage | $0.10 / GB/day (1GB free) | |
| File Search Tool Call | $2.50 / 1k calls | Applies to Responses API only, not Assistants API. |
| Web Search | Varies by model and search context size. See below. | |

### Web Search Pricing

Web search is a built-in tool with pricing that depends on both the model used and the search context size.

| Model ID | Search Context Size | Cost ($/1k calls) |
| :------------------------------------------ | :------------------ | :---------------- |
| `gpt-4o` <br> `gpt-4o-search-preview` <br> `gpt-4o-search-preview-2025-03-11` | low | $30.00 |
| | medium (default) | $35.00 |
| | high | $50.00 |
| `gpt-4o-mini` <br> `gpt-4o-mini-search-preview` <br> `gpt-4o-mini-search-preview-2025-03-11` | low | $25.00 |
| | medium (default) | $27.50 |
| | high | $30.00 |
| `gpt-4.1` <br> `gpt-4.1-2025-04-14` | low | $30.00 |
| | medium (default) | $35.00 |
| | high | $50.00 |
| `gpt-4.1-mini` <br> `gpt-4.1-mini-2025-04-14` | low | $30.00 |
| | medium (default) | $35.00 |
| | high | $50.00 |
| `computer-use-preview` <br> `computer-use-preview-2025-03-11` | low | $30.00 |
| | medium (default) | $35.00 |
| | high | $50.00 |
| `o3` <br> `o3-2025-04-16` <br> `o3-pro` <br> `o3-pro-2025-06-10` <br> `o3-mini` <br> `o3-mini-2025-01-31` <br> `o4-mini` <br> `o4-mini-2025-04-16` | low | $10.00 |
| | medium (default) | $15.00 |
| | high | $20.00 |
| `o3-deep-research` <br> `o3-deep-research-2025-06-26` <br> `o4-mini-deep-research` <br> `o4-mini-deep-research-2025-06-26` | low | $10.00 |
| | medium (default) | $15.00 |
| | high | $20.00 |
| `codex-mini-latest` | low | $0.03 |
| | medium | $0.035 |
| | high | $0.05 |

### Rerank Models

| Model ID | Provider | Input Price ($/1M tokens) | Cost per Query ($) | Output Price ($/1M tokens) | Notes |
| :----------------------- | :--------- | :------------------------ | :----------------- | :------------------------- | :---- |
| `qwen3-rerank` | Alibaba | $0.10 | - | $0.00 | 100+ languages, cached input: $0.0035/1M tokens |
| `cohere-rerank-v4.0-pro` | Cohere | $0.00 | $0.0025 | $0.00 | 32K context, 100+ languages, YAML support |
| `cohere-rerank-v4.0-fast` | Cohere | $0.00 | $0.002 | $0.00 | 32K context, optimized for speed |
| `cohere.rerank-v3-5:0` | Cohere | $0.00 | $0.002 | $0.00 | |

### Search Models

| Search Tool | Provider | Cost per Query ($) | Notes |
| :----------------------- | :--------- | :----------------- | :---- |
| `serper-search` | Serper | $0.001 | Lowest-cost Google-powered search |
| `dataforseo-search` | DataForSEO | $0.003 | Cost-effective option |
| `parallel_ai-search` | Parallel AI | $0.004 | Fast parallel processing |
| `perplexity-search` | Perplexity | $0.005 | AI-powered search |
| `google_pse-search` | Google PSE | $0.005 | Google Programmable Search Engine |
| `tavily-search` | Tavily | $0.008 | Standard web search |
| `firecrawl-search` | Firecrawl | $0.008 | Search with web scraping & content extraction |
| `parallel_ai-search-pro` | Parallel AI | $0.009 | Enhanced parallel search |
| `tavily-search-advanced` | Tavily | $0.016 | Advanced search with filtering |
| `exa_ai-search` | Exa AI | $0.025 | Semantic neural search |

### OCR Models

| Model ID | Provider | Cost per Page ($) | Notes |
| :----------------------- | :--------- | :----------------- | :---- |
| `mistral-ocr-latest` <br> `mistral-ocr-2512` <br> `mistral-ocr-2512` | Mistral AI | $0.002 | |


## Cost Tracking

AvalAI provides two methods for tracking API costs:

### 1. Estimated Cost (Basic)

API responses include an optional `estimated_cost` dictionary for quick cost estimation:

| Field | Description |
| :------------ | :--------------------------------------------------------------------- |
| `unit` | Cost in USD/USDT |
| `irt` | Cost in Tomans (IRT), calculated as USD cost × USDT-IRT exchange rate |
| `exchange_rate` | Current USDT-IRT exchange rate used for the conversion |

Example API response with estimated cost:

```json
{
  "id": "response-123456",
  "object": "chat.completion",
  "created": 1714911234,
  "model": "gpt-4o",
  "choices": [...],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 128,
    "total_tokens": 170
  },
  "estimated_cost": {
    "unit": 0.0025,
    "irt": 200,
    "exchange_rate": 80000
  }
}
```

**Important notes:**

* This field might not be present in all responses.
* For regular (non-streaming) requests, it's included in the main response.
* For streaming requests, it's attached to the last chunk of the streaming response.
* **The estimated cost is not guaranteed and should not be used for billing or accounting purposes.**

### 2. User API (Precise & Guaranteed)

For accurate cost tracking and billing, use the **[User API](en/api-reference/user.md)** at `https://api.avalai.ir/user/v1`:

**Key Features:**
- **100% Accurate Costs** - Guaranteed precise costs for every API call
- **Request ID Tracking** - Use [`x-request-id`](en/api-reference/response-headers.md#x-request-id) from response headers to lookup exact costs
- **Available Within 30 Seconds** - Costs processed and ready for retrieval
- **Transaction History** - Complete audit trail with filtering capabilities
- **Usage Analytics** - Detailed summaries by model, provider, date, or hour

**Perfect for:**
- **Resellers** - Accurately charge customers based on actual costs
- **Enterprises** - Precise cost allocation and chargeback
- **Production Apps** - Reliable billing and usage monitoring

**Quick Example:**

```bash
# 1. Make API call and get x-request-id from response headers
curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "hi"}]}'

# Response includes: x-request-id: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a

# 2. Get precise cost (available within 30 seconds)
curl "https://api.avalai.ir/user/v1/transactions/lookup" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"transaction_ids": ["019ac4a0-a8f4-7041-845f-3ea8f15dcf1a"]}'
```

**Learn More:**
- [User API Documentation](en/api-reference/user.md) - Complete API reference
- [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Step-by-step implementation guide
- [Enterprise Usage Guide](en/resellers/enterprise-guide.md) - Advanced patterns for scale

## Related Resources

* [Model Details](en/models/model-details.md)
* [Quickstart](en/quickstart.md)
* [Performance](en/performance.md)
* [Guides](en/guides/rate-limits.md)
