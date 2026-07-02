# New Models Added: GLM-5.1, GLM-5v-Turbo, Nemotron-3-120B, Gemma 4, Qwen3.6-Plus, and Qwen-Image-2.0

**Date:** 2026-04-12 / (1405-01-23)

## Summary

We announce the addition of eight new models: Z.AI's GLM-5.1 flagship model with state-of-the-art agentic coding performance and GLM-5v-Turbo multimodal model, NVIDIA Nemotron-3-120B-A12B via Cloudflare AI with 1M context window, Google's Gemma 4 open models (26B and 31B variants) with industry-leading efficiency, Alibaba's Qwen3.6-Plus with enhanced agentic capabilities and 1M context, and Qwen-Image-2.0 series for professional typography and photorealistic image generation.

---

## Details

### Z.AI (GLM)

#### GLM-5.1

[`glm-5.1`](en/providers/zai.md) is Z.AI's next-generation flagship model for agentic engineering, with significantly stronger coding capabilities than its predecessor. It achieves state-of-the-art performance on SWE-Bench Pro (58.4%) and leads GLM-5 by a wide margin on NL2Repo (repo generation) and Terminal-Bench 2.0 (real-world terminal tasks).

| Feature | Details |
|---------|---------|
| Context window | 200,000 tokens |
| Input pricing | $1.54 / 1M tokens |
| Cached input pricing | $0.286 / 1M tokens (81% cost reduction) |
| Output pricing | $4.84 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **State-of-the-Art on SWE-Bench Pro**: 58.4% performance, leading all models including GPT-5.4 and Claude Opus 4.6
- **Long-Horizon Optimization**: Sustains productive optimization over 600+ iterations with 6,000+ tool calls
- **Agentic Engineering**: Built for sustained effectiveness on agentic tasks over extended sessions
- **Complex Problem Solving**: Breaks down complex problems, runs experiments, reads results, and identifies blockers with precision
- **Self-Revision**: Revisits reasoning and revises strategy through repeated iteration
- **Function Calling**: Full support for tool use and external integrations
- **Structured Outputs**: Return responses in specific, organized formats

**Benchmark Performance:**
- SWE-Bench Pro: 58.4% (SOTA)
- NL2Repo: 42.7%
- Terminal-Bench 2.0: 63.5%
- AIME 2026: 95.3%
- GPQA-Diamond: 86.2%
- HLE (with tools): 52.3%

#### GLM-5v-Turbo

[`glm-5v-turbo`](en/providers/zai.md) is Z.AI's multimodal vision model optimized for high-throughput visual understanding tasks.

| Feature | Details |
|---------|---------|
| Context window | 200,000 tokens |
| Input pricing | $1.20 / 1M tokens |
| Cached input pricing | $0.24 / 1M tokens (80% cost reduction) |
| Output pricing | $4.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Vision Understanding**: Process and analyze images with high accuracy
- **Multi-Image Support**: Handle multiple images in a single request
- **High-Throughput**: Optimized for fast visual processing
- **Context Caching**: 80% cost reduction on cached inputs
- **Function Calling**: Full tool support with visual inputs
- **Streaming**: Real-time streaming responses

### Cloudflare AI

#### Nemotron-3-120B-A12B

[`cf.nemotron-3-120b-a12b`](en/providers/cloudflare.md) is NVIDIA's latest Nemotron model available via Cloudflare AI. This hybrid LatentMoE architecture uses Mamba-2 + MoE + Attention with 120B total parameters (12B active), designed for agentic workflows, long-context reasoning, and high-volume workloads.

| Feature | Details |
|---------|---------|
| Total Parameters | 120B (12B active) |
| Architecture | LatentMoE - Mamba-2 + MoE + Attention hybrid with Multi-Token Prediction |
| Context window | 1,000,000 tokens |
| Input pricing | $0.50 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (90% cost reduction) |
| Output pricing | $1.50 / 1M tokens |
| Input modalities | Text |
| Output modalities | Text |
| Supported languages | English, French, German, Italian, Japanese, Spanish, Chinese |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **1M Context Window**: Industry-leading context length for extensive documents and conversations
- **Agentic Workflows**: Optimized for collaborative agents and high-volume workloads like IT ticket automation
- **Configurable Reasoning**: Enable or disable reasoning mode via chat template
- **Multi-Token Prediction**: MTP layers for faster text generation and improved quality
- **Tool Use & RAG**: Excellent for tool calling and retrieval-augmented generation
- **Cost-Effective**: Only 12B active parameters for exceptional efficiency

**Benchmark Highlights:**
- SWE-Bench (OpenHands): 60.47%
- AIME 2025: 90.21%
- HMMT Feb 2025 (with tools): 94.73%
- LiveCodeBench: 81.19%

### Google

#### Gemma 4-26B-A4B-IT

[`gemma-4-26b-a4b-it`](en/providers/google.md) is Google's open model built from Gemini 3 research, delivering unprecedented intelligence-per-parameter with Mixture-of-Experts architecture (26B total, 4B active).

| Feature | Details |
|---------|---------|
| Total Parameters | 26B (4B active) |
| Architecture | Mixture-of-Experts (MoE) |
| Context window | 128,000 tokens |
| Input pricing | $0.13 / 1M tokens |
| Cached input pricing | $0.013 / 1M tokens (90% cost reduction) |
| Output pricing | $0.40 / 1M tokens |
| Input modalities | Text, Image, Audio |
| Output modalities | Text |
| Supported languages | 140 languages |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |

**Key Features:**
- **Frontier Intelligence**: Built from Gemini 3 research for maximum intelligence-per-parameter
- **MoE Architecture**: 26B total parameters with only 4B active for efficiency
- **Multimodal**: Strong audio and visual understanding
- **Agentic Workflows**: Native support for function calling and autonomous agents
- **140 Languages**: Multilingual support that goes beyond translation
- **Thinking Mode**: Extended reasoning for complex problems
- **Consumer GPU**: Optimized to run on personal computers

**Benchmark Performance:**
- Arena AI (text): 1441
- MMMLU: 82.6%
- MMMU Pro: 73.8%
- AIME 2026: 88.3%
- LiveCodeBench v6: 77.1%
- GPQA Diamond: 82.3%

#### Gemma 4-31B-IT

[`gemma-4-31b-it`](en/providers/google.md) is the dense variant of Gemma 4, offering maximum capability for users who prefer full parameter utilization.

| Feature | Details |
|---------|---------|
| Parameters | 31B |
| Architecture | Dense Transformer |
| Context window | 128,000 tokens |
| Input pricing | $0.14 / 1M tokens |
| Cached input pricing | $0.014 / 1M tokens (90% cost reduction) |
| Output pricing | $0.40 / 1M tokens |
| Input modalities | Text, Image, Audio |
| Output modalities | Text |
| Supported languages | 140 languages |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Industry-Leading Efficiency**: Top Arena AI ELO score (1452) for its size class
- **Dense Architecture**: Full 31B parameters active for maximum capability
- **Multimodal Reasoning**: Strong audio and visual understanding
- **Agentic Workflows**: Native function calling and agent support
- **Fine-Tuning**: Improve performance for specific tasks using your preferred frameworks
- **Thinking Mode**: Extended reasoning capabilities

**Benchmark Performance:**
- Arena AI (text): 1452
- MMMLU: 85.2%
- MMMU Pro: 76.9%
- AIME 2026: 89.2%
- LiveCodeBench v6: 80.0%
- GPQA Diamond: 84.3%
- τ2-bench Retail: 86.4%

### Alibaba (Qwen)

#### Qwen3.6-Plus

[`qwen3.6-plus`](en/providers/alibaba.md) is Alibaba's latest flagship model with massive capability upgrades, featuring a 1M context window by default, significantly improved agentic coding capabilities, and better multimodal perception and reasoning.

| Feature | Details |
|---------|---------|
| Context window | 1,000,000 tokens (default) |
| Input pricing | $0.50 / 1M tokens |
| Input pricing (above 256K) | $2.00 / 1M tokens |
| Cache creation | $0.625 / 1M tokens |
| Cache creation (above 256K) | $2.50 / 1M tokens |
| Cached input pricing | $0.05 / 1M tokens (90% cost reduction) |
| Cached input (above 256K) | $0.20 / 1M tokens |
| Output pricing | $3.00 / 1M tokens |
| Output pricing (above 256K) | $6.00 / 1M tokens |
| Input modalities | Text, Image |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **1M Context Window**: Default million-token context for extensive documents and conversations
- **SOTA Agentic Coding**: From frontend web development to complex repository-level problem solving
- **Enhanced Multimodal**: Greater accuracy and sharper multimodal reasoning
- **Coding Agent Excellence**: 78.8% on SWE-bench Verified, 61.6% on Terminal-Bench 2.0
- **Deep Planning**: 41.5% on DeepPlanning benchmark (leading performance)
- **MCP Support**: 48.2% on MCPMark for Model Context Protocol integration
- **Tool Decathlon**: Strong performance across diverse tool-use scenarios

**Benchmark Performance:**
- SWE-bench Verified: 78.8%
- SWE-bench Multilingual: 73.8%
- SWE-bench Pro: 56.6%
- Terminal-Bench 2.0: 61.6%
- TAU3-Bench: 70.7%
- DeepPlanning: 41.5%
- MCPMark: 48.2%
- MMLU-Pro: 88.5%
- SuperGPQA: 71.6%

#### Qwen-Image-2.0-Pro

[`qwen-image-2.0-pro`](en/providers/alibaba.md) is Alibaba's next-generation professional image generation model with advanced typography rendering, supporting 1K-token instructions for direct generation of professional infographics including PPTs, posters, and comics.

| Feature | Details |
|---------|---------|
| Resolution | Native 2K (2048×2048) |
| Input pricing | $0.00 / request |
| Output pricing | $75.00 / 1M tokens ($0.075 / image) |
| Input modalities | Text, Image |
| Output modalities | Image |
| Supported endpoints | `/v1/images/generations`, `/v1/images/edits` |

**Key Features:**
- **Professional Typography**: 1K-token instruction support for PPTs, posters, and infographics
- **Complex Layout**: Pixel-perfect multi-script layout with sophisticated text-image composition
- **Native 2K Resolution**: 2048×2048 for finely detailed realistic scenes
- **Unified Model**: Generation and editing in a single model
- **Photorealism**: Microscopic detail on skin pores, fabric weave, architectural textures
- **Multiple Calligraphic Styles**: Support for various script styles and fonts
- **Image Editing**: Full support for image-to-image editing tasks

#### Qwen-Image-2.0

[`qwen-image-2.0`](en/providers/alibaba.md) is the standard version of Qwen-Image-2.0, offering the same advanced capabilities at a more accessible price point.

| Feature | Details |
|---------|---------|
| Resolution | Native 2K (2048×2048) |
| Input pricing | $0.00 / request |
| Output pricing | $35.00 / 1M tokens ($0.035 / image) |
| Input modalities | Text, Image |
| Output modalities | Image |
| Supported endpoints | `/v1/images/generations`, `/v1/images/edits` |

**Key Features:**
- **Typography Rendering**: Support for professional text-in-image generation
- **Native 2K Resolution**: High-quality image output
- **Unified Model**: Generation and editing capabilities combined
- **Strong Semantic Adherence**: Accurate prompt following
- **Lighter Architecture**: Smaller model size with faster inference
- **Cost-Effective**: Accessible pricing for high-volume usage

---

## API Request/Response Examples

### GLM-5.1 Example

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "glm-5.1",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function that finds the longest common subsequence of two strings using dynamic programming."
      }
    ]
  }'
```

#### Response

```json
{
  "id": "chatcmpl-1234567890",
  "created": 1744483200,
  "model": "glm-5.1",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here's a Python function that finds the longest common subsequence using dynamic programming:\n\n
```python\ndef longest_common_subsequence(s1: str, s2: str) -> str:\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    \n    # Backtrack to find the LCS\n    lcs = []\n    i, j = m, n\n    while i > 0 and j > 0:\n        if s1[i-1] == s2[j-1]:\n            lcs.append(s1[i-1])\n            i -= 1\n            j -= 1\n        elif dp[i-1][j] > dp[i][j-1]:\n            i -= 1\n        else:\n            j -= 1\n    \n    return ''.join(reversed(lcs))\n```",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 285,
    "prompt_tokens": 28,
    "total_tokens": 313
  },
  "estimated_cost": {
    "unit": "0.001423",
    "irt": 142.30,
    "exchange_rate": 100000
  }
}
```

### Gemma 4 Example

#### Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemma-4-31b-it",
    "messages": [
      {
        "role": "user",
        "content": "Explain the concept of mixture-of-experts architecture in neural networks."
      }
    ]
  }'
```

#### Response

```json
{
  "id": "chatcmpl-gemma4-9876543210",
  "created": 1744483200,
  "model": "gemma-4-31b-it",
  "object": "chat.completion",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Mixture-of-Experts (MoE) is a neural network architecture that uses multiple specialized sub-networks (experts) with a gating mechanism to route inputs to the most relevant experts...",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "completion_tokens": 250,
    "prompt_tokens": 18,
    "total_tokens": 268
  },
  "estimated_cost": {
    "unit": "0.000103",
    "irt": 10.3,
    "exchange_rate": 100000
  }
}
```

### Qwen-Image-2.0 Example

#### Request

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen-image-2.0",
    "prompt": "A professional infographic poster showing AI model comparison with clean typography and modern design",
    "n": 1,
    "size": "1024x1024"
  }'
```

#### Response

```json
{
  "created": 1744483200,
  "data": [
    {
      "url": "https://api.avalai.ir/files/generated/img-abc123...",

      "revised_prompt": "A professional infographic poster showing AI model comparison with clean typography and modern design"
    }
  ],
  "estimated_cost": {
    "unit": "0.035",
    "irt": 3500.00,
    "exchange_rate": 100000
  }
}
```

---

## Pricing Summary

| Model | Input | Cached Input | Output | Special |
|-------|-------|--------------|--------|---------|
| glm-5.1 | $1.54/1M | $0.286/1M | $4.84/1M | - |
| glm-5v-turbo | $1.20/1M | $0.24/1M | $4.00/1M | - |
| cf.nemotron-3-120b-a12b | $0.50/1M | $0.05/1M | $1.50/1M | 1M context |
| gemma-4-26b-a4b-it | $0.13/1M | $0.013/1M | $0.40/1M | - |
| gemma-4-31b-it | $0.14/1M | $0.014/1M | $0.40/1M | - |
| qwen3.6-plus | $0.50/1M | $0.05/1M | $3.00/1M | $2.00/$6.00 above 256K |
| qwen-image-2.0-pro | Free | Free | $0.075/image | - |
| qwen-image-2.0 | Free | Free | $0.035/image | - |

---

## Documentation Links

- [Z.AI Models](en/providers/zai.md)
- [Cloudflare AI Models](en/providers/cloudflare.md)
- [Google Models](en/providers/google.md)
- [Alibaba Models](en/providers/alibaba.md)
- [Pricing](en/pricing.md)
- [Chat Completions API](en/api-reference/chat.md)
- [Images API](en/api-reference/images.md)
