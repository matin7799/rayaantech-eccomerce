# New Models Added: Stable Imagen 4.0, DeepSeek-V3.1, and BFL FLUX Models

**Date:** 2025-08-24

## Summary

We're excited to announce major model updates including stable versions of Google's Imagen 4.0 series, DeepSeek-V3.1 with enhanced reasoning capabilities, and new FLUX models from Black Forest Labs (BFL). These additions provide improved stability, advanced reasoning, and cutting-edge image generation and editing capabilities.

---

## Details

### Google Imagen 4.0 - Stable Versions Now Available

The stable versions of Google's Imagen 4.0 series are now available, replacing the previous preview versions with enhanced reliability and performance:

- **imagen-4.0-generate-001**: High-quality image generation with improved stability and consistency. Supports resolutions up to 2048x2048 and multiple aspect ratios. [Documentation](en/models/imagen-4.0-generate-001.md)
- **imagen-4.0-fast-generate-001**: Optimized for speed while maintaining quality, perfect for applications requiring quick image generation. [Documentation](en/models/imagen-4.0-fast-generate-001.md)
- **imagen-4.0-ultra-generate-001**: Ultra-high quality image generation with exceptional detail and realism. Supports the highest resolution outputs up to 2816x1536. [Documentation](en/models/imagen-4.0-ultra-generate-001.md)

#### Key Features of Imagen 4.0 Stable Models:

- Digital watermarking and verification
- User-configurable safety settings
- Prompt enhancement using prompt rewriter
- Person generation capabilities
- Multiple aspect ratios and high-resolution support

### DeepSeek-V3.1 - Enhanced Reasoning and Agent Capabilities

We're announcing support for DeepSeek-V3.1, the latest model from DeepSeek.com that brings significant improvements in reasoning and agent capabilities. The existing model names `deepseek-chat` and `deepseek-reasoner` now automatically route to DeepSeek-V3.1:

- **deepseek-chat**: Non-thinking mode of DeepSeek-V3.1 for fast, efficient responses
- **deepseek-reasoner**: Thinking mode of DeepSeek-V3.1 with advanced reasoning capabilities

#### DeepSeek-V3.1 Improvements:

- **Hybrid inference**: Think & Non-Think modes in one model
- **Faster thinking**: Reaches answers quicker than previous versions
- **Stronger agent skills**: Enhanced tool use and multi-step agent tasks
- **128K context**: Extended context window for both modes
- **Better performance**: Improved results on SWE-bench and Terminal-Bench
- **Efficient reasoning**: Significant gains in thinking efficiency

**Important Note**: Only `deepseek-chat` and `deepseek-reasoner` route to the new DeepSeek-V3.1. Other model names like `deepseek-r1-0528` and `deepseek-v3-0324` use different providers (Azure and AWS Bedrock) and do not resolve to DeepSeek-V3.1.

### BFL FLUX Models - Advanced Image Generation and Editing

New FLUX models from Black Forest Labs are now available, offering state-of-the-art image generation and editing capabilities:

- **flux-1.1-pro**: Advanced image generation model supporting `v1/images/generations` endpoint with superior performance across image quality, prompt adherence, and generation speed. [Documentation](en/models/flux-1.1-pro.md)
- **flux.1-kontext-pro**: Versatile model supporting both `v1/images/generations` and `v1/images/edits` endpoints, excelling in text editing and character preservation tasks. [Documentation](en/models/flux.1-kontext-pro.md)

#### Flux Models Key Features:

- **High Performance**: Top rankings in image quality and prompt adherence benchmarks
- **Fast Generation**: Consistently lower latencies than competing models
- **Versatile Editing**: Advanced text editing and character preservation (flux.1-kontext-pro)
- **Multiple Endpoints**: Support for both generation and editing workflows

### Usage Examples

#### Google Imagen 4.0 Models

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="imagen-4.0-generate-001",
    prompt="A serene mountain landscape with a crystal-clear lake reflecting the peaks at golden hour",
    size="1024x1024",
    n=1,
    response_format="url",
)

print(response.data[0].url)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
 apiKey: process.env.AVALAI_API_KEY,
 baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
 model: "imagen-4.0-generate-001",
 prompt: "A serene mountain landscape with a crystal-clear lake reflecting the peaks at golden hour",
 size: "1024x1024",
 n: 1,
 response_format: "url", // or b64_json
});

console.log(response.data[0].url);

bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "imagen-4.0-generate-001",
 "prompt": "A serene mountain landscape with a crystal-clear lake reflecting the peaks at golden hour",
 "size": "1024x1024",
 "n": 1,
 "response_format": "url"
 }'

```

#### DeepSeek-V3.1 Models

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using deepseek-chat (non-thinking mode)
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {
            "role": "user",
            "content": "Explain the concept of quantum entanglement in simple terms",
        }
    ],
)

print(response.choices[0].message.content)

# Using deepseek-reasoner (thinking mode)
reasoning_response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[
        {
            "role": "user",
            "content": "Solve this complex math problem: If a train travels 120 miles in 2 hours, then speeds up by 25% for the next 3 hours, how far did it travel in total?",
        }
    ],
)

print(reasoning_response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Using deepseek-chat (non-thinking mode)
const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
        {
            role: "user",
            content: "Explain the concept of quantum entanglement in simple terms",
        },
    ],
});

console.log(response.choices[0].message.content);

// Using deepseek-reasoner (thinking mode)
const reasoningResponse = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
        {
            role: "user",
            content: "Solve this complex math problem: If a train travels 120 miles in 2 hours, then speeds up by 25% for the next 3 hours, how far did it travel in total?",
        },
    ],
});

console.log(reasoningResponse.choices[0].message.content);

```

#### BFL (FLUX) Models - Image Generation

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.generate(
    model="flux-1.1-pro",
    prompt="A futuristic cityscape at sunset with flying cars and neon lights",
    size="1024x1024",
    n=1,
    response_format="b64_json",  # not supporting 'url'
)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
 apiKey: process.env.AVALAI_API_KEY,
 baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.generate({
 model: "flux-1.1-pro",
 prompt: "A futuristic cityscape at sunset with flying cars and neon lights",
 size: "1024x1024",
 n: 1,
 response_format: "b64_json", // not supporting 'url'
});

bash=:curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "flux-1.1-pro",
 "prompt": "A futuristic cityscape at sunset with flying cars and neon lights",
 "size": "1024x1024",
 "n": 1,
 "response_format": "url"
 }'

```

#### BFL (FLUX) Models - Image Editing

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.images.edit(
    model="flux.1-kontext-pro",
    image=open("original_image.png", "rb"),
    prompt="Change the text on the sign to 'Welcome to AvalAI'",
    size="1024x1024",
    n=1,
    response_format="b64_json",  # not supporting 'url'
)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
 apiKey: process.env.AVALAI_API_KEY,
 baseURL: "https://api.avalai.ir/v1",
});

const response = await client.images.edit({
 model: "flux.1-kontext-pro",
 image: fs.createReadStream("original_image.png"),
 prompt: "Change the text on the sign to 'Welcome to AvalAI'",
 size: "1024x1024",
 n: 1,
 response_format: "b64_json", // not supporting 'url'
});

bash=:curl https://api.avalai.ir/v1/images/edits \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F image="@original_image.png" \
  -F model="flux.1-kontext-pro" \
  -F prompt="Change the text on the sign to 'Welcome to AvalAI'" \
  -F size="1024x1024" \
  -F n=1

```

### Pricing Information

The new models are available with competitive pricing:

- **imagen-4.0-generate-001**: $0.04 per image
- **imagen-4.0-fast-generate-001**: $0.02 per image
- **imagen-4.0-ultra-generate-001**: $0.06 per image
- **flux-1.1-pro**: $0.04 per image
- **flux.1-kontext-pro**: $0.04 per image
- **DeepSeek-V3.1 models**:
  - **deepseek-chat**: $0.07 / 1M tokens (cache hit), $0.27 / 1M tokens (cache miss), $1.10 / 1M tokens (output)
  - **deepseek-reasoner**: $0.14 / 1M tokens (cache hit), $0.55 / 1M tokens (cache miss), $2.19 / 1M tokens (output)
  - *Pricing reference: [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing/)*

---

## Related Links

- [Google Imagen Documentation](en/providers/google.md?id=google-imagen-40-models)
- [DeepSeek Documentation](en/providers/deepseek.md)
- [BFL (FLUX) Documentation](en/providers/bfl.md)
- [Image Generation Guide](en/guides/image-generation.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Images API Reference](en/api-reference/images.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Rate Limits and Pricing](en/guides/rate-limits.md)
