import logging
import time
from typing import List

import voyageai
from app.core.config import VOYAGE_API_KEY


# -----------------------------
# Logger
# -----------------------------
logger = logging.getLogger(__name__)


# -----------------------------
# Initialize Voyage Client
# -----------------------------
vo = voyageai.Client(api_key=VOYAGE_API_KEY)


# Default embedding model
DEFAULT_MODEL = "voyage-lite-02-instruct"


# --------------------------------
# Create Single Query Embedding
# --------------------------------
def create_embedding(text: str, model: str = DEFAULT_MODEL) -> List[float]:
    """
    Generate embedding for a single query.
    Used in RAG retrieval.
    """

    try:

        response = vo.embed(

            texts=[text],

            model=model,

            input_type="query"

        )

        return response.embeddings[0]

    except Exception as e:

        logger.error(f"Embedding creation failed: {str(e)}")

        return []


# --------------------------------
# Create Document Embeddings (FREE-TIER OPTIMIZED)
# --------------------------------
def create_document_embeddings(
    documents: List[str],
    model: str = DEFAULT_MODEL
) -> List[List[float]]:
    """
    Voyage AI Free Tier: 3 RPM / 10K TPM.
    We batch into small chunks (8) and wait 25s between calls to strictly respect limits.
    """
    if not documents:
        return []

    all_embeddings = []
    batch_size = 8  # Safe size for ~10K TPM limit
    
    logger.info(f"Starting batched embedding for {len(documents)} chunks...")

    try:
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            
            logger.info(f"Processing batch {i//batch_size + 1}...")
            
            # API Call
            response = vo.embed(
                texts=batch,
                model=model,
                input_type="document"
            )
            all_embeddings.extend(response.embeddings)
            
            # Rate Limit Protection (Wait if there are more batches)
            if i + batch_size < len(documents):
                logger.info(f"Batch {i//batch_size + 1} complete. Throttling for 25s to respect 3 RPM limit...")
                time.sleep(25)  # Pause to stay under 3 requests/minute

        return all_embeddings

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Throttled document embedding failed: {error_msg}")
        if "rate limit" in error_msg.lower() or "billing" in error_msg.lower():
            raise Exception("AI Rate Limit Reached: Please wait 1 minute before uploading more files.")
        raise Exception(f"Voyage AI Error: {error_msg}")