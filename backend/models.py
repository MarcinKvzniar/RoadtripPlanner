"""
original author: Dominik Cedro
created: 2024-11-27
license: none
description: Models for user objects in DB, they also perform DTO role
"""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from pydantic import BaseModel, EmailStr
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    refresh_token: str


class TokenData(BaseModel):
    email: EmailStr | None = None


class User(BaseModel):
    email: EmailStr
    full_name: str
    role: str


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "USER"
    hashed_password: str


class UserInDB(User):
    id: Optional[str] = Field(None, alias="_id")
    hashed_password: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


class UserResponse(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    full_name: str
    role: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str



class RefreshRequest(BaseModel):
    refresh_token: str


class TokenRequest(BaseModel):
    access_token: str
