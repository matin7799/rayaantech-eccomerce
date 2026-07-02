# Speech to Text Guide

Speech-to-Text (STT), also known as **transcription**, converts spoken audio into written text. AvalAI provides access to a range of industry-leading transcription models — including OpenAI's Whisper family, the newer `gpt-4o-transcribe` models, and groq-hosted Whisper variants — all through a single OpenAI-compatible API.

This guide walks you through choosing the right model, preparing audio files, calling the API, handling different response formats, streaming long-form audio, and applying best practices for production workloads.

For a quick parameter reference, see the [Audio API Reference](en/api-reference/audio.md). For a broader overview of all audio capabilities (TTS + STT + audio-in-chat), see the [Audio Processing Guide](en/guides/audio-processing.md).

## When to Use Speech-to-Text

Speech-to-Text is ideal for:

- **Meeting & interview transcription** – turning recordings into searchable text archives
- **Subtitling & captioning** – generating `srt`/`vtt` files for videos, webinars, and podcasts
- **Voice assistants & IVR** – converting user utterances into text that an LLM can reason about
- **Call analytics** – transcribing support calls for QA, sentiment analysis, or compliance review
- **Content indexing** – making podcasts, lectures, and audio archives searchable
- **Accessibility** – providing real-time captions for hearing-impaired users

If you instead want to **understand** the audio (e.g. "summarize this interview" or "what is the speaker's tone?"), consider an audio-capable chat model (`gpt-4o-audio-preview`, `gpt-5-audio`, Gemini) — see the [Audio Processing Guide](en/guides/audio-processing.md).

## Choosing a Model

AvalAI exposes several STT models via the `/v1/audio/transcriptions` endpoint. Check the live availability and pricing on the [Model Details page](en/models/model-details.md).

| Model                           | Provider   | Best For                                                                 | Streaming | Word Timestamps | Diarization |
| ------------------------------- | ---------- | ------------------------------------------------------------------------ | --------- | --------------- | ----------- |
| `whisper-1`                     | OpenAI     | General-purpose transcription, subtitles, translation                    | ❌        | ✅              | ❌          |
| `gpt-4o-transcribe`             | OpenAI     | Highest-accuracy transcription, domain-specific content, `logprobs`      | ✅        | ❌              | ❌          |
| `gpt-4o-mini-transcribe`        | OpenAI     | Cost-efficient transcription at ~½ the price                             | ✅        | ❌              | ❌          |
| `groq.whisper-large-v3`         | groq       | Very fast inference on Whisper-Large-v3 via groq infrastructure          | ❌        | ✅              | ❌          |
| `groq.whisper-large-v3-turbo`   | groq       | Fastest Whisper variant, excellent latency/cost balance                  | ❌        | ✅              | ❌          |
| `scribe_v2`                     | ElevenLabs | State-of-the-art accuracy, 90+ languages, entity detection, audio events | ❌        | ✅              | ✅ (≤32 speakers) |
| `scribe_v1`                     | ElevenLabs | Legacy ElevenLabs transcription model                                    | ❌        | ✅              | ❌          |

**Rules of thumb:**

- Need **subtitles with word-level timestamps**? Use `whisper-1`, a `groq.whisper-*` model, or ElevenLabs `scribe_v2` with `response_format="verbose_json"` and `timestamp_granularities=["word"]`.
- Need **highest accuracy on noisy/technical audio**? Use `gpt-4o-transcribe` or `scribe_v2`.
- Need **speaker diarization** (who said what)? Use ElevenLabs `scribe_v2` — it can identify up to 32 distinct speakers.
- Need **real-time / streaming** output? Use `gpt-4o-transcribe` or `gpt-4o-mini-transcribe` with `stream=true`.
- Need **lowest latency & cost**? Use `groq.whisper-large-v3-turbo` or `gpt-4o-mini-transcribe`.
- Transcribing a **rare language** (e.g. 90+ language coverage)? Use `scribe_v2` — it supports the widest language set.

## Preparing Audio Input

### Supported Formats & Limits

The transcription endpoint accepts files up to **25 MB** in the following formats:

`flac`, `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `ogg`, `wav`, `webm`

### Tips for High-Quality Results

1. **Sample rate** – 16 kHz mono is sufficient for speech; higher rates only increase file size.
2. **Compression** – prefer `mp3` (96–128 kbps) or `m4a` for speech to stay well under 25 MB.
3. **Noise reduction** – remove hiss, background chatter, or music where possible (e.g. with [`ffmpeg`](https://ffmpeg.org/) or [RNNoise](https://github.com/xiph/rnnoise)).
4. **Trim silence** – strip long silent regions from the start/end of recordings; they consume tokens and can lower accuracy.
5. **Chunk long audio** – for files over 25 MB or longer than ~60 minutes, split on natural pauses (see [Handling Long Audio](#handling-long-audio) below).

### Normalizing Audio with ffmpeg

A common pre-processing pipeline:

```bash
ffmpeg -i raw_recording.wav \
  -ac 1 \                   # mono
-ar 16000 \                 # 16 kHz
-c:a libmp3lame -b:a 96k \  # MP3 @ 96 kbps
clean_recording.mp3
```

## Basic Transcription

The simplest call uploads an audio file and returns its text. The endpoint is `POST https://api.avalai.ir/v1/audio/transcriptions`.

```language-selector
bash=:# cURL - Basic transcription returning plain text
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/meeting.mp3" \
  -F model="gpt-4o-transcribe" \
  -F response_format="text"

python=:# Python - Basic transcription
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your AvalAI API key
    base_url="https://api.avalai.ir/v1",
)

with open("meeting.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="gpt-4o-transcribe",
        file=audio_file,
        response_format="text",  # plain text string
    )

print(transcript)

javascript=:// JavaScript - Basic transcription
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function main() {
  const transcript = await client.audio.transcriptions.create({
    file: fs.createReadStream("meeting.mp3"),
    model: "gpt-4o-transcribe",
    response_format: "text",
  });

  console.log(transcript);
}

main();

go=:// Go - Basic transcription
package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig(os.Getenv("AVALAI_API_KEY"))
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	resp, err := client.CreateTranscription(
		context.Background(),
		openai.AudioRequest{
			Model:    "gpt-4o-transcribe",
			FilePath: "meeting.mp3",
			Format:   openai.AudioResponseFormatText,
		},
	)
	if err != nil {
		fmt.Printf("Transcription error: %v\n", err)
		return
	}

	fmt.Println(resp.Text)
}

php=:<?php
// PHP - Basic transcription

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/audio/transcriptions';
$audioFilePath = '/path/to/meeting.mp3';

$cfile = curl_file_create($audioFilePath, mime_content_type($audioFilePath), basename($audioFilePath));

$data = [
    'file'            => $cfile,
    'model'           => 'gpt-4o-transcribe',
    'response_format' => 'text',
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>

```

## Improving Accuracy

### Specify the Language

If you know the audio language ahead of time, pass it via the `language` parameter ([ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code, e.g. `en`, `fa`, `ar`, `es`). This usually **improves accuracy and reduces latency** because the model skips language detection.

```python
transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    language="fa",  # Persian / Farsi
)
```

### Use a Prompt for Context

The `prompt` parameter lets you seed the model with domain-specific vocabulary, proper nouns, or style examples. It should be in the **same language** as the audio.

```python
transcript = client.audio.transcriptions.create(
    model="gpt-4o-transcribe",
    file=audio_file,
    prompt=(
        "This recording discusses AvalAI, OpenAI, Gemini, Whisper, "
        "and tokens-per-second benchmarks. Names: Sara, Kian."
    ),
)
```

Prompts are especially helpful for:

- Technical jargon (`Kubernetes`, `RAG`, `embeddings`)
- Proper nouns (company names, people, product SKUs)
- Numbers and units you want formatted consistently
- Style (e.g. full sentences with punctuation)

### Control Determinism with Temperature

`temperature` ranges from `0` (deterministic, default) to `1` (more varied). Keep it at `0` for transcription unless you are experimenting.

## Response Formats

The `response_format` parameter selects the output shape. Pick based on what you need downstream.

| Format         | Returns                                                                 | Typical use case                                 |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| `json`         | `{ "text": "..." }` (default)                                           | Simple programmatic consumption                  |
| `text`         | Plain string                                                            | Quick display, piping into other tools           |
| `verbose_json` | Full metadata: language, duration, segments, optional word timestamps   | Subtitling, analytics, diarization preprocessing |
| `srt`          | SubRip subtitle file                                                    | Video subtitles (YouTube, VLC, premiere)         |
| `vtt`          | WebVTT subtitle file                                                    | HTML5 `<track>` elements, web video players      |

> **Note:** `gpt-4o-transcribe` models require `response_format="json"`. For SRT/VTT output, use `whisper-1` or a `groq.whisper-*` model.

### Subtitle Files (SRT / VTT)

```python
# Generate an .srt file for a video
with open("lecture.mp4", "rb") as audio_file:
    srt = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="srt",
    )

with open("lecture.srt", "w") as f:
    f.write(srt)
```

### Word-Level Timestamps

Word-level timestamps are useful for karaoke-style captions, keyword search, and building diarization pipelines.

```python
transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    response_format="verbose_json",
    timestamp_granularities=["word", "segment"],
)

for word in transcript.words:
    print(f"{word.start:6.2f}s – {word.end:6.2f}s  {word.word}")
```

## ElevenLabs Scribe v2: Diarization & Advanced Features

ElevenLabs `scribe_v2` is a state-of-the-art transcription model with features not available on Whisper or GPT-4o transcription models:

- **Speaker diarization** – automatically label up to 32 distinct speakers
- **Keyterm prompting** – up to 100 custom terms for domain accuracy
- **Entity detection** – recognize 56 entity types (names, dates, organizations, etc.)
- **Dynamic audio tagging** – detects events like `[laughter]`, `[music]`, `[applause]`
- **Smart language detection** – automatic identification across 90+ languages

### Basic Scribe v2 Call

```language-selector
bash=:# cURL - ElevenLabs scribe_v2 transcription
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F file="@podcast.mp3" \
  -F model="scribe_v2" \
  -F response_format="verbose_json"

python=:# Python - scribe_v2 with word-level output
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

with open("podcast.mp3", "rb") as f:
    result = client.audio.transcriptions.create(
        model="scribe_v2",
        file=f,
        response_format="verbose_json",
    )

print(result.text)
for word in getattr(result, "words", []) or []:
    print(f"{word.start:6.2f}s  {word.word}")

javascript=:// JavaScript - scribe_v2
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const result = await client.audio.transcriptions.create({
  file: fs.createReadStream("podcast.mp3"),
  model: "scribe_v2",
  response_format: "verbose_json",
});

console.log(result.text);

```

### Speaker Diarization with Scribe v2

For multi-speaker recordings (interviews, meetings, panels), `scribe_v2` can tag each word with a speaker ID:

```python
with open("interview.mp3", "rb") as f:
    result = client.audio.transcriptions.create(
        model="scribe_v2",
        file=f,
        response_format="verbose_json",
    )

# Group consecutive words by speaker to build a readable transcript.
current_speaker = None
buffer = []
for w in result.words:
    speaker = getattr(w, "speaker", None) or "Unknown"
    if speaker != current_speaker and buffer:
        print(f"{current_speaker}: {' '.join(buffer)}")
        buffer = []
    current_speaker = speaker
    buffer.append(w.word)
if buffer:
    print(f"{current_speaker}: {' '.join(buffer)}")
```

Example output:

```
Speaker 0: Welcome everyone to today's episode.
Speaker 1: Thanks for having me — it's great to be here.
Speaker 0: Let's start with your background…
```

### Keyterm Prompting

Pass domain-specific vocabulary through the `prompt` parameter to dramatically improve accuracy on names, products, and jargon:

```python
result = client.audio.transcriptions.create(
    model="scribe_v2",
    file=audio_file,
    prompt=(
        "Speakers: Dr. Soroush Ebrahimi, Aryan Mahmoudi. "
        "Products: AvalAI, Gemini 2.5 Pro, scribe_v2. "
        "Technical terms: retrieval-augmented generation, vector embeddings, "
        "tokens-per-second, Cloudflare Workers."
    ),
    response_format="verbose_json",
)
```

## Streaming Transcription

For long-form audio (lectures, podcasts, live streams) or UX where you want to display text as it arrives, set `stream=true`. Streaming is supported by `gpt-4o-transcribe` and `gpt-4o-mini-transcribe` — **not** by `whisper-1`.

The server emits server-sent events:

- `transcript.text.delta` – incremental text chunks
- `transcript.text.done` – final event with the full transcript

```language-selector
python=:# Python - Streaming transcription
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

with open("podcast_episode.mp3", "rb") as audio_file:
    stream = client.audio.transcriptions.create(
        model="gpt-4o-transcribe",
        file=audio_file,
        response_format="json",
        stream=True,
    )

    full_text = ""
    for event in stream:
        if event.type == "transcript.text.delta":
            print(event.delta, end="", flush=True)
            full_text += event.delta
        elif event.type == "transcript.text.done":
            print("\n--- DONE ---")
            print(f"Total length: {len(full_text)} chars")

javascript=:// JavaScript - Streaming transcription
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const stream = await client.audio.transcriptions.create({
  file: fs.createReadStream("podcast_episode.mp3"),
  model: "gpt-4o-transcribe",
  response_format: "json",
  stream: true,
});

let fullText = "";
for await (const event of stream) {
  if (event.type === "transcript.text.delta") {
    process.stdout.write(event.delta);
    fullText += event.delta;
  } else if (event.type === "transcript.text.done") {
    console.log("\n--- DONE ---");
    console.log(`Total length: ${fullText.length} chars`);
  }
}

bash=:# cURL - Streaming transcription (SSE)
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@podcast_episode.mp3" \
  -F model="gpt-4o-transcribe" \
  -F response_format="json" \
  -F stream="true" \
  --no-buffer

```

## Speech Translation

The `/v1/audio/translations` endpoint transcribes **and translates** non-English audio directly into English text. Only `whisper-1` is supported on this endpoint.

```python
with open("spanish_interview.m4a", "rb") as audio_file:
    english = client.audio.translations.create(
        model="whisper-1",
        file=audio_file,
        response_format="text",
    )

print(english)
```

For translating between two **non-English** languages, transcribe first and then pass the text through a chat model (e.g. `gpt-4o`, `gemini-2.5-flash`):

```python
# Step 1: transcribe Persian audio to Persian text
with open("fa_audio.mp3", "rb") as f:
    fa_text = client.audio.transcriptions.create(
        model="whisper-1", file=f, language="fa", response_format="text"
    )

# Step 2: translate Persian text → French via chat completion
translation = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "system",
            "content": "You are a professional translator. Translate Persian to French, preserving tone.",
        },
        {"role": "user", "content": fa_text},
    ],
)
print(translation.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `whisper-1` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


## Handling Long Audio

Files larger than 25 MB or longer than ~60 minutes must be **split into chunks** before transcribing. Always split on silence (or natural pauses) to avoid cutting mid-word.

```python
# Chunk a long file with pydub on silence boundaries, then transcribe each piece.
from pydub import AudioSegment
from pydub.silence import split_on_silence

audio = AudioSegment.from_file("long_interview.mp3")
chunks = split_on_silence(
    audio,
    min_silence_len=700,  # ms
    silence_thresh=audio.dBFS - 16,
    keep_silence=200,
)

full_transcript = []
for i, chunk in enumerate(chunks):
    chunk_path = f"chunk_{i:03d}.mp3"
    chunk.export(chunk_path, format="mp3", bitrate="96k")

    with open(chunk_path, "rb") as f:
        text = client.audio.transcriptions.create(
            model="gpt-4o-transcribe",
            file=f,
            response_format="text",
            # Give each chunk the previous chunk's tail as context:
            prompt=full_transcript[-1][-500:] if full_transcript else None,
        )
    full_transcript.append(text)

print("\n\n".join(full_transcript))
```

Passing the tail of the previous chunk as a `prompt` helps the model maintain consistent spelling of names and terminology across chunk boundaries.

## Real-Time Microphone Transcription

For near-real-time use cases (voice assistants, live captions), record short rolling windows (e.g. 3–5 seconds) and send each window to `gpt-4o-mini-transcribe`:

```python
import sounddevice as sd
import soundfile as sf
import tempfile

SAMPLE_RATE = 16000
WINDOW_SECONDS = 4


def transcribe_window():
    recording = sd.rec(
        int(WINDOW_SECONDS * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="int16",
    )
    sd.wait()

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        sf.write(f.name, recording, SAMPLE_RATE)
        with open(f.name, "rb") as audio:
            return client.audio.transcriptions.create(
                model="gpt-4o-mini-transcribe",
                file=audio,
                response_format="text",
            )


while True:
    print(transcribe_window(), end=" ", flush=True)
```

For lower latency still, use the **OpenAI Realtime API** (accessible through the [v1beta endpoint](en/api-reference/v1beta.md)).

## Combining STT with Chat Completions

A common pattern is **"transcribe → reason → respond"**: transcribe the user's voice, pass the text to a chat model, then optionally convert the response back to audio with TTS (see the [Text to Speech Guide](en/guides/text-to-speech.md)).

```python
def voice_assistant(audio_path: str) -> str:
    # 1. Transcribe
    with open(audio_path, "rb") as f:
        user_text = client.audio.transcriptions.create(
            model="gpt-4o-transcribe", file=f, response_format="text"
        )

    # 2. Reason
    reply = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {"role": "system", "content": "You are a concise voice assistant."},
            {"role": "user", "content": user_text},
        ],
    )
    return reply.choices[0].message.content
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


## Error Handling & Retries

Transcription requests can fail because of network issues, oversized files, unsupported formats, or rate limits. Wrap calls in exponential-backoff retry logic and surface human-readable errors:

```python
import time
from openai import APIError, RateLimitError, BadRequestError


def transcribe_with_retry(
    path: str, model: str = "gpt-4o-transcribe", max_attempts: int = 4
):
    for attempt in range(1, max_attempts + 1):
        try:
            with open(path, "rb") as f:
                return client.audio.transcriptions.create(
                    model=model, file=f, response_format="text"
                )
        except RateLimitError:
            wait = 2**attempt
            print(f"Rate limited. Retrying in {wait}s…")
            time.sleep(wait)
        except BadRequestError as e:
            # Usually a file-format or size problem — don't retry.
            raise RuntimeError(f"Bad request: {e}") from e
        except APIError as e:
            if attempt == max_attempts:
                raise
            time.sleep(2**attempt)
    raise RuntimeError("Transcription failed after max retries")
```

See the [Error Handling Guide](en/guides/error-handling.md) for the full list of error codes.

## Best Practices

### Accuracy

- Specify `language` whenever you know it.
- Use a domain-specific `prompt` with names, acronyms, and technical terms.
- Pre-process audio (mono 16 kHz, noise reduction, silence trimming).
- For critical content, consider running the same file through two models and comparing output.

### Cost & Latency

- Use `gpt-4o-mini-transcribe` or `groq.whisper-large-v3-turbo` for routine workloads.
- Reserve `gpt-4o-transcribe` for content where every word matters.
- Cache transcripts keyed by a hash of the audio file to avoid re-transcribing duplicates.
- Stream (`stream=true`) when you need progressive UI updates.

### Privacy & Compliance

- Store only what you need; delete intermediate audio files once text is extracted.
- If your audio contains PII, apply redaction on the transcript before persisting.
- Review AvalAI's [Privacy Policy](en/safety/privacy-policy.md) and [Content Policy](en/safety/content-policy.md).

### Observability

- Log model, duration, byte size, and response format for every call.
- Track accuracy spot-checks in a golden test set to detect regressions.
- Use [Response Headers](en/api-reference/response-headers.md) (rate-limit headers, request IDs) in your logs for debugging.

## Related Resources

- [Audio API Reference](en/api-reference/audio.md) — full parameter reference for `/v1/audio/transcriptions` and `/v1/audio/translations`
- [Text to Speech Guide](en/guides/text-to-speech.md) — the reverse direction (text → audio)
- [Audio Processing Guide](en/guides/audio-processing.md) — comprehensive overview including audio-in-chat
- [Building Conversational Apps with Audio Models](en/examples/building_conversational_apps_with_audio_models.md) — end-to-end example
- [Processing Audio in Chat Completions](en/examples/processing_audio_in_chat_completion_api.md) — Gemini & GPT audio input
- [Model Details](en/models/model-details.md) — up-to-date list of available STT models and pricing
- [Rate Limits](en/guides/rate-limits.md) — per-tier request/token limits
- [Error Handling](en/guides/error-handling.md) — retry patterns and error codes
