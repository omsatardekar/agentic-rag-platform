from fastapi import APIRouter, HTTPException, status
from datetime import datetime

from app.schemas.auth_schema import SignupSchema, LoginSchema
from app.database.db import users_collection
from app.core.security import hash_password, verify_password, create_access_token
from app.database.models import user_model


router = APIRouter()


# =====================================
# SIGNUP
# =====================================
@router.post("/signup")
def signup(user: SignupSchema):

    # Check if user already exists
    user_exists = users_collection.find_one({"email": user.email})

    if user_exists:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="User already exists"
        )

    # Create new user
    new_user = {

        "email": user.email,

        "password": hash_password(user.password),

        "role": user.role,

        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(new_user)

    created_user = users_collection.find_one({"_id": result.inserted_id})

    return {

        "message": "Signup successful",

        "user": user_model(created_user)
    }


# =====================================
# LOGIN
# =====================================
@router.post("/login")
def login(user: LoginSchema):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Invalid credentials"
        )

    # Verify password
    if not verify_password(user.password, db_user["password"]):

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Invalid credentials"
        )

    # Generate JWT Token
    token = create_access_token({

        "user_id": str(db_user["_id"]),

        "role": db_user["role"]
    })

    return {

        "message": "Login successful",

        "access_token": token,

        "token_type": "bearer",

        "user": user_model(db_user)
    }


# =====================================
# GOOGLE LOGIN
# =====================================
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import GOOGLE_CLIENT_ID
from app.schemas.auth_schema import GoogleLoginSchema

@router.post("/google")
def google_login(data: GoogleLoginSchema):
    try:
        # Verify the ID token
        idinfo = id_token.verify_oauth2_token(data.token, requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Get user's Google info
        email = idinfo['email']

        # Check if user exists in DB
        db_user = users_collection.find_one({"email": email})

        if not db_user:
            # Create a new user for Google login
            new_user = {
                "email": email,
                "password": "", # No password for Google users
                "role": "user",
                "created_at": datetime.utcnow(),
                "auth_provider": "google"
            }
            result = users_collection.insert_one(new_user)
            db_user = users_collection.find_one({"_id": result.inserted_id})

        # Generate JWT Token for our app
        token = create_access_token({
            "user_id": str(db_user["_id"]),
            "role": db_user["role"]
        })

        return {
            "message": "Login successful",
            "access_token": token,
            "token_type": "bearer",
            "user": user_model(db_user)
        }

    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )