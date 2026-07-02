# Native Gemini API Support Now Available

**Date:** 2025-07-22

## Summary

AvalAI now supports native access to Gemini models using Google's official GenAI SDK, providing developers with a third SDK option alongside our existing OpenAI-compatible and Anthropic native approaches. This enhancement enables direct integration with Google's native API schema while maintaining the unified access through AvalAI's infrastructure.

---

## Details

We're excited to announce that AvalAI now supports native access to Gemini models through Google's official GenAI SDK. This addition expands our SDK support options, giving developers more flexibility in how they integrate with AI models.

### Three SDK Approaches Now Available

AvalAI now offers three distinct approaches for accessing AI models:

1. **OpenAI-Compatible SDKs** (Unified approach) - Access all models from multiple providers with consistent OpenAI syntax
2. **Anthropic Official SDKs** (Native approach) - Use Anthropic's official SDKs for multi-provider access
3. **Google GenAI SDK** (Native approach) - Use Google's official GenAI SDK for native Gemini model access

### Google GenAI SDK Support

The new native Gemini support allows developers to use Google's official `genai` library with AvalAI's infrastructure, providing:

- **Native API Schema**: Direct access using Google's native `generateContent` and `streamGenerateContent` endpoints
- **Flexible Authentication**: Support for both `Authorization: Bearer` and `x-goog-api-key` headers
- **Streaming Support**: Full support for streaming responses with `agenerate_content_stream`
- **Multimodal Capabilities**: Native support for text, image, audio, and video inputs

### Usage Examples

#### Python with Google GenAI SDK

```python
from google import genai
from google.genai.types import ContentDict, PartDict

# Set up the client
api_key = "your-avalai-api-key"
gemini_client = genai.Client(
    api_key=api_key, http_options={"base_url": "https://api.avalai.ir"}
)

# Generate content
contents = ContentDict(
    parts=[PartDict(text="Hello, can you tell me a short joke?")],
    role="user",
)

response = await gemini_client.agenerate_content(
    contents=contents,
    model="gemini-2.0-flash",
    max_tokens=100,
)
print(response)
```

#### Streaming Example

```python
# Streaming text generation
response = await gemini_client.agenerate_content_stream(
    contents=contents,
    model="gemini-2.0-flash",
    max_tokens=500,
)

async for chunk in response:
    print(chunk)
```

#### Direct API Access

```bash
# Using Authorization Bearer header
curl -L -X POST 'https://api.avalai.ir/v1beta/models/gemini-flash:generateContent' \
  -H 'content-type: application/json' \
  -H 'Authorization: Bearer $AVALAI_API_KEY' \
  -d '{
    "contents": [
      {
        "parts": [{"text": "Write a short story about AI"}],
        "role": "user"
      }
    ],
    "generationConfig": {
      "maxOutputTokens": 100
    }
  }'

# Using Google's native header format
curl -L -X POST 'https://api.avalai.ir/v1beta/models/gemini-flash:generateContent' \
  -H 'content-type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
      {
        "parts": [{"text": "Write a short story about AI"}],
        "role": "user"
      }
    ],
    "generationConfig": {
      "maxOutputTokens": 100
    }
  }'
```

### Important Limitations

- **Gemini Models Only**: This native support is exclusively for Gemini models. Other Google services or models are not supported through this approach.
- **Base URL**: When using the Google GenAI SDK, use `https://api.avalai.ir` as the base URL (without `/v1`)
- **Endpoint Format**: Native endpoints follow the pattern `/v1beta/models/{model-name}:generateContent`

### Available Endpoints

- **Generate Content**: `/v1beta/models/{model-name}:generateContent`
- **Stream Generate Content**: `/v1beta/models/{model-name}:streamGenerateContent`

### Getting Started

To start using the native Gemini API support:

1. Install the Google GenAI SDK: `pip install google-generativeai`
2. Configure your client with AvalAI's base URL
3. Use your existing AvalAI API key for authentication
4. Access any supported Gemini model through the native API schema

---

## Related Links

- [Google GenAI SDK v1beta API Reference](en/api-reference/v1beta.md)
- [Google Models Documentation](en/providers/google.md)
- [Libraries Documentation](en/libraries.md)
- [API Authentication Guide](en/api-reference/authentication.md)