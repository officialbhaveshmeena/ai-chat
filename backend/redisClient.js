import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on("error", err => console.error("Redis error", err));

(async()=>{

    await redis.connect();
})()

export default redis;