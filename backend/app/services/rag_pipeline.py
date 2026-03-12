import logging
import os
from typing import List, Dict, Any, Tuple
from tavily import TavilyClient
import voyageai

from app.core.config import (
    GROQ_API_KEY, VOYAGE_API_KEY, TAVILY_API_KEY, 
    QDRANT_COLLECTION, SEARCH_TOP_K
)
from app.services.llm_service import groq_client
from app.services.embedding_service import vo
from app.ingestion.vector_database import vector_db

logger = logging.getLogger(__name__)

# Initialize Tavily
tavily = TavilyClient(api_key=TAVILY_API_KEY)

# =====================================
# AGENT 1: ROUTER AGENT
# =====================================
def router_agent(user_query: str) -> str:
    """Classifies user intent for better routing"""
    router_prompt = f"""You are a Clinical Research Intent Classifier.

Classify STRICTLY:
- 'MEDICAL_RESEARCH': ONLY clinical trials, treatments, surgical outcomes, drug effects, disease mechanisms, medical studies.
- 'WEB_SEARCH': Epidemiology, stats, population data, current events, general health news, trends, 2026 medical updates.
- 'GENERAL_CHAT': Greetings, casual talk, non-medical questions.

EXAMPLES:
"Diabetes prevalence worldwide?" → WEB_SEARCH
"Laparoscopic vs open surgery outcomes?" → MEDICAL_RESEARCH
"Hi how are you?" → GENERAL_CHAT

User Query: {user_query}

Return ONLY the category name."""
    
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": router_prompt}]
    )
    return response.choices[0].message.content.strip()

# =====================================
# AGENT 2: RERANK DOCUMENTS
# =====================================
def rerank_documents(query: str, hits: List[Any]) -> Tuple[List[str], float, List[Dict]]:
    """Reranks retrieved documents tracking the rich objects"""
    # Safe fetch for text chunk whether it's stored as 'chunk_text' or 'text'
    docs = []
    source_objects = []
    
    for h in hits:
        text = h.payload.get('chunk_text') or h.payload.get('text', '')
        docs.append(text)
        source_objects.append({
            "title": h.payload.get("filename", "Medical Document"),
            "content": text,
            "url": h.payload.get("url")
        })
        
    if not docs:
        return [], 0.0, []
        
    try:
        response = vo.rerank(
            query=query,
            documents=docs,
            model="rerank-lite-1"
        )
        
        ranked = sorted(
            response.results,
            key=lambda x: x.relevance_score,
            reverse=True
        )
        
        top_score = ranked[0].relevance_score if ranked else 0
        top_docs = [docs[r.index] for r in ranked[:3]]
        top_sources = [source_objects[r.index] for r in ranked[:3]]
        
        return top_docs, top_score, top_sources
    except Exception as e:
        logger.error(f"Reranking error: {e}")
        return docs[:3], 0.1, source_objects[:3] # Fallback to first 3 if rerank fails

# =====================================
# AGENT 3: SYNTHESIS AGENT
# =====================================
def research_synthesis_agent(query: str, context: str, history: List[Dict[str, str]] = [], num_docs: int = 0, top_score: float = 0, source_type: str = "db") -> str:
    """Conversational synthesis logic based on evidence quality"""
    evidence_summary = f"{num_docs} docs, top score: {top_score:.2f}" if source_type == "db" else "Web sources"
    
    synthesis_prompt = f"""You are a Senior Medical Research Reviewer. 
Query: '{query}'

CONTEXT ({evidence_summary}): 
{context}

Respond ADAPTIVELY:
- STRONG evidence (3+ docs, high score): Full analysis (Synthesis → Conclusion).
- WEAK evidence (1-2 docs, low score): Brief summary + limitations.
- Stats/general questions: Direct answer + sources.
- Web sources: Concise summary of key facts.

Format naturally. OMIT empty/obvious sections:
- Skip "Contradictions" if none.
- Skip "Recommendations" unless actionable advice exists.
- Skip "Future Directions" unless gaps are obvious.
- No rigid meta-analysis headers for simple queries.

Be concise and helpful."""

    messages = [{"role": "system", "content": "You are a professional medical assistant with access to uploaded research context. Use recent conversation history if it relates."}]
    
    # Add history
    if history:
        for msg in history[-3:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
    
    messages.append({
        "role": "user", 
        "content": synthesis_prompt
    })
    
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages
    )
    return response.choices[0].message.content

# =====================================
# REFLECTIVE REWRITE
# =====================================
def reflective_rewrite(original_query: str, old_context: str) -> str:
    """Agentic step to fix failed search"""
    reflect_prompt = f"""The user asked: '{original_query}'
The previous search returned irrelevant context: '{old_context[:200]}...'

Analyze why this failed. Generate a NEW search query using synonyms or broader topics.
Return ONLY the new query."""
    
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": reflect_prompt}]
    )
    return response.choices[0].message.content

# =====================================
# MAIN PIPELINE
# =====================================
def process_query(query: str, history: List[Dict[str, str]] = []) -> Dict[str, Any]:
    """
    Agentic Medical RAG Pipeline strictly matching the prototype's logic paths
    """
    logger.info(f"RAG Pipeline started for: {query}")
    
    final_context = "NONE" 
    final_hits = []
    top_score = 0
    source_type = "none"
    agent_flow = ""

    # 1. Routing Decision
    route = router_agent(query)
    agent_flow += f"Router({route})"

    # 2. Retrieval Logic
    web_sources = []
    
    if route == "MEDICAL_RESEARCH":
        agent_flow += " -> Medical DB Search"
        try:
            query_vector = vo.embed([query], model="voyage-lite-02-instruct", input_type="query").embeddings[0]
            # Use same query as Streamlit code: vector_db wrapper uses query_points under the hood
            hits = vector_db.search_vector(query_vector, limit=SEARCH_TOP_K, collection_name=QDRANT_COLLECTION)
        except Exception as e:
            logger.error(f"Qdrant Error: {e}")
            hits = []

        if hits:
            ranked_docs, top_score, rich_sources = rerank_documents(query, hits)
            
            if top_score > 0.2:  # Much looser threshold from the backend script
                final_context = "\n\n".join(ranked_docs)
                final_hits = rich_sources
                source_type = "db"
                agent_flow += " -> Rerank(Score > 0.2)"
            else:
                agent_flow += " -> Weak Match(Score < 0.2) -> Web Fallback"
                try:
                    # Basic Web Fallback
                    web_results = tavily.search(query=query, search_depth="basic")
                    final_context = "\n\n".join([res['content'] for res in web_results.get('results', [])])
                    web_sources = [{"title": res['title'], "content": res['content'], "url": res['url']} for res in web_results.get('results', [])]
                    source_type = "web"
                except Exception as e:
                    logger.error(f"Tavily basic fallback failed: {e}")
                    final_context = "NONE"
        else:
            # Pure web fallback
            agent_flow += " -> No DB Hits -> Web Fallback"
            try:
                web_results = tavily.search(query=query, search_depth="basic")
                final_context = "\n\n".join([res['content'] for res in web_results.get('results', [])])
                web_sources = [{"title": res['title'], "content": res['content'], "url": res['url']} for res in web_results.get('results', [])]
                source_type = "web"
            except Exception as e:
                logger.error(f"Tavily basic fallback failed: {e}")
                final_context = "NONE"

    elif route == "WEB_SEARCH":
        agent_flow += " -> Advanced Web Search"
        try:
            web_results = tavily.search(query=query, search_depth="advanced")
            final_context = "\n\n".join([res['content'] for res in web_results.get('results', [])])
            web_sources = [{"title": res['title'], "content": res['content'], "url": res['url']} for res in web_results.get('results', [])]
            source_type = "web"
        except Exception as e:
            logger.error(f"Tavily advanced search failed: {e}")
            final_context = "NONE"

    else:
        # GENERAL CHAT
        final_context = "GENERAL_CHAT_MODE"
        agent_flow += " -> Conversational Engine"

    # --- FINAL SYNTHESIS ---
    if final_context == "GENERAL_CHAT_MODE":
        messages_chat = [
            {"role": "system", "content": "You are a friendly medical assistant. Provide a brief, helpful response."}
        ]
        if history:
            for m in history[-3:]: 
                messages_chat.append({"role": m.get("role", "user"), "content": m.get("content", "")})
        messages_chat.append({"role": "user", "content": query})

        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages_chat
        )
        answer = completion.choices[0].message.content
        return {"answer": answer, "sources": [], "agent_flow": agent_flow}

    elif final_context == "NONE" or not final_context.strip():
        answer = "My medical research database doesn't have sufficient evidence for this specific question."
    else:
        # Source synthesis
        agent_flow += " -> Synthesis"
        answer = research_synthesis_agent(
            query, 
            final_context, 
            history=history,
            num_docs=len(final_hits) if source_type == "db" else len(web_sources), 
            top_score=top_score, 
            source_type=source_type
        )

    return {
        "answer": answer,
        "sources": final_hits if source_type == "db" else web_sources,
        "agent_flow": agent_flow
    }

