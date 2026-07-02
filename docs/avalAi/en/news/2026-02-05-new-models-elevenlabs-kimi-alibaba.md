# New Models Added: Eleven v3, Kimi k2.5, and Qwen3 Updates

**Date:** 2026-02-05 / (1404-11-16)

## Summary

We have added support for ElevenLabs' latest **Eleven v3** model, Moonshot AI's **Kimi k2.5**, and Alibaba's **Qwen3-Rerank** model. Additionally, we have updated the **Qwen3-Max** and **Qwen3-VL-Flash** models with their latest snapshots, offering improved performance at the same price.

---

## Details

### ElevenLabs

#### Eleven v3
**Eleven v3** (`eleven_v3`) is ElevenLabs' most advanced speech synthesis model, delivering emotionally rich and lifelike speech. It supports natural multi-speaker dialogue and offers a high degree of contextual understanding.

- **Endpoint**: `v1/audio/speech`
- **Capabilities**: High emotional range, multi-speaker dialogue support, 70+ languages.
- **Pricing**: $0.005 per second of generated audio.

**Pricing Details:**

| Model | Input | Cached Input | Output | Pricing Unit |
|-------|-------|--------------|--------|--------------|
| eleven_v3 | - | - | - | $0.005 / second |

#### Example Request

```bash
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "eleven_v3",
    "input": "This is a demonstration of the new Eleven v3 model.",
    "voice": "coral"
  }' \
  --output test_audio.mp3
```

### Moonshot AI

#### Kimi k2.5
**Kimi k2.5** (`kimi-k2.5`) is a powerful multimodal model from Moonshot AI, designed for advanced reasoning, coding, and agentic tasks. It excels in complex workflows and supports vision capabilities.

- **Endpoints**: `v1/chat/completions`, `v1/responses`
- **Capabilities**: Advanced reasoning, coding, vision, agentic behavior.

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| kimi-k2.5 | $0.66 | $0.11 | $3.30 |
*(Prices per 1M tokens)*

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "kimi-k2.5",
    "messages": [
      {
        "role": "user",
        "content": "Explain the significance of the Kimi k2.5 model."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-kimi-example",
  "created": 1709673400,
  "model": "kimi-k2.5",
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Kimi k2.5 is a significant advancement in..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 25,
    "total_tokens": 37
  }
}
```

### Alibaba

#### Qwen3 Rerank
**Qwen3 Rerank** (`qwen3-rerank`) is a specialized model for re-ranking text documents, essential for RAG (Retrieval-Augmented Generation) applications to improve retrieval accuracy.

- **Endpoint**: `v1/rerank`
- **Capabilities**: High-accuracy text reranking, supports 100+ languages.

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| qwen3-rerank | $0.10 | $0.0035 | - |
*(Prices per 1M tokens)*

#### Example Request

```bash
curl https://api.avalai.ir/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-rerank",
    "query": "What is machine learning?",
    "documents": [
      "Machine learning is a field of study...",
      "Deep learning is a subset of machine learning...",
      "Apples are a type of fruit..."
    ]
  }'
```

#### Example Response

```json
{
  "model": "qwen3-rerank",
  "results": [
    {
      "index": 1,
      "relevance_score": 0.98,
      "document": {
        "text": "Deep learning is a subset of machine learning..."
      }
    },
    {
      "index": 0,
      "relevance_score": 0.95,
      "document": {
        "text": "Machine learning is a field of study..."
      }
    },
    {
      "index": 2,
      "relevance_score": 0.01,
      "document": {
        "text": "Apples are a type of fruit..."
      }
    }
  ],
  "usage": {
    "total_tokens": 45
  }
}
```

#### Qwen3 Model Updates
We have also updated the following Qwen3 models to their latest snapshots. These updates provide improved performance while maintaining the same pricing.

- **Qwen3 Max**: Updated to `qwen3-max-2026-01-23`
- **Qwen3 VL Flash**: Updated to `qwen3-vl-flash-2026-01-22`

You can use these specific snapshot names to pin your application to these versions, or continue using the base model names (`qwen3-max`, `qwen3-vl-flash`) to automatically use the latest stable versions.

**Pricing Details (Same as previous versions):**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| qwen3-max-2026-01-23 | $1.20 | $0.10 | $6.00 | Higher rates for >32K and >128K context |
| qwen3-vl-flash-2026-01-22 | $0.05 | $0.01 | $0.40 | Higher rates for >32K and >128K context |

*(Prices per 1M tokens. See pricing page for detailed context tiers.)*
