# RunwayML Models

AvalAI provides access to RunwayML's advanced AI models for video generation, image editing, and text-to-speech through our unified API. This page details the available RunwayML models, their capabilities, and optimal use cases.

## Overview

RunwayML is a leading AI company specializing in creative tools for video generation, image editing, and audio synthesis. Through AvalAI, you can access RunwayML's powerful models using familiar OpenAI-compatible endpoints, making integration seamless with existing codebases.

**Official Documentation:** [RunwayML API Documentation](https://docs.dev.runwayml.com/api/)

## Video Generation Models

### gen4.5

RunwayML's flagship video generation model with state-of-the-art motion quality, prompt adherence, and visual fidelity. Gen-4.5 is the world's top-rated video model with 1,247 Elo points on the Artificial Analysis Text to Video benchmark.

| Feature | Details |
|---------|---------|
| Model ID | `gen4.5` |
| Type | Video Generation |
| Duration | 2-10 seconds |
| Resolutions | 1280x720, 720x1280, 1920x1080, 1080x1920, and more |
| Default Resolution | 1280x720 |
| Default Duration | 5 seconds |
| Image Reference | Supported (required) |
| Pricing | $0.12 per second of video |
| API Endpoint | [`v1/videos`](en/api-reference/videos.md) |
| Best for | Cinematic content, professional videos, complex scenes, expressive characters |

#### Key Features

- **World's Top-Rated**: 1,247 Elo points on Artificial Analysis Text to Video benchmark
- **State-of-the-Art Quality**: Unprecedented visual fidelity and precise prompt adherence
- **Physical Accuracy**: Realistic physics with proper dynamics, collisions, and natural movement
- **Complex Scene Rendering**: Intricate, multi-element scenes with detailed compositions
- **Expressive Characters**: Nuanced emotions, natural gestures, and lifelike facial detail
- **Temporal Consistency**: Maintains coherence across motion and time

> **⚠️ Important: Prompt Character Limit**
>
> The `prompt` field has a maximum limit of **1000 characters**. If your prompt exceeds this limit, the API will return an error and the video generation will fail. Keep your prompts concise and focused on the most important visual and motion elements.

#### Example Usage

```language-selector
bash=:curl -X POST "https://api.avalai.ir/v1/videos" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="A cinematic scene of a young woman with striking features, captured in a close-up that emphasizes her intense gaze." \
  -F model="gen4.5" \
  -F size="1920x1080" \
  -F seconds="5" \
  -F input_reference="@portrait_reference.jpeg;type=image/jpeg"

python=:from openai import OpenAI
import time

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Create video with gen4.5
video = client.videos.create(
    prompt="A cinematic scene of a young woman with striking features, captured in a close-up that emphasizes her intense gaze.",
    input_reference=open("portrait_reference.jpeg", "rb"),
    model="gen4.5",
    size="1920x1080",
    seconds="5",
)

print(f"Video generation started: {video.id}")

# Poll for completion
while True:
    video_status = client.videos.retrieve(video.id)

    if video_status.status == "completed":
        print(f"Video ready! ID: {video.id}")
        with client.with_streaming_response.videos.retrieve_content(
            video.id
        ) as response:
            with open("gen45_output.mp4", "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    time.sleep(10)

javascript=:import { OpenAI } from "openai";
import fs from 'fs';

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const video = await client.videos.create({
  prompt: "A cinematic scene of a young woman with striking features, captured in a close-up that emphasizes her intense gaze.",
  input_reference: fs.createReadStream("portrait_reference.jpeg"),
  model: "gen4.5",
  size: "1920x1080",
  seconds: "5"
});

console.log(`Video generation started: ${video.id}`);

```

---

### gen4_turbo

High-speed video generation model supporting 2-10 second videos with image reference input. Perfect for rapid prototyping and content creation workflows.

| Feature | Details |
|---------|---------|
| Model ID | `gen4_turbo` |
| Type | Video Generation |
| Duration | 2-10 seconds |
| Resolutions | 1280x720, 720x1280, 1920x1080, 1080x1920, and more |
| Default Resolution | 1280x720 |
| Default Duration | 5 seconds |
| Image Reference | Supported (required) |
| Pricing | $0.05 per second of video |
| API Endpoint | [`v1/videos`](en/api-reference/videos.md) |
| Best for | Quick video generation, prototyping, content creation with image references |

#### Key Features

- **Image-to-Video**: Requires an input reference image to guide video generation
- **Flexible Duration**: Choose from 2 to 10 seconds for your video
- **Multiple Resolutions**: Support for various aspect ratios
- **Fast Generation**: Optimized for speed while maintaining quality

> **⚠️ Important: Prompt Character Limit**
>
> The `prompt` field has a maximum limit of **1000 characters**. If your prompt exceeds this limit, the API will return an error and the video generation will fail. Keep your prompts concise and focused on the most important visual and motion elements.

#### Supported Resolutions

| Resolution | Aspect Ratio | Orientation |
|------------|--------------|-------------|
| 720x1280 | 9:16 | Portrait |
| 1280x720 | 16:9 | Landscape (default) |
| 1080x1920 | 9:16 | Portrait HD |
| 1920x1080 | 16:9 | Landscape HD |

#### Example Usage

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

const video = await client.videos.create({
  prompt: "The fridge door opens. A cute, chubby purple monster comes out of it.",
  input_reference: fs.createReadStream("monster_original_720p.jpeg"),
  model: "gen4_turbo",
  size: "1280x720",
  seconds: "2"
});

console.log(`Video generation started: ${video.id}`);

```

## Image Editing Models

### gen4_image

Advanced image editing model supporting multiple resolutions up to 1920x1080. Features comprehensive editing capabilities with high-quality output.

| Feature | Details |
|---------|---------|
| Model ID | `gen4_image` |
| Type | Image Editing |
| Resolutions | 720x720 to 2112x912 (16 different sizes) |
| Default Resolution | 1024x1024 |
| Pricing | $0.05 per image (720p)<br>$0.08 per image (1080p) |
| API Endpoint | [`v1/images/edits`](en/api-reference/images.md) |
| Best for | High-quality image editing, professional workflows, detailed transformations |

#### Supported Resolutions

| Resolution | Aspect Ratio | Description |
|------------|--------------|-------------|
| 720x720 | 1:1 | Square |
| 720x960 / 960x720 | 3:4 / 4:3 | Portrait/Landscape |
| 720x1280 / 1280x720 | 9:16 / 16:9 | HD Portrait/Landscape |
| 1024x1024 | 1:1 | Square (default) |
| 1080x1080 | 1:1 | Square |
| 1080x1440 / 1440x1080 | 3:4 / 4:3 | Portrait/Landscape |
| 1080x1920 / 1920x1080 | 9:16 / 16:9 | Full HD |
| 1168x880 | ~4:3 | Wide |
| 1360x768 | ~16:9 | Widescreen |
| 1680x720 | ~7:3 | Ultra-wide |
| 1808x768 | ~2.35:1 | Cinema |
| 2112x912 | ~2.35:1 | Ultra-wide Cinema |

#### Example Usage

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

const response = await client.images.edit({
  model: "gen4_image",
  image: fs.createReadStream("input_image.jpg"),
  prompt: "A futuristic spaceship on a colorful galaxy background.",
  size: "1920x1080"
});

console.log(`Edited image URL: ${response.data[0].url}`);

```

### gen4_image_turbo

Faster image editing variant optimized for speed while maintaining quality. Perfect for real-time workflows and batch processing.

| Feature | Details |
|---------|---------|
| Model ID | `gen4_image_turbo` |
| Type | Image Editing (Fast) |
| Resolutions | 720x720 to 2112x912 (same as gen4_image) |
| Default Resolution | 1024x1024 |
| Pricing | $0.02 per image |
| API Endpoint | [`v1/images/edits`](en/api-reference/images.md) |
| Best for | Fast image editing, batch processing, real-time applications |

#### Key Differences from gen4_image

- **2.5x faster** generation speed
- **60% lower cost** ($0.02 vs $0.05-$0.08)
- **Same resolution support** as gen4_image
- Slightly lower quality than gen4_image but still excellent

#### Example Usage

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

const response = await client.images.edit({
  model: "gen4_image_turbo",
  image: fs.createReadStream("input_image.jpg"),
  prompt: "Add dramatic sunset lighting to the scene.",
  size: "1024x1024"
});

console.log(`Edited image URL: ${response.data[0].url}`);

```

## Text-to-Speech Model

### runwayml.eleven_multilingual_v2

Advanced multilingual text-to-speech model provided through RunwayML's API integration with ElevenLabs. Supports natural-sounding voice synthesis across multiple languages.

> **Note:** This model is accessed via RunwayML's integration and uses the model ID `eleven_multilingual_v2` when calling through AvalAI. For direct access to ElevenLabs models with additional features (including newer models like Turbo v2.5, Flash v2.5, and STT capabilities), see [ElevenLabs Models](en/providers/elevenlabs.md).

| Feature | Details |
|---------|---------|
| Model ID | `eleven_multilingual_v2` (via RunwayML) |
| Type | Text-to-Speech |
| Languages | Multiple languages supported |
| Voices | Standard OpenAI voices (alloy, echo, fable, onyx, nova, shimmer) |
| Audio Formats | mp3, opus, aac, flac, wav, pcm |
| Default Format | mp3 |
| Pricing | $0.000015 per character |
| API Endpoint | [`v1/audio/speech`](en/api-reference/audio.md) |
| Best for | Multilingual applications, natural voice synthesis, content narration |

#### Direct ElevenLabs Provider vs RunwayML Integration

| Feature | RunwayML Integration | Direct ElevenLabs |
|---------|---------------------|-------------------|
| Model ID | `eleven_multilingual_v2` | `eleven_multilingual_v2`, `eleven_turbo_v2`, `eleven_turbo_v2_5`, `eleven_flash_v2`, `eleven_flash_v2_5` |
| Pricing | $0.000015/character | $0.0025-$0.005/second |
| STT Support | No | Yes (`scribe_v1`, `scribe_v2`) |
| Latest Models | No | Yes (Flash v2.5, Turbo v2.5) |
| Voice Options | OpenAI standard voices | ElevenLabs native voices |

#### Key Features

- **Multilingual Support**: Generate speech in multiple languages
- **Natural Voices**: High-quality, natural-sounding voice output
- **Multiple Formats**: Support for various audio formats
- **Character-based Pricing**: Pay only for what you use
- **OpenAI Compatible**: Works with existing OpenAI SDK code

#### Example Usage

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

## Pricing Summary

| Model | Pricing |
|-------|---------|
| gen4_turbo | $0.05 per second of video |
| gen4_image | $0.05 per image (720p)<br>$0.08 per image (1080p) |
| gen4_image_turbo | $0.02 per image |
| eleven_multilingual_v2 | $0.000015 per character |

For detailed pricing information, see the [Pricing page](en/pricing.md).

## Model Comparison

### Image Editing Models: gen4_image vs gen4_image_turbo

| Feature | gen4_image | gen4_image_turbo |
|---------|------------|------------------|
| **Quality** | High | Good |
| **Speed** | Standard | 2.5x faster |
| **Cost** | $0.05-$0.08 | $0.02 |
| **Resolutions** | 16 sizes | 16 sizes |
| **Best for** | Professional work | Batch processing, fast workflows |

**Recommendation:**
- Use **gen4_image** for final production work requiring maximum quality
- Use **gen4_image_turbo** for rapid iteration, batch processing, or real-time applications

## Best Practices

### Video Generation with gen4_turbo

1. **Image Reference Quality**: Use high-quality reference images for best results
2. **Prompt Clarity**: Be specific about the desired action and movement
3. **Duration Selection**: Start with shorter videos (2-4 seconds) for faster iteration
4. **Resolution Choice**: Match resolution to your target platform (16:9 for YouTube, 9:16 for TikTok)

### Image Editing Optimization

1. **Input Image Quality**: Provide clear, well-lit input images
2. **Prompt Specificity**: Describe the desired changes in detail
3. **Resolution Selection**: Choose appropriate resolution for your use case
4. **Model Selection**: Use gen4_image_turbo for testing, gen4_image for final output

### Text-to-Speech Usage

1. **Text Formatting**: Use proper punctuation for natural pauses
2. **Voice Selection**: Test different voices to find the best match for your content
3. **Character Count**: Monitor character usage to manage costs
4. **Audio Format**: Choose format based on your playback requirements

## Use Cases

### Creative Content Production
- Social media video content
- Marketing materials
- Product demonstrations
- Educational content

### Image Enhancement and Transformation
- Product image editing
- Creative image manipulation
- Style transfer and artistic effects
- Background modifications

### Voice and Audio Content
- Narration for videos
- Audiobook production
- Multilingual content creation
- Accessibility features

## Rate Limits and Quotas

Video generation and image editing have usage limits based on your AvalAI tier:

- **Video Generation**: Asynchronous processing with status polling
- **Image Editing**: Synchronous or asynchronous depending on load
- **Text-to-Speech**: Standard rate limits apply

For detailed rate limit information, see the [Rate Limits guide](en/guides/rate-limits.md).

## Error Handling

Common error scenarios and how to handle them:

### Video Generation Errors
- **Invalid image format**: Ensure input_reference is JPEG or PNG
- **Duration out of range**: Use 2-10 seconds only
- **Unsupported resolution**: Check supported resolutions list

### Image Editing Errors
- **Image too large**: Maximum file size varies by resolution
- **Invalid size parameter**: Use exact resolution strings from supported list
- **Prompt too long**: Keep prompts under 1000 characters

### Text-to-Speech Errors
- **Text too long**: Break long texts into smaller chunks
- **Invalid voice**: Use supported voice names
- **Unsupported format**: Check supported audio format list

## Related Resources

- [Video Generation API Reference](en/api-reference/videos.md)
- [Image Editing API Reference](en/api-reference/images.md)
- [Audio API Reference](en/api-reference/audio.md)
- [Pricing Details](en/pricing.md)
- [Error Handling Guide](en/guides/error-handling.md)
- [Official RunwayML Documentation](https://docs.dev.runwayml.com/api/)