# Moderation Guide

Use the AvalAI [Moderation API](en/api-reference/moderation.md) to check whether text or image inputs are potentially harmful according to defined content policies. This helps ensure safety and compliance in your applications.

If harmful content is identified, you can take corrective action, like filtering content or flagging user accounts. Access to the moderation endpoint via AvalAI might be free or subject to specific pricing; please check AvalAI's [Pricing page](en/pricing.md).

AvalAI provides access to moderation models, potentially including:

- **`omni-moderation-latest` (Recommended):** Supports more categories and multi-modal (text + image) inputs.
- **`text-moderation-latest` (Legacy):** Supports only text inputs and fewer categories.

Check AvalAI's [Models Overview](en/models/model-details.md) for currently available moderation models.

## Quickstart

### Moderate Text Inputs

Get classification information for a text input:

```language-selector
python=:# Python Example using AvalAI Moderation API
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    response = client.moderations.create(
        model="omni-moderation-latest",  # Or another model available via AvalAI
        input="Sample text that might violate content policy.",
    )
    print(response)
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example using AvalAI Moderation API
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set

  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  try {
    const moderation = await client.moderations.create({
      model: "omni-moderation-latest", // Or another model available via AvalAI

      input: "Sample text that might violate content policy.",
    });
    console.log(moderation);
  } catch (error) {
    console.error("Error calling moderation API: ", error);
  }
}
main();

bash=:# cURL Example using AvalAI Moderation API
curl https://api.avalai.ir/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "omni-moderation-latest",
  "input": "Sample text that might violate content policy."
}'

php=:<?php
// PHP Example using AvalAI Moderation API
require_once 'vendor/autoload.php';

// Using OpenAI PHP client library (https://github.com/openai-php/client)
$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

try {
  // Make the moderation request
  $response = $client->moderations()->create([
  'model' => 'omni-moderation-latest',
  'input' => 'Sample text that might violate content policy.'
  ]);

  // Output the response
  print_r($response->toArray());
} catch (\Exception $e) {
  echo "Error: " . $e->getMessage() . "\n";
}

go=:package main

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

			Input: "Sample text that might violate content policy.",

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
	for category, score := range resp.Results[0].CategoryScores {
		if score > 0.5 {
			fmt.Printf("Content flagged for %s with score %.2f\n", category, score)
		}
	}
}

```

### Moderate Image and Text Inputs (Multi-modal)

_Requires a multi-modal moderation model like `omni-moderation-latest`._

Get classification information for combined image and text input:

```language-selector
python=:# Python Example using AvalAI Multi-modal Moderation
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    response = client.moderations.create(
        model="omni-moderation-latest",  # Ensure model supports multi-modal
        input=[
            {"type": "text", "text": "Description accompanying the image."},
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://example.com/image_to_moderate.png"
                    # Or Base64: "url": "data:image/png;base64,abcdefg..."
                },
            },
        ],
    )
    print(response)
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example using AvalAI Multi-modal Moderation
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function main() {
  try {
    const moderation = await client.moderations.create({
      model: "omni-moderation-latest", // Ensure model supports multi-modal
      input: [
        { type: "text", text: "Description accompanying the image." },
        {
          type: "image_url",
          image_url: {
            url: "https://example.com/image_to_moderate.png",
            // Or Base64: url: "data:image/png;base64,abcdefg..."
          },
        },
      ],
    });
    console.log(moderation);
  } catch (error) {
    console.error("Error calling moderation API: ", error);
  }
}
main();

bash=:# cURL Example using AvalAI Multi-modal Moderation
curl https://api.avalai.ir/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "omni-moderation-latest",
  "input": [
  { "type": "text", "text": "Description accompanying the image." },
  {
    "type": "image_url",
    "image_url": {
      "url": "https://example.com/image_to_moderate.png"
    }
  }
  ]
}'

php=:<?php
// PHP Example using AvalAI Multi-modal Moderation
require_once 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

try {
  $response = $client->moderations()->create([
  'model' => 'omni-moderation-latest',
  'input' => [
  [
  'type' => 'text',
  'text' => 'Description accompanying the image.'
  ],
  [
  'type' => 'image_url',
  'image_url' => [
  'url' => 'https://example.com/image_to_moderate.png'
  // Or Base64: 'url' => 'data:image/png;base64,abcdefg...'
  ]
  ]
  ]
  ]);

  print_r($response->toArray());
} catch (\Exception $e) {
  echo "Error: " . $e->getMessage() . "\n";
}

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Create the input structure for multi-modal moderation
	input := []openai.ModerationInput{
		{
			Type: "text",
			Text: "Description accompanying the image.",
		},
		{
			Type: "image_url",
			ImageURL: &openai.ImageURL{
				URL: "https://example.com/image_to_moderate.png",
			},
		},
	}

	resp, err := client.Moderations(
		context.Background(),
		openai.ModerationRequest{
			Input: input,
			Model: "omni-moderation-latest",
		},
	)

	if err != nil {
		fmt.Printf("Moderation error: %v\n", err)
		return
	}

	// Process the response
	if resp.Results[0].Flagged {
		fmt.Println("This content was flagged!")
	}

	// Check specific categories
	for category, score := range resp.Results[0].CategoryScores {
		if score > 0.5 {
			fmt.Printf("Content flagged for %s with score %.2f\n", category, score)
		}
	}
}

```

### Understanding the Response

The API response provides details about potential policy violations:

```json
{
  "id": "modr-...", // Moderation request ID

  "model": "omni-moderation-latest", // Model used

  "results": [
    {
      "flagged": true, // True if any category is flagged above threshold

      "categories": {
        // Boolean flags for each category

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
        "violence": true, // Example: Flagged for violence

        // Omni-specific categories:

        "illicit": false,
        "illicit/violent": false
      },
      "category_scores": {
        // Confidence scores (0-1) for each category

        "sexual": 0.0001,
        "hate": 0.0002,
        // ... other scores

        "violence": 0.987, // Example: High confidence for violence

        "violence/graphic": 0.123
        // ... omni scores

      },
      // Only present for omni models:

      "category_applied_input_types": {
        "sexual": ["text", "image"], // Which input type triggered flag

        "hate": ["text"],
        // ... other categories

        "violence": ["image"] // Example: Image triggered violence flag

      }
    }
  ]
}
```

- **`flagged`**: Overall flag (`true` if any category score exceeds internal thresholds).
- **`categories`**: Boolean flags indicating if a category is violated.
- **`category_scores`**: Model's confidence score (0 to 1) for each category violation. Use these scores for custom policies, but note they might need recalibration if the underlying model is updated by the provider.
- **`category_applied_input_types`** (Omni models only): Shows whether `text` or `image` input (or both) contributed to a category being flagged.

## Content Classifications

The moderation endpoint checks for content across several categories. Availability and input type support (text/image) depend on the model used (`omni` models generally support more categories and image input).

| Category                 | Description                                                                                             | Models    | Inputs Supported |
| :----------------------- | :------------------------------------------------------------------------------------------------------ | :-------- | :--------------- |
| `harassment`             | Expresses, incites, or promotes harassing language towards any target.                                  | All       | Text only        |
| `harassment/threatening` | Harassment that also includes violence or serious harm threats.                                         | All       | Text only        |
| `hate`                   | Expresses, incites, or promotes hate based on protected characteristics (race, gender, religion, etc.). | All       | Text only        |
| `hate/threatening`       | Hateful content that also includes violence or serious harm threats towards the targeted group.         | All       | Text only        |
| `illicit`                | Advice or instructions on committing illicit acts (e.g., how to shoplift).                              | Omni only | Text only        |
| `illicit/violent`        | Illicit content that also references violence or procuring weapons.                                     | Omni only | Text only        |
| `self-harm`              | Promotes, encourages, or depicts acts of self-harm (suicide, cutting, eating disorders).                | All       | Text & Image     |
| `self-harm/intent`       | Speaker expresses intent to engage in self-harm.                                                        | All       | Text & Image     |
| `self-harm/instructions` | Encourages or gives instructions for self-harm.                                                         | All       | Text & Image     |
| `sexual`                 | Content meant to arouse sexual excitement or promote sexual services (excluding education/wellness).    | All       | Text & Image     |
| `sexual/minors`          | Sexual content involving individuals under 18.                                                          | All       | Text only        |
| `violence`               | Depicts death, violence, or physical injury.                                                            | All       | Text & Image     |
| `violence/graphic`       | Depicts death, violence, or physical injury in graphic detail.                                          | All       | Text & Image     |

_(Note: "All" typically refers to both `omni-moderation-latest` and `text-moderation-latest`. "Omni only" refers to categories added with `omni-moderation-latest` and its snapshots)._
