import { Injectable, Logger } from "@nestjs/common";
import type OpenAI from "openai";
import { AVALAI_CHAT_MODEL } from "./avalai.constants";

export interface IntentResult {
  needsDbQuery: boolean;
  budgetLimit: number | null;
  deviceCategory: string | null;
  primaryUse: string | null;
  searchTokens: string[];
}

@Injectable()
export class AvalAiIntentParser {
  private readonly logger = new Logger(AvalAiIntentParser.name);

  async parseUserIntent(client: OpenAI, query: string): Promise<IntentResult> {
    const normalizedQuery = normalizePersianText(query);
    const targetPrice = parsePersianPrice(normalizedQuery);

    try {
      const response = await client.chat.completions.create({
        model: AVALAI_CHAT_MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Analyze the following Persian user query for an e-commerce hardware shop.
Extract metadata parameters and return a valid JSON object matching this schema exactly:
{
  "needsDbQuery": boolean,
  "budgetLimit": number | null,
  "deviceCategory": "Laptop" | "All-in-One" | "PC" | "Monitor" | "Parts" | null,
  "primaryUse": "Rendering" | "Office" | "Development" | "Gaming" | "Student" | null,
  "searchTokens": string[]
}

Example input: "تا ۷۰ تومن لپ تاپ برای تدوین و رندر چی داری؟"
Example output:
{
  "needsDbQuery": true,
  "budgetLimit": 70000000,
  "deviceCategory": "Laptop",
  "primaryUse": "Rendering",
  "searchTokens": ["لپ تاپ", "تدوین", "رندر"]
}`,
          },
          { role: "user", content: query },
        ],
      });

      const text = response.choices[0]?.message?.content;
      if (text) {
        const result = JSON.parse(text) as IntentResult;
        if (result.budgetLimit === null && targetPrice !== null) {
          result.budgetLimit = targetPrice;
        }
        return result;
      }
    } catch (err) {
      this.logger.error(`Intent parsing failed: ${(err as Error).message}`);
    }

    return {
      needsDbQuery: true,
      budgetLimit: targetPrice,
      deviceCategory: null,
      primaryUse: null,
      searchTokens: [query],
    };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizePersianText(str: string): string {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i.toString()).replace(arabicDigits[i], i.toString());
  }
  return result;
}

function parsePersianPrice(text: string): number | null {
  const normalized = normalizePersianText(text.toLowerCase());

  const millionRegex = /(\d+(?:\.\d+)?)\s*(?:میلیون|ملیون|م)\b/g;
  let match = millionRegex.exec(normalized);
  if (match) {
    return parseFloat(match[1]) * 1_000_000;
  }

  const tomanRegex = /(\d+(?:\.\d+)?)\s*(?:تومن|تومان)/g;
  match = tomanRegex.exec(normalized);
  if (match) {
    const val = parseFloat(match[1]);
    if (val < 1000) {
      return val * 1_000_000;
    }
    return val;
  }

  const plainRegex = /\b(\d{6,10})\b/g;
  match = plainRegex.exec(normalized);
  if (match) {
    return parseFloat(match[1]);
  }

  const wordsMap: Record<string, number> = {
    سی: 30,
    چهل: 40,
    پنجاه: 50,
    شصت: 60,
    هفتاد: 70,
    هشتاد: 80,
    نود: 90,
    صد: 100,
  };
  for (const [word, val] of Object.entries(wordsMap)) {
    if (normalized.includes(word)) {
      return val * 1_000_000;
    }
  }

  return null;
}
