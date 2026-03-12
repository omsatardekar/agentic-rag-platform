from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# --------------------------------
# Signup Schema
# --------------------------------
class SignupSchema(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        description="User password"
    )

    role: str = Field(
        default="user",
        description="Role of the user (user/admin)"
    )


# --------------------------------
# Login Schema
# --------------------------------
class LoginSchema(BaseModel):

    email: EmailStr

    password: str


# --------------------------------
# Token Response Schema
# --------------------------------
class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"


# --------------------------------
# User Response Schema
# --------------------------------
class UserResponse(BaseModel):

    id: Optional[str]

    email: EmailStr

    role: str


# --------------------------------
# Auth Response Schema
# --------------------------------
class AuthResponse(BaseModel):

    message: str

    user: Optional[UserResponse] = None

    token: Optional[str] = None


# --------------------------------
# Google Login Schema
# --------------------------------
class GoogleLoginSchema(BaseModel):

    token: str