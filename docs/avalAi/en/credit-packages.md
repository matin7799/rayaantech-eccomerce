# Credit Packages

> **📞 Support & Feedback**
>
> Need help or found an issue with this documentation? Contact our support team on Telegram: [t.me/AvalAISupport](https://t.me/AvalAISupport)
>
> We're here to assist with technical questions, billing inquiries, and documentation improvements.

AvalAI Credit Packages are pre-paid bundles that offer significant cost savings on AI model usage. These packages provide discounted credits with specific model scopes and validity periods, helping you optimize your AI spending while accessing premium models at reduced rates.

## 📋 Choosing the Right Option

> **💡 For New Users**
>
> If you're just getting started with AvalAI, **you don't need to purchase credit packages**. The best way to begin is by topping up your default credit balance and using the services directly. This approach provides complete flexibility in model selection and no time restrictions.

> **🏢 For Professional and Enterprise Users**
>
> Credit packages are designed for professional and enterprise users who:
> - Have predictable and consistent usage patterns
> - Frequently use specific models
> - Want to benefit from significant discounts
> - Can utilize credits within limited time periods
>
> **Note**: Credit packages come with time limitations (1-7 days) and specific service scope restrictions.

> **⚠️ Critical Balance Requirement**
>
> To utilize credit packages effectively, your **general account balance (default credit) must remain positive**. **API services will be automatically deactivated if the general balance reaches zero or becomes negative**.
>
> **Strong Recommendation**: Maintain a minimum balance of **1.0 UNIT** in your general account balance to ensure uninterrupted service and proper functioning of credit packages.

> **⚠️ Flex Service Tier Exclusion**
>
> Credit packages do **NOT** cover [Flex Service Tier](en/pricing.md#flex-service-tier) costs. When using `service_tier: "flex"` in your API requests, costs are charged to your standard account balance, not deducted from credit package allocations. Credit packages only apply to **standard service tier** usage.

## What are Credit Packages?

Credit Packages are specialized billing products that give you more credits than what you pay for, with restrictions on which models you can use. For example, you might pay 350,000 IRT but receive 500,000 IRT worth of credits (25% bonus) that can only be used with specific AI models for a limited time period.

### Key Benefits

- **Cost Savings**: Get 20-70% more credits than your payment amount
- **Model Access**: Access to premium models at discounted rates
- **Flexible Options**: Various packages for different use cases and budgets
- **Transparent Pricing**: Clear value ratios and model restrictions

## How Credit Packages Work

### Package Structure

Each credit package includes:

- **Payment Amount**: What you actually pay (e.g., 350,000 IRT)
- **Credit Value**: Total credits you receive (e.g., 500,000 IRT)
- **Value Ratio**: Bonus percentage (e.g., 25% more credits)
- **Package Scope**: Specific models or services covered
- **Validity Period**: How long the package remains active
- **Usage Limits**: Maximum purchases per user

### Package Scopes

Credit packages are restricted to specific scopes and models:

- **API Service**: All packages currently focus on API usage (not subscription services)

### Validity and Expiration

- Packages have fixed validity periods (1-7 days typically)
- Credits expire automatically when the validity period ends
- **Non-refundable**: Expired or unused credits cannot be refunded
- **Non-transferable**: Credits cannot be moved between accounts

## Available Package Types

### Gemini Packages

> **⚠️ Temporarily Unavailable**
>
> Gemini packages are currently temporarily unavailable. We will announce when they become available again.

#### Daily Gemini Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">40% off</span><span class="pkg-card-name">Daily Gemini Basic</span><div class="pkg-card-row"><span>Pay</span><strong>300,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>500,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">40% off</span><span class="pkg-card-name">Daily Gemini Professional</span><div class="pkg-card-row"><span>Pay</span><strong>600,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>1,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Gemini Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>3,500,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
</div>

#### Weekly Gemini Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Weekly Gemini Basic</span><div class="pkg-card-row"><span>Pay</span><strong>1,400,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>2,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Weekly Gemini Professional</span><div class="pkg-card-row"><span>Pay</span><strong>3,500,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Weekly Gemini Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>7,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>10,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
</div>

#### Monthly Gemini Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">29% off</span><span class="pkg-card-name">Monthly Gemini Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>50,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>70,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 30 days</span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (Gemini)</summary>

- `gemini-2.5-flash-image`
- `gemini-2.5-pro`
- `gemini-2.5-flash`
- `gemini-2.5-flash-lite`
- `gemini-flash-latest`
- `gemini-flash-lite-latest`
- `gemini-2.5-flash-image-preview`
- `gemini-2.5-flash-lite-preview-09-2025`
- `gemini-2.5-flash-preview-09-2025`
- `gemini-2.0-flash`
- `gemini-2.0-flash-lite`

</details>

### Vibe Coder Packages

#### Daily Vibe Coder Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Vibe Coder Basic</span><div class="pkg-card-row"><span>Pay</span><strong>350,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>500,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Vibe Coder Professional</span><div class="pkg-card-row"><span>Pay</span><strong>1,400,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>2,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Vibe Coder Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>3,500,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
</div>

#### Weekly Vibe Coder Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Vibe Coder Basic</span><div class="pkg-card-row"><span>Pay</span><strong>800,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>1,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Vibe Coder Professional</span><div class="pkg-card-row"><span>Pay</span><strong>1,600,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>2,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Vibe Coder Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>4,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (Vibe Coder)</summary>

- `gpt-5.4-pro`
- `claude-opus-4-5`
- `claude-sonnet-4-5`
- `claude-haiku-4-5`
- `gpt-5.4`
- `o4-mini`
- `o3-mini`
- `anthropic.claude-opus-4-5-20251101-v1:0`
- `anthropic.claude-haiku-4-5-20251001-v1:0`
- `anthropic.claude-sonnet-4-5-20250929-v1:0`

</details>

### OpenAI Packages

#### Daily OpenAI Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">40% off</span><span class="pkg-card-name">Daily OpenAI Basic</span><div class="pkg-card-row"><span>Pay</span><strong>300,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>500,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">40% off</span><span class="pkg-card-name">Daily OpenAI Professional</span><div class="pkg-card-row"><span>Pay</span><strong>600,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>1,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily OpenAI Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>3,500,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
</div>

#### Weekly OpenAI Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Weekly OpenAI Basic</span><div class="pkg-card-row"><span>Pay</span><strong>1,400,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>2,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Weekly OpenAI Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>7,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>10,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
</div>

#### Monthly OpenAI Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">29% off</span><span class="pkg-card-name">Monthly OpenAI Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>50,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>70,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 30 days</span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (OpenAI)</summary>

- `gpt-5.4`
- `gpt-5.4-mini`
- `gpt-5.4-nano`
- `gpt-5.2-chat`
- `gpt-5.1-chat`
- `gpt-5-chat`
- `gpt-5-mini`
- `gpt-5-nano`
- `o4-mini`
- `o3-mini`
- `gpt-4.1`
- `gpt-4.1-mini`
- `gpt-4.1-nano`
- `gpt-4o-transcribe`
- `gpt-4o-mini-transcribe`
- `gpt-4o-mini-tts`

</details>

### Claude (Anthropic) Packages

#### Daily Claude Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Claude Basic</span><div class="pkg-card-row"><span>Pay</span><strong>350,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>500,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Claude Professional</span><div class="pkg-card-row"><span>Pay</span><strong>700,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>1,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Claude Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>3,500,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day</span></div>
</div>

#### Weekly Claude Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Claude Basic</span><div class="pkg-card-row"><span>Pay</span><strong>1,600,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>2,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Claude Professional</span><div class="pkg-card-row"><span>Pay</span><strong>4,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Claude Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>8,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>10,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days</span></div>
</div>

#### Monthly Claude Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Monthly Claude Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>50,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>62,500,000 IRT</strong></div><span class="pkg-card-validity">Valid 30 days</span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (Claude / Anthropic)</summary>

- `claude-opus-4-5`
- `claude-opus-4-1`
- `claude-sonnet-4-5`
- `claude-haiku-4-5`
- `anthropic.claude-opus-4-1-20250805-v1:0`
- `anthropic.claude-sonnet-4-5-20250929-v1:0`
- `anthropic.claude-haiku-4-5-20251001-v1:0`
- `anthropic.claude-opus-4-20250514-v1:0`
- `anthropic.claude-sonnet-4-20250514-v1:0`
- `anthropic.claude-3-7-sonnet-20250219-v1:0`

</details>

### Alibaba Packages

#### Daily Alibaba Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Alibaba Basic</span><div class="pkg-card-row"><span>Pay</span><strong>350,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>500,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day · <code>d-a3550s</code></span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Alibaba Professional</span><div class="pkg-card-row"><span>Pay</span><strong>700,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>1,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day · <code>d-a7010m</code></span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">30% off</span><span class="pkg-card-name">Daily Alibaba Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>3,500,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 1 day · <code>d-a3550l</code></span></div>
</div>

#### Weekly Alibaba Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Alibaba Basic</span><div class="pkg-card-row"><span>Pay</span><strong>1,600,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>2,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days · <code>w-a1620s</code></span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Alibaba Professional</span><div class="pkg-card-row"><span>Pay</span><strong>4,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>5,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days · <code>w-a4050m</code></span></div>
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Weekly Alibaba Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>8,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>10,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 7 days · <code>w-a8010l</code></span></div>
</div>

#### Monthly Alibaba Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Monthly Alibaba Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>50,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>62,500,000 IRT</strong></div><span class="pkg-card-validity">Valid 30 days · <code>m-a5062l</code></span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (Alibaba)</summary>

- `qwen3-max`
- `qwen3-next-80b-a3b-thinking`
- `qwen3-next-80b-a3b-instruct`
- `qwen3-coder-flash`
- `qwen3-coder-plus`
- `qwen3-coder-480b-a35b-instruct`
- `qwen3-235b-a22b-instruct-2507`
- `qwen3-235b-a22b-thinking-250`
- `qwen3-235b-a22b`
- `qwen3-32b`
- `qwen3-30b-a3b`
- `qwen3-30b-a3b-instruct-2507`
- `qwen3-30b-a3b-thinking-2507`
- `qwen3-14b`
- `qwen3-8b`
- `qwen3-4b`
- `qwen3-vl-32b-instruct`
- `qwen3-vl-flash`
- `qwen3-vl-plus`
- `qwen-flash`
- `qwen-plus`
- `qwen-image-edit`
- `qwen-image-plus`
- `qwen-image-edit-plus`
- `qwen-mt-flash`
- `qwen-mt-lite`
- `qwen-mt-plus`
- `qwen-max`
- `qwen-max-latest`
- `qvq-max`
- `qvq-max-latest`
- `text-embedding-v4`
- `text-embedding-v3`

</details>

**Important Note**: All packages have a limit of 1 active unique package per user.

### Web Search Packages

#### Monthly Web Search Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">20% off</span><span class="pkg-card-name">Monthly Web Search Enterprise</span><div class="pkg-card-row"><span>Pay</span><strong>50,000,000 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>62,500,000 IRT</strong></div><span class="pkg-card-validity">Valid 30 days · <code>m-ws5062l</code></span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (Web Search)</summary>

- `perplexity-search`
- `google_pse-search`

</details>

**Important Note**: All packages have a limit of 1 active unique package per user.

### Special Enterprise Packages

#### Monthly Special Enterprise Packages

<div class="pkg-grid">
  <div class="pkg-card"><span class="doc-badge doc-badge--discount">10% bonus</span><span class="pkg-card-name">Monthly Special Enterprise XL</span><div class="pkg-card-row"><span>Pay</span><strong>999,999,999 IRT</strong></div><div class="pkg-card-row"><span>Receive</span><strong>1,100,000,000 IRT</strong></div><span class="pkg-card-validity">Valid 31 days · <code>m-s1011xl</code></span></div>
</div>

<details class="doc-collapse">
<summary>Covered Models (Special Enterprise)</summary>

- `gemini-2.5-flash-image`
- `gemini-2.5-pro`
- `gemini-2.5-flash`
- `gemini-2.5-flash-lite`
- `gemini-2.5-flash-image-preview`
- `gemini-2.0-flash`
- `gemini-2.0-flash-lite`
- `gpt-5-chat`
- `gpt-5-mini`
- `gpt-5-nano`
- `o4-mini`
- `o3-mini`
- `gpt-4.1`
- `gpt-4.1-mini`
- `gpt-4.1-nano`
- `gpt-4o`
- `gpt-4o-mini`
- `gpt-4o-transcribe`
- `gpt-4o-mini-transcribe`
- `gpt-4o-mini-tts`
- `perplexity-search`
- `google_pse-search`

</details>

**Important Note**: This package has a limit of 2 active packages per user.

### Package Scope Details

**Important**: Each package is exclusively designed for use within its authorized scope. Using services outside the package coverage will be charged at standard rates without discounts.

## Purchasing Credit Packages

### Prerequisites

- **Authentication Required**: You must be logged in to purchase packages
- **Payment Methods**: Bank Card or existing Credit Balance
- **Verification**: OTP verification required for purchases

### Purchase Process

1. **Browse Packages**: Visit [AvalAI Billing Packages](https://chat.avalai.ir/platform/billing/packages)
2. **Select Package**: Choose your desired package and quantity
3. **Payment Method**: Select Bank Card or Credit Balance
4. **OTP Verification**: Enter the 6-digit code sent to your phone
5. **Confirmation**: Package is added to your account immediately

## Managing Your Credit Packages

### Package Dashboard

Access your packages through the [AvalAI Platform](https://chat.avalai.ir/platform/billing/packages) to:

- View active and expired packages
- Monitor usage statistics
- Check expiration timelines
- Track remaining credits

### Package Status Types

- **Active**: Package is valid and has remaining credits
- **Expired**: Package validity period has ended
- **Exhausted**: All package credits have been used
- **Promotional**: Special discount packages

### Usage Tracking

Monitor your package usage through:

- **Real-time Balance**: Current remaining credits
- **Usage Analytics**: Detailed consumption patterns  
- **Model Breakdown**: Credits used per model
- **Expiration Alerts**: Notifications before packages expire

## Important Terms and Conditions

### Account Balance Requirements

- **Positive Balance Required**: Your general account balance must always remain positive for credit packages to function properly.
- **Automatic Service Deactivation**: If the general balance reaches zero or becomes negative, all API services will be immediately deactivated.
- **Recommended Minimum Balance**: Maintain at least 1.0 UNIT in your general balance to ensure uninterrupted operation.
- **Usage Priority**: Package credits are consumed before general balance, but the general balance must still remain positive.

### Non-Refundable Policy

- **No Refunds**: Credit packages cannot be refunded once purchased
- **No Extensions**: Expired packages cannot have their validity extended
- **No Transfers**: Credits cannot be transferred between accounts or packages

### Expiration Rules

- **Fixed Validity**: Each package has a predetermined validity period
- **Automatic Expiration**: Credits are automatically removed when packages expire
- **No Grace Period**: No additional time is provided after expiration
- **Immediate Effect**: Expiration occurs at the exact end of the validity period

### Usage Limitations

- **Scope Restrictions**: Credits can only be used with authorized models
- **Standard Rate Fallback**: Non-covered models are charged at regular rates
- **Purchase Limits**: Maximum quantity restrictions per user
- **Account Binding**: Packages are tied to the purchasing account

### Model Coverage

Package scope determines which models receive discounted rates:

- **In-Scope Usage**: Discounted rates apply automatically
- **Out-of-Scope Usage**: Standard pricing applies
- **Mixed Usage**: Credits are consumed based on model coverage
- **Priority Order**: Package credits are used before general balance

## Best Practices

### Choosing the Right Package

1. **Analyze Usage Patterns**: Review your typical model usage
2. **Calculate Value**: Compare package savings vs. standard rates
3. **Consider Validity**: Ensure you can use credits within the time limit
4. **Model Requirements**: Verify the package covers your needed models

### Maximizing Value

- **Plan Usage**: Use package credits for high-value models first
- **Monitor Expiration**: Track validity periods closely
- **Batch Processing**: Complete intensive tasks during package validity
- **Model Selection**: Prioritize in-scope models for maximum savings

## Troubleshooting

### Common Issues

**Package Not Appearing**
- Verify payment completion and OTP confirmation
- Check account authentication status
- Contact support if payment was processed but package is missing

**Credits Not Applied**
- Ensure you're using models within the package scope
- Verify package is still within validity period
- Check if package credits are exhausted

**Payment Problems**
- Verify sufficient credit balance for Credit Balance payments
- Ensure bank card has adequate funds for card payments
- Complete OTP verification process

**Sudden Service Interruption**
- If your API services have been deactivated, first check your general account balance
- Ensure your general balance is positive (minimum 1.0 UNIT recommended)
- Services will automatically reactivate after topping up your general balance

### Verifying Credit Package Usage

If you need to verify whether a specific API request used your credit package credits, you can use the Transaction Lookup API or the Dashboard reports.

#### Using Transaction Lookup API

Use the `x-request-id` header from any API response to look up detailed transaction information:

```bash
curl https://api.avalai.ir/user/v1/transactions/lookup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "transaction_ids": ["your-x-request-id-here"]
  }'
```

The response will show exactly how the transaction was charged:

```json
{
  "transactions": [
    {
      "id": "019b4a90-bfed-7cc1-97c1-7abcc10e7e75",
      "model": "qwen3-max",
      "cost": {
        "unit": "0.00007800",
        "paid_unit": "0.00007800",
        "paid_irt": "0",
        "paid_grant_irt": "10.35",
        "source": "credit_package",
        "currency": "UNIT"
      },
      "packages": [
        {
          "id": "7794",
          "template_id": "d-a3550s",
          "name": "Daily Alibaba Basic",
          "remaining_irt": "499507.15",
          "end_date": "2025-12-24T09:24:02.705Z"
        }
      ]
    }
  ]
}
```

**Key fields to check:**

| Field | Description |
|-------|-------------|
| `cost.source` | Shows `"credit_package"` if package was used, `"balance"` if charged to general balance |
| `cost.paid_irt` | Amount charged to general balance (0 if credit package covered the cost) |
| `cost.paid_grant_irt` | Amount deducted from credit package |
| `packages` | Details of the active credit package used |
| `packages[].remaining_irt` | Remaining balance in the credit package |
| `packages[].end_date` | When the credit package expires |

For more details on the Transaction Lookup API, see [User API Reference](en/api-reference/user.md).

#### Using Dashboard Reports

You can also generate comprehensive usage reports through the AvalAI Dashboard:

1. Visit [Usage Reports](https://chat.avalai.ir/platform/usage/reports)
2. Select your desired date range
3. Generate a **CSV report** containing all transaction details
4. The report includes columns for cost source, package information, and billing details

This is useful for:
- Auditing credit package usage over time
- Reconciling monthly billing
- Exporting data for accounting purposes
- Analyzing usage patterns across different models

## Related Resources

- [Pricing Overview](en/pricing.md) - Standard pricing and rate information
- [User API Reference](en/api-reference/user.md) - Transaction lookup and account management
- [Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Detailed cost tracking for resellers and enterprise users
- [API Authentication](en/api-reference/authentication.md) - Setting up API access
- [Rate Limits](en/guides/rate-limits.md) - Understanding usage limits
- [Usage Reports](https://chat.avalai.ir/platform/usage/reports) - Generate CSV reports in dashboard
- [Billing Support](https://avalai.ir/contact-us-avalai) - Contact support for billing issues
- [Marketplace](https://chat.avalai.ir/platform/billing/packages) - Browse and purchase packages