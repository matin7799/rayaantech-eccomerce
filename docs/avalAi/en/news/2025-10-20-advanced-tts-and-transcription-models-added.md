# Advanced TTS and Transcription Models Added

**Date:** 2025-10-20

## Summary

We announce the addition of advanced text-to-speech and transcription capabilities to the AvalAI platform. Google's [`gemini-2.5-flash-tts`](en/providers/google.md#gemini-25-flash-tts) and [`gemini-2.5-pro-tts`](en/providers/google.md#gemini-25-pro-tts) models are now available through our first native Vertex AI endpoint [`v1/text:synthesize`](en/api-reference/v1-text-synthesize.md), alongside OpenAI-compatible formats. Additionally, OpenAI's [`gpt-4o-transcribe-diarize`](en/providers/openai.md#gpt-4o-transcribe-diarize) model brings enhanced transcription with speaker diarization capabilities.

---

## Details

### Google Vertex AI Text-to-Speech Models

We introduce two high-quality text-to-speech models from Google Vertex AI, offering natural-sounding voice synthesis with extensive language support and customization options.

#### gemini-2.5-flash-tts

[`gemini-2.5-flash-tts`](en/providers/google.md#gemini-25-flash-tts) is optimized for speed and cost-efficiency, making it ideal for high-volume applications requiring fast, natural-sounding speech generation.

**Key Features:**
- **Fast Generation**: Optimized for low-latency text-to-speech conversion
- **30+ Voices**: Wide selection of natural-sounding voices
- **Multi-language Support**: Supports 100+ languages and dialects
- **Cost-Effective**: Best price-to-performance ratio for TTS applications
- **Styling Prompts**: Control speech style and tone with natural language prompts

**Pricing:**

| Model | Input | Cached Input | Audio Output | Output |
|-------|-------|--------------|--------------|--------|
| gemini-2.5-flash-tts | $0.50/1M tokens | $0.25/1M tokens | $10.00/1M tokens | $10.00/1M tokens |

*Note: Audio output is calculated at 32 tokens per second of audio. Example: 30 seconds of audio = 960 audio tokens.*

#### gemini-2.5-pro-tts

[`gemini-2.5-pro-tts`](en/providers/google.md#gemini-25-pro-tts) provides premium quality text-to-speech with advanced controllability for complex styling requirements and multi-speaker scenarios.

**Key Features:**
- **Premium Quality**: Highest quality voice synthesis
- **Advanced Controllability**: Fine-grained control over prosody and style
- **Multi-Speaker Support**: Generate conversations with multiple distinct voices
- **Complex Prompts**: Handles sophisticated styling instructions
- **Professional Applications**: Ideal for audiobooks, premium content, and enterprise use cases

**Pricing:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gemini-2.5-pro-tts | $1.00/1M tokens | $0.50/1M tokens | $20.00/1M tokens |

### Native Vertex AI Endpoint Support

We announce support for the native Vertex AI endpoint [`v1/text:synthesize`](en/api-reference/v1-text-synthesize.md), marking our first native Vertex AI endpoint integration. This endpoint provides full access to Vertex AI's text-to-speech capabilities, including advanced features like multi-speaker synthesis, custom voice configurations, and fine-grained audio control.

The [`gemini-2.5-flash-tts`](en/providers/google.md#gemini-25-flash-tts) and [`gemini-2.5-pro-tts`](en/providers/google.md#gemini-25-pro-tts) models are Vertex AI exclusive models and are not available through the Gemini API [`v1beta`](en/api-reference/v1beta.md) endpoint. However, users can access these models through multiple OpenAI-compatible endpoints for easy integration:

**Available Endpoints:**
- [`v1/chat/completions`](en/api-reference/chat-completions.md) - For TTS in conversational contexts
- [`v1/audio/speech`](en/api-reference/audio-speech.md) - For direct TTS generation (OpenAI-compatible)
- [`v1/text:synthesize`](en/api-reference/v1-text-synthesize.md) - Native Vertex AI format with full features

We will gradually add support for other Vertex AI capabilities to provide comprehensive access to Google Cloud's AI services.

### OpenAI Transcription Enhancement

#### gpt-4o-transcribe-diarize

[`gpt-4o-transcribe-diarize`](en/providers/openai.md#gpt-4o-transcribe-diarize) is an enhanced version of [`gpt-4o-transcribe`](en/providers/openai.md#gpt-4o-transcribe) with improved speaker diarization capabilities, enabling accurate identification and separation of multiple speakers in audio recordings.

**Key Features:**
- **Speaker Diarization**: Automatically identifies and labels different speakers
- **Fast Transcription**: Convert 10 minutes of audio in ~15 seconds
- **100+ Languages**: Global language coverage with high accuracy
- **Same Pricing**: Available at the same cost as gpt-4o-transcribe
- **Enterprise-Grade**: Ultra-low latency with production-ready reliability

**Pricing:**

| Model | Text Input | Audio Input | Cached Input | Output |
|-------|------------|-------------|--------------|--------|
| gpt-4o-transcribe-diarize | $2.50/1M tokens | $6.00/1M tokens | $1.50/1M tokens | $10.00/1M tokens |

**Available Endpoint:**
- [`v1/audio/transcriptions`](en/api-reference/audio-transcriptions.md) - OpenAI-compatible transcription

---

## API Request/Response Examples

### Gemini TTS via Chat Completions

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash-tts",
    "messages": [
      {
        "role": "user",
        "content": "Say hello in a friendly and welcoming way"
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1729425000,
  "model": "gemini-2.5-flash-tts",
  "system_fingerprint": null,
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "//NExAASKAKgAQAAAP8A8A8AZ...[base64 encoded audio content truncated]...",

        "thinking_blocks": [],
        "annotations": []
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 96,
    "total_tokens": 108,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 12,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0000966000",
    "irt": 11.08,
    "exchange_rate": 114600
  }
}
```

### Gemini TTS via Audio Speech Endpoint

#### Example Request

```bash
curl -X POST https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash-tts",
    "input": "Hello! Welcome to AvalAI platform.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

### Gemini TTS via Native Vertex AI Endpoint

#### Example Request

```bash
curl -X POST https://api.avalai.ir/v1/text:synthesize \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "text": "Hello, this is a test of the text to speech system."
    },
    "voice": {
      "languageCode": "en-US",
      "name": "Kore",
      "model_name": "gemini-2.5-flash-tts"
    },
    "audioConfig": {
      "audioEncoding": "MP3"
    }
  }' \
  | jq -r '.audioContent' | base64 -d >output.mp3
```

#### Example Response

```json
{
  "audioContent": "//NExAASKAKgAQAAAP8A8A...[base64 encoded audio]...",

  "timepoints": [],
  "audioConfig": {
    "audioEncoding": "MP3",
    "sampleRateHertz": 24000
  }
}
```

### GPT-4o Transcribe with Diarization

#### Example Request

```bash
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F file="@/path/to/audio.mp3" \
  -F model="gpt-4o-transcribe-diarize" \
  -F language="en" \
  -F response_format="verbose_json"
```

#### Example Response

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 45.5,
  "text": "Speaker 1: Hello, welcome to the meeting. Speaker 2: Thank you, glad to be here. Speaker 1: Let's discuss the project timeline.",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 2.5,
      "text": "Hello, welcome to the meeting.",
      "speaker": "SPEAKER_1",
      "tokens": [
        1234,
        5678
      ],
      "temperature": 0.0,
      "avg_logprob": -0.25,
      "compression_ratio": 1.2,
      "no_speech_prob": 0.01
    },
    {
      "id": 1,
      "seek": 0,
      "start": 2.5,
      "end": 5.0,
      "text": "Thank you, glad to be here.",
      "speaker": "SPEAKER_2",
      "tokens": [
        9876,
        5432
      ],
      "temperature": 0.0,
      "avg_logprob": -0.22,
      "compression_ratio": 1.1,
      "no_speech_prob": 0.02
    }
  ]
}
```

---

## SDK Usage Examples

### Gemini TTS with OpenAI SDK

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash-tts",
    "input": "Hello! This is a test of the text to speech system.",
    "voice": "alloy"
  }' \
  --output speech.mp3

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

response = client.audio.speech.create(
    model="gemini-2.5-flash-tts",
    voice="alloy",
    input="Hello! This is a test of the text to speech system.",
)

response.stream_to_file("speech.mp3")
print("Audio saved to speech.mp3")

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const response = await client.audio.speech.create({
    model: "gemini-2.5-flash-tts",
    voice: "alloy",
    input: "Hello! This is a test of the text to speech system.",
});

const buffer = Buffer.from(await response.arrayBuffer());
await fs.promises.writeFile("speech.mp3", buffer);
console.log("Audio saved to speech.mp3");

```

### Advanced TTS with Styling Prompts

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/text:synthesize \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "Say the following in an excited and energetic way",
      "text": "Welcome to the future of AI!"
    },
    "voice": {
      "languageCode": "en-US",
      "name": "Puck",
      "model_name": "gemini-2.5-pro-tts"
    },
    "audioConfig": {
      "audioEncoding": "MP3"
    }
  }' \
  | jq -r '.audioContent' | base64 -d >output.mp3

python=:from google.cloud import texttospeech
import os

client = texttospeech.TextToSpeechClient(
    transport="rest",
    client_options={
        "api_endpoint": "https://api.avalai.ir",
        "api_key": os.getenv("AVALAI_API_KEY"),
    },
)

synthesis_input = texttospeech.SynthesisInput(
    text="Welcome to the future of AI!",
    prompt="Say the following in an excited and energetic way",
)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US", name="Puck", model_name="gemini-2.5-pro-tts"
)

audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

with open("output.mp3", "wb") as out:
    out.write(response.audio_content)
    print("Audio saved to output.mp3")

javascript=:import fetch from "node-fetch";
import fs from "fs";

const response = await fetch("https://api.avalai.ir/v1/text:synthesize", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        input: {
            prompt: "Say the following in an excited and energetic way",
            text: "Welcome to the future of AI!"
        },
        voice: {
            languageCode: "en-US",
            name: "Puck",
            model_name: "gemini-2.5-pro-tts"
        },
        audioConfig: {
            audioEncoding: "MP3"
        }
    })
});

const data = await response.json();
const audioBuffer = Buffer.from(data.audioContent, "base64");
await fs.promises.writeFile("output.mp3", audioBuffer);
console.log("Audio saved to output.mp3");

```

### GPT-4o Transcribe with Diarization

```language-selector
bash=:curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F file="@/path/to/audio.mp3" \
  -F model="gpt-4o-transcribe-diarize" \
  -F response_format="verbose_json"

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

with open("/path/to/audio.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="gpt-4o-transcribe-diarize",
        file=audio_file,
        response_format="verbose_json",
    )

# Access speaker information from segments
for segment in transcript.segments:
    print(f"{segment.speaker}: {segment.text}")

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

const transcript = await client.audio.transcriptions.create({
    file: fs.createReadStream("/path/to/audio.mp3"),
    model: "gpt-4o-transcribe-diarize",
    response_format: "verbose_json",
});

// Access speaker information from segments
transcript.segments.forEach(segment => {
    console.log(`${segment.speaker}: ${segment.text}`);
});

```

---

## Use Cases

### Text-to-Speech Applications

**Content Creation:**
- Audiobook narration with multiple character voices
- Podcast generation from written content
- Educational content with engaging narration

**Accessibility:**
- Screen readers with natural-sounding voices
- Audio descriptions for visual content
- Multi-language accessibility services

**Enterprise:**
- IVR systems with dynamic responses
- Voice notifications and alerts
- Customer service voice responses

### Transcription with Speaker Identification

**Meeting Analysis:**
- Automatically transcribe and attribute speaker contributions
- Generate meeting summaries with speaker context
- Track individual participation and speaking time

**Customer Service:**
- Analyze customer-agent interactions
- Quality assurance with speaker-specific metrics
- Compliance monitoring with accurate attribution

**Content Production:**
- Interview transcription with speaker labels
- Podcast post-production and editing
- Subtitle generation for multi-speaker content

---

## Related Links

- [Google Models Documentation](en/providers/google.md)
- [OpenAI Models Documentation](en/providers/openai.md)
- [Vertex AI Text:Synthesize API Reference](en/api-reference/v1-text-synthesize.md)
- [Audio API Reference](en/api-reference/audio.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [Vertex AI Documentation](https://cloud.google.com/text-to-speech/docs/gemini-tts)