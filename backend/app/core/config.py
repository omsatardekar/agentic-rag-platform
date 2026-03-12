import os
from dotenv import load_dotenv

load_dotenv()

# =====================================
# AI API KEYS
# =====================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


# =====================================
# VECTOR DATABASE
# =====================================

QDRANT_URL = os.getenv("QDRANT_URL")

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "documents")


# =====================================
# MONGODB
# =====================================

MONGO_URI = os.getenv("MONGO_URI")

MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "rag_ai_platform")


# =====================================
# AUTHENTICATION
# =====================================

JWT_SECRET = os.getenv("JWT_SECRET")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


# =====================================
# APPLICATION
# =====================================

APP_NAME = os.getenv("APP_NAME")

APP_VERSION = os.getenv("APP_VERSION")


# =====================================
# RAG SETTINGS
# =====================================

VECTOR_DIMENSION = int(os.getenv("VECTOR_DIMENSION", 1024))

SEARCH_TOP_K = int(os.getenv("SEARCH_TOP_K", 5))

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 800))

CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 150))


# =====================================
# DEMO SETTINGS
# =====================================

GUEST_PROMPT_LIMIT = int(os.getenv("GUEST_PROMPT_LIMIT", 5))


# =====================================
# FILE STORAGE
# =====================================

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)