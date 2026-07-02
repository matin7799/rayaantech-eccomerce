# New Provider: ElevenLabs Speech Models and 12 New Cloudflare AI Models Added

**Date:** 2026-02-03 / (1404-11-14)

## Summary

AvalAI adds ElevenLabs as a new provider with 7 speech models offering advanced text-to-speech and speech-to-text capabilities. Additionally, 12 new Cloudflare AI models are now available, including FLUX image generation, embedding models, and chat completion models from multiple providers.

---

## Details

### ElevenLabs - New Speech Provider

[ElevenLabs](https://elevenlabs.io/docs/api-reference) is now available on AvalAI, bringing industry-leading text-to-speech and speech-to-text capabilities. ElevenLabs models deliver natural, expressive speech synthesis and accurate transcription across multiple languages. [Documentation](en/providers/elevenlabs.md)

#### Text-to-Speech Models

Five TTS models are now available via the `v1/audio/speech` endpoint:

| Model | Description | Latency | Languages |
|-------|-------------|---------|-----------|
| `eleven_turbo_v2` | High quality, low-latency English TTS | ~250-300ms | English |
| `eleven_turbo_v2_5` | High quality, low-latency multilingual TTS | ~250-300ms | 32 languages |
| `eleven_flash_v2` | Ultra-fast English TTS | ~75ms | English |
| `eleven_flash_v2_5` | Ultra-fast multilingual TTS | ~75ms | 32 languages |
| `eleven_multilingual_v2` | Most lifelike, emotionally rich TTS | Higher | 29 languages |

**Key Features:**
- **Natural Speech**: Human-like and expressive voice generation
- **Multi-language Support**: Up to 32 languages with Flash v2.5 and Turbo v2.5
- **Low Latency**: Ultra-fast ~75ms latency with Flash models
- **OpenAI-Compatible**: Standard `v1/audio/speech` endpoint

**Pricing:**

| Model | Output Cost (per second) |
|-------|-------------------------|
| `eleven_turbo_v2` | $0.0025/sec |
| `eleven_turbo_v2_5` | $0.0025/sec |
| `eleven_flash_v2` | $0.0025/sec |
| `eleven_flash_v2_5` | $0.0025/sec |
| `eleven_multilingual_v2` | $0.005/sec |

#### Speech-to-Text Models

Two state-of-the-art transcription models via the `v1/audio/transcriptions` endpoint:

| Model | Description | Languages |
|-------|-------------|-----------|
| `scribe_v2` | State-of-the-art speech recognition | 90+ languages |
| `scribe_v1` | Legacy transcription model | 90+ languages |

**Scribe v2 Features:**
- **Accurate Transcription**: 90+ languages supported
- **Keyterm Prompting**: Up to 100 terms for domain-specific accuracy
- **Entity Detection**: Up to 56 entity types
- **Word-level Timestamps**: Precise timing for each word
- **Speaker Diarization**: Up to 32 speakers identification
- **Smart Language Detection**: Automatic language identification

**Pricing:**

| Model | Input Cost (per second) |
|-------|------------------------|
| `scribe_v2` | $0.00009722/sec |
| `scribe_v1` | $0.00009722/sec |

---

### Cloudflare AI - 12 New Models

We've expanded our Cloudflare AI offerings with 12 new models spanning image generation, embeddings, and chat completions. [Documentation](en/providers/cloudflare.md)

#### Image Generation Models (v1/images/generations)

Five new image generation models are now available:

| Model | Description | Base Price (1MP) |
|-------|-------------|------------------|
| `cf.flux-2-klein-9b` | FLUX 2 Klein 9B parameter model | $0.015/image |
| `cf.flux-2-klein-4b` | FLUX 2 Klein 4B compact model | $0.010/image |
| `cf.flux-2-dev` | FLUX 2 Development model | $0.010/image |
| `cf.lucid-origin` | Lucid Origin image generation | $0.015/image |
| `cf.phoenix-1.0` | Phoenix 1.0 image generation | $0.015/image |

**Resolution-based Pricing:**

| Model | 1MP | 2MP | 3MP | 4MP |
|-------|-----|-----|-----|-----|
| `cf.flux-2-klein-9b` | $0.015 | $0.017 | $0.019 | $0.021 |
| `cf.flux-2-klein-4b` | $0.010 | $0.012 | $0.014 | $0.016 |
| `cf.flux-2-dev` | $0.010 | $0.011 | $0.012 | $0.013 |
| `cf.lucid-origin` | $0.015 | $0.017 | $0.019 | $0.021 |
| `cf.phoenix-1.0` | $0.015 | $0.017 | $0.019 | $0.021 |

#### Embedding Models (v1/embeddings)

Three new embedding models for semantic search and text analysis:

| Model | Description | Input Price ($/1M tokens) |
|-------|-------------|--------------------------|
| `cf.qwen3-embedding-0.6b` | Qwen3 Embedding 0.6B from Alibaba | $0.012 |
| `cf.plamo-embedding-1b` | PLaMo Embedding 1B from PFN | $0.019 |
| `cf.embeddinggemma-300m` | EmbeddingGemma 300M from Google | $0.012 |

#### Chat Completion Models (v1/chat/completions, v1/responses)

Four new chat models with partial v1/responses support:

| Model | Owner | Input ($/1M) | Cached Input ($/1M) | Output ($/1M) |
|-------|-------|--------------|---------------------|---------------|
| `cf.qwen3-30b-a3b-fp8` | Alibaba | $0.051 | $0.025 | $0.34 |
| `cf.granite-4.0-h-micro` | IBM | $0.017 | $0.008 | $0.11 |
| `cf.gpt-oss-120b` | OpenAI | $0.35 | $0.175 | $0.75 |
| `cf.gpt-oss-20b` | OpenAI | $0.20 | $0.10 | $0.30 |

---

## API Request/Response Examples

### ElevenLabs Text-to-Speech Example

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

### ElevenLabs Transcription Example

```bash
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F file=@audio.mp3 \
  -F model=scribe_v2
```

**Example Response:**

```json
{
  "text": "The quick brown fox jumped over the lazy dog.",
  "task": "transcribe",
  "language": "en",
  "duration": 2.5,
  "words": [
    {"word": "The", "start": 0.0, "end": 0.15},
    {"word": "quick", "start": 0.15, "end": 0.35},
    ...
  ]
}
```

### Cloudflare Image Generation Example

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "cf.flux-2-klein-9b",
    "prompt": "A futuristic cityscape at sunset with flying cars",
    "n": 1,
    "size": "1024x1024"
  }'
```

### Cloudflare Embedding Example

```bash
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "cf.qwen3-embedding-0.6b",
    "input": "Machine learning enables computers to learn from data."
  }'
```

---

## Price Comparison

### ElevenLabs TTS Models

| Model | Output Cost/Second | Best For |
|-------|--------------------|----------|
| `eleven_flash_v2_5` | $0.0025 | Real-time apps, low latency |
| `eleven_turbo_v2_5` | $0.0025 | Balanced quality and speed |
| `eleven_multilingual_v2` | $0.005 | Highest quality, emotional range |

### Cloudflare Image Models

| Model | Per Image (1MP) | Best For |
|-------|-----------------|----------|
| `cf.flux-2-klein-4b` | $0.010 | Cost-effective generation |
| `cf.flux-2-dev` | $0.010 | Development and testing |
| `cf.flux-2-klein-9b` | $0.015 | Higher quality output |

---

## Related Resources

- [ElevenLabs Models Documentation](en/providers/elevenlabs.md)
- [Cloudflare Models Documentation](en/providers/cloudflare.md)
- [Audio API Reference](en/api-reference/audio.md)
- [Images API Reference](en/api-reference/images.md)
- [Embeddings API Reference](en/api-reference/embeddings.md)
- [Official ElevenLabs API Documentation](https://elevenlabs.io/docs/api-reference)
