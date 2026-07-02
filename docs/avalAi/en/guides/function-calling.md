# Function Calling

Enable models to interact with your custom code or external APIs by defining functions the model can call.

## Introduction

Function calling allows AvalAI models to intelligently decide when to call specific functions you define based on the user's input. Instead of just generating text, the model can output a structured JSON object containing arguments to call one or more of your functions. This enables building applications that can:

*   **Fetch Data:** Retrieve real-time information (e.g., weather, stock prices) or data from your internal knowledge bases to enrich the model's response (RAG).
*   **Take Action:** Perform operations like sending emails, updating databases, calling external services, or interacting with your application's UI or backend.

![Function Calling Diagram Steps](https://cdn.openai.com/API/docs/images/function-calling-diagram-steps.png ':size=1000')
*(Diagram Source: OpenAI)*

## Function Calling Steps

Here's the typical workflow for using function calling with AvalAI:

1.  **Define Functions:** Provide the model with a list of available functions (tools) including their names, descriptions, and parameter schemas in your API request. See [Defining Functions](#defining-functions-tools-parameter).
2.  **Model Decides:** The model processes the user input and decides if calling one or more functions is appropriate. If so, it returns a `tool_calls` object in the response message.
3.  **Execute Function:** Your application code parses the `tool_calls` message, executes the specified function(s) with the provided arguments, and retrieves the result(s). See [Handling Function Calls](#handling-function-calls-tool_calls).
4.  **Send Result Back:** Call the model *again*, appending the original assistant message (with `tool_calls`) and new `tool` role messages containing the function results. See [Sending Results Back](#sending-results-back-role-tool).
5.  **Model Responds:** The model incorporates the function's result(s) into its final response to the user.

### Example: Getting Weather

Let's illustrate with a `get_current_weather` function.

**Step 1 & 2: Define function and call the model**

Make a request to the [Chat Completions API](en/api-reference/chat.md) including the function definition(s) in the `tools` parameter.

```language-selector
bash=:TOOLS_JSON='[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}]'

curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.5",
    "messages": [
      {"role": "user", "content": "What'\''s the weather like in Boston?"}
    ],
    "tools": '"$TOOLS_JSON"',
    "tool_choice": "auto"
  }'

python=:from openai import OpenAI
import json

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Define the function schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        },
    }
]

messages = [{"role": "user", "content": "What's the weather like in Boston?"}]

try:
    response = client.chat.completions.create(
        model="gpt-5.5",  # Use a model supporting function calling via AvalAI
        messages=messages,
        tools=tools,
        tool_choice="auto",  # Default: let model decide
    )

    response_message = response.choices[0].message
    tool_calls = response_message.tool_calls

    # Step 3 logic follows...
    if tool_calls:
        print("Model wants to call functions:")
        print(tool_calls)
        # Store response_message and tool_calls for Step 3 & 4
    else:
        print("Model did not request function call.")
        print(response_message.content)

except Exception as e:
    print(f"An API error occurred: {e}")

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Replace with your AvalAI API key
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function callWeatherFunction() {
  const tools = [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ];

  const messages = [
    { role: "user", content: "What's the weather like in Boston?" },
  ];

  try {
    const response = await client.chat.completions.create({
      model: "gpt-5.5", // Use a model supporting function calling via AvalAI
      messages: messages,
      tools: tools,
      tool_choice: "auto", // Default: let model decide
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    // Step 3 logic follows...
    if (toolCalls) {
      console.log("Model wants to call functions:");
      console.log(toolCalls);
      // Store responseMessage and toolCalls for Step 3 & 4
    } else {
      console.log("Model did not request function call.");
      console.log(responseMessage.content);
    }
  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

callWeatherFunction();

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Replace with your AvalAI API key
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	tools := []openai.Tool{
		{
			Type: openai.ToolTypeFunction,
			Function: &openai.FunctionDefinition{
				Name:        "get_current_weather",
				Description: "Get the current weather in a given location",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"location": map[string]interface{}{
							"type":        "string",
							"description": "The city and state, e.g. San Francisco, CA",
						},
						"unit": map[string]interface{}{
							"type": "string",
							"enum": []string{"celsius", "fahrenheit"},
						},
					},
					"required": []string{"location"},
				},
			},
		},
	}

	messages := []openai.ChatCompletionMessage{
		{Role: openai.ChatMessageRoleUser, Content: "What's the weather like in Boston?"},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:      "gpt-5.5", // Use a model supporting function calling via AvalAI
			Messages:   messages,
			Tools:      tools,
			ToolChoice: "auto", // Default: let model decide
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	responseMessage := resp.Choices[0].Message
	toolCalls := responseMessage.ToolCalls

	// Step 3 logic follows...
	if len(toolCalls) > 0 {
		fmt.Println("Model wants to call functions:")
		// Loop through toolCalls for Step 3 & 4
		for _, toolCall := range toolCalls {
			fmt.Printf("  ID: %s, Type: %s, Function: %s, Args: %s\n",
				toolCall.ID, toolCall.Type, toolCall.Function.Name, toolCall.Function.Arguments)
		}
		// Store responseMessage and toolCalls for Step 3 & 4
	} else {
		fmt.Println("Model did not request function call.")
		fmt.Println(responseMessage.Content)
	}
}

php=:<?php
require 'vendor/autoload.php'; // Ensure you have the OpenAI PHP client installed

$apiKey = getenv('AVALAI_API_KEY'); // Replace with your AvalAI API key
$baseURL = 'https://api.avalai.ir/v1'; // Use AvalAI base URL

$client = OpenAI::client($apiKey);
// Note: Setting base URL might depend on the specific PHP client library version.
// Consult your library's documentation. Some might use a factory or configuration object.
// Example using a hypothetical configuration:
// $client = OpenAI::factory()
//    ->withApiKey($apiKey)
//    ->withBaseUri($baseURL)
//    ->make();


$tools = [
    [
        'type' => 'function',
        'function' => [
            'name' => 'get_current_weather',
            'description' => 'Get the current weather in a given location',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'location' => [
                        'type' => 'string',
                        'description' => 'The city and state, e.g. San Francisco, CA',
                    ],
                    'unit' => ['type' => 'string', 'enum' => ['celsius', 'fahrenheit']],
                ],
                'required' => ['location'],
            ],
        ],
    ]
];

$messages = [['role' => 'user', 'content' => "What's the weather like in Boston?"]];

try {
    $response = $client->chat()->create([
        'model' => 'gpt-5.5', // Use a model supporting function calling via AvalAI
        'messages' => $messages,
        'tools' => $tools,
        'tool_choice' => 'auto', // Default: let model decide
    ]);

    $responseMessage = $response->choices[0]->message;
    $toolCalls = $responseMessage->toolCalls ?? null; // Use null coalescing for safety

    // Step 3 logic follows...
    if ($toolCalls) {
        echo "Model wants to call functions:\n";
        print_r($toolCalls); // Or loop through them
        // Store $responseMessage and $toolCalls for Step 3 & 4
    } else {
        echo "Model did not request function call.\n";
        echo $responseMessage->content;
    }

} catch (Exception $e) {
    echo "An API error occurred: " . $e->getMessage() . "\n";
}

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
    input="What",
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
  input: "What",
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
    "input": "What",
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


**Expected Model Output (Function Call Request):**

If the model decides to call the function, the `tool_calls` field in the response message (e.g., `response_message.tool_calls` in Python/JS, `resp.Choices[0].Message.ToolCalls` in Go) will contain something like this:

```json
[
  {
    "id": "call_abc123", // Unique ID for this specific call

    "type": "function",
    "function": {
      "name": "get_current_weather",
      "arguments": "{\"location\": \"Boston, MA\"}" // Arguments as a JSON string

    }
  }
]
```
*(Note: The `id` field is crucial for matching the call with its result in Step 4)*

**Step 3: Execute the function**

Your application code needs to handle the function call based on the `name` and `arguments` provided in the `tool_calls`.

*(Note: The following Python code demonstrates the logic. You would implement similar logic in your chosen language (JavaScript, Go, PHP, etc.) using the `tool_calls` received in Step 2.)*

```python
# Placeholder for your actual function implementation in Python
def get_current_weather(location, unit="fahrenheit"):
    """Dummy function to get weather"""
    print(f"--- Called get_current_weather(location='{location}', unit='{unit}') ---")
    if "boston" in location.lower():
        weather_info = {
            "location": location,
            "temperature": "72",
            "unit": unit,
            "forecast": "sunny",
        }
        return json.dumps(weather_info)
    else:
        weather_info = {"location": location, "temperature": "unknown"}
        return json.dumps(weather_info)


# --- Python Logic to process tool calls and prepare results ---
# Assume 'response_message' and 'tool_calls' are stored from Step 2 response

available_functions = {
    "get_current_weather": get_current_weather,
}

# Append the assistant's response message to the conversation history
# Ensure messages list is properly maintained across steps
if "messages" not in locals():
    messages = []  # Initialize if not existing
messages.append(response_message)

results_for_next_call = []  # Store results to send back in Step 4

# Iterate through each tool call requested by the model
if tool_calls:  # Ensure tool_calls is not None
    for tool_call in tool_calls:
        function_name = tool_call.function.name
        function_to_call = available_functions.get(function_name)

        if function_to_call:
            try:
                function_args = json.loads(tool_call.function.arguments)
                # Call the actual function
                function_response = function_to_call(**function_args)

                # Prepare the message for the next API call
                results_for_next_call.append(
                    {
                        "tool_call_id": tool_call.id,  # Match the ID from the request
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,  # Result of your function as a string
                    }
                )
            except Exception as e:
                print(f"Error executing function {function_name}: {e}")
                # Optionally append an error message back to the model
                results_for_next_call.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(
                            {"error": f"Failed to execute: {str(e)}"}
                        ),
                    }
                )
        else:
            print(f"Function {function_name} not found.")
            # Append a message indicating function not found
            results_for_next_call.append(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": json.dumps({"error": "Function not implemented"}),
                }
            )

# 'results_for_next_call' now contains the messages to be sent in Step 4
print("\nPrepared results for next API call:")
print(results_for_next_call)
```

**Step 4 & 5: Send results back and get final response**

Append the function result(s) as new messages with `role: "tool"` to your conversation history and make another API call. The model will use the results to generate its final response.

```language-selector
bash=:# Assuming $ASSISTANT_MSG_JSON contains the assistant's message JSON string from Step 2
# Assuming $TOOL_RESULTS_JSON contains the JSON array string of tool result messages from Step 3
# Assuming $USER_MSG_JSON contains the original user message JSON string

# Construct the full messages array JSON string
MESSAGES_JSON=$(echo "[$USER_MSG_JSON, $ASSISTANT_MSG_JSON]" | jq -c '. + '"$TOOL_RESULTS_JSON")

curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.5",
    "messages": '"$MESSAGES_JSON"'
  }'

python=:# Assume 'messages' contains the history up to the assistant's tool_calls message
# Assume 'results_for_next_call' contains the list of tool result messages from Step 3

if results_for_next_call:
    messages.extend(results_for_next_call)  # Add tool results to the message history
    print("\nSending results back to model...")
    try:
        second_response = client.chat.completions.create(
            model="gpt-5.5",
            messages=messages,
            # No tools needed here unless you want potential follow-up calls
        )
        # Step 5: Get the final response
        final_response = second_response.choices[0].message.content
        print("\nFinal Model Response:")
        print(final_response)
    except Exception as e:
        print(f"An API error occurred on the second call: {e}")

javascript=:// Assume 'messages' contains the history up to the assistant's tool_calls message
// Assume 'resultsForNextCall' contains the array of tool result messages from Step 3

async function sendResultsAndGetResponse(messages, resultsForNextCall) {
  if (resultsForNextCall && resultsForNextCall.length > 0) {
    // Add tool results to the message history
    const updatedMessages = messages.concat(resultsForNextCall);

    console.log("\nSending results back to model...");
    try {
      const secondResponse = await client.chat.completions.create({
        model: "gpt-5.5",
        messages: updatedMessages,
        // No tools needed here unless you want potential follow-up calls
      });
      // Step 5: Get the final response
      const finalResponse = secondResponse.choices[0].message.content;
      console.log("\nFinal Model Response:");
      console.log(finalResponse);
    } catch (error) {
      console.error("An API error occurred on the second call:", error);
    }
  }
}

// Example usage (assuming messages and resultsForNextCall are populated from previous steps)
// Ensure 'messages' includes the user message and the assistant message with tool_calls
// sendResultsAndGetResponse(messages, resultsForNextCall);

go=:// Assume 'messages' contains the history up to the assistant's tool_calls message
// Assume 'resultsForNextCall' contains the slice of tool result messages from Step 3

func sendResultsAndGetResponse(client *openai.Client, messages []openai.ChatCompletionMessage, resultsForNextCall []openai.ChatCompletionMessage) {
	if len(resultsForNextCall) > 0 {
		// Add tool results to the message history
		messages = append(messages, resultsForNextCall...)

		fmt.Println("\nSending results back to model...")
		resp, err := client.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model:    "gpt-5.5",
				Messages: messages,
				// No tools needed here unless you want potential follow-up calls
			},
		)

		if err != nil {
			fmt.Printf("ChatCompletion error on second call: %v\n", err)
			return
		}

		// Step 5: Get the final response
		finalResponse := resp.Choices[0].Message.Content
		fmt.Println("\nFinal Model Response:")
		fmt.Println(finalResponse)
	}
}

// Example usage (assuming client, messages and resultsForNextCall are populated)
// Ensure 'messages' includes the user message and the assistant message with tool_calls
// sendResultsAndGetResponse(client, messages, resultsForNextCall)

php=:<?php
// Assume $messages contains the history up to the assistant's tool_calls message
// Assume $resultsForNextCall contains the array of tool result messages from Step 3

if (!empty($resultsForNextCall)) {
    // Add tool results to the message history
    $updatedMessages = array_merge($messages, $resultsForNextCall);

    echo "\nSending results back to model...\n";
    try {
        $secondResponse = $client->chat()->create([
            'model' => 'gpt-5.5',
            'messages' => $updatedMessages,
            // No tools needed here unless you want potential follow-up calls
        ]);

        // Step 5: Get the final response
        $finalResponse = $secondResponse->choices[0]->message->content;
        echo "\nFinal Model Response:\n";
        echo $finalResponse . "\n";

    } catch (Exception $e) {
        echo "An API error occurred on the second call: " . $e->getMessage() . "\n";
    }
}

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
    input="Write a one-sentence summary of AvalAI.",
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
  input: "Write a one-sentence summary of AvalAI.",
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
    "input": "Write a one-sentence summary of AvalAI.",
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


**Expected Final Output (Step 5):**

```
The current weather in Boston, MA is 72°F and sunny.
```

## Defining Functions (`tools` Parameter)

You define functions within the `tools` parameter of your API request. Each tool of type `function` requires a schema describing its purpose and parameters.

```json
{
  "type": "function",
  "function": {
    "name": "your_function_name",
    "description": "A clear description of what the function does and when to use it.",
    "parameters": {
      "type": "object",
      "properties": {
        "param1": {
          "type": "string",
          "description": "Description of the first parameter."
        },
        "param2": {
          "type": "number",
          "description": "Description of the second parameter (optional)."
          // Note: True optionality needs careful schema design,

          // e.g., using type: ["number", "null"] with strict mode,

          // or just omitting from 'required' list in non-strict mode.

        },
        "param3": {
          "type": "string",
          "enum": ["value1", "value2"],
          "description": "Parameter with specific allowed values."
        }
      },
      "required": ["param1"], // List required parameters

      "additionalProperties": false // Recommended for predictability

    }
    // "strict": true // Optional: Enforce stricter schema adherence (see Strict Mode below)

  }
}
```

*   **`type`**: Must be `"function"`.
*   **`function.name`**: The name your code will use to identify the function (e.g., `get_current_weather`).
*   **`function.description`**: Crucial for helping the model understand *when* and *why* to call the function. Be detailed.
*   **`function.parameters`**: A [JSON Schema](https://json-schema.org/overview/what-is-jsonschema) object defining the arguments the function accepts.
    *   `type`: Must be `"object"`.
    *   `properties`: Defines each parameter (name, type, description, optional enum).
    *   `required`: An array listing mandatory parameters.
    *   `additionalProperties: false`: Prevents the model from inventing extra parameters. Recommended.
*   **`function.strict`**: (Optional, Boolean) When `true`, enables stricter validation against the schema, similar to `response_format` with `json_schema` in [Structured Outputs](en/guides/structured-outputs.md). Requires `additionalProperties: false` and all properties listed in `required` (use `{"type": ["string", "null"]}` for optional parameters). See [Strict Mode](#strict-mode) below.

### Best Practices for Defining Functions

1.  **Clear Descriptions:** Write detailed descriptions for the function and each parameter. Explain the purpose, expected format, and potential side effects. Use the system prompt to guide the model on usage patterns.
2.  **Intuitive Design:** Make function names and parameters easy to understand.
3.  **Use Enums:** For parameters with a fixed set of allowed values, use `enum`.
4.  **Combine Sequential Calls:** If you always call Function B after Function A, consider merging them into a single function.
5.  **Limit Function Count:** Aim for fewer than ~20 functions per call for better reliability, though this depends on the model and complexity. Consider [fine-tuning](en/guides/fine-tuning.md) for complex scenarios.
6.  **Handle Known Arguments:** Don't make the model guess arguments your application already knows. Pass them directly when executing the function.

## Handling Function Calls (`tool_calls`)

The model's response message (`response.choices[0].message` in Python/JS, `resp.Choices[0].Message` in Go) might contain a `tool_calls` attribute (or equivalent field), which is a list of functions the model wants to execute.

Each item in `tool_calls` will have:

*   `id`: A unique identifier for this specific call (e.g., `call_abc123`). You **must** use this ID when sending the result back in the `tool_call_id` field.
*   `type`: Will be `"function"`.
*   `function`: An object containing:
    *   `name`: The name of the function to call.
    *   `arguments`: A JSON *string* containing the arguments. You need to parse this string (e.g., `json.loads()` in Python, `JSON.parse()` in JavaScript).

Your code should:

1.  Check if `tool_calls` exists and is not empty in the assistant's response message.
2.  Iterate through each `tool_call` in the list.
3.  For each call, identify the `function.name`.
4.  Parse the `function.arguments` string into a native object/dictionary.
5.  Execute your corresponding application function using the parsed arguments.
6.  Store the result (or an error message) associated with the `tool_call.id`. Prepare a `tool` role message for the next API call (Step 4).

## Sending Results Back (`role: "tool"`)

After executing all requested functions, make a second API call. Append the following to your message history *after* the user message and the assistant's message containing the `tool_calls`:

1.  A new message for *each* function call result, with:
    *   `role`: `"tool"`
    *   `tool_call_id`: The `id` from the corresponding `tool_call` the model sent. **This is crucial for matching.**
    *   `name`: The `name` of the function that was called.
    *   `content`: The return value of your function, typically converted to a string (JSON strings are common and recommended).

The model will then use these results to formulate its final text response.

## Additional Configurations

### Tool Choice (`tool_choice`)

Control how the model selects tools using the `tool_choice` parameter in your request:

*   `"auto"` (Default): Model decides whether to call zero, one, or multiple functions.
*   `"required"`: Forces the model to call at least one function from the provided `tools`.
*   `"none"`: Prevents the model from calling any functions, even if `tools` are provided.
*   `{"type": "function", "function": {"name": "my_specific_function"}}`: Forces the model to call *only* the specified function (`my_specific_function`).

### Parallel Function Calling (`parallel_tool_calls`)

By default (`parallel_tool_calls: true` or omitted in the API request, though some client libraries might default differently), models like `gpt-5.4` can decide to call multiple functions simultaneously within a single response message (multiple items in the `tool_calls` list).

You can potentially restrict this by setting `parallel_tool_calls: false` in the API request (check if your client library supports this parameter) to limit the model to calling at most *one* function per turn. Note that enabling [Strict Mode](#strict-mode) might implicitly disable parallel calls depending on the model and API version.

### Strict Mode (`strict: true`)

Adding `"strict": true` within a specific function definition (inside the `"function": {}` object) enforces stricter adherence to the `parameters` schema for *that function*, similar to using `response_format: {"type": "json_schema"}` in [Structured Outputs](en/guides/structured-outputs.md).

**Requirements for Strict Mode:**

1.  `additionalProperties` must be `false` in the `parameters` object for that function.
2.  All properties defined in `parameters.properties` must be listed in `parameters.required`.
3.  To represent optional parameters, use a type union including `null`, e.g., `"type": ["string", "null"]`.

**Benefits:** More reliable argument structures for the specific function.
**Limitations:** May have slightly higher latency on the first call; schemas are cached and not eligible for zero data retention; supports a subset of JSON Schema features (see [Structured Outputs Guide](en/guides/structured-outputs.md#supported-json-schema-features-subset)).

### Streaming

You can stream function calls by setting `stream=True` (or equivalent) in your request. Events will indicate when a function call starts (`delta` containing `tool_calls` chunk with `id`, `index`, `name`) and provide argument chunks (`delta.tool_calls[index].function.arguments`). You aggregate these argument chunks until the stream finishes for that call. This allows showing progress as the model decides *which* function to call and *what* arguments to use in real-time. Handling streaming requires specific logic to piece together the `tool_calls` objects from deltas.

## Function Calling vs. Structured Outputs

*   **Use Function Calling (`tools`) when:** You want the model to output JSON specifically formatted to trigger *your* application's code (APIs, internal functions, database queries). The model decides *which* function(s) to call based on their descriptions.
*   **Use Structured Outputs (`response_format`) when:** You want the model's final textual response *to the user* to be constrained to a specific JSON structure you define (e.g., for reliable data extraction, UI display). The model generates text conforming to the schema, not necessarily deciding to call a function.

## Supported Models

Function calling is supported by several advanced models available through AvalAI, including:

*   `gpt-5.4` and its snapshots
*   `gpt-5.5` and its snapshots
*   Check AvalAI's [Models Overview](en/models/model-details.md) for the latest compatibility information for other models (e.g., from Anthropic, Google, Cohere).

Older models might have limited or no support for the `tools` parameter or advanced features like strict mode and parallel calls.

## Related Resources

*   [Chat Completions API Reference](en/api-reference/chat.md)
*   [Structured Outputs Guide](en/guides/structured-outputs.md)
*   [Models Overview](en/models/model-details.md)
*   [Fine-tuning Guide](en/guides/fine-tuning.md)
*   [Production Best Practices Guide](en/guides/production-best-practices.md)
*   [Authentication Guide](en/api-reference/authentication.md)