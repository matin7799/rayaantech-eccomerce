# Processing Excel Files with AvalAI API

## Introduction

The AvalAI API provides powerful capabilities for processing Excel spreadsheets (XLS and XLSX files) using advanced language models. This guide demonstrates how to leverage OpenAI, Anthropic (Claude), and Gemini models through AvalAI's compatible API to analyze, extract information, and interact with spreadsheet data. These capabilities enable applications to understand and work with tabular data, making them ideal for data analysis, information extraction, and automated data processing workflows.

> This guide is inspired by [How to query CSV and Excel files using LangChain](https://medium.com/@satyadeepbehera_8504/how-to-query-csv-and-excel-files-using-langchain-d8f1ae0e5cc8) with adaptations for AvalAI's implementation.

## Key Features

- **Tabular data understanding** - Process structured data in spreadsheet formats
- **Chart and table analysis** - Extract and interpret data from tables and charts
- **Data summarization** - Generate concise summaries of spreadsheet content
- **Information extraction** - Pull specific information from spreadsheets into structured formats
- **Question answering** - Ask questions about spreadsheet data and receive accurate answers
- **Data transformation** - Convert and manipulate spreadsheet data
- **Unified API access** - Access multiple model providers through a consistent interface

## Available Models

The following models support Excel/spreadsheet processing through the AvalAI API:

### OpenAI Models

- **gpt-5.5** - Advanced model with strong data understanding capabilities
- **gpt-5.4-mini** - More efficient model for data processing

### Anthropic (Claude) Models

- **claude-opus-4-7** - Most Advanced model with strong data understanding capabilities
- **claude-sonnet-4-6** - Latest Sonnet version with improved data processing
- **claude-haiku-4-5** - More efficient model for data processing

### Gemini Models

- **gemini-3.1-pro-preview** - Most Advanced model with improved data understanding
- **gemini-3.5-flash** - Fast multimodal model for data processing
- **gemini-2.5-pro** - Advanced model with improved data understanding
- **gemini-2.5-flash** - efficient model for data processing

## Basic Usage

There are two primary approaches for processing Excel files with the AvalAI API:

### Simple Workflow Approach

This approach is best for smaller files that can fit within the model's context window. It involves converting the Excel file to a text representation and sending it to the model.

#### Base64-encoded Excel Processing

You can encode Excel files directly as base64 and send them to the API:

```language-selector
python=:from openai import OpenAI
import base64
import pandas as pd
from io import BytesIO

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Method 1: From a local file
with open("path/to/your/spreadsheet.xlsx", "rb") as f:
    file_data = f.read()

# Encode the Excel data to base64
encoded_file = base64.b64encode(file_data).decode("utf-8")
base64_url = f"data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,{encoded_file}"

# Create the request with the base64-encoded file
file_content = [
    {"type": "text", "text": "Analyze this spreadsheet and provide key insights."},
    {
        "type": "file",
        "file": {
            "file_data": base64_url,
        },
    },
]

# Send the request to the model
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": file_content}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import fs from "fs";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to get base64 encoded Excel file
async function getBase64Excel() {
  // From a local file
  const buffer = fs.readFileSync("path/to/your/spreadsheet.xlsx");
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buffer.toString("base64")}`;
}

// Main function
async function processExcel() {
  const base64Excel = await getBase64Excel();

  // Create the request with the base64-encoded file
  const fileContent = [
    {
      type: "text",
      text: "Analyze this spreadsheet and provide key insights.",
    },
    {
      type: "file",
      file: {
        file_data: base64Excel,
      },
    },
  ];

  // Send the request to the model
  const response = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [{ role: "user", content: fileContent }],
  });

  console.log(response.choices[0].message.content);
}

processExcel();

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	openai "github.com/openai/openai-go"
	"io/ioutil"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Get Excel data
	excelData, err := getExcelData()
	if err != nil {
		fmt.Printf("Error getting Excel data: %v\n", err)
		return
	}

	// Encode the Excel data to base64
	encodedFile := base64.StdEncoding.EncodeToString(excelData)
	base64URL := fmt.Sprintf("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,%s", encodedFile)

	// Create the request with the base64-encoded file
	fileContent := []openai.ChatMessageContent{
		{
			Type: openai.ChatMessageContentTypeText,
			Text: "Analyze this spreadsheet and provide key insights.",
		},
		{
			Type: openai.ChatMessageContentTypeFile,
			File: &openai.ChatMessageFile{
				FileData: base64URL,
			},
		},
	}

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fileContent,
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

// Function to get Excel data from local file
func getExcelData() ([]byte, error) {
	// From a local file
	return ioutil.ReadFile("path/to/your/spreadsheet.xlsx")
}

php=:<?php

require 'vendor/autoload.php';

// Initialize the client with AvalAI API
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

// Function to get base64 encoded Excel file
function getBase64Excel() {
	// From a local file
	$fileData = file_get_contents("path/to/your/spreadsheet.xlsx");
	return "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," . base64_encode($fileData);
}

// Get the base64 encoded Excel file
$base64Excel = getBase64Excel();

// Create the request with the base64-encoded file
$fileContent = [
	[
		"type" => "text",
		"text" => "Analyze this spreadsheet and provide key insights."
	],
	[
		"type" => "file",
		"file" => [
			"file_data" => $base64Excel
		]
	]
];

// Send the request to the model
$completion = $client->chat()->create([
	'model' => 'gpt-5.5',
	'messages' => [
		[
			'role' => 'user',
			'content' => $fileContent
		]
	]
]);

echo $completion->choices[0]->message->content;

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
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Summarize the uploaded file."},
                {"type": "input_file", "file_id": "file_abc123"},
            ],
        }
    ],
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "Summarize the uploaded file." },
        { type: "input_file", file_id: "file_abc123" },
      ],
    },
  ],
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Summarize the uploaded file."
          },
          {
            "type": "input_file",
            "file_id": "file_abc123"
          }
        ]
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


1. **Simple Workflow Approach**: Converting Excel data to text and sending it to the model
2. **LangChain CSV Agent Approach**: Using specialized agents for more advanced data analysis

#### DataFrame Conversion

For more control over the data, you can convert Excel files to a pandas DataFrame and then to a text representation:

```language-selector
python=:from openai import OpenAI
import pandas as pd

# Initialize the client with AvalAI API
client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Load Excel file into pandas DataFrame
df = pd.read_excel("path/to/your/spreadsheet.xlsx")

# Convert DataFrame to string representation
df_string = df.to_string()

# Create a prompt with the DataFrame string
prompt = f"""
I have the following spreadsheet data:

{df_string}

Please analyze this data and provide key insights.
"""

# Send the request to the model
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": prompt}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import * as XLSX from "xlsx";

// Initialize the client with AvalAI API
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to convert Excel to text representation
function excelToText(filePath) {
  // Read the Excel file
  const workbook = XLSX.readFile(filePath);

  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Convert to string representation
  const headers = Object.keys(jsonData[0]);
  let textRepresentation = headers.join("\t") + "\n";

  jsonData.forEach((row) => {
    textRepresentation +=
      headers.map((header) => row[header]).join("\t") + "\n";
  });

  return textRepresentation;
}

async function analyzeExcel() {
  // Get text representation of Excel file
  const excelText = excelToText("path/to/your/spreadsheet.xlsx");

  // Create prompt with the Excel data
  const prompt = `
I have the following spreadsheet data:

${excelText}

Please analyze this data and provide key insights.
`;

  // Send the request to the model
  const response = await client.chat.completions.create({
    model: "claude-sonnet-4-6",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(response.choices[0].message.content);
}

analyzeExcel();

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
	"github.com/xuri/excelize/v2"
	"os"
	"strings"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	// Convert Excel to text representation
	excelText, err := excelToText("path/to/your/spreadsheet.xlsx")
	if err != nil {
		fmt.Printf("Error converting Excel: %v\n", err)
		return
	}

	// Create prompt with the Excel data
	prompt := fmt.Sprintf(`
I have the following spreadsheet data:

%s

Please analyze this data and provide key insights.
`, excelText)

	// Send the request to the model
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "claude-sonnet-4-6",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
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

// Function to convert Excel to text representation
func excelToText(filePath string) (string, error) {
	// Open Excel file
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	// Get all sheet names
	sheets := f.GetSheetList()
	if len(sheets) == 0 {
		return "", fmt.Errorf("no sheets found")
	}

	// Get all rows from the first sheet
	rows, err := f.GetRows(sheets[0])
	if err != nil {
		return "", err
	}

	// Convert to text representation
	var sb strings.Builder
	for _, row := range rows {
		sb.WriteString(strings.Join(row, "\t"))
		sb.WriteString("\n")
	}

	return sb.String(), nil
}

php=:<?php

require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

// Initialize the client with AvalAI API
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

// Function to convert Excel to text representation
function excelToText($filePath) {
	// Load Excel file
	$spreadsheet = IOFactory::load($filePath);
	$worksheet = $spreadsheet->getActiveSheet();

	// Get the highest row and column
	$highestRow = $worksheet->getHighestRow();
	$highestColumn = $worksheet->getHighestColumn();

	// Convert to text representation
	$textRepresentation = '';
	for ($row = 1; $row <= $highestRow; $row++) {
		$rowData = [];
		for ($col = 'A'; $col <= $highestColumn; $col++) {
			$rowData[] = $worksheet->getCell($col . $row)->getValue();
		}
		$textRepresentation .= implode("\t", $rowData) . "\n";
	}

	return $textRepresentation;
}

// Get text representation of Excel file
$excelText = excelToText("path/to/your/spreadsheet.xlsx");

// Create prompt with the Excel data
$prompt = "
I have the following spreadsheet data:

$excelText

Please analyze this data and provide key insights.
";

// Send the request to the model
$completion = $client->chat()->create([
	'model' => 'claude-sonnet-4-6',
	'messages' => [
		[
			'role' => 'user',
			'content' => $prompt
		]
	]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `claude-sonnet-4-6` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the uploaded file.",
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
  input: "Summarize the uploaded file.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize the uploaded file.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### LangChain CSV Agent Approach

For more advanced analysis, especially with larger files, you can use the LangChain CSV Agent. This approach provides more sophisticated data analysis capabilities by allowing the model to execute Python code to analyze the data.

#### Create CSV Agent

```language-selector
python=:from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_csv_agent
import os

# Set your API key
os.environ["AVALAI_API_KEY"] = "your-avalai-api-key"
os.environ["OPENAI_BASE_URL"] = "https://api.avalai.ir/v1"

# Initialize the language model
llm = ChatOpenAI(model="gpt-5.5", temperature=0)

# Create the CSV agent
agent_executor = create_csv_agent(
    llm,
    "path/to/your/spreadsheet.xlsx",  # Works with both CSV and Excel files
    agent_type="openai-tools",
    verbose=True,
)

# Ask questions about the data
response = agent_executor.invoke(
    {"input": "What are the top 5 values in the sales column?"}
)

print(response["output"])

# Ask another question
response = agent_executor.invoke(
    {"input": "Calculate the average value for each category and create a summary."}
)

print(response["output"])

javascript=:// JavaScript implementation using LangChain.js
import { ChatOpenAI } from "@langchain/openai";
import { createCSVAgent } from "langchain/agents";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set your API key
process.env.AVALAI_API_KEY = "your-avalai-api-key";
process.env.OPENAI_BASE_URL = "https://api.avalai.ir/v1";

// Initialize the language model
const llm = new ChatOpenAI({
  modelName: "gpt-5.5",
  temperature: 0,
});

async function runCSVAgent() {
  // Create the CSV agent
  const agentExecutor = await createCSVAgent({
    llm,
    path: "path/to/your/spreadsheet.xlsx", // Works with both CSV and Excel files
    agentType: "openai-tools",
    verbose: true,
  });

  // Ask questions about the data
  const response1 = await agentExecutor.invoke({
    input: "What are the top 5 values in the sales column?",
  });

  console.log(response1.output);

  // Ask another question
  const response2 = await agentExecutor.invoke({
    input:
      "Calculate the average value for each category and create a summary.",
  });

  console.log(response2.output);
}

runCSVAgent();

```

#### Create Pandas DataFrame Agent

For even more advanced data analysis, you can use the Pandas DataFrame Agent:

```language-selector
python=:from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
import os

# Set your API key
os.environ["AVALAI_API_KEY"] = "your-avalai-api-key"
os.environ["OPENAI_BASE_URL"] = "https://api.avalai.ir/v1"

# Load the Excel file
df = pd.read_excel("path/to/your/spreadsheet.xlsx")

# Initialize the language model
llm = ChatOpenAI(model="gpt-5.5", temperature=0)

# Create the Pandas DataFrame agent
agent_executor = create_pandas_dataframe_agent(
    llm,
    df,
    agent_type="tool-calling",  # Using the newer tool-calling agent type
    verbose=True,
    allow_dangerous_code=True,  # Only enable in trusted environments
)

# Ask complex data analysis questions
response = agent_executor.invoke(
    {
        "input": "Create a summary of the data, including key statistics and any notable trends."
    }
)

print(response["output"])

# Ask for data visualization code
response = agent_executor.invoke(
    {
        "input": "Generate Python code to create a bar chart of the top 5 categories by revenue."
    }
)

print(response["output"])

javascript=:// JavaScript implementation using LangChain.js
import { ChatOpenAI } from "@langchain/openai";
import { createPandasDataFrameAgent } from "langchain/agents";
import { readFile } from "fs/promises";
import * as XLSX from "xlsx";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set your API key
process.env.AVALAI_API_KEY = "your-avalai-api-key";
process.env.OPENAI_BASE_URL = "https://api.avalai.ir/v1";

async function loadExcelAsDataFrame(filePath) {
  // This is a simplified version - in a real implementation,
  // you would need to convert the Excel data to a format
  // that the DataFrame agent can work with
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return jsonData;
}

async function runPandasAgent() {
  // Load the Excel file
  const df = await loadExcelAsDataFrame("path/to/your/spreadsheet.xlsx");

  // Initialize the language model
  const llm = new ChatOpenAI({
    modelName: "gpt-5.5",
    temperature: 0,
  });

  // Create the Pandas DataFrame agent
  const agentExecutor = await createPandasDataFrameAgent({
    llm,
    df,
    agentType: "tool-calling",
    verbose: true,
  });

  // Ask complex data analysis questions
  const response1 = await agentExecutor.invoke({
    input:
      "Create a summary of the data, including key statistics and any notable trends.",
  });

  console.log(response1.output);

  // Ask for data visualization code
  const response2 = await agentExecutor.invoke({
    input:
      "Generate code to create a bar chart of the top 5 categories by revenue.",
  });

  console.log(response2.output);
}

runPandasAgent();

```

## Using Different Model Providers

You can use any of the supported models by changing the model parameter in your requests:

### OpenAI Example

```python
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": prompt}],
)
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
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Anthropic (Claude) Example

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": prompt}],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `claude-sonnet-4-6` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Gemini Example

```python
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",  # Updated from deprecated gemini-2.5-pro
    messages=[{"role": "user", "content": prompt}],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Model-Specific Limitations

### OpenAI Models

- **Maximum file size**: 25MB per request
- **Token usage**: Varies by model, typically 1-3 tokens per cell
- **Visual elements**: Can analyze charts and visual elements within spreadsheets
- **Best suited for**: General data analysis, pattern recognition, and summarization

### Anthropic (Claude) Models

- **Maximum file size**: 32MB per request
- **Token usage**: Typically 1-2 tokens per cell depending on content
- **Visual elements**: Can analyze charts and tables within spreadsheets
- **Best suited for**: Detailed data analysis, complex document understanding tasks

### Gemini Models

## Use Cases

### Data Analysis

```language-selector
python=:from openai import OpenAI
import pandas as pd

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Load Excel file into pandas DataFrame
df = pd.read_excel("sales_data.xlsx")

# Convert DataFrame to string representation
df_string = df.to_string()

prompt = f"""
I have the following sales data:

{df_string}

Please analyze this data and provide:
1. Monthly sales trends
2. Top-performing products
3. Regions with highest growth
4. Any anomalies or outliers
"""

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": prompt}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import * as XLSX from "xlsx";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to convert Excel to text representation
function excelToText(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Convert to string representation
  const headers = Object.keys(jsonData[0]);
  let textRepresentation = headers.join("\t") + "\n";

  jsonData.forEach((row) => {
    textRepresentation +=
      headers.map((header) => row[header]).join("\t") + "\n";
  });

  return textRepresentation;
}

async function analyzeSalesData() {
  const excelText = excelToText("sales_data.xlsx");

  const prompt = `
I have the following sales data:

${excelText}

Please analyze this data and provide:
1. Monthly sales trends
2. Top-performing products
3. Regions with highest growth
4. Any anomalies or outliers
`;

  const response = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(response.choices[0].message.content);
}

analyzeSalesData();

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
    input="Summarize the uploaded file.",
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
  input: "Summarize the uploaded file.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize the uploaded file.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Data Summarization

```language-selector
python=:from openai import OpenAI
import pandas as pd

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Load Excel file into pandas DataFrame
df = pd.read_excel("financial_report.xlsx")

# Convert DataFrame to string representation
df_string = df.to_string()

prompt = f"""
I have the following financial data:

{df_string}

Please provide a concise executive summary of this financial report, highlighting:
1. Overall financial health
2. Key metrics and their performance
3. Areas of concern
4. Recommendations for improvement
"""

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": prompt}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";
import * as XLSX from "xlsx";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Function to convert Excel to text representation
function excelToText(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Convert to string representation
  const headers = Object.keys(jsonData[0]);
  let textRepresentation = headers.join("\t") + "\n";

  jsonData.forEach((row) => {
    textRepresentation +=
      headers.map((header) => row[header]).join("\t") + "\n";
  });

  return textRepresentation;
}

async function summarizeFinancialReport() {
  const excelText = excelToText("financial_report.xlsx");

  const prompt = `
I have the following financial data:

${excelText}

Please provide a concise executive summary of this financial report, highlighting:
1. Overall financial health
2. Key metrics and their performance
3. Areas of concern
4. Recommendations for improvement
`;

  const response = await client.chat.completions.create({
    model: "claude-sonnet-4-6",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(response.choices[0].message.content);
}

summarizeFinancialReport();

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `claude-sonnet-4-6` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the uploaded file.",
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
  input: "Summarize the uploaded file.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize the uploaded file.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Question Answering

```language-selector
python=:from langchain_openai import ChatOpenAI
from langchain_experimental.agents import create_csv_agent
import os

# Set your API key
os.environ["AVALAI_API_KEY"] = "your-avalai-api-key"
os.environ["OPENAI_BASE_URL"] = "https://api.avalai.ir/v1"

# Initialize the language model
llm = ChatOpenAI(
    model="gemini-3.1-pro-preview", temperature=0
)  # Updated from deprecated gemini-2.5-pro

# Create the CSV agent
agent_executor = create_csv_agent(
    llm, "inventory_data.xlsx", agent_type="openai-tools", verbose=True
)

# Ask specific questions about the inventory
questions = [
    "How many units of product XYZ are currently in stock?",
    "Which warehouse has the lowest inventory levels?",
    "What's the total value of all inventory?",
    "Which products need to be restocked soon (less than 10 units left)?",
    "Compare inventory levels between Q1 and Q2.",
]

for question in questions:
    response = agent_executor.invoke({"input": question})
    print(f"Q: {question}")
    print(f"A: {response['output']}")
    print("---")

javascript=:// JavaScript implementation using LangChain.js
import { ChatOpenAI } from "@langchain/openai";
import { createCSVAgent } from "langchain/agents";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set your API key
process.env.AVALAI_API_KEY = "your-avalai-api-key";
process.env.OPENAI_BASE_URL = "https://api.avalai.ir/v1";

async function askInventoryQuestions() {
  // Initialize the language model
  const llm = new ChatOpenAI({
    modelName: "gemini-2.5-pro",
    temperature: 0,
  });

  // Create the CSV agent
  const agentExecutor = await createCSVAgent({
    llm,
    path: "inventory_data.xlsx",
    agentType: "openai-tools",
    verbose: true,
  });

  // Ask specific questions about the inventory
  const questions = [
    "How many units of product XYZ are currently in stock?",
    "Which warehouse has the lowest inventory levels?",
    "What's the total value of all inventory?",
    "Which products need to be restocked soon (less than 10 units left)?",
    "Compare inventory levels between Q1 and Q2.",
  ];

  for (const question of questions) {
    const response = await agentExecutor.invoke({ input: question });
    console.log(`Q: ${question}`);
    console.log(`A: ${response.output}`);
    console.log("---");
  }
}

askInventoryQuestions();

```

## Best Practices

When working with Excel files and LLMs, consider these best practices:

1. **Data Preparation**

   - Clean your data before processing (handle missing values, fix formatting issues)
   - Consider removing unnecessary columns to reduce token usage
   - For large files, focus on the most relevant sections

2. **Chunking Large Files**

   - For spreadsheets that exceed model context limits, split into logical sections
   - Process each sheet separately if working with multi-sheet workbooks
   - Consider aggregating data before sending to the model

3. **Prompt Engineering**

   - Be specific about what analysis you want from the data
   - Include column descriptions if column names are ambiguous
   - Specify the output format you want (bullet points, tables, etc.)

4. **Model Selection**

   - Use OpenAI models for general data analysis and pattern recognition
   - Use Claude models for detailed analysis of complex data
   - Use Gemini models for spreadsheets with visual elements like charts

5. **Approach Selection**
   - Use the simple workflow approach for quick analysis of smaller datasets
   - Use LangChain CSV Agent for more complex analysis requiring computation
   - Consider combining approaches for the best results

## Related Links

- [RAG Best Practices](en/guides/rag-best-practices.md) - Learn about Retrieval-Augmented Generation for larger datasets
- [Processing PDFs in Chat Completion API](en/examples/processing_pdfs_in_chat_completion_api.md) - Direct PDF Processing
- [LangChain Documentation](https://python.langchain.com/api_reference/experimental/agents/langchain_experimental.agents.agent_toolkits.csv.base.create_csv_agent.html#langchain_experimental.agents.agent_toolkits.csv.base.create_csv_agent) - More details on the CSV agent
