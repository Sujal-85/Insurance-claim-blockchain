import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();


export interface ClaimAnalysis {
  authenticity: string;
  policyCoverage: string;
  riskScore: number;
  analysis: string;
}

@Injectable()
export class AIService {
  private ai: GoogleGenAI;
  private readonly primaryModel = 'gemini-flash-latest';
  private readonly fallbackModel = 'gemini-pro-latest';

  constructor() {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    console.log('AI Service: API Key found:', !!apiKey);
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error('AI Service: API Key NOT found in environment');
    }
  }

  async getClaimAnalysis(
    description: string, 
    amount: number, 
    incidentType: string = 'unknown',
    location: string = 'unknown'
  ): Promise<ClaimAnalysis> {
    const fallback: ClaimAnalysis = {
      authenticity: 'Requires Review',
      policyCoverage: 'Pending Assessment',
      riskScore: 50,
      analysis: 'AI analysis service temporarily unavailable or using limited data.'
    };

    if (!this.ai) {
      console.warn('AI Service: Gemini API key not found');
      return fallback;
    }

    try {
      const prompt = `
        Analyze the following insurance claim for potential fraud and policy alignment:
        Incident Type: ${incidentType}
        Amount: ${amount}
        Description: ${description}
        Location: ${location}

        IMPORTANT: Return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.
        
        The JSON object should have these exact fields:
        {
          "authenticity": "string (e.g., 'Verified', 'Flagged', 'Highly Suspicious')",
          "policyCoverage": "string (e.g., 'Eligible', 'Requires Review', 'Not Covered')",
          "riskScore": number (0-100 where higher is more suspicious),
          "analysis": "string (a brief 2-sentence summary of findings)"
        }
      `;

      return await this.generateWithFallback(prompt);
    } catch (error) {
      console.error('AI Service: Error during analysis:', error.message);
      return fallback;
    }
  }

  private async generateWithFallback(prompt: string): Promise<ClaimAnalysis> {
    const models = [this.primaryModel, this.fallbackModel];
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`AI Service: Attempting generation with ${modelName}`);
        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const text = response?.text || '';
        console.log(`AI Service: Response from ${modelName} received. Length: ${text.length}`);
        if (!text) {
          console.warn(`AI Service: Empty response from ${modelName}`);
          continue;
        }

        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.warn(`AI Service: No JSON found in response from ${modelName}. Full text: ${text}`);
          continue;
        }

        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`AI Service: Successfully parsed JSON from ${modelName}`);
        return {
          authenticity: parsed.authenticity || 'Verified',
          policyCoverage: parsed.policyCoverage || 'Eligible',
          riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : (parseInt(parsed.riskScore) || 0),
          analysis: parsed.analysis || 'Analysis complete.'
        };
      } catch (error) {
        console.error(`AI Service: Model ${modelName} failed. Error: ${error.message}`);
        if (error.stack) console.error(error.stack);
        lastError = error;
      }
    }

    console.error('AI Service: All models failed. Falling back to default data.');
    throw lastError || new Error('All models failed');
  }

  // Deprecated: Kept for compatibility if needed elsewhere, now uses getClaimAnalysis
  async calculateRiskScore(description: string, amount: number): Promise<number> {
    const analysis = await this.getClaimAnalysis(description, amount);
    // Convert 0-100 to 0-10 for backward compatibility
    return analysis.riskScore / 10;
  }
}
