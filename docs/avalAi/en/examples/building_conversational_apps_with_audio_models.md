
# Building Conversational Apps with Audio Models

This guide demonstrates how to build conversational applications using OpenAI's GPT Audio models (`gpt-audio-1.5`, `gpt-audio`, and `gpt-audio-mini`). These models support both text and audio inputs/outputs, enabling you to create voice-based interactive applications.

## Overview

GPT Audio models provide:
- **Multimodal Input/Output**: Process and generate both text and audio
- **Native Audio Processing**: No need for separate transcription/TTS pipelines
- **Function Calling**: Integrate with tools and external APIs
- **Multiple Voice Options**: Choose from 6 different voice personalities
- **Flexible Audio Formats**: Support for mp3, wav, pcm16, opus, aac, and flac

### Available Models

| Model | Description | Use Case |
|-------|-------------|----------|
| `gpt-audio-1.5` | Best quality voice model with 256K context | Premium applications, professional voice assistants |
| `gpt-audio` | High-quality balanced model | General conversational applications |
| `gpt-audio-mini` | Cost-effective lightweight model | High-volume, budget-conscious applications |

## Basic Audio Generation

The simplest use case is generating audio responses from text input:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {
        "role": "user",
        "content": "Tell me a short story about a robot learning to paint."
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "nova"
    }
  }'

python=:from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

response = client.chat.completions.create(
    model="gpt-audio",
    messages=[
        {
            "role": "user",
            "content": "Tell me a short story about a robot learning to paint.",
        }
    ],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)

# Save the audio to a file
audio_data = response.choices[0].message.audio.data
transcript = response.choices[0].message.audio.transcript

# Decode base64 and save
audio_bytes = base64.b64decode(audio_data)
with open("story.mp3", "wb") as f:
    f.write(audio_bytes)

print(f"Audio saved to story.mp3")
print(f"Transcript: {transcript}")

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
    model: "gpt-audio",
    messages: [
        {
            role: "user",
            content: "Tell me a short story about a robot learning to paint.",
        },
    ],
    modalities: ["text", "audio"],
    audio: {
        format: "mp3",
        voice: "nova",
    },
});

// Save the audio to a file
const audioData = response.choices[0].message.audio.data;
const transcript = response.choices[0].message.audio.transcript;

// Decode base64 and save
const audioBuffer = Buffer.from(audioData, "base64");
fs.writeFileSync("story.mp3", audioBuffer);

console.log("Audio saved to story.mp3");
console.log(`Transcript: ${transcript}`);

go=:package main

import (
	"context"
	"encoding/base64"
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
			openai.UserMessage("Tell me a short story about a robot learning to paint."),
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

	// Decode base64 audio
	audioData, err := base64.StdEncoding.DecodeString(completion.Choices[0].Message.Audio.Data)
	if err != nil {
		panic(err)
	}

	// Save to file
	err = os.WriteFile("story.mp3", audioData, 0644)
	if err != nil {
		panic(err)
	}

	fmt.Println("Audio saved to story.mp3")
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
            'content' => 'Tell me a short story about a robot learning to paint.',
        ],
    ],
    'modalities' => ['text', 'audio'],
    'audio' => [
        'format' => 'mp3',
        'voice' => 'nova',
    ],
]);

// Save the audio to a file
$audioData = $response['choices'][0]['message']['audio']['data'];
$transcript = $response['choices'][0]['message']['audio']['transcript'];

// Decode base64 and save
$audioBytes = base64_decode($audioData);
file_put_contents('story.mp3', $audioBytes);

echo "Audio saved to story.mp3\n";
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
    input="Tell me a short story about a robot learning to paint.",
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
  input: "Tell me a short story about a robot learning to paint.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-audio",
    "input": "Tell me a short story about a robot learning to paint.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Multi-Turn Conversational Interface

Build a complete conversational interface with conversation history:

```language-selector
bash=:# First message
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {"role": "user", "content": "Hello! What can you help me with?"}
    ],
    "modalities": ["text", "audio"],
    "audio": {"format": "mp3", "voice": "alloy"}
  }'

# Follow-up message with history
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {"role": "user", "content": "Hello! What can you help me with?"},
      {"role": "assistant", "content": "Hello! I can help you with..."},
      {"role": "user", "content": "Tell me more about that first option."}
    ],
    "modalities": ["text", "audio"],
    "audio": {"format": "mp3", "voice": "alloy"}
  }'

python=:from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

# Conversation history
messages = []


def chat(user_message):
    """Send a message and get audio response"""
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-audio",
        messages=messages,
        modalities=["text", "audio"],
        audio={"format": "mp3", "voice": "alloy"},
    )

    assistant_message = response.choices[0].message
    audio_data = assistant_message.audio.data
    transcript = assistant_message.audio.transcript

    # Add assistant response to history
    messages.append({"role": "assistant", "content": transcript})

    return audio_data, transcript


# Example conversation
audio1, text1 = chat("Hello! What can you help me with?")
print(f"Assistant: {text1}")

audio2, text2 = chat("Tell me more about that first option.")
print(f"Assistant: {text2}")

# Save last audio
audio_bytes = base64.b64decode(audio2)
with open("response.mp3", "wb") as f:
    f.write(audio_bytes)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Conversation history
const messages = [];

async function chat(userMessage) {
    // Add user message
    messages.push({ role: "user", content: userMessage });
    
    const response = await client.chat.completions.create({
        model: "gpt-audio",
        messages: messages,
        modalities: ["text", "audio"],
        audio: { format: "mp3", voice: "alloy" },
    });
    
    const assistantMessage = response.choices[0].message;
    const audioData = assistantMessage.audio.data;
    const transcript = assistantMessage.audio.transcript;
    
    // Add assistant response to history
    messages.push({ role: "assistant", content: transcript });
    
    return { audioData, transcript };
}

// Example conversation
const response1 = await chat("Hello! What can you help me with?");
console.log(`Assistant: ${response1.transcript}`);

const response2 = await chat("Tell me more about that first option.");
console.log(`Assistant: ${response2.transcript}`);

go=:package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

type ConversationManager struct {
	client   *openai.Client
	messages []openai.ChatCompletionMessageParamUnion
}

func NewConversationManager() *ConversationManager {
	return &ConversationManager{
		client: openai.NewClient(
			option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
			option.WithBaseURL("https://api.avalai.ir/v1"),
		),
		messages: make([]openai.ChatCompletionMessageParamUnion, 0),
	}
}

func (cm *ConversationManager) Chat(userMessage string) (string, string, error) {
	// Add user message
	cm.messages = append(cm.messages, openai.UserMessage(userMessage))

	completion, err := cm.client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:    openai.F("gpt-audio"),
		Messages: openai.F(cm.messages),
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
		return "", "", err
	}

	audioData := completion.Choices[0].Message.Audio.Data
	transcript := completion.Choices[0].Message.Audio.Transcript

	// Add assistant response to history
	cm.messages = append(cm.messages, openai.AssistantMessage(transcript))

	return audioData, transcript, nil
}

func main() {
	cm := NewConversationManager()

	_, text1, _ := cm.Chat("Hello! What can you help me with?")
	fmt.Printf("Assistant: %s\n", text1)

	_, text2, _ := cm.Chat("Tell me more about that first option.")
	fmt.Printf("Assistant: %s\n", text2)
}

php=:<?php

require 'vendor/autoload.php';

use OpenAI\Client;

class ConversationManager {
    private $client;
    private $messages = [];
    
    public function __construct() {
        $this->client = OpenAI::factory()
            ->withApiKey(getenv('AVALAI_API_KEY'))
            ->withBaseUri('https://api.avalai.ir/v1')
            ->make();
    }
    
    public function chat($userMessage) {
        // Add user message
        $this->messages[] = [
            'role' => 'user',
            'content' => $userMessage
        ];
        
        $response = $this->client->chat()->create([
            'model' => 'gpt-audio',
            'messages' => $this->messages,
            'modalities' => ['text', 'audio'],
            'audio' => [
                'format' => 'mp3',
                'voice' => 'alloy'
            ]
        ]);
        
        $audioData = $response['choices'][0]['message']['audio']['data'];
        $transcript = $response['choices'][0]['message']['audio']['transcript'];
        
        // Add assistant response to history
        $this->messages[] = [
            'role' => 'assistant',
            'content' => $transcript
        ];
        
        return ['audioData' => $audioData, 'transcript' => $transcript];
    }
}

$conversation = new ConversationManager();

$response1 = $conversation->chat("Hello! What can you help me with?");
echo "Assistant: " . $response1['transcript'] . "\n";

$response2 = $conversation->chat("Tell me more about that first option.");
echo "Assistant: " . $response2['transcript'] . "\n";

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
    input="Hello! What can you help me with?",
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
  input: "Hello! What can you help me with?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-audio",
    "input": "Hello! What can you help me with?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Using Different Voice Options

The audio models support 6 different voice personalities:

```language-selector
bash=:# Try different voices
for voice in alloy echo fable onyx nova shimmer; do
  curl https://api.avalai.ir/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AVALAI_API_KEY" \
    -d "{
      \"model\": \"gpt-audio-mini\",
      \"messages\": [{\"role\": \"user\", \"content\": \"Hello, this is the $voice voice.\"}],
      \"modalities\": [\"text\", \"audio\"],
      \"audio\": {\"format\": \"mp3\", \"voice\": \"$voice\"}
    }" >"${voice}_sample.json"
done

python=:from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

for voice in voices:
    response = client.chat.completions.create(
        model="gpt-audio-mini",
        messages=[{"role": "user", "content": f"Hello, this is the {voice} voice."}],
        modalities=["text", "audio"],
        audio={"format": "mp3", "voice": voice},
    )

    # Save each voice sample
    audio_data = response.choices[0].message.audio.data
    audio_bytes = base64.b64decode(audio_data)

    with open(f"{voice}_sample.mp3", "wb") as f:
        f.write(audio_bytes)

    print(f"Saved {voice}_sample.mp3")

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

for (const voice of voices) {
    const response = await client.chat.completions.create({
        model: "gpt-audio-mini",
        messages: [
            { role: "user", content: `Hello, this is the ${voice} voice.` },
        ],
        modalities: ["text", "audio"],
        audio: { format: "mp3", voice: voice },
    });
    
    // Save each voice sample
    const audioData = response.choices[0].message.audio.data;
    const audioBuffer = Buffer.from(audioData, "base64");
    
    fs.writeFileSync(`${voice}_sample.mp3`, audioBuffer);
    console.log(`Saved ${voice}_sample.mp3`);
}

go=:package main

import (
	"context"
	"encoding/base64"
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

	voices := []openai.ChatCompletionAudioVoice{
		openai.ChatCompletionAudioVoiceAlloy,
		openai.ChatCompletionAudioVoiceEcho,
		openai.ChatCompletionAudioVoiceFable,
		openai.ChatCompletionAudioVoiceOnyx,
		openai.ChatCompletionAudioVoiceNova,
		openai.ChatCompletionAudioVoiceShimmer,
	}

	for _, voice := range voices {
		completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
			Model: openai.F("gpt-audio-mini"),
			Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
				openai.UserMessage(fmt.Sprintf("Hello, this is the %s voice.", voice)),
			}),
			Modalities: openai.F([]openai.ChatCompletionModality{
				openai.ChatCompletionModalityText,
				openai.ChatCompletionModalityAudio,
			}),
			Audio: openai.F(openai.ChatCompletionAudioParam{
				Format: openai.F(openai.ChatCompletionAudioFormatMp3),
				Voice:  openai.F(voice),
			}),
		})

		if err != nil {
			panic(err)
		}

		audioData, _ := base64.StdEncoding.DecodeString(completion.Choices[0].Message.Audio.Data)
		filename := fmt.Sprintf("%s_sample.mp3", voice)
		os.WriteFile(filename, audioData, 0644)
		fmt.Printf("Saved %s\n", filename)
	}
}

php=:<?php

require 'vendor/autoload.php';

use OpenAI\Client;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

foreach ($voices as $voice) {
    $response = $client->chat()->create([
        'model' => 'gpt-audio-mini',
        'messages' => [
            [
                'role' => 'user',
                'content' => "Hello, this is the $voice voice."
            ]
        ],
        'modalities' => ['text', 'audio'],
        'audio' => [
            'format' => 'mp3',
            'voice' => $voice
        ]
    ]);
    
    // Save each voice sample
    $audioData = $response['choices'][0]['message']['audio']['data'];
    $audioBytes = base64_decode($audioData);
    
    file_put_contents("{$voice}_sample.mp3", $audioBytes);
    echo "Saved {$voice}_sample.mp3\n";
}

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
    model="gpt-audio-mini",
    input="Summarize the audio input.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-audio-mini",
  instructions: "You are a helpful assistant.",
  input: "Summarize the audio input.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-audio-mini",
    "input": "Summarize the audio input.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Premium Audio with gpt-audio-1.5

For the highest quality audio output, use `gpt-audio-1.5` - OpenAI's best voice model with 256K context window:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio-1.5",
    "messages": [
      {"role": "user", "content": "Narrate a professional audiobook introduction for a science fiction novel."}
    ],
    "modalities": ["text", "audio"],
    "audio": {"format": "mp3", "voice": "onyx"}
  }'

python=:from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

# Use gpt-audio-1.5 for premium quality
response = client.chat.completions.create(
    model="gpt-audio-1.5",  # Best quality voice model
    messages=[
        {
            "role": "user",
            "content": "Narrate a professional audiobook introduction for a science fiction novel.",
        }
    ],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "onyx"},
)

# Save the premium audio
audio_data = response.choices[0].message.audio.data
transcript = response.choices[0].message.audio.transcript

audio_bytes = base64.b64decode(audio_data)
with open("premium_narration.mp3", "wb") as f:
    f.write(audio_bytes)

print("Premium audio saved to premium_narration.mp3")
print(f"Transcript: {transcript}")

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Use gpt-audio-1.5 for premium quality
const response = await client.chat.completions.create({
    model: "gpt-audio-1.5", // Best quality voice model
    messages: [
        {
            role: "user",
            content: "Narrate a professional audiobook introduction for a science fiction novel.",
        },
    ],
    modalities: ["text", "audio"],
    audio: {
        format: "mp3",
        voice: "onyx",
    },
});

// Save the premium audio
const audioData = response.choices[0].message.audio.data;
const transcript = response.choices[0].message.audio.transcript;

const audioBuffer = Buffer.from(audioData, "base64");
fs.writeFileSync("premium_narration.mp3", audioBuffer);

console.log("Premium audio saved to premium_narration.mp3");
console.log(`Transcript: ${transcript}`);

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-audio-1.5` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Narrate a professional audiobook introduction for a science fiction novel.",
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
  input: "Narrate a professional audiobook introduction for a science fiction novel.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Narrate a professional audiobook introduction for a science fiction novel.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Cost Optimization with gpt-audio-mini

For high-volume applications, use `gpt-audio-mini` which offers similar quality at a fraction of the cost:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio-mini",
    "messages": [
      {"role": "user", "content": "Quick weather update for today"}
    ],
    "modalities": ["text", "audio"],
    "audio": {"format": "mp3", "voice": "alloy"}
  }'

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

# Use gpt-audio-mini for cost-effective processing
response = client.chat.completions.create(
    model="gpt-audio-mini",  # 4x cheaper than gpt-audio
    messages=[{"role": "user", "content": "Quick weather update for today"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "alloy"},
)

# Check the cost
usage = response.usage
estimated_cost = response.estimated_cost

print(f"Tokens used: {usage.total_tokens}")
print(f"Audio tokens: {usage.completion_tokens_details.audio_tokens}")
print(f"Estimated cost: ${estimated_cost.unit}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Use gpt-audio-mini for cost-effective processing
const response = await client.chat.completions.create({
    model: "gpt-audio-mini", // 4x cheaper than gpt-audio
    messages: [
user", content: "Summarize the following text in a friendly tone..." }
    ],
    modalities: ["text", "audio"],
    audio: {
        format: "mp3",
        voice: "nova"
    }
});

// Check the cost
console.log(`Tokens used: ${response.usage.total_tokens}`);
console.log(`Audio tokens: ${response.usage.completion_tokens_details.audio_tokens}`);
console.log(`Estimated cost: $${response.estimated_cost.unit}`);

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
    model="gpt-audio-mini",
    input="Quick weather update for today",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-audio-mini",
  instructions: "You are a helpful assistant.",
  input: "Quick weather update for today",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-audio-mini",
    "input": "Quick weather update for today",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### When to Use Each Model

**Use `gpt-audio-1.5` for:**
- Premium voice applications requiring the best quality
- Professional audiobook narration and podcasts
- Long-context conversations (256K tokens)
- Enterprise voice assistants
- Applications where voice naturalness is paramount

**Use `gpt-audio` for:**
- High-quality conversational experiences
- Professional applications (customer service, education)
- Complex reasoning with audio responses
- Applications where audio quality is critical

**Use `gpt-audio-mini` for:**
- High-volume applications
- Development and testing
- Simple audio responses
- Cost-sensitive deployments

## Function Calling with Audio Models

Audio models fully support function calling, allowing you to build interactive voice assistants that can execute actions:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-audio",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in San Francisco?"
      }
    ],
    "modalities": ["text", "audio"],
    "audio": {
      "format": "mp3",
      "voice": "alloy"
    },
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get the current weather for a location",
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
    ]
  }'

python=:from openai import OpenAI
import json
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)


# Define the weather function
def get_weather(location):
    # Simulate weather API call
    return {"location": location, "temperature": "72°F", "condition": "Sunny"}


# First API call
response = client.chat.completions.create(
    model="gpt-audio",
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "alloy"},
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather for a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "City name"}
                    },
                    "required": ["location"],
                },
            },
        }
    ],
)

# Check if the model wants to call a function
message = response.choices[0].message
if message.tool_calls:
    # Execute the function
    tool_call = message.tool_calls[0]
    function_args = json.loads(tool_call.function.arguments)
    function_result = get_weather(**function_args)

    # Send function result back to the model
    second_response = client.chat.completions.create(
        model="gpt-audio",
        messages=[
            {"role": "user", "content": "What's the weather like in San Francisco?"},
            message,
            {
                "role": "tool",
                "content": json.dumps(function_result),
                "tool_call_id": tool_call.id,
            },
        ],
        modalities=["text", "audio"],
        audio={"format": "mp3", "voice": "alloy"},
    )

    # Get the audio response
    audio_data = second_response.choices[0].message.audio.data
    with open("weather_response.mp3", "wb") as f:
        f.write(base64.b64decode(audio_data))

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Define the weather function
function getWeather(location) {
    // Simulate weather API call
    return {
        location: location,
        temperature: "72°F",
        condition: "Sunny"
    };
}

async function voiceAssistantWithTools() {
    // First API call
    const response = await client.chat.completions.create({
        model: "gpt-audio",
        messages: [
            { role: "user", content: "What's the weather like in San Francisco?" }
        ],
        modalities: ["text", "audio"],
        audio: {
            format: "mp3",
            voice: "alloy"
        },
        tools: [
            {
                type: "function",
                function: {
                    name: "get_weather",
                    description: "Get the current weather for a location",
                    parameters: {
                        type: "object",
                        properties: {
                            location: { type: "string", description: "City name" }
                        },
                        required: ["location"]
                    }
                }
            }
        ]
    });

    const message = response.choices[0].message;
    
    // Check if the model wants to call a function
    if (message.tool_calls) {
        const toolCall = message.tool_calls[0];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResult = getWeather(functionArgs.location);
        
        // Send function result back to the model
        const secondResponse = await client.chat.completions.create({
            model: "gpt-audio",
            messages: [
                { role: "user", content: "What's the weather like in San Francisco?" },
                message,
                {
                    role: "tool",
                    content: JSON.stringify(functionResult),
                    tool_call_id: toolCall.id
                }
            ],
            modalities: ["text", "audio"],
            audio: {
                format: "mp3",
                voice: "alloy"
            }
        });
        
        // Save the audio response
        const audioData = secondResponse.choices[0].message.audio.data;
        const fs = require('fs');
        fs.writeFileSync("weather_response.mp3", Buffer.from(audioData, 'base64'));
    }
}

voiceAssistantWithTools();

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
    model="gpt-audio",
    input="What is the weather like in San Francisco?",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    name: "get_current_weather",
    description: "Get the current weather in a given location.",
    parameters: {
      type: "object",
      properties: { location: { type: "string" } },
      required: ["location"],
      additionalProperties: false,
    },
  },
];

const response = await client.responses.create({
  model: "gpt-audio",
  input: "What is the weather like in San Francisco?",
  tools,
});

for (const item of response.output) {
  if (item.type === "function_call") {
    console.log(item.name, item.arguments);
  }
}
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-audio",
    "input": "What is the weather like in San Francisco?",
    "tools": [
      {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string"
            }
          },
          "required": [
            "location"
          ],
          "additionalProperties": false
        }
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Best Practices

### 1. Audio Format Selection

Choose the right audio format for your use case:

- **mp3**: Best for web applications, good compression
- **wav**: Uncompressed, best quality but larger files
- **opus**: Excellent for streaming, low latency
- **pcm16**: Raw audio, useful for further processing
- **aac**: Good balance of quality and size
- **flac**: Lossless compression

### 2. Voice Selection Strategy

Match voices to your application's personality:

- **alloy**: Neutral, professional
- **echo**: Warm, friendly
- **fable**: Expressive, storytelling
- **onyx**: Deep, authoritative
- **nova**: Bright, energetic
- **shimmer**: Soft, gentle

Test different voices with your content to find the best fit.

### 3. Cost Optimization

Strategies to reduce costs:

1. **Use `gpt-audio-mini` for simple tasks**: Save up to 4x on costs
2. **Minimize audio output**: Text responses are cheaper
3. **Enable prompt caching**: Reuse common context
4. **Batch similar requests**: Reduce per-request overhead
5. **Use text-only when appropriate**: Only generate audio when needed

### 4. Error Handling

Always implement proper error handling:

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

try:
    response = client.chat.completions.create(
        model="gpt-audio",
        messages=[{"role": "user", "content": "Hello!"}],
        modalities=["text", "audio"],
        audio={"format": "mp3", "voice": "nova"},
    )
except Exception as e:
    print(f"Error: {e}")
    # Fallback to text-only or retry
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
    model="gpt-audio",
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


### 5. Conversation Management

For multi-turn conversations:

- **Maintain conversation history**: Include previous messages
- **Limit context length**: Summarize old messages to stay within token limits
- **Track audio state**: Know which messages had audio responses
- **Handle interruptions**: Allow users to interrupt long responses

## Troubleshooting

### Common Issues and Solutions

**Issue: Audio not generating**
- Verify `modalities` includes `"audio"`
- Check `audio` object is properly configured
- Ensure voice name is valid

**Issue: Large file sizes**
- Switch to more compressed formats (opus, aac)
- Use `gpt-audio-mini` for shorter responses
- Consider streaming for real-time applications

**Issue: High costs**
- Use `gpt-audio-mini` instead of `gpt-audio`
- Generate audio only when necessary
- Enable prompt caching for repeated context

**Issue: Latency**
- Use opus format for streaming
- Consider `gpt-audio-mini` for faster responses
- Implement client-side buffering

## Audio Input Support

Audio models can also accept audio input, enabling true voice-to-voice conversations:

```python
from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

# Read audio file
with open("user_audio.mp3", "rb") as f:
    audio_data = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="gpt-audio",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_audio",
                    "input_audio": {"data": audio_data, "format": "mp3"},
                }
            ],
        }
    ],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "nova"},
)

# Process response with audio
if response.choices[0].message.audio:
    output_audio = response.choices[0].message.audio.data
    with open("response_audio.mp3", "wb") as f:
        f.write(base64.b64decode(output_audio))
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
    model="gpt-audio",
    input="Summarize the audio input.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Related Resources

- [OpenAI Models Documentation](en/providers/openai.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [Pricing Information](en/pricing.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Streaming Responses Guide](en/guides/streaming-responses.md)

## Summary

GPT Audio models enable powerful voice-based applications with:

- Native audio input and output support
- Multiple voice personalities
- Full function calling capabilities
- Flexible audio format options
- Cost-effective variants for different use cases

Start with `gpt-audio-mini` for development and testing, then upgrade to `gpt-audio` for production applications requiring the highest quality.