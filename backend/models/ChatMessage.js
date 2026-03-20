import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: String,
  sessionId: String,
  role: {
    type: String,
    enum: ["user", "model"]
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ChatMessage", ChatSchema);