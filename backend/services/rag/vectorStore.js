import crypto from 'crypto';

const store = [];

const cosineSimilarity = (vecA, vecB) => {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
};

export const addDocuments = (chunksWithEmbeddings) => {
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
};

export const deleteDocuments = (policyName) => {
  for (let i = store.length - 1; i >= 0; i--) {
    if (store[i].policyName === policyName) {
      store.splice(i, 1);
    }
  }
};

export const retrieveRelevantChunks = (queryEmbedding, topK = 5) => {
  const results = [];

  for (const item of store) {
    const similarityScore = cosineSimilarity(queryEmbedding, item.embedding);
    results.push({
      chunkText: item.chunkText,
      policyName: item.policyName,
      insurer: item.insurer,
      similarityScore
    });
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);
  return results.slice(0, topK);
};
