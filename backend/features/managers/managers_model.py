from datetime import datetime
from core.security import Security

class Manager:

    ROLES = ["admin", "secretaire", "responsable"]

    def __init__(
        self,
        email: str,
        password: str,
        name: str,
        role: str = "secretaire",
    ):
        self.email = email.strip().lower()
        self.name = name.strip()
        self.role = role if role in self.ROLES else "secretaire"
        self.password = Security.hash_password(password)
        self.created_at = datetime.now()

    def to_dict(self) -> dict:
        return {
            "email": self.email,
            "password": self.password,
            "name": self.name,
            "role": self.role,
            "created_at": self.created_at,
        }

    @staticmethod
    def serialize(doc: dict) -> dict | None:
        if doc is None:
            return None
        return {
            "id": str(doc["_id"]),
            "email": doc.get("email", ""),
            "name": doc.get("name", ""),
            "role": doc.get("role", ""),
            "created_at": doc.get("created_at", datetime.utcnow()).isoformat(),
        }