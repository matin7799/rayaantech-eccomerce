# Structured Outputs

Ensure model responses adhere to a specific JSON structure using the `response_format` parameter in the AvalAI API.

## Introduction

JSON is a standard format for data exchange. AvalAI allows you to enforce JSON output from compatible models, making it easier to integrate AI responses into your applications reliably.

There are two main ways to enforce JSON output:

1.  **Structured Outputs (`json_schema`)**: (Recommended) Ensures the output not only is valid JSON but also conforms precisely to a provided [JSON Schema](https://json-schema.org/overview/what-is-jsonschema). This prevents issues like missing keys or invalid values.
2.  **JSON Mode (`json_object`)**: Ensures the output is a valid JSON object but doesn't validate against a specific schema. Requires careful prompting to guide the model towards the desired structure.

**Benefits of Structured Outputs (`json_schema`):**

- **Type Safety:** Guarantees schema adherence, reducing the need for validation and retries.
- **Explicit Refusals:** Safety-based refusals are programmatically detectable via a `refusal` field instead of potentially malformed JSON.
- **Simpler Prompting:** Less need for complex prompt instructions just to enforce formatting.

## Getting a Structured Response (`json_schema`)

```python
# Python Example using AvalAI with json_schema
from openai import OpenAI
import json

client = OpenAI(
    api_key="AVALAI_API_KEY",  # Replace with your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # Use AvalAI base URL
)

# Define the desired JSON schema
event_schema = {
    "name": "extract_participant",
    "schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Name of the event"},
            "date": {"type": "string", "description": "Date of the event"},
            "participants": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of participants",
            },
        },
        "required": ["name", "date", "participants"],
        "additionalProperties": False,  # Important for strict schema adherence
    },
}

try:
    # Using Chat Completions API
    response = client.chat.completions.create(
        model="gpt-5.5",  # Use a model supporting json_schema via AvalAI
        messages=[
            {
                "role": "system",
                "content": "Extract the event information into the specified JSON format.",
            },
            {
                "role": "user",
                "content": "Alice and Bob are going to the science fair on Friday.",
            },
        ],
        response_format={"type": "json_schema", "json_schema": event_schema},
    )

    if response.choices:
        message_content = response.choices[0].message.content
        try:
            event_data = json.loads(message_content)
            print(event_data)
            # Check for potential refusal structure if applicable (depends on model/API version)
            # if "refusal" in event_data: print("Model refused:", event_data["refusal"])
        except json.JSONDecodeError:
            print("Error: Could not decode JSON response:", message_content)
        except Exception as e:
            print(f"Error processing response: {e}")
    else:
        print("No response generated.")

    # --- Alternatively, using Responses API (if preferred/supported) ---
    # response = client.responses.create(
    # model="gpt-5.5", # Use a model supporting json_schema via AvalAI
    # input=[
    # {"role": "system", "content": "Extract the event information."},
    # {"role": "user", "content": "Alice and Bob are going to a science fair on Friday."}
    # ],
    # text={
    # "format": {
    # "type": "json_schema",
    # "name": "calendar_event", # Optional name for the schema
    # "schema": event_schema,
    # #"strict": True # Strict mode might be implicit or handled differently
    # }
    # }
    # )
    # if hasattr(response, 'output_text'):
    # try:
    # event_data = json.loads(response.output_text)
    # print(event_data)
    # # Check for refusal in output structure if using Responses API
    # # if response.output and response.output[0].content[0].type == "refusal":
    # # print("Model refused:", response.output[0].content[0].refusal)
    # except json.JSONDecodeError:
    # print("Error: Could not decode JSON response:", response.output_text)
    # except Exception as e:
    # print(f"Error processing response: {e}")
    # else: # Handle cases where output_text might not exist
    # print("No output text found in response.")

except Exception as e:
    print(f"An API error occurred: {e}")
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Alice and Bob are going to a science fair on Friday.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


_(Note: The exact implementation might differ slightly between Chat Completions and the Responses API, especially regarding strict mode and refusal handling. The Chat Completions example is generally preferred)._

### Supported Models

Structured Outputs (`json_schema`) is typically supported by newer models available through AvalAI, such as:

- `gpt-5.5` and its snapshots
- `gpt-5.4` and its snapshots
- Potentially other advanced models from Anthropic or Google (check AvalAI's [Models Overview](en/models/model-details.md)).

Older models might only support the basic `json_object` mode.

## When to Use Structured Outputs vs. Function Calling

- **Function Calling:** Use when you want the model to output JSON specifically to call _your_ application's functions/tools (e.g., query a database, call an external API). See the [Function Calling Guide](en/guides/function-calling.md).
- **Structured Outputs (`response_format`)**: Use when you want the model's direct response _to the user_ to be in a specific JSON format (e.g., for parsing and displaying in a UI, structured data extraction).

## JSON Mode (`json_object`)

For models that don't support `json_schema`, you can use the simpler JSON mode by setting `response_format={ "type": "json_object" }`.

**Important Considerations for `json_object` mode:**

1.  **Explicit Prompting:** You **must** instruct the model within your prompt (e.g., system message) to output JSON. Failure to do so might result in invalid output or infinite whitespace generation. The API may error if "JSON" isn't mentioned in the prompt context.
2.  **No Schema Guarantee:** JSON mode only ensures the output is _valid_ JSON; it does **not** guarantee it matches any specific structure (e.g., required keys, types). You'll need to implement your own validation.
3.  **Edge Cases:** Handle potential incomplete JSON if `max_tokens` is reached or if content filtering stops the generation mid-object.

```python
# Python Example using AvalAI with json_object mode
client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    response = client.chat.completions.create(
        model="gpt-5.4-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant designed to output JSON.",
            },
            {
                "role": "user",
                "content": "Extract the user's name and city: John Doe lives in London.",
            },
        ],
        response_format={"type": "json_object"},
    )
    # ... (add validation and error handling for the response content) ...
    print(response.choices[0].message.content)
except Exception as e:
    print(f"An error occurred: {e}")
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Extract the user",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Best Practices & Tips

- **Schema Design:** Use clear, descriptive names and descriptions for keys in your JSON schema.
- **Handling User Input:** Instruct the model on how to respond if user input is irrelevant or cannot be mapped to the schema (e.g., return null values, specific error structure).
- **Error Handling:** Implement robust error handling for API errors, potential `refusal` responses (with `json_schema`), incomplete JSON (especially with `json_object` or low `max_tokens`), and validation failures.
- **Iteration:** Test and refine your prompts and schemas using evaluation data.

## Supported JSON Schema Features (Subset)

Structured Outputs (`json_schema`) supports a significant subset of the JSON Schema specification, including:

- **Types:** `string`, `number`, `integer`, `boolean`, `object`, `array`
- **Object Properties:** `properties`, `required`, `additionalProperties: false` (required)
- **Arrays:** `items` (with a valid sub-schema)
- **Enums:** `enum` (limited total values/characters apply)
- **Composition:** `anyOf` (nested schemas must also be valid), `$ref` (for definitions/recursion)
- **Constraints:** Limited support (e.g., `minLength`, `maximum` are generally _not_ supported).

**Key Limitations:**

- Root object cannot be `anyOf`.
- All defined properties within an object in the schema are treated as `required`. Use `{"type": ["string", "null"]}` to emulate optionality.
- Limits on nesting depth (~5 levels), total properties (~100), total string length in schema definitions/enums/consts (~15k chars), and enum value counts/lengths apply.
- `additionalProperties: false` is mandatory for objects.

If an unsupported schema feature is used with `json_schema`, the API will return an error.
