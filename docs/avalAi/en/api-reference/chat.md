# Chat Completions API

The Chat Completions API is the core of the AvalAI platform, allowing you to generate conversational responses from various AI models, including the latest OpenAI GPT-5.5 series (GPT-5.5, GPT-5.4, GPT-5.4 mini, GPT-5.4 nano), XAI Grok 4.3, Z.AI GLM-5.2, Moonshot Kimi K2.7 Code, Google Gemini 3.5, Gemma 4, Alibaba Qwen3.7-Max and Qwen3.7-Plus, Cloudflare Nemotron-3-120B, Fireworks.ai Nemotron-3-Ultra, and MiniMax M3 models.

## Endpoint

```
POST https://api.avalai.ir/v1/chat/completions
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


## Request Body

| Parameter           | Type             | Required | Description                                                                                                                                           |
| ------------------- | ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model`             | string           | Yes      | ID of the model to use. See [Models](en/models/model-details.md) for available options.                                                                       |
| `messages`          | array            | Yes      | Array of message objects representing the conversation history.                                                                                       |
| `temperature`       | number           | No       | Sampling temperature between 0 and 2. Higher values like 0.8 make output more random, while lower values like 0.2 make it more focused. Default is 1. |
| `top_p`             | number           | No       | Alternative to temperature, nucleus sampling. Default is 1.                                                                                           |
| `n`                 | integer          | No       | Number of chat completion choices to generate. Default is 1.                                                                                          |
| `stream`            | boolean          | No       | If set to true, partial message deltas will be sent. Default is false.                                                                                |
| `stop`              | string or array  | No       | Up to 4 sequences where the API will stop generating further tokens.                                                                                  |
| `max_tokens`        | integer          | No       | Maximum number of tokens to generate. Default varies by model.                                                                                        |
| `presence_penalty`  | number           | No       | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far. Default is 0.                       |
| `frequency_penalty` | number           | No       | Number between -2.0 and 2.0. Positive values penalize new tokens based on their frequency in the text so far. Default is 0.                           |
| `logit_bias`        | object           | No       | Modify the likelihood of specified tokens appearing in the completion.                                                                                |
| `user`              | string           | No       | A unique identifier representing your end-user.                                                                                                       |
| `response_format`   | object           | No       | An object specifying the format that the model must output.                                                                                           |
| `seed`              | integer          | No       | If specified, system will make a best effort to sample deterministically.                                                                             |
| `tools`             | array            | No       | A list of tools the model may call.                                                                                                                   |
| `tool_choice`       | string or object | No       | Controls which (if any) tool is called by the model.                                                                                                  |
| `service_tier`      | string           | No       | The service tier to use for this request. Either `"default"` (default) or `"flex"`. Flex tier offers 50% reduced pricing for select OpenAI models but has higher latency and may time out (up to 900s). See [Pricing](en/pricing.md#flex-service-tier) for supported models and important considerations. |

### Message Object

Each message in the `messages` array should have the following structure:

| Parameter      | Type            | Required | Description                                                                                            |
| -------------- | --------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `role`         | string          | Yes      | The role of the message author. One of: `system`, `user`, `assistant`, or `tool`.                      |
| `content`      | string or array | Yes      | The content of the message. Can be a string or an array of content parts when using multimodal inputs. |
| `name`         | string          | No       | The name of the author of this message. Required for `tool` roles.                                     |
| `tool_call_id` | string          | No       | Required for `tool` role messages. The ID of the tool call that this message is responding to.         |

## Examples

### Basic Chat Completion

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": "Hello!"
  }
  ]
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "Hello!",
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content) // Corrected access to response content
}

php=:<?php
// PHP Example for Chat Completion via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

$data = [
'model' => 'gpt-5.5',
'messages' => [
['role' => 'system', 'content' => 'You are a helpful assistant.'],
['role' => 'user', 'content' => 'Hello!']
]
// Add other parameters like temperature, max_tokens etc. if needed
// 'temperature' => 0.7,
// 'max_tokens' => 150
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
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
  if (isset($responseData['choices'][0]['message']['content'])) {
    echo "Assistant: " . $responseData['choices'][0]['message']['content'] . "\n";
  } else {
    echo "Response received:\n";
    print_r($responseData);
  }
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


## Response Format

```json
{
  "id": "chatcmpl-123abc",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-5.5",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "service_tier": "default"
}
```

## Response Parameters

| Parameter      | Type    | Description                                                              |
| -------------- | ------- | ------------------------------------------------------------------------ |
| `id`           | string  | A unique identifier for the chat completion.                             |
| `object`       | string  | The object type, which is always "chat.completion".                      |
| `created`      | integer | The Unix timestamp (in seconds) of when the chat completion was created. |
| `model`        | string  | The model used for the chat completion.                                  |
| `choices`      | array   | An array of chat completion choices.                                     |
| `usage`        | object  | An object containing token usage information.                            |
| `service_tier` | string  | The service tier used for this request. Either `"default"` or `"flex"`. |

### Choice Object

| Parameter       | Type    | Description                                                                                                                      |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `message`       | object  | A message object containing the response content.                                                                                |
| `finish_reason` | string  | The reason why the model stopped generating tokens. Can be "stop", "length", "tool_calls", "content_filter", or "function_call". |
| `index`         | integer | The index of the choice in the array.                                                                                            |

### Usage Object

| Parameter           | Type    | Description                                            |
| ------------------- | ------- | ------------------------------------------------------ |
| `prompt_tokens`     | integer | The number of tokens used in the prompt.               |
| `completion_tokens` | integer | The number of tokens used in the completion.           |
| `total_tokens`      | integer | The total number of tokens used (prompt + completion). |

## Streaming

To receive incremental model responses, set `stream: true` in your request:

```javascript
const stream = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [{ role: "user", content: "Write a long story about a dog." }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
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
    input="Write a long story about a dog.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Function Calling / Tool Use

You can specify tools that the model can call:

```javascript
const response = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The temperature unit",
            },
          },
          required: ["location"],
        },
      },
    },
  ],
});
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
    input="What",
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


## Audio Input and Output

OpenAI's audio models (`gpt-audio` and `gpt-audio-mini`) support both audio and text inputs/outputs through the Chat Completions API. These models enable voice-based conversational applications with native audio processing capabilities.

### Audio Parameters

When using audio models, you can specify additional parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modalities` | array | No | Specifies output modalities. Use `["text", "audio"]` for audio output. For image generation models such as `gemini-3-pro-image`, `gemini-3.1-flash-image`, and `gemini-2.5-flash-image`, use `["image", "text"]`. Default is `["text"]`. |
| `audio` | object | No | Audio output configuration. Required when requesting audio output. |

### Audio Configuration Object

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | No | Audio output format. Options: `mp3`, `wav`, `pcm16`, `opus`, `aac`, `flac`. Default is `mp3`. |
| `voice` | string | No | Voice to use for audio output. Options: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`. Default is `alloy`. |

### Basic Audio Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "nova"
    }
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-audio",
    messages=[
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)

# Access the audio data and transcript
audio_data = response.choices[0].message.audio.data  # Base64 encoded audio
transcript = response.choices[0].message.audio.transcript  # Text transcript

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
    model: "gpt-audio",
    messages: [
        {
            role: "user",
            content: "Explain quantum computing in simple terms.",
        },
    ],
    modalities: ["text", "audio"],
    audio: {
        format: "mp3",
        voice: "nova",
    },
});

// Access the audio data and transcript
const audioData = response.choices[0].message.audio.data;
const transcript = response.choices[0].message.audio.transcript;

go=:package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"),
	)

	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: openai.F("gpt-audio"),
		Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
			openai.UserMessage("Explain quantum computing in simple terms."),
		}),
		Modalities: openai.F([]openai.ChatCompletionModality{
			openai.ChatCompletionModalityText,
			openai.ChatCompletionModalityAudio,
		}),
		Audio: openai.F(openai.ChatCompletionAudioParam{
			Format: openai.F(openai.ChatCompletionAudioFormatMp3),
			Voice:  openai.F(openai.ChatCompletionAudioVoiceNova),
		}),
	})

	if err != nil {
		panic(err)
	}

	fmt.Printf("Audio Data: %s\n", completion.Choices[0].Message.Audio.Data)
	fmt.Printf("Transcript: %s\n", completion.Choices[0].Message.Audio.Transcript)
}

php=:<?php

require 'vendor/autoload.php';

use OpenAI\Client;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$response = $client->chat()->create([
    'model' => 'gpt-audio',
    'messages' => [
        [
            'role' => 'user',
            'content' => 'Explain quantum computing in simple terms.',
        ],
    ],
    'modalities' => ['text', 'audio'],
    'audio' => [
        'format' => 'mp3',
        'voice' => 'nova',
    ],
]);

$audioData = $response['choices'][0]['message']['audio']['data'];
$transcript = $response['choices'][0]['message']['audio']['transcript'];

echo "Transcript: " . $transcript . "\n";

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
    model="gpt-audio",
    input="Explain quantum computing in simple terms.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-audio",
  instructions: "You are a helpful assistant.",
  input: "Explain quantum computing in simple terms.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-audio",
    "input": "Explain quantum computing in simple terms.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Audio Response Format

When using audio models with the `audio` modality, the response includes an `audio` object in the message:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1763042146,
  "model": "gpt-audio-2025-08-28",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "audio": {
          "id": "audio_abc123",
          "data": "SUQzBAAAAA...", // Base64 encoded audio

          "expires_at": 1763045747,
          "transcript": "Quantum computing is a revolutionary technology..."
        }
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 75,
    "total_tokens": 87,
    "completion_tokens_details": {
      "audio_tokens": 58,
      "text_tokens": 17
    },
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "text_tokens": 12
    }
  }
}
```

### Using gpt-audio-1.5 for Premium Audio Quality

For the highest quality voice synthesis and audio understanding, use `gpt-audio-1.5`:

```python
response = client.chat.completions.create(
    model="gpt-audio-1.5",  # Best voice model with 256K context
    messages=[{"role": "user", "content": "What's the weather like today?"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-audio-1.5` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Using gpt-audio-mini for Cost-Effective Processing

For high-volume applications, use `gpt-audio-mini` which offers the same capabilities at a lower cost:

```python
response = client.chat.completions.create(
    model="gpt-audio-mini",  # More cost-effective option
    messages=[{"role": "user", "content": "What's the weather like today?"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "alloy"},
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

response = client.responses.create(
    model="gpt-audio-mini",
    input="What",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Legacy Audio Models

For backwards compatibility, the following preview models are still available:
- `gpt-4o-audio-preview`
- `gpt-4o-mini-audio-preview`

> **Note:** Audio input (uploading audio files) is not yet supported in the Chat Completions API. For transcribing audio to text, use the [Transcriptions API](en/api-reference/transcriptions.md).


## Error Handling

The API may return various error codes:

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 400         | Bad Request - Your request is invalid.                         |
| 401         | Unauthorized - Your API key is wrong.                          |
| 403         | Forbidden - You don't have permission to access this resource. |
| 404         | Not Found - The specified resource could not be found.         |
| 429         | Too Many Requests - You have exceeded your rate limit.         |
| 500         | Internal Server Error - We had a problem with our server.      |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Related Resources

- [Models](en/models/model-details.md) - Learn about available models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits
