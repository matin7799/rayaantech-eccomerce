# Web Search Tool

Allow models to search the web for the latest information before generating a response.

Using the [Responses API](/api-reference/responses.md), you can enable web search by configuring it in the `tools` array in an API request to generate content. Like any other tool, the model can choose to search the web or not based on the content of the input prompt.

## Web search tool example

```language-selector
javascript=:import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
}); // Use custom base URL

const response = await client.responses.create({
  model: "gpt-5.5",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?",
});

console.log(response.output_text);

python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)  # Use custom base URL

response = client.responses.create(
    model="gpt-5.5",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{"type": "web_search"}],
 "input": "what was a positive news story from today?"
 }'

go=:package main

import (
	"context"
	"fmt"
	"github.com/openai/openai-go" // OpenAI Go client
	"github.com/openai/openai-go/option"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	client := openai.NewClient(
		option.WithAPIKey(apiKey),
		option.WithBaseURL("https://api.avalai.ir/v1"), // Use custom base URL
	)

	resp, err := client.Responses.Create(
		context.Background(),
		openai.ResponsesCreateParams{
			Model: "gpt-5.5",
			Tools: []openai.ToolParamUnion{
				openai.ToolParam{
					Type: openai.F("web_search"),
				},
			},
			Input: "What was a positive news story from today?",
		},
	)

	if err != nil {
		fmt.Printf("Response creation error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText)
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php'); // Assuming Composer autoload

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, ["base_uri" => "https://api.avalai.ir/v1"]); // Using OpenAI PHP client with custom base URL

$response = $client->responses()->create([
'model' => 'gpt-5.5',
'tools' => [['type' => 'web_search']],
'input' => 'What was a positive news story from today?',
]);

echo $response->output_text;
?>

```

## Web search tool versions

Use `web_search` for new Responses API integrations. The older `web_search_preview` tool remains available for legacy integrations, but it does not support newer controls such as filters, live-access control, and returned-token budgets.

You can force web search with the `tool_choice` parameter, for example `{ "type": "web_search" }`, when search must run for a request.

## Output and citations

Model responses that use the web search tool will include two parts:

*   A `web_search_call` output item with the ID of the search call.
*   A `message` output item containing:
    *   The text result in `message.content[0].text`
    *   Annotations `message.content[0].annotations` for the cited URLs

By default, the model's response will include inline citations for URLs found in the web search results. In addition to this, the `url_citation` annotation object will contain the URL, title and location of the cited source.

When displaying web results or information contained in web results to end users, inline citations must be made clearly visible and clickable in your user interface.

```json
[
  {
    "type": "web_search_call",
    "id": "ws_67c9fa0502748190b7dd390736892e100be649c1a5ff9609",
    "status": "completed"
  },
  {
    "id": "msg_67c9fa077e288190af08fdffda2e34f20be649c1a5ff9609",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "On March 6, 2025, several news...",
        "annotations": [
          {
            "type": "url_citation",
            "start_index": 2606,
            "end_index": 2758,
            "url": "https://...",

            "title": "Title..."
          }
        ]
      }
    ]
  }
]
```

## User location

To refine search results based on geography, you can specify an approximate user location using country, city, region, and/or timezone.

*   The `city` and `region` fields are free text strings, like `Minneapolis` and `Minnesota` respectively.
*   The `country` field is a two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1), like `US`.
*   The `timezone` field is an [IANA timezone](https://timeapi.io/documentation/iana-timezones) like `America/Chicago`.

### Customizing user location

```language-selector
python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)  # Use custom base URL

response = client.responses.create(
    model="gpt-5.5",
    tools=[
        {
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "country": "GB",
                "city": "London",
                "region": "London",
            },
        }
    ],
    input="What are the best restaurants around Granary Square?",
)

print(response.output_text)

javascript=:import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
}); // Use custom base URL

const response = await openai.responses.create({
  model: "gpt-5.5",
  tools: [
    {
      type: "web_search",
      user_location: {
        type: "approximate",
        country: "GB",
        city: "London",
        region: "London",
      },
    },
  ],
  input: "What are the best restaurants around Granary Square?",
});
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{
 "type": "web_search",
 "user_location": {
 "type": "approximate",
 "country": "GB",
 "city": "London",
 "region": "London"
 }
 }],
 "input": "What are the best restaurants around Granary Square?"
 }'

go=:package main

import (
	"context"
	"fmt"
	"github.com/openai/openai-go" // OpenAI Go client
	"github.com/openai/openai-go/option"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	client := openai.NewClient(
		option.WithAPIKey(apiKey),
		option.WithBaseURL("https://api.avalai.ir/v1"), // Use custom base URL
	)

	resp, err := client.Responses.Create(
		context.Background(),
		openai.ResponsesCreateParams{
			Model: "gpt-5.5",
			Tools: []openai.ToolParamUnion{
				openai.ToolParam{
					Type: openai.F("web_search"),
					UserLocation: &openai.UserLocation{
						Type:    openai.F("approximate"),
						Country: openai.F("GB"),
						City:    openai.F("London"),
						Region:  openai.F("London"),
					},
				},
			},
			Input: "What are the best restaurants around Granary Square?",
		},
	)

	if err != nil {
		fmt.Printf("Response creation error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText)
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php'); // Assuming Composer autoload

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, ["base_uri" => "https://api.avalai.ir/v1"]); // Using OpenAI PHP client with custom base URL

$response = $client->responses()->create([
'model' => 'gpt-5.5',
'tools' => [[
'type' => 'web_search',
'user_location' => [
'type' => 'approximate',
'country' => 'GB',
'city' => 'London',
'region' => 'London',
]
]],
'input' => 'What are the best restaurants around Granary Square?',
]);

echo $response->output_text;
?>

```

## Search context size

When using this tool, the `search_context_size` parameter controls how much context is retrieved from the web to help the tool formulate a response. The tokens used by the search tool do **not** affect the context window of the main model specified in the `model` parameter in your response creation request. These tokens are also **not** carried over from one turn to another — they're simply used to formulate the tool response and then discarded.

Choosing a context size impacts:

*   **Cost**: Pricing of our search tool varies based on the value of this parameter. Higher context sizes are more expensive. See tool pricing [here](/pricing.md).
*   **Quality**: Higher search context sizes generally provide richer context, resulting in more accurate, comprehensive answers.
*   **Latency**: Higher context sizes require processing more tokens, which can slow down the tool's response time.

Available values:

*   **`high`**: Most comprehensive context, highest cost, slower response.
*   **`medium`** (default): Balanced context, cost, and latency.
*   **`low`**: Least context, lowest cost, fastest response, but potentially lower answer quality.

Again, tokens used by the search tool do **not** impact main model's token usage and are not carried over from turn to turn. Check the [pricing page](/pricing.md) for details on costs associated with each context size.

### Customizing search context size

```language-selector
python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)  # Use custom base URL

response = client.responses.create(
    model="gpt-5.5",
    tools=[
        {
            "type": "web_search",
            "search_context_size": "low",
        }
    ],
    input="What movie won best picture in 2025?",
)

print(response.output_text)

javascript=:import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
}); // Use custom base URL

const response = await openai.responses.create({
  model: "gpt-5.5",
  tools: [
    {
      type: "web_search",
      search_context_size: "low",
    },
  ],
  input: "What movie won best picture in 2025?",
});
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{
 "type": "web_search",
 "search_context_size": "low"
 }],
 "input": "What movie won best picture in 2025?"
 }'

go=:package main

import (
	"context"
	"fmt"
	"github.com/openai/openai-go" // OpenAI Go client
	"github.com/openai/openai-go/option"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	client := openai.NewClient(
		option.WithAPIKey(apiKey),
		option.WithBaseURL("https://api.avalai.ir/v1"), // Use custom base URL
	)

	resp, err := client.Responses.Create(
		context.Background(),
		openai.ResponsesCreateParams{
			Model: "gpt-5.5",
			Tools: []openai.ToolParamUnion{
				openai.ToolParam{
					Type:              openai.F("web_search"),
					SearchContextSize: openai.F("low"),
				},
			},
			Input: "What movie won best picture in 2025?",
		},
	)

	if err != nil {
		fmt.Printf("Response creation error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText)
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php'); // Assuming Composer autoload

$apiKey = getenv('AVALAI_API_KEY');
$client = OpenAI::client($apiKey, ["base_uri" => "https://api.avalai.ir/v1"]); // Using OpenAI PHP client with custom base URL

$response = $client->responses()->create([
'model' => 'gpt-5.5',
'tools' => [[
'type' => 'web_search',
'search_context_size' => 'low',
]],
'input' => 'What movie won best picture in 2025?',
]);

echo $response->output_text;
?>

```

## Limitations

Below are a few notable implementation considerations when using web search.

*   The [`gpt-4o-search-preview`](/providers/openai.md) and [`gpt-4o-mini-search-preview`](/providers/openai.md) models used in Chat Completions only support a subset of API parameters - view their model data pages for specific information on rate limits and feature support.
*   When used as a tool in the [Responses API](/api-reference/responses.md), web search has the same tiered rate limits as the models above.
*   Refer to [our guide on data handling](/guides/your-data.md) for data handling, residency, and retention information (assuming this guide exists or will exist).

## Related Resources

*   [Responses API Reference](/api-reference/responses.md)
*   [Tools Overview](/tools.md)
*   [Pricing](/pricing.md)
*   [Models](/providers/openai.md)
