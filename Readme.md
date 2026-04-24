# AI-Powered Insurance Recommendation Platform

---

## Project Overview

This project is a Full-Stack AI-Powered Health Insurance Recommendation Platform designed to help users make informed insurance decisions with clarity and confidence.

It leverages a Retrieval-Augmented Generation (RAG) pipeline to provide personalized, explainable, and document-grounded policy recommendations based on user profiles.

The system is built to run fully locally, ensuring reproducibility, low latency, and zero dependency on external embedding services.

---

## Problem Statement

Choosing the right health insurance policy is difficult due to:

* Complex terminology (waiting period, co-pay, exclusions)
* Lack of personalization in existing platforms
* Hidden clauses for pre-existing conditions
* Overemphasis on price rather than suitability

This platform addresses these issues by:

* Providing personalized recommendations
* Explaining policy trade-offs clearly
* Grounding all outputs in actual policy documents

---

## Features

### 1. Personalized Recommendation Engine

* Accepts user profile:

  * Age
  * Lifestyle
  * Pre-existing conditions
  * Income band
  * City tier
* Generates structured recommendations:

  * Peer comparison table
  * Coverage details
  * Personalized explanation

---

### 2. Retrieval-Augmented Generation (RAG)

* Policy documents are:

  * Uploaded via admin panel
  * Parsed and chunked
  * Converted into embeddings
* Relevant chunks are retrieved using cosine similarity
* LLM generates responses grounded in retrieved data

---

### 3. AI Chat Assistant

* Context-aware and profile-aware
* Explains insurance terms in simple language
* Provides personalized examples
* Maintains conversation context

---

### 4. Admin Panel

* Upload policy documents (TXT/PDF/JSON)
* Delete policies
* Automatically updates vector store

---

### 5. Landing Page

* Entry point for the application
* Redirects to:

  * User recommendation flow
  * Admin panel

---

## Tech Stack

### Frontend

* React
* React Router

### Backend

* Node.js
* Express.js

### AI / RAG

* @xenova/transformers (local embeddings)
* all-MiniLM-L6-v2 model
* Custom in-memory vector store
* Cosine similarity search

### Persistence

* JSON-based storage (`vectorStore.json`) using Node.js fs module

### LLM

* Groq API (or any configured free LLM)

---

## System Architecture

```
User Input → Backend → Embed Query → Vector Store Search
                                      ↓
                          Retrieved Policy Chunks
                                      ↓
                                  LLM
                                      ↓
                         Structured Recommendation
```

---

## How It Works

1. Admin uploads policy documents

2. Documents are:

   * Parsed
   * Chunked
   * Embedded
   * Stored in vector database

3. User submits profile

4. System:

   * Generates query
   * Retrieves relevant chunks
   * Evaluates policies
   * Generates structured output

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd project-folder
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
ADMIN_USER=admin
ADMIN_PASS=1234
GROQ_API_KEY=your_api_key_here
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Upload Sample Policies

* Go to Admin Panel
* Upload policy documents (TXT/PDF/JSON)
* System will automatically process and store embeddings

---

## Key Design Decisions

### Local Embeddings

* Eliminates dependency on external APIs
* Ensures reproducibility
* Reduces cost

---

### Custom Vector Store

* Implemented using JSON + in-memory array
* Uses cosine similarity for retrieval
* Demonstrates core vector search logic

---

### No Strict Filtering

* Policies are not rejected based on conditions
* Instead, trade-offs are explained

---

### Explainability First

* AI responses are:

  * Grounded in documents
  * Personalized
  * Easy to understand

---

## Limitations

* Uses static policy documents (no real-time insurer APIs)
* Basic admin authentication
* No payment integration
* Not optimized for very large datasets

---

## Future Improvements

* Integration with real insurance APIs
* Advanced filtering and ranking models
* Database-backed vector storage
* Mobile application
* Enhanced UI/UX

---

## Demo Flow

1. Open landing page

2. Go to “Get Recommendation”

3. Fill user profile

4. View:

   * Comparison table
   * Coverage details
   * Explanation

5. Use chat for follow-up questions

6. Go to Admin Panel

7. Upload or delete policies

---

## Conclusion

This platform demonstrates how AI can be used to simplify complex decision-making by combining:

* Retrieval-based reasoning
* Structured outputs
* Human-friendly explanations

It focuses on clarity, trust, and usability, helping users make informed insurance choices.

---