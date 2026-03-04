from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

client = None
db = None


def init_db(app):
    global client, db
    mongo_uri = app.config.get("MONGO_URI", "mongodb://localhost:27017/sae_jpo")

    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        db = client.get_database()
        app.db = db
        print(f"Connecté à MongoDB : {mongo_uri}")
    except ConnectionFailure as e:
        print(f"Impossible de se connecter à MongoDB : {e}")
        raise


def close_db():
    global client
    if client:
        client.close()
        print("Connexion MongoDB fermée.")
