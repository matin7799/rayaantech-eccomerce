# Messages API

The Messages API provides access to Anthropic's models through the Claude API's `v1/messages` endpoint. This endpoint is part of AvalAI's multi-provider support, allowing you to interact with Anthropic models using their native API format. All Claude models including `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`, and other base model namespaces with smart routing are supported. The Messages API has full support for Claude Opus 4.8, including new capabilities such as `role: "system"` messages mid-conversation (preserves prompt cache hits) and the publicly documented `stop_details` object on refusal responses.

## Endpoint

```
POST https://api.avalai.ir/v1/messages
```

## Request Body

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | ID of the Anthropic model to use. See [Anthropic Models](en/providers/anthropic.md) for available options. |
| `messages` | array | Yes | Array of message objects representing the conversation history. |
| `system` | string | No | System instructions that prime the model for the conversation. |
| `max_tokens` | integer | Yes | Maximum number of tokens to generate. Default varies by model. |
| `temperature` | number | No | Sampling temperature between 0 and 1. Higher values like 0.8 make output more random, while lower values like 0.2 make it more focused. Default is 1. |
| `top_p` | number | No | Alternative to temperature, nucleus sampling. Default is 1. |
| `top_k` | integer | No | Only sample from the top K options for each subsequent token. Default is -1 (disabled). |
| `stream` | boolean | No | If set to true, partial message deltas will be sent. Default is false. |
| `stop_sequences` | array | No | Custom text sequences that will cause the model to stop generating. |
| `metadata` | object | No | Optional metadata to include in the response. |

### Message Object

Each message in the `messages` array should have the following structure:

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `role` | string | Yes | The role of the message author. One of: `user` or `assistant`. |
| `content` | string or array | Yes | The content of the message. Can be a string or an array of content blocks when using multimodal inputs. |

## Examples

### Basic Message Completion

```language-selector
bash=:curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $AVALAI_API_KEY" \
  -d '{
  "model": "anthropic.claude-sonnet-4-20250514-v1:0",
  "messages": [
    {
      "role": "user",
      "content": "Hello! Can you help me understand quantum computing?"
    }
  ],
  "max_tokens": 1024
}'

python=:from anthropic import Anthropic

client = Anthropic(
    api_key="AVALAI_API_KEY",
    base_url="https://api.avalai.ir",  # AvalAI API endpoint without /v1
)

response = client.messages.create(
    model="anthropic.claude-sonnet-4-20250514-v1:0",
    messages=[
        {
            "role": "user",
            "content": "Hello! Can you help me understand quantum computing?",
        }
    ],
    max_tokens=1024,
)

print(response.content)

javascript=:import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir", // AvalAI API endpoint without /v1
});

const response = await client.messages.create({
  model: "anthropic.claude-sonnet-4-20250514-v1:0",
  messages: [
    {
      role: "user",
      content: "Hello! Can you help me understand quantum computing?",
    },
  ],
  max_tokens: 1024,
});

console.log(response.content);

go=:package main

import (
	"context"
	"fmt"
	"os"

	"github.com/anthropic/anthropic-sdk-go"
)

func main() {
	client := anthropic.NewClient(
		anthropic.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		anthropic.WithBaseURL("https://api.avalai.ir"),
	)

	resp, err := client.Messages.Create(context.Background(), &anthropic.MessagesRequest{
		Model: "anthropic.claude-sonnet-4-20250514-v1:0",
		Messages: []anthropic.Message{
			{
				Role:    "user",
				Content: "Hello! Can you help me understand quantum computing?",
			},
		},
		MaxTokens: 1024,
	})

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Content)
}

php=:<?php
// PHP Example for Messages API via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/messages';

$data = [
  'model' => 'anthropic.claude-sonnet-4-20250514-v1:0',
  'messages' => [
    ['role' => 'user', 'content' => 'Hello! Can you help me understand quantum computing?']
  ],
  'max_tokens' => 1024
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'x-api-key: ' . $apiKey,
  'Content-Length: ' . strlen($jsonData)
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo $response;
} else {
  $responseData = json_decode($response, true);
  echo "Assistant: " . $responseData['content'][0]['text'] . "\n";
}
?>

```

## Response Format

```json
{
  "id": "msg_01xyzabcdef",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Quantum computing is a fascinating field that uses principles of quantum mechanics to process information in ways that classical computers cannot. Instead of using bits that are either 0 or 1, quantum computers use quantum bits or 'qubits' that can exist in multiple states simultaneously due to a quantum property called superposition..."
    }
  ],
  "model": "anthropic.claude-sonnet-4-20250514-v1:0",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 15,
    "output_tokens": 75
  }
}
```

## Response Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | A unique identifier for the message. |
| `type` | string | The object type, which is always "message". |
| `role` | string | The role of the message author, which is "assistant" for responses. |
| `content` | array | An array of content blocks, typically containing text. |
| `model` | string | The model used for the message generation. |
| `stop_reason` | string | The reason why the model stopped generating tokens. Can be "end_turn", "max_tokens", "stop_sequence", or other values. |
| `stop_sequence` | string or null | If the model stopped because it produced a stop sequence, this field contains that sequence. Otherwise null. |
| `usage` | object | An object containing token usage information. |

### Content Block

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `type` | string | The type of content block. Currently "text" or "image". |
| `text` | string | The text content if the type is "text". |

### Usage Object

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `input_tokens` | integer | The number of tokens used in the input. |
| `output_tokens` | integer | The number of tokens used in the output. |

## Streaming

To receive incremental model responses, set `stream: true` in your request:

```javascript
const stream = await client.messages.create({
  model: "anthropic.claude-sonnet-4-20250514-v1:0",
  messages: [
    { role: "user", content: "Write a story about a quantum computer." },
  ],
  stream: true,
  max_tokens: 1024,
});

for await (const chunk of stream) {
  if (
    chunk.type === "content_block_delta" &&
    chunk.delta.type === "text_delta"
  ) {
    process.stdout.write(chunk.delta.text || "");
  }
}
```

## Error Handling

The API may return various error codes:

| Status Code | Description |
| ----------- | ----------- |
| 400 | Bad Request - Your request is invalid. |
| 401 | Unauthorized - Your API key is wrong. |
| 403 | Forbidden - You don't have permission to access this resource. |
| 404 | Not Found - The specified resource could not be found. |
| 429 | Too Many Requests - You have exceeded your rate limit. |
| 500 | Internal Server Error - We had a problem with our server. |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Multi-provider Support

As of June 2025, the AvalAI platform supports using the Anthropic Messages API format to access models from multiple providers, including:

- Anthropic (Claude models)
- OpenAI
- AWS Bedrock
- Vertex AI
- Gemini
- MiniMax (including `minimax-m3` with full support for native thinking blocks and tool use)

This unified API approach allows you to use the same code structure to access models from different providers while maintaining compatibility with Anthropic's client libraries.

## Related Resources

- [Anthropic Models](en/providers/anthropic.md) - Learn about available Anthropic models
- [Chat Completions](en/api-reference/chat.md) - OpenAI-compatible chat completions API
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits