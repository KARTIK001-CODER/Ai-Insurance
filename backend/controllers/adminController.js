import { parseDocument } from '../utils/parser.js';
import { chunkText } from '../services/rag/chunker.js';
import { generateEmbedding } from '../services/rag/embedder.js';
import { addDocuments, deleteDocuments, retrieveRelevantChunks, updateDocumentsMetadata } from '../services/rag/vectorStore.js';
import fs from 'fs/promises';
import crypto from 'crypto';

const policiesMetadata = [];

export const uploadPolicy = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    
    const { policyName, insurer } = req.body;
    
    if (!policyName || !insurer) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: 'policyName and insurer are required fields.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Policy document file is required.' });
    }

    const existingPolicy = policiesMetadata.find(p => p.policyName === policyName);
    if (existingPolicy) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: 'A policy with this name already exists.' });
    }

    const { path: filePath, mimetype: mimeType } = req.file;
    let extractedText;
    
    try {
      extractedText = await parseDocument(filePath, mimeType);
    } catch (parseError) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: 'Failed to parse document.' });
    }

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
          // ignore embedding errors for individual chunks
        }
      })
    );

    addDocuments(processedChunks);

    const newPolicy = {
      id: crypto.randomUUID(),
      policyName,
      insurer,
      fileType: mimeType,
      uploadDate: new Date().toISOString()
    };
    policiesMetadata.push(newPolicy);

    // Keep the file in the uploads folder on success
    // if (req.file) await fs.unlink(req.file.path).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Policy uploaded and processed successfully.',
      data: newPolicy
    });

  } catch (error) {
    if (req.file && req.file.path) await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({ success: false, message: 'Failed to process the document.' });
  }
};

export const getAllPolicies = (req, res) => {
  return res.status(200).json({
    success: true,
    data: policiesMetadata
  });
};

export const updatePolicy = (req, res) => {
  try {
    const { id } = req.params;
    const { policyName, insurer } = req.body;

    const policyIndex = policiesMetadata.findIndex(p => p.id === id);
    if (policyIndex === -1) {
      return res.status(404).json({ success: false, message: 'Policy not found.' });
    }

    const oldPolicyName = policiesMetadata[policyIndex].policyName;

    if (policyName && policyName !== oldPolicyName) {
      const nameExists = policiesMetadata.some(p => p.policyName === policyName && p.id !== id);
      if (nameExists) {
        return res.status(400).json({ success: false, message: 'Another policy with this name already exists.' });
      }
    }

    if (policyName) policiesMetadata[policyIndex].policyName = policyName;
    if (insurer) policiesMetadata[policyIndex].insurer = insurer;

    updateDocumentsMetadata(oldPolicyName, policyName, insurer);

    return res.status(200).json({
      success: true,
      message: 'Policy metadata updated successfully.',
      data: policiesMetadata[policyIndex]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update policy.' });
  }
};

export const deletePolicy = (req, res) => {
  try {
    const { id } = req.params;
    
    const policyIndex = policiesMetadata.findIndex(p => p.id === id);
    if (policyIndex === -1) {
      return res.status(404).json({ success: false, message: 'Policy not found.' });
    }

    const policyName = policiesMetadata[policyIndex].policyName;
    
    deleteDocuments(policyName);
    policiesMetadata.splice(policyIndex, 1);

    return res.status(200).json({ success: true, message: 'Policy deleted successfully.' });
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
