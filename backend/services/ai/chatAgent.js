
import { generateEmbedding } from '../rag/embedder.js';
import { retrieveRelevantChunks } from '../rag/vectorStore.js';
import { buildChatPrompt } from './promptTemplates.js';

export const generateChatResponse = async (userQuestion, userProfile, selectedPolicy, chatHistory) => {
  const queryEmbedding = await generateEmbedding(userQuestion);
  const retrievedChunks = retrieveRelevantChunks(queryEmbedding, 5, selectedPolicy);
  
  const prompt = buildChatPrompt(userQuestion, userProfile, selectedPolicy, chatHistory, retrievedChunks);
  
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

  const responseText = data.choices[0].message.content.trim();
  
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
