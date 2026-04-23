import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding } from '../rag/embedder.js';
import { retrieveRelevantChunks } from '../rag/vectorStore.js';
import { buildChatPrompt } from './promptTemplates.js';

export const generateChatResponse = async (userQuestion, userProfile, selectedPolicy, chatHistory) => {
  const queryEmbedding = await generateEmbedding(userQuestion);
  const retrievedChunks = retrieveRelevantChunks(queryEmbedding, 5, selectedPolicy);
  
  const prompt = buildChatPrompt(userQuestion, userProfile, selectedPolicy, chatHistory, retrievedChunks);
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('LLM API key is missing');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  
  if (responseText === "I can help with insurance-related queries, but not medical advice.") {
    return {
      text: responseText,
      sources: []
    };
  }

  const sources = retrievedChunks.map((chunk, index) => ({
    id: index + 1,
    policyName: chunk.policyName,
    insurer: chunk.insurer,
    snippet: chunk.chunkText.substring(0, 100) + '...'
  }));

  return {
    text: responseText,
    sources
  };
};
