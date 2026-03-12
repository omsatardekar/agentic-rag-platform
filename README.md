# Agentic RAG Platform

A full-stack RAG (Retrieval-Augmented Generation) platform for medical research and general document analysis.

## Project Structure

- `backend/`: Python FastAPI backend with ingestion and query pipelines.
- `frontend/`: Vite-based React frontend with a modern dashboard.

## Features

- Dynamic document ingestion.
- Vector search via Qdrant.
- Interactive admin dashboard for monitoring metrics.
- User management and audit logs.

## Getting Started

### Backend Setup
1. Navigate to `backend/`.
2. Create a virtual environment: `python -m venv venv`.
3. Install dependencies: `pip install -r requirements.txt`.
4. Configure `.env` (use `.env.example` as a template).
5. Run the server: `python run.py`.

### Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Run the dev server: `npm run dev`.
