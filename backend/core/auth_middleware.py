import jwt
from functools import wraps
from flask import request, jsonify
from config import Config


class AuthMiddleware:
    @staticmethod
    def verify_token(token: str) -> dict | None:
        try:
            return jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token manquant"}), 401

        token = auth_header.split(" ")[1]
        payload = AuthMiddleware.verify_token(token)

        if payload is None:
            return jsonify({"error": "Token invalide ou expiré"}), 401

        return f(*args, **kwargs)
    return decorated
