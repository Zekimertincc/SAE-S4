import jwt
import datetime
from config import Config
from core.security import Security
from features.managers.managers_service import ManagerService


class AuthService:
    def __init__(self, db):
        self.manager_service = ManagerService(db)

    @staticmethod
    def generate_token(email: str) -> str:
        payload = {
            "sub": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8),
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def decode_token(token: str) -> dict | None:
        try:
            return jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    @staticmethod
    def get_email_from_token(token: str) -> str | None:
        payload = AuthService.decode_token(token)
        if payload:
            return payload.get("sub")
        return None

    def login(self, email: str, password: str) -> tuple:
        manager = self.manager_service.find_by_email(email)
        if not manager:
            return {"error": "Identifiants invalides"}, 401

        if not Security.check_password(password, manager["password"]):
            return {"error": "Identifiants invalides"}, 401

        token = self.generate_token(email)
        return {
            "token": token,
            "email": email,
            "name": manager.get("name", ""),
            "role": manager.get("role", "")
        }, 200

    def get_current_user(self, token: str) -> dict | None:
        email = self.get_email_from_token(token)
        if not email:
            return None
        manager = self.manager_service.find_by_email(email)
        if not manager:
            return None
        from features.managers.managers_model import Manager
        return Manager.serialize(manager)

    def is_admin(self, token: str) -> bool:
        email = self.get_email_from_token(token)
        if not email:
            return False
        manager = self.manager_service.find_by_email(email)
        if not manager:
            return False
        return manager.get("role") == "admin"