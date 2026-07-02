# Generate Images with Imagen Using Native API

Learn how to generate high-quality images using Google's Imagen models through AvalAI's native Gemini v1beta endpoint.

> **Note:** This guide is based on [Google's official Imagen documentation](https://ai.google.dev/gemini-api/docs/imagen) with modifications for AvalAI's API endpoint. The content demonstrates how to use Imagen's powerful image generation capabilities through AvalAI's infrastructure.

## Introduction

Imagen is Google's high-fidelity image generation model, capable of generating realistic and high-quality images from text prompts. Through AvalAI's [native Gemini v1beta endpoint](en/api-reference/v1beta.md), you can access three variants of Imagen 4:

- **`imagen-4.0-generate-001`** - Standard quality, balanced performance
- **`imagen-4.0-ultra-generate-001`** - Highest quality output
- **`imagen-4.0-fast-generate-001`** - Optimized for speed

All generated images include SynthID watermarks for authenticity verification.

## Available Imagen Models

### Imagen 4.0 Models

| Model | Quality | Speed | Use Case |
|-------|---------|-------|----------|
| `imagen-4.0-generate-001` | Standard | Medium | General purpose image generation |
| `imagen-4.0-ultra-generate-001` | Ultra-high | Slower | Professional, high-quality outputs |
| `imagen-4.0-fast-generate-001` | Good | Fast | Rapid prototyping, bulk generation |

### Imagen 3.0 Model

| Model | Quality | Speed | Use Case |
|-------|---------|-------|----------|
| `imagen-3.0-generate-002` | Standard | Medium | Legacy support, stable generation |

## Basic Image Generation

Here's a simple example of generating an image with Imagen through AvalAI's v1beta endpoint:

```language-selector
bash=:# Generate image using Imagen 4.0 Fast
curl -X POST \
  "https://api.avalai.ir/v1beta/models/imagen-4.0-fast-generate-001:predict" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [
      {
        "prompt": "Robot holding a red skateboard"
      }
    ],
    "parameters": {
      "sampleCount": 1
    }
  }'

python=:import requests
import base64
import json

# Configuration
API_KEY = "your-avalai-api-key"
API_URL = "https://api.avalai.ir/v1beta/models/imagen-4.0-fast-generate-001:predict"

# Prepare the request
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

payload = {
    "instances": [{"prompt": "Robot holding a red skateboard"}],
    "parameters": {"sampleCount": 1},
}

# Generate image
response = requests.post(API_URL, headers=headers, json=payload)
result = response.json()

# Save the generated image
if "predictions" in result:
    for idx, prediction in enumerate(result["predictions"]):
        # Decode base64 image
        image_data = base64.b64decode(prediction["bytesBase64Encoded"])

        # Save to file
        with open(f"generated_image_{idx}.png", "wb") as f:
            f.write(image_data)

        print(f"Image saved as generated_image_{idx}.png")

    # Print usage information
    if "usageMetadata" in result:
        print(f"\nUsage: {result['usageMetadata']}")

javascript=:const fs = require('fs');

// Configuration
const API_KEY = 'your-avalai-api-key';
const API_URL = 'https://api.avalai.ir/v1beta/models/imagen-4.0-fast-generate-001:predict';

async function generateImage() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: 'Robot holding a red skateboard'
          }
        ],
        parameters: {
          sampleCount: 1
        }
      })
    });

    const result = await response.json();

    // Save generated images
    if (result.predictions) {
      result.predictions.forEach((prediction, idx) => {
        // Decode base64 image
        const imageBuffer = Buffer.from(prediction.bytesBase64Encoded, 'base64');
        
        // Save to file
        fs.writeFileSync(`generated_image_${idx}.png`, imageBuffer);
        console.log(`Image saved as generated_image_${idx}.png`);
      });

      // Print usage information
      if (result.usageMetadata) {
        console.log('\nUsage:', result.usageMetadata);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

generateImage();

go=:package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type ImageRequest struct {
	Instances  []Instance `json:"instances"`
	Parameters Parameters `json:"parameters"`
}

type Instance struct {
	Prompt string `json:"prompt"`
}

type Parameters struct {
	SampleCount int `json:"sampleCount"`
}

type ImageResponse struct {
	Predictions   []Prediction  `json:"predictions"`
	UsageMetadata UsageMetadata `json:"usageMetadata"`
}

type Prediction struct {
	BytesBase64Encoded string `json:"bytesBase64Encoded"`
	MimeType           string `json:"mimeType"`
}

type UsageMetadata struct {
	GeneratedImages int     `json:"generatedImages"`
	Cost            float64 `json:"cost"`
}

func main() {
	apiKey := "your-avalai-api-key"
	apiURL := "https://api.avalai.ir/v1beta/models/imagen-4.0-fast-generate-001:predict"

	// Prepare request
	reqBody := ImageRequest{
		Instances: []Instance{
			{Prompt: "Robot holding a red skateboard"},
		},
		Parameters: Parameters{
			SampleCount: 1,
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	// Parse response
	body, _ := io.ReadAll(resp.Body)
	var result ImageResponse
	json.Unmarshal(body, &result)

	// Save images
	for idx, prediction := range result.Predictions {
		imageData, err := base64.StdEncoding.DecodeString(prediction.BytesBase64Encoded)
		if err != nil {
			fmt.Println("Error decoding image:", err)
			continue
		}

		filename := fmt.Sprintf("generated_image_%d.png", idx)
		err = os.WriteFile(filename, imageData, 0644)
		if err != nil {
			fmt.Println("Error saving image:", err)
			continue
		}

		fmt.Printf("Image saved as %s\n", filename)
	}

	// Print usage
	fmt.Printf("\nUsage: %+v\n", result.UsageMetadata)
}

php=:<?php

// Configuration
$apiKey = 'your-avalai-api-key';
$apiUrl = 'https://api.avalai.ir/v1beta/models/imagen-4.0-fast-generate-001:predict';

// Prepare request
$data = [
    'instances' => [
        [
            'prompt' => 'Robot holding a red skateboard'
        ]
    ],
    'parameters' => [
        'sampleCount' => 1
    ]
];

// Initialize cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);

// Execute request
$response = curl_exec($ch);
curl_close($ch);

// Parse response
$result = json_decode($response, true);

// Save generated images
if (isset($result['predictions'])) {
    foreach ($result['predictions'] as $idx => $prediction) {
        // Decode base64 image
        $imageData = base64_decode($prediction['bytesBase64Encoded']);
        
        // Save to file
        $filename = "generated_image_{$idx}.png";
        file_put_contents($filename, $imageData);
        echo "Image saved as {$filename}\n";
    }
    
    // Print usage information
    if (isset($result['usageMetadata'])) {
        echo "\nUsage: " . json_encode($result['usageMetadata']) . "\n";
    }
}

?>

```

### Response Format

The API returns a response with the following structure:

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "BASE64_ENCODED_IMAGE_DATA...",
      "mimeType": "image/png"
    }
  ],
  "usageMetadata": {
    "generatedImages": 1,
    "cost": 0.02,
    "inputTokens": 0,
    "outputTokens": 1000
  }
}
```

## Configuration Parameters

Imagen supports the following configuration parameters through the `parameters` object:

### Sample Count

Control the number of images to generate (1-4):

```language-selector
bash=:curl -X POST \
  "https://api.avalai.ir/v1beta/models/imagen-4.0-generate-001:predict" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{"prompt": "A serene mountain landscape"}],
    "parameters": {
      "sampleCount": 4
    }
  }'

python=:payload = {
    "instances": [{"prompt": "A serene mountain landscape"}],
    "parameters": {"sampleCount": 4},  # Generate 4 images
}

javascript=:const payload = {
  instances: [{ prompt: 'A serene mountain landscape' }],
  parameters: {
    sampleCount: 4  // Generate 4 images
  }
};

go=:reqBody := ImageRequest{
	Instances: []Instance{
		{Prompt: "A serene mountain landscape"},
	},
	Parameters: Parameters{
		SampleCount: 4, // Generate 4 images
	},
}

php=:$data = [
    'instances' => [
        ['prompt' => 'A serene mountain landscape']
    ],
    'parameters' => [
        'sampleCount' => 4  // Generate 4 images
    ]
];

```

### Aspect Ratio

Supported aspect ratios: `"1:1"`, `"3:4"`, `"4:3"`, `"9:16"`, `"16:9"` (default: `"1:1"`):

```language-selector
bash=:curl -X POST \
  "https://api.avalai.ir/v1beta/models/imagen-4.0-generate-001:predict" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{"prompt": "A widescreen cinematic landscape"}],
    "parameters": {
      "aspectRatio": "16:9",
      "sampleCount": 1
    }
  }'

python=:payload = {
    "instances": [{"prompt": "A widescreen cinematic landscape"}],
    "parameters": {"aspectRatio": "16:9", "sampleCount": 1},  # Widescreen format
}

javascript=:const payload = {
  instances: [{ prompt: 'A widescreen cinematic landscape' }],
  parameters: {
    aspectRatio: '16:9',  // Widescreen format
    sampleCount: 1
  }
};

go=:type Parameters struct {
	SampleCount int    `json:"sampleCount"`
	AspectRatio string `json:"aspectRatio,omitempty"`
}

reqBody := ImageRequest{
	Instances: []Instance{
		{Prompt: "A widescreen cinematic landscape"},
	},
	Parameters: Parameters{
		SampleCount: 1,
		AspectRatio: "16:9", // Widescreen format
	},
}

php=:$data = [
    'instances' => [
        ['prompt' => 'A widescreen cinematic landscape']
    ],
    'parameters' => [
        'aspectRatio' => '16:9',  // Widescreen format
        'sampleCount' => 1
    ]
];

```

### Person Generation

Control whether to generate images of people:

- `"dont_allow"` - Block generation of images of people
- `"allow_adult"` - Generate images of adults only (default)
- `"allow_all"` - Generate images including children

> **Note:** The `"allow_all"` parameter is restricted in EU, UK, CH, and MENA regions.

```language-selector
bash=:curl -X POST \
  "https://api.avalai.ir/v1beta/models/imagen-4.0-generate-001:predict" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{"prompt": "Portrait of a professional chef"}],
    "parameters": {
      "personGeneration": "allow_adult",
      "sampleCount": 1
    }
  }'

python=:payload = {
    "instances": [{"prompt": "Portrait of a professional chef"}],
    "parameters": {"personGeneration": "allow_adult", "sampleCount": 1},
}

javascript=:const payload = {
  instances: [{ prompt: 'Portrait of a professional chef' }],
  parameters: {
    personGeneration: 'allow_adult',
    sampleCount: 1
  }
};

go=:type Parameters struct {
	SampleCount      int    `json:"sampleCount"`
	PersonGeneration string `json:"personGeneration,omitempty"`
}

reqBody := ImageRequest{
	Instances: []Instance{
		{Prompt: "Portrait of a professional chef"},
	},
	Parameters: Parameters{
		SampleCount:      1,
		PersonGeneration: "allow_adult",
	},
}

php=:$data = [
    'instances' => [
        ['prompt' => 'Portrait of a professional chef']
    ],
    'parameters' => [
        'personGeneration' => 'allow_adult',
        'sampleCount' => 1
    ]
];

```

## Imagen Prompt Guide

> **Source:** The following prompt writing guidance is adapted from [Google's official Imagen prompt guide](https://ai.google.dev/gemini-api/docs/imagen#imagen-prompt-guide).

### Prompt Writing Basics

**Maximum prompt length: 480 tokens**

A good prompt is descriptive and clear, making use of meaningful keywords and modifiers. Think about three key elements:

1. **Subject**: The object, person, animal, or scenery you want
2. **Context and Background**: The environment where the subject is placed
3. **Style**: The artistic or photographic style you want

![Prompt structure example](https://ai.google.dev/static/gemini-api/docs/images/imagen/style-subject-context.png)

Example: _A sketch_ (**style**) of a _modern apartment building_ (**subject**) surrounded by _skyscrapers_ (**context**)

#### Iterative Refinement

Start simple and add details progressively:

**Short prompt:**
```
A park in the spring next to a lake
```

**Medium prompt:**
```
A park in the spring next to a lake, the sun sets across the lake, golden hour
```

**Detailed prompt:**
```
A park in the spring next to a lake, the sun sets across the lake, golden hour, red wildflowers
```

#### Key Tips

- **Use descriptive language**: Employ detailed adjectives and adverbs
- **Provide context**: Include background information for better understanding
- **Reference specific styles**: Mention artists or art movements if desired
- **Enhance facial details**: Use words like "portrait" for better face rendering
- **Keep experimenting**: Iterate until you achieve your desired result

### Generate Text in Images

Imagen can incorporate text into generated images. Follow these guidelines:

- **Keep text short**: Limit to 25 characters or less
- **Multiple phrases**: Use 2-3 distinct phrases, avoid exceeding three
- **Specify placement**: Guide where text should appear (though exact positioning may vary)
- **Font style**: Mention general font characteristics
- **Font size**: Specify relative size (small, medium, large)

Example prompt:
```
A poster with the text "Summerland" in bold font as a title, 
underneath this text is the slogan "Summer never felt so good"
```

### Photography Prompts

For photorealistic images, start with "A photo of..." and add modifiers:

#### Camera Proximity
- Close-up
- Zoomed out
- Macro
- Taken from far away

#### Camera Position
- Aerial photo
- From below
- Eye level
- Bird's eye view

#### Lighting
- Natural lighting
- Dramatic lighting
- Warm tones
- Cold tones
- Golden hour
- Studio lighting

####

 Camera Settings
- Motion blur
- Soft focus
- Bokeh effect
- Portrait mode
- Sharp focus

#### Lens Types
- 35mm
- 50mm
- Fisheye
- Wide angle
- Macro lens
- Telephoto

#### Film Types
- Black and white
- Polaroid
- Vintage film
- Kodachrome

### Illustration and Art Styles

Use phrases like "A painting of..." or "A sketch of..." followed by style descriptors:

#### Art Styles
- Technical pencil drawing
- Charcoal drawing
- Color pencil drawing
- Watercolor painting
- Oil painting
- Digital art
- Art deco
- Minimalist
- Abstract

#### Historical Art References
- Impressionist painting
- Renaissance painting
- Pop art
- Cubist style
- Surrealist style

### Advanced Techniques

#### Shapes and Materials

Create unique imagery by specifying materials:
```
A duffle bag made of cheese
Neon tubes in the shape of a bird
An armchair made of paper, origami style
```

#### Image Quality Modifiers

Enhance output quality with these keywords:

- **General**: high-quality, beautiful, stylized, detailed
- **Photos**: 4K, HDR, studio photo, professional photographer
- **Art**: by a professional, highly detailed, masterpiece

#### Photorealistic Use Cases

| Use Case | Lens Type | Focal Length | Additional Details |
|----------|-----------|--------------|-------------------|
| Portraits | Prime, zoom | 24-35mm | Black and white film, depth of field |
| Objects/Still life | Macro | 60-105mm | High detail, controlled lighting |
| Sports/Wildlife | Telephoto | 100-400mm | Fast shutter speed, motion tracking |
| Landscapes | Wide-angle | 10-24mm | Long exposure, sharp focus |

## Best Practices

1. **Start Simple, Then Refine**
   - Begin with a basic concept
   - Add details iteratively
   - Test variations to find the best approach

2. **Be Specific with Technical Terms**
   - Use photography terminology when relevant
   - Specify art styles clearly
   - Include quality modifiers for professional results

3. **Leverage Multiple Images**
   - Generate 2-4 variations with `sampleCount`
   - Compare results to find the best output
   - Use different prompts for variety

4. **Optimize for Your Use Case**
   - Choose appropriate aspect ratios for your platform
   - Select the right Imagen model variant (Standard/Ultra/Fast)
   - Balance quality needs with generation speed

5. **Respect Content Policies**
   - Avoid prompts requesting explicit content
   - Don't request copyrighted characters or brands
   - Use `personGeneration` parameter appropriately

## Troubleshooting

### Image Quality Issues

**Problem**: Generated images lack detail or look blurry

**Solutions**:
- Add quality modifiers (4K, HDR, high-quality, detailed)
- Use more specific descriptive language
- Try the Ultra model for highest quality
- Include technical photography terms

### Text Generation Problems

**Problem**: Text in images is incorrect or poorly rendered

**Solutions**:
- Keep text under 25 characters
- Use clear, simple phrases
- Specify font style and size
- Try generating multiple times
- Place text description early in the prompt

### Unexpected Results

**Problem**: Images don't match the intended prompt

**Solutions**:
- Review prompt structure (subject, context, style)
- Add more specific details
- Use reference styles or artists
- Try alternative phrasings
- Generate multiple samples for comparison

### API Errors

**Problem**: Request fails or returns an error

**Solutions**:
- Verify API key is correct
- Check prompt length (max 480 tokens)
- Ensure `sampleCount` is between 1-4
- Validate aspect ratio values
- Review person generation restrictions for your region

- **[Pricing](en/pricing.md)** - Cost information and pricing details
- **[Best Practices](en/guides/best-practices.md)** - General API usage guidelines
- **[Google's Official Imagen Documentation](https://ai.google.dev/gemini-api/docs/imagen)** - Source reference

---

*This guide is based on Google's official Imagen documentation with modifications for AvalAI's API infrastructure. Visit the [official Google documentation](https://ai.google.dev/gemini-api/docs/imagen) for more information about Imagen's capabilities.*
## Related Resources

- **[Native Gemini v1beta API Reference](en/api-reference/v1beta.md)** - Complete endpoint documentation
- **[Image Generation Guide](en/guides/image-generation.md)** - General image generation overview
- **[Gemini Models](en/providers/google.md)** - Available Gemini model variants
