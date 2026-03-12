import uuid
import logging
from typing import List, Dict, Any

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

from app.core.config import QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION
from app.services.embedding_service import create_embedding


logger = logging.getLogger(__name__)

COLLECTION_NAME = QDRANT_COLLECTION
VECTOR_SIZE = 1024


class VectorDatabase:

    # --------------------------------
    # Initialize Qdrant Client
    # --------------------------------
    def __init__(self):

        try:

            self.client = QdrantClient(
                url=QDRANT_URL,
                api_key=QDRANT_API_KEY
            )

            self.COLLECTION_NAME = COLLECTION_NAME
            logger.info("Connected to Qdrant")

            self._ensure_collection()

        except Exception as e:

            logger.error(f"Qdrant connection failed: {e}")
            raise


    # --------------------------------
    # Ensure Collection Exists
    # --------------------------------
    def _ensure_collection(self):

        try:

            collections = self.client.get_collections().collections

            collection_names = [c.name for c in collections]

            if COLLECTION_NAME not in collection_names:

                self.client.create_collection(

                    collection_name=COLLECTION_NAME,

                    vectors_config=VectorParams(
                        size=VECTOR_SIZE,
                        distance=Distance.COSINE
                    )
                )

                logger.info(f"Created collection: {COLLECTION_NAME}")

            else:

                logger.info(f"Collection already exists: {COLLECTION_NAME}")

        except Exception as e:

            logger.error(f"Collection initialization error: {e}")


    # --------------------------------
    # Line-Aware Text Chunking
    # --------------------------------
    def chunk_text(
        self,
        text: str,
        chunk_size: int = 800,
        overlap: int = 100
    ) -> List[str]:
        """
        Smart chunking: Splits text into chunks by respecting line boundaries.
        Prevents cutting words or lines in the middle.
        """
        if not text:
            return []

        # Split into lines
        lines = text.splitlines(keepends=True)
        chunks = []
        current_chunk = []
        current_size = 0

        for line in lines:
            line_len = len(line)
            
            # If a single line is bigger than chunk_size, we have to split it (rare for text)
            if line_len > chunk_size:
                # Flush current chunk first
                if current_chunk:
                    chunks.append("".join(current_chunk))
                    current_chunk = []
                    current_size = 0
                
                # Split the long line into pieces
                for i in range(0, line_len, chunk_size - overlap):
                    chunks.append(line[i : i + chunk_size])
                continue

            if current_size + line_len > chunk_size:
                # Flush
                chunk_str = "".join(current_chunk)
                chunks.append(chunk_str)
                
                # Handle overlap: take last few lines that fit in overlap
                overlap_content = []
                overlap_size = 0
                for old_line in reversed(current_chunk):
                    if overlap_size + len(old_line) <= overlap:
                        overlap_content.insert(0, old_line)
                        overlap_size += len(old_line)
                    else:
                        break
                
                current_chunk = overlap_content + [line]
                current_size = overlap_size + line_len
            else:
                current_chunk.append(line)
                current_size += line_len

        # Final flush
        if current_chunk:
            chunks.append("".join(current_chunk))

        logger.info(f"Created {len(chunks)} line-aware chunks")
        return chunks


    # --------------------------------
    # Store Document in Vector DB (BATCHED)
    # --------------------------------
    def ingest_document(
        self,
        text: str,
        metadata: Dict[str, Any]
    ):
        if not text or len(text.strip()) == 0:
            return 0, {"error": "Empty text provided"}

        try:
            # 1. Chunking
            chunks = self.chunk_text(text)
            
            # 2. PRO-FLOW: Batch create all embeddings in ONE call
            # This respects the 3 RPM limit much better than individual calls
            from app.services.embedding_service import create_document_embeddings
            
            try:
                all_embeddings = create_document_embeddings(chunks)
            except Exception as e:
                logger.error(f"Ingestion halted: Embedding failed -> {e}")
                return 0, {"error": str(e)}

            if not all_embeddings or len(all_embeddings) != len(chunks):
                return 0, {"error": "Failed to generate embeddings for all chunks"}

            # 3. Prepare Vector Points
            points: List[PointStruct] = []
            for idx, (chunk, embedding) in enumerate(zip(chunks, all_embeddings)):
                
                # Critical check: Don't upload if embedding is empty
                if not embedding or len(embedding) == 0:
                    continue

                payload = {
                    **metadata,
                    "chunk_index": idx,
                    "chunk_text": chunk,
                    "text_length": len(chunk)
                }

                points.append(
                    PointStruct(
                        id=str(uuid.uuid4()),
                        vector=embedding,
                        payload=payload
                    )
                )

            # 4. Upsert to Qdrant
            if points:
                self.client.upsert(
                    collection_name=COLLECTION_NAME,
                    points=points
                )
                logger.info(f"Inserted {len(points)} chunks into Qdrant")
                return len(points), {
                    "status": "success",
                    "chunks_uploaded": len(points)
                }
            
            return 0, {"error": "No valid vectors to upload"}

        except Exception as e:
            logger.error(f"Vector upload error: {e}")
            return 0, {"error": str(e)}


    # --------------------------------
    # Vector Search
    # --------------------------------
    def search_vector(
        self,
        vector: List[float],
        limit: int = 5,
        collection_name: str = COLLECTION_NAME
    ):

        try:

            results = self.client.query_points(

                collection_name=collection_name,

                query=vector,

                limit=limit,

                with_payload=True

            )

            logger.info(f"Retrieved {len(results.points)} documents")

            return results.points

        except Exception as e:

            logger.error(f"Vector search error: {e}")

            return []


    # --------------------------------
    # Delete Documents by Filename
    # --------------------------------
    def delete_document(self, filename: str):

        try:

            self.client.delete(

                collection_name=COLLECTION_NAME,

                filter={
                    "must": [
                        {
                            "key": "filename",
                            "match": {"value": filename}
                        }
                    ]
                }
            )

            logger.info(f"Deleted document: {filename}")

            return {"status": "deleted"}

        except Exception as e:

            logger.error(f"Delete error: {e}")

            return {"error": str(e)}


# --------------------------------
# Global Vector DB Instance
# --------------------------------
vector_db = VectorDatabase()


# --------------------------------
# Public Wrapper Functions
# (Needed by other modules)
# --------------------------------

def ingest_document(text: str, metadata: Dict[str, Any]):
    """
    Wrapper function used by document_processor
    """
    return vector_db.ingest_document(text, metadata)


def search_vector(vector: List[float], limit: int = 5, collection_name: str = COLLECTION_NAME):
    """
    Wrapper function used by rag_pipeline
    """
    return vector_db.search_vector(vector, limit, collection_name)


def delete_document(filename: str):
    """
    Wrapper function used by admin routes
    """
    return vector_db.delete_document(filename)