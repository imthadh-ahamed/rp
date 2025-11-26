# Agentic RAG Backend

This is the backend for the Agentic RAG system, built with FastAPI.

## Structure

- `api/`: FastAPI routes and schemas
- `core/`: Core business logic (Agents, RAG, Services)
- `llm/`: LLM client wrappers
- `vectorstore/`: Vector database connectors
- `data/`: Knowledge base storage
- `workers/`: Background workers
- `utils/`: Utility functions

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   uvicorn api.main:app --reload
   ```
