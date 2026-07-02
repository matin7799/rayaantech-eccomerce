# Generating Videos Using Sora

Learn how to generate AI-powered videos using OpenAI's Sora models available through the AvalAI API.

## Introduction

The AvalAI [Video API](en/api-reference/videos.md) provides endpoints for video generation using OpenAI's Sora models. These state-of-the-art models can create realistic and imaginative videos from text descriptions, with support for:

- **Text-to-Video:** Create videos from scratch based on detailed text prompts
- **Image-to-Video:** Generate videos starting from a reference image
- **Video Remix:** Modify and remix existing videos with new prompts
- **Asynchronous Processing:** Generate videos up to 60 seconds with status polling

This guide covers using these capabilities via AvalAI to create compelling video content.

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

AvalAI provides access to two Sora video generation models, each optimized for different use cases:

### sora-2

Best for standard video generation needs:
- **Resolution Support:** 720x1280 (portrait) and 1280x720 (landscape)
- **Duration:** 4 or 8 seconds
- **Pricing:** $0.10 per second
- **Use Cases:** Social media content, marketing materials, standard quality videos
- **Processing:** Asynchronous with status polling

### sora-2-pro

Designed for professional and high-quality video content:
- **Resolution Support:** All sora-2 resolutions plus 1024x1792 (ultra portrait) and 1792x1024 (ultra landscape)
- **Duration:** 4 or 8 seconds
- **Pricing:** $0.30 per second (standard resolutions), $0.50 per second (ultra resolutions)
- **Use Cases:** Professional content, high-quality productions, cinematic videos
- **Processing:** Asynchronous with status polling

Both models support image references and video remixing capabilities.

## Basic Video Generation

The simplest way to generate a video is to provide a text prompt. The API processes your request asynchronously and you can poll for completion status.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create video generation request
video = client.videos.create(
    model="sora-2",
    prompt="A serene lake at sunset with mountains in the background, gentle ripples on the water surface",
    size="1280x720",
    seconds="4",
    safety_identifier="project_abc123",  # Optional: for internal tracking
)

print(f"Video generation started: {video.id}")
print(f"Request ID: {video.request_id}")  # Global request identifier

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

bash=:# Create video generation request
curl -X POST https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=sora-2" \
  -F "prompt=A serene lake at sunset with mountains in the background, gentle ripples on the water surface" \
  -F "size=1280x720" \
  -F "seconds=4" \
  -F "safety_identifier=project_abc123"

# Response includes request_id for tracking:
# {"id": "video_...", "request_id": "019b47a0-ece8-75b2-8a4c-40fcf4b49479", ...}

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
        model: 'sora-2',
        prompt: 'A serene lake at sunset with mountains in the background, gentle ripples on the water surface',
        size: '1280x720',
        seconds: '4',
        safety_identifier: 'project_abc123'  // Optional: for internal tracking
    });

    console.log(`Video generation started: ${video.id}`);
    console.log(`Request ID: ${video.request_id}`);  // Global request identifier

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

You can provide a reference image to guide the video generation. This is useful for creating videos that start from or incorporate specific visual elements.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create video with image reference
video = client.videos.create(
    model="sora-2-pro",
    prompt="The landscape comes alive with flowing water and moving clouds, birds flying overhead",
    input_reference=open("reference_image.jpg", "rb"),
    size="1792x1024",
    seconds="4",
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
  -F "model=sora-2-pro" \
  -F "prompt=The landscape comes alive with flowing water and moving clouds, birds flying overhead" \
  -F "input_reference=@reference_image.jpg;type=image/jpeg" \
  -F "size=1792x1024" \
  -F "seconds=4"

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
        model: 'sora-2-pro',
        prompt: 'The landscape comes alive with flowing water and moving clouds, birds flying overhead',
        input_reference: fs.createReadStream('reference_image.jpg'),
        size: '1792x1024',
        seconds: '4'
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

## Video Remixing

Remix existing videos with new prompts to create variations or modifications. Use the `/videos/{video_id}/remix` endpoint.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="avalai-api-key", base_url="https://api.avalai.ir/v1")

# Remix an existing video
remixed_video = client.videos.remix(
    video_id="video_691bab4a12248190b1e9123d8648ff4d",
    prompt="Extend the scene with the cat taking a bow to the cheering audience",
)

print(f"Video remix started: {remixed_video.id}")

# Poll for completion
while True:
    video_status = client.videos.retrieve(remixed_video.id)

    if video_status.status == "completed":
        print(f"Remixed video ready! ID: {video_status.id}")

        # Download the remixed video
        with client.with_streaming_response.videos.retrieve_content(
            remixed_video.id
        ) as response:
            with open("remixed_output.mp4", "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        print("Remixed video downloaded")
        break
    elif video_status.status == "failed":
        print(f"Remix failed: {video_status.error}")
        break

    time.sleep(10)

bash=:# Remix an existing video
curl -X POST https://api.avalai.ir/v1/videos/video_691bab4a12248190b1e9123d8648ff4d/remix \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Extend the scene with the cat taking a bow to the cheering audience"
  }'

# Poll for status
curl -X GET https://api.avalai.ir/v1/videos/video_691bb11c9f1481908d6c5a0c463fcd94 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Download when completed
curl -X GET https://api.avalai.ir/v1/videos/video_691bb11c9f1481908d6c5a0c463fcd94/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output remixed_output.mp4

javascript=:import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: 'https://api.avalai.ir/v1'
});

async function remixVideo() {
    // Remix an existing video
    const remixedVideo = await client.videos.remix(
        'video_691bab4a12248190b1e9123d8648ff4d',
        {
            prompt: 'Extend the scene with the cat taking a bow to the cheering audience'
        }
    );

    console.log(`Video remix started: ${remixedVideo.id}`);

    // Poll for completion
    while (true) {
        const videoStatus = await client.videos.retrieve(remixedVideo.id);
        
        if (videoStatus.status === 'completed') {
            console.log(`Remixed video ready! ID: ${videoStatus.id}`);
            
            // Download the remixed video
            const response = await client.videos.retrieveContent(remixedVideo.id);
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync('remixed_output.mp4', buffer);
            console.log('Remixed video downloaded');
            break;
        } else if (videoStatus.status === 'failed') {
            console.log(`Remix failed: ${videoStatus.error}`);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

remixVideo();

```

## Checking Video Status

For production applications, polling provides a reliable way to check when video generation completes.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="avalai-api-key", base_url="https://api.avalai.ir/v1")


def check_video_status(video_id):
    """Poll for video completion with exponential backoff"""
    max_attempts = 60
    wait_time = 10

    for attempt in range(max_attempts):
        video_status = client.videos.retrieve(video_id)

        if video_status.status == "completed":
            print(f"Video {video_id} completed!")

            # Download the video
            with client.with_streaming_response.videos.retrieve_content(
                video_id
            ) as response:
                with open(f"video_{video_id}.mp4", "wb") as f:
                    for chunk in response.iter_bytes():
                        f.write(chunk)

            return True

        elif video_status.status == "failed":
            print(f"Video generation failed: {video_status.error}")
            return False

        print(f"Status: {video_status.status}, Progress: {video_status.progress}%")
        time.sleep(wait_time)

    print("Timeout waiting for video completion")
    return False


# Example usage
video = client.videos.create(
    model="sora-2", prompt="A peaceful garden scene", size="1280x720", seconds="4"
)

check_video_status(video.id)

bash=:# Poll for video status
VIDEO_ID="video_691bab4a12248190b1e9123d8648ff4d"

while true; do
  STATUS=$(curl -s -X GET https://api.avalai.ir/v1/videos/$VIDEO_ID \
    -H "Authorization: Bearer $AVALAI_API_KEY" | jq -r '.status')

  if [ "$STATUS" = "completed" ]; then
    echo "Video completed! Downloading..."
    curl -X GET https://api.avalai.ir/v1/videos/$VIDEO_ID/content \
      -H "Authorization: Bearer $AVALAI_API_KEY" \
      --output video_$VIDEO_ID.mp4
    break
  elif [ "$STATUS" = "failed" ]; then
    echo "Video generation failed"
    break
  else
    echo "Status: $STATUS - Waiting..."
    sleep 10
  fi
done

javascript=:import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: 'https://api.avalai.ir/v1'
});

async function checkVideoStatus(videoId) {
    const maxAttempts = 60;
    const waitTime = 10000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const videoStatus = await client.videos.retrieve(videoId);
        
        if (videoStatus.status === 'completed') {
            console.log(`Video ${videoId} completed!`);
            
            // Download the video
            const response = await client.videos.retrieveContent(videoId);
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(`video_${videoId}.mp4`, buffer);
            
            return true;
        } else if (videoStatus.status === 'failed') {
            console.log(`Video generation failed: ${videoStatus.error}`);
            return false;
        }
        
        console.log(`Status: ${videoStatus.status}, Progress: ${videoStatus.progress}%`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    console.log('Timeout waiting for video completion');
    return false;
}

// Example usage
const video = await client.videos.create({
    model: 'sora-2',
    prompt: 'A peaceful garden scene',
    size: '1280x720',
    seconds: '4'
});

await checkVideoStatus(video.id);

```

## Best Practices for Prompting

Creating effective prompts is crucial for generating high-quality videos. Follow these guidelines:

### Be Descriptive and Specific

Provide detailed descriptions including:
- **Visual elements:** Colors, lighting, composition
- **Motion:** Camera movements, subject actions
- **Style:** Cinematic, realistic, artistic
- **Mood:** Atmospheric, energetic, calm

**Good Example:**
```
A golden retriever puppy playing in a sunlit meadow at golden hour, 
camera slowly tracking the puppy as it runs through tall grass, 
cinematic depth of field with bokeh effect, warm color grading
```

**Poor Example:**
```
A dog playing
```

### Specify Camera Movements

Include camera movement instructions when relevant:
- "Camera pans left to reveal..."
- "Slow zoom into the subject..."
- "Aerial drone shot descending..."
- "Handheld tracking shot following..."

### Set the Scene Context

Establish time, place, and atmosphere:
- Time of day (golden hour, midnight, dawn)
- Weather conditions (foggy, sunny, rainy)
- Location details (urban street, forest clearing, beach)
- Lighting (dramatic shadows, soft ambient light)

### Use Temporal Descriptions

Describe how the scene evolves:
- "Starting with a close-up, then pulling back to reveal..."
- "The sun rises gradually over the mountains..."
- "Waves crash against rocks with increasing intensity..."

## Resolution and Duration Guidelines

### Choosing the Right Resolution

Different resolutions serve different purposes:

**Landscape (1280x720, 1792x1024)**
- Best for: Cinematic content, landscapes, wide scenes
- Use case: YouTube videos, presentations, web content

**Portrait (720x1280, 1024x1792)**
- Best for: Social media (Instagram Stories, TikTok, Reels)
- Use case: Mobile-first content, vertical video platforms

**Duration Considerations**
- **Short (4 seconds):** Quick social media clips, loops
- **Medium (8 seconds):** Story segments, product demos
- **Long (16 seconds):** Scene establishment, narrative sequences - sora-2 and sora-2-pro not supporting 16 seconds - some other models may do

## Cost Optimization Strategies

Optimize costs while maintaining quality:

### 1. Start with sora-2 for Testing

Use the standard model for initial iterations:
```python
# Test with sora-2 first
response = requests.post(
    "https://api.avalai.ir/v1/videos",
    json={
        "model": "sora-2",  # $0.10/second
        "prompt": "Your test prompt",
        "size": "1280x720",
        "seconds": 4,  # Start with shorter seconds
    },
)
```

### 2. Use Appropriate Duration

Generate only the duration you need:
- 4 seconds: Quick loops, transitions ($0.40 - $1.20)
- 8 seconds: Standard clips ($0.8 - $2.40)

### 3. Choose Resolution Wisely

Ultra resolutions (1024x1792, 1792x1024) with sora-2-pro cost $0.50/second:
- Use only when high quality is essential
- Consider standard resolutions for social media
- Test with lower resolution first

### 4. Batch Similar Requests

Generate multiple related videos in a batch:
```python
prompts = [
    "Scene 1: Opening shot...",
    "Scene 2: Action sequence...",
    "Scene 3: Closing shot...",
]

for prompt in prompts:
    requests.post(
        "https://api.avalai.ir/v1/videos",
        json={"model": "sora-2", "prompt": prompt, "size": "1280x720", "seconds": 4},
    )
```

## Error Handling and Troubleshooting

### Common Issues and Solutions

#### Generation Timeout
If generation takes longer than expected:
- Increase polling timeout duration
- Check video status for error messages
- Use exponential backoff in polling logic

#### Invalid Size Parameter
Ensure size matches model capabilities:
- **sora-2:** 720x1280, 1280x720 only
- **sora-2-pro:** All sizes including ultra resolutions

#### Prompt Rejection
If prompts are rejected:
- Remove explicit content or violence
- Avoid copyrighted character references
- Use descriptive rather than branded terms

#### Image/Video Reference Issues
When using references:
- Ensure base64 encoding is correct
- Check file size limits (images: 20MB, videos: 512MB)
- Verify MIME type in data URL

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
                    "model": "sora-2",
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


result = generate_video_with_retry("A peaceful garden scene")

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
                    model: 'sora-2',
                    prompt: prompt,
                    size: '1280x720',
                    seconds: '10'
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

const result = await generateVideoWithRetry('A peaceful garden scene');

```

## Advanced Use Cases

### Creating Video Sequences

Generate related videos that form a sequence:

```python
import requests

scenes = [
    {
        "prompt": "Wide establishing shot of a futuristic city at dawn, camera slowly moving forward",
        "seconds": 4,
    },
    {
        "prompt": "Medium shot of bustling street with flying vehicles, camera panning right",
        "seconds": 4,
    },
    {
        "prompt": "Close-up of protagonist looking out window, camera slowly zooming in",
        "seconds": 4,
    },
]

generation_ids = []
for i, scene in enumerate(scenes):
    response = requests.post(
        "https://api.avalai.ir/v1/videos",
        headers={"Authorization": "Bearer AVALAI_API_KEY"},
        json={
            "model": "sora-2-pro",
            "prompt": scene["prompt"],
            "size": "1792x1024",
            "seconds": str(scene["seconds"]),
        },
    )
    generation_ids.append(response.json()["id"])

print(f"Generated sequence with {len(generation_ids)} scenes")
```

### Product Demonstration Videos

Create engaging product demos:

```python
product_prompts = {
    "hero": "Sleek smartphone rotating slowly on white background, dramatic lighting with soft shadows, professional product photography style",
    "feature_1": "Close-up of smartphone screen showing app interface, finger swiping through content smoothly, modern UI elements",
    "feature_2": "Smartphone in hand making payment at terminal, green checkmark animation, real-world usage scenario",
}

for key, prompt in product_prompts.items():
    requests.post(
        "https://api.avalai.ir/v1/videos",
        headers={"Authorization": "Bearer AVALAI_API_KEY"},
        json={
            "model": "sora-2",
            "prompt": prompt,
            "size": "1280x720",
            "seconds": "8",
        },
    )
```

### Social Media Content

Optimize for different platforms:

```python
social_configs = {
    "instagram_story": {
        "size": "1080x1920",  # Vertical
        "seconds": 4,
        "prompt": "Energetic lifestyle content with vibrant colors",
    },
    "youtube_short": {
        "size": "1080x1920",  # Vertical
        "seconds": 8,
        "prompt": "Attention-grabbing opening with hook in first 3 seconds",
    },
    "twitter_feed": {
        "size": "1280x720",  # Landscape
        "seconds": 4,
        "prompt": "Clear message delivered quickly, text-friendly composition",
    },
}
```

## Monitoring and Analytics

Track your video generations for optimization:

```python
class VideoGenerationTracker:
    def __init__(self):
        self.generations = []

    def track_generation(self, generation_id, prompt, model, duration, size):
        self.generations.append(
            {
                "id": generation_id,
                "prompt": prompt,
                "model": model,
                "seconds": seconds,
                "size": size,
                "cost": self.calculate_cost(model, duration, size),
                "timestamp": time.time(),
            }
        )

    def calculate_cost(self, model, seconds, size):
        if model == "sora-2":
            return seconds * 0.10
        elif model == "sora-2-pro":
            if size in ["1024x1792", "1792x1024"]:
                return seconds * 0.50
            return seconds * 0.30

    def get_total_cost(self):
        return sum(g["cost"] for g in self.generations)

    def get_average_duration(self):
        return sum(g["seconds"] for g in self.generations) / len(self.generations)


tracker = VideoGenerationTracker()
```

## Tracking and Identification

The Video API provides built-in tracking capabilities for enterprise workflows and multi-service architectures.

### Request ID

Every video response includes a `request_id` field - a UUID v7 that uniquely identifies the request. This is the same identifier returned in the `x-request-id` response header:

```python
video = client.videos.create(
    model="sora-2",
    prompt="Your video prompt",
    size="1280x720",
    seconds="4",
)

# Access the request ID for tracking
print(f"Request ID: {video.request_id}")
# Output: Request ID: 019b47a0-ece8-75b2-8a4c-40fcf4b49479
```

Use the `request_id` to:
- Track costs via the [User API](/api-reference/user.md) transaction lookup
- Correlate requests across your logging infrastructure
- Debug issues with support tickets
- Filter videos when listing: `GET /v1/videos?request_id=019b47a0-...`

### Safety Identifier

The optional `safety_identifier` parameter allows you to attach your own tracking identifier to video requests:

```python
video = client.videos.create(
    model="sora-2",
    prompt="Product showcase video",
    size="1280x720",
    seconds="4",
    safety_identifier="marketing_campaign_2025_q1",  # Your internal identifier
)
```

This is useful for:
- **Department tracking**: Tag requests with department codes (`dept_marketing`, `dept_engineering`)
- **Project management**: Associate videos with project IDs (`project_12345`)
- **Cost allocation**: Track spending across different business units
- **Concurrent service coordination**: When multiple services need to query the same video

Filter videos by `safety_identifier`:
```bash
curl -X GET "https://api.avalai.ir/v1/videos?safety_identifier=marketing_campaign_2025_q1" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

## Related Resources

- [Video API Reference](en/api-reference/videos.md) - Complete API documentation
- [OpenAI Models](en/providers/openai.md) - Sora model specifications
- [Pricing Guide](en/pricing.md) - Detailed pricing information
- [Image Generation Guide](en/guides/image-generation.md) - Related visual content generation
- [Best Practices](en/guides/best-practices.md) - General API usage guidelines
- [Error Handling](en/guides/error-handling.md) - Comprehensive error handling strategies