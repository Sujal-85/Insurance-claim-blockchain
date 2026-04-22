import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeClaim(claimData: any) {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing. Using mock data.");
    return {
      authenticity: "Verified ✓",
      policyCoverage: "Eligible ✓",
      riskScore: "Low (12/100)",
      analysis: "AI analysis is currently using non-live data because the Gemini API key is missing. Please provide a VITE_GEMINI_API_KEY in your .env file for real-time risk assessment."
    };
  }

  try {
    // Using gemini-3-flash-preview as it's confirmed working in test.ts
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Analyze the following insurance claim for potential fraud and policy alignment:
      Claim ID: ${claimData.id}
      Incident Type: ${claimData.incidentType}
      Date: ${claimData.incidentDate}
      Amount: ${claimData.amount}
      Description: ${claimData.description}
      Location: ${claimData.location}

      IMPORTANT: Return ONLY a valid JSON object. Do not include any markdown formatting like \`\`\`json.
      
      The JSON object should have these exact fields:
      {
        "authenticity": "string (e.g., 'Verified', 'Flagged', 'Highly Suspicious')",
        "policyCoverage": "string (e.g., 'Eligible', 'Requires Review', 'Not Covered')",
        "riskScore": number (0-100),
        "analysis": "string (a brief 2-sentence summary)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini Raw Response:", text);

    try {
      // More robust JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        authenticity: parsed.authenticity || "Verified",
        policyCoverage: parsed.policyCoverage || "Eligible",
        riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : (parseInt(parsed.riskScore) || 0),
        analysis: parsed.analysis || "Analysis complete."
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Original text:", text);
      throw new Error("Failed to parse AI response");
    }
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // Check for specific error types if possible
    const errorMessage = error.message || "Error connecting to Gemini API.";
    
    return {
      authenticity: "Error",
      policyCoverage: "Error",
      riskScore: 99,
      analysis: `Failed to perform AI analysis. ${errorMessage}`
    };
  }
}
