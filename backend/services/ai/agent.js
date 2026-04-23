
import { generateEmbedding } from '../rag/embedder.js';
import { retrieveRelevantChunks } from '../rag/vectorStore.js';
import { buildRecommendationPrompt } from './promptTemplates.js';

export const generateRecommendation = async (userProfile) => {
  const queryText = `Health insurance for ${userProfile.age} year old, ${userProfile.lifestyle} lifestyle, pre-existing conditions: ${userProfile.preExistingConditions.join(', ')}`;
  
  const queryEmbedding = await generateEmbedding(queryText);
  const retrievedChunks = retrieveRelevantChunks(queryEmbedding, 5);
  
  const prompt = buildRecommendationPrompt(userProfile, retrievedChunks);
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing');
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to fetch from Groq API");
  }

  const responseText = data.choices[0].message.content;
  
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
