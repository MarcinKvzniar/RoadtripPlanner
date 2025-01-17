"""
original author: Dominik Cedro
created: 2025-01-15
license: none
description: Router for regulations module
"""

# from dotenv import load_dotenv
import os
from typing import Optional, List
from fastapi import Depends, FastAPI, Request, Header, APIRouter
from fastapi import Body, HTTPException, status
from datetime import datetime
from user_router import extract_user_id_from_token
from models import RoadRegulation, RoutePlan
from database import collection_route_plans, collection_users, collection_road_regulations
regulations_router = APIRouter()


@regulations_router.post("/add_road_regulation", response_model=RoadRegulation)
async def add_road_regulation(road_regulation: RoadRegulation):
    """
    Add a new road regulation document to the database.
    """
    existing_regulation = collection_road_regulations.find_one({"country_name": road_regulation.country_name})
    if existing_regulation:
        raise HTTPException(status_code=409, detail="Road regulation for this country already exists")

    result = collection_road_regulations.insert_one(road_regulation.dict())
    if result.inserted_id:
        return road_regulation
    else:
        raise HTTPException(status_code=500, detail="Failed to insert road regulation")


@regulations_router.get("/road_regulations", response_model=List[RoadRegulation])
async def get_all_road_regulations():
    """
    Retrieve all road regulations from the database.
    """
    regulations = list(collection_road_regulations.find({}))
    return [RoadRegulation(**regulation) for regulation in regulations]


@regulations_router.get("/road_regulations/{country_name}", response_model=RoadRegulation)
async def get_road_regulation_by_country(country_name: str):
    """
    Retrieve a specific road regulation based on the country name.
    """
    regulation = collection_road_regulations.find_one({"country_name": country_name})
    if not regulation:
        raise HTTPException(status_code=404, detail="Road regulation for this country not found")
    return RoadRegulation(**regulation)
