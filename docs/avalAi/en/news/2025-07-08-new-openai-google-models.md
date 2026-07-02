# New Models Added: OpenAI Research Models and Google Imagen 4.0

**Date:** 2025-07-08

## Summary

We've expanded our model offerings with powerful new OpenAI research models and Google's latest Imagen 4.0 image generation models. These additions include advanced deep research capabilities and state-of-the-art image generation tools to enhance your AI applications.

---

## Details

### OpenAI Research Models

We're excited to announce the addition of OpenAI's latest research models, designed for complex reasoning and deep research tasks:

- **o3-pro**: OpenAI's most advanced reasoning model for complex problem-solving and analysis
- **o3-deep-research**: Our most powerful deep research model capable of tackling complex, multi-step research tasks with internet search capabilities
- **o4-mini-deep-research**: A faster, more affordable deep research model ideal for complex research tasks with excellent cost-performance balance

#### Important Usage Notes for Research Models

All research models (`o3-deep-research`, `o4-mini-deep-research`, and `computer-use-preview`) are **only accessible through the v1/responses endpoint** and require tools to be selected. When using `search_context_size`, it should be set to at least "medium" for optimal performance.

### Google Imagen 4.0 Models

Google's latest image generation models are now available, offering enhanced quality and speed:

- **imagen-4.0-ultra-generate-preview-06-06**: Ultra-high quality image generation with exceptional detail and realism
- **imagen-4.0-generate-preview-06-06**: High-quality image generation for professional applications
- **imagen-4.0-fast-generate-preview-06-06**: Fast image generation optimized for speed while maintaining quality

### Usage Examples

#### Research Models (v1/responses endpoint)

```language-selector
python=:import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "o3-deep-research",
    "tools": [{"type": "web_search", "search_context_size": "medium"}],
    "input": "Research the latest developments in quantum computing",
}

response = requests.post(url, headers=headers, json=data)
print(response.json())

javascript=:const response = await fetch('https://api.avalai.ir/v1/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $AVALAI_API_KEY'
  },
  body: JSON.stringify({
    model: 'o3-deep-research',
    tools: [{ type: 'web_search_preview', search_context_size: 'medium' }],
    input: 'Research the latest developments in quantum computing'
  })
});

const result = await response.json();
console.log(result);

bash=:curl -i https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "o3-deep-research",
 "tools": [{ "type": "web_search", "search_context_size": "medium"}],
 "input": "Research the latest developments in quantum computing"
 }'

```

#### Google Imagen Models (Standard Chat Completions)

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="imagen-4.0-generate-preview-06-06",
    messages=[
        {
            "role": "user",
            "content": "Generate a beautiful landscape with mountains and a lake at sunset",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "imagen-4.0-generate-preview-06-06",
  messages: [
    {
      role: "user",
      content:
        "Generate a beautiful landscape with mountains and a lake at sunset",
    },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [OpenAI Models Documentation](en/models/model-details.md)
- [Google Models Documentation](en/providers/google.md)
- [Responses API Guide](en/guides/responses-vs-chat-completions.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Tools and Function Calling](en/guides/tools.md)