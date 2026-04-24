import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/vectorStore.json');

let store = [];

// Initialize store from file
const initStore = () => {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      store = JSON.parse(data);
      console.log(`[VectorStore] Loaded ${store.length} chunks from persistence.`);
    } else {
      store = [];
      saveStore();
    }
  } catch (error) {
    console.error('[VectorStore] Error initializing store:', error);
    store = [];
  }
};

const saveStore = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (error) {
    console.error('[VectorStore] Error saving store:', error);
  }
};

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
};

export const addDocuments = (chunksWithEmbeddings) => {
  console.log(`[VectorStore] Adding ${chunksWithEmbeddings.length} chunks...`);
  for (const chunk of chunksWithEmbeddings) {
    const id = crypto.randomUUID();
    store.push({
      id,
      embedding: chunk.embedding,
      chunkText: chunk.chunkText,
      policyName: chunk.policyName,
      insurer: chunk.insurer
    });
  }
  saveStore();
};

export const deleteDocuments = (policyName) => {
  console.log(`[VectorStore] Deleting chunks for policy: ${policyName}`);
  const initialLength = store.length;
  store = store.filter(item => item.policyName !== policyName);
  console.log(`[VectorStore] Removed ${initialLength - store.length} chunks.`);
  saveStore();
};

export const updateDocumentsMetadata = (oldPolicyName, newPolicyName, newInsurer) => {
  console.log(`[VectorStore] Updating metadata for policy: ${oldPolicyName}`);
  for (const item of store) {
    if (item.policyName === oldPolicyName) {
      if (newPolicyName) item.policyName = newPolicyName;
      if (newInsurer) item.insurer = newInsurer;
    }
  }
  saveStore();
};

export const retrieveRelevantChunks = (queryEmbedding, topK = 5, filterPolicyName = null) => {
  const results = [];

  for (const item of store) {
    if (filterPolicyName && item.policyName !== filterPolicyName) {
      continue;
    }
    const similarityScore = cosineSimilarity(queryEmbedding, item.embedding);
    results.push({
      chunkText: item.chunkText,
      policyName: item.policyName,
      insurer: item.insurer,
      similarityScore
    });
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);
  const retrieved = results.slice(0, topK);
  console.log(`[VectorStore] Retrieved ${retrieved.length} relevant chunks.`);
  return retrieved;
};

// Run initialization
initStore();

