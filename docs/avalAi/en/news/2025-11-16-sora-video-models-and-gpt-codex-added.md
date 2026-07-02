# New Video Generation Models and Advanced Codex LLMs Added

**Date:** 2025-11-16

## Summary

We announce support for OpenAI's Sora 2 video generation models and the latest GPT-5.1 Codex series optimized for agentic tasks. The new [`sora-2`](en/providers/openai.md#sora-2) and [`sora-2-pro`](en/providers/openai.md#sora-2-pro) models enable programmatic video creation through the [`v1/videos`](en/api-reference/videos.md) endpoint, while [`gpt-5.1-codex`](en/providers/openai.md#gpt-5.1-codex) and [`gpt-5.1-codex-mini`](en/providers/openai.md#gpt-5.1-codex-mini) provide enhanced reasoning capabilities for code generation, debugging, and autonomous agent workflows through the [`v1/responses`](en/api-reference/responses.md) endpoint.

---

## Details

### Video Generation with Sora 2

We introduce OpenAI's Sora 2 video generation models, enabling developers to create high-quality videos from text prompts through our API. These models bring state-of-the-art video generation capabilities with comprehensive control over resolution, duration, and creative direction.

#### Available Models

- **[`sora-2`](en/providers/openai.md#sora-2)**: Optimized for speed and flexibility, ideal for rapid iteration, social media content, and prototyping. Generates quality results quickly at a cost-effective price point.

- **[`sora-2-pro`](en/providers/openai.md#sora-2-pro)**: Produces higher quality, production-ready output. Best for cinematic footage, marketing assets, and situations requiring maximum visual fidelity.

**Key Features:**

- **Asynchronous Generation**: Submit video generation jobs and poll for completion or use webhooks for notifications
- **Flexible Resolutions**: Support for 720x1280, 1280x720, and 1024x1792 (Pro only)
- **Duration Control**: Generate videos from 4 to 8+ seconds
- **Image References**: Use input images to guide video generation
- **Remix Capability**: Iterate on completed videos with targeted adjustments
- **Supporting Assets**: Download thumbnails and spritesheets alongside videos

**Pricing Details:**

| Model | Resolution | Cost per Second |
|-------|-----------|-----------------|
| sora-2 | 720x1280, 1280x720 | $0.10/second |
| sora-2-pro | 720x1280, 1280x720 | $0.30/second |
| sora-2-pro | 1024x1792, 1792x1024 | $0.50/second |

### API Request/Response Examples

#### Creating a Video

```language-selector
bash=:curl https://api.avalai.ir/v1/videos \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=sora-2" \
  -F "prompt=A calico cat playing a piano on stage" \
  -F "size=720x1280" \
  -F "seconds=4"

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

video = client.videos.create(
    model="sora-2",
    prompt="A calico cat playing a piano on stage",
    size="720x1280",
    seconds=4,
)

print(video.id)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const video = await client.videos.create({
  model: "sora-2",
  prompt: "A calico cat playing a piano on stage",
  size: "720x1280",
  seconds: 4,
});

console.log(video.id);

```

#### Response

```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2",
  "progress": 0,
  "seconds": "4",
  "size": "720x1280"
}
```

#### Checking Video Status

```language-selector
bash=:curl https://api.avalai.ir/v1/videos/video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:video_status = client.videos.retrieve(
    "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5"
)
print(f"Status: {video_status.status}, Progress: {video_status.progress}%")

javascript=:const videoStatus = await client.videos.retrieve("video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5");
console.log(`Status: ${videoStatus.status}, Progress: ${videoStatus.progress}%`);

```

#### Response (Completed)

```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "completed",
  "model": "sora-2",
  "progress": 100,
  "seconds": "4",
  "size": "720x1280"
}
```

#### Downloading the Video

```language-selector
bash=:curl -L https://api.avalai.ir/v1/videos/video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5/content \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  --output video.mp4

python=:content = client.videos.download_content(
    "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5", variant="video"
)
content.write_to_file("video.mp4")

javascript=:const content = await client.videos.downloadContent("video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5");
const buffer = Buffer.from(await content.arrayBuffer());
require('fs').writeFileSync('video.mp4', buffer);

```

### GPT-5.1 Codex Models

We introduce the latest GPT-5.1 Codex series, specifically optimized for agentic tasks, code generation, and advanced reasoning workflows.

#### Available Models

- **[`gpt-5.1-codex`](en/providers/openai.md#gpt-5.1-codex)**: Advanced reasoning model optimized for complex code generation, debugging, and multi-step agentic workflows. Provides superior performance for autonomous systems requiring deep technical reasoning.

- **[`gpt-5.1-codex-mini`](en/providers/openai.md#gpt-5.1-codex-mini)**: Lightweight version offering excellent code generation capabilities at a more accessible price point. Ideal for high-volume agentic tasks where cost efficiency matters.

**Important:** These models are available exclusively through the [`v1/responses`](en/api-reference/responses.md) endpoint.

**Key Features:**

- **Agentic Optimization**: Designed for autonomous agent workflows and multi-step reasoning
- **Advanced Code Understanding**: Superior performance on code generation, refactoring, and debugging
- **Prompt Caching**: Reduced costs for repeated context with cached input pricing
- **Extended Context**: Handle large codebases and extensive documentation
- **Function Calling**: Native support for tool use and function calling patterns

**Pricing Details:**

| Model | Input (per 1M tokens) | Cached Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------------|------------------------|
| gpt-5.1-codex | $1.25 | $0.125 | $10.00 |
| gpt-5.1-codex-mini | $0.25 | $0.025 | $2.00 |

### SDK Usage Examples

#### Using GPT-5.1 Codex for Code Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1-codex",
    "input": "Write a Python function to implement a binary search tree with insert, delete, and search operations."
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/responses",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "gpt-5.1-codex",
        "input": "Write a Python function to implement a binary search tree with insert, delete, and search operations.",
    },
)

result = response.json()
print(result["choices"][0]["message"]["content"])

javascript=:const response = await fetch("https://api.avalai.ir/v1/responses", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-5.1-codex",
    input: "Write a Python function to implement a binary search tree with insert, delete, and search operations."
  }),
});

const result = await response.json();
console.log(result.choices[0].message.content);

```

#### Example Response

```json
{
  "id": "resp-abc123",
  "created_at": 1763313239,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "model": "gpt-5.1-codex",
  "object": "response",
  "output": [
    {
      "id": "rs_123",
      "summary": [],
      "type": "reasoning",
      "content": null,
      "encrypted_content": null,
      "status": null
    },
    {
      "id": "msg_123",
      "content": [
        {
          "annotations": [],
          "text": "Here's a comprehensive implementation of a binary search tree...\n\n
```python\nclass TreeNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\nclass BinarySearchTree:\n    def __init__(self):\n        self.root = None\n    \n    def insert(self, value):\n        # Implementation...\n```",
          "type": "output_text",
          "logprobs": []
        }
      ],
      "role": "assistant",
      "status": "completed",
      "type": "message"
    }
  ],
  "parallel_tool_calls": true,
  "temperature": 1.0,
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "max_output_tokens": null,
  "previous_response_id": null,
  "reasoning": {
    "effort": "medium",
    "summary": null
  },
  "status": "completed",
  "text": {
    "format": {
      "type": "text"
    },
    "verbosity": "medium"
  },
  "truncation": "disabled",
  "usage": {
    "input_tokens": 9,
    "input_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": 0,
      "text_tokens": null
    },
    "output_tokens": 15,
    "output_tokens_details": {
      "reasoning_tokens": 0,
      "text_tokens": null
    },
    "total_tokens": 24,
    "cost": null
  },
  "background": false,
  "max_tool_calls": null,
  "top_logprobs": 0,
  "estimated_cost": {
    "unit": "0.0001612500",
    "irt": 18.2,
    "exchange_rate": 112850
  }
}
```

#### Using Codex-Mini for Agentic Tasks

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1-codex-mini",
    "input": "Create a REST API endpoint in Express.js for user authentication with JWT tokens."
  }'

python=:response = requests.post(
    "https://api.avalai.ir/v1/responses",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "gpt-5.1-codex-mini",
        "input": "Create a REST API endpoint in Express.js for user authentication with JWT tokens.",
    },
)

result = response.json()
print(result["choices"][0]["message"]["content"])

javascript=:const response = await fetch("https://api.avalai.ir/v1/responses", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-5.1-codex-mini",
    input: "Create a REST API endpoint in Express.js for user authentication with JWT tokens."
  }),
});

const result = await response.json();
console.log(result.choices[0].message.content);

```

---

## Related Links

- [Video Generation API Reference](en/api-reference/videos.md)
- [Generate Videos Using Sora Guide](en/guides/generate-videos-using-sora.md)
- [Responses API Reference](en/api-reference/responses.md)
- [OpenAI Models Documentation](en/providers/openai.md)
- [Pricing Information](en/pricing.md)
- [Agentic Workflows Guide](en/guides/agents.md)