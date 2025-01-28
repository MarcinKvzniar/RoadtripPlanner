"""
original author: Dominik Cedro
created: 2024-11-27
license: none
description: Main script
"""

# from dotenv import load_dotenv
from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from backend.routers.user_router import user_router
from backend.routers.regulations_router import regulations_router
from backend.routers.destinations_routes_router import destinations_routes_router
load_dotenv()
app = FastAPI(root_path="/api/v1")

# Include routers
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(regulations_router, prefix="/regulations", tags=["regulations"])
app.include_router(destinations_routes_router, prefix="/route_plans", tags=["route_plans"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def healthcheck():
    """
        identification/ healthcheck endpoint
    """
    return {"RoadTripPlan": "ONLINE"}
