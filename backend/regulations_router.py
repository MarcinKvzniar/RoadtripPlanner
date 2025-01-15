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

# route plans

@regulations_router.post("/create_route_plan", response_model=RoutePlan)
async def create_route_plan(route_plan: RoutePlan, authorization: str = Header(...)):
    """
    Create a new route plan for a specific user.

    Args:
        route_plan (RoutePlan): The route plan data.
        authorization (str): Bearer token from authorization header.

    Returns:
        RoutePlan: The inserted route plan document.

    Raises:
        HTTPException 401: If the user is not authenticated.
        HTTPException 500: If the insertion fails.
    """
    token = authorization.split(" ")[1]
    user_id = extract_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token or user not authenticated")

    route_plan_data = route_plan.dict()
    route_plan_data["creator_id"] = user_id
    route_plan_data["date_created"] = datetime.utcnow()

    result = collection_route_plans.insert_one(route_plan_data)
    if result.inserted_id:
        return RoutePlan(**route_plan_data)
    else:
        raise HTTPException(status_code=500, detail="Failed to create route plan")


@regulations_router.get("/get_my_route_plans", response_model=List[RoutePlan])
async def get_my_route_plans(authorization: str = Header(...)):
    """
    Retrieve all route plans for the authenticated user.

    Args:
        authorization (str): Bearer token from authorization header.

    Returns:
        List[RoutePlan]: A list of route plans created by the user.

    Raises:
        HTTPException 401: If the user is not authenticated.
    """
    token = authorization.split(" ")[1]
    user_id = extract_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token or user not authenticated")

    route_plans = list(collection_route_plans.find({"creator_id": user_id}))
    return [RoutePlan(**route_plan) for route_plan in route_plans]