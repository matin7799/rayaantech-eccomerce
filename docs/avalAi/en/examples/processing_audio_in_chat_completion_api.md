# Processing Audio with AvalAI API

## Introduction

The AvalAI API provides powerful capabilities for processing audio files using advanced language models. This guide demonstrates how to leverage Gemini models through AvalAI's OpenAI Compatible API to transcribe, analyze, and extract information from audio files. These capabilities enable applications to understand spoken content, making them ideal for transcription services, content analysis, and automated audio processing workflows.

> **Note**: This guide focuses on audio input processing using the OpenAI-compatible API. For advanced audio output capabilities including text-to-speech (TTS) with multi-speaker support, see the [native v1beta API examples](#audio-output-text-to-speech-with-native-v1beta-api) section below.

## Key Features

- **Audio transcription** - Convert spoken content into accurate text
- **Content analysis** - Identify topics, sentiments, and key information from audio
- **Multi-language support** - Process audio in multiple languages
- **Question answering** - Ask questions about audio content and receive accurate answers
- **Unified API access** - Access multiple model providers through a consistent OpenAI-compatible interface

## Available Models

The following Gemini models support audio processing through the AvalAI API:

- **gemini-3.1-pro-preview** - Enhanced thinking and reasoning, multimodal understanding, advanced coding
- **gemini-3.5-flash** - Fast multimodal model with configurable thinking
- **gemini-2.5-pro** - Enhanced thinking and reasoning, multimodal understanding, advanced coding
- **gemini-2.5-flash** - Optimized for adaptive thinking and cost efficiency

Gemini models support the following audio format MIME types:

- WAV - `audio/wav`
- MP3 - `audio/mp3`
- AIFF - `audio/aiff`
- AAC - `audio/aac`
- OGG Vorbis - `audio/ogg`
- FLAC - `audio/flac`

### Advanced Gemini TTS Models (Recommended)

AvalAI now supports the most advanced Google Gemini text-to-speech models with superior audio quality and natural-sounding voices:

- **[`gemini-2.5-flash-tts`](en/providers/google.md)** - Fast, cost-effective TTS with high-quality output
- **[`gemini-2.5-pro-tts`](en/providers/google.md)** - Premium quality TTS with exceptional naturalness

These models are available through both **OpenAI-compatible endpoints** and the **native Vertex AI `v1/text:synthesize` endpoint**. For comprehensive documentation including multi-speaker support, voice customization, and advanced features, see the [Vertex AI Text-to-Speech API Reference](en/api-reference/v1-text-synthesize.md).

#### Using OpenAI-Compatible Endpoints

The new Gemini TTS models work with standard OpenAI SDK endpoints:

```language-selector
bash=:curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash-tts",
    "input": "Welcome to AvalAI! Experience the most advanced Google text-to-speech technology.",
    "voice": "alloy",
    "response_format": "mp3"
  }' \
  --output speech.mp3

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.audio.speech.create(
    model="gemini-2.5-flash-tts",
    voice="alloy",
    input="Welcome to AvalAI! Experience the most advanced Google text-to-speech technology.",
)

response.stream_to_file("speech.mp3")
print("Audio saved to speech.mp3")

javascript=:import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: 'https://api.avalai.ir/v1'
});

const mp3 = await client.audio.speech.create({
  model: "gemini-2.5-flash-tts",
  voice: "alloy",
  input: "Welcome to AvalAI! Experience the most advanced Google text-to-speech technology."
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile('speech.mp3', buffer);
console.log("Audio saved to speech.mp3");

```

#### Using Chat Completions Endpoint

You can also generate audio through the chat completions endpoint:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-pro-tts",
    "modalities": ["text", "audio"],
    "audio": {
      "voice": "alloy",
      "format": "mp3"
    },
    "messages": [{
      "role": "user",
      "content": "Generate a warm welcome message for new users."
    }]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-2.5-pro-tts",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "mp3"},
    messages=[
        {"role": "user", "content": "Generate a warm welcome message for new users."}
    ],
)

print(response.choices[0].message.content)

javascript=:import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: 'https://api.avalai.ir/v1'
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-pro-tts",
  modalities: ["text", "audio"],
  audio: {
    voice: "alloy",
    format: "mp3"
  },
  messages: [{
    role: "user",
    content: "Generate a warm welcome message for new users."
  }]
});

console.log(response.choices[0].message.content);

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-pro-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Generate a warm welcome message for new users.",
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
  input: "Generate a warm welcome message for new users.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Generate a warm welcome message for new users.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


> **Important**: For advanced features like multi-speaker synthesis, voice customization, and SSML support, use the [Vertex AI `v1/text:synthesize` endpoint](en/api-reference/v1-text-synthesize.md) which provides full access to Google Cloud Text-to-Speech capabilities.

---

## Basic Usage

Audio processing with the AvalAI API uses the base64-encoded approach, where you send the audio file directly as encoded data:

```language-selector
bash=:# First, encode the audio file to base64
BASE64_AUDIO=$(base64 -i /path/to/your/audio.mp3 | tr -d '\n')

# Then send the API request with the base64-encoded audio
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gemini-2.5-flash",
"messages": [{
"role": "user",
"content": [
{"type": "text", "text": "What is this audio about?"},
{
"type": "file",
"file": {
"file_data": "data:audio/mp3;base64,'$BASE64_AUDIO'"
}
}
]
}]
}'

python=:from openai import OpenAI
import base64

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Method 1: From a URL
import requests

audio_url = "https://example.com/path/to/audio.mp3"
response = requests.get(audio_url)
file_data = response.content

# Method 2: From a local file
# with open("path/to/your/audio.mp3", "rb") as f:
#     file_data = f.read()

# Encode the audio data to base64
encoded_file = base64.b64encode(file_data).decode("utf-8")
base64_url = f"data:audio/mp3;base64,{encoded_file}"

# Create the request with the base64-encoded file
file_content = [
    {"type": "text", "text": "What is this audio about?"},
    {
        "type": "file",
        "file": {
            "file_data": base64_url,
        },
    },
]

# Send the request to the model
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import axios from "axios";
import fs from "fs";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to get base64 encoded audio
async function getBase64Audio() {
  // Method 1: From a URL
  const audioUrl = "https://example.com/path/to/audio.mp3";
  const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);

  // Method 2: From a local file
  // const buffer = fs.readFileSync("path/to/your/audio.mp3");

  return `data:audio/mp3;base64,${buffer.toString("base64")}`;
}

// Main function
async function processAudio() {
  const base64Audio = await getBase64Audio();

  // Create the request with the base64-encoded file
  const fileContent = [
    { type: "text", text: "What is this audio about?" },
    {
      type: "file",
      file: {
        file_data: base64Audio,
      },
    },
  ];

  // Send the request to the model
  const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [{ role: "user", content: fileContent }],
  });

  console.log(response.choices[0].message.content);
}

processAudio();

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	openai "github.com/openai/openai-go"
	"io/ioutil"
	"net/http"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Get audio data
	audioData, err := getAudioData()
	if err != nil {
		fmt.Printf("Error getting audio data: %v\n", err)
		return
	}

	// Encode the audio data to base64
	encodedFile := base64.StdEncoding.EncodeToString(audioData)
	base64URL := fmt.Sprintf("data:audio/mp3;base64,%s", encodedFile)

	// Create the request with the base64-encoded file
	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "What is this audio about?",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileData: base64URL,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

// Function to get audio data either from URL or local file
func getAudioData() ([]byte, error) {
	// Method 1: From a URL
	audioURL := "https://example.com/path/to/audio.mp3"
	resp, err := http.Get(audioURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return ioutil.ReadAll(resp.Body)

	// Method 2: From a local file
	// return ioutil.ReadFile("path/to/your/audio.mp3")
}

php=:<?php

require 'vendor/autoload.php';

// Initialize the client with AvalAI API
$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Function to get base64 encoded audio
function getBase64Audio() {
  // Method 1: From a URL
  $audioUrl = "https://example.com/path/to/audio.mp3";
  $fileData = file_get_contents($audioUrl);
  
  // Method 2: From a local file
  // $fileData = file_get_contents("path/to/your/audio.mp3");
  
  return "data:audio/mp3;base64," . base64_encode($fileData);
}

// Get the base64 encoded audio
$base64Audio = getBase64Audio();

// Create the request with the base64-encoded file
$fileContent = [
  [
    "type" => "text",
    "text" => "What is this audio about?"
  ],
  [
    "type" => "file",
    "file" => [
      "file_data" => $base64Audio
    ]
  ]
];

// Send the request to the model
$completion = $client->chat()->create([
  'model' => 'gemini-2.5-flash',
  'messages' => [
    [
      'role' => 'user',
      'content' => $fileContent
    ]
  ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the audio input.",
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
  input: "Summarize the audio input.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
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


## Specifying Format

You can explicitly specify the format of the audio file to ensure proper processing:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gemini-2.5-flash",
"messages": [{
"role": "user",
"content": [
{"type": "text", "text": "What is this audio about?"},
{
"type": "file",
"file": {
"file_data": "data:audio/mp3;base64,'$BASE64_AUDIO'",
"format": "audio/mp3"
}
}
]
}]
}'

python=:from openai import OpenAI
import base64

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Get audio data (from URL or local file)
# ... (same as previous example)

# Encode the audio data to base64
encoded_file = base64.b64encode(file_data).decode("utf-8")
base64_url = f"data:audio/mp3;base64,{encoded_file}"

# Create the request with format specification
file_content = [
    {"type": "text", "text": "What is this audio about?"},
    {"type": "file", "file": {"file_data": base64_url, "format": "audio/mp3"}},
]

# Send the request to the model
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Get base64 encoded audio
// ... (same as previous example)

// Create the request with format specification
const fileContent = [
  { type: "text", text: "What is this audio about?" },
  {
    type: "file",
    file: {
      file_data: base64Audio,
      format: "audio/mp3",
    },
  },
];

// Send the request to the model
const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: fileContent }],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Get audio data
	// ... (same as previous example)

	// Create the request with format specification
	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "What is this audio about?",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileData: base64URL,
				Format:   "audio/mp3",
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

// Initialize the client with AvalAI API
$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Get base64 encoded audio
// ... (same as previous example)

// Create the request with format specification
$fileContent = [
  [
    "type" => "text",
    "text" => "What is this audio about?"
  ],
  [
    "type" => "file",
    "file" => [
      "file_data" => $base64Audio,
      "format" => "audio/mp3"
    ]
  ]
];

// Send the request to the model
$completion = $client->chat()->create([
  'model' => 'gemini-2.5-flash',
  'messages' => [
    [
      'role' => 'user',
      'content' => $fileContent
    ]
  ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the audio input.",
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
  input: "Summarize the audio input.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
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


## Model-Specific Limitations

### Gemini Models

- **Maximum file size**: 10MB for audio files
- **Maximum duration**: Up to 120 minutes of audio
- **Format requirements**: Standard audio formats (WAV, MP3, AIFF, AAC, OGG, FLAC)
- **Token usage**: Varies based on audio length and complexity
- **Language support**: Multiple languages supported with varying levels of accuracy
- **Best suited for**: Transcription, content analysis, and understanding spoken information

## Use Cases

### Audio Transcription

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gemini-2.5-flash",
"messages": [{
"role": "user",
"content": [
{"type": "text", "text": "Transcribe this audio file accurately."},
{
"type": "file",
"file": {
"file_data": "data:audio/mp3;base64,'$BASE64_AUDIO'"
}
}
]
}]
}'

python=:from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Get audio data (from URL or local file)
# ... (same as previous examples)

file_content = [
    {"type": "text", "text": "Transcribe this audio file accurately."},
    {
        "type": "file",
        "file": {
            "file_data": base64_url,
        },
    },
]

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Get base64 encoded audio
// ... (same as previous examples)

const fileContent = [
  { type: "text", text: "Transcribe this audio file accurately." },
  {
    type: "file",
    file: {
      file_data: base64Audio,
    },
  },
];

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: fileContent }],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Get audio data and encode to base64
	// ... (same as previous examples)

	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "Transcribe this audio file accurately.",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileData: base64URL,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Get base64 encoded audio
// ... (same as previous examples)

$fileContent = [
  [
    "type" => "text",
    "text" => "Transcribe this audio file accurately."
  ],
  [
    "type" => "file",
    "file" => [
      "file_data" => $base64Audio
    ]
  ]
];

$completion = $client->chat()->create([
  'model' => 'gemini-2.5-flash',
  'messages' => [
    [
      'role' => 'user',
      'content' => $fileContent
    ]
  ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the audio input.",
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
  input: "Summarize the audio input.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
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


### Audio Content Analysis

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gemini-2.5-flash",
"messages": [{
"role": "user",
"content": [
{"type": "text", "text": "Analyze this audio and tell me the main topics discussed, the speakers\u0027 tone, and any key points mentioned."},
{
"type": "file",
"file": {
"file_data": "data:audio/mp3;base64,'$BASE64_AUDIO'"
}
}
]
}]
}'

python=:from openai import OpenAI
import base64

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Get audio data (from URL or local file)
# ... (same as previous examples)

file_content = [
    {
        "type": "text",
        "text": "Analyze this audio and tell me the main topics discussed, the speakers' tone, and any key points mentioned.",
    },
    {
        "type": "file",
        "file": {
            "file_data": base64_url,
        },
    },
]

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Get base64 encoded audio
// ... (same as previous examples)

const fileContent = [
  {
    type: "text",
    text: "Analyze this audio and tell me the main topics discussed, the speakers' tone, and any key points mentioned.",
  },
  {
    type: "file",
    file: {
      file_data: base64Audio,
    },
  },
];

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: fileContent }],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Get audio data and encode to base64
	// ... (same as previous examples)

	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "Analyze this audio and tell me the main topics discussed, the speakers' tone, and any key points mentioned.",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileData: base64URL,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

// Get base64 encoded audio
// ... (same as previous examples)

$fileContent = [
  [
    "type" => "text",
    "text" => "Analyze this audio and tell me the main topics discussed, the speakers' tone, and any key points mentioned."
  ],
  [
    "type" => "file",
    "file" => [
      "file_data" => $base64Audio
    ]
  ]
];

$completion = $client->chat()->create([
  'model' => 'gemini-2.5-flash',
  'messages' => [
    [
      'role' => 'user',
      'content' => $fileContent
    ]
  ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the audio input.",
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
  input: "Summarize the audio input.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
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


## Audio Output (Text-to-Speech) with Native v1beta API

While the examples above focus on audio input processing, AvalAI also supports advanced text-to-speech (TTS) capabilities through the native v1beta API. This includes both single-speaker and multi-speaker audio generation.


### Single-Speaker TTS

```language-selector
bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
	"contents": [{
		"parts":[{
			"text": "Welcome to AvalAI! This is a demonstration of our text-to-speech capabilities."
		}]
	}],
	"generationConfig": {
		"responseModalities": ["AUDIO"],
		"speechConfig": {
			"voiceConfig": {
				"prebuiltVoiceConfig": {
					"voiceName": "Kore"
				}
			}
		}
	},
	"model": "gemini-2.5-flash-preview-tts"
}' | jq -r '.candidates[0].content.parts[0].inlineData.data' \
  | base64 --decode >tts_output.pcm

python=:from google import genai
from google.genai import types
import wave


def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents="Welcome to AvalAI! This is a demonstration of our text-to-speech capabilities.",
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Kore",
                )
            )
        ),
    ),
)

data = response.candidates[0].content.parts[0].inline_data.data
wave_file("tts_output.wav", data)
print("TTS audio saved to tts_output.wav")

javascript=:import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) {
	return new Promise((resolve, reject) => {
		const writer = new wav.FileWriter(filename, {
			channels,
			sampleRate: rate,
			bitDepth: sampleWidth * 8,
		});
		writer.on('finish', resolve);
		writer.on('error', reject);
		writer.write(pcmData);
		writer.end();
	});
}

const ai = new GoogleGenAI({
	apiKey: process.env.AVALAI_API_KEY,
	httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

const response = await ai.models.generateContent({
	model: "gemini-2.5-flash-preview-tts",
	contents: [{ parts: [{ text: "Welcome to AvalAI! This is a demonstration of our text-to-speech capabilities." }] }],
	config: {
		responseModalities: ['AUDIO'],
		speechConfig: {
			voiceConfig: {
				prebuiltVoiceConfig: { voiceName: 'Kore' }
			}
		}
	}
});

const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
const audioBuffer = Buffer.from(data, 'base64');
await saveWaveFile('tts_output.wav', audioBuffer);
console.log("TTS audio saved to tts_output.wav");

```

### Multi-Speaker TTS

The native v1beta API supports advanced multi-speaker TTS functionality:

```language-selector
bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
	"contents": [{
		"parts":[{
			"text": "TTS the following conversation between Alice and Bob:\nAlice: Welcome to our audio processing demo!\nBob: This multi-speaker feature is amazing!"
		}]
	}],
	"generationConfig": {
		"responseModalities": ["AUDIO"],
		"speechConfig": {
			"multiSpeakerVoiceConfig": {
				"speakerVoiceConfigs": [{
					"speaker": "Alice",
					"voiceConfig": {
						"prebuiltVoiceConfig": {
							"voiceName": "Kore"
						}
					}
				}, {
					"speaker": "Bob",
					"voiceConfig": {
						"prebuiltVoiceConfig": {
							"voiceName": "Puck"
						}
					}
				}]
			}
		}
	},
	"model": "gemini-2.5-flash-preview-tts"
}' | jq -r '.candidates[0].content.parts[0].inlineData.data' \
  | base64 --decode >multi_speaker_output.pcm

python=:from google import genai
from google.genai import types
import wave


def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

prompt = """TTS the following conversation between Alice and Bob:
Alice: Welcome to our audio processing demo!
Bob: This multi-speaker feature is amazing!"""

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="Alice",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Kore",
                            )
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="Bob",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck",
                            )
                        ),
                    ),
                ]
            )
        ),
    ),
)

data = response.candidates[0].content.parts[0].inline_data.data
wave_file("multi_speaker_output.wav", data)
print("Multi-speaker TTS audio saved to multi_speaker_output.wav")

javascript=:import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) {
	return new Promise((resolve, reject) => {
		const writer = new wav.FileWriter(filename, {
			channels,
			sampleRate: rate,
			bitDepth: sampleWidth * 8,
		});
		writer.on('finish', resolve);
		writer.on('error', reject);
		writer.write(pcmData);
		writer.end();
	});
}

const ai = new GoogleGenAI({
	apiKey: process.env.AVALAI_API_KEY,
	httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

const prompt = `TTS the following conversation between Alice and Bob:
Alice: Welcome to our audio processing demo!
Bob: This multi-speaker feature is amazing!`;

const response = await ai.models.generateContent({
	model: "gemini-2.5-flash-preview-tts",
	contents: [{ parts: [{ text: prompt }] }],
	config: {
		responseModalities: ['AUDIO'],
		speechConfig: {
			multiSpeakerVoiceConfig: {
				speakerVoiceConfigs: [
					{
						speaker: 'Alice',
						voiceConfig: {
							prebuiltVoiceConfig: { voiceName: 'Kore' }
						}
					},
					{
						speaker: 'Bob',
						voiceConfig: {
							prebuiltVoiceConfig: { voiceName: 'Puck' }
						}
					}
				]
			}
		}
	}
});

const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
const audioBuffer = Buffer.from(data, 'base64');
await saveWaveFile('multi_speaker_output.wav', audioBuffer);
console.log("Multi-speaker TTS audio saved to multi_speaker_output.wav");

```

> **Note**: Multi-speaker TTS functionality is only available through the native v1beta API, not through the OpenAI-compatible endpoints. The available voice options include: Kore, Charon, Puck, Fenrir, and many others.

### TTS with Audio Input Processing

You can combine audio input processing with TTS output to create powerful audio workflows:

```language-selector
python=:from google import genai
from google.genai import types
import base64
import wave


def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Step 1: Process input audio (transcription/analysis)
with open("input_audio.mp3", "rb") as f:
    audio_data = f.read()

encoded_audio = base64.b64encode(audio_data).decode("utf-8")

# Analyze the input audio
analysis_response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        {
            "parts": [
                {"text": "Summarize this audio in one sentence:"},
                {"inline_data": {"mime_type": "audio/mp3", "data": encoded_audio}},
            ]
        }
    ],
)

summary = analysis_response.candidates[0].content.parts[0].text

# Step 2: Generate TTS from the summary
tts_response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=f"Here's a summary of the audio: {summary}",
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Kore",
                )
            )
        ),
    ),
)

# Save the TTS output
data = tts_response.candidates[0].content.parts[0].inline_data.data
wave_file("summary_tts_output.wav", data)
print("Audio summary TTS saved to summary_tts_output.wav")

javascript=:import {GoogleGenAI} from '@google/genai';
import fs from 'fs';
import wav from 'wav';

async function saveWaveFile(filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) {
	return new Promise((resolve, reject) => {
		const writer = new wav.FileWriter(filename, {
			channels,
			sampleRate: rate,
			bitDepth: sampleWidth * 8,
		});
		writer.on('finish', resolve);
		writer.on('error', reject);
		writer.write(pcmData);
		writer.end();
	});
}

const ai = new GoogleGenAI({
	apiKey: process.env.AVALAI_API_KEY,
	httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

// Step 1: Process input audio
const audioBuffer = fs.readFileSync('input_audio.mp3');
const encodedAudio = audioBuffer.toString('base64');

const analysisResponse = await ai.models.generateContent({
	model: "gemini-2.5-flash",
	contents: [{
		parts: [
			{ text: "Summarize this audio in one sentence:" },
			{ inlineData: { mimeType: "audio/mp3", data: encodedAudio } }
		]
	}]
});

const summary = analysisResponse.candidates[0].content.parts[0].text;

// Step 2: Generate TTS from the summary
const ttsResponse = await ai.models.generateContent({
	model: "gemini-2.5-flash-preview-tts",
	contents: [{ parts: [{ text: `Here's a summary of the audio: ${summary}` }] }],
	config: {
		responseModalities: ['AUDIO'],
		speechConfig: {
			voiceConfig: {
				prebuiltVoiceConfig: { voiceName: 'Kore' }
			}
		}
	}
});

const data = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
const audioBuffer2 = Buffer.from(data, 'base64');
await saveWaveFile('summary_tts_output.wav', audioBuffer2);
console.log("Audio summary TTS saved to summary_tts_output.wav");

```


## Common Issues and Troubleshooting

### Handling Large Audio Files

- **Split into segments**: For audio files larger than 10MB, consider splitting them into smaller segments
- **Reduce audio quality**: Lower the bitrate while maintaining intelligibility
- **Convert to more efficient formats**: Convert to formats with better compression like MP3 or AAC

### Dealing with Low-Quality Audio

- **Noise reduction**: Apply noise reduction before processing
- **Enhance clarity**: Use audio enhancement tools to improve speech clarity
- **Provide context**: Include additional context in your prompt to help the model understand

### Format Conversion Recommendations

- **Use standard formats**: Stick to widely supported formats like MP3 or WAV
- **Ensure proper encoding**: Verify that your audio is properly encoded before conversion
- **Maintain adequate quality**: Balance file size with quality to ensure accurate processing

## Performance Optimization

### Tips for Optimizing Audio Files

- **Appropriate sampling rate**: Use 16kHz for speech audio (adequate for most speech recognition)
- **Mono vs. stereo**: Use mono for speech content to reduce file size
- **Bitrate optimization**: 64-128 kbps is often sufficient for speech content

### Batch Processing Recommendations

- **Implement queuing**: For processing multiple files, implement a queuing system
- **Parallel processing**: Process multiple short audio files in parallel
- **Progress tracking**: Implement tracking for long-running batch processes

## Best Practices

- **Audio quality**: Ensure clear audio with minimal background noise
- **Prompt specificity**: Be specific in your prompts about what you want from the audio
- **Context provision**: Provide context about the audio content when possible
- **Segment long audio**: Break long recordings into logical segments
- **Security considerations**: Be mindful of sensitive information in audio files

## Related Links

- [AvalAI API Documentation](en/index.md)
- [Gemini Model Documentation](en/providers/google.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [Rate Limits and Quotas](en/guides/rate-limits.md)
