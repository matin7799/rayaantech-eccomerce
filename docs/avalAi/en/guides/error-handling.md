# Error Handling

This guide provides comprehensive information on handling errors when using the AvalAI API.

## Understanding API Errors

When an API request fails, AvalAI returns an HTTP status code along with a JSON response that includes detailed error information. Understanding these errors and implementing proper error handling is essential for building robust applications.

### Error Response Format

```json
{
  "error": {
    "message": "Incorrect API key provided: Bearer. You can find your API key at https://chat.avalai.ir/platform/api-keys.",

    "type": "invalid_request_error",
    "param": null,
    "code": "invalid_api_key",
    "solution": "If your API key was recently created, please wait up to 60 seconds for it to activate. Otherwise, verify you're using the correct key and that it hasn't been revoked. You can manage your API keys at https://chat.avalai.ir/platform/api-keys.",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Common Fields in Error Responses

| Field       | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `message`   | A human-readable description of the error                      |
| `type`      | The type of error returned                                     |
| `param`     | The parameter that caused the error (if applicable)           |
| `code`      | A specific error code (if applicable)                         |
| `solution`  | Suggested solution to resolve the error (if applicable)       |
| `request_id`| Unique request identifier for tracking and debugging purposes |

### Using Request ID for Support

Every error response includes a unique `request_id` field that can be used for debugging and getting help from the support team. If you encounter an error that you cannot resolve:

1. **Note the Request ID**: Use the `request_id` field from the error response
2. **Contact Support**: Email support@avalai.ir
3. **Provide Complete Details**: Include the request ID, error message, and description of the issue in your email

This ID helps the support team quickly identify and resolve your issue.

## HTTP Status Codes

AvalAI uses standard HTTP status codes to indicate the success or failure of API requests:

### 2xx - Success

| Status Code | Description                                                                |
| ----------- | -------------------------------------------------------------------------- |
| 200         | OK - The request was successful                                            |
| 201         | Created - The resource was successfully created                            |
| 204         | No Content - The request was successful, but there is no content to return |

### 4xx - Client Errors

| Status Code | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| 400         | Bad Request - The request was malformed or invalid                                |
| 401         | Unauthorized - Authentication failed or was not provided                          |
| 403         | Forbidden - The authenticated user does not have access to the requested resource |
| 404         | Not Found - The requested resource does not exist                                 |
| 409         | Conflict - The request conflicts with the current state of the resource           |
| 422         | Unprocessable Entity - The request was well-formed but contains semantic errors   |
| 429         | Too Many Requests - Rate limit exceeded                                           |

### 5xx - Server Errors

| Status Code | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| 500         | Internal Server Error - An unexpected error occurred on the server                    |
| 502         | Bad Gateway - The server received an invalid response from an upstream server         |
| 503         | Service Unavailable - The server is temporarily unavailable                           |
| 504         | Gateway Timeout - The server timed out waiting for a response from an upstream server |

## Common Error Types

### Authentication Errors (401)

#### `invalid_api_key`
Invalid, expired, or suspended API key.

```json
{
  "error": {
    "message": "Incorrect API key provided: aa-JEa8wq. You can find your API key at https://chat.avalai.ir/platform/api-keys.",

    "type": "invalid_request_error",
    "param": null,
    "code": "invalid_api_key",
    "solution": "If your API key was recently created, please wait up to 60 seconds for it to activate. Otherwise, verify you're using the correct key and that it hasn't been revoked.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Invalid Request Errors (400)

#### `invalid_request_format`
Malformed request or missing required parameters.

```json
{
  "error": {
    "message": "Your request was malformed or missing some required parameters, such as a token or an input.",
    "type": "invalid_request_format",
    "param": null,
    "code": "invalid_request_format",
    "solution": "Check the https://docs.avalai.ir for the specific API method you are calling and make sure you are sending valid and complete parameters.",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `context_window_exceeded`
Input exceeds the model's maximum context window.

```json
{
  "error": {
    "message": "This model's maximum context length is exceeded. Please reduce the length of your prompt or completion.",
    "type": "context_window_exceeded",
    "param": "messages",
    "code": "context_window_exceeded",
    "solution": "The input is too long for this model. Try reducing the length of your input or using a model with a larger context window.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `unsupported_model`
The requested model is not supported for this endpoint.

```json
{
  "error": {
    "message": "The requested model 'gpt-5' is not supported for '/chat/completions' path. Please use a compatible model.",
    "type": "unsupported_model",
    "param": "model",
    "code": "unsupported_model",
    "solution": "Please check the documentation to see which models are available for this specific endpoint.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `content_policy_violation`
Content violates safety policies.

```json
{
  "error": {
    "message": "Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.",
    "type": "content_policy_violation",
    "param": null,
    "code": "content_policy_violation",
    "solution": "Please review our content policy guidelines and modify your request to comply with our safety requirements.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Access Errors (403)

#### `model_access_denied`
You don't have access to the requested model.

```json
{
  "error": {
    "message": "model gpt-5.5 does not exists or you don't have access to it, for more information check https://chat.avalai.ir/platform/limits",

    "type": "model_access_denied",
    "param": null,
    "code": "model_access_denied",
    "solution": "Please check https://chat.avalai.ir/platform/limits",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `insufficient_tier`
Your account tier is insufficient for this model.

```json
{
  "error": {
    "message": "model gpt-5.5 does not exists or you don't have access to it, for more information check https://chat.avalai.ir/platform/limits",

    "type": "insufficient_tier",
    "param": null,
    "code": "insufficient_tier",
    "solution": "Please check https://chat.avalai.ir/platform/limits",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Resource Not Found Errors (404)

#### `resource_not_found`
The requested resource does not exist.

```json
{
  "error": {
    "message": "Requested resource text-embedding-3-small does not exist. for more information check https://chat.avalai.ir/platform/limits",

    "type": "not_found",
    "param": null,
    "code": "resource_not_found",
    "solution": "Please check https://chat.avalai.ir/platform/limits",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Rate Limit Errors (429)

#### `rate_limit_exceeded`
You have exceeded your rate limit for requests.

```json
{
  "error": {
    "message": "Rate limit reached for requests.",
    "type": "rate_limit_exceeded",
    "param": null,
    "code": "rate_limit_exceeded",
    "solution": "Pace your requests or upgrade to higher levels. Read the Rate limit guide at https://chat.avalai.ir/platform/limits",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `quota_exceeded`
Your account quota has been exceeded.

```json
{
  "error": {
    "message": "You exceeded your current quota, please check your plan and billing details.",
    "type": "quota_exceeded",
    "param": null,
    "code": "quota_exceeded",
    "solution": "Please check your credit balance at https://chat.avalai.ir/platform/billing",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `insufficient_quota`
Your account has insufficient credits to complete this request.

```json
{
  "error": {
    "message": "You have insufficient credit to complete this request. Your remaining balance of 0.001 UNIT(s) does not cover the estimated cost.",
    "type": "insufficient_quota",
    "param": null,
    "code": "insufficient_quota",
    "solution": "Please check your credit balance at https://chat.avalai.ir/platform/billing. You may need to add more credits to continue using the service.",

    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Server Errors (500)

#### `internal_server_error`
An unexpected error occurred on the server.

```json
{
  "error": {
    "message": "The server encountered an unexpected condition that prevented it from fulfilling the request. Please try again later.",
    "type": "internal_server_error",
    "param": null,
    "code": "internal_server_error",
    "solution": "This is usually a temporary issue on our side. Please retry your request after a brief wait.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `provider_server_error`
Error processing your request by the API provider.

```json
{
  "error": {
    "message": "Error processing your request by the API provider. Please try again later.",
    "type": "provider_server_error",
    "param": null,
    "code": "provider_server_error",
    "solution": "The API provider encountered an error. This could be temporary. Please retry your request.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

### Service Unavailable Errors (503)

#### `service_unavailable`
The service is temporarily unavailable.

```json
{
  "error": {
    "message": "The server is currently unable to handle the request due to a temporary overload or maintenance of the server. Please try again later.",
    "type": "service_unavailable",
    "param": null,
    "code": "service_unavailable",
    "solution": "The service is temporarily unavailable. This could be due to high demand or planned maintenance.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

#### `model_overloaded`
The requested model is currently overloaded.

```json
{
  "error": {
    "message": "The model gpt-5.5 is currently overloaded. please try again later.",
    "type": "model_overloaded",
    "param": "model",
    "code": "model_overloaded",
    "solution": "The specific model you requested is experiencing high demand. Please try again shortly, or consider using an alternative model.",
    "request_id": "01994ea4-2038-7192-8997-3a3d05ef98d4"
  }
}
```

## Error Handling Best Practices

### Implement Retry Logic

For transient errors (e.g., 429, 500, 502, 503, 504), implement retry logic with exponential backoff:

#### Code Example

```language-selector
python=:import time
import random
from openai import OpenAI, APIError, RateLimitError

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

def make_api_request_with_retry(func, max_retries=5, initial_delay=1, max_delay=60):
"""Make an API request with exponential backoff retry logic."""
num_retries = 0
delay = initial_delay

while True:

try:
    return func()
except RateLimitError as e:
    # Get retry-after header if available
    retry_after = int(e.headers.get("retry-after", 0)) if e.headers else 0
    delay = max(retry_after, delay)

    if num_retries >= max_retries:
    raise

# Exponential backoff with jitter
    sleep_time = delay + random.uniform(0, 0.5 * delay)
    time.sleep(sleep_time)
    num_retries += 1
    delay = min(delay * 2, max_delay)

except APIError as e:
# Only retry on server errors (5xx)
    if not (e.status_code and 500 <= e.status_code < 600):
    raise

    if num_retries >= max_retries:
    raise

# Exponential backoff with jitter
    sleep_time = delay + random.uniform(0, 0.5 * delay)
    time.sleep(sleep_time)
    num_retries += 1
    delay = min(delay * 2, max_delay)

# Example usage
    def get_chat_completion():
    return client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Hello!"}]
    )

try:
    response = make_api_request_with_retry(get_chat_completion)
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Failed after multiple retries: {e}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function makeApiRequestWithRetry(
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
      // Handle rate limit errors
      if (error.status === 429) {
        const retryAfter = error.headers?.["retry-after"]
          ? parseInt(error.headers["retry-after"]) * 1000
          : 0;
        delay = Math.max(retryAfter, delay);
      }
      // Don't retry client errors other than 429
      else if (!error.status || error.status < 500) {
        throw error;
      }

      if (numRetries >= maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 0.5 * delay;
      const sleepTime = delay + jitter;
      await new Promise((resolve) => setTimeout(resolve, sleepTime));

      numRetries += 1;
      delay = Math.min(delay * 2, maxDelay);
    }
  }
}

// Example usage
async function getChatCompletion() {
  return client.chat.completions.create({
    model: "gpt-5.5",
    messages: [{ role: "user", content: "Hello!" }],
  });
}

async function main() {
  try {
    const response = await makeApiRequestWithRetry(getChatCompletion);
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Failed after multiple retries: ", error);
  }
}

main();

bash=:#!/bin/bash

# Function to make an API request with exponential backoff retry logic
function make_api_request_with_retry {
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
    "model": "gpt-5.5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }')

    http_code=${response: -3}
    content=${response:0:${#response}-3}

    # Check response
    if [[ $http_code -eq 200 ]]; then
      echo "$content"
      return 0
    elif [[ $http_code -eq 429 ]]; then
      # Rate limit error
      retry_after=$(echo "$content" | grep -o '"retry_after":[0-9]*' | grep -o '[0-9]*')
      if [[ -n $retry_after ]]; then
        delay=$retry_after
      fi
    elif [[ $http_code -lt 500 ]]; then
      # Don't retry client errors other than 429
      echo "Client error: $http_code - $content" >&2
      return 1
    fi

    # Check retry count
    if [[ $num_retries -ge $max_retries ]]; then
      echo "Max retries reached: $content" >&2
      return 1
    fi

    # Exponential backoff with jitter
    jitter=$(awk -v delay="$delay" 'BEGIN {srand(); print rand() * 0.5 * delay}')
    sleep_time=$(awk -v delay="$delay" -v jitter="$jitter" 'BEGIN {print delay + jitter}')

    echo "Retrying in $sleep_time seconds..." >&2
    sleep $sleep_time

    num_retries=$((num_retries + 1))
    delay=$((delay < max_delay / 2 ? delay * 2 : max_delay))
  done
}

# Use the function
echo "Sending request to API..."
result=$(make_api_request_with_retry)
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

// Function to make an API request with exponential backoff retry logic
func makeApiRequestWithRetry(ctx context.Context, fn func() (interface{}, error), maxRetries int, initialDelay, maxDelay time.Duration) (interface{}, error) {
	var numRetries int
	delay := initialDelay

	for {
		// Make API request
		result, err := fn()
		if err == nil {
			return result, nil
		}

		// Check error type
		var retryAfter time.Duration
		var shouldRetry bool

		// Handle rate limit errors
		if apiErr, ok := err.(*openai.APIError); ok {
			if apiErr.HTTPStatusCode == http.StatusTooManyRequests {
				shouldRetry = true
				// Extract retry-after header
				if apiErr.Header != nil {
					if retryAfterStr := apiErr.Header.Get("retry-after"); retryAfterStr != "" {
						if retryAfterSec, err := strconv.Atoi(retryAfterStr); err == nil {
							retryAfter = time.Duration(retryAfterSec) * time.Second
						}
					}
				}
			} else if apiErr.HTTPStatusCode >= 500 {
				// Retry on server errors
				shouldRetry = true
			}
		}

		// If we shouldn't retry or have reached max retries
		if !shouldRetry || numRetries >= maxRetries {
			return nil, err
		}

		// Use the larger of current delay or retry-after
		if retryAfter > delay {
			delay = retryAfter
		}

		// Exponential backoff with jitter
		jitter := time.Duration(rand.Float64() * 0.5 * float64(delay))
		sleepTime := delay + jitter

		fmt.Fprintf(os.Stderr, "Retrying in %v...\n", sleepTime)

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
	getChatCompletion := func() (interface{}, error) {
		return client.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model: "gpt-5.5",
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
	result, err := makeApiRequestWithRetry(ctx, getChatCompletion, 5, 1*time.Second, 60*time.Second)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error after multiple retries: %v\n", err)
		os.Exit(1)
	}

	// Display response
	if resp, ok := result.(openai.ChatCompletionResponse); ok {
		fmt.Println(resp.Choices[0].Message.Content)
	} else {
		fmt.Fprintf(os.Stderr, "Invalid response type\n")
	}
}

php=:<?php
require 'vendor/autoload.php';

/**
* Function to make an API request with exponential backoff retry logic
*/
function makeApiRequestWithRetry($func, $maxRetries = 5, $initialDelay = 1, $maxDelay = 60) {
  $numRetries = 0;
  $delay = $initialDelay;

  while (true) {
    try {
      return $func();
    } catch (\Exception $e) {
      // Check for rate limit error
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

      // Check if it's a server error
      $isServerError = false;
      if (method_exists($e, 'getResponse')) {
        $response = $e->getResponse();
        if ($response && $response->getStatusCode() >= 500) {
          $isServerError = true;
        }
      }

      // Don't retry client errors other than rate limit
      if (!$isRateLimitError && !$isServerError) {
        throw $e;
      }

      if ($numRetries >= $maxRetries) {
        throw $e;
      }

      // Set delay based on retry-after header
      if ($retryAfter > 0) {
        $delay = max($retryAfter, $delay);
      }

      // Exponential backoff with jitter
      $jitter = mt_rand() / mt_getrandmax() * 0.5 * $delay;
      $sleepTime = $delay + $jitter;

      error_log("Retrying in {$sleepTime} seconds...");
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
$getChatCompletion = function() use ($client) {
  return $client->chat()->create([
  'model' => 'gpt-5.5',
  'messages' => [
  ['role' => 'user', 'content' => 'Hello!'],
  ],
  ]);
};

// Use function with retry logic
try {
  $response = makeApiRequestWithRetry($getChatCompletion);
  echo $response->choices[0]->message->content;
} catch (\Exception $e) {
  echo "Error after multiple retries: " . $e->getMessage();
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
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Hello!",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Hello!",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Hello!",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Handle Specific Error Types

Implement specific handling for different error types:

```python
from openai import (
    OpenAI,
    APIError,
    RateLimitError,
    AuthenticationError,
    PermissionError,
)

client = OpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

try:
    response = client.chat.completions.create(
        model="gpt-5.5", messages=[{"role": "user", "content": "Hello!"}]
    )
except AuthenticationError as e:
    print(f"Authentication error: {e}. Please check your API key.")
except PermissionError as e:
    print(f"Permission error: {e}. Please check your access permissions.")
except RateLimitError as e:
    print(
        f"Rate limit exceeded: {e}. Please try again later or reduce request frequency."
    )
    # Implement retry logic with exponential backoff
except APIError as e:
    if e.status_code == 404:
        print(f"Resource not found: {e}. Please check the requested resource exists.")
    elif e.status_code == 400:
        print(f"Bad request: {e}. Please check your request parameters.")
    elif 500 <= e.status_code < 600:
        print(f"Server error: {e}. Please try again later.")
    else:
        print(f"API error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
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
    model="gpt-5.5",
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


### Validate Input Before Sending

Validate input parameters before sending requests to avoid predictable errors:

```python
def validate_chat_completion_params(model, messages, temperature=None):
    errors = []

    # Validate model
    if not model:
        errors.append("Model parameter is required")

    # Validate messages
    if not messages:
        errors.append("Messages array is required and cannot be empty")
    else:
        for i, msg in enumerate(messages):
            if "role" not in msg:
                errors.append(f"Message at index {i} is missing 'role'")
            if (
                "content" not in msg
                and "function_call" not in msg
                and "tool_calls" not in msg
            ):
                errors.append(
                    f"Message at index {i} is missing 'content' or function/tool call"
                )

    # Validate temperature
    if temperature is not None and (temperature < 0 or temperature > 2):
        errors.append("Temperature must be between 0 and 2")

    return errors


# Example usage
model = "gpt-5.5"
messages = [{"role": "user", "content": "Hello!"}]
temperature = 0.7

validation_errors = validate_chat_completion_params(model, messages, temperature)
if validation_errors:
    print("Validation errors:", validation_errors)
    # Handle validation errors
else:
    # Proceed with API call
    response = client.chat.completions.create(
        model=model, messages=messages, temperature=temperature
    )
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

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="Hello!",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Implement Circuit Breakers

For production applications, implement a circuit breaker pattern to prevent cascading failures:

```python
import time
from functools import wraps


class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30, name="default"):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.name = name
        self.failures = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # Possible states: CLOSED, OPEN, HALF-OPEN

    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if self.state == "OPEN":
                # Check if the recovery timeout has passed to try half-open state
                if time.time() - self.last_failure_time > self.recovery_timeout:
                    self.state = "HALF-OPEN"
                else:
                    raise Exception(f"Circuit breaker '{self.name}' is OPEN")

            try:
                result = func(*args, **kwargs)
                # If the call is successful in HALF-OPEN state, reset the circuit breaker
                if self.state == "HALF-OPEN":
                    self.state = "CLOSED"
                    self.failures = 0
                return result
            except Exception as e:
                self.failures += 1
                self.last_failure_time = time.time()
                if self.failures >= self.failure_threshold:
                    self.state = "OPEN"
                raise  # Re-raise the exception after circuit breaker processing

        return wrapper


# Example usage:
# Note: 'client' should be defined before calling 'get_chat_completion'


@CircuitBreaker(failure_threshold=3, recovery_timeout=60, name="chat_completions")
def get_chat_completion(prompt):
    return client.chat.completions.create(
        model="gpt-5.5", messages=[{"role": "user", "content": prompt}]
    )


try:
    response = get_chat_completion("Hello!")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
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
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Logging and Monitoring

Implement comprehensive logging and monitoring to track API errors:

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
params = {"model": "gpt-5.5", "messages": [{"role": "user", "content": "Hello!"}]}

try:
    response = client.chat.completions.create(**params)
    log_api_request("POST", "/chat/completions", params, response=response)
    print(response.choices[0].message.content)
except APIError as e:
    log_api_request("POST", "/chat/completions", params, error=e)
    raise
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
    model="gpt-5.5",
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


## Handling Streaming Responses

When using streaming responses, implement proper error handling:

```python
from openai import OpenAI
import sys

client = OpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

try:
    stream = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": "Write a story about a robot."}],
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            sys.stdout.write(chunk.choices[0].delta.content)
            sys.stdout.flush()

except Exception as e:
    print(f"\nError during streaming: {e}")
    # Handle stream interruption gracefully
    # For example, you might want to save any content received so far
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
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a story about a robot.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Error Handling in Production Applications

For production applications, consider implementing these additional practices:

1. **Centralized Error Handling**: Create a centralized error handling system to consistently process and respond to errors.
2. **Error Reporting**: Integrate with error reporting services like Sentry or Rollbar to track and analyze errors.
3. **Health Checks**: Implement health checks to monitor the API's availability.
4. **Fallback Mechanisms**: Develop fallback mechanisms for critical features when the API is unavailable.
5. **User-Friendly Error Messages**: Translate technical error messages into user-friendly language.

## Common Errors and Solutions

| Error Code                | Error Type           | Possible Causes                           | Solutions                                                     |
| ------------------------- | -------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `invalid_api_key`         | Authentication       | Invalid, expired, or suspended API key    | Check your API key at https://chat.avalai.ir/platform/api-keys |
| `invalid_request_format`  | Invalid Request      | Malformed request or missing parameters   | Review API documentation at https://docs.avalai.ir           |
| `context_window_exceeded` | Invalid Request      | Input too long for model's context window | Reduce input length or use a model with larger context window |
| `unsupported_model`       | Invalid Request      | Model not supported for this endpoint     | Check supported models list in documentation                  |
| `content_policy_violation`| Invalid Request      | Content violates safety policies          | Review and modify your prompt to comply with content policies |
| `model_access_denied`     | Access Denied        | No access to requested model              | Check account status at https://chat.avalai.ir/platform/limits |
| `insufficient_tier`       | Access Denied        | Account tier insufficient for this model  | Upgrade your account or use a model suitable for your tier   |
| `resource_not_found`      | Not Found            | Requested resource or model doesn't exist | Check model name for typos                                    |
| `rate_limit_exceeded`     | Rate Limit           | Too many requests in a short time         | Implement rate limiting and retry with exponential backoff    |
| `quota_exceeded`          | Rate Limit           | Account quota has been exceeded           | Check account balance at https://chat.avalai.ir/platform/billing |
| `insufficient_quota`      | Rate Limit           | Insufficient credits for request          | Add more credits to your account                              |
| `internal_server_error`   | Server Error         | Unexpected server error                   | Wait briefly and retry your request                           |
| `provider_server_error`   | Server Error         | API provider error                        | Try a different model or retry later                          |
| `service_unavailable`     | Service Unavailable  | Service temporarily unavailable           | Wait briefly and retry your request                           |
| `model_overloaded`        | Service Unavailable  | Model experiencing high demand            | Use an alternative model or retry later                       |

### Important Debugging Tips

1. **Always save the request_id** - This ID is essential for tracking issues with the support team
2. **Read error messages completely** - Most error messages include helpful guidance for resolving the issue
3. **Check the solution field** - Many errors include suggested solutions
4. **Contact support when needed** - Email support@avalai.ir with the request ID

## Conclusion

Proper error handling is essential for building robust applications with the AvalAI API. By implementing the strategies outlined in this guide, you can create more resilient applications that gracefully handle errors and provide a better user experience.

Remember that the specific error types and codes may evolve over time as the API develops. Always refer to the most up-to-date documentation for the latest information on error handling.
