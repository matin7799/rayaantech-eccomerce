# Generating Videos Using Veo

Learn how to generate AI-powered videos using Google's Veo 3.1 models available through the AvalAI API.

## Introduction

The AvalAI [Video API](en/api-reference/videos.md) provides endpoints for video generation using Google's Veo 3.1 models. These state-of-the-art models can create realistic videos with native audio from text descriptions, with support for:

- **Text-to-Video:** Create videos from scratch based on detailed text prompts
- **Image-to-Video:** Generate videos starting from a reference image
- **Reference Images:** Maintain character consistency using reference images (ingredients to video)
- **Video Extension:** Extend existing videos to create longer sequences
- **Native Audio:** Rich audio generation including dialogue, sound effects, and ambient noise
- **Asynchronous Processing:** Generate videos up to 8 seconds with status polling

This guide covers using these capabilities via AvalAI to create compelling video content with synchronized audio.

> **⚠️ IMPORTANT: Connection Interruptions**
>
> Video generation and remix operations are **asynchronous** - the server begins processing your request immediately upon submission. If your connection is interrupted during or after submission, **DO NOT immediately retry** with a new generation request, as this may result in duplicate charges.
>
> **What to do if your connection is interrupted:**
>
> 1. Use the [List Videos endpoint](#list-videos) to retrieve all your videos:
>
>    curl -X GET https://api.avalai.ir/v1/videos/ \
>      -H "Authorization: Bearer $AVALAI_API_KEY"
>
>
> 2. Check the `status` field of your most recent video:
>    - If `status == "failed"`: The video did not start generating, and **no costs will apply**. You can safely submit a new request.
>    - If `status` is anything other than `"failed"` (e.g., `"queued"`, `"processing"`, `"completed"`): The generation **has started or completed**, and **costs will be charged**. Wait for this video to complete instead of creating a duplicate request.
>
> This practice helps you avoid unnecessary credit usage and duplicate video generations.

## Which Model to Use?

AvalAI provides access to two Veo 3.1 video generation models, each optimized for different use cases:

### veo-3.1-generate-001

Best for high-quality video generation with rich audio:
- **Aspect Ratios:** 16:9 (landscape) and 9:16 (portrait)
- **Resolutions:** 720p, 1080p (16:9 only)
- **Duration:** 4, 6, or 8 seconds (default: 8)
- **Audio:** Native audio generation with dialogue, sound effects, and ambient noise
- **Pricing:** $0.40 per second
- **Use Cases:** Professional content, marketing videos, high-quality productions
- **Processing:** Asynchronous with status polling

### veo-3.1-fast-generate-001

Designed for speed and cost-effectiveness while maintaining high quality:
- **Aspect Ratios:** 16:9 (landscape) and 9:16 (portrait)
- **Resolutions:** 720p, 1080p (16:9 only)
- **Duration:** 4, 6, or 8 seconds (default: 8)
- **Audio:** Native audio generation with sound effects
- **Pricing:** $0.15 per second
- **Use Cases:** Rapid prototyping, social media content, backend services, A/B testing
- **Processing:** Asynchronous with faster generation times

Both models support image references, video extension, and reference images for character consistency.

## Basic Video Generation

The simplest way to generate a video is to provide a text prompt. The API processes your request asynchronously and you can poll for completion status.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create video generation request
video = client.videos.create(
    model="veo-3.1-fast-generate-001",
    prompt="A serene lake at sunset with mountains in the background, gentle ripples on the water surface, soft ambient sounds of water lapping",
    size="1280x720",
    seconds="4",
    safety_identifier="project_demo_001",  # Optional: for internal tracking
)

print(f"Video generation started: {video.id}")
print(f"Request ID: {video.request_id}")  # Use for cost tracking

# Poll for completion
while True:
    video_status = client.videos.retrieve(video.id)

    if video_status.status == "completed":
        print(f"Video ready! ID: {video.id}")

        # Download the video content
        with client.with_streaming_response.videos.retrieve_content(
            video.id
        ) as response:
            with open("output.mp4", "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        print("Video downloaded to output.mp4")
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    time.sleep(10)

bash=:# Create video generation request with safety_identifier for tracking
curl -X POST https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "veo-3.1-fast-generate-001",
    "prompt": "A serene lake at sunset with mountains in the background, gentle ripples on the water surface, soft ambient sounds of water lapping",
    "size": "1280x720",
    "seconds": "4",
    "safety_identifier": "project_demo_001"
  }'

# Check generation status
curl -X GET https://api.avalai.ir/v1/videos/video_691bab4a12248190b1e9123d8648ff4d \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Download completed video
curl -X GET https://api.avalai.ir/v1/videos/video_691bab4a12248190b1e9123d8648ff4d/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output video.mp4

javascript=:import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: 'https://api.avalai.ir/v1'
});

async function generateVideo() {
    // Create video generation request
    const video = await client.videos.create({
        model: 'veo-3.1-fast-generate-001',
        prompt: 'A serene lake at sunset with mountains in the background, gentle ripples on the water surface, soft ambient sounds of water lapping',
        size: '1280x720',
        seconds: '4',
        safety_identifier: 'project_demo_001'  // Optional: for internal tracking
    });

    console.log(`Video generation started: ${video.id}`);
    console.log(`Request ID: ${video.request_id}`);  // Use for cost tracking

    // Poll for completion
    while (true) {
        const videoStatus = await client.videos.retrieve(video.id);

        if (videoStatus.status === 'completed') {
            console.log(`Video ready! ID: ${video.id}`);

            // Download the video content
            const response = await client.videos.retrieveContent(video.id);
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync('output.mp4', buffer);
            console.log('Video downloaded to output.mp4');
            break;
        } else if (videoStatus.status === 'failed') {
            console.log(`Generation failed: ${videoStatus.error}`);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

generateVideo();

```

## Using Image References

You can provide a reference image to guide the video generation. Veo uses the input image as the initial frame, making it perfect for animating everyday objects, bringing drawings and paintings to life, and adding movement and sound to nature scenes.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create video with image reference
video = client.videos.create(
    model="veo-3.1-generate-001",
    prompt="The landscape comes alive with flowing water and moving clouds, birds flying overhead, gentle wind rustling through trees",
    input_reference=open("reference_image.jpg", "rb"),
    size="1920x1080",
    seconds="6",
)

print(f"Video generation started: {video.id}")

# Poll for completion
while True:
    video_status = client.videos.retrieve(video.id)

    if video_status.status == "completed":
        print(f"Video ready! ID: {video.id}")

        # Download the video
        with client.with_streaming_response.videos.retrieve_content(
            video.id
        ) as response:
            with open("landscape_video.mp4", "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        print("Video downloaded")
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    time.sleep(10)

bash=:# Create video with image reference
curl -X POST https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=veo-3.1-generate-001" \
  -F "prompt=The landscape comes alive with flowing water and moving clouds, birds flying overhead, gentle wind rustling through trees" \
  -F "input_reference=@reference_image.jpg;type=image/jpeg" \
  -F "size=1920x1080" \
  -F "seconds=6"

# Poll for status (repeat until completed)
curl -X GET https://api.avalai.ir/v1/videos/video_691bab4a12248190b1e9123d8648ff4d \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Download when completed
curl -X GET https://api.avalai.ir/v1/videos/video_691bab4a12248190b1e9123d8648ff4d/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output landscape_video.mp4

javascript=:import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: 'https://api.avalai.ir/v1'
});

async function generateVideoWithImage() {
    // Create video with image reference
    const video = await client.videos.create({
        model: 'veo-3.1-generate-001',
        prompt: 'The landscape comes alive with flowing water and moving clouds, birds flying overhead, gentle wind rustling through trees',
        input_reference: fs.createReadStream('reference_image.jpg'),
        size: '1920x1080',
        seconds: '6'
    });

    console.log(`Video generation started: ${video.id}`);

    // Poll for completion
    while (true) {
        const videoStatus = await client.videos.retrieve(video.id);

        if (videoStatus.status === 'completed') {
            console.log(`Video ready! ID: ${video.id}`);

            // Download the video
            const response = await client.videos.retrieveContent(video.id);
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync('landscape_video.mp4', buffer);
            console.log('Video downloaded');
            break;
        } else if (videoStatus.status === 'failed') {
            console.log(`Generation failed: ${videoStatus.error}`);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

generateVideoWithImage();

```

## Best Practices for Prompting

Creating effective prompts is crucial for generating high-quality videos with Veo. Follow these guidelines:

### Be Descriptive and Specific

Good prompts are descriptive and clear. Include these elements in your prompt:

- **Subject:** The object, person, animal, or scenery (cityscape, nature, vehicles, puppies)
- **Action:** What the subject is doing (walking, running, turning their head)
- **Style:** Creative direction (sci-fi, horror film, film noir, cartoon, animated styles)
- **Camera positioning and motion:** [Optional] Aerial view, eye-level, top-down shot, dolly shot
- **Composition:** [Optional] Wide shot, close-up, single-shot, two-shot
- **Focus and lens effects:** [Optional] Shallow focus, deep focus, soft focus, macro lens, wide-angle lens
- **Ambiance:** [Optional] Blue tones, night, warm tones, lighting conditions

**Good Example:**
```
A golden retriever puppy playing in a sunlit meadow at golden hour,
camera slowly tracking the puppy as it runs through tall grass,
cinematic depth of field with bokeh effect, warm color grading,
gentle rustling sounds and soft barking
```

**Poor Example:**
```
A dog playing
```

### Prompting for Audio

Veo 3.1 generates native audio synchronized with the video. You can provide cues for:

**Dialogue:** Use quotes for specific speech
```
"This must be the key," he murmured, voice echoing in the empty hallway
```

**Sound Effects (SFX):** Explicitly describe sounds
```
tires screeching loudly, engine roaring, metal crunching
```

**Ambient Noise:** Describe the environment's soundscape
```
A faint, eerie hum resonates in the background, distant bird chirps, wind rustling leaves
```

**Example with Rich Audio:**
```
A wide shot of a misty Pacific Northwest forest. Two exhausted hikers,
a man and a woman, push through ferns when the man stops abruptly.
Man: (Hand on knife) "That's no ordinary bear." Woman: (Voice tight)
"Then what is it?" Rough bark sounds, snapping twigs, footsteps on damp earth.
```

### Specify Camera Movements

Include camera movement instructions when relevant:
- "Camera pans left to reveal..."
- "Slow zoom into the subject..."
- "Aerial drone shot descending..."
- "POV shot from a moving vehicle..."
- "Tracking dolly shot following..."

### Set the Scene Context

Establish time, place, and atmosphere:
- Time of day (golden hour, midnight, dawn, sunset)
- Weather conditions (foggy, sunny, rainy, stormy)
- Location details (urban street, forest clearing, beach, mountains)
- Lighting (dramatic shadows, soft ambient light, neon glow)

### Use Temporal Descriptions

Describe how the scene evolves:
- "Starting with a close-up, then pulling back to reveal..."
- "The sun rises gradually over the mountains..."
- "Waves crash against rocks with increasing intensity..."
- "Camera slowly dollies in to show..."

## Resolution and Aspect Ratio Guidelines

### How `size` Maps to Aspect Ratio and Resolution

The AvalAI Video API accepts the standard OpenAI `size` parameter (`"WIDTHxHEIGHT"`) and automatically applies the matching Veo aspect ratio and resolution:

| `size` value | Orientation | Aspect Ratio | Resolution |
|--------------|-------------|--------------|------------|
| `1280x720`   | Landscape   | `16:9`       | `720p`     |
| `1920x1080`  | Landscape   | `16:9`       | `1080p`    |
| `720x1280`   | Portrait    | `9:16`       | `720p`     |
| `1080x1920`  | Portrait    | `9:16`       | `1080p`    |

**Mapping rules:**

- **Aspect ratio** is derived from orientation: if `height > width`, the request uses `9:16`; otherwise `16:9`.
- **Resolution** is derived from the shorter edge: `≥1080` → `1080p`, `≥720` → `720p`, `≥2160` (or longer edge `≥3840`) → `4k`.
- If you omit `size`, Veo's default of `720p` at `16:9` applies.

This means any supported `WIDTHxHEIGHT` value produces the correct resolution and orientation — you do not need to set aspect ratio or resolution separately for standard sizes.

### Advanced: Overriding Aspect Ratio and Resolution Directly

You may bypass `size` entirely and pass Veo's native fields through `extra_body`. Values set in `extra_body` take precedence over anything inferred from `size`. This is useful when you want, for example, a 9:16 video at 1080p, or you need to set `negativePrompt`, `personGeneration`, etc.

```python
video = client.videos.create(
    model="veo-3.1-generate-001",
    prompt="A bustling cyberpunk alleyway at night",
    seconds="6",
    extra_body={
        "aspectRatio": "9:16",  # "16:9" or "9:16"
        "resolution": "1080p",  # "720p", "1080p", or "4k" (where supported)
        # "negativePrompt": "blurry, low quality",
        # "personGeneration": "allow_adult",
    },
)
```

`aspect_ratio` (snake_case) is also accepted in `extra_body` for convenience and is treated the same as `aspectRatio`.

### Choosing the Right Resolution

Veo supports two primary resolutions with specific aspect ratio requirements:

**720p Resolution**
- **Landscape (16:9):** `1280x720` or any 16:9 size whose shorter edge is `720`
- **Portrait (9:16):** `720x1280` or any 9:16 size whose shorter edge is `720`
- Best for: Social media, web content, mobile-first platforms
- Use case: Instagram Stories, TikTok, Reels, YouTube Shorts

**1080p Resolution (16:9 only)**
- **Landscape:** `1920x1080`
- Best for: High-quality web content, professional videos
- Use case: YouTube, presentations, marketing materials
- **Note:** Only available for 16:9 aspect ratio

### Duration Considerations

- **Short (4 seconds):** Quick social media clips, loops, transitions
- **Medium (6 seconds):** Story segments, product highlights
- **Long (8 seconds):** Scene establishment, narrative sequences, detailed actions

## Cost Optimization Strategies

Optimize costs while maintaining quality:

### 1. Start with veo-3.1-fast for Testing

Use the fast model for initial iterations:
```python
# Test with veo-3.1-fast first
response = client.videos.create(
    model="veo-3.1-fast-generate-001",  # $0.15/second
    prompt="Your test prompt",
    size="1280x720",
    seconds="4",  # Start with shorter duration
)
```

### 2. Use Appropriate Duration

Generate only the duration you need:
- 4 seconds: Quick loops, transitions ($0.60 - $1.60)
- 6 seconds: Standard clips ($0.90 - $2.40)
- 8 seconds: Full scenes ($1.20 - $3.20)

### 3. Choose Resolution Wisely

1080p is only supported for 16:9 aspect ratio:
- Use 720p for portrait videos (9:16)
- Use 1080p only when high quality is essential
- Test with 720p first to refine prompts

### 4. Extend Videos Strategically

Create longer content by extending existing videos:
```python
# Generate base video (8 seconds)
base_video = client.videos.create(
    model="veo-3.1-fast-generate-001", prompt="Opening scene...", seconds="8"
)

# Extend multiple times for longer content
extended_1 = client.videos.extend(
    video_id=base_video.id, prompt="Continue the action...", seconds="8"
)
```

## Error Handling and Troubleshooting

### Common Issues and Solutions

#### Generation Timeout
If generation takes longer than expected:
- Increase polling timeout duration (up to 6 minutes during peak hours)
- Check video status for error messages
- Use exponential backoff in polling logic

#### Invalid Size Parameter
Ensure `size` matches model capabilities. Orientation is inferred from `height > width` (portrait → `9:16`, otherwise `16:9`) and resolution from the shorter edge (`720` → `720p`, `1080` → `1080p`):

- **720p:** `1280x720` (16:9) or `720x1280` (9:16)
- **1080p:** `1920x1080` (16:9 only — Veo does not support 1080p portrait)

If you need explicit control, send `aspectRatio` and `resolution` through `extra_body` — they override anything inferred from `size`.

#### Audio Safety Filters
Veo 3.1 may block videos due to audio safety filters:
- You won't be charged if video is blocked
- Refine prompts to avoid content policy violations
- Remove explicit dialogue or offensive sound descriptions

#### Image Reference Issues
When using references:
- Ensure images are properly formatted (JPEG, PNG)
- Check file size limits (images: 20MB)
- Verify the image is clear and relevant to the prompt

### Retry Logic Example

```language-selector
python=:import requests
import time


def generate_video_with_retry(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(
                "https://api.avalai.ir/v1/videos",
                headers={"Authorization": "Bearer AVALAI_API_KEY"},
                json={
                    "model": "veo-3.1-fast-generate-001",
                    "prompt": prompt,
                    "size": "1280x720",
                    "seconds": "4",
                },
                timeout=30,
            )

            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:  # Rate limit
                wait_time = 2**attempt  # Exponential backoff
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"Error {response.status_code}: {response.text}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2**attempt)

    return None


result = generate_video_with_retry("A peaceful garden scene with birds chirping")

javascript=:async function generateVideoWithRetry(prompt, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch('https://api.avalai.ir/v1/videos', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_API_KEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'veo-3.1-fast-generate-001',
                    prompt: prompt,
                    size: '1280x720',
                    seconds: '4'
                })
            });

            if (response.ok) {
                return await response.json();
            } else if (response.status === 429) {
                const waitTime = Math.pow(2, attempt) * 1000;
                console.log(`Rate limited. Waiting ${waitTime/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                console.error(`Error ${response.status}: ${await response.text()}`);
                return null;
            }

        } catch (error) {
            console.error(`Request failed: ${error}`);
            if (attempt < maxRetries - 1) {
                await new Promise(resolve =>
                    setTimeout(resolve, Math.pow(2, attempt) * 1000)
                );
            }
        }
    }

    return null;
}

const result = await generateVideoWithRetry('A peaceful garden scene with birds chirping');

```

## Advanced Use Cases

### Creating Video Sequences

Generate related videos that form a sequence:

```python
import requests

scenes = [
    {
        "prompt": "Wide establishing shot of a futuristic city at dawn, camera slowly moving forward, ambient city sounds",
        "seconds": "8",
    },
    {
        "prompt": "Medium shot of bustling street with flying vehicles, camera panning right, engine hums and crowd chatter",
        "seconds": "8",
    },
    {
        "prompt": "Close-up of protagonist looking out window, camera slowly zooming in, reflective music",
        "seconds": "8",
    },
}

generation_ids = []
for i, scene in enumerate(scenes):
    response = requests.post(
        "https://api.avalai.ir/v1/videos",
        headers={"Authorization": "Bearer AVALAI_API_KEY"},
        json={
            "model": "veo-3.1-generate-001",
            "prompt": scene["prompt"],
            "size": "1920x1080",
            "seconds": scene["seconds"],
        },
    )
    generation_ids.append(response.json()["id"])

print(f"Generated sequence with {len(generation_ids)} scenes")
```

### Product Demonstration Videos

Create engaging product demos with audio:

```python
product_prompts = {
    "hero": "Sleek smartphone rotating slowly on white background, dramatic lighting with soft shadows, professional product photography style, subtle whoosh sound",
    "feature_1": "Close-up of smartphone screen showing app interface, finger swiping through content smoothly, modern UI elements, soft tap sounds",
    "feature_2": "Smartphone in hand making payment at terminal, green checkmark animation, real-world usage scenario, payment confirmation beep",
}

for key, prompt in product_prompts.items():
    response = client.videos.create(
        model="veo-3.1-fast-generate-001",
        prompt=prompt,
        size="1280x720",
        seconds="6",
    )
    print(f"Generated {key}: {response.id}")
```

### Social Media Content

Optimize for different platforms:

```python
social_configs = {
    "instagram_story": {
        "size": "1080x1920",  # Portrait
        "seconds": "4",
        "prompt": "Energetic lifestyle content with vibrant colors, upbeat background music",
    },
    "youtube_short": {
        "size": "1080x1920",  # Portrait
        "seconds": "8",
        "prompt": "Attention-grabbing opening with hook in first 3 seconds, clear narration",
    },
    "twitter_feed": {
        "size": "1280x720",  # Landscape
        "seconds": "4",
        "prompt": "Clear message delivered quickly, text-friendly composition, concise audio",
    },
}

for platform, config in social_configs.items():
    video = client.videos.create(model="veo-3.1-fast-generate-001", **config)
    print(f"Generated for {platform}: {video.id}")
```

## Tracking and Identification

### Using safety_identifier for Internal Tracking

The `safety_identifier` parameter allows you to associate video requests with your internal tracking systems. This is useful for:

- **Department tracking:** Identify which team or department generated a video
- **Project management:** Associate videos with specific projects or campaigns
- **Cost allocation:** Track spending across different business units
- **Audit trails:** Maintain records for compliance purposes

```python
# Example: Using safety_identifier for department tracking
video = client.videos.create(
    model="veo-3.1-fast-generate-001",
    prompt="Product demo video with professional narration",
    size="1920x1080",
    seconds="8",
    safety_identifier="marketing_dept_q4_campaign",
)
```

### Filtering Videos by Identifier

You can filter your video list using the `safety_identifier` parameter:

```bash
# List all videos for a specific department
curl -X GET "https://api.avalai.ir/v1/videos?safety_identifier=marketing_dept_q4_campaign" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

### Using request_id for Cost Tracking

Every video response includes a `request_id` (UUID v7) that you can use for precise cost tracking:

```python
video = client.videos.create(
    model="veo-3.1-generate-001",
    prompt="Your video prompt",
    size="1920x1080",
    seconds="8",
)

# Store the request_id for cost lookup
request_id = video.request_id
print(f"Request ID for cost tracking: {request_id}")

# Later, use /user/v1/transactions/lookup to get exact costs
```

You can also filter videos by `request_id` to find a specific video:

```bash
curl -X GET "https://api.avalai.ir/v1/videos?request_id=019b4797-14a2-79a0-8635-2cf8dd84820c" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

For more details on cost tracking, see the [Response Headers](en/api-reference/response-headers.md) and [User API](en/api-reference/user.md) documentation.

## Limitations and Considerations

### Request Latency
- **Minimum:** 11 seconds
- **Maximum:** 6 minutes during peak hours
- Plan accordingly for time-sensitive applications

### Video Retention
- Generated videos are stored on the Google (max 1 hour for OpenAI) for **2 days**
- Download your videos within 2 days to save a local copy
- Extended videos are treated as newly generated videos

### Watermarking
- Videos created by Veo are watermarked using **SynthID**
- This is Google's tool for watermarking and identifying AI-generated content
- Videos can be verified using the SynthID verification platform

### Safety Filters
- Generated videos pass through safety filters

- Memorization checking processes help mitigate privacy, copyright, and bias risks
- Audio may be blocked due to safety filters (no charge if blocked)

### Regional Limitations
- In EU, UK, CH, and MENA locations, certain person generation restrictions apply
- Veo 3.1: Only `allow_adult` setting is supported

## Related Resources

- [Video API Reference](en/api-reference/videos.md) - Complete API documentation
- [Google Models](en/providers/google.md) - All Google AI models including Veo
- [Pricing](en/pricing.md) - Detailed pricing information
- [Model Selection Guide](en/guides/model-selection.md) - Choosing the right model for your needs

## Summary

Veo 3.1 models offer powerful video generation capabilities with native audio support through the AvalAI API. Key takeaways:

- **Two model options:** Standard ($0.40/s) and Fast ($0.15/s) variants
- **Native audio:** Dialogue, sound effects, and ambient noise automatically generated
- **Flexible durations:** 4, 6, or 8 seconds per generation
- **Multiple resolutions:** 720p (16:9 and 9:16) and 1080p (16:9 only); `size` is auto-mapped to the correct aspect ratio and resolution
- **Advanced overrides:** Pass `aspectRatio` and `resolution` directly via `extra_body` when needed
- **Advanced features:** Image-to-video, reference images, video extension
- **Asynchronous workflow:** Generate, poll, download pattern
- **Cost optimization:** Start with fast model, use appropriate duration

Start experimenting with Veo to create engaging video content with synchronized audio for your applications.
