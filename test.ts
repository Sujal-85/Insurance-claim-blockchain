// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
  ThinkingLevel,
} from '@google/genai';

async function main() {
  const apiKey = process.env['VITE_GEMINI_API_KEY'];
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY not found in .env');
    return;
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  // Test with gemini-3-flash-preview (Working)
  const model = 'gemini-3-flash-preview';
  console.log(`Testing model: ${model}`);

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Explain the benefits of using blockchain in a claims management system.`,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      contents,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        process.stdout.write(chunk.text);
      }
    }
    console.log('\n--- Done ---');
  } catch (error: any) {
    console.error('Error during generation:', error.message || error);
  }
}

main();




