import os
import logging
import tempfile
from typing import Dict, Any

from fastapi import UploadFile

from app.ingestion.document_processor import process_file
from app.ingestion.vector_database import VectorDatabase
from app.ingestion.utils import create_metadata


# --------------------------------
# Logger
# --------------------------------
logger = logging.getLogger(__name__)


# --------------------------------
# Initialize Vector DB
# --------------------------------
vector_db = VectorDatabase()


# --------------------------------
# File Ingestion Service
# --------------------------------
async def ingest_file(file: UploadFile) -> Dict[str, Any]:
    """
    Main ingestion pipeline

    Upload → Extract Text → Chunk → Embed → Store in Vector DB
    """

    try:

        # --------------------------------
        # Save Uploaded File Temporarily
        # --------------------------------
        suffix = file.filename.split(".")[-1]

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as temp_file:

            contents = await file.read()

            temp_file.write(contents)

            temp_path = temp_file.name

        logger.info(f"Processing file: {file.filename}")

        # --------------------------------
        # Extract Text
        # --------------------------------
        text, filetype = process_file(temp_path, file.filename)

        # Remove temporary file
        os.remove(temp_path)

        if not text:

            return {

                "status": "error",

                "message": "No text extracted from file"

            }

        # --------------------------------
        # Create Metadata
        # --------------------------------
        metadata = create_metadata(file.filename)

        # --------------------------------
        # Store in Vector Database
        # --------------------------------
        chunks_uploaded, info = vector_db.ingest_document(

            text=text,

            metadata=metadata

        )

        logger.info(f"Chunks stored: {chunks_uploaded}")

        # --------------------------------
        # Return Response
        # --------------------------------
        return {

            "status": "success",

            "filename": file.filename,

            "filetype": filetype,

            "chunks_uploaded": chunks_uploaded

        }

    except Exception as e:

        logger.error(f"Ingestion failed: {str(e)}")

        return {

            "status": "error",

            "message": str(e)

        }