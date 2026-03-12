from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# --------------------------------
# Chat Request Schema
# --------------------------------
class ChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User input message"
    )

    conversation_id: Optional[str] = Field(
        default=None,
        description="Conversation ID for multi-turn chat"
    )

    history: Optional[List[dict]] = Field(
        default=[],
        description="Previous chat messages for context"
    )


# --------------------------------
# Chat Response Schema
# --------------------------------
class ChatResponse(BaseModel):

    response: str

    conversation_id: Optional[str] = None

    timestamp: Optional[datetime] = None


# --------------------------------
# Chat Message Schema
# --------------------------------
class ChatMessage(BaseModel):

    role: str

    content: str

    timestamp: Optional[datetime] = None


# --------------------------------
# Chat History Schema
# --------------------------------
class ChatHistory(BaseModel):

    user_id: str

    messages: List[ChatMessage]


# --------------------------------
# Streaming Response Schema
# --------------------------------
class StreamResponse(BaseModel):

    token: str