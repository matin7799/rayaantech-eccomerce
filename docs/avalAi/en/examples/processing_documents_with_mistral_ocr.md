# Processing Documents with Mistral OCR

This guide demonstrates how to use the powerful `mistral-ocr-latest` model for Optical Character Recognition (OCR) and document understanding. You'll learn how to extract text and structured content from PDF documents and images while preserving formatting, structure, and hierarchy.

## Introduction

Mistral OCR is a state-of-the-art OCR model that enables you to process documents at scale with high accuracy. This example covers both basic OCR functionality and advanced document understanding capabilities.

### Key Features

- Extracts text content while maintaining document structure and hierarchy
- Preserves formatting like headers, paragraphs, lists and tables
- Returns results in markdown format for easy parsing and rendering
- **Structured JSON output** with JSON Schema mode for consistent data extraction
- Handles complex layouts including multi-column text and mixed content
- Processes documents at scale with high accuracy (up to 2000 pages per minute)
- Configurable table output format (markdown or HTML)
- Natively multilingual, capable of parsing thousands of scripts, fonts, and languages
- Outperforms other leading OCR models in benchmark tests

### Use Cases

- **Scientific Research**: Convert scientific papers with complex formulas and diagrams into AI-ready formats
- **Business Operations**: Process receipts, invoices, and forms for data extraction
- **Historical Preservation**: Digitize historical documents and artifacts for broader accessibility
- **Customer Service**: Transform documentation and manuals into indexed knowledge bases
- **Education**: Convert lecture notes and presentations into searchable content
- **Legal**: Process regulatory filings and legal documents
- **Engineering**: Extract information from technical literature and drawings

## Basic OCR with PDF Documents

### Using PDF URL

You can process a PDF document by providing its URL:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770"
  },
  "include_image_base64": true
}' -o ocr_output.json

python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=list(range(0, 100)),  # Process up to 100 pages
)

print(ocr_response)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: Array.from({ length: 100 }, (_, i) => i), // Process up to 100 pages
});

console.log(ocrResponse);

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-ocr-latest",
		"document": map[string]interface{}{
			"type":         "document_url",
			"document_url": "https://arxiv.org/pdf/1805.04770",
		},
		"pages": make([]int, 100), // Process pages 0-99
	}

	// Fill pages array
	for i := 0; i < 100; i++ {
		payload["pages"].([]int)[i] = i
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/ocr", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Print response
	fmt.Println(string(body))
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/ocr';

// Create request payload
$payload = [
    'model' => 'mistral-ocr-latest',
    'document' => [
        'type' => 'document_url',
        'document_url' => 'https://arxiv.org/pdf/1805.04770'
    ],
    'pages' => range(0, 99), // Process up to 100 pages
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    // Decode and display the response
    $result = json_decode($response, true);
    print_r($result);
}

// Close cURL session
curl_close($ch);

```

### Using Base64-encoded PDF

Since the `v1/files` endpoint is not yet fully available, you can use base64 encoding to process PDF files directly:

```language-selector
bash=:# Convert PDF to base64
PDF_BASE64=$(base64 -i document.pdf) # Use -w 0 on Linux for no line breaks

# Process the encoded PDF
curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "document_url",
    "document_url": "data:application/pdf;base64,'"$PDF_BASE64"'"
  },
  "include_image_base64": true
}' -o ocr_output.json

python=:import base64
from mistralai import Mistral

# Read and encode the PDF file
with open("document.pdf", "rb") as f:
    pdf_data = f.read()

base64_pdf = base64.b64encode(pdf_data).decode("utf-8")
document_url = f"data:application/pdf;base64,{base64_pdf}"

# Process the encoded PDF
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {"type": "document_url", "document_url": document_url}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=list(range(0, 100)),  # Process up to 100 pages
)

print(ocr_response)

javascript=:import fs from "fs";
import { Mistral } from "mistralai";

// Read and encode the PDF file
const pdfData = fs.readFileSync("document.pdf");
const base64Pdf = pdfData.toString("base64");
const documentUrl = `data:application/pdf;base64,${base64Pdf}`;

// Process the encoded PDF
const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: documentUrl,
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: Array.from({ length: 100 }, (_, i) => i),
});

console.log(ocrResponse);

go=:package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Read and encode the PDF file
	pdfBytes, err := ioutil.ReadFile("document.pdf")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64String := base64.StdEncoding.EncodeToString(pdfBytes)
	documentUrl := "data:application/pdf;base64," + base64String

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-ocr-latest",
		"document": map[string]interface{}{
			"type":         "document_url",
			"document_url": documentUrl,
		},
		"pages": make([]int, 100), // Process pages 0-99
	}

	// Fill pages array
	for i := 0; i < 100; i++ {
		payload["pages"].([]int)[i] = i
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/ocr", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Print response
	fmt.Println(string(body))
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/ocr';

// Read and encode the PDF file
$pdfData = file_get_contents('document.pdf');
$base64Pdf = base64_encode($pdfData);
$documentUrl = 'data:application/pdf;base64,' . $base64Pdf;

// Create request payload
$payload = [
 'model' => 'mistral-ocr-latest',
 'document' => [
 'type' => 'document_url',
 'document_url' => $documentUrl
 ],
 'pages' => range(0, 99), // Process up to 100 pages
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Content-Type: application/json',
 'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
 echo 'Error: ' . curl_error($ch);
} else {
 // Decode and display the response
 $result = json_decode($response, true);
 print_r($result);
}

// Close cURL session
curl_close($ch);

```

### Processing Specific Pages

You can specify which pages to process using the `pages` parameter:

```language-selector
python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

# Process only pages 0, 1, and 5
ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=[0, 1, 5],  # Only process specific pages
)

print(ocr_response)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

// Process only pages 0, 1, and 5
const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: [0, 1, 5], // Only process specific pages
});

console.log(ocrResponse);

bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "mistral-ocr-latest",
 "document": {
 "type": "document_url",
 "document_url": "https://arxiv.org/pdf/1805.04770"
 },
 "pages": [0, 1, 5],
 "include_image_base64": true
}' -o ocr_output.json

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-ocr-latest",
		"document": map[string]interface{}{
			"type":         "document_url",
			"document_url": "https://arxiv.org/pdf/1805.04770",
		},
		"pages": []int{0, 1, 5}, // Process only specific pages
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/ocr", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Print response
	fmt.Println(string(body))
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/ocr';

// Create request payload
$payload = [
 'model' => 'mistral-ocr-latest',
 'document' => [
 'type' => 'document_url',
 'document_url' => 'https://arxiv.org/pdf/1805.04770'
 ],
 'pages' => [0, 1, 5], // Process only specific pages
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Content-Type: application/json',
 'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
 echo 'Error: ' . curl_error($ch);
} else {
 // Decode and display the response
 $result = json_decode($response, true);
 print_r($result);
}

// Close cURL session
curl_close($ch);

```

### Example Output

The OCR API returns both the extracted text content in markdown format and metadata about the document structure:

```json
{
  "pages": [
    {
      "index": 1,
      "markdown": "# LEVERAGING UNLABELED DATA TO PREDICT OUT-OF-DISTRIBUTION PERFORMANCE \n\nSaurabh Garg*<br>Carnegie Mellon University<br>sgarg2@andrew.cmu.edu<br>Sivaraman Balakrishnan<br>Carnegie Mellon University<br>sbalakri@andrew.cmu.edu<br>Zachary C. Lipton<br>Carnegie Mellon University<br>zlipton@andrew.cmu.edu\n\n## Behnam Neyshabur\n\nGoogle Research, Blueshift team\nneyshabur@google.com\n\nHanie Sedghi<br>Google Research, Brain team<br>hsedghi@google.com\n\n\n#### Abstract\n\nReal-world machine learning deployments are characterized by mismatches between the source (training) and target (test) distributions that may cause performance drops...",
      "images": [],
      "dimensions": {
        "dpi": 200,
        "height": 2200,
        "width": 1700
      }
    }
    // Additional pages...

  ],
  "model": "mistral-ocr-latest",
  "usage_info": {
    "pages_processed": 3,
    "doc_size_bytes": null
  }
}
```

## OCR with Images

### Using Image URL

You can process images by providing a direct URL:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "mistral-ocr-latest",
 "document": {
 "type": "image_url",
 "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
 }
}' -o ocr_output.json

python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process image from URL
document_param = {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
)

print(ocr_response)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Process image from URL
const documentParam = {
  type: "image_url",
  image_url:
    "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
});

console.log(ocrResponse);

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-ocr-latest",
		"document": map[string]interface{}{
			"type":      "image_url",
			"image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
		},
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/ocr", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Print response
	fmt.Println(string(body))
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/ocr';

// Create request payload
$payload = [
 'model' => 'mistral-ocr-latest',
 'document' => [
 'type' => 'image_url',
 'image_url' => 'https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png'
 ],
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Content-Type: application/json',
 'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
 echo 'Error: ' . curl_error($ch);
} else {
 // Decode and display the response
 $result = json_decode($response, true);
 print_r($result);
}

// Close cURL session
curl_close($ch);

```

### Using Base64-encoded Images

You can also process images using base64 encoding:

```language-selector
bash=:# Convert image to base64
IMAGE_BASE64=$(base64 -i receipt.jpg) # Use -w 0 on Linux for no line breaks

# Process the encoded image
curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "mistral-ocr-latest",
 "document": {
 "type": "image_url",
 "image_url": "data:image/jpeg;base64,'"$IMAGE_BASE64"'"
 }
}' -o ocr_output.json

python=:import base64
from mistralai import Mistral

# Read and encode the image file
with open("receipt.jpg", "rb") as f:
    image_data = f.read()

base64_image = base64.b64encode(image_data).decode("utf-8")
image_url = f"data:image/jpeg;base64,{base64_image}"

# Process the encoded image
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {"type": "image_url", "image_url": image_url}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
)

print(ocr_response)

javascript=:import fs from "fs";
import { Mistral } from "mistralai";

// Read and encode the image file
const imageData = fs.readFileSync("receipt.jpg");
const base64Image = imageData.toString("base64");
const imageUrl = `data:image/jpeg;base64,${base64Image}`;

// Process the encoded image
const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "image_url",
  image_url: imageUrl,
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
});

console.log(ocrResponse);

go=:package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Read and encode the image file
	imageBytes, err := ioutil.ReadFile("receipt.jpg")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	base64String := base64.StdEncoding.EncodeToString(imageBytes)
	imageUrl := "data:image/jpeg;base64," + base64String

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-ocr-latest",
		"document": map[string]interface{}{
			"type":      "image_url",
			"image_url": imageUrl,
		},
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/ocr", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Print response
	fmt.Println(string(body))
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/ocr';

// Read and encode the image file
$imageData = file_get_contents('receipt.jpg');
$base64Image = base64_encode($imageData);
$imageUrl = 'data:image/jpeg;base64,' . $base64Image;

// Create request payload
$payload = [
 'model' => 'mistral-ocr-latest',
 'document' => [
 'type' => 'image_url',
 'image_url' => $imageUrl
 ],
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Content-Type: application/json',
 'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
 echo 'Error: ' . curl_error($ch);
} else {
 // Decode and display the response
 $result = json_decode($response, true);
 print_r($result);
}

// Close cURL session
curl_close($ch);

```

### Example: Processing a Receipt

Here's a specific example of processing a receipt image and extracting structured information:

```python
from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process receipt image from URL
document_param = {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
)

# The OCR response contains the extracted text in markdown format
receipt_text = ocr_response.pages[0].markdown
print(receipt_text)

# Example output:
# RECEIPT
# THANK YOU FOR SHOPPING AT
# WHOLE FOODS MARKET
# STORE 10113 (415) 618-0066
# 450 RHODE ISLAND ST
# SAN FRANCISCO, CA 94107
# ...
```

## Document Understanding

You can combine Mistral OCR with language models to enable natural language interaction with document content. This allows you to extract information and insights from documents by asking questions in natural language.

### Question Answering with Scientific Papers

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "mistral-small-latest",
 "messages": [
 {
 "role": "user",
 "content": [
 {
 "type": "text",
 "text": "What is the main research question addressed in this paper?"
 },
 {
 "type": "document_url",
 "document_url": "https://arxiv.org/pdf/1805.04770"
 }
 ]
 }
 ]
}'

python=:from mistralai import Mistral
from mistralai.models import UserMessage

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Create a message with both text and document
message_content = [
    {
        "type": "text",
        "text": "What is the main research question addressed in this paper?",
    },
    {"type": "document_url", "document_url": "https://arxiv.org/pdf/1805.04770"},
]

messages = [UserMessage(role="user", content=message_content)]

# Send the request
response = client.chat.complete(model="mistral-small-latest", messages=messages)

print(response.choices[0].message.content)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Create a message with both text and document
const messages = [
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "What is the main research question addressed in this paper?",
      },
      {
        type: "document_url",
        document_url: "https://arxiv.org/pdf/1805.04770",
      },
    ],
  },
];

// Send the request
const response = await client.chat.complete({
  model: "mistral-small-latest",
  messages: messages,
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Create message content with both text and document
	textContent := map[string]interface{}{
		"type": "text",
		"text": "What is the main research question addressed in this paper?",
	}
	documentContent := map[string]interface{}{
		"type":         "document_url",
		"document_url": "https://arxiv.org/pdf/1805.04770",
	}

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-small-latest",
		"messages": []map[string]interface{}{
			{
				"role":    "user",
				"content": []map[string]interface{}{textContent, documentContent},
			},
		}
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Parse response to extract message content
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		fmt.Printf("Error parsing response: %v\n", err)
		return
	}

	// Extract and print the message content
	choices := result["choices"].([]interface{})
	firstChoice := choices[0].(map[string]interface{})
	message := firstChoice["message"].(map[string]interface{})
	content := message["content"].(string)

	fmt.Println(content)
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

// Create message content with both text and document
$messageContent = [
 ['type' => 'text', 'text' => 'What is the main research question addressed in this paper?'],
 ['type' => 'document_url', 'document_url' => 'https://arxiv.org/pdf/1805.04770']
];

// Create request payload
$payload = [
 'model' => 'mistral-small-latest',
 'messages' => [
 [
 'role' => 'user',
 'content' => $messageContent
 ]
 ]
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Content-Type: application/json',
 'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
 echo 'Error: ' . curl_error($ch);
} else {
 // Decode and display the response
 $result = json_decode($response, true);
 echo $result['choices'][0]['message']['content'];
}

// Close cURL session
curl_close($ch);

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `mistral-small-latest` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### Information Extraction from Receipts

You can also use document understanding to extract specific information from receipts:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "mistral-small-latest",
 "messages": [
 {
 "role": "user",
 "content": [
 {
 "type": "text",
 "text": "Extract the following information from this receipt: store name, date, total amount, and list of purchased items with prices."
 },
 {
 "type": "image_url",
 "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
 }
 ]
 }
 ]
}'

python=:from mistralai import Mistral
from mistralai.models import UserMessage

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Create a message with both text and image
message_content = [
    {
        "type": "text",
        "text": "Extract the following information from this receipt: store name, date, total amount, and list of purchased items with prices.",
    },
    {
        "type": "image_url",
        "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
    },
]

messages = [UserMessage(role="user", content=message_content)]

# Send the request
response = client.chat.complete(model="mistral-small-latest", messages=messages)

print(response.choices[0].message.content)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Create a message with both text and image
const messages = [
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "Extract the following information from this receipt: store name, date, total amount, and list of purchased items with prices.",
      },
      {
        type: "image_url",
        image_url:
          "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
      },
    ],
  },
];

// Send the request
const response = await client.chat.complete({
  model: "mistral-small-latest",
  messages: messages,
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Create message content with both text and image
	textContent := map[string]interface{}{
		"type": "text",
		"text": "Extract the following information from this receipt: store name, date, total amount, and list of purchased items with prices.",
	}
	imageContent := map[string]interface{}{
		"type":      "image_url",
		"image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
	}

	// Create request payload
	payload := map[string]interface{}{
		"model": "mistral-small-latest",
		"messages": []map[string]interface{}{
			{
				"role":    "user",
				"content": []map[string]interface{}{textContent, imageContent},
			},
		}
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error creating JSON payload: %v\n", err)
		return
	}

	// Create request
	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// Parse response to extract message content
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		fmt.Printf("Error parsing response: %v\n", err)
		return
	}

	// Extract and print the message content
	choices := result["choices"].([]interface{})
	firstChoice := choices[0].(map[string]interface{})
	message := firstChoice["message"].(map[string]interface{})
	content := message["content"].(string)

	fmt.Println(content)
}

php=:<?php

// API configuration
$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/chat/completions';

// Create message content with both text and image
$messageContent = [
 ['type' => 'text', 'text' => 'Extract the following information from this receipt: store name, date, total amount, and list of purchased items with prices.'],
 ['type' => 'image_url', 'image_url' => 'https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png']
];

// Create request payload
$payload = [
 'model' => 'mistral-small-latest',
 'messages' => [
 [
 'role' => 'user',
 'content' => $messageContent
 ]
 ]
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
 'Content-Type: application/json',
 'Authorization: Bearer ' . $apiKey
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
 echo 'Error: ' . curl_error($ch);
} else {
 // Decode and display the response
 $result = json_decode($response, true);
 echo $result['choices'][0]['message']['content'];
}

// Close cURL session
curl_close($ch);

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `mistral-small-latest` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
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
        { type: "input_text", text: "Describe this image." },
        { type: "input_image", image_url: "https://example.com/image.png" },
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
            "text": "Describe this image."
          },
          {
            "type": "input_image",
            "image_url": "https://example.com/image.png"
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


## Advanced Features

### Structured JSON Output

The OCR API supports native JSON output modes that allow you to extract structured data directly from documents. This is useful for processing invoices, receipts, forms, and other documents where you need consistent structured data.

#### Using JSON Object Mode

Enable JSON mode by setting `document_annotation_format` to `{"type": "json_object"}`:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
  },
  "document_annotation_format": {
    "type": "json_object"
  }
}'

python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process receipt with JSON output format
document_param = {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    document_annotation_format={"type": "json_object"},
)

# The document_annotation field will contain structured JSON
print(ocr_response.document_annotation)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Process receipt with JSON output format
const documentParam = {
  type: "image_url",
  image_url:
    "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  document_annotation_format: { type: "json_object" },
});

// The document_annotation field will contain structured JSON
console.log(ocrResponse.document_annotation);

```

#### Using JSON Schema Mode

For more control over the output structure, use JSON Schema mode to define exactly what fields you want extracted:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
  },
  "document_annotation_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "receipt",
      "schema": {
        "type": "object",
        "properties": {
          "store_name": {"type": "string"},
          "date": {"type": "string"},
          "total": {"type": "number"},
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {"type": "string"},
                "price": {"type": "number"}
              }
            }
          }
        },
        "required": ["store_name", "total"]
      }
    }
  }
}'

python=:from mistralai import Mistral
import json

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Define the JSON schema for receipt extraction
receipt_schema = {
    "type": "json_schema",
    "json_schema": {
        "name": "receipt",
        "schema": {
            "type": "object",
            "properties": {
                "store_name": {"type": "string"},
                "date": {"type": "string"},
                "total": {"type": "number"},
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "price": {"type": "number"},
                        },
                    },
                },
            },
            "required": ["store_name", "total"],
        },
    },
}

# Process receipt with JSON schema
document_param = {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    document_annotation_format=receipt_schema,
)

# Parse the structured JSON response
receipt_data = json.loads(ocr_response.document_annotation)
print(f"Store: {receipt_data.get('store_name')}")
print(f"Total: ${receipt_data.get('total')}")
for item in receipt_data.get("items", []):
    print(f"  - {item['name']}: ${item['price']}")

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Define the JSON schema for receipt extraction
const receiptSchema = {
  type: "json_schema",
  json_schema: {
    name: "receipt",
    schema: {
      type: "object",
      properties: {
        store_name: { type: "string" },
        date: { type: "string" },
        total: { type: "number" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "number" },
            },
          },
        },
      },
      required: ["store_name", "total"],
    },
  },
};

// Process receipt with JSON schema
const documentParam = {
  type: "image_url",
  image_url:
    "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  document_annotation_format: receiptSchema,
});

// Parse the structured JSON response
const receiptData = JSON.parse(ocrResponse.document_annotation);
console.log(`Store: ${receiptData.store_name}`);
console.log(`Total: $${receiptData.total}`);
for (const item of receiptData.items || []) {
  console.log(`  - ${item.name}: $${item.price}`);
}

```

#### Example JSON Schema Response

When using JSON Schema mode, the `document_annotation` field in the response will contain structured JSON matching your schema:

```json
{
  "store_name": "WHOLE FOODS MARKET",
  "date": "2024-01-15",
  "total": 45.67,
  "items": [
    {
      "name": "Organic Apples",
      "price": 5.99
    },
    {
      "name": "Almond Milk",
      "price": 4.49
    },
    {
      "name": "Whole Grain Bread",
      "price": 3.99
    }
  ]
}
```

### HTML Table Format

You can control how tables are extracted from documents using the `table_format` parameter:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770"
  },
  "table_format": "html",
  "pages": [0]
}'

python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process document with HTML table format
document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    table_format="html",  # Options: "markdown" (default) or "html"
    pages=[0],
)

# Tables in the document will be formatted as HTML
print(ocr_response.pages[0].markdown)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Process document with HTML table format
const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  table_format: "html", // Options: "markdown" (default) or "html"
  pages: [0],
});

// Tables in the document will be formatted as HTML
console.log(ocrResponse.pages[0].markdown);

```

### Extracting Headers and Footers

You can extract document headers and footers separately using the `extract_header` and `extract_footer` parameters:

```language-selector
bash=:curl https://api.avalai.ir/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "mistral-ocr-latest",
  "document": {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770"
  },
  "extract_header": true,
  "extract_footer": true,
  "pages": [0, 1, 2]
}'

python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process document with header/footer extraction
document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    extract_header=True,
    extract_footer=True,
    pages=[0, 1, 2],
)

print(ocr_response)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

// Process document with header/footer extraction
const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  extract_header: true,
  extract_footer: true,
  pages: [0, 1, 2],
});

console.log(ocrResponse);

```

### Batch Processing

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

For processing multiple documents efficiently, you can use batch processing:

```python
from mistralai import Mistral
import os

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Directory containing PDF files
pdf_directory = "documents/"

# Process all PDFs in the directory
for filename in os.listdir(pdf_directory):
    if filename.endswith(".pdf"):
        file_path = os.path.join(pdf_directory, filename)

        # Create document parameter
        document_param = {
            "type": "document_url",
            "document_url": f"file://{file_path}",
        }

        # Process the document
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            document=document_param,
        )

        # Save the results
        output_file = os.path.join("results/", f"{filename}.md")
        with open(output_file, "w") as f:
            for page in ocr_response.pages:
                f.write(f"# Page {page.index}\n\n")
                f.write(page.markdown)
                f.write("\n\n")

        print(f"Processed {filename}")
```

### Structured Output

You can request structured output from OCR results using language models:

```python
from mistralai import Mistral
from mistralai.models import UserMessage
import json

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process receipt image
document_param = {
    "type": "image_url",
    "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
)

# Extract the OCR text
receipt_text = ocr_response.pages[0].markdown

# Request structured JSON output
message_content = [
    {
        "type": "text",
        "text": f"""
Here is a receipt text extracted using OCR:

{receipt_text}

Extract the following information in JSON format:
- store_name: The name of the store
- date: The date of purchase
- items: An array of purchased items, each with "name" and "price"
- subtotal: The subtotal amount
- tax: The tax amount
- total: The total amount

Return ONLY valid JSON with no other text.
""",
    }
]

messages = [UserMessage(role="user", content=message_content)]

# Send the request
response = client.chat.complete(model="mistral-small-latest", messages=messages)

# Parse the JSON response
structured_data = json.loads(response.choices[0].message.content)
print(json.dumps(structured_data, indent=2))
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: Poor OCR Quality

**Solution**: If you're experiencing poor OCR quality, try the following:

- Ensure the document image has sufficient resolution (at least 200 DPI)
- Make sure the document is properly oriented
- If using a scanned document, check that the scan is clear and has good contrast
- For images, try different formats (PNG often works better than JPEG for text)

#### Issue: Error with Base64 Encoding

**Solution**: When using base64 encoding, ensure:

- The correct MIME type is specified (`data:application/pdf;base64,` for PDFs, `data:image/jpeg;base64,` for JPEG images)
- No line breaks in the base64 string (use `-w 0` option with base64 command on Linux)
- The file size doesn't exceed the 50MB limit

#### Issue: Timeout on Large Documents

**Solution**: For large documents:

- Process specific pages instead of the entire document
- Split the document into smaller chunks
- Increase the timeout parameter in your client configuration
- Use batch processing for very large documents

### Error Handling

Always implement proper error handling in your code:

```python
from mistralai import Mistral
from mistralai.exceptions import MistralAPIError

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

try:
    document_param = {
        "type": "document_url",
        "document_url": "https://example.com/document.pdf",
    }

    ocr_response = client.ocr.process(
        model="mistral-ocr-latest",
        document=document_param,
    )

    print(ocr_response)

except MistralAPIError as e:
    if e.status_code == 413:
        print("Error: Document is too large (exceeds 50MB)")
    elif e.status_code == 415:
        print("Error: Unsupported file format")
    elif e.status_code == 429:
        print("Error: Rate limit exceeded, try again later")
    elif e.status_code >= 500:
        print("Error: Server error, try again later")
    else:
        print(f"API Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Best Practices

### Optimizing for Accuracy

1. **Use High-Quality Documents**: Whenever possible, use original digital PDFs rather than scanned documents for best results.

2. **Test Different Formats**: For scanned documents, experiment with different image formats and resolutions to find the optimal balance between file size and OCR quality.

3. **Pre-process Images**: For difficult documents, consider pre-processing images to improve contrast, remove noise, or correct skew before OCR processing.

4. **Validate Results**: Implement validation logic to check OCR results against expected patterns (e.g., checking that extracted dates follow a valid format).

5. **Use Document Understanding Iteratively**: For complex information extraction, consider a multi-step approach where initial OCR results are analyzed to determine what follow-up questions to ask.

### Performance Optimization

1. **Process Only Needed Pages**: When working with multi-page documents, specify only the pages you need to process using the `pages` parameter.

2. **Batch Processing**: For large volumes of documents, implement batch processing with appropriate error handling and retry logic.

3. **Caching**: Implement caching for OCR results to avoid redundant processing of the same documents.

4. **Parallel Processing**: For independent documents, consider implementing parallel processing to improve throughput.

5. **Monitor Usage**: Keep track of your API usage to stay within rate limits and optimize costs.

## Related Resources

- [Mistral AI Models](en/providers/mistralai.md)
- [OCR Announcement](en/news/2025-05-15-mistral-ocr-latest-added.md)
- [PDF Files Guide](en/guides/pdf-files.md)
- [Document Processing with PDFs](en/examples/processing_pdfs_in_chat_completion_api.md)
- [Vision Guide](en/guides/vision.md)
