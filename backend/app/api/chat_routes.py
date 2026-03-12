import logging
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import Optional

from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.schemas.chat_schema import ChatRequest
from app.services.rag_pipeline import process_query
from app.database.db import chat_collection
from app.core.config import JWT_SECRET, JWT_ALGORITHM, GUEST_PROMPT_LIMIT


router = APIRouter()
logger = logging.getLogger(__name__)

# --------------------------------
# Token authentication
# --------------------------------
security = HTTPBearer(auto_error=False)

# Guest prompt tracker
guest_prompt_count = {}


# =====================================
# Get Current User from JWT
# =====================================
def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):

    if credentials is None:
        return None

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        return payload

    except JWTError:

        return None


# =====================================
# Chat Query API
# =====================================
@router.post("/query")
def chat_query(
    data: ChatRequest,
    user: Optional[dict] = Depends(get_current_user)
):

    # --------------------------------
    # Identify user
    # --------------------------------
    if user:

        user_id = user.get("user_id")

        role = user.get("role", "user")

    else:

        user_id = "guest"

        role = "guest"

    # --------------------------------
    # Guest Prompt Limit
    # --------------------------------
    if role == "guest":

        guest_prompt_count[user_id] = guest_prompt_count.get(user_id, 0) + 1

        if guest_prompt_count[user_id] > GUEST_PROMPT_LIMIT:

            raise HTTPException(
                status_code=403,
                detail="Guest prompt limit reached. Please login to continue."
            )

    # --------------------------------
    # Process Query via Agentic RAG Pipeline
    # --------------------------------
    try:
        rag_data = process_query(data.message, history=data.history)
        answer = rag_data.get("answer", "")
        sources = rag_data.get("sources", [])
        agent_flow = rag_data.get("agent_flow", "")
    except Exception as e:
        logger.error(f"Agentic Pipeline Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI processing error: {str(e)}"
        )

    # --------------------------------
    # Save Chat History
    # --------------------------------
    chat_record = {
        "user_id": user_id,
        "role": "user",
        "content": data.message,
        "conversation_id": data.conversation_id,
        "timestamp": datetime.utcnow()
    }
    chat_collection.insert_one(chat_record)

    assistant_record = {
        "user_id": user_id,
        "role": "assistant",
        "content": answer,
        "sources": sources,
        "agent_flow": agent_flow,
        "conversation_id": data.conversation_id,
        "timestamp": datetime.utcnow()
    }
    chat_collection.insert_one(assistant_record)

    # --------------------------------
    # Return Response
    # --------------------------------
    return {
        "status": "success",
        "response": answer,
        "sources": sources,
        "agent_flow": agent_flow,
        "user_id": user_id,
        "conversation_id": data.conversation_id,
        "timestamp": datetime.utcnow()
    }