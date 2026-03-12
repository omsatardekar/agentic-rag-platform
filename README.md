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

## Deployment

This platform is ready for deployment on **Render**.

### Automatic Deployment (Render Blueprint)
1. Push this code to your GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New** -> **Blueprint**.
4. Connect this repository.
5. Render will automatically detect the `render.yaml` file and set up:
   - **Backend**: Python FastAPI service.
   - **Frontend**: React Static site.

### Environment Variables
You will need to set the following in the Render Dashboard (or via the Blueprint prompt):
- `MONGO_URI`: Your MongoDB Atlas connection string (Free tier works great).
- `GROQ_API_KEY`: Your Groq API key.
- `VOYAGE_API_KEY`: Your Voyage AI API key.
- `TAVILY_API_KEY`: Your Tavily API key.
- `QDRANT_URL` & `QDRANT_API_KEY`: Your Qdrant Cloud credentials.

### Note on Storage
The free tier on Render uses ephemeral storage. Uploaded documents will be processed and indexed into Qdrant/MongoDB, but the physical files in `uploads/` will not persist across restarts. For production, consider using AWS S3.