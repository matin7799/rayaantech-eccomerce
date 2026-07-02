# Generating Videos Using Runway

Learn how to generate AI-powered videos using RunwayML's Gen-4 models available through the AvalAI API.

## Introduction

The AvalAI [Video API](en/api-reference/videos.md) provides endpoints for video generation using RunwayML's cutting-edge Gen-4 models, including the new **gen4.5** - their most advanced video generation model to date. These state-of-the-art models can create realistic and imaginative videos from text descriptions combined with reference images, with support for:

- **Image-to-Video:** Generate dynamic videos starting from a reference image
- **Text-Guided Generation:** Control video content with detailed text prompts
- **Flexible Duration:** Create videos from 2 to 10 seconds
- **Asynchronous Processing:** Generate videos with status polling
- **Multiple Resolutions:** Support for various aspect ratios and resolutions

This guide covers using these capabilities via AvalAI to create compelling video content with RunwayML's Gen-4 technology.

> **⚠️ IMPORTANT: Connection Interruptions**
>
> Video generation operations are **asynchronous** - the server begins processing your request immediately upon submission. If your connection is interrupted during or after submission, **DO NOT immediately retry** with a new generation request, as this may result in duplicate charges.
>
> **What to do if your connection is interrupted:**
>
> 1. Use the [List Videos endpoint](#checking-video-status) to retrieve all your videos:
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

## About gen4.5 (NEW)

RunwayML's **gen4.5** is their most advanced video generation model, representing a new frontier for video generation:

- **Exceptional Realism:** Industry-leading visual quality with natural physics and lighting
- **Superior Coherence:** Advanced temporal consistency for smooth, believable motion
- **Duration:** Up to 10 seconds of generated video
- **Pricing:** $0.12 per second of generated video
- **Input Support:** Text-to-video with optional reference image
- **Use Cases:** Professional content creation, cinematic sequences, creative productions
- **Processing:** Asynchronous with status polling

Gen4.5 excels at creating highly realistic video content with exceptional attention to physics, lighting, and natural motion.

## About gen4_turbo

RunwayML's **gen4_turbo** is a high-performance video generation model optimized for speed and quality:

- **Resolution Support:** Multiple resolutions from 720x720 to 2112x912
- **Duration:** 2 to 10 seconds (flexible)
- **Pricing:** $0.10 per second of generated video
- **Input Requirement:** Requires a reference image (`input_reference`)
- **Use Cases:** Creative content, social media videos, product demos, storytelling
- **Processing:** Asynchronous with status polling

The model excels at creating smooth, coherent video sequences that extend and animate reference images based on your text prompts.

> **⚠️ Important: Prompt Character Limit**
>
> The `prompt` field has a maximum limit of **1000 characters**. If your prompt exceeds this limit, the API will return an error and the video generation will fail. Keep your prompts concise and focused on the most important visual and motion elements.

## Basic Video Generation

To generate a video with RunwayML, you need to provide both a text prompt and a reference image. The model will use the image as a starting point and animate it according to your prompt.

**Example Reference Image:** Download [monster_original_720p.jpeg](https://docs.avalai.ir/fa/_media/img/monster_original_720p.jpeg)

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create video generation request with image reference
video = client.videos.create(
    model="gen4_turbo",
    prompt="The fridge door opens. A cute, chubby purple monster comes out of it.",
    input_reference=open("monster_original_720p.jpeg", "rb"),
    size="1280x720",
    seconds="2",
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
            with open("runway_output.mp4", "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        print("Video downloaded to runway_output.mp4")
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    time.sleep(10)

bash=:# Create video generation request with image reference and safety_identifier
curl -X POST "https://api.avalai.ir/v1/videos" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "prompt=The fridge door opens. A cute, chubby purple monster comes out of it." \
  -F "model=gen4_turbo" \
  -F "size=1280x720" \
  -F "seconds=2" \
  -F "safety_identifier=project_demo_001" \
  -F "input_reference=@monster_original_720p.jpeg;type=image/jpeg"

# Check generation status
curl -X GET https://api.avalai.ir/v1/videos/video_45d4cf58-6c37-43f1-b7ca-8f349f280a3e \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Download completed video
curl -X GET https://api.avalai.ir/v1/videos/video_45d4cf58-6c37-43f1-b7ca-8f349f280a3e/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output runway_video.mp4

javascript=:import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: 'https://api.avalai.ir/v1'
});

async function generateVideo() {
    // Create video generation request with image reference
    const video = await client.videos.create({
        model: 'gen4_turbo',
        prompt: 'The fridge door opens. A cute, chubby purple monster comes out of it.',
        input_reference: fs.createReadStream('monster_original_720p.jpeg'),
        size: '1280x720',
        seconds: '2',
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
            fs.writeFileSync('runway_output.mp4', buffer);
            console.log('Video downloaded to runway_output.mp4');
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

## Supported Resolutions

RunwayML's [`gen4_turbo`](en/providers/runwayml.md) model supports a wide range of resolutions to fit various use cases:

### Standard Resolutions
- **1024x1024** - Square (default)
- **1080x1080** - Square HD
- **720x720** - Small square

### Landscape Resolutions
- **1920x1080** - Full HD landscape
- **1280x720** - HD landscape
- **1808x768** - Ultrawide landscape
- **2112x912** - Cinematic landscape
- **1680x720** - Wide landscape
- **1168x880** - Wide landscape
- **1360x768** - Standard landscape

### Portrait Resolutions
- **1080x1920** - Full HD portrait
- **720x1280** - HD portrait
- **1080x1440** - Tall portrait
- **720x960** - Standard portrait

Choose the resolution that best matches your content platform and aspect ratio requirements.

## Checking Video Status

For production applications, polling provides a reliable way to check when video generation completes.

```language-selector
python=:from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")


def check_video_status(video_id):
    """Poll for video completion with exponential backoff"""
    max_attempts = 60
    wait_time = 10

    for attempt in range(max_attempts):
        video_status = client.videos.retrieve(video_id)

        if video_status.status == "completed":
            print(f"Video {video_id} completed!")
            print(f"Usage: {video_status.usage}")
            print(f"Estimated cost: {video_status.estimated_cost}")

            # Download the video
            with client.with_streaming_response.videos.retrieve_content(
                video_id
            ) as response:
                with open(f"runway_{video_id}.mp4", "wb") as f:
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
    model="gen4_turbo",
    prompt="Smooth camera movement through a futuristic cityscape at night",
    input_reference=open("city_image.jpg", "rb"),
    size="1920x1080",
    seconds="5",
)

check_video_status(video.id)

bash=:# Poll for video status
VIDEO_ID="video_45d4cf58-6c37-43f1-b7ca-8f349f280a3e"

while true; do
  STATUS=$(curl -s -X GET https://api.avalai.ir/v1/videos/$VIDEO_ID \
    -H "Authorization: Bearer $AVALAI_API_KEY" | jq -r '.status')

  if [ "$STATUS" = "completed" ]; then
    echo "Video completed! Downloading..."
    curl -X GET https://api.avalai.ir/v1/videos/$VIDEO_ID/content \
      -H "Authorization: Bearer $AVALAI_API_KEY" \
      --output runway_$VIDEO_ID.mp4
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
            console.log(`Usage: ${JSON.stringify(videoStatus.usage)}`);
            console.log(`Estimated cost: ${JSON.stringify(videoStatus.estimated_cost)}`);
            
            // Download the video
            const response = await client.videos.retrieveContent(videoId);
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(`runway_${videoId}.mp4`, buffer);
            
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
    model: 'gen4_turbo',
    prompt: 'Smooth camera movement through a futuristic cityscape at night',
    input_reference: fs.createReadStream('city_image.jpg'),
    size: '1920x1080',
    seconds: '5'
});

await checkVideoStatus(video.id);

```

## Best Practices for Prompting

Creating effective prompts is crucial for generating high-quality videos with RunwayML. Follow these guidelines:

### Be Descriptive and Specific

Provide detailed descriptions including:
- **Visual elements:** Colors, lighting, composition
- **Motion:** Camera movements, subject actions, animation style
- **Style:** Cinematic, realistic, artistic, dramatic
- **Mood:** Atmospheric, energetic, calm, mysterious

**Good Example:**
```
The fridge door slowly swings open, revealing a soft purple glow from inside. 
A cute, chubby purple monster emerges cautiously, looking around with curious 
eyes. Smooth animation with subtle lighting changes.
```

**Poor Example:**
```
Monster comes out
```

### Describe Motion and Transformation

RunwayML excels at animating static images, so focus on motion:
- "Camera slowly pushes forward into the scene..."
- "Subject turns to face the camera with a smile..."
- "Water begins to flow and ripple across the surface..."
- "Clouds drift across the sky with changing light..."

### Set the Scene Context

Establish atmosphere and timing:
- Time of day (dawn, golden hour, night)
- Weather and environment (windy, foggy, sunny)
- Lighting direction (backlit, dramatic shadows, soft glow)
- Pacing (slow and smooth, dynamic and energetic)

### Use Temporal Descriptions

Describe how the scene evolves over time:
- "Starting from stillness, gradually building movement..."
- "The subject slowly turns towards the light..."
- "Gentle camera drift to reveal more of the environment..."
- "Elements come to life one by one in sequence..."

## Duration and Pricing Guidelines

### Choosing the Right Duration

RunwayML's [`gen4_turbo`](en/providers/runwayml.md) supports flexible durations from 2 to 10 seconds:

- **2-3 seconds:** Quick loops, social media clips, transitions
- **4-6 seconds:** Standard content, product showcases, story segments
- **7-10 seconds:** Extended sequences, detailed animations, narrative content

### Cost Optimization

At $0.05 per second, optimize your costs:

```python
# 2 seconds = $0.10
# 5 seconds = $0.25
# 10 seconds = $0.50

# Start with shorter durations for testing
test_video = client.videos.create(
    model="gen4_turbo",
    prompt="Your test prompt",
    input_reference=open("test_image.jpg", "rb"),
    size="1280x720",
    seconds="2",  # Test with minimum duration
)

# Use longer durations only when needed
final_video = client.videos.create(
    model="gen4_turbo",
    prompt="Your final prompt",
    input_reference=open("final_image.jpg", "rb"),
    size="1920x1080",
    seconds="10",  # Full duration for final output
)
```

## Image Reference Best Practices

Since [`gen4_turbo`](en/providers/runwayml.md) requires an input image, follow these guidelines for best results:

### Image Quality
- Use high-quality source images (at least 720p)
- Ensure good lighting and clear composition
- Avoid heavily compressed or artifacted images

### Image Content
- Clear focal subjects work best
- Well-defined foreground and background
- Good contrast and color separation
- Composition that allows for motion

### File Formats and Size
- **Supported formats:** JPEG, PNG
- **Recommended size:** Under 10MB for faster upload
- **Resolution:** Match or exceed your target video resolution

```python
# Good practice: Match image and video resolution
with open("high_quality_image.jpg", "rb") as image_file:
    video = client.videos.create(
        model="gen4_turbo",
        prompt="Camera slowly zooms into the scene with subtle parallax effect",
        input_reference=image_file,
        size="1920x1080",  # Matches image aspect ratio
        seconds="5",
    )
```

## Error Handling and Troubleshooting

### Common Issues and Solutions

#### Generation Timeout
If generation takes longer than expected:
- Increase polling timeout duration
- Check video status for error messages
- Use exponential backoff in polling logic

#### Invalid Image Reference
If image upload fails:
- Ensure file format is JPEG or PNG
- Check file size (keep under 10MB)
- Verify file is not corrupted
- Use binary mode when opening files (`"rb"`)

#### Unsupported Resolution
Ensure resolution is in the supported list:
- Refer to [supported resolutions](#supported-resolutions)
- Common resolutions: 1280x720, 1920x1080, 1024x1024
- Avoid custom or unusual aspect ratios

#### Prompt Rejection
If prompts are rejected or fail:
- **Character limit:** Ensure prompt is under 1000 characters (the API will fail if exceeded)
- Remove explicit content or violence
- Avoid copyrighted character references
- Use descriptive rather than branded terms
- Focus on visual and motion descriptions

### Retry Logic Example

```language-selector
python=:import requests
import time


def generate_video_with_retry(prompt, image_path, max_retries=3):
    for attempt in range(max_retries):
        try:
            with open(image_path, "rb") as image_file:
                response = requests.post(
                    "https://api.avalai.ir/v1/videos",
                    headers={"Authorization": "Bearer YOUR_API_KEY"},
                    files={
                        "input_reference": image_file,
                        "model": (None, "gen4_turbo"),
                        "prompt": (None, prompt),
                        "size": (None, "1280x720"),
                        "seconds": (None, "5"),
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


result = generate_video_with_retry("A serene landscape comes to life", "landscape.jpg")

javascript=:async function generateVideoWithRetry(prompt, imagePath, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const formData = new FormData();
            formData.append('model', 'gen4_turbo');
            formData.append('prompt', prompt);
            formData.append('size', '1280x720');
            formData.append('seconds', '5');
            formData.append('input_reference', fs.createReadStream(imagePath));
            
            const response = await fetch('https://api.avalai.ir/v1/videos', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_API_KEY'
                },
                body: formData
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

const result = await generateVideoWithRetry(
    'A serene landscape comes to life',
    'landscape.jpg'
);

```

## Advanced Use Cases

### Creating Video Sequences

Generate related videos from different images that form a sequence:

```python
import requests

scenes = [
    {
        "image": "scene1_establishing.jpg",
        "prompt": "Slow camera push into the futuristic city establishing shot",
        "seconds": 5,
    },
    {
        "image": "scene2_street.jpg",
        "prompt": "Dynamic movement through busy street with flying vehicles passing by",
        "seconds": 6,
    },
    {
        "image": "scene3_character.jpg",
        "prompt": "Character turns to look at camera with city lights reflecting in background",
        "seconds": 4,
    },
]

generation_ids = []
for i, scene in enumerate(scenes):
    with open(scene["image"], "rb") as image_file:
        response = requests.post(
            "https://api.avalai.ir/v1/videos",
            headers={"Authorization": "Bearer YOUR_API_KEY"},
            files={
                "input_reference": image_file,
                "model": (None, "gen4_turbo"),
                "prompt": (None, scene["prompt"]),
                "size": (None, "1920x1080"),
                "seconds": (None, str(scene["seconds"])),
            },
        )
    generation_ids.append(response.json()["id"])
    print(f"Scene {i+1} generation started: {generation_ids[-1]}")

print(f"Generated sequence with {len(generation_ids)} scenes")
```

### Product Demonstration Videos

Create engaging product demos from product photography:

```python
product_shots = {
    "hero": {
        "image": "product_hero.jpg",
        "prompt": "Smooth 360-degree rotation of the product with dramatic lighting, showcasing all angles",
        "seconds": 8,
    },
    "feature_close": {
        "image": "product_detail.jpg",
        "prompt": "Slow camera push into product details, highlighting premium materials and craftsmanship",
        "seconds": 5,
    },
    "lifestyle": {
        "image": "product_lifestyle.jpg",
        "prompt": "Product comes to life in real-world setting, subtle environmental movement",
        "seconds": 6,
    },
}

for key, shot in product_shots.items():
    with open(shot["image"], "rb") as image_file:
        requests.post(
            "https://api.avalai.ir/v1/videos",

                "input_reference": image_file,
                "model": (None, "gen4_turbo"),
                "prompt": (None, shot["prompt"]),
                "size": (None, "1920x1080"),
                "seconds": (None, str(shot["seconds"])),
            },
        )
    print(f"Generated {key} shot")
```

### Social Media Content

Optimize for different platforms with appropriate resolutions:

```python
social_configs = {
    "instagram_story": {
        "size": "1080x1920",  # Vertical
        "seconds": 4,
        "prompt": "Energetic product showcase with dynamic camera movement and vibrant atmosphere",
        "image": "product_vertical.jpg",
    },
    "youtube_short": {
        "size": "1080x1920",  # Vertical
        "seconds": 8,
        "prompt": "Compelling narrative with smooth transitions and engaging visual flow",
        "image": "content_vertical.jpg",
    },
    "landscape_post": {
        "size": "1920x1080",  # Landscape
        "seconds": 5,
        "prompt": "Professional presentation with cinematic camera movement",
        "image": "content_landscape.jpg",
    },
    "square_post": {
        "size": "1080x1080",  # Square
        "seconds": 4,
        "prompt": "Attention-grabbing visual with centered composition and dynamic elements",
        "image": "content_square.jpg",
    },
}

for platform, config in social_configs.items():
    with open(config["image"], "rb") as image_file:
        requests.post(
            "https://api.avalai.ir/v1/videos",
            headers={"Authorization": "Bearer YOUR_API_KEY"},
            files={
                "input_reference": image_file,
                "model": (None, "gen4_turbo"),
                "prompt": (None, config["prompt"]),
                "size": (None, config["size"]),
                "seconds": (None, str(config["seconds"])),
            },
        )
    print(f"Generated {platform} content")
```

### Architectural Visualization

Bring architectural renderings to life:

```python
architectural_scenes = [
    {
        "image": "exterior_render.jpg",
        "prompt": "Slow camera orbit around the building exterior, showcasing architecture from multiple angles with subtle lighting changes",
        "size": "1920x1080",
        "seconds": 10,
    },
    {
        "image": "interior_render.jpg",
        "prompt": "Smooth camera walkthrough of interior space, highlighting design elements and spatial flow",
        "size": "1920x1080",
        "seconds": 8,
    },
]

for scene in architectural_scenes:
    with open(scene["image"], "rb") as image_file:
        client.videos.create(
            model="gen4_turbo",
            prompt=scene["prompt"],
            input_reference=image_file,
            size=scene["size"],
            seconds=str(scene["seconds"]),
        )
```

## Comparison with Other Video Models

### RunwayML vs Sora

**RunwayML [`gen4_turbo`](en/providers/runwayml.md):**
- ✅ Requires reference image (image-to-video)
- ✅ More control over visual style through input image
- ✅ Lower cost at $0.05/second
- ✅ Flexible durations (2-10 seconds)
- ✅ Wide resolution support

**[Sora models](en/guides/generate-videos-using-sora.md):**
- ✅ Text-to-video (no image required)
- ✅ Can use optional image reference
- ✅ Higher cost ($0.10-$0.50/second)
- ✅ Fixed durations (4 or 8 seconds)
- ✅ Specialized in pure text-to-video generation

**When to use RunwayML:**
- You have reference images or concept art
- You want precise control over visual style
- Budget optimization is important
- You need flexible video durations

**When to use Sora:**
- Pure text-to-video generation needed
- No reference images available
- Higher quality/resolution requirements
- Professional cinematic output needed

## Integration Tips

### With OpenAI SDK

RunwayML models work seamlessly with the OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

# Same interface as other video models
video = client.videos.create(
    model="gen4_turbo",
    prompt="Your animation prompt",
    input_reference=open("reference.jpg", "rb"),
    size="1920x1080",
    seconds="5",
)
```

### Batch Processing

Process multiple videos efficiently:

```python
import concurrent.futures
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")


def generate_video(image_path, prompt, duration):
    with open(image_path, "rb") as img:
        video = client.videos.create(
            model="gen4_turbo",
            prompt=prompt,
            input_reference=img,
            size="1280x720",
            seconds=str(duration),
        )
    return video.id


# Submit multiple generations in parallel
video_requests = [
    ("image1.jpg", "Scene 1 animation", 4),
    ("image2.jpg", "Scene 2 animation", 5),
    ("image3.jpg", "Scene 3 animation", 6),
]

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(generate_video, *req) for req in video_requests]
    video_ids = [f.result() for f in concurrent.futures.as_completed(futures)]

print(f"Submitted {len(video_ids)} video generations")
```

### Webhook Integration

For production systems, consider webhook notifications:

```python
import requests

# Note: AvalAI may support webhooks - check documentation
response = requests.post(
    "https://api.avalai.ir/v1/videos",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    files={
        "input_reference": open("image.jpg", "rb"),
    },
    data={
        "model": "gen4_turbo",
        "prompt": "Your prompt",
        "size": "1280x720",
        "seconds": "5",
        # Uncomment if webhooks are supported:
        # "webhook_url": "https://yourapp.com/webhook/video-completed",
    },
)

# Your webhook endpoint would receive completion notification
# allowing you to process videos without polling
```

## Performance Optimization

### Minimize Polling Frequency

Balance responsiveness with API efficiency:

```python
import time


def smart_polling(video_id, initial_wait=15, max_wait=60):
    """Intelligent polling with adaptive intervals"""
    wait_time = initial_wait

    while True:
        video_status = client.videos.retrieve(video_id)

        if video_status.status in ["completed", "failed"]:
            return video_status

        # Adaptive wait time based on progress
        if hasattr(video_status, "progress") and video_status.progress:
            if video_status.progress > 80:
                wait_time = 10  # Check frequently near completion
            elif video_status.progress > 50:
                wait_time = 20
            else:
                wait_time = min(wait_time * 1.5, max_wait)

        time.sleep(wait_time)
```

### Caching and Reuse

Cache generated videos to avoid regeneration:

```python
import hashlib
import json
import os


def get_cache_key(prompt, image_path, size, seconds):
    """Generate cache key from generation parameters"""
    with open(image_path, "rb") as f:
        image_hash = hashlib.md5(f.read()).hexdigest()

    params = f"{prompt}|{image_hash}|{size}|{seconds}"
    return hashlib.md5(params.encode()).hexdigest()


def generate_with_cache(prompt, image_path, size="1280x720", seconds="5"):
    cache_key = get_cache_key(prompt, image_path, size, seconds)
    cache_file = f"cache/{cache_key}.mp4"

    if os.path.exists(cache_file):
        print(f"Using cached video: {cache_file}")
        return cache_file

    # Generate new video
    with open(image_path, "rb") as img:
        video = client.videos.create(
            model="gen4_turbo",
            prompt=prompt,
            input_reference=img,
            size=size,
            seconds=seconds,
        )

    # Wait for completion and cache
    # ... polling logic ...

    return cache_file
```

## Tracking and Identification

### Using safety_identifier for Internal Tracking

The `safety_identifier` parameter allows you to associate video requests with your internal tracking systems. This is useful for:

- **Department tracking:** Identify which team or department generated a video
- **Project management:** Associate videos with specific projects or campaigns
- **Cost allocation:** Track spending across different business units
- **Audit trails:** Maintain records for compliance purposes

```python
# Example: Using safety_identifier for project tracking
video = client.videos.create(
    model="gen4_turbo",
    prompt="Product showcase with dynamic camera movement",
    input_reference=open("product_image.jpg", "rb"),
    size="1920x1080",
    seconds="8",
    safety_identifier="marketing_dept_q4_campaign",
)
```

### Filtering Videos by Identifier

You can filter your video list using the `safety_identifier` parameter:

```bash
# List all videos for a specific project
curl -X GET "https://api.avalai.ir/v1/videos?safety_identifier=marketing_dept_q4_campaign" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

### Using request_id for Cost Tracking

Every video response includes a `request_id` (UUID v7) that you can use for precise cost tracking:

```python
video = client.videos.create(
    model="gen4_turbo",
    prompt="Your video prompt",
    input_reference=open("reference.jpg", "rb"),
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

## Related Resources

- **[Video API Reference](en/api-reference/videos.md)** - Complete API documentation
- **[RunwayML Models](en/providers/runwayml.md)** - Detailed model specifications
- **[Pricing Guide](en/pricing.md)** - Cost information and optimization
- **[Generate Videos Using Sora](en/guides/generate-videos-using-sora.md)** - Alternative video generation approach
- **[Generate Videos Using Veo](en/guides/generate-videos-using-veo.md)** - Google's video generation models
- **[Image Generation](en/guides/image-generation.md)** - Create reference images for video generation
- **[Best Practices](en/guides/best-practices.md)** - General API usage guidelines
- **[Error Handling](en/guides/error-handling.md)** - Comprehensive error handling strategies

## Official Documentation

For more information about RunwayML's Gen-4 technology and capabilities, visit the [official RunwayML API documentation](https://docs.dev.runwayml.com/api/).
