import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeClaim(claimData: any) {
  if (!API_KEY) {
    return {
      authenticity: "Verified ✓",
      policyCoverage: "Eligible ✓",
      riskScore: "Low (12/100)",
      analysis: "AI analysis is currently using non-live data because the Gemini API key is missing. Please provide a VITE_GEMINI_API_KEY in your .env file for real-time risk assessment."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following insurance claim for potential fraud and policy alignment:
      Claim ID: ${claimData.id}
      Incident Type: ${claimData.incidentType}
      Date: ${claimData.incidentDate}
      Amount: $${claimData.amount}
      Description: ${claimData.description}
      Location: ${claimData.location}

      Return a JSON object with the following fields:
      - authenticity: (string) status like "Verified" or "Flagged"
      - policyCoverage: (string) status like "Eligible" or "Requires Review"
      - riskScore: (number) 0-100 indicating risk
      - analysis: (string) a brief 2-sentence summary of the analysis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if needed
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonStr);

    return {
      authenticity: parsed.authenticity || "Pending",
      policyCoverage: parsed.policyCoverage || "Pending",
      riskScore: parsed.riskScore || 0,
      analysis: parsed.analysis || "Analysis complete."
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      authenticity: "Error",
      policyCoverage: "Error",
      riskScore: 99,
      analysis: "Failed to perform AI analysis. Error connecting to Gemini API."
    };
  }
}
