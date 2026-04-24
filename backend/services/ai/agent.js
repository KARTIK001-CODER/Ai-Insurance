import { generateEmbedding } from '../rag/embedder.js';
import { retrieveRelevantChunks } from '../rag/vectorStore.js';
import { buildRecommendationPrompt } from './promptTemplates.js';

export const generateRecommendation = async (userProfile) => {
  console.log('[Agent] Generating recommendation for:', userProfile.fullName);
  
  // Use a broader query to improve retrieval stability as requested
  const queryText = `health insurance coverage waiting period exclusions ${userProfile.preExistingConditions.join(' ')}`;
  console.log(`[Agent] Retrieval query: "${queryText}"`);
  
  const queryEmbedding = await generateEmbedding(queryText);
  const retrievedChunks = retrieveRelevantChunks(queryEmbedding, 10); // Increased k for better coverage
  
  console.log(`[Agent] Retrieved ${retrievedChunks.length} chunks for context.`);
  
  const prompt = buildRecommendationPrompt(userProfile, retrievedChunks);
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing');
  }

  console.log('[Agent] Calling LLM (llama-3.3-70b-versatile)...');
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
    console.error('[Agent] LLM API Error:', data.error);
    throw new Error(data.error?.message || "Failed to fetch from Groq API");
  }

  const responseText = data.choices[0].message.content;
  console.log('[Agent] LLM Response received.');
  
  if (responseText.includes("I can help with insurance-related queries, but not medical advice.")) {
    return {
      explanation: "I can help with insurance-related queries, but not medical advice.",
      comparisonTable: [],
      coverageDetails: {}
    };
  }

  try {
    let jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.error('[Agent] Error parsing LLM response as JSON:', error);
    // Return a structured error response if JSON parsing fails
    return {
      explanation: "Error parsing recommendation data. Raw response: " + responseText.substring(0, 500),
      comparisonTable: [],
      coverageDetails: {}
    };
  }
};

