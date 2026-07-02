# Google Gemini Models Deprecation Notice

**Date:** 2025-09-27

## Summary

Google has deprecated multiple Gemini models through their official API. These models will no longer be available for new requests and existing implementations should migrate to supported alternatives to ensure continued service availability.

---

## Details

### Deprecated Models

The following Google Gemini models have been officially deprecated by Google's Gemini API and are no longer available through AvalAI:

#### Core Gemini Models
- **gemini-pro** - Legacy general-purpose model
- **gemini-1.5-pro** - Previous generation pro model
- **gemini-1.5-pro-002** - Specific version variant
- **gemini-1.5-pro-001** - Specific version variant
- **gemini-1.5-pro-latest** - Latest pointer (deprecated)

#### Experimental Variants
- **gemini-1.5-pro-exp-0801** - August 2024 experimental version
- **gemini-1.5-pro-exp-0827** - August 27, 2024 experimental version
- **gemini-2.0-flash-exp** - Flash 2.0 experimental model
- **gemini-exp-1114** - November 14 experimental model
- **gemini-exp-1206** - December 6 experimental model

#### Flash Models
- **gemini-1.5-flash-latest** - Latest flash model pointer
- **gemini-1.5-flash-8b** - 8 billion parameter flash model
- **gemini-1.5-flash-8b-exp-0924** - September 24 experimental flash variant
- **gemini-1.5-flash-exp-0827** - August 27 experimental flash variant
- **gemini-1.5-flash-8b-exp-0827** - August 27 experimental 8B flash variant

### Impact on Users

- **Immediate Effect**: These models are no longer accepting new requests
- **Existing Implementations**: Any applications using these model names will receive error responses
- **API Responses**: Requests to deprecated models will return appropriate error messages indicating the model is no longer available

### Recommended Migration Path

Users should migrate to currently supported Google Gemini models available through AvalAI. Please refer to our model documentation for the latest available Gemini models and their capabilities.

**Current Stable Models:**
- **gemini-2.0-flash** - Generation 2.0 flash model
- **gemini-2.0-flash-lite** - Generation 2.0 flash lite model
- **gemini-2.5-pro** - Generation 2.5 pro model
- **gemini-2.5-flash** - Generation 2.5 flash model
- **gemini-2.5-flash-lite** - Generation 2.5 flash lite model

**Migration Steps:**

1. **Identify Usage**: Review your current implementations to identify which deprecated models you're using
2. **Select Alternatives**: Choose from currently supported Gemini models based on your use case requirements
3. **Update Code**: Modify your model parameter in API calls to use the new model names
4. **Test Integration**: Verify that your applications work correctly with the new models
5. **Monitor Performance**: Ensure the replacement models meet your performance and quality requirements

### Example Migration

If you were using a deprecated model, update your implementation:

```language-selector
bash=:# Before (deprecated)
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-1.5-pro-latest",
    "messages": [
      {
        "role": "user",
        "content": "Your prompt here."
      }
    ]
  }'

# After (use currently supported model)
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-1.5-pro",
    "messages": [
      {
        "role": "user",
        "content": "Your prompt here."
      }
    ]
  }'

python=:# Before (deprecated)
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gemini-1.5-pro-latest",  # Deprecated
    messages=[
        {
            "role": "user",
            "content": "Your prompt here.",
        }
    ],
)

# After (use currently supported model)
completion = client.chat.completions.create(
    model="gemini-2.5-pro",  # Currently supported
    messages=[
        {
            "role": "user",
            "content": "Your prompt here.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:// Before (deprecated)
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "gemini-1.5-pro-latest", // Deprecated
  messages: [
    {
      role: "user",
      content: "Your prompt here.",
    },
  ],
});

// After (use currently supported model)
const completion = await client.chat.completions.create({
  model: "gemini-2.5-pro", // Currently supported
  messages: [
    {
      role: "user",
      content: "Your prompt here.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Support and Assistance

If you need assistance with migration or have questions about alternative models:

- Review our current model documentation for available Gemini models
- Contact our support team for migration guidance
- Check our API status page for the latest model availability updates

---

## Related Links

- [Available Models Documentation](en/models/model-details.md)
- [Models Guide](en/guides/model-selection.md)
- [API Reference - Chat Completions](en/api-reference/chat.md)
- [Migration Best Practices](en/guides/best-practices.md)
- [Error Handling Guide](en/guides/error-handling.md)