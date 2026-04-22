
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const client = new GoogleGenAI({ apiKey });
  try {
    const response: any = await client.models.list();
    console.log('---MODELS---');
    if (response && response.models) {
        for (let i = 0; i < Math.min(response.models.length, 10); i++) {
            console.log(response.models[i].name);
        }
    }
    console.log('---END---');
  } catch (error) {
    console.error('Failed:', error);
  }
}

listModels();
