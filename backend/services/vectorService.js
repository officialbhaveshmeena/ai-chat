import client from "../db/qdrantClient.js";
import { generateEmbedding } from "./embeddingService.js";

export async function storeChunks(chunks, documentId) {

  const points = [];

  for (let i = 0; i < chunks.length; i++) {

    const vector = await generateEmbedding(chunks[i]);
    // i==0 && console.log("i",i," -> ",typeof vector[0].values,vector[0].values)
    points.push({
      id: parseInt(`${documentId}${i}`),
      vector:vector[0].values,
      payload: {
        text: chunks[i],
        documentId
      }
    });


  }
 
  try {


  const upRes = await client.upsert("documents", {
      wait: true, // Wait for the operation to complete
      points: points,
    });
    console.log("Upsert response:", upRes);

    
  } catch (error) {
       console.log("Upsert error:", error);
  }



   

}