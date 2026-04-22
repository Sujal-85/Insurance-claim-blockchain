import { AIService } from './src/claims/ai.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testAI() {
  console.log('--- Testing AIService ---');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
  
  const service = new AIService();
  
  try {
    const result = await service.getClaimAnalysis(
      "My car was hit by a falling tree during a storm in the parking lot.",
      2500,
      "Vehicle Damage",
      "New York"
    );
    
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.analysis === 'AI analysis service temporarily unavailable or using limited data.') {
      console.error('FAILED: Service returned fallback data.');
    } else {
      console.log('SUCCESS: AI analysis generated.');
    }
  } catch (error) {
    console.error('CRITICAL ERROR:', error);
  }
}

testAI();
