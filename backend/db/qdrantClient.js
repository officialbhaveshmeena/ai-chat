import { QdrantClient } from "@qdrant/js-client-rest";

import dotenv from "dotenv";

dotenv.config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL
});

export default client;