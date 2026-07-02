# New Models Added: GPT-4o mini TTS and Stability AI Models Now Available

**Date:** 2025-05-04

## Summary

AvalAI is pleased to announce support for OpenAI's GPT-4o mini TTS, a new text-to-speech model built on the powerful GPT-4o mini language model. This model converts text to natural-sounding speech with high quality at fast speeds, offering an excellent balance of performance and efficiency. Additionally, we've added support for several new Stability AI image generation models to expand your creative options.

---

## Details

### OpenAI

- **gpt-4o-mini-tts**: A text-to-speech model powered by GPT-4o mini, converting text to natural sounding spoken audio with high performance and fast processing speeds. [Documentation](en/models/gpt-4o-mini-tts.md)

GPT-4o mini TTS represents an advancement in text-to-speech technology, leveraging the capabilities of the GPT-4o mini language model to generate more natural and expressive speech. This model is ideal for applications requiring high-quality voice output with efficient processing, such as virtual assistants, content accessibility features, and audio content creation.

### Stability AI

We're also excited to announce support for the latest image generation models from Stability AI:

- **stability.sd3-large-v1:0**: The latest large Stable Diffusion 3 model offering high-quality image generation
- **stability.sd3-5-large-v1:0**: An advanced Stable Diffusion 3.5 model with enhanced capabilities
- **stability.stable-image-ultra-v1:1**: Ultra-high quality image generation with exceptional detail (version 1.1)
- **stability.stable-image-ultra-v1:0**: Ultra-high quality image generation with exceptional detail (version 1.0)
- **stability.stable-image-core-v1:1**: Core image generation model optimized for efficiency and quality (version 1.1)
- **stability.stable-image-core-v1:0**: Core image generation model optimized for efficiency and quality (version 1.0)

These models provide a range of options from efficient image generation to ultra-high quality outputs, suitable for various creative and professional applications.

### Key Features

- **Natural Speech**: Produces human-like speech with appropriate intonation and expression
- **Fast Processing**: Delivers quick conversions from text to audio
- **High Performance**: Offers superior quality compared to traditional TTS systems
- **Efficient Resource Usage**: Built on the efficient GPT-4o mini architecture
- **2000 Token Input Limit**: Supports text inputs up to 2000 tokens in length

### Pricing

GPT-4o mini TTS offers competitive pricing:

- **Input**: $0.60 per 1M characters (text characters in 'prompt' and 'instruction' payload)
- **Output**: $0.00025 per second of audio output generated
- **Estimated Output Cost**: Approximately $15 per minute of audio (may vary depending on OpenAI's exact calculation)

This represents significant cost savings compared to higher-tier models like GPT-4o Realtime, while maintaining excellent performance.

### GPT-4o mini TTS Usage Examples

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate speech from text
response = client.audio.speech.create(
    model="gpt-4o-mini-tts",
    voice="alloy",
    input="Welcome to AvalAI! We're excited to introduce the new GPT-4o mini TTS model for natural-sounding speech generation.",
)

# Save the audio to a file
response.stream_to_file("output.mp3")

javascript=:import { OpenAI } from "openai";
import * as fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function generateSpeech() {
  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input:
      "Welcome to AvalAI! We're excited to introduce the new GPT-4o mini TTS model for natural-sounding speech generation.",
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync("output.mp3", buffer);
}

generateSpeech();

```

### Rate Limits

GPT-4o mini TTS is available on the following usage tiers:

| Tier   | Requests Per Minute (RPM) | Tokens Per Minute (TPM) |
| ------ | ------------------------- | ----------------------- |
| Tier 1 | 500                       | 50,000                  |
| Tier 2 | 2,000                     | 150,000                 |
| Tier 3 | 5,000                     | 600,000                 |
| Tier 4 | 10,000                    | 2,000,000               |
| Tier 5 | 10,000                    | 8,000,000               |

Note that the Free tier does not support this model.

### API Response Updates: Estimated Cost Information

We've added a new feature to our API responses: an `estimated_cost` dictionary that provides pricing information in multiple currencies. This helps you track and manage your API usage costs more effectively. The dictionary includes:

- **unit**: Cost in USD/USDT
- **irt**: Cost in Tomans (IRT), calculated as USD cost × USDT-IRT exchange rate
- **exchange_rate**: Current USDT-IRT exchange rate used for the conversion

Example response with estimated cost:

```json
{
  "id": "response-123456",
  "object": "chat.completion",
  "created": 1714911234,
  "model": "gpt-4o-mini-tts",
  "choices": [...],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 128,
    "total_tokens": 170
  },
  "estimated_cost": {
    "unit": 0.0025,
    "irt": 200,
    "exchange_rate": 80000
  }
}
```

Please note that:

- This field might not be present in all responses
- For regular (non-streaming) requests, it's included in the main response
- For streaming requests, it's attached to the last chunk of the streaming response
- The estimated cost is not guaranteed to be present as it's an estimate, not the final billing amount

---

## Related Links

- [Audio API Reference](en/api-reference/audio.md)
- [Speech Generation Guide](en/guides/speech-generation.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Pricing Information](en/pricing.md)
- [Image Generation Guide](en/guides/image-generation.md)
