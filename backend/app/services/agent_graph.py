import logging
from typing import List, Tuple

from app.services.embedding_service import create_embedding
from app.ingestion.vector_database import search_vector
from app.services.llm_service import generate_response


# --------------------------------
# Logger
# --------------------------------
logger = logging.getLogger(__name__)


# --------------------------------
# Router Agent
# --------------------------------
def router_agent(query: str) -> str:
    """
    Decide whether to use RAG retrieval
    or normal LLM chat.
    """

    query_lower = query.lower()

    rag_keywords = [
        "research",
        "study",
        "paper",
        "clinical",
        "trial",
        "treatment",
        "disease",
        "medical"
    ]

    for word in rag_keywords:

        if word in query_lower:

            logger.info("Router Agent → RAG")

            return "RAG"

    logger.info("Router Agent → LLM")

    return "LLM"


# --------------------------------
# Retriever Agent
# --------------------------------
def retriever_agent(query: str) -> Tuple[str, List]:
    """
    Retrieve relevant documents from vector database
    """

    try:

        vector = create_embedding(query)

        results = search_vector(vector)

        context_chunks = []

        for doc in results:

            payload = doc.payload

            text = payload.get("chunk_text") or payload.get("text")

            if text:
                context_chunks.append(text)

        context = "\n\n".join(context_chunks)

        return context, results

    except Exception as e:

        logger.error(f"Retriever error: {str(e)}")

        return "", []


# --------------------------------
# Grader Agent
# --------------------------------
def grader_agent(query: str, context: str) -> bool:
    """
    Check if retrieved context is useful
    """

    if not context:

        return False

    if len(context.strip()) < 50:

        return False

    return True


# --------------------------------
# Reflection Agent
# --------------------------------
def reflection_agent(query: str) -> str:
    """
    Rewrite query to improve retrieval
    """

    reflection_prompt = f"""
    Rewrite the user query to improve document search.

    Query:
    {query}

    Return a clearer and more detailed query.
    """

    try:

        new_query = generate_response(reflection_prompt)

        logger.info("Reflection agent rewrote query")

        return new_query

    except Exception:

        return query


# --------------------------------
# Answer Agent
# --------------------------------
def answer_agent(query: str, context: str) -> str:
    """
    Generate final answer using retrieved context
    """

    prompt = f"""
    You are a professional medical research assistant.

    Use the provided research context to answer the question.

    Context:
    {context}

    Question:
    {query}

    Provide a clear scientific explanation.
    """

    try:

        return generate_response(prompt)

    except Exception as e:

        logger.error(f"Answer agent error: {str(e)}")

        return "Error generating answer."


# --------------------------------
# MAIN AGENT GRAPH
# --------------------------------
def run_agent_graph(query: str) -> str:
    """
    Full agent workflow:

    Router → Retriever → Grader → Reflection → Answer
    """

    route = router_agent(query)

    # --------------------------------
    # Direct LLM Chat
    # --------------------------------
    if route == "LLM":

        return generate_response(query)

    # --------------------------------
    # RAG Retrieval
    # --------------------------------
    context, hits = retriever_agent(query)

    grade = grader_agent(query, context)

    # If context is poor → reflection
    if not grade:

        logger.info("Context weak → Reflection agent triggered")

        improved_query = reflection_agent(query)

        context, hits = retriever_agent(improved_query)

        if not context:

            return "No relevant research information found in the database."

    # Generate final answer
    return answer_agent(query, context)