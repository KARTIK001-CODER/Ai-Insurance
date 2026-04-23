import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding } from '../rag/embedder.js';
import { retrieveRelevantChunks } from '../rag/vectorStore.js';
import { buildRecommendationPrompt } from './promptTemplates.js';

export const generateRecommendation = async (userProfile) => {
  const queryText = `Health insurance for ${userProfile.age} year old, ${userProfile.lifestyle} lifestyle, pre-existing conditions: ${userProfile.preExistingConditions.join(', ')}`;
  
  const queryEmbedding = await generateEmbedding(queryText);
  const retrievedChunks = retrieveRelevantChunks(queryEmbedding, 5);
  
  const prompt = buildRecommendationPrompt(userProfile, retrievedChunks);
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('LLM API key is missing');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  if (responseText.includes("I can help with insurance-related queries, but not medical advice.")) {
    return {
      message: "I can help with insurance-related queries, but not medical advice."
    };
  }

  try {
    let jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(responseText);
  } catch (error) {
    return responseText;
  }
};
