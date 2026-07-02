# Audio API

The AvalAI Audio API allows you to convert text into spoken audio (Text-to-Speech - TTS) and transcribe or translate spoken audio into text (Speech-to-Text - STT). AvalAI provides access to models like OpenAI's Whisper and TTS models.

Related guides: [Speech to text Guide](en/guides/speech-to-text.md), [Text to speech Guide](en/guides/text-to-speech.md)

## Text-to-Speech (TTS)

Generate spoken audio from input text.

### Endpoint

```
POST https://api.avalai.ir/v1/audio/speech
```

### Request Body

| Parameter | Type | Required | Description |
| ----------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `model` | string | Yes | One of the available TTS models via AvalAI (e.g., `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, `eleven_v3`, `eleven_multilingual_v2`, `eleven_turbo_v2`, `eleven_turbo_v2_5`, `eleven_flash_v2`, `eleven_flash_v2_5`, `gemini-2.5-pro-preview-tts`, `gemini-2.5-flash-preview-tts`, `groq.playai-tts`, `groq.playai-tts-arabic`). Check [Models](en/models/model-details.md) for availability. For ElevenLabs models, see [ElevenLabs Models](en/providers/elevenlabs.md). |
| `input` | string | Yes | The text to generate audio for. The maximum length is 4096 characters for most models, 32K tokens for Gemini TTS models. |
| `voice` | string | Yes | The voice to use. Supported voices include `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`. For Gemini TTS models, 30 different voices are available (e.g., `Kore`, `Puck`, `Zephyr`). For groq PlayAI TTS models (`groq.playai-tts`, `groq.playai-tts-arabic`), 27 voices are supported: `Aaliyah-PlayAI`, `Adelaide-PlayAI`, `Angelo-PlayAI`, `Arista-PlayAI`, `Atlas-PlayAI`, `Basil-PlayAI`, `Briggs-PlayAI`, `Calum-PlayAI`, `Celeste-PlayAI`, `Cheyenne-PlayAI`, `Chip-PlayAI`, `Cillian-PlayAI`, `Deedee-PlayAI`, `Eleanor-PlayAI`, `Fritz-PlayAI`, `Gail-PlayAI`, `Indigo-PlayAI`, `Jennifer-PlayAI`, `Judy-PlayAI`, `Mamaw-PlayAI`, `Mason-PlayAI`, `Mikail-PlayAI`, `Mitch-PlayAI`, `Nia-PlayAI`, `Quinn-PlayAI`, `Ruby-PlayAI`, `Thunder-PlayAI`. |
| `instructions` | string | No | Optional instructions to control the voice style. Does not work with `tts-1` or `tts-1-hd`. Gemini TTS models support extensive style control through natural language instructions. |
| `response_format` | string | No | The format for the audio output. Supported formats: `mp3` (default), `opus`, `aac`, `flac`, `wav`, `pcm`. |
| `speed` | number | No | The speed of the generated audio (0.25 to 4.0). Default is 1.0. |
| `multi_speaker` | object | No | **Gemini TTS models only**. Configuration for multi-speaker audio generation. Contains a `speakers` array with objects defining `name` and `voice` for each speaker. |
| `voice.languageCode` | string | No | **Gemini TTS models only**. Language code for the voice (e.g., `en-US`). Gemini TTS models support 24 languages. |

### Examples

#### Basic TTS

```language-selector
bash=:# cURL Example using AvalAI TTS
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "tts-1",
  "input": "Hello from AvalAI! Converting text to speech.",
  "voice": "nova"
}' \
  --output avalai_speech.mp3

python=:# Python Example using AvalAI TTS
from openai import OpenAI
from pathlib import Path

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

speech_file_path = Path("./avalai_speech.mp3")

try:
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input="Hello from AvalAI! Converting text to speech.",
    )
    # Stream the binary audio content to a file
    response.stream_to_file(speech_file_path)
    print(f"Audio saved to {speech_file_path}")
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example using AvalAI TTS
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

const speechFile = path.resolve("./avalai_speech.mp3");

async function main() {
  try {
    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: "Hello from AvalAI! Converting text to speech.",
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log(`Audio saved to ${speechFile}`);
  } catch (error) {
    console.error("Error generating speech: ", error);
  }
}
main();

go=:// Go Example using AvalAI TTS
package main

import (
	"context"
	"fmt"
	"io" // Added import for io.Copy
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	speechFile := "./avalai_speech.mp3"

	req := openai.CreateSpeechRequest{
		Model: openai.TTSModel1, // Or TTSModel1HD, etc.
		Input: "Hello from AvalAI! Converting text to speech.",
		Voice: openai.VoiceAlloy, // Or Nova, etc.
		// ResponseFormat: openai.SpeechResponseFormatMp3, // Default
		// Speed: 1.0, // Default
	}

	resp, err := client.CreateSpeech(context.Background(), req)
	if err != nil {
		fmt.Printf("TTS error: %v\n", err)
		return
	}
	defer resp.Close()

	outFile, err := os.Create(speechFile)
	if err != nil {
		fmt.Printf("Error creating output file: %v\n", err)
		return
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, resp) // Use io.Copy
	if err != nil {
		fmt.Printf("Error writing audio to file: %v\n", err)
		return
	}

	fmt.Printf("Audio saved to %s\n", speechFile)
}

php=:<?php
// PHP Example using AvalAI TTS

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/audio/speech';
$outputFile = 'avalai_speech.mp3';

$data = [
'model' => 'tts-1',
'input' => 'Hello from AvalAI! Converting text to speech.',
'voice' => 'nova'
// Add other parameters like response_format, speed etc. if needed
// 'response_format' => 'mp3',
// 'speed' => 1.0
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

// Execute the request
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
  // Handle API errors (often returned as JSON)
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response: " . $response; // Print the error response body
} elseif ($httpcode == 200) {
  // Save the audio file
  if (file_put_contents($outputFile, $response)) {
    echo "Audio saved to " . $outputFile . "\n";
  } else {
    echo "Error saving audio file to " . $outputFile . "\n";
  }
} else {
  echo "Unexpected HTTP Code: " . $httpcode . "\n";
  echo $response;
}
?>

```

### Response

The API returns the audio file content directly in the specified `response_format`.

## Normal TTS Mode with Gemini Models

AvalAI provides access to Gemini TTS models in two distinct modes:

1. **Smart Audio Generation (Chat Completions)**: Uses Gemini API to generate intelligent audio based on prompts, allowing for style guidance, tone control, and contextual audio generation
2. **Normal TTS Mode (Speech Endpoint)**: Uses Vertex AI API to convert every character in the input text to audio like traditional TTS systems

### Normal TTS vs Smart Audio Generation

| Feature | Normal TTS Mode | Smart Audio Generation |
|---------|---------------|----------------------|
| **API Endpoint** | `v1/audio/speech` | `v1/chat/completions` |
| **Underlying API** | Vertex AI Cloud Speech | Gemini API |
| **Text Processing** | Converts every character to audio | Interprets and generates contextual audio |
| **Style Control** | Voice selection and language code | Natural language instructions and prompts |
| **Use Case** | Traditional text-to-speech conversion | Intelligent audio content creation |
| **Input Handling** | Direct text conversion | Prompt-based audio generation |

### Normal TTS Mode Usage

For traditional text-to-speech conversion where you want every character in your input converted to audio, use the standard speech endpoint with Gemini TTS models:

#### Endpoint

```
POST https://api.avalai.ir/v1/audio/speech
```

#### Request Parameters for Normal TTS

!> Gemini 2.5 Pro/Flash Preview TTS support has been discontinued. Please refer to the Smart Audio Generation (Chat Completions) examples below for the recommended solution.

| Parameter | Type | Required | Description |
| ----------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `model` | string | Yes | Gemini TTS model (`gemini-2.5-pro-preview-tts`, `gemini-2.5-flash-preview-tts`) |
| `input` | string | Yes | The text to convert to audio. Maximum 32K tokens for Gemini TTS models. |
| `voice` | object | Yes | Voice configuration object with `name` and `languageCode` properties |
| `voice.name` | string | Yes | Voice name (e.g., `Kore`, `Puck`, `Zephyr`) |
| `voice.languageCode` | string | Yes | Language code (e.g., `en-US`, `fa-IR`) |
| `response_format` | string | No | Audio format: `mp3` (default), `opus`, `aac`, `flac`, `wav`, `pcm` |
| `speed` | number | No | Playback speed (0.25 to 4.0, default 1.0) |

#### Normal TTS Examples

!> Gemini 2.5 Pro/Flash Preview TTS support has been discontinued. Please refer to the Smart Audio Generation (Chat Completions) examples below for the recommended solution.

```language-selector
bash=:# cURL Example - Normal TTS Mode with Gemini
curl https://api.avalai.ir/v1/audio/speech \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gemini-2.5-flash-preview-tts",
 "input": "Literature has its own etiquette.",
 "voice": {"name": "Kore", "languageCode": "en-US"}
 }' \
  --output normal_tts_speech.mp3

python=:# Python Example - Normal TTS Mode with Gemini
from openai import OpenAI

client = OpenAI(
    api_key="AVALAI_API_KEY",
    base_url="https://api.avalai.ir/v1",
)

try:
    response = client.audio.speech.create(
        model="gemini-2.5-flash-preview-tts",
        input="Literature has its own etiquette.",
        voice={"name": "Kore", "languageCode": "en-US"},
    )

    # Save the audio file
    with open("normal_tts_speech.mp3", "wb") as f:
        f.write(response.content)

    print("Normal TTS audio saved to normal_tts_speech.mp3")
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example - Normal TTS Mode with Gemini
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function generateNormalTTS() {
  try {
    const response = await client.audio.speech.create({
      model: "gemini-2.5-flash-preview-tts",
      input: "Literature has its own etiquette.",
      voice: { name: "Kore", languageCode: "en-US" },
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile("normal_tts_speech.mp3", buffer);
    console.log("Normal TTS audio saved to normal_tts_speech.mp3");
  } catch (error) {
    console.error("Error generating normal TTS: ", error);
  }
}

generateNormalTTS();

go=:// Go Example - Normal TTS Mode with Gemini
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type TTSRequest struct {
	Model string `json:"model"`
	Input string `json:"input"`
	Voice Voice  `json:"voice"`
}

type Voice struct {
	Name         string `json:"name"`
	LanguageCode string `json:"languageCode"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}

	request := TTSRequest{
		Model: "gemini-2.5-flash-preview-tts",
		Input: "Literature has its own etiquette.",
		Voice: Voice{
			Name:         "Kore",
			LanguageCode: "en-US",
		},
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/audio/speech", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("API request failed with status: %d\n", resp.StatusCode)
		return
	}

	outFile, err := os.Create("normal_tts_speech.mp3")
	if err != nil {
		fmt.Printf("Error creating output file: %v\n", err)
		return
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, resp.Body)
	if err != nil {
		fmt.Printf("Error writing audio to file: %v\n", err)
		return
	}

	fmt.Println("Normal TTS audio saved to normal_tts_speech.mp3")
}

php=:<?php
// PHP Example - Normal TTS Mode with Gemini

$apiKey = getenv('AVALAI_API_KEY');
$apiUrl = 'https://api.avalai.ir/v1/audio/speech';
$outputFile = 'normal_tts_speech.mp3';

$data = [
 'model' => 'gemini-2.5-flash-preview-tts',
 'input' => 'Literature has its own etiquette.',
 'voice' => [
 'name' => 'Kore',
 'languageCode' => 'en-US'
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
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
 echo "cURL Error: " . $err;
} elseif ($httpcode >= 400) {
 echo "HTTP Error: " . $httpcode . "\n";
 echo "Response: " . $response;
} elseif ($httpcode == 200) {
 if (file_put_contents($outputFile, $response)) {
 echo "Normal TTS audio saved to " . $outputFile . "\n";
 } else {
 echo "Error saving audio file to " . $outputFile . "\n";
 }
} else {
 echo "Unexpected HTTP Code: " . $httpcode . "\n";
 echo $response;
}
?>

```

### Native v1beta API with Multi-Speaker Support

For advanced TTS features including **multi-speaker support**, use the native v1beta API:

```language-selector
python=:from google import genai
from google.genai import types
import wave


# Set up the wave file to save the output:
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Multi-speaker TTS with native API
prompt = """TTS the following conversation between Alice and Bob:
Alice: Literature has its own etiquette.
Bob: That's an interesting perspective."""

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="Alice",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Kore",
                            )
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="Bob",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck",
                            )
                        ),
                    ),
                ]
            )
        ),
    ),
)

data = response.candidates[0].content.parts[0].inline_data.data
wave_file("multi_speaker_conversation.wav", data)
print("Multi-speaker TTS audio saved to multi_speaker_conversation.wav")

javascript=:import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) {
	return new Promise((resolve, reject) => {
		const writer = new wav.FileWriter(filename, {
			channels,
			sampleRate: rate,
			bitDepth: sampleWidth * 8,
		});
		writer.on('finish', resolve);
		writer.on('error', reject);
		writer.write(pcmData);
		writer.end();
	});
}

const ai = new GoogleGenAI({
	apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

const prompt = `TTS the following conversation between Alice and Bob:
Alice: Literature has its own etiquette.
Bob: That's an interesting perspective.`;

const response = await ai.models.generateContent({
	model: "gemini-2.5-flash-preview-tts",
	contents: [{ parts: [{ text: prompt }] }],
	config: {
		responseModalities: ['AUDIO'],
		speechConfig: {
			multiSpeakerVoiceConfig: {
				speakerVoiceConfigs: [
					{
						speaker: 'Alice',
						voiceConfig: {
							prebuiltVoiceConfig: { voiceName: 'Kore' }
						}
					},
					{
						speaker: 'Bob',
						voiceConfig: {
							prebuiltVoiceConfig: { voiceName: 'Puck' }
						}
					}
				]
			}
		}
	}
});

const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
const audioBuffer = Buffer.from(data, 'base64');
await saveWaveFile('multi_speaker_conversation.wav', audioBuffer);
console.log("Multi-speaker TTS audio saved to multi_speaker_conversation.wav");

bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
	"contents": [{
		"parts":[{
			"text": "TTS the following conversation between Alice and Bob:\nAlice: Literature has its own etiquette.\nBob: That'\''s an interesting perspective."
		}]
	}],
	"generationConfig": {
		"responseModalities": ["AUDIO"],
		"speechConfig": {
			"multiSpeakerVoiceConfig": {
				"speakerVoiceConfigs": [{
					"speaker": "Alice",
					"voiceConfig": {
						"prebuiltVoiceConfig": {
							"voiceName": "Kore"
						}
					}
				}, {
					"speaker": "Bob",
					"voiceConfig": {
						"prebuiltVoiceConfig": {
							"voiceName": "Puck"
						}
					}
				}]
			}
		}
	},
	"model": "gemini-2.5-flash-preview-tts"
}' | jq -r '.candidates[0].content.parts[0].inlineData.data' \
  | base64 --decode >multi_speaker_conversation.pcm
# Convert PCM to WAV using ffmpeg
ffmpeg -f s16le -ar 24000 -ac 1 -i multi_speaker_conversation.pcm multi_speaker_conversation.wav

```

> **Note**: Multi-speaker TTS functionality is only available through the native v1beta API, not through the OpenAI-compatible endpoints shown above.


### PCM to MP3 Audio Format Conversion

Gemini TTS models in smart audio generation mode produce audio in PCM16 format. For convenience and file size reduction, you can convert this audio to MP3 format.

#### Library Requirements

To convert PCM to MP3, you'll need the following libraries:

**Python:**
```bash
pip install pydub
```

**JavaScript:**
```bash
npm install wav-encoder
# Also requires ffmpeg to be installed
```

#### Important Notes

- Gemini TTS models use a sample rate of 24,000 Hz
- Output format is PCM16 (16-bit, mono channel)
- Converting to MP3 significantly reduces file size
- PCM files are better suited for advanced audio processing

### Smart Audio Generation Examples (Chat Completions)

The following examples show the smart audio generation mode where Gemini models interpret prompts and generate contextual audio:

#### Single-Speaker Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
        "model": "gemini-2.5-flash-preview-tts",
        "messages": [{
            "role": "user",
            "content": "Say hello in a friendly voice"
        }],
        "modalities": ["audio"],
        "audio": {
            "voice": "Kore",
            "format": "pcm16"
        }
    }'

python=:# Python Example using Gemini TTS (Single-Speaker)
from openai import OpenAI

client = OpenAI(
    api_key="AVALAI_API_KEY",  # Replace with your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # Use AvalAI base URL
)

speech_file_path = "gemini_speech.pcm"
mp3_file_path = "gemini_speech.mp3"

try:
    response = client.chat.completions.create(
        model="gemini-2.5-flash-preview-tts",
        messages=[{"role": "user", "content": "Say hello in a friendly voice"}],
        modalities=["audio"],  # Required for TTS models
        audio={"voice": "Kore", "format": "pcm16"},  # Required: must be "pcm16"
    )

    # Convert the Pydantic object to a dictionary
    response_dict = response.model_dump()
    audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]
    # Decode the base64-encoded string into binary data
    import base64

    audio_data = base64.b64decode(audio_data_base64)

    # Save the audio as PCM
    with open(speech_file_path, "wb") as file:
        file.write(audio_data)
        print(f"PCM audio saved to {speech_file_path}")

    # Also save as MP3
    save_audio_as_mp3(audio_data, mp3_file_path)

except Exception as e:
    print(f"An error occurred: {e}")


def save_audio_as_mp3(audio_data, output_mp3_path, pcm_sample_rate=24000):
    """
    Convert raw PCM audio data to MP3 format and save it.

    Parameters:
    - audio_data: Binary PCM audio data
    - output_mp3_path: Path to save the MP3 file
    - pcm_sample_rate: Sample rate of the PCM audio (default is 24000 for Gemini TTS)

    Returns:
    - True if successful, False otherwise
    """
    try:
        # Need to import these libraries
        import io
        import wave
        from pydub import AudioSegment

        # First create a WAV file in memory from the PCM data
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, "wb") as wav_file:
            wav_file.setnchannels(1)  # Mono audio
            wav_file.setsampwidth(2)  # 16-bit audio (pcm16)
            wav_file.setframerate(pcm_sample_rate)
            wav_file.writeframes(audio_data)

            # Convert WAV to MP3
            wav_buffer.seek(0)
            audio = AudioSegment.from_wav(wav_buffer)
            audio.export(output_mp3_path, format="mp3")

            print(f"MP3 audio saved to {output_mp3_path}")
            return True

    except Exception as e:
        print(f"Error converting to MP3: {e}")
        return False

javascript=:// JavaScript Example using Gemini TTS (Single-Speaker)
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

const speechFile = "./gemini_speech.pcm";
const mp3File = "./gemini_speech.mp3";

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash-preview-tts",
      messages: [
        { role: "user", content: "Say cheerfully: Have a wonderful day!" },
      ],
      modalities: ["audio"], // Required for TTS models
      audio: {
        voice: "Kore",
        format: "pcm16", // Required: must be "pcm16"
      },
    });

    // Convert response to get audio data
    const responseObj = response.toJSON();
    const audioDataBase64 = responseObj.choices[0].message.audio.data;
    // Decode the base64-encoded string into binary data
    const buffer = Buffer.from(audioDataBase64, "base64");
    await fs.promises.writeFile(speechFile, buffer);
    console.log(`PCM audio saved to ${speechFile}`);

    // Also save as MP3
    await saveAudioAsMp3(buffer, mp3File);
  } catch (error) {
    console.error("Error generating speech: ", error);
  }
}

async function saveAudioAsMp3(audioData, outputMp3Path, pcmSampleRate = 24000) {
  /**
   * Convert raw PCM audio data to MP3 format and save it.
   *
   * @param {Buffer} audioData - Binary PCM audio data
   * @param {string} outputMp3Path - Path to save the MP3 file
   * @param {number} pcmSampleRate - Sample rate of the PCM audio (default is 24000 for Gemini TTS)
   * @returns {Promise<boolean>} - True if successful, false otherwise
   */
  try {
    // Need to import these libraries (install with: npm install wav-encoder)
    const WavEncoder = await import("wav-encoder");
    const fs = await import("fs");
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    // First create a WAV file from the PCM data
    const wavData = WavEncoder.encode({
      sampleRate: pcmSampleRate,
      channelData: [
        new Float32Array(
          audioData.buffer,
          audioData.byteOffset,
          audioData.byteLength / 4,
        ),
      ],
    });

    const tempWavPath = outputMp3Path.replace(".mp3", "_temp.wav");
    await fs.promises.writeFile(tempWavPath, Buffer.from(wavData));

    // Convert WAV to MP3 using ffmpeg (requires ffmpeg to be installed)
    await execAsync(
      `ffmpeg -i "${tempWavPath}" -codec:a libmp3lame "${outputMp3Path}"`,
    );

    // Clean up temporary WAV file
    await fs.promises.unlink(tempWavPath);

    console.log(`MP3 audio saved to ${outputMp3Path}`);
    return true;
  } catch (error) {
    console.error(`Error converting to MP3: ${error}`);
    return false;
  }
}

main();

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash-preview-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Say cheerfully: Have a wonderful day!",
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
  input: "Say cheerfully: Have a wonderful day!",
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
    "input": "Say cheerfully: Have a wonderful day!",
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


#### Multi-Speaker Example

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We'll announce its release through our official channels. Stay tuned for updates!

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
     "model": "gemini-2.5-pro-preview-tts",
     "messages": [{
         "role": "user",
         "content": "Generate audio for this conversation:\nJohn: How'\''s the weather today?\nSarah: It'\''s beautiful outside! Perfect for a walk."
     }],
     "modalities": ["audio"],
     "audio": {
         "voice": "Kore",
         "format": "pcm16"
     }
 }'

python=:# Python Example using Gemini TTS (Multi-Speaker)
from openai import OpenAI

client = OpenAI(
    api_key="AVALAI_API_KEY",  # Replace with your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # Use AvalAI base URL
)

speech_file_path = "gemini_conversation.pcm"
mp3_file_path = "gemini_conversation.mp3"

try:
    response = client.chat.completions.create(
        model="gemini-2.5-pro-preview-tts",
        messages=[
            {
                "role": "user",
                "content": "Generate audio for this conversation:\nJohn: How's the weather today?\nSarah: It's beautiful outside! Perfect for a walk.",
            }
        ],
        modalities=["audio"],  # Required for TTS models
        audio={"voice": "Kore", "format": "pcm16"},  # Required: must be "pcm16"
    )

    # Convert the Pydantic object to a dictionary
    response_dict = response.model_dump()
    audio_data_base64 = response_dict["choices"][0]["message"]["audio"]["data"]
    # Decode the base64-encoded string into binary data
    import base64

    audio_data = base64.b64decode(audio_data_base64)

    # Save the audio as PCM
    with open(speech_file_path, "wb") as f:
        f.write(audio_data)
        print(f"PCM conversation audio saved to {speech_file_path}")

    # Also save as MP3
    save_audio_as_mp3(audio_data, mp3_file_path)

except Exception as e:
    print(f"An error occurred: {e}")


def save_audio_as_mp3(audio_data, output_mp3_path, pcm_sample_rate=24000):
    """
    Convert raw PCM audio data to MP3 format and save it.

    Parameters:
    - audio_data: Binary PCM audio data
    - output_mp3_path: Path to save the MP3 file
    - pcm_sample_rate: Sample rate of the PCM audio (default is 24000 for Gemini TTS)

    Returns:
    - True if successful, False otherwise
    """
    try:
        # Need to import these libraries
        import io
        import wave
        from pydub import AudioSegment

        # First create a WAV file in memory from the PCM data
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, "wb") as wav_file:
            wav_file.setnchannels(1)  # Mono audio
            wav_file.setsampwidth(2)  # 16-bit audio (pcm16)
            wav_file.setframerate(pcm_sample_rate)
            wav_file.writeframes(audio_data)

            # Convert WAV to MP3
            wav_buffer.seek(0)
            audio = AudioSegment.from_wav(wav_buffer)
            audio.export(output_mp3_path, format="mp3")

            print(f"MP3 conversation audio saved to {output_mp3_path}")
            return True

    except Exception as e:
        print(f"Error converting to MP3: {e}")
        return False

javascript=:// JavaScript Example using Gemini TTS (Multi-Speaker)
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const speechFile = "./gemini_conversation.mp3";

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gemini-2.5-pro-preview-tts",
      messages: [
        {
          role: "user",
          content:
            "Generate audio for this conversation:\nJohn: How's the weather today?\nSarah: It's beautiful outside! Perfect for a walk.",
        },
      ],
      modalities: ["audio"], // Required for TTS models
      audio: {
        voice: "Kore",
        format: "pcm16", // Required: must be "pcm16"
      },
    });

    // Convert response to get audio data
    const responseObj = response.toJSON();
    const audioDataBase64 = responseObj.choices[0].message.audio.data;
    // Decode the base64-encoded string into binary data
    const buffer = Buffer.from(audioDataBase64, "base64");
    await fs.promises.writeFile(speechFile, buffer);
    console.log(`Conversation audio saved to ${speechFile}`);
  } catch (error) {
    console.error("Error generating speech: ", error);
  }
}

main();

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-pro-preview-tts` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Generate audio for this conversation: John: How",
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
  input: "Generate audio for this conversation: John: How",
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
    "input": "Generate audio for this conversation: John: How",
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


### TTS Best Practices

#### Performance Tips

- **Choose the Right Model**: Use `gemini-2.5-pro-preview-tts` for higher quality and `gemini-2.5-flash-preview-tts` for faster processing
- **File Size Management**: PCM files are large, always convert them to MP3 for storage and distribution
- **Cache Results**: Cache TTS results to avoid repeated API calls for the same content

#### Audio Quality Tips

- **Use Natural Instructions**: Leverage natural language instructions to control voice style (e.g., "Say cheerfully", "Speak slowly")
- **Voice Selection**: Different voices work better for different types of content
- **Quality Testing**: Always test audio output before final deployment

#### Error Handling

- **Input Limits**: Ensure input text doesn't exceed 32K tokens
- **Exception Management**: Always wrap your code in try-catch blocks
- **Format Validation**: Make sure audio format is set to `pcm16`

#### Security Considerations

- **API Key Protection**: Never expose your API key in client-side code
- **Input Validation**: Always validate user input text before processing
- **Access Control**: Implement proper access controls for API usage

## Speech-to-Text: Transcription

Transcribe audio into the language spoken in the audio file.

### Endpoint

```
POST https://api.avalai.ir/v1/audio/transcriptions
```

### Request Body

| Parameter                   | Type    | Required | Description                                                                                                                                                       |
| --------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file`                      | file    | Yes      | The audio file object (not filename) to transcribe. Supported formats: `flac`, `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `ogg`, `wav`, `webm`. Max 25MB.               |
| `model`                     | string  | Yes      | ID of the model to use (e.g., `whisper-1`, `gpt-4o-transcribe`, `groq.whisper-large-v3`, `groq.whisper-large-v3-turbo`). Check [Models](en/models/model-details.md) for availability.                                             |
| `language`                  | string  | No       | The language of the input audio in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format (e.g., `en`). Improves accuracy and latency.         |
| `prompt`                    | string  | No       | Optional text to guide the model's style or provide context (e.g., names, technical terms). Should match the audio language.                                      |
| `response_format`           | string  | No       | Format of the output: `json` (default), `text`, `srt`, `verbose_json`, or `vtt`. (`json` required for `gpt-4o-transcribe` models).                                |
| `temperature`               | number  | No       | Sampling temperature (0 to 1). Default is 0. Lower values are more deterministic.                                                                                 |
| `timestamp_granularities[]` | array   | No       | Granularities for timestamps. Requires `response_format="verbose_json"`. Options: `word`, `segment`. `word` timestamps incur extra latency. Default is `segment`. |
| `include[]`                 | array   | No       | Additional info to include. `logprobs` returns token log probabilities (requires `response_format="json"` and compatible models like `gpt-4o-transcribe`).        |
| `stream`                    | boolean | No       | If `true`, streams results as server-sent events. Not supported for `whisper-1`. Default is `false`.                                                              |

### Examples

```language-selector
bash=:# cURL Example using AvalAI Transcription
curl https://api.avalai.ir/v1/audio/transcriptions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/audio.mp3" \
  -F model="whisper-1"

python=:# Python Example using AvalAI Transcription
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    audio_file = open("path/to/audio.mp3", "rb")
    transcript = client.audio.transcriptions.create(
        model="whisper-1",  # Or another transcription model
        file=audio_file,
        response_format="text",  # Example: get plain text
    )
    print(transcript)
except FileNotFoundError:
    print("Error: Audio file not found.")
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example using AvalAI Transcription
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  try {
    const audioFilePath = "path/to/audio.mp3"; // Replace with your audio file path

    if (!fs.existsSync(audioFilePath)) {
      console.error(`Error: Audio file not found at ${audioFilePath}`);
      return;
    }

    const transcript = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1", // Or another transcription model
      // language: "en", // Optional: Specify language
      // response_format: "text", // Optional: Specify format (default is json)
    });

    // If response_format is json (default) or verbose_json
    if (typeof transcript === "object" && transcript.text) {
      console.log("Transcription (JSON): ", transcript.text);
    } else {
      // If response_format is text, srt, vtt
      console.log("Transcription (Text/Other): ", transcript);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("Error: Audio file not found.");
    } else {
      console.error("An error occurred during transcription: ", error);
    }
  }
}

main();

go=:// Go Example using AvalAI Transcription
package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL
	audioFilePath := "path/to/audio.mp3"  // Replace with your audio file path

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	req := openai.AudioRequest{
		Model:    openai.Whisper1, // Or another transcription model
		FilePath: audioFilePath,
		// Language: "en", // Optional
		// ResponseFormat: "text", // Optional (default is json)
		// Prompt: "Optional context prompt", // Optional
		// Temperature: 0, // Optional
	}

	resp, err := client.CreateTranscription(context.Background(), req)
	if err != nil {
		fmt.Printf("Transcription error: %v\n", err)
		// Check if the error is due to file not found
		if _, ok := err.(*os.PathError); ok {
			fmt.Println("Hint: Ensure the audio file path is correct.")
		}
		return
	}

	fmt.Println("Transcription:", resp.Text) // Assumes default JSON response
}

php=:<?php
// PHP Example using AvalAI Transcription

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/audio/transcriptions';
$audioFilePath = '/path/to/audio.mp3'; // IMPORTANT: Replace with the actual path to your audio file

if (!file_exists($audioFilePath)) {
    die("Error: Audio file not found at " . $audioFilePath);
}

// Create a CURLFile object
$cfile = curl_file_create($audioFilePath, mime_content_type($audioFilePath), basename($audioFilePath));

$data = [
    'file' => $cfile,
    'model' => 'whisper-1',
    // Add other parameters like language, response_format etc. if needed
    // 'language' => 'en',
    // 'response_format' => 'json' // Default is json
];

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Pass the array directly for multipart/form-data
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey
    // Content-Type is set automatically by cURL for multipart/form-data
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
    echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
    echo "HTTP Error: " . $httpcode . "\n";
    echo "Response: " . $response;
} else {
    // Assuming default 'json' response format or 'text'
    $responseData = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE && isset($responseData['text'])) {
        echo "Transcription (JSON): " . $responseData['text'] . "\n";
    } else {
        // If response is plain text or other format
        echo "Transcription (Text/Other): " . $response . "\n";
    }
}
?>

```

### Response Formats

Depending on `response_format`:

- **`json` (Default):**

```json
{
  "text": "Transcribed text here..."
}
```

- **`text`:** Plain text string.
- **`srt` / `vtt`:** Standard subtitle formats with timestamps.
- **`verbose_json`:** Detailed JSON including language, duration, segments, and potentially word timestamps if requested via `timestamp_granularities`.

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 10.5,
  "text": "Transcribed text here...",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 4.5,
      "text": " First segment.",
      "tokens": [...],
      "temperature": 0.0,
      "avg_logprob": -0.3,
      "compression_ratio": 1.5,
      "no_speech_prob": 0.01
    },
    // ... more segments

  ],
  // Optional: "words": [...] if "word" granularity requested

}
```

### Streaming Transcription (Model-Dependent)

If `stream=true` (and model supports it, e.g., `gpt-4o-transcribe`), the API returns server-sent events:

- **`transcript.text.delta`:** Contains chunks of transcribed text.
- **`transcript.text.done`:** Sent at the end with the full transcription text.

Refer to OpenAI documentation for detailed event structure if implementing streaming.

## Speech-to-Text: Translation

Translate audio from various languages directly into English text.

### Endpoint

```
POST https://api.avalai.ir/v1/audio/translations
```

### Request Body

| Parameter         | Type   | Required | Description                                                                                                                         |
| ----------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `file`            | file   | Yes      | The audio file object to translate. Supported formats: `flac`, `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `ogg`, `wav`, `webm`. Max 25MB. |
| `model`           | string | Yes      | ID of the model to use. Currently, only `whisper-1` is supported for translation via this endpoint.                                 |
| `prompt`          | string | No       | Optional text in English to guide the model's style.                                                                                |
| `response_format` | string | No       | Format of the output: `json` (default), `text`, `srt`, `verbose_json`, or `vtt`.                                                    |
| `temperature`     | number | No       | Sampling temperature (0 to 1). Default is 0.                                                                                        |

### Examples

```language-selector
bash=:# cURL Example using AvalAI Translation
curl https://api.avalai.ir/v1/audio/translations \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/spanish_audio.m4a" \
  -F model="whisper-1"

python=:# Python Example using AvalAI Translation
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    audio_file = open("path/to/spanish_audio.m4a", "rb")
    translation = client.audio.translations.create(model="whisper-1", file=audio_file)
    print(translation.text)  # Assumes response_format="json" or "text"
except FileNotFoundError:
    print("Error: Audio file not found.")
except Exception as e:
    print(f"An error occurred: {e}")

javascript=:// JavaScript Example using AvalAI Translation
import fs from "fs";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Ensure AVALAI_API_KEY is set
  baseURL: "https://api.avalai.ir/v1", // Use AvalAI base URL
});

async function main() {
  try {
    const audioFilePath = "path/to/spanish_audio.m4a"; // Replace with your audio file path

    if (!fs.existsSync(audioFilePath)) {
      console.error(`Error: Audio file not found at ${audioFilePath}`);
      return;
    }

    const translation = await client.audio.translations.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
      // prompt: "Translate this Spanish audio to English.", // Optional prompt
      // response_format: "text", // Optional: Specify format (default is json)
    });

    // If response_format is json (default) or verbose_json
    if (typeof translation === "object" && translation.text) {
      console.log("Translation (JSON): ", translation.text);
    } else {
      // If response_format is text, srt, vtt
      console.log("Translation (Text/Other): ", translation);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("Error: Audio file not found.");
    } else {
      console.error("An error occurred during translation: ", error);
    }
  }
}

main();

go=:// Go Example using AvalAI Translation
package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1"        // Use AvalAI base URL
	audioFilePath := "path/to/spanish_audio.m4a" // Replace with your audio file path

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	req := openai.AudioRequest{
		Model:    openai.Whisper1, // Whisper-1 is used for translation
		FilePath: audioFilePath,
		// Prompt: "Translate this Spanish audio to English.", // Optional
		// ResponseFormat: "text", // Optional (default is json)
		// Temperature: 0, // Optional
	}

	resp, err := client.CreateTranslation(context.Background(), req) // Use CreateTranslation
	if err != nil {
		fmt.Printf("Translation error: %v\n", err)
		// Check if the error is due to file not found
		if _, ok := err.(*os.PathError); ok {
			fmt.Println("Hint: Ensure the audio file path is correct.")
		}
		return
	}

	fmt.Println("Translation:", resp.Text) // Assumes default JSON response
}

php=:<?php
// PHP Example using AvalAI Translation

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/audio/translations';
$audioFilePath = '/path/to/spanish_audio.m4a'; // IMPORTANT: Replace with the actual path to your audio file

if (!file_exists($audioFilePath)) {
  die("Error: Audio file not found at " . $audioFilePath);
}

// Create a CURLFile object
$cfile = curl_file_create($audioFilePath, mime_content_type($audioFilePath), basename($audioFilePath));

$data = [
'file' => $cfile,
'model' => 'whisper-1',
// Add other parameters like prompt, response_format etc. if needed
// 'prompt' => 'Translate this Spanish audio to English.',
// 'response_format' => 'json' // Default is json
];

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Pass the array directly for multipart/form-data
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Authorization: Bearer ' . $apiKey
// Content-Type is set automatically by cURL for multipart/form-data
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response: " . $response;
} else {
  // Assuming default 'json' response format or 'text'
  $responseData = json_decode($response, true);
  if (json_last_error() === JSON_ERROR_NONE && isset($responseData['text'])) {
    echo "Translation (JSON): " . $responseData['text'] . "\n";
  } else {
    // If response is plain text or other format
    echo "Translation (Text/Other): " . $response . "\n";
  }
}
?>

```

### Response Formats

The response formats (`json`, `text`, `srt`, `verbose_json`, `vtt`) are the same as for the transcription endpoint, but the output text will be in English.

## Error Handling

Refer to the [Error Handling Guide](en/guides/error-handling.md) for details on common HTTP status codes (4xx, 5xx) and how to handle them.
