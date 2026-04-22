import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const apiKey = process.env['VITE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY'];
  
  if (!apiKey) {
    console.error('No API key found in environment variables (VITE_GEMINI_API_KEY or GEMINI_API_KEY)');
    return;
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  try {
    console.log('Fetching available models...');
    // The @google/genai SDK might have a different method for listing models
    // Let's try to use the REST API directly or check if it's available in the SDK
    
    // Using the listModels equivalent in @google/genai if it exists
    // If not, we'll use @google/generative-ai which we know has it
    
    const response = await ai.models.list();
    console.log('Supported Models:');
    response.forEach(model => {
      console.log(`- ${model.name} (${model.displayName})`);
      console.log(`  Capabilities: ${model.supportedGenerationMethods.join(', ')}`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
    
    // Fallback to @google/generative-ai for listing if @google/genai fails
    console.log('\nTrying fallback with @google/generative-ai...');
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
      // Note: listModels is not directly on genAI in some versions, 
      // but we can try to find where it is.
      // Usually it's a standalone call or via a specific client.
      // In the latest web SDK it might be different.
    } catch (e) {
      console.error('Fallback also failed:', e);
    }
  }
}

main();
