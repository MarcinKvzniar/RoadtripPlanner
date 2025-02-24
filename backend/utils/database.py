import os
from pymongo import MongoClient

# DB setup
# uri = os.getenv("MONGO_URI")
uri = "mongodb+srv://domino_user:domino_user@road.idtag.mongodb.net/?retryWrites=true&w=majority&appName=ROAD"

client = MongoClient(uri)
db = client.road_project
collection_users = db["users"]
collection_counters = db["counters"]
collection_road_regulations = db['regulations']
collection_route_plans = db['route_plans']