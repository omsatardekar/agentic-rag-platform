import os
from qdrant_client import QdrantClient
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "medical_research_v1"

qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

results, _ = qdrant.scroll(collection_name=COLLECTION_NAME, limit=5, with_payload=True)
for p in results:
    print(p.payload)
