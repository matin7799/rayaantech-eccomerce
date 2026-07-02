# Response Headers

All AvalAI API responses include standard HTTP headers plus custom headers that provide important information about your requests, rate limits, and cost tracking.

## Table of Contents

- [Request Tracking Headers](#request-tracking-headers)
- [Rate Limit Headers](#rate-limit-headers)
- [Standard HTTP Headers](#standard-http-headers)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## Request Tracking Headers

### x-request-id

**The most important header for cost tracking and debugging.**

Every API response includes a unique `x-request-id` header that contains a UUID identifying that specific request. This ID is essential for:

- **Precise Cost Tracking**: Use it with [`/user/v1/transactions/lookup`](en/api-reference/user.md#post-transactionslookup) to get exact cost details
- **Debugging**: Reference this ID when reporting issues to support
- **Request Correlation**: Track requests across your systems
- **Audit Trails**: Maintain records of API calls

**Format**: UUID v7 (e.g., `019ac4a0-a8f4-7041-845f-3ea8f15dcf1a`)

**Example**:
```
x-request-id: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a
```

#### Accessing x-request-id via SDKs

When using official SDKs like the **OpenAI Python SDK**, the `x-request-id` header is automatically captured and made available through the response object:

**Python (OpenAI SDK)**

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[{"role": "user", "content": "Hello!"}],
)

# Access the request ID directly from the response object
request_id = response._request_id
print(f"Request ID: {request_id}")
# Output: Request ID: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Hello!",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


> **Note:** The `_request_id` attribute is available on all response objects returned by the OpenAI SDK when configured with AvalAI's base URL. This is the recommended approach as it handles header parsing automatically.

#### Accessing x-request-id with LangChain

LangChain does not directly expose raw HTTP response headers from the underlying API calls. However, you can capture the `x-request-id` header by using a custom HTTP client that intercepts the response headers.

**Python LangChain v0.3 (Synchronous)**

```python
import httpx
from langchain_openai import ChatOpenAI
from langchain_core.callbacks import BaseCallbackHandler
from contextvars import ContextVar
import os

# Store headers in context var for thread safety
request_headers: ContextVar[dict] = ContextVar("request_headers", default={})


class HeaderCapturingClient(httpx.Client):
    def send(self, request, **kwargs):
        response = super().send(request, **kwargs)
        request_headers.set(dict(response.headers))
        return response


class HeaderAccessCallback(BaseCallbackHandler):
    def __init__(self):
        self.request_id = None

    def on_llm_end(self, response, **kwargs):
        headers = request_headers.get()
        self.request_id = headers.get("x-request-id")
        print(f"Captured x-request-id: {self.request_id}")


# Setup
http_client = HeaderCapturingClient()
chat_generator = ChatOpenAI(
    base_url="https://api.avalai.ir/v1",
    api_key=os.getenv("AVALAI_API_KEY"),
    model="gpt-5.4-mini",
    http_client=http_client,
)

callback = HeaderAccessCallback()
response = chat_generator.invoke("say hi", config={"callbacks": [callback]})

print(f"Request ID from callback: {callback.request_id}")
```

**Python LangChain v0.3 (Asynchronous)**

```python
import httpx
from contextvars import ContextVar
from langchain_openai import ChatOpenAI
from langchain_core.callbacks import AsyncCallbackHandler
import os

request_headers: ContextVar[dict] = ContextVar("request_headers", default={})


class AsyncHeaderCapturingClient(httpx.AsyncClient):
    async def send(self, request, **kwargs):
        response = await super().send(request, **kwargs)
        request_headers.set(dict(response.headers))
        return response


class AsyncHeaderAccessCallback(AsyncCallbackHandler):
    def __init__(self):
        self.request_id = None

    async def on_llm_end(self, response, **kwargs):
        headers = request_headers.get()
        self.request_id = headers.get("x-request-id")
        print(f"Captured x-request-id: {self.request_id}")


# Setup
http_client = AsyncHeaderCapturingClient()
chat_generator = ChatOpenAI(
    base_url="https://api.avalai.ir/v1",
    api_key=os.getenv("AVALAI_API_KEY"),
    model="gpt-5.4-mini",
    http_async_client=http_client,
)

# Usage (run in async context)
callback = AsyncHeaderAccessCallback()
response = await chat_generator.ainvoke("say hi", config={"callbacks": [callback]})
```

> **How it works:** This approach uses a custom `httpx` client that captures the response headers into a context variable. The LangChain callback then accesses these headers after the LLM call completes. The `ContextVar` ensures thread safety when making concurrent requests.

**Accessing via HTTP Headers (Other SDKs)**

For other SDKs or direct HTTP requests, access the header directly from the response:

| SDK/Method | How to Access |
|------------|---------------|
| Python (OpenAI) | `response._request_id` |
| Python (requests) | `response.headers.get("x-request-id")` |
| JavaScript (fetch) | `response.headers.get("x-request-id")` |
| Go (net/http) | `resp.Header.Get("x-request-id")` |
| PHP (curl) | Extract from response headers |

> **For Resellers**: This header is crucial for your business. Always capture and store it to track the exact cost of each API call. The [`/user/v1/transactions/lookup`](en/api-reference/user.md#post-transactionslookup) endpoint returns 100% accurate cost data within 30 seconds using this ID. See our [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) for a complete workflow.

---

## Rate Limit Headers

AvalAI implements rate limiting to ensure fair usage and system stability. Every API response includes headers that inform you about your current rate limit status.

### Request-Based Rate Limits

| Header | Description | Example |
|--------|-------------|---------|
| `x-ratelimit-limit-requests` | Maximum requests allowed in the time window | `30000` |
| `x-ratelimit-remaining-requests` | Remaining requests in current window | `29999` |
| `x-ratelimit-reset-requests` | Time until the request limit resets | `45s` |

### Token-Based Rate Limits

| Header | Description | Example |
|--------|-------------|---------|
| `x-ratelimit-limit-tokens` | Maximum tokens allowed in the time window | `150000000` |
| `x-ratelimit-remaining-tokens` | Remaining tokens in current window | `149999982` |
| `x-ratelimit-reset-tokens` | Time until the token limit resets | `45s` |

### Rate Limit Tiers

Your rate limits depend on your account tier (0-5). Higher tiers have higher limits. See [Rate Limits Guide](en/guides/rate-limits.md) for detailed tier information.

**429 Too Many Requests**

If you exceed your rate limits, you'll receive a `429` status code with a `Retry-After` header indicating when you can retry:

```
HTTP/2 429
Retry-After: 45
x-ratelimit-limit-requests: 30000
x-ratelimit-remaining-requests: 0
x-ratelimit-reset-requests: 45s
```

---

## Standard HTTP Headers

### Content-Type

Indicates the media type of the response body:

```
Content-Type: application/json
```

### Content-Length

Size of the response body in bytes:

```
Content-Length: 970
```

### Date

Server timestamp when the response was generated:

```
Date: Thu, 27 Nov 2025 09:24:15 GMT
```

---

## Examples

### Complete Response Headers Example

Here's a complete example showing all headers from a typical API request:

```language-selector
bash=:# Use -i flag to show headers
curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [{"role": "user", "content": "hi"}]
  }'

# Response Headers:
# HTTP/2 200
# date: Thu, 27 Nov 2025 09:24:15 GMT
# content-type: application/json
# content-length: 970
# x-ratelimit-limit-requests: 30000
# x-ratelimit-remaining-requests: 29999
# x-ratelimit-limit-tokens: 150000000
# x-ratelimit-remaining-tokens: 149999982
# x-ratelimit-reset-requests: 45s
# x-ratelimit-reset-tokens: 45s
# x-request-id: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a

python=:# Python example - accessing response headers
import requests

response = requests.post(
    "https://api.avalai.ir/v1/chat/completions",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"model": "gpt-5.4-mini", "messages": [{"role": "user", "content": "hi"}]},
)

# Access headers
request_id = response.headers.get("x-request-id")
remaining_requests = response.headers.get("x-ratelimit-remaining-requests")
remaining_tokens = response.headers.get("x-ratelimit-remaining-tokens")
reset_time = response.headers.get("x-ratelimit-reset-requests")

print(f"Request ID: {request_id}")
print(f"Remaining Requests: {remaining_requests}")
print(f"Remaining Tokens: {remaining_tokens}")
print(f"Reset Time: {reset_time}")

javascript=:// JavaScript example - accessing response headers
const response = await fetch("https://api.avalai.ir/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-5.4-mini",
    messages: [{ role: "user", content: "hi" }],
  }),
});

// Access headers
const requestId = response.headers.get("x-request-id");
const remainingRequests = response.headers.get("x-ratelimit-remaining-requests");
const remainingTokens = response.headers.get("x-ratelimit-remaining-tokens");
const resetTime = response.headers.get("x-ratelimit-reset-requests");

console.log(`Request ID: ${requestId}`);
console.log(`Remaining Requests: ${remainingRequests}`);
console.log(`Remaining Tokens: ${remainingTokens}`);
console.log(`Reset Time: ${resetTime}`);

go=:// Go example - accessing response headers
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	body, _ := json.Marshal(map[string]interface{}{
		"model":    "gpt-5.4-mini",
		"messages": []map[string]string{{"role": "user", "content": "hi"}},
	})

	req, _ := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, _ := (&http.Client{}).Do(req)
	defer resp.Body.Close()

	// Access headers
	requestID := resp.Header.Get("x-request-id")
	remainingRequests := resp.Header.Get("x-ratelimit-remaining-requests")
	remainingTokens := resp.Header.Get("x-ratelimit-remaining-tokens")
	resetTime := resp.Header.Get("x-ratelimit-reset-requests")

	fmt.Printf("Request ID: %s\n", requestID)
	fmt.Printf("Remaining Requests: %s\n", remainingRequests)
	fmt.Printf("Remaining Tokens: %s\n", remainingTokens)
	fmt.Printf("Reset Time: %s\n", resetTime)
}

php=:<?php
// PHP example - accessing response headers
$ch = curl_init('https://api.avalai.ir/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . getenv('AVALAI_API_KEY'),
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => 'gpt-5.4-mini',
    'messages' => [['role' => 'user', 'content' => 'hi']]
]));

$response = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);
curl_close($ch);

// Parse headers
preg_match('/x-request-id:\s*([^\r\n]+)/i', $headers, $requestId);
preg_match('/x-ratelimit-remaining-requests:\s*([^\r\n]+)/i', $headers, $remainingRequests);
preg_match('/x-ratelimit-remaining-tokens:\s*([^\r\n]+)/i', $headers, $remainingTokens);
preg_match('/x-ratelimit-reset-requests:\s*([^\r\n]+)/i', $headers, $resetTime);

echo "Request ID: " . trim($requestId[1] ?? '') . "\n";
echo "Remaining Requests: " . trim($remainingRequests[1] ?? '') . "\n";
echo "Remaining Tokens: " . trim($remainingTokens[1] ?? '') . "\n";
echo "Reset Time: " . trim($resetTime[1] ?? '') . "\n";
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.4-mini",
  instructions: "You are a helpful assistant.",
  input: "Write a one-sentence summary of AvalAI.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.4-mini",
    "input": "Write a one-sentence summary of AvalAI.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Monitoring Rate Limits

Example of monitoring your rate limits in real-time:

```language-selector
python=:# Python - Rate limit monitoring
import requests
import time


def make_api_call():
    response = requests.post(
        "https://api.avalai.ir/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}"},
        json={"model": "gpt-5.4-mini", "messages": [{"role": "user", "content": "hi"}]},
    )

    # Monitor rate limits
    remaining = int(response.headers.get("x-ratelimit-remaining-requests", 0))
    limit = int(response.headers.get("x-ratelimit-limit-requests", 0))
    reset = response.headers.get("x-ratelimit-reset-requests", "")

    usage_percent = ((limit - remaining) / limit * 100) if limit > 0 else 0

    print(f"Rate Limit Usage: {usage_percent:.2f}%")
    print(f"Remaining: {remaining}/{limit}")
    print(f"Resets in: {reset}")

    # Warn if approaching limit
    if usage_percent > 90:
        print("⚠️  WARNING: Approaching rate limit!")
        time.sleep(5)  # Back off

    return response


# Use in your application
for i in range(100):
    response = make_api_call()
    # Process response...

javascript=:// JavaScript - Rate limit monitoring with backoff
async function makeApiCallWithRateLimit() {
  const response = await fetch("https://api.avalai.ir/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "hi" }],
    }),
  });

  // Monitor rate limits
  const remaining = parseInt(response.headers.get("x-ratelimit-remaining-requests") || "0");
  const limit = parseInt(response.headers.get("x-ratelimit-limit-requests") || "0");
  const reset = response.headers.get("x-ratelimit-reset-requests") || "";

  const usagePercent = limit > 0 ? ((limit - remaining) / limit) * 100 : 0;

  console.log(`Rate Limit Usage: ${usagePercent.toFixed(2)}%`);
  console.log(`Remaining: ${remaining}/${limit}`);
  console.log(`Resets in: ${reset}`);

  // Handle 429 responses
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("retry-after") || "60");
    console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return makeApiCallWithRateLimit(); // Retry
  }

  // Warn if approaching limit
  if (usagePercent > 90) {
    console.log("⚠️  WARNING: Approaching rate limit!");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Back off
  }

  return response;
}

go=:// Go - Rate limit monitoring
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"
)

func makeAPICallWithRateLimit() (*http.Response, error) {
	body, _ := json.Marshal(map[string]interface{}{
		"model":    "gpt-5.4-mini",
		"messages": []map[string]string{{"role": "user", "content": "hi"}},
	})

	req, _ := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, err := (&http.Client{}).Do(req)
	if err != nil {
		return nil, err
	}

	// Monitor rate limits
	remaining, _ := strconv.Atoi(resp.Header.Get("x-ratelimit-remaining-requests"))
	limit, _ := strconv.Atoi(resp.Header.Get("x-ratelimit-limit-requests"))
	reset := resp.Header.Get("x-ratelimit-reset-requests")

	usagePercent := float64(0)
	if limit > 0 {
		usagePercent = float64(limit-remaining) / float64(limit) * 100
	}

	fmt.Printf("Rate Limit Usage: %.2f%%\n", usagePercent)
	fmt.Printf("Remaining: %d/%d\n", remaining, limit)
	fmt.Printf("Resets in: %s\n", reset)

	// Handle 429 responses
	if resp.StatusCode == 429 {
		retryAfter, _ := strconv.Atoi(resp.Header.Get("retry-after"))
		if retryAfter == 0 {
			retryAfter = 60
		}
		fmt.Printf("Rate limited. Retrying after %d seconds...\n", retryAfter)
		time.Sleep(time.Duration(retryAfter) * time.Second)
		resp.Body.Close()
		return makeAPICallWithRateLimit() // Retry
	}

	// Warn if approaching limit
	if usagePercent > 90 {
		fmt.Println("⚠️  WARNING: Approaching rate limit!")
		time.Sleep(5 * time.Second) // Back off
	}

	return resp, nil
}

php=:<?php
// PHP - Rate limit monitoring
function makeApiCallWithRateLimit() {
    $ch = curl_init('https://api.avalai.ir/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . getenv('AVALAI_API_KEY'),
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'model' => 'gpt-5.4-mini',
        'messages' => [['role' => 'user', 'content' => 'hi']]
    ]));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    curl_close($ch);

    // Parse headers
    preg_match('/x-ratelimit-remaining-requests:\s*(\d+)/i', $headers, $remaining);
    preg_match('/x-ratelimit-limit-requests:\s*(\d+)/i', $headers, $limit);
    preg_match('/x-ratelimit-reset-requests:\s*([^\r\n]+)/i', $headers, $reset);

    $remaining = isset($remaining[1]) ? (int)$remaining[1] : 0;
    $limit = isset($limit[1]) ? (int)$limit[1] : 0;
    $reset = isset($reset[1]) ? trim($reset[1]) : '';

    $usagePercent = $limit > 0 ? (($limit - $remaining) / $limit * 100) : 0;

    echo "Rate Limit Usage: " . number_format($usagePercent, 2) . "%\n";
    echo "Remaining: $remaining/$limit\n";
    echo "Resets in: $reset\n";

    // Handle 429 responses
    if ($httpCode == 429) {
        preg_match('/retry-after:\s*(\d+)/i', $headers, $retryAfter);
        $retryAfter = isset($retryAfter[1]) ? (int)$retryAfter[1] : 60;
        echo "Rate limited. Retrying after $retryAfter seconds...\n";
        sleep($retryAfter);
        return makeApiCallWithRateLimit(); // Retry
    }

    // Warn if approaching limit
    if ($usagePercent > 90) {
        echo "⚠️  WARNING: Approaching rate limit!\n";
        sleep(5); // Back off
    }

    return json_decode($body, true);
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.4-mini",
  instructions: "You are a helpful assistant.",
  input: "Write a one-sentence summary of AvalAI.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.4-mini",
    "input": "Write a one-sentence summary of AvalAI.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


---

## Best Practices

### 1. Always Capture x-request-id

Store the `x-request-id` from every API call for:
- Cost tracking and billing (especially for resellers)
- Debugging and support requests
- Audit trails and compliance

```python
# Good practice
request_id = response.headers.get("x-request-id")
db.store_request_log(user_id=user.id, request_id=request_id, timestamp=now())
```

### 2. Monitor Rate Limits Proactively

Don't wait for 429 errors. Monitor your rate limit headers and implement backoff strategies:

```python
remaining = int(response.headers.get("x-ratelimit-remaining-requests", 0))
if remaining < 100:  # Less than 100 requests remaining
    time.sleep(1)  # Back off
```

### 3. Handle 429 Responses Gracefully

Implement exponential backoff when you receive rate limit errors:

```python
import time


def make_request_with_retry(max_retries=3):
    for attempt in range(max_retries):
        response = requests.post(...)

        if response.status_code == 429:
            retry_after = int(response.headers.get("retry-after", 60))
            time.sleep(retry_after)
            continue

        return response

    raise Exception("Max retries exceeded")
```

### 4. Use Request IDs for Cost Lookups

For precise cost tracking, wait up to 30 seconds after the request, then query the User API:

```python
# Step 1: Make API call and capture x-request-id
response = requests.post(...)
request_id = response.headers.get("x-request-id")

# Step 2: Wait for processing
time.sleep(5)  # Usually available much sooner

# Step 3: Get exact cost
cost_data = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    json={"transaction_ids": [request_id]},
)
```

See [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) for complete workflow.

### 5. Log Headers for Debugging

When reporting issues to support, include relevant headers:

```python
import logging

logging.info(f"Request ID: {response.headers.get('x-request-id')}")
logging.info(f"Status Code: {response.status_code}")
logging.info(f"Rate Limit: {response.headers.get('x-ratelimit-remaining-requests')}")
```

---

## Related Resources

- [User API Reference](en/api-reference/user.md) - Track usage and costs using request IDs
- [Rate Limits Guide](en/guides/rate-limits.md) - Understanding rate limit tiers and best practices
- [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Step-by-step guide for precise cost tracking
- [Error Handling](en/guides/error-handling.md) - Best practices for handling API errors
- [Chat Completions API](en/api-reference/chat.md) - Main API endpoint documentation