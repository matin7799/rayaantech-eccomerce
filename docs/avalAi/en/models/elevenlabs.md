# ElevenLabs Speech Models

[ElevenLabs](https://elevenlabs.io/docs/api-reference) is a leading AI audio company specializing in natural, expressive speech synthesis and accurate speech recognition. Through AvalAI, you can access 8 powerful ElevenLabs models for text-to-speech and speech-to-text tasks with industry-leading quality and performance.

## Available Models

ElevenLabs models span two categories: Text-to-Speech (TTS) for generating natural-sounding audio from text, and Speech-to-Text (STT) for transcribing spoken audio with high accuracy.

### Text-to-Speech Models

Six TTS models are available via the `v1/audio/speech` endpoint, each optimized for different use cases:

| Model | Description | Latency | Languages | Character Limit |
|-------|-------------|---------|-----------|-----------------|
| `eleven_v3` | Most advanced, emotionally rich multi-speaker TTS | Higher | 70+ languages | 5,000 |
| `eleven_multilingual_v2` | Most lifelike, emotionally rich TTS | Higher | 29 languages | 10,000 |
| `eleven_turbo_v2_5` | High quality, low-latency multilingual | ~250-300ms | 32 languages | 40,000 |
| `eleven_turbo_v2` | High quality, low-latency English | ~250-300ms | English | 40,000 |
| `eleven_flash_v2_5` | Ultra-fast multilingual TTS | ~75ms | 32 languages | 40,000 |
| `eleven_flash_v2` | Ultra-fast English TTS | ~75ms | English | 40,000 |

#### Eleven v3 - Latest & Most Advanced

**Eleven v3** is ElevenLabs' latest and most advanced speech synthesis model. It produces natural, life-like speech with high emotional range and contextual understanding across 70+ languages.

**Best for:**
- Character discussions with multiple interacting speakers
- Audiobook production with complex emotional delivery
- Emotional dialogue generation with high emotional range
- Natural multi-speaker dialogue support

**Key Features:**
- Natural multi-speaker dialogue support
- High emotional range and contextual understanding
- 70+ languages supported
- 5,000 character limit per request

**Supported Languages:** Afrikaans, Arabic, Armenian, Assamese, Azerbaijani, Belarusian, Bengali, Bosnian, Bulgarian, Catalan, Cebuano, Chichewa, Croatian, Czech, Danish, Dutch, English, Estonian, Filipino, Finnish, French, Galician, Georgian, German, Greek, Gujarati, Hausa, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Irish, Italian, Japanese, Javanese, Kannada, Kazakh, Kirghiz, Korean, Latvian, Lingala, Lithuanian, Luxembourgish, Macedonian, Malay, Malayalam, Mandarin Chinese, Marathi, Nepali, Norwegian, Pashto, Persian, Polish, Portuguese, Punjabi, Romanian, Russian, Serbian, Sindhi, Slovak, Slovenian, Somali, Spanish, Swahili, Swedish, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu, Vietnamese, Welsh

#### Eleven Multilingual v2 - Premium Quality

The most advanced, emotionally-aware speech synthesis model with rich emotional expression and consistent voice quality across languages.

**Best for:**
- Character voiceovers for gaming and animation
- Professional corporate videos and e-learning
- Multilingual projects requiring consistent voice
- Applications where lifelike speech is paramount

**Supported Languages:** English, Japanese, Chinese, German, Hindi, French, Korean, Portuguese, Italian, Spanish, Indonesian, Dutch, Turkish, Filipino, Polish, Swedish, Bulgarian, Romanian, Arabic, Czech, Greek, Finnish, Croatian, Malay, Slovak, Danish, Tamil, Ukrainian, Russian

#### Eleven Turbo v2.5 - Balanced Performance

High quality, low-latency model with excellent balance of quality and speed, supporting 32 languages.

**Best for:**
- Real-time voice agents and chatbots
- Interactive applications requiring quick response
- Multilingual production deployments
- Balance between quality and latency

**Supported Languages:** All Multilingual v2 languages plus Hungarian, Norwegian, Vietnamese

#### Eleven Flash v2.5 - Ultra-Low Latency

The fastest speech synthesis model designed for real-time applications with ~75ms latency.

**Best for:**
- Real-time voice agents (Agents Platform)
- Interactive games and applications
- Large-scale bulk TTS processing
- Cost-effective, fast speech synthesis

### Speech-to-Text Models

Two state-of-the-art transcription models via the `v1/audio/transcriptions` endpoint:

| Model | Description | Languages | Features |
|-------|-------------|-----------|----------|
| `scribe_v2` | State-of-the-art speech recognition | 90+ languages | Diarization, timestamps, entity detection |
| `scribe_v1` | Legacy transcription model | 90+ languages | Basic transcription |

#### Scribe v2 - Advanced Transcription

State-of-the-art speech recognition with comprehensive features:

- **Accurate Transcription**: 90+ languages supported
- **Keyterm Prompting**: Up to 100 terms for domain-specific accuracy
- **Entity Detection**: Up to 56 entity types recognized
- **Word-level Timestamps**: Precise timing for each word
- **Speaker Diarization**: Identify up to 32 speakers
- **Dynamic Audio Tagging**: Automatic audio event detection
- **Smart Language Detection**: Automatic language identification

## Pricing

### Text-to-Speech Pricing

ElevenLabs TTS models are priced per second of generated audio:

| Model | Output Cost (per second) | Best For |
|-------|-------------------------|----------|
| `eleven_v3` | $0.005/sec | Most advanced, multi-speaker |
| `eleven_turbo_v2` | $0.0025/sec | English, low latency |
| `eleven_turbo_v2_5` | $0.0025/sec | Multilingual, balanced |
| `eleven_flash_v2` | $0.0025/sec | English, fastest |
| `eleven_flash_v2_5` | $0.0025/sec | Multilingual, fastest |
| `eleven_multilingual_v2` | $0.005/sec | Highest quality |

### Speech-to-Text Pricing

Scribe models are priced per second of input audio:

| Model | Input Cost (per second) |
|-------|------------------------|
| `scribe_v2` | $0.00009722/sec |
| `scribe_v1` | $0.00009722/sec |

## API Endpoints

ElevenLabs models are available through AvalAI's OpenAI-compatible API:

- **Text-to-Speech**: [`v1/audio/speech`](en/api-reference/audio.md#text-to-speech-tts)
- **Transcriptions**: [`v1/audio/transcriptions`](en/api-reference/audio.md#transcriptions)

## Example Usage

### Text-to-Speech Generation

```python
from openai import OpenAI
from pathlib import Path

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate speech with Flash model for low latency
speech_file = Path("./speech.mp3")

response = client.audio.speech.create(
    model="eleven_flash_v2_5",
    input="Hello! This is a demonstration of ElevenLabs text-to-speech via AvalAI.",
    voice="coral",
)

response.stream_to_file(speech_file)
print(f"Audio saved to {speech_file}")
```

### cURL Example - TTS

```bash
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "eleven_flash_v2_5",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "coral"
  }' \
  --output speech.mp3
```

### High Quality TTS with Multilingual v2

```python
# Use Multilingual v2 for highest quality output
response = client.audio.speech.create(
    model="eleven_multilingual_v2",
    input="Welcome to our platform. We're delighted to have you here.",
    voice="alloy",
)

response.stream_to_file("premium_speech.mp3")
```

### Speech Transcription

```bash
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F file=@audio.mp3 \
  -F model=scribe_v2
```

**Example Response:**

```json
{
  "text": "Hello, this is a sample transcription from the audio file.",
  "task": "transcribe",
  "language": "en",
  "duration": 3.5,
  "words": [
    {
      "word": "Hello",
      "start": 0.0,
      "end": 0.35
    },
    {
      "word": "this",
      "start": 0.4,
      "end": 0.55
    },
    {
      "word": "is",
      "start": 0.55,
      "end": 0.65
    },
    {
      "word": "a",
      "start": 0.65,
      "end": 0.72
    },
    {
      "word": "sample",
      "start": 0.72,
      "end": 1.0
    }
  ]
}
```

## Available Voices

ElevenLabs models support multiple voices. Common voices include:

- `alloy` - Neutral, professional
- `coral` - Warm, friendly
- `echo` - Clear, expressive
- `fable` - Storytelling, narrative
- `nova` - Energetic, upbeat
- `onyx` - Deep, authoritative
- `sage` - Calm, wise
- `shimmer` - Bright, cheerful

## Model Selection Guide

| Use Case | Recommended Model |
|----------|-------------------|
| Real-time voice agents | `eleven_flash_v2_5` |
| Interactive applications | `eleven_flash_v2_5` or `eleven_turbo_v2_5` |
| Audiobook production | `eleven_multilingual_v2` |
| Character voiceovers | `eleven_multilingual_v2` |
| Bulk processing | `eleven_flash_v2_5` |
| English-only projects | `eleven_turbo_v2` or `eleven_flash_v2` |
| Multilingual content | `eleven_turbo_v2_5` or `eleven_multilingual_v2` |
| High-accuracy transcription | `scribe_v2` |

## Best Practices

### For Text-to-Speech

1. **Choose the right model**: Use Flash for speed, Multilingual v2 for quality
2. **Voice selection**: Match voice characteristics to your content
3. **Text preparation**: Clean and format text for natural speech patterns
4. **Language consistency**: Use language-appropriate models for best results

### For Transcription

1. **Audio quality**: Higher quality input produces better transcriptions
2. **Use keyterm prompting**: Add domain-specific terms for accuracy
3. **Speaker diarization**: Enable when multiple speakers are present
4. **Language hints**: Specify language when known for better accuracy

## Related Resources

- [Audio API Reference](en/api-reference/audio.md)
- [Official ElevenLabs API Documentation](https://elevenlabs.io/docs/api-reference)
- [ElevenLabs Models Overview](https://elevenlabs.io/docs/overview/models)
- [Pricing](en/pricing.md)
