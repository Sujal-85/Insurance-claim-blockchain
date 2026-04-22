import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
console.log("Using API Key:", API_KEY.substring(0, 10) + "...");

async function testConnection() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("Response:", response.text());
  } catch (error) {
    console.error("Connection Error:", error);
  }
}

testConnection();
