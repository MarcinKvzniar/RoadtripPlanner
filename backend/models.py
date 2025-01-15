"""
original author: Dominik Cedro
created: 2024-11-27
license: none
description: Models represent documents in MongoDB
"""

from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional
from bson import ObjectId

class BaseDestinationModel(BaseModel):
    """
    base model for destinations and routes
    """
    id: Optional[str] = Field(None, alias="_id")
    lat: float
    lon: float
    address: str
    country: str
    type: str

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

    @field_validator('type')
    def type_must_be_valid(cls, v):
        if v not in ["visited", "route"]:
            raise ValueError('Type must be either "visited" or "route"')
        return v

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

class DestinationModel(BaseDestinationModel):
    """destinations - places marked as visited or not"""
    visited: bool

class RouteModel(BaseDestinationModel):
    """ route objects, they will store roadtrips as lists of route objects"""
    pass

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


