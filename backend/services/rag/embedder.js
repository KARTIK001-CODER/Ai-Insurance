import { pipeline } from '@xenova/transformers';

let embedderPromise = null;

const getEmbedder = async () => {
  if (!embedderPromise) {
    console.log('[Embedder] Initializing model: Xenova/all-MiniLM-L6-v2...');
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedderPromise;
};


export const generateEmbedding = async (text) => {
  console.log(`[Embedder] Generating embedding for text (length: ${text.length})...`);
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);
  console.log(`[Embedder] Generated embedding of length ${embedding.length}.`);
  return embedding;
};

