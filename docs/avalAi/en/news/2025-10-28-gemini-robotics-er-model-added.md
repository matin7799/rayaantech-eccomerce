# Gemini Robotics-ER 1.5 Preview: Google's First AI Model for Robotics Now Available

**Date:** 2025-10-28

## Summary

We announce support for `gemini-robotics-er-1.5-preview`, Google's first vision-language model designed specifically for robotics applications. This preview model brings advanced spatial reasoning, natural language task orchestration, and agentic capabilities to robotic systems, enabling robots to interpret complex visual data, plan actions, and respond to dynamic environments through the AvalAI API.

---

## Details

### Google Gemini

Google introduces Gemini Robotics-ER 1.5, a specialized vision-language model that extends Gemini's capabilities to physical robotics applications.

- **[gemini-robotics-er-1.5-preview](en/providers/google.md#gemini-robotics-er-15-preview)**: A vision-language model designed for advanced reasoning in physical environments, enabling robots to interpret visual data, perform spatial reasoning, and plan actions from natural language commands.

**Key Features:**

- **Enhanced Autonomy**: Enables robots to reason, adapt, and respond to changes in open-ended environments
- **Natural Language Interaction**: Complex task assignments using conversational language
- **Task Orchestration**: Decomposes natural language commands into subtasks and integrates with existing robot controllers
- **Versatile Capabilities**: Object detection, spatial reasoning, trajectory planning, and dynamic scene interpretation
- **Thinking Budget**: Configurable reasoning budget for balancing latency versus accuracy tradeoffs
- **Dual SDK Support**: Available through both native Gemini v1beta API and OpenAI-compatible endpoints

**Use Cases:**
- Object detection and localization with 2D points and bounding boxes
- Video-based object tracking across frames
- Trajectory planning for robot movement
- Spatial reasoning for environment understanding
- Long-horizon task orchestration with function calling
- Dynamic code execution for adaptive behaviors

**API Support:**

- **Full Support**: `v1beta/` (native Gemini endpoint) - Complete access to all robotics features
- **Full Support**: `v1/chat/completions` (OpenAI-compatible) - Image input via content array (similar to other Gemini vision models)
- **Partial Support**: `v1/responses` (OpenAI-compatible) - Image input via content array (similar to other Gemini vision models)

**Pricing Details:**

Pricing follows the same structure as `gemini-2.5-flash`:

| Model | Input | Cached Input | Output | Audio Input | Audio Cached Input |
|-------|-------|--------------|--------|-------------|-------------------|
| gemini-robotics-er-1.5-preview | $0.30/1M tokens | $0.15/1M tokens | $2.50/1M tokens | $1.00/1M tokens | $0.25/1M tokens |

### API Request/Response Examples

#### Native Gemini API (v1beta) - Object Detection

```bash
curl -X POST \
  "https://api.avalai.ir/v1beta/models/gemini-robotics-er-1.5-preview:generateContent" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "inlineData": {
              "mimeType": "image/jpeg",
              "data": "'$(base64 -w 0 image.jpg)'"
            }
          },
          {
            "text": "Point to no more than 10 items in the image. Return the answer in JSON format: [{\"point\": [y, x], \"label\": <label>}, ...]. The points are in [y, x] format normalized to 0-1000."
          }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0.5,
      "thinkingConfig": {
        "thinkingBudget": 0
      }
    }
  }'
```

#### Example Response

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "[{\"point\": [376, 508], \"label\": \"banana\"}, {\"point\": [287, 609], \"label\": \"apple\"}, {\"point\": [223, 303], \"label\": \"orange\"}, {\"point\": [435, 172], \"label\": \"bowl\"}, {\"point\": [270, 786], \"label\": \"plate\"}]"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP"
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 285,
    "candidatesTokenCount": 52,
    "totalTokenCount": 337
  }
}
```

#### OpenAI-Compatible API

For image input through the OpenAI-compatible endpoint:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-robotics-er-1.5-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Identify all objects in this image and return their locations as normalized 2D points."
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            }
          }
        ]
      }
    ]
  }'
```

### SDK Usage Examples

#### Native Gemini SDK (Recommended for Robotics)

```language-selector
bash=:# Install Google GenAI SDK
pip install -q google-genai

# Set your API key
export AVALAI_API_KEY="your-avalai-api-key"

python=:from google import genai
from google.genai import types

# Initialize the GenAI client
client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "url": "https://api.avalai.ir"},
)

MODEL_ID = "gemini-robotics-er-1.5-preview"

# Load your image
with open("robot-scene.jpg", "rb") as f:
    image_bytes = f.read()

# Find objects in the scene
prompt = """
Point to no more than 10 items in the image. The label returned
should be an identifying name for the object detected.
The answer should follow the json format: [{"point": [y, x], "label": <label>}, ...].
The points are in [y, x] format normalized to 0-1000.
"""

response = client.models.generate_content(
    model=MODEL_ID,
    contents=[
        types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/jpeg",
        ),
        prompt,
    ],
    config=types.GenerateContentConfig(
        temperature=0.5, thinking_config=types.ThinkingConfig(thinking_budget=0)
    ),
)

print(response.text)

javascript=:import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

// Initialize the client
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseUrl: "https://api.avalai.ir"
});

const model = genAI.getGenerativeModel({ 
  model: "gemini-robotics-er-1.5-preview" 
});

// Load image
const imageData = fs.readFileSync('robot-scene.jpg');
const base64Image = imageData.toString('base64');

const prompt = `
Point to no more than 10 items in the image. The label returned
should be an identifying name for the object detected.
The answer should follow the json format: [{"point": [y, x], "label": <label>}, ...].
The points are in [y, x] format normalized to 0-1000.
`;

const result = await model.generateContent([
  {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg"
    }
  },
  prompt
], {
  generationConfig: {
    temperature: 0.5,
    thinkingConfig: {
      thinkingBudget: 0
    }
  }
});

console.log(result.response.text());

```

#### OpenAI-Compatible SDK

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-robotics-er-1.5-preview",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Find all objects in this image"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
            }
          }
        ]
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using OpenAI SDK with image input
response = client.chat.completions.create(
    model="gemini-robotics-er-1.5-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Identify objects and return their 2D coordinates",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/robot-scene.jpg"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "gemini-robotics-er-1.5-preview",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Identify objects and return their 2D coordinates"
        },
        {
          type: "image_url",
          image_url: {
            url: "https://example.com/robot-scene.jpg"
          }
        }
      ]
    }
  ]
});

console.log(response.choices[0].message.content);

```

### Advanced Features

#### Trajectory Planning

The model can generate sequences of points defining trajectories for robot movement:

```language-selector
python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "url": "https://api.avalai.ir"},
)

with open("workspace.jpg", "rb") as f:
    image_bytes = f.read()

prompt = """
Place a point on the red object, then 15 points for the trajectory of
moving it to the container on the left. Label points from '0' to '15'.
Return as JSON: [{"point": [y, x], "label": <label>}, ...].
Points are in [y, x] format normalized to 0-1000.
"""

response = client.models.generate_content(
    model="gemini-robotics-er-1.5-preview",
    contents=[types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"), prompt],
    config=types.GenerateContentConfig(temperature=0.5),
)

print(response.text)

```

#### Spatial Reasoning and Orchestration

The model can understand spatial relationships and plan multi-step tasks:

```language-selector
python=:prompt = """
Explain how to pack a lunch box with the items shown.
Point to each object you refer to.
Format: [{"point": [y, x], "label": <object_name>}, ...]
Points normalized to 0-1000.
"""

response = client.models.generate_content(
    model="gemini-robotics-er-1.5-preview",
    contents=[types.Part.from_bytes(data=lunch_image, mime_type="image/jpeg"), prompt],
    config=types.GenerateContentConfig(
        temperature=0.5, thinking_config=types.ThinkingConfig(thinking_budget=0)
    ),
)

# Model will provide step-by-step instructions with coordinates
print(response.text)

```

---

## Related Links

- [Gemini Robotics-ER Documentation](en/providers/google.md#gemini-robotics-er-15-preview)
- [AI in Robotics: Complete Guide](en/examples/ai_robotics_with_gemini_er.md)
- [Native Google GenAI SDK Support](en/api-reference/v1beta.md)
- [Image Understanding Guide](en/guides/vision.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Google Models Overview](en/providers/google.md)