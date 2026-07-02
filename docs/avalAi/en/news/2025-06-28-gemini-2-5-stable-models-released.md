# Gemini 2.5 Series Stable Models Released: New Model Names Available

**Date:** 2025-06-28

## Summary

Google has officially released stable versions of the Gemini 2.5 series models. The new stable model names [`gemini-2.5-flash`](en/models/gemini-2.5-flash.md) and [`gemini-2.5-pro`](en/models/gemini-2.5-pro.md) are now available, replacing the previous preview versions. Additionally, we've added the new [`gemma-3n-e2b-it`](en/models/gemma-3n-e2b-it.md) model to the Gemma series and the experimental [`gemini-2.5-flash-lite-preview-06-17`](en/models/gemini-2.5-flash-lite-preview-06-17.md) model.

---

## Details

This update brings significant improvements to the Gemini 2.5 series with the release of stable production-ready models. Users should migrate from preview versions to the new stable model names for better reliability and performance.

### Google Gemini 2.5 Stable Models

* **gemini-2.5-flash**: The stable version of Google's fast and efficient Gemini 2.5 model, optimized for speed while maintaining high-quality outputs. This replaces the preview versions and offers improved stability for production use. [Documentation](en/models/gemini-2.5-flash.md)

* **gemini-2.5-pro**: The stable version of Google's most capable Gemini 2.5 model, offering advanced reasoning and comprehensive language understanding. This is the production-ready version of the previously available preview models. [Documentation](en/models/gemini-2.5-pro.md)

### Migration Guide for Preview Models

If you're currently using preview model names, please update your code to use the new stable versions:

#### Gemini 2.5 Pro Migration
- **From:** `gemini-2.5-pro-preview-06-05` → **To:** `gemini-2.5-pro`
- **From:** `gemini-2.5-pro-preview-05-06` → **To:** `gemini-2.5-pro`

#### Gemini 2.5 Flash Migration
- **From:** `gemini-2.5-flash-preview-04-17` → **To:** `gemini-2.5-flash`
- **From:** `gemini-2.5-flash-preview-05-20` → **To:** `gemini-2.5-flash`

### New Gemma Model

* **gemma-3n-e2b-it**: A new addition to the Gemma series, featuring enhanced capabilities and optimized performance for instruction-following tasks. [Documentation](en/models/gemma-3n-e2b-it.md)

### New Experimental Model

* **gemini-2.5-flash-lite-preview-06-17**: An experimental lightweight version of Gemini 2.5 Flash, designed for applications requiring even faster response times with reduced computational requirements. [Documentation](en/models/gemini-2.5-flash-lite-preview-06-17.md)

## Usage Examples

### Using the New Stable Gemini 2.5 Models

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using the stable Gemini 2.5 Flash model
completion = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Explain the benefits of using stable model versions over preview versions.",
        }
    ],
)

print(completion.choices[0].message.content)

# Using the stable Gemini 2.5 Pro model
completion = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": "Analyze the impact of AI model stability on production applications.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Using the stable Gemini 2.5 Flash model
const flashCompletion = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content:
        "Explain the benefits of using stable model versions over preview versions.",
    },
  ],
});

console.log(flashCompletion.choices[0].message.content);

// Using the stable Gemini 2.5 Pro model
const proCompletion = await client.chat.completions.create({
  model: "gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content:
        "Analyze the impact of AI model stability on production applications.",
    },
  ],
});

console.log(proCompletion.choices[0].message.content);

```

### Using the New Gemma Model

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gemma-3n-e2b-it",
    messages=[
        {
            "role": "user",
            "content": "Write a detailed explanation of machine learning concepts for beginners.",
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
  model: "gemma-3n-e2b-it",
  messages: [
    {
      role: "user",
      content:
        "Write a detailed explanation of machine learning concepts for beginners.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

## Related Links

- [Gemini 2.5 Flash Documentation](en/models/gemini-2.5-flash.md)
- [Gemini 2.5 Pro Documentation](en/models/gemini-2.5-pro.md)
- [Gemma 3n E2B IT Documentation](en/models/gemma-3n-e2b-it.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [API Reference](en/api-reference/introduction.md)