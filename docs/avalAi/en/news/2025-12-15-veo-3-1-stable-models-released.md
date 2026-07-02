# Veo 3.1 Stable Video Models Released

**Date:** 2025-12-15 / (1404-09-25)

## Summary

We announce the release of stable versions of Google's Veo 3.1 video generation models: [`veo-3.1-generate-001`](en/providers/google.md#veo-3-1-generate) and [`veo-3.1-fast-generate-001`](en/providers/google.md#veo-3-1-fast-generate). These stable versions provide improved reliability, reduced latency, and long-term support. Migration from the corresponding preview models is recommended at this time.

---

## Details

### Stable Model Release

Google has released stable versions of the Veo 3.1 video generation models. The new stable model IDs are:

- **[`veo-3.1-generate-001`](en/providers/google.md#veo-3-1-generate)**: High-quality video generation with rich native audio, natural conversations, and synchronized sound effects. Best for production-ready content requiring maximum visual and audio fidelity.

- **[`veo-3.1-fast-generate-001`](en/providers/google.md#veo-3-1-fast-generate)**: Speed-optimized version that maintains high quality while providing faster generation times. Ideal for rapid iteration, high-volume projects, and applications requiring quick turnaround.

### Migration Required

The preview models (`veo-3.1-generate-preview` and `veo-3.1-fast-generate-preview`) will be deprecated soon. Migration from the corresponding preview models is recommended at this time for:

- **Improved Stability**: Production-ready reliability for your applications
- **Lower Latency**: Optimized infrastructure for faster response times
- **Continued Support**: Long-term support and maintenance

### Model Specifications

| Feature | veo-3.1-generate-001 | veo-3.1-fast-generate-001 |
|---------|----------------------|---------------------------|
| Model ID | veo-3.1-generate-001 | veo-3.1-fast-generate-001 |
| Status | Stable | Stable |
| Max Duration | 8 seconds | 8 seconds |
| Resolutions | 720p, 1080p (16:9 only) | 720p, 1080p (16:9 only) |
| Aspect Ratios | 16:9, 9:16 | 16:9, 9:16 |
| Native Audio | Yes | Yes |
| Pricing | $0.40/second | $0.15/second |

### Capabilities

Both stable models support:

- **Text to Video**: Generate videos from text prompts
- **Image to Video**: Use reference images as the starting frame
- **Prompt Rewriting**: Automatic enhancement of prompts for better results
- **First and Last Frames**: Generate videos from specified first and last frames
- **Provisioned Throughput**: Fixed quota usage types

### Usage Example

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/videos \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F "model=veo-3.1-fast-generate-001" \
  -F "prompt=A serene lake at sunset with mountains in the background" \
  -F "size=1280x720" \
  -F "seconds=4"

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

video = client.videos.create(
    model="veo-3.1-fast-generate-001",
    prompt="A serene lake at sunset with mountains in the background",
    size="1280x720",
    seconds="4",
)

print(f"Video generation started: {video.id}")

javascript=:import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: 'https://api.avalai.ir/v1'
});

const video = await client.videos.create({
    model: 'veo-3.1-fast-generate-001',
    prompt: 'A serene lake at sunset with mountains in the background',
    size: '1280x720',
    seconds: '4'
});

console.log(`Video generation started: ${video.id}`);

```

### Migration Guide

To migrate from preview to stable models, simply update the model ID in your API calls:

| Preview Model (Deprecated) | Stable Model (Recommended) |
|---------------------------|---------------------------|
| `veo-3.1-generate-preview` | `veo-3.1-generate-001` |
| `veo-3.1-fast-generate-preview` | `veo-3.1-fast-generate-001` |

**Before (Preview):**
```python
video = client.videos.create(
    model="veo-3.1-generate-preview",  # Deprecated
    prompt="Your prompt here",
)
```

**After (Stable):**
```python
video = client.videos.create(
    model="veo-3.1-generate-001",  # Stable
    prompt="Your prompt here",
)
```

### Pricing

No changes to pricing. Both stable and preview models maintain the same pricing:

| Model | Price per Second |
|-------|-----------------|
| veo-3.1-fast-generate-001 | $0.15/second |
| veo-3.1-generate-001 | $0.40/second |

---

## Related Links

- [Generate Videos Using Veo Guide](en/guides/generate-videos-using-veo.md)
- [Video API Reference](en/api-reference/videos.md)
- [Google Models Documentation](en/providers/google.md)
- [Veo 3.1 Preview Announcement](en/news/2025-11-18-veo-3-1-video-models-added.md)
- [Pricing](en/pricing.md)