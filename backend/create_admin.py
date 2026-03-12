import sys
import os

# Add the current directory to sys.path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app.database.db import users_collection
from app.core.security import hash_password
from datetime import datetime

def create_admin_user():
    email = "admin@rag.com"
    password = "admin123"
    
    # Check if admin already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        # If exists but not admin, upgrade it
        if existing_user.get("role") != "admin":
            users_collection.update_one({"email": email}, {"$set": {"role": "admin"}})
            print(f"User {email} found. Upgraded to admin.")
        else:
            print(f"Admin user {email} already exists.")
        return

    admin_user = {
        "email": email,
        "password": hash_password(password),
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(admin_user)
    print(f"Admin user {email} created successfully!")
    print(f"Email: {email}")
    print(f"Password: {password}")

if __name__ == "__main__":
    create_admin_user()
