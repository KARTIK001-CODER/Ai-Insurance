import { parseDocument } from '../utils/parser.js';
import { chunkText } from '../services/rag/chunker.js';
import { generateEmbedding } from '../services/rag/embedder.js';
import { addDocuments, deleteDocuments, retrieveRelevantChunks } from '../services/rag/vectorStore.js';
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
        } catch (embedError) {}
      })
    );

    addDocuments(processedChunks);

    return res.status(200).json({
      success: true,
      policyName,
      insurer,
      fileType: mimeType,
      processedChunksCount: processedChunks.length
    });

  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({
      success: false,
      message: 'Failed to process the document.'
    });
  }
};

export const deletePolicy = (req, res) => {
  try {
    const { policyName } = req.params;
    if (!policyName) {
      return res.status(400).json({ success: false, message: 'policyName is required.' });
    }
    deleteDocuments(policyName);
    return res.status(200).json({ success: true, message: 'Policy documents deleted from vector store.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete policy.' });
  }
};

export const queryPolicy = async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query string is required.' });
    }

    const queryEmbedding = await generateEmbedding(query);
    const results = retrieveRelevantChunks(queryEmbedding, topK);

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Query processing failed.' });
  }
};
