import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Use the full name: GoogleGenerativeAI
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function generateEmbedding(text) {
  try {
    // const model = ai.getGenerativeModel({ model: "gemini-embedding-001" });

    // // For a single string, you can pass it directly
    // const result = await model.embedContent(text);
    // const embedding = result.embedding;

    // return embedding.values;

    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });

    const embedding = result.embeddings;
    return embedding;
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
}
