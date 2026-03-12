import os
import shutil
import logging
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from bson import ObjectId

from app.ingestion.document_processor import process_file
from app.ingestion.vector_database import vector_db
from app.database.db import documents_collection, chat_collection, users_collection
from app.core.config import UPLOAD_DIR
from app.core.security import hash_password
from app.schemas.auth_schema import SignupSchema

router = APIRouter()
logger = logging.getLogger(__name__)

# =====================================
# ADMIN FILE UPLOAD (MULTI-STEP)
# =====================================

@router.post("/extract")
async def extract_only(file: UploadFile = File(...)):
    """
    Step 1: Save file and return extracted text for admin review.
    """
    try:
        file_id = str(uuid.uuid4())
        filename = file.filename
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text, file_type = process_file(file_path, filename)

        if not text:
            if os.path.exists(file_path): os.remove(file_path)
            raise HTTPException(status_code=400, detail="No readable text found in document.")

        return {
            "status": "success",
            "file_id": file_id,
            "filename": filename,
            "file_type": file_type,
            "file_path": file_path,
            "extracted_text": text,
            "size": os.path.getsize(file_path)
        }
    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import BackgroundTasks

def run_background_ingest(text: str, metadata: dict, file_path: str):
    """
    Heavy task run outside the main request/response loop.
    """
    try:
        chunks, status_info = vector_db.ingest_document(text, metadata)
        
        if chunks > 0:
            # Save to MongoDB
            doc_record = {
                **metadata,
                "status": "Indexed",
                "path": file_path,
                "chunks": chunks
            }
            documents_collection.insert_one(doc_record)
            logger.info(f"Background Ingestion for {metadata['filename']} successful: {chunks} chunks.")
        else:
            logger.error(f"Background Ingestion for {metadata['filename']} failed: {status_info}")
    except Exception as e:
        logger.error(f"Background process error: {e}")

@router.post("/confirm-ingest")
async def confirm_ingest(data: dict, background_tasks: BackgroundTasks):
    """
    Step 2: Take edited text and perform vector ingestion in background.
    """
    try:
        text = data.get("text")
        filename = data.get("filename")
        file_id = data.get("file_id")
        file_type = data.get("file_type")
        file_path = data.get("file_path")
        size = data.get("size", 0)

        if not text or not filename:
            raise HTTPException(status_code=400, detail="Missing required data")

        metadata = {
            "id": file_id,
            "filename": filename,
            "type": file_type,
            "upload_at": datetime.now(timezone.utc).isoformat(),
            "size": size
        }

        # Run process in background to avoid Render timeout
        background_tasks.add_task(run_background_ingest, text, metadata, file_path)

        return {
            "status": "success",
            "message": "Ingestion started in background. The dashboard will update shortly.",
            "filename": filename
        }
    except Exception as e:
        logger.error(f"Ingestion trigger failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =====================================
# ADMIN FILE UPLOAD (LEGACY)
# =====================================
@router.post("/upload")
async def upload_file(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """
    Legacy endpoint: performs extraction synchronously but ingestion in background.
    """
    try:
        file_id = str(uuid.uuid4())
        filename = file.filename
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            text, file_type = process_file(file_path, filename)
        except Exception as e:
            if os.path.exists(file_path): os.remove(file_path)
            raise HTTPException(status_code=400, detail=f"Parsing failed: {str(e)}")

        if not text:
            if os.path.exists(file_path): os.remove(file_path)
            raise HTTPException(status_code=400, detail="No readable text found in document.")

        metadata = {
            "id": file_id,
            "filename": filename,
            "type": file_type,
            "upload_at": datetime.now(timezone.utc).isoformat(),
            "size": os.path.getsize(file_path)
        }

        # Background Task
        background_tasks.add_task(run_background_ingest, text, metadata, file_path)

        return {
            "status": "success",
            "message": "Upload complete. Ingestion started in background.",
            "filename": filename
        }

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =====================================
# LIST DOCUMENTS
# =====================================
@router.get("/documents")
async def list_documents():
    """
    Returns real documents from MongoDB
    """
    try:
        cursor = documents_collection.find().sort("upload_at", -1)
        docs = []
        for doc in cursor:
            docs.append({
                "id": str(doc.get("id")),
                "name": doc.get("filename"),
                "type": doc.get("type"),
                "status": doc.get("status", "Indexed"),
                "uploaded": doc.get("upload_at")
            })
        return {"status": "success", "documents": docs}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# =====================================
# DELETE DOCUMENT
# =====================================
@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """
    Removes from Local Storage, Qdrant, and Mongo
    """
    try:
        doc = documents_collection.find_one({"id": doc_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        # 1. Delete from storage
        path = doc.get("path")
        if path and os.path.exists(path):
            os.remove(path)

        # 2. Delete from Vector DB
        vector_db.delete_document(doc.get("filename"))

        # 3. Delete from Mongo
        documents_collection.delete_one({"id": doc_id})

        return {"status": "success", "message": "Document removed from knowledge base"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# =====================================
# SYSTEM ANALYTICS
# =====================================
@router.get("/stats")
async def get_stats():
    """
    Returns real-time analytics for the admin dashboard
    """
    try:
        # 1. Total Vectors from Qdrant
        try:
            collection_info = vector_db.client.get_collection(collection_name=vector_db.COLLECTION_NAME)
            vector_count = collection_info.points_count
        except:
            vector_count = 0
        
        # 2. Total Queries from MongoDB (User messages)
        query_count = chat_collection.count_documents({"role": "user"})
        
        # 3. Knowledge Base Size from MongoDB
        pipeline = [{"$group": {"_id": None, "totalSize": {"$sum": "$size"}}}]
        size_result = list(documents_collection.aggregate(pipeline))
        total_size_bytes = size_result[0]["totalSize"] if size_result else 0
        
        # Calculate dynamic trends (last 30 days vs previous 30 days)
        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)
        
        recent_queries = chat_collection.count_documents({"role": "user", "timestamp": {"$gte": thirty_days_ago}})
        old_queries = chat_collection.count_documents({"role": "user", "timestamp": {"$gte": sixty_days_ago, "$lt": thirty_days_ago}})
        query_trend = f"+{int(((recent_queries - old_queries) / max(old_queries, 1)) * 100)}%" if recent_queries >= old_queries else f"{int(((recent_queries - old_queries) / max(old_queries, 1)) * 100)}%"
        
        recent_docs = list(documents_collection.find({"upload_at": {"$gte": thirty_days_ago.isoformat()}}))
        old_docs = list(documents_collection.find({"upload_at": {"$gte": sixty_days_ago.isoformat(), "$lt": thirty_days_ago.isoformat()}}))
        
        recent_vectors = sum([d.get("chunks", 0) for d in recent_docs])
        old_vectors = sum([d.get("chunks", 0) for d in old_docs])
        vector_trend = f"+{int(((recent_vectors - old_vectors) / max(old_vectors, 1)) * 100)}%" if recent_vectors >= old_vectors else f"{int(((recent_vectors - old_vectors) / max(old_vectors, 1)) * 100)}%"
        
        recent_size = sum([d.get("size", 0) for d in recent_docs])
        old_size = sum([d.get("size", 0) for d in old_docs])
        size_trend = f"+{int(((recent_size - old_size) / max(old_size, 1)) * 100)}%" if recent_size >= old_size else f"{int(((recent_size - old_size) / max(old_size, 1)) * 100)}%"
        
        # Pretty format size
        if total_size_bytes < 1024:
            size_str = f"{total_size_bytes} B"
        elif total_size_bytes < 1024**2:
            size_str = f"{total_size_bytes/1024:.1f} KB"
        elif total_size_bytes < 1024**3:
            size_str = f"{total_size_bytes/1024**2:.1f} MB"
        else:
            size_str = f"{total_size_bytes/1024**3:.1f} GB"

        # 4. Recent Activity (Audit Logs)
        recent_docs = list(documents_collection.find().sort("upload_at", -1).limit(3))
        activities = []
        for d in recent_docs:
            activities.append({
                "label": f"Document Indexed: {d.get('filename')}",
                "sub": f"Chunks: {d.get('chunks', 0)} | Vectorized via Voyage",
                "time": d.get("upload_at"), # Frontend will format this
                "status": "Success"
            })

        # 5. Storage Efficiency (Dynamic based on data points vs size)
        # Assuming 1 vector per ~1KB of text is "standard"
        if total_size_bytes > 0:
            eff_val = 100 - min(95, (vector_count / (total_size_bytes/1024)) * 5)
            efficiency_str = f"{eff_val:.1f}%"
        else:
            efficiency_str = "0%"

        # 6. Chart Data (Last 7 Days Embedding Progress)
        chart_data = []
        for i in range(6, -1, -1):
            day_target = now - timedelta(days=i)
            start_date_str = datetime(day_target.year, day_target.month, day_target.day, tzinfo=timezone.utc).isoformat()
            end_date_str = (datetime(day_target.year, day_target.month, day_target.day, tzinfo=timezone.utc) + timedelta(days=1)).isoformat()
            
            day_docs = list(documents_collection.find({
                "upload_at": {"$gte": start_date_str, "$lt": end_date_str}
            }))
            day_vectors = sum([d.get("chunks", 0) for d in day_docs])
            chart_data.append({
                "date": day_target.strftime("%b %d"),
                "vectors": day_vectors
            })

        return {
            "status": "success",
            "stats": {
                "total_vectors": f"{vector_count:,}",
                "total_queries": f"{query_count:,}",
                "kb_size": size_str,
                "efficiency": efficiency_str,
                "runtime": "99.9%"
            },
            "trends": {
                "vectors": vector_trend,
                "queries": query_trend,
                "size": size_trend
            },
            "recent_activities": activities,
            "chart_data": chart_data
        }
    except Exception as e:
        logger.error(f"Stats fetch failed: {e}")
        return {"status": "error", "message": str(e)}

# =====================================
# AD-HOC VECTOR SEARCH (DASHBOARD)
# =====================================
@router.post("/search")
async def admin_verify_search(data: dict):
    """
    Search endpoint specifically for Admin to verify points
    """
    query = data.get("query")
    if not query:
        return {"status": "error", "message": "No query provided"}
        
    try:
        from app.services.embedding_service import create_embedding
        vector = create_embedding(query)
        hits = vector_db.search_vector(vector, limit=5, collection_name=vector_db.COLLECTION_NAME)
        
        results = []
        for h in hits:
            # Safely handle potentially large text
            full_text = h.payload.get("chunk_text") or h.payload.get("text", "")
            snippet = full_text[:200] + "..." if len(full_text) > 200 else full_text
            
            results.append({
                "text": snippet,
                "filename": h.payload.get("filename", "System Knowledge"),
                "score": f"{h.score:.4f}"
            })
            
        return {"status": "success", "results": results}
    except Exception as e:
        logger.error(f"Admin Search Error: {e}")
        return {"status": "error", "message": str(e)}

# =====================================
# USER MANAGEMENT
# =====================================
@router.get("/users")
async def list_users():
    try:
        cursor = users_collection.find().sort("created_at", -1)
        users = []
        for u in cursor:
            # Handle possible missing 'created_at' cleanly
            created_val = u.get("created_at", datetime.now(timezone.utc))
            if hasattr(created_val, "isoformat"):
                created_str = created_val.isoformat()
            else:
                created_str = str(created_val)
                
            users.append({
                "id": str(u.get("_id")),
                "email": u.get("email"),
                "role": u.get("role"),
                "created_at": created_str,
                "auth_provider": u.get("auth_provider", "local")
            })
        return {"status": "success", "users": users}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    try:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"status": "success", "message": "User deleted successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/users/admin")
async def create_admin(user: SignupSchema):
    try:
        user_exists = users_collection.find_one({"email": user.email})
        if user_exists:
            raise HTTPException(status_code=400, detail="User already exists")
        
        new_user = {
            "email": user.email,
            "password": hash_password(user.password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
            "auth_provider": "local"
        }
        users_collection.insert_one(new_user)
        return {"status": "success", "message": "Admin user created successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        return {"status": "error", "message": str(e)}
