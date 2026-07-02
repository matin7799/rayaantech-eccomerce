# AvalAI API Content Policy and Safeguards

> **📞 Support & Feedback**
>
> Need help or found an issue with this documentation? Contact our support team on Telegram: [t.me/AvalAISupport](https://t.me/AvalAISupport)
>
> We're here to assist with technical questions, billing inquiries, and documentation improvements.

At AvalAI, we are committed to ensuring the highest standards of privacy and security for all data processed through our API services. This document outlines our strict policies regarding the handling of content submitted via API calls.

In the emerging era of AI, users' private data is exponentially more exposed. While leveraging high-tech AI services often necessitates interacting with external services, we recognize the critical need to minimize the risk of privacy violations and prevent catastrophic outcomes from black-swan events such as system compromises, cyberattacks, and potential hackings. Therefore, we have chosen a zero-retention policy for API call content to eliminate the risk of potential user data leaks, even in worst-case scenarios like unauthorized access or breaches.

## No Content Collection, Storage, or Usage from API Calls

**AvalAI maintains a zero-retention policy for the content of your API calls.** This means that we **do not collect, store, or use any private user data from the body of your API requests.** This includes, but is not limited to:

*   **Prompts:** Text inputs provided to our models.
*   **Messages:** Conversational turns in chat completions.
*   **Audio Data:** Voice inputs for transcription or speech-to-text services.
*   **Image Data:** Visual inputs for image analysis or generation.
*   **Any other content** that constitutes the body of your API call.

Your sensitive data remains private and is processed in real-time without being logged or stored on our systems for any purpose beyond the immediate response generation.

## Data Used for Billing and Safety

To ensure fair pricing calculations and maintain the safety and security of our API services, we **only store minimal, non-private API call history.** This limited data includes:

*   **Model Name:** The specific AI model used for a request.
*   **IP Address:** For security and abuse prevention.
*   **Timestamp:** When the API call occurred.
*   **Usage Metrics:** Such as token counts for billing purposes.

This information is strictly used for operational necessities like billing, rate limiting, and detecting potential misuse, and **never for interacting with, analyzing, or exploiting your private content.**

## Disclaimer Regarding Third-Party Providers

It is crucial to understand that AvalAI acts as a gateway, redirecting your API calls to the original AI model providers. **AvalAI is solely responsible for the scope of its own service, and we have no control over the privacy practices or data handling policies of these third-party providers.**

Users are strongly advised to carefully review the privacy policies and terms of service of the original providers for any model they choose to use. For instance:

*   If you are using a `gpt-5.4` model, your API call is being made to **OpenAI**.
*   If you are using a `gemini-2.5-pro` model, your API call is being made to **Google Gemini AI Studio**.
*   And so on for other models and their respective providers.

Your understanding of their policies is essential for ensuring your data privacy.

## Commitment to User Privacy
 
Our commitment to user privacy extends across all AvalAI services. For our chat platform, we offer granular control over data usage through settings like "Help improve model," which is disabled by default. However, for our API services, our privacy measures are even more stringent, ensuring **no interaction with the content of your API calls whatsoever.**
 
We believe in empowering our users with powerful AI tools while upholding the highest standards of data protection. Your trust is paramount, and our API content policy reflects this core value.