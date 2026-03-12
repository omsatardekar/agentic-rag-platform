import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app.core.config import MONGO_URI


logger = logging.getLogger(__name__)


# --------------------------------
# Database Name
# --------------------------------
DATABASE_NAME = "rag_ai_platform"


# --------------------------------
# MongoDB Client
# --------------------------------
try:

    client = MongoClient(MONGO_URI)

    # Test connection
    client.admin.command("ping")

    logger.info("MongoDB connection successful")

except ConnectionFailure as e:

    logger.error(f"MongoDB connection failed: {e}")

    raise


# --------------------------------
# Database
# --------------------------------
db = client[DATABASE_NAME]


# --------------------------------
# Collections
# --------------------------------
users_collection = db["users"]

chat_collection = db["chat_history"]

documents_collection = db["documents"]


# --------------------------------
# Indexes (Performance)
# --------------------------------
def create_indexes():
    """
    Create indexes for faster queries
    """

    try:

        users_collection.create_index("email", unique=True)

        chat_collection.create_index("user_id")

        chat_collection.create_index("timestamp")

        logger.info("MongoDB indexes created")

    except Exception as e:

        logger.error(f"Index creation failed: {e}")


# Run index creation
create_indexes()