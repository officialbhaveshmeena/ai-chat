import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const  askAI =async(messages)=> {
  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages
    });

    return response.text;

  } catch (error) {

    console.error("Gemini error:", error);

    return "Sorry, AI service is temporarily unavailable.";
  }
}
