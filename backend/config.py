import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/sae_jpo")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
    MANAGER_EMAIL = os.getenv("MANAGER_EMAIL", "admin@iut-montreuil.fr")
    MANAGER_PASSWORD = os.getenv("MANAGER_PASSWORD", "admin123")
    DEBUG = os.getenv("DEBUG", "True") == "True"