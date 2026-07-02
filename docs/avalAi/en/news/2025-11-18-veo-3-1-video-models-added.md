# Veo 3.1 Video Generation Models Added

**Date:** 2025-11-18 / (1404-08-27)

## Summary

We announce support for Google's Veo 3.1 video generation models, offering developers two options for creating AI-generated videos: [`veo-3.1-generate-preview`](en/providers/google.md#veo-3-1-generate-preview) for high-quality output and [`veo-3.1-fast-generate-preview`](en/providers/google.md#veo-3-1-fast-generate-preview) optimized for speed. Both models are accessible through the [`v1/videos`](en/api-reference/videos.md) endpoint with support for text-to-video and image-to-video generation.

---

## Details

### Google Veo 3.1 Video Generation

We introduce Google's Veo 3.1 series, the latest advancement in AI video generation technology. These models enable developers to create high-quality videos from text prompts or reference images, with improved audio generation and enhanced visual quality.

#### Available Models

- **[`veo-3.1-generate-preview`](en/providers/google.md#veo-3-1-generate-preview)**: Delivers superior output quality with rich native audio, natural conversations, and synchronized sound effects. Best for production-ready content requiring maximum visual and audio fidelity.

- **[`veo-3.1-fast-generate-preview`](en/providers/google.md#veo-3-1-fast-generate-preview)**: Speed-optimized version that maintains high quality while providing faster generation times. Ideal for rapid iteration, high-volume projects, and applications requiring quick turnaround.

**Key Features:**

- **Native Audio Generation**: Videos include synchronized audio with natural sound effects and ambient noise
- **Enhanced Image-to-Video**: Improved prompt adherence and character consistency across scenes
- **Flexible Duration**: Generate videos of 4, 6, or 8 seconds (default: 8 seconds)
- **Multiple Resolutions**: Support for 720p and 1080p output (16:9 aspect ratio)
- **Aspect Ratio Options**: 16:9 (landscape) and 9:16 (portrait) formats
- **Reference Images**: Guide generation with up to 3 reference images for character/style consistency
- **Asynchronous Processing**: Poll for completion
- **Video Extension**: Extend existing videos to create longer sequences

**Pricing Details:**

| Model | Cost Per Second |
|-------|-----------------|
| veo-3.1-fast-generate-preview | $0.15/second |
| veo-3.1-generate-preview | $0.40/second |

### API Request/Response Examples

#### Generate a Video

```language-selector
bash=:curl https://api.avalai.ir/v1/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "veo-3.1-fast-generate-preview",
    "prompt": "A cat playing with a ball of yarn in a sunny garden",
    "seconds": "4"
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

video = client.videos.create(
    model="veo-3.1-fast-generate-preview",
    prompt="A cat playing with a ball of yarn in a sunny garden",
    seconds="4",
)

print(f"Video ID: {video.id}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const video = await client.videos.create({
  model: "veo-3.1-fast-generate-preview",
  prompt: "A cat playing with a ball of yarn in a sunny garden",
  seconds: "4",
});

console.log(`Video ID: ${video.id}`);

```

#### Response

```json
{
  "id": "video_abc123def456",
  "object": "video",
  "created_at": 1731916800,
  "status": "processing",
  "model": "veo-3.1-fast-generate-preview",
  "progress": 0,
  "seconds": "4"
}
```

#### Check Video Status

```language-selector
bash=:curl https://api.avalai.ir/v1/videos/video_abc123def456 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import time

# Poll for completion
while True:
    video_status = client.videos.retrieve("video_abc123def456")

    if video_status.status == "completed":
        print(f"Video ready! ID: {video_status.id}")
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    print(f"Status: {video_status.status}, Progress: {video_status.progress}%")
    time.sleep(10)

javascript=:// Poll for completion
while (true) {
  const videoStatus = await client.videos.retrieve("video_abc123def456");
  
  if (videoStatus.status === "completed") {
    console.log(`Video ready! ID: ${videoStatus.id}`);
    break;
  } else if (videoStatus.status === "failed") {
    console.log(`Generation failed: ${videoStatus.error}`);
    break;
  }
  
  console.log(`Status: ${videoStatus.status}, Progress: ${videoStatus.progress}%`);
  await new Promise(resolve => setTimeout(resolve, 10000));
}

```

#### Response (Completed)

```json
{
  "id": "video_abc123def456",
  "object": "video",
  "created_at": 1731916800,
  "status": "completed",
  "model": "veo-3.1-fast-generate-preview",
  "progress": 100,
  "seconds": "4"
}
```

#### Download Video Content

```language-selector
bash=:curl https://api.avalai.ir/v1/videos/video_abc123def456/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output video.mp4

python=:content = client.videos.download_content("video_abc123def456")
with open("video.mp4", "wb") as f:
    f.write(content.read())
print("Video downloaded successfully!")

javascript=:const content = await client.videos.downloadContent("video_abc123def456");
const buffer = Buffer.from(await content.arrayBuffer());
require('fs').writeFileSync('video.mp4', buffer);
console.log("Video downloaded successfully!");

```

### Advanced Features

#### Image-to-Video Generation

Use reference images to guide video generation and ensure visual consistency:

```language-selector
bash=:curl https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=veo-3.1-generate-preview" \
  -F "prompt=The landscape comes alive with flowing water and moving clouds" \
  -F "input_reference=@reference_image.jpg" \
  -F "seconds=8"

python=:video = client.videos.create(
    model="veo-3.1-generate-preview",
    prompt="The landscape comes alive with flowing water and moving clouds",
    input_reference=open("reference_image.jpg", "rb"),
    seconds="8",
)

print(f"Image-to-video generation started: {video.id}")

javascript=:import fs from 'fs';

const video = await client.videos.create({
  model: "veo-3.1-generate-preview",
  prompt: "The landscape comes alive with flowing water and moving clouds",
  input_reference: fs.createReadStream("reference_image.jpg"),
  seconds: "8",
});

console.log(`Image-to-video generation started: ${video.id}`);

```

#### Control Aspect Ratio and Resolution

Specify video dimensions using the `size` parameter:

```language-selector
bash=:# Landscape 16:9 at 1080p
curl https://api.avalai.ir/v1/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "veo-3.1-generate-preview",
    "prompt": "Aerial drone shot of a coastal city at sunset",
    "size": "1920x1080",
    "seconds": "8"
  }'

# Portrait 9:16
curl https://api.avalai.ir/v1/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "veo-3.1-fast-generate-preview",
    "prompt": "Fashion model walking down a city street",
    "size": "1080x1920",
    "seconds": "6"
  }'

python=:# Landscape 16:9 at 1080p
video_landscape = client.videos.create(
    model="veo-3.1-generate-preview",
    prompt="Aerial drone shot of a coastal city at sunset",
    size="1920x1080",
    seconds="8",
)

# Portrait 9:16
video_portrait = client.videos.create(
    model="veo-3.1-fast-generate-preview",
    prompt="Fashion model walking down a city street",
    size="1080x1920",
    seconds="6",
)

javascript=:// Landscape 16:9 at 1080p
const videoLandscape = await client.videos.create({
  model: "veo-3.1-generate-preview",
  prompt: "Aerial drone shot of a coastal city at sunset",
  size: "1920x1080",
  seconds: "8",
});

// Portrait 9:16
const videoPortrait = await client.videos.create({
  model: "veo-3.1-fast-generate-preview",
  prompt: "Fashion model walking down a city street",
  size: "1080x1920",
  seconds: "6",
});

```

### Prompting Best Practices

To get the best results from Veo 3.1 models:

**Be Descriptive and Specific**
- Include visual details: colors, lighting, composition
- Specify movement: camera motions, subject actions
- Define style: cinematic, realistic, artistic
- Set mood: atmospheric, energetic, calm

**Include Audio Cues**
- **Dialogue**: Use quotes for specific speech (e.g., `"This must be the key," he murmured.`)
- **Sound Effects**: Explicitly describe sounds (e.g., `tires screeching loudly, engine roaring`)
- **Ambient Noise**: Describe environment soundscape (e.g., `A faint, eerie hum resonates in the background`)

**Specify Camera Movement**
- "Camera pans left to reveal..."
- "Slow zoom into subject..."
- "Aerial drone shot descending..."
- "Handheld tracking shot following..."

**Good Prompt Example:**
```
A golden retriever puppy playing in a sunlit meadow during golden hour,
camera slowly tracks the puppy running through tall grass,
cinematic depth of field with bokeh effect, warm color grading
```

**Weak Prompt Example:**
```
A dog playing
```

### Model Comparison

| Feature | veo-3.1-generate-preview | veo-3.1-fast-generate-preview |
|---------|-------------------------|------------------------------|
| **Quality** | Highest | High |
| **Speed** | Standard | Faster |
| **Audio** | Rich, natural | High-quality |
| **Cost/Second** | $0.40 | $0.15 |
| **Best For** | Production content | Rapid iteration, high-volume |
| **Max Duration** | 8 seconds | 8 seconds |
| **Resolutions** | 720p, 1080p | 720p, 1080p |

---

## Related Links

- [Video API Reference](en/api-reference/videos.md)
- [Generate Videos Using Veo Guide](en/guides/generate-videos-using-veo.md)
- [Google Models Documentation](en/providers/google.md)
- [Pricing Information](en/pricing.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Best Practices](en/guides/best-practices.md)