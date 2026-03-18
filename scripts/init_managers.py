from pymongo import MongoClient
from datetime import datetime
import bcrypt

client = MongoClient("mongodb://localhost:27017/sae_jpo")
db = client["sae_jpo"]
db["managers"].drop()
print("Collection managers vidée.")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


managers = [
    {
        "name": "Admin",
        "email": "admin@iut-montreuil.fr",
        "password": hash_password("admin123"),
        "role": "admin",
        "created_at": datetime.now(),
    },
    {
        "name": "Secrétariat Informatique",
        "email": "secretariat.info@iut-montreuil.fr",
        "password": hash_password("secret123"),
        "role": "secretaire",
        "created_at": datetime.now(),
    },
    {
        "name": "Secrétariat GEII",
        "email": "secretariat.geii@iut-montreuil.fr",
        "password": hash_password("secret123"),
        "role": "secretaire",
        "created_at": datetime.now(),
    },
    {
        "name": "Responsable Communication",
        "email": "communication@iut-montreuil.fr",
        "password": hash_password("commu123"),
        "role": "responsable",
        "created_at": datetime.now(),
    },
]

result = db["managers"].insert_many(managers)
print(f"{len(result.inserted_ids)} managers insérés dans sae_jpo.managers")
print("\nComptes créés :")
for m in managers:
    print(f"  - {m['email']} / mot de passe en clair dans ce script")