import { askAI } from "./geminiService.js";
import redis from "./redisClient.js";

import ChatMessage from "./models/ChatMessage.js";

export async function saveMessage(userId, sessionId, role, text) {
  await ChatMessage.create({
    userId,
    sessionId,
    role,
    text,
  });
}
export async function loadHistory(userId, sessionId) {
  const messages = await ChatMessage.find({ userId, sessionId })
    .sort({ createdAt: 1 })
    .limit(20);

  return messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}
export async function chat(userId, sessionId, message) {
  try {
    
 
  const key = `chat:${userId}:${sessionId}`;

  let history = await redis.lRange(key, -10, -1);
  if (history.length === 0) {
    let dbHistory = await loadHistory(userId, sessionId);

    history = dbHistory.map((m) =>
      JSON.stringify({
        role: m.role,
        text: m.parts[0].text,
      }),
    );
  }
  const contents = history.map((msg) => {
    const m = JSON.parse(msg);
    return {
      role: m.role,
      parts: [{ text: m.text }],
    };
  });

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const aiReply = await askAI(contents);

  await redis.rPush(
    key,
    JSON.stringify({
      role: "user",
      text: message,
    }),
  );

  await redis.rPush(
    key,
    JSON.stringify({
      role: "model",
      text: aiReply,
    }),
  );
  await saveMessage(userId, sessionId, "user", message);
  await saveMessage(userId, sessionId, "model", aiReply);

  return aiReply;
   } catch (error) {
    console.log("error : ",error)
  }
}
