# Rate Limits

This guide explains rate limits for the AvalAI API and provides strategies for managing them effectively in your applications.

## Understanding Rate Limits

Rate limits are restrictions on the number of API requests you can make within a certain time period. These limits are in place to ensure fair usage of the API and to prevent abuse. AvalAI implements rate limits similar to OpenAI's approach, with automatic tier upgrades based on your usage.

## Understanding Usage Tiers

AvalAI uses a tier-based system where your rate limits grow automatically as your account matures — first by verifying your phone, then through cumulative top-ups. There are no applications, no waiting periods, and no manual approvals: as soon as you meet the requirements for a tier, your new limits are active.

### How Rate Limits Work

Rate limits are measured in five ways:
- **RPM** (requests per minute)
- **RPD** (requests per day)
- **TPM** (tokens per minute)
- **TPD** (tokens per day)
- **IPM** (images per minute)

You can hit rate limits across any of these metrics, depending on which is reached first. For example, you might send 20 requests with only 100 tokens and hit your RPM limit, even if you haven't reached your TPM limit.

### Tier Qualification

Every registered AvalAI user can call the API right away. Your tier is decided by two things:

1. **How you verified your account** — email-only, or with a phone number.
2. **How much you've topped up over time** — top-ups are cumulative across your account's lifetime.

| Tier | How to Qualify | Rate Limits |
|------|----------------|-------------|
| Basic (Tier 0) | Sign up with an email address | See [Basic Tier Rate Limits](en/rate-limits-tier0.md) |
| Tier 1 | Verify a phone number on your account | See [Tier 1 Rate Limits](en/rate-limits-tier1.md) |
| Tier 2 | $10 total topped up | See [Tier 2 Rate Limits](en/rate-limits-tier2.md) |
| Tier 3 | $50 total topped up | See [Tier 3 Rate Limits](en/rate-limits-tier3.md) |
| Tier 4 | $250 total topped up | See [Tier 4 Rate Limits](en/rate-limits-tier4.md) |
| Tier 5 | $1,000 total topped up | See [Tier 5 Rate Limits](en/rate-limits-tier5.md) |

**Good to know:**

- 🎁 **Sign up and start building for free** — every new email-verified account lands on the Basic tier with a **25,000 IRT activation credit** so you can try the API right away, no top-up required.
- 📱 **Verifying your phone instantly bumps you to Tier 1.** This applies whether you signed up with a phone number from the start, or added it to an email-only account later. No top-up is required for this upgrade.
- ⚡ **Tier upgrades happen automatically and instantly** the moment you meet the next requirement — no support tickets, no waiting.
- 💳 **Top-ups are cumulative.** Tiers 2 and above are based on your total historical top-up amount, not your current balance, and **none of your credit is consumed by upgrading** — every penny stays available for API usage.
- 💱 Top-ups are made in IRT; the USD equivalent for tier qualification is calculated using the exchange rate shown on [chat.avalai.ir/platform](https://chat.avalai.ir/platform).
- 📈 **No monthly spending caps** — you can use your full credit balance whenever you need to.
- 🤖 Each tier unlocks more models and higher per-model limits. Rate limits are defined per model at the organization level.

For detailed rate limits for each model in your tier, visit the tier-specific pages linked above.

## Rate Limit Headers

When you make API requests, the response headers include information about your current rate limit status:

| Header | Description |
|--------|-------------|
| `x-ratelimit-limit-requests` | The maximum number of requests allowed in the current time window |
| `x-ratelimit-remaining-requests` | The number of requests remaining in the current time window |
| `x-ratelimit-reset-requests` | The time at which the current rate limit window resets  |
| `x-ratelimit-limit-tokens` | The maximum number of tokens allowed in the current time window |
| `x-ratelimit-remaining-tokens` | The number of tokens remaining in the current time window |
| `x-ratelimit-reset-tokens` | The time at which the token rate limit window resets  |

## Handling Rate Limit Errors

When you exceed a rate limit, the API returns a 429 Too Many Requests status code along with information about when you can retry:

```json
{
  "error": {
    "message": "Rate limit exceeded for requests. Please try again in 30s.",
    "type": "rate_limit_error",
    "param": null,
    "code": "rate_limit_exceeded"
  }
}
```

The response may include a `Retry-After` header indicating the number of seconds to wait before retrying:

```
Retry-After: 30
```

## Best Practices for Managing Rate Limits

### Implement Exponential Backoff

When you encounter a rate limit error, use exponential backoff to retry the request:

#### Python Example

```language-selector
python=:import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

def make_request_with_backoff(func, max_retries=5, initial_delay=1, max_delay=60):
"""Make an API request with exponential backoff for rate limit errors."""
num_retries = 0
delay = initial_delay

while True:

try:
    return func()
except RateLimitError as e:
    # Check if we've exceeded the maximum number of retries
    if num_retries >= max_retries:
    raise

# Get retry-after header if available
    retry_after = int(e.headers.get("retry-after", 0)) if e.headers else 0
    delay = max(retry_after, delay)

# Exponential backoff with jitter
    sleep_time = delay + random.uniform(0, 0.5 * delay)
    print(f"Rate limit exceeded. Retrying in {sleep_time:.2f} seconds...")
    time.sleep(sleep_time)
    num_retries += 1
    delay = min(delay * 2, max_delay)

# Example usage
    def get_completion():
    return client.chat.completions.create(
    model="gpt-5.3-chat",
    messages=[{"role": "user", "content": "Hello!"}]
    )

try:
    response = make_request_with_backoff(get_completion)
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Failed after multiple retries: {e}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function makeRequestWithBackoff(
  func,
  maxRetries = 5,
  initialDelay = 1000,
  maxDelay = 60000,
) {
  let numRetries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await func();
    } catch (error) {
      if (error.status !== 429 || numRetries >= maxRetries) {
        throw error;
      }

      // Get retry-after header if available
      const retryAfter = error.headers?.["retry-after"]
        ? parseInt(error.headers["retry-after"]) * 1000
        : 0;
      delay = Math.max(retryAfter, delay);

      // Exponential backoff with jitter
      const jitter = Math.random() * 0.5 * delay;
      const sleepTime = delay + jitter;
      console.log(
        `Rate limit exceeded. Retrying in ${sleepTime / 1000} seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, sleepTime));

      numRetries += 1;
      delay = Math.min(delay * 2, maxDelay);
    }
  }
}

// Example usage
async function getCompletion() {
  return client.chat.completions.create({
    model: "gpt-5.3-chat",
    messages: [{ role: "user", content: "Hello!" }],
  });
}

async function main() {
  try {
    const response = await makeRequestWithBackoff(getCompletion);
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error(`Failed after multiple retries: ${error}`);
  }
}

main();

bash=:#!/bin/bash

# Function to make an API request with exponential backoff for rate limit errors
function make_request_with_backoff {
  local max_retries=5
  local initial_delay=1
  local max_delay=60
  local num_retries=0
  local delay=$initial_delay

  while true; do
    # Make API request
    response=$(curl -s -w "%{http_code}" https://api.avalai.ir/v1/chat/completions \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $AVALAI_API_KEY" \
      -d '{
    "model": "gpt-5.3-chat",
    "messages": [{"role": "user", "content": "Hello!"}]
  }')

    http_code=${response: -3}
    content=${response:0:${#response}-3}

    # Check if successful
    if [[ $http_code -eq 200 ]]; then
      echo "$content"
      return 0
    # Check for rate limit error
    elif [[ $http_code -eq 429 ]]; then
      # Check if we've exceeded the maximum number of retries
      if [[ $num_retries -ge $max_retries ]]; then
        echo "Failed after $max_retries retries: Rate limit exceeded" >&2
        return 1
      fi

      # Get retry-after header if available
      retry_after=$(echo "$content" | grep -o '"retry_after":[0-9]*' | grep -o '[0-9]*')
      if [[ -n $retry_after ]]; then
        delay=$retry_after
      fi

      # Exponential backoff with jitter
      jitter=$(awk -v delay="$delay" 'BEGIN {srand(); print rand() * 0.5 * delay}')
      sleep_time=$(awk -v delay="$delay" -v jitter="$jitter" 'BEGIN {print delay + jitter}')

      echo "Rate limit exceeded. Retrying in $sleep_time seconds..." >&2
      sleep $sleep_time

      num_retries=$((num_retries + 1))
      delay=$((delay < max_delay / 2 ? delay * 2 : max_delay))
    else
      echo "Error: $http_code - $content" >&2
      return 1
    fi
  done
}

# Use the function
echo "Sending request to API..."
result=$(make_request_with_backoff)
status=$?

if [[ $status -eq 0 ]]; then
  echo "Response received:"
  echo "$result" | grep -o '"content":"[^"]*"' | cut -d'"' -f4
else
  echo "Request failed: $result"
fi

go=:package main

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/openai/openai-go"
)

// Function to make an API request with exponential backoff for rate limit errors
func makeRequestWithBackoff(ctx context.Context, fn func() (interface{}, error), maxRetries int, initialDelay, maxDelay time.Duration) (interface{}, error) {
	numRetries := 0
	delay := initialDelay

	for {
		// Make API request
		result, err := fn()
		if err == nil {
			return result, nil
		}

		// Check if it's a rate limit error
		var retryAfter time.Duration
		isRateLimitError := false

		if apiErr, ok := err.(*openai.APIError); ok && apiErr.HTTPStatusCode == http.StatusTooManyRequests {
			isRateLimitError = true
			// Extract retry-after header
			if apiErr.Header != nil {
				if retryAfterStr := apiErr.Header.Get("retry-after"); retryAfterStr != "" {
					if retryAfterSec, err := strconv.Atoi(retryAfterStr); err == nil {
						retryAfter = time.Duration(retryAfterSec) * time.Second
					}
				}
			}
		}

		// If not a rate limit error or we've reached max retries
		if !isRateLimitError || numRetries >= maxRetries {
			return nil, err
		}

		// Use the larger of current delay or retry-after
		if retryAfter > delay {
			delay = retryAfter
		}

		// Exponential backoff with jitter
		jitter := time.Duration(rand.Float64() * 0.5 * float64(delay))
		sleepTime := delay + jitter

		fmt.Printf("Rate limit exceeded. Retrying in %.2f seconds...\n", sleepTime.Seconds())

		// Wait before retrying
		select {
		case <-time.After(sleepTime):
		case <-ctx.Done():
			return nil, ctx.Err()
		}

		// Increment counter and delay
		numRetries++
		delay = time.Duration(math.Min(float64(delay*2), float64(maxDelay)))
	}
}

func main() {
	// Set up client
	config := openai.DefaultConfig(os.Getenv("AVALAI_API_KEY"))
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	// Define request function
	getCompletion := func() (interface{}, error) {
		return client.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model: "gpt-5.3-chat",
				Messages: []openai.ChatCompletionMessage{
					{
						Role:    "user",
						Content: "Hello!",
					},
				},
			},
		)
	}

	// Send request with retry logic
	ctx := context.Background()
	result, err := makeRequestWithBackoff(ctx, getCompletion, 5, 1*time.Second, 60*time.Second)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed after multiple retries: %v\n", err)
		os.Exit(1)
	}

	// Display response
	if resp, ok := result.(openai.ChatCompletionResponse); ok {
		fmt.Println(resp.Choices[0].Message.Content)
	}
}

php=:<?php
require 'vendor/autoload.php';

/**
* Function to make an API request with exponential backoff for rate limit errors
*/
function makeRequestWithBackoff($func, $maxRetries = 5, $initialDelay = 1, $maxDelay = 60) {
  $numRetries = 0;
  $delay = $initialDelay;

  while (true) {
    try {
      return $func();
    } catch (\Exception $e) {
      // Check if it's a rate limit error
      $isRateLimitError = false;
      $retryAfter = 0;

      if (method_exists($e, 'getResponse')) {
        $response = $e->getResponse();
        if ($response && $response->getStatusCode() === 429) {
          $isRateLimitError = true;
          $headers = $response->getHeaders();
          if (isset($headers['Retry-After'][0])) {
            $retryAfter = (int)$headers['Retry-After'][0];
          }
        }
      }

      // If not a rate limit error or we've reached max retries
      if (!$isRateLimitError || $numRetries >= $maxRetries) {
        throw $e;
      }

      // Use the larger of current delay or retry-after
      if ($retryAfter > 0) {
        $delay = max($retryAfter, $delay);
      }

      // Exponential backoff with jitter
      $jitter = mt_rand() / mt_getrandmax() * 0.5 * $delay;
      $sleepTime = $delay + $jitter;

      echo "Rate limit exceeded. Retrying in {$sleepTime} seconds...\n";
      sleep($sleepTime);

      $numRetries++;
      $delay = min($delay * 2, $maxDelay);
    }
  }
}

// Set up client
$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, [
'base_url' => 'https://api.avalai.ir/v1',
]);

// Define request function
$getCompletion = function() use ($client) {
  return $client->chat()->create([
  'model' => 'gpt-5.4',
  'messages' => [
  ['role' => 'user', 'content' => 'Hello!'],
  ],
  ]);
};

// Use function with retry logic
try {
  $response = makeRequestWithBackoff($getCompletion);
  echo $response->choices[0]->message->content;
} catch (\Exception $e) {
  echo "Failed after multiple retries: " . $e->getMessage();
}
?>

```

### Implement Rate Limiting on Your Side

Proactively limit your request rate to avoid hitting the API's rate limits:

#### Python Example with Token Bucket Algorithm

```python
import logging
import json
from openai import OpenAI, APIError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("api_errors.log"), logging.StreamHandler()],
)
logger = logging.getLogger("avalai_api")

client = OpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")


def log_api_request(method, endpoint, params, response=None, error=None):
    """Log API request details."""
    # Create a copy of params to avoid modifying the original
    # And handle potential serialization issues with complex objects
    safe_params = {}
    try:
        for key, value in params.items():
            if key == "messages":
                # For messages, just log the count to avoid large logs
                safe_params[key] = f"[{len(value)} messages]"
            else:
                safe_params[key] = value
    except (AttributeError, TypeError):
        safe_params = str(params)

    log_data = {
        "method": method,
        "endpoint": endpoint,
        "params": safe_params,
    }

    if response:
        log_data["status_code"] = 200
        log_data["response_id"] = getattr(response, "id", None)
        try:
            logger.info(f"API Request Successful: {json.dumps(log_data)}")
        except TypeError:
            # Handle non-serializable objects
            log_data["params"] = str(safe_params)
            logger.info(f"API Request Successful: {json.dumps(log_data)}")

    if error:
        log_data["error_type"] = getattr(error, "type", type(error).__name__)
        log_data["error_message"] = str(error)
        log_data["status_code"] = getattr(error, "status_code", None)
        try:
            logger.error(f"API Request Failed: {json.dumps(log_data)}")
        except TypeError:
            # Handle non-serializable objects
            log_data["params"] = str(safe_params)
            logger.error(f"API Request Failed: {json.dumps(log_data)}")


# Example usage
params = {"model": "gpt-5.3-chat", "messages": [{"role": "user", "content": "Hello!"}]}

try:
    response = client.chat.completions.create(**params)
    log_api_request("POST", "/chat/completions", params, response=response)
    print(response.choices[0].message.content)
except APIError as e:
    log_api_request("POST", "/chat/completions", params, error=e)
    raise
```

### Batch Requests When Possible

For operations like embeddings, batch multiple inputs in a single request:

```python
# Instead of making 10 separate requests
texts = [
    "The quick brown fox jumps over the lazy dog.",
    "The five boxing wizards jump quickly.",
    # ... 8 more texts
]

# Make a single batch request
response = client.embeddings.create(model="text-embedding-3-small", input=texts)

# Process all embeddings at once
embeddings = [item.embedding for item in response.data]
```

### Monitor Your Usage

Track your API usage to avoid unexpected rate limit errors:

```python
def track_usage(response):
    """Track API usage from response headers."""
    headers = response.headers

    # Request-based rate limits
    requests_limit = int(headers.get("x-ratelimit-limit-requests", 0))
    requests_remaining = int(headers.get("x-ratelimit-remaining-requests", 0))
    requests_reset = int(headers.get("x-ratelimit-reset-requests", 0))

    # Token-based rate limits
    tokens_limit = int(headers.get("x-ratelimit-limit-tokens", 0))
    tokens_remaining = int(headers.get("x-ratelimit-remaining-tokens", 0))
    tokens_reset = int(headers.get("x-ratelimit-reset-tokens", 0))

    # Calculate usage percentages
    requests_usage_pct = (
        100 - (requests_remaining / requests_limit * 100) if requests_limit else 0
    )
    tokens_usage_pct = (
        100 - (tokens_remaining / tokens_limit * 100) if tokens_limit else 0
    )

    print(
        f"Requests: {requests_remaining}/{requests_limit} ({requests_usage_pct:.1f}% used)"
    )
    print(f"Tokens: {tokens_remaining}/{tokens_limit} ({tokens_usage_pct:.1f}% used)")

    # Alert if usage is high
    if requests_usage_pct > 80 or tokens_usage_pct > 80:
        print("WARNING: API usage is high!")

    return {
        "requests": {
            "limit": requests_limit,
            "remaining": requests_remaining,
            "reset": requests_reset,
            "usage_pct": requests_usage_pct,
        },
        "tokens": {
            "limit": tokens_limit,
            "remaining": tokens_remaining,
            "reset": tokens_reset,
            "usage_pct": tokens_usage_pct,
        },
    }


# Example usage
response = client.chat.completions.create(
    model="gpt-5.3-chat", messages=[{"role": "user", "content": "Hello!"}]
)

usage_stats = track_usage(response)
```

### Implement Request Queuing

For high-volume applications, implement a request queue:

```python
import time
import threading


class TokenBucket:
    """Token bucket algorithm for rate limiting."""

    def __init__(self, tokens_per_second, max_tokens):
        self.tokens_per_second = tokens_per_second
        self.max_tokens = max_tokens
        self.tokens = max_tokens
        self.last_refill_time = time.time()
        self.lock = threading.Lock()

    def get_token(self, tokens=1):
        """Get tokens from the bucket. Returns True if tokens are available, False otherwise."""
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def _refill(self):
        """Refill the token bucket based on elapsed time."""
        now = time.time()
        elapsed = now - self.last_refill_time
        new_tokens = elapsed * self.tokens_per_second
        if new_tokens > 0:
            self.tokens = min(self.tokens + new_tokens, self.max_tokens)
            self.last_refill_time = now


def make_api_request(client):
    """Make an API request with rate limiting."""
    if not rate_limiter.get_token():
        # No tokens available, need to wait
        print("Rate limit reached, waiting...")
        while not rate_limiter.get_token():
            time.sleep(0.1)

    # Now we have a token, make the API request
    try:
        response = client.chat.completions.create(
            model="gpt-5.3-chat",
            messages=[{"role": "user", "content": "Hello!"}],
        )
        return response
    except Exception as e:
        print(f"API request failed: {e}")
        return None


# Example usage
# Create a rate limiter with 10 requests per second, max burst of 50
rate_limiter = TokenBucket(10, 50)
```

## Rate Limit Strategies for Different Scenarios

### Interactive Applications

For applications with user interaction:

1. **Implement client-side throttling** to prevent users from making too many requests
2. **Show loading indicators** to provide feedback during API calls
3. **Cache responses** for common queries to reduce API calls

### Batch Processing

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 

For batch processing applications:

1. **Schedule jobs during off-peak hours** to avoid rate limit issues
2. **Process in smaller batches** to distribute requests over time
3. **Implement retry logic with increasing delays** between batches

### High-Availability Systems

For systems requiring high availability:

1. **Implement multiple API keys** with load balancing
2. **Set up fallback mechanisms** for when rate limits are reached
3. **Maintain a token/request budget** to ensure critical operations have priority

## Upgrading Your Rate Limits

If you consistently hit rate limits, here are the fastest ways to get more headroom:

1. **Verify your phone number** to jump from the Basic tier to Tier 1 — instantly, with no top-up required.
2. **Top up your account** to climb to Tier 2 and beyond. Tiers are based on cumulative top-ups, so every contribution counts toward your next upgrade.
3. **Optimize your implementation** to reduce unnecessary API calls (batching, caching, and choosing the right model size all help).
4. **Check your current tier and progress** at any time on your account dashboard.

Upgrades are automatic and instant the moment you cross the next threshold — no support tickets, no waiting, and **all of your credit stays available** for API usage after each upgrade.

## Conclusion

Effective rate limit management is essential for building reliable applications with the AvalAI API. By implementing the strategies outlined in this guide, you can minimize disruptions due to rate limiting and ensure a smooth experience for your users.

Remember that rate limits may change over time as the API evolves. Always refer to the most up-to-date documentation for the latest information on rate limits.