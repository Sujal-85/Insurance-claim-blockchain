
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const client = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-flash-latest';
  console.log(`Testing model: ${modelName}`);
  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: 'Hello, are you working?' }] }],
    });
    console.log('Response:', response.text);
  } catch (error) {
    console.error('Failed:', error);
  }
}

test();
