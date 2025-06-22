// To run this code you need to install:
// npm install @google/genai dotenv

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_AI_KEY,
  });

  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.5-pro';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Generate Travel Plan for Location: Jaipur, for 3 Days for Couple with a Cheap budget...`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `**Drafting Jaipur Itinerary** ...`, // Truncated for brevity
        },
        {
          text: '```json\n{...Full JSON Itinerary...}\n```', // Also truncated
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    if (chunk.text) {
     console.log(chunk.text);
 // ✅ Fixed this line
    }
  }
}

main().catch(console.error);
