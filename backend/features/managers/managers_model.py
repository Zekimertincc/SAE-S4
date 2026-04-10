from datetime import datetime
from core.security import Security


class Manager:

    def __init__(self, username: str, password: str, name: str):
        self.username = username.strip().lower()
        self.name = name.strip()
        self.password = Security.hash_password(password)
        self.created_at = datetime.now()

    def to_dict(self) -> dict:
        return {
            "username": self.username,
            "password": self.password,
            "name": self.name,
            "created_at": self.created_at,
        }

    @staticmethod
    def serialize(doc: dict) -> dict | None:
        if doc is None:
            return None
        return {
            "id": str(doc["_id"]),
            "username": doc.get("username", ""),
            "name": doc.get("name", ""),
            "created_at": doc.get("created_at", datetime.now()).isoformat(),
        }
