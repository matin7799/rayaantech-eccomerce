# Audio Processing

Audio processing capabilities in AvalAI allow you to work with spoken content in various ways, from converting text to speech and speech to text, to handling audio directly in chat completions. This guide provides a comprehensive overview of these capabilities, detailed information about available models, and practical examples for implementation.

## Introduction

### Overview of Audio Processing in AvalAI

AvalAI offers advanced audio processing capabilities through various specialized models that enable three main types of audio processing:

1. **Text-to-Speech (TTS)**: Convert written text into natural-sounding spoken audio
2. **Speech-to-Text (STT/Transcription)**: Convert spoken audio into accurate text transcriptions
3. **Audio in Chat Completions**: Process and generate audio directly within chat conversations

These capabilities enable a wide range of applications, from accessibility features and content creation to voice assistants and interactive systems.

### Available Models Summary

| Model Type         | Model Name                | Description                              | Best For                                     |
| ------------------ | ------------------------- | ---------------------------------------- | -------------------------------------------- |
| **Text-to-Speech** | gpt-4o-mini-tts           | Converts text to natural-sounding speech | Efficient TTS with good quality/cost balance |
| **Speech-to-Text** | gpt-4o-transcribe         | High-accuracy audio transcription        | Premium transcription quality                |
| **Speech-to-Text** | gpt-4o-mini-transcribe    | Efficient audio transcription            | Cost-effective transcription                 |
| **Audio I/O**      | gpt-4o-audio-preview      | Audio input/output in chat               | High-quality audio chat interactions         |
| **Audio I/O**      | gpt-4o-mini-audio-preview | Efficient audio input/output in chat     | Cost-effective audio chat interactions       |

### Common Use Cases

Audio processing capabilities can be applied across numerous domains:

- **Accessibility**: Making content accessible to users with visual impairments or reading difficulties
- **Content Creation**: Generating audio versions of written content, transcribing interviews or meetings
- **Voice Interfaces**: Building voice assistants and interactive voice response systems
- **Language Learning**: Creating pronunciation guides and listening exercises
- **Customer Service**: Automated voice response systems and call transcription
- **Media Production**: Automated subtitling, content analysis, and audio editing assistance

## Text-to-Speech (TTS) 

### TTS Models & Capabilities

Text-to-Speech technology converts written text into spoken audio that sounds natural and human-like. AvalAI offers access to advanced TTS models that provide high-quality voice synthesis with various customization options.

#### Available Voices

The TTS models support multiple voices with different characteristics:

- `alloy`: Neutral, balanced voice
- `echo`: Deep, resonant voice
- `fable`: British-accented voice with warmth
- `onyx`: Authoritative, deep voice
- `nova`: Friendly, conversational female voice
- `shimmer`: Bright, enthusiastic voice

### gpt-4o-mini-tts Details

The gpt-4o-mini-tts model represents a significant advancement in TTS technology, leveraging the capabilities of the GPT-4o mini language model to produce more natural and expressive speech.

**Technical Specifications:**

- **Mode**: ‍`audio_speech`
- **Input Cost**: $0.00000250 per token (approximately $0.60 per 1 million characters)
- **Output Cost**: $0.00001000 per token (approximately $0.00025 per second of audio)
- **Input Limit**: 2000 tokens
- **Supports Vision**: Yes
- **Supports Function Calling**: Yes

**Key Features:**

- Natural-sounding speech with appropriate intonation and expression
- Fast processing for quick text-to-audio conversion
- Higher quality compared to traditional TTS systems
- Efficient resource usage based on the GPT-4o mini architecture

### API Usage & Parameters

#### Endpoint

```
POST https://api.avalai.ir/v1/audio/speech
```

#### Request Parameters

| Parameter         | Type   | Required | Description                                                         |
| ----------------- | ------ | -------- | ------------------------------------------------------------------- |
| `model`           | string | Yes      | Model ID (e.g., `gpt-4o-mini-tts`)                                  |
| `input`           | string | Yes      | The text to generate audio for (max 4096 characters)                |
| `voice`           | string | Yes      | Voice to use (`alloy`, `echo`, `fable`, `nova`, `onyx`, `shimmer`)  |
| `instructions`    | string | No       | Optional instructions to control voice style                        |
| `response_format` | string | No       | Audio format (`mp3` (default), `opus`, `aac`, `flac`, `wav`, `pcm`) |
| `speed`           | number | No       | Speed of generated audio (0.25 to 4.0, default 1.0)                 |

### Code Examples

```language-selector
bash=:# cURL Example for Text-to-Speech
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gpt-4o-mini-tts",
 "input": "Welcome to AvalAI! This is an example of our text-to-speech capabilities.",
 "voice": "nova",
 "speed": 1.0
}' \
  --output speech_output.mp3

python=:# Python Example for Text-to-Speech
from openai import OpenAI
from pathlib import Path

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

speech_file_path = Path("./speech_output.mp3")

try:
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="nova",
        input="Welcome to AvalAI! This is an example of our text-to-speech capabilities.",
        speed=1.0,
    )
    # Stream the binary audio content to a file
    response.stream_to_file(speech_file_path)
    print(f"Audio saved to {speech_file_path}")
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example for Text-to-Speech
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

const speechFile = path.resolve("./speech_output.mp3");

async function main() {
  try {
    const mp3 = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "nova",
      input:
        "Welcome to AvalAI! This is an example of our text-to-speech capabilities.",
      speed: 1.0,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log(`Audio saved to ${speechFile}`);
  } catch (error) {
    console.error("Error generating speech: ", error);
  }
}
main();

go=:// Go Example for Text-to-Speech
package main

import (
	"context"
	"fmt"
	"io"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	speechFile := "./speech_output.mp3"

	req := openai.CreateSpeechRequest{
		Model: "gpt-4o-mini-tts",
		Input: "Welcome to AvalAI! This is an example of our text-to-speech capabilities.",
		Voice: openai.VoiceNova,
		Speed: 1.0,
	}

	resp, err := client.CreateSpeech(context.Background(), req)
	if err != nil {
		fmt.Printf("TTS error: %v\n", err)
		return
	}
	defer resp.Close()

	outFile, err := os.Create(speechFile)
	if err != nil {
		fmt.Printf("Error creating output file: %v\n", err)
		return
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, resp)
	if err != nil {
		fmt.Printf("Error writing audio to file: %v\n", err)
		return
	}

	fmt.Printf("Audio saved to %s\n", speechFile)
}

php=:<?php
// PHP Example for Text-to-Speech

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/audio/speech';
$outputFile = 'speech_output.mp3';

$data = [
 'model' => 'gpt-4o-mini-tts',
 'input' => 'Welcome to AvalAI! This is an example of our text-to-speech capabilities.',
 'voice' => 'nova',
 'speed' => 1.0
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

// Execute the request
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
 echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
 echo "HTTP Error: " . $httpcode . "\n";
 echo "Response: " . $response;
} elseif ($httpcode == 200) {
 // Save the audio file
 if (file_put_contents($outputFile, $response)) {
 echo "Audio saved to " . $outputFile . "\n";
 } else {
 echo "Error saving audio file to " . $outputFile . "\n";
 }
} else {
 echo "Unexpected HTTP Code: " . $httpcode . "\n";
 echo $response;
}
?>

```

### Use Cases

#### Content Accessibility

Convert articles, blog posts, or documents into audio format for users with visual impairments or those who prefer listening over reading.

```python
# Convert a blog post to audio
blog_post = """
# Understanding AI: A Beginner's Guide

Artificial intelligence (AI) is transforming how we interact with technology...
"""

response = client.audio.speech.create(
    model="gpt-4o-mini-tts", voice="nova", input=blog_post
)
response.stream_to_file("blog_audio.mp3")
```

#### Voice Assistants

Create natural-sounding responses for voice assistants or interactive applications.

```javascript
// Generate a voice assistant response
async function generateVoiceResponse(userQuery) {
  // First get text response from a chat model
  const textResponse = await client.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      { role: "system", content: "You are a helpful voice assistant." },
      { role: "user", content: userQuery },
    ],
  });

  // Then convert the text response to speech
  const speechResponse = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "nova",
    input: textResponse.choices[0].message.content,
  });

  return speechResponse;
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
    model="gpt-5.4-mini",
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


#### Multilingual Content Delivery

Generate audio in multiple languages for global content distribution.

```python
# Generate audio in different languages
languages = {
    "English": "Welcome to our global platform.",
    "Spanish": "Bienvenido a nuestra plataforma global.",
    "French": "Bienvenue sur notre plateforme mondiale.",
}

for language, text in languages.items():
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="nova",  # Different voices might work better for different languages
        input=text,
    )
    response.stream_to_file(f"{language.lower()}_welcome.mp3")
```

## Speech-to-Text (STT)

### STT Models & Capabilities

Speech-to-Text technology (also known as transcription) converts spoken audio into written text. AvalAI provides access to specialized transcription models that offer high accuracy across various audio types and languages.

#### Language Support

The transcription models support multiple languages, with the ability to automatically detect the spoken language or specify it for improved accuracy.

### gpt-4o-transcribe Details

The gpt-4o-transcribe model is a specialized model for high-accuracy audio transcription, built on the GPT-4o architecture.

**Technical Specifications:**

- **Mode**: `audio_transcription`
- **Max Input Tokens**: 16000
- **Max Output Tokens**: 2000
- **Input Cost Per Token**: $0.00000250
- **Output Cost Per Token**: $0.00001000
- **Supports Vision**: Yes
- **Supports Function Calling**: Yes

### gpt-4o-mini-transcribe Details

The gpt-4o-mini-transcribe model is an efficient variant for audio transcription, offering a good balance between accuracy and cost.

**Technical Specifications:**

- **Mode**: `audio_transcription`
- **Max Input Tokens**: 16000
- **Max Output Tokens**: 2000
- **Input Cost Per Token**: $0.00000125
- **Output Cost Per Token**: $0.00000500
- **Supports Vision**: Yes
- **Supports Function Calling**: Yes

**Performance vs. Cost Tradeoffs:**

- Approximately half the cost of the full gpt-4o-transcribe model
- Slightly lower accuracy for complex audio or challenging conditions
- Ideal for most everyday transcription needs

### API Usage & Parameters

#### Endpoint

```
POST https://api.avalai.ir/v1/audio/transcriptions
```

#### Request Parameters

| Parameter                   | Type   | Required | Description                                                                 |
| --------------------------- | ------ | -------- | --------------------------------------------------------------------------- |
| `file`                      | file   | Yes      | The audio file object (not filename) to transcribe                          |
| `model`                     | string | Yes      | Model ID (e.g., `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`)              |
| `language`                  | string | No       | The language of the audio in ISO-639-1 format (e.g., `en`)                  |
| `prompt`                    | string | No       | Optional text to guide the model (e.g., technical terms)                    |
| `response_format`           | string | No       | Format of output: `json` (default), `text`, `srt`, `verbose_json`, or `vtt` |
| `temperature`               | number | No       | Sampling temperature (0 to 1, default 0)                                    |
| `timestamp_granularities[]` | array  | No       | Granularities for timestamps (`word`, `segment`)                            |

### Code Examples

```language-selector
bash=:# cURL Example for Speech-to-Text
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/audio.mp3" \
  -F model="gpt-4o-transcribe"

python=:# Python Example for Speech-to-Text
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    audio_file = open("path/to/audio.mp3", "rb")
    transcript = client.audio.transcriptions.create(
        model="gpt-4o-transcribe",  # Or gpt-4o-mini-transcribe for more efficiency
        file=audio_file,
        language="en",  # Optional: specify language for better accuracy
        response_format="text",  # Options: json (default), text, srt, verbose_json, vtt
    )
    print(transcript)
except FileNotFoundError:
    print("Error: Audio file not found.")
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example for Speech-to-Text
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  try {
    const audioFilePath = "path/to/audio.mp3"; // Replace with your audio file path

    if (!fs.existsSync(audioFilePath)) {
      console.error(`Error: Audio file not found at ${audioFilePath}`);
      return;
    }

    const transcript = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "gpt-4o-transcribe", // Or gpt-4o-mini-transcribe
      language: "en", // Optional: specify language
      response_format: "text", // Options: json (default), text, srt, verbose_json, vtt
    });

    console.log("Transcription: ", transcript);
  } catch (error) {
    console.error("An error occurred during transcription: ", error);
  }
}

main();

go=:// Go Example for Speech-to-Text
package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL
	audioFilePath := "path/to/audio.mp3"  // Replace with your audio file path

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	req := openai.AudioRequest{
		Model:    "gpt-4o-transcribe", // Or gpt-4o-mini-transcribe
		FilePath: audioFilePath,
		Language: "en", // Optional
		// ResponseFormat: "text", // Optional (default is json)
	}

	resp, err := client.CreateTranscription(context.Background(), req)
	if err != nil {
		fmt.Printf("Transcription error: %v\n", err)
		// Check if the error is due to file not found
		if _, ok := err.(*os.PathError); ok {
			fmt.Println("Hint: Ensure the audio file path is correct.")
		}
		return
	}

	fmt.Println("Transcription:", resp.Text)
}

php=:<?php
// PHP Example for Speech-to-Text

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/audio/transcriptions';
$audioFilePath = '/path/to/audio.mp3'; // IMPORTANT: Replace with the actual path to your audio file

if (!file_exists($audioFilePath)) {
 die("Error: Audio file not found at " . $audioFilePath);
}

// Create a CURLFile object
$cfile = curl_file_create($audioFilePath, mime_content_type($audioFilePath), basename($audioFilePath));

$data = [
 'file' => $cfile,
 'model' => 'gpt-4o-transcribe', // Or gpt-4o-mini-transcribe
 'language' => 'en', // Optional
 'response_format' => 'text' // Optional (default is json)
];

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Pass the array directly for multipart/form-data
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Authorization: Bearer ' . $apiKey
 // Content-Type is set automatically by cURL for multipart/form-data
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
 echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
 echo "HTTP Error: " . $httpcode . "\n";
 echo "Response: " . $response;
} else {
 // Assuming default 'json' response format or 'text'
 $responseData = json_decode($response, true);
 if (json_last_error() === JSON_ERROR_NONE && isset($responseData['text'])) {
 echo "Transcription (JSON): " . $responseData['text'] . "\n";
 } else {
 // If response is plain text or other format
 echo "Transcription (Text/Other): " . $response . "\n";
 }
}
?>

```

### Use Cases

#### Meeting Transcription

Transcribe meeting recordings to create searchable archives and documentation.

```python
# Transcribe a meeting recording
with open("meeting_recording.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="gpt-4o-transcribe",
        file=audio_file,
        response_format="verbose_json",  # Get detailed output with timestamps
        timestamp_granularities=["segment"],
    )

# Save the transcript with timestamps
with open("meeting_transcript.json", "w") as f:
    import json

    json.dump(transcript, f, indent=2)
```

#### Content Indexing

Convert audio content into text for search engines and content management systems.

```javascript
// Process a collection of audio files for indexing
async function batchTranscribeForIndexing(audioFiles) {
  const results = [];

  for (const file of audioFiles) {
    try {
      const transcript = await client.audio.transcriptions.create({
        file: fs.createReadStream(file),
        model: "gpt-4o-mini-transcribe",
        response_format: "json",
      });

      results.push({
        filename: file,
        transcript: transcript.text,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  return results;
}
```

#### Real-time Captioning

Implement live captioning for videos, webinars, or presentations.

```python
# Example of processing audio chunks for real-time captioning
def process_audio_chunk(audio_chunk):
    with open("temp_chunk.wav", "wb") as f:
        f.write(audio_chunk)

    with open("temp_chunk.wav", "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="gpt-4o-mini-transcribe",  # Use mini for faster processing
            file=audio_file,
            response_format="text",
        )

    return transcript
```

## Audio in Chat Completions

### Audio I/O Models

Audio in chat completions allows for direct processing of audio files within the chat context, enabling models to understand spoken content and respond to it appropriately. This creates a more natural conversational experience with audio input and potentially audio output.

#### Differences from Dedicated TTS/STT

While dedicated TTS and STT models focus specifically on conversion between text and speech, audio-enabled chat models can:

- Process audio as part of a broader conversation
- Maintain context between audio and text interactions
- Generate responses based on the content of the audio
- Handle mixed-media conversations with text, audio, and potentially images

### gpt-4o-audio-preview Details

The gpt-4o-audio-preview model provides high-quality audio processing capabilities within chat completions.

**Technical Specifications:**

- **Max Total Tokens**: 16384
- **Max Input Tokens**: 128000
- **Max Output Tokens**: 16384
- **Input Cost Per Token**: $0.00000250
- **Output Cost Per Token**: $0.00001000
- **Mode**: `chat`
- **Supports Vision**: Yes
- **Supports Audio Input**: Yes
- **Supports Audio Output**: Yes
- **Supports Function Calling**: Yes
- **Supports Parallel Function Calling**: Yes
- **Supports System Messages**: Yes
- **Supports Streaming**: Yes

### gpt-4o-mini-audio-preview Details

The gpt-4o-mini-audio-preview model offers a more efficient alternative for audio processing in chat completions.

**Technical Specifications:**

- **Max Total Tokens**: 16384
- **Max Input Tokens**: 128000
- **Max Output Tokens**: 16384
- **Input Cost Per Token**: $0.00000015
- **Output Cost Per Token**: $0.00000060
- **Mode**: `chat`
- **Supports Vision**: Yes
- **Supports Audio Input**: Yes
- **Supports Audio Output**: Yes
- **Supports Function Calling**: Yes
- **Supports Parallel Function Calling**: Yes
- **Supports System Messages**: Yes
- **Supports Streaming**: Yes

**When to use vs. full model:**

- Use gpt-4o-mini-audio-preview for:
  - Cost-sensitive applications
  - Applications with high volume of audio processing
  - Less complex audio analysis tasks
- Use gpt-4o-audio-preview for:
  - Complex audio understanding tasks
  - Higher accuracy requirements
  - Nuanced content analysis

### API Usage & Parameters

Audio processing in chat completions uses the base64-encoded approach, where you send the audio file directly as encoded data.

#### Endpoint

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


#### Request Parameters

| Parameter                 | Type   | Required | Description                                                          |
| ------------------------- | ------ | -------- | -------------------------------------------------------------------- |
| `model`                   | string | Yes      | Model ID (e.g., `gpt-4o-audio-preview`, `gpt-4o-mini-audio-preview`) |
| `modalities`              | array  | Yes      | `["text", "audio"]` for OpenAI audio models                         |
| `audio`                   | object | Yes      | Audio configuration with `voice` and `format` for OpenAI models     |
| `messages`                | array  | Yes      | Array of message objects including text and audio content            |
| `input_audio.data`        | string | Yes      | Base64-encoded audio data (for OpenAI audio models)                 |
| `input_audio.format`      | string | Yes      | Audio format (e.g., `mp3`, `wav`) for OpenAI audio models           |

**Note:** OpenAI audio models (`gpt-4o-audio-preview`, `gpt-4o-mini-audio-preview`) use the `input_audio` format shown above. For Gemini models accessed through the OpenAI v1 API schema, use the `file` format with `file_data`. For native Gemini API support, see [v1beta documentation](en/api-reference/v1beta.md).

### Code Examples

```language-selector
bash=:# cURL Example for Audio in Chat Completions
# First, encode the audio file to base64
BASE64_AUDIO=$(base64 -i speech.mp3 | tr -d '\n')

# Then send the API request with the base64-encoded audio
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-4o-audio-preview",
 "modalities": ["text", "audio"],
 "audio": {"voice": "alloy", "format": "wav"},
 "messages": [{
 "role": "user",
 "content": [
 {"type": "text", "text": "What is in this recording?"},
 {
 "type": "input_audio",
 "input_audio": {
 "data": "'$BASE64_AUDIO'",
 "format": "mp3"
 }
 }
 ]
 }]
}'

python=:# Python Example for Audio in Chat Completions
from openai import OpenAI
import base64

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Read and encode audio file
with open("speech.mp3", "rb") as f:
    audio_data = f.read()

encoded_audio = base64.b64encode(audio_data).decode("utf-8")

# Create the request with proper audio input structure
response = client.chat.completions.create(
    model="gpt-4o-audio-preview",  # Or gpt-4o-mini-audio-preview
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this recording?"},
                {
                    "type": "input_audio",
                    "input_audio": {"data": encoded_audio, "format": "mp3"},
                },
            ],
        },
    ],
)

print(response.choices[0].message.content)

javascript=:// JavaScript Example for Audio in Chat Completions
import { OpenAI } from "openai";
import fs from "fs";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Main function
async function processAudio() {
  // Read and encode audio file
  const audioData = fs.readFileSync("speech.mp3");
  const encodedAudio = audioData.toString("base64");

  // Send the request to the model
  const response = await client.chat.completions.create({
    model: "gpt-4o-audio-preview", // Or gpt-4o-mini-audio-preview
    modalities: ["text", "audio"],
    audio: { voice: "alloy", format: "wav" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What is in this recording?"
          },
          {
            type: "input_audio",
            input_audio: {
              data: encodedAudio,
              format: "mp3"
            }
          }
        ]
      },
    ]
  });

  console.log(response.choices[0].message.content);
}

processAudio();

go=:// Go Example for Audio in Chat Completions
package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	// Read and encode audio file
	audioData, err := os.ReadFile("speech.mp3")
	if err != nil {
		fmt.Printf("Error reading audio file: %v\n", err)
		return
	}

	encodedAudio := base64.StdEncoding.EncodeToString(audioData)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:      "gpt-4o-audio-preview", // Or gpt-4o-mini-audio-preview
			Modalities: []string{"text", "audio"},
			Audio: &openai.AudioConfig{
				Voice:  "alloy",
				Format: "wav",
			},
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: []openai.ChatMessageContent{
						{
							Type: openai.ChatMessageContentTypeText,
							Text: "What is in this recording?",
						},
						{
							Type: openai.ChatMessageContentTypeInputAudio,
							InputAudio: &openai.InputAudio{
								Data:   encodedAudio,
								Format: "mp3",
							},
						},
					},
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
// PHP Example for Audio in Chat Completions

require 'vendor/autoload.php'; // If using OpenAI PHP client

// Read and encode audio file
$audioFilePath = "speech.mp3";
if (!file_exists($audioFilePath)) {
 die("Error: Audio file not found at " . $audioFilePath);
}
$audioData = file_get_contents($audioFilePath);
$encodedAudio = base64_encode($audioData);

// Using cURL directly
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

$data = [
 'model' => 'gpt-4o-audio-preview', // Or gpt-4o-mini-audio-preview
 'modalities' => ['text', 'audio'],
 'audio' => [
 'voice' => 'alloy',
 'format' => 'wav'
 ],
 'messages' => [
 [
 'role' => 'user',
 'content' => [
 [
 'type' => 'text',
 'text' => 'What is in this recording?'
 ],
 [
 'type' => 'input_audio',
 'input_audio' => [
 'data' => $encodedAudio,
 'format' => 'mp3'
 ]
 ]
 ]
 ]
 ]
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
 echo "Response: " . $response;
} else {
 $responseData = json_decode($response, true);
 if (isset($responseData['choices'][0]['message']['content'])) {
 echo "Model Response: " . $responseData['choices'][0]['message']['content'] . "\n";
 } else {
 echo "Unexpected response format: " . $response;
 }
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-audio-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### Use Cases

#### Audio Content Analysis

Analyze audio recordings for content, sentiment, and key information.

```python
# Analyze audio content
with open("interview.mp3", "rb") as f:
    audio_data = f.read()

encoded_audio = base64.b64encode(audio_data).decode("utf-8")

response = client.chat.completions.create(
    model="gpt-4o-audio-preview",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analyze this interview and provide a summary of the key points, the speaker's tone, and any important insights.",
                },
                {
                    "type": "input_audio",
                    "input_audio": {"data": encoded_audio, "format": "mp3"},
                },
            ],
        },
    ],
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-audio-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


#### Language Learning Applications

Create interactive language learning experiences with audio feedback.

```javascript
// Language learning assistant
async function languageLearningAssistant(audioRecording, targetLanguage) {
  const audioData = fs.readFileSync(audioRecording);
  const encodedAudio = audioData.toString("base64");

  const response = await client.chat.completions.create({
    model: "gpt-4o-audio-preview",
    modalities: ["text", "audio"],
    audio: { voice: "alloy", format: "wav" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `I'm learning ${targetLanguage}. Please listen to my pronunciation and provide feedback on how I can improve.`,
          },
          {
            type: "input_audio",
            input_audio: {
              data: encodedAudio,
              format: "mp3"
            }
          }
        ]
      },
    ]
  });

  return response.choices[0].message.content;
}
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-audio-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


#### Interactive Voice Response Systems

Build sophisticated IVR systems that can understand and respond to user queries.

```python
# Example of an IVR system handler
def process_voice_query(audio_data):
    encoded_audio = base64.b64encode(audio_data).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o-mini-audio-preview",  # Using mini for faster response times
        modalities=["text", "audio"],
        audio={"voice": "alloy", "format": "wav"},
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "This is a customer service voice query. Please identify the customer's request and provide an appropriate response.",
                    },
                    {
                        "type": "input_audio",
                        "input_audio": {"data": encoded_audio, "format": "mp3"},
                    },
                ],
            },
        ],
    )

    # Extract the response text
    text_response = response.choices[0].message.content

    # Convert response to speech
    speech_response = client.audio.speech.create(
        model="gpt-4o-mini-tts", voice="nova", input=text_response
    )

    return {"text_analysis": text_response, "speech_response": speech_response}
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-mini-audio-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


## Advanced Use Cases

### Multilingual Audio Processing

AvalAI's audio processing models support multiple languages, enabling global applications and services. When working with non-English audio:

- **Language Detection**: Models can automatically detect the language in audio content
- **Explicit Language Specification**: For better accuracy, specify the language using the `language` parameter in transcription requests
- **Translation Considerations**: Consider using the translation endpoint for direct translation of non-English audio to English
- **Character Encoding**: Ensure proper character encoding when handling languages with non-Latin scripts

```python
# Example of processing multilingual audio
def process_multilingual_audio(audio_file_path, expected_language=None):
    with open(audio_file_path, "rb") as audio_file:
        # If language is known, specify it for better accuracy
        if expected_language:
            transcript = client.audio.transcriptions.create(
                model="gpt-4o-transcribe", file=audio_file, language=expected_language
            )
        else:
            # Let the model detect the language
            transcript = client.audio.transcriptions.create(
                model="gpt-4o-transcribe", file=audio_file
            )

    return transcript
```

### Audio Processing Pipelines

Complex audio applications often require multiple processing steps. Here's an example of an end-to-end audio processing pipeline:

```python
# Example of an audio processing pipeline
def audio_processing_pipeline(audio_input, output_language="en"):
    # Step 1: Transcribe the audio
    with open(audio_input, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="gpt-4o-transcribe", file=audio_file, response_format="text"
        )

    # Step 2: Analyze the content using a chat model
    analysis = client.chat.completions.create(
        model="gpt-5.4-mini",
        messages=[
            {"role": "system", "content": "You are an expert content analyzer."},
            {
                "role": "user",
                "content": f"Analyze this transcript and summarize the key points: {transcript}",
            },
        ],
    )

    summary = analysis.choices[0].message.content

    # Step 3: Generate audio response in the target language
    response_audio = client.audio.speech.create(
        model="gpt-4o-mini-tts", voice="nova", input=summary
    )

    # Save outputs
    with open("transcript.txt", "w") as f:
        f.write(transcript)

    with open("summary.txt", "w") as f:
        f.write(summary)

    response_audio.stream_to_file("response.mp3")

    return {
        "transcript": transcript,
        "summary": summary,
        "audio_response_path": "response.mp3",
    }
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-transcribe` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### Integration Examples

#### Web Applications

```javascript
// Example of audio recording and processing in a web application
async function handleAudioRecording(audioBlob) {
  // Convert blob to base64
  const reader = new FileReader();
  reader.readAsArrayBuffer(audioBlob);

  return new Promise((resolve) => {
    reader.onloadend = async () => {
      const arrayBuffer = reader.result;
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      // Process with AvalAI
      const response = await client.chat.completions.create({
        model: "gpt-4o-audio-preview",
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "wav" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please transcribe and respond to this audio.",
              },
              {
                type: "input_audio",
                input_audio: {
                  data: base64Audio,
                  format: "mp3"
                }
              },
            ],
          },
        ],
      });

      resolve(response.choices[0].message.content);
    };
  });
}
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-audio-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


#### Mobile Applications

```javascript
// React Native example for audio processing
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

async function recordAndProcessAudio() {
  // Request permissions
  await Audio.requestPermissionsAsync();

  // Set up recording
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
  );

  // Start recording
  await recording.startAsync();

  // After some time, stop recording
  setTimeout(async () => {
    await recording.stopAndUnloadAsync();

    // Get the recording URI
    const uri = recording.getURI();

    // Read the file and convert to base64
    const encodedAudio = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Process with AvalAI (using fetch directly for React Native)
    const response = await fetch("https://api.avalai.ir/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AVALAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-audio-preview",
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "wav" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What did I just say?" },
              {
                type: "input_audio",
                input_audio: {
                  data: encodedAudio,
                  format: "m4a"
                }
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();
    console.log(result.choices[0].message.content);
  }, 5000); // Record for 5 seconds
}
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-mini-audio-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```javascript
import OpenAI from "openai";

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
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Best Practices

### Performance Optimization

To optimize audio processing performance:

- **Audio File Preparation**:

  - Use appropriate sample rates (16kHz is often sufficient for speech)
  - Remove background noise when possible
  - Trim silence from the beginning and end of recordings
  - Use compressed formats like MP3 for efficient transmission

- **Batch Processing**:

  - For large volumes of audio, process files in batches
  - Implement queuing systems for asynchronous processing
  - Consider using smaller models (mini variants) for faster processing

- **Streaming Considerations**:
  - Use streaming for real-time applications
  - Process audio in chunks for long recordings
  - Balance chunk size for optimal latency vs. accuracy

### Cost Management

Effective strategies for managing audio processing costs:

- **Model Selection**:

  - Use mini models for routine tasks (gpt-4o-mini-transcribe vs. gpt-4o-transcribe)
  - Reserve premium models for cases requiring highest accuracy
  - Match model capabilities to actual requirements

- **Caching Strategies**:

  - Cache transcription results for frequently accessed audio
  - Implement content-based hashing to identify duplicate audio
  - Store processed results in a database for reuse

- **Usage Monitoring**:
  - Track token usage across different audio processing tasks
  - Implement usage limits and alerts
  - Analyze patterns to identify optimization opportunities

### Quality Improvement

Techniques to improve audio processing quality:

- **Audio Preprocessing**:

  - Apply noise reduction filters
  - Normalize audio levels
  - Use voice activity detection to remove silence
  - Consider audio enhancement tools before processing

- **Prompt Engineering**:

  - Provide context about the audio content
  - Include domain-specific terminology
  - Specify expected output format
  - Use system messages to guide model behavior

- **Post-processing Techniques**:
  - Apply text correction for common transcription errors
  - Format output for readability
  - Extract structured data from transcriptions
  - Validate outputs against expected patterns

### Error Handling

Robust error handling for audio processing:

- **Common Errors and Solutions**:

  - File format issues: Convert to supported formats
  - Size limitations: Split large files or compress
  - Quality problems: Preprocess audio to improve quality
  - API rate limits: Implement exponential backoff

- **Fallback Strategies**:

  - Implement model fallbacks (try mini model if full model fails)
  - Maintain alternative processing paths
  - Gracefully degrade functionality when needed

- **Retry Mechanisms**:
  - Implement automatic retries with backoff
  - Log failures for analysis
  - Provide user feedback during processing delays

## Gemini Models for Audio Processing

AvalAI provides access to Google's powerful Gemini models for audio processing through the same OpenAI-compatible API interface. These models offer robust capabilities for audio transcription, analysis, and understanding.

### Available Gemini Models

The following Gemini models support audio processing through the AvalAI API:

| Model                              | Description                                                | Best For                                     |
| ---------------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| **gemini-3.1-pro-preview** | Optimized for adaptive thinking and cost efficiency        | Fast, cost-effective audio processing        |
| **gemini-3.5-flash**   | Fast multimodal understanding with configurable thinking  | Complex audio analysis and efficient understanding     |
| **gemini-2.5-pro-preview-tts**     | Advanced text-to-speech with high-quality audio generation | Premium TTS with natural-sounding speech     |
| **gemini-2.5-flash-preview-tts**   | Faster text-to-speech with excellent quality               | Efficient TTS with good quality/cost balance |
| **gemini-2.5-flash** | Optimized for adaptive thinking and cost efficiency        | Fast, cost-effective audio processing        |
| **gemini-2.5-pro**   | Enhanced thinking and reasoning, multimodal understanding  | Complex audio analysis and understanding     |

### Gemini TTS Models & Capabilities

The new Gemini TTS models (`gemini-2.5-pro-preview-tts` and `gemini-2.5-flash-preview-tts`) offer advanced text-to-speech capabilities with high-quality audio generation. These models are available in two distinct modes:

#### Two TTS Modes Available

**1. Normal TTS Mode (Speech Endpoint)**

- Uses Vertex AI Cloud Speech API
- Converts every character in input text to audio like traditional TTS
- Accessed via `v1/audio/speech` endpoint
- Best for: Traditional text-to-speech conversion, reading text aloud, accessibility features

**2. Smart Audio Generation (Chat Completions)**

- Uses Gemini API for intelligent audio generation
- Interprets prompts and generates contextual audio with style control
- Accessed via `v1/chat/completions` endpoint
- Best for: Creative audio content, style-controlled speech, conversational audio

#### Normal TTS Mode Usage

For traditional text-to-speech where you want direct character-to-audio conversion:

!> Gemini 2.5 Pro/Flash Preview TTS support has been discontinued. Please refer to the Smart Audio Generation (Chat Completions) examples below for the recommended solution.

```language-selector
bash=:# cURL Example - Normal TTS Mode
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gemini-2.5-flash-preview-tts",
 "input": "Literature has its own etiquette.",
 "voice": {"name": "Kore", "languageCode": "en-US"}
 }' \
  --output normal_tts_output.mp3

python=:# Python Example - Normal TTS Mode
from openai import OpenAI

client = OpenAI(
    api_key="AVALAI_API_KEY",
    base_url="https://api.avalai.ir/v1",
)

response = client.audio.speech.create(
    model="gemini-2.5-flash-preview-tts",
    input="Literature has its own etiquette.",
    voice={"name": "Kore", "languageCode": "en-US"},
)

# Save the audio file
with open("normal_tts_output.mp3", "wb") as f:
    f.write(response.content)

javascript=:// JavaScript Example - Normal TTS Mode
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.audio.speech.create({
  model: "gemini-2.5-flash-preview-tts",
  input: "Literature has its own etiquette.",
  voice: { name: "Kore", languageCode: "en-US" },
});

const buffer = Buffer.from(await response.arrayBuffer());
await fs.promises.writeFile("normal_tts_output.mp3", buffer);

```

#### Native v1beta API with Multi-Speaker Support

For advanced features including **multi-speaker support**, use the native v1beta API:

```language-selector
bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
	"contents": [{
		"parts":[{
			"text": "Literature has its own etiquette."
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
  | base64 --decode >native_tts_output.pcm

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
    contents="Literature has its own etiquette.",
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
wave_file("native_tts_output.wav", data)

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
	contents: [{ parts: [{ text: "Literature has its own etiquette." }] }],
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
await saveWaveFile('native_tts_output.wav', audioBuffer);

```

> **Note**: Multi-speaker TTS functionality is only available through the native v1beta API, not through the OpenAI-compatible endpoints shown above.


#### Smart Audio Generation Features

These models can transform text input into natural-sounding speech with extensive customization options when used in chat completions mode:

#### Key Features

- **Single and Multi-speaker Audio Generation**: Generate audio for a single voice or create conversations between multiple speakers
- **Style Control via Natural Language**: Control speech style, tone, accent, and pace using natural language prompts
- **30 Voice Options**: Choose from a variety of voices with different characteristics (firm, bright, upbeat, informative, etc.)
- **24 Language Support**: Automatic language detection for 24 languages including English, Spanish, French, Japanese, and more
- **32K Token Context Window**: Process longer texts in a single request
- **Streaming Support**: Get audio output as it's generated for more responsive applications

#### Voice Selection

Gemini TTS models support 30 voice options with different characteristics:

| Voice     | Style      | Voice         | Style         | Voice        | Style       |
| --------- | ---------- | ------------- | ------------- | ------------ | ----------- |
| Zephyr    | Bright     | Puck          | Upbeat        | Charon       | Informative |
| Kore      | Firm       | Fenrir        | Excitable     | Leda         | Youthful    |
| Orus      | Firm       | Aoede         | Breezy        | Callirrhoe   | Easy-going  |
| Autonoe   | Bright     | Enceladus     | Breathy       | Iapetus      | Clear       |
| Umbriel   | Easy-going | Algieba       | Smooth        | Despina      | Smooth      |
| Erinome   | Clear      | Algenib       | Gravelly      | Rasalgethi   | Informative |
| Laomedeia | Upbeat     | Achernar      | Soft          | Alnilam      | Firm        |
| Schedar   | Even       | Gacrux        | Mature        | Pulcherrima  | Forward     |
| Achird    | Friendly   | Zubenelgenubi | Casual        | Vindemiatrix | Gentle      |
| Sadachbia | Lively     | Sadaltager    | Knowledgeable | Sulafat      | Warm        |

#### API Usage Examples

##### Single-Speaker TTS

```language-selector
bash=:# cURL Example for Single-Speaker TTS
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash-preview-tts",
    "messages": [{
        "role": "user",
        "content": "Have a wonderful day!"
    }],
    "modalities": ["audio"],
    "audio": {
        "voice": "Kore",
        "format": "pcm16"
    }
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

response = client.chat.completions.create(
    model="gemini-2.5-flash-preview-tts",
    messages=[{"role": "user", "content": "Have a wonderful day!"}],
    modalities=["audio"],  # Required for TTS models
    audio={"voice": "Kore", "format": "pcm16"},  # Required: must be "pcm16"
)
# Convert the Pydantic object to a dictionary
response_dict = response.model_dump()
audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]
# Decode the base64-encoded string into binary data
import base64

audio_data = base64.b64decode(audio_data_base64)

# Save the audio response
with open("output.mp3", "wb") as f:
    f.write(audio_data)

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-preview-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Have a wonderful day!",
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
  input: "Have a wonderful day!",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Have a wonderful day!",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


##### Multi-Speaker TTS

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

```language-selector
python=:from openai import OpenAI
import base64


def save_audio_as_mp3(audio_data, output_mp3_path, pcm_sample_rate=24000):
    """
    Convert PCM audio data to MP3 format and save it

    Args:
            audio_data (bytes): Raw PCM16 audio data
            output_mp3_path (str): Output MP3 file path
            pcm_sample_rate (int): PCM sample rate (default: 24000 Hz for Gemini)
    """
    try:
        from pydub import AudioSegment

        # Convert PCM to WAV in memory, then to MP3 using pydub
        audio_segment = AudioSegment(
            data=audio_data,
            sample_width=2,  # 16-bit = 2 bytes
            frame_rate=pcm_sample_rate,
            channels=1,  # mono
        )

        # Export as MP3
        audio_segment.export(output_mp3_path, format="mp3")
        print(f"MP3 file saved to {output_mp3_path}")

    except ImportError:
        print("Error: pydub library not installed. Please install with:")
        print("pip install pydub")
        print("You may also need to install ffmpeg")
    except Exception as e:
        print(f"Error converting audio: {e}")


client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

response = client.chat.completions.create(
    model="gemini-2.5-pro-preview-tts",
    messages=[
        {
            "role": "user",
            "content": "TTS the following conversation between Joe and Jane:\nJoe: How's it going today Jane?\nJane: Not too bad, how about you?",
        }
    ],
    modalities=["audio"],  # Required for TTS models
    audio={"voice": "Kore", "format": "pcm16"},  # Required: must be "pcm16"
)

# Convert the Pydantic object to a dictionary
response_dict = response.model_dump()
audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]

# Decode the base64-encoded string into binary data
audio_data = base64.b64decode(audio_data_base64)

# Save as raw PCM
with open("conversation.pcm", "wb") as f:
    f.write(audio_data)

# Convert and save as MP3
save_audio_as_mp3(audio_data, "conversation.mp3", pcm_sample_rate=24000)

bash=:# cURL Example for Style Control
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gemini-2.5-flash-preview-tts",
 "messages": [{
 "role": "user",
 "content": "Say in a spooky whisper: '\''By the pricking of my thumbs... Something wicked this way comes'\''"
 }],
 "modalities": ["audio"],
 "audio": {
 "voice": "Kore",
 "format": "pcm16"
 }
}'

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-preview-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Say in a spooky whisper:",
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
  input: "Say in a spooky whisper:",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Say in a spooky whisper:",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


##### Controlling Speech Style

You can control the style of speech using natural language instructions in your prompt:

```python
# Example of style control
import base64


def save_audio_as_mp3(audio_data, output_mp3_path, pcm_sample_rate=24000):
    """
    Convert PCM audio data to MP3 format and save it

    Args:
            audio_data (bytes): Raw PCM16 audio data
            output_mp3_path (str): Output MP3 file path
            pcm_sample_rate (int): PCM sample rate (default: 24000 Hz for Gemini)
    """
    try:
        from pydub import AudioSegment

        # Convert PCM to WAV in memory, then to MP3 using pydub
        audio_segment = AudioSegment(
            data=audio_data,
            sample_width=2,  # 16-bit = 2 bytes
            frame_rate=pcm_sample_rate,
            channels=1,  # mono
        )

        # Export as MP3
        audio_segment.export(output_mp3_path, format="mp3")
        print(f"MP3 file saved to {output_mp3_path}")

    except ImportError:
        print("Error: pydub library not installed. Please install with:")
        print("pip install pydub")
        print("You may also need to install ffmpeg")
    except Exception as e:
        print(f"Error converting audio: {e}")


response = client.chat.completions.create(
    model="gemini-2.5-flash-preview-tts",
    messages=[
        {
            "role": "user",
            "content": "Say in a spooky whisper: 'By the pricking of my thumbs... Something wicked this way comes'",
        }
    ],
    modalities=["audio"],
    audio={"voice": "Enceladus", "format": "pcm16"},
)

# Convert the Pydantic object to a dictionary
response_dict = response.model_dump()
audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]

# Decode the base64-encoded string into binary data
audio_data = base64.b64decode(audio_data_base64)

# Save as raw PCM
with open("spooky_voice.pcm", "wb") as f:
    f.write(audio_data)

# Convert and save as MP3
save_audio_as_mp3(audio_data, "spooky_voice.mp3", pcm_sample_rate=24000)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-preview-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Say in a spooky whisper:",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Supported Audio Formats

Gemini models support the following audio format MIME types:

- WAV - `audio/wav`
- MP3 - `audio/mp3`
- AIFF - `audio/aiff`
- AAC - `audio/aac`
- OGG Vorbis - `audio/ogg`
- FLAC - `audio/flac`

### TTS Best Practices

#### Audio Format Conversion

When working with Gemini TTS models, keep in mind that:

- **Default Output**: Gemini TTS models return audio data in raw PCM16 format
- **MP3 Conversion**: Use the `save_audio_as_mp3` function to convert PCM to playable MP3 format
- **Sample Rate**: Gemini models use a sample rate of 24,000 Hz
- **Audio Quality**: PCM16 format provides high quality but creates large file sizes

#### Quality and Performance Control

- **Model Selection**: Use `gemini-2.5-flash-preview-tts` for good speed/quality balance
- **Voice Selection**: Different voices work better for different content types (e.g., Kore for formal content)
- **Style Control**: Use natural language instructions to control tone and speech style
- **Text Length**: Break long texts into smaller chunks for better performance

#### Error Handling and Resource Management

```python
def robust_tts_generation(text, voice="Kore", max_retries=3):
    """
    Robust TTS generation with error handling
    """
    import time

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gemini-2.5-flash-preview-tts",
                messages=[{"role": "user", "content": text}],
                modalities=["audio"],
                audio={"voice": voice, "format": "pcm16"},
            )

            response_dict = response.model_dump()
            audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]
            audio_data = base64.b64decode(audio_data_base64)

            return audio_data

        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2**attempt)  # Exponential backoff
            else:
                raise e

    return None
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-preview-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### API Usage & Parameters

Like the GPT audio in chat completions, Gemini audio processing uses the base64-encoded approach, where you send the audio file directly as encoded data through the chat completions endpoint.

#### Endpoint

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


#### Request Parameters

| Parameter        | Type   | Required | Description                                              |
| ---------------- | ------ | -------- | -------------------------------------------------------- |
| `model`          | string | Yes      | Gemini model ID (e.g., `gemini-2.5-flash`)               |
| `messages`       | array  | Yes      | Array of message objects including text and file content |
| `file.file_data` | string | Yes      | Base64-encoded audio data with MIME type prefix          |
| `file.format`    | string | No       | Optional explicit format specification                   |

**Note:** Gemini models when accessed through the OpenAI v1 API schema use the `file` format with `file_data`. This is different from OpenAI audio models which use `input_audio`. For native Gemini API support, see [v1beta documentation](en/api-reference/v1beta.md).

### Code Examples

```language-selector
bash=:# cURL Example for Gemini Audio Processing
# First, encode the audio file to base64
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

python=:# Python Example for Gemini Audio Processing
from openai import OpenAI
import base64

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Get audio data from a file
with open("path/to/your/audio.mp3", "rb") as f:
    file_data = f.read()

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

javascript=:// JavaScript Example for Gemini Audio Processing
import { OpenAI } from "openai";
import fs from "fs";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to get base64 encoded audio
async function getBase64Audio() {
  const buffer = fs.readFileSync("path/to/your/audio.mp3");
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


### Specifying Format Explicitly

You can explicitly specify the format of the audio file to ensure proper processing:

```python
# Create the request with format specification
file_content = [
    {"type": "text", "text": "What is this audio about?"},
    {
        "type": "file",
        "file": {
            "file_data": base64_url,
            "format": "audio/mp3",  # Explicitly specify the format
        },
    },
]
```

### Model-Specific Limitations

Gemini models have the following limitations for audio processing:

- **Maximum file size**: 10MB for audio files
- **Maximum duration**: Up to 120 minutes of audio
- **Format requirements**: Standard audio formats (WAV, MP3, AIFF, AAC, OGG, FLAC)
- **Token usage**: Varies based on audio length and complexity
- **Language support**: Multiple languages supported with varying levels of accuracy

### Use Cases

#### Audio Transcription

```python
# Transcribe audio with Gemini
with open("path/to/audio.mp3", "rb") as f:
    file_data = f.read()

encoded_file = base64.b64encode(file_data).decode("utf-8")
base64_url = f"data:audio/mp3;base64,{encoded_file}"

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
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


#### Audio Content Analysis

```python
# Analyze audio content with Gemini
with open("path/to/audio.mp3", "rb") as f:
    file_data = f.read()

encoded_file = base64.b64encode(file_data).decode("utf-8")
base64_url = f"data:audio/mp3;base64,{encoded_file}"

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
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### Best Practices

#### Handling Large Audio Files

For audio files approaching the 10MB limit:

- Split long recordings into smaller segments
- Process segments sequentially and combine results
- Consider using compression to reduce file size while maintaining quality

#### Dealing with Low-Quality Audio

When working with challenging audio:

- Use noise reduction preprocessing
- Normalize audio levels before encoding
- Provide context in your prompt about the audio conditions
- Consider using more powerful models (like gemini-2.5-pro-preview) for difficult audio

#### Format Conversion Recommendations

For optimal results:

- Convert to MP3 at 128-192 kbps for most spoken content
- Use WAV or FLAC for highest quality when file size permits
- Ensure audio is sampled at 16kHz or higher for speech
- Remove silent portions to optimize processing

For more detailed information, see the [Audio Processing Tutorial in Gemini](en/examples/processing_audio_in_chat_completion_api.md).

## Related Resources

### API References

- [Audio API Documentation](en/api-reference/audio.md)
- [Chat Completions API Documentation](en/api-reference/chat.md)
- [Authentication Guide](en/api-reference/authentication.md)
- [Rate Limits Documentation](en/guides/rate-limits.md)

### Model Documentation

- [gpt-4o-transcribe](en/models/gpt-4o-transcribe.md)
- [gpt-4o-mini-transcribe](en/models/gpt-4o-mini-transcribe.md)
- [gpt-4o-mini-tts](en/models/gpt-4o-mini-tts.md)
- [gemini-2.5-pro-preview-tts](en/models/gemini-2.5-pro-preview-tts.md)
- [gemini-2.5-flash-preview-tts](en/models/gemini-2.5-flash-preview-tts.md)
- [Gemini Models](en/providers/google.md)
- [Model Selection Guide](en/guides/model-selection.md)
