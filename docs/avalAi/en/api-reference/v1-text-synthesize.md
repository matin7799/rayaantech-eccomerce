# Text:Synthesize API - Vertex AI Native Endpoint

The [`v1/text:synthesize`](en/api-reference/v1-text-synthesize.md) endpoint provides native Vertex AI text-to-speech capabilities through AvalAI's platform. This is our first native Vertex AI endpoint, offering full access to Google Cloud's advanced TTS features including multi-speaker synthesis, custom voice configurations, and fine-grained audio control.

## Overview

This endpoint enables high-quality text-to-speech generation using Google's Gemini TTS models ([`gemini-2.5-flash-tts`](en/providers/google.md#gemini-25-flash-tts) and [`gemini-2.5-pro-tts`](en/providers/google.md#gemini-25-pro-tts)) with native Vertex AI format and features.

**Key Features:**
- Native Vertex AI API format
- 30+ natural-sounding voices
- 100+ languages and dialects
- Styling prompts for tone control
- Multi-speaker conversations
- Multiple audio format support
- Advanced prosody control

## Endpoint

```
POST https://api.avalai.ir/v1/text:synthesize
```

## Authentication

Include your AvalAI API key in the Authorization header:

```bash
Authorization: Bearer YOUR_AVALAI_API_KEY
```

## Request Format

### Basic Request

```json
{
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
}
```

### Request with Styling Prompt

```json
{
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
}
```

### Multi-Speaker Request

```json
{
  "input": {
    "text": "Sam: Hello! Bob: Hi there, how are you? Sam: I'm great, thanks!"
  },
  "voice": {
    "languageCode": "en-US",
    "model_name": "gemini-2.5-pro-tts",
    "multiSpeakerVoiceConfig": {
      "speakerVoiceConfigs": [
        {
          "speakerAlias": "Sam",
          "speakerId": "Kore"
        },
        {
          "speakerAlias": "Bob",
          "speakerId": "Charon"
        }
      ]
    }
  },
  "audioConfig": {
    "audioEncoding": "LINEAR16",
    "sampleRateHertz": 24000
  }
}
```

## Request Parameters

### input (required)

The input text to synthesize. Can include optional styling prompt.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | The text to synthesize (max 4000 bytes at the time of writing) |
| `prompt` | string | No | Styling instructions for how to speak the text (max 4000 bytes at the time of writing) |

> **Note:** The maximum character limit is approximately 4,000 bytes at the time of writing this documentation. This limit may change over time. For the most up-to-date information on character limits and other constraints, please refer to the [official Google Cloud Text-to-Speech documentation](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts).

### voice (required)

Voice configuration for synthesis.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `languageCode` | string | Yes | BCP-47 language code (e.g., "en-US", "fa-IR") |
| `name` | string | No | Voice name (e.g., "Kore", "Puck", "Charon") |
| `model_name` | string | Yes | Model to use: `gemini-2.5-flash-tts` or `gemini-2.5-pro-tts` |
| `multiSpeakerVoiceConfig` | object | No | Configuration for multi-speaker synthesis |

#### multiSpeakerVoiceConfig

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `speakerVoiceConfigs` | array | Yes | Array of speaker configurations |

Each speaker configuration contains:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `speakerAlias` | string | Yes | Speaker identifier in the text (e.g., "Sam", "Bob") |
| `speakerId` | string | Yes | Voice name for this speaker |

### audioConfig (required)

Audio output configuration.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audioEncoding` | string | Yes | Audio format: `MP3`, `LINEAR16`, `OGG_OPUS`, `MULAW`, `ALAW` |
| `sampleRateHertz` | integer | No | Sample rate in Hz (16000, 24000, or 48000 for LINEAR16) |

## Response Format

### Success Response

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `audioContent` | string | Base64-encoded audio data |
| `timepoints` | array | Timing information for words/phonemes (if requested) |
| `audioConfig` | object | Audio configuration used for synthesis |

## Available Voices

Gemini 2.5 TTS supports 30+ high-quality voices. Common voices include:

| Voice Name | Description | Best For |
|------------|-------------|----------|
| Kore | Neutral, balanced | General purpose, professional |
| Charon | Deep, resonant | Authoritative, narration |
| Fenrir | Storytelling quality | Audiobooks, narratives |
| Aoede | Strong, authoritative | Leadership, announcements |
| Puck | Bright, energetic | Upbeat content, ads |
| Zephyr | Smooth, professional | Business, presentations |

## Language Support

The endpoint supports 100+ languages including:

**General Availability:**
- English (US, UK, India, Australia)
- Spanish (Spain, Mexico, Latin America)
- French (France, Canada)
- German, Italian, Portuguese (Brazil, Portugal)
- Arabic, Hindi, Japanese, Korean, Chinese (Mandarin)
- Persian (Iran), Turkish, Russian, Ukrainian
- And many more...

For a complete list, see [Gemini 2.5 Flash TTS](en/providers/google.md#gemini-25-flash-tts).

## Audio Formats

### Supported Encodings

| Format | MIME Type | Use Case | Quality |
|--------|-----------|----------|---------|
| MP3 | audio/mpeg | General purpose, web | Good, small files |
| LINEAR16 | audio/L16 | High quality, editing | Best, larger files |
| OGG_OPUS | audio/ogg | Streaming, web | Good, efficient |
| MULAW | audio/basic | Telephony | Lower, compatible |
| ALAW | audio/x-alaw-basic | Telephony | Lower, compatible |

### Sample Rates

- **MP3/OGG_OPUS**: Automatic (typically 24kHz)
- **LINEAR16**: 16000, 24000, or 48000 Hz (specify with `sampleRateHertz`)
- **MULAW/ALAW**: 8000 Hz

## Usage Examples

### cURL Examples

#### Basic Synthesis

```bash
curl -X POST https://api.avalai.ir/v1/text:synthesize \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "text": "Hello, this is a test."
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

#### With Styling Prompt

```bash
curl -X POST https://api.avalai.ir/v1/text:synthesize \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "Say the following in a curious way",
      "text": "OK, so... tell me about this AI thing."
    },
    "voice": {
      "languageCode": "en-US",
      "name": "Puck",
      "model_name": "gemini-2.5-pro-tts"
    },
    "audioConfig": {
      "audioEncoding": "LINEAR16",
      "sampleRateHertz": 24000
    }
  }' \
  | jq -r '.audioContent' | base64 -d >output.wav
```

### Python with Google Cloud SDK

```python
from google.cloud import texttospeech
import os

# Configure client
client = texttospeech.TextToSpeechClient(
    transport="rest",
    client_options={
        "api_endpoint": "https://api.avalai.ir",
        "api_key": os.getenv("AVALAI_API_KEY"),
    },
)

# Prepare request
synthesis_input = texttospeech.SynthesisInput(
    text="Hello! This is a test of the text to speech system."
)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US", name="Kore", model_name="gemini-2.5-flash-tts"
)

audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

# Synthesize speech
response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

# Save to file
with open("output.mp3", "wb") as out:
    out.write(response.audio_content)
    print("Audio content written to output.mp3")
```

### Python with Styling Prompt

```python
from google.cloud import texttospeech
import os

client = texttospeech.TextToSpeechClient(
    transport="rest",
    client_options={
        "api_endpoint": "https://api.avalai.ir",
        "api_key": os.getenv("AVALAI_API_KEY"),
    },
)

synthesis_input = texttospeech.SynthesisInput(
    text="Welcome to the future of artificial intelligence!",
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
```

### Multi-Speaker Conversation

```python
synthesis_input = texttospeech.SynthesisInput(
    text="Sam: Hello! Bob: Hi there, how are you? Sam: I'm great, thanks!"
)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    model_name="gemini-2.5-pro-tts",
    multi_speaker_voice_config=texttospeech.MultiSpeakerVoiceConfig(
        speaker_voice_configs=[
            texttospeech.MultispeakerPrebuiltVoice(
                speaker_alias="Sam", speaker_id="Kore"  # must be English
            ),
            texttospeech.MultispeakerPrebuiltVoice(
                speaker_alias="Bob", speaker_id="Charon"  # must be English
            ),
        ]
    ),
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.LINEAR16, sample_rate_hertz=24000
)

response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

with open("conversation.wav", "wb") as out:
    out.write(response.audio_content)
```

## Error Responses

### Common Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 413 | Request Entity Too Large | Text exceeds size limits |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

```json
{
  "error": {
    "code": 400,
    "message": "Text exceeds maximum length of 900 bytes",
    "status": "INVALID_ARGUMENT"
  }
}
```

## Best Practices

### Text Length Management

```python
def split_text(text, max_bytes=900):
    """Split text into chunks under max_bytes."""
    chunks = []
    current = ""
    for word in text.split():
        test = f"{current} {word}".strip()
        if len(test.encode("utf-8")) <= max_bytes:
            current = test
        else:
            chunks.append(current)
            current = word
    if current:
        chunks.append(current)
    return chunks


# Use for long text
long_text = "Your very long text here..."
chunks = split_text(long_text)
for i, chunk in enumerate(chunks):
    # Synthesize each chunk
    pass
```

### Language Matching

Always ensure the `languageCode` matches your text language:

```python
# For English
voice = {"name": "Kore", "languageCode": "en-US"}

# For Persian
voice = {"name": "Kore", "languageCode": "fa-IR"}

# For Spanish
voice = {"name": "Kore", "languageCode": "es-ES"}
```

### Model Selection

- **Use [`gemini-2.5-flash-tts`](en/providers/google.md#gemini-25-flash-tts)** for:
  - High-volume applications
  - Simple text-to-speech
  - Cost-sensitive use cases

- **Use [`gemini-2.5-pro-tts`](en/providers/google.md#gemini-25-pro-tts)** for:
  - Complex styling prompts
  - Multi-speaker conversations
  - Premium quality requirements

## Pricing

### gemini-2.5-flash-tts
- Input: $0.50 / 1M tokens (characters)
- Cached Input: $0.25 / 1M tokens
- Audio Output: $10.00 / 1M tokens (32 tokens per second of audio)

### gemini-2.5-pro-tts
- Input: $1.00 / 1M tokens (characters)
- Cached Input: $0.50 / 1M tokens
- Output: $20.00 / 1M tokens (32 tokens per second of audio)

**Example Cost Calculation:**
- 30 seconds of audio = 30 × 32 = 960 audio tokens
- 100 characters input = 100 input tokens
- Total for Flash TTS: $0.00005 (input) + $0.0096 (output) ≈ $0.00965

## Related Documentation

- [Gemini 2.5 Flash TTS Model](en/providers/google.md#gemini-25-flash-tts)
- [Gemini 2.5 Pro TTS Model](en/providers/google.md#gemini-25-pro-tts)
- [Audio Speech API (OpenAI-compatible)](en/api-reference/audio.md)
- [Chat Completions API](en/api-reference/chat.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [News: Advanced TTS Models Added](en/news/2025-10-20-advanced-tts-and-transcription-models-added.md)
- [Vertex AI Documentation](https://cloud.google.com/text-to-speech/docs/gemini-tts)