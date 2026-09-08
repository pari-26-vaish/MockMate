import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("Gemini configuration loaded");

export default gemini;