# New Models Added: Gemini TTS Models and Mistral Small

**Date:** 2025-05-29

## Summary

We're excited to announce the addition of three new powerful models to the AvalAI platform. This update includes Google's Gemini 2.5 Pro Preview TTS and Gemini 2.5 Flash Preview TTS models for advanced text-to-speech generation, as well as Mistral's new mistral-small-2503 model. These additions expand our platform's capabilities for high-quality audio generation and natural language processing.

---

## Details

This update brings several cutting-edge AI models to the AvalAI platform, enhancing our offerings across multiple domains. Here's what's new:

### Google Gemini

* **gemini-2.5-pro-preview-tts**: Google's advanced text-to-speech model with high-quality audio generation capabilities, supporting both single and multi-speaker output. [Documentation](en/models/gemini-2.5-pro-preview-tts.md)
* **gemini-2.5-flash-preview-tts**: A faster version of Gemini's TTS model, optimized for reduced latency while maintaining excellent audio quality. [Documentation](en/models/gemini-2.5-flash-preview-tts.md)

### Mistral AI

* **mistral-small-2503**: Mistral's latest small-sized language model offering an excellent balance of performance and efficiency. [Documentation](en/models/mistral-small-2503@001.md)

### Gemini TTS Features

The new Gemini TTS models offer several powerful capabilities:

* **Single and Multi-Speaker Audio**: Generate audio with a single voice or create conversations between multiple speakers
* **Style Control via Prompting**: Control style, tone, accent, and pace using natural language prompts
* **30 Voice Options**: Choose from a diverse set of 30 different voice options with various characteristics
* **24 Language Support**: Automatic language detection with support for 24 languages
* **32K Token Context Window**: Process longer texts with a generous context window
* **Streaming Support**: Stream audio responses for more fluid interactions

## Usage Examples

### Single-Speaker Text-to-Speech with Gemini

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gemini-2.5-flash-preview-tts",
 "messages": [{
 "role": "user",
 "content": "Say cheerfully: Have a wonderful day!"
 }],
 "modalities": ["audio"],
 "audio": {
 "voice": "Kore",
 "format": "pcm16"
 }
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-2.5-flash-preview-tts",
    messages=[{"role": "user", "content": "Say cheerfully: Have a wonderful day!"}],
    modalities=["audio"],  # Required for TTS models
    audio={"voice": "Kore", "format": "pcm16"},  # Required: must be "pcm16"
)

# Convert the Pydantic object to a dictionary
response_dict = response.model_dump()
audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]
# Decode the base64-encoded string into binary data
import base64

audio_data = base64.b64decode(audio_data_base64)

# Save the audio to a file
with open("output.mp3", "wb") as file:
    file.write(audio_data)

javascript=:import { OpenAI } from "openai";
import * as fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash-preview-tts",
  messages: [
    { role: "user", content: "Say cheerfully: Have a wonderful day!" },
  ],
  modalities: ["audio"], // Required for TTS models
  audio: {
    voice: "Kore",
    format: "pcm16", // Required: must be "pcm16"
  },
});

// Convert response to get audio data
const responseObj = response.toJSON();
const audioDataBase64 = responseObj.choices[0].message.audio.data;
// Decode the base64-encoded string into binary data
const buffer = Buffer.from(audioDataBase64, "base64");
await fs.promises.writeFile("output.mp3", buffer);

```

### Multi-Speaker Text-to-Speech with Gemini

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gemini-2.5-pro-preview-tts",
 "messages": [{
 "role": "user",
 "content": "TTS the following conversation between Joe and Jane:\nJoe: How'\''s it going today Jane?\nJane: Not too bad, how about you?"
 }],
 "modalities": ["audio"],
 "audio": {
 "voice": "Kore",
 "format": "pcm16"
 }
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

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
import base64

audio_data = base64.b64decode(audio_data_base64)

# Save the audio to a file
with open("conversation.mp3", "wb") as file:
    file.write(audio_data)

javascript=:import { OpenAI } from "openai";
import * as fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-pro-preview-tts",
  messages: [
    {
      role: "user",
      content:
        "TTS the following conversation between Joe and Jane:\nJoe: How's it going today Jane?\nJane: Not too bad, how about you?",
    },
  ],
  modalities: ["audio"], // Required for TTS models
  audio: {
    voice: "Kore",
    format: "pcm16", // Required: must be "pcm16"
  },
});

// Convert response to get audio data
const responseObj = response.toJSON();
const audioDataBase64 = responseObj.choices[0].message.audio.data;
// Decode the base64-encoded string into binary data
const buffer = Buffer.from(audioDataBase64, "base64");
await fs.promises.writeFile("conversation.mp3", buffer);

```

### Using the Mistral Small Model

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="mistral-small-2503@001",
    messages=[
        {
            "role": "user",
            "content": "Explain the concept of neural networks in simple terms.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "mistral-small-2503@001",
  messages: [
    {
      role: "user",
      content: "Explain the concept of neural networks in simple terms.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Controlling Speech Style with Prompts

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gemini-2.5-pro-preview-tts",
 "messages": [{
 "role": "user",
 "content": "Say in a spooky whisper: By the pricking of my thumbs... Something wicked this way comes"
 }],
 "modalities": ["audio"],
 "audio": {
 "voice": "Enceladus",
 "format": "pcm16"
 }
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-2.5-pro-preview-tts",
    messages=[
        {
            "role": "user",
            "content": "Say in a spooky whisper: By the pricking of my thumbs... Something wicked this way comes",
        }
    ],
    modalities=["audio"],  # Required for TTS models
    audio={"voice": "Enceladus", "format": "pcm16"},  # Required: must be "pcm16"
)

# Convert the Pydantic object to a dictionary
response_dict = response.model_dump()
audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]
# Decode the base64-encoded string into binary data
import base64

audio_data = base64.b64decode(audio_data_base64)

# Save the audio to a file
with open("spooky.mp3", "wb") as file:
    file.write(audio_data)

javascript=:import { OpenAI } from "openai";
import * as fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-pro-preview-tts",
  messages: [
    {
      role: "user",
      content:
        "Say in a spooky whisper: By the pricking of my thumbs... Something wicked this way comes",
    },
  ],
  modalities: ["audio"], // Required for TTS models
  audio: {
    voice: "Enceladus",
    format: "pcm16", // Required: must be "pcm16"
  },
});

// Convert response to get audio data
const responseObj = response.toJSON();
const audioDataBase64 = responseObj.choices[0].message.audio.data;
// Decode the base64-encoded string into binary data
const buffer = Buffer.from(audioDataBase64, "base64");
await fs.promises.writeFile("spooky.mp3", buffer);

```

---

## Related Links

- [Text-to-Speech Guide](en/guides/text-to-speech.md)
- [Audio Processing Guide](en/guides/audio-processing.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [API Reference](en/api-reference/audio.md)