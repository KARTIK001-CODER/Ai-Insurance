import { parseDocument } from '../utils/parser.js';
import { chunkText } from '../services/rag/chunker.js';
import { generateEmbedding } from '../services/rag/embedder.js';
import fs from 'fs/promises';

export const uploadPolicy = async (req, res) => {
  try {
    const { policyName, insurer } = req.body;
    
    if (!policyName || !insurer) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'policyName and insurer are required fields.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Policy document file is required.'
      });
    }

    const { path: filePath, mimetype: mimeType } = req.file;

    const extractedText = await parseDocument(filePath, mimeType);
    
    const chunks = chunkText(extractedText);
    const processedChunks = [];

    await Promise.all(
      chunks.map(async (chunk) => {
        try {
          const embedding = await generateEmbedding(chunk);
          processedChunks.push({
            chunkText: chunk,
            embedding,
            policyName,
            insurer
          });
        } catch (embedError) {
          console.error('Embedding failed for a chunk', embedError);
        }
      })
    );

    return res.status(200).json({
      success: true,
      policyName,
      insurer,
      fileType: mimeType,
      processedChunksCount: processedChunks.length,
      sampleChunk: processedChunks[0] || null
    });

  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({
      success: false,
      message: 'Failed to process the document.'
    });
  }
};
