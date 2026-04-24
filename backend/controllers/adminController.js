import { parseDocument } from '../utils/parser.js';
import { chunkText } from '../services/rag/chunker.js';
import { generateEmbedding } from '../services/rag/embedder.js';
import { addDocuments, deleteDocuments, retrieveRelevantChunks, updateDocumentsMetadata } from '../services/rag/vectorStore.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POLICIES_FILE = path.join(__dirname, '../../data/policies.json');

let policiesMetadata = [];

// Initialize policies metadata from file
const initPolicies = () => {
  try {
    const dataDir = path.dirname(POLICIES_FILE);
    if (!fsSync.existsSync(dataDir)) {
      fsSync.mkdirSync(dataDir, { recursive: true });
    }
    if (fsSync.existsSync(POLICIES_FILE)) {
      const data = fsSync.readFileSync(POLICIES_FILE, 'utf8');
      policiesMetadata = JSON.parse(data);
      console.log(`[AdminController] Loaded ${policiesMetadata.length} policies from persistence.`);
    }
  } catch (error) {
    console.error('[AdminController] Error initializing policies:', error);
    policiesMetadata = [];
  }
};

const savePolicies = async () => {
  try {
    await fs.writeFile(POLICIES_FILE, JSON.stringify(policiesMetadata, null, 2), 'utf8');
  } catch (error) {
    console.error('[AdminController] Error saving policies:', error);
  }
};

initPolicies();

export const uploadPolicy = async (req, res) => {
  try {
    console.log("[AdminController] Uploading policy...");
    
    const policyName = req.body.policyName?.trim();
    const insurer = req.body.insurer?.trim();
    
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
    
    console.log("[AdminController] Starting document parsing...");
    try {
      extractedText = await parseDocument(filePath, mimeType);
      console.log("[AdminController] Document parsed successfully.");
    } catch (parseError) {
      console.error("[AdminController] Parse Error:", parseError);
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: 'Failed to parse document: ' + parseError.message });
    }

    if (!extractedText || typeof extractedText !== 'string' || extractedText.trim().length === 0) {
      console.error("[AdminController] No valid text extracted from document.");
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: 'No readable text could be extracted from this document.' });
    }


    console.log("[AdminController] Chunking and embedding text...");
    const chunks = chunkText(extractedText);
    const processedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      try {
        const chunk = chunks[i];
        const embedding = await generateEmbedding(chunk);
        processedChunks.push({
          chunkText: chunk,
          embedding,
          policyName,
          insurer
        });
      } catch (embedError) {
        console.error(`[AdminController] Error embedding chunk ${i}:`, embedError);
      }
    }

    addDocuments(processedChunks);

    const newPolicy = {
      id: crypto.randomUUID(),
      policyName,
      insurer,
      fileType: mimeType,
      uploadDate: new Date().toISOString()
    };
    policiesMetadata.push(newPolicy);
    await savePolicies();

    console.log(`[AdminController] Policy "${policyName}" uploaded and indexed.`);

    return res.status(200).json({
      success: true,
      message: 'Policy uploaded and processed successfully.',
      data: newPolicy
    });

  } catch (error) {
    console.error('[AdminController] Upload failed:', error);
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

export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policyName = req.body.policyName?.trim();
    const insurer = req.body.insurer?.trim();

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
    await savePolicies();

    return res.status(200).json({
      success: true,
      message: 'Policy metadata updated successfully.',
      data: policiesMetadata[policyIndex]
    });
  } catch (error) {
    console.error('[AdminController] Update failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to update policy.' });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const policyIndex = policiesMetadata.findIndex(p => p.id === id);
    if (policyIndex === -1) {
      return res.status(404).json({ success: false, message: 'Policy not found.' });
    }

    const policyName = policiesMetadata[policyIndex].policyName;
    
    deleteDocuments(policyName);
    policiesMetadata.splice(policyIndex, 1);
    await savePolicies();

    console.log(`[AdminController] Policy "${policyName}" deleted.`);

    return res.status(200).json({ success: true, message: 'Policy deleted successfully.' });
  } catch (error) {
    console.error('[AdminController] Delete failed:', error);
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
    console.error('[AdminController] Query failed:', error);
    return res.status(500).json({ success: false, message: 'Query processing failed.' });
  }
};

