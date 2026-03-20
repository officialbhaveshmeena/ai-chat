// import client from "..qdrantClient.js";
import client from "../db/qdrantClient.js";
import { generateEmbedding } from "./embeddingService.js";

export async function searchContext(query) {
  try {
    
  
  const vector = await generateEmbedding(query);

  const results = await client.search("documents", {
    vector:vector[0].values,
    limit: 3,
    with_payload: true,
  });

  // console.log("results : ",results)

  return results.map(r => r.payload.text);
  } catch (error) {
    console.log("error -> ",error)
  }
}