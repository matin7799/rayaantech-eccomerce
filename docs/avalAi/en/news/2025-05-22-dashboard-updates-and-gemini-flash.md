# New Dashboard Features and Gemini 2.5 Flash Update

**Date:** 2025-05-22 / (1404-03-01)

## Summary

We're excited to announce significant updates to the AvalAI platform, including new security Guardrails for protecting sensitive information in API calls, user dashboard features for custom credit alert thresholds and notification management, plus the latest Gemini 2.5 Flash model update with improved performance and new capabilities.

---

## Details

### Dashboard Improvements

#### Custom Credit Alert Thresholds

We've enhanced the user dashboard with the ability to set custom credit alert thresholds. This feature allows you to:

- Define personalized notification thresholds for your credit balance
- Receive timely alerts when your credits reach specified levels
- Choose from default thresholds or set your own custom values

Previously, users were limited to predefined threshold values. Now, you can specify exact credit amounts that are meaningful for your usage patterns and budget planning.

The dashboard now includes the following default threshold options:

- 1.00 units
- 5.00 units
- 20.00 units
- 50.00 units

Or you can set your own custom thresholds that match your specific needs.

#### Additional Alert Recipients

For Tier 5 users, we've added the ability to specify up to two additional recipients for credit alert notifications:

- Add up to 2 additional email addresses
- Add up to 2 additional phone numbers
- Ensure your team stays informed about credit usage

This feature helps teams better manage their credit usage by keeping relevant stakeholders informed about credit balances without requiring them to log into the dashboard.

### New Security Guardrails

At AvalAI, we put security above all. We're proud to introduce our new Guardrails system that helps protect your API calls by automatically detecting and redacting sensitive information like API keys and tokens:

- **Automatic Detection**: All API calls can be processed through our detect-secrets system
- **Sensitive Data Protection**: API keys, tokens, and other sensitive information are replaced with [REDACTED]
- **No Sensitive Logs**: The process leaves no logs of the sensitive data being cleaned

#### How It Works

Our guardrail system implements [Yelp/detect-secrets](https://github.com/Yelp/detect-secrets), an open-source project specifically designed to detect and clean sensitive data in your API calls. When the system detects sensitive information, it automatically replaces it with [REDACTED] before the request reaches the LLM models, providing an additional layer of security for your data.

#### Activation Options

You can activate Guardrails in two ways:

1. **User-level activation**: Enable in your user settings to automatically scan and protect all API calls
2. **Per-request activation**: Include `guardrails: ["hide-secrets"]` in your API request data for specific calls

#### Example

```json
// Original request with sensitive data

{
  "messages": [
    {
      "role": "user",
      "content": "what is the value of my api key? api_key=sk-8nasdnAUna9nasndania"
    }
  ],
  "guardrails": ["hide-secrets"]
}
// Request after Guardrail processing

{
  "messages": [
    {
      "role": "user",
      "content": "what is the value of my api key? api_key=[REDACTED]"
    }
  ],
  "guardrails": ["hide-secrets"]
}
```

While our guardrail system provides significant protection, we still recommend following security best practices and avoiding sending sensitive information in your API calls whenever possible. We plan to enhance this system with more advanced security measures and customization options in future updates.

### Gemini 2.5 Flash Update

Google has released an update to their `gemini-2.5-flash` model, which is now available through the AvalAI platform. This update includes:

#### Performance Improvements

- 20-30% reduction in token usage in evaluations
- Improved efficiency while maintaining high-quality outputs
- Better performance across key benchmarks for reasoning, multimodality, code, and long context

#### New Capabilities

- **Native Audio Output**: Create more natural and expressive conversational experiences with native audio dialogue
- **Text-to-Speech**: Support for multiple speakers with the ability to capture subtle nuances in over 24 languages
- **Enhanced Security**: Significant improvements in protection against security threats like indirect prompt injections
- **Computer Use**: Integration with Project Mariner's computer use capabilities

#### Developer Experience Enhancements

- **Thought Summaries**: More structured, streamlined format of the model's thinking process for easier debugging
- **Thinking Budgets**: Extended to 2.5 Pro, giving developers more control over cost by balancing latency and quality

The updated Gemini 2.5 Flash is now available for preview in Google AI Studio for developers, in Vertex AI for enterprise, and in the Gemini app for everyone. It will be generally available for production in early June.

### Code Examples

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using the updated Gemini 2.5 Flash model
completion = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Write a short poem about artificial intelligence.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Using the updated Gemini 2.5 Flash model
const completion = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: "Write a short poem about artificial intelligence.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

## Related Links

- [Safety Best Practices](en/guides/safety-best-practices)
- [Gemini Documentation](en/providers/google.md)
- [Notification Preferences](https://chat.avalai.ir/platform/billing/credit)
