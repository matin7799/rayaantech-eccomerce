# RunwayML Provider Support Added

**Date:** 2025-11-19

## Summary

AvalAI now supports RunwayML as a new provider, bringing advanced video generation, image editing, and text-to-speech capabilities to the platform. This integration includes four new models: [`gen4_turbo`](en/providers/runwayml.md) for video generation, [`gen4_image`](en/providers/runwayml.md) and [`gen4_image_turbo`](en/providers/runwayml.md) for image editing, and [`eleven_multilingual_v2`](en/providers/runwayml.md) for multilingual text-to-speech.

---

## Details

### RunwayML Provider

RunwayML is a leading AI company specializing in creative tools for video generation, image editing, and audio synthesis. AvalAI now provides seamless access to RunwayML's powerful models through our unified API, supporting both OpenAI-compatible endpoints and native RunwayML functionality.

For complete documentation, visit the [official RunwayML API documentation](https://docs.dev.runwayml.com/api/).

### New Models

#### Video Generation

- **[`gen4_turbo`](en/providers/runwayml.md)**: High-speed video generation model supporting 2-10 second videos with image reference input. Ideal for rapid prototyping and content creation workflows. Available on the [`v1/videos`](en/api-reference/videos.md) endpoint.

#### Image Editing

- **[`gen4_image`](en/providers/runwayml.md)**: Advanced image editing model supporting multiple resolutions up to 1920x1080. Features comprehensive editing capabilities with high-quality output. Available on the [`v1/images/edits`](en/api-reference/images.md) endpoint.

- **[`gen4_image_turbo`](en/providers/runwayml.md)**: Faster image editing variant optimized for speed while maintaining quality. Perfect for real-time workflows and batch processing. Available on the [`v1/images/edits`](en/api-reference/images.md) endpoint.

#### Text-to-Speech

- **[`eleven_multilingual_v2`](en/providers/runwayml.md)**: Advanced multilingual text-to-speech model provided through RunwayML's API integration with ElevenLabs. Supports natural-sounding voice synthesis across multiple languages. Available on the [`v1/audio/speech`](en/api-reference/audio.md) endpoint.

### Key Features

- **Flexible Video Generation**: Create 2-10 second videos with optional image references
- **Multiple Image Resolutions**: Support for various aspect ratios from 720x720 to 1920x1080
- **High-Quality Audio**: Natural-sounding multilingual text-to-speech
- **OpenAI-Compatible API**: Seamless integration with existing OpenAI SDK code
- **Cost-Effective Pricing**: Competitive pricing for video, image, and audio generation

### Pricing

| Model | Pricing Details |
|-------|----------------|
| `gen4_turbo` | $0.05 per second of video generated |
| `gen4_image` | $0.05 per image (720p)<br>$0.08 per image (1080p) |
| `gen4_image_turbo` | $0.02 per image |
| `eleven_multilingual_v2` | $0.000015 per character |

For complete pricing information, see the [Pricing page](en/pricing.md).

---

## API Examples

### Video Generation with gen4_turbo

Generate videos with image reference support:

```language-selector
bash=:curl -X POST "https://api.avalai.ir/v1/videos" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="The fridge door opens. A cute, chubby purple monster comes out of it." \
  -F model="gen4_turbo" \
  -F size="1280x720" \
  -F seconds="2" \
  -F input_reference="@monster_original_720p.jpeg;type=image/jpeg"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Create video with image reference
video = client.videos.create(
    prompt="The fridge door opens. A cute, chubby purple monster comes out of it.",
    input_reference=open("monster_original_720p.jpeg", "rb"),
    model="gen4_turbo",
    size="1280x720",
    seconds="2",
)

print(f"Video generation started: {video.id}")

javascript=:import { OpenAI } from "openai";
import fs from 'fs';

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Create video with image reference
const video = await client.videos.create({
  prompt: "The fridge door opens. A cute, chubby purple monster comes out of it.",
  input_reference: fs.createReadStream("monster_original_720p.jpeg"),
  model: "gen4_turbo",
  size: "1280x720",
  seconds: "2"
});

console.log(`Video generation started: ${video.id}`);

```

#### Example Response

```json
{
  "id": "video_45d4cf58-6c37-43f1-b7ca-8f349f280a3e",
  "object": "video",
  "status": "completed",
  "created_at": 1732022400,
  "completed_at": 1732022450,
  "expires_at": null,
  "error": null,
  "progress": 100,
  "remixed_from_video_id": null,
  "seconds": "2",
  "size": "1280x720",
  "model": "gen4_turbo",
  "usage": {
    "duration_seconds": 2.0
  },
  "estimated_cost": {
    "unit": "0.1000000000",
    "irt": 11345.0,
    "exchange_rate": 113450
  }
}
```

**Note**: Download the sample image for testing: [monster_original_720p.jpeg](https://docs.avalai.ir/fa/_media/img/monster_original_720p.jpeg)

### Image Editing with gen4_image

Edit images with advanced AI capabilities:

```language-selector
bash=:curl -i https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=gen4_image" \
  -F "prompt=A futuristic spaceship on a colorful galaxy background." \
  -F "image=@input_image.jpg" \
  -F "size=1920x1080"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Edit image
with open("input_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="gen4_image",
        image=image_file,
        prompt="A futuristic spaceship on a colorful galaxy background.",
        size="1920x1080",
    )

print(f"Edited image URL: {response.data[0].url}")

javascript=:import { OpenAI } from "openai";
import fs from 'fs';

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Edit image
const response = await client.images.edit({
  model: "gen4_image",
  image: fs.createReadStream("input_image.jpg"),
  prompt: "A futuristic spaceship on a colorful galaxy background.",
  size: "1920x1080"
});

console.log(`Edited image URL: ${response.data[0].url}`);

```

#### Example Response

```json
{
  "created": 1763557851,
  "data": [
    {
      "url": "https://image-generations.avalai.ir/serve/image-abc123.png?expires=1763644251&signature=xyz789",

      "b64_json": null,
      "revised_prompt": null
    }
  ],
  "estimated_cost": {
    "unit": "0.0850000000",
    "irt": 9643.25,
    "exchange_rate": 113450
  }
}
```

#### Supported Sizes for gen4_image and gen4_image_turbo

Both image editing models support the following resolutions:

- `720x720` - Square format
- `960x720` / `720x960` - 4:3 aspect ratio
- `1024x1024` - Square format (default)
- `1080x1080` - Square format
- `1080x1440` / `1440x1080` - Vertical/horizontal
- `1080x1920` / `1920x1080` - Full HD vertical/horizontal
- `1168x880` - Wide format
- `1280x720` / `720x1280` - HD vertical/horizontal
- `1360x768` - Widescreen
- `1680x720` - Ultra-wide
- `1808x768` - Cinema format
- `2112x912` - Ultra-wide cinema

### Fast Image Editing with gen4_image_turbo

Optimized for speed with competitive quality:

```language-selector
bash=:curl -i https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=gen4_image_turbo" \
  -F "prompt=Add dramatic sunset lighting to the scene." \
  -F "image=@input_image.jpg" \
  -F "size=1024x1024"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Fast image editing
with open("input_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="gen4_image_turbo",
        image=image_file,
        prompt="Add dramatic sunset lighting to the scene.",
        size="1024x1024",
    )

print(f"Edited image URL: {response.data[0].url}")

javascript=:import { OpenAI } from "openai";
import fs from 'fs';

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Fast image editing
const response = await client.images.edit({
  model: "gen4_image_turbo",
  image: fs.createReadStream("input_image.jpg"),
  prompt: "Add dramatic sunset lighting to the scene.",
  size: "1024x1024"
});

console.log(`Edited image URL: ${response.data[0].url}`);

```

### Text-to-Speech with eleven_multilingual_v2

Generate natural-sounding speech in multiple languages:

```language-selector
bash=:curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "eleven_multilingual_v2",
    "input": "Welcome to RunwayML integration on AvalAI. Experience the future of AI-powered creativity.",
    "voice": "alloy"
  }' \
  --output speech.mp3

python=:from openai import OpenAI
from pathlib import Path

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

speech_file_path = Path("./speech.mp3")

response = client.audio.speech.create(
    model="eleven_multilingual_v2",
    voice="alloy",
    input="Welcome to RunwayML integration on AvalAI. Experience the future of AI-powered creativity.",
)

response.stream_to_file(speech_file_path)
print(f"Audio saved to {speech_file_path}")

javascript=:import fs from "fs";
import path from "path";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const mp3 = await client.audio.speech.create({
    model: "eleven_multilingual_v2",
    voice: "alloy",
    input: "Welcome to RunwayML integration on AvalAI. Experience the future of AI-powered creativity.",
  });
  
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  console.log(`Audio saved to ${speechFile}`);
}

main();

```

---

## Getting Started

To start using RunwayML models:

1. Ensure you have an active AvalAI account with sufficient credits
2. Use your existing AvalAI API key - no additional configuration needed
3. Reference the model names in your API calls: `gen4_turbo`, `gen4_image`, `gen4_image_turbo`, or `eleven_multilingual_v2`
4. Follow the code examples above for your preferred programming language

---

## Related Links

- [RunwayML Models Documentation](en/providers/runwayml.md)
- [Video Generation API Reference](en/api-reference/videos.md)
- [Image Editing API Reference](en/api-reference/images.md)
- [Audio API Reference](en/api-reference/audio.md)
- [Pricing Details](en/pricing.md)
- [Official RunwayML API Documentation](https://docs.dev.runwayml.com/api/)