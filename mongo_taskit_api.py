<<<<<<< HEAD
from pymongo import MongoClient
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():           # connecting to database
    username = "backend"
    password = quote_plus(os.getenv("MONGO_PASSWORD"))
    host = "localhost"
    port = 27017
    auth_db = "admin"

    uri = f"mongodb://{username}:{password}@{host}:{port}/?authSource={auth_db}"
    client = MongoClient(uri)
    return client["taskit_app"]


def check_user(user, password):     # check if user and password are in base
    db = get_connection()
    users = db["users"]
    user = users.find_one({"email": user, "password": password})
    return bool(user) 
    
def save_user(user, password):      # saving new user or updating user's password
    db = get_connection()
    users = db["users"]
    users.find_one_and_replace({"email": user}, {"email": user, "password": password}, upsert=True)


def get_user_tasks(user):       # returns user's tasks from the base
    db = get_connection()
    tasks = db["tasks"]
    user = tasks.find_one({"email": user}) 
    if user and "tasks" in user:
        return user["tasks"]
    return []

def save_user_tasks(user, tasks):       # updating user's tasks
    db = get_connection()
    db["tasks"].find_one_and_replace({"email": user}, {"email": user, "tasks": tasks}, upsert=True)
=======
from pymongo import MongoClient
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():           # connecting to database
    username = "backend"
    password = quote_plus(os.getenv("MONGO_PASSWORD"))
    host = "localhost"
    port = 27017
    auth_db = "taskit_app"

    uri = f"mongodb://{username}:{password}@{host}:{port}/?authSource={auth_db}"
    client = MongoClient(uri)
    return client["taskit_app"]


def check_user(user, password):     # check if user and password are in base
    db = get_connection()
    users = db["users"]
    user = users.find_one({"email": user, "password": password})
    return bool(user) 
    
def save_user(user, password):      # saving new user or updating user's password
    db = get_connection()
    users = db["users"]
    users.find_one_and_replace({"email": user}, {"email": user, "password": password}, upsert=True)


def get_user_tasks(user):       # returns user's tasks from the base
    db = get_connection()
    tasks = db["tasks"]
    user = tasks.find_one({"email": user}) 
    if user and "tasks" in user:
        return user["tasks"]
    return []

def save_user_tasks(user, tasks):       # updating user's tasks
    db = get_connection()
    db["tasks"].find_one_and_replace({"email": user}, {"email": user, "tasks": tasks}, upsert=True)
>>>>>>> 560347149a73470c7a364277d95ca05008c5d080
