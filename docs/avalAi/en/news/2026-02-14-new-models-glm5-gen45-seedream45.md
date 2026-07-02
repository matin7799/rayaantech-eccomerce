# New Models Added: GLM-5, Gen-4.5, and Seedream 4.5

**Date:** 2026-02-14 / (1404-11-26)

## Summary

AvalAI introduces three new AI models: GLM-5 from Z.AI, a flagship foundation model with SOTA performance in coding and agentic tasks; Gen-4.5 from RunwayML, the world's top-rated video generation model with unprecedented visual fidelity; and Seedream 4.5 from BytePlus, an advanced image generation model with improved multi-image editing and typography capabilities.

---

## Details

### Z.AI

We announce access to **GLM-5** (`glm-5`), Z.AI's flagship foundation model designed for Agentic Engineering. [Documentation](en/providers/zai.md)

**Key Features:**

- **Agentic Engineering**: Designed for complex system engineering and long-range Agent tasks
- **SOTA Coding Performance**: Achieves 77.8 on SWE-bench Verified and 56.2 on Terminal Bench 2.0, the highest among open-weight models
- **Coding on Par with Claude Opus 4.5**: Performance alignment with Claude Opus 4.5 in software engineering tasks
- **200K Context Window**: Extended context with 128K maximum output tokens
- **Advanced Capabilities**: Thinking mode, streaming output, function calling, context caching, structured output
- **Larger Model Scale**: 744B parameters (40B activated) with 28.5T pre-training data
- **Endpoint Support**: Available on `v1/chat/completions`

| Feature | Details |
|---------|---------|
| Model ID | `glm-5` |
| Context window | 200,000 tokens |
| Maximum output | 128,000 tokens |
| Capabilities | Chat, Function Calling, Structured Outputs, Reasoning, Deep Thinking |
| Input pricing | $1.10 / 1M tokens |
| Cached input pricing | $0.22 / 1M tokens |
| Output pricing | $3.52 / 1M tokens |

**Use Cases:**
- Agentic coding and autonomous software development
- Long-range Agent tasks with multiple steps
- Role-playing with consistent character settings
- Script and storyboard generation
- Professional translation
- Text data extraction from contracts and financial reports

---

### RunwayML

We announce access to **Gen-4.5** (`gen4.5`), RunwayML's latest video generation model with state-of-the-art motion quality and visual fidelity. [Documentation](en/providers/runwayml.md)

**Key Features:**

- **World's Top-Rated Video Model**: 1,247 Elo points on Artificial Analysis Text to Video benchmark
- **State-of-the-Art Quality**: Unprecedented visual fidelity and precise prompt adherence
- **Physical Accuracy**: Realistic physics with proper dynamics, collisions, and natural movement
- **Complex Scene Rendering**: Intricate, multi-element scenes with detailed compositions
- **Expressive Characters**: Nuanced emotions, natural gestures, and lifelike facial detail
- **Temporal Consistency**: Maintains coherence across motion and time
- **Endpoint Support**: Available on `v1/videos`

| Feature | Details |
|---------|---------|
| Model ID | `gen4.5` |
| Type | Video Generation |
| Duration | 2-10 seconds |
| Resolutions | 1280x720, 720x1280, 1920x1080, 1080x1920, and more |
| Pricing | $0.12 per second of video |

---

### BytePlus

We announce access to **Seedream 4.5** (`seedream-4-5-251128`), BytePlus's upgraded image generation model with enhanced multi-image editing and typography capabilities. [Documentation](en/providers/byteplus.md)

**Key Features:**

- **All-Round Improvement**: Overall scaling of the model for enhanced quality
- **Multi-Image Editing**: Accurately identifies main subjects in multi-image editing
- **Reference Image Preservation**: Strictly preserves the details of reference images
- **Enhanced Typography**: Further improves dense text rendering capabilities
- **Professional Visuals**: Delivers professional visual creatives with high consistency and fidelity
- **Endpoint Support**: Available on `v1/images/generations` and `v1/images/edit`

| Feature | Details |
|---------|---------|
| Model ID | `seedream-4-5-251128` |
| Type | Image Generation & Editing |
| Max Resolution | 4K (4096x4096 pixels) |
| Pricing | $0.04 per image |

---

## Pricing Summary

| Model | Provider | Type | Pricing |
|-------|----------|------|---------|
| `glm-5` | Z.AI | Chat | Input: $1.10/1M, Cached: $0.22/1M, Output: $3.52/1M |
| `gen4.5` | RunwayML | Video | $0.12 per second |
| `seedream-4-5-251128` | BytePlus | Image | $0.04 per image |

---

## API Request/Response Examples

### GLM-5 Chat Example

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5",
    "messages": [
      {
        "role": "user",
        "content": "Implement a binary search tree with AVL balancing in Python."
      }
    ],
    "max_tokens": 4096,
    "temperature": 0.6
  }'
```

#### Response

```json
{
  "id": "chatcmpl-abc123",
  "created": 1739574109,
  "model": "glm-5",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a complete implementation of an AVL tree in Python...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 512,
    "prompt_tokens": 20,
    "total_tokens": 532
  },
  "estimated_cost": {
    "unit": "0.0018254000",
    "irt": 239.89,
    "exchange_rate": 131350
  }
}
```

### Gen-4.5 Video Generation Example

#### Request

```bash
curl -X POST "https://api.avalai.ir/v1/videos" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "prompt=A cinematic shot of a whale flying through a winter mountain range with clouds." \
  -F "model=gen4.5" \
  -F "size=1920x1080" \
  -F "seconds=5" \
  -F "input_reference=@reference_image.jpeg;type=image/jpeg"
```

#### Response

```json
{
  "id": "video_abc123",
  "object": "video",
  "status": "processing",
  "model": "gen4.5",
  "created": 1739574109,
  "prompt": "A cinematic shot of a whale flying through a winter mountain range with clouds.",
  "request_id": "req_xyz789"
}
```

### Seedream 4.5 Image Generation Example

#### Request

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "seedream-4-5-251128",
    "prompt": "Professional product photography of a luxury watch on marble surface",
    "size": "2K",
    "response_format": "url",
    "sequential_image_generation": "disabled",
    "watermark": false
  }'
```

#### Response

```json
{
  "created": 1739574109,
  "data": [
    {
      "url": "https://api.avalai.ir/generated/image_abc123.png",

      "revised_prompt": null
    }
  ],
  "estimated_cost": {
    "unit": "0.04",
    "irt": 5254.00,
    "exchange_rate": 131350
  }
}
```

---

## SDK Usage Examples

### GLM-5 with Python

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {
            "role": "user",
            "content": "Design a microservices architecture for an e-commerce platform.",
        }
    ],
    max_tokens=4096,
    temperature=0.6,
)

print(response.choices[0].message.content)
```

### Gen-4.5 Video Generation with Python

```python
from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Create video generation request
video = client.videos.create(
    model="gen4.5",
    prompt="A close-up of a young woman with striking features and platinum blonde hair.",
    input_reference=open("portrait_reference.jpeg", "rb"),
    size="1920x1080",
    seconds="5",
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
            with open("output.mp4", "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    time.sleep(10)
```

### Seedream 4.5 Image Generation with Python

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="seedream-4-5-251128",
    prompt="A professional product shot with enhanced typography showing 'SALE 50% OFF'",
    size="2K",
    response_format="url",
    extra_body={"sequential_image_generation": "disabled", "watermark": False},
)

print(f"Generated image: {response.data[0].url}")
```

---

## Related Documentation

- [Z.AI Models](en/providers/zai.md)
- [RunwayML Models](en/providers/runwayml.md)
- [BytePlus Models](en/providers/byteplus.md)
- [Video Generation API](en/api-reference/videos.md)
- [Image Generation API](en/api-reference/images.md)
- [Pricing](en/pricing.md)
