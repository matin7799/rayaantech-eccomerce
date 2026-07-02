# Prompt Caching

Reduce latency and cost with prompt caching.

## Table of Contents

- [Overview](#overview)
- [Structuring Prompts for Caching](#structuring-prompts-for-caching)
- [How it Works](#how-it-works)
- [Requirements](#requirements)
- [What Can Be Cached](#what-can-be-cached)
- [Best Practices](#best-practices)
- [Gemini Context Caching](#gemini-context-caching)
  - [Implicit vs Explicit Caching](#implicit-vs-explicit-caching)
  - [AvalAI Support Status](#avalai-support-status)
  - [Implicit Caching Details](#implicit-caching-details)
  - [Checking Cache Hits in Gemini Responses](#checking-cache-hits-in-gemini-responses)
  - [Explicit Caching (Not Supported)](#explicit-caching-not-supported)
- [Frequently Asked Questions](#frequently-asked-questions-based-on-openais-implementation)
- [Related Resources](#related-resources)

## Overview

Model prompts often contain repetitive content, like system prompts and common instructions. Underlying model providers (like OpenAI) may route API requests to servers that recently processed the same prompt, making it potentially cheaper and faster than processing a prompt from scratch. This mechanism, often referred to as Prompt Caching, can significantly reduce latency and cost for long prompts. Prompt Caching typically works automatically on API requests (no code changes required on your end) and usually has no additional fees associated with it.

*Note: Availability and specific discounts depend on the underlying model provider and the specific model used. Please refer to the model provider's documentation for exact details.*

Prompt Caching may be enabled for models like:

*   gpt-5
*   gpt-5-chat
*   gpt-5-mini
*   gpt-5-nano
*   gpt-4.1
*   gpt-4.1-mini
*   gpt-4.1-nano
*   gpt-4o (excludes gpt-4o-2024-05-13 and chatgpt-4o-latest)
*   gpt-4o-mini
*   gpt-4o-realtime-preview
*   o3
*   o3-mini
*   o4-mini

*(Refer to the specific model provider's documentation for the most up-to-date list and discount details.)*

This guide describes how prompt caching generally works, so that you can optimize your prompts for potentially lower latency and cost.

## Structuring Prompts for Caching

Cache hits are typically only possible for exact prefix matches within a prompt. To maximize potential caching benefits, place static content like instructions and examples at the beginning of your prompt, and put variable content, such as user-specific information, at the end. This principle also applies to images and tools, which usually must be identical between requests for the prefix to match.

![Prompt Caching visualization](https://openaidevs.retool.com/api/file/8593d9bb-4edb-4eb6-bed9-62bfb98db5ee)
*(Image Source: OpenAI)*

## How it Works

Caching might be enabled automatically by the model provider for prompts exceeding a certain token length (e.g., 1024 tokens). When you make an API request via AvalAI to such a model:

1.  **Cache Lookup**: The provider's system checks if the initial portion (prefix) of your prompt is stored in their cache.
2.  **Cache Hit**: If a matching prefix is found, the system uses the cached result for that portion. This significantly decreases latency and reduces costs for the cached tokens.
3.  **Cache Miss**: If no matching prefix is found, the system processes your full prompt. After processing, the prefix of your prompt might be cached for future requests.

Cached prefixes generally remain active for a period of inactivity (e.g., 5-10 minutes), though this can vary.

## Requirements

Caching availability and behavior depend on the model provider. For instance, OpenAI requires prompts to contain 1024 tokens or more, with cache hits occurring in increments (e.g., 128 tokens).

The number of cached tokens in a request will fall within a sequence determined by the provider's increment size (e.g., 1024, 1152, 1280, etc.).

Some API responses (like OpenAI's Chat Completions) include details about cached tokens in the `usage` object:

```json
"usage": {
  "prompt_tokens": 2006,
  "completion_tokens": 300,
  "total_tokens": 2306,
  "prompt_tokens_details": {
    "cached_tokens": 1920 // Example: 1920 tokens were a cache hit

  },
  "completion_tokens_details": {
    // ... other details

  }
}
```

For requests below the minimum token threshold (e.g., 1024 tokens), `cached_tokens` will typically be zero.

## What Can Be Cached

The following components of a request can often contribute to the cachable prompt prefix:

*   **Messages:** The complete messages array (system, user, assistant).
*   **Images:** Images included in user messages (links or base64). The `detail` parameter often needs to be identical.
*   **Tool Use:** The messages array and the list of available `tools`.
*   **Structured Outputs:** A structured output schema (if used) might serve as part of the prefix.

## Best Practices

*   Structure prompts with static content first, dynamic content last.
*   Monitor API response `usage` details (if available) for `cached_tokens` to understand cache effectiveness.
*   Longer prompts are more likely to meet caching thresholds.
*   Consistent requests with the same prefix help keep the prefix in the cache. Cache evictions may be more frequent during peak usage times.

## Gemini Context Caching

Gemini models have their own context caching mechanism with two distinct types: **Implicit Caching** and **Explicit Caching**.

### Implicit vs Explicit Caching

| Feature | Implicit Caching | Explicit Caching |
|---------|-----------------|------------------|
| **Activation** | Automatic | Manual (developer-controlled) |
| **Cost Savings** | Not guaranteed | Guaranteed |
| **Setup Required** | None | Create/manage cached content |
| **TTL Control** | No | Yes (configurable) |
| **AvalAI Support** | ⚠️ Possible but not guaranteed | ❌ Not currently supported |

### AvalAI Support Status

> **Important**: Since AvalAI is an API aggregator, various API calls might end up at different infrastructures. We try to route requests from unique users to the same infrastructure, but this is not guaranteed. Therefore, implicit caching benefits cannot be guaranteed on AvalAI.

| Caching Type | Status | Notes |
|-------------|--------|-------|
| **Implicit Caching** | ⚠️ Possible | Requests may route to different infrastructures |
| **Explicit Caching** | ❌ Not supported | May be added in future updates |

### Implicit Caching Details

Implicit caching is enabled by default on Gemini models. When your request hits a cache, Google automatically passes on cost savings.

#### Minimum Token Requirements for Gemini

| Model | Minimum Token Count |
|-------|---------------------|
| Gemini 3 Flash Preview | 1,024 tokens |
| Gemini 3 Pro Preview | 4,096 tokens |
| Gemini 2.5 Flash | 1,024 tokens |
| Gemini 2.5 Pro | 4,096 tokens |

#### Tips to Increase Cache Hit Probability

1. **Place large, static content at the beginning of your prompt**
   - System instructions
   - Reference documents
   - Few-shot examples
   
2. **Send similar requests in quick succession**
   - Requests with the same prefix sent close together have higher cache hit probability

3. **Keep dynamic content at the end**
   - User-specific information
   - Variable queries
   - Timestamps and unique identifiers

### Checking Cache Hits in Gemini Responses

When using the native Gemini API, you can check for cache hits in the response:

<!-- tabs:start -->
#### **Python**

```python
from google import genai

client = genai.Client(
    api_key="YOUR_AVALAI_API_KEY", http_options={"base_url": "https://api.avalai.ir"}
)

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="Your prompt here with substantial context..."
)

# Check usage metadata for cache information
if hasattr(response, "usage_metadata"):
    usage = response.usage_metadata
    print(f"Prompt tokens: {usage.prompt_token_count}")
    print(f"Cached tokens: {getattr(usage, 'cached_content_token_count', 0)}")
    print(f"Output tokens: {usage.candidates_token_count}")
```

#### **JavaScript**

```javascript
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: "YOUR_AVALAI_API_KEY",
  httpOptions: { baseUrl: "https://api.avalai.ir" }
});

const response = await client.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Your prompt here with substantial context..."
});

// Check usage metadata for cache information
if (response.usageMetadata) {
  console.log(`Prompt tokens: ${response.usageMetadata.promptTokenCount}`);
  console.log(`Cached tokens: ${response.usageMetadata.cachedContentTokenCount || 0}`);
  console.log(`Output tokens: ${response.usageMetadata.candidatesTokenCount}`);
}
```

#### **cURL**

```bash
curl -X POST "https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "Authorization: Bearer YOUR_AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Your prompt here with substantial context..."}]
    }]
  }'

# Response will include usage_metadata with cached token counts
```
<!-- tabs:end -->

### Explicit Caching (Not Supported)

Explicit caching allows you to manually cache content and reference it in subsequent requests using `cachedContent`. This guarantees cost savings but requires additional setup.

> **Note**: Explicit caching endpoints (`/cachedContents`) are not currently supported on AvalAI. We may add support in future updates.

#### Why Explicit Caching Is Not Supported

As an API aggregator, AvalAI routes requests across multiple infrastructures for reliability and performance. Explicit caching requires:

- Persistent storage tied to specific infrastructure
- Consistent routing of all related requests to the same servers
- Direct management of cache lifecycle

These requirements conflict with AvalAI's distributed architecture.

#### Use Cases Best Suited for Caching

Context caching is particularly beneficial for:

1. **Chatbots with extensive system instructions** - Large personality definitions, company knowledge bases
2. **Document analysis applications** - Recurring queries against the same documents
3. **Code analysis tools** - Repository analysis, bug fixing across similar codebases
4. **Video/Audio analysis** - Multiple questions about the same media file

## Frequently Asked Questions (Based on OpenAI's Implementation)

1.  **How is data privacy maintained for caches?**
    Prompt caches are typically not shared between organizations. Only members of the same organization can benefit from caches of identical prompts submitted by that organization. AvalAI acts as a proxy, so caching benefits are tied to the underlying provider's handling of requests from AvalAI's infrastructure or potentially your specific organization if applicable provider features are used.
2.  **Does Prompt Caching affect the final response?**
    No. Prompt Caching should not influence the generation of output tokens or the final response. Only the prompt processing is potentially optimized; the response is computed anew based on the full (potentially partially cached) prompt.
3.  **Is there a way to manually clear the cache?**
    Manual cache clearing is generally not available. Caches are typically cleared automatically after periods of inactivity.
4.  **Is there an extra cost for Prompt Caching?**
    No. Caching usually happens automatically where available, with no extra cost. The benefit is a potential *reduction* in cost for the cached prompt tokens.
5.  **Do cached prompts contribute to TPM rate limits?**
    Yes, the full prompt tokens (cached + non-cached) usually count towards rate limits like Tokens Per Minute (TPM). Caching affects cost and latency, not rate limit calculation.
6.  **Is discounting for Prompt Caching available everywhere?**
    Availability depends on the provider and specific service tiers (e.g., OpenAI offers it on standard APIs and Scale Tier, but not the Batch API).
7.  **Does Prompt Caching work with Zero Data Retention (ZDR)?**
    Providers like OpenAI state that Prompt Caching is compliant with their ZDR policies where applicable.

## Related Resources

*   [Model Selection Guide](en/guides/model-selection.md)
*   [Latency Optimization](en/guides/latency-optimization.md)
*   [Pricing](en/pricing.md)
*   [OpenAI Models](en/providers/openai.md)
*   [Google Models](en/providers/google.md)
*   [Native GenAI SDK (v1beta)](en/api-reference/v1beta.md)
