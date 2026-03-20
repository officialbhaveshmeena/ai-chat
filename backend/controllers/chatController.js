import { searchContext } from "../services/ragService.js";
import { askAI } from "../services/geminiService.js";

export async function documentChat(req, res) {
  
  const { message } = req.body;

  const docs = await searchContext(message);

  const prompt = `
Context:
${docs.join("\n")}

Question:
${message}
`;

  const answer = await askAI([
    {
      role: "user",
      parts: [{ text: prompt }]
    }
  ]);

  res.json({ answer });

}