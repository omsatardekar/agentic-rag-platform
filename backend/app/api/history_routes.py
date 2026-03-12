from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime

from app.database.db import chat_collection
from app.database.models import chat_model
from app.core.config import JWT_SECRET, JWT_ALGORITHM


router = APIRouter()
security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("user_id")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# =====================================
# Get All Conversations for a User
# =====================================
@router.get("/conversations")
def get_conversations(user_id: str = Depends(get_current_user_id)):
    try:
        # Get unique conversation_ids
        pipeline = [
            {"$match": {"user_id": user_id, "role": "user"}},
            {"$sort": {"timestamp": 1}},
            {"$group": {
                "_id": "$conversation_id",
                "title": {"$first": "$content"},
                "last_active": {"$last": "$timestamp"}
            }},
            {"$sort": {"last_active": -1}}
        ]
        
        conversations = list(chat_collection.aggregate(pipeline))
        
        return {
            "status": "success",
            "conversations": [
                {
                    "id": conv["_id"],
                    "title": conv["title"][:40] + ("..." if conv["title"] and len(conv["title"]) > 40 else "New Chat"),
                    "last_active": conv["last_active"]
                }
                for conv in conversations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =====================================
# Get Messages for a specific Conversation
# =====================================
@router.get("/messages/{conversation_id}")
def get_messages(conversation_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        messages_cursor = chat_collection.find(
            {"user_id": user_id, "conversation_id": conversation_id}
        ).sort("timestamp", 1)
        
        history = []
        for msg in messages_cursor:
            history.append({
                "role": msg.get("role"),
                "content": msg.get("content"),
                "sources": msg.get("sources", []),
                "agent_flow": msg.get("agent_flow", "")
            })
            
        return {
            "status": "success",
            "conversation_id": conversation_id,
            "messages": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
