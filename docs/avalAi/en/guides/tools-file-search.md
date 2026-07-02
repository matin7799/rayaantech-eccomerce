# File Search Tool

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 

Allow models to search your files for relevant information before generating a response.

## Overview

File search is a tool available in the [Responses API](/api-reference/responses.md). It enables models to retrieve information from a knowledge base of previously uploaded files through semantic and keyword search. By creating vector stores and uploading files to them, you can augment the models' inherent knowledge by giving them access to these knowledge bases or `vector_stores`.

To learn more about how vector stores and semantic search work, refer to our [retrieval guide](/guides/retrieval.md) (assuming this guide exists or will exist).

This is a hosted tool managed by the API provider, meaning you don't have to implement code on your end to handle its execution. When the model decides to use it, it will automatically call the tool, retrieve information from your files, and return an output.

## How to use

Prior to using file search with the Responses API, you need to have set up a knowledge base in a vector store and uploaded files to it using the API.

### 1. Create a vector store and upload a file

Follow these steps to create a vector store and upload a file to it. You can use [this example file](https://cdn.openai.com/API/docs/deep_research_blog.pdf) or upload your own.

#### Upload the file to the File API

Upload a file using the Files API. You can upload from a local path or a public URL.

```language-selector
python=:import requests
from io import BytesIO
from openai import OpenAI  # Use the standard OpenAI client with custom base URL
import os

# Configure the client to use custom endpoint and API key
client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"]
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)


def create_file(client, file_path):
    if file_path.startswith("http://") or file_path.startswith("https://"):
        # Download the file content from the URL
        response = requests.get(file_path)
        response.raise_for_status()  # Raise an exception for bad status codes
        file_content = BytesIO(response.content)
        file_name = file_path.split("/")[-1]
        file_tuple = (file_name, file_content)
        result = client.files.create(
            file=file_tuple,
            purpose="assistants",  # Use 'assistants' purpose for file search
        )
    else:
        # Handle local file path
        with open(file_path, "rb") as file_content:
            result = client.files.create(
                file=file_content,
                purpose="assistants",  # Use 'assistants' purpose for file search
            )
    print(f"File created with ID: {result.id}")
    return result.id


# Replace with your own file path or URL
# Example URL: "https://cdn.openai.com/API/docs/deep_research_blog.pdf"
# Example local path: "path/to/your/local/file.pdf"

try:
    file_id = create_file(
        client, "https://cdn.openai.com/API/docs/deep_research_blog.pdf"
    )
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:import fs from "fs";
import OpenAI from "openai"; // Use the standard OpenAI client with custom base URL
import fetch from "node-fetch"; // Ensure node-fetch is installed for URL downloads
import { File } from "node:buffer"; // Use File from node:buffer

// Configure the client to use custom endpoint and API key
const openai = new OpenAI({
  apiKey: process.env.API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

async function createFile(filePath) {
  let result;
  try {
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      // Download the file content from the URL
      const res = await fetch(filePath);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const buffer = await res.arrayBuffer();
      const urlParts = filePath.split("/");
      const fileName = urlParts[urlParts.length - 1];
      // Use File constructor available in recent Node versions
      const file = new File([buffer], fileName);
      result = await openai.files.create({
        file: file,
        purpose: "assistants", // Use 'assistants' purpose for file search
      });
    } else {
      // Handle local file path
      const fileContent = fs.createReadStream(filePath);
      result = await openai.files.create({
        file: fileContent,
        purpose: "assistants", // Use 'assistants' purpose for file search
      });
    }
    console.log(`File created with ID: ${result.id}`);
    return result.id;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error after logging
  }
}

// Replace with your own file path or URL
// Example URL: "https://cdn.openai.com/API/docs/deep_research_blog.pdf"
// Example local path: "path/to/your/local/file.pdf"
(async () => {
  try {
    const fileId = await createFile(
      "https://cdn.openai.com/API/docs/deep_research_blog.pdf",
    );
  } catch (error) {
    // Error is already logged in the function
  }
})();

bash=:# Uploading a local file (replace 'path/to/your/local/file.pdf' and 'your_file.pdf')
curl "https://api.avalai.ir/v1/files" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -F purpose="assistants" \
  -F file="@path/to/your/local/file.pdf;filename=your_file.pdf"

# Note: Uploading directly from a URL via curl requires downloading first.
# Example using wget to download and then upload:
# FILE_URL="https://cdn.openai.com/API/docs/deep_research_blog.pdf"
# FILENAME=$(basename "$FILE_URL")
# wget -O "/tmp/$FILENAME" "$FILE_URL"
# curl "https://api.avalai.ir/v1/files" \
# -H "Authorization: Bearer $AVALAI_API_KEY" \
# -F purpose="assistants" \
# -F file="@/tmp/$FILENAME;filename=$FILENAME"
# rm "/tmp/$FILENAME" # Clean up downloaded file

go=:package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	openai "github.com/openai/openai-go" // Use the standard OpenAI Go client with custom base URL
)

func main() {
	apiKey := os.Getenv("API_KEY")
	baseURL := "https://api.avalai.ir/v1" // Use custom endpoint

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	// --- Upload Local File ---
	// Replace "path/to/your/local/file.pdf" with your actual file path
	localFilePath := "path/to/your/local/file.pdf"
	req := openai.FileRequest{
		FileName: filepath.Base(localFilePath),
		FilePath: localFilePath,
		Purpose:  "assistants", // Use 'assistants' purpose for file search
	}
	resp, err := client.CreateFile(context.Background(), req)
	if err != nil {
		fmt.Printf("Local file upload error: %v\n", err)
	} else {
		fmt.Printf("Local file uploaded successfully. File ID: %s\n", resp.ID)
	}

	// --- Upload Remote File (Requires downloading first) ---
	// Replace with your URL
	remoteFileURL := "https://cdn.openai.com/API/docs/deep_research_blog.pdf"
	httpClient := &http.Client{}
	httpReq, _ := http.NewRequest("GET", remoteFileURL, nil)
	httpResp, err := httpClient.Do(httpReq)
	if err != nil {
		fmt.Printf("Error downloading remote file: %v\n", err)
		return
	}
	defer httpResp.Body.Close()

	if httpResp.StatusCode != http.StatusOK {
		fmt.Printf("Error downloading remote file: status code %d\n", httpResp.StatusCode)
		return
	}

	remoteFileName := filepath.Base(remoteFileURL)
	reqRemote := openai.FileRequest{
		FileName: remoteFileName,
		Reader:   httpResp.Body, // Pass the response body reader
		Purpose:  "assistants",  // Use 'assistants' purpose for file search
	}
	respRemote, err := client.CreateFileFromReader(context.Background(), reqRemote) // Assuming CreateFileFromReader exists
	if err != nil {
		fmt.Printf("Remote file upload error: %v\n", err)
	} else {
		fmt.Printf("Remote file uploaded successfully. File ID: %s\n", respRemote.ID)
	}
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php'); // Assuming Composer autoload

use GuzzleHttp\Client as HttpClient; // Using Guzzle for HTTP requests
use GuzzleHttp\Psr7\Utils;

$apiKey = getenv('API_KEY');
// Using OpenAI PHP client with custom base URL
$client = \OpenAI\Client::create($apiKey, "https://api.avalai.ir/v1");

// --- Upload Local File ---
// Replace 'path/to/your/local/file.pdf' with your actual file path
$localFilePath = 'path/to/your/local/file.pdf';
try {
    $response = $client->files()->create([
        'purpose' => 'assistants', // Use 'assistants' purpose for file search
        'file' => fopen($localFilePath, 'r'), // Open file handle
        // Optionally provide filename if different from path basename
        // 'filename' => 'custom_name.pdf'
    ]);
    echo "Local file uploaded successfully. File ID: " . $response->id . "\n";
} catch (\Exception $e) {
    echo "Local file upload error: " . $e->getMessage() . "\n";
}

// --- Upload Remote File (Requires downloading first) ---
// Replace with your URL
$remoteFileUrl = 'https://cdn.openai.com/API/docs/deep_research_blog.pdf';
$httpClient = new HttpClient();
try {
    $httpResponse = $httpClient->get($remoteFileUrl);
    if ($httpResponse->getStatusCode() == 200) {
        $fileContent = $httpResponse->getBody();
        $fileName = basename($remoteFileUrl);

        $response = $client->files()->create([
            'purpose' => 'assistants', // Use 'assistants' purpose for file search
            'file' => Utils::streamFor($fileContent), // Use Guzzle stream utility
            'filename' => $fileName,
        ]);
        echo "Remote file uploaded successfully. File ID: " . $response->id . "\n";
    } else {
        echo "Failed to download remote file. Status code: " . $httpResponse->getStatusCode() . "\n";
    }
} catch (\Exception $e) {
    echo "Remote file upload error: " . $e->getMessage() . "\n";
}
?>

```

#### Create a vector store

Create a vector store using the API.

```language-selector
python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"]
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)

try:
    vector_store = client.beta.vector_stores.create(  # Note: Using beta namespace as per OpenAI client
        name="My Knowledge Base"
    )
    print(f"Vector store created with ID: {vector_store.id}")
    # Store this vector_store.id for later use
except Exception as e:
    print(f"An error occurred creating vector store: {e}")

javascript=:import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

async function createVectorStore() {
  try {
    const vectorStore = await openai.beta.vectorStores.create({
      // Note: Using beta namespace
      name: "My Knowledge Base",
    });
    console.log(`Vector store created with ID: ${vectorStore.id}`);
    // Store this vectorStore.id for later use
    return vectorStore.id;
  } catch (error) {
    console.error("An error occurred creating vector store:", error);
  }
}

createVectorStore();

bash=:curl "https://api.avalai.ir/v1/vector_stores" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \ # Assuming beta header might be needed
-d '{
    "name": "My Knowledge Base"
  }'

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go" // Use the standard OpenAI Go client with custom base URL
)

func main() {
	apiKey := os.Getenv("API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	// Assuming beta header needs to be added for vector stores
	config.AddRequestHeader("OpenAI-Beta", "assistants=v2")
	client := openai.NewClientWithConfig(config)

	req := openai.VectorStoreRequest{ // Assuming struct name
		Name: "My Knowledge Base",
	}

	resp, err := client.CreateVectorStore(context.Background(), req) // Assuming method name
	if err != nil {
		fmt.Printf("Vector store creation error: %v\n", err)
		return
	}

	fmt.Printf("Vector store created successfully. ID: %s\n", resp.ID)
	// Store this resp.ID for later use
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php');

$apiKey = getenv('API_KEY');
$client = \OpenAI\Client::create($apiKey, "https://api.avalai.ir/v1");

try {
    // Assuming the client handles beta features, possibly via a method or header config
    $vectorStore = $client->vectorStores()->create([ // Assuming method exists
        'name' => 'My Knowledge Base',
    ], [
        // Optional: If headers are needed for beta features
        // 'OpenAI-Beta' => 'assistants=v2'
    ]);
    echo "Vector store created successfully. ID: " . $vectorStore->id . "\n";
    // Store this $vectorStore->id for later use
} catch (\Exception $e) {
    echo "Vector store creation error: " . $e->getMessage() . "\n";
}
?>

```

#### Add the file to the vector store

Associate the uploaded file with your vector store.

```language-selector
python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"]
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)

# Replace with your actual Vector Store ID and File ID
vector_store_id = "vs_..."  # Replace with your vector store ID
file_id = "file_..."  # Replace with your file ID

try:
    vector_store_file = client.beta.vector_stores.files.create(
        vector_store_id=vector_store_id, file_id=file_id
    )
    print(
        f"File {file_id} added to vector store {vector_store_id}. Status: {vector_store_file.status}"
    )
except Exception as e:
    print(f"An error occurred adding file to vector store: {e}")

javascript=:import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

// Replace with your actual Vector Store ID and File ID
const vectorStoreId = "vs_..."; // Replace with your vector store ID
const fileId = "file_..."; // Replace with your file ID

async function addFileToVectorStore(vectorStoreId, fileId) {
  try {
    const vectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStoreId,
      { file_id: fileId },
    );
    console.log(
      `File ${fileId} added to vector store ${vectorStoreId}. Status: ${vectorStoreFile.status}`,
    );
  } catch (error) {
    console.error("An error occurred adding file to vector store:", error);
  }
}

addFileToVectorStore(vectorStoreId, fileId);

bash=:# Replace {vector_store_id} and {file_id} with your actual IDs
VECTOR_STORE_ID="vs_..."
FILE_ID="file_..."

curl "https://api.avalai.ir/v1/vector_stores/$VECTOR_STORE_ID/files" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \ # Assuming beta header might be needed
-d '{
    "file_id": "'"$FILE_ID"'"
  }'

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go" // Use the standard OpenAI Go client with custom base URL
)

func main() {
	apiKey := os.Getenv("API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	config.AddRequestHeader("OpenAI-Beta", "assistants=v2") // Assuming beta header
	client := openai.NewClientWithConfig(config)

	vectorStoreID := "vs_..." // Replace with your vector store ID
	fileID := "file_..."      // Replace with your file ID

	req := openai.VectorStoreFileRequest{ // Assuming struct name
		FileID: fileID,
	}

	resp, err := client.CreateVectorStoreFile(context.Background(), vectorStoreID, req) // Assuming method name
	if err != nil {
		fmt.Printf("Error adding file to vector store: %v\n", err)
		return
	}

	fmt.Printf("File %s added to vector store %s. Status: %s\n", fileID, vectorStoreID, resp.Status)
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php');

$apiKey = getenv('API_KEY');
$client = \OpenAI\Client::create($apiKey, "https://api.avalai.ir/v1");

$vectorStoreId = 'vs_...'; // Replace with your vector store ID
$fileId = 'file_...';    // Replace with your file ID

try {
    // Assuming the client handles beta features and nested resources
    $vectorStoreFile = $client->vectorStores()->files($vectorStoreId)->create([ // Assuming method structure
        'file_id' => $fileId,
    ], [
        // Optional: If headers are needed for beta features
        // 'OpenAI-Beta' => 'assistants=v2'
    ]);
    echo "File {$fileId} added to vector store {$vectorStoreId}. Status: " . $vectorStoreFile->status . "\n";
} catch (\Exception $e) {
    echo "Error adding file to vector store: " . $e->getMessage() . "\n";
}
?>

```

#### Check file status

Run this code periodically until the file is ready to be used (i.e., when the file status associated with the vector store is `completed`). Indexing may take some time depending on the file size.

```language-selector
python=:from openai import OpenAI
import os
import time

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"]
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)

# Replace with your actual Vector Store ID and File ID
vector_store_id = "vs_..."  # Replace with your vector store ID
file_id = "file_..."  # Replace with your file ID

try:
    while True:
        vector_store_file = client.beta.vector_stores.files.retrieve(
            vector_store_id=vector_store_id, file_id=file_id
        )
        print(f"File status: {vector_store_file.status}")
        if vector_store_file.status == "completed":
            print("File processing completed.")
            break
        elif vector_store_file.status in ["failed", "cancelled"]:
            print(
                f"File processing {vector_store_file.status}. Last Error: {vector_store_file.last_error}"
            )
            break
        time.sleep(5)  # Wait 5 seconds before checking again

except Exception as e:
    print(f"An error occurred checking file status: {e}")

javascript=:import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

// Replace with your actual Vector Store ID and File ID
const vectorStoreId = "vs_..."; // Replace with your vector store ID
const fileId = "file_..."; // Replace with your file ID

async function checkFileStatus(vectorStoreId, fileId) {
  try {
    while (true) {
      const vectorStoreFile = await openai.beta.vectorStores.files.retrieve(
        vectorStoreId,
        fileId,
      );
      console.log(`File status: ${vectorStoreFile.status}`);
      if (vectorStoreFile.status === "completed") {
        console.log("File processing completed.");
        break;
      } else if (["failed", "cancelled"].includes(vectorStoreFile.status)) {
        console.error(
          `File processing ${vectorStoreFile.status}. Last Error:`,
          vectorStoreFile.last_error,
        );
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  } catch (error) {
    console.error("An error occurred checking file status:", error);
  }
}

checkFileStatus(vectorStoreId, fileId);

bash=:# Replace {vector_store_id} and {file_id} with your actual IDs
VECTOR_STORE_ID="vs_..."
FILE_ID="file_..."

# You would typically implement polling logic in a script
# This command just retrieves the current status once:
curl "https://api.avalai.ir/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" # Assuming beta header might be needed

# Example polling in bash (basic):
# while true; do
# STATUS=$(curl -s "https://api.avalai.ir/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID" \
# -H "Authorization: Bearer $AVALAI_API_KEY" \
# -H "OpenAI-Beta: assistants=v2" | jq -r .status) # Requires jq
#   echo "Current status: $STATUS"
#   if [[ "$STATUS" == "completed" ]]; then
#     echo "File ready!"
#     break
#   elif [[ "$STATUS" == "failed" || "$STATUS" == "cancelled" ]]; then
#      echo "File processing failed or cancelled."
#      # Optionally retrieve the full object to see the error
#      break
#   fi
#   sleep 5
# done

go=:package main

import (
	"context"
	"fmt"
	"os"
	"time"

	openai "github.com/openai/openai-go" // Use the standard OpenAI Go client with custom base URL
)

func main() {
	apiKey := os.Getenv("API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	config.AddRequestHeader("OpenAI-Beta", "assistants=v2") // Assuming beta header
	client := openai.NewClientWithConfig(config)

	vectorStoreID := "vs_..." // Replace with your vector store ID
	fileID := "file_..."      // Replace with your file ID

	for {
		resp, err := client.RetrieveVectorStoreFile(context.Background(), vectorStoreID, fileID) // Assuming method name
		if err != nil {
			fmt.Printf("Error retrieving file status: %v\n", err)
			break // Exit loop on error
		}

		fmt.Printf("File status: %s\n", resp.Status)

		if resp.Status == "completed" {
			fmt.Println("File processing completed.")
			break
		} else if resp.Status == "failed" || resp.Status == "cancelled" {
			fmt.Printf("File processing %s.\n", resp.Status)
			// Assuming LastError field exists in the response struct
			// if resp.LastError != nil {
			//  fmt.Printf("Last Error: %v\n", resp.LastError)
			// }
			break
		}

		time.Sleep(5 * time.Second) // Wait 5 seconds
	}
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php');

$apiKey = getenv('API_KEY');
$client = \OpenAI\Client::create($apiKey, "https://api.avalai.ir/v1");

$vectorStoreId = 'vs_...'; // Replace with your vector store ID
$fileId = 'file_...';    // Replace with your file ID

try {
    while (true) {
        // Assuming the client handles beta features and nested resource retrieval
        $vectorStoreFile = $client->vectorStores()->files($vectorStoreId)->retrieve($fileId, [ // Assuming method structure
            // Optional: If headers are needed for beta features
            // 'OpenAI-Beta' => 'assistants=v2'
        ]);

        echo "File status: " . $vectorStoreFile->status . "\n";

        if ($vectorStoreFile->status == 'completed') {
            echo "File processing completed.\n";
            break;
        } elseif (in_array($vectorStoreFile->status, ['failed', 'cancelled'])) {
             echo "File processing " . $vectorStoreFile->status . ".\n";
             // Assuming last_error property exists
             // if (isset($vectorStoreFile->last_error)) {
             //    print_r($vectorStoreFile->last_error);
             // }
             break;
        }

        sleep(5); // Wait 5 seconds
    }
} catch (\Exception $e) {
    echo "Error checking file status: " . $e->getMessage() . "\n";
}
?>

```

### 2. Use File Search in the Responses API

Once your knowledge base is set up and the file status is `completed`, you can include the `file_search` tool in the list of tools available to the model when using the [Responses API](/api-reference/responses.md), along with the ID of the vector store to search within.

Currently, you can only search in one vector store per API call.

```language-selector
python=:from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"]
    base_url="https://api.avalai.ir/v1",  # Custom API endpoint
)

# Replace with your actual Vector Store ID
vector_store_id = "vs_..."  # Replace with your vector store ID

try:
    response = client.responses.create(
        model="gpt-5.4-mini",  # Or any other suitable model
        input="What is deep research by OpenAI based on the provided document?",  # Example prompt
        tools=[
            {
                "type": "file_search",
                # Specify the vector store ID to search within
                "vector_store_ids": [vector_store_id],
            }
        ],
        # Optional: Add tool_choice={'type': 'file_search'} to force the tool
    )
    # The response object will contain the model's answer and citations
    # Access the text via response.output_text or iterate through response.output
    print(response)  # Print the full response object for inspection
    # print(response.output_text) # If output_text is directly available

except Exception as e:
    print(f"An error occurred calling the Responses API: {e}")

javascript=:import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

// Replace with your actual Vector Store ID
const vectorStoreId = "vs_..."; // Replace with your vector store ID

async function runFileSearch(vectorStoreId) {
  try {
    const response = await openai.responses.create({
      model: "gpt-5.4-mini", // Or any other suitable model
      input: "What is deep research by OpenAI based on the provided document?", // Example prompt
      tools: [
        {
          type: "file_search",
          // Specify the vector store ID to search within
          vector_store_ids: [vectorStoreId],
        },
      ],
      // Optional: Add tool_choice: {type: 'file_search'} to force the tool
    });
    // The response object will contain the model's answer and citations
    // Access the text via response.output_text or iterate through response.output
    console.log(JSON.stringify(response, null, 2)); // Print the full response object
    // console.log(response.output_text); // If output_text is directly available
  } catch (error) {
    console.error("An error occurred calling the Responses API:", error);
  }
}

runFileSearch(vectorStoreId);

bash=:# Replace {vector_store_id} with your actual ID
VECTOR_STORE_ID="vs_..."

curl "https://api.avalai.ir/v1/responses" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "input": "What is deep research by OpenAI based on the provided document?",
    "tools": [{
      "type": "file_search",
      "vector_store_ids": ["'"$VECTOR_STORE_ID"'"]
    }]
  }'

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go" // Use the standard OpenAI Go client with custom base URL
)

func main() {
	apiKey := os.Getenv("API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	vectorStoreID := "vs_..." // Replace with your vector store ID

	req := openai.ResponseRequest{ // Assuming struct name
		Model: "gpt-5.4-mini",
		Input: "What is deep research by OpenAI based on the provided document?",
		Tools: []openai.ToolDefinition{ // Assuming struct name
			{
				Type:           "file_search",
				VectorStoreIDs: []string{vectorStoreID}, // Assuming field name
			},
		},
		// Optional: ToolChoice: &openai.ToolChoice{Type: "file_search"},
	}

	resp, err := client.CreateResponse(context.Background(), req) // Assuming method name
	if err != nil {
		fmt.Printf("Response creation error: %v\n", err)
		return
	}

	// Process the response - structure might vary
	fmt.Printf("Response received:\n%+v\n", resp)
	// Example: Accessing text if available directly
	// fmt.Println("Output Text:", resp.OutputText)
	// Or iterate through output items
	// for _, item := range resp.Output { ... }
}

php=:<?php
require_once(__DIR__ . '/vendor/autoload.php');

$apiKey = getenv('API_KEY');
$client = \OpenAI\Client::create($apiKey, "https://api.avalai.ir/v1");

$vectorStoreId = 'vs_...'; // Replace with your vector store ID

try {
    $response = $client->responses()->create([
        'model' => 'gpt-5.4-mini',
        'input' => 'What is deep research by OpenAI based on the provided document?',
        'tools' => [[
            'type' => 'file_search',
            'vector_store_ids' => [$vectorStoreId],
        ]],
        // Optional: 'tool_choice' => ['type' => 'file_search'],
    ]);

    // Process the response - structure might vary
    print_r($response->toArray()); // Print the full response array
    // Example: Accessing text if available directly
    // echo "Output Text: " . $response->outputText . "\n";
    // Or iterate through output items
    // foreach ($response->output as $item) { ... }

} catch (\Exception $e) {
    echo "Response creation error: " . $e->getMessage() . "\n";
}
?>

```

When this tool is called by the model, you will receive a response with multiple output items in the `output` array:

1.  A `file_search_call` output item, containing details about the search performed.
2.  A `message` output item, containing the model's response text and citations pointing back to the source files.

#### Example File Search Response

```json
{
  "output": [
    {
      "type": "file_search_call",
      "id": "fs_...", // Unique ID for the file search operation

      "status": "completed",
      "queries": ["query inferred by the model"], // Queries used for searching

      "search_results": null // Populated if include=["file_search_call.results"] is used

    },
    {
      "id": "msg_...", // Unique ID for the message

      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Deep research is a capability allowing extensive inquiry... [file_id:file-...]", // Text generated by the model

          "annotations": [ // Citations mapping text segments to files

            {
              "type": "file_citation",
              "start_index": 60, // Start index in the text

              "end_index": 80,   // End index in the text

              "file_id": "file-...", // ID of the cited file

              "quote": "specific quote from the file" // The actual text segment cited

            }
            // ... more annotations

          ]
        }
      ]
    }
  ]
}
```

## Retrieval Customization

### Limiting the number of results

You can customize the maximum number of search results (chunks) retrieved from the vector store to generate the response. This can help reduce token usage and latency but may impact answer quality. Use the `max_num_results` parameter within the `file_search` tool definition.

```language-selector
python=:# ... (client setup) ...
vector_store_id = "vs_..."
response = client.responses.create(
    model="gpt-5.4-mini",
    input="Summarize the document briefly.",
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": [vector_store_id],
            "max_num_results": 3,  # Limit to 3 results
        }
    ],
)
print(response)

javascript=:// ... (client setup) ...
const vectorStoreId = "vs_...";
const response = await openai.responses.create({
  model: "gpt-5.4-mini",
  input: "Summarize the document briefly.",
  tools: [
    {
      type: "file_search",
      vector_store_ids: [vectorStoreId],
      max_num_results: 3, // Limit to 3 results
    },
  ],
});
console.log(JSON.stringify(response, null, 2));

bash=:# ... (VECTOR_STORE_ID setup) ...
curl "https://api.avalai.ir/v1/responses" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "input": "Summarize the document briefly.",
    "tools": [{
      "type": "file_search",
      "vector_store_ids": ["'"$VECTOR_STORE_ID"'"],
      "max_num_results": 3
    }]
  }'

go=:// ... (client setup, vectorStoreID setup) ...
req := openai.ResponseRequest{
	Model: "gpt-5.4-mini",
	Input: "Summarize the document briefly.",
	Tools: []openai.ToolDefinition{
		{
			Type:           "file_search",
			VectorStoreIDs: []string{vectorStoreID},
			MaxNumResults:  3, // Assuming field name
		},
	},
}
// ... (client.CreateResponse call and output) ...

php=:// ... (client setup, $vectorStoreId setup) ...
$response = $avalai->responses()->create([
    'model' => 'gpt-5.4-mini',
    'input' => 'Summarize the document briefly.',
    'tools' => [[
        'type' => 'file_search',
        'vector_store_ids' => [$vectorStoreId],
        'max_num_results' => 3, // Assuming parameter name
    ]],
]);
print_r($response->toArray());

```

### Include search results in the response

By default, the `file_search_call` output item doesn't include the raw search results (the chunks retrieved from the vector store). To include them, use the `include` parameter at the top level of the Responses API request.

```language-selector
python=:# ... (client setup) ...
vector_store_id = "vs_..."
response = client.responses.create(
    model="gpt-5.4-mini",
    input="What sections does the document cover?",
    tools=[{"type": "file_search", "vector_store_ids": [vector_store_id]}],
    include=["file_search_call.results"],  # Include results
)
print(response)

javascript=:// ... (client setup) ...
const vectorStoreId = "vs_...";
const response = await openai.responses.create({
  model: "gpt-5.4-mini",
  input: "What sections does the document cover?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: [vectorStoreId],
    },
  ],
  include: ["file_search_call.results"], // Include results
});
console.log(JSON.stringify(response, null, 2));

bash=:# ... (VECTOR_STORE_ID setup) ...
curl "https://api.avalai.ir/v1/responses" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "input": "What sections does the document cover?",
    "tools": [{
      "type": "file_search",
      "vector_store_ids": ["'"$VECTOR_STORE_ID"'"]
    }],
    "include": ["file_search_call.results"]
  }'

go=:// ... (client setup, vectorStoreID setup) ...
req := openai.ResponseRequest{
	Model: "gpt-5.4-mini",
	Input: "What sections does the document cover?",
	Tools: []openai.ToolDefinition{
		{
			Type:           "file_search",
			VectorStoreIDs: []string{vectorStoreID},
		},
	},
	Include: []string{"file_search_call.results"}, // Assuming field name
}
// ... (client.CreateResponse call and output) ...

php=:// ... (client setup, $vectorStoreId setup) ...
$response = $client->responses()->create([
    'model' => 'gpt-5.4-mini',
    'input' => 'What sections does the document cover?',
    'tools' => [[
        'type' => 'file_search',
        'vector_store_ids' => [$vectorStoreId],
    ]],
    'include' => ['file_search_call.results'], // Assuming parameter name
]);
print_r($response->toArray());

```

### Metadata filtering

*This feature might depend on the specific implementation of vector stores and file metadata.*

Assuming the API supports attaching metadata to files within vector stores and filtering based on it (similar to OpenAI's retrieval guide), you could potentially filter which files are searched. Refer to the specific documentation on vector stores or retrieval for details on setting attributes and defining filters.

Example (conceptual, adapt based on actual AvalAI capabilities):

```language-selector
python=:# Conceptual Example - Requires API support for metadata filtering
# ... (client setup) ...
vector_store_id = "vs_..."
response = client.responses.create(
    model="gpt-5.4-mini",
    input="What is mentioned about Q1 results?",
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": [vector_store_id],
            # Example filter (syntax may vary based on API implementation)
            "filters": {
                "type": "and",  # or "or"
                "conditions": [
                    {"type": "eq", "key": "report_type", "value": "quarterly"},
                    {"type": "eq", "key": "year", "value": "2025"},
                ],
            },
        }
    ],
)
print(response)

javascript=:// Conceptual Example - Requires API support for metadata filtering
// ... (client setup) ...
const vectorStoreId = "vs_...";
const response = await openai.responses.create({
  model: "gpt-5.4-mini",
  input: "What is mentioned about Q1 results?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: [vectorStoreId],
      // Example filter (syntax may vary based on API implementation)
      filters: {
        type: "and", // or "or"
        conditions: [
          { type: "eq", key: "report_type", value: "quarterly" },
          { type: "eq", key: "year", value: 2025 }, // Assuming year is number
        ],
      },
    },
  ],
});
console.log(JSON.stringify(response, null, 2));

bash=:# Conceptual Example - Requires API support for metadata filtering
# ... (VECTOR_STORE_ID setup) ...
# The structure of the 'filters' object will depend on the API
curl "https://api.avalai.ir/v1/responses" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "input": "What is mentioned about Q1 results?",
    "tools": [{
      "type": "file_search",
      "vector_store_ids": ["'"$VECTOR_STORE_ID"'"],
      "filters": {
         "type": "and",
         "conditions": [
            {"type": "eq", "key": "report_type", "value": "quarterly"},
            {"type": "eq", "key": "year", "value": "2025"}
         ]
       }
    }]
  }'

go=:// Conceptual Example - Requires API support for metadata filtering
// ... (client setup, vectorStoreID setup) ...
// The structure of the 'Filters' field will depend on the Go client definition
req := openai.ResponseRequest{
	Model: "gpt-5.4-mini",
	Input: "What is mentioned about Q1 results?",
	Tools: []openai.ToolDefinition{
		{
			Type:           "file_search",
			VectorStoreIDs: []string{vectorStoreID},
			// Filters: &openai.FilterDefinition{ ... } // Define based on the API's structure
		},
	},
}
// ... (client.CreateResponse call and output) ...

php=:// Conceptual Example - Requires API support for metadata filtering
// ... (client setup, $vectorStoreId setup) ...
// The structure of the 'filters' array will depend on the PHP client/API
$response = $client->responses()->create([
    'model' => 'gpt-5.4-mini',
    'input' => 'What is mentioned about Q1 results?',
    'tools' => [[
        'type' => 'file_search',
        'vector_store_ids' => [$vectorStoreId],
        'filters' => [ // Define based on the API's structure
            'type' => 'and',
            'conditions' => [
                 ['type' => 'eq', 'key' => 'report_type', 'value' => 'quarterly'],
                 ['type' => 'eq', 'key' => 'year', 'value' => '2025'],
            ]
        ]
    ]],
]);
print_r($response->toArray());

```

## Supported Files

The following file formats and MIME types are generally supported for upload and indexing in vector stores. For `text/*` MIME types, the encoding must be one of `utf-8`, `utf-16`, or `ascii`.

| File format | MIME type                                                             |
| :---------- | :-------------------------------------------------------------------- |
| `.c`        | `text/x-c`                                                            |
| `.cpp`      | `text/x-c++`                                                          |
| `.cs`       | `text/x-csharp`                                                       |
| `.css`      | `text/css`                                                            |
| `.doc`      | `application/msword`                                                  |
| `.docx`     | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `.go`       | `text/x-golang`                                                       |
| `.html`     | `text/html`                                                           |
| `.java`     | `text/x-java`                                                         |
| `.js`       | `text/javascript`                                                     |
| `.json`     | `application/json`                                                    |
| `.md`       | `text/markdown`                                                       |
| `.pdf`      | `application/pdf`                                                     |
| `.php`      | `text/x-php`                                                          |
| `.pptx`     | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.py`       | `text/x-python`, `text/x-script.python`                               |
| `.rb`       | `text/x-ruby`                                                         |
| `.sh`       | `application/x-sh`                                                    |
| `.tex`      | `text/x-tex`                                                          |
| `.ts`       | `application/typescript`                                              |
| `.txt`      | `text/plain`                                                          |

## Limitations

Be aware of the following limitations when using the File Search tool (check the specific documentation for exact limits):

*   **Total Storage:** There might be a limit on the total size of all files uploaded across your project (e.g., 100GB).
*   **Files per Vector Store:** A vector store might have a maximum number of files it can contain (e.g., 10,000).
*   **Individual File Size:** Individual files might have a maximum size limit (e.g., 512MB) and a corresponding token limit after processing.
*   **Vector Stores per Request:** Currently, only one `vector_store_id` can be specified per `file_search` tool definition in a Responses API call.

## Related Resources

*   [Responses API Reference](/api-reference/responses.md)
*   [Tools Overview](/guides/tools.md)
*   [Files API Reference](/api-reference/files.md) (Assuming this exists)
*   [Vector Stores Guide](/guides/retrieval.md) (Assuming this exists)
*   [Pricing](/pricing.md)