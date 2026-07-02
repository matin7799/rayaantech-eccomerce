# Credit Packages: Save Up to 70% on AI Model Usage

**Date:** 2025-07-07 / (1404-04-16)

## Summary

AvalAI introduces Credit Packages - pre-paid bundles that offer significant cost savings on AI model usage. Get 20-70% more credits than what you pay for, with packages tailored for specific model families and use cases.

---

## Details

We're excited to announce the launch of **Credit Packages**, a new billing feature designed to help you save significantly on AI model costs while accessing premium models at discounted rates.

### What are Credit Packages?

Credit Packages are specialized pre-paid bundles that give you more credits than what you pay for, with restrictions on which models you can use. This innovative approach allows us to offer substantial discounts while ensuring optimal resource allocation.

**Key Benefits:**
- **Significant Savings**: Get 20-70% more credits than your payment amount
- **Premium Model Access**: Access to high-end models like Claude 3.5 Sonnet, GPT-4, and O1 at reduced rates
- **Flexible Options**: Various packages for different budgets and use cases
- **Transparent Pricing**: Clear value ratios and model restrictions

### Featured Launch Packages

#### وایب کُدر هفتگی سازمانی (Weekly Organizational Coding)
- **Value**: Pay 4,000,000 IRT → Get 5,000,000 IRT (25% bonus)
- **Discount**: 20% off premium coding models
- **Duration**: 7 days validity
- **Models**: Claude 3.5 Sonnet, GPT-4, O1, O3, Gemini 2.5 Pro
- **Perfect for**: Development teams and coding-intensive projects

#### مدل‌های زبانی منتخب OpenAI روزانه پایه (Daily OpenAI Base)
- **Value**: Pay 300,000 IRT → Get 500,000 IRT (66.7% bonus)
- **Discount**: 40% off selected OpenAI models
- **Duration**: 1 day validity
- **Models**: GPT-4 Mini, O3 Mini, O1 Mini + 7 additional OpenAI models
- **Perfect for**: Testing and short-term projects

#### مدل‌های زبانی منتخب OpenAI هفتگی پایه (Weekly OpenAI Base)
- **Value**: Pay 1,400,000 IRT → Get 2,000,000 IRT (42.9% bonus)
- **Discount**: 30% off selected OpenAI models
- **Duration**: 7 days validity
- **Models**: GPT-4 Mini, O3 Mini, O1 Mini + 7 additional OpenAI models
- **Perfect for**: Regular OpenAI model users

### How Credit Packages Work

1. **Purchase**: Select your desired package from our marketplace
2. **Verification**: Complete OTP verification for secure purchase
3. **Automatic Application**: Credits are applied automatically to authorized models
4. **Usage Tracking**: Monitor your package usage in real-time through the dashboard

### Package Scopes and Restrictions

Credit packages are designed with specific scopes to ensure optimal pricing:

- **API Service Focus**: All current packages target API usage

**Important**: Credits can only be used with authorized models within each package scope. Usage outside the scope will be charged at standard rates.

### Getting Started

```language-selector
python=:# Check your credit packages via API
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Use models covered by your credit packages
response = client.chat.completions.create(
    model="gpt-4o",  # Covered by OpenAI packages
    messages=[{"role": "user", "content": "Explain quantum computing"}],
)

print(response.choices[0].message.content)

javascript=:// Use credit package models with JavaScript
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "claude-3-5-sonnet-20241022", // Covered by coding packages
  messages: [
    { role: "user", content: "Write a Python function to sort a list" },
  ],
});

console.log(response.choices[0].message.content);

bash=:# Purchase and use credit packages
curl -X POST "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'

```

### Important Terms

- **Non-Refundable**: Credit packages cannot be refunded once purchased
- **Fixed Validity**: Each package has a predetermined expiration period
- **Account Bound**: Packages are tied to the purchasing account
- **Automatic Expiration**: Unused credits are removed when packages expire

### Availability

Credit packages are now available through the [AvalAI Platform](https://chat.avalai.ir/platform/billing/packages). Browse available packages, compare value ratios, and purchase with secure payment methods including bank cards and existing credit balance.

---

## Related Links

- [Credit Packages Documentation](en/credit-packages.md) - Complete guide to credit packages
- [Pricing Overview](en/pricing.md) - Standard pricing and rate information
- [API Authentication](en/api-reference/authentication.md) - Setting up API access
- [Live Package Marketplace](https://chat.avalai.ir/platform/billing/packages) - Browse and purchase packages
- [Billing Support](https://avalai.ir/contact-us-avalai) - Contact support for billing questions