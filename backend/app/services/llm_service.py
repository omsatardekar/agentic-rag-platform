import logging
from typing import List, Dict, Optional

from groq import Groq
from app.core.config import GROQ_API_KEY


# -----------------------------
# Logger
# -----------------------------
logger = logging.getLogger(__name__)


# -----------------------------
# Initialize Groq Client
# -----------------------------
groq_client = Groq(api_key=GROQ_API_KEY)


# Default model
DEFAULT_MODEL = "llama-3.3-70b-versatile"


# -----------------------------
# Basic Response Generator
# -----------------------------
def generate_response(
    prompt: str,
    system_prompt: Optional[str] = None,
    temperature: float = 0.3,
    model: str = DEFAULT_MODEL
) -> str:
    """
    Generate a response from the LLM.
    """

    try:

        messages: List[Dict] = []

        # Add system message if provided
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })

        messages.append({
            "role": "user",
            "content": prompt
        })

        response = groq_client.chat.completions.create(

            model=model,

            messages=messages,

            temperature=temperature

        )

        return response.choices[0].message.content.strip()

    except Exception as e:

        logger.error(f"LLM generation error: {str(e)}")

        return "An error occurred while generating the AI response."


# -----------------------------
# Chat with History
# -----------------------------
def generate_chat_response(
    messages: List[Dict],
    temperature: float = 0.4,
    model: str = DEFAULT_MODEL
) -> str:
    """
    Generate response using full conversation history.
    Useful for ChatGPT-style conversations.
    """

    try:

        response = groq_client.chat.completions.create(

            model=model,

            messages=messages,

            temperature=temperature

        )

        return response.choices[0].message.content.strip()

    except Exception as e:

        logger.error(f"Chat generation error: {str(e)}")

        return "An error occurred while generating the AI response."


# -----------------------------
# Streaming Response (Optional)
# -----------------------------
def stream_response(
    messages: List[Dict],
    temperature: float = 0.4,
    model: str = DEFAULT_MODEL
):
    """
    Stream LLM response tokens (for real-time UI streaming)
    """

    try:

        stream = groq_client.chat.completions.create(

            model=model,

            messages=messages,

            temperature=temperature,

            stream=True

        )

        for chunk in stream:

            if chunk.choices[0].delta.content:

                yield chunk.choices[0].delta.content

    except Exception as e:

        logger.error(f"Streaming error: {str(e)}")

        yield "Error generating response."