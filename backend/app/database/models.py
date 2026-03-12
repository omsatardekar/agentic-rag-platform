from datetime import datetime
from typing import Dict, Any


# --------------------------------
# User Model Formatter
# --------------------------------
def user_model(user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB user document to API response
    """

    return {

        "id": str(user.get("_id")),

        "email": user.get("email"),

        "role": user.get("role", "user"),

        "created_at": user.get("created_at")

    }


# --------------------------------
# Chat Message Model
# --------------------------------
def chat_model(chat: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB chat document to API response
    """

    return {

        "id": str(chat.get("_id")),

        "user_id": chat.get("user_id"),

        "message": chat.get("message"),

        "response": chat.get("response"),

        "conversation_id": chat.get("conversation_id"),

        "timestamp": chat.get("timestamp")

    }


# --------------------------------
# Chat History List
# --------------------------------
def chat_list_model(chats):

    """
    Convert list of MongoDB chat documents
    """

    return [chat_model(chat) for chat in chats]