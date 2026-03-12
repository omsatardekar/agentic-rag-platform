import os
from qdrant_client import QdrantClient
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = "rag_ai_platform"
COLLECTION_NAME = "medical_research_v1"

qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
mongo = MongoClient(MONGO_URI)
db = mongo[MONGO_DB_NAME]
documents_col = db["documents"]

def sync():
    print(f"Syncing MongoDB with Qdrant collection: {COLLECTION_NAME}")
    
    # 1. Clear old records if user wants accuracy (let's just add missing ones)
    # documents_col.delete_many({}) 
    
    # 2. Scroll through Qdrant to find unique filenames
    offset = None
    seen_filenames = set()
    
    while True:
        results, next_offset = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            limit=100,
            with_payload=True,
            offset=offset
        )
        
        for point in results:
            filename = point.payload.get("filename")
            if filename and filename not in seen_filenames:
                seen_filenames.add(filename)
                
                # Check if already in Mongo
                if not documents_col.find_one({"filename": filename}):
                    print(f"Adding legacy document: {filename}")
                    documents_col.insert_one({
                        "id": str(point.id),
                        "filename": filename,
                        "type": point.payload.get("type", "Document"),
                        "upload_at": datetime.utcnow().isoformat(),
                        "status": "Indexed",
                        "size": point.payload.get("size", 0),
                        "chunks": "Synced from Cluster"
                    })
        
        offset = next_offset
        if not offset:
            break
            
    print("Sync complete.")

if __name__ == "__main__":
    sync()
