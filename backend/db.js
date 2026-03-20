import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export async function connectDB() {
  try {
    
 
  // await mongoose.connect("mongodb://localhost:27017/ai-chat");
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");
   } catch (error) {
    console.log("mongo db error ",error)
  }
}