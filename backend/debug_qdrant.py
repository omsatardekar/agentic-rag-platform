import os
from qdrant_client import QdrantClient
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "medical_research_v1"

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

try:
    collections = client.get_collections().collections
    print(f"Available collections: {[c.name for c in collections]}")
    
    if COLLECTION_NAME in [c.name for c in collections]:
        info = client.get_collection(COLLECTION_NAME)
        print(f"Collection {COLLECTION_NAME} exists.")
        print(f"Points count: {info.points_count}")
        print(f"Status: {info.status}")
    else:
        print(f"Collection {COLLECTION_NAME} NOT FOUND!")
except Exception as e:
    print(f"Error: {e}")
