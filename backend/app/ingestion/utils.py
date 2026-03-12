import uuid
import hashlib
from datetime import datetime
from typing import Dict, Any


def create_metadata(
    filename: str,
    file_size: int = None,
    source: str = "admin_upload"
) -> Dict[str, Any]:
    """
    Create standardized metadata for ingested documents.
    """

    document_id = str(uuid.uuid4())

    file_extension = filename.split(".")[-1].lower()

    metadata = {

        "document_id": document_id,

        "filename": filename,

        "file_type": file_extension,

        "file_size": file_size,

        "source": source,

        "uploaded_at": datetime.utcnow().isoformat(),

        "checksum": hashlib.md5(filename.encode()).hexdigest()

    }

    return metadata