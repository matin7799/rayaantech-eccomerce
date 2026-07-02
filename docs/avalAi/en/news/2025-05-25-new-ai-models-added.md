# New AI Models Added: Codestral, Gemma 3, and Imagen 4.0

**Date:** 2025-05-25

## Summary

We're excited to announce the addition of several powerful new AI models to the AvalAI platform. This update includes Mistral AI's Codestral-2501 for advanced code generation, Google's Gemma 3 family of models with multimodal capabilities, and Google's latest Imagen 4.0 image generation models. These additions significantly expand our platform's capabilities for code generation, multilingual text processing, and high-quality image creation.

---

## Details

This update brings several cutting-edge AI models to the AvalAI platform, enhancing our offerings across multiple domains. Here's what's new:

### Mistral AI

* **codestral-2501**: A powerful 22B parameter model specialized for code generation across 80+ programming languages. It excels at completing coding functions, writing tests, and completing partial code using a fill-in-the-middle mechanism. The model supports Python, Java, C, C++, JavaScript, Bash, Swift, Fortran, and many other languages. [Documentation](en/models/codestral-2501.md)

### Google Gemini

* **gemma-3-1b-it**: A lightweight text-only instruction-tuned model, perfect for applications with limited computational resources while still providing solid performance. [Documentation](en/models/gemma-3-1b-it.md)
* **gemma-3-4b-it**: A balanced multimodal model supporting both text and image inputs with a 128K token context window. [Documentation](en/models/gemma-3-4b-it.md)
* **gemma-3-12b-it**: A more powerful multimodal model with enhanced reasoning capabilities and support for over 140 languages. [Documentation](en/models/gemma-3-12b-it.md)
* **gemma-3-27b-it**: The largest Gemma 3 model, offering superior performance for complex tasks with image and text inputs. [Documentation](en/models/gemma-3-27b-it.md)
* **gemma-3n-e4b-it**: A specialized efficient 4B parameter model optimized for specific use cases. [Documentation](en/models/gemma-3n-e4b-it.md)

### Google Imagen

* **imagen-4.0-generate-preview-05-20**: The latest preview version of Google's Imagen 4.0 image generation model. [Documentation](en/models/imagen-4.0-generate-preview-05-20.md)
* **imagen-4.0-ultra-generate-exp-05-20**: An experimental ultra-high quality version of Imagen 4.0 for generating exceptionally detailed and realistic images. [Documentation](en/models/imagen-4.0-ultra-generate-exp-05-20.md)
* **imagen-3.0-generate-002**: An updated version of Imagen 3.0 with improved image generation capabilities. [Documentation](en/models/imagen-3.0-generate-002.md)
* **imagen-3.0-generate-001**: The base Imagen 3.0 model for high-quality image generation. [Documentation](en/models/imagen-3.0-generate-001.md)
* **imagen-3.0-fast-generate-001**: A faster version of Imagen 3.0 optimized for reduced latency while maintaining good quality. [Documentation](en/models/imagen-3.0-fast-generate-001.md)

### Embeddings

* **gemini-embedding-exp-03-07**: Google's experimental Gemini embedding model for creating high-quality vector representations of text. [Documentation](en/models/gemini-embedding-exp-03-07.md)

## Usage Examples

### Using Codestral for Code Generation

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="codestral-2501",
    messages=[
        {
            "role": "user",
            "content": "Write a Python function to check if a string is a palindrome.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "codestral-2501",
  messages: [
    {
      role: "user",
      content: "Write a Python function to check if a string is a palindrome.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Using Gemma 3 Models for Multimodal Tasks

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemma-3-12b-it",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
                    },
                },
            ],
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
  model: "gemma-3-12b-it",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          image_url: { url: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png" },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);

```

### Generating Images with Imagen 4.0

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="imagen-4.0-generate-preview-05-20",
    prompt="A futuristic city with flying cars and vertical gardens on skyscrapers",
    n=1,
    size="1024x1024",
    response_format="url",  # or b64_json
)

image_url = response.data[0].url
print(f"Generated image URL: {image_url}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
  model: "imagen-4.0-generate-preview-05-20",
  prompt:
    "A futuristic city with flying cars and vertical gardens on skyscrapers",
  n: 1,
  size: "1024x1024",
  response_format: "url", // or b64_json
});

const imageUrl = response.data[0].url;
console.log(`Generated image URL: ${imageUrl}`);

```

### Creating Embeddings with Gemini

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    input="The quick brown fox jumps over the lazy dog",
    model="gemini-embedding-exp-03-07",
)

embeddings = response.data[0].embedding
print(f"Embedding vector (first 5 values): {embeddings[:5]}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.embeddings.create({
  input: "The quick brown fox jumps over the lazy dog",
  model: "gemini-embedding-exp-03-07",
});

const embeddings = response.data[0].embedding;
console.log(`Embedding vector (first 5 values): ${embeddings.slice(0, 5)}`);

```

---

## Related Links

- [Codestral Documentation](en/models/codestral-2501.md)
- [Imagen 4.0 Image Generation Guide](en/guides/image-generation.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [API Reference](en/api-reference/introduction.md)