"""
original author: Dominik Cedro
created: 2025-01-15
license: none
description: Contains endpoint declarations for destinations and routes
"""
from datetime import datetime
from typing import List
from fastapi import  Header, APIRouter
from bson import ObjectId
from fastapi import HTTPException
from user_router import extract_user_id_from_token, get_user_by_id
from models import UserResponse, DestinationModel, BaseDestinationModel, RouteModel, RoutePlan
from database import collection_users, collection_route_plans

destinations_routes_router = APIRouter()


@destinations_routes_router.post("/save_destination", response_model=UserResponse)
async def save_destination(destination: DestinationModel, authorization: str = Header(...)):
    """
        Save destination information to user's destinations field

        Args:
            destination (BaseDestinationModel): destination information
            authorization (str): Bearer token from authorization header

        Returns:
            user (UserResponse): updated user information

        Raises:
            HTTP Exception 401 if token is invalid or user not found.
            HTTP Exception 400 if destination name is not unique.
     """
    token = authorization.split(" ")[1]
    user_id = extract_user_id_from_token(token)
    user = get_user_by_id(collection_users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if isinstance(destination, DestinationModel):
        user.destinations.append(destination)
    elif isinstance(destination, RouteModel):
        user.destinations.append(destination)
    else:
        print(f'Doesnt work for some reason????')

    collection_users.update_one({"_id": ObjectId(user_id)}, {"$set": {"destinations": [dest.dict() for dest in user.destinations]}})

    return UserResponse(**user.dict())


@destinations_routes_router.get("/get_destinations", response_model=List[BaseDestinationModel])
async def retrieve_destination_multiple(authorization: str = Header(...)):
    """
    Get all destinations for the current user (JWT)
    """
    token = authorization.split(" ")[1]
    user_id = extract_user_id_from_token(token)
    user = get_user_by_id(collection_users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user.destinations


@destinations_routes_router.put("/update_destination", response_model=UserResponse)
async def update_destination(destination: BaseDestinationModel, authorization: str = Header(...)):
    """
        Update destination information in user's destinations field

        Args:
            destination (BaseDestinationModel): updated destination information
            authorization (str): Bearer token from authorization header

        Returns:
            user (UserResponse): updated user information

        Raises:
            HTTP Exception 401 if token is invalid or user not found.
            HTTP Exception 404 if destination not found.
     """
    token = authorization.split(" ")[1]
    user_id = extract_user_id_from_token(token)
    user = get_user_by_id(collection_users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    destination_id = ObjectId(destination.id)
    for i, dest in enumerate(user.destinations):
        if dest.id == str(destination_id):
            user.destinations[i] = destination
            break
    else:
        raise HTTPException(status_code=404, detail="Destination not found")

    collection_users.update_one({"_id": ObjectId(user_id)}, {"$set": {"destinations": [dest.dict() for dest in user.destinations]}})

    return UserResponse(**user.dict())


# route plans

@destinations_routes_router.post("/create_route_plan", response_model=RoutePlan)
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


@destinations_routes_router.get("/get_my_route_plans", response_model=List[RoutePlan])
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