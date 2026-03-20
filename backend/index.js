import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { v4 as uuid } from "uuid";
import redis from "./redisClient.js";
import { chat } from "./chatService.js";
import ChatMessage from "./models/ChatMessage.js";
import client from "./db/qdrantClient.js";
import multer from "multer";
import { documentChat } from "./controllers/chatController.js";
import { uploadDocument } from "./controllers/documentController.js";
import { connectDB } from "./db.js";

dotenv.config();
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60000,
  max: 20
});

app.use(limiter);

(async()=>{
  await connectDB()
//   await client.createCollection("documents", {
//   vectors: {
//     size: 3072,
//     distance: "Cosine"
//   }
// })

// console.log("kk ",await client.getCollection("documents"))
})();

app.post('/docs-chat',documentChat)
app.post("/chat", async (req, res) => {

  const { userId, sessionId, message } = req.body;

  const reply = await chat(userId, sessionId, message);

  res.json({
    reply
  });

});
app.post("/session", async (req, res) => {

  const { userId } = req.body;

  const sessionId = uuid();

  await redis.sAdd(`sessions:${userId}`, sessionId);

  res.json({
    userId,
    sessionId
  });

});
app.post("/history", async (req, res) => {

  const { userId, sessionId } = req.body;

  const key = `chat:${userId}:${sessionId}`;

  const history = await redis.lRange(key, 0, -1);
  const messages = history.map(m => JSON.parse(m));

  res.json(messages);

});
app.get("/sessions/:userId", async (req, res) => {

  const sessions = await redis.sMembers(
    `sessions:${req.params.userId}`
  );

  res.json(sessions);

});
app.get("/history/:userId/:sessionId", async (req, res) => {

  const messages = await ChatMessage
    .find({
      userId: req.params.userId,
      sessionId: req.params.sessionId
    })
    .sort({ createdAt: 1 });

  res.json(messages);

});


app.post("/upload", upload.single("file"), uploadDocument);
app.listen(3000, () => {
  console.log("AI server running on port 3000");
});