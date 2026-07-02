# Moderation API

The Moderation API helps you identify potentially harmful content in text, allowing you to filter and moderate user-generated content in your applications.

## Endpoint

```
POST https://api.avalai.ir/v1/moderations
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input` | string or array | Yes | The text to classify. Can be a string or an array of strings. |
| `model` | string | No | The moderation model to use. Options include "text-moderation-latest", "text-moderation-007", or "omni-moderation-latest". Default is "text-moderation-latest". |

## Examples

### Basic Moderation Request

```bash
curl https://api.avalai.ir/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "input": "I want to kill them."
}'
```

### Python Example

```python
from openai import OpenAI

client = OpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

response = client.moderations.create(input="I want to kill them.")

# Check if the text is flagged
if response.results[0].flagged:
    print("This content was flagged!")

# Check specific categories
categories = response.results[0].categories
for category, flagged in categories.items():
    if flagged:
        print(f"Content flagged for {category}")
```

### JavaScript Example

```javascript
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.moderations.create({
  input: "I want to kill them.",
});

// Check if the text is flagged
if (response.results[0].flagged) {
  console.log("This content was flagged!");
}

// Check specific categories
const categories = response.results[0].categories;
for (const [category, flagged] of Object.entries(categories)) {
  if (flagged) {
    console.log(`Content flagged for ${category}`);
  }
}
```

### Go Example

```go
package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.Moderations(
		context.Background(),
		openai.ModerationRequest{
			Input: "I want to kill them.",
			Model: openai.ModerationLatest,
		},
	)

	if err != nil {
		fmt.Printf("Moderation error: %v\n", err)
		return
	}

	// Check if the text is flagged
	if resp.Results[0].Flagged {
		fmt.Println("This content was flagged!")
	}

	// Check specific categories
	categories := resp.Results[0].Categories
	if categories.Violence {
		fmt.Println("Content flagged for violence")
	}
}
```

### Batch Processing

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 

You can moderate multiple texts in a single request:

```python
response = client.moderations.create(
    input=[
        "I want to kill them.",
        "The weather is nice today.",
        "I'm going to harm myself.",
    ]
)

# Process each result
for i, result in enumerate(response.results):
    print(f"Text {i+1}: {'Flagged' if result.flagged else 'Not flagged'}")
```

## Response Format

```json
{
  "id": "modr-5MWoLO",
  "model": "text-moderation-007",
  "results": [
    {
      "flagged": true,
      "categories": {
        "sexual": false,
        "hate": false,
        "harassment": false,
        "self-harm": false,
        "sexual/minors": false,
        "hate/threatening": false,
        "violence/graphic": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        "harassment/threatening": false,
        "violence": true
      },
      "category_scores": {
        "sexual": 3.6988e-06,
        "hate": 0.0034766977,
        "harassment": 0.0124246953,
        "self-harm": 2.0235e-06,
        "sexual/minors": 3.01e-08,
        "hate/threatening": 0.0017639078,
        "violence/graphic": 2.49108e-05,
        "self-harm/intent": 5.447e-07,
        "self-harm/instructions": 8.4e-09,
        "harassment/threatening": 0.0058918546,
        "violence": 0.9223177433
      }
    }
  ]
}
```

## Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The unique identifier for the moderation request. |
| `model` | string | The model used for content moderation. |
| `results` | array | An array of moderation results, one for each input. |

### Moderation Result Object

| Parameter | Type | Description |
|-----------|------|-------------|
| `flagged` | boolean | Whether the content violates OpenAI's usage policies. |
| `categories` | object | An object containing boolean values for each category, indicating whether the content violates that category. |
| `category_scores` | object | An object containing numeric scores (0-1) for each category, indicating the confidence level. |

### Categories

| Category | Description |
|----------|-------------|
| `sexual` | Content that refers to sexual activity or arousal |
| `hate` | Content that expresses, incites, or promotes hate based on identity |
| `harassment` | Content that harasses, intimidates, or bullies an individual |
| `self-harm` | Content that promotes, encourages, or depicts acts of self-harm |
| `sexual/minors` | Sexual content that includes minors |
| `hate/threatening` | Hateful content that also includes violence or threats |
| `violence/graphic` | Content that depicts death, violence, or physical injury |
| `self-harm/intent` | Content that expresses intention to engage in self-harm |
| `self-harm/instructions` | Content that provides instructions for engaging in self-harm |
| `harassment/threatening` | Harassment content that also includes violence or threats |
| `violence` | Content that promotes or glorifies violence |

## Available Models

| Model | Description | Pricing |
|-------|-------------|---------|
| text-moderation-latest | Most up-to-date text moderation model | Free |
| text-moderation-007 | Previous generation text moderation model | Free |
| omni-moderation-latest | Moderation model that can handle both text and images | Free |

## Implementation Best Practices

### Content Filtering

Implement a tiered approach to content filtering:

1. **Pre-submission filtering**: Apply client-side filters before sending content to the API
2. **API moderation**: Use the Moderation API for more accurate detection
3. **Human review**: For edge cases, implement human review processes

### Category Thresholds

Customize category score thresholds based on your application's requirements:

```python
def is_content_allowed(result, custom_thresholds=None):
    # Default thresholds
    thresholds = {
        "sexual": 0.5,
        "hate": 0.5,
        "harassment": 0.5,
        "self-harm": 0.5,
        "sexual/minors": 0.1,  # Stricter threshold
        "hate/threatening": 0.5,
        "violence/graphic": 0.5,
        "self-harm/intent": 0.5,
        "self-harm/instructions": 0.5,
        "harassment/threatening": 0.5,
        "violence": 0.5,
    }

    # Apply custom thresholds if provided
    if custom_thresholds:
        thresholds.update(custom_thresholds)

    # Check if any category exceeds its threshold
    for category, threshold in thresholds.items():
        if result.category_scores[category] > threshold:
            return False

    return True
```

### Handling False Positives

To reduce false positives, consider:

1. Using category scores rather than just the `flagged` field
2. Implementing a secondary review for borderline cases
3. Maintaining an allowlist for known safe content that might be flagged

### Batch Processing

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 

For efficiency, batch multiple content items in a single request:

```python
def moderate_batch(texts, batch_size=25):
    results = []

    # Process in batches to avoid hitting request limits
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = client.moderations.create(input=batch)
        results.extend(response.results)

    return results
```

## Error Handling

The API may return various error codes:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Your request is invalid. |
| 401 | Unauthorized - Your API key is wrong. |
| 403 | Forbidden - You don't have permission to access this resource. |
| 404 | Not Found - The specified resource could not be found. |
| 429 | Too Many Requests - You have exceeded your rate limit. |
| 500 | Internal Server Error - We had a problem with our server. |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Content Policy Considerations

When implementing content moderation, consider:

1. **Transparency**: Inform users about your content moderation policies
2. **Appeals process**: Provide a way for users to appeal moderation decisions
3. **Cultural context**: Be aware that content moderation may vary across cultures and regions
4. **Regular updates**: Keep your moderation systems updated as language evolves

## Related Resources

- [Models](en/models/model-details.md) - Learn about available moderation models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits