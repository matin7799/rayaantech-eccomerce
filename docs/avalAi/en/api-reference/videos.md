# Video Generation API

The Video Generation API allows you to create AI-generated videos using OpenAI's Sora models and Google's Veo models through the AvalAI platform. Video generation is asynchronous - you submit a request and poll for completion using the status endpoint.

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

## Endpoints

### Create Video

```
POST https://api.avalai.ir/v1/videos
```

Submit a video generation request. Returns a job object with a unique ID to track the generation progress.

### Retrieve Video

```
GET https://api.avalai.ir/v1/videos/{video_id}
```

Retrieve the status and details of a video generation job.

### List Videos

```
GET https://api.avalai.ir/v1/videos
```

List all video generation jobs for your account. Supports filtering by `safety_identifier` and `request_id` query parameters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `safety_identifier` | string | Filter videos by safety identifier |
| `request_id` | string | Filter videos by request ID |

### Delete Video

```
DELETE https://api.avalai.ir/v1/videos/{video_id}
```

Delete a video generation job and its associated content.

### Remix Video

```
POST https://api.avalai.ir/v1/videos/{video_id}/remix
```

Create a new video based on an existing video with modified parameters.

### Retrieve Video Content

```
GET https://api.avalai.ir/v1/videos/{video_id}/content
```

Download the generated video file. This endpoint is only available when the video status is "completed".

## Create Video Request

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | ID of the model to use: `"sora-2"`, `"sora-2-pro"`, `"gen4.5"`, `"gen4_turbo"`, `"veo-3.1-generate-001"`, `"veo-3.1-fast-generate-001"`, `"veo-3.1-generate-preview"`, or `"veo-3.1-fast-generate-preview"` |
| `prompt` | string | Yes | A text description of the desired video. Maximum length is 1000 characters. |
| `seconds` | string | No | Duration of the video in seconds (1-20). Defaults to 4. Use string format: "4", "5", etc. |
| `size` | string | No | The resolution of the generated video. See supported sizes below. Defaults to "720x1280". |
| `input_reference` | file | No | Image file to use as reference for video generation (multipart/form-data). |
| `safety_identifier` | string | No | Optional custom identifier for internal tracking. Use this to associate requests with your own systems (e.g., department IDs, project codes, user IDs). Maximum 256 characters. Can be used to filter videos when listing. See [User API](en/api-reference/user.md) for more details. |

### Supported Video Sizes

#### Sora 2

| Size | Aspect Ratio | Description |
|------|--------------|-------------|
| `720x1280` | 9:16 | Portrait (default) |
| `1280x720` | 16:9 | Landscape |

#### Sora 2 Pro

| Size | Aspect Ratio | Description |
|------|--------------|-------------|
| `720x1280` | 9:16 | Portrait (default) |
| `1280x720` | 16:9 | Landscape |
| `1024x1792` | 9:16 | High-resolution portrait |
| `1792x1024` | 16:9 | High-resolution landscape |

#### Veo 3.1 Generate Preview

| Size | Aspect Ratio | Description |
|------|--------------|-------------|
| `720x1280` | 9:16 | Portrait |
| `1280x720` | 16:9 | Landscape |
| `1080x1920` | 9:16 | High-resolution portrait |
| `1920x1080` | 16:9 | High-resolution landscape |

#### Veo 3.1 Fast Generate Preview

| Size | Aspect Ratio | Description |
|------|--------------|-------------|
| `720x1280` | 9:16 | Portrait |
| `1280x720` | 16:9 | Landscape |
| `1080x1920` | 9:16 | High-resolution portrait |
| `1920x1080` | 16:9 | High-resolution landscape |

## Examples

### Basic Video Generation

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "sora-2",
  "prompt": "A calico cat playing a piano on stage under dramatic spotlights",
  "size": "1280x720",
  "seconds": "4"
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Create video generation job
video = client.videos.create(
    model="sora-2",
    prompt="A calico cat playing a piano on stage under dramatic spotlights",
    size="1280x720",
    seconds="4",  # or "8"
)

print(f"Video ID: {video.id}")
print(f"Status: {video.status}")

# Poll for completion
import time

while video.status not in ["completed", "failed"]:
    time.sleep(5)
    video = client.videos.retrieve(video.id)
    print(f"Status: {video.status}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Create video generation job
let video = await client.videos.create({
  model: "sora-2",
  prompt: "A calico cat playing a piano on stage under dramatic spotlights",
  size: "1280x720",
  seconds: "4",  // or "8"
});

console.log(`Video ID: ${video.id}`);
console.log(`Status: ${video.status}`);

// Poll for completion
while (!["completed", "failed"].includes(video.status)) {
  await new Promise(resolve => setTimeout(resolve, 10000));
  video = await client.videos.retrieve(video.id);
  console.log(`Status: ${video.status}`);
}

if (video.status === "completed") {
  // Get download URL
  console.log(`Video ready! Use GET /v1/videos/${video.id}/content to download`);
}

```

### Video Generation with Image Reference

**Note**: Download the sample image for testing: [monster_original_720p.jpeg](https://docs.avalai.ir/fa/_media/img/monster_original_720p.jpeg)

Generate a video using an image as a reference point:

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="The fridge door opens. A cute, chubby purple monster comes out of it." \
  -F model="sora-2" \
  -F size="1280x720" \
  -F seconds="4" \
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
    model="sora-2",
    size="1280x720",
    seconds="4",
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
  model: "sora-2",
  size: "1280x720",
  seconds: "4"
});

console.log(`Video generation started: ${video.id}`);

```

### Retrieve Video Status

Check the status of a video generation job:

```language-selector
bash=:curl https://api.avalai.ir/v1/videos/video_abc123 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Retrieve video status
video = client.videos.retrieve("video_abc123")

print(f"Status: {video.status}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Retrieve video status
const video = await client.videos.retrieve("video_abc123");

console.log(`Status: ${video.status}`);

```

### List All Videos

Retrieve all video generation jobs:

```language-selector
bash=:curl -X GET https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# List all videos
videos = client.videos.list()

for video in videos.data:
    print(f"{video.id}: {video.status}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// List all videos
const videos = await client.videos.list();

videos.data.forEach(video => {
  console.log(`${video.id}: ${video.status}`);
});

```

### Filter Videos by Safety Identifier

Filter videos using the optional `safety_identifier` parameter. This is useful for retrieving videos associated with specific departments, projects, or internal tracking IDs:

```language-selector
bash=:curl -X GET "https://api.avalai.ir/v1/videos?safety_identifier=dept_123abc" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import requests

response = requests.get(
    "https://api.avalai.ir/v1/videos",
    params={"safety_identifier": "dept_123abc"},
    headers={"Authorization": f"Bearer {api_key}"},
)

videos = response.json()
for video in videos["data"]:
    print(f"{video['id']}: {video['safety_identifier']}")

javascript=:const response = await fetch(
  "https://api.avalai.ir/v1/videos?safety_identifier=dept_123abc",
  {
    headers: {
      Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
    },
  }
);

const videos = await response.json();
videos.data.forEach(video => {
  console.log(`${video.id}: ${video.safety_identifier}`);
});

```

### Filter Videos by Request ID

Retrieve a specific video by its `request_id`. This is useful when you need to find a video based on the request tracking ID:

```language-selector
bash=:curl -X GET "https://api.avalai.ir/v1/videos?request_id=019b4797-14a2-79a0-8635-2cf8dd84820c" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import requests

response = requests.get(
    "https://api.avalai.ir/v1/videos",
    params={"request_id": "019b4797-14a2-79a0-8635-2cf8dd84820c"},
    headers={"Authorization": f"Bearer {api_key}"},
)

videos = response.json()
if videos["data"]:
    video = videos["data"][0]
    print(f"Found video: {video['id']}")

javascript=:const response = await fetch(
  "https://api.avalai.ir/v1/videos?request_id=019b4797-14a2-79a0-8635-2cf8dd84820c",
  {
    headers: {
      Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
    },
  }
);

const videos = await response.json();
if (videos.data.length > 0) {
  console.log(`Found video: ${videos.data[0].id}`);
}

```

### Remix Existing Video

Create a variation of an existing video:

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/videos/video_691bab4a12248190b1e9123d8648ff4d/remix \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Extend the scene with the cat taking a bow to the cheering audience"
  }'

python=:from openai import OpenAI

client = OpenAI(
    api_key="avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Remix an existing video
remixed_video = client.videos.remix(
    video_id="video_691bab4a12248190b1e9123d8648ff4d",
    prompt="Extend the scene with the cat taking a bow to the cheering audience",
)

print(f"Remixed video ID: {remixed_video.id}")

# Then check status with client.videos.retrieve(remixed_video.id)
# And download with GET /v1/videos/{remixed_video.id}/content when completed

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Remix an existing video
const remixedVideo = await client.videos.remix({
  videoId: "video_691bab4a12248190b1e9123d8648ff4d",
  prompt: "Extend the scene with the cat taking a bow to the cheering audience"
});

console.log(`Remixed video ID: ${remixedVideo.id}`);

// Then check status with client.videos.retrieve(remixedVideo.id)
// And download with GET /v1/videos/{remixedVideo.id}/content when completed

```

### Delete Video

Remove a video generation job and its content:

```language-selector
bash=:curl -X DELETE https://api.avalai.ir/v1/videos/video_abc123 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Delete video
result = client.videos.delete("video_abc123")
print(f"Video deleted: {result.deleted}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Delete video
const result = await client.videos.delete("video_abc123");
console.log(`Video deleted: ${result.deleted}`);

```

#### Delete Response

```json
{
  "id": "video_abc123",
  "object": "video.deleted",
  "deleted": true
}
```

## Response Format

### Video Object

```json
{
  "id": "vid_abc123",
  "object": "video",
  "request_id": "019b47a0-ece8-75b2-8a4c-40fcf4b49479",
  "status": "completed",
  "model": "sora-2",
  "prompt": "A calico cat playing a piano on stage under dramatic spotlights",
  "size": "1280x720",
  "seconds": 4,
  "created_at": "1763419001",
  "completed_at": "1763419063",
  "safety_identifier": "dept_123abc"
}
```

### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier for the video generation job |
| `object` | string | Object type, always "video" |
| `request_id` | string | Global request ID (UUID v7) for tracking and cost lookup. Same as `x-request-id` header but included in response body for easier video management. See [Response Headers](en/api-reference/response-headers.md) for more details. |
| `status` | string | Current status: `"queued"`, `"processing"`, `"completed"`, or `"failed"` |
| `model` | string | The model used for video generation |
| `prompt` | string | The prompt used to generate the video |
| `size` | string | The resolution of the generated video |
| `seconds` | string | Duration of the video in seconds |
| `progress` | integer | Generation progress percentage (0-100) |
| `remixed_from_video_id` | string | ID of the original video if this is a remix, null otherwise |
| `safety_identifier` | string | Custom identifier provided in the request, if any |
| `created_at` | integer | Unix timestamp when the job was created |
| `completed_at` | integer | Unix timestamp when the job completed (null if not completed) |
| `expires_at` | integer | Unix timestamp when the video will expire (null if not set) |
| `error` | object | Error details if status is "failed" (null otherwise) |

### Video List Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "video_6949a20bad18819094b7f19168f56cbb",
      "object": "video",
      "request_id": "019b47a0-ece8-75b2-8a4c-40fcf4b49479",
      "created_at": 1766433289,
      "status": "completed",
      "completed_at": 1766433460,
      "error": null,
      "expires_at": 1766519691,
      "model": "sora-2",
      "progress": 100,
      "prompt": "A calico cat playing a piano on stage",
      "remixed_from_video_id": null,
      "seconds": "4",
      "size": null,
      "safety_identifier": "dept_123abc"
    },
    {
      "id": "video_69499f86a61c8190841c731e8bd0b4c8",
      "object": "video",
      "request_id": "019b4797-14a2-79a0-8635-2cf8dd84820c",
      "created_at": 1766432643,
      "status": "completed",
      "completed_at": 1766432819,
      "error": null,
      "expires_at": 1766519046,
      "model": "sora-2",
      "progress": 100,
      "prompt": "A calico cat playing a piano on stage",
      "remixed_from_video_id": null,
      "seconds": "4",
      "size": null
    }
  ],
  "first_id": "video_6949a20bad18819094b7f19168f56cbb",
  "last_id": "video_69499f86a61c8190841c731e8bd0b4c8",
  "has_more": true
}
```

## Available Models

| Model | Description | Max Duration | Resolutions | Price per Second |
|-------|-------------|--------------|-------------|------------------|
| `sora-2` | Standard quality video generation with natural motion | 20 seconds | 720x1280, 1280x720 | $0.10 |
| `sora-2-pro` | High-quality video generation with enhanced detail and motion | 20 seconds | 720x1280, 1280x720, 1024x1792, 1792x1024 | $0.30 (standard)<br>$0.50 (high-res) |

### Sora 2

- Fast video generation with natural motion
- Supports portrait and landscape orientations
- Ideal for social media and standard applications
- 720x1280 and 1280x720 resolutions

### Sora 2 Pro

- Enhanced quality with superior detail and motion
- Extended resolution support including high-resolution outputs
- Advanced prompt understanding
- Better temporal coherence and scene composition
- 1024x1792 and 1792x1024 high-resolution options

## Video Generation Status

Video generation is asynchronous and goes through the following statuses:

| Status | Description |
|--------|-------------|
| `queued` | Job has been created and is waiting to start |
| `processing` | Video is currently being generated |
| `completed` | Video generation finished successfully |
| `failed` | Video generation failed (see error field for details) |

## Best Practices

### Effective Prompting

1. **Be Specific and Descriptive**
   - Include details about subjects, actions, settings, lighting, and camera movement
   - Example: "A golden retriever puppy running through a sunlit meadow, camera following at ground level with shallow depth of field"

2. **Specify Camera Work**
   - Mention desired camera movements: "slow zoom out", "tracking shot", "overhead view"
   - Example: "Aerial drone shot descending over a coastal city at sunset"

3. **Include Temporal Elements**
   - Describe the sequence of events or changes
   - Example: "A flower blooming in time-lapse from bud to full bloom"

4. **Set the Mood**
   - Use descriptive adjectives for atmosphere and emotion
   - Example: "A cozy cabin interior with warm firelight, peaceful and inviting atmosphere"

### Using Image References

- Provide high-quality reference images for better results
- Images should be clear and well-composed
- The reference image sets the scene; the prompt describes the motion and changes
- Example: Upload a landscape photo with prompt "Camera slowly panning left to reveal a hidden waterfall"

### Optimization Tips

1. **Start with Shorter Videos** - Test with 4-second videos before generating longer content
2. **Poll Efficiently** - Use appropriate intervals (e.g., 10 seconds) when polling for completion
3. **Cache Results** - Store successful videos to avoid regeneration
4. **Handle Failures Gracefully** - Implement retry logic with exponential backoff
5. **Monitor Costs** - Track video generation usage, especially for high-resolution Sora 2 Pro videos

## Error Handling

The API may return various error codes:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameters (e.g., unsupported size or duration) |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient permissions or tier access |
| 404 | Not Found - Video ID does not exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error occurred |

### Error Response Example

```json
{
  "error": {
    "message": "Invalid video size for model sora-2. Supported sizes: 720x1280, 1280x720",
    "type": "invalid_request_error",
    "code": "invalid_size"
  }
}
```

## Content Moderation

All video generation requests are subject to content moderation. Prompts that violate the content policy will be rejected. Videos are also analyzed after generation to ensure compliance.

## Rate Limits

Video generation has separate rate limits from other API endpoints due to resource intensity:

- **Sora 2**: Up to 10 concurrent video generations
- **Sora 2 Pro**: Up to 5 concurrent video generations

For more information, see the [Rate Limits](en/guides/rate-limits.md) guide.

## Related Resources

- [Generate Videos Using Sora Guide](en/guides/generate-videos-using-sora.md) - Comprehensive guide for video generation
- [Models](en/providers/openai.md) - Learn about Sora models in detail
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Error Handling](en/guides/error-handling.md) - Learn about error handling strategies
- [Pricing](en/pricing.md) - Video generation pricing details