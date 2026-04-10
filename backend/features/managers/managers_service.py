from bson import ObjectId
from bson.errors import InvalidId
from features.managers.managers_model import Manager
from core.security import Security


class ManagerService:

    def __init__(self, db):
        self.col = db["managers"]

    def find_by_email(self, email: str) -> dict | None:
        return self.col.find_one({"email": email.strip().lower()})

    def get_all(self) -> list:
        docs = self.col.find({}, {"password": 0})
        return [Manager.serialize(d) for d in docs]

    def create(self, data: dict) -> tuple:
        email = data.get("email", "").strip().lower()

        if self.col.find_one({"email": email}):
            return {"error": "Email déjà utilisé"}, 409

        manager = Manager(
            email=email,
            password=data.get("password", ""),
            name=data.get("name", ""),
            role=data.get("role", "secretaire"),
        )
        result = self.col.insert_one(manager.to_dict())
        doc = self.col.find_one({"_id": result.inserted_id})
        return Manager.serialize(doc), 201

    def update(self, manager_id: str, data: dict) -> dict | None:
        try:
            allowed = {k: v for k, v in data.items() if k in ["name", "role"]}
            if not allowed:
                return None
            self.col.update_one({"_id": ObjectId(manager_id)}, {"$set": allowed})
            doc = self.col.find_one({"_id": ObjectId(manager_id)})
            return Manager.serialize(doc)
        except InvalidId:
            return None

    def update_password(self, email: str, new_password: str) -> dict | None:
        hashed = Security.hash_password(new_password)
        result = self.col.update_one(
            {"email": email.strip().lower()},
            {"$set": {"password": hashed}}
        )
        if result.matched_count == 0:
            return None
        return {"message": "Mot de passe modifié avec succès"}

    def delete(self, manager_id: str) -> bool:
        try:
            result = self.col.delete_one({"_id": ObjectId(manager_id)})
            return result.deleted_count == 1
        except InvalidId:
            return False
