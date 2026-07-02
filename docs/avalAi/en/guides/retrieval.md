# Retrieval

Search your data using semantic similarity with AvalAI's Retrieval API.

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

## Introduction

The **Retrieval API** allows you to perform **semantic search** over your data, a technique that surfaces semantically similar results — even when they match few or no keywords. Retrieval is useful on its own, but is especially powerful when combined with AvalAI's language models to synthesize responses.

![Retrieval illustration](https://cdn.openai.com/API/docs/images/retrieval-depiction.png ':size=1000')

The Retrieval API is powered by **vector stores**, which serve as indices for your data. This guide covers how to perform semantic search and explains the details of vector stores.

## Quickstart

### Create a vector store and upload files

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support FAQ"
  }'

# Upload file to vector store
curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file=@"customer_policies.txt"

python=:from avalai import AvalAI

client = AvalAI()

vector_store = client.vector_stores.create(  # Create vector store
    name="Support FAQ",
)

client.vector_stores.files.upload_and_poll(  # Upload file
    vector_store_id=vector_store.id, file=open("customer_policies.txt", "rb")
)

javascript=:import { AvalAI } from "avalai";
const client = new AvalAI();

const vector_store = await client.vectorStores.create({
  // Create vector store
  name: "Support FAQ",
});

await client.vectorStores.files.uploadAndPoll({
  // Upload file
  vectorStoreId: vector_store.id,
  file: fs.createReadStream("customer_policies.txt"),
});

go=:package main

import (
	"context"
	"github.com/avalai/avalai-go"
	"os"
)

func main() {
	client := avalai.NewClient()

	vectorStore, err := client.VectorStores.Create(context.Background(), &avalai.VectorStoreCreateParams{
		Name: "Support FAQ",
	})

	file, _ := os.Open("customer_policies.txt")
	defer file.Close()

	_, err = client.VectorStores.Files.UploadAndPoll(context.Background(), &avalai.VectorStoreFileUploadParams{
		VectorStoreID: vectorStore.ID,
		File:          file,
	})
}

php=:<?php
require 'vendor/autoload.php';

$client = new \AvalAI\Client();

$vectorStore = $client->vectorStores->create([
    'name' => 'Support FAQ',
]);

$client->vectorStores->files->uploadAndPoll([
    'vectorStoreId' => $vectorStore->id,
    'file' => fopen('customer_policies.txt', 'r'),
]);
?>

```

### Send search query to get relevant results

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the return policy?"
  }'

python=:user_query = "What is the return policy?"

results = client.vector_stores.search(
    vector_store_id=vector_store.id,
    query=user_query,
)

javascript=:const userQuery = "What is the return policy?";

const results = await client.vectorStores.search({
  vectorStoreId: vector_store.id,
  query: userQuery,
});

go=:userQuery := "What is the return policy?"

results, err := client.VectorStores.Search(context.Background(), &avalai.VectorStoreSearchParams{
	VectorStoreID: vectorStore.ID,
	Query:         userQuery,
})

php=:<?php
$userQuery = "What is the return policy?";

$results = $client->vectorStores->search([
'vectorStoreId' => $vectorStore->id,
'query' => $userQuery,
]);
?>

```

To learn how to use the results with AvalAI's models, check out the [synthesizing responses](#synthesizing-responses) section.

## Semantic Search

**Semantic search** is a technique that leverages [vector embeddings](en/guides/embeddings.md) to surface semantically relevant results. Importantly, this includes results with few or no shared keywords, which classical search techniques might miss.

For example, let's look at potential results for `"When did we go to the moon?"`:

| Text                                              | Keyword Similarity | Semantic Similarity |
| ------------------------------------------------- | ------------------ | ------------------- |
| The first lunar landing occurred in July of 1969. | 0%                 | 65%                 |
| The first man on the moon was Neil Armstrong.     | 27%                | 43%                 |
| When I ate the moon cake, it was delicious.       | 40%                | 28%                 |

_(Jaccard used for keyword, cosine with embedding models used for semantic.)_

Notice how the most relevant result contains none of the words in the search query. This flexibility makes semantic search a very powerful technique for querying knowledge bases of any size.

Semantic search is powered by [vector stores](#vector-stores), which we cover in detail later in the guide.

### Performing Semantic Search

You can query a vector store using the `search` function and specifying a `query` in natural language. This will return a list of results, each with the relevant chunks, similarity scores, and file of origin.

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"query": "How many woodchucks are allowed per passenger?"
}'

python=:results = client.vector_stores.search(
    vector_store_id=vector_store.id,
    query="How many woodchucks are allowed per passenger?",
)

javascript=:const results = await client.vectorStores.search({
  vectorStoreId: vector_store.id,
  query: "How many woodchucks are allowed per passenger?",
});

go=:results, err := client.VectorStores.Search(context.Background(), &avalai.VectorStoreSearchParams{
	VectorStoreID: vectorStore.ID,
	Query:         "How many woodchucks are allowed per passenger?",
})

php=:<?php
$results = $client->vectorStores->search([
'vectorStoreId' => $vectorStore->id,
    'query' => "How many woodchucks are allowed per passenger?",
]);
?>

```

Example response:

```json
{
  "object": "vector_store.search_results.page",
  "search_query": "How many woodchucks are allowed per passenger?",
  "data": [
    {
      "file_id": "file-12345",
      "filename": "woodchuck_policy.txt",
      "score": 0.85,
      "attributes": {
        "region": "North America",
        "author": "Wildlife Department"
      },
      "content": [
        {
          "type": "text",
          "text": "According to the latest regulations, each passenger is allowed to carry up to two woodchucks."
        },
        {
          "type": "text",
          "text": "Ensure that the woodchucks are properly contained during transport."
        }
      ]
    },
    {
      "file_id": "file-67890",
      "filename": "transport_guidelines.txt",
      "score": 0.75,
      "attributes": {
        "region": "North America",
        "author": "Transport Authority"
      },
      "content": [
        {
          "type": "text",
          "text": "Passengers must adhere to the guidelines set forth by the Transport Authority regarding the transport of woodchucks."
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

A response will contain 10 results maximum by default, but you can set up to 50 using the `max_num_results` parameter.

### Query Rewriting

Certain query styles yield better results, so AvalAI provides a setting to automatically rewrite your queries for optimal performance. Enable this feature by setting `rewrite_query=true` when performing a `search`.

The rewritten query will be available in the result's `search_query` field.

| **Original**                                                          | **Rewritten**                              |
| --------------------------------------------------------------------- | ------------------------------------------ |
| I'd like to know the height of the main office building.              | primary office building height             |
| What are the safety regulations for transporting hazardous materials? | safety regulations for hazardous materials |
| How do I file a complaint about a service issue?                      | service complaint filing process           |

### Attribute Filtering

Attribute filtering helps narrow down results by applying criteria, such as restricting searches to a specific date range. You can define and combine criteria in `attribute_filter` to target files based on their attributes before performing semantic search.

Use **comparison filters** to compare a specific `key` in a file's `attributes` with a given `value`, and **compound filters** to combine multiple filters using `and` and `or`.

**Comparison filter:**

```json
{
  "type": "eq" | "ne" | "gt" | "gte" | "lt" | "lte", // comparison operators

  "property": "attributes_property", // attributes property

  "value": "target_value" // value to compare against

}
```

**Compound filter:**

```json
{
  "type": "and" | "or", // logical operators

  "filters": [...]
}
```

Below are some example filters:

**Filter for a region:**

```json
{
  "type": "eq",
  "property": "region",
  "value": "us"
}
```

**Filter for a date range:**

```json
{
  "type": "and",
  "filters": [
    {
      "type": "gte",
      "property": "date",
      "value": 1704067200 // unix timestamp for 2024-01-01

    },
    {
      "type": "lte",
      "property": "date",
      "value": 1710892800 // unix timestamp for 2024-03-20

    }
  ]
}
```

**Filter to match any of a set of filenames:**

```json
{
  "type": "or",
  "filters": [
    {
      "type": "eq",
      "property": "filename",
      "value": "example.txt"
    },
    {
      "type": "eq",
      "property": "filename",
      "value": "example2.txt"
    }
  ]
}
```

**Complex filter for top secret projects with certain names in English:**

```json
{
  "type": "or",
  "filters": [
    {
      "type": "and",
      "filters": [
        {
          "type": "or",
          "filters": [
            {
              "type": "eq",
              "property": "project_code",
              "value": "X123"
            },
            {
              "type": "eq",
              "property": "project_code",
              "value": "X999"
            }
          ]
        },
        {
          "type": "eq",
          "property": "confidentiality",
          "value": "top_secret"
        }
      ]
    },
    {
      "type": "eq",
      "property": "language",
      "value": "en"
    }
  ]
}
```

### Ranking

If you find that your file search results are not sufficiently relevant, you can adjust the `ranking_options` to improve the quality of responses. This includes specifying a `ranker`, such as `auto` or `default-2024-08-21`, and setting a `score_threshold` between 0.0 and 1.0. A higher `score_threshold` will limit the results to more relevant chunks, though it may exclude some potentially useful ones.

## Vector Stores

Vector stores are the containers that power semantic search for the Retrieval API. When you add a file to a vector store it will be automatically chunked, embedded, and indexed.

Vector stores contain `vector_store_file` objects, which are backed by a `file` object.

| Object type         | Description                                                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file`              | Represents content uploaded through the [Files API](en/api-reference/files.md). Often used with vector stores, but also for fine-tuning and other use cases.                     |
| `vector_store`      | Container for searchable files.                                                                                                                                                  |
| `vector_store.file` | Wrapper type specifically representing a `file` that has been chunked and embedded, and has been associated with a `vector_store`. Contains `attributes` map used for filtering. |

### Pricing

You will be charged based on the total storage used across all your vector stores, determined by the size of parsed chunks and their corresponding embeddings. For detailed pricing information, please refer to AvalAI's [pricing page](en/pricing.md).

| Storage                        | Cost                        |
| ------------------------------ | --------------------------- |
| Up to 1 GB (across all stores) | Included in subscription    |
| Beyond 1 GB                    | Varies by subscription tier |

See [expiration policies](#expiration-policies) for options to minimize costs.

### Vector Store Operations

#### Create

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support FAQ",
    "file_ids": ["file_123"]
  }'

python=:client.vector_stores.create(name="Support FAQ", file_ids=["file_123"])

javascript=:await client.vectorStores.create({
  name: "Support FAQ",
  fileIds: ["file_123"],
});

go=:client.VectorStores.Create(context.Background(), &avalai.VectorStoreCreateParams{
	Name:    "Support FAQ",
	FileIDs: []string{"file_123"},
})

php=:<?php
$client->vectorStores->create([
    'name' => 'Support FAQ',
    'fileIds' => ['file_123'],
]);
?>

```

#### Retrieve

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id} \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.retrieve(vector_store_id="vs_123")

javascript=:await client.vectorStores.retrieve({
  vectorStoreId: "vs_123",
});

go=:client.VectorStores.Retrieve(context.Background(), &avalai.VectorStoreRetrieveParams{
	VectorStoreID: "vs_123",
})

php=:<?php
$client->vectorStores->retrieve([
    'vectorStoreId' => 'vs_123',
]);
?>

```

#### Update

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id} \
  -X PATCH \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support FAQ Updated"
  }'

python=:client.vector_stores.update(vector_store_id="vs_123", name="Support FAQ Updated")

javascript=:await client.vectorStores.update({
  vectorStoreId: "vs_123",
  name: "Support FAQ Updated",
});

go=:client.VectorStores.Update(context.Background(), &avalai.VectorStoreUpdateParams{
	VectorStoreID: "vs_123",
	Name:          "Support FAQ Updated",
})

php=:<?php
$client->vectorStores->update([
'vectorStoreId' => 'vs_123',
'name' => 'Support FAQ Updated',
]);
?>

```

#### Delete

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id} \
  -X DELETE \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.delete(vector_store_id="vs_123")

javascript=:await client.vectorStores.delete({
  vectorStoreId: "vs_123",
});

go=:client.VectorStores.Delete(context.Background(), &avalai.VectorStoreDeleteParams{
	VectorStoreID: "vs_123",
})

php=:<?php
$client->vectorStores->delete([
'vectorStoreId' => 'vs_123',
]);
?>

```

#### List

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.list()

javascript=:await client.vectorStores.list();

go=:client.VectorStores.List(context.Background(), nil)

php=:<?php
$client->vectorStores->list();
?>

```

### Vector Store File Operations

Some operations, like `create` for `vector_store.file`, are asynchronous and may take time to complete — use our helper functions, like `create_and_poll` to block until it is. Otherwise, you may check the status.

#### Create

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"file_id": "file_123"
}'

python=:client.vector_stores.files.create_and_poll(vector_store_id="vs_123", file_id="file_123")

javascript=:await client.vectorStores.files.createAndPoll({
  vectorStoreId: "vs_123",
  fileId: "file_123",
});

go=:client.VectorStores.Files.CreateAndPoll(context.Background(), &avalai.VectorStoreFileCreateParams{
	VectorStoreID: "vs_123",
	FileID:        "file_123",
})

php=:<?php
$client->vectorStores->files->createAndPoll([
'vectorStoreId' => 'vs_123',
'fileId' => 'file_123',
]);
?>

```

#### Upload

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file=@"customer_policies.txt"

python=:client.vector_stores.files.upload_and_poll(
    vector_store_id="vs_123", file=open("customer_policies.txt", "rb")
)

javascript=:await client.vectorStores.files.uploadAndPoll({
  vectorStoreId: "vs_123",
  file: fs.createReadStream("customer_policies.txt"),
});

go=:file, _ := os.Open("customer_policies.txt")
defer file.Close()

client.VectorStores.Files.UploadAndPoll(context.Background(), &avalai.VectorStoreFileUploadParams{
	VectorStoreID: "vs_123",
	File:          file,
})

php=:<?php
$client->vectorStores->files->uploadAndPoll([
'vectorStoreId' => 'vs_123',
'file' => fopen('customer_policies.txt', 'r'),
]);
?>

```

#### Retrieve

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files/{file_id} \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.files.retrieve(vector_store_id="vs_123", file_id="file_123")

javascript=:await client.vectorStores.files.retrieve({
  vectorStoreId: "vs_123",
  fileId: "file_123",
});

go=:client.VectorStores.Files.Retrieve(context.Background(), &avalai.VectorStoreFileRetrieveParams{
	VectorStoreID: "vs_123",
	FileID:        "file_123",
})

php=:<?php
$client->vectorStores->files->retrieve([
'vectorStoreId' => 'vs_123',
'fileId' => 'file_123',
]);
?>

```

#### Update

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files/{file_id} \
  -X PATCH \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"attributes": {"key": "value"}
}'

python=:client.vector_stores.files.update(
    vector_store_id="vs_123", file_id="file_123", attributes={"key": "value"}
)

javascript=:await client.vectorStores.files.update({
  vectorStoreId: "vs_123",
  fileId: "file_123",
  attributes: { key: "value" },
});

go=:client.VectorStores.Files.Update(context.Background(), &avalai.VectorStoreFileUpdateParams{
	VectorStoreID: "vs_123",
	FileID:        "file_123",
	Attributes:    map[string]interface{}{"key": "value"},
})

php=:<?php
$client->vectorStores->files->update([
'vectorStoreId' => 'vs_123',
'fileId' => 'file_123',
'attributes' => ['key' => 'value'],
]);
?>

```

#### Delete

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files/{file_id} \
  -X DELETE \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.files.delete(vector_store_id="vs_123", file_id="file_123")

javascript=:await client.vectorStores.files.delete({
  vectorStoreId: "vs_123",
  fileId: "file_123",
});

go=:client.VectorStores.Files.Delete(context.Background(), &avalai.VectorStoreFileDeleteParams{
	VectorStoreID: "vs_123",
	FileID:        "file_123",
})

php=:<?php
$client->vectorStores->files->delete([
'vectorStoreId' => 'vs_123',
'fileId' => 'file_123',
]);
?>

```

#### List

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.files.list(vector_store_id="vs_123")

javascript=:await client.vectorStores.files.list({
  vectorStoreId: "vs_123",
});

go=:client.VectorStores.Files.List(context.Background(), &avalai.VectorStoreFileListParams{
	VectorStoreID: "vs_123",
})

php=:<?php
$client->vectorStores->files->list([
'vectorStoreId' => 'vs_123',
]);
?>

```

### Batch Operations

#### Create

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/file_batches \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"file_ids": ["file_123", "file_456"]
}'

python=:client.vector_stores.file_batches.create_and_poll(
    vector_store_id="vs_123", file_ids=["file_123", "file_456"]
)

javascript=:await client.vectorStores.fileBatches.createAndPoll({
  vectorStoreId: "vs_123",
  fileIds: ["file_123", "file_456"],
});

go=:client.VectorStores.FileBatches.CreateAndPoll(context.Background(), &avalai.VectorStoreFileBatchCreateParams{
	VectorStoreID: "vs_123",
	FileIDs:       []string{"file_123", "file_456"},
})

php=:<?php
$client->vectorStores->fileBatches->createAndPoll([
'vectorStoreId' => 'vs_123',
'fileIds' => ['file_123', 'file_456'],
]);
?>

```

#### Retrieve

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/file_batches/{batch_id} \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.file_batches.retrieve(
    vector_store_id="vs_123", batch_id="vsfb_123"
)

javascript=:await client.vectorStores.fileBatches.retrieve({
  vectorStoreId: "vs_123",
  batchId: "vsfb_123",
});

go=:client.VectorStores.FileBatches.Retrieve(context.Background(), &avalai.VectorStoreFileBatchRetrieveParams{
	VectorStoreID: "vs_123",
	BatchID:       "vsfb_123",
})

php=:<?php
$client->vectorStores->fileBatches->retrieve([
'vectorStoreId' => 'vs_123',
'batchId' => 'vsfb_123',
]);
?>

```

#### Cancel

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel \
  -X POST \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.file_batches.cancel(vector_store_id="vs_123", batch_id="vsfb_123")

javascript=:await client.vectorStores.fileBatches.cancel({
  vectorStoreId: "vs_123",
  batchId: "vsfb_123",
});

go=:client.VectorStores.FileBatches.Cancel(context.Background(), &avalai.VectorStoreFileBatchCancelParams{
	VectorStoreID: "vs_123",
	BatchID:       "vsfb_123",
})

php=:<?php
$client->vectorStores->fileBatches->cancel([
'vectorStoreId' => 'vs_123',
'batchId' => 'vsfb_123',
]);
?>

```

#### List

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/file_batches \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:client.vector_stores.file_batches.list(vector_store_id="vs_123")

javascript=:await client.vectorStores.fileBatches.list({
  vectorStoreId: "vs_123",
});

go=:client.VectorStores.FileBatches.List(context.Background(), &avalai.VectorStoreFileBatchListParams{
	VectorStoreID: "vs_123",
})

php=:<?php
$client->vectorStores->fileBatches->list([
'vectorStoreId' => 'vs_123',
]);
?>

```

### Attributes

Each `vector_store.file` can have associated `attributes`, a dictionary of values that can be referenced when performing [semantic search](#semantic-search) with [attribute filtering](#attribute-filtering). The dictionary can have at most 16 keys, with a limit of 256 characters each.

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/files \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"file_id": "file_123",
"attributes": {
"region": "US",
"category": "Marketing",
"date": 1672531200
}
}'

python=:client.vector_stores.files.create(
    vector_store_id="vs_123",
    file_id="file_123",
    attributes={
        "region": "US",
        "category": "Marketing",
        "date": 1672531200,  # Jan 1, 2023
    },
)

javascript=:await client.vectorStores.files.create({
  vectorStoreId: "vs_123",
  fileId: "file_123",
  attributes: {
    region: "US",
    category: "Marketing",
    date: 1672531200, // Jan 1, 2023
  },
});

go=:client.VectorStores.Files.Create(context.Background(), &avalai.VectorStoreFileCreateParams{
	VectorStoreID: "vs_123",
	FileID:        "file_123",
	Attributes: map[string]interface{}{
		"region":   "US",
		"category": "Marketing",
		"date":     1672531200, // Jan 1, 2023
	},
})

php=:<?php
$client->vectorStores->files->create([
'vectorStoreId' => 'vs_123',
'fileId' => 'file_123',
'attributes' => [
'region' => 'US',
'category' => 'Marketing',
'date' => 1672531200, // Jan 1, 2023
],
]);
?>

```

### Expiration Policies

You can set an expiration policy on `vector_store` objects with `expires_after`. Once a vector store expires, all associated `vector_store.file` objects will be deleted and you'll no longer be charged for them.

```language-selector
bash=:curl https://api.avalai.ir/v1/vector_stores/{vector_store_id} \
  -X PATCH \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"expires_after": {
"anchor": "last_active_at",
"days": 7
}
}'

python=:client.vector_stores.update(
    vector_store_id="vs_123", expires_after={"anchor": "last_active_at", "days": 7}
)

javascript=:await client.vectorStores.update({
  vectorStoreId: "vs_123",
  expiresAfter: {
    anchor: "last_active_at",
    days: 7,
  },
});

go=:client.VectorStores.Update(context.Background(), &avalai.VectorStoreUpdateParams{
	VectorStoreID: "vs_123",
	ExpiresAfter: &avalai.ExpirationPolicy{
		Anchor: "last_active_at",
		Days:   7,
	},
})

php=:<?php
$client->vectorStores->update([
'vectorStoreId' => 'vs_123',
'expiresAfter' => [
'anchor' => 'last_active_at',
'days' => 7,
],
]);
?>

```

### Limits

The maximum file size is 512 MB. Each file should contain no more than 5,000,000 tokens per file (computed automatically when you attach a file).

### Chunking

By default, `max_chunk_size_tokens` is set to `800` and `chunk_overlap_tokens` is set to `400`, meaning every file is indexed by being split up into 800-token chunks, with 400-token overlap between consecutive chunks.

You can adjust this by setting `chunking_strategy` when adding files to the vector store. There are certain limitations to `chunking_strategy`:

- `max_chunk_size_tokens` must be between 100 and 4096 inclusive.
- `chunk_overlap_tokens` must be non-negative and should not exceed `max_chunk_size_tokens / 2`.

#### Supported File Types

_For `text/` MIME types, the encoding must be one of `utf-8`, `utf-16`, or `ascii`._

| File format | MIME type                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| `.c`        | `text/x-c`                                                                  |
| `.cpp`      | `text/x-c++`                                                                |
| `.cs`       | `text/x-csharp`                                                             |
| `.css`      | `text/css`                                                                  |
| `.doc`      | `application/msword`                                                        |
| `.docx`     | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`   |
| `.go`       | `text/x-golang`                                                             |
| `.html`     | `text/html`                                                                 |
| `.java`     | `text/x-java`                                                               |
| `.js`       | `text/javascript`                                                           |
| `.json`     | `application/json`                                                          |
| `.md`       | `text/markdown`                                                             |
| `.pdf`      | `application/pdf`                                                           |
| `.php`      | `text/x-php`                                                                |
| `.pptx`     | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.py`       | `text/x-python`                                                             |
| `.rb`       | `text/x-ruby`                                                               |
| `.sh`       | `application/x-sh`                                                          |
| `.tex`      | `text/x-tex`                                                                |
| `.ts`       | `application/typescript`                                                    |
| `.txt`      | `text/plain`                                                                |

## Synthesizing Responses

After performing a query you may want to synthesize a response based on the results. You can leverage AvalAI's models to do so, by supplying the results and original query, to get back a grounded response.

### Perform search query to get results

```language-selector
bash=:# First, perform the search
curl https://api.avalai.ir/v1/vector_stores/{vector_store_id}/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"query": "What is the return policy?"
}'

python=:from avalai import AvalAI

client = AvalAI()

user_query = "What is the return policy?"

results = client.vector_stores.search(
    vector_store_id=vector_store.id,
    query=user_query,
)

javascript=:import { AvalAI } from "avalai";
const client = new AvalAI();

const userQuery = "What is the return policy?";

const results = await client.vectorStores.search({
  vectorStoreId: vector_store.id,
  query: userQuery,
});

go=:userQuery := "What is the return policy?"

results, err := client.VectorStores.Search(context.Background(), &avalai.VectorStoreSearchParams{
	VectorStoreID: vectorStore.ID,
	Query:         userQuery,
})

php=:<?php
require 'vendor/autoload.php';

$client = new \AvalAI\Client();

$userQuery = "What is the return policy?";

$results = $client->vectorStores->search([
'vectorStoreId' => $vectorStore->id,
'query' => $userQuery,
]);
?>

```

### Synthesize a response based on results

```language-selector
bash=:# After formatting the results, use them in a chat completion
curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"model": "claude-sonnet-4-6",
"messages": [
{
"role": "developer",
"content": "Produce a concise answer to the query based on the provided sources."
},
{
"role": "user",
"content": "Sources: <sources>...</sources>\n\nQuery: '\''What is the return policy?'\''"
}
]
}'

python=:formatted_results = format_results(results.data)

completion = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "developer",
            "content": "Produce a concise answer to the query based on the provided sources.",
        },
        {
            "role": "user",
            "content": f"Sources: {formatted_results}\n\nQuery: '{user_query}'",
        },
    ],
)

print(completion.choices[0].message.content)

javascript=:const formattedResults = formatResults(results.data);

const completion = await client.chat.completions.create({
  model: "claude-sonnet-4-6",
  messages: [
    {
      role: "developer",
      content:
        "Produce a concise answer to the query based on the provided sources.",
    },
    {
      role: "user",
      content: `Sources: ${formattedResults}\n\nQuery: '${userQuery}'`,
    },
  ],
});

console.log(completion.choices[0].message.content);

go=:formattedResults := formatResults(results.Data)

completion, err := client.Chat.Completions.Create(context.Background(), &avalai.ChatCompletionCreateParams{
	Model: "claude-sonnet-4-6",
	Messages: []avalai.ChatCompletionMessage{
		{
			Role:    "developer",
			Content: "Produce a concise answer to the query based on the provided sources.",
		},
		{
			Role:    "user",
			Content: fmt.Sprintf("Sources: %s\n\nQuery: '%s'", formattedResults, userQuery),
		},
	},
})

fmt.Println(completion.Choices[0].Message.Content)

php=:<?php
$formattedResults = formatResults($results->data);

$completion = $client->chat->completions->create([
'model' => 'claude-sonnet-4-6',
'messages' => [
[
'role' => 'developer',
'content' => 'Produce a concise answer to the query based on the provided sources.',
],
[
'role' => 'user',
'content' => "Sources: {$formattedResults}\n\nQuery: '{$userQuery}'",
],
],
]);

echo $completion->choices[0]->message->content;
?>

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
    input="Sources: <sources>...</sources> Query:",
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
  input: "Sources: <sources>...</sources> Query:",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Sources: <sources>...</sources> Query:",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


Example response:

```
"Our return policy allows returns within 30 days of purchase."
```

This uses a sample `format_results` function, which could be implemented like so:

```language-selector
python=:def format_results(results):
 formatted_results = ''
 for result in results:
 formatted_result = f"<result file_id='{result.file_id}' file_name='{result.filename}'>"
 for part in result.content:
 formatted_result += f"<content>{part.text}</content>"
 formatted_results += formatted_result + "</result>"
 return f"<sources>{formatted_results}</sources>"

javascript=:function formatResults(results) {
  let formattedResults = "";
  for (const result of results) {
    let formattedResult = `<result file_id='${result.file_id}' file_name='${result.filename}'>`;
    for (const part of result.content) {
      formattedResult += `<content>${part.text}</content>`;
    }
    formattedResults += formattedResult + "</result>";
  }
  return `<sources>${formattedResults}</sources>`;
}

go=:func formatResults(results []avalai.VectorStoreSearchResult) string {
	var formattedResults string
	for _, result := range results {
		formattedResult := fmt.Sprintf("<result file_id='%s' file_name='%s'>", result.FileID, result.Filename)
		for _, part := range result.Content {
			formattedResult += fmt.Sprintf("<content>%s</content>", part.Text)
		}
		formattedResults += formattedResult + "</result>"
	}
	return fmt.Sprintf("<sources>%s</sources>", formattedResults)
}

php=:<?php
function formatResults($results) {
 $formattedResults = '';
 foreach ($results as $result) {
 $formattedResult = "<result file_id='{$result->file_id}' file_name='{$result->filename}'>";
 foreach ($result->content as $part) {
 $formattedResult .= "<content>{$part->text}</content>";
 }
 $formattedResults .= $formattedResult . "</result>";
 }
 return "<sources>{$formattedResults}</sources>";
}
?>

```

## Related Resources

- [Embeddings Guide](en/guides/embeddings.md)
- [RAG Best Practices](en/guides/rag-best-practices.md)
- [Files API Reference](en/api-reference/files.md)
- [Chat API Reference](en/api-reference/chat.md)
