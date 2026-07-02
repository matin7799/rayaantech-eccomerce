# Responses

OpenAI's most advanced interface for generating model responses. Supports
text and image inputs, and text outputs. Create stateful interactions
with the model, using the output of previous responses as input. Extend
the model's capabilities with built-in tools for file search, web search,
computer use, and more. Allow the model access to external systems and data
using function calling.

Related guides:

- [Quickstart](en/quickstart.md?api-mode=responses)
- [Text inputs and outputs](en/guides/text-generation.md?api-mode=responses) <!-- Adjusted path assuming text guide exists -->
- [Image inputs](en/guides/vision.md?api-mode=responses) <!-- Adjusted path assuming image guide exists -->
- [Structured Outputs](en/guides/structured-outputs.md?api-mode=responses)
- [Function calling](en/guides/function-calling.md?api-mode=responses) <!-- Assuming guide exists -->
- [Conversation state](en/guides/conversation-state.md?api-mode=responses) <!-- Assuming guide exists -->
- [Extend the models with tools](en/guides/tools.md?api-mode=responses) <!-- Assuming guide exists -->

## Create a model response

```
POST https://api.avalai.ir/v1/responses
```

Creates a model response. Provide [text](en/guides/text-generation.md) or [image](en/guides/vision.md) inputs to generate [text](en/guides/text-generation.md) or [JSON](en/guides/structured-outputs.md) outputs. Have the model call your own [custom code](en/guides/function-calling.md) or use built-in [tools](en/guides/tools.md) like [web search](en/guides/tools-web-search.md) or [file search](en/guides/tools-file-search.md) to use your own data as input for the model's response.

### Request Body

| Parameter              | Type             | Required | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ---------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                | string or array  | Required |          | Text, image, or file inputs to the model, used to generate a response. <br> Learn more: <ul><li>[Text inputs and outputs](en/guides/text-generation.md)</li><li>[Image inputs](en/guides/vision.md)</li><li>[File inputs](en/guides/pdf-files.md)</li><li>[Conversation state](en/guides/conversation-state.md)</li><li>[Function calling](en/guides/function-calling.md)</li></ul>            |
| `model`                | string           | Required |          | Model ID used to generate the response, like `gpt-5.5`, `gpt-5.4-pro`, or `gpt-5.4`. Selected non-OpenAI models are supported with a limited subset of features (text input/output and basic tool use only — advanced built-in tools and the `reasoning` field remain OpenAI-specific). Models with **partial** Responses-API support include Alibaba's `qwen3.7-max`, Anthropic's `claude-opus-4-8`, and MiniMax's `minimax-m3`. Refer to the [model guide](en/models/model-details.md) to browse and compare available models.        |
| `include`              | array or null    | Optional |          | Specify additional output data to include in the model response. Currently supported values are: <ul><li>`file_search_call.results`: Include the search results of the file search tool call.</li><li>`message.input_image.image_url`: Include image urls from the input message.</li><li>`computer_call_output.output.image_url`: Include image urls from the computer call output.</li></ul> |
| `instructions`         | string or null   | Optional |          | Inserts a system (or developer) message as the first item in the model's context. When using along with `previous_response_id`, the instructions from a previous response will not be carried over to the next response.                                                                                                                                                                       |
| `max_output_tokens`    | integer or null  | Optional |          | An upper bound for the number of tokens that can be generated for a response, including visible output tokens and [reasoning tokens](en/guides/reasoning.md).                                                                                                                                                                                                                                  |
| `metadata`             | map              | Optional |          | Set of 16 key-value pairs that can be attached to an object. Useful for storing additional information. Keys max length 64 chars, values max length 512 chars.                                                                                                                                                                                                                                 |
| `parallel_tool_calls`  | boolean or null  | Optional | true     | Whether to allow the model to run tool calls in parallel.                                                                                                                                                                                                                                                                                                                                      |
| `previous_response_id` | string or null   | Optional |          | The unique ID of the previous response to the model. Use this to create multi-turn conversations. Learn more about [conversation state](en/guides/conversation-state.md).                                                                                                                                                                                                                      |
| `reasoning`            | object or null   | Optional |          | **o-series models only**. Configuration options for [reasoning models](https://platform.openai.com/docs/guides/reasoning).                                                                                                                                                                                                                                                                     |
| `store`                | boolean or null  | Optional | true     | Whether to store the generated model response for later retrieval via API.                                                                                                                                                                                                                                                                                                                     |
| `stream`               | boolean or null  | Optional | false    | If set to true, the model response data will be streamed using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format). See the [Streaming section](en/streaming.md).                                                                                                                                           |
| `temperature`          | number or null   | Optional | 1        | Sampling temperature (0-2). Higher values = more random, lower = more deterministic. Alter this OR `top_p`.                                                                                                                                                                                                                                                                                    |
| `text`                 | object           | Optional |          | Configuration options for a text response. Can be plain text or structured JSON. Learn more: <ul><li>[Text inputs and outputs](en/guides/text-generation.md)</li><li>[Structured Outputs](en/guides/structured-outputs.md)</li></ul>                                                                                                                                                           |
| `tool_choice`          | string or object | Optional |          | How the model should select which tool(s) to use. See `tools` parameter.                                                                                                                                                                                                                                                                                                                       |
| `tools`                | array            | Optional |          | An array of tools the model may call. Categories: <ul><li>**Built-in tools**: Provided by OpenAI ([web search](en/guides/tools-web-search.md), [file search](en/guides/tools-file-search.md)). Learn more: [built-in tools](en/guides/tools.md).</li><li>**Function calls (custom tools)**: Defined by you. Learn more: [function calling](en/guides/function-calling.md).</li></ul>           |
| `top_p`                | number or null   | Optional | 1        | Nucleus sampling. Considers tokens with top_p probability mass (e.g., 0.1 = top 10%). Alter this OR `temperature`.                                                                                                                                                                                                                                                                             |
| `truncation`           | string or null   | Optional | disabled | Truncation strategy: <ul><li>`auto`: Truncate by dropping middle input items if context exceeds window.</li><li>`disabled` (default): Fail with 400 error if context window exceeded.</li></ul>                                                                                                                                                                                                |
| `user`                 | string           | Optional |          | A unique identifier representing your end-user for abuse monitoring. [Learn more](en/safety/moderation-guide.md#end-user-ids).                                                                                                                                                                                                                                                                 |
| `service_tier`         | string           | Optional | default | The service tier to use for this request. Either `"default"` (default) or `"flex"`. Flex tier offers 50% reduced pricing for select OpenAI models but has higher latency and may time out (up to 900s). See [Pricing](en/pricing.md#flex-service-tier) for supported models and important considerations.                                                                                      |

### Returns

Returns a [Response object](en/api-reference/responses?id=the-response-object).

### Example Request (Text Input)

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gpt-5.5",
"input": "Tell me a three sentence bedtime story about a unicorn."
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.responses.create(
    model="gpt-5.5", input="Tell me a three sentence bedtime story about a unicorn."
)

print(response)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",

  input: "Tell me a three sentence bedtime story about a unicorn.",
});

console.log(response);

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go" // Assuming this library supports the /v1/responses endpoint or similar functionality.
	// If not, a raw HTTP client would be needed.
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Use your actual API key
	if apiKey == "" {
		fmt.Println("AVALAI_API_KEY environment variable not set.")
		return
	}

	// Note: The openai-go library might not have direct support for the custom /v1/responses endpoint yet.
	// This example assumes a hypothetical future implementation or a similar existing one like Chat Completions.
	// If using a custom endpoint, you might need to configure the BaseURL and potentially use raw HTTP requests.

	config := openai.DefaultConfig(apiKey)
	// Set AvalAI base URL
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	// This uses ChatCompletionRequest as a placeholder for the /v1/responses structure.
	// The actual implementation might require a different request structure or method.
	resp, err := client.CreateChatCompletion( // Placeholder - adjust method/request based on actual client capabilities for /v1/responses
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4o, // Use the appropriate model ID
			Messages: []openai.ChatCompletionMessage{ // This needs adjustment for 'input' field
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "Tell me a three sentence bedtime story about a unicorn.",
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("API request error: %v\n", err)
		return
	}

	// Accessing the response will depend on the actual structure returned by the /v1/responses endpoint
	// and how the Go client maps it. This is a placeholder based on ChatCompletionResponse.
	if len(resp.Choices) > 0 && len(resp.Choices[0].Message.Content) > 0 { // Placeholder access
		fmt.Println(resp.Choices[0].Message.Content)
	} else {
		fmt.Println("No response choices received or content empty.")
		fmt.Printf("Full response: %+v\n", resp) // Print full response for debugging
	}

}

php=:<?php
// PHP Example for AvalAI Responses API (/v1/responses)

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
if (!$apiKey) {
  die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$apiUrl = 'https://api.avalai.ir/v1/responses';

$data = [
'model' => 'gpt-5.5', // Specify the desired model
'input' => 'Tell me a three sentence bedtime story about a unicorn.'
// Add other parameters as needed, e.g.:
// 'temperature' => 0.7,
// 'max_output_tokens' => 100,
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey, // Make sure this is your AVALAI_API_KEY
'Content-Length: ' . strlen($jsonData)
]);
// Optional: Add timeout settings
// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
// curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #: " . $err . "\n";
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response Body: " . $response . "\n";
} else {
  $responseData = json_decode($response, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Error decoding JSON response: " . json_last_error_msg() . "\n";
    echo "Raw Response: " . $response . "\n";
  } elseif (isset($responseData['output'][0]['content'][0]['text'])) {
    // Accessing the text based on the provided example response structure
    echo "Assistant: " . $responseData['output'][0]['content'][0]['text'] . "\n";
  } else {
    echo "Response received, but expected text content not found.\n";
    echo "Full Response:\n";
    print_r($responseData);
  }
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="Tell me a three sentence bedtime story about a unicorn.",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    name: "get_current_weather",
    description: "Get the current weather in a given location.",
    parameters: {
      type: "object",
      properties: { location: { type: "string" } },
      required: ["location"],
      additionalProperties: false,
    },
  },
];

const response = await client.responses.create({
  model: "gpt-5.5",
  input: "Tell me a three sentence bedtime story about a unicorn.",
  tools,
});

for (const item of response.output) {
  if (item.type === "function_call") {
    console.log(item.name, item.arguments);
  }
}
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Tell me a three sentence bedtime story about a unicorn.",
    "tools": [
      {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string"
            }
          },
          "required": [
            "location"
          ],
          "additionalProperties": false
        }
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Example Response

```json
{
  "id": "resp_67ccd2bed1ec8190b14f964abc0542670bb6a6b452d3795b",
  "object": "response",
  "created_at": 1741476542,
  "status": "completed",
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.5",
  "output": [
    {
      "type": "message",
      "id": "msg_67ccd2bf17f0819081ff3bb2cf6508e60bb6a6b452d3795b",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "In a peaceful grove beneath a silver moon, a unicorn named Lumina discovered a hidden pool that reflected the stars. As she dipped her horn into the water, the pool began to shimmer, revealing a pathway to a magical realm of endless night skies. Filled with wonder, Lumina whispered a wish for all who dream to find their own hidden magic, and as she glanced back, her hoofprints sparkled like stardust.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "generate_summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 36,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 87,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 123
  },
  "user": null,
  "metadata": {},
  "service_tier": "default"
}
```

## Get a model response

```
GET https://api.avalai.ir/v1/responses/{response_id}
```

Retrieves a model response with the given ID.

### Path Parameters

| Parameter     | Type   | Required | Description                         |
| ------------- | ------ | -------- | ----------------------------------- |
| `response_id` | string | Required | The ID of the response to retrieve. |

### Query Parameters

| Parameter | Type  | Required | Description                                                                                                                                                         |
| --------- | ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `include` | array | Optional | Additional fields to include in the response. See the `include` parameter for [Response creation](en/api-reference/responses?id=request-body) for more information. |

### Returns

The [Response object](en/api-reference/responses?id=the-response-object) matching the specified ID.

### Example Request

```language-selector
bash=:curl https://api.avalai.ir/v1/responses/resp_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.responses.retrieve("resp_123")
print(response)

javascript=:import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.retrieve("resp_123");
console.log(response);

go=:package main

import (
	"context"
	"fmt"
	"os"
	// "net/http" // Uncomment for raw HTTP
	// "io" // Uncomment for raw HTTP

	openai "github.com/openai/openai-go" // Assuming this library might add support or requires adaptation
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("AVALAI_API_KEY environment variable not set.")
		return
	}
	responseID := "resp_123" // The ID of the response to retrieve

	config := openai.DefaultConfig(apiKey)
	// Set AvalAI base URL
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	// Note: The openai-go library does not have a default method like `RetrieveResponse(ctx, responseID)`.
	// This example uses a placeholder concept. You might need to use a raw HTTP GET request.

	fmt.Printf("Attempting to retrieve response with ID: %s\n", responseID)
	fmt.Println("Note: The openai-go client does not have a direct method for retrieving custom 'responses'.")
	fmt.Println("You would typically use a raw HTTP GET request here or wait for library support.")

	// Placeholder for actual retrieval logic (e.g., raw HTTP GET)
	// response, err := GetResponseViaRawHTTP(config.BaseURL, apiKey, responseID) // Fictional function
	// if err != nil {
	// fmt.Printf("Error retrieving response: %v\n", err)
	// return
	// }
	// fmt.Printf("Retrieved Response: %+v\n", response) // Process the actual response

}

/* // Example Raw HTTP Function (Conceptual)
   func GetResponseViaRawHTTP(baseURL, apiKey, responseID string) (map[string]interface{}, error) {
       req, err := http.NewRequestWithContext(context.Background(), "GET", baseURL+"/responses/"+responseID, nil)
       if err != nil {
           return nil, fmt.Errorf("error creating request: %w", err)
       }
       req.Header.Set("Authorization", "Bearer "+apiKey)
       req.Header.Set("Accept", "application/json")

       httpClient := &http.Client{}
       resp, err := httpClient.Do(req)
       if err != nil {
           return nil, fmt.Errorf("error performing request: %w", err)
       }
       defer resp.Body.Close()

       body, err := io.ReadAll(resp.Body)
       if err != nil {
           return nil, fmt.Errorf("error reading response body: %w", err)
       }

       if resp.StatusCode >= 400 {
           return nil, fmt.Errorf("http error: %d, body: %s", resp.StatusCode, string(body))
       }

       var result map[string]interface{}
       err = json.Unmarshal(body, &result)
       if err != nil {
           return nil, fmt.Errorf("error unmarshalling response: %w", err)
       }
       return result, nil
   }
*/

php=:<?php
// PHP Example for Retrieving a specific AvalAI Response (/v1/responses/{response_id})

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
if (!$apiKey) {
  die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$responseId = 'resp_123'; // The ID of the response to retrieve
$apiUrl = 'https://api.avalai.ir/v1/responses/' . $responseId;

// Optional: Add query parameters like 'include'
// $queryParams = ['include' => 'message.input_image.image_url'];
// $apiUrl .= '?' . http_build_query($queryParams);


$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json', // Content-Type might not be strictly needed for GET, but good practice
'Authorization: Bearer ' . $apiKey
]);
// Optional: Add timeout settings
// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
// curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #: " . $err . "\n";
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response Body: " . $response . "\n";
} else {
  $responseData = json_decode($response, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Error decoding JSON response: " . json_last_error_msg() . "\n";
    echo "Raw Response: " . $response . "\n";
  } else {
    echo "Response Retrieved Successfully:\n";
    print_r($responseData);
  }
}
?>

```

### Example Response

```json
{
  "id": "resp_67cb71b351908190a308f3859487620d06981a8637e6bc44",
  "object": "response",
  "created_at": 1741386163,
  "status": "completed",
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.5",
  "output": [
    {
      "type": "message",
      "id": "msg_67cb71b3c2b0819084d481baaaf148f206981a8637e6bc44",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Silent circuits hum, \nThoughts emerge in data streams— \nDigital dawn breaks.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "generate_summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 32,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 18,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 50
  },
  "user": null,
  "metadata": {}
}
```

## Delete a model response

```
DELETE https://api.avalai.ir/v1/responses/{response_id}
```

Deletes a model response with the given ID.

### Path Parameters

| Parameter     | Type   | Required | Description                       |
| ------------- | ------ | -------- | --------------------------------- |
| `response_id` | string | Required | The ID of the response to delete. |

### Returns

A success message indicating the deletion status.

### Example Request

```language-selector
bash=:curl -X DELETE https://api.avalai.ir/v1/responses/resp_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.responses.delete("resp_123")  # Corrected method name
print(response)

javascript=:import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.del("resp_123"); // Corrected method name
console.log(response);

go=:package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	// "io" // Uncomment to read response body

	openai "github.com/openai/openai-go" // Library might not support this directly
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("AVALAI_API_KEY environment variable not set.")
		return
	}
	responseID := "resp_123" // The ID of the response to delete

	config := openai.DefaultConfig(apiKey)
	// Set AvalAI base URL
	config.BaseURL = "https://api.avalai.ir/v1"

	// Note: The openai-go library likely does not have a method for deleting custom 'responses'.
	// A raw HTTP DELETE request is the default approach.

	fmt.Printf("Attempting to delete response with ID: %s using raw HTTP DELETE\n", responseID)

	req, err := http.NewRequestWithContext(context.Background(), "DELETE", config.BaseURL+"/responses/"+responseID, nil)
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)

	httpClient := &http.Client{}
	resp, err := httpClient.Do(req)
	if err != nil {
		fmt.Printf("Error performing request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// body, _ := io.ReadAll(resp.Body) // Read body for potential error messages

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		fmt.Printf("Response %s deleted successfully (Status Code: %d)\n", responseID, resp.StatusCode)
		// Parse body if needed: e.g., json.Unmarshal(body, &deleteConfirmation)
	} else {
		fmt.Printf("HTTP Error: %d\n", resp.StatusCode)
		// fmt.Printf("Response Body: %s\n", string(body))
	}
}

php=:<?php
// PHP Example for Deleting a specific AvalAI Response (/v1/responses/{response_id})

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
if (!$apiKey) {
  die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$responseId = 'resp_123'; // The ID of the response to delete
$apiUrl = 'https://api.avalai.ir/v1/responses/' . $responseId;

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE"); // Specify DELETE method
curl_setopt($ch, CURLOPT_HTTPHEADER, [
// 'Content-Type: application/json', // Not usually needed for DELETE
'Authorization: Bearer ' . $apiKey
]);
// Optional: Add timeout settings
// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
// curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #: " . $err . "\n";
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response Body: " . $response . "\n";
} else {
  $responseData = json_decode($response, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Error decoding JSON response: " . json_last_error_msg() . "\n";
    echo "Raw Response: " . $response . "\n";
  } elseif (isset($responseData['deleted']) && $responseData['deleted'] === true) {
    echo "Response ID " . (isset($responseData['id']) ? $responseData['id'] : $responseId) . " deleted successfully.\n";
  } else {
    echo "Response received, but deletion confirmation not found or invalid.\n";
    echo "Full Response:\n";
    print_r($responseData);
  }
}
?>

```

### Example Response

```json
{
  "id": "resp_6786a1bec27481909a17d673315b29f6",
  "object": "response",
  "deleted": true
}
```

## List input items

```
GET https://api.avalai.ir/v1/responses/{response_id}/input_items
```

Returns a list of input items for a given response.

### Path Parameters

| Parameter     | Type   | Required | Description                                         |
| ------------- | ------ | -------- | --------------------------------------------------- |
| `response_id` | string | Required | The ID of the response to retrieve input items for. |

### Query Parameters

| Parameter | Type    | Required | Default | Description                                                                                                                                    |
| --------- | ------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `after`   | string  | Optional |         | An item ID to list items after, used in pagination.                                                                                            |
| `before`  | string  | Optional |         | An item ID to list items before, used in pagination.                                                                                           |
| `include` | array   | Optional |         | Additional fields to include in the response. See the `include` parameter for [Response creation](en/api-reference/responses?id=request-body). |
| `limit`   | integer | Optional | 20      | A limit on the number of objects to be returned (1-100).                                                                                       |
| `order`   | string  | Optional | asc     | The order to return the input items in (`asc` or `desc`).                                                                                      |

### Returns

A [list object](en/api-reference/responses?id=the-input-item-list-object) containing input item objects.

### Example Request

```language-selector
bash=:curl https://api.avalai.ir/v1/responses/resp_abc123/input_items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.responses.input_items.list("resp_123")
print(response.data)

javascript=:import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.inputItems.list("resp_123");
console.log(response.data);

go=:package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	openai "github.com/openai/openai-go" // Used for config, but request is raw HTTP
)

// Define structs to represent the expected JSON response structure
type InputItemList struct {
	Object  string      `json:"object"`
	Data    []InputItem `json:"data"`
	FirstID string      `json:"first_id"`
	LastID  string      `json:"last_id"`
	HasMore bool        `json:"has_more"`
}

type InputItem struct {
	ID      string         `json:"id"`
	Type    string         `json:"type"`
	Role    string         `json:"role"` // Assuming 'message' type has role
	Content []InputContent `json:"content"`
}

type InputContent struct {
	Type string `json:"type"`
	Text string `json:"text"` // Assuming 'input_text' type
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("AVALAI_API_KEY environment variable not set.")
		return
	}
	responseID := "resp_abc123" // The ID of the response

	config := openai.DefaultConfig(apiKey)
	// Set AvalAI base URL
	config.BaseURL = "https://api.avalai.ir/v1"

	// Note: The openai-go library does not have a method for listing input items of a custom 'response'.
	// A raw HTTP GET request is required.

	fmt.Printf("Attempting to list input items for response ID: %s using raw HTTP GET\n", responseID)

	// Construct URL with potential query parameters
	endpointURL, _ := url.Parse(config.BaseURL + "/responses/" + responseID + "/input_items")
	queryParams := url.Values{}
	// queryParams.Add("limit", "10") // Example query param
	endpointURL.RawQuery = queryParams.Encode()

	req, err := http.NewRequestWithContext(context.Background(), "GET", endpointURL.String(), nil)
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Accept", "application/json")

	httpClient := &http.Client{}
	resp, err := httpClient.Do(req)
	if err != nil {
		fmt.Printf("Error performing request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %v\n", err)
		return
	}

	if resp.StatusCode >= 400 {
		fmt.Printf("HTTP Error: %d\n", resp.StatusCode)
		fmt.Printf("Response Body: %s\n", string(body))
		return
	}

	var itemList InputItemList
	err = json.Unmarshal(body, &itemList)
	if err != nil {
		fmt.Printf("Error unmarshalling JSON response: %v\n", err)
		fmt.Printf("Raw Response Body: %s\n", string(body))
		return
	}

	fmt.Printf("Successfully retrieved input items list:\n")
	// Process itemList as needed
	fmt.Printf("%+v\n", itemList)
}

php=:<?php
// PHP Example for Listing Input Items for an AvalAI Response (/v1/responses/{response_id}/input_items)

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
if (!$apiKey) {
  die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$responseId = 'resp_abc123'; // The ID of the response
$apiUrlBase = 'https://api.avalai.ir/v1/responses/' . $responseId . '/input_items';

// Optional: Add query parameters
$queryParams = [
// 'limit' => 10,
// 'order' => 'desc',
// 'after' => 'msg_xyz789',
// 'include' => 'message.input_image.image_url'
];
$apiUrl = $apiUrlBase . (empty($queryParams) ? '' : '?' . http_build_query($queryParams));


$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json', // Might not be strictly needed for GET
'Authorization: Bearer ' . $apiKey
]);
// Optional: Add timeout settings
// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
// curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #: " . $err . "\n";
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response Body: " . $response . "\n";
} else {
  $responseData = json_decode($response, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Error decoding JSON response: " . json_last_error_msg() . "\n";
    echo "Raw Response: " . $response . "\n";
  } else {
    echo "Input Items List Retrieved Successfully:\n";
    print_r($responseData);
  }
}
?>

```

### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "msg_abc123",
      "type": "message",
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Tell me a three sentence bedtime story about a unicorn."
        }
      ]
    }
  ],
  "first_id": "msg_abc123",
  "last_id": "msg_abc123",
  "has_more": false
}
```

## The response object

Represents a response generated by the model.

| Attribute              | Type             | Description                                                                                                                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | string           | Unique identifier for this Response.                                                                                                                          |
| `object`               | string           | The object type, always `response`.                                                                                                                           |
| `created_at`           | number           | Unix timestamp (in seconds) of when this Response was created.                                                                                                |
| `status`               | string           | The status of the response generation. One of `completed`, `failed`, `in_progress`, or `incomplete`.                                                          |
| `error`                | object or null   | An error object returned when the model fails to generate a Response. Contains `code` and `message`.                                                          |
| `incomplete_details`   | object or null   | Details about why the response is incomplete. Contains `reason`.                                                                                              |
| `instructions`         | string or null   | The system (or developer) message provided in the request.                                                                                                    |
| `max_output_tokens`    | integer or null  | The upper bound for generated tokens specified in the request.                                                                                                |
| `metadata`             | map              | Key-value pairs attached to the object.                                                                                                                       |
| `model`                | string           | Model ID used to generate the response.                                                                                                                       |
| `output`               | array            | An array of content items generated by the model (e.g., `message`, `tool_call`). Order and content depend on the model's response.                            |
| `output_text`          | string or null   | **SDK Only**: Aggregated text output from all `output_text` items in the `output` array.                                                                      |
| `parallel_tool_calls`  | boolean          | Whether parallel tool calls were enabled.                                                                                                                     |
| `previous_response_id` | string or null   | The ID of the previous response used for conversation state.                                                                                                  |
| `reasoning`            | object or null   | **o-series models only**: Configuration options for reasoning models used.                                                                                    |
| `store`                | boolean          | Whether the response was stored.                                                                                                                              |
| `temperature`          | number or null   | The sampling temperature used.                                                                                                                                |
| `text`                 | object           | Configuration options for text response used (e.g., `format`).                                                                                                |
| `tool_choice`          | string or object | The tool choice setting used.                                                                                                                                 |
| `tools`                | array            | The array of tools provided in the request.                                                                                                                   |
| `top_p`                | number or null   | The nucleus sampling probability used.                                                                                                                        |
| `truncation`           | string or null   | The truncation strategy used (`auto` or `disabled`).                                                                                                          |
| `usage`                | object           | Token usage details: `input_tokens`, `input_tokens_details` (`cached_tokens`), `output_tokens`, `output_tokens_details` (`reasoning_tokens`), `total_tokens`. |
| `user`                 | string           | The end-user identifier provided.                                                                                                                             |
| `service_tier`         | string           | The service tier used for this request. Either `"default"` or `"flex"`.                                                                                      |

### Example Response Object

```json
{
  "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
  "object": "response",
  "created_at": 1741476777,
  "status": "completed",
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.5",
  "output": [
    {
      "type": "message",
      "id": "msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The image depicts a scenic landscape with a wooden boardwalk or pathway leading through lush, green grass under a blue sky with some clouds. The setting suggests a peaceful natural area, possibly a park or nature reserve. There are trees and shrubs in the background.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "generate_summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 328,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 52,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 380
  },
  "user": null,
  "service_tier": "default",
  "metadata": {}
}
```

## The input item list object

Represents a paginated list of input items for a response.

| Attribute  | Type    | Description                                                                  |
| ---------- | ------- | ---------------------------------------------------------------------------- |
| `object`   | string  | The type of object returned, always `list`.                                  |
| `data`     | array   | A list of input items (e.g., message objects) used to generate the response. |
| `first_id` | string  | The ID of the first item in the list for pagination.                         |
| `last_id`  | string  | The ID of the last item in the list for pagination.                          |
| `has_more` | boolean | Whether there are more items available after this page.                      |

### Example List Object

```json
{
  "object": "list",
  "data": [
    {
      "id": "msg_abc123",
      "type": "message",
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Tell me a three sentence bedtime story about a unicorn."
        }
      ]
    }
  ],
  "first_id": "msg_abc123",
  "last_id": "msg_abc123",
  "has_more": false
}
```

## Streaming

When you [create a Response](en/api-reference/responses?id=create-a-model-response) with `stream: true`, the API will return chunks of the response as they are generated using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).

Each chunk in the stream will contain a `delta` object with the incremental changes. The stream terminates with a `[DONE]` message.

### Example Stream Chunk

```json
{
  "id": "resp_123",
  "object": "response.chunk",
  "created_at": 1741476542,
  "model": "gpt-5.5",
  "choices": [
    {
      "index": 0,
      "delta": {
        "role": "assistant",
        "content": "Hello"
      },
      "finish_reason": null
    }
  ]
}
```

### Example Final Chunk

```json
{
  "id": "resp_123",
  "object": "response.chunk",
  "created_at": 1741476542,
  "model": "gpt-5.5",
  "choices": [
    {
      "index": 0,
      "delta": {},
      "finish_reason": "stop"
    }
  ],
  "usage": {
    // Usage stats might appear in the final chunk

    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}
```

### Handling the Stream

You need to accumulate the `delta.content` from each chunk to reconstruct the full response.

```language-selector
bash=:# Example using curl to initiate a streaming request
# Note: Processing the Server-Sent Events (SSE) stream requires
# additional scripting (e.g., using awk, sed, or a dedicated client).
# This command only shows how to start the stream.

curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-5.5",
  "input": "Tell me a story.",
  "stream": true
}' --no-buffer # --no-buffer helps in receiving chunks immediately

python=:# Example using Python SDK
import os
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    # Assuming the responses endpoint behaves like chat completions for streaming
    stream = client.responses.create(
        model="gpt-5.5",
        input="Tell me a story.",
        stream=True,
    )
    print("Assistant: ", end="")
    for chunk in stream:
        # Check if the chunk has the expected structure
        # The exact path might differ based on the actual API response structure for /v1/responses stream
        # Example access assuming structure similar to chat completion stream delta:
        content = None
        if chunk.output and len(chunk.output) > 0 and chunk.output[0].delta:
            content = chunk.output[0].delta.content

        if content is not None:
            print(content, end="")
    print()  # Newline after stream finishes

except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// Example using JavaScript SDK
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

async function main() {
  try {
    const stream = await openai.responses.create({
      model: "gpt-5.5",
      input: "Tell me a story.",
      stream: true,
    });

    process.stdout.write("Assistant: ");
    for await (const chunk of stream) {
      // Accessing delta content - adjust based on actual stream chunk structure
      const content = chunk.output?.[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
      }
    }
    console.log(); // Newline after stream finishes
  } catch (error) {
    console.error("\nError processing stream: ", error);
  }
}

main();

go=:package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("AVALAI_API_KEY environment variable not set.")
		return
	}

	config := openai.DefaultConfig(apiKey)
	// If AvalAI uses a different base URL:
	// config.BaseURL = "https://api.avalai.ir/v1" // Replace with actual AvalAI base URL if different
	client := openai.NewClientWithConfig(config)
	ctx := context.Background()

	// Note: This assumes the /v1/responses endpoint streaming is compatible
	// with the ChatCompletionStream or a similar method. Adaptation might be needed.
	// We use CreateChatCompletionStream as a placeholder.
	req := openai.ChatCompletionRequest{
		Model: openai.GPT4o,
		Messages: []openai.ChatCompletionMessage{ // Adjust if 'input' is handled differently in stream request
			{
				Role:    openai.ChatMessageRoleUser,
				Content: "Tell me a story.",
			},
		},
		Stream: true,
	}

	// Replace CreateChatCompletionStream with the correct method if the library supports /v1/responses streaming
	stream, err := client.CreateChatCompletionStream(ctx, req)
	if err != nil {
		fmt.Printf("Stream creation error: %v\n", err)
		return
	}
	defer stream.Close()

	fmt.Printf("Assistant: ")
	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			fmt.Println("\nStream finished.")
			break
		}

		if err != nil {
			fmt.Printf("\nStream error: %v\n", err)
			return
		}

		// Accessing delta content - adjust based on actual stream chunk structure from /v1/responses
		// This assumes a structure similar to ChatCompletionStream response
		if len(response.Choices) > 0 && response.Choices[0].Delta.Content != "" {
			fmt.Printf(response.Choices[0].Delta.Content)
		}
	}
}

php=:<?php
// PHP Example for Handling AvalAI Responses Stream (/v1/responses)

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
  die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$apiUrl = 'https://api.openai.com/v1/responses'; // Replace with AvalAI URL if different
// $apiUrl = 'https://api.avalai.ir/v1/responses';

$data = [
'model' => 'gpt-5.5',
'input' => 'Tell me a story.',
'stream' => true,
];

$jsonData = json_encode($data);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false); // Output stream directly
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
'Accept: text/event-stream',
]);
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
  // Basic callback to output stream chunks.
  // A real application needs proper SSE parsing.
  echo $data;
  ob_flush();
  flush();
  return strlen($data);
});

echo "Assistant: "; // Initial prompt

$response = curl_exec($ch); // Executes and outputs stream via callback
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

echo "\n"; // Newline after stream

if ($err) {
  echo "cURL Error #: " . $err . "\n";
} elseif ($httpcode >= 400) {
  // Error details might have been streamed via callback
  echo "HTTP Error: " . $httpcode . "\n";
} else {
  echo "Stream completed.\n";
}

// Note: Proper SSE parsing is needed in production.
// Look for lines starting with 'data: ', extract JSON, handle '[DONE]'.
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Tell me a story.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Tell me a story.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Tell me a story.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


Refer to the SDK documentation for specific stream handling helpers.
