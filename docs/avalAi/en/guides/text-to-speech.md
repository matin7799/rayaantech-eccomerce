# Text to Speech Guide

Text-to-Speech (TTS) converts written text into natural-sounding spoken audio. AvalAI exposes a wide catalog of TTS models — from OpenAI's `tts-1` / `tts-1-hd` / `gpt-4o-mini-tts`, to Google's Gemini TTS, Groq's PlayAI voices, and the full ElevenLabs suite (`eleven_v3`, `eleven_multilingual_v2`, `eleven_turbo_v2(_5)`, `eleven_flash_v2(_5)`) — all through a single OpenAI-compatible API.

This guide walks you through choosing a model, picking a voice, generating speech, controlling style & format, streaming audio, building multi-speaker dialogues, and applying production best practices.

For a quick parameter reference, see the [Audio API Reference](en/api-reference/audio.md). For a broader overview of all audio capabilities (TTS + STT + audio-in-chat), see the [Audio Processing Guide](en/guides/audio-processing.md). For the companion guide on transcription, see the [Speech to Text Guide](en/guides/speech-to-text.md).

## When to Use Text-to-Speech

Text-to-Speech is ideal for:

- **Accessibility** – reading articles, notifications, and UIs aloud for visually impaired users
- **Voice assistants & agents** – giving your LLM a voice in real-time conversational apps
- **Audiobooks & narration** – generating long-form narration for stories, courses, and documentation
- **Content localization** – producing voice-overs in 30–90+ languages without hiring voice actors
- **IVR & phone bots** – dynamic menu prompts, confirmations, and notifications
- **Character voices** – multi-speaker dialogue for games, animations, and podcasts
- **Notifications & alerts** – turning alerts into audio cues for wearables and in-car systems

If you instead need a model that can **both listen and speak** in a single conversation, use an audio-capable chat model (`gpt-4o-audio-preview`, `gpt-5-audio`, Gemini) — see the [Audio Processing Guide](en/guides/audio-processing.md).

## Choosing a Model

AvalAI exposes many TTS models via the `/v1/audio/speech` endpoint. Check the live availability and pricing on the [Model Details page](en/models/model-details.md).

| Model                         | Provider   | Best For                                                            | Latency     | Languages    | Streaming |
| ----------------------------- | ---------- | ------------------------------------------------------------------- | ----------- | ------------ | --------- |
| `tts-1`                       | OpenAI     | Real-time narration, fast cost-efficient speech                     | Low         | ~29          | ✅        |
| `tts-1-hd`                    | OpenAI     | Higher audio quality for podcasts & production voice-overs          | Medium      | ~29          | ✅        |
| `gpt-4o-mini-tts`             | OpenAI     | Controllable style/tone via natural-language `instructions`         | Medium      | ~29          | ✅        |
| `gemini-2.5-flash-preview-tts`| Google     | Multi-speaker, expressive, language-aware Gemini voices             | Medium      | 20+          | ❌ (native v1beta) |
| `gemini-2.5-pro-preview-tts`  | Google     | Highest-quality Gemini TTS, complex scripts                         | Higher      | 20+          | ❌ (native v1beta) |
| `groq.playai-tts`             | groq       | Low-latency English voices via PlayAI on groq infrastructure        | Very low    | English      | ❌        |
| `groq.playai-tts-arabic`      | groq       | Low-latency Arabic voices                                           | Very low    | Arabic       | ❌        |
| `eleven_v3`                   | ElevenLabs | Most advanced, emotionally rich, multi-speaker dialogue             | Higher      | 70+          | ❌        |
| `eleven_multilingual_v2`      | ElevenLabs | Highest-quality multilingual voice-overs, audiobook production      | Higher      | 29           | ❌        |
| `eleven_turbo_v2_5`           | ElevenLabs | Balanced quality + latency for multilingual real-time apps          | ~250–300 ms | 32           | ❌        |
| `eleven_turbo_v2`             | ElevenLabs | Balanced quality + latency for English real-time apps               | ~250–300 ms | English      | ❌        |
| `eleven_flash_v2_5`           | ElevenLabs | Ultra-fast multilingual TTS for voice agents & interactive apps     | ~75 ms      | 32           | ❌        |
| `eleven_flash_v2`             | ElevenLabs | Ultra-fast English TTS for voice agents & interactive apps          | ~75 ms      | English      | ❌        |

**Rules of thumb:**

- Need **cheapest, fastest** speech? Use `tts-1` or `groq.playai-tts`.
- Need **studio-quality narration** (audiobooks, YouTube, courses)? Use `tts-1-hd` or `eleven_multilingual_v2`.
- Need **controllable tone/emotion via natural language prompts**? Use `gpt-4o-mini-tts` (`instructions` parameter).
- Need **real-time voice agent latency** (≤100 ms)? Use `eleven_flash_v2_5` / `eleven_flash_v2`.
- Need **multi-speaker dialogue** with interacting characters? Use `eleven_v3` or Gemini TTS (native v1beta) with multi-speaker config.
- Need **70+ language coverage** (including rare languages)? Use `eleven_v3`.
- Need **Arabic**-first voices? Use `groq.playai-tts-arabic` or `eleven_multilingual_v2`.

## Basic Usage

The canonical call is a `POST` to `/v1/audio/speech` with `model`, `input`, and `voice`. The server responds with a binary audio stream (MP3 by default).

```language-selector
bash=:Bash

python=:Python

javascript=:JavaScript

go=:Go

php=:PHP

```

```bash
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1",
    "input": "Hello from AvalAI! Text-to-speech is working.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

```python
from pathlib import Path
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_AVALAI_API_KEY",
    base_url="https://api.avalai.ir/v1",
)

speech_file = Path("speech.mp3")

with client.audio.speech.with_streaming_response.create(
    model="tts-1",
    voice="alloy",
    input="Hello from AvalAI! Text-to-speech is working.",
) as response:
    response.stream_to_file(speech_file)

print(f"Saved audio to {speech_file.resolve()}")
```

```javascript
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const speechFile = path.resolve("./speech.mp3");

const response = await client.audio.speech.create({
  model: "tts-1",
  voice: "alloy",
  input: "Hello from AvalAI! Text-to-speech is working.",
});

const buffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync(speechFile, buffer);
console.log(`Saved audio to ${speechFile}`);
```

```go
package main

import (
	"context"
	"io"
	"log"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"),
	)

	resp, err := client.Audio.Speech.New(context.Background(), openai.AudioSpeechNewParams{
		Model: openai.F("tts-1"),
		Voice: openai.F(openai.AudioSpeechNewParamsVoiceAlloy),
		Input: openai.F("Hello from AvalAI! Text-to-speech is working."),
	})
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	f, err := os.Create("speech.mp3")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	if _, err := io.Copy(f, resp.Body); err != nil {
		log.Fatal(err)
	}
	log.Println("Saved speech.mp3")
}
```

```php
<?php
$apiKey  = getenv('AVALAI_API_KEY');
$payload = json_encode([
    'model' => 'tts-1',
    'input' => 'Hello from AvalAI! Text-to-speech is working.',
    'voice' => 'alloy',
]);

$ch = curl_init('https://api.avalai.ir/v1/audio/speech');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$audio = curl_exec($ch);
if ($audio === false) {
    fwrite(STDERR, 'cURL error: ' . curl_error($ch) . PHP_EOL);
    exit(1);
}
curl_close($ch);

file_put_contents('speech.mp3', $audio);
echo "Saved speech.mp3\n";
```

## Voice Selection

OpenAI-family and ElevenLabs TTS models share a common set of named voices on AvalAI:

| Voice     | Character                    |
| --------- | ---------------------------- |
| `alloy`   | Neutral, professional        |
| `ash`     | Calm, measured               |
| `ballad`  | Soft, expressive             |
| `coral`   | Warm, friendly               |
| `echo`    | Clear, expressive            |
| `fable`   | Storytelling, narrative      |
| `nova`    | Energetic, upbeat            |
| `onyx`    | Deep, authoritative          |
| `sage`    | Calm, wise                   |
| `shimmer` | Bright, cheerful             |
| `verse`   | Melodic, poetic              |

> Not every voice is available on every model. If a voice isn't supported, the API returns a `400` error listing valid options. Gemini and groq `playai-tts` use their own voice names (see their dedicated sections).

### Previewing Voices

Generate one short sample per voice and listen to them back-to-back:

```python
from pathlib import Path
from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

sample_text = "The quick brown fox jumps over the lazy dog."
voices = ["alloy", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"]

Path("voice-samples").mkdir(exist_ok=True)
for voice in voices:
    out = Path(f"voice-samples/{voice}.mp3")
    with client.audio.speech.with_streaming_response.create(
        model="tts-1-hd",
        voice=voice,
        input=sample_text,
    ) as response:
        response.stream_to_file(out)
    print(f"→ {out}")
```

## Controlling Style with `gpt-4o-mini-tts`

`gpt-4o-mini-tts` accepts a free-form `instructions` parameter that shapes tone, pace, accent, and emotion in natural language.

```language-selector
bash=:Bash

python=:Python

javascript=:JavaScript

```

```bash
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "voice": "coral",
    "input": "Welcome aboard flight 237 to Tehran. We will be departing shortly.",
    "instructions": "Speak in a warm, professional, and reassuring tone — like a seasoned flight attendant."
  }' \
  --output announcement.mp3
```

```python
with client.audio.speech.with_streaming_response.create(
    model="gpt-4o-mini-tts",
    voice="coral",
    input="Welcome aboard flight 237 to Tehran. We will be departing shortly.",
    instructions="Speak in a warm, professional, and reassuring tone — "
    "like a seasoned flight attendant.",
) as response:
    response.stream_to_file("announcement.mp3")
```

```javascript
const response = await client.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Welcome aboard flight 237 to Tehran. We will be departing shortly.",
  instructions:
    "Speak in a warm, professional, and reassuring tone — like a seasoned flight attendant.",
});
fs.writeFileSync("announcement.mp3", Buffer.from(await response.arrayBuffer()));
```

**Useful `instructions` patterns:**

- `"Speak slowly and clearly, as if teaching a child to read."`
- `"Use an energetic sports-caster delivery with rising excitement."`
- `"Whisper calmly, as if narrating a bedtime story."`
- `"Speak with a British English accent, warm and slightly formal."`
- `"Deliver the text like a news anchor — neutral, crisp, authoritative."`

## Response Formats

Set `response_format` to get the container you need:

| Format     | Extension | Use Case                                                        |
| ---------- | --------- | --------------------------------------------------------------- |
| `mp3`      | `.mp3`    | Default. Best general-purpose web & mobile playback.            |
| `opus`     | `.opus`   | Low-bitrate real-time (WebRTC, voice chat).                     |
| `aac`      | `.aac`    | Apple ecosystem (iOS, Safari).                                  |
| `flac`     | `.flac`   | Lossless archiving.                                             |
| `wav`      | `.wav`    | Uncompressed PCM in a WAV container — easy for DSP / editing.   |
| `pcm`      | `.pcm`    | Raw 24-kHz 16-bit little-endian mono PCM — lowest latency.      |

```python
with client.audio.speech.with_streaming_response.create(
    model="tts-1",
    voice="alloy",
    input="Streaming PCM is great for real-time apps.",
    response_format="pcm",
) as response:
    response.stream_to_file("speech.pcm")
```

### Speed Control

`speed` accepts values from `0.25` to `4.0` (default `1.0`) on OpenAI TTS models:

```python
with client.audio.speech.with_streaming_response.create(
    model="tts-1-hd",
    voice="nova",
    input="Slow down and breathe. You're doing great.",
    speed=0.85,
) as response:
    response.stream_to_file("slow.mp3")
```

## Streaming Playback

For real-time apps (voice agents, interactive narration), stream chunks as they are produced rather than waiting for the whole file.

### Python — play chunks with `sounddevice`

```python
import io
import sounddevice as sd
import soundfile as sf
from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

buffer = io.BytesIO()
with client.audio.speech.with_streaming_response.create(
    model="tts-1",
    voice="alloy",
    input="Streaming speech from AvalAI, chunk by chunk, for low-latency playback.",
    response_format="wav",
) as response:
    for chunk in response.iter_bytes(chunk_size=4096):
        buffer.write(chunk)

buffer.seek(0)
data, samplerate = sf.read(buffer)
sd.play(data, samplerate)
sd.wait()
```

### JavaScript — pipe to a file or HTTP response

```javascript
import fs from "node:fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.audio.speech.create({
  model: "tts-1",
  voice: "alloy",
  input: "Hello from a streaming TTS endpoint!",
  response_format: "mp3",
});

// `response.body` is a ReadableStream you can pipe to a file, HTTP response, etc.
const out = fs.createWriteStream("stream.mp3");
const reader = response.body.getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  out.write(value);
}
out.end();
```

## Long-Text & Chunking Strategies

Most TTS models accept up to ~4,096 characters per request (ElevenLabs Flash/Turbo allow up to 40,000). For longer scripts:

1. Split on paragraph or sentence boundaries.
2. Synthesize each chunk.
3. Concatenate the resulting audio.

```python
import re
from pathlib import Path
from pydub import AudioSegment
from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")


def split_script(text: str, max_chars: int = 3500) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks, current = [], ""
    for s in sentences:
        if len(current) + len(s) + 1 > max_chars:
            chunks.append(current.strip())
            current = s
        else:
            current += " " + s
    if current.strip():
        chunks.append(current.strip())
    return chunks


script = Path("long_script.txt").read_text()
combined = AudioSegment.silent(duration=0)

for i, chunk in enumerate(split_script(script)):
    part_path = Path(f"part_{i:03d}.mp3")
    with client.audio.speech.with_streaming_response.create(
        model="tts-1-hd",
        voice="sage",
        input=chunk,
    ) as response:
        response.stream_to_file(part_path)
    combined += AudioSegment.from_mp3(part_path) + AudioSegment.silent(duration=250)

combined.export("narration.mp3", format="mp3")
print("Saved narration.mp3")
```

## Multi-Speaker Dialogue (Gemini Native v1beta)

Gemini TTS models support native multi-speaker generation via the v1beta endpoint. Assign a distinct voice to each speaker and Gemini will render a natural back-and-forth.

```python
import base64
import wave
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_AVALAI_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.avalai.ir/v1beta"),
)

prompt = """TTS the following conversation between Sara and Ali:
Sara: Welcome to the AvalAI podcast!
Ali: Thanks Sara — glad to be here. Let's talk about text-to-speech.
"""

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="Sara",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Kore"
                            ),
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="Ali",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck"
                            ),
                        ),
                    ),
                ]
            )
        ),
    ),
)

pcm_bytes = base64.b64decode(response.candidates[0].content.parts[0].inline_data.data)

with wave.open("dialogue.wav", "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)  # 16-bit PCM
    wf.setframerate(24000)  # 24 kHz
    wf.writeframes(pcm_bytes)
```

See [`audio.md`](en/api-reference/audio.md#native-v1beta-api-with-multi-speaker-support) for the full parameter reference and the [Audio Processing Guide](en/guides/audio-processing.md#native-v1beta-api-with-multi-speaker-support) for more multi-speaker recipes.

## ElevenLabs TTS: The Full Suite

The ElevenLabs models on AvalAI cover the entire quality/latency spectrum — from the studio-grade `eleven_v3` to the ultra-fast `eleven_flash_v2_5`. They are called exactly like OpenAI TTS (same endpoint, same voice names).

### Model Comparison

| Model                     | Latency      | Languages    | Char Limit | Best For                                                   | Price (per sec) |
| ------------------------- | ------------ | ------------ | ---------- | ---------------------------------------------------------- | --------------- |
| `eleven_v3`               | Higher       | 70+          | 5,000      | Multi-speaker dialogue, emotional delivery, audiobooks     | $0.005          |
| `eleven_multilingual_v2`  | Higher       | 29           | 10,000     | Highest-quality voice-overs, character voices              | $0.005          |
| `eleven_turbo_v2_5`       | ~250–300 ms  | 32           | 40,000     | Multilingual real-time agents, balanced quality + latency  | $0.0025         |
| `eleven_turbo_v2`         | ~250–300 ms  | English      | 40,000     | English real-time agents, balanced quality + latency       | $0.0025         |
| `eleven_flash_v2_5`       | ~75 ms       | 32           | 40,000     | Ultra-fast multilingual voice agents, bulk TTS             | $0.0025         |
| `eleven_flash_v2`         | ~75 ms       | English      | 40,000     | Ultra-fast English voice agents, bulk TTS                  | $0.0025         |

### Ultra-Low Latency with `eleven_flash_v2_5`

Perfect for interactive voice agents where every millisecond of first-audio matters.

```language-selector
bash=:Bash

python=:Python

javascript=:JavaScript

```

```bash
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "eleven_flash_v2_5",
    "input": "Salam! How can I help you today?",
    "voice": "coral"
  }' \
  --output reply.mp3
```

```python
with client.audio.speech.with_streaming_response.create(
    model="eleven_flash_v2_5",
    voice="coral",
    input="Salam! How can I help you today?",
) as response:
    response.stream_to_file("reply.mp3")
```

```javascript
const response = await client.audio.speech.create({
  model: "eleven_flash_v2_5",
  voice: "coral",
  input: "Salam! How can I help you today?",
});
fs.writeFileSync("reply.mp3", Buffer.from(await response.arrayBuffer()));
```

### Premium Quality with `eleven_multilingual_v2`

Use when you want audiobook-grade voices with rich emotion across 29 languages (English, French, German, Spanish, Arabic, Hindi, Japanese, Mandarin, Russian, Persian-friendly neighbours, and more).

```python
long_passage = (
    "In the quiet of the evening, the old library seemed to breathe with the "
    "weight of a thousand stories, each waiting for a curious mind to turn its page."
)

with client.audio.speech.with_streaming_response.create(
    model="eleven_multilingual_v2",
    voice="sage",
    input=long_passage,
) as response:
    response.stream_to_file("audiobook.mp3")
```

### Maximum Expressiveness with `eleven_v3`

`eleven_v3` is ElevenLabs' flagship, multi-speaker-capable model with 70+ languages and the widest emotional range.

```python
with client.audio.speech.with_streaming_response.create(
    model="eleven_v3",
    voice="nova",
    input=(
        "And then, with a spark of mischief in her eyes, she whispered: "
        "'We're not lost — we're exploring.'"
    ),
) as response:
    response.stream_to_file("expressive.mp3")
```

### Choosing Between ElevenLabs Models

| Scenario                                   | Recommended Model           |
| ------------------------------------------ | --------------------------- |
| Live voice agent (≤100 ms first-audio)     | `eleven_flash_v2_5`         |
| Interactive chatbot (mobile / web)         | `eleven_flash_v2_5` / `eleven_turbo_v2_5` |
| Audiobook / course narration               | `eleven_multilingual_v2`    |
| Multi-character dialogue                   | `eleven_v3`                 |
| Large-scale bulk TTS (e-learning library)  | `eleven_flash_v2_5`         |
| English-only production app                | `eleven_turbo_v2` / `eleven_flash_v2` |
| 70+ language coverage (rare languages)     | `eleven_v3`                 |

For full provider details (voice list, language coverage, pricing), see [ElevenLabs Speech Models](en/providers/elevenlabs.md).

## Groq PlayAI: Lowest-Latency Voice Agents

`groq.playai-tts` (English) and `groq.playai-tts-arabic` (Arabic) deliver sub-100 ms first-audio on groq's inference stack — ideal when latency matters more than voice-range.

```python
with client.audio.speech.with_streaming_response.create(
    model="groq.playai-tts",
    voice="Fritz-PlayAI",
    input="Hello! This is a groq PlayAI voice speaking in near-real-time.",
    response_format="wav",
) as response:
    response.stream_to_file("groq.wav")
```

Consult the [Groq provider docs](en/providers/groq.md) for the full list of PlayAI voice names.

## Combining TTS with Chat Completions (Voice-Enabled LLMs)

A common pattern: let an LLM generate a reply, then speak it with TTS.

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

# 1. Generate text with a chat model
chat = client.chat.completions.create(
    model="gpt-5.1-mini",
    messages=[
        {"role": "system", "content": "You are a concise, warm assistant."},
        {"role": "user", "content": "Tell me a 2-sentence fun fact about Tehran."},
    ],
)
reply = chat.choices[0].message.content
print("Reply:", reply)

# 2. Speak it
with client.audio.speech.with_streaming_response.create(
    model="eleven_flash_v2_5",
    voice="coral",
    input=reply,
) as response:
    response.stream_to_file("reply.mp3")
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-5.1-mini` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Tell me a 2-sentence fun fact about Tehran.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Error Handling & Retries

The speech endpoint follows the same error model as the rest of AvalAI's API. Handle transient failures with exponential backoff:

```python
import time
from openai import OpenAI, APIError, RateLimitError

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")


def synthesize_with_retry(text: str, out_path: str, attempts: int = 5) -> None:
    delay = 1.0
    for attempt in range(1, attempts + 1):
        try:
            with client.audio.speech.with_streaming_response.create(
                model="tts-1",
                voice="alloy",
                input=text,
            ) as response:
                response.stream_to_file(out_path)
            return
        except RateLimitError:
            print(f"Rate-limited (attempt {attempt}). Sleeping {delay:.1f}s.")
        except APIError as e:
            if 500 <= getattr(e, "status_code", 0) < 600:
                print(f"Server error {e.status_code} (attempt {attempt}).")
            else:
                raise
        time.sleep(delay)
        delay = min(delay * 2, 30)
    raise RuntimeError(f"TTS failed after {attempts} attempts")


synthesize_with_retry("Hello with retries!", "retry.mp3")
```

For the full error taxonomy, see the [Error Handling Guide](en/guides/error-handling.md).

## Best Practices

- **Clean your text first.** Strip markdown, expand abbreviations (`Dr.` → `Doctor`), and spell out numbers where pronunciation matters.
- **Match model to use-case.** Don't pay for `eleven_multilingual_v2` if `eleven_flash_v2_5` will do.
- **Cache repeated phrases.** Button labels, confirmations, and error prompts rarely change — store their audio instead of regenerating.
- **Stream for interactivity.** Use the streaming response for agents, live narration, and phone bots.
- **Respect character limits.** Split long scripts before sending. Leave 100–300 ms of silence between chunks when concatenating.
- **Localize voices.** Pair the content language with a model (and voice) that natively supports it (`eleven_multilingual_v2`, `eleven_v3`, Gemini TTS).
- **Monitor cost & latency.** Log `model`, input length, chosen format, and end-to-end latency per request to spot regressions.
- **Gate with authorization.** Treat TTS output like any other user-generated asset — sign URLs, apply rate limits, and store only what you need.
- **Disclose AI audio.** For user-facing voice content, make it clear the voice is synthetic, per local regulations and platform policies.

## Related Resources

- [Audio API Reference](en/api-reference/audio.md)
- [Speech to Text Guide](en/guides/speech-to-text.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [ElevenLabs Speech Models](en/providers/elevenlabs.md)
- [Processing Audio in Chat Completion API (example)](en/examples/processing_audio_in_chat_completion_api.md)
- [Building Conversational Apps with Audio Models (example)](en/examples/building_conversational_apps_with_audio_models.md)
- [Latency Optimization](en/guides/latency-optimization.md)
- [Error Handling](en/guides/error-handling.md)
- [Model Details](en/models/model-details.md)
