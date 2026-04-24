import { generateEmbedding } from '../rag/embedder.js';
import { retrieveRelevantChunks } from '../rag/vectorStore.js';
import { buildChatPrompt } from './promptTemplates.js';

export const generateChatResponse = async (userQuestion, userProfile, selectedPolicy, chatHistory) => {
  console.log('[ChatAgent] Generating response for question:', userQuestion);
  
  // Check if the user is asking about other policies or general comparison
  const lowerQuestion = userQuestion.toLowerCase();
  const isAskingAboutOthers = lowerQuestion.includes('other') || 
                               lowerQuestion.includes('compare') || 
                               lowerQuestion.includes('difference') || 
                               lowerQuestion.includes('all policies') ||
                               lowerQuestion.includes('alternatives');

  // If asking about others, remove the filter to allow RAG to find other policies
  const filterPolicy = isAskingAboutOthers ? null : selectedPolicy;
  
  if (isAskingAboutOthers) {
    console.log('[ChatAgent] Detected query about other policies. Removing strict policy filter.');
  }

  const queryEmbedding = await generateEmbedding(userQuestion);
  // Increase topK to 10 for better coverage when comparing or looking for others
  const retrievedChunks = retrieveRelevantChunks(queryEmbedding, 10, filterPolicy);
  
  console.log(`[ChatAgent] Retrieved ${retrievedChunks.length} chunks for chat context.`);
  
  const prompt = buildChatPrompt(userQuestion, userProfile, selectedPolicy, chatHistory, retrievedChunks);
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing');
  }

  console.log('[ChatAgent] Calling LLM...');
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
    console.error('[ChatAgent] LLM API Error:', data.error);
    throw new Error(data.error?.message || "Failed to fetch from Groq API");
  }

  const responseText = data.choices[0].message.content.trim();
  console.log('[ChatAgent] LLM Response received.');
  
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


