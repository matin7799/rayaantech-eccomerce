# OpenAI GPT Audio Models Now Available

**Date:** 2025-11-13

## Summary

OpenAI's first generally available audio models, `gpt-audio` and `gpt-audio-mini`, are now available on AvalAI. These models support both audio and text inputs and outputs through the Chat Completions API, enabling conversational applications with native audio capabilities. The models provide function calling support and offer flexible pricing for text and audio tokens.

---

## Details

### OpenAI Audio Models

We announce the availability of OpenAI's first production-ready audio models for voice and conversational AI applications.

- **[gpt-audio](en/providers/openai.md)**: OpenAI's flagship audio model with advanced conversational capabilities supporting both audio and text inputs/outputs
- **[gpt-audio-mini](en/providers/openai.md)**: A cost-efficient version of GPT Audio, ideal for high-volume audio processing applications

**Key Features:**

- **Multimodal Support**: Process and generate both text and audio in a single API call
- **Context Window**: 128,000 tokens for handling extensive conversations
- **Max Output**: 16,384 tokens for comprehensive responses
- **Function Calling**: Full support for tool use and function calling
- **Flexible Audio Formats**: Support for mp3, wav, pcm16, and other audio formats
- **Voice Selection**: Multiple voice options including alloy, echo, fable, onyx, nova, and shimmer
- **Endpoint Support**: Available on v1/chat/completions

**Pricing Details:**

| Model | Text Input | Cached Input | Text Output | Audio Input | Audio Output |
|-------|-----------|--------------|-------------|-------------|--------------|
| gpt-audio | $2.50/1M tokens | $1.25/1M tokens | $10.00/1M tokens | $32.00/1M tokens | $64.00/1M tokens |
| gpt-audio-mini | $0.60/1M tokens | $0.30/1M tokens | $2.40/1M tokens | $10.00/1M tokens | $20.00/1M tokens |

**Legacy Models:**

For backwards compatibility, the following preview models remain available:
- `gpt-4o-audio-preview`
- `gpt-4o-mini-audio-preview`

---

## API Request/Response Examples

### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {
        "role": "user",
        "content": "Hello! How can you help me today?"
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "alloy"
    }
  }'
```

### Example Response

```json
{
  "id": "chatcmpl-AaBbCcDdEeFfGg",
  "created": 1763042146,
  "model": "gpt-audio-2025-08-28",
  "object": "chat.completion",
  "system_fingerprint": "fp_abc123",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": null,
        "role": "assistant",
        "audio": {
          "id": "audio_abc123xyz",
          "data": "SUQzBAAAAA...[TRUNCATED - base64 encoded mp3 audio data]",
          "expires_at": 1763045747,
          "transcript": "Hello! I'm here to assist you with a wide range of tasks. I can help answer questions, provide information, offer creative ideas, assist with problem-solving, and much more. What would you like help with today?"
        },
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 75,
    "prompt_tokens": 12,
    "total_tokens": 87,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 58,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0,
      "text_tokens": 17
    },
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0,
      "text_tokens": 12,
      "image_tokens": 0
    }
  },
  "estimated_cost": {
    "unit": "0.0037200000",
    "irt": 422.64,
    "exchange_rate": 113650
  }
}
```

---

## SDK Usage Examples

### Basic Text and Audio Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {
        "role": "user",
        "content": "Tell me about artificial intelligence."
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "nova"
    }
  }'

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

completion = client.chat.completions.create(
    model="gpt-audio",
    messages=[{"role": "user", "content": "Tell me about artificial intelligence."}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)

# Access audio data
audio_data = completion.choices[0].message.audio.data
transcript = completion.choices[0].message.audio.transcript

print(f"Transcript: {transcript}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
    model: "gpt-audio",
    messages: [
        {
            role: "user",
            content: "Tell me about artificial intelligence.",
        },
    ],
    modalities: ["text", "audio"],
    audio: {
        format: "mp3",
        voice: "nova",
    },
});

// Access audio data
const audioData = completion.choices[0].message.audio.data;
const transcript = completion.choices[0].message.audio.transcript;

console.log(`Transcript: ${transcript}`);

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
			openai.UserMessage("Tell me about artificial intelligence."),
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
            'content' => 'Tell me about artificial intelligence.',
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

### Using gpt-audio-mini for Cost-Efficient Processing

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio-mini",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like today?"
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "alloy"
    }
  }'

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

completion = client.chat.completions.create(
    model="gpt-audio-mini",
    messages=[{"role": "user", "content": "What is the weather like today?"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "alloy"},
)

print(completion.choices[0].message.audio.transcript)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
    model: "gpt-audio-mini",
    messages: [
        {
            role: "user",
            content: "What is the weather like today?",
        },
    ],
    modalities: ["text", "audio"],
    audio: {
        format: "mp3",
        voice: "alloy",
    },
});

console.log(completion.choices[0].message.audio.transcript);

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
		Model: openai.F("gpt-audio-mini"),
		Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
			openai.UserMessage("What is the weather like today?"),
		}),
		Modalities: openai.F([]openai.ChatCompletionModality{
			openai.ChatCompletionModalityText,
			openai.ChatCompletionModalityAudio,
		}),
		Audio: openai.F(openai.ChatCompletionAudioParam{
			Format: openai.F(openai.ChatCompletionAudioFormatMp3),
			Voice:  openai.F(openai.ChatCompletionAudioVoiceAlloy),
		}),
	})

	if err != nil {
		panic(err)
	}

	fmt.Println(completion.Choices[0].Message.Audio.Transcript)
}

php=:<?php

require 'vendor/autoload.php';

use OpenAI\Client;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$response = $client->chat()->create([
    'model' => 'gpt-audio-mini',
    'messages' => [
        [
            'role' => 'user',
            'content' => 'What is the weather like today?',
        ],
    ],
    'modalities' => ['text', 'audio'],
    'audio' => [
        'format' => 'mp3',
        'voice' => 'alloy',
    ],
]);

echo $response['choices'][0]['message']['audio']['transcript'] . "\n";

```

### Function Calling with Audio Models

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather in San Francisco?"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get current weather information for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
              }
            },
            "required": ["location"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather information for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City name"}
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="gpt-audio",
    messages=[{"role": "user", "content": "What is the weather in San Francisco?"}],
    tools=tools,
    tool_choice="auto",
)

print(response.choices[0].message.tool_calls)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const tools = [
    {
        type: "function",
        function: {
            name: "get_weather",
            description: "Get current weather information for a location",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "City name"
                    }
                },
                required: ["location"]
            }
        }
    }
];

const response = await client.chat.completions.create({
    model: "gpt-audio",
    messages: [
        {
            role: "user",
            content: "What is the weather in San Francisco?"
        }
    ],
    tools: tools,
    tool_choice: "auto"
});

console.log(response.choices[0].message.tool_calls);

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
			openai.UserMessage("What is the weather in San Francisco?"),
		}),
		Tools: openai.F([]openai.ChatCompletionToolParam{
			{
				Type: openai.F(openai.ChatCompletionToolTypeFunction),
				Function: openai.F(openai.FunctionDefinitionParam{
					Name:        openai.String("get_weather"),
					Description: openai.String("Get current weather information for a location"),
					Parameters: openai.F(openai.FunctionParameters{
						"type": "object",
						"properties": map[string]interface{}{
							"location": map[string]interface{}{
								"type":        "string",
								"description": "City name",
							},
						},
						"required": []string{"location"},
					}),
				}),
			},
		}),
		ToolChoice: openai.F[openai.ChatCompletionToolChoiceOptionUnionParam](
			openai.ChatCompletionToolChoiceOptionAuto,
		),
	})

	if err != nil {
		panic(err)
	}

	fmt.Printf("%+v\n", completion.Choices[0].Message.ToolCalls)
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
            'content' => 'What is the weather in San Francisco?',
        ],
    ],
    'tools' => [
        [
            'type' => 'function',
            'function' => [
                'name' => 'get_weather',
                'description' => 'Get current weather information for a location',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'location' => [
                            'type' => 'description',
                            'description' => 'City name',
                        ],
                    ],
                    'required' => ['location'],
                ],
            ],
        ],
    ],
    'tool_choice' => 'auto',
]);

print_r($response['choices'][0]['message']['tool_calls']);

```

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [Building Conversational Apps with Audio Models Example](en/examples/building_conversational_apps_with_audio_models.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Pricing Documentation](en/pricing.md)