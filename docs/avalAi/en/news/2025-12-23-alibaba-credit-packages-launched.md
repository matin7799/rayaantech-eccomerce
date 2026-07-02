# Alibaba Credit Packages Now Available

**Date:** 2025-12-23 / (1404-10-02)

## Summary

AvalAI introduces Alibaba Credit Packages, a new series of cost-saving bundles designed for users of Alibaba's Qwen AI models. These packages offer 20-30% discounts across 34 Qwen models, with flexible daily, weekly, and monthly options to match your usage patterns.

---

## Details

### Introducing Alibaba Credit Packages

We announce the launch of Alibaba Credit Packages, AvalAI's special offer to reduce costs of AI API services. These packages provide significant discounts on Alibaba's comprehensive Qwen model family, covering text generation, coding, vision, image generation, translation, and embedding models.

### Package Overview

Alibaba Credit Packages are available in three duration tiers, each with multiple capacity options:

#### Daily Packages (1 Day Validity)

| Package | Code | Discount | Payment | Credit Value | Extra Credit |
|---------|------|----------|---------|--------------|--------------|
| Daily Alibaba Basic | `d-a3550s` | 30% | 350,000 IRT | 500,000 IRT | +42.9% |
| Daily Alibaba Professional | `d-a7010m` | 30% | 700,000 IRT | 1,000,000 IRT | +42.9% |
| Daily Alibaba Enterprise | `d-a3550l` | 30% | 3,500,000 IRT | 5,000,000 IRT | +42.9% |

#### Weekly Packages (7 Days Validity)

| Package | Code | Discount | Payment | Credit Value | Extra Credit |
|---------|------|----------|---------|--------------|--------------|
| Weekly Alibaba Basic | `w-a1620s` | 20% | 1,600,000 IRT | 2,000,000 IRT | +25% |
| Weekly Alibaba Professional | `w-a4050m` | 20% | 4,000,000 IRT | 5,000,000 IRT | +25% |
| Weekly Alibaba Enterprise | `w-a8010l` | 20% | 8,000,000 IRT | 10,000,000 IRT | +25% |

#### Monthly Packages (30 Days Validity)

| Package | Code | Discount | Payment | Credit Value | Extra Credit |
|---------|------|----------|---------|--------------|--------------|
| Monthly Alibaba Enterprise | `m-a5062l` | 20% | 50,000,000 IRT | 62,500,000 IRT | +25% |

### Covered Models

These packages cover 34 Alibaba Qwen models across multiple categories:

#### Text Generation Models
- `qwen3-max` - Flagship model with advanced capabilities
- `qwen3-235b-a22b` - Large-scale model for complex tasks
- `qwen3-235b-a22b-instruct-2507` - Instruction-tuned variant
- `qwen3-32b` - High-performance balanced model
- `qwen3-30b-a3b` - Efficient large model
- `qwen3-30b-a3b-instruct-2507` - Instruction-optimized
- `qwen3-14b` - Mid-range model
- `qwen3-8b` - Efficient smaller model
- `qwen3-4b` - Lightweight model
- `qwen-max` - Premium model
- `qwen-max-latest` - Latest premium version
- `qwen-plus` - Enhanced standard model
- `qwen-flash` - Fast inference model

#### Reasoning & Thinking Models
- `qwen3-next-80b-a3b-thinking` - Advanced reasoning capabilities
- `qwen3-235b-a22b-thinking-250` - Deep thinking variant
- `qwen3-30b-a3b-thinking-2507` - Reasoning-focused
- `qvq-max` - Visual question answering with reasoning
- `qvq-max-latest` - Latest VQA reasoning model

#### Coding Models
- `qwen3-coder-flash` - Fast code generation
- `qwen3-coder-plus` - Enhanced coding capabilities
- `qwen3-coder-480b-a35b-instruct` - Large-scale coding model
- `qwen3-next-80b-a3b-instruct` - Instruction-following for code

#### Vision Models
- `qwen3-vl-32b-instruct` - Vision-language understanding
- `qwen3-vl-flash` - Fast vision processing
- `qwen3-vl-plus` - Enhanced vision capabilities

#### Image Generation Models
- `qwen-image-edit` - Image editing
- `qwen-image-plus` - Advanced image generation
- `qwen-image-edit-plus` - Enhanced image editing

#### Translation Models
- `qwen-mt-flash` - Fast machine translation
- `qwen-mt-lite` - Lightweight translation
- `qwen-mt-plus` - Premium translation

#### Embedding Models
- `text-embedding-v4` - Latest text embedding
- `text-embedding-v3` - Stable embedding model

### Key Benefits

#### Cost Savings
- **Daily packages**: 30% discount with 42.9% extra credit value
- **Weekly packages**: 20% discount with 25% extra credit value
- **Monthly packages**: 20% discount with 25% extra credit value

#### Flexibility
- Choose packages based on your usage intensity
- Daily packages for testing or burst usage
- Weekly packages for regular development
- Monthly packages for enterprise-scale operations

#### Comprehensive Model Coverage
- Access to 34 Qwen models with a single package
- Covers text, code, vision, image, translation, and embeddings
- Latest models including Qwen3 series

### How Credit Packages Work

1. **Purchase**: Select your preferred package from the [AvalAI Billing Packages](https://chat.avalai.ir/platform/billing/packages) page
2. **Activation**: Credits are immediately added to your account upon purchase
3. **Usage**: Package credits are automatically applied when using covered models
4. **Priority**: Package credits are consumed before your general balance
5. **Expiration**: Unused credits expire at the end of the validity period

### Important Requirements

> **⚠️ Account Balance Requirement**
>
> Your general account balance must remain positive for credit packages to function. Maintain at least 0.2 UNIT in your general balance to ensure uninterrupted service.

> **⚠️ Flex Service Tier Exclusion**
>
> Credit packages do NOT cover Flex Service Tier costs. When using `service_tier: "flex"`, costs are charged to your standard balance.

### Usage Limits

- Maximum 1 active package per user for each package type
- Credits are non-refundable and non-transferable
- Packages cannot be extended after expiration

### Example: Using Qwen3-Max with Credit Package

```bash
curl -i https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3-max",
    "messages": [
      {
        "role": "user",
        "content": "Hi!"
      }
    ]
  }'
```

### Output

```json
HTTP/2 200
date: Tue, 23 Dec 2025 09:36:01 GMT
content-type: application/json
content-length: 803
x-ratelimit-limit-requests: 750
x-ratelimit-remaining-requests: 743
x-ratelimit-limit-tokens: 2000000
x-ratelimit-remaining-tokens: 1999962
x-ratelimit-reset-requests: 1s
x-ratelimit-reset-tokens: 1s
x-request-id: 019b4a90-bfed-7cc1-97c1-7abcc10e7e75
{
  "id": "chatcmpl-a69e8987-4265-9bc6-8db9-612c6590eb88",
  "created": 1766482561,
  "model": "qwen3-max",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Hello! How can I help you today? 😊",
        "role": "assistant",
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 11,
    "prompt_tokens": 10,
    "total_tokens": 21,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": 0,
      "text_tokens": null,
      "image_tokens": null
    }
  },
  "service_tier": "standard",
  "estimated_cost": {
    "unit": "0.0000780000",
    "irt": 10.35,
    "exchange_rate": 132700
  }
}
```

### Tracking Credit Package Usage with Transaction Lookup

You can verify that your credit package was used and track detailed cost information using the [Transaction Lookup API](en/api-reference/user.md). Use the `x-request-id` header from the response to retrieve complete transaction details.

#### Transaction Lookup Request

```bash
curl https://api.avalai.ir/user/v1/transactions/lookup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "transaction_ids": ["019b4a90-bfed-7cc1-97c1-7abcc10e7e75"]
  }'
```

#### Transaction Lookup Response

```json
{
  "transactions": [
    {
      "id": "019b4a90-bfed-7cc1-97c1-7abcc10e7e75",
      "created_at": "2025-12-23T09:36:03.740Z",
      "requested_at": "2025-12-23T09:35:58.965Z",
      "safety_identifier": null,
      "model": "qwen3-max",
      "provider": "dashscope",
      "service_tier": "standard",
      "status_code": 200,
      "stream": false,
      "tokens": {
        "total": 21,
        "prompt": 10,
        "completion": 11,
        "reasoning": 0,
        "cached": 0,
        "prompt_details": {
          "text_tokens": 10,
          "audio_tokens": 0,
          "image_tokens": 0,
          "cached_tokens": 0,
          "audio_input_duration": 0,
          "cache_creation_tokens": 0
        },
        "completion_details": {
          "text_tokens": 11,
          "audio_tokens": 0,
          "image_tokens": 0,
          "reasoning_tokens": 0,
          "audio_output_duration": 0,
          "accepted_prediction_tokens": 0,
          "rejected_prediction_tokens": 0
        }
      },
      "ip_address": "127.0.0.1",
      "tools": {},
      "api_key_suffix": "...9dg7",
      "cost": {
        "unit": "0.00007800",
        "paid_unit": "0.00007800",
        "paid_irt": "0",
        "paid_grant_irt": "10.35",
        "source": "credit_package",
        "currency": "UNIT"
      },
      "grants": [],
      "packages": [
        {
          "id": "7794",
          "template_id": "d-a3550s",
          "name": "منتخب Alibaba روزانه پایه",
          "amount_irt": "500000.00",
          "remaining_irt": "499507.15",
          "allowed_services": [
            "api"
          ],
          "scope_details": {
            "api": [
              "qwen3-max",
              "qwen3-next-80b-a3b-thinking",
              "qwen3-next-80b-a3b-instruct",
              "qwen3-coder-flash",
              "qwen3-coder-plus",
              "qwen3-coder-480b-a35b-instruct",
              "qwen3-235b-a22b-instruct-2507",
              "qwen3-235b-a22b-thinking-250",
              "qwen3-235b-a22b",
              "qwen3-32b",
              "qwen3-30b-a3b",
              "qwen3-30b-a3b-instruct-2507",
              "qwen3-30b-a3b-thinking-2507",
              "qwen3-14b",
              "qwen3-8b",
              "qwen3-4b",
              "qwen3-vl-32b-instruct",
              "qwen3-vl-flash",
              "qwen3-vl-plus",
              "qwen-flash",
              "qwen-plus",
              "qwen-image-edit",
              "qwen-image-plus",
              "qwen-image-edit-plus",
              "qwen-mt-flash",
              "qwen-mt-lite",
              "qwen-mt-plus",
              "qwen-max",
              "qwen-max-latest",
              "qwen-plus",
              "qvq-max",
              "qvq-max-latest",
              "text-embedding-v4",
              "text-embedding-v3"
            ]
          },
          "end_date": "2025-12-24T09:24:02.705Z"
        }
      ]
    }
  ],
  "summary": {
    "requested": 1,
    "found": 1,
    "not_found_ids": []
  }
}
```

#### Understanding the Response

The transaction lookup response provides detailed information about credit package usage:

- **`cost.source`**: Shows `"credit_package"` confirming the request was paid from your package
- **`cost.paid_grant_irt`**: The amount deducted from your credit package (10.35 IRT in this example)
- **`cost.paid_irt`**: Amount paid from general balance (0 when using credit package)
- **`packages`**: Details of the active credit package used, including:
  - `template_id`: Package code (e.g., `d-a3550s`)
  - `remaining_irt`: Remaining balance in the package
  - `scope_details.api`: List of covered models
  - `end_date`: Package expiration timestamp

This allows you to track exactly how your credit packages are being consumed and monitor remaining balances.

> **Tip**: For resellers and enterprise users, see the [Cost Tracking Guide](en/resellers/cost-tracking-guide.md) for advanced usage monitoring and reporting.

When you have an active Alibaba Credit Package, your requests will automatically use package credits at the discounted rate.

---

## Related Links

- [Credit Packages Documentation](en/credit-packages.md) - Complete guide to all credit packages
- [User API Reference](en/api-reference/user.md) - Transaction lookup and account management
- [Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Track costs and usage for resellers
- [Pricing Overview](en/pricing.md) - Standard pricing and rate information
- [Purchase Packages](https://chat.avalai.ir/platform/billing/packages) - Browse and purchase packages
- [Alibaba Models Documentation](en/models/qwen3-14b.md) - Qwen model details