import {PDFParse} from 'pdf-parse'; 
import fs from "fs";
import { chunkText } from "../utils/chunkText.js";
import { storeChunks } from "../services/vectorService.js";

export async function uploadDocument(req, res) {

    // Read the file as a buffer
  const file = fs.readFileSync(req.file.path);
  
  // Convert the Buffer to Uint8Array
  const uint8Array = new Uint8Array(file);

  // Create PDF parser and extract text
  const parser = new PDFParse(uint8Array);

	const data = await parser.getText();

  const chunks = chunkText(data.text);

  const documentId = Date.now();

  await storeChunks(chunks, documentId);

  res.json({
    message: "Document indexed successfully"
  });

}