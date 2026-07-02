# Service Tiers

AvalAI offers different service tiers to give you flexibility in balancing cost and performance for your API requests. This guide explains the available service tiers, their characteristics, and how to use them effectively.

## Overview

Service tiers allow you to choose between faster processing at default prices or reduced costs with higher latency. By default, all requests use the **default** tier, which provides the best balance of speed and reliability.

<div class="tier-compare">
  <div class="tier-card is-featured">
    <div class="tier-card-name"><code>default</code></div>
    <span class="doc-badge doc-badge--success">Recommended</span>
    <ul class="tier-card-meta">
      <li><span>Latency</span><strong>Low</strong></li>
      <li><span>Pricing</span><strong>Standard rates</strong></li>
      <li><span>Credit packages</span><strong>✅ Covered</strong></li>
      <li><span>Best for</span><strong>Production & interactive</strong></li>
    </ul>
  </div>
  <div class="tier-card">
    <div class="tier-card-name"><code>flex</code></div>
    <span class="doc-badge doc-badge--warn">50% cheaper</span>
    <ul class="tier-card-meta">
      <li><span>Latency</span><strong>High (up to 15 min)</strong></li>
      <li><span>Pricing</span><strong>50% reduced</strong></li>
      <li><span>Credit packages</span><strong>❌ Not covered</strong></li>
      <li><span>Best for</span><strong>Batch & cost optimization</strong></li>
    </ul>
  </div>
</div>

| Service Tier | Description | Latency | Pricing | Credit Package Coverage |
| :----------- | :---------- | :------ | :------ | :---------------------- |
| `default` | Default tier with priority processing | Low | Standard rates | ✅ Yes |
| `flex` | Cost-optimized tier with higher latency | High (up to 15 min) | 50% reduced | ❌ No |

## Default (Standard) Tier

The **default** service tier is the default for all API requests. It provides:

- **Priority processing**: Requests are processed with default priority
- **Lower latency**: Faster response times compared to flex tier
- **Full model support**: All models are available
- **Credit package coverage**: Costs are covered by your credit packages if applicable
- **Recommended for**: Production applications, time-sensitive requests, and interactive use cases

### Using Default (Standard) Tier

You don't need to specify anything to use the default tier—it's the default. However, you can explicitly set it:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4",
    "messages": [{"role": "user", "content": "Hello!"}],
    "service_tier": "default"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-5.4",
    messages=[{"role": "user", "content": "Hello!"}],
    service_tier="default",  # Optional, this is the default
)
print(response.choices[0].message.content)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "gpt-5.4",
  messages: [{ role: "user", content: "Hello!" }],
  service_tier: "default"  // Optional, this is the default
});
console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig(os.Getenv("AVALAI_API_KEY"))
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.4",
			Messages: []openai.ChatCompletionMessage{
				{Role: "user", Content: "Hello!"},
			},
			// service_tier defaults to "default"
		},
	)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

$data = [
    'model' => 'gpt-5.4',
    'messages' => [
        ['role' => 'user', 'content' => 'Hello!']
    ],
    'service_tier' => 'default'  // Optional, this is the default
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo $result['choices'][0]['message']['content'];
?>

```

## Flex Tier

The **flex** service tier offers **50% reduced costs** for select OpenAI models, in exchange for higher latency and potential request delays.

<div class="doc-callout doc-callout--warn">
<p><strong>⚠️ Important Considerations</strong></p>
<p>The flex service tier has <strong>significantly higher latency</strong> compared to the default tier:</p>
<ul>
<li><strong>Processing time</strong>: Requests may take much longer to complete</li>
<li><strong>Server timeout</strong>: Requests can take up to <strong>900 seconds (15 minutes)</strong> to complete</li>
<li><strong>Potential failures</strong>: Requests may time out or fail during processing</li>
<li><strong>No credit package coverage</strong>: Flex tier costs are <strong>not covered</strong> by credit packages</li>
</ul>
<p><strong>Recommended for</strong>: Batch processing, non-time-sensitive tasks, cost optimization for high-volume usage</p>
</div>

### Supported Models

The flex tier is **only available for select OpenAI models**. Attempting to use flex tier with unsupported models will result in an error.

| Model | Model Aliases |
| :---- | :------------ |
| `gpt-5.2` | `gpt-5.2-2025-12-11` |
| `gpt-5.1` | `gpt-5.1-2025-11-13` |
| `gpt-5` | `gpt-5-2025-08-07` |
| `gpt-5-mini` | `gpt-5-mini-2025-08-07` |
| `gpt-5-nano` | `gpt-5-nano-2025-08-07` |
| `o3` | - |
| `o4-mini` | - |

### Flex Tier Pricing

Prices are per 1 million tokens and represent **50% savings** compared to default tier pricing.

| Model | Input | Cached Input | Output |
| :---- | :---- | :----------- | :----- |
| `gpt-5.2` | $0.875 | $0.0875 | $7.00 |
| `gpt-5.1` | $0.625 | $0.0625 | $5.00 |
| `gpt-5` | $0.625 | $0.0625 | $5.00 |
| `gpt-5-mini` | $0.125 | $0.0125 | $1.00 |
| `gpt-5-nano` | $0.025 | $0.0025 | $0.20 |
| `o3` | $1.00 | $0.25 | $4.00 |
| `o4-mini` | $0.55 | $0.138 | $2.20 |

For complete pricing information, see the [Pricing](en/pricing.md#flex-service-tier) page.

### Using Flex Tier

To use the flex tier, include `"service_tier": "flex"` in your API request:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-mini",
    "messages": [{"role": "user", "content": "Summarize this document..."}],
    "service_tier": "flex"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use flex tier for cost savings on non-time-sensitive tasks
response = client.chat.completions.create(
    model="gpt-5-mini",
    messages=[{"role": "user", "content": "Summarize this document..."}],
    service_tier="flex",
)
print(response.choices[0].message.content)
print(f"Service tier used: {response.service_tier}")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

// Use flex tier for cost savings on non-time-sensitive tasks
const response = await client.chat.completions.create({
  model: "gpt-5-mini",
  messages: [{ role: "user", content: "Summarize this document..." }],
  service_tier: "flex"
});
console.log(response.choices[0].message.content);
console.log(`Service tier used: ${response.service_tier}`);

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig(os.Getenv("AVALAI_API_KEY"))
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	// Use flex tier for cost savings on non-time-sensitive tasks
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5-mini",
			Messages: []openai.ChatCompletionMessage{
				{Role: "user", Content: "Summarize this document..."},
			},
			// Set service_tier to "flex" for reduced pricing
		},
	)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

// Use flex tier for cost savings on non-time-sensitive tasks
$data = [
    'model' => 'gpt-5-mini',
    'messages' => [
        ['role' => 'user', 'content' => 'Summarize this document...']
    ],
    'service_tier' => 'flex'
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo $result['choices'][0]['message']['content'] . "\n";
echo "Service tier used: " . $result['service_tier'] . "\n";
?>

```

### Response Format

All API responses include a `service_tier` field indicating which tier was used:

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
        "content": "Here is the summary...",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 150,
    "prompt_tokens": 50,
    "total_tokens": 200
  },
  "service_tier": "flex",
  "estimated_cost": {
    "unit": "0.0001875000",
    "irt": 24.63,
    "exchange_rate": 131350
  }
}
```

## Error Handling

### Unsupported Model Error

If you attempt to use the flex tier with an unsupported model, you will receive an error:

```bash
curl -i https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [{"role": "user", "content": "hi"}],
    "service_tier": "flex"
  }'
```

**Error Response:**

```json
{
  "error": {
    "message": "Model 'gpt-5.4-mini' does not support service_tier='flex'. Flex tier is only available for: gpt-5, gpt-5-2025-08-07, gpt-5-mini, gpt-5-mini-2025-08-07, gpt-5-nano, gpt-5-nano-2025-08-07, gpt-5.1, gpt-5.1-2025-11-13, gpt-5.2, gpt-5.2-2025-12-11, o3, o4-mini. checkout https://docs.avalai.ir/fa/service-tiers for more information.",

    "type": "invalid_request",
    "param": null,
    "code": "invalid_request",
    "request_id": "019b214f-4f5d-7321-8a3a-59f89d473c7c"
  }
}
```

### Implementing Retry Logic

For production applications using flex tier, we recommend implementing retry logic with fallback to default tier:

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")


def make_request_with_fallback(messages, model="gpt-5-mini", max_retries=3):
    """
    Attempt flex tier first, fall back to default if it fails.
    """
    # First, try with flex tier for cost savings
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            service_tier="flex",
            timeout=900,  # 15 minute timeout for flex
        )
        return response, "flex"
    except Exception as e:
        print(f"Flex tier failed: {e}. Falling back to default tier...")

    # Fall back to default tier
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model, messages=messages, service_tier="default"
            )
            return response, "default"
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2**attempt)  # Exponential backoff
            else:
                raise e


# Usage
messages = [{"role": "user", "content": "Hello!"}]
response, tier_used = make_request_with_fallback(messages)
print(f"Response received using {tier_used} tier")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

async function makeRequestWithFallback(messages, model = "gpt-5-mini", maxRetries = 3) {
  // First, try with flex tier for cost savings
  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: messages,
      service_tier: "flex"
    }, { timeout: 900000 }); // 15 minute timeout for flex
    return { response, tierUsed: "flex" };
  } catch (error) {
    console.log(`Flex tier failed: ${error.message}. Falling back to default tier...`);
  }
  
  // Fall back to default tier with retry logic
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: model,
        messages: messages,
        service_tier: "default"
      });
      return { response, tierUsed: "default" };
    } catch (error) {
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      } else {
        throw error;
      }
    }
  }
}

// Usage
const messages = [{ role: "user", content: "Hello!" }];
const { response, tierUsed } = await makeRequestWithFallback(messages);
console.log(`Response received using ${tierUsed} tier`);

```

## Best Practices

### When to Use default (Standard) Tier

- **Interactive applications**: Chatbots, real-time assistants, user-facing interfaces
- **Time-sensitive tasks**: When quick responses are required
- **Production workflows**: Where reliability is critical
- **Credit package optimization**: When you want costs covered by credit packages

### When to Use Flex Tier

- **Batch processing**: Processing large amounts of data where time is not critical
- **Background tasks**: Scheduled jobs, data analysis, content generation
- **Cost optimization**: When you need to reduce costs and can tolerate delays
- **Non-production workloads**: Testing, development, experimentation

### Hybrid Approach

Consider using a hybrid approach for optimal cost-performance balance:

1. **Use default tier** for user-facing, time-sensitive requests
2. **Use flex tier** for background tasks, batch processing, and cost-sensitive operations
3. **Implement fallback logic** to switch from flex to default when flex fails or times out

## Credit Packages and Service Tiers

> **⚠️ Important**
>
> Credit packages **only cover default tier usage**. When using `service_tier: "flex"`, costs are deducted from your default account balance, not from credit package allocations.
>
> For more information about credit packages, see [Credit Packages](en/credit-packages.md).

## API Reference

The `service_tier` parameter is supported in the following API endpoints:

- [Chat Completions API](en/api-reference/chat.md)
- [Responses API](en/api-reference/responses.md)

## Related Resources

- [Pricing](en/pricing.md) - Complete pricing information including flex tier rates
- [Credit Packages](en/credit-packages.md) - Learn about credit packages and their limitations
- [Chat Completions API](en/api-reference/chat.md) - API reference for chat completions
- [Responses API](en/api-reference/responses.md) - API reference for the Responses API
- [Error Handling](en/guides/error-handling.md) - Best practices for handling API errors