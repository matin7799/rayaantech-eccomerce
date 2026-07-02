# Evaluating Model Performance

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

## Practical Path Today: Local and CI Evals

Until hosted AvalAI evals are available for your account, use a local eval runner such as Promptfoo with normal AvalAI API calls. This keeps test data, prompts, assertions, and CI behavior in your repository.

See [Promptfoo Evals with AvalAI](en/examples/promptfoo_evals_with_avalai.md) for a runnable example adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook/) and [openai/openai-cookbook](https://github.com/openai/openai-cookbook).

Use this approach to:

- compare a production model with a candidate model
- catch prompt regressions before deploys
- test routing, refusal, classification, and extraction behavior
- run small eval suites on pull requests and larger suites before releases


Test and improve model outputs through evaluations using the AvalAI platform.

Evaluations (often called **evals**) test model outputs to ensure they meet style and content criteria that you specify. Writing evals to understand how your LLM applications are performing against your expectations, especially when upgrading or trying new models, is an essential component to building reliable applications.

In this guide, we will focus on **configuring evals programmatically using the AvalAI Evals API**. *Note: AvalAI currently does not offer a dashboard interface for evaluations; API interaction is required.*

Broadly, there are three steps to build and run evals for your LLM application.

1.  Describe the task to be done as an eval.
2.  Run your eval with test inputs (a prompt and input data).
3.  Analyze the results, then iterate and improve on your prompt.

This process is somewhat similar to behavior-driven development (BDD), where you begin by specifying how the system should behave before implementing and testing the system. Let's see how we would complete each of the steps above using the AvalAI Evals API.

## Create an eval for a task

Creating an eval begins by describing a task to be done by a model. Let's say that we would like to use a model to classify the contents of IT support tickets into one of three categories: `Hardware`, `Software`, or `Other`.

To implement this use case with the [AvalAI Chat Completions API](en/api-reference/chat.md), you might write code like this that combines a developer message with a user message containing the text of a support ticket.

**Categorize IT support tickets**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "gpt-5.5",
  "messages": [
    {
      "role": "system",
      "content": "Categorize the following support ticket into one of Hardware, Software, or Other. Respond with only one of those words."
    },
    {
      "role": "user",
      "content": "My monitor wont turn on - help!"
    }
  ]
}'

javascript=:import { OpenAI } from "openai"; // Use the OpenAI library structure

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const instructions = `
You are an expert in categorizing IT support tickets. Given the support
ticket below, categorize the request into one of "Hardware", "Software",
or "Other". Respond with only one of those words.
`;

const ticket = "My monitor won't turn on - help!";

async function categorizeTicket() {
  const completion = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: ticket },
    ],
  });
  console.log(completion.choices[0].message.content);
}

categorizeTicket();

python=:from openai import OpenAI  # Use the OpenAI library structure

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

instructions = """
You are an expert in categorizing IT support tickets. Given the support
ticket below, categorize the request into one of "Hardware", "Software",
or "Other". Respond with only one of those words.
"""

ticket = "My monitor won't turn on - help!"

completion = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {"role": "system", "content": instructions},
        {"role": "user", "content": ticket},
    ],
)

print(completion.choices[0].message.content)

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go" // Use the openai-go library
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Please set the AVALAI_API_KEY environment variable.")
		return
	}

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	instructions := `
You are an expert in categorizing IT support tickets. Given the support
ticket below, categorize the request into one of "Hardware", "Software",
or "Other". Respond with only one of those words.
`
	ticket := "My monitor won't turn on - help!"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: instructions,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: ticket,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have the openai-php client installed

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
    die("Please set the AVALAI_API_KEY environment variable.\n");
}

// Configure the client to use AvalAI endpoint
$client = OpenAI::client($apiKey, [
    'base_url' => 'https://api.avalai.ir/v1'
]);


$instructions = <<<EOT
You are an expert in categorizing IT support tickets. Given the support
ticket below, categorize the request into one of "Hardware", "Software",
or "Other". Respond with only one of those words.
EOT;

$ticket = "My monitor won't turn on - help!";

try {
    $completion = $client->chat()->create([
        'model' => 'gpt-5.5',
        'messages' => [
            ['role' => 'system', 'content' => $instructions],
            ['role' => 'user', 'content' => $ticket],
        ],
    ]);

    echo $completion->choices[0]->message->content . "\n";

} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
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

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="My monitor wont turn on - help!",
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
  input: "My monitor wont turn on - help!",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "My monitor wont turn on - help!",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


Let's set up an eval to test this behavior via the AvalAI Evals API. An eval needs two key ingredients:

*   A schema for the test data you will use along with the eval (`data_source_config`)
*   The criteria that determine if the model output is correct (`testing_criteria`)

```language-selector
bash=:curl https://api.avalai.ir/v1/evals \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "IT Ticket Categorization",
  "data_source_config": {
    "type": "custom",
    "item_schema": {
      "type": "object",
      "properties": {
        "ticket_text": { "type": "string" },
        "correct_label": { "type": "string" }
      },
      "required": ["ticket_text", "correct_label"]
    },
    "include_sample_schema": true
  },
  "testing_criteria": [
    {
      "type": "string_check",
      "name": "Match output to human label",
      "input": "{{ sample.output_text }}",
      "operation": "eq",
      "reference": "{{ item.correct_label }}"
    }
  ]
}'

javascript=:import { OpenAI } from "openai"; // Use the OpenAI library structure

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function createEval() {
  try {
    // Note: The OpenAI Node.js library might not directly support /v1/evals
    // You might need to use a direct HTTP request library like 'axios' or 'node-fetch'
    // This example shows the conceptual structure.
    const response = await fetch("https://api.avalai.ir/v1/evals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "IT Ticket Categorization",
        data_source_config: {
          type: "custom",
          item_schema: {
            type: "object",
            properties: {
              ticket_text: { type: "string" },
              correct_label: { type: "string" },
            },
            required: ["ticket_text", "correct_label"],
          },
          include_sample_schema: true,
        },
        testing_criteria: [
          {
            type: "string_check",
            name: "Match output to human label",
            input: "{{ sample.output_text }}",
            operation: "eq",
            reference: "{{ item.correct_label }}",
          },
        ],
      }),
    });
    const evalResult = await response.json();
    console.log(evalResult);
  } catch (error) {
    console.error("Error creating eval:", error);
  }
}

createEval();

python=:from openai import OpenAI  # Use the OpenAI library structure
import requests  # Use requests for direct API calls if library lacks support
import json
import os

# Note: The OpenAI Python library might not directly support /v1/evals
# Using the 'requests' library for a direct API call is shown here.

api_key = os.getenv("AVALAI_API_KEY")
base_url = "https://api.avalai.ir/v1"
headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

eval_config = {
    "name": "IT Ticket Categorization",
    "data_source_config": {
        "type": "custom",
        "item_schema": {
            "type": "object",
            "properties": {
                "ticket_text": {"type": "string"},
                "correct_label": {"type": "string"},
            },
            "required": ["ticket_text", "correct_label"],
        },
        "include_sample_schema": True,
    },
    "testing_criteria": [
        {
            "type": "string_check",
            "name": "Match output to human label",
            "input": "{{ sample.output_text }}",
            "operation": "eq",
            "reference": "{{ item.correct_label }}",
        }
    ],
}

try:
    response = requests.post(f"{base_url}/evals", headers=headers, json=eval_config)
    response.raise_for_status()  # Raise an exception for bad status codes
    eval_result = response.json()
    print(json.dumps(eval_result, indent=2))
except requests.exceptions.RequestException as e:
    print(f"Error creating eval: {e}")
    if response is not None:
        print(f"Response body: {response.text}")

go=:package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	// Note: The openai-go library might not directly support /v1/evals
	// Using Go's standard http package for direct API call.
)

type ItemSchema struct {
	Type       string `json:"type"`
	Properties struct {
		TicketText   map[string]string `json:"ticket_text"`
		CorrectLabel map[string]string `json:"correct_label"`
	} `json:"properties"`
	Required []string `json:"required"`
}

type DataSourceConfig struct {
	Type                string     `json:"type"`
	ItemSchema          ItemSchema `json:"item_schema"`
	IncludeSampleSchema bool       `json:"include_sample_schema"`
}

type TestingCriterion struct {
	Type      string `json:"type"`
	Name      string `json:"name"`
	Input     string `json:"input"`
	Operation string `json:"operation"`
	Reference string `json:"reference"`
}

type EvalRequest struct {
	Name             string             `json:"name"`
	DataSourceConfig DataSourceConfig   `json:"data_source_config"`
	TestingCriteria  []TestingCriterion `json:"testing_criteria"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Please set the AVALAI_API_KEY environment variable.")
		return
	}
	baseURL := "https://api.avalai.ir/v1"

	evalReq := EvalRequest{
		Name: "IT Ticket Categorization",
		DataSourceConfig: DataSourceConfig{
			Type: "custom",
			ItemSchema: ItemSchema{
				Type: "object",
				Properties: struct {
					TicketText   map[string]string `json:"ticket_text"`
					CorrectLabel map[string]string `json:"correct_label"`
				}{
					TicketText:   map[string]string{"type": "string"},
					CorrectLabel: map[string]string{"type": "string"},
				},
				Required: []string{"ticket_text", "correct_label"},
			},
			IncludeSampleSchema: true,
		},
		TestingCriteria: []TestingCriterion{
			{
				Type:      "string_check",
				Name:      "Match output to human label",
				Input:     "{{ sample.output_text }}",
				Operation: "eq",
				Reference: "{{ item.correct_label }}",
			},
		},
	}

	reqBody, err := json.Marshal(evalReq)
	if err != nil {
		fmt.Printf("Error marshalling request: %v\n", err)
		return
	}

	req, err := http.NewRequestWithContext(context.Background(), "POST", baseURL+"/evals", bytes.NewBuffer(reqBody))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %v\n", err)
		return
	}

	if resp.StatusCode >= 300 {
		fmt.Printf("API request failed with status %d: %s\n", resp.StatusCode, string(bodyBytes))
		return
	}

	fmt.Println(string(bodyBytes)) // Print raw JSON response
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have a suitable HTTP client like Guzzle installed
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
    die("Please set the AVALAI_API_KEY environment variable.\n");
}
$baseUrl = 'https://api.avalai.ir/v1';

$httpClient = new Client();

$evalConfig = [
    'name' => 'IT Ticket Categorization',
    'data_source_config' => [
        'type' => 'custom',
        'item_schema' => [
            'type' => 'object',
            'properties' => [
                'ticket_text' => ['type' => 'string'],
                'correct_label' => ['type' => 'string']
            ],
            'required' => ['ticket_text', 'correct_label']
        ],
        'include_sample_schema' => true
    ],
    'testing_criteria' => [
        [
            'type' => 'string_check',
            'name' => 'Match output to human label',
            'input' => '{{ sample.output_text }}',
            'operation' => 'eq',
            'reference' => '{{ item.correct_label }}'
        ]
    ]
];

try {
    $response = $httpClient->post($baseUrl . '/evals', [
        'headers' => [
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ],
        'json' => $evalConfig
    ]);

    echo $response->getBody()->getContents() . "\n";

} catch (RequestException $e) {
    echo 'Error creating eval: ' . $e->getMessage() . "\n";
    if ($e->hasResponse()) {
        echo 'Response body: ' . $e->getResponse()->getBody()->getContents() . "\n";
    }
}

?>

```

**Explanation: `data_source_config` parameter**

Running this eval will require a test data set that represents the type of data you expect your prompt to work with (more on creating the test data set later in this guide). In our `data_source_config` parameter, we specify that each **item** in the data set will conform to a [JSON schema](https://json-schema.org/) with two properties:

*   `ticket_text`: a string of text with the contents of a support ticket
*   `correct_label`: a "ground truth" output that the model should match, provided by a human

Since we will be referencing a **sample** in our test criteria (the output generated by a model given our prompt), we also set `include_sample_schema` to `true`.

```json
{
  "type": "custom",
  "item_schema": {
    "type": "object",
    "properties": {
      "ticket_text": {
        "type": "string"
      },
      "correct_label": {
        "type": "string"
      }
    },
    "required": [
      "ticket_text",
      "correct_label"
    ]
  },
  "include_sample_schema": true
}
```

**Explanation: `testing_criteria` parameter**

In our `testing_criteria`, we define how we will conclude if the model output satisfies our requirements for each item in the data set. In this case, we just want the model to output one of three category strings based on the input ticket. The string it outputs should exactly match the human-labeled `correct_label` field in our test data. So in this case, we will want to use a `string_check` grader to evaluate the output.

In the test configuration, we will introduce template syntax, represented by the `{{` and `}}` brackets below. This is how we will insert dynamic content into the test for this eval.

*   `{{ item.correct_label }}` refers to the ground truth value in our test data.
*   `{{ sample.output_text }}` refers to the content we will generate from a model to evaluate our prompt - we'll show how to do that when we actually kick off the eval run.

```json
{
  "type": "string_check",
  "name": "Match output to human label",
  "input": "{{ sample.output_text }}",
  "operation": "eq",
  "reference": "{{ item.correct_label }}"
}
```

After creating the eval, it will be assigned a UUID that you will need to address it later when kicking off a run.

```json
{
  "object": "eval",
  "id": "eval_67e321d23b54819096e6bfe140161184", // Example ID

  "data_source_config": {
    "type": "custom",
    "schema": { "... omitted for brevity..." }
  },
  "testing_criteria": [
    {
      "name": "Match output to human label",
      "id": "Match output to human label-c4fdf789-2fa5-407f-8a41-a6f4f9afd482", // Example ID

      "type": "string_check",
      "input": "{{ sample.output_text }}",
      "reference": "{{ item.correct_label }}",
      "operation": "eq"
    }
  ],
  "name": "IT Ticket Categorization",
  "created_at": 1742938578, // Example timestamp

  "metadata": {}
}
```

Now that we've created an eval that describes the desired behavior of our application, let's test a prompt with a set of test data.

## Test a prompt with your eval

Now that we have defined how we want our app to behave in an eval, let's construct a prompt that reliably generates the correct output for a representative sample of test data.

### Uploading test data

There are several ways to provide test data for eval runs, but it may be convenient to upload a [JSONL](https://jsonlines.org/) file that contains data in the schema we specified when we created our eval. A sample JSONL file that conforms to the schema we set up is below:

```json
{ "item": { "ticket_text": "My monitor won't turn on!", "correct_label": "Hardware" } }
{ "item": { "ticket_text": "I'm in vim and I can't quit!", "correct_label": "Software" } }
{ "item": { "ticket_text": "Best restaurants in Cleveland?", "correct_label": "Other" } }
```

This data set contains both test inputs and ground truth labels to compare model outputs against.

Next, let's upload our test data file to the AvalAI platform so we can reference it later. You can upload files via the AvalAI Files API. The samples below assume you are running the command in a directory where you saved the sample JSON data above to a file called `tickets.jsonl`:

**Upload a test data file**

```language-selector
bash=:curl https://api.avalai.ir/v1/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="evals" \
  -F file="@tickets.jsonl"

javascript=:import { OpenAI } from "openai"; // Use the OpenAI library structure
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function uploadFile() {
  try {
    const file = await client.files.create({
      file: fs.createReadStream("tickets.jsonl"),
      purpose: "evals",
    });
    console.log(file);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

uploadFile();

python=:from openai import OpenAI  # Use the OpenAI library structure
import os

client = OpenAI(
    api_key=os.getenv("AVALAI_API_KEY"), base_url="https://api.avalai.ir/v1"
)

try:
    with open("tickets.jsonl", "rb") as file_data:
        file_object = client.files.create(file=file_data, purpose="evals")
    print(file_object)
except FileNotFoundError:
    print("Error: tickets.jsonl not found.")
except Exception as e:
    print(f"Error uploading file: {e}")

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go" // Use the openai-go library
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Please set the AVALAI_API_KEY environment variable.")
		return
	}

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://api.avalai.ir/v1"
	client := openai.NewClientWithConfig(config)

	filePath := "tickets.jsonl"
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		fmt.Printf("Error: File not found at %s\n", filePath)
		return
	}

	resp, err := client.CreateFile(
		context.Background(),
		openai.FileRequest{
			FileName: filePath,
			FilePath: filePath, // Pass file path directly
			Purpose:  "evals",
		},
	)

	if err != nil {
		fmt.Printf("File upload error: %v\n", err)
		return
	}

	fmt.Printf("File uploaded successfully: ID=%s, Name=%s\n", resp.ID, resp.FileName)
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have the openai-php client installed

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
    die("Please set the AVALAI_API_KEY environment variable.\n");
}

// Configure the client to use AvalAI endpoint
$client = OpenAI::client($apiKey, [
    'base_url' => 'https://api.avalai.ir/v1'
]);

$filePath = 'tickets.jsonl';

if (!file_exists($filePath)) {
    die("Error: File not found at " . $filePath . "\n");
}

try {
    $file = $client->files()->upload([
        'purpose' => 'evals',
        'file' => fopen($filePath, 'r'), // Pass file handle
    ]);

    echo "File uploaded successfully:\n";
    print_r($file->toArray()); // Display the file object details

} catch (\Exception $e) {
    echo 'Error uploading file: ' . $e->getMessage() . "\n";
}

?>

```

When you upload the file, make note of the unique `id` property in the response payload - we will need to reference that value later:

```json
{
  "object": "file",
  "id": "file-CwHg45Fo7YXwkWRPUkLNHW", // Example ID

  "purpose": "evals",
  "filename": "tickets.jsonl",
  "bytes": 208,
  "created_at": 1742834798, // Example timestamp

  "status": "processed",
  "status_details": null
}
```

### Creating an eval run

With our test data in place, let's evaluate a prompt and see how it performs against our test criteria. Via API, we can do this by creating an eval run using the AvalAI Evals API.

Make sure to replace `YOUR_EVAL_ID` and `YOUR_FILE_ID` with the unique IDs of the eval configuration and test data files you created in the steps above.

```language-selector
bash=:curl https://api.avalai.ir/v1/evals/YOUR_EVAL_ID/runs \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Categorization text run",
  "data_source": {
    "type": "completions",
    "model": "gpt-5.5",
    "input": [
      {
        "role": "system",
        "content": "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of \"Hardware\", \"Software\", or \"Other\". Respond with only one of those words."
      },
      {
        "role": "user",
        "content": "{{ item.ticket_text }}"
      }
    ],
    "source": {
      "type": "file_id",
      "id": "YOUR_FILE_ID"
    }
  }
}'

javascript=:import { OpenAI } from "openai"; // Use the OpenAI library structure

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function createEvalRun(evalId, fileId) {
  try {
    // Note: The OpenAI Node.js library might not directly support /v1/evals/{eval_id}/runs
    // You might need to use a direct HTTP request library like 'axios' or 'node-fetch'
    // This example shows the conceptual structure.
    const response = await fetch(
      `https://api.avalai.ir/v1/evals/${evalId}/runs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Categorization text run",
          data_source: {
            type: "completions",
            model: "gpt-5.5",
            input: [
              {
                role: "system",
                content:
                  'You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of "Hardware", "Software", or "Other". Respond with only one of those words.',
              },
              {
                role: "user",
                content: "{{ item.ticket_text }}",
              },
            ],
            source: {
              type: "file_id",
              id: fileId,
            },
          },
        }),
      },
    );
    const runResult = await response.json();
    console.log(runResult);
  } catch (error) {
    console.error("Error creating eval run:", error);
  }
}

const evalId = "YOUR_EVAL_ID"; // Replace with your Eval ID
const fileId = "YOUR_FILE_ID"; // Replace with your File ID
createEvalRun(evalId, fileId);

python=:import requests  # Use requests for direct API calls if library lacks support
import json
import os

# Note: The OpenAI Python library might not directly support /v1/evals/{eval_id}/runs
# Using the 'requests' library for a direct API call is shown here.

api_key = os.getenv("AVALAI_API_KEY")
base_url = "https://api.avalai.ir/v1"
eval_id = "YOUR_EVAL_ID"  # Replace with your Eval ID
file_id = "YOUR_FILE_ID"  # Replace with your File ID

headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

run_config = {
    "name": "Categorization text run",
    "data_source": {
        "type": "completions",
        "model": "gpt-5.5",
        "input": [
            {
                "role": "system",
                "content": 'You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of "Hardware", "Software", or "Other". Respond with only one of those words.',
            },
            {"role": "user", "content": "{{ item.ticket_text }}"},
        ],
        "source": {"type": "file_id", "id": file_id},
    },
}

try:
    response = requests.post(
        f"{base_url}/evals/{eval_id}/runs", headers=headers, json=run_config
    )
    response.raise_for_status()  # Raise an exception for bad status codes
    run_result = response.json()
    print(json.dumps(run_result, indent=2))
except requests.exceptions.RequestException as e:
    print(f"Error creating eval run: {e}")
    if response is not None:
        print(f"Response body: {response.text}")

go=:package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	// Note: The openai-go library might not directly support /v1/evals/{eval_id}/runs
	// Using Go's standard http package for direct API call.
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Source struct {
	Type string `json:"type"`
	ID   string `json:"id"`
}

type DataSource struct {
	Type   string    `json:"type"`
	Model  string    `json:"model"`
	Input  []Message `json:"input"`
	Source Source    `json:"source"`
}

type EvalRunRequest struct {
	Name       string     `json:"name"`
	DataSource DataSource `json:"data_source"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Please set the AVALAI_API_KEY environment variable.")
		return
	}
	baseURL := "https://api.avalai.ir/v1"
	evalID := "YOUR_EVAL_ID" // Replace with your Eval ID
	fileID := "YOUR_FILE_ID" // Replace with your File ID

	runReq := EvalRunRequest{
		Name: "Categorization text run",
		DataSource: DataSource{
			Type:  "completions",
			Model: "gpt-5.5",
			Input: []Message{
				{
					Role:    "system",
					Content: "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of \"Hardware\", \"Software\", or \"Other\". Respond with only one of those words.",
				},
				{
					Role:    "user",
					Content: "{{ item.ticket_text }}",
				},
			},
			Source: Source{
				Type: "file_id",
				ID:   fileID,
			},
		},
	}

	reqBody, err := json.Marshal(runReq)
	if err != nil {
		fmt.Printf("Error marshalling request: %v\n", err)
		return
	}

	url := fmt.Sprintf("%s/evals/%s/runs", baseURL, evalID)
	req, err := http.NewRequestWithContext(context.Background(), "POST", url, bytes.NewBuffer(reqBody))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %v\n", err)
		return
	}

	if resp.StatusCode >= 300 {
		fmt.Printf("API request failed with status %d: %s\n", resp.StatusCode, string(bodyBytes))
		return
	}

	fmt.Println(string(bodyBytes)) // Print raw JSON response
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have a suitable HTTP client like Guzzle installed
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
    die("Please set the AVALAI_API_KEY environment variable.\n");
}
$baseUrl = 'https://api.avalai.ir/v1';
$evalId = 'YOUR_EVAL_ID'; // Replace with your Eval ID
$fileId = 'YOUR_FILE_ID'; // Replace with your File ID

$httpClient = new Client();

$runConfig = [
    'name' => 'Categorization text run',
    'data_source' => [
        'type' => 'completions',
        'model' => 'gpt-5.5',
        'input' => [
            [
                'role' => 'system',
                'content' => 'You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of "Hardware", "Software", or "Other". Respond with only one of those words.'
            ],
            [
                'role' => 'user',
                'content' => '{{ item.ticket_text }}'
            ]
        ],
        'source' => [
            'type' => 'file_id',
            'id' => $fileId
        ]
    ]
];

try {
    $response = $httpClient->post($baseUrl . '/evals/' . $evalId . '/runs', [
        'headers' => [
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ],
        'json' => $runConfig
    ]);

    echo $response->getBody()->getContents() . "\n";

} catch (RequestException $e) {
    echo 'Error creating eval run: ' . $e->getMessage() . "\n";
    if ($e->hasResponse()) {
        echo 'Response body: ' . $e->getResponse()->getBody()->getContents() . "\n";
    }
}

?>

```

When we create the run, we set up a [Chat Completions](en/api-reference/chat.md) messages array with the prompt we would like to test. This prompt is used to generate a model response for every line of test data in your data set. We can use the double curly brace syntax to template in the dynamic variable `item.ticket_text`, which is drawn from the current test data item.

If the eval run is successfully created, you'll receive an API response that looks like this (structure shown, specific IDs and details will vary):

```json
{
  "object": "eval.run",
  "id": "evalrun_67e44c73eb6481909f79a457749222c7", // Example ID

  "eval_id": "eval_67e44c5becec81909704be0318146157", // Example ID

  "report_url": null, // AvalAI API may not provide a report URL

  "status": "queued",
  "model": "gpt-5.5",
  "name": "Categorization text run",
  "created_at": 1743015028, // Example timestamp

  "result_counts": { "...": "..." }, // Structure depends on API implementation

  "per_model_usage": null, // Structure depends on API implementation

  "per_testing_criteria_results": null, // Structure depends on API implementation

  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_id",
      "id": "file-J7MoX9ToHXp2TutMEeYnwj" // Example ID

    },
    "input_messages": {
      "type": "template",
      "template": [
        {
          "type": "message",
          "role": "system",
          "content": {
            "type": "input_text",
            "text": "You are an expert in...." // Truncated for brevity

          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "{{item.ticket_text}}"
          }
        }
      ]
    },
    "model": "gpt-5.5",
    "sampling_params": null
  },
  "error": null,
  "metadata": {}
}
```

Your eval run has now been queued, and it will execute asynchronously as it processes every row in your data set. With our configuration, it will generate completions for testing with the prompt and model we specified.

## Analyze the results

Depending on the size of your dataset, the eval run may take some time to complete. You can fetch the current status of an eval run via the AvalAI Evals API:

```language-selector
bash=:curl https://api.avalai.ir/v1/evals/YOUR_EVAL_ID/runs/YOUR_EVAL_RUN_ID \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json"

javascript=:import { OpenAI } from "openai"; // Use the OpenAI library structure

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function getEvalRunStatus(evalId, runId) {
  try {
    // Note: The OpenAI Node.js library might not directly support GET /v1/evals/{eval_id}/runs/{run_id}
    // You might need to use a direct HTTP request library like 'axios' or 'node-fetch'
    // This example shows the conceptual structure.
    const response = await fetch(
      `https://api.avalai.ir/v1/evals/${evalId}/runs/${runId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    const runStatus = await response.json();
    console.log(runStatus);
  } catch (error) {
    console.error("Error fetching eval run status:", error);
  }
}

const evalId = "YOUR_EVAL_ID"; // Replace with your Eval ID
const runId = "YOUR_EVAL_RUN_ID"; // Replace with your Eval Run ID
getEvalRunStatus(evalId, runId);

python=:import requests  # Use requests for direct API calls if library lacks support
import json
import os

# Note: The OpenAI Python library might not directly support GET /v1/evals/{eval_id}/runs/{run_id}
# Using the 'requests' library for a direct API call is shown here.

api_key = os.getenv("AVALAI_API_KEY")
base_url = "https://api.avalai.ir/v1"
eval_id = "YOUR_EVAL_ID"  # Replace with your Eval ID
run_id = "YOUR_EVAL_RUN_ID"  # Replace with your Eval Run ID

headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

try:
    response = requests.get(
        f"{base_url}/evals/{eval_id}/runs/{run_id}", headers=headers
    )
    response.raise_for_status()  # Raise an exception for bad status codes
    run_status = response.json()
    print(json.dumps(run_status, indent=2))
except requests.exceptions.RequestException as e:
    print(f"Error fetching eval run status: {e}")
    if response is not None:
        print(f"Response body: {response.text}")

go=:package main

import (
	"bytes" // Import bytes package
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	// Note: The openai-go library might not directly support GET /v1/evals/{eval_id}/runs/{run_id}
	// Using Go's standard http package for direct API call.
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Please set the AVALAI_API_KEY environment variable.")
		return
	}
	baseURL := "https://api.avalai.ir/v1"
	evalID := "YOUR_EVAL_ID"    // Replace with your Eval ID
	runID := "YOUR_EVAL_RUN_ID" // Replace with your Eval Run ID

	url := fmt.Sprintf("%s/evals/%s/runs/%s", baseURL, evalID, runID)
	req, err := http.NewRequestWithContext(context.Background(), "GET", url, nil) // Use GET method
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json") // Content-Type might not be strictly needed for GET

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %v\n", err)
		return
	}

	if resp.StatusCode >= 300 {
		fmt.Printf("API request failed with status %d: %s\n", resp.StatusCode, string(bodyBytes))
		return
	}

	// Attempt to pretty-print if it's JSON
	var prettyJSON bytes.Buffer
	err = json.Indent(&prettyJSON, bodyBytes, "", "  ")
	if err == nil {
		fmt.Println(prettyJSON.String())
	} else {
		fmt.Println(string(bodyBytes)) // Print raw if not valid JSON
	}
}

php=:<?php

require 'vendor/autoload.php'; // Ensure you have a suitable HTTP client like Guzzle installed
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
    die("Please set the AVALAI_API_KEY environment variable.\n");
}
$baseUrl = 'https://api.avalai.ir/v1';
$evalId = 'YOUR_EVAL_ID'; // Replace with your Eval ID
$runId = 'YOUR_EVAL_RUN_ID'; // Replace with your Eval Run ID

$httpClient = new Client();

try {
    $response = $httpClient->get($baseUrl . '/evals/' . $evalId . '/runs/' . $runId, [
        'headers' => [
            'Authorization' => 'Bearer ' . $apiKey,
            'Accept' => 'application/json', // Request JSON response
        ]
    ]);

    // Decode and pretty-print the JSON response
    $body = $response->getBody()->getContents();
    $decoded = json_decode($body);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    } else {
        echo $body . "\n"; // Print raw body if not JSON
    }


} catch (RequestException $e) {
    echo 'Error fetching eval run status: ' . $e->getMessage() . "\n";
    if ($e->hasResponse()) {
        echo 'Response body: ' . $e->getResponse()->getBody()->getContents() . "\n";
    }
}

?>

```

You'll need the UUID of both your eval and eval run to fetch its status. When you do, you'll see eval run data that looks similar to the creation response, but with updated `status` (e.g., `completed`), `result_counts`, `per_model_usage`, and `per_testing_criteria_results` fields populated.

```json
{
  "object": "eval.run",
  "id": "evalrun_67e44c73eb6481909f79a457749222c7", // Example ID

  "eval_id": "eval_67e44c5becec81909704be0318146157", // Example ID

  "report_url": null, // AvalAI API may not provide a report URL

  "status": "completed", // Status updated

  "model": "gpt-5.5",
  "name": "Categorization text run",
  "created_at": 1743015028, // Example timestamp

  "result_counts": { // Results are populated

    "total": 3,
    "errored": 0,
    "failed": 0,
    "passed": 3
  },
  "per_model_usage": [ // Usage data populated

    {
      "model_name": "gpt-5.4-2026-03-05", // Example model version

      "invocation_count": 3,
      "prompt_tokens": 166,
      "completion_tokens": 6,
      "total_tokens": 172,
      "cached_tokens": 0
    }
  ],
  "per_testing_criteria_results": [ // Criteria results populated

    {
      "testing_criteria": "Match output to human label-40d67441-5000-4754-ab8c-181c125803ce", // Example criteria ID

      "passed": 3,
      "failed": 0
    }
  ],
  "data_source": {
    // ... (same as creation response)

  },
  "error": null,
  "metadata": {}
}
```

The API response contains granular information about test criteria results and API usage for generating model responses.

In our simple test, the model reliably generated the content we wanted for a small test case sample. In reality, you will often have to run your eval with more criteria, different prompts, and different data sets. But the process above gives you the tools you need via the AvalAI API to build robust evals for your LLM apps!

## Related Resources

*   [AvalAI Chat Completions API](en/api-reference/chat.md)
*   [AvalAI API Reference Index](en/api-reference/introduction.md) (For general API structure and Files API details)
*   [Fine-tuning Guide](en/guides/fine-tuning.md) (For improving model performance)
