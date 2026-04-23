# AI Insurance Platform

A complete, locally-deployable AI-powered health insurance recommendation platform with an integrated RAG (Retrieval-Augmented Generation) chat system and an Admin panel.

## Architecture

This project has been completely refactored to rely entirely on free, local, and reproducible tools—meaning zero reliance on paid APIs like Gemini or OpenAI.

### 1. Embeddings (100% Local)
- Uses **Hugging Face Transformers.js (`@xenova/transformers`)**.
- Employs the `Xenova/all-MiniLM-L6-v2` lightweight model.
- Vector embeddings run completely locally in Node.js. No external embedding APIs are called.

### 2. LLM Generation (Free / Reproducible Endpoint)
- Replaced the Gemini SDK with standard REST API calls.
- The default configuration uses the **Groq API**, which provides a lightning-fast, free endpoint for open-source models like `llama3-8b-8192`.
- You can easily swap this endpoint out for any other OpenAI-compatible REST API (e.g., local LM Studio, Ollama, or xAI Grok).

### 3. Vector Database
- In-memory vector store built from scratch with exact Cosine Similarity calculations to maintain complete transparency.

## Project Structure
- `backend/`: Express server, RAG orchestration (`agent.js`, `chatAgent.js`), Local Embedding (`embedder.js`), and Admin routes.
- `frontend/`: React app with Vite containing the User Form, Chat Interface, Recommendation Page, and Admin Panel.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Rename `.env.example` to `.env` and fill in your free API key (e.g. `GROQ_API_KEY=gsk_xxx`) and set your Admin Credentials.
4. `npm start` or `node server.js`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Features
- **AI Recommendation Engine**: Recommends the best policies in structured JSON dynamically based on age, conditions, and parsed local PDFs/Text.
- **AI Policy Explainer Chat**: A context-aware chat interface using RAG to answer queries without hallucinations.
- **Admin Document Manager**: Upload, Delete, and Update raw policy text files and have them instantly chunked and embedded via local transformers.
