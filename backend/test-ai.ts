
import { AIService } from './src/claims/ai.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
  const aiService = new AIService();
  console.log('Testing AI Service...');
  try {
    const analysis = await aiService.getClaimAnalysis(
      'Car accident on highway, front bumper damaged',
      50000,
      'Auto',
      'Mumbai'
    );
    console.log('Analysis result:', JSON.stringify(analysis, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
