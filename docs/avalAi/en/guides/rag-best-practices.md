# RAG Best Practices

Retrieval-Augmented Generation (RAG) is a powerful technique that enhances Large Language Models (LLMs) by providing them with external knowledge. This guide covers best practices for implementing efficient and effective RAG pipelines using AvalAI.

> This guide is adapted from the [Best Practices for RAG Pipeline](https://masteringllm.medium.com/best-practices-for-rag-pipeline-8c12a8096453) with modifications for AvalAI's implementation.

## Introduction to RAG

RAG combines the strengths of retrieval-based and generation-based approaches to create more accurate, factual, and contextually relevant responses. Instead of relying solely on knowledge encoded in the model's parameters, RAG retrieves relevant information from external sources and uses it to augment the context provided to the language model.

### Key Benefits of RAG

- **Improved Accuracy**: Access to up-to-date and domain-specific information
- **Reduced Hallucinations**: Grounding responses in factual information
- **Knowledge Extensibility**: Easily update knowledge without retraining the model
- **Source Attribution**: Ability to cite sources of information

## RAG Workflow Components

A typical RAG pipeline consists of several key components:

![RAG Pipeline](https://developer-blogs.nvidia.com/wp-content/uploads/2023/12/rag-pipeline-ingest-query-flow-b.png ':size=1000')

1. **Query Classification**: Determining if external retrieval is needed
2. **Document Chunking**: Breaking documents into manageable pieces
3. **Embedding Generation**: Converting text into vector representations
4. **Vector Storage**: Efficiently storing and searching embeddings
5. **Retrieval**: Finding relevant documents for a given query
6. **Re-ranking**: Improving relevance of retrieved documents
7. **Re-packing**: Organizing documents for optimal context utilization
8. **Summarization**: Condensing information to fit context windows
9. **Generation**: Producing the final response

Let's explore each component in detail along with best practices.

## 1. Query Classification

Not all queries require external retrieval. Implementing query classification can optimize performance by determining when to use RAG.

### Best Practices

- Use a classifier to identify queries that need external information
- Skip retrieval for queries that can be answered with the model's internal knowledge
- Consider the task type when determining retrieval necessity

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


def classify_query(query):
    """Determine if a query requires external retrieval."""
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {
                "role": "system",
                "content": "You are a query classifier. Respond with 'RETRIEVE' if the query requires external knowledge, or 'SUFFICIENT' if the model's knowledge is enough.",
            },
            {"role": "user", "content": query},
        ],
    )
    classification = response.choices[0].message.content
    return "RETRIEVE" in classification


# Example usage
query = "What were the key announcements at AvalAI's 2025 developer conference?"
if classify_query(query):
    # Proceed with RAG pipeline
    print("Retrieving external information...")
else:
    # Use standard completion
    print("Using model's internal knowledge...")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

async function classifyQuery(query) {
  // Determine if a query requires external retrieval
  const response = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      {
        role: "system",
        content:
          "You are a query classifier. Respond with 'RETRIEVE' if the query requires external knowledge, or 'SUFFICIENT' if the model's knowledge is enough.",
      },
      { role: "user", content: query },
    ],
  });

  const classification = response.choices[0].message.content;
  return classification.includes("RETRIEVE");
}

// Example usage
async function processQuery(query) {
  const needsRetrieval = await classifyQuery(query);

  if (needsRetrieval) {
    // Proceed with RAG pipeline
    console.log("Retrieving external information...");
  } else {
    // Use standard completion
    console.log("Using model's internal knowledge...");
  }
}

processQuery(
  "What were the key announcements at AvalAI's 2025 developer conference?",
);

bash=:# Using cURL to classify a query
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "messages": [
      {
        "role": "system",
        "content": "You are a query classifier. Respond with '\''RETRIEVE'\'' if the query requires external knowledge, or '\''SUFFICIENT'\'' if the model'\''s knowledge is enough."
      },
      {
        "role": "user",
        "content": "What were the key announcements at AvalAI'\''s 2025 developer conference?"
      }
    ]
  }'

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
	"strings"
)

func classifyQuery(client *openai.Client, query string) (bool, error) {
	// Determine if a query requires external retrieval
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a query classifier. Respond with 'RETRIEVE' if the query requires external knowledge, or 'SUFFICIENT' if the model's knowledge is enough.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: query,
				},
			},
		},
	)

	if err != nil {
		return false, err
	}

	classification := resp.Choices[0].Message.Content
	return strings.Contains(classification, "RETRIEVE"), nil
}

func main() {
	client := openai.NewClient("YOUR_AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1" // AvalAI API endpoint

	query := "What were the key announcements at AvalAI's 2025 developer conference?"
	needsRetrieval, err := classifyQuery(client, query)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	if needsRetrieval {
		// Proceed with RAG pipeline
		fmt.Println("Retrieving external information...")
	} else {
		// Use standard completion
		fmt.Println("Using model's internal knowledge...")
	}
}

php=:<?php
// Using PHP to classify a query

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

function classifyQuery($query, $apiKey, $apiUrl) {
    $data = [
        'model' => 'gpt-5.5',
        'messages' => [
            [
                'role' => 'system',
                'content' => "You are a query classifier. Respond with 'RETRIEVE' if the query requires external knowledge, or 'SUFFICIENT' if the model's knowledge is enough."
            ],
            [
                'role' => 'user',
                'content' => $query
            ]
        ]
    ];

    $jsonData = json_encode($data);

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
        'Content-Length: ' . strlen($jsonData)
    ]);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        throw new Exception("cURL Error: " . $err);
    }

    $responseData = json_decode($response, true);
    $classification = $responseData['choices'][0]['message']['content'];

    return strpos($classification, 'RETRIEVE') !== false;
}

// Example usage
$query = "What were the key announcements at AvalAI's 2025 developer conference?";
try {
    $needsRetrieval = classifyQuery($query, $apiKey, $apiUrl);

    if ($needsRetrieval) {
        // Proceed with RAG pipeline
        echo "Retrieving external information...";
    } else {
        // Use standard completion
        echo "Using model's internal knowledge...";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
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
    input="What were the key announcements at AvalAI",
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
  input: "What were the key announcements at AvalAI",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "What were the key announcements at AvalAI",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## 2. Document Chunking

Breaking documents into appropriate chunks is crucial for effective retrieval. The chunking strategy affects both retrieval accuracy and processing efficiency.

### Chunking Strategies

1. **Token-level chunking**: Splits by fixed token count
2. **Sentence-level chunking**: Breaks at sentence boundaries
3. **Semantic-level chunking**: Uses LLMs to identify natural breakpoints

### Best Practices

- **Chunk Size**: Use 512-1024 tokens for optimal balance between context and relevance
- **Overlap**: Include 10-20% overlap between chunks to maintain context
- **Preserve Semantics**: Try to keep semantically related content together
- **Metadata**: Enhance chunks with titles, section headers, and other metadata

```language-selector
python=:from openai import OpenAI
import nltk
from nltk.tokenize import sent_tokenize

# Download NLTK resources if not already available
nltk.download("punkt")


def chunk_document_by_sentences(document, max_chunk_size=512, overlap=20):
    """
    Chunk a document by sentences with specified overlap.

    Args:
        document: The text document to chunk
        max_chunk_size: Maximum chunk size in tokens (approximate)
        overlap: Number of sentences to overlap between chunks

    Returns:
        List of document chunks
    """
    # Split the document into sentences
    sentences = sent_tokenize(document)

    chunks = []
    current_chunk = []
    current_size = 0

    for sentence in sentences:
        # Approximate token count (words + punctuation)
        sentence_size = len(sentence.split())

        if current_size + sentence_size > max_chunk_size and current_chunk:
            # Save the current chunk
            chunks.append(" ".join(current_chunk))

            # Keep overlap sentences for the next chunk
            if overlap > 0:
                overlap_sentences = current_chunk[-min(overlap, len(current_chunk)) :]
                current_chunk = overlap_sentences
                current_size = sum(len(s.split()) for s in overlap_sentences)
            else:
                current_chunk = []
                current_size = 0

        current_chunk.append(sentence)
        current_size += sentence_size

    # Add the last chunk if it's not empty
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


# Example usage
document = """
AvalAI provides access to a wide range of language models through a unified API.
This makes it easy to experiment with different models and choose the best one for your use case.
The platform supports models from various providers including OpenAI, Anthropic, Google, and more.
Each model has different capabilities and pricing, so it's important to understand the tradeoffs.
AvalAI also provides tools for monitoring usage, managing costs, and ensuring compliance with usage policies.
"""

chunks = chunk_document_by_sentences(document, max_chunk_size=100, overlap=1)
for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}: {chunk}")

javascript=:// Document chunking by sentences with overlap
import { OpenAI } from "openai";
import natural from "natural";

const tokenizer = new natural.SentenceTokenizer();

function chunkDocumentBySentences(document, maxChunkSize = 512, overlap = 20) {
  // Split the document into sentences
  const sentences = tokenizer.tokenize(document);

  const chunks = [];
  let currentChunk = [];
  let currentSize = 0;

  for (const sentence of sentences) {
    // Approximate token count (words + punctuation)
    const sentenceSize = sentence.split(/\s+/).length;

    if (currentSize + sentenceSize > maxChunkSize && currentChunk.length > 0) {
      // Save the current chunk
      chunks.push(currentChunk.join(" "));

      // Keep overlap sentences for the next chunk
      if (overlap > 0) {
        const overlapSentences = currentChunk.slice(
          -Math.min(overlap, currentChunk.length),
        );
        currentChunk = overlapSentences;
        currentSize = overlapSentences.reduce(
          (sum, s) => sum + s.split(/\s+/).length,
          0,
        );
      } else {
        currentChunk = [];
        currentSize = 0;
      }
    }

    currentChunk.push(sentence);
    currentSize += sentenceSize;
  }

  // Add the last chunk if it's not empty
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

// Example usage
const document = `
AvalAI provides access to a wide range of language models through a unified API.
This makes it easy to experiment with different models and choose the best one for your use case.
The platform supports models from various providers including OpenAI, Anthropic, Google, and more.
Each model has different capabilities and pricing, so it's important to understand the tradeoffs.
AvalAI also provides tools for monitoring usage, managing costs, and ensuring compliance with usage policies.
`;

const chunks = chunkDocumentBySentences(document, 100, 1);
chunks.forEach((chunk, i) => {
  console.log(`Chunk ${i + 1}: ${chunk}`);
});

bash=:# Using an external tool for document chunking
# This example uses Python in a shell script

cat >chunk_document.py <<'EOF'
import sys
import nltk
from nltk.tokenize import sent_tokenize

# Download NLTK resources
nltk.download('punkt', quiet=True)

def chunk_document(text, max_size=512, overlap=20):
    sentences = sent_tokenize(text)

    chunks = []
    current_chunk = []
    current_size = 0

    for sentence in sentences:
        sentence_size = len(sentence.split())

        if current_size + sentence_size > max_size and current_chunk:
            chunks.append(" ".join(current_chunk))

            if overlap > 0:
                overlap_sentences = current_chunk[-min(overlap, len(current_chunk)):]
                current_chunk = overlap_sentences
                current_size = sum(len(s.split()) for s in overlap_sentences)
            else:
                current_chunk = []
                current_size = 0

        current_chunk.append(sentence)
        current_size += sentence_size

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

if __name__ == "__main__":
    text = sys.stdin.read()
    chunks = chunk_document(text, max_size=int(sys.argv[1]), overlap=int(sys.argv[2]))
    for i, chunk in enumerate(chunks):
        print(f"--- Chunk {i+1} ---")
        print(chunk)
        print()
EOF

# Example usage
cat document.txt | python3 chunk_document.py 100 1

go=:package main

import (
	"fmt"
	"strings"
	"unicode"

	"github.com/neurosnap/sentences"
)

// ChunkDocumentBySentences chunks a document by sentences with specified overlap
func ChunkDocumentBySentences(document string, maxChunkSize int, overlap int) []string {
	// Initialize the sentence tokenizer
	tokenizer, err := sentences.NewSentenceTokenizer(nil)
	if err != nil {
		panic(err)
	}

	// Split the document into sentences
	sentenceObjects := tokenizer.Tokenize(document)
	var sentenceTexts []string
	for _, s := range sentenceObjects {
		sentenceTexts = append(sentenceTexts, s.Text)
	}

	chunks := []string{}
	currentChunk := []string{}
	currentSize := 0

	for _, sentence := range sentenceTexts {
		// Approximate token count (words + punctuation)
		sentenceSize := len(strings.FieldsFunc(sentence, func(r rune) bool {
			return unicode.IsSpace(r)
		}))

		if currentSize+sentenceSize > maxChunkSize && len(currentChunk) > 0 {
			// Save the current chunk
			chunks = append(chunks, strings.Join(currentChunk, " "))

			// Keep overlap sentences for the next chunk
			if overlap > 0 {
				startIdx := len(currentChunk) - min(overlap, len(currentChunk))
				overlapSentences := currentChunk[startIdx:]
				currentChunk = overlapSentences

				// Recalculate current size
				currentSize = 0
				for _, s := range overlapSentences {
					currentSize += len(strings.FieldsFunc(s, func(r rune) bool {
						return unicode.IsSpace(r)
					}))
				}
			} else {
				currentChunk = []string{}
				currentSize = 0
			}
		}

		currentChunk = append(currentChunk, sentence)
		currentSize += sentenceSize
	}

	// Add the last chunk if it's not empty
	if len(currentChunk) > 0 {
		chunks = append(chunks, strings.Join(currentChunk, " "))
	}

	return chunks
}

// Helper function for min
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func main() {
	document := `
AvalAI provides access to a wide range of language models through a unified API.
This makes it easy to experiment with different models and choose the best one for your use case.
The platform supports models from various providers including OpenAI, Anthropic, Google, and more.
Each model has different capabilities and pricing, so it's important to understand the tradeoffs.
AvalAI also provides tools for monitoring usage, managing costs, and ensuring compliance with usage policies.
`

	chunks := ChunkDocumentBySentences(document, 100, 1)
	for i, chunk := range chunks {
		fmt.Printf("Chunk %d: %s\n", i+1, chunk)
	}
}

php=:<?php
// Document chunking by sentences with overlap

/**
 * Simple sentence tokenizer function
 * Note: For production use, consider using a more robust NLP library
 */
function sentenceTokenize($text) {
    // Split on periods, exclamation marks, and question marks followed by spaces
    $pattern = '/(?<=[.!?])\s+(?=[A-Z])/';
    $sentences = preg_split($pattern, $text, -1, PREG_SPLIT_NO_EMPTY);

    // Clean up sentences
    $result = [];
    foreach ($sentences as $sentence) {
        $sentence = trim($sentence);
        if (!empty($sentence)) {
            $result[] = $sentence;
        }
    }

    return $result;
}

function chunkDocumentBySentences($document, $maxChunkSize = 512, $overlap = 20) {
    // Split the document into sentences
    $sentences = sentenceTokenize($document);

    $chunks = [];
    $currentChunk = [];
    $currentSize = 0;

    foreach ($sentences as $sentence) {
        // Approximate token count (words + punctuation)
        $sentenceSize = count(explode(' ', $sentence));

        if ($currentSize + $sentenceSize > $maxChunkSize && count($currentChunk) > 0) {
            // Save the current chunk
            $chunks[] = implode(' ', $currentChunk);

            // Keep overlap sentences for the next chunk
            if ($overlap > 0) {
                $overlapCount = min($overlap, count($currentChunk));
                $overlapSentences = array_slice($currentChunk, -$overlapCount);
                $currentChunk = $overlapSentences;

                // Recalculate current size
                $currentSize = 0;
                foreach ($overlapSentences as $s) {
                    $currentSize += count(explode(' ', $s));
                }
            } else {
                $currentChunk = [];
                $currentSize = 0;
            }
        }

        $currentChunk[] = $sentence;
        $currentSize += $sentenceSize;
    }

    // Add the last chunk if it's not empty
    if (count($currentChunk) > 0) {
        $chunks[] = implode(' ', $currentChunk);
    }

    return $chunks;
}

// Example usage
$document = "
AvalAI provides access to a wide range of language models through a unified API.
This makes it easy to experiment with different models and choose the best one for your use case.
The platform supports models from various providers including OpenAI, Anthropic, Google, and more.
Each model has different capabilities and pricing, so it's important to understand the tradeoffs.
AvalAI also provides tools for monitoring usage, managing costs, and ensuring compliance with usage policies.
";

$chunks = chunkDocumentBySentences($document, 100, 1);
foreach ($chunks as $index => $chunk) {
    echo "Chunk " . ($index + 1) . ": " . $chunk . "\n";
}
?>

```

## 3. Embedding Generation

Embedding models convert text into vector representations that capture semantic meaning. Choosing the right embedding model is crucial for effective retrieval.

### Best Practices

- **Model Selection**: Use embedding models optimized for retrieval tasks
- **Consistency**: Use the same embedding model for documents and queries
- **Dimensionality**: Balance vector size and performance (smaller embeddings are faster but may be less accurate)
- **Specialized Embeddings**: Consider domain-specific embedding models for specialized content

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


def create_embedding(text):
    """Generate embeddings for a given text."""
    response = client.embeddings.create(model="text-embedding-3-large", input=text)
    return response.data[0].embedding


# Example: Create embeddings for document chunks
chunks = [
    "AvalAI provides access to a wide range of language models through a unified API.",
    "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
    "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
]

# Create embeddings for each chunk
chunk_embeddings = [create_embedding(chunk) for chunk in chunks]
print(
    f"Generated {len(chunk_embeddings)} embeddings of dimension {len(chunk_embeddings[0])}"
)

# Create embedding for a query
query = "Which AI models does AvalAI support?"
query_embedding = create_embedding(query)

# Function to compute similarity (cosine similarity)
import numpy as np


def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# Find most similar chunk to query
similarities = [
    cosine_similarity(query_embedding, chunk_emb) for chunk_emb in chunk_embeddings
]
most_similar_idx = np.argmax(similarities)
print(f"Most similar chunk: {chunks[most_similar_idx]}")
print(f"Similarity score: {similarities[most_similar_idx]:.4f}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

async function createEmbedding(text) {
  // Generate embeddings for a given text
  const response = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });

  return response.data[0].embedding;
}

// Compute cosine similarity between two vectors
function cosineSimilarity(a, b) {
  // Dot product
  let dotProduct = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
  }

  // Magnitudes
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function findSimilarChunks() {
  // Example chunks
  const chunks = [
    "AvalAI provides access to a wide range of language models through a unified API.",
    "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
    "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
  ];

  // Create embeddings for each chunk
  const chunkEmbeddings = await Promise.all(
    chunks.map((chunk) => createEmbedding(chunk)),
  );

  console.log(
    `Generated ${chunkEmbeddings.length} embeddings of dimension ${chunkEmbeddings[0].length}`,
  );

  // Create embedding for a query
  const query = "Which AI models does AvalAI support?";
  const queryEmbedding = await createEmbedding(query);

  // Find most similar chunk to query
  const similarities = chunkEmbeddings.map((embedding) =>
    cosineSimilarity(queryEmbedding, embedding),
  );

  const mostSimilarIdx = similarities.indexOf(Math.max(...similarities));
  console.log(`Most similar chunk: ${chunks[mostSimilarIdx]}`);
  console.log(`Similarity score: ${similarities[mostSimilarIdx].toFixed(4)}`);
}

findSimilarChunks().catch(console.error);

bash=:# Using cURL to generate embeddings
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "text-embedding-3-large",
 "input": "AvalAI provides access to a wide range of language models through a unified API."
}'

# For multiple embeddings in one request:
curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "text-embedding-3-large",
 "input": [
 "AvalAI provides access to a wide range of language models through a unified API.",
 "The platform supports models from various providers including OpenAI, Anthropic, Google, and more."
 ]
}'

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
	"math"
)

// CreateEmbedding generates embeddings for a given text
func CreateEmbedding(client *openai.Client, text string) ([]float32, error) {
	resp, err := client.CreateEmbedding(
		context.Background(),
		openai.EmbeddingRequest{
			Model: "text-embedding-3-large",
			Input: []string{text},
		},
	)

	if err != nil {
		return nil, err
	}

	return resp.Data[0].Embedding, nil
}

// CosineSimilarity computes the cosine similarity between two vectors
func CosineSimilarity(a, b []float32) float64 {
	var dotProduct float64
	var normA float64
	var normB float64

	for i := range a {
		dotProduct += float64(a[i] * b[i])
		normA += float64(a[i] * a[i])
		normB += float64(b[i] * b[i])
	}

	return dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))
}

func main() {
	client := openai.NewClient("YOUR_AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1" // AvalAI API endpoint

	// Example chunks
	chunks := []string{
		"AvalAI provides access to a wide range of language models through a unified API.",
		"The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
		"Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
	}

	// Create embeddings for each chunk
	var chunkEmbeddings [][]float32
	for _, chunk := range chunks {
		embedding, err := CreateEmbedding(client, chunk)
		if err != nil {
			fmt.Printf("Error creating embedding: %v\n", err)
			return
		}
		chunkEmbeddings = append(chunkEmbeddings, embedding)
	}

	fmt.Printf("Generated %d embeddings of dimension %d\n", len(chunkEmbeddings), len(chunkEmbeddings[0]))

	// Create embedding for a query
	query := "Which AI models does AvalAI support?"
	queryEmbedding, err := CreateEmbedding(client, query)
	if err != nil {
		fmt.Printf("Error creating query embedding: %v\n", err)
		return
	}

	// Find most similar chunk to query
	var similarities []float64
	var maxSimilarity float64
	var mostSimilarIdx int

	for i, embedding := range chunkEmbeddings {
		similarity := CosineSimilarity(queryEmbedding, embedding)
		similarities = append(similarities, similarity)

		if i == 0 || similarity > maxSimilarity {
			maxSimilarity = similarity
			mostSimilarIdx = i
		}
	}

	fmt.Printf("Most similar chunk: %s\n", chunks[mostSimilarIdx])
	fmt.Printf("Similarity score: %.4f\n", maxSimilarity)
}

php=:<?php
// Generate embeddings using AvalAI API

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/embeddings';

function createEmbedding($text, $apiKey, $apiUrl) {
	// Handle both single text and array of texts
	$input = is_array($text) ? $text : $text;

	$data = [
	'model' => 'text-embedding-3-large',
	'input' => $input
	];

	$jsonData = json_encode($data);

	$ch = curl_init($apiUrl);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
	'Content-Type: application/json',
	'Authorization: Bearer ' . $apiKey,
	'Content-Length: ' . strlen($jsonData)
	]);

	$response = curl_exec($ch);
	$err = curl_error($ch);
	curl_close($ch);

	if ($err) {
	throw new Exception("cURL Error: " . $err);
	}

	$responseData = json_decode($response, true);

	// Return the embedding(s)
	return is_array($text)
	? array_map(function($item) { return $item['embedding']; }, $responseData['data'])
	: $responseData['data'][0]['embedding'];
}

// Compute cosine similarity between two vectors
function cosineSimilarity($a, $b) {
	$dotProduct = 0;
	$normA = 0;
	$normB = 0;

	for ($i = 0; $i < count($a); $i++) {
	$dotProduct += $a[$i] * $b[$i];
	$normA += $a[$i] * $a[$i];
	$normB += $b[$i] * $b[$i];
	}

	return $dotProduct / (sqrt($normA) * sqrt($normB));
}

// Example usage
try {
	// Example chunks
	$chunks = [
	"AvalAI provides access to a wide range of language models through a unified API.",
	"The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
	"Each model has different capabilities and pricing, so it's important to understand the tradeoffs."
	];

	// Create embeddings for each chunk (batch request)
	$chunkEmbeddings = createEmbedding($chunks, $apiKey, $apiUrl);
	echo "Generated " . count($chunkEmbeddings) . " embeddings of dimension " . count($chunkEmbeddings[0]) . "\n";

	// Create embedding for a query
	$query = "Which AI models does AvalAI support?";
	$queryEmbedding = createEmbedding($query, $apiKey, $apiUrl);

	// Find most similar chunk to query
	$similarities = [];
	$maxSimilarity = -1;
	$mostSimilarIdx = -1;

	foreach ($chunkEmbeddings as $i => $embedding) {
	$similarity = cosineSimilarity($queryEmbedding, $embedding);
	$similarities[] = $similarity;

	if ($i === 0 || $similarity > $maxSimilarity) {
	$maxSimilarity = $similarity;
	$mostSimilarIdx = $i;
	}
	}

	echo "Most similar chunk: " . $chunks[$mostSimilarIdx] . "\n";
	echo "Similarity score: " . number_format($maxSimilarity, 4) . "\n";
} catch (Exception $e) {
	echo "Error: " . $e->getMessage();
}
?>

```

## 4. Vector Storage

Efficient storage and retrieval of vector embeddings is crucial for RAG performance. Vector databases are specialized for this purpose.

### Best Practices

- **Choose the Right Vector Database**: Select a database that balances speed, scalability, and feature richness
- **Index Optimization**: Use appropriate indexing methods (e.g., HNSW, IVF) for your retrieval needs
- **Metadata Filtering**: Store and utilize metadata for more precise retrieval
- **Batch Processing**: Use batch operations for efficient indexing and querying

```language-selector
python=:from openai import OpenAI
import numpy as np
import faiss
import pickle


# Simple vector database using FAISS
class SimpleVectorDB:
    def __init__(self, dimension):
        """Initialize a simple vector database."""
        # Using L2 distance (Euclidean)
        self.index = faiss.IndexFlatL2(dimension)
        self.texts = []  # Store original texts
        self.metadata = []  # Store metadata

    def add_texts(self, texts, embeddings, metadata=None):
        """Add texts and their embeddings to the database."""
        if metadata is None:
            metadata = [{} for _ in texts]

        # Convert embeddings to numpy array
        embeddings_array = np.array(embeddings).astype("float32")

        # Add to FAISS index
        self.index.add(embeddings_array)

        # Store texts and metadata
        self.texts.extend(texts)
        self.metadata.extend(metadata)

        return list(range(len(self.texts) - len(texts), len(self.texts)))

    def similarity_search(self, query_embedding, k=5):
        """Search for similar vectors."""
        # Convert to numpy array
        query_embedding_array = np.array([query_embedding]).astype("float32")

        # Search
        distances, indices = self.index.search(query_embedding_array, k)

        # Return results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.texts) and idx >= 0:  # Valid index
                results.append(
                    {
                        "text": self.texts[idx],
                        "metadata": self.metadata[idx],
                        "distance": distances[0][i],
                    }
                )

        return results

    def save(self, filepath):
        """Save the vector database to disk."""
        with open(filepath + ".faiss", "wb") as f:
            faiss.write_index(self.index, f)

        with open(filepath + ".pkl", "wb") as f:
            pickle.dump({"texts": self.texts, "metadata": self.metadata}, f)

    @classmethod
    def load(cls, filepath, dimension):
        """Load the vector database from disk."""
        db = cls(dimension)

        with open(filepath + ".faiss", "rb") as f:
            db.index = faiss.read_index(f)

        with open(filepath + ".pkl", "rb") as f:
            data = pickle.load(f)
            db.texts = data["texts"]
            db.metadata = data["metadata"]

        return db


# Example usage
client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


def create_embedding(text):
    """Generate embeddings for a given text."""
    response = client.embeddings.create(model="text-embedding-3-large", input=text)
    return response.data[0].embedding


# Create a vector database
dimension = 1536  # Dimension of text-embedding-3-large
vector_db = SimpleVectorDB(dimension)

# Example documents with metadata
documents = [
    {
        "text": "AvalAI provides access to a wide range of language models through a unified API.",
        "metadata": {"source": "docs", "page": 1},
    },
    {
        "text": "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
        "metadata": {"source": "docs", "page": 1},
    },
    {
        "text": "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
        "metadata": {"source": "docs", "page": 2},
    },
]

# Create embeddings and add to database
texts = [doc["text"] for doc in documents]
embeddings = [create_embedding(text) for text in texts]
metadata = [doc["metadata"] for doc in documents]

vector_db.add_texts(texts, embeddings, metadata)

# Save the database
vector_db.save("my_vector_db")

# Query the database
query = "Which AI models does AvalAI support?"
query_embedding = create_embedding(query)

results = vector_db.similarity_search(query_embedding, k=2)
for result in results:
    print(f"Text: {result['text']}")
    print(f"Source: {result['metadata']['source']}, Page: {result['metadata']['page']}")
    print(f"Distance: {result['distance']:.4f}\n")

javascript=:import { OpenAI } from "openai";
import Faiss from "faiss-node";
import fs from "fs";

// Simple vector database using FAISS
class SimpleVectorDB {
  constructor(dimension) {
    // Using L2 distance (Euclidean)
    this.index = new Faiss.IndexFlatL2(dimension);
    this.texts = []; // Store original texts
    this.metadata = []; // Store metadata
  }

  addTexts(texts, embeddings, metadata = null) {
    if (!metadata) {
      metadata = texts.map(() => ({}));
    }

    // Convert embeddings to Float32Array
    const embeddingsArray = new Float32Array(embeddings.flat());

    // Add to FAISS index
    this.index.add(embeddingsArray, texts.length);

    // Store texts and metadata
    this.texts.push(...texts);
    this.metadata.push(...metadata);

    return Array.from(
      { length: texts.length },
      (_, i) => this.texts.length - texts.length + i,
    );
  }

  similaritySearch(queryEmbedding, k = 5) {
    // Convert to Float32Array
    const queryEmbeddingArray = new Float32Array(queryEmbedding);

    // Search
    const result = this.index.search(queryEmbeddingArray, k);
    const { distances, labels } = result;

    // Return results
    const results = [];
    for (let i = 0; i < labels.length; i++) {
      const idx = labels[i];
      if (idx < this.texts.length && idx >= 0) {
        // Valid index
        results.push({
          text: this.texts[idx],
          metadata: this.metadata[idx],
          distance: distances[i],
        });
      }
    }

    return results;
  }

  save(filepath) {
    // Save the FAISS index
    this.index.write(`${filepath}.faiss`);

    // Save texts and metadata
    fs.writeFileSync(
      `${filepath}.json`,
      JSON.stringify({ texts: this.texts, metadata: this.metadata }),
    );
  }

  static load(filepath, dimension) {
    const db = new SimpleVectorDB(dimension);

    // Load the FAISS index
    db.index = Faiss.read(`${filepath}.faiss`);

    // Load texts and metadata
    const data = JSON.parse(fs.readFileSync(`${filepath}.json`));
    db.texts = data.texts;
    db.metadata = data.metadata;

    return db;
  }
}

// Example usage
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

async function createEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });

  return response.data[0].embedding;
}

async function main() {
  // Create a vector database
  const dimension = 1536; // Dimension of text-embedding-3-large
  const vectorDb = new SimpleVectorDB(dimension);

  // Example documents with metadata
  const documents = [
    {
      text: "AvalAI provides access to a wide range of language models through a unified API.",
      metadata: { source: "docs", page: 1 },
    },
    {
      text: "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
      metadata: { source: "docs", page: 1 },
    },
    {
      text: "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
      metadata: { source: "docs", page: 2 },
    },
  ];

  // Create embeddings and add to database
  const texts = documents.map((doc) => doc.text);
  const embeddings = await Promise.all(
    texts.map((text) => createEmbedding(text)),
  );
  const metadata = documents.map((doc) => doc.metadata);

  vectorDb.addTexts(texts, embeddings, metadata);

  // Save the database
  vectorDb.save("my_vector_db");

  // Query the database
  const query = "Which AI models does AvalAI support?";
  const queryEmbedding = await createEmbedding(query);

  const results = vectorDb.similaritySearch(queryEmbedding, 2);
  for (const result of results) {
    console.log(`Text: ${result.text}`);
    console.log(
      `Source: ${result.metadata.source}, Page: ${result.metadata.page}`,
    );
    console.log(`Distance: ${result.distance.toFixed(4)}\n`);
  }
}

main().catch(console.error);

bash=:# Example using Milvus vector database with Docker
# First, start a Milvus instance using Docker
docker run -d --name milvus-standalone -p 19530:19530 -p 19121:19121 -p 9091:9091 milvusdb/milvus:v2.3.3 standalone

# Install Python dependencies
pip install pymilvus avalai numpy

# Create a Python script to interact with Milvus
cat >milvus_example.py <<'EOF'
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility
from openai import OpenAI
import numpy as np
import time

# Connect to AvalAI
client = OpenAI(
	api_key="your-avalai-api-key",
	base_url="https://api.avalai.ir/v1", # AvalAI API endpoint
)

# Connect to Milvus
connections.connect(host='localhost', port='19530')

# Define collection schema
fields = [
 FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
 FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=1000),
 FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=100),
 FieldSchema(name="page", dtype=DataType.INT64),
 FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1536)
]
schema = CollectionSchema(fields, "RAG documents collection")

# Create or get collection
collection_name = "avalai_docs"
if utility.has_collection(collection_name):
 collection = Collection(name=collection_name)
else:
 collection = Collection(name=collection_name, schema=schema)
 # Create index for vector field
 index_params = {
 "metric_type": "L2",
 "index_type": "HNSW",
 "params": {"M": 8, "efConstruction": 64}
 }
 collection.create_index(field_name="embedding", index_params=index_params)

# Function to get embeddings
def create_embedding(text):
 response = client.embeddings.create(
 model="text-embedding-3-large",
 input=text
 )
 return response.data[0].embedding

# Example documents
documents = [
 {
 "text": "AvalAI provides access to a wide range of language models through a unified API.",
 "source": "docs",
 "page": 1
 },
 {
 "text": "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
 "source": "docs",
 "page": 1
 },
 {
 "text": "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
 "source": "docs",
 "page": 2
 }
]

# Insert data
data = []
for doc in documents:
 embedding = create_embedding(doc["text"])
 data.append([None, doc["text"], doc["source"], doc["page"], embedding])

collection.insert(data)
collection.flush()
print(f"Inserted {len(data)} documents")

# Load collection
collection.load()

# Search
query = "Which AI models does AvalAI support?"
query_embedding = create_embedding(query)

search_params = {
 "metric_type": "L2",
 "params": {"ef": 32}
}

results = collection.search(
 data=[query_embedding],
 anns_field="embedding",
 param=search_params,
 limit=2,
 output_fields=["text", "source", "page"]
)

for hits in results:
 for hit in hits:
 print(f"Text: {hit.entity.get('text')}")
 print(f"Source: {hit.entity.get('source')}, Page: {hit.entity.get('page')}")
 print(f"Distance: {hit.distance:.4f}\n")

# Disconnect
connections.disconnect("default")
EOF

# Run the example
python milvus_example.py

go=:package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	openai "github.com/openai/openai-go"
)

func main() {
	// Connect to AvalAI
	avalaiClient := openai.NewClient(os.Getenv("AVALAI_API_KEY"))
	avalaiClient.BaseURL = "https://api.avalai.ir/v1" // AvalAI API endpoint

	// Connect to Milvus
	ctx := context.Background()
	milvusClient, err := client.NewGrpcClient(ctx, "localhost:19530")
	if err != nil {
		log.Fatalf("Failed to connect to Milvus: %v", err)
	}
	defer milvusClient.Close()

	// Collection parameters
	collectionName := "avalai_docs"
	dimension := 1536 // Dimension for text-embedding-3-large

	// Check if collection exists
	hasCollection, err := milvusClient.HasCollection(ctx, collectionName)
	if err != nil {
		log.Fatalf("Failed to check collection: %v", err)
	}

	if !hasCollection {
		// Create collection
		schema := &entity.Schema{
			CollectionName: collectionName,
			Description:    "RAG documents collection",
			Fields: []*entity.Field{
				{Name: "id", DataType: entity.FieldTypeInt64, PrimaryKey: true, AutoID: true},
				{Name: "text", DataType: entity.FieldTypeVarChar, MaxLength: 1000},
				{Name: "source", DataType: entity.FieldTypeVarChar, MaxLength: 100},
				{Name: "page", DataType: entity.FieldTypeInt64},
				{Name: "embedding", DataType: entity.FieldTypeFloatVector, TypeParams: map[string]string{"dim": fmt.Sprintf("%d", dimension)}},
			},
		}

		err = milvusClient.CreateCollection(ctx, schema, 2)
		if err != nil {
			log.Fatalf("Failed to create collection: %v", err)
		}

		// Create index
		idx, err := entity.NewIndexHNSW(entity.L2, 8, 64)
		if err != nil {
			log.Fatalf("Failed to create index: %v", err)
		}

		err = milvusClient.CreateIndex(ctx, collectionName, "embedding", idx, false)
		if err != nil {
			log.Fatalf("Failed to create index: %v", err)
		}
	}

	// Function to create embeddings
	createEmbedding := func(text string) ([]float32, error) {
		resp, err := avalaiClient.CreateEmbedding(
			ctx,
			openai.EmbeddingRequest{
				Model: "text-embedding-3-large",
				Input: []string{text},
			},
		)

		if err != nil {
			return nil, err
		}

		return resp.Data[0].Embedding, nil
	}

	// Example documents
	documents := []struct {
		Text   string
		Source string
		Page   int64
	}{
		{
			Text:   "AvalAI provides access to a wide range of language models through a unified API.",
			Source: "docs",
			Page:   1,
		},
		{
			Text:   "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
			Source: "docs",
			Page:   1,
		},
		{
			Text:   "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
			Source: "docs",
			Page:   2,
		},
	}

	// Insert data
	var texts []string
	var sources []string
	var pages []int64
	var embeddings [][]float32

	for _, doc := range documents {
		embedding, err := createEmbedding(doc.Text)
		if err != nil {
			log.Fatalf("Failed to create embedding: %v", err)
		}

		texts = append(texts, doc.Text)
		sources = append(sources, doc.Source)
		pages = append(pages, doc.Page)
		embeddings = append(embeddings, embedding)
	}

	// Create columns
	textColumn := entity.NewColumnVarChar("text", texts)
	sourceColumn := entity.NewColumnVarChar("source", sources)
	pageColumn := entity.NewColumnInt64("page", pages)
	embeddingColumn := entity.NewColumnFloatVector("embedding", dimension, embeddings)

	// Insert data
	_, err = milvusClient.Insert(ctx, collectionName, "", textColumn, sourceColumn, pageColumn, embeddingColumn)
	if err != nil {
		log.Fatalf("Failed to insert data: %v", err)
	}

	fmt.Printf("Inserted %d documents\n", len(documents))

	// Load collection
	err = milvusClient.LoadCollection(ctx, collectionName, false)
	if err != nil {
		log.Fatalf("Failed to load collection: %v", err)
	}

	// Search
	query := "Which AI models does AvalAI support?"
	queryEmbedding, err := createEmbedding(query)
	if err != nil {
		log.Fatalf("Failed to create query embedding: %v", err)
	}

	// Search parameters
	sp, err := entity.NewIndexHNSWSearchParams(32)
	if err != nil {
		log.Fatalf("Failed to create search params: %v", err)
	}

	// Search vectors
	searchResult, err := milvusClient.Search(
		ctx,
		collectionName,
		[]string{},
		"",
		[]string{"text", "source", "page"},
		[]entity.Vector{entity.FloatVector(queryEmbedding)},
		"embedding",
		entity.L2,
		2,
		sp,
	)

	if err != nil {
		log.Fatalf("Failed to search: %v", err)
	}

	// Process results
	for _, hits := range searchResult {
		for _, hit := range hits {
			fmt.Printf("Text: %s\n", hit.Entity.GetField("text").GetValue())
			fmt.Printf("Source: %s, Page: %d\n",
				hit.Entity.GetField("source").GetValue(),
				hit.Entity.GetField("page").GetValue())
			fmt.Printf("Distance: %.4f\n\n", hit.Score)
		}
	}
}

```

## 5. Retrieval

Retrieval is the process of finding relevant documents for a given query. Different retrieval methods can significantly impact the quality of results.

### Retrieval Methods

1. **Dense Retrieval**: Uses vector similarity to find semantically similar documents
2. **Sparse Retrieval**: Uses keyword matching (e.g., BM25, TF-IDF)
3. **Hybrid Retrieval**: Combines dense and sparse approaches

### Best Practices

- **Ensemble Methods**: Combine multiple retrieval strategies for better results
- **Query Expansion**: Enhance queries with related terms or reformulations
- **Filtering**: Use metadata to narrow down the search space
- **Contextual Retrieval**: Adapt retrieval based on conversation history

```language-selector
python=:from openai import OpenAI
import numpy as np
from rank_bm25 import BM25Okapi
import nltk
from nltk.tokenize import word_tokenize

# Download NLTK resources if not already available
nltk.download("punkt")

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


class HybridRetriever:
    """Hybrid retriever that combines dense and sparse retrieval."""

    def __init__(self, texts, dense_weight=0.7):
        self.texts = texts
        self.dense_weight = dense_weight
        self.sparse_weight = 1.0 - dense_weight

        # Prepare sparse retrieval (BM25)
        tokenized_texts = [word_tokenize(text.lower()) for text in texts]
        self.bm25 = BM25Okapi(tokenized_texts)

        # Prepare dense retrieval
        self.embeddings = [self._create_embedding(text) for text in texts]

    def _create_embedding(self, text):
        """Generate embeddings for a given text."""
        response = client.embeddings.create(model="text-embedding-3-large", input=text)
        return response.data[0].embedding

    def _cosine_similarity(self, a, b):
        """Compute cosine similarity between two vectors."""
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    def _dense_search(self, query, top_k=5):
        """Perform dense retrieval using vector similarity."""
        query_embedding = self._create_embedding(query)

        # Calculate similarities
        similarities = [
            self._cosine_similarity(query_embedding, doc_embedding)
            for doc_embedding in self.embeddings
        ]

        # Get top-k indices and scores
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        top_scores = [similarities[i] for i in top_indices]

        return list(zip(top_indices, top_scores))

    def _sparse_search(self, query, top_k=5):
        """Perform sparse retrieval using BM25."""
        tokenized_query = word_tokenize(query.lower())
        scores = self.bm25.get_scores(tokenized_query)

        # Get top-k indices and scores
        top_indices = np.argsort(scores)[-top_k:][::-1]
        top_scores = [scores[i] for i in top_indices]

        return list(zip(top_indices, top_scores))

    def search(self, query, top_k=5):
        """Perform hybrid search combining dense and sparse retrieval."""
        dense_results = self._dense_search(query, top_k=top_k)
        sparse_results = self._sparse_search(query, top_k=top_k)

        # Normalize scores
        max_dense = max([score for _, score in dense_results]) if dense_results else 1.0
        max_sparse = (
            max([score for _, score in sparse_results]) if sparse_results else 1.0
        )

        normalized_dense = {idx: score / max_dense for idx, score in dense_results}
        normalized_sparse = {idx: score / max_sparse for idx, score in sparse_results}

        # Combine scores
        combined_scores = {}
        for idx, score in normalized_dense.items():
            combined_scores[idx] = score * self.dense_weight

        for idx, score in normalized_sparse.items():
            if idx in combined_scores:
                combined_scores[idx] += score * self.sparse_weight
            else:
                combined_scores[idx] = score * self.sparse_weight

        # Get top-k results
        top_indices = sorted(combined_scores, key=combined_scores.get, reverse=True)[
            :top_k
        ]
        results = [
            {
                "text": self.texts[idx],
                "score": combined_scores[idx],
                "dense_score": normalized_dense.get(idx, 0) * self.dense_weight,
                "sparse_score": normalized_sparse.get(idx, 0) * self.sparse_weight,
            }
            for idx in top_indices
        ]

        return results


# Example usage
texts = [
    "AvalAI provides access to a wide range of language models through a unified API.",
    "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
    "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
    "AvalAI offers tools for monitoring usage and managing costs effectively.",
    "The documentation includes examples and best practices for different use cases.",
]

retriever = HybridRetriever(texts)
query = "Which AI models does AvalAI support?"

results = retriever.search(query, top_k=2)
for i, result in enumerate(results):
    print(f"Result {i+1}: {result['text']}")
    print(f"Total Score: {result['score']:.4f}")
    print(f"Dense Score: {result['dense_score']:.4f}")
    print(f"Sparse Score: {result['sparse_score']:.4f}\n")

javascript=:import { OpenAI } from "openai";
import natural from "natural";
import { BM25 } from "natural";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

class HybridRetriever {
  /**
   * Hybrid retriever that combines dense and sparse retrieval
   * @param {string[]} texts - Array of document texts
   * @param {number} denseWeight - Weight for dense retrieval (0-1)
   */
  constructor(texts, denseWeight = 0.7) {
    this.texts = texts;
    this.denseWeight = denseWeight;
    this.sparseWeight = 1.0 - denseWeight;

    // Prepare sparse retrieval (BM25)
    this.tokenizer = new natural.WordTokenizer();
    const tokenizedTexts = texts.map((text) =>
      this.tokenizer.tokenize(text.toLowerCase()),
    );
    this.bm25 = new BM25(tokenizedTexts);

    // Embeddings will be loaded lazily
    this.embeddings = null;
  }

  /**
   * Generate embeddings for a given text
   * @param {string} text - Input text
   * @returns {Promise<number[]>} - Embedding vector
   */
  async _createEmbedding(text) {
    const response = await client.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });

    return response.data[0].embedding;
  }

  /**
   * Compute cosine similarity between two vectors
   * @param {number[]} a - First vector
   * @param {number[]} b - Second vector
   * @returns {number} - Similarity score
   */
  _cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Perform dense retrieval using vector similarity
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array<[number, number]>>} - Array of [index, score] pairs
   */
  async _denseSearch(query, topK = 5) {
    // Create embeddings for all texts if not already done
    if (!this.embeddings) {
      this.embeddings = await Promise.all(
        this.texts.map((text) => this._createEmbedding(text)),
      );
    }

    const queryEmbedding = await this._createEmbedding(query);

    // Calculate similarities
    const similarities = this.embeddings.map((docEmbedding) =>
      this._cosineSimilarity(queryEmbedding, docEmbedding),
    );

    // Get top-k indices and scores
    const indexedScores = similarities.map((score, index) => [index, score]);
    indexedScores.sort((a, b) => b[1] - a[1]); // Sort by score descending

    return indexedScores.slice(0, topK);
  }

  /**
   * Perform sparse retrieval using BM25
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Array<[number, number]>} - Array of [index, score] pairs
   */
  _sparseSearch(query, topK = 5) {
    const tokenizedQuery = this.tokenizer.tokenize(query.toLowerCase());
    const scores = this.bm25.search(tokenizedQuery);

    // Get top-k indices and scores
    const indexedScores = scores.map((score, index) => [index, score]);
    indexedScores.sort((a, b) => b[1] - a[1]); // Sort by score descending

    return indexedScores.slice(0, topK);
  }

  /**
   * Perform hybrid search combining dense and sparse retrieval
   * @param {string} query - Search query
   * @param {number} topK - Number of results to return
   * @returns {Promise<Array<Object>>} - Array of result objects
   */
  async search(query, topK = 5) {
    const denseResults = await this._denseSearch(query, topK);
    const sparseResults = this._sparseSearch(query, topK);

    // Normalize scores
    const maxDense = Math.max(...denseResults.map(([_, score]) => score));
    const maxSparse = Math.max(...sparseResults.map(([_, score]) => score));

    const normalizedDense = Object.fromEntries(
      denseResults.map(([idx, score]) => [idx, score / maxDense]),
    );

    const normalizedSparse = Object.fromEntries(
      sparseResults.map(([idx, score]) => [idx, score / maxSparse]),
    );

    // Combine scores
    const combinedScores = {};

    for (const [idx, score] of Object.entries(normalizedDense)) {
      combinedScores[idx] = score * this.denseWeight;
    }

    for (const [idx, score] of Object.entries(normalizedSparse)) {
      if (idx in combinedScores) {
        combinedScores[idx] += score * this.sparseWeight;
      } else {
        combinedScores[idx] = score * this.sparseWeight;
      }
    }

    // Get top-k results
    const topIndices = Object.entries(combinedScores)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, topK)
      .map(([idx, _]) => parseInt(idx));

    const results = topIndices.map((idx) => ({
      text: this.texts[idx],
      score: combinedScores[idx],
      denseScore: (normalizedDense[idx] || 0) * this.denseWeight,
      sparseScore: (normalizedSparse[idx] || 0) * this.sparseWeight,
    }));

    return results;
  }
}

// Example usage
async function main() {
  const texts = [
    "AvalAI provides access to a wide range of language models through a unified API.",
    "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
    "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
    "AvalAI offers tools for monitoring usage and managing costs effectively.",
    "The documentation includes examples and best practices for different use cases.",
  ];

  const retriever = new HybridRetriever(texts);
  const query = "Which AI models does AvalAI support?";

  const results = await retriever.search(query, 2);
  results.forEach((result, i) => {
    console.log(`Result ${i + 1}: ${result.text}`);
    console.log(`Total Score: ${result.score.toFixed(4)}`);
    console.log(`Dense Score: ${result.denseScore.toFixed(4)}`);
    console.log(`Sparse Score: ${result.sparseScore.toFixed(4)}\n`);
  });
}

main().catch(console.error);

go=:package main

import (
	"context"
	"fmt"
	"math"
	"sort"
	"strings"

	"github.com/james-bowman/nlp"
	"github.com/james-bowman/sparse"
	openai "github.com/openai/openai-go"
)

// HybridRetriever combines dense and sparse retrieval methods
type HybridRetriever struct {
	texts        []string
	denseWeight  float64
	sparseWeight float64

	// Dense retrieval
	embeddings [][]float32

	// Sparse retrieval
	vectorizer    *nlp.CountVectorizer
	transformer   *nlp.TfidfTransformer
	docTermMatrix sparse.Matrix

	avalaiClient *openai.Client
}

// NewHybridRetriever creates a new hybrid retriever
func NewHybridRetriever(texts []string, avalaiClient *openai.Client, denseWeight float64) *HybridRetriever {
	return &HybridRetriever{
		texts:        texts,
		denseWeight:  denseWeight,
		sparseWeight: 1.0 - denseWeight,
		avalaiClient: avalaiClient,
	}
}

// Initialize prepares the retriever
func (r *HybridRetriever) Initialize(ctx context.Context) error {
	// Initialize sparse retrieval
	r.vectorizer = nlp.NewCountVectorizer()
	r.transformer = nlp.NewTfidfTransformer()

	// Create document-term matrix
	docTermMatrix, err := r.vectorizer.FitTransform(r.texts...)
	if err != nil {
		return fmt.Errorf("failed to vectorize texts: %v", err)
	}

	// Apply TF-IDF transformation
	r.docTermMatrix, err = r.transformer.FitTransform(docTermMatrix)
	if err != nil {
		return fmt.Errorf("failed to transform to TF-IDF: %v", err)
	}

	// Initialize dense retrieval by creating embeddings
	r.embeddings = make([][]float32, len(r.texts))
	for i, text := range r.texts {
		embedding, err := r.createEmbedding(ctx, text)
		if err != nil {
			return fmt.Errorf("failed to create embedding for text %d: %v", i, err)
		}
		r.embeddings[i] = embedding
	}

	return nil
}

// createEmbedding generates embeddings for a given text
func (r *HybridRetriever) createEmbedding(ctx context.Context, text string) ([]float32, error) {
	resp, err := r.avalaiClient.CreateEmbedding(
		ctx,
		openai.EmbeddingRequest{
			Model: "text-embedding-3-large",
			Input: []string{text},
		},
	)

	if err != nil {
		return nil, err
	}

	return resp.Data[0].Embedding, nil
}

// cosineSimilarity computes the cosine similarity between two vectors
func cosineSimilarity(a, b []float32) float64 {
	var dotProduct, normA, normB float64

	for i := range a {
		dotProduct += float64(a[i] * b[i])
		normA += float64(a[i] * a[i])
		normB += float64(b[i] * b[i])
	}

	return dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))
}

// denseSearch performs dense retrieval using vector similarity
func (r *HybridRetriever) denseSearch(ctx context.Context, query string, topK int) ([]struct {
	Index int
	Score float64
}, error) {
	queryEmbedding, err := r.createEmbedding(ctx, query)
	if err != nil {
		return nil, err
	}

	// Calculate similarities
	similarities := make([]struct {
		Index int
		Score float64
	}, len(r.embeddings))
	for i, docEmbedding := range r.embeddings {
		similarities[i].Index = i
		similarities[i].Score = cosineSimilarity(queryEmbedding, docEmbedding)
	}

	// Sort by score descending
	sort.Slice(similarities, func(i, j int) bool {
		return similarities[i].Score > similarities[j].Score
	})

	// Return top-k results
	if topK > len(similarities) {
		topK = len(similarities)
	}
	return similarities[:topK], nil
}

// sparseSearch performs sparse retrieval using TF-IDF
func (r *HybridRetriever) sparseSearch(query string, topK int) ([]struct {
	Index int
	Score float64
}, error) {
	// Vectorize query
	queryVector, err := r.vectorizer.Transform(query)
	if err != nil {
		return nil, err
	}

	// Apply TF-IDF transformation
	queryTfidf, err := r.transformer.Transform(queryVector)
	if err != nil {
		return nil, err
	}

	// Calculate similarities
	similarities := make([]struct {
		Index int
		Score float64
	}, r.docTermMatrix.Rows())
	for i := 0; i < r.docTermMatrix.Rows(); i++ {
		// Extract document vector
		docVector := r.docTermMatrix.RowView(i)

		// Calculate cosine similarity
		similarities[i].Index = i
		similarities[i].Score = nlp.CosineSimilarity(queryTfidf, docVector)
	}

	// Sort by score descending
	sort.Slice(similarities, func(i, j int) bool {
		return similarities[i].Score > similarities[j].Score
	})

	// Return top-k results
	if topK > len(similarities) {
		topK = len(similarities)
	}
	return similarities[:topK], nil
}

// Search performs hybrid search combining dense and sparse retrieval
func (r *HybridRetriever) Search(ctx context.Context, query string, topK int) ([]map[string]interface{}, error) {
	// Perform dense and sparse searches
	denseResults, err := r.denseSearch(ctx, query, topK)
	if err != nil {
		return nil, err
	}

	sparseResults, err := r.sparseSearch(query, topK)
	if err != nil {
		return nil, err
	}

	// Normalize scores
	maxDense := 0.0
	for _, result := range denseResults {
		if result.Score > maxDense {
			maxDense = result.Score
		}
	}

	maxSparse := 0.0
	for _, result := range sparseResults {
		if result.Score > maxSparse {
			maxSparse = result.Score
		}
	}

	normalizedDense := make(map[int]float64)
	for _, result := range denseResults {
		normalizedDense[result.Index] = result.Score / maxDense
	}

	normalizedSparse := make(map[int]float64)
	for _, result := range sparseResults {
		normalizedSparse[result.Index] = result.Score / maxSparse
	}

	// Combine scores
	combinedScores := make(map[int]float64)
	for idx, score := range normalizedDense {
		combinedScores[idx] = score * r.denseWeight
	}

	for idx, score := range normalizedSparse {
		if _, exists := combinedScores[idx]; exists {
			combinedScores[idx] += score * r.sparseWeight
		} else {
			combinedScores[idx] = score * r.sparseWeight
		}
	}

	// Convert to slice for sorting
	type indexedScore struct {
		Index int
		Score float64
	}

	var scores []indexedScore
	for idx, score := range combinedScores {
		scores = append(scores, indexedScore{Index: idx, Score: score})
	}

	// Sort by score descending
	sort.Slice(scores, func(i, j int) bool {
		return scores[i].Score > scores[j].Score
	})

	// Get top-k results
	if topK > len(scores) {
		topK = len(scores)
	}

	results := make([]map[string]interface{}, topK)
	for i := 0; i < topK; i++ {
		idx := scores[i].Index
		results[i] = map[string]interface{}{
			"text":         r.texts[idx],
			"score":        combinedScores[idx],
			"dense_score":  normalizedDense[idx] * r.denseWeight,
			"sparse_score": normalizedSparse[idx] * r.sparseWeight,
		}
	}

	return results, nil
}

func main() {
	ctx := context.Background()
	avalaiClient := openai.NewClient("YOUR_AVALAI_API_KEY")
	avalaiClient.BaseURL = "https://api.avalai.ir/v1" // AvalAI API endpoint

	texts := []string{
		"AvalAI provides access to a wide range of language models through a unified API.",
		"The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
		"Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
		"AvalAI offers tools for monitoring usage and managing costs effectively.",
		"The documentation includes examples and best practices for different use cases.",
	}

	retriever := NewHybridRetriever(texts, avalaiClient, 0.7)
	if err := retriever.Initialize(ctx); err != nil {
		fmt.Printf("Failed to initialize retriever: %v\n", err)
		return
	}

	query := "Which AI models does AvalAI support?"
	results, err := retriever.Search(ctx, query, 2)
	if err != nil {
		fmt.Printf("Search failed: %v\n", err)
		return
	}

	for i, result := range results {
		fmt.Printf("Result %d: %s\n", i+1, result["text"])
		fmt.Printf("Total Score: %.4f\n", result["score"])
		fmt.Printf("Dense Score: %.4f\n", result["dense_score"])
		fmt.Printf("Sparse Score: %.4f\n\n", result["sparse_score"])
	}
}

```

## 6. Re-ranking

Re-ranking improves retrieval quality by applying a more sophisticated model to reorder the initial retrieval results.

### Best Practices

- **Cross-Encoder Models**: Use cross-encoders for better relevance assessment
- **Two-Stage Retrieval**: Retrieve more documents than needed, then re-rank
- **Feature Enrichment**: Include additional features like recency or popularity in re-ranking
- **Diversification**: Ensure result diversity to cover different aspects of the query

```language-selector
python=:from openai import OpenAI
import numpy as np
from sentence_transformers import CrossEncoder

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


class ReRanker:
    """Re-ranks retrieved documents using a cross-encoder model."""

    def __init__(self, model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)

    def rerank(self, query, documents, top_k=None):
        """
        Re-rank documents based on relevance to query.

        Args:
        query: The search query
        documents: List of document texts or dictionaries with 'text' key
        top_k: Number of top documents to return (None for all)

        Returns:
        List of dictionaries with text and score
        """
        # Prepare document texts
        if isinstance(documents[0], dict):
            texts = [doc["text"] for doc in documents]
        else:
            texts = documents

        # Create pairs of (query, document)
        pairs = [[query, text] for text in texts]

        # Get relevance scores
        scores = self.model.predict(pairs)

        # Create results with scores
        results = []
        for i, (text, score) in enumerate(zip(texts, scores)):
            result = {"text": text, "score": float(score)}

        # Add original metadata if available
        if isinstance(documents[0], dict):
            for key, value in documents[i].items():
                if key != "text":
                    result[key] = value

        results.append(result)

        # Sort by score (descending)
        results.sort(key=lambda x: x["score"], reverse=True)

        # Return top-k results
        if top_k is not None:
            results = results[:top_k]

        return results

    # Example usage
    def create_embedding(text):
        """Generate embeddings for a given text."""
        response = client.embeddings.create(model="text-embedding-3-large", input=text)
        return response.data[0].embedding

    def vector_search(query, documents, top_k=5):
        """Simple vector search function."""
        query_embedding = create_embedding(query)
        results = []

        for doc in documents:
            doc_embedding = create_embedding(doc["text"])
            similarity = np.dot(query_embedding, doc_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
            )
            results.append(
                {
                    "text": doc["text"],
                    "metadata": doc.get("metadata", {}),
                    "similarity": similarity,
                }
            )

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]


# Example documents
documents = [
    {
        "text": "AvalAI provides access to a wide range of language models through a unified API.",
        "metadata": {"source": "docs", "page": 1},
    },
    {
        "text": "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
        "metadata": {"source": "docs", "page": 1},
    },
    {
        "text": "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
        "metadata": {"source": "docs", "page": 2},
    },
    {
        "text": "AvalAI offers tools for monitoring usage and managing costs effectively.",
        "metadata": {"source": "docs", "page": 3},
    },
    {
        "text": "The documentation includes examples and best practices for different use cases.",
        "metadata": {"source": "docs", "page": 4},
    },
]

query = "Which AI models does AvalAI support?"

# First-stage retrieval (get more documents than needed)
first_stage_results = vector_search(query, documents, top_k=4)
print("First-stage retrieval results:")
for i, result in enumerate(first_stage_results):
    print(f"{i+1}. {result['text']} (Score: {result['similarity']:.4f})")

# Re-ranking
reranker = ReRanker()
reranked_results = reranker.rerank(query, first_stage_results, top_k=2)

print("\nRe-ranked results:")
for i, result in enumerate(reranked_results):
    print(f"{i+1}. {result['text']} (Score: {result['score']:.4f})")
    print(
        f" Source: {result['metadata']['source']}, Page: {result['metadata']['page']}"
    )

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

class ReRanker {
  /**
   * Re-ranks retrieved documents using AvalAI's reranking model
   */
  constructor() {
    // Using AvalAI's reranking model
    this.modelName = "rerank-multilingual-v2.0";
  }

  /**
   * Re-rank documents based on relevance to query
   * @param {string} query - The search query
   * @param {Array} documents - List of document texts or objects with 'text' key
   * @param {number} topK - Number of top documents to return (optional)
   * @returns {Promise<Array>} - List of documents with scores
   */
  async rerank(query, documents, topK = null) {
    // Prepare document texts
    const texts = documents.map((doc) =>
      typeof doc === "string" ? doc : doc.text,
    );

    // Create pairs of (query, document)
    const response = await client.reranking.create({
      model: this.modelName,
      query: query,
      documents: texts,
    });

    // Create results with scores
    const results = response.results.map((result, i) => {
      const doc = documents[i];
      const resultObj = {
        text: texts[i],
        score: result.relevanceScore,
      };

      // Add original metadata if available
      if (typeof doc === "object") {
        Object.keys(doc).forEach((key) => {
          if (key !== "text") {
            resultObj[key] = doc[key];
          }
        });
      }

      return resultObj;
    });

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    // Return top-k results if specified
    return topK ? results.slice(0, topK) : results;
  }
}

/**
 * Generate embeddings for a given text
 * @param {string} text - Input text
 * @returns {Promise<number[]>} - Embedding vector
 */
async function createEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Simple vector search function
 * @param {string} query - Search query
 * @param {Array} documents - List of documents
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} - Top results
 */
async function vectorSearch(query, documents, topK = 5) {
  const queryEmbedding = await createEmbedding(query);
  const results = [];

  for (const doc of documents) {
    const docEmbedding = await createEmbedding(doc.text);

    // Calculate cosine similarity
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < queryEmbedding.length; i++) {
      dotProduct += queryEmbedding[i] * docEmbedding[i];
      normA += queryEmbedding[i] * queryEmbedding[i];
      normB += docEmbedding[i] * docEmbedding[i];
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

    results.push({
      text: doc.text,
      metadata: doc.metadata || {},
      similarity: similarity,
    });
  }

  // Sort by similarity (descending)
  results.sort((a, b) => b.similarity - a.similarity);

  // Return top-k results
  return results.slice(0, topK);
}

// Example usage
async function main() {
  // Example documents
  const documents = [
    {
      text: "AvalAI provides access to a wide range of language models through a unified API.",
      metadata: { source: "docs", page: 1 },
    },
    {
      text: "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
      metadata: { source: "docs", page: 1 },
    },
    {
      text: "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
      metadata: { source: "docs", page: 2 },
    },
    {
      text: "AvalAI offers tools for monitoring usage and managing costs effectively.",
      metadata: { source: "docs", page: 3 },
    },
    {
      text: "The documentation includes examples and best practices for different use cases.",
      metadata: { source: "docs", page: 4 },
    },
  ];

  const query = "Which AI models does AvalAI support?";

  // First-stage retrieval (get more documents than needed)
  console.log("First-stage retrieval results:");
  const firstStageResults = await vectorSearch(query, documents, 4);

  firstStageResults.forEach((result, i) => {
    console.log(
      `${i + 1}. ${result.text} (Score: ${result.similarity.toFixed(4)})`,
    );
  });

  // Re-ranking
  const reranker = new ReRanker();
  const rerankedResults = await reranker.rerank(query, firstStageResults, 2);

  console.log("\nRe-ranked results:");
  rerankedResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.text} (Score: ${result.score.toFixed(4)})`);
    console.log(
      ` Source: ${result.metadata.source}, Page: ${result.metadata.page}`,
    );
  });
}

main().catch(console.error);

bash=:# Using cURL to rerank documents
  curl https://api.avalai.ir/v1/reranking \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $AVALAI_API_KEY" \
   -d '{
   "model": "rerank-multilingual-v2.0",
   "query": "Which AI models does AvalAI support?",
   "documents": [
   "AvalAI provides access to a wide range of language models through a unified API.",
   "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
   "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
   "AvalAI offers tools for monitoring usage and managing costs effectively."
   ]
  }'

```

## 7. Generation

The final step in a RAG pipeline is generating a response based on the retrieved information. This involves providing the LLM with the right context and prompting it effectively.

### Best Practices

- **Context Format**: Structure the retrieved context in a clear and organized way
- **Citation**: Include source information for attribution
- **Prompt Engineering**: Use effective prompts that instruct the model on how to use the retrieved information
- **Streaming**: Use streaming responses for better user experience with long answers
- **Evaluation**: Regularly evaluate the quality of generated responses

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


def generate_rag_response(query, retrieved_documents, model="gpt-5.5"):
    """
    Generate a response based on retrieved documents.

    Args:
    query: User's question
    retrieved_documents: List of retrieved documents with metadata
    model: Model to use for generation

    Returns:
    Generated response
    """
    # Format retrieved context with citations
    formatted_context = ""
    for i, doc in enumerate(retrieved_documents):
        source_info = (
            f"[{i+1}] Source: {doc.get('metadata', {}).get('source', 'Unknown')}"
        )
        if "page" in doc.get("metadata", {}):
            source_info += f", Page: {doc['metadata']['page']}"

    formatted_context += f"{doc['text']}\n{source_info}\n\n"

    # Create system prompt
    system_prompt = f"""You are a helpful assistant that answers questions based on the provided context.
	Follow these rules:
	1. Answer ONLY based on the context provided
	2. If the context doesn't contain the answer, say "I don't have enough information to answer this question"
	3. Include citations [1], [2], etc. when referencing information from the context
	4. Be concise and to the point
	5. Format your answer in a clear and readable way"""

    # Create user prompt
    user_prompt = f"""Context:
	{formatted_context}

	Question: {query}"""

    # Generate response
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    return response.choices[0].message.content


# Example usage
query = "Which AI models does AvalAI support?"

# Example retrieved documents (in a real scenario, these would come from the retrieval step)
retrieved_documents = [
    {
        "text": "AvalAI provides access to a wide range of language models through a unified API.",
        "metadata": {"source": "docs", "page": 1},
        "score": 0.92,
    },
    {
        "text": "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
        "metadata": {"source": "docs", "page": 1},
        "score": 0.87,
    },
]

response = generate_rag_response(query, retrieved_documents)
print(f"Query: {query}\n")
print(f"Response:\n{response}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

/**
 * Generate a response based on retrieved documents
 * @param {string} query - User's question
 * @param {Array} retrievedDocuments - List of retrieved documents with metadata
 * @param {string} model - Model to use for generation
 * @returns {Promise<string>} - Generated response
 */
async function generateRagResponse(
  query,
  retrievedDocuments,
  model = "gpt-5.5",
) {
  // Format retrieved context with citations
  let formattedContext = "";

  retrievedDocuments.forEach((doc, i) => {
    const metadata = doc.metadata || {};
    let sourceInfo = `[${i + 1}] Source: ${metadata.source || "Unknown"}`;

    if (metadata.page !== undefined) {
      sourceInfo += `, Page: ${metadata.page}`;
    }

    formattedContext += `${doc.text}\n${sourceInfo}\n\n`;
  });

  // Create system prompt
  const systemPrompt = `You are a helpful assistant that answers questions based on the provided context.
Follow these rules:
1. Answer ONLY based on the context provided
2. If the context doesn't contain the answer, say "I don't have enough information to answer this question"
3. Include citations [1], [2], etc. when referencing information from the context
4. Be concise and to the point
5. Format your answer in a clear and readable way`;

  // Create user prompt
  const userPrompt = `Context:
${formattedContext}

Question: ${query}`;

  // Generate response
  const response = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0].message.content;
}

// Example usage
async function main() {
  const query = "Which AI models does AvalAI support?";

  // Example retrieved documents (in a real scenario, these would come from the retrieval step)
  const retrievedDocuments = [
    {
      text: "AvalAI provides access to a wide range of language models through a unified API.",
      metadata: { source: "docs", page: 1 },
      score: 0.92,
    },
    {
      text: "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
      metadata: { source: "docs", page: 1 },
      score: 0.87,
    },
  ];

  const response = await generateRagResponse(query, retrievedDocuments);
  console.log(`Query: ${query}\n`);
  console.log(`Response:\n${response}`);
}

main().catch(console.error);

go=:package main

import (
	"context"
	"fmt"
	"log"
	"os"

	openai "github.com/openai/openai-go"
)

// GenerateRagResponse generates a response based on retrieved documents
func GenerateRagResponse(ctx context.Context, client *openai.Client, query string, retrievedDocuments []map[string]interface{}, model string) (string, error) {
	// Format retrieved context with citations
	formattedContext := ""

	for i, doc := range retrievedDocuments {
		text, _ := doc["text"].(string)
		metadata, _ := doc["metadata"].(map[string]interface{})

		var source string
		if s, ok := metadata["source"]; ok {
			source = fmt.Sprintf("%v", s)
		} else {
			source = "Unknown"
		}

		sourceInfo := fmt.Sprintf("[%d] Source: %s", i+1, source)

		if page, ok := metadata["page"]; ok {
			sourceInfo += fmt.Sprintf(", Page: %v", page)
		}

		formattedContext += fmt.Sprintf("%s\n%s\n\n", text, sourceInfo)
	}

	// Create system prompt
	systemPrompt := `You are a helpful assistant that answers questions based on the provided context.
Follow these rules:
1. Answer ONLY based on the context provided
2. If the context doesn't contain the answer, say "I don't have enough information to answer this question"
3. Include citations [1], [2], etc. when referencing information from the context
4. Be concise and to the point
5. Format your answer in a clear and readable way`

	// Create user prompt
	userPrompt := fmt.Sprintf(`Context:
%s

Question: %s`, formattedContext, query)

	// Generate response
	resp, err := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: model,
			Messages: []avalai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userPrompt,
				},
			},
		},
	)

	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}

func main() {
	// Initialize client
	client := openai.NewClient(os.Getenv("AVALAI_API_KEY"))
	client.BaseURL = "https://api.avalai.ir/v1" // AvalAI API endpoint
	ctx := context.Background()

	query := "Which AI models does AvalAI support?"

	// Example retrieved documents (in a real scenario, these would come from the retrieval step)
	retrievedDocuments := []map[string]interface{}{
		{
			"text": "AvalAI provides access to a wide range of language models through a unified API.",
			"metadata": map[string]interface{}{
				"source": "docs",
				"page":   1,
			},
			"score": 0.92,
		},
		{
			"text": "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
			"metadata": map[string]interface{}{
				"source": "docs",
				"page":   1,
			},
			"score": 0.87,
		},
	}

	response, err := GenerateRagResponse(ctx, client, query, retrievedDocuments, "gpt-5.5")
	if err != nil {
		log.Fatalf("Failed to generate response: %v", err)
	}

	fmt.Printf("Query: %s\n\n", query)
	fmt.Printf("Response:\n%s\n", response)
}

bash=:# Using cURL to generate a RAG response
cat >rag_prompt.json <<'EOF'
{
 "model": "gpt-5.5",
 "messages": [
 {
 "role": "system",
 "content": "You are a helpful assistant that answers questions based on the provided context.\nFollow these rules:\n1. Answer ONLY based on the context provided\n2. If the context doesn't contain the answer, say \"I don't have enough information to answer this question\"\n3. Include citations [1], [2], etc. when referencing information from the context\n4. Be concise and to the point\n5. Format your answer in a clear and readable way"
 },
 {
 "role": "user",
 "content": "Context:\nAvalAI provides access to a wide range of language models through a unified API.\n[1] Source: docs, Page: 1\n\nThe platform supports models from various providers including OpenAI, Anthropic, Google, and more.\n[2] Source: docs, Page: 1\n\nQuestion: Which AI models does AvalAI support?"
 }
 ]
}
EOF

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d @rag_prompt.json

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
                {
                    "type": "input_text",
                    "text": "Explain how AvalAI provides a unified API for this request.",
                },
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
        { type: "input_text", text: "Explain how AvalAI provides a unified API for this request." },
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
            "text": "Explain how AvalAI provides a unified API for this request."
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


## 8. Putting It All Together

A complete RAG pipeline combines all the components we've discussed. Here's an example of a full RAG implementation:

```python
from openai import OpenAI
import numpy as np
from typing import List, Dict, Any
import faiss
import pickle

# Initialize client
client = OpenAI(
	api_key="your-avalai-api-key",
	base_url="https://api.avalai.ir/v1", # AvalAI API endpoint
)

class RAGPipeline:
	"""Complete RAG pipeline implementation."""

	def __init__(self, model="gpt-5.5", embedding_model="text-embedding-3-large"):
		self.model = model
		self.embedding_model = embedding_model
		self.index = None
		self.texts = []
		self.metadata = []

	def add_documents(self, documents: List[Dict[str, Any]]):
		"""
		Add documents to the RAG pipeline.

		Args:
		documents: List of dictionaries with 'text' and optional 'metadata'
		"""
		texts = [doc["text"] for doc in documents]
		metadata = [doc.get("metadata", {}) for doc in documents]

		# Create embeddings
		embeddings = [self._create_embedding(text) for text in texts]
		embeddings_array = np.array(embeddings).astype('float32')

		# Initialize or update index
		if self.index is None:
			dimension = len(embeddings[0])
			self.index = faiss.IndexFlatL2(dimension)

			# Add to index
			self.index.add(embeddings_array)

			# Store texts and metadata
			start_idx = len(self.texts)
			self.texts.extend(texts)
			self.metadata.extend(metadata)

		return list(range(start_idx, start_idx + len(texts)))

	def _create_embedding(self, text):
		"""Generate embeddings for a given text."""
		response = client.embeddings.create(
			model=self.embedding_model,
			input=text
		)
		return response.data[0].embedding

	def _query_needs_retrieval(self, query):
		"""Determine if the query requires external retrieval."""
		response = client.chat.completions.create(
			model=self.model,
			messages=[
					{"role": "system", "content": "You are a query classifier. Respond with 'RETRIEVE' if the query requires external knowledge, or 'SUFFICIENT' if the model's knowledge is enough."},
					{"role": "user", "content": query}
				]
		)
		classification = response.choices[0].message.content
		return "RETRIEVE" in classification

	def _retrieve(self, query, k=5):
		"""Retrieve relevant documents for a query."""
		query_embedding = self._create_embedding(query)
		query_embedding_array = np.array([query_embedding]).astype('float32')

		# Search
		distances, indices = self.index.search(query_embedding_array, k)

		# Return results
		results = []
		for i, idx in enumerate(indices[0]):
			if idx < len(self.texts) and idx >= 0: # Valid index
				results.append({
					'text': self.texts[idx],
					'metadata': self.metadata[idx],
					'distance': float(distances[0][i])
				})

		return results

	def _generate_response(self, query, retrieved_documents):
		"""Generate a response based on retrieved documents."""
		# Format retrieved context with citations
		formatted_context = ""
		for i, doc in enumerate(retrieved_documents):
			source_info = f"[{i+1}] Source: {doc.get('metadata', {}).get('source', 'Unknown')}"
				if 'page' in doc.get('metadata', {}):
					source_info += f", Page: {doc['metadata']['page']}"

		formatted_context += f"{doc['text']}\n{source_info}\n\n"

		# Create system prompt
		system_prompt = f"""You are a helpful assistant that answers questions based on the provided context.
		Follow these rules:
		1. Answer ONLY based on the context provided
		2. If the context doesn't contain the answer, say "I don't have enough information to answer this question"
		3. Include citations [1], [2], etc. when referencing information from the context
		4. Be concise and to the point
		5. Format your answer in a clear and readable way"""

		# Create user prompt
		user_prompt = f"""Context:
		{formatted_context}

		Question: {query}"""

		# Generate response
		response = client.chat.completions.create(
			model=self.model,
			messages=[
					{"role": "system", "content": system_prompt},
					{"role": "user", "content": user_prompt}
				]
		)

		return response.choices[0].message.content

	def query(self, query, k=5):
		"""
		Process a query through the RAG pipeline.

		Args:
		query: User's question
		k: Number of documents to retrieve

		Returns:
		Generated response
		"""
		# Check if query needs retrieval
		needs_retrieval = self._query_needs_retrieval(query)

		if needs_retrieval and self.index is not None:
			# Retrieve relevant documents
			retrieved_documents = self._retrieve(query, k)

			# Generate response with context
			response = self._generate_response(query, retrieved_documents)
			return response, retrieved_documents
		else:
			# Generate response without retrieval
			response = client.chat.completions.create(
				model=self.model,
				messages=[
					{"role": "system", "content": "You are a helpful assistant."},
					{"role": "user", "content": query}
				]
			)
			return response.choices[0].message.content, []

	def save(self, filepath):
		"""Save the RAG pipeline to disk."""
		with open(filepath + '.faiss', 'wb') as f:
			faiss.write_index(self.index, f)

		with open(filepath + '.pkl', 'wb') as f:
			pickle.dump({
				'texts': self.texts,
				'metadata': self.metadata,
				'model': self.model,
				'embedding_model': self.embedding_model
			}, f)

	@classmethod
	def load(cls, filepath):
		"""Load the RAG pipeline from disk."""
		with open(filepath + '.pkl', 'rb') as f:
			data = pickle.load(f)

		rag = cls(model=data['model'], embedding_model=data['embedding_model'])
		rag.texts = data['texts']
		rag.metadata = data['metadata']

		with open(filepath + '.faiss', 'rb') as f:
			rag.index = faiss.read_index(f)

		return rag

# Example usage
# Create and initialize RAG pipeline
rag = RAGPipeline()

# Add documents
documents = [
	{
		"text": "AvalAI provides access to a wide range of language models through a unified API.",
		"metadata": {"source": "docs", "page": 1}
	},
	{
		"text": "The platform supports models from various providers including OpenAI, Anthropic, Google, and more.",
		"metadata": {"source": "docs", "page": 1}
	},
	{
		"text": "Each model has different capabilities and pricing, so it's important to understand the tradeoffs.",
		"metadata": {"source": "docs", "page": 2}
	},
	{
		"text": "AvalAI offers tools for monitoring usage and managing costs effectively.",
		"metadata": {"source": "docs", "page": 3}
	},
	{
		"text": "The documentation includes examples and best practices for different use cases.",
		"metadata": {"source": "docs", "page": 4}
	}
]

rag.add_documents(documents)

# Save the RAG pipeline
rag.save("my_rag_pipeline")

# Query the RAG pipeline
query = "Which AI models does AvalAI support?"
response, retrieved_docs = rag.query(query)

print(f"Query: {query}\n")
print(f"Retrieved documents:")
for i, doc in enumerate(retrieved_docs):
	print(f"{i+1}. {doc['text']} (Distance: {doc['distance']:.4f})")

print(f"\nResponse:\n{response}")
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
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Conclusion

Implementing an effective RAG pipeline requires careful consideration of each component. By following these best practices, you can build a system that provides accurate, relevant, and factual responses to user queries.

Remember that RAG is not a one-size-fits-all solution. Experiment with different configurations and approaches to find what works best for your specific use case. Continuous evaluation and refinement are key to maintaining and improving performance over time.

For more information and advanced topics, refer to the AvalAI documentation on specific components like embeddings, reranking, and chat completions.
