# New Cloudflare AI Models Now Available on AvalAI

**Date:** 2025-09-01

## Summary

AvalAI now supports 21 new Cloudflare AI models, including the latest Llama 4 Scout, Llama 3.3, Gemma 3, and specialized reasoning models. These models offer enhanced performance, multimodal capabilities, and optimized inference through Cloudflare's global edge network.

---

## Details

We're excited to announce the addition of 21 new Cloudflare AI models to AvalAI's platform. These models leverage Cloudflare's Workers AI infrastructure to provide fast, reliable AI inference with global edge deployment.

### Meta Llama Models

**Llama 4 Scout Series:**
- **cf.llama-4-scout-17b-16e-instruct**: Meta's latest 17B parameter model with 16 experts, featuring native multimodal capabilities and mixture-of-experts architecture for industry-leading text and image understanding. [Documentation](en/models/cf.llama-4-scout-17b-16e-instruct.md)

**Llama 3.3 Series:**
- **cf.llama-3.3-70b-instruct-fp8-fast**: Llama 3.3 70B quantized to FP8 precision for faster inference while maintaining high performance. [Documentation](en/models/cf.llama-3.3-70b-instruct-fp8-fast.md)

**Llama 3.1 Series:**
- **cf.llama-3.1-8b-instruct-fast**: Fast version of Meta's multilingual Llama 3.1 8B model optimized for dialogue use cases. [Documentation](en/models/cf.llama-3.1-8b-instruct-fast.md)
- **cf.llama-3.1-8b-instruct-awq**: Quantized (int4) version for efficient inference. [Documentation](en/models/cf.llama-3.1-8b-instruct-awq.md)
- **cf.llama-3.1-8b-instruct-fp8**: FP8 quantized version for balanced performance and efficiency. [Documentation](en/models/cf.llama-3.1-8b-instruct-fp8.md)
- **cf.llama-3.1-8b-instruct**: Standard Llama 3.1 8B instruction-tuned model. [Documentation](en/models/cf.llama-3.1-8b-instruct.md)
- **cf.llama-3.1-70b-instruct**: Large 70B parameter model for complex reasoning tasks. [Documentation](en/models/cf.llama-3.1-70b-instruct.md)

**Llama 3.2 Series:**
- **cf.llama-3.2-1b-instruct**: Compact 1B parameter model optimized for multilingual dialogue. [Documentation](en/models/cf.llama-3.2-1b-instruct.md)
- **cf.llama-3.2-3b-instruct**: 3B parameter model for agentic retrieval and summarization tasks. [Documentation](en/models/cf.llama-3.2-3b-instruct.md)

**Llama 3 Series:**
- **cf.meta-llama-3-8b-instruct**: State-of-the-art 8B model with improved reasoning capabilities. [Documentation](en/models/cf.meta-llama-3-8b-instruct.md)
- **cf.llama-3-8b-instruct-awq**: Quantized version for efficient deployment. [Documentation](en/models/cf.llama-3-8b-instruct-awq.md)
- **cf.llama-3-8b-instruct**: Standard Llama 3 8B instruction-tuned model. [Documentation](en/models/cf.llama-3-8b-instruct.md)

**Safety Models:**
- **cf.llama-guard-3-8b**: Content safety classification model for prompt and response filtering. [Documentation](en/models/cf.llama-guard-3-8b.md)

### Google Gemma Models

- **cf.gemma-3-12b-it**: Latest Gemma 3 model with multimodal capabilities, 128K context window, and multilingual support in over 140 languages. [Documentation](en/models/cf.gemma-3-12b-it.md)
- **cf.gemma-7b-it-lora**: Gemma 7B base model optimized for LoRA adapter inference. [Documentation](en/models/cf.gemma-7b-it-lora.md)
- **cf.gemma-2b-it-lora**: Compact Gemma 2B model for LoRA fine-tuning applications. [Documentation](en/models/cf.gemma-2b-it-lora.md)
- **cf.gemma-7b-it**: Standard Gemma 7B instruction-tuned model. [Documentation](en/models/cf.gemma-7b-it.md)

### Mistral AI Models

- **cf.mistral-small-3.1-24b-instruct**: Enhanced Mistral Small 3.1 with state-of-the-art vision understanding and 128K context length. [Documentation](en/models/cf.mistral-small-3.1-24b-instruct.md)

### Qwen Models

- **cf.qwq-32b**: Advanced reasoning model capable of thinking and reasoning, achieving competitive performance against state-of-the-art reasoning models. [Documentation](en/models/cf.qwq-32b.md)
- **cf.qwen2.5-coder-32b-instruct**: Latest code-specific Qwen model with 32B parameters for programming tasks. [Documentation](en/models/cf.qwen2.5-coder-32b-instruct.md)

### DeepSeek Models

- **cf.deepseek-r1-distill-qwen-32b**: Model distilled from DeepSeek-R1, outperforming OpenAI-o1-mini across various benchmarks. [Documentation](en/models/cf.deepseek-r1-distill-qwen-32b.md)

### Key Features

- **Global Edge Deployment**: All models run on Cloudflare's global network for low latency
- **Multimodal Capabilities**: Several models support both text and image input
- **Function Calling**: Advanced models support structured function calling
- **Optimized Performance**: Various quantization options (FP8, AWQ, int4) for different performance needs
- **LoRA Support**: Selected models support Low-Rank Adaptation for fine-tuning

### API Endpoints

All Cloudflare models are available through:
- **Chat Completions**: `v1/chat/completions` (full support)
- **Responses**: `v1/responses` (partial support)
- **Messages**: `v1/messages` (partial support)

### Example Usage

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="cf.llama-4-scout-17b-16e-instruct",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms.",
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
    model: "cf.llama-4-scout-17b-16e-instruct",
    messages: [
        {
            role: "user",
            content: "Explain quantum computing in simple terms.",
        },
    ],
});

console.log(completion.choices[0].message.content);

```

### Best Practices

- **Model Selection**: Choose quantized versions (FP8, AWQ) for faster inference when speed is prioritized over absolute accuracy
- **Context Length**: Utilize the extended context windows available in newer models like Gemma 3 (128K tokens)
- **Multimodal Tasks**: Use Llama 4 Scout for tasks requiring both text and image understanding
- **Code Generation**: Leverage Qwen2.5-Coder for programming-related tasks
- **Safety**: Implement Llama Guard 3 for content moderation in production applications

---

## Related Links

- [Cloudflare AI Models Documentation](en/providers/cloudflare.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Vision Capabilities Guide](en/guides/vision.md)