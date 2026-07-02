# groq

groq provides ultra-fast inference for open-weight AI models through their specialized hardware architecture. All models are available through AvalAI's unified API with industry-leading performance and competitive pricing.

## Available Models

- [Safety & Content Moderation](#safety--content-moderation-models)
  - [groq.llama-guard-4-12b](#groqllama-guard-4-12b) - Advanced content moderation
  - [groq.llama-prompt-guard-2-22m](#groqllama-prompt-guard-2-22m) - Lightweight prompt injection detection
  - [groq.llama-prompt-guard-2-86m](#groqllama-prompt-guard-2-86m) - Enhanced prompt injection detection
  
- [Large Language Models](#large-language-models)
  - [groq.llama-4-maverick-17b-128e-instruct](#groqllama-4-maverick-17b-128e-instruct) - Advanced Llama 4 with 128 experts
  - [groq.llama-4-scout-17b-16e-instruct](#groqllama-4-scout-17b-16e-instruct) - Efficient Llama 4 with 16 experts
  - [groq.kimi-k2-instruct-0905](#groqkimi-k2-instruct-0905) - Kimi K2 instruction-following
  - [groq.gpt-oss-120b](#groqgpt-oss-120b) - Large open-source GPT (120B)
  - [groq.gpt-oss-20b](#groqgpt-oss-20b) - Efficient open-source GPT (20B)
  - [groq.gpt-oss-safeguard-20b](#groqgpt-oss-safeguard-20b) - Safety-enhanced GPT (20B)
  - [groq.qwen3-32b](#groqqwen3-32b) - Qwen 3 multilingual (32B)

- [Audio Models](#audio-models)
  - [groq.playai-tts](#groqplayai-tts) - High-quality text-to-speech
  - [groq.playai-tts-arabic](#groqplayai-tts-arabic) - Arabic-optimized TTS
  - [groq.whisper-large-v3](#groqwhisper-large-v3) - Advanced speech recognition
  - [groq.whisper-large-v3-turbo](#groqwhisper-large-v3-turbo) - Faster speech recognition

## Key Features

- **Ultra-Fast Inference**: Industry-leading inference speeds powered by groq's custom LPU™ (Language Processing Unit) hardware
- **Open-Weight Models**: Access to popular open-source models with production-ready performance
- **Competitive Pricing**: Cost-effective options with prompt caching support for additional savings
- **Diverse Capabilities**: From safety moderation to multilingual text generation and audio processing
- **Production Ready**: Enterprise-grade reliability and performance

## API Endpoint Support

| Model Category | v1/chat/completions | v1/audio/speech | v1/audio/transcriptions |
|----------------|---------------------|-----------------|-------------------------|
| LLMs & Safety | ✅ Full | ❌ | ❌ |
| TTS Models | ❌ | ✅ Full | ❌ |
| Whisper Models | ❌ | ❌ | ✅ Full |

---

## Safety & Content Moderation Models

### groq.llama-guard-4-12b

Advanced content moderation model based on Llama Guard 4 with 12 billion parameters.

**Pricing:** $0.20/1M input tokens, $0.10/1M cached input, $0.20/1M output tokens

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "groq.llama-guard-4-12b",
    "messages": [
      {
        "role": "user",
        "content": "Check if this content is safe: [content to moderate]"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="groq.llama-guard-4-12b",
    messages=[
        {
            "role": "user",
            "content": "Check if this content is safe: [content to moderate]",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "groq.llama-guard-4-12b",
  messages: [
    {
      role: "user",
      content: "Check if this content is safe: [content to moderate]",
    },
  ],
});

console.log(response.choices[0].message.content);

```

### groq.llama-prompt-guard-2-22m

Lightweight prompt injection detection model with 22 million parameters.

**Pricing:** $0.03/1M input tokens, $0.015/1M cached input, $0.03/1M output tokens

### groq.llama-prompt-guard-2-86m

Enhanced prompt injection detection model with 86 million parameters.

**Pricing:** $0.04/1M input tokens, $0.02/1M cached input, $0.04/1M output tokens

---

## Large Language Models

### groq.llama-4-maverick-17b-128e-instruct

Advanced Llama 4 model with 17 billion parameters and 128 experts, optimized for complex reasoning and instruction following.

**Pricing:** $0.20/1M input tokens, $0.10/1M cached input, $0.60/1M output tokens

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "groq.llama-4-maverick-17b-128e-instruct",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to calculate prime numbers."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="groq.llama-4-maverick-17b-128e-instruct",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to calculate prime numbers.",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "groq.llama-4-maverick-17b-128e-instruct",
  messages: [
    {
      role: "user",
      content: "Write a Python function to calculate prime numbers.",
    },
  ],
});

console.log(response.choices[0].message.content);

```

### groq.llama-4-scout-17b-16e-instruct

Efficient Llama 4 model with 17 billion parameters and 16 experts.

**Pricing:** $0.11/1M input tokens, $0.055/1M cached input, $0.34/1M output tokens

### groq.kimi-k2-instruct-0905

Kimi K2 instruction-following model optimized for following complex instructions.

**Pricing:** $1.00/1M input tokens, $0.50/1M cached input, $0.34/1M output tokens

### groq.gpt-oss-120b

Large open-source GPT model with 120 billion parameters.

**Pricing:** $0.15/1M input tokens, $0.075/1M cached input, $0.75/1M output tokens

### groq.gpt-oss-20b

Efficient open-source GPT model with 20 billion parameters.

**Pricing:** $0.075/1M input tokens, $0.0375/1M cached input, $0.30/1M output tokens

### groq.gpt-oss-safeguard-20b

Safety-enhanced GPT model with 20 billion parameters and built-in content filtering.

**Pricing:** $0.075/1M input tokens, $0.0375/1M cached input, $0.30/1M output tokens

### groq.qwen3-32b

Qwen 3 multilingual model with 32 billion parameters, optimized for multiple languages.

**Pricing:** $0.29/1M input tokens, $0.145/1M cached input, $0.59/1M output tokens

---

## Audio Models

### groq.playai-tts

High-quality text-to-speech synthesis with natural-sounding voices.

**Pricing:** $0.00005 per character

**Supported Voices:** Aaliyah-PlayAI, Adelaide-PlayAI, Angelo-PlayAI, Arista-PlayAI, Atlas-PlayAI, Basil-PlayAI, Briggs-PlayAI, Calum-PlayAI, Celeste-PlayAI, Cheyenne-PlayAI, Chip-PlayAI, Cillian-PlayAI, Deedee-PlayAI, Eleanor-PlayAI, Fritz-PlayAI, Gail-PlayAI, Indigo-PlayAI, Jennifer-PlayAI, Judy-PlayAI, Mamaw-PlayAI, Mason-PlayAI, Mikail-PlayAI, Mitch-PlayAI, Nia-PlayAI, Quinn-PlayAI, Ruby-PlayAI, Thunder-PlayAI

```language-selector
bash=:curl https://api.avalai.ir/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "groq.playai-tts",
    "input": "Hello, this is a test of the PlayAI text-to-speech system.",
    "voice": "Aaliyah-PlayAI"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.audio.speech.create(
    model="groq.playai-tts",
    voice="Aaliyah-PlayAI",
    input="Hello, this is a test of the PlayAI text-to-speech system.",
)

response.stream_to_file("output.mp3")

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const mp3 = await client.audio.speech.create({
  model: "groq.playai-tts",
  voice: "Aaliyah-PlayAI",
  input: "Hello, this is a test of the PlayAI text-to-speech system.",
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile("output.mp3", buffer);

```

### groq.playai-tts-arabic

Arabic-optimized text-to-speech synthesis.

**Pricing:** $0.00005 per character

**Supported Voices:** Same as groq.playai-tts

### groq.whisper-large-v3

Advanced speech recognition model based on OpenAI's Whisper Large v3.

**Pricing:** $0.000031 per second of audio ($0.00185 per minute)

```language-selector
bash=:curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F file="@audio.mp3" \
  -F model="groq.whisper-large-v3"

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

with open("audio.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="groq.whisper-large-v3",
        file=audio_file,
    )

print(transcript.text)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const transcript = await client.audio.transcriptions.create({
  model: "groq.whisper-large-v3",
  file: fs.createReadStream("audio.mp3"),
});

console.log(transcript.text);

```

### groq.whisper-large-v3-turbo

Faster speech recognition with maintained accuracy.

**Pricing:** $0.00001111 per second of audio ($0.000067 per minute)

---

## Related Resources

- [groq Provider Support News](en/news/2025-11-20-gemini-3-pro-image-groq-provider-added.md)
- [API Pricing](en/pricing.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Audio Processing Guide](en/guides/audio-processing.md)