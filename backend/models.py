"""
original author: Dominik Cedro
created: 2024-11-27
license: none
description: Models for user objects in DB, they also perform DTO role
"""
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field, field_validator, EmailStr

class DestinationModel(BaseModel):
    name: str
    lat: float
    lon: float
    address: str
    country: str
    visited: bool

    @field_validator('name')
    def name_must_be_unique(cls, v, values, **kwargs):
        if not v:
            raise ValueError('Name must not be empty')
        return v

    @field_validator('lat', 'lon')
    def lat_lon_must_be_non_negative(cls, v, field):
        if v < 0:
            raise ValueError(f'Lat/Long must be non-negative')
        return v

    @field_validator('address')
    def address_must_not_be_none(cls, v):
        if not v:
            raise ValueError('Address must not be None')
        return v


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
    destinations: list[DestinationModel] = []



class UserInDB(User):
    id: Optional[str] = Field(None, alias="_id")
    hashed_password: str
    destinations: list[DestinationModel] = []

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
    destinations: list[DestinationModel] = []

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


