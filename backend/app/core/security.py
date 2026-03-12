from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS


# =====================================
# Password Hashing Setup
# =====================================

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


# =====================================
# Password Hashing
# =====================================

def hash_password(password: str) -> str:
    """
    Hash user password before storing in DB
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password during login
    """
    return pwd_context.verify(plain_password, hashed_password)


# =====================================
# JWT Token Creation
# =====================================

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate JWT access token
    """

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)

    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow()
    })

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return encoded_jwt


# =====================================
# Decode JWT Token
# =====================================

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode JWT token and return payload
    """

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        return payload

    except JWTError:

        return None